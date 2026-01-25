from fastapi import FastAPI, HTTPException, File, UploadFile, Depends
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
import shutil
import os

from . import models, schemas, crud, database, seed

# --- Database Setup ---
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

# --- Seed Data on Startup ---
@app.on_event("startup")
def startup_event():
    db = database.SessionLocal()
    try:
        seed.seed_data(db)
    finally:
        db.close()

# --- Uploads Setup ---
UPLOAD_DIR = "uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# --- CORS ---
origins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Dependency ---
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def read_root():
    return {"message": "Welcome to PropInvest API"}

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    file_location = f"{UPLOAD_DIR}/{file.filename}"
    with open(file_location, "wb+") as file_object:
        shutil.copyfileobj(file.file, file_object)
    
    # Construct accessibility URL
    # Note: In production, use env var for domain
    file_url = f"http://localhost:8001/uploads/{file.filename}"
    return {"url": file_url}

@app.get("/funds", response_model=List[schemas.Fund])
def get_funds(search: Optional[str] = None, category: Optional[str] = None, db: Session = Depends(get_db)):
    return crud.get_funds(db, search=search, category=category)

@app.post("/funds", response_model=schemas.Fund, status_code=201)
def create_fund(fund: schemas.FundCreate, db: Session = Depends(get_db)):
    return crud.create_fund(db, fund)

@app.get("/funds/{fund_id}", response_model=schemas.Fund)
def get_fund(fund_id: str, db: Session = Depends(get_db)):
    db_fund = crud.get_fund(db, fund_id)
    if db_fund is None:
        raise HTTPException(status_code=404, detail="Fund not found")
    return db_fund

