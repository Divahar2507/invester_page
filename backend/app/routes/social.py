from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.core import User, Pitch, PitchComment, Meeting, StartupProfile, InvestorProfile
from app.utils.security import get_current_user
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

router = APIRouter(prefix="/social", tags=["Social Features"])

# --- Schemas ---

class CommentCreate(BaseModel):
    comment: str
    rating: Optional[int] = None
    pitch_id: int

class CommentResponse(BaseModel):
    id: int
    user_name: str
    user_role: str
    comment: str
    rating: Optional[int]
    created_at: datetime
    
    class Config:
        from_attributes = True

class MeetingCreate(BaseModel):
    startup_id: int
    pitch_id: Optional[int] = None
    title: str
    description: Optional[str] = None
    meeting_time: datetime
    duration_minutes: int = 30
    meet_link: Optional[str] = None

class MeetingResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    meeting_time: datetime
    duration_minutes: int
    meet_link: Optional[str]
    status: str
    investor_name: str
    startup_name: str
    
    class Config:
        from_attributes = True

# --- Endpoints ---

@router.post("/comments", response_model=CommentResponse)
async def create_comment(
    comment: CommentCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Add a comment to a pitch"""
    
    # Verify pitch exists
    pitch = db.query(Pitch).filter(Pitch.id == comment.pitch_id).first()
    if not pitch:
        raise HTTPException(status_code=404, detail="Pitch not found")
    
    new_comment = PitchComment(
        pitch_id=comment.pitch_id,
        user_id=current_user.id,
        comment=comment.comment,
        rating=comment.rating
    )
    
    db.add(new_comment)
    db.commit()
    db.refresh(new_comment)
    
    # Get user details for response
    user_name = "User"
    if current_user.role == "startup" and current_user.startup_profile:
        user_name = current_user.startup_profile.founder_name or "Founder"
    elif current_user.role == "investor" and current_user.investor_profile:
        user_name = current_user.investor_profile.contact_name or "Investor"
        
    return CommentResponse(
        id=new_comment.id,
        user_name=user_name,
        user_role=current_user.role,
        comment=new_comment.comment,
        rating=new_comment.rating,
        created_at=new_comment.created_at
    )

@router.get("/comments/{pitch_id}", response_model=List[CommentResponse])
async def get_pitch_comments(
    pitch_id: int,
    db: Session = Depends(get_db)
):
    """Get all comments for a pitch"""
    comments = db.query(PitchComment).filter(PitchComment.pitch_id == pitch_id).order_by(PitchComment.created_at.desc()).all()
    
    response = []
    for c in comments:
        user_name = "User"
        user = db.query(User).filter(User.id == c.user_id).first()
        if user:
            if user.role == "startup" and user.startup_profile:
                user_name = user.startup_profile.founder_name or "Founder"
            elif user.role == "investor" and user.investor_profile:
                user_name = user.investor_profile.contact_name or "Investor"
        
        response.append(CommentResponse(
            id=c.id,
            user_name=user_name,
            user_role=user.role if user else "unknown",
            comment=c.comment,
            rating=c.rating,
            created_at=c.created_at
        ))
        
    return response

@router.post("/meetings/schedule", response_model=MeetingResponse)
async def schedule_meeting(
    meeting: MeetingCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Schedule a meeting between investor and startup"""
    
    if current_user.role != "investor":
        raise HTTPException(status_code=403, detail="Only investors can schedule meetings")
        
    # Verify startup user exists
    startup_user = db.query(User).filter(User.id == meeting.startup_id).first()
    if not startup_user or startup_user.role != "startup":
        raise HTTPException(status_code=404, detail="Startup user not found")
        
    # Create meeting
    new_meeting = Meeting(
        investor_id=current_user.id,
        startup_id=meeting.startup_id,
        pitch_id=meeting.pitch_id,
        title=meeting.title,
        description=meeting.description,
        meeting_time=meeting.meeting_time,
        duration_minutes=meeting.duration_minutes,
        meet_link=meeting.meet_link or "https://meet.google.com/new", # Default to new meet link if not provided
        status="scheduled"
    )
    
    db.add(new_meeting)
    db.commit()
    db.refresh(new_meeting)
    
    # Get names for response
    investor_name = current_user.investor_profile.contact_name if current_user.investor_profile else "Investor"
    startup_name = startup_user.startup_profile.company_name if startup_user.startup_profile else "Startup"
    
    # TODO: Integrate Google Calendar API here to actually create the event
    
    return MeetingResponse(
        id=new_meeting.id,
        title=new_meeting.title,
        description=new_meeting.description,
        meeting_time=new_meeting.meeting_time,
        duration_minutes=new_meeting.duration_minutes,
        meet_link=new_meeting.meet_link,
        status=new_meeting.status,
        investor_name=investor_name,
        startup_name=startup_name
    )

@router.get("/meetings", response_model=List[MeetingResponse])
async def get_my_meetings(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all meetings for current user"""
    
    if current_user.role == "investor":
        meetings = db.query(Meeting).filter(Meeting.investor_id == current_user.id).order_by(Meeting.meeting_time.asc()).all()
    else:
        meetings = db.query(Meeting).filter(Meeting.startup_id == current_user.id).order_by(Meeting.meeting_time.asc()).all()
        
    response = []
    for m in meetings:
        investor = db.query(User).filter(User.id == m.investor_id).first()
        startup = db.query(User).filter(User.id == m.startup_id).first()
        
        investor_name = "Investor"
        if investor and investor.investor_profile:
            investor_name = investor.investor_profile.contact_name or "Investor"
            
        startup_name = "Startup"
        if startup and startup.startup_profile:
            startup_name = startup.startup_profile.company_name or "Startup"
            
        response.append(MeetingResponse(
            id=m.id,
            title=m.title,
            description=m.description,
            meeting_time=m.meeting_time,
            duration_minutes=m.duration_minutes,
            meet_link=m.meet_link,
            status=m.status,
            investor_name=investor_name,
            startup_name=startup_name
        ))
        
    return response
