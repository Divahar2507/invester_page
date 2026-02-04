from sqlalchemy import Column, Integer, String, Float, JSON, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.db.session import Base

class ResearchProject(Base):
    __tablename__ = "research_projects"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    institution = Column(String)
    location = Column(String)
    description = Column(String)
    field = Column(String)
    status = Column(String)
    stage = Column(String)
    progress = Column(Integer)
    image = Column(String)

class Mentor(Base):
    __tablename__ = "mentors"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    role = Column(String)
    company = Column(String)
    expertise = Column(JSON)  # List of strings
    rating = Column(Float)
    reviews = Column(Integer)
    tags = Column(JSON)  # List of strings
    avatar = Column(String)
    status = Column(String) # top, regular
    bio = Column(String)

class Seminar(Base):
    __tablename__ = "seminars"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    date_str = Column(String) # For display like 'Oct 24'
    month = Column(String)
    day = Column(String)
    time = Column(String)
    speaker = Column(String)
    role = Column(String)
    category = Column(String)
    description = Column(String)
    img = Column(String)

class TechPark(Base):
    __tablename__ = "tech_parks"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    location = Column(String)
    tags = Column(JSON) # List of strings
    status = Column(String)
    coordinates = Column(JSON) # {lat: float, lng: float}
    image = Column(String)

class Pitch(Base):
    __tablename__ = "pitches"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    founder = Column(String)
    description = Column(String)
    valuation = Column(String)
    funding_needed = Column(String)
    industry = Column(String)
    status = Column(String, default="Pending")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

# --- Research Engine Models ---

class Startup(Base):
    __tablename__ = "startups"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    founder_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    industry = Column(String)
    description = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Competitor(Base):
    __tablename__ = "competitors"

    id = Column(Integer, primary_key=True, index=True)
    startup_id = Column(Integer, ForeignKey("startups.id"))
    name = Column(String)
    website = Column(String, nullable=True)
    description = Column(String)
    strengths = Column(String)
    weaknesses = Column(String)

class TargetCustomer(Base):
    __tablename__ = "target_customers"

    id = Column(Integer, primary_key=True, index=True)
    startup_id = Column(Integer, ForeignKey("startups.id"))
    segment = Column(String)
    pain_points = Column(String)
    current_solution = Column(String)

class MarketSize(Base):
    __tablename__ = "market_size"

    id = Column(Integer, primary_key=True, index=True)
    startup_id = Column(Integer, ForeignKey("startups.id"))
    tam = Column(String) # Total Addressable Market
    sam = Column(String) # Serviceable Addressable Market
    som = Column(String) # Serviceable Obtainable Market
    source = Column(String, nullable=True)

class ProblemSolutionFit(Base):
    __tablename__ = "problem_solution_fit"

    id = Column(Integer, primary_key=True, index=True)
    startup_id = Column(Integer, ForeignKey("startups.id"))
    problem = Column(String)
    existing_solutions = Column(String)
    gap = Column(String)
    proposed_solution = Column(String)

class ResearchNote(Base):
    __tablename__ = "research_notes"

    id = Column(Integer, primary_key=True, index=True)
    startup_id = Column(Integer, ForeignKey("startups.id"))
    note = Column(String)
    attachment_url = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class ResearchScore(Base):
    __tablename__ = "research_scores"

    id = Column(Integer, primary_key=True, index=True)
    startup_id = Column(Integer, ForeignKey("startups.id"))
    score = Column(Integer, default=0)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
