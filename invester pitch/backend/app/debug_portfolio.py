from app.database import SessionLocal
from app.models.core import User, InvestorProfile, Investment

db = SessionLocal()

print("--- DEBUGGING PORTFOLIO DATA ---")

# 1. Get Investor User
user_email = "investor@test.com"
user = db.query(User).filter(User.email == user_email).first()

if not user:
    print(f"User {user_email} NOT FOUND.")
else:
    print(f"User Found: ID={user.id}, Role={user.role}")
    
    # 2. Get Profile
    profile = db.query(InvestorProfile).filter(InvestorProfile.user_id == user.id).first()
    if not profile:
        print("  -> NO InvestorProfile found for this user.")
    else:
        print(f"  -> InvestorProfile Found: ID={profile.id}, Firm={profile.firm_name}")
        
        # 3. Get Investments
        investments = db.query(Investment).filter(Investment.investor_id == profile.id).all()
        print(f"  -> Found {len(investments)} Investment records.")
        for inv in investments:
            print(f"     - ID={inv.id}, Startup={inv.startup_name}, Amount=${inv.amount}, Status={inv.status}")

print("\n--- ALL INVESTMENTS IN DB ---")
all_invs = db.query(Investment).all()
for inv in all_invs:
    print(f"ID={inv.id}, InvestorID={inv.investor_id}, Startup={inv.startup_name}")

db.close()
