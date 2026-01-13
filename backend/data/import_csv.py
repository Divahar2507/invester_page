import csv
import os
import sys
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from passlib.context import CryptContext

# Add project root to path to import app modules
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.models.core import User, StartupProfile, Pitch
from app.database import Base

DATABASE_URL = "postgresql://postgres:Diva%402004@db:5432/pitch_platform"
CSV_PATH = "/app/data/diwahar.csv"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_db():
    db = SessionLocal()
    try:
        return db
    finally:
        db.close()

def import_csv():
    db = SessionLocal()
    try:
        with open(CSV_PATH, mode='r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            count = 0
            for row in reader:
                try:
                    company_name = row.get('company_name', '').strip()
                    if not company_name:
                        continue
                    
                    # Generate a unique dummy email
                    clean_name = "".join(filter(str.isalnum, company_name.lower()))
                    email = f"startup_{clean_name}_{count}@example.com"
                    
                    # Check if user/startup already exists
                    existing_startup = db.query(StartupProfile).filter(StartupProfile.company_name == company_name).first()
                    if existing_startup:
                        continue

                    # Create User
                    user = User(
                        email=email,
                        password_hash=pwd_context.hash("password123"),
                        role="startup"
                    )
                    db.add(user)
                    db.flush() # Get user ID

                    # Create Startup Profile
                    profile = StartupProfile(
                        user_id=user.id,
                        company_name=company_name,
                        industry=row.get('industry', 'Technology'),
                        funding_stage="Seed", # Default
                        description=row.get('glusr_usr_company_desc', ''),
                        city=row.get('city', ''),
                        state=row.get('state', ''),
                        pincode=row.get('pincode', ''),
                        contact_address=row.get('contact_address', ''),
                        mobile=row.get('mobile1', ''),
                        email_verified=row.get('email_verified') == 'Verified',
                        mobile_verified=row.get('mobile_verified') == 'Verified'
                    )
                    db.add(profile)
                    db.flush() # Get profile ID

                    # Create Pitch
                    pitch = Pitch(
                        startup_id=profile.id,
                        title=f"{company_name} - {row.get('industry', 'Innovation')}",
                        description=row.get('glusr_usr_company_desc', 'Transforming the industry with innovation.'),
                        industry=row.get('industry', 'Technology'),
                        funding_stage="Seed",
                        location=f"{row.get('city', 'Chennai')}, {row.get('state', 'India')}",
                        status="shared"
                    )
                    db.add(pitch)
                    
                    count += 1
                    if count % 100 == 0:
                        db.commit()
                        print(f"Imported {count} startups...")
                        
                except Exception as e:
                    print(f"Error importing row {company_name}: {e}")
                    db.rollback()
            
            db.commit()
            print(f"Finished. Total imported: {count}")

    except Exception as e:
        print(f"Script error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    import_csv()
