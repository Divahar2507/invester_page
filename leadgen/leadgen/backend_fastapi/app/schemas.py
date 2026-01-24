from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime

# --- User Schemas ---
class UserBase(BaseModel):
    email: EmailStr
    role: str

class UserCreate(UserBase):
    password: str
    fullName: Optional[str] = None
    # Influencer specific fields
    platforms: Optional[List[str]] = None
    followers: Optional[int] = None
    category: Optional[str] = None
    handle: Optional[str] = None
    chargePerPost: Optional[float] = None
    imageUrl: Optional[str] = None
    mobileNumber: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str
    role: str

class UserResponse(UserBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    user: UserResponse
    # We might add access_token if we used Bearer auth, but the frontend
    # expects just { user: ... } and relies on state/cookies or just the object for valid login.
    # We'll follow the Node response: { user: ... }
    
# --- Influencer Schemas ---
class InfluencerCreate(BaseModel):
    name: str
    email: EmailStr
    platform: str
    category: str
    followers: Optional[int] = None
    handle: Optional[str] = None
    charge_per_post: Optional[float] = None
    image_url: Optional[str] = None
    mobile_number: Optional[str] = None

class InfluencerUpdate(BaseModel):
    charge_per_post: Optional[float] = None
    followers: Optional[int] = None
    handle: Optional[str] = None
    image_url: Optional[str] = None
    mobile_number: Optional[str] = None

class InfluencerVerify(BaseModel):
    verified: bool

class InfluencerResponse(InfluencerCreate):
    id: int
    verified: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

# --- Lead Schemas ---
class LeadCreate(BaseModel):
    profile_name: str
    userId: int
    industry: Optional[str] = "General"
    revenue: Optional[str] = "Unknown"
    location: Optional[str] = "Global"

class LeadResponse(BaseModel):
    id: int
    user_id: int
    profile_name: str
    industry: Optional[str]
    revenue: Optional[str]
    location: Optional[str]
    status: str
    email: Optional[str] = None
    raw_content: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class ICPCreate(BaseModel):
    profile_name: str
    userId: int
    industry: Optional[str] = "All"
    revenue: Optional[str] = "All"
    location: Optional[str] = "Global"

class ICPResponse(BaseModel):
    id: int
    user_id: int
    profile_name: str
    industry: Optional[str]
    revenue: Optional[str]
    location: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True

# --- Email Schemas ---
class EmailPublish(BaseModel):
    userId: int
    subject: str
    bodyTemplate: str
    leads: List[dict] # Simply pass the lead objects

# --- Insight Schemas ---
class InsightUpdate(BaseModel):
    id: int
    status: str

class BulkStatusUpdate(BaseModel):
    updates: List[InsightUpdate]

class CustomInsightCreate(BaseModel):
    icpId: int
    industry: Optional[str] = "General"
    persona: str
    title: str
    description: str
    type: str

class EmailGenerationRequest(BaseModel):
    icpName: str
    persona: str
    painPoint: str
    implication: Optional[str] = None
    outcome: Optional[str] = None
    companyName: Optional[str] = "Acme Corp"

