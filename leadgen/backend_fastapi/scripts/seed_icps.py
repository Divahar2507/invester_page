import asyncio
import sys
import os
from sqlalchemy import select
from passlib.context import CryptContext

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import AsyncSessionLocal
from app.models import ICP, User

async def seed_icps():
    async with AsyncSessionLocal() as db:
        # 1. Get the admin user or first user to assign ICPs to
        # Assuming user_id=2 is Admin as per previous steps, or user_id=1 is a user.
        # Let's seed for both or check.
        result = await db.execute(select(User).order_by(User.id))
        users = result.scalars().all()
        
        if not users:
            print("No users found. Run seed_full.py first.")
            return

        print(f"Found {len(users)} users. Seeding ICPs...")

        # Define some sample ICPs
        sample_icps = [
            {
                "profile_name": "SaaS Tech Startups",
                "industry": "Technology",
                "revenue": "All",
                "location": "Global"
            },
            {
                "profile_name": "Healthcare Providers (US)",
                "industry": "Healthcare",
                "revenue": "$5M - $50M",
                "location": "Global" 
            },
            {
                "profile_name": "Retail Giants",
                "industry": "Retail",
                "revenue": "$1B+",
                "location": "Global"
            }
        ]

        count = 0
        for user in users:
            # Check if user already has ICPs
            existing = await db.execute(select(ICP).where(ICP.user_id == user.id))
            if existing.scalars().first():
                print(f"User {user.email} already has ICPs. Skipping.")
                continue
            
            for item in sample_icps:
                new_icp = ICP(
                    user_id=user.id,
                    profile_name=item["profile_name"],
                    industry=item["industry"],
                    revenue=item["revenue"],
                    location=item["location"]
                )
                db.add(new_icp)
                count += 1
        
        await db.commit()
        print(f"Seeded {count} ICPs across users.")

if __name__ == "__main__":
    asyncio.run(seed_icps())
