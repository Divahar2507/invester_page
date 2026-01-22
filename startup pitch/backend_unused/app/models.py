import uuid
from datetime import datetime
from sqlalchemy import String, DateTime, func, Text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .database import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    full_name: Mapped[str] = mapped_column(String(200), nullable=False)
    company_name: Mapped[str] = mapped_column(String(200), nullable=False)
    email: Mapped[str] = mapped_column(String(320), unique=True, index=True, nullable=False)
    mobile_number: Mapped[str] = mapped_column(String(50), nullable=False)

    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    # One-to-one relationship with CompanyProfile (optional)
    profile: Mapped["CompanyProfile"] = relationship("CompanyProfile", back_populates="user", uselist=False)

    # Invitations sent by this user
    sent_invitations: Mapped[list["TeamInvitation"]] = relationship("TeamInvitation", back_populates="invited_by")


class CompanyProfile(Base):
    __tablename__ = "company_profiles"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), unique=True)

    industry: Mapped[str] = mapped_column(String(200), nullable=True)
    funding_stage: Mapped[str] = mapped_column(String(50), nullable=True)
    contact_email: Mapped[str] = mapped_column(String(320), nullable=True)

    # Pitch Content
    vision: Mapped[str] = mapped_column(Text, nullable=True)
    problem: Mapped[str] = mapped_column(Text, nullable=True)
    solution: Mapped[str] = mapped_column(Text, nullable=True)

    # Metrics
    arr: Mapped[str] = mapped_column(String(50), nullable=True)
    users: Mapped[str] = mapped_column(String(50), nullable=True)
    cac: Mapped[str] = mapped_column(String(50), nullable=True)
    retention: Mapped[str] = mapped_column(String(50), nullable=True)

    user: Mapped[User] = relationship("User", back_populates="profile")


class TeamInvitation(Base):
    __tablename__ = "team_invitations"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String(320), index=True)
    role: Mapped[str] = mapped_column(String(50))  # Admin, Editor, Viewer
    invited_by_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"))
    company_name: Mapped[str] = mapped_column(String(200))
    status: Mapped[str] = mapped_column(String(50), default="pending")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    invited_by: Mapped[User] = relationship("User", back_populates="sent_invitations")


class Investor(Base):
    __tablename__ = "investors"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    investor_name: Mapped[str] = mapped_column(String(200), nullable=False)
    firm_name: Mapped[str] = mapped_column(String(200), nullable=True)
    investor_type: Mapped[str] = mapped_column(String(50), nullable=True)
    location: Mapped[str] = mapped_column(String(50), nullable=True)
    investment_range: Mapped[str] = mapped_column(String(50), nullable=True)
    preferred_industries: Mapped[str] = mapped_column(String(200), nullable=True)
    email: Mapped[str] = mapped_column(String(120), nullable=True)
    bio: Mapped[str] = mapped_column(Text, nullable=True)
    
    # Backward compatibility for existing code trying to access 'name' or 'focus'
    # Use properties or duplicate columns if strictly needed, but better to update logic.
    # For now, we will map 'name' to 'investor_name' if needed in schemas, but let's stick to model first.

    # Backward compatibility
    @property
    def name(self):
        return self.investor_name
    
    @name.setter
    def name(self, value):
        self.investor_name = value
        
    @property
    def focus(self):
        return self.preferred_industries
    
    @focus.setter
    def focus(self, value):
        self.preferred_industries = value

    recent_investments: Mapped[list["RecentInvestment"]] = relationship("RecentInvestment", back_populates="investor")


class RecentInvestment(Base):
    __tablename__ = "recent_investments"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    investor_id: Mapped[int] = mapped_column(ForeignKey("investors.id"))
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    amount: Mapped[str] = mapped_column(String(50), nullable=False)

    investor: Mapped[Investor] = relationship("Investor", back_populates="recent_investments")