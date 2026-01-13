from fastapi import APIRouter, Depends, HTTPException, Form, UploadFile, File
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from typing import Optional
from app.dependencies import get_db, get_current_user
from app.models.core import User, Message, Connection, StartupProfile, InvestorProfile
from app.schemas import MessageCreate, MessageResponse, UserResponse

router = APIRouter(prefix="/messages", tags=["Messaging"])

@router.get("/users/search", response_model=list[UserResponse])
def search_users(
    q: str, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Search in User name, Startup Company name, or Investor Firm name
    query = f"%{q}%"
    users = db.query(User).outerjoin(StartupProfile).outerjoin(InvestorProfile).filter(
        or_(
            User.email.ilike(query),
            StartupProfile.company_name.ilike(query),
            InvestorProfile.firm_name.ilike(query)
        )
    ).limit(10).all()
    
    # Populate extra fields simply for the frontend to use
    for u in users:
        if u.startup_profile:
            u.name = u.startup_profile.company_name
        elif u.investor_profile:
            u.name = u.investor_profile.firm_name
        else:
            u.name = u.email.split('@')[0]
            
    return users

@router.post("/send", response_model=MessageResponse)
def send_message(
    message: MessageCreate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    receiver = db.query(User).filter(User.id == message.receiver_id).first()
    if not receiver:
        raise HTTPException(status_code=404, detail="Receiver not found")
        

    # Strict Connection Check
    # connection = db.query(Connection).filter(
    #     or_(
    #         and_(Connection.requester_id == current_user.id, Connection.receiver_id == receiver.id),
    #         and_(Connection.requester_id == receiver.id, Connection.receiver_id == current_user.id)
    #     )
    # ).first()

    # if not connection or connection.status != "accepted":
    #     raise HTTPException(status_code=403, detail="You must be connected to send messages")

    # Handle File Upload
    attachment_url = None
    attachment_type = None

    if file:
        import os
        import shutil
        from datetime import datetime

        upload_dir = "uploads/messages"
        os.makedirs(upload_dir, exist_ok=True)

        safe_filename = "".join([c for c in file.filename if c.isalpha() or c.isdigit() or c in ('.', '_', '-')]).strip()
        filename = f"msg_{current_user.id}_{int(datetime.now().timestamp())}_{safe_filename}"
        filepath = os.path.join(upload_dir, filename)

        with open(filepath, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        attachment_url = f"/uploads/messages/{filename}"
        attachment_type = file.content_type

    # 1. Save to DB
    new_message = Message(
        sender_id=current_user.id,
        receiver_id=receiver_id,
        content=content,
        attachment_url=attachment_url,
        attachment_type=attachment_type
    )
    db.add(new_message)
    db.commit()
    db.refresh(new_message)

    # 2. Return Response directly (no websocket manager here in this snippet, but logic would be similar)
    return new_message

@router.get("/{user_id}", response_model=list[MessageResponse])
def get_messages(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Security check: Users can only view their own messages
    if current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to view these messages")

    messages = db.query(Message).filter(
        or_(
            Message.sender_id == user_id,
            Message.receiver_id == user_id
        )
    ).order_by(Message.timestamp.desc()).all()
    
    # Helper to get user info
    def get_info(u):
        info = {"name": "Unknown", "role": "user", "extra": ""}
        if not u: return info
        
        info["role"] = u.role
        if u.role == "startup" and u.startup_profile:
            info["name"] = u.startup_profile.company_name
            info["extra"] = u.startup_profile.industry
        elif u.role == "investor" and u.investor_profile:
            info["name"] = u.investor_profile.firm_name
            info["extra"] = "Investor"
        else:
            info["name"] = u.email.split('@')[0]
        return info

    results = []
    for msg in messages:
        s_info = get_info(msg.sender)
        r_info = get_info(msg.receiver)
        
        results.append(MessageResponse(
            id=msg.id,
            sender_id=msg.sender_id,
            receiver_id=msg.receiver_id,
            content=msg.content,
            timestamp=msg.timestamp,
            sender_name=s_info["name"],
            receiver_name=r_info["name"],
            sender_role=s_info["role"],
            receiver_role=r_info["role"],
            sender_extra=s_info["extra"],
            receiver_extra=r_info["extra"],
            attachment_url=msg.attachment_url,
            attachment_type=msg.attachment_type
        ))
    
    return results


@router.get("/conversations", response_model=list[dict])
def get_conversations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Get all messages for current user
    messages = db.query(Message).filter(
        or_(
            Message.sender_id == current_user.id,
            Message.receiver_id == current_user.id
        )
    ).order_by(Message.timestamp.desc()).all()

    # Group by partner
    conversations = {}
    for msg in messages:
        is_sender = msg.sender_id == current_user.id
        partner_id = msg.receiver_id if is_sender else msg.sender_id
        
        if partner_id not in conversations:
            partner = msg.receiver if is_sender else msg.sender
            
            # Get clean name/role
            name = partner.email.split('@')[0]
            extra = ""
            if partner.role == "startup" and partner.startup_profile:
                name = partner.startup_profile.company_name
                extra = partner.startup_profile.industry
            elif partner.role == "investor" and partner.investor_profile:
                name = partner.investor_profile.firm_name
                extra = "Investor"
                
            conversations[partner_id] = {
                "id": partner_id,
                "name": name,
                "role": partner.role,
                "extra": extra,
                "last_message": msg.content,
                "last_time": msg.timestamp,
                "unread": 0 # TODO: Implement read status
            }
    
    return list(conversations.values())
