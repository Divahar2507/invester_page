import time
import logging
import uuid
import random
import httpx

from fastapi import FastAPI, Depends, HTTPException, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from sqlalchemy.exc import OperationalError

from .config import settings
from .database import Base, engine, get_db
from . import schemas, crud, models
from .security import create_access_token, decode_access_token_subject

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("app")

app = FastAPI(title="StartupPitch API")

# CORS configuration - allow multiple origins
origins = [o.strip() for o in settings.CORS_ORIGINS.split(",") if o.strip()]
if not origins:
    origins = ["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:8001", "http://127.0.0.1:8001", "http://localhost:8000", "http://127.0.0.1:8000", "http://localhost:8002", "http://127.0.0.1:8002", "http://localhost:8003", "http://127.0.0.1:8003"]

logger.info(f"CORS Origins configured: {origins}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

auth_scheme = HTTPBearer(auto_error=False)

def get_current_user(
    creds: HTTPAuthorizationCredentials = Depends(auth_scheme),
    db: Session = Depends(get_db),
):
    if not creds:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated.")
    user_id_str = decode_access_token_subject(creds.credentials)

    try:
        user_id = uuid.UUID(user_id_str)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token subject.")

    user = crud.get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found.")
    return user


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled error: {exc}", exc_info=True)
    return JSONResponse(status_code=500, content={"detail": "Internal Server Error"})

@app.post("/contact-sales")
async def contact_sales(payload: schemas.ContactSalesRequest):
    """
    Sends the sales inquiry to the admin team using Brevo.
    """
    if not settings.BREVO_API_KEY:
        # Log this in production
        return {"status": "skipped", "msg": "Brevo API key not configured"}

    brevo_url = "https://api.brevo.com/v3/smtp/email"
    
    # Construct the email content
    html_content = f"""
    <html>
    <body>
        <h2>New Enterprise Sales Inquiry</h2>
        <p><strong>Name:</strong> {payload.full_name}</p>
        <p><strong>Email:</strong> {payload.work_email}</p>
        <p><strong>Company:</strong> {payload.company_name}</p>
        <p><strong>Phone:</strong> {payload.mobile_number or 'N/A'}</p>
        <p><strong>Team Size:</strong> {payload.team_size}</p>
        <br/>
        <h3>Specific Needs:</h3>
        <p>{payload.specific_needs or 'None provided'}</p>
    </body>
    </html>
    """

    email_data = {
        "sender": {"name": "PitchDeck AI System", "email": settings.BREVO_SENDER_EMAIL},
        "to": [{"email": settings.SALES_RECIPIENT_EMAIL, "name": "Sales Team"}],
        "subject": f"Sales Inquiry from {payload.company_name}",
        "htmlContent": html_content,
        "replyTo": {"email": payload.work_email, "name": payload.full_name}
    }

    headers = {
        "accept": "application/json",
        "api-key": settings.BREVO_API_KEY,
        "content-type": "application/json"
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(brevo_url, json=email_data, headers=headers)
        
        if response.status_code not in [200, 201, 202]:
            logger.error(f"Brevo Error: {response.text}")
            raise HTTPException(status_code=500, detail="Failed to send email.")

    return {"status": "sent"}


@app.post("/enterprise/confirm")
def confirm_enterprise(payload: schemas.EnterpriseConfirmRequest, user=Depends(get_current_user)):
    """
    Records the enterprise agreement confirmation.
    In a real app with Razorpay, this would create an Order ID and return it.
    """
    logger.info(f"User {user.email} confirmed Enterprise plan via {payload.payment_method}")

    # Mock response mimicking a successful booking/order creation
    return {
        "status": "confirmed",
        "agreement_id": "AGR-" + str(uuid.uuid4())[:8].upper(),
        "next_steps": "Invoice sent to email" if payload.payment_method == "invoice" else "Redirecting to payment..."
    }


@app.get("/enterprise/success-details")
def get_enterprise_success_details(user=Depends(get_current_user)):
    """
    Returns the confirmation details, assigned account manager, and invoice status.
    """
    # Mock data generation based on the logged-in user
    return {
        "company_name": user.company_name or "Acme Corp",
        "reference_id": f"REF-{random.randint(1000, 9999)}-{(user.company_name[:4].upper() if user.company_name else 'ACME')}",
        "invoice_status": "Generated",
        "sent_to_email": user.email,
        "account_manager": {
            "name": "Sarah Jenkins",
            "role": "Account Manager",
            "message": "Hi! I've been assigned as your dedicated success manager. I'll be sending an invite shortly for our kickoff call to get your team onboarded."
        },
        "next_steps": [
            {"label": "Plan Activated", "status": "completed", "desc": "All features unlocked instantly."},
            {"label": "Onboarding Session", "status": "pending", "desc": "Sarah will schedule this within 24h."},
            {"label": "Invite Team Members", "status": "waiting", "desc": "Add up to 50 users to your workspace."}
        ]
    }


@app.post("/company/share")
async def share_company_profile(payload: schemas.ShareProfileRequest, user=Depends(get_current_user)):
    """
    Sends email invitations to view the company profile.
    """
    # In a real app, you would integrate Brevo/SendGrid here similar to the contact-sales endpoint.
    logger.info(f"User {user.email} shared profile with: {payload.recipients}")
    
    # Mock sending delay
    time.sleep(1)
    
    return {"status": "sent", "count": len(payload.recipients.split(","))}


@app.post("/team/invite", response_model=schemas.TeamInvitationOut)
def invite_team_member(payload: schemas.InviteTeamMemberRequest, db: Session = Depends(get_db), user=Depends(get_current_user)):
    """Create a team invitation."""
    if not user.company_name:
        raise HTTPException(status_code=400, detail="You must have a company to invite members.")

    # Check for existing pending invite
    exists = db.query(models.TeamInvitation).filter(
        models.TeamInvitation.email == payload.email,
        models.TeamInvitation.company_name == user.company_name,
        models.TeamInvitation.status == "pending"
    ).first()

    if exists:
        raise HTTPException(status_code=400, detail="A pending invitation already exists for this email.")

    invite = models.TeamInvitation(
        email=payload.email,
        role=payload.role,
        invited_by_id=user.id,
        company_name=user.company_name
    )
    db.add(invite)
    db.commit()
    db.refresh(invite)

    # Simulate sending an email
    logger.info(f"Simulating email invitation to {payload.email} for {user.company_name} as {payload.role}")

    return invite

@app.on_event("startup")
def on_startup():
    # Wait for DB to be ready
    last_err = None
    for _ in range(40):
        try:
            Base.metadata.create_all(bind=engine)
            logger.info("DB ready, tables ensured.")

            # Populate some dummy investors if none exist
            from .database import SessionLocal
            from .models import Investor, RecentInvestment

            db = SessionLocal()
            try:
                existing = db.query(Investor).count()
                if existing == 0:
                    logger.info("Seeding dummy investors")
                    inv1 = Investor(investor_name="Acme Ventures", bio="Early-stage focused firm investing in SaaS startups.", preferred_industries="SaaS, marketplaces")
                    inv2 = Investor(investor_name="Greenfield Capital", bio="Growth-stage investor with a strong operations team.", preferred_industries="Fintech, B2B")
                    db.add_all([inv1, inv2])
                    db.commit()

                    ri1 = RecentInvestment(investor_id=inv1.id, name="BlueApps Series A", amount="$3M")
                    ri2 = RecentInvestment(investor_id=inv1.id, name="CloudForms Seed", amount="$750k")
                    ri3 = RecentInvestment(investor_id=inv2.id, name="PayLoop Series B", amount="$12M")
                    db.add_all([ri1, ri2, ri3])
                    db.commit()
            finally:
                db.close()

            return
        except OperationalError as e:
            last_err = e
            time.sleep(1)
    raise last_err


@app.get("/health")
def health():
    return {"ok": True}


@app.get("/investors/{investor_id}", response_model=schemas.InvestorOut)
def get_investor(investor_id: int, db: Session = Depends(get_db)):
    inv = crud.get_investor_by_id(db, investor_id)
    if not inv:
        raise HTTPException(status_code=404, detail="Investor not found")
    return inv


@app.post("/auth/register", response_model=schemas.RegisterResponse)
def register(payload: schemas.RegisterRequest, db: Session = Depends(get_db)):
    existing = crud.get_user_by_email(db, payload.email)
    if existing:
        raise HTTPException(status_code=409, detail="Email already registered.")

    user = crud.create_user(
        db,
        full_name=payload.full_name,
        company_name=payload.company_name,
        email=payload.email,
        mobile_number=payload.mobile_number,
        password=payload.password,
    )
    return schemas.RegisterResponse(id=str(user.id), email=user.email)


@app.post("/auth/login", response_model=schemas.TokenResponse)
def login(payload: schemas.LoginRequest, db: Session = Depends(get_db)):
    user = crud.authenticate_user(db, payload.email, payload.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password.")

    token = create_access_token(subject=str(user.id))
    return schemas.TokenResponse(access_token=token)


# ==========================
# Settings / profile endpoints
# ==========================
@app.get("/me", response_model=schemas.UserOut)
def me(user=Depends(get_current_user)):
    return schemas.UserOut(
        id=str(user.id),
        full_name=user.full_name,
        company_name=user.company_name,
        email=user.email,
        mobile_number=user.mobile_number,
    )


# Company profile endpoints
@app.get("/me/profile", response_model=schemas.CompanyProfileOut)
def get_my_profile(db: Session = Depends(get_db), user=Depends(get_current_user)):
    profile = crud.get_profile_by_user(db, user)
    # Compose result merging user and profile
    result = {
        "id": str(user.id),
        "company_name": user.company_name,
        "industry": None,
        "funding_stage": None,
        "contact_email": None,
        "vision": None,
        "problem": None,
        "solution": None,
        "arr": None,
        "users": None,
        "cac": None,
        "retention": None,
    }
    if profile:
        result.update({
            "industry": profile.industry,
            "funding_stage": profile.funding_stage,
            "contact_email": profile.contact_email,
            "vision": profile.vision,
            "problem": profile.problem,
            "solution": profile.solution,
            "arr": profile.arr,
            "users": profile.users,
            "cac": profile.cac,
            "retention": profile.retention,
        })
    return result


@app.patch("/me/profile", response_model=schemas.CompanyProfileOut)
def update_my_profile(payload: schemas.CompanyProfileUpdate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    # Update user's company name separately if provided
    if payload.company_name:
        user.company_name = payload.company_name
        db.add(user)

    profile = crud.upsert_company_profile(db, user, **payload.dict(exclude_unset=True))

    result = {
        "id": str(user.id),
        "company_name": user.company_name,
        "industry": profile.industry,
        "funding_stage": profile.funding_stage,
        "contact_email": profile.contact_email,
        "vision": profile.vision,
        "problem": profile.problem,
        "solution": profile.solution,
        "arr": profile.arr,
        "users": profile.users,
        "cac": profile.cac,
        "retention": profile.retention,
    }
    return result


@app.patch("/me", response_model=schemas.UserOut)
def update_me(payload: schemas.UpdateMeRequest, db: Session = Depends(get_db), user=Depends(get_current_user)):
    updated = crud.update_user_profile(
        db,
        user,
        full_name=payload.full_name,
        company_name=payload.company_name,
        mobile_number=payload.mobile_number,
    )
    return schemas.UserOut(
        id=str(updated.id),
        full_name=updated.full_name,
        company_name=updated.company_name,
        email=updated.email,
        mobile_number=updated.mobile_number,
    )


@app.post("/me/change-password")
def change_password(payload: schemas.ChangePasswordRequest, db: Session = Depends(get_db), user=Depends(get_current_user)):
    try:
        crud.change_user_password(
            db,
            user,
            current_password=payload.current_password,
            new_password=payload.new_password,
        )
        return {"ok": True}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/dev/seed-investors")
async def seed_investors_endpoint():
    try:
        from app.seed_investors import seed_investors
        seed_investors()
        return {"message": "Started seeding investors."}
    except Exception as e:
        return {"error": str(e)}