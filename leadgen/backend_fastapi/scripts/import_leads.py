import pandas as pd
import sys
import os
import asyncio
from sqlalchemy.future import select
from passlib.context import CryptContext

# Add the parent directory to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import AsyncSessionLocal, Base
from app.models import Lead, User

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

async def import_leads():
    # Correct path to data file inside container
    data_file = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data", "business_dataset.csv")
    if not os.path.exists(data_file):
        print(f"Error: Data file not found at {data_file}")
        return

    print(f"Reading CSV data from {data_file}...")
    # Read CSV in chunks
    chunk_size = 5000
    try:
        chunks = pd.read_csv(data_file, chunksize=chunk_size, low_memory=False)
    except Exception as e:
        print(f"Error reading CSV: {e}")
        return
    
    async with AsyncSessionLocal() as db:
        print("Checking default user...")
        admin_email = "admin@example.com"
        result = await db.execute(select(User).filter(User.email == admin_email))
        admin_user = result.scalars().first()
        
        if not admin_user:
            print(f"Creating default user {admin_email}...")
            hashed_password = pwd_context.hash("admin123")
            admin_user = User(
                email=admin_email,
                password_hash=hashed_password,
                role="admin"
            )
            db.add(admin_user)
            await db.commit()
            await db.refresh(admin_user)
            print("Default user created.")
        else:
            print(f"Default user exists (ID: {admin_user.id}).")

        total_imported = 0
        
        for chunk in chunks:
            leads_to_insert = []
            for _, row in chunk.iterrows():
                # Correct column names based on peek: 'BUSINESS NAME', 'SIC NAME1', 'SALES VOLUME', 'MAILING CITY', 'MAILING STATE', 'EMAIL'
                name = row.get('BUSINESS NAME')
                if pd.isna(name) or str(name).strip() == "":
                    continue

                city = str(row.get('MAILING CITY', '')).strip()
                state = str(row.get('MAILING STATE', '')).strip()
                location = f"{city}, {state}".strip(', ')
                if not location or location == "nan, nan":
                    location = "Global"

                lead = Lead(
                    user_id=admin_user.id,
                    profile_name=str(name),
                    industry=str(row.get('SIC NAME1', 'General')),
                    revenue=str(row.get('SALES VOLUME', 'Unknown')),
                    location=location,
                    email=str(row.get('EMAIL', '')) if not pd.isna(row.get('EMAIL')) else None,
                    status="Active"
                )
                leads_to_insert.append(lead)
            
            if leads_to_insert:
                db.add_all(leads_to_insert)
                try:
                    await db.commit()
                    total_imported += len(leads_to_insert)
                    print(f"Imported {total_imported} leads so far...")
                    # Limit to 10k for now to avoid huge DB in dev, or remove if you want full 200MB
                    if total_imported >= 10000:
                         print("Reached 10,000 leads (Dev Limit). Stopping.")
                         break
                except Exception as e:
                    print(f"Error committing batch: {e}")
                    await db.rollback()
                
        print(f"Successfully imported total {total_imported} leads.")

if __name__ == "__main__":
    try:
        asyncio.run(import_leads())
    except Exception as e:
        print(f"An error occurred: {e}")
