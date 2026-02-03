import pandas as pd
import sys
import os
import asyncio
from sqlalchemy import select, text, func
from passlib.context import CryptContext

# Add the parent directory to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import AsyncSessionLocal, engine
from app.models import Lead, User, Influencer

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

async def seed_data():
    data_file = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data", "business_dataset.csv")
    
    if not os.path.exists(data_file):
        print(f"Error: Data file not found at {data_file}")
        return

    print(f"Starting seed process from {data_file}...")

    async with AsyncSessionLocal() as db:
        # 1. Ensure Admin User
        admin_email = "admin@example.com"
        result = await db.execute(select(User).where(User.email == admin_email))
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
            print("Default admin user created.")
        else:
            print(f"Default admin user exists (ID: {admin_user.id}).")

        # 2. Add Sample Influencers (since no real data found)
        inf_count = await db.scalar(select(func.count(Influencer.id)))
        if inf_count == 0:
            print("Adding sample influencers...")
            sample_influencers = [
                Influencer(name="Alex Tech", email="alex@example.com", platform="Instagram", followers=50000, category="Technology", handle="@alex_tech", charge_per_post=200.0, verified=True),
                Influencer(name="Sarah Style", email="sarah@example.com", platform="TikTok", followers=120000, category="Fashion", handle="@sarah_style", charge_per_post=500.0, verified=True),
                Influencer(name="Mike Muscle", email="mike@example.com", platform="YouTube", followers=85000, category="Fitness", handle="MikeMuscleFitness", charge_per_post=350.0, verified=False),
                Influencer(name="Chef Elena", email="elena@example.com", platform="Instagram", followers=250000, category="Food", handle="@chef_elena", charge_per_post=1000.0, verified=True),
                Influencer(name="Travel Tom", email="tom@example.com", platform="YouTube", followers=45000, category="Travel", handle="TravelWithTom", charge_per_post=150.0, verified=False),
            ]
            db.add_all(sample_influencers)
            await db.commit()
            print(f"Added {len(sample_influencers)} sample influencers.")

        # 3. Import Leads from CSV
        print("Importing leads (this may take a few minutes)...")
        # Check current count
        current_leads = await db.scalar(select(func.count(Lead.id)))
        if current_leads > 100: # Some data already exists
             print(f"Database already has {current_leads} leads. Skipping bulk import.")
        else:
            chunk_size = 10000
            total_target = 50000 # Import 50k for a good balanced dataset
            total_imported = 0
            
            try:
                # Read CSV in chunks
                for chunk in pd.read_csv(data_file, chunksize=chunk_size, low_memory=False):
                    leads_to_insert = []
                    for _, row in chunk.iterrows():
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
                        await db.commit()
                        total_imported += len(leads_to_insert)
                        print(f"Imported {total_imported} leads...")
                    
                    if total_imported >= total_target:
                        print(f"Reached target of {total_target} leads. Stopping.")
                        break
            except Exception as e:
                print(f"Error during leads import: {e}")
                await db.rollback()

        # 4. Optimize
        print("Creating index for performance...")
        try:
            await db.execute(text("CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads (created_at DESC);"))
            await db.commit()
            print("Index created.")
        except Exception as e:
             print(f"Index check failed (non-critical): {e}")

    print("Seed process completed successfully.")

if __name__ == "__main__":
    asyncio.run(seed_data())
