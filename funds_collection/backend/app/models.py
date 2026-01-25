from sqlalchemy import Column, String, Float, Text
from .database import Base
from uuid import uuid4

class Fund(Base):
    __tablename__ = "funds"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid4()))
    title = Column(String, index=True)
    description = Column(Text)
    target_amount = Column(Float)
    current_amount = Column(Float, default=0.0)
    category = Column(String, index=True)
    image_url = Column(String, nullable=True)
    pdf_url = Column(String, nullable=True)
