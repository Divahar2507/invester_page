from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
import random

app = FastAPI(title="Ecosystem Central AI", description="Centralized Engine for Startup Ecosystem")

# --- CONFIGURATION ---
SECRET_KEY = "supersecretkey" # In production, use environment variable
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- SECURITY & AUTH ---
pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

class User(BaseModel):
    username: str
    email: Optional[str] = None
    full_name: Optional[str] = None
    disabled: Optional[bool] = None

class UserInDB(User):
    hashed_password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class UserCreate(BaseModel):
    username: str
    password: str
    email: Optional[str] = None
    full_name: Optional[str] = None

# Mock User DB
fake_users_db = {}

# Pre-populate with admin user (hashed password for 'admin' is pre-calculated or calculated on startup)
# For simplicity in this script, we'll calculate it if we were running it, but since we can't easily run hasing at top level without circular deps potentially, 
# we will just add a startup event or lazily.
# Actually, let's just use a startup event.

@app.on_event("startup")
async def startup_event():
    # Create default admin user
    hashed = get_password_hash("admin")
    fake_users_db["admin"] = {
        "username": "admin",
        "hashed_password": hashed,
        "email": "admin@ipa.gov",
        "full_name": "Super Admin",
        "disabled": False
    } 

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def get_user(db, username: str):
    if username in db:
        user_dict = db[username]
        return UserInDB(**user_dict)
    return None

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception
    user = get_user(fake_users_db, username=token_data.username)
    if user is None:
        raise credentials_exception
    return user

async def get_current_active_user(current_user: User = Depends(get_current_user)):
    if current_user.disabled:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

# --- MOCK DATA ---
STARTUPS_DB = [
    {"id": "TN-4920", "name": "TechNova Solutions", "sector": "Fintech", "stage": "Seed", "requestedUpgrade": "Series A", "submissionDate": "Oct 24, 2023", "status": "Pending"},
    {"id": "AG-8211", "name": "AgriGrow AI", "sector": "AgriTech", "stage": "MVP", "requestedUpgrade": "Pre-Seed", "submissionDate": "Oct 23, 2023", "status": "Pending"},
    {"id": "QH-0034", "name": "Quantum Health", "sector": "HealthTech", "stage": "Series A", "requestedUpgrade": "Series B", "submissionDate": "Oct 22, 2023", "status": "Approved"},
    {"id": "SE-5510", "name": "Solaris Edge", "sector": "CleanTech", "stage": "Growth", "requestedUpgrade": "Late Stage", "submissionDate": "Oct 21, 2023", "status": "Rejected"},
    {"id": "BL-7782", "name": "BioLife Sciences", "sector": "BioTech", "stage": "Series B", "requestedUpgrade": "Series C", "submissionDate": "Oct 20, 2023", "status": "Pending"},
    {"id": "ED-1029", "name": "EduVantage", "sector": "EdTech", "stage": "Seed", "requestedUpgrade": "Series A", "submissionDate": "Oct 19, 2023", "status": "Approved"},
    {"id": "RE-3341", "name": "RetailAI", "sector": "RetailTech", "stage": "Pre-Seed", "requestedUpgrade": "Seed", "submissionDate": "Oct 18, 2023", "status": "Pending"},
]

