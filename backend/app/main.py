from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.database import engine, Base, SessionLocal
from app.models.core import User, StartupProfile, InvestorProfile
from app.utils.security import get_password_hash
from app.routes import auth, startup, investor, pitch, matching, messaging, notifications, images_check, investment, connections, watchlist, file_upload, social
from app.middleware.error_handlers import setup_exception_handlers
import os
import logging

# Configure logging
logger = logging.getLogger(__name__)

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Startup-Investor Pitch Platform",
    description="Backend for a pitch platform connecting startups and investors.",
    version="1.0.0"
)

# Setup error handlers
# Setup error handlers
setup_exception_handlers(app)

# Rate Limiting
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from app.middleware.rate_limit import limiter

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

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
app.include_router(file_upload.router)
app.include_router(social.router)

from app.routes import tasks
app.include_router(tasks.router)

from app.routes import ai_analysis
app.include_router(ai_analysis.router)

from app.routes import admin
app.include_router(admin.router)

# Health Check Endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint for monitoring"""
    return {
        "status": "healthy",
        "version": "1.0.0",
        "service": "pitch-platform-api"
    }

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Investor Platform API",
        "version": "1.0.0",
        "docs": "/docs"
    }

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
        if db.query(Pitch).count() < 10:
            print("Seeding realistic pitch data...")
            # Realistic startup pitches
            pitches_data = [
                {
                    "email": "ecotech@startup.com", "company": "EcoTech Solutions", "industry": "Clean Technology", 
                    "stage": "Seed", "founder": "Raj Kumar",
                    "title": "AI-Powered Solar Energy Optimization Platform",
                    "desc": "We're revolutionizing solar energy with AI-driven optimization that increases energy output by 35% using weather prediction and smart routing algorithms.",
                    "ask": "$500,000", "team_size": 5, "revenue": "Pre-revenue",
                    "tags": "AI,Clean Energy,SaaS"
                },
                {
                    "email": "healthtrack@startup.com", "company": "HealthTrack AI", "industry": "Healthcare", 
                    "stage": "Series A", "founder": "Dr. Priya Shah",
                    "title": "Personal Health Assistant powered by Machine Learning",
                    "desc": "AI-driven platform that predicts health risks 90 days in advance through wearable data analysis. Already serving 50,000+ users across India.",
                    "ask": "$2,000,000", "team_size": 15, "revenue": "$500K ARR",
                    "tags": "Healthcare,AI,Wearables"
                },
                {
                    "email": "farmconnect@startup.com", "company": "FarmConnect", "industry": "Agriculture Technology", 
                    "stage": "Pre-Seed", "founder": "Kumar Patel",
                    "title": "B2B Marketplace connecting farmers directly to restaurants",
                    "desc": "Eliminating middlemen in farm-to-table supply chain. Helping 1000+ farmers increase income by 40% while restaurants save 25% on produce costs.",
                    "ask": "$250,000", "team_size": 3, "revenue": "Pre-revenue",
                    "tags": "Marketplace,Agriculture,Supply Chain"
                },
                {
                    "email": "eduverse@startup.com", "company": "EduVerse Learning", "industry": "Education Technology", 
                    "stage": "Seed", "founder": "Ananya Reddy",
                    "title": "Immersive VR/AR Platform for K-12 Education",
                    "desc": "Making complex subjects fun through immersive 3D experiences. Partnered with 50+ schools, 10,000+ active students. 85% improvement in test scores.",
                    "ask": "$750,000", "team_size": 8, "revenue": "$120K ARR",
                    "tags": "EdTech,VR/AR,K-12"
                },
                {
                    "email": "finsecure@startup.com", "company": "FinSecure Pro", "industry": "Financial Technology", 
                    "stage": "Series A", "founder": "Vikram Singh",
                    "title": "AI-Based Fraud Detection for Digital Payments",
                    "desc": "Real-time fraud detection preventing $2M+ in fraudulent transactions monthly. Processing 100K+ transactions daily for 20+ fintech clients.",
                    "ask": "$3,000,000", "team_size": 20, "revenue": "$1.2M ARR",
                    "tags": "Fintech,AI,Security"
                },
                {
                    "email": "greenlogistics@startup.com", "company": "GreenLogistics Hub", "industry": "Logistics", 
                    "stage": "Seed", "founder": "Arjun Menon",
                    "title": "Carbon-Neutral Last-Mile Delivery Network",
                    "desc": "Building India's first 100% electric delivery fleet. Operating in 5 cities with 200+ EVs. Reducing delivery costs by 30% while eliminating emissions.",
                    "ask": "$1,000,000", "team_size": 12, "revenue": "$300K ARR",
                    "tags": "Logistics,Clean Energy,EV"
                },
                {
                    "email": "styleai@startup.com", "company": "StyleAI Wardrobe", "industry": "Fashion Technology", 
                    "stage": "Pre-Seed", "founder": "Neha Gupta",
                    "title": "AI Personal Stylist & Virtual Try-On Platform",
                    "desc": "AI-powered fashion recommendations with AR try-on. 50,000+ downloads, 35% conversion rate. Partnered with 100+ fashion brands.",
                    "ask": "$400,000", "team_size": 4, "revenue": "Pre-revenue",
                    "tags": "Fashion,AI,AR"
                },
                {
                    "email": "cybershield@startup.com", "company": "CyberShield Sentinel", "industry": "Cybersecurity", 
                    "stage": "Series B", "founder": "Rahul Verma",
                    "title": "Enterprise-Grade Zero-Trust Security Platform",
                    "desc": "Protecting 500+ enterprises from cyber threats. Prevented 10,000+ attacks last year. YoY growth of 300%. Expanding to SE Asia.",
                    "ask": "$5,000,000", "team_size": 45, "revenue": "$3.5M ARR",
                    "tags": "Cybersecurity,Enterprise,SaaS"
                },
                {
                    "email": "foodsense@startup.com", "company": "FoodSense Labs", "industry": "Food Technology", 
                    "stage": "Seed", "founder": "Meera Krishnan",
                    "title": "Smart Kitchen Assistant with Nutritional Tracking",
                    "desc": "IoT device that tracks ingredient freshness, suggests recipes, and monitors nutritional intake. 15,000 units sold in pre-orders.",
                    "ask": "$600,000", "team_size": 7, "revenue": "$180K MRR",
                    "tags": "IoT,Food Tech,Hardware"
                },
                {
                    "email": "proptech@startup.com", "company": "PropTech Innovations", "industry": "Real Estate Technology", 
                    "stage": "Seed", "founder": "Sanjay Nair",
                    "title": "Virtual Property Tours & AI-Powered Matching",
                    "desc": "3D virtual tours + AI matching buyers to perfect properties. Listed 5000+ properties. 25% faster sale cycles for real estate agents.",
                    "ask": "$800,000", "team_size": 10, "revenue": "$250K ARR",
                    "tags": "PropTech,AI,Virtual Tours"
                },
                {
                    "email": "aquapure@startup.com", "company": "AquaPure AI", "industry": "Water Technology", 
                    "stage": "Seed", "founder": "Vikram Das",
                    "title": "Graphene-based water filtration with AI monitoring",
                    "desc": "Low-cost, high-efficiency water purification for rural areas using nanotechnology and IoT sensors for real-time quality tracking.",
                    "ask": "$450,000", "team_size": 6, "revenue": "Pre-revenue",
                    "tags": "WaterTech,AI,Sustainability"
                },
                {
                    "email": "spacebound@startup.com", "company": "SpaceBound Robotics", "industry": "Aerospace", 
                    "stage": "Series A", "founder": "Siddharth Rao",
                    "title": "Autonomous satellite servicing robots",
                    "desc": "Reducing space debris and extending satellite life via orbiting robotic repair stations. Partnered with 3 major space agencies.",
                    "ask": "$12,000,000", "team_size": 30, "revenue": "Contracts signed",
                    "tags": "Aerospace,Robotics,Space"
                },
                {
                    "email": "bioheart@startup.com", "company": "BioHeart Genomics", "industry": "Biotechnology", 
                    "stage": "Seed", "founder": "Dr. Sarah Khan",
                    "title": "Gene-editing therapy for congenital heart disease",
                    "desc": "CRISPR-based treatment currently in Phase 1 trials. Potential to cure 200,000 infants annually. Patent-pending delivery mechanism.",
                    "ask": "$4,000,000", "team_size": 12, "revenue": "Grants",
                    "tags": "Biotech,CRISPR,Health"
                },
                {
                    "email": "nexustransport@startup.com", "company": "Nexus Hyperloop", "industry": "Transportation", 
                    "stage": "Series B", "founder": "Amit Sharma",
                    "title": "High-speed vacuum tube transport for cargo",
                    "desc": "Revolutionizing logistics with 1000km/h cargo pods. First 10km test track complete in Gujarat. Reducing transit time by 90%.",
                    "ask": "$25,000,000", "team_size": 80, "revenue": "Strategic partners",
                    "tags": "Transport,Logistics,Tech"
                },
                {
                    "email": "mindwell@startup.com", "company": "MindWell AI", "industry": "Education", 
                    "stage": "Seed", "founder": "Lata Mangeshkar",
                    "title": "AI Mental Health Counselor for Students",
                    "desc": "Personalized emotional support platform for schools. Used by 100,000 students. 40% reduction in reported anxiety levels.",
                    "ask": "$900,000", "team_size": 10, "revenue": "$300K ARR",
                    "tags": "EdTech,MentalHealth,AI"
                },
                {
                    "email": "quantumcompute@startup.com", "company": "QuantumQubits", "industry": "Computing", 
                    "stage": "Seed", "founder": "Dr. Alan Turing",
                    "title": "Quantum-as-a-Service for Drug Discovery",
                    "desc": "Using quantum algorithms to simulate molecular interactions. 1000x faster than supercomputers. Scaling to 100 qubits.",
                    "ask": "$6,000,000", "team_size": 25, "revenue": "Pilot projects",
                    "tags": "Quantum,Computing,SaaS"
                },
                {
                    "email": "urbanvertical@startup.com", "company": "UrbanVertical Farms", "industry": "Agriculture", 
                    "stage": "Series A", "founder": "Gautam Adani",
                    "title": "Fully automated vertical farms in city centers",
                    "desc": "Growing produce with 95% less water and zero pesticides. 24-hour delivery from farm to table. Tech-patented hydroponics.",
                    "ask": "$7,000,000", "team_size": 40, "revenue": "$2M ARR",
                    "tags": "AgriTech,Food,Sustainability"
                },
                {
                    "email": "secureid@startup.com", "company": "SecureID Biometrics", "industry": "Security", 
                    "stage": "Seed", "founder": "Nandan Nilekani",
                    "title": "Blockchain-based decentralized identity platform",
                    "desc": "Giving users control over their data with sovereign digital IDs. Integrated with 5 major banks. Zero-knowledge authentication.",
                    "ask": "$1,500,000", "team_size": 18, "revenue": "$400K ARR",
                    "tags": "Blockchain,Security,Identity"
                }
            ]
            
            for p_data in pitches_data:
                # Check if user exists
                if not db.query(User).filter(User.email == p_data["email"]).first():
                    u = User(email=p_data["email"], password_hash=get_password_hash("demo123"), role="startup") 
                    db.add(u)
                    db.commit()
                    db.refresh(u)
                    
                    sp = StartupProfile(
                        user_id=u.id,
                        company_name=p_data["company"],
                        founder_name=p_data["founder"],
                        industry=p_data["industry"],
                        funding_stage=p_data["stage"],
                        description=p_data["desc"],
                        vision="Transforming the industry with innovation",
                        problem="Traditional solutions are inefficient",
                        solution="Our technology solves this at scale"
                    )
                    db.add(sp)
                    db.commit()
                    db.refresh(sp)
                    
                    p = Pitch(
                        startup_id=sp.id,
                        title=p_data['title'],
                        description=p_data['desc'],
                        industry=p_data['industry'],
                        funding_stage=p_data['stage'],
                        amount_seeking=int(p_data['ask'].replace('$', '').replace(',', '').replace('K', '000').replace('M', '000000')),
                        business_model="B2B SaaS" if "SaaS" in p_data['tags'] else "B2C",
                        revenue_model=p_data['revenue'],
                        team_size=p_data['team_size'],
                        tags=p_data['tags'],
                        status="active",
                        location="Mumbai, India",
                        valuation=f"${int(p_data['ask'].replace('$', '').replace(',', '').replace('K', '0').replace('M', '000000')) * 5 // 1000000}M", # Corrected valuation logic basically.
                        pitch_file_url="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
                    )
                    db.add(p)
            
            db.commit()
            print(f"✅ Seeded {len(pitches_data)} realistic pitches!")
            
    finally:
        db.close()

# Run seed on startup
# seed_data()
