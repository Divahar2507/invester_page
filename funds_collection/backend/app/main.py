from fastapi import FastAPI, Depends, HTTPException, Query, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from typing import List, Optional
import os
import shutil
from . import models, schemas, crud, database, seed

# Create database tables
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="PropInvest API")

# Mount uploads directory to serve files
UPLOAD_DIR = "uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# Update origins to include all possible local dev ports
origins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:3000",
    "http://localhost:3009",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Seed data on startup
@app.on_event("startup")
def startup_event():
    db = next(database.get_db())
    seed.seed_data(db)

@app.get("/")
def read_root():
    return {"message": "Welcome to PropInvest API"}

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Return the URL to access the file
    return {"url": f"http://localhost:8007/uploads/{file.filename}"}

@app.get("/funds", response_model=List[schemas.Fund])
def read_funds(
    search: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    db: Session = Depends(database.get_db)
):
    funds = crud.get_funds(db, search=search, category=category)
    return funds

@app.get("/funds/{fund_id}", response_model=schemas.Fund)
def read_fund(fund_id: str, db: Session = Depends(database.get_db)):
    db_fund = crud.get_fund(db, fund_id=fund_id)
    if db_fund is None:
        raise HTTPException(status_code=404, detail="Fund not found")
    return db_fund

@app.post("/funds", response_model=schemas.Fund)
def create_new_fund(fund: schemas.FundCreate, db: Session = Depends(database.get_db)):
    return crud.create_fund(db=db, fund=fund)

@app.post("/funds/{fund_id}/donate", response_model=schemas.Fund)
def donate_to_fund(fund_id: str, amount: float = Query(...), db: Session = Depends(database.get_db)):
    db_fund = crud.get_fund(db, fund_id=fund_id)
    if db_fund is None:
        raise HTTPException(status_code=404, detail="Fund not found")
    
    db_fund.current_amount += amount
    db.commit()
    db.refresh(db_fund)
    return db_fund
