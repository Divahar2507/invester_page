from fastapi import APIRouter, Depends, HTTPException, status, Request
from app.middleware.rate_limit import limiter
from app.dependencies import get_db, get_current_user
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.core import User, InvestorProfile, StartupProfile
from app.schemas import UserCreate, UserLogin, Token, UserResponse, ForgotPasswordRequest, ResetPasswordRequest, GoogleLoginRequest
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

    # Automatically create profile based on role with extended data
    if user.role == "investor":
        investor_profile = InvestorProfile(
            user_id=new_user.id,
            firm_name=user.company_name if user.company_name else "Independent Investor", 
            contact_name=user.full_name,
            preferred_stage="Seed",
            # Extended fields
            linkedin_url=user.linkedin_url,
            website_url=user.website_url,
            # Map referrer/other fields if model supports them, for now we log or store basic info
        )
        db.add(investor_profile)
    elif user.role == "startup":
        # Determine company name from brand_name or company_name
        c_name = user.brand_name if user.brand_name else (user.company_name if user.company_name else user.full_name + "'s Startup")
        
        startup_profile = StartupProfile(
            user_id=new_user.id,
            company_name=c_name,
            founder_name=user.full_name,
            mobile=user.mobile_number,
            industry=user.startup_sector if user.startup_sector else "Technology",
            funding_stage=user.startup_stage if user.startup_stage else "Pre-Seed",
            
            # Extended fields
            description=user.description,
            city=user.city,
            website_url=user.website_url,
            founder_linkedin=user.linkedin_url,
            # valuation=user.valuation, # Model doesn't have valuation on profile yet, it's on pitch usually
        )
        db.add(startup_profile)
        db.commit() # Commit to get ID
        db.refresh(startup_profile)

        # Create Default Pitch so they appear in BrowsePitches
        from app.models.core import Pitch
        default_pitch = Pitch(
            startup_id=startup_profile.id,
            title=f"{c_name} - {user.startup_stage or 'Seed'} Round",
            description=user.description or "We are building the next big thing.",
            industry=user.startup_sector or "Technology",
            funding_stage=user.startup_stage or "Pre-Seed",
            amount_seeking=int(user.capital_to_raise) * 100000 if user.capital_to_raise and user.capital_to_raise.isdigit() else 100000,
            status="active",
            location=user.city or "Remote",
            raising_amount=f"${user.capital_to_raise}L" if user.capital_to_raise else "$100k",
            equity_percentage="10%",
            valuation=f"${user.valuation}L" if user.valuation else "$1M",
            pitch_file_url="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
        )
        db.add(default_pitch)
    
    db.commit()
    
    return new_user

@router.post("/login", response_model=Token)
@limiter.limit("5/minute")
def login(request: Request, user_credentials: UserLogin, db: Session = Depends(get_db)):
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

@router.post("/google-login", response_model=Token)
@limiter.limit("5/minute")
def google_login(request: Request, login_request: GoogleLoginRequest, db: Session = Depends(get_db)):
    try:
        from google.oauth2 import id_token
        from google.auth.transport import requests
        
        GOOGLE_CLIENT_ID = "835532330363-8lohj8uk8bvqd37nnlpsfl4rslul8nff.apps.googleusercontent.com"
        
        # Verify the token
        # Add a clock skew tolerance for container time drift
        id_info = id_token.verify_oauth2_token(
            login_request.token, 
            requests.Request(), 
            GOOGLE_CLIENT_ID,
            clock_skew_in_seconds=60
        )
        
        email = id_info['email']
        name = id_info.get('name', '')
        
        # Check if user exists
        user = db.query(User).filter(User.email == email).first()
        
        if not user:
            # Register new user
            hashed_password = get_password_hash("google_auth_user") # Dummy password for OAuth users
            user = User(
                email=email,
                password_hash=hashed_password,
                role=login_request.role
            )
            db.add(user)
            db.commit()
            db.refresh(user)
            
            # Create Profile
            if user.role == "investor":
                investor_profile = InvestorProfile(
                    user_id=user.id,
                    firm_name=name if name else "My Firm", 
                    contact_name=name,
                    preferred_stage="Seed"
                )
                db.add(investor_profile)
            elif user.role == "startup":
                startup_profile = StartupProfile(
                    user_id=user.id,
                    company_name=name if name else "My Startup",
                    founder_name=name,
                    industry="Technology",
                    funding_stage="Pre-Seed"
                )
                db.add(startup_profile)
            
            db.commit()
            
        # Create Access Token
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user.email, "role": user.role}, expires_delta=access_token_expires
        )
        return {"access_token": access_token, "token_type": "bearer"}

    except ValueError as e:
        # Invalid token
        print(f"Google Token Verification Failed: {str(e)}")
        raise HTTPException(status_code=401, detail=f"Invalid Google Token: {str(e)}")
    except Exception as e:
        print(f"Google Login Error: {e}")
        raise HTTPException(status_code=500, detail="Google Login Failed")

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

