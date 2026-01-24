from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc

from ..database import get_db
from ..models import User, Influencer

router = APIRouter(prefix="/api/admin", tags=["admin"])

@router.get("/overview")
async def admin_overview(db: AsyncSession = Depends(get_db)):
    user_count = await db.scalar(select(func.count(User.id)))
    inf_count = await db.scalar(select(func.count(Influencer.id)))
    verified_count = await db.scalar(select(func.count(Influencer.id)).where(Influencer.verified == True))
    
    cat_res = await db.execute(
        select(Influencer.category, func.count(Influencer.id).label("count"))
        .group_by(Influencer.category)
        .order_by(Influencer.category)
    )
    by_category = [{"category": row.category, "count": row.count} for row in cat_res.all()]
    
    return {
        "userCount": user_count or 0,
        "influencerCount": inf_count or 0,
        "verifiedInfluencers": verified_count or 0,
        "influencersByCategory": by_category
    }

@router.get("/users")
async def admin_users(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).order_by(desc(User.created_at)))
    users = result.scalars().all()
    # Manual serialization to match simple structure if schema doesn't match perfectly or just return objects
    return [{"id": u.id, "email": u.email, "role": u.role, "created_at": u.created_at} for u in users]
