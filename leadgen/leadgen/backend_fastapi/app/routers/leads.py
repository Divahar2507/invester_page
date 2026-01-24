from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from typing import List, Optional

from ..database import get_db
from ..models import Lead
from ..schemas import LeadCreate, LeadResponse
from ..services.icp_analysis import analyze_icp_with_dataset_and_groq

router = APIRouter(prefix="/api/leads", tags=["leads"])

@router.get("/", response_model=List[LeadResponse])
async def get_leads(userId: Optional[int] = None, limit: int = 1000, industry: Optional[str] = None, db: AsyncSession = Depends(get_db)):
    # Leads table is now the Business Dataset.
    # We return all leads, optionally filtered by User if needed (though dataset is usually global/admin owned).
    # For now, we return 'limit' leads descending by creation (or id).
    
    query = select(Lead).order_by(desc(Lead.created_at))
    
    # Industry Filter
    if industry and industry.lower() not in ["all", ""]:
        query = query.where(Lead.industry.ilike(f"%{industry}%"))
    
    if userId and not limit: 
        # Legacy behavior: if just userId passed, maybe they want "my leads"? 
        # But we are mocking "dataset" as leads. So let's just return global for now to fix the "not fetch" issue.
        # query = query.where(Lead.user_id == userId)
        pass 
        
    query = query.limit(limit)
    
    result = await db.execute(query)
    return result.scalars().all()

@router.post("/", response_model=LeadResponse, status_code=201)
async def create_lead(lead_in: LeadCreate, db: AsyncSession = Depends(get_db)):
    # Note: We need to emit socket event here. 
    # Current design pattern: The router returns response, and we trust main or service to handle emitting?
    # Or import sio instance? 
    # To keep it clean, we might need a global `sio` object or dependency injector.
    # For now, lets implement DB logic.
    
    new_lead = Lead(
        user_id=lead_in.userId,
        profile_name=lead_in.profile_name,
        industry=lead_in.industry,
        revenue=lead_in.revenue,
        location=lead_in.location,
        status="Active"
    )
    db.add(new_lead)
    await db.commit()
    await db.refresh(new_lead)
    
    # EMIT EVENT TODO: Add socketio emit
    
    return new_lead

@router.get("/{id}/matches")
async def get_lead_matches(id: int, sort_by: str = "relevance", limit: int = 1000, industry: Optional[str] = None, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Lead).where(Lead.id == id))
    icp = result.scalars().first()
    if not icp:
        raise HTTPException(status_code=404, detail="ICP not found")
        
    companies = await analyze_icp_with_dataset_and_groq(icp, db, sort_by=sort_by, limit=limit, industry_filter=industry)
    return companies
