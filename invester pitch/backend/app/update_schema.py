
import sys
import os
from sqlalchemy import text, inspect

# Add backend directory to sys.path
current_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.dirname(current_dir)
project_dir = os.path.dirname(backend_dir)

sys.path.append(project_dir)
sys.path.append(backend_dir)

from app.database import engine

def update_schema():
    print(f"Connecting to database: {engine.url}")
    inspector = inspect(engine)
    columns = [c['name'] for c in inspector.get_columns('investor_profiles')]
    print(f"Existing columns: {columns}")
    
    with engine.connect() as conn:
        trans = conn.begin()
        try:
            if 'investor_name' not in columns:
                print("Adding investor_name...")
                conn.execute(text("ALTER TABLE investor_profiles ADD COLUMN investor_name VARCHAR"))
            
            if 'investor_type' not in columns:
                print("Adding investor_type...")
                conn.execute(text("ALTER TABLE investor_profiles ADD COLUMN investor_type VARCHAR"))
                
            if 'location' not in columns:
                print("Adding location...")
                conn.execute(text("ALTER TABLE investor_profiles ADD COLUMN location VARCHAR"))
                
            if 'investment_range' not in columns:
                print("Adding investment_range...")
                conn.execute(text("ALTER TABLE investor_profiles ADD COLUMN investment_range VARCHAR"))
                
            if 'preferred_industries' not in columns:
                print("Adding preferred_industries...")
                conn.execute(text("ALTER TABLE investor_profiles ADD COLUMN preferred_industries VARCHAR"))
                
            trans.commit()
            print("Schema update committed.")
        except Exception as e:
            print(f"Error updating schema: {e}")
            trans.rollback()

if __name__ == "__main__":
    update_schema()