INVESTORS_DB = [
    {"id": "1", "name": "Alex Rivers", "organization": "Global Ventures", "capacity": "$5M - $10M", "focus": "Fintech", "region": "North America", "lastActivity": "2 days ago", "initials": "AR", "color": "bg-blue-600"},
    {"id": "2", "name": "Elena Chen", "organization": "Horizon Capital", "capacity": "$10M - $50M", "focus": "AI/ML", "region": "Asia Pacific", "lastActivity": "Just now", "initials": "EC", "color": "bg-purple-600"},
    {"id": "3", "name": "Marcus Thorne", "organization": "Thorne Equity", "capacity": "$1M - $5M", "focus": "CleanTech", "region": "Europe", "lastActivity": "1 week ago", "initials": "MT", "color": "bg-yellow-600"},
    {"id": "4", "name": "Sarah Jenkins", "organization": "SeedBright", "capacity": "$500K - $2M", "focus": "HealthTech", "region": "Africa", "lastActivity": "3 days ago", "initials": "SJ", "color": "bg-red-600"},
    {"id": "5", "name": "Yuki Tanaka", "organization": "Nippon Invest", "capacity": "$20M+", "focus": "Logistics", "region": "Asia Pacific", "lastActivity": "5 hours ago", "initials": "YT", "color": "bg-indigo-600"},
    {"id": "6", "name": "James Wilson", "organization": "Wilson Capital", "capacity": "$10M - $25M", "focus": "Fintech", "region": "Europe", "lastActivity": "1 day ago", "initials": "JW", "color": "bg-green-600"},
    {"id": "7", "name": "Priya Patel", "organization": "Mumbai Ventures", "capacity": "$2M - $5M", "focus": "AgriTech", "region": "Asia", "lastActivity": "2 hours ago", "initials": "PP", "color": "bg-pink-600"},
    {"id": "8", "name": "Olaf Swensson", "organization": "Nordic Angels", "capacity": "$500K - $1M", "focus": "CleanTech", "region": "Europe", "lastActivity": "3 days ago", "initials": "OS", "color": "bg-blue-400"},
]

EVENTS_DB = [
    {"id": "EVT-9021", "name": "Global Tech Summit 2024", "date": "Oct 12, 2024", "location": "Convention Center, Singapore", "organizer": "IPA Regional Dept", "attendees": "1,200+", "status": "Upcoming"},
    {"id": "EVT-8842", "name": "Startup Pitch Day Q3", "date": "Sep 28, 2024", "location": "Virtual (Zoom)", "organizer": "Digital Economy Team", "attendees": "350+", "status": "Ongoing"},
    {"id": "EVT-7633", "name": "Venture Capital Roundtable", "date": "Aug 15, 2024", "location": "Grand Hyatt, London", "organizer": "Investor Relations", "attendees": "45", "status": "Completed"},
    {"id": "EVT-9104", "name": "Industrial Zone Showcase", "date": "Nov 05, 2024", "location": "Main Hall, Berlin", "organizer": "Infrastructure Lead", "attendees": "200+", "status": "Upcoming"},
    {"id": "EVT-2231", "name": "AI for Good Hackathon", "date": "Dec 10, 2024", "location": "Tech Park, San Francisco", "organizer": "Innovation Dept", "attendees": "500+", "status": "Upcoming"},
    {"id": "EVT-4456", "name": "Green Energy Expo", "date": "Jan 15, 2025", "location": "Expo Centre, Dubai", "organizer": "Sustainability Team", "attendees": "1000+", "status": "Planning"},
]

LEADS_DB = [
    {"id": "1", "source": "Web Inquiry", "contact": "Alex Sterling", "email": "sterling.tech@invest.com", "interest": "Hot", "manager": "Michael Chen", "followUp": "Oct 24, 2023 (Overdue)", "initials": "AS", "color": "bg-blue-500"},
    {"id": "2", "source": "TechSummit 2023", "contact": "Beatriz Jensen", "email": "b.jensen@nordic-vc.no", "interest": "Warm", "manager": "Sarah Jenkins", "followUp": "Oct 28, 2023", "initials": "BJ", "color": "bg-green-500"},
    {"id": "3", "source": "LinkedIn Referral", "contact": "David Miller", "email": "david@millercapital.co", "interest": "Hot", "manager": "Michael Chen", "followUp": "Oct 30, 2023", "initials": "DM", "color": "bg-orange-500"},
    {"id": "4", "source": "Cold Outreach", "contact": "Elena Kostic", "email": "elena.k@adria-solutions.com", "interest": "Cold", "manager": "Sarah Jenkins", "followUp": "Nov 02, 2023", "initials": "EK", "color": "bg-gray-500"},
]

