
import sys
import os

# Add backend directory to sys.path
current_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.dirname(current_dir)
project_dir = os.path.dirname(backend_dir)

sys.path.append(project_dir)
sys.path.append(backend_dir)

from app.database import SessionLocal
from app.models.core import InvestorProfile

def check():
    db = SessionLocal()
    try:
        profiles = db.query(InvestorProfile).limit(5).all()
        print(f"Found {len(profiles)} profiles.")
        for p in profiles:
            print(f"- {p.investor_name} ({p.firm_name}) - {p.investor_type}")
    except Exception as e:
        print(f"Error checking: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    check()
