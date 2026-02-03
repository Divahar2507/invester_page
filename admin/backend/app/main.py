from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from sqlalchemy import create_engine, text
import os

app = FastAPI(title="IPA Ecosystem Nerve Center", description="Integrated Platform Authority (IPA) - System Global Controller")

# --- CONFIGURATION ---
SECRET_KEY = "supersecretkey" 
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 # 24 hours for dev

# Database Connections (Read-Only access for Admin)
DB_MAIN_URL = os.getenv("DB_MAIN_URL", "postgresql://postgres:Diva%402004@db-main:5432/pitch_platform")
DB_EVENTS_URL = os.getenv("DB_EVENTS_URL", "postgresql://postgres:Diva%402004@db-events:5432/events_db")
# DB_LEADGEN_URL = os.getenv("DB_LEADGEN_URL", "postgresql://postgres:Diva%402004@db-leadgen:5432/leadgen_db")

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

# Mock User DB for Admin Access Only
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

# --- DATABASE HELPERS ---
def run_query(db_url: str, query_str: str, params: dict = {}):
    """
    Executes a read-only SQL query against the specified database.
    Returns a list of dictionaries.
    """
    try:
        engine = create_engine(db_url)
        with engine.connect() as connection:
            result = connection.execute(text(query_str), params)
            # Convert row objects to dicts
            return [dict(row._mapping) for row in result]
    except Exception as e:
        print(f"Error querying {db_url}: {e}")
        return []

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
    # 1. Get Startup Count & Total Valuation
    # Note: 'valuation' in DB is a string (e.g. "$10M"). Summing it strictly requires cleaning, 
    # but for now we'll just count rows to keep it robust.
    startups = run_query(DB_MAIN_URL, "SELECT count(*) as count FROM startup_profiles")
    startup_count = startups[0]['count'] if startups else 0
    
    # 2. Get Investor Count
    investors = run_query(DB_MAIN_URL, "SELECT count(*) as count FROM investor_profiles")
    investor_count = investors[0]['count'] if investors else 0

    # 3. Get Events Count
    events = run_query(DB_EVENTS_URL, "SELECT count(*) as count FROM event")
    event_count = events[0]['count'] if events else 0

    # 4. Get Total Deals (Investments)
    investments = run_query(DB_MAIN_URL, "SELECT count(*) as count, sum(amount) as total_amount FROM investments")
    deal_count = investments[0]['count'] if investments else 0
    capital_deployed = investments[0]['total_amount'] if investments and investments[0]['total_amount'] else 0
    
    # Format Capital
    capital_fmt = f"${capital_deployed/1000000:.1f}M" if capital_deployed > 1000000 else f"${capital_deployed:,.0f}"

    return {
        "totalStartups": startup_count,
        "activeInvestors": investor_count,
        "liveEvents": event_count,
        "pendingLeads": 12, # Still mock for now as we didn't check leadgen DB schema yet
        "systemHealth": "99.9%",
        "investorCapital": capital_fmt, # Real sum of investments
        "processedToday": 142
    }

@app.get("/api/health", tags=["IPA Control"])
def get_system_health(current_user: User = Depends(get_current_active_user)):
    return [
        {"service": "Investor Platform", "status": "Operational", "latency": "45ms", "load": "12%"},
        {"service": "Events Engine", "status": "Operational", "latency": "30ms", "load": "8%"},
        {"service": "Admin Core", "status": "Operational", "latency": "5ms", "load": "1%"},
    ]

@app.get("/api/startups", tags=["IPA Registry"])
def get_startups(current_user: User = Depends(get_current_active_user)):
    """Fetch real startups from pitch_platform DB"""
    query = """
        SELECT sp.id, sp.company_name as name, sp.industry as sector, sp.funding_stage as stage, 
               u.email, sp.city, sp.vision
        FROM startup_profiles sp
        JOIN users u ON sp.user_id = u.id
        LIMIT 50
    """
    results = run_query(DB_MAIN_URL, query)
    
    # Map to frontend expected format
    mapped = []
    for r in results:
        mapped.append({
            "id": f"IPA-ST-{r['id']}",
            "name": r['name'],
            "sector": r['sector'],
            "stage": r['stage'],
            "requestedUpgrade": "None",
            "submissionDate": "2024", # Placeholder as creation date not in profile directly (it's in user)
            "status": "Active",
            "valuation": "TBD"
        })
    return mapped

@app.get("/api/investors", tags=["IPA Registry"])
def get_investors(current_user: User = Depends(get_current_active_user)):
    """Fetch real investors from pitch_platform DB"""
    query = """
        SELECT ip.id, ip.firm_name as name, ip.investor_type as type, ip.focus_industries as focus,
               ip.min_check_size, ip.max_check_size
        FROM investor_profiles ip
        LIMIT 50
    """
    results = run_query(DB_MAIN_URL, query)
    
    mapped = []
    for r in results:
        cap_min = f"${r['min_check_size']/1000:.0f}K" if r['min_check_size'] else "N/A"
        cap_max = f"${r['max_check_size']/1000000:.1f}M" if r['max_check_size'] else "N/A"
        
        mapped.append({
            "id": f"IPA-INV-{r['id']}",
            "name": r['name'],
            "type": r['type'] or "Investor",
            "capacity": f"{cap_min} - {cap_max}",
            "focus": r['focus'],
            "region": "Global",
            "status": "Active",
            "totalDeals": 0 # Would need join with investments table
        })
    return mapped

@app.get("/api/events", tags=["IPA Integration"])
def get_events(current_user: User = Depends(get_current_active_user)):
    """Fetch real events from events_db"""
    query = """
        SELECT id, title as name, start_time, venue_name as location
        FROM event
        ORDER BY start_time DESC
        LIMIT 20
    """
    results = run_query(DB_EVENTS_URL, query)
    
    mapped = []
    for r in results:
        mapped.append({
            "id": f"IPA-EV-{r['id']}",
            "name": r['name'],
            "module": "Infinite_BZ",
            "date": r['start_time'].strftime("%b %d, %Y") if r['start_time'] else "TBD",
            "location": r['location'] or "Virtual",
            "attendees": "TBD",
            "status": "Active"
        })
    return mapped

@app.get("/api/leads", tags=["IPA Integration"])
def get_leads(current_user: User = Depends(get_current_active_user)):
    # Still returning mock until we verify leadgen DB
    return [
         {"id": "IPA-LD-992", "source": "LinkedIn Automation", "contact": "David Sterling", "company": "Sterling VC", "interest": "High", "captured_at": "Just now"},
         {"id": "IPA-LD-991", "source": "Web Scraper v2", "contact": "Maria Rossi", "company": "Innovate IT", "interest": "Medium", "captured_at": "5 mins ago"},
    ]

# IPA Action - Toggle Service
@app.post("/api/control/service/{service_name}/toggle", tags=["IPA Control"])
def toggle_service(service_name: str, current_user: User = Depends(get_current_active_user)):
    # In a real app, this would talk to Docker Socket or Kubernetes API
    return {"message": f"Service {service_name} scheduled for restart by IPA Admin."}
