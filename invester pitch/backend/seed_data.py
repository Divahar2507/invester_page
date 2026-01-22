from sqlalchemy.orm import Session
from app.database import SessionLocal, engine
from app.models.core import User, StartupProfile, InvestorProfile, Pitch
from app.utils.security import get_password_hash
import random

def seed_db():
    db = SessionLocal()
    try:
        print("Seeding extended dummy data...")
        
        # 1. Clear existing data (Optional: for clean slate, or just append)
        # db.query(Pitch).delete()
        # db.query(StartupProfile).delete()
        # db.query(InvestorProfile).delete()
        # db.query(User).delete()
        # db.commit()

        password = get_password_hash("password")

        # --- Create Startups ---
        startups_data = [
            {
                "email": "techflow@example.com",
                "company": "TechFlow AI",
                "industry": "Artificial Intelligence",
                "stage": "Seed",
                "vision": "Automating workflows for enterprise.",
                "problem": "Manual data entry is slow.",
                "solution": "AI-driven automation platform.",
                "pitches": [
                    {"title": "Seed Round - TechFlow", "amount": "$500k", "equity": "10%", "desc": "Raising seed to build MVP."}
                ]
            },
            {
                "email": "greenenergy@example.com",
                "company": "GreenFuture",
                "industry": "CleanEnergy",
                "stage": "Series A",
                "vision": "Renewable energy for everyone.",
                "problem": "Fossil fuels are expensive.",
                "solution": "Modular solar panels.",
                "pitches": [
                    {"title": "Series A Growth", "amount": "$2M", "equity": "15%", "desc": "Scaling production."}
                ]
            },
             {
                "email": "medconnect@example.com",
                "company": "MedConnect",
                "industry": "Healthcare",
                "stage": "Pre-Seed",
                "vision": "Connecting patients to doctors instantly.",
                "problem": "Wait times are too long.",
                "solution": "Telehealth mobile app.",
                "pitches": [
                     {"title": "Pre-Seed Run", "amount": "$150k", "equity": "5%", "desc": "Initial development."}
                ]
            },
            {
                "email": "edutech_pro@example.com",
                "company": "EduTech Pro",
                "industry": "Education",
                "stage": "Seed",
                "vision": "Personalized learning for every student.",
                "problem": "One-size-fits-all education fails many.",
                "solution": "AI-adaptive learning curriculum.",
                "pitches": [
                     {"title": "Seed Funding", "amount": "$750k", "equity": "12%", "desc": "Content creation and platform build."}
                ]
            }
        ]

        # ... (imports) ...
        # (Inside seed_db)

        # Helper to get or create user
        def get_or_create_user(email, role):
            user = db.query(User).filter(User.email == email).first()
            if not user:
                user = User(email=email, password_hash=password, role=role)
                db.add(user)
                db.commit()
                db.refresh(user)
            return user

        # --- Create Startups ---
        for s in startups_data:
            user = get_or_create_user(s["email"], "startup")
            
            # Check if profile exists
            if not db.query(StartupProfile).filter(StartupProfile.user_id == user.id).first():
                profile = StartupProfile(
                    user_id=user.id,
                    company_name=s["company"],
                    industry=s["industry"],
                    funding_stage=s["stage"],
                    vision=s["vision"],
                    problem=s["problem"],
                    solution=s["solution"]
                )
                db.add(profile)
                db.commit()
                db.refresh(profile)
                print(f"Created/Found Startup: {s['company']}")

                # Only add pitches if profile was just created (or check if pitches exist)
                if db.query(Pitch).filter(Pitch.startup_id == profile.id).count() == 0:
                    for p in s["pitches"]:
                        pitch = Pitch(
                            startup_id=profile.id,
                            title=p["title"],
                            description=p["desc"],
                            raising_amount=p["amount"],
                            equity_percentage=p["equity"],
                            status="published",
                            pitch_file_url="https://example.com/deck.pdf"
                        )
                        db.add(pitch)
                    db.commit()
            else:
                print(f"Startup {s['company']} already exists.")

        # --- Create Investors ---
        investors_data = [
            {
                "email": "investor_jane@example.com",
                "firm": "Skyline Ventures",
                "focus": "Artificial Intelligence, Education",
                "stage": "Seed"
            },
            {
                "email": "investor_bob@example.com",
                "firm": "Green Earth Capital",
                "focus": "CleanEnergy, Healthcare",
                "stage": "Series A"
            }
        ]

        for i in investors_data:
            user = get_or_create_user(i["email"], "investor")
            
            if not db.query(InvestorProfile).filter(InvestorProfile.user_id == user.id).first():
                profile = InvestorProfile(
                    user_id=user.id,
                    firm_name=i["firm"],
                    focus_industries=i["focus"],
                    preferred_stage=i["stage"]
                )
                db.add(profile)
                db.commit()
                print(f"Created/Found Investor: {i['firm']}")
            else:
                print(f"Investor {i['firm']} already exists.")

        # --- Create Notifications and Messages ---
        # Assuming we have at least one startup and one investor
        startup_user = db.query(User).filter(User.email == "techflow@example.com").first()
        investor_user = db.query(User).filter(User.email == "investor_jane@example.com").first()

        from app.models.core import Notification, Message

        if startup_user and investor_user:
            # Notifications for Startup
            notifs = [
                {"type": "view", "title": "New Pitch View", "desc": "Skyline Ventures viewed your pitch."},
                {"type": "match", "title": "New Match Found", "desc": "You matched with Skyline Ventures!"},
                {"type": "message", "title": "New Message", "desc": "Jane from Skyline sent you a message."},
                {"type": "system", "title": "Welcome", "desc": "Welcome to the platform!"}
            ]
            
            for n in notifs:
                # Check if exists
                exists = db.query(Notification).filter(Notification.user_id == startup_user.id, Notification.title == n["title"]).first()
                if not exists:
                    notif = Notification(
                        user_id=startup_user.id,
                        type=n["type"],
                        title=n["title"],
                        description=n["desc"]
                    )
                    db.add(notif)
            
            # Messages
            # Startup -> Investor
            msg1 = "Hi Jane, thanks for viewing our deck."
            if not db.query(Message).filter(Message.content == msg1).first():
                db.add(Message(sender_id=startup_user.id, receiver_id=investor_user.id, content=msg1))
            
            # Investor -> Startup
            msg2 = "Hi, looks interesting. Can we hop on a call?"
            if not db.query(Message).filter(Message.content == msg2).first():
                db.add(Message(sender_id=investor_user.id, receiver_id=startup_user.id, content=msg2))

            db.commit()
            print("Seeded notifications and messages.")

        print("Seeding complete!")

    except Exception as e:
        print(f"Error seeding data: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_db()
