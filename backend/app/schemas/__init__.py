from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime

# Auth & User
class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str
    role: str = Field(..., pattern="^(startup|investor)$")
    full_name: str

class UserLogin(UserBase):
    password: str

class GoogleLoginRequest(BaseModel):
    token: str
    role: Optional[str] = "investor" # Default if new user

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

class UserResponse(UserBase):
    id: int
    role: str
    created_at: datetime
    name: Optional[str] = None
    profile_image: Optional[str] = None

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[str] = None

# Startup
class StartupBase(BaseModel):
    company_name: str
    industry: str
    funding_stage: str
    vision: Optional[str] = None
    problem: Optional[str] = None
    solution: Optional[str] = None
    description: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    pincode: Optional[str] = None
    contact_address: Optional[str] = None
    mobile: Optional[str] = None
    email_verified: Optional[bool] = False
    mobile_verified: Optional[bool] = False
    
    # Personal & Work
    founder_name: Optional[str] = None
    founder_bio: Optional[str] = None
    founder_linkedin: Optional[str] = None
    resume_url: Optional[str] = None
    website_url: Optional[str] = None

class StartupCreate(StartupBase):
    pass

class StartupResponse(StartupBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True

# Investor
class InvestorBase(BaseModel):
    firm_name: str
    focus_industries: Optional[str] = None
    preferred_stage: str
    
    # Personal & Work
    contact_name: Optional[str] = None
    bio: Optional[str] = None
    website_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    min_check_size: Optional[float] = None
    max_check_size: Optional[float] = None

class InvestorCreate(InvestorBase):
    pass

class InvestorResponse(InvestorBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True

# Pitch
class PitchBase(BaseModel):
    title: str
    description: Optional[str] = None
    pitch_file_url: Optional[str] = None
    raising_amount: Optional[str] = None
    equity_percentage: Optional[str] = None

class PitchCreate(PitchBase):
    pass

class PitchResponse(PitchBase):
    id: int
    startup_id: int
    pitch_file_url: Optional[str] = None
    status: str
    created_at: datetime
    
    # Flattened fields for easy frontend consumption
    company_name: Optional[str] = None
    industry: Optional[str] = None
    stage: Optional[str] = None
    match_score: Optional[int] = None # For displaying match %
    startup_user_id: Optional[int] = None # For connection check
    connection_status: Optional[str] = "not_connected" # Optimized field

    class Config:
        from_attributes = True

# Match
class MatchResponse(BaseModel):
    id: int
    startup_id: int
    investor_id: int
    match_score: float
    startup_name: Optional[str] = None # Added for convenience
    investor_name: Optional[str] = None # Added for convenience

    class Config:
        from_attributes = True

# Message
class MessageCreate(BaseModel):
    receiver_id: int
    content: str

class MessageResponse(BaseModel):
    id: int
    sender_id: int
    receiver_id: int
    content: str
    timestamp: datetime
    sender_name: Optional[str] = None
    receiver_name: Optional[str] = None

    class Config:
        from_attributes = True

# Notification
class NotificationCreate(BaseModel):
    title: str
    description: str
    type: str # 'view', 'message', 'match', 'system'
    related_id: Optional[int] = None

class NotificationResponse(BaseModel):
    id: int
    user_id: int
    type: str
    title: str
    description: Optional[str] = None
    related_id: Optional[int] = None
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True

# Investment
class InvestmentBase(BaseModel):
    startup_name: str
    amount: float
    date: datetime
    round: str
    notes: Optional[str] = None
    status: Optional[str] = "Active"

class InvestmentCreate(InvestmentBase):
    pass

class InvestmentResponse(InvestmentBase):
    id: int
    investor_id: int

    class Config:
        from_attributes = True

# Connection
class ConnectionCreate(BaseModel):
    receiver_id: int

class ConnectionRespond(BaseModel):
    connection_id: int
    action: str = Field(..., pattern="^(accept|reject)$")

class ConnectionResponse(BaseModel):
    id: int
    requester_id: int
    receiver_id: int
    status: str
    created_at: datetime
    
    # Enriched details
    requester_name: Optional[str] = None
    requester_role: Optional[str] = None
    receiver_name: Optional[str] = None
    
    class Config:
        from_attributes = True

class ConnectionStatus(BaseModel):
    status: str # 'not_connected', 'pending', 'accepted', 'rejected'
    request_sent_by_me: Optional[bool] = False
    connection_id: Optional[int] = None
