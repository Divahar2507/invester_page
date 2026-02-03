import asyncio
from app.database import AsyncSessionLocal
from sqlalchemy import text

async def check():
    async with AsyncSessionLocal() as db:
        res = await db.execute(text("SELECT count(*) FROM leads"))
        print(f"LEAD_COUNT: {res.scalar()}")

if __name__ == "__main__":
    asyncio.run(check())
