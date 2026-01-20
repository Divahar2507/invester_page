from app.database import SessionLocal
from app.models.core import User, Pitch

db = SessionLocal()
user_count = db.query(User).count()
pitch_count = db.query(Pitch).count()

print(f"Users: {user_count}")
print(f"Pitches: {pitch_count}")

if pitch_count > 0:
    for p in db.query(Pitch).limit(5).all():
        print(f"Pitch: {p.title}, Status: {p.status}")

db.close()
