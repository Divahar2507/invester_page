from sqlalchemy.orm import Session
from sqlalchemy import select
from .models import User
from .security import hash_password, verify_password


def get_user_by_email(db: Session, email: str) -> User | None:
    return db.scalar(select(User).where(User.email == email))


def get_user_by_id(db: Session, user_id) -> User | None:
    return db.get(User, user_id)


def create_user(
    db: Session,
    *,
    full_name: str,
    company_name: str,
    email: str,
    mobile_number: str,
    password: str,
) -> User:
    user = User(
        full_name=full_name.strip(),
        company_name=company_name.strip(),
        email=email.lower().strip(),
        mobile_number=mobile_number.strip(),
        password_hash=hash_password(password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def authenticate_user(db: Session, email: str, password: str) -> User | None:
    user = get_user_by_email(db, email.lower().strip())
    if not user:
        return None
    if not verify_password(password, user.password_hash):
        return None
    return user


def update_user_profile(
    db: Session,
    user: User,
    *,
    full_name: str | None = None,
    company_name: str | None = None,
    mobile_number: str | None = None,
) -> User:
    if full_name is not None:
        user.full_name = full_name.strip()
    if company_name is not None:
        user.company_name = company_name.strip()
    if mobile_number is not None:
        user.mobile_number = mobile_number.strip()

    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def change_user_password(db: Session, user: User, *, current_password: str, new_password: str) -> None:
    if not verify_password(current_password, user.password_hash):
        raise ValueError("Current password is incorrect.")
    user.password_hash = hash_password(new_password)
    db.add(user)
    db.commit()


# ------------------------
# Company Profile helpers
# ------------------------
from .models import CompanyProfile


def get_profile_by_user(db: Session, user: User) -> CompanyProfile | None:
    return db.scalar(select(CompanyProfile).where(CompanyProfile.user_id == user.id))


def upsert_company_profile(db: Session, user: User, **fields) -> CompanyProfile:
    profile = get_profile_by_user(db, user)
    if not profile:
        profile = CompanyProfile(user_id=user.id)
    # Update only provided fields
    for k, v in fields.items():
        if hasattr(profile, k) and v is not None:
            setattr(profile, k, v)
    db.add(profile)
    db.commit()
    db.refresh(profile)
    return profile


# -------------------------
# Investors
# -------------------------
from .models import Investor, RecentInvestment


def get_investor_by_id(db: Session, investor_id: int) -> Investor | None:
    return db.get(Investor, investor_id)