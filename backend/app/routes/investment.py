from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models.core import Investment, User, InvestorProfile
from app.schemas import InvestmentCreate, InvestmentResponse
from app.dependencies import get_current_user, get_db
from typing import List

router = APIRouter(prefix="/investments", tags=["investments"])

@router.post("/", response_model=InvestmentResponse)
def create_investment(
    investment: InvestmentCreate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "investor":
        raise HTTPException(status_code=403, detail="Only investors can log investments")
    
    if not current_user.investor_profile:
        raise HTTPException(status_code=400, detail="Investor profile not found")

    # Prevent duplicate entries for the same startup
    existing = db.query(Investment).filter(
        Investment.investor_id == current_user.investor_profile.id,
        Investment.startup_name == investment.startup_name
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="This startup is already in your portfolio")

    db_investment = Investment(
        **investment.model_dump(),
        investor_id=current_user.investor_profile.id
    )
    db.add(db_investment)
    db.commit()
    db.refresh(db_investment)
    return db_investment

@router.get("/", response_model=List[InvestmentResponse])
def get_investments(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "investor":
         raise HTTPException(status_code=403, detail="Only investors can view portfolio")
         
    if not current_user.investor_profile:
        return []

    return db.query(Investment).filter(
        Investment.investor_id == current_user.investor_profile.id
    ).all()
