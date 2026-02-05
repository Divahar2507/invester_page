from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.business_logic import (
    Startup, Competitor, TargetCustomer, MarketSize, 
    ProblemSolutionFit, ResearchNote, ResearchScore
)
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

router = APIRouter()

# --- Pydantic Schemas ---

class CompetitorBase(BaseModel):
    name: str
    website: Optional[str] = None
    description: Optional[str] = None
    strengths: Optional[str] = None
    weaknesses: Optional[str] = None

class CompetitorSchema(CompetitorBase):
    id: int
    startup_id: int
    class Config:
        from_attributes = True

class TargetCustomerBase(BaseModel):
    segment: str
    pain_points: str
    current_solution: str

class TargetCustomerSchema(TargetCustomerBase):
    id: int
    startup_id: int
    class Config:
        from_attributes = True

class MarketSizeBase(BaseModel):
    tam: str
    sam: str
    som: str
    source: Optional[str] = None

class MarketSizeSchema(MarketSizeBase):
    id: int
    startup_id: int
    class Config:
        from_attributes = True

class ProblemSolutionFitBase(BaseModel):
    problem: str
    existing_solutions: str
    gap: str
    proposed_solution: str

class ProblemSolutionFitSchema(ProblemSolutionFitBase):
    id: int
    startup_id: int
    class Config:
        from_attributes = True

class ResearchNoteBase(BaseModel):
    note: str
    attachment_url: Optional[str] = None

class ResearchNoteSchema(ResearchNoteBase):
    id: int
    startup_id: int
    created_at: Optional[datetime]
    class Config:
        from_attributes = True

class StartupBase(BaseModel):
    name: str
    industry: str
    description: str

class StartupSchema(StartupBase):
    id: int
    owner_id: Optional[int] = None
    created_at: Optional[datetime]
    class Config:
        from_attributes = True

class ResearchWorkspaceSchema(BaseModel):
    startup: StartupSchema
    competitors: List[CompetitorSchema]
    target_customers: List[TargetCustomerSchema]
    market_size: Optional[MarketSizeSchema]
    problem_solution_fit: Optional[ProblemSolutionFitSchema]
    notes: List[ResearchNoteSchema]
    score: int

# --- Startup Management ---

@router.get("/startups", response_model=List[StartupSchema])
def list_startups(db: Session = Depends(get_db)):
    return db.query(Startup).all()

@router.post("/startups", response_model=StartupSchema)
def create_startup(startup_data: StartupBase, db: Session = Depends(get_db)):
    new_startup = Startup(**startup_data.dict())
    db.add(new_startup)
    db.commit()
    db.refresh(new_startup)
    
    # Initialize score
    score = ResearchScore(startup_id=new_startup.id, score=0)
    db.add(score)
    db.commit()
    
    return new_startup

# --- Research Workspace ---

@router.get("/startups/{startup_id}/research", response_model=ResearchWorkspaceSchema)
def get_research_workspace(startup_id: int, db: Session = Depends(get_db)):
    startup = db.query(Startup).filter(Startup.id == startup_id).first()
    if not startup:
        raise HTTPException(status_code=404, detail="Startup not found")
    
    competitors = db.query(Competitor).filter(Competitor.startup_id == startup_id).all()
    customers = db.query(TargetCustomer).filter(TargetCustomer.startup_id == startup_id).all()
    market = db.query(MarketSize).filter(MarketSize.startup_id == startup_id).first()
    fit = db.query(ProblemSolutionFit).filter(ProblemSolutionFit.startup_id == startup_id).first()
    notes = db.query(ResearchNote).filter(ResearchNote.startup_id == startup_id).all()
    score = db.query(ResearchScore).filter(ResearchScore.startup_id == startup_id).first()

    return {
        "startup": startup,
        "competitors": competitors,
        "target_customers": customers,
        "market_size": market,
        "problem_solution_fit": fit,
        "notes": notes,
        "score": score.score if score else 0
    }

# --- Module Updates ---

def update_research_score(startup_id: int, db: Session):
    score_obj = db.query(ResearchScore).filter(ResearchScore.startup_id == startup_id).first()
    if not score_obj:
        score_obj = ResearchScore(startup_id=startup_id, score=0)
        db.add(score_obj)
    
    current_score = 0
    # Logic: +10 for market, +10 for fit, +5 per competitor(max 20), +5 per customer(max 20)
    # Simple logic from requirements: "Competitors added, Market size filled, Customer clarity, Problem clarity"
    
    comp_count = db.query(Competitor).filter(Competitor.startup_id == startup_id).count()
    current_score += min(comp_count * 10, 30)
    
    if db.query(MarketSize).filter(MarketSize.startup_id == startup_id).first():
        current_score += 25
        
    if db.query(ProblemSolutionFit).filter(ProblemSolutionFit.startup_id == startup_id).first():
        current_score += 25
        
    cust_count = db.query(TargetCustomer).filter(TargetCustomer.startup_id == startup_id).count()
    current_score += min(cust_count * 10, 20)
        
    score_obj.score = min(current_score, 100)
    db.commit()

@router.post("/startups/{startup_id}/competitors", response_model=CompetitorSchema)
def add_competitor(startup_id: int, data: CompetitorBase, db: Session = Depends(get_db)):
    obj = Competitor(startup_id=startup_id, **data.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    update_research_score(startup_id, db)
    return obj

@router.post("/startups/{startup_id}/target-customers", response_model=TargetCustomerSchema)
def add_target_customer(startup_id: int, data: TargetCustomerBase, db: Session = Depends(get_db)):
    obj = TargetCustomer(startup_id=startup_id, **data.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    update_research_score(startup_id, db)
    return obj

@router.post("/startups/{startup_id}/market-size", response_model=MarketSizeSchema)
def update_market_size(startup_id: int, data: MarketSizeBase, db: Session = Depends(get_db)):
    obj = db.query(MarketSize).filter(MarketSize.startup_id == startup_id).first()
    if obj:
        for key, value in data.dict().items():
            setattr(obj, key, value)
    else:
        obj = MarketSize(startup_id=startup_id, **data.dict())
        db.add(obj)
    db.commit()
    db.refresh(obj)
    update_research_score(startup_id, db)
    return obj

@router.post("/startups/{startup_id}/problem-solution", response_model=ProblemSolutionFitSchema)
def update_problem_solution(startup_id: int, data: ProblemSolutionFitBase, db: Session = Depends(get_db)):
    obj = db.query(ProblemSolutionFit).filter(ProblemSolutionFit.startup_id == startup_id).first()
    if obj:
        for key, value in data.dict().items():
            setattr(obj, key, value)
    else:
        obj = ProblemSolutionFit(startup_id=startup_id, **data.dict())
        db.add(obj)
    db.commit()
    db.refresh(obj)
    update_research_score(startup_id, db)
    return obj

@router.post("/startups/{startup_id}/research-notes", response_model=ResearchNoteSchema)
def add_research_note(startup_id: int, data: ResearchNoteBase, db: Session = Depends(get_db)):
    obj = ResearchNote(startup_id=startup_id, **data.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj
