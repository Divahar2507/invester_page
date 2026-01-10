from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.dependencies import get_db, get_current_user
from app.models.core import User, InvestorProfile
from app.schemas import InvestorCreate, InvestorResponse

router = APIRouter(prefix="/investors", tags=["Investor"])

@router.post("/profile", response_model=InvestorResponse)
def create_investor_profile(
    profile: InvestorCreate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "investor":
        raise HTTPException(status_code=403, detail="Only investors can create an investor profile")
    
    existing_profile = db.query(InvestorProfile).filter(InvestorProfile.user_id == current_user.id).first()
    if existing_profile:
        raise HTTPException(status_code=400, detail="Profile already exists")
    
    new_profile = InvestorProfile(**profile.model_dump(), user_id=current_user.id)
    db.add(new_profile)
    db.commit()
    db.refresh(new_profile)
    return new_profile

@router.get("/me", response_model=InvestorResponse)
def get_my_investor_profile(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != "investor":
         raise HTTPException(status_code=403, detail="Not an investor")
    
    profile = db.query(InvestorProfile).filter(InvestorProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile

@router.get("/", response_model=List[InvestorResponse])
def get_all_investors(db: Session = Depends(get_db)):
    return db.query(InvestorProfile).all()

@router.get("/{id}", response_model=InvestorResponse)
def get_investor(id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    profile = db.query(InvestorProfile).filter(InvestorProfile.id == id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile

@router.put("/profile", response_model=InvestorResponse)
def update_investor_profile(
    profile_update: InvestorCreate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "investor":
        raise HTTPException(status_code=403, detail="Only investors can update their profile")
        
    profile = db.query(InvestorProfile).filter(InvestorProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    # Update fields
    update_data = profile_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(profile, key, value)
        
    db.commit()
    db.refresh(profile)
    return profile
