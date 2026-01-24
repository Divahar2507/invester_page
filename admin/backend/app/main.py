from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
import random

app = FastAPI(title="IPA Ecosystem Nerve Center", description="Integrated Platform Authority (IPA) - System Global Controller")

# --- CONFIGURATION ---
SECRET_KEY = "supersecretkey" 
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 # 24 hours for dev

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

@app.on_event("startup")
async def startup_event():
    # Create default admin user
    hashed = get_password_hash("admin")
    fake_users_db["admin"] = {
        "username": "admin",
        "hashed_password": hashed,
        "email": "admin@ipa.gov",
        "full_name": "Integrated Platform Authority",
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

# --- ENHANCED ECOSYSTEM DATA ---

STARTUPS_DB = [
    {"id": "IPA-ST-001", "name": "NeuralFlow AI", "sector": "Artificial Intelligence", "stage": "Series A", "requestedUpgrade": "Series B", "submissionDate": "Jan 24, 2024", "status": "Pending", "valuation": "$12.5M"},
    {"id": "IPA-ST-002", "name": "QuantumLeap", "sector": "Quantum Computing", "stage": "Seed", "requestedUpgrade": "Series A", "submissionDate": "Jan 23, 2024", "status": "Approved", "valuation": "$2.1M"},
    {"id": "IPA-ST-003", "name": "BioSynth Labs", "sector": "BioTech", "stage": "Pre-Seed", "requestedUpgrade": "Seed", "submissionDate": "Jan 22, 2024", "status": "Pending", "valuation": "$500K"},
    {"id": "IPA-ST-004", "name": "AquaPure", "sector": "CleanTech", "stage": "Series C", "requestedUpgrade": "Late Stage", "submissionDate": "Jan 20, 2024", "status": "Rejected", "valuation": "$150M"},
    {"id": "IPA-ST-005", "name": "EduSphere", "sector": "EdTech", "stage": "Growth", "requestedUpgrade": "IPO Prep", "submissionDate": "Jan 18, 2024", "status": "Approved", "valuation": "$45M"},
]

INVESTORS_DB = [
    {"id": "IPA-INV-01", "name": "Alpha Capital", "type": "VC Firm", "capacity": "$500M+", "focus": "AI, SaaS", "region": "Global", "status": "Active", "totalDeals": 142},
    {"id": "IPA-INV-02", "name": "Nexus Ventures", "type": "Asset Manager", "capacity": "$1B+", "focus": "Energy, Infra", "region": "Asia", "status": "Active", "totalDeals": 85},
    {"id": "IPA-INV-03", "name": "Oasiss Angel", "type": "Angel Group", "capacity": "$10M", "focus": "Web3", "region": "Europe", "status": "Pending", "totalDeals": 12},
]

# Integrated Events from Infinite_BZ logic
EVENTS_DB = [
    {"id": "IPA-EV-2024-01", "name": "Global Investors Summit", "module": "Infinite_BZ", "date": "March 12, 2024", "location": "Virtual / Metaverse", "attendees": "5,000+", "status": "Upcoming"},
    {"id": "IPA-EV-2024-02", "name": "Startup Demo Day Q1", "module": "Infinite_BZ", "date": "Feb 28, 2024", "location": "San Francisco", "attendees": "350", "status": "Planning"},
    {"id": "IPA-EV-2024-03", "name": "AI Ethics Roundtable", "module": "Infinite_BZ", "date": "Feb 15, 2024", "location": "London, UK", "attendees": "50", "status": "Ongoing"},
]

# Integrated Leads from LeadGen logic
LEADS_DB = [
    {"id": "IPA-LD-992", "source": "LinkedIn Automation", "contact": "David Sterling", "company": "Sterling VC", "interest": "High", "captured_at": "Just now"},
    {"id": "IPA-LD-991", "source": "Web Scraper v2", "contact": "Maria Rossi", "company": "Innovate IT", "interest": "Medium", "captured_at": "5 mins ago"},
]

ECOSYSTEM_HEALTH = [
    {"service": "Core Investor Platform", "status": "Operational", "latency": "45ms", "load": "12%"},
    {"service": "LeadGen Engine", "status": "Operational", "latency": "120ms", "load": "45%"},
    {"service": "Connector Hub", "status": "Operational", "latency": "30ms", "load": "5%"},
    {"service": "Infinite_BZ (Events)", "status": "Degraded", "latency": "850ms", "load": "92%"},
    {"service": "Super Admin API", "status": "Operational", "latency": "5ms", "load": "1%"},
]

# --- ROUTES ---

@app.post("/token", response_model=Token, tags=["Auth"])
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = get_user(fake_users_db, form_data.username)
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect admin credentials",
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
        raise HTTPException(status_code=400, detail="User already exists in IPA Registry")
    hashed_password = get_password_hash(user.password)
    user_in_db = UserInDB(**user.dict(), hashed_password=hashed_password)
    fake_users_db[user.username] = user_in_db.dict()
    return user

@app.get("/users/me", response_model=User, tags=["Auth"])
async def read_users_me(current_user: User = Depends(get_current_active_user)):
    return current_user

@app.get("/api/dashboard/stats", tags=["IPA Dashboard"])
def get_dashboard_stats(current_user: User = Depends(get_current_active_user)):
    return {
        "totalStartups": len(STARTUPS_DB),
        "activeInvestors": len(INVESTORS_DB),
        "liveEvents": len(EVENTS_DB),
        "pendingLeads": len(LEADS_DB),
        "systemHealth": "98.4%",
        "investorCapital": "$2.9B",
        "processedToday": 142
    }

@app.get("/api/health", tags=["IPA Control"])
def get_system_health(current_user: User = Depends(get_current_active_user)):
    return ECOSYSTEM_HEALTH

@app.get("/api/startups", tags=["IPA Registry"])
def get_startups(current_user: User = Depends(get_current_active_user)):
    return STARTUPS_DB

@app.get("/api/investors", tags=["IPA Registry"])
def get_investors(current_user: User = Depends(get_current_active_user)):
    return INVESTORS_DB

@app.get("/api/events", tags=["IPA Integration"])
def get_events(current_user: User = Depends(get_current_active_user)):
    return EVENTS_DB

@app.get("/api/leads", tags=["IPA Integration"])
def get_leads(current_user: User = Depends(get_current_active_user)):
    return LEADS_DB

# IPA Action - Toggle Service
@app.post("/api/control/service/{service_name}/toggle", tags=["IPA Control"])
def toggle_service(service_name: str, current_user: User = Depends(get_current_active_user)):
    # In a real app, this would talk to Docker Socket or Kubernetes API
    return {"message": f"Service {service_name} scheduled for restart by IPA Admin."}
