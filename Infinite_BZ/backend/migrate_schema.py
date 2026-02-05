import asyncio
from sqlalchemy import text
from app.core.database import engine

async def migrate():
    print("Starting migration...")
    async with engine.begin() as conn:
        print("Adding event_type column to event table...")
        await conn.execute(text("ALTER TABLE event ADD COLUMN IF NOT EXISTS event_type VARCHAR DEFAULT 'Meetup';"))
        
    print("Migration complete!")

if __name__ == "__main__":
    asyncio.run(migrate())
