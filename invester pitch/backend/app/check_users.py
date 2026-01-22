from app.database import SessionLocal
from app.models.core import User

db = SessionLocal()
print("--- USERS ---")
users = db.query(User).all()
for u in users:
    print(f"ID: {u.id} | Email: {u.email} | Role: {u.role}")

db.close()
