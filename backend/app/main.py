from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.database import engine, Base, SessionLocal
from app.models.core import User, StartupProfile, InvestorProfile
from app.utils.security import get_password_hash
from app.routes import auth, startup, investor, pitch, matching, messaging, notifications, images_check, investment, connections
import os

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Startup-Investor Pitch Platform",
    description="Backend for a pitch platform connecting startups and investors.",
    version="1.0.0"
)

# CORS
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost",
    "http://127.0.0.1",
    "http://localhost:80",
    "http://localhost:5173",  # Vite dev server
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount uploads directory for static access if needed (optional but good for testing)
if not os.path.exists("uploads"):
    os.makedirs("uploads")
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Include Routers
app.include_router(auth.router)
app.include_router(startup.router)
app.include_router(investor.router)
app.include_router(pitch.router)
app.include_router(matching.router)
app.include_router(messaging.router)
app.include_router(notifications.router)
app.include_router(images_check.router)
app.include_router(investment.router)
app.include_router(connections.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Pitch Platform API"}

# Seed Data
def seed_data():
    db = SessionLocal()
    try:
        if db.query(User).count() == 0:
            print("Seeding data...")
            # Create Investor
            investor_pass = get_password_hash("password")
            investor_user = User(email="investor@test.com", password_hash=investor_pass, role="investor")
            db.add(investor_user)
            db.commit()
            db.refresh(investor_user)
            
            investor_profile = InvestorProfile(
                user_id=investor_user.id,
                firm_name="Venture Capital One",
                focus_industries="Technology, AI, SaaS",
                preferred_stage="Seed"
            )
            db.add(investor_profile)
            
            # Create Startup
            startup_pass = get_password_hash("password")
            startup_user = User(email="startup@test.com", password_hash=startup_pass, role="startup")
            db.add(startup_user)
            db.commit()
            db.refresh(startup_user)
            
            startup_profile = StartupProfile(
                user_id=startup_user.id,
                company_name="NextGen AI",
                industry="AI",
                funding_stage="Seed",
                vision="To revolutionize coding with AI",
                problem="Coding is hard",
                solution="AI that writes code"
            )
            db.add(startup_profile)
            
            db.commit()
            print("Data seeded!")
    finally:
        db.close()

# Run seed on startup
seed_data()
