from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.dependencies import get_db, get_current_user
from app.models.core import User, Notification
from app.schemas import NotificationResponse, NotificationCreate

router = APIRouter(prefix="/notifications", tags=["Notifications"])

@router.get("/", response_model=list[NotificationResponse])
def get_notifications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get all notifications for the current user, sorted by newest first.
    """
    notifications = db.query(Notification).filter(
        Notification.user_id == current_user.id
    ).order_by(Notification.created_at.desc()).all()
    
    return notifications

@router.put("/{notification_id}/read")
def mark_notification_as_read(
    notification_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Mark a notification as read.
    """
    notification = db.query(Notification).filter(
        Notification.id == notification_id,
        Notification.user_id == current_user.id
    ).first()
    
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
        
    notification.is_read = True
    db.commit()
    
    return {"message": "Notification marked as read"}

@router.post("/", response_model=NotificationResponse)
def create_notification(
    notification: NotificationCreate,
    db: Session = Depends(get_db),
    # current_user: User = Depends(get_current_user) # Optionally restrict who can create
):
    """
    Create a notification manually (mostly for testing or specific flows).
    In a real app, this might be internal-only.
    """
    # For now, we'll assume the user creating it is the recipient for testing, 
    # OR we need to specify a user_id in the create schema. 
    # But let's check the schema. NotificationCreate doesn't have user_id.
    # So we'll assign it to the current user (self-notification) or we need to update schema.
    # Let's update schema or just use this for self-notification for now.
    pass 
    # Actually, let's skip the POST endpoint for now unless needed, 
    # as notifications are usually system generated.
    # But wait, I might need to seed some notifications.
    # Let's add a debug endpoint to create dummy notifications.

@router.post("/debug/create", response_model=NotificationResponse)
def debug_create_notification(
    notification: NotificationCreate,
    user_id: int, # Pass user_id explicitly for debug
    db: Session = Depends(get_db)
):
    new_notif = Notification(
        user_id=user_id,
        title=notification.title,
        description=notification.description,
        type=notification.type,
        related_id=notification.related_id
    )
    db.add(new_notif)
    db.commit()
    db.refresh(new_notif)
    return new_notif
