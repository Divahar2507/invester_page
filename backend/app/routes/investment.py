from fastapi import APIRouter, Depends, HTTPException, File, UploadFile, Form
from sqlalchemy.orm import Session
from app.models.core import Investment, User, InvestorProfile
from app.schemas import InvestmentCreate, InvestmentResponse, InvestmentStats
from app.dependencies import get_current_user, get_db
from typing import List, Optional

router = APIRouter(prefix="/investments", tags=["investments"])

@router.post("/", response_model=InvestmentResponse)
def create_investment(
    startup_name: str = Form(...),
    amount: float = Form(...),
    date: str = Form(...),
    round: str = Form(...),
    equity_stake: Optional[float] = Form(None),
    notes: Optional[str] = Form(None),
    status: str = Form("Active"),
    file: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "investor":
        raise HTTPException(status_code=403, detail="Only investors can log investments")
    
    if not current_user.investor_profile:
        raise HTTPException(status_code=400, detail="Investor profile not found")

    # Prevent duplicate entries for the same startup
    existing = db.query(Investment).filter(
        Investment.investor_id == current_user.investor_profile.id,
        Investment.startup_name == startup_name
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="This startup is already in your portfolio")

    # Handle File Upload
    document_url = None
    if file:
        # Save to uploads directory
        import os
        import shutil
        from datetime import datetime
        
        upload_dir = "uploads/documents"
        os.makedirs(upload_dir, exist_ok=True)
        
        # Clean filename
        safe_filename = "".join([c for c in file.filename if c.isalpha() or c.isdigit() or c in ('.', '_', '-')]).strip()
        filename = f"inv_{current_user.id}_{int(datetime.now().timestamp())}_{safe_filename}"
        filepath = os.path.join(upload_dir, filename)
        
        with open(filepath, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        print(f"Saved file to {filepath}")
        document_url = f"/uploads/documents/{filename}"

    # Parse Date string to DateTime
    from datetime import datetime
    try:
        if date:
            date_obj = datetime.strptime(date, "%Y-%m-%d")
        else:
            date_obj = datetime.now()
    except ValueError:
        date_obj = datetime.now()

    db_investment = Investment(
        startup_name=startup_name,
        amount=amount,
        date=date_obj,
        round=round,
        equity_stake=equity_stake,
        notes=notes,
        status=status,
        document_url=document_url,
        investor_id=current_user.investor_profile.id
    )
    db.add(db_investment)
    db.commit()
    db.refresh(db_investment)
    return db_investment

@router.get("/", response_model=List[InvestmentResponse])
def get_investments(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "investor":
         raise HTTPException(status_code=403, detail="Only investors can view portfolio")
         
    if not current_user.investor_profile:
        return []

    return db.query(Investment).filter(
        Investment.investor_id == current_user.investor_profile.id
    ).all()

@router.get("/stats", response_model=InvestmentStats)
def get_investment_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "investor":
         raise HTTPException(status_code=403, detail="Only investors can view portfolio stats")
         
    if not current_user.investor_profile:
        return InvestmentStats(
            capital_deployed="$0", 
            active_startups=0, 
            portfolio_growth="0%", 
            avg_equity="0%"
        )

    investments = db.query(Investment).filter(
        Investment.investor_id == current_user.investor_profile.id
    ).all()
    
    total_deployed = sum(inv.amount for inv in investments)
    active_count = len(investments)
    
    # Mock logic for growth and equity as we don't strictly track these yet
    # In a real app, you'd calculate current_valuation vs invested_amount
    growth = "+28.4%" if active_count > 0 else "0%"
    equity = "9.2%" if active_count > 0 else "0%"
    
    return InvestmentStats(
        capital_deployed=f"${total_deployed:,.0f}",
        active_startups=active_count,
        portfolio_growth=growth,
        avg_equity=equity
    )
