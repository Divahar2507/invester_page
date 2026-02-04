from sqlalchemy import Column, Integer, String, Enum, ForeignKey, JSON, DateTime, Boolean, Table
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base
import enum

class UserRole(str, enum.Enum):
    STARTUP = "startup"
    AGENCY = "agency"
    INSTITUTION = "institution"
    FREELANCER = "freelancer"

class ProjectStatus(str, enum.Enum):
    OPEN = "Open"
    IN_PROGRESS = "In Progress"
    COMPLETED = "Completed"

class ProjectCategory(str, enum.Enum):
    FULL_TIME = "Full-time"
    FREELANCE = "Freelance"
    INTERNSHIP = "Internship"


class ApplicationStatus(str, enum.Enum):
    APPLIED = "Applied"
    SHORTLISTED = "Shortlisted"
    INTERVIEW = "Interview"
    SELECTED = "Selected"
    REJECTED = "Rejected"

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    role = Column(Enum(UserRole), nullable=False)
    avatar = Column(String)
    organization = Column(String)
    email = Column(String, unique=True, index=True)
    bio = Column(String)
    hashed_password = Column(String)

    # Talent Profile Fields
    skills = Column(JSON, default=[]) # List of strings
    experience_level = Column(String) # e.g., "Senior", "Junior"
    availability = Column(String) # e.g., "Full-time", "Freelance"
    location = Column(String)
    linkedin = Column(String)
    github = Column(String)
    resume = Column(String) # URL to resume

    projects = relationship("Project", back_populates="owner")
    sent_messages = relationship("Message", foreign_keys="Message.sender_id", back_populates="sender")
    received_messages = relationship("Message", foreign_keys="Message.recipient_id", back_populates="recipient")
    applications = relationship("JobApplication", foreign_keys="JobApplication.talent_id", back_populates="talent")
    interviews = relationship("Interview", foreign_keys="Interview.user_id", backref="user")
    hired_members = relationship("HiredMember", foreign_keys="HiredMember.employer_id", backref="employer")

class Project(Base):
    __tablename__ = "projects"

    id = Column(String, primary_key=True)
    title = Column(String, nullable=False)
    description = Column(String)
    budget = Column(String) # Keep for backward compatibility or display
    salary_range = Column(String) # New field per requirements
    equity = Column(String) # "Yes"/"No" or percentage
    location = Column(String) # Remote / Onsite / Country
    posted_by = Column(String)
    posted_by_id = Column(String, ForeignKey("users.id"))
    category = Column(Enum(ProjectCategory))
    type = Column(String) # 'execution' | 'recruitment'
    status = Column(Enum(ProjectStatus), default=ProjectStatus.OPEN)
    skills = Column(JSON) # List of strings

    owner = relationship("User", back_populates="projects")
    applications = relationship("JobApplication", back_populates="job")

class JobApplication(Base):
    __tablename__ = "job_applications"

    id = Column(String, primary_key=True)
    job_id = Column(String, ForeignKey("projects.id"))
    talent_id = Column(String, ForeignKey("users.id"))
    status = Column(Enum(ApplicationStatus), default=ApplicationStatus.APPLIED)
    applied_at = Column(DateTime(timezone=True), server_default=func.now())
    message = Column(String)
    resume_link = Column(String)

    job = relationship("Project", back_populates="applications")
    talent = relationship("User", back_populates="applications")

class Message(Base):
    __tablename__ = "messages"

    id = Column(String, primary_key=True)
    sender_id = Column(String, ForeignKey("users.id"))
    recipient_id = Column(String, ForeignKey("users.id"))
    text = Column(String, nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    status = Column(String) # 'sent' | 'delivered' | 'read' | 'system'

    sender = relationship("User", foreign_keys=sender_id, back_populates="sent_messages")
    recipient = relationship("User", foreign_keys=recipient_id, back_populates="received_messages")

class Interview(Base):
    __tablename__ = "interviews"

    id = Column(String, primary_key=True)
    participant_id = Column(String)
    participant_name = Column(String)
    participant_avatar = Column(String)
    participant_role = Column(Enum(UserRole))
    date = Column(String)
    time = Column(String)
    topic = Column(String)
    user_id = Column(String, ForeignKey("users.id"))

class HiredMember(Base):
    __tablename__ = "hired_members"

    id = Column(String, primary_key=True)
    name = Column(String)
    avatar = Column(String)
    role = Column(Enum(UserRole))
    start_date = Column(String)
    project = Column(String)
    organization = Column(String)
    employer_id = Column(String, ForeignKey("users.id"))
