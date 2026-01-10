from fastapi import APIRouter, Depends, HTTPException, status
from app.dependencies import get_db, get_current_user
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.core import User, InvestorProfile, StartupProfile
from app.schemas import UserCreate, UserLogin, Token, UserResponse
from app.utils.security import get_password_hash, verify_password, create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES
from datetime import timedelta

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/register", response_model=UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user.password)
    new_user = User(
        email=user.email,
        password_hash=hashed_password,
        role=user.role
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Automatically create empty profile based on role
    if user.role == "investor":
        investor_profile = InvestorProfile(
            user_id=new_user.id,
            firm_name="My Firm", # Default placeholder
            preferred_stage="Seed"
        )
        db.add(investor_profile)
    elif user.role == "startup":
        startup_profile = StartupProfile(
            user_id=new_user.id,
            company_name="My Startup", # Default placeholder
            industry="Technology",
            funding_stage="Pre-Seed"
        )
        db.add(startup_profile)
    
    db.commit()
    
    return new_user

@router.post("/login", response_model=Token)
def login(user_credentials: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_credentials.email).first()
    if not user or not verify_password(user_credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email, "role": user.role}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserResponse)
def get_current_user_info(current_user: User = Depends(get_current_user)):
    # Enrich user object with profile name
    if current_user.role == "startup" and current_user.startup_profile:
        current_user.name = current_user.startup_profile.company_name
    elif current_user.role == "investor" and current_user.investor_profile:
        current_user.name = current_user.investor_profile.firm_name
    else:
        current_user.name = current_user.email.split('@')[0] # Fallback
        
    # Placeholder for profile image logic (could be added to profiles later)
    # current_user.profile_image = ...
    
    return current_user
