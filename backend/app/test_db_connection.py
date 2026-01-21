"""
Comprehensive Database Connection Test
"""
from app.database import SessionLocal, engine
from app.models.core import (
    User, InvestorProfile, StartupProfile, Pitch, 
    Investment, Connection, Message, Notification, Watchlist
)
from sqlalchemy import text

print("=" * 60)
print("DATABASE CONNECTION TEST")
print("=" * 60)

try:
    # Test 1: Engine Connection
    print("\n1️⃣ Testing Engine Connection...")
    with engine.connect() as conn:
        result = conn.execute(text("SELECT version();"))
        version = result.fetchone()[0]
        print(f"✅ PostgreSQL Version: {version.split(',')[0]}")
    
    # Test 2: Session Creation
    print("\n2️⃣ Testing Session Creation...")
    db = SessionLocal()
    print("✅ Session Created Successfully")
    
    # Test 3: All Tables Accessible
    print("\n3️⃣ Testing Table Access...")
    tables_data = {
        "users": db.query(User).count(),
        "investor_profiles": db.query(InvestorProfile).count(),
        "startup_profiles": db.query(StartupProfile).count(),
        "pitches": db.query(Pitch).count(),
        "investments": db.query(Investment).count(),
        "connections": db.query(Connection).count(),
        "messages": db.query(Message).count(),
        "notifications": db.query(Notification).count(),
        "watchlist": db.query(Watchlist).count(),
    }
    
    for table, count in tables_data.items():
        print(f"   ✅ {table}: {count} records")
    
    # Test 4: Check Relationships
    print("\n4️⃣ Testing Table Relationships...")
    
    # Get a user with investor profile
    investor_user = db.query(User).filter(User.role == "investor").first()
    if investor_user and investor_user.investor_profile:
        print(f"   ✅ User ↔ InvestorProfile: Working")
        print(f"      User: {investor_user.email}")
        print(f"      Firm: {investor_user.investor_profile.firm_name}")
    else:
        print("   ⚠️ No investor profile found")
    
    # Get a startup with pitches
    startup_user = db.query(User).filter(User.role == "startup").first()
    if startup_user and startup_user.startup_profile:
        print(f"   ✅ User ↔ StartupProfile: Working")
        startup_pitches = db.query(Pitch).filter(
            Pitch.startup_id == startup_user.startup_profile.id
        ).count()
        print(f"      Startup: {startup_user.startup_profile.company_name}")
        print(f"      Pitches: {startup_pitches}")
    else:
        print("   ⚠️ No startup profile found")
    
    # Test 5: Complex Query
    print("\n5️⃣ Testing Complex Queries...")
    active_pitches = db.query(Pitch).filter(Pitch.status == "active").count()
    print(f"   ✅ Active Pitches: {active_pitches}")
    
    total_investment = db.query(Investment).count()
    print(f"   ✅ Total Investments: {total_investment}")
    
    db.close()
    
    print("\n" + "=" * 60)
    print("✅ DATABASE CONNECTION: FULLY OPERATIONAL")
    print("=" * 60)
    
except Exception as e:
    print(f"\n❌ ERROR: {str(e)}")
    import traceback
    traceback.print_exc()
