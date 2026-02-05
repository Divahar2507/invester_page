from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime
from ..models.models import UserRole, ProjectStatus, ProjectCategory, ApplicationStatus

class UserBase(BaseModel):
    id: str
    name: str
    role: UserRole
    avatar: Optional[str] = None
    organization: Optional[str] = None
    email: Optional[EmailStr] = None
    bio: Optional[str] = None
    
    # Talent Profile Fields
    skills: List[str] = []
    experience_level: Optional[str] = None
    availability: Optional[str] = None
    location: Optional[str] = None
    linkedin: Optional[str] = None
    github: Optional[str] = None
    resume: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    name: Optional[str] = None
    avatar: Optional[str] = None
    bio: Optional[str] = None
    organization: Optional[str] = None
    skills: Optional[List[str]] = None
    experience_level: Optional[str] = None
    availability: Optional[str] = None
    location: Optional[str] = None
    linkedin: Optional[str] = None
    github: Optional[str] = None
    resume: Optional[str] = None

class User(UserBase):
    class Config:
        from_attributes = True

class ProjectBase(BaseModel):
    title: str
    description: Optional[str] = None
    budget: Optional[str] = None
    category: ProjectCategory
    type: str # 'execution' | 'recruitment'
    skills: List[str] = []
    
    # Job Posting Fields
    salary_range: Optional[str] = None
    equity: Optional[str] = None
    location: Optional[str] = None

class ProjectCreate(ProjectBase):
    pass

class Project(ProjectBase):
    id: str
    posted_by: str
    posted_by_id: str
    status: ProjectStatus

    class Config:
        from_attributes = True

class JobApplicationBase(BaseModel):
    job_id: str
    message: Optional[str] = None
    resume_link: Optional[str] = None

class JobApplicationCreate(JobApplicationBase):
    pass

class JobApplicationUpdate(BaseModel):
    status: ApplicationStatus

class JobApplication(JobApplicationBase):
    id: str
    talent_id: str
    status: ApplicationStatus
    applied_at: datetime
    talent: Optional[User] = None
    job: Optional[Project] = None

    class Config:
        from_attributes = True

class MessageBase(BaseModel):
    recipient_id: str
    text: str

class MessageCreate(MessageBase):
    pass

class Message(MessageBase):
    id: str
    sender_id: str
    timestamp: datetime
    status: Optional[str] = None

    class Config:
        from_attributes = True

class InterviewBase(BaseModel):
    participant_id: str
    participant_name: str
    participant_avatar: str
    participant_role: UserRole
    date: str
    time: str
    topic: str

class InterviewCreate(InterviewBase):
    pass

class Interview(InterviewBase):
    id: str
    
    class Config:
        from_attributes = True

class HiredMemberBase(BaseModel):
    name: str
    avatar: str
    role: UserRole
    start_date: str
    project: str
    organization: Optional[str] = None

class HiredMemberCreate(HiredMemberBase):
    pass

class HiredMember(HiredMemberBase):
    id: str

    class Config:
        from_attributes = True
