
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

try:
    from app.database import SessionLocal
    from app.models.core import User, InvestorProfile
    from app.utils.security import get_password_hash
except ImportError:
    from database import SessionLocal
    from models.core import User, InvestorProfile
    from utils.security import get_password_hash

def create_investor():
    db = SessionLocal()
    try:
        email = "investor@demo.com"
        existing = db.query(User).filter(User.email == email).first()
        if existing:
            print(f"User {email} already exists.")
            return

        user = User(
            email=email,
            password_hash=get_password_hash("demo123"),
            role="investor"
        )
        db.add(user)
        db.flush()
        
        investor_profile = InvestorProfile(
            user_id=user.id,
            firm_name="VentureFlow Capital",
            contact_name="Demo Investor",
            focus_industries="SaaS, AI, CleanTech",
            preferred_stage="Seed",
            min_check_size=50000,
            max_check_size=5000000
        )
        db.add(investor_profile)
        db.commit()
        print(f"Successfully created investor: {email}")
        
    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_investor()
