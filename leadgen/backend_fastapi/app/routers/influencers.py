from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from typing import List, Optional

from ..database import get_db
from ..models import Influencer
from ..schemas import InfluencerCreate, InfluencerUpdate, InfluencerResponse, InfluencerVerify

router = APIRouter(prefix="/api/influencers", tags=["influencers"])

@router.post("/", response_model=InfluencerResponse, status_code=201)
async def create_influencer(inf_in: InfluencerCreate, db: AsyncSession = Depends(get_db)):
    # Basic validation
    new_inf = Influencer(
        name=inf_in.name.strip(),
        email=inf_in.email.strip(),
        platform=inf_in.platform.strip(),
        followers=inf_in.followers,
        category=inf_in.category.strip(),
        handle=inf_in.handle.strip() if inf_in.handle else None,
        charge_per_post=inf_in.charge_per_post,
        image_url=inf_in.image_url,
        mobile_number=inf_in.mobile_number,
        verified=False
    )
    db.add(new_inf)
    await db.commit()
    await db.refresh(new_inf)
    return new_inf

@router.get("/", response_model=List[InfluencerResponse])
async def list_influencers(
    category: Optional[str] = None,
    platform: Optional[str] = None,
    verified: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    query = select(Influencer).order_by(desc(Influencer.created_at))
    
    if category and category != "All":
        query = query.where(Influencer.category == category)
    if platform and platform != "All":
        query = query.where(Influencer.platform.ilike(f"%{platform}%"))
    if verified == "true":
        query = query.where(Influencer.verified == True)
    elif verified == "false":
        query = query.where(Influencer.verified == False)
        
    result = await db.execute(query)
    return result.scalars().all()

@router.put("/{id}", response_model=InfluencerResponse)
async def update_influencer(id: int, inf_up: InfluencerUpdate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Influencer).where(Influencer.id == id))
    inf = result.scalars().first()
    if not inf:
        raise HTTPException(status_code=404, detail="Influencer not found")
        
    update_data = inf_up.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(inf, key, value)
        
    await db.commit()
    await db.refresh(inf)
    return inf

@router.put("/{id}/verify", response_model=InfluencerResponse)
async def verify_influencer(id: int, verify_in: InfluencerVerify, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Influencer).where(Influencer.id == id))
    inf = result.scalars().first()
    if not inf:
        raise HTTPException(status_code=404, detail="Influencer not found")
        
    inf.verified = verify_in.verified
    await db.commit()
    await db.refresh(inf)
    return inf

@router.get("/stats")
async def get_stats(db: AsyncSession = Depends(get_db)):
    # Using raw SQL or separate queries for aggregation
    # SQLAlchemy count logic
    from sqlalchemy import func
    
    total = await db.scalar(select(func.count()).select_from(Influencer))
    verified_count = await db.scalar(select(func.count()).select_from(Influencer).where(Influencer.verified == True))
    
    # Group by category
    cat_query = select(Influencer.category, func.count(Influencer.id).label("count")).group_by(Influencer.category).order_by(Influencer.category)
    cat_res = await db.execute(cat_query)
    by_category = [{"category": row.category, "count": row.count} for row in cat_res.all()]
    
    return {
        "total": total,
        "verified": verified_count,
        "byCategory": by_category
    }
