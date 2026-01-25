from pydantic import BaseModel
from typing import Optional

class FundBase(BaseModel):
    title: str
    description: str
    target_amount: float
    category: str # e.g., 'Crowd Funding', 'Research Funding', 'Startup Funding'
    image_url: Optional[str] = None
    pdf_url: Optional[str] = None

class FundCreate(FundBase):
    pass

class Fund(FundBase):
    id: str
    current_amount: float = 0.0

    class Config:
        orm_mode = True
