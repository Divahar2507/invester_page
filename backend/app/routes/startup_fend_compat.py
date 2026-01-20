from fastapi import APIRouter, Depends, HTTPException, Body
from app.dependencies import get_current_user, get_db
from app.models.core import User, StartupProfile, Pitch
from sqlalchemy.orm import Session
from app.schemas import UserResponse, StartupCreate, StartupResponse

router = APIRouter(tags=["StartupFrontendCompat"])

@router.get("/me", response_model=UserResponse)
def get_me_compat(current_user: User = Depends(get_current_user)):
    # Enrich like auth.py does
    if current_user.role == "startup" and current_user.startup_profile:
        current_user.name = current_user.startup_profile.company_name
    elif current_user.role == "investor" and current_user.investor_profile:
        current_user.name = current_user.investor_profile.firm_name
    else:
        current_user.name = current_user.email.split('@')[0]
    return current_user

@router.patch("/me")
def update_me_compat(
    user_update: dict = Body(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Basic User Update
    if "full_name" in user_update:
        # Assuming full_name maps to profile names in our logic
        pass 
    return current_user

@router.get("/me/profile", response_model=StartupResponse)
def get_profile_compat(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != "startup":
         raise HTTPException(status_code=403, detail="Not a startup")
    profile = db.query(StartupProfile).filter(StartupProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile

@router.patch("/me/profile", response_model=StartupResponse)
def update_profile_compat(
    profile_update: dict = Body(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "startup":
        raise HTTPException(status_code=403, detail="Not a startup")
        
    profile = db.query(StartupProfile).filter(StartupProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    # Update Profile fields
    for key, value in profile_update.items():
        if hasattr(profile, key):
            setattr(profile, key, value)
            
    # Also sync to Pitch if key fields change
    pitch = db.query(Pitch).filter(Pitch.startup_id == profile.id).first()
    if pitch:
        if "company_name" in profile_update:
            pitch.title = f"{profile_update['company_name']} - Seed Round"
        if "description" in profile_update:
            pitch.description = profile_update['description']
        if "industry" in profile_update:
            pitch.industry = profile_update['industry']
            
    db.commit()
    db.refresh(profile)
    return profile

@router.post("/company/share")
def share_profile_dummy():
    return {"status": "shared"}

@router.post("/team/invite")
def invite_team_dummy():
    return {"status": "invited"}
