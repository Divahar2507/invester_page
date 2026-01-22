
from app.database import SessionLocal
from app.models.core import Pitch

def fix_statuses():
    db = SessionLocal()
    try:
        pitches = db.query(Pitch).all()
        print(f"Found {len(pitches)} pitches.")
        count = 0
        for p in pitches:
            if p.status != 'active':
                p.status = 'active'
                count += 1
        
        db.commit()
        print(f"Updated {count} pitches to 'active' status.")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    fix_statuses()
