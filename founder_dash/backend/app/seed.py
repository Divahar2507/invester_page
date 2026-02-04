from sqlalchemy.orm import Session
from .database import SessionLocal, engine
from .models import models
from .models.models import UserRole, ProjectCategory, ProjectStatus, ApplicationStatus
import uuid

def seed_db():
    db = SessionLocal()
    
    # Check if we already have data
    if db.query(models.User).first():
        print("Database already seeded")
        db.close()
        return

    # Create Users
    users = [
        models.User(
            id="u1",
            name="Alex Chen",
            role=UserRole.STARTUP,
            avatar="https://picsum.photos/seed/startup/100/100",
            organization="Nexus AI",
            email="alex@nexusai.com"
        ),
        models.User(
            id="u2",
            name="Sarah Chen",
            role=UserRole.AGENCY,
            avatar="https://picsum.photos/seed/u1/100/100",
            organization="Global Talent",
            email="sarah@globaltalent.com"
        ),
        models.User(
            id="u3",
            name="Dean Miller",
            role=UserRole.INSTITUTION,
            avatar="https://picsum.photos/seed/institution/100/100",
            organization="Tech Institute",
            email="dean@techinstitute.edu"
        ),
        models.User(
            id="u4",
            name="John Freelancer",
            role=UserRole.FREELANCER,
            avatar="https://picsum.photos/seed/freelancer/100/100",
            email="john@freelance.com"
        )
    ]
    
    for user in users:
        db.add(user)
    
    # Create Projects
    projects = [
        models.Project(
            id="p1",
            title="React Native Expert Needed",
            description="Build a cross-platform mobile app for our fintech platform.",
            budget="₹3.5L - ₹5L",
            posted_by="FinFlow",
            posted_by_id="u1",
            category=ProjectCategory.FREELANCE,
            type="execution",
            status=ProjectStatus.OPEN,
            skills=["React Native", "TypeScript"]
        ),
        models.Project(
            id="p2",
            title="Summer Internship Cohort",
            description="Looking for 10 engineering students for a 3-month product sprint.",
            budget="Stipend: ₹15k/mo",
            posted_by="Nexus AI",
            posted_by_id="u1",
            category=ProjectCategory.INTERNSHIP,
            type="recruitment",
            status=ProjectStatus.OPEN,
            skills=["Python", "Cloud"]
        ),
        models.Project(
            id="p3",
            title="Senior Backend Developer",
            description="Full-time role for scaling our infrastructure.",
            budget="₹24L - ₹32L /yr",
            salary_range="₹24L - ₹32L",
            equity="0.5% - 1.0%",
            location="Remote",
            posted_by="SecureVault",
            posted_by_id="u1",
            category=ProjectCategory.FULL_TIME,
            type="recruitment",
            status=ProjectStatus.OPEN,
            skills=["Go", "Kubernetes"]
        )
    ]
    
    for project in projects:
        db.add(project)

    # Create Initial Messages/Conversations
    messages = [
        models.Message(
            id=str(uuid.uuid4()),
            sender_id="u2",
            recipient_id="u1",
            text="Hi Alex! I saw your post for a React Native developer.",
            status="read"
        ),
        models.Message(
            id=str(uuid.uuid4()),
            sender_id="u2",
            recipient_id="u1",
            text="I have shared the candidate list.",
            status="read"
        )
    ]
    
    for msg in messages:
        db.add(msg)

    # Create Hired Members
    hired = [
        models.HiredMember(
            id="h1",
            name="James Wilson",
            avatar="https://picsum.photos/seed/h1/100/100",
            role=UserRole.INSTITUTION,
            start_date="Oct 12, 2023",
            project="React Native Expert Needed",
            organization="Tech University",
            employer_id="u1"
        ),
        models.HiredMember(
            id="h2",
            name="Sarah Chen",
            avatar="https://picsum.photos/seed/u1/100/100",
            role=UserRole.AGENCY,
            start_date="Nov 01, 2023",
            project="Senior Backend Developer",
            organization="Global Talent",
            employer_id="u1"
        )
    ]
    
    for h in hired:
        db.add(h)

    db.commit()
    db.close()
    print("Database seeded successfully!")

if __name__ == "__main__":
    seed_db()
