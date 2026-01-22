from app.database import SessionLocal
from app.models.core import User, InvestorProfile, Investment, Connection

db = SessionLocal()

print("--- Users (Investors) ---")
investors = db.query(User).filter(User.role == "investor").all()
for u in investors:
    print(f"ID: {u.id}, Email: {u.email}, Role: {u.role}")
    profile = db.query(InvestorProfile).filter(InvestorProfile.user_id == u.id).first()
    if profile:
        print(f"  Profile: {profile.firm_name}, {profile.investor_type}")
    else:
        print("  Profile: NONE")
    
    investments = db.query(Investment).filter(Investment.investor_id == (profile.id if profile else -1)).all()
    print(f"  Investments ({len(investments)}):")
    for inv in investments:
        print(f"    - {inv.startup_name}: ${inv.amount}")

print("\n--- Connections ---")
connections = db.query(Connection).all()
print(f"Total Connections: {len(connections)}")
for c in connections:
    print(f"  {c.requester_id} -> {c.receiver_id} ({c.status})")

db.close()
