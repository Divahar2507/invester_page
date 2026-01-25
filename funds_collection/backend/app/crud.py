from sqlalchemy.orm import Session
from . import models, schemas
from uuid import uuid4

def get_fund(db: Session, fund_id: str):
    return db.query(models.Fund).filter(models.Fund.id == fund_id).first()

def get_funds(db: Session, search: str = None, category: str = None):
    query = db.query(models.Fund)
    if category and category.lower() != "all":
        query = query.filter(models.Fund.category == category)
    if search:
        # Simple case-insensitive search
        search_fmt = f"%{search}%"
        query = query.filter(
            (models.Fund.title.ilike(search_fmt)) | 
            (models.Fund.description.ilike(search_fmt))
        )
    return query.all()

def create_fund(db: Session, fund: schemas.FundCreate):
    db_fund = models.Fund(
        id=str(uuid4()),
        **fund.dict(),
        current_amount=0.0
    )
    db.add(db_fund)
    db.commit()
    db.refresh(db_fund)
    return db_fund
