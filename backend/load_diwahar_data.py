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
                        funding_stage="Seed", # Default since not in CSV
                        vision=description[:500] if description else None, # Use part of desc as vision? Or just leave null.
                        problem=None,
                        solution=None,
                        description=description,
                        city=row.get("city"),
                        state=row.get("state"),
                        pincode=row.get("pincode"),
                        contact_address=row.get("contact_address"),
                        mobile=row.get("mobile1"),
                        email_verified=parse_bool(row.get("email_verified")),
                        mobile_verified=parse_bool(row.get("mobile_verified"))
                    )
                    
                    db.add(profile)
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
