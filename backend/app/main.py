from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.database import engine, Base, SessionLocal
from app.models.core import User, StartupProfile, InvestorProfile
from app.utils.security import get_password_hash
from app.routes import auth, startup, investor, pitch, matching, messaging, notifications, images_check, investment, connections, watchlist
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
app.include_router(watchlist.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Pitch Platform API"}

# Seed Data
def seed_data():
    db = SessionLocal()
    try:
        from app.models.core import Pitch
        if db.query(User).count() == 0:
            print("Seeding initial users...")
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
            
            # Create Startup 1
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
                solution="AI that writes code",
                description="NextGen AI creates autonomous coding agents that can build entire software suites from a single prompt.",
                logo="N"
            )
            db.add(startup_profile)
            db.commit()
            db.refresh(startup_profile)

            # Pitch 1
            pitch1 = Pitch(
                startup_id=startup_profile.id,
                title="NextGen AI - Series A Deck",
                description="We are raising $5M to scale our autonomous coding platform.",
                raising_amount="$5M",
                equity_percentage="10%",
                status="active",
                pitch_file_url="https://example.com/pitch.pdf"
            )
            db.add(pitch1)

        # Additional Seeding for Pitches if empty (or just add new ones if missing users)
        if db.query(Pitch).count() < 3:
            print("Seeding additional pitches...")
            # Create Mock Startups and Pitches
            mocks = [
                {
                    "email": "eco@test.com", "company": "EcoCharge", "industry": "CleanTech", "stage": "Series A",
                    "desc": "Wireless charging for EVs at stopping lights.", "ask": "$12M"
                },
                {
                    "email": "med@test.com", "company": "BioLife", "industry": "HealthTech", "stage": "Seed",
                    "desc": "Personalized medicine using CRISPR.", "ask": "$2M"
                },
                {
                    "email": "fin@test.com", "company": "BlockPay", "industry": "FinTech", "stage": "Pre-Seed",
                    "desc": "Seamless crypto payments for retail.", "ask": "$500k"
                }
            ]
            
            for m in mocks:
                # Check if user exists
                if not db.query(User).filter(User.email == m["email"]).first():
                    u = User(email=m["email"], password_hash=get_password_hash("password"), role="startup") 
                    db.add(u)
                    db.commit()
                    db.refresh(u)
                    
                    sp = StartupProfile(
                        user_id=u.id,
                        company_name=m["company"],
                        industry=m["industry"],
                        funding_stage=m["stage"],
                        description=m["desc"],
                        vision="To change the world",
                        problem="Big problem",
                        solution="Great solution"
                    )
                    db.add(sp)
                    db.commit()
                    db.refresh(sp)
                    
                    p = Pitch(
                        startup_id=sp.id,
                        title=f"{m['company']} Pitch Deck",
                        description=m['desc'],
                        raising_amount=m['ask'],
                        status="active",
                        equity_percentage="15%"
                    )
                    db.add(p)
            
            db.commit()
            print("Additional pitches seeded!")
            
    finally:
        db.close()

# Run seed on startup
seed_data()
