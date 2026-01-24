import sys
import os
import asyncio
from sqlalchemy import text, select, func

sys.path.append(os.getcwd())
from app.database import AsyncSessionLocal
from app.models import Lead

async def optimize():
    async with AsyncSessionLocal() as db:
        print("Checking Lead count...")
        count = await db.scalar(select(func.count(Lead.id)))
        print(f"Total Leads: {count}")
        
        print("Adding Index to leads.created_at for faster sorting...")
        try:
            # PostgreSQL syntax for creating index concurrently (cannot be run in transaction block usually, 
            # but standard create index is fine for this size likely).
            # "CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads (created_at DESC);"
            await db.execute(text("CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads (created_at DESC);"))
            await db.commit()
            print("Index created successfully.")
        except Exception as e:
            print(f"Index creation failed (might already exist or permission error): {e}")

if __name__ == "__main__":
    asyncio.run(optimize())
