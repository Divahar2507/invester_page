from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import uuid

from .database import engine, Base, get_db
from .models import models
from .schemas import schemas
from .seed import seed_db

app = FastAPI(title="FounderDash API")

@app.on_event("startup")
async def startup_event():
    try:
        # Create tables
        models.Base.metadata.create_all(bind=engine)
        print("Database tables created successfully")
    except Exception as e:
        print(f"Error creating database tables: {e}")
        
    try:
        seed_db()
    except Exception as e:
        print(f"Error seeding database: {e}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to FounderDash API"}

# USERS
@app.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = models.User(
        id=user.id,
        name=user.name,
        role=user.role,
        avatar=user.avatar,
        organization=user.organization,
        email=user.email,
        bio=user.bio
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.get("/users/{user_id}", response_model=schemas.User)
def get_user(user_id: str, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

# PROJECTS
@app.post("/projects/", response_model=schemas.Project)
def create_project(project: schemas.ProjectCreate, user_id: str, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    db_project = models.Project(
        id=str(uuid.uuid4()),
        title=project.title,
        description=project.description,
        budget=project.budget,
        posted_by=user.organization or user.name,
        posted_by_id=user.id,
        category=project.category,
        type=project.type,
        skills=project.skills
    )
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

@app.get("/projects/", response_model=List[schemas.Project])
def list_projects(db: Session = Depends(get_db)):
    return db.query(models.Project).all()

# TALENT POOL
@app.get("/talent/", response_model=List[schemas.User])
def get_talent_pool(db: Session = Depends(get_db)):
    return db.query(models.User).filter(models.User.role != models.UserRole.STARTUP).all()

# MESSAGES
@app.post("/messages/", response_model=schemas.Message)
def send_message(message: schemas.MessageCreate, sender_id: str, db: Session = Depends(get_db)):
    db_message = models.Message(
        id=str(uuid.uuid4()),
        sender_id=sender_id,
        recipient_id=message.recipient_id,
        text=message.text,
        status="sent"
    )
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message

@app.get("/messages/{user_id}", response_model=List[schemas.Message])
def get_messages(user_id: str, db: Session = Depends(get_db)):
    return db.query(models.Message).filter(
        (models.Message.sender_id == user_id) | (models.Message.recipient_id == user_id)
    ).order_by(models.Message.timestamp.asc()).all()

# INTERVIEWS
@app.post("/interviews/", response_model=schemas.Interview)
def schedule_interview(interview: schemas.InterviewCreate, user_id: str, db: Session = Depends(get_db)):
    db_interview = models.Interview(
        id=str(uuid.uuid4()),
        **interview.model_dump(),
        user_id=user_id
    )
    db.add(db_interview)
    db.commit()
    db.refresh(db_interview)
    return db_interview

@app.get("/interviews/{user_id}", response_model=List[schemas.Interview])
def list_interviews(user_id: str, db: Session = Depends(get_db)):
    return db.query(models.Interview).filter(models.Interview.user_id == user_id).all()

# LOGIN (Simple mock for demo)
@app.post("/login/", response_model=schemas.User)
def login(login_data: dict, db: Session = Depends(get_db)):
    # In a real app, verify password. Here we just find user by email.
    email = login_data.get("email")
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        # For demo purposes, if not found, just return the first user of the selected role if provided
        role = login_data.get("role")
        if role:
            user = db.query(models.User).filter(models.User.role == role).first()
        
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return user

# HIRED MEMBERS
@app.post("/hired/", response_model=schemas.HiredMember)
def hire_member(member: schemas.HiredMemberCreate, employer_id: str, db: Session = Depends(get_db)):
    db_member = models.HiredMember(
        id=str(uuid.uuid4()),
        **member.model_dump(),
        employer_id=employer_id
    )
    db.add(db_member)
    db.commit()
    db.refresh(db_member)
    return db_member

@app.get("/hired/{employer_id}", response_model=List[schemas.HiredMember])
def list_hired(employer_id: str, db: Session = Depends(get_db)):
    return db.query(models.HiredMember).filter(models.HiredMember.employer_id == employer_id).all()

# STATS
@app.get("/stats/{user_id}")
def get_stats(user_id: str, db: Session = Depends(get_db)):
    hired = db.query(models.HiredMember).filter(models.HiredMember.employer_id == user_id).all()
    
    return {
        "activeInterns": len([h for h in hired if h.role == models.UserRole.INSTITUTION]),
        "agencyLeads": len([h for h in hired if h.role in [models.UserRole.AGENCY, models.UserRole.FREELANCER]]),
        "hiredStudents": 124, # Mock global stats or aggregate from all employers if needed
        "leadsTaken": 45      # Mock global stats
    }

# UPDATE USER PROFILE
@app.put("/users/{user_id}", response_model=schemas.User)
def update_user(user_id: str, user_update: schemas.UserUpdate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user_data = user_update.model_dump(exclude_unset=True)
    for key, value in user_data.items():
        setattr(db_user, key, value)
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# JOB APPLICATIONS
@app.post("/applications/", response_model=schemas.JobApplication)
def apply_for_job(application: schemas.JobApplicationCreate, talent_id: str, db: Session = Depends(get_db)):
    # Check if already applied
    existing = db.query(models.JobApplication).filter(
        models.JobApplication.job_id == application.job_id,
        models.JobApplication.talent_id == talent_id
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Already applied to this job")

    db_application = models.JobApplication(
        id=str(uuid.uuid4()),
        job_id=application.job_id,
        talent_id=talent_id,
        message=application.message,
        resume_link=application.resume_link,
        status=models.ApplicationStatus.APPLIED
    )
    db.add(db_application)
    db.commit()
    db.refresh(db_application)
    return db_application

@app.get("/applications/job/{job_id}", response_model=List[schemas.JobApplication])
def list_job_applications(job_id: str, db: Session = Depends(get_db)):
    # Verify job belongs to requesting user generally handled by auth, skipping strict ownership check for demo simplicity
    return db.query(models.JobApplication).filter(models.JobApplication.job_id == job_id).all()

@app.get("/applications/talent/{talent_id}", response_model=List[schemas.JobApplication])
def list_talent_applications(talent_id: str, db: Session = Depends(get_db)):
    return db.query(models.JobApplication).filter(models.JobApplication.talent_id == talent_id).all()

@app.put("/applications/{application_id}", response_model=schemas.JobApplication)
def update_application_status(application_id: str, status_update: schemas.JobApplicationUpdate, db: Session = Depends(get_db)):
    db_application = db.query(models.JobApplication).filter(models.JobApplication.id == application_id).first()
    if not db_application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    db_application.status = status_update.status
    db.commit()
    db.refresh(db_application)
    return db_application