# --- ROUTES ---

@app.get("/", tags=["Health"])
def read_root():
    return {"status": "active", "message": "Ecosystem Central AI Online"}

@app.post("/token", response_model=Token, tags=["Auth"])
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = get_user(fake_users_db, form_data.username)
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/register", response_model=User, tags=["Auth"])
async def register_user(user: UserCreate):
    if user.username in fake_users_db:
        raise HTTPException(status_code=400, detail="Username already registered")
    hashed_password = get_password_hash(user.password)
    user_in_db = UserInDB(**user.dict(), hashed_password=hashed_password)
    fake_users_db[user.username] = user_in_db.dict()
    return user

@app.get("/users/me", response_model=User, tags=["Auth"])
async def read_users_me(current_user: User = Depends(get_current_active_user)):
    return current_user

@app.get("/api/dashboard/stats", tags=["Dashboard"])
def get_dashboard_stats(current_user: User = Depends(get_current_active_user)):
    """Returns aggregated statistics for the dashboard."""
    return {
        "totalStartups": 24, # Matches "Total Pending" in mock
        "investorCapital": "$2.5B", # Matches "Total Capacity" in mock
        "liveEvents": 42,
        "processedToday": 12,
        "avgApprovalTime": "4.2 hrs"
    }

@app.get("/api/startups", tags=["Directory"])
def get_startups(
    current_user: User = Depends(get_current_active_user),
    search: Optional[str] = None,
    status: Optional[str] = None,
    sector: Optional[str] = None
):
    """Returns list of startup approval requests with optional filtering."""
    results = STARTUPS_DB
    
    if status:
        results = [s for s in results if s["status"].lower() == status.lower()]
    
    if sector:
        results = [s for s in results if s["sector"].lower() == sector.lower()]
        
    if search:
        search_lower = search.lower()
        results = [
            s for s in results 
            if search_lower in s["name"].lower() or 
               search_lower in s["id"].lower() or
               search_lower in s["sector"].lower()
        ]
        
    return results

@app.get("/api/investors", tags=["Directory"])
def get_investors(
    current_user: User = Depends(get_current_active_user),
    search: Optional[str] = None,
    focus: Optional[str] = None,
    region: Optional[str] = None
):
    """Returns list of investors with optional filtering."""
    results = INVESTORS_DB
    
    if focus:
        results = [i for i in results if focus.lower() in i["focus"].lower()]
        
    if region:
        results = [i for i in results if i["region"].lower() == region.lower()]
        
    if search:
        search_lower = search.lower()
        results = [
            i for i in results 
            if search_lower in i["name"].lower() or 
               search_lower in i["organization"].lower()
        ]
        
    return results

@app.get("/api/events", tags=["Events"])
def get_events(
    current_user: User = Depends(get_current_active_user),
    search: Optional[str] = None,
    status: Optional[str] = None
):
    """Returns list of upcoming events with optional filtering."""
    results = EVENTS_DB
    
    if status:
        results = [e for e in results if e["status"].lower() == status.lower()]
        
    if search:
        search_lower = search.lower()
        results = [
            e for e in results 
            if search_lower in e["name"].lower() or 
               search_lower in e["location"].lower()
        ]
        
    return results

@app.get("/api/leads", tags=["Leads"])
def get_leads(
    current_user: User = Depends(get_current_active_user),
    search: Optional[str] = None,
    interest: Optional[str] = None
):
    """Returns list of leads with optional filtering."""
    results = LEADS_DB
    
    if interest:
        results = [l for l in results if l["interest"].lower() == interest.lower()]
        
    if search:
        search_lower = search.lower()
        results = [
            l for l in results 
            if search_lower in l["contact"].lower() or 
               search_lower in l["source"].lower() or
               search_lower in l["email"].lower()
        ]
        
    return results
