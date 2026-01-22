from sqlalchemy import create_engine, text
import os

# Get DB URL from env or use default for local testing
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:Diva@2004@localhost:5433/pitch_platform")

print(f"Connecting to: {DATABASE_URL}")
engine = create_engine(DATABASE_URL)

alterations = [
    "ALTER TABLE investments ADD COLUMN IF NOT EXISTS equity_stake FLOAT;",
    "ALTER TABLE investments ADD COLUMN IF NOT EXISTS document_url VARCHAR;"
]

try:
    with engine.connect() as conn:
        for sql in alterations:
            print(f"Executing: {sql}")
            conn.execute(text(sql))
            conn.commit()
        print("\n✅ Investment schema fixed successfully!")
except Exception as e:
    print(f"❌ Error: {e}")
