from fastapi import APIRouter, Depends, HTTPException, Form, UploadFile, File
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from typing import Optional
from app.dependencies import get_db, get_current_user
from app.models.core import User, Message, Connection, StartupProfile, InvestorProfile
from app.schemas import MessageCreate, MessageResponse, UserResponse

router = APIRouter(prefix="/messages", tags=["Messaging"])

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
            
            # Use isoformat for datetime to ensure JSON serialization
            conversations[partner_id] = {
                "id": partner_id,
                "name": name,
                "role": partner.role,
                "extra": extra,
                "profile_photo": (partner.startup_profile.profile_photo if partner.startup_profile else None) if partner.role == "startup" else (partner.investor_profile.profile_photo if partner.investor_profile else None),
                "last_message": msg.content,
                "last_time": msg.timestamp, # Pydantic will handle this if response_model set, but dict might be tricky.
                "unread": 0
            }
    
    return list(conversations.values())

@router.get("/history", response_model=list[MessageResponse])
def get_message_history(
    partner_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # If partner_id is provided, get thread with that partner
    # If not, get ALL history (legacy support for frontend)
    
    query = db.query(Message).filter(
        or_(
            Message.sender_id == current_user.id,
            Message.receiver_id == current_user.id
        )
    )
    
    if partner_id:
        query = query.filter(
            or_(
                Message.sender_id == partner_id,
                Message.receiver_id == partner_id
            )
        )
        
    messages = query.order_by(Message.timestamp.asc()).all()
    
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
        
        # Determine profile photo
        if u.role == "startup" and u.startup_profile:
            info["profile_photo"] = u.startup_profile.profile_photo
        elif u.role == "investor" and u.investor_profile:
            info["profile_photo"] = u.investor_profile.profile_photo
        else:
            info["profile_photo"] = None
            
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
            attachment_type=msg.attachment_type,
            sender_photo=s_info.get("profile_photo"),
            receiver_photo=r_info.get("profile_photo")
        ))
    
    return results

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
            u.profile_image = u.startup_profile.profile_photo
        elif u.investor_profile:
            u.name = u.investor_profile.firm_name
            u.profile_image = u.investor_profile.profile_photo
        else:
            u.name = u.email.split('@')[0]
            u.profile_image = None
            
    return users

@router.post("/send", response_model=MessageResponse)
def send_message(
    receiver_id: int = Form(...),
    content: str = Form(...),
    file: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    receiver = db.query(User).filter(User.id == receiver_id).first()
    if not receiver:
        raise HTTPException(status_code=404, detail="Receiver not found")

    attachment_url = None
    attachment_type = None

    if file:
        from app.utils.storage import upload_file as store_file
        attachment_url = store_file(file)
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
    db.flush()
    
    # Create Notification
    from app.models.core import Notification
    sender_name = "Someone"
    if current_user.role == "startup" and current_user.startup_profile:
        sender_name = current_user.startup_profile.company_name
    elif current_user.role == "investor" and current_user.investor_profile:
        sender_name = current_user.investor_profile.firm_name
        
    notification_desc = content
    if not notification_desc and attachment_url:
        notification_desc = "Sent an attachment"
        
    new_notif = Notification(
        user_id=receiver_id,
        title=f"New message from {sender_name}",
        description=notification_desc[:50] + "..." if len(notification_desc) > 50 else notification_desc,
        type="message",
        related_id=new_message.id
    )
    db.add(new_notif)

    db.commit()
    db.refresh(new_message)
    
    # Construct response with details
    s_photo = None
    if current_user.role == "startup" and current_user.startup_profile:
        s_photo = current_user.startup_profile.profile_photo
    elif current_user.role == "investor" and current_user.investor_profile:
        s_photo = current_user.investor_profile.profile_photo

    r_photo = None
    if receiver.role == "startup" and receiver.startup_profile:
        r_photo = receiver.startup_profile.profile_photo
    elif receiver.role == "investor" and receiver.investor_profile:
        r_photo = receiver.investor_profile.profile_photo

    return MessageResponse(
        id=new_message.id,
        sender_id=new_message.sender_id,
        receiver_id=new_message.receiver_id,
        content=new_message.content,
        timestamp=new_message.timestamp,
        sender_name=sender_name,  # Already computed above
        receiver_name=receiver.email.split('@')[0], # Fallback or fetch properly if needed, but sender is main
        sender_role=current_user.role,
        receiver_role=receiver.role,
        attachment_url=new_message.attachment_url,
        attachment_type=new_message.attachment_type,
        sender_photo=s_photo,
        receiver_photo=r_photo
    )

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
            and_(Message.sender_id == current_user.id, Message.receiver_id == user_id),
            and_(Message.sender_id == user_id, Message.receiver_id == current_user.id)
        )
    ).order_by(Message.timestamp.asc()).all()
    
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
        
        # Determine profile photo
        if u.role == "startup" and u.startup_profile:
            info["profile_photo"] = u.startup_profile.profile_photo
        elif u.role == "investor" and u.investor_profile:
            info["profile_photo"] = u.investor_profile.profile_photo
        else:
            info["profile_photo"] = None
            
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
            attachment_type=msg.attachment_type,
            sender_photo=s_info.get("profile_photo"),
            receiver_photo=r_info.get("profile_photo")
        ))
    
    return results


# Removed old get_conversations from bottom since we moved it up
# Removed old get_messages (user_id) to avoid conflict and ambiguity, or keep as deprecated

@router.delete("/conversations/{partner_id}")
def delete_conversation(
    partner_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Retrieve messages between current user and partner
    messages = db.query(Message).filter(
        or_(
            and_(Message.sender_id == current_user.id, Message.receiver_id == partner_id),
            and_(Message.sender_id == partner_id, Message.receiver_id == current_user.id)
        )
    ).all()
    
    if not messages:
        raise HTTPException(status_code=404, detail="Conversation not found")
        
    # Delete them
    for msg in messages:
        db.delete(msg)
    
    db.commit()
    
    return {"message": "Conversation deleted successfully"}
