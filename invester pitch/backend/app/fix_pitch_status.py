
import sys
import os

# Add parent dir to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

try:
    from app.database import SessionLocal
    from app.models.core import Pitch
except ImportError:
    from database import SessionLocal
    from models.core import Pitch

def fix_status():
    session = SessionLocal()
    try:
        pitches = session.query(Pitch).filter(Pitch.status == 'draft').all()
        print(f"Found {len(pitches)} draft pitches. Updating to 'active'...")
        for p in pitches:
            p.status = 'active'
        session.commit()
        print("Done!")
    except Exception as e:
        session.rollback()
        print(f"Error: {e}")
    finally:
        session.close()

if __name__ == "__main__":
    fix_status()
