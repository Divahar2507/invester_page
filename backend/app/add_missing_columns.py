"""
Script to add missing columns to the database tables
"""
from sqlalchemy import create_engine, text
import os

DATABASE_URL = "postgresql://postgres:Diva@2004@localhost:5433/pitch_platform"

engine = create_engine(DATABASE_URL)

# SQL commands to add missing columns
alterations = [
    # Pitch table
    "ALTER TABLE pitches ADD COLUMN IF NOT EXISTS valuation VARCHAR;",
    "ALTER TABLE pitches ADD COLUMN IF NOT EXISTS industry VARCHAR;",
    "ALTER TABLE pitches ADD COLUMN IF NOT EXISTS funding_stage VARCHAR;",
    "ALTER TABLE pitches ADD COLUMN IF NOT EXISTS amount_seeking INTEGER;",
    "ALTER TABLE pitches ADD COLUMN IF NOT EXISTS business_model VARCHAR;",
    "ALTER TABLE pitches ADD COLUMN IF NOT EXISTS revenue_model VARCHAR;",
    "ALTER TABLE pitches ADD COLUMN IF NOT EXISTS team_size INTEGER;",
    "ALTER TABLE pitches ADD COLUMN IF NOT EXISTS tags VARCHAR;",
    "ALTER TABLE pitches ADD COLUMN IF NOT EXISTS location VARCHAR;",
    
    # Investment table
    "ALTER TABLE investments ADD COLUMN IF NOT EXISTS status VARCHAR DEFAULT 'Active';",
    
    # InvestorProfile table
    "ALTER TABLE investor_profiles ADD COLUMN IF NOT EXISTS investor_name VARCHAR;",
    "ALTER TABLE investor_profiles ADD COLUMN IF NOT EXISTS investor_type VARCHAR;",
    "ALTER TABLE investor_profiles ADD COLUMN IF NOT EXISTS location VARCHAR;",
    "ALTER TABLE investor_profiles ADD COLUMN IF NOT EXISTS investment_range VARCHAR;",
    "ALTER TABLE investor_profiles ADD COLUMN IF NOT EXISTS preferred_industries VARCHAR;",
]

try:
    with engine.connect() as conn:
        for sql in alterations:
            print(f"Executing: {sql}")
            conn.execute(text(sql))
            conn.commit()
        print("\n✅ All columns added successfully!")
except Exception as e:
    print(f"❌ Error: {e}")
