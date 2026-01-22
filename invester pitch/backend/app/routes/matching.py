from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.dependencies import get_db, get_current_user
from app.models.core import User, StartupProfile, InvestorProfile, Match
from app.schemas import MatchResponse
import random

router = APIRouter(prefix="/matches", tags=["Matching"])

@router.get("/startup/{startup_id}", response_model=list[MatchResponse])
def get_matches_for_startup(
    startup_id: int, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    # Allow startup to see their own matches, or investors to see matches (maybe?)
    # For now, let's allow the startup to see their matches.
    
    startup = db.query(StartupProfile).filter(StartupProfile.id == startup_id).first()
    if not startup:
        raise HTTPException(status_code=404, detail="Startup profile not found")
        
    investors = db.query(InvestorProfile).all()
    matches = []
    
    for investor in investors:
        score = 0
        
        # Industry match
        # Assuming focus_industries is comma separated or simple string
        if startup.industry and investor.focus_industries and \
           (startup.industry.lower() in investor.focus_industries.lower()):
            score += 50
            
        # Stage match
        if startup.funding_stage and investor.preferred_stage and \
           startup.funding_stage.lower() == investor.preferred_stage.lower():
            score += 30
            
        # Random boost
        score += random.randint(0, 20)
        
        # Cap at 100
        score = min(score, 100)
        
        # Create or Update Match Record
        match_record = db.query(Match).filter(
            Match.startup_id == startup.id,
            Match.investor_id == investor.id
        ).first()
        
        if not match_record:
            match_record = Match(
                startup_id=startup.id,
                investor_id=investor.id,
                match_score=score
            )
            db.add(match_record)
        else:
            match_record.match_score = score
        
        # We need to commit to get IDs if new
        db.commit()
        db.refresh(match_record)
        
        # Populate response with names for convenience
        resp = MatchResponse.model_validate(match_record)
        resp.startup_name = startup.company_name
        resp.investor_name = investor.firm_name
        matches.append(resp)
        
    # Validation/Serialize
    matches.sort(key=lambda x: x.match_score, reverse=True)
    return matches
