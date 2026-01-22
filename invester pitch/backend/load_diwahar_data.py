import csv
import os
from sqlalchemy.orm import Session
from app.database import SessionLocal, engine
from app.models.core import User, StartupProfile, Pitch
from app.utils.security import get_password_hash
import re

# Use relative path from script location
import pathlib
CSV_PATH = str(pathlib.Path(__file__).parent / "data" / "diwahar.csv")

def sanitize_email(company_name):
    # Remove non-alphanumeric characters and convert to lowercase
    sanitized = re.sub(r'[^a-zA-Z0-9]', '', company_name).lower()
    return f"{sanitized}@example.com"

def parse_bool(value):
    if value and str(value).strip().lower() == "verified":
        return True
    return False

def load_data():
    db = SessionLocal()
    try:
        if not os.path.exists(CSV_PATH):
            print(f"File not found: {CSV_PATH}")
            return

        with open(CSV_PATH, 'r', encoding='utf-8', errors='replace') as f:
            reader = csv.DictReader(f)
            
            # Print headers for debugging safely
            # print(f"Headers: {reader.fieldnames}")

            count = 0
            existing_count = 0
            
            default_password_hash = get_password_hash("password")

            for row in reader:
                try:
                    company_name = row.get("company_name", "").strip()
                    if not company_name:
                        continue

                    # Check if company already exists to avoid duplicates
                    existing_startup = db.query(StartupProfile).filter(StartupProfile.company_name == company_name).first()
                    if existing_startup:
                        existing_count += 1
                        print(f"Skipping existing startup: {company_name}")
                        continue

                    email = sanitize_email(company_name)
                    
                    # Create User first
                    # Check if user email exists
                    existing_user = db.query(User).filter(User.email == email).first()
                    if not existing_user:
                        user = User(
                            email=email, 
                            password_hash=default_password_hash, 
                            role="startup"
                        )
                        db.add(user)
                        db.commit()
                        db.refresh(user)
                    else:
                        user = existing_user

                    # Create Startup Profile
                    description = row.get("glusr_usr_company_desc", "")
                    industry = row.get("industry", "Unknown")
                    if not industry:
                        industry = "Unknown"
                        
                    profile = StartupProfile(
                        user_id=user.id,
                        company_name=company_name,
                        industry=industry,
                        funding_stage="Seed",
                        vision=description[:200] if description else f"Leading the future of {industry}.",
                        problem=f"Inefficiency in the current {industry} landscape.",
                        solution=f"Our proprietary technology automates {industry} workflows.",
                        description=description or f"Revolutionizing {industry} with smart technology.",
                        city=row.get("city") or "Mumbai",
                        state=row.get("state") or "Maharashtra",
                        pincode=row.get("pincode") or "400001",
                        contact_address=row.get("contact_address") or "India Office",
                        mobile=row.get("mobile1") or "9876543210",
                        email_verified=parse_bool(row.get("email_verified")),
                        mobile_verified=parse_bool(row.get("mobile_verified"))
                    )
                    
                    db.add(profile)
                    db.commit()
                    db.refresh(profile)

                    # Create a default Pitch for the startup so it appears in the feed
                    pitch = Pitch(
                        startup_id=profile.id,
                        title=f"{company_name} - {industry} Transformation",
                        description=description or f"Transforming {industry} with cutting-edge solutions.",
                        industry=industry,
                        funding_stage="Seed",
                        status="active",
                        raising_amount="$500k",
                        equity_percentage="10%",
                        location=f"{row.get('city') or 'Mumbai'}, India",
                        valuation="$5M",
                        tags=f"{industry},Innovation,Tech",
                        pitch_file_url="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
                    )
                    db.add(pitch)
                    db.commit()

                    count += 1
                    
                    if count % 10 == 0:
                        print(f"Processed {count} records...")

                except Exception as e:
                    print(f"Error processing row {row}: {e}")
                    db.rollback()
            
            print(f"Successfully loaded {count} new startups.")
            print(f"Skipped {existing_count} existing startups.")

    except Exception as e:
        print(f"Global error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    load_data()
