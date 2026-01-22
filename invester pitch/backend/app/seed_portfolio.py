
import sys
import os
import random
from datetime import datetime, timedelta

# Add backend directory to sys.path
current_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.dirname(current_dir)
project_dir = os.path.dirname(backend_dir)

sys.path.append(project_dir)
sys.path.append(backend_dir)

from app.database import SessionLocal
from app.models.core import InvestorProfile, Investment

def seed_portfolio():
    print("Seeding portfolio investments...")
    db = SessionLocal()
    try:
        investors = db.query(InvestorProfile).all()
        if not investors:
            print("No investors found. Run seed_investors.py first.")
            return

        startup_names = [
            "TechFlow AI", "GreenEnergy Solutions", "MediCare Plus", "EduSmart learn", 
            "AgriGrow Systems", "FinSecure Labs", "RetailNext", "UrbanLogistics",
            "CloudScale Ops", "DataSense Analytics"
        ]

        count = 0
        for investor in investors:
            # Check if already has investments
            existing = db.query(Investment).filter(Investment.investor_id == investor.id).count()
            if existing > 0:
                print(f"Investor {investor.investor_name} already has investments.")
                continue

            # Add 2-4 random investments per investor
            num_investments = random.randint(2, 4)
            for _ in range(num_investments):
                s_name = random.choice(startup_names)
                # Ensure unique startup per investor (simple check)
                if db.query(Investment).filter(Investment.investor_id == investor.id, Investment.startup_name == s_name).first():
                    continue

                amount = random.randint(10, 500) * 10000 # 100k to 5M
                inv = Investment(
                    investor_id=investor.id,
                    startup_name=s_name,
                    amount=float(amount),
                    date=datetime.now() - timedelta(days=random.randint(10, 700)),
                    round=random.choice(["Seed", "Series A", "Pre-Seed"]),
                    equity_stake=random.uniform(1.0, 15.0),
                    notes=f"Key investment in {s_name}. Strong team.",
                    status="Active"
                )
                db.add(inv)
                count += 1
        
        db.commit()
        print(f"Seeded {count} new investments across investors.")

    except Exception as e:
        print(f"Error seeding portfolio: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_portfolio()
