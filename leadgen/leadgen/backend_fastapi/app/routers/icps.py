from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc, delete
from typing import List, Optional

from ..database import get_db
from ..models import ICP
from ..schemas import ICPCreate, ICPResponse

router = APIRouter(prefix="/api/icps", tags=["icps"])

@router.get("/", response_model=List[ICPResponse])
async def get_icps(userId: Optional[int] = None, db: AsyncSession = Depends(get_db)):
    query = select(ICP).order_by(desc(ICP.created_at))
    if userId:
        query = query.where(ICP.user_id == userId)
    
    result = await db.execute(query)
    return result.scalars().all()

@router.post("/", response_model=ICPResponse, status_code=201)
async def create_icp(icp_in: ICPCreate, db: AsyncSession = Depends(get_db)):
    new_icp = ICP(
        user_id=icp_in.userId,
        profile_name=icp_in.profile_name,
        industry=icp_in.industry,
        revenue=icp_in.revenue,
        location=icp_in.location
    )
    db.add(new_icp)
    await db.commit()
    await db.refresh(new_icp)
    return new_icp

@router.delete("/{id}", status_code=204)
async def delete_icp(id: int, db: AsyncSession = Depends(get_db)):
    # Check if exists
    result = await db.execute(select(ICP).where(ICP.id == id))
    icp = result.scalars().first()
    if not icp:
        raise HTTPException(status_code=404, detail="ICP not found")
    
    await db.delete(icp)
    await db.commit()
    return None