@router.post("/forgot-password")
async def forgot_password(request: ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == request.email).first()
    if not user:
        # Don't reveal if user exists or not, but for dev we might want to know
        return {"message": "If this email is registered, you will receive a reset link."}
    
    # Generate a simple token (mock logic). In prod, use a dedicated reset token table or signed JWT with short expiry
    reset_token = create_access_token(
        data={"sub": user.email, "type": "reset"}, 
        expires_delta=timedelta(minutes=15)
    )
    
    # MOCK SEND EMAIL
    reset_link = f"http://localhost/#/reset-password?token={reset_token}"
    
    from app.utils.email import send_password_reset_email
    await send_password_reset_email(user.email, reset_link)
    
    return {"message": "Password reset link sent to email.", "dev_link": reset_link} 

@router.post("/reset-password")
def reset_password(request: ResetPasswordRequest, db: Session = Depends(get_db)):
    # Verify token
    try:
        from jose import jwt, JWTError
        from app.utils.security import SECRET_KEY, ALGORITHM
        
        payload = jwt.decode(request.token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        token_type = payload.get("type")
        
        if email is None or token_type != "reset":
            raise HTTPException(status_code=400, detail="Invalid token")
            
    except JWTError:
        raise HTTPException(status_code=400, detail="Invalid or expired token")
        
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    # Update password
    hashed_password = get_password_hash(request.new_password)
    user.password_hash = hashed_password
    db.commit()
    
    return {"message": "Password updated successfully"}

@router.get("/linkedin/login")
def linkedin_login():
    """
    Redirects the user to LinkedIn's OAuth authorization page.
    """
    import os
    import urllib.parse
    
    # These should ideally come from env, but I'll use placeholders that the user MUST replace
    LINKEDIN_CLIENT_ID = os.getenv("LINKEDIN_CLIENT_ID", "866r5xfodldh1y") 
    LINKEDIN_REDIRECT_URI = os.getenv("LINKEDIN_REDIRECT_URI", "http://localhost:8000/auth/linkedin/callback")
    
    # LinkedIn OAuth 2.0 params
    params = {
        "response_type": "code",
        "client_id": "866r5xfodldh1y",
        "redirect_uri": "http://localhost:8000/auth/linkedin/callback",
        "state": "random_state_string", # Should be random ideally
        "scope": "openid profile email", # Scopes for "Sign In with LinkedIn"
    }
    
    url = f"https://www.linkedin.com/oauth/v2/authorization?{urllib.parse.urlencode(params)}"
    
    from fastapi.responses import RedirectResponse
    return RedirectResponse(url)

@router.get("/linkedin/callback")
def linkedin_callback(code: str, db: Session = Depends(get_db)):
    """
    Handles the callback from LinkedIn, exchanges code for token, gets user info, and logs them in.
    """
    import os
    import requests
    from fastapi.responses import RedirectResponse
    
    LINKEDIN_CLIENT_ID = os.getenv("LINKEDIN_CLIENT_ID")
    LINKEDIN_CLIENT_SECRET = os.getenv("LINKEDIN_CLIENT_SECRET")
    LINKEDIN_REDIRECT_URI = os.getenv("LINKEDIN_REDIRECT_URI")
    
    # 1. Exchange auth code for access token
    token_url = "https://www.linkedin.com/oauth/v2/accessToken"
    payload = {
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": LINKEDIN_REDIRECT_URI,
        "client_id": LINKEDIN_CLIENT_ID,
        "client_secret": LINKEDIN_CLIENT_SECRET,
    }
    
    token_res = requests.post(token_url, data=payload)
    if not token_res.ok:
        # In a real app, redirect to frontend with error param
        raise HTTPException(status_code=400, detail=f"LinkedIn Token Error: {token_res.text}")
        
    access_token = token_res.json().get("access_token")
    
    # 2. Get User Info (OpenID method)
    user_info_url = "https://api.linkedin.com/v2/userinfo"
    headers = {"Authorization": f"Bearer {access_token}"}
    
    user_res = requests.get(user_info_url, headers=headers)
    if not user_res.ok:
        raise HTTPException(status_code=400, detail=f"LinkedIn Profile Error: {user_res.text}")
        
    user_data = user_res.json()
    
    # user_data typically contains: sub, name, given_name, family_name, picture, email, etc.
    email = user_data.get("email")
    name = user_data.get("name")
    picture = user_data.get("picture")
    
    if not email:
         raise HTTPException(status_code=400, detail="LinkedIn did not return an email address")

    # 3. Find or Create User
    user = db.query(User).filter(User.email == email).first()
    
    if not user:
        # Auto-register
        hashed_password = get_password_hash("linkedin_auth_user") # Dummy password
        user = User(
            email=email,
            password_hash=hashed_password,
            role="startup" # Default to startup for now, or could ask user later
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        
        # Create Startup Profile
        startup_profile = StartupProfile(
            user_id=user.id,
            company_name=name + "'s Project", # Placeholder
            founder_name=name,
            profile_photo=picture,
            industry="Technology",
            funding_stage="Pre-Seed"
        )
        db.add(startup_profile)
        db.commit()
    
    # 4. Create JWT for our app
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    jwt_token = create_access_token(
        data={"sub": user.email, "role": user.role}, expires_delta=access_token_expires
    )
    
    # 5. Redirect to Frontend with Token
    # Assuming frontend runs on localhost:3001 (based on docker-compose) or 3000
    # The existing TokenCapture in frontend looks for ?token=...
    
    # NOTE: You must allow this origin in CORS or use a proper callback page
    frontend_url = "http://localhost:3001" # Startup frontend port
    
    return RedirectResponse(f"{frontend_url}?token={jwt_token}")
