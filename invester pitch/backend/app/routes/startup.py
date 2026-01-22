from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.dependencies import get_db, get_current_user
from app.models.core import User, StartupProfile
from app.schemas import StartupCreate, StartupResponse

router = APIRouter(prefix="/startup", tags=["Startup"])

@router.post("/profile", response_model=StartupResponse)
def create_startup_profile(
    profile: StartupCreate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "startup":
        raise HTTPException(status_code=403, detail="Only startups can create a startup profile")
    
    existing_profile = db.query(StartupProfile).filter(StartupProfile.user_id == current_user.id).first()
    if existing_profile:
        raise HTTPException(status_code=400, detail="Profile already exists")
    
    new_profile = StartupProfile(**profile.model_dump(), user_id=current_user.id)
    db.add(new_profile)
    db.commit()
    db.refresh(new_profile)
    return new_profile

@router.get("/profile/me", response_model=StartupResponse)
def get_my_startup_profile(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != "startup":
         raise HTTPException(status_code=403, detail="Not a startup")
    
    profile = db.query(StartupProfile).filter(StartupProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile

@router.get("/profile/{id}", response_model=StartupResponse)
def get_startup_profile(id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    profile = db.query(StartupProfile).filter(StartupProfile.id == id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile

@router.put("/profile", response_model=StartupResponse)
def update_startup_profile(
    profile_update: StartupCreate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "startup":
        raise HTTPException(status_code=403, detail="Only startups can update their profile")
        
    profile = db.query(StartupProfile).filter(StartupProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    # Update fields
    update_data = profile_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(profile, key, value)
        
    db.commit()
    db.refresh(profile)
    return profile
