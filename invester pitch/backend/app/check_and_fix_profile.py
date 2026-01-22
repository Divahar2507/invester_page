from app.database import SessionLocal
from app.models.core import InvestorProfile, User
from sqlalchemy import text

db = SessionLocal()

print("--- Checking Investor Profile for ID 1 ---")
try:
    # check if user exists
    user = db.query(User).filter(User.id == 1).first()
    if not user:
        print("User ID 1 not found")
    else:
        print(f"User found: {user.email}, Role: {user.role}")

        # Check raw SQL to avoid model mismatch issues
        result = db.execute(text("SELECT * FROM investor_profiles WHERE user_id = 1")).fetchone()
        if result:
            print(f"Profile Found (Raw): {result}")
        else:
            print("Profile NOT FOUND in DB (Raw Query)")
            
            # Create if missing
            if user.role == 'investor':
                print("Creating default profile...")
                ip = InvestorProfile(
                    user_id=1,
                    firm_name="Test VC Firm",
                    investor_type="VC",
                    preferred_stage="Seed",
                    contact_name="Test Investor"
                )
                db.add(ip)
                db.commit()
                print("Created InvestorProfile for ID 1")
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
finally:
    db.close()
