import asyncio
import sys
import os
from sqlalchemy import text

# Add the parent directory to sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import AsyncSessionLocal

async def check_data():
    async with AsyncSessionLocal() as db:
        print("Checking database content...")
        
        # Check Users
        result_users = await db.execute(text("SELECT count(*) FROM users"))
        count_users = result_users.scalar()
        print(f"Total Users: {count_users}")
        
        # Check Influencers
        result_influencers = await db.execute(text("SELECT count(*) FROM influencers"))
        count_influencers = result_influencers.scalar()
        print(f"Total Influencers: {count_influencers}")

        # Check Leads
        result_leads = await db.execute(text("SELECT count(*) FROM leads"))
        count_leads = result_leads.scalar()
        print(f"Total Leads: {count_leads}")
        
        # List some users to verify roles
        result_user_details = await db.execute(text("SELECT id, email, role FROM users LIMIT 5"))
        users = result_user_details.fetchall()
        print("\nSample Users:")
        for u in users:
            print(f"ID: {u.id}, Email: {u.email}, Role: {u.role}")

if __name__ == "__main__":
    if sys.platform == 'win32':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    asyncio.run(check_data())
