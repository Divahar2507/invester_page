from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from ..database import get_db
from ..models import User, Influencer
from ..schemas import UserCreate, UserLogin, UserResponse
from ..dependencies import get_password_hash, verify_password

router = APIRouter(prefix="/api/auth", tags=["auth"])

VALID_ROLES = ['admin', 'user', 'influencer']

@router.post("/register", status_code=201)
async def register(user_in: UserCreate, db: AsyncSession = Depends(get_db)):
    role = user_in.role.lower()
    if role not in VALID_ROLES:
        raise HTTPException(status_code=400, detail="Invalid role")
    
    email = user_in.email.lower().strip()
    
    # Check existing
    result = await db.execute(select(User).where(User.email == email, User.role == role))
    if result.scalars().first():
        raise HTTPException(status_code=409, detail="User with this email and role already exists")

    # Create User
    hashed_pw = get_password_hash(user_in.password)
    new_user = User(email=email, password_hash=hashed_pw, role=role)
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)

    # If influencer, create profile
    if role == 'influencer':
        platforms_str = " & ".join(user_in.platforms) if user_in.platforms else ""
        
        new_influencer = Influencer(
            name=user_in.fullName or email,
            email=email,
            platform=platforms_str,
            followers=user_in.followers,
            category=user_in.category or "General",
            handle=user_in.handle,
            charge_per_post=user_in.chargePerPost,
            image_url=user_in.imageUrl,
            mobile_number=user_in.mobileNumber,
            verified=False
        )
        db.add(new_influencer)
        await db.commit()

    return {"user": new_user}

@router.post("/login")
async def login(user_in: UserLogin, db: AsyncSession = Depends(get_db)):
    role = user_in.role.lower()
    if role not in VALID_ROLES:
         raise HTTPException(status_code=400, detail="Invalid role")
         
    email = user_in.email.lower().strip()
    
    result = await db.execute(select(User).where(User.email == email, User.role == role))
    user = result.scalars().first()
    
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
        
    if not verify_password(user_in.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
        
    return {"user": user}
