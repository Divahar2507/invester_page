"""
Script to seed realistic pitch data into the database
"""
from database import SessionLocal
from models.core import User, StartupProfile, Pitch
from utils.security import get_password_hash
import random

# Sample realistic pitch data
SAMPLE_PITCHES = [
    {
        "company": "EcoTech Solutions",
        "industry": "Clean Technology",
        "stage": "Seed",
        "title": "AI-Powered Solar Energy Optimization Platform",
        "description": "We're revolutionizing solar energy with AI-driven optimization that increases energy output by 35% using weather prediction and smart routing algorithms.",
        "amount": 500000,
        "tags": ["AI", "Clean Energy", "SaaS"],
        "team_size": 5,
        "revenue": "Pre-revenue"
    },
    {
        "company": "HealthTrack AI",
        "industry": "Healthcare",
        "stage": "Series A",
        "title": "Personal Health Assistant powered by Machine Learning",
        "description": "AI-driven platform that predicts health risks 90 days in advance through wearable data analysis. Already serving 50,000+ users across India.",
        "amount": 2000000,
        "tags": ["Healthcare", "AI", "Wearables"],
        "team_size": 15,
        "revenue": "$500K ARR"
    },
    {
        "company": "FarmConnect",
        "industry": "Agriculture Technology",
        "stage": "Pre-Seed",
        "title": "B2B Marketplace connecting farmers directly to restaurants",
        "description": "Eliminating middlemen in farm-to-table supply chain. Helping 1000+ farmers increase income by 40% while restaurants save 25% on produce costs.",
        "amount": 250000,
        "tags": ["Marketplace", "Agriculture", "Supply Chain"],
        "team_size": 3,
        "revenue": "Pre-revenue"
    },
    {
        "company": "EduVerse Learning",
        "industry": "Education Technology",
        "stage": "Seed",
        "title": "Immersive VR/AR Platform for K-12 Education",
        "description": "Making complex subjects fun through immersive 3D experiences. Partnered with 50+ schools, 10,000+ active students. 85% improvement in test scores.",
        "amount": 750000,
        "tags": ["EdTech", "VR/AR", "K-12"],
        "team_size": 8,
        "revenue": "$120K ARR"
    },
    {
        "company": "FinSecure Pro",
        "industry": "Financial Technology",
        "stage": "Series A",
        "title": "AI-Based Fraud Detection for Digital Payments",
        "description": "Real-time fraud detection preventing $2M+ in fraudulent transactions monthly. Processing 100K+ transactions daily for 20+ fintech clients.",
        "amount": 3000000,
        "tags": ["Fintech", "AI", "Security"],
        "team_size": 20,
        "revenue": "$1.2M ARR"
    },
    {
        "company": "GreenLogistics Hub",
        "industry": "Logistics",
        "stage": "Seed",
        "title": "Carbon-Neutral Last-Mile Delivery Network",
        "description": "Building India's first 100% electric delivery fleet. Operating in 5 cities with 200+ EVs. Reducing delivery costs by 30% while eliminating emissions.",
        "amount": 1000000,
        "tags": ["Logistics", "Clean Energy", "EV"],
        "team_size": 12,
        "revenue": "$300K ARR"
    },
    {
        "company": "StyleAI Wardrobe",
        "industry": "Fashion Technology",
        "stage": "Pre-Seed",
        "title": "AI Personal Stylist & Virtual Try-On Platform",
        "description": "AI-powered fashion recommendations with AR try-on. 50,000+ downloads, 35% conversion rate. Partnered with 100+ fashion brands.",
        "amount": 400000,
        "tags": ["Fashion", "AI", "AR"],
        "team_size": 4,
        "revenue": "Pre-revenue"
    },
    {
        "company": "CyberShield Sentinel",
        "industry": "Cybersecurity",
        "stage": "Series B",
        "title": "Enterprise-Grade Zero-Trust Security Platform",
        "description": "Protecting 500+ enterprises from cyber threats. Prevented 10,000+ attacks last year. YoY growth of 300%. Expanding to SE Asia.",
        "amount": 5000000,
        "tags": ["Cybersecurity", "Enterprise", "SaaS"],
        "team_size": 45,
        "revenue": "$3.5M ARR"
    },
    {
        "company": "FoodSense Labs",
        "industry": "Food Technology",
        "stage": "Seed",
        "title": "Smart Kitchen Assistant with Nutritional Tracking",
        "description": "IoT device that tracks ingredient freshness, suggests recipes, and monitors nutritional intake. 15,000 units sold in pre-orders.",
        "amount": 600000,
        "tags": ["IoT", "Food Tech", "Hardware"],
        "team_size": 7,
        "revenue": "$180K MRR"
    },
    {
        "company": "PropTech Innovations",
        "industry": "Real Estate Technology",
        "stage": "Seed",
        "title": "Virtual Property Tours & AI-Powered Matching",
        "description": "3D virtual tours + AI matching buyers to perfect properties. Listed 5000+ properties. 25% faster sale cycles for real estate agents.",
        "amount": 800000,
        "tags": ["PropTech", "AI", "Virtual Tours"],
        "team_size": 10,
        "revenue": "$250K ARR"
    }
]

def create_startup_and_pitch(db, data):
    """Create a startup user, profile, and pitch"""
    # Create user
    email = f"{data['company'].lower().replace(' ', '')}@startup.com"
    user = User(
        email=email,
        password_hash=get_password_hash("demo123"),
        role="startup"
    )
    db.add(user)
    db.flush()
    
    # Create startup profile
    startup_profile = StartupProfile(
        user_id=user.id,
        company_name=data['company'],
        founder_name=f"{data['company']} Founder",
        industry=data['industry'],
        funding_stage=data['stage'],
        team_size=data['team_size'],
        location="Chennai, India"
    )
    db.add(startup_profile)
    db.flush()
    
    # Create pitch
    pitch = Pitch(
        startup_id=user.id,
        title=data['title'],
        description=data['description'],
        industry=data['industry'],
        funding_stage=data['stage'],
        amount_seeking=data['amount'],
        business_model="B2B SaaS" if "SaaS" in data['tags'] else "B2C",
        revenue_model=data['revenue'],
        team_size=data['team_size'],
        tags=",".join(data['tags'])
    )
    db.add(pitch)
    
    return pitch

def seed_pitch_data():
    """Main function to seed all pitch data"""
    db = SessionLocal()
    try:
        print("Starting to seed pitch data...")
        
        for idx, pitch_data in enumerate(SAMPLE_PITCHES, 1):
            try:
                pitch = create_startup_and_pitch(db, pitch_data)
                db.commit()
                print(f"✓ Created pitch {idx}/10: {pitch_data['company']}")
            except Exception as e:
                db.rollback()
                print(f"✗ Error creating {pitch_data['company']}: {str(e)}")
        
        print("\n✅ Pitch data seeding completed!")
        print(f"Total pitches created: {len(SAMPLE_PITCHES)}")
        
    except Exception as e:
        print(f"❌ Seeding failed: {str(e)}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_pitch_data()
