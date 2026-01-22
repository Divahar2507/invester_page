from app.database import SessionLocal
from app.models.core import User, StartupProfile, Pitch, Watchlist
import datetime

db = SessionLocal()

try:
    # 1. Get Startup User
    startup_user = db.query(User).filter(User.role == 'startup').first()
    if not startup_user:
        print("No startup user found. Creating one.")
        from app.auth import get_password_hash
        startup_user = User(email="teststartup@example.com", password_hash=get_password_hash("demo123"), role="startup")
        db.add(startup_user)
        db.commit()
    
    print(f"Using Startup User ID: {startup_user.id}")

    # 2. Get/Create Startup Profile
    profile = db.query(StartupProfile).filter(StartupProfile.user_id == startup_user.id).first()
    if not profile:
        print("Creating Startup Profile...")
        profile = StartupProfile(
            user_id=startup_user.id,
            company_name="Test Tech Inc",
            industry="Technology",
            funding_stage="Seed",
            description="A revolutionary platform for testing."
        )
        db.add(profile)
        db.commit()
    
    print(f"Using Startup Profile ID: {profile.id}")

    # 3. Create Pitch
    pitch = db.query(Pitch).filter(Pitch.startup_id == profile.id).first()
    if not pitch:
        print("Creating Pitch...")
        pitch = Pitch(
            startup_id=profile.id,
            title="Test Pitch Deck",
            description="Detailed description of the test tech.",
            status="active",
            funding_stage="Seed",
            raising_amount="$1M",
            industry="Technology",
            tags="AI,SaaS",
            created_at=datetime.datetime.now()
        )
        db.add(pitch)
        db.commit()
        print("Pitch created.")
    else:
        print(f"Pitch already exists ID: {pitch.id}")
        # Ensure status is active for visibility
        pitch.status = "active"
        db.commit()

    # 4. Clear Watchlist for the investor (we will test adding it)
    # Assuming investor user is divahar2507@gmail.com or ID 1?
    investor = db.query(User).filter(User.role == 'investor').first()
    if investor:
        print(f"Clearing watchlist for Investor ID: {investor.id}")
        db.query(Watchlist).filter(Watchlist.user_id == investor.id).delete()
        db.commit()

except Exception as e:
    print(f"Error: {e}")
    db.rollback()
finally:
    db.close()
