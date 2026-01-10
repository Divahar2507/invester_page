from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from app.dependencies import get_db, get_current_user
from app.models.core import User, Message, Connection
from app.schemas import MessageCreate, MessageResponse

router = APIRouter(prefix="/messages", tags=["Messaging"])

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
    connection = db.query(Connection).filter(
        or_(
            and_(Connection.requester_id == current_user.id, Connection.receiver_id == receiver.id),
            and_(Connection.requester_id == receiver.id, Connection.receiver_id == current_user.id)
        )
    ).first()
    
    if not connection or connection.status != "accepted":
        raise HTTPException(status_code=403, detail="You must be connected to send messages")
    
    new_message = Message(
        sender_id=current_user.id,
        receiver_id=message.receiver_id,
        content=message.content
    )
    db.add(new_message)
    db.commit()
    db.refresh(new_message)
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
    
    # Helper to get name
    def get_name(u):
        if not u: return "Unknown"
        if u.role == "startup" and u.startup_profile:
            return u.startup_profile.company_name
        elif u.role == "investor" and u.investor_profile:
            return u.investor_profile.firm_name
        return u.email

    results = []
    for msg in messages:
        results.append(MessageResponse(
            id=msg.id,
            sender_id=msg.sender_id,
            receiver_id=msg.receiver_id,
            content=msg.content,
            timestamp=msg.timestamp,
            sender_name=get_name(msg.sender),
            receiver_name=get_name(msg.receiver)
        ))
        
    return results
