from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text, Float
from sqlalchemy.sql import func
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(String, nullable=False)  # admin, user, influencer
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Influencer(Base):
    __tablename__ = "influencers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    platform = Column(String, nullable=False)
    followers = Column(Integer, nullable=True)
    category = Column(String, nullable=False)
    handle = Column(String, nullable=True)
    charge_per_post = Column(Float, nullable=True)
    image_url = Column(String, nullable=True)
    mobile_number = Column(String, nullable=True)
    verified = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Lead(Base):
    __tablename__ = "leads"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    profile_name = Column(String, nullable=False)
    industry = Column(String, default="General")
    revenue = Column(String, default="Unknown")
    location = Column(String, default="Global")
    email = Column(String, nullable=True)
    raw_content = Column(Text, nullable=True)
    status = Column(String, default="Active")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class ICP(Base):
    __tablename__ = "icps"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    profile_name = Column(String, nullable=False)
    industry = Column(String, default="All")
    revenue = Column(String, default="All")
    location = Column(String, default="Global")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class EmailCampaign(Base):
    __tablename__ = "email_campaigns"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    subject = Column(String, nullable=False)
    sent_count = Column(Integer, default=0)
    skipped_count = Column(Integer, default=0)
    delivered_count = Column(Integer, default=0)
    soft_bounce_count = Column(Integer, default=0)
    hard_bounce_count = Column(Integer, default=0)
    tracked_count = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class PersonaInsight(Base):
    __tablename__ = "persona_insights"

    id = Column(Integer, primary_key=True, index=True)
    icp_id = Column(Integer, ForeignKey("leads.id"), nullable=False)
    industry = Column(String, nullable=True)
    persona = Column(String, nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    relevance_score = Column(Integer, default=10)
    type = Column(String, nullable=False) # pain_point, outcome
    is_custom = Column(Boolean, default=False)
    status = Column(String, default="unassigned")
