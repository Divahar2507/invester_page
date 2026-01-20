
import sys
import os

# Add backend directory to sys.path
current_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.dirname(current_dir) # backend/app -> backend
project_dir = os.path.dirname(backend_dir) # backend -> invester_dev

sys.path.append(project_dir)
sys.path.append(backend_dir)

from app.database import SessionLocal
from app.models.core import User, InvestorProfile
from app.utils.security import get_password_hash

investors_data = [
    {
        "id": 1, "investor_name": "Rohit Sharma", "firm_name": "VentureRise Capital", "investor_type": "Angel Investor",
        "location": "Chennai", "investment_range": "₹10 Lakhs - ₹50 Lakhs", "preferred_industries": "FinTech, EdTech, HealthTech",
        "email": "rohit@venturerise.com", "bio": "I invest in early-stage startups with strong founders and scalable ideas."
    },
    {
        "id": 2, "investor_name": "Ananya Menon", "firm_name": "SparkGrowth Ventures", "investor_type": "VC",
        "location": "Bangalore", "investment_range": "₹50 Lakhs - ₹2 Crore", "preferred_industries": "SaaS, AI, CleanTech",
        "email": "ananya@sparkgrowth.in", "bio": "Looking for innovative tech startups solving real-world problems."
    },
    {
        "id": 3, "investor_name": "Karthik Raj", "firm_name": "FutureSeed Network", "investor_type": "Angel Investor",
        "location": "Coimbatore", "investment_range": "₹5 Lakhs - ₹25 Lakhs", "preferred_industries": "AgriTech, FoodTech, Logistics",
        "email": "karthik@futureseed.in", "bio": "Interested in startups that improve rural and agriculture ecosystems."
    },
    {
        "id": 4, "investor_name": "Priya Kumar", "firm_name": "BlueOcean Investments", "investor_type": "Private Equity",
        "location": "Hyderabad", "investment_range": "₹1 Crore - ₹5 Crore", "preferred_industries": "E-commerce, RetailTech, PropTech",
        "email": "priya@blueocean.com", "bio": "I focus on growth-stage businesses with strong revenue potential."
    },
    {
        "id": 5, "investor_name": "Arjun Verma", "firm_name": "NextWave Angels", "investor_type": "Angel Investor",
        "location": "Chennai", "investment_range": "₹10 Lakhs - ₹1 Crore", "preferred_industries": "HealthTech, EdTech, Consumer Apps",
        "email": "arjun@nextwaveangels.com", "bio": "I mentor founders and help in scaling product and customer acquisition."
    },
    {
        "id": 6, "investor_name": "Meera Iyer", "firm_name": "GreenImpact Capital", "investor_type": "VC",
        "location": "Bangalore", "investment_range": "₹30 Lakhs - ₹3 Crore", "preferred_industries": "CleanTech, Mobility, Sustainability",
        "email": "meera@greenimpact.in", "bio": "Supporting eco-friendly solutions and sustainable innovation startups."
    },
    {
        "id": 7, "investor_name": "Suresh Patel", "firm_name": "ScaleUp Fund", "investor_type": "VC",
        "location": "Mumbai", "investment_range": "₹50 Lakhs - ₹10 Crore", "preferred_industries": "FinTech, SaaS, AI",
        "email": "suresh@scaleupfund.in", "bio": "Investing in high-growth startups with strong traction and market fit."
    },
    {
        "id": 8, "investor_name": "Divya Nair", "firm_name": "WomenLead Angels", "investor_type": "Angel Investor",
        "location": "Kerala", "investment_range": "₹5 Lakhs - ₹40 Lakhs", "preferred_industries": "Women-led startups, HealthTech, EdTech",
        "email": "divya@womenlead.org", "bio": "Passionate about supporting women founders and impactful startups."
    },
    {
        "id": 9, "investor_name": "Vikram Singh", "firm_name": "TechBridge Partners", "investor_type": "Corporate Investor",
        "location": "Delhi", "investment_range": "₹25 Lakhs - ₹5 Crore", "preferred_industries": "AI, CyberSecurity, SaaS",
        "email": "vikram@techbridge.in", "bio": "I invest in tech startups with enterprise-ready products."
    },
    {
        "id": 10, "investor_name": "Lavanya Ramesh", "firm_name": "StartupBooster Ventures", "investor_type": "Angel Investor",
        "location": "Madurai", "investment_range": "₹5 Lakhs - ₹30 Lakhs", "preferred_industries": "AgriTech, EdTech, RetailTech",
        "email": "lavanya@startupbooster.in", "bio": "Interested in supporting regional startups with innovative solutions."
    }
]

def seed():
    print("Seeding investors...")
    db = SessionLocal()
    try:
        count = 0
        for data in investors_data:
            # 1. Create/Get User
            user = db.query(User).filter(User.email == data["email"]).first()
            if not user:
                user = User(
                    email=data["email"],
                    password_hash=get_password_hash("password"),
                    role="investor"
                )
                db.add(user)
                db.commit()
                db.refresh(user)
                print(f"Created user {user.email}")
            
            # 2. Create/Get InvestorProfile
            profile = db.query(InvestorProfile).filter(InvestorProfile.user_id == user.id).first()
            if not profile:
                profile = InvestorProfile(
                    user_id=user.id,
                    investor_name=data["investor_name"],
                    contact_name=data["investor_name"], # Fallback/Sync
                    firm_name=data["firm_name"],
                    investor_type=data["investor_type"],
                    location=data["location"],
                    investment_range=data["investment_range"],
                    preferred_industries=data["preferred_industries"],
                    focus_industries=data["preferred_industries"], # Sync
                    bio=data["bio"],
                    preferred_stage="Early" # Default
                )
                db.add(profile)
                count += 1
            else:
                # Update existing
                profile.investor_name = data["investor_name"]
                profile.contact_name = data["investor_name"]
                profile.firm_name = data["firm_name"]
                profile.investor_type = data["investor_type"]
                profile.location = data["location"]
                profile.investment_range = data["investment_range"]
                profile.preferred_industries = data["preferred_industries"]
                profile.focus_industries = data["preferred_industries"]
                profile.bio = data["bio"]
                count += 1
        
        db.commit()
        print(f"Seeded/Updated {count} investor profiles.")
    except Exception as e:
        print(f"Error seeding: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed()
