from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc, distinct
from typing import List, Optional

from ..database import get_db
from ..models import PersonaInsight
from ..schemas import BulkStatusUpdate, CustomInsightCreate

router = APIRouter(prefix="/api", tags=["insights"]) # Note: Insights routes are a bit mixed in Node.

# GET /api/personas
@router.get("/personas")
async def get_personas(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(distinct(PersonaInsight.persona)).order_by(PersonaInsight.persona))
    return [r for r in result.scalars().all() if r]

# Insights routes
@router.get("/insights/{persona}")
async def get_insights(persona: str, icpId: int = Query(...), force: bool = Query(False), db: AsyncSession = Depends(get_db)):
    # Node logic: decodeURIComponent(persona) - FastAPI handles decoding automatically typically
    # But just in case
    import urllib.parse
    decoded_persona = urllib.parse.unquote(persona)

    # Ensure insights exist (generates via Groq if not)
    from ..services.icp_analysis import ensure_persona_insights_for_icp
    await ensure_persona_insights_for_icp(icpId, decoded_persona, db, force=force)
    
    query = select(PersonaInsight).where(
        PersonaInsight.icp_id == icpId,
        PersonaInsight.persona == decoded_persona
    ).order_by(desc(PersonaInsight.relevance_score), PersonaInsight.id)
    
    result = await db.execute(query)
    rows = result.scalars().all()
    
    # Map to camelCase if needed, but Pydantic or direct object return usually matches DB column names.
    # The frontend expects: icpId, isCustom. DB has icp_id, is_custom.
    # We might need explicit conversion if using ORM objects directly without Pydantic 'by_alias' or response model.
    # Let's return dicts to be safe.
    
    return [
        {
            "id": r.id,
            "icpId": r.icp_id,
            "industry": r.industry,
            "persona": r.persona,
            "title": r.title,
            "description": r.description,
            "relevance": r.relevance_score,
            "type": r.type,
            "isCustom": r.is_custom,
            "status": r.status
        }
        for r in rows
    ]

@router.put("/insights/bulk-status")
async def bulk_status_update(update_in: BulkStatusUpdate, db: AsyncSession = Depends(get_db)):
    for u in update_in.updates:
        insight = await db.get(PersonaInsight, u.id)
        if insight:
            insight.status = u.status
            db.add(insight)
    await db.commit()
    return {"success": True}

@router.post("/insights/custom", status_code=201)
async def create_custom_insight(custom_in: CustomInsightCreate, db: AsyncSession = Depends(get_db)):
    new_insight = PersonaInsight(
        icp_id=custom_in.icpId,
        industry=custom_in.industry,
        persona=custom_in.persona,
        title=custom_in.title,
        description=custom_in.description,
        relevance_score=10,
        type=custom_in.type,
        is_custom=True,
        status="unassigned"
    )
    db.add(new_insight)
    await db.commit()
    await db.refresh(new_insight)
    
    r = new_insight
    return {
        "id": r.id,
        "icpId": r.icp_id,
        "industry": r.industry,
        "persona": r.persona,
        "title": r.title,
        "description": r.description,
        "relevance": r.relevance_score,
        "type": r.type,
        "isCustom": r.is_custom,
        "status": r.status
    }

@router.delete("/insights/{id}", status_code=204)
async def delete_insight(id: int, db: AsyncSession = Depends(get_db)):
    insight = await db.get(PersonaInsight, id)
    if not insight:
        raise HTTPException(status_code=404, detail="Insight not found")
        
    await db.delete(insight)
    await db.commit()
