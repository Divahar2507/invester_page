from app.database import SessionLocal
from app.models.core import User

db = SessionLocal()

print("--- Checking for prithivitwts@gmail.com ---")
user = db.query(User).filter(User.email == 'prithivitwts@gmail.com').first()
if user:
    print(f"User Found: ID={user.id}, Email={user.email}, Role={user.role}")
else:
    print("User NOT found")

db.close()
