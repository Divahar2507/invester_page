from pydantic import BaseModel, EmailStr, Field, model_validator


class RegisterRequest(BaseModel):
    full_name: str = Field(min_length=1, max_length=200)
    company_name: str = Field(min_length=1, max_length=200)
    email: EmailStr
    mobile_number: str = Field(min_length=4, max_length=50)

    password: str = Field(min_length=8, max_length=128)
    confirm_password: str = Field(min_length=8, max_length=128)

    agree_terms: bool = False

    @model_validator(mode="after")
    def check_passwords(self):
        if self.password != self.confirm_password:
            raise ValueError("Passwords do not match.")
        if not self.agree_terms:
            raise ValueError("You must agree to the Terms of Service and Privacy Policy.")
        return self


class RegisterResponse(BaseModel):
    id: str
    email: EmailStr


class LoginRequest(BaseModel):
    email: EmailStr
    # Keep login min_length=1 so backend returns 401 instead of 422 for short passwords
    password: str = Field(min_length=1, max_length=128)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


# ==========================
# Settings / profile schemas
# ==========================
class UserOut(BaseModel):
    id: str
    full_name: str
    company_name: str
    email: EmailStr
    mobile_number: str

    class Config:
        from_attributes = True


class UpdateMeRequest(BaseModel):
    full_name: str | None = Field(default=None, min_length=1, max_length=200)
    company_name: str | None = Field(default=None, min_length=1, max_length=200)
    mobile_number: str | None = Field(default=None, min_length=4, max_length=50)


class ChangePasswordRequest(BaseModel):
    current_password: str = Field(min_length=1, max_length=128)
    new_password: str = Field(min_length=8, max_length=128)

class ContactSalesRequest(BaseModel):
    full_name: str = Field(min_length=1)
    work_email: EmailStr
    company_name: str = Field(min_length=1)
    mobile_number: str | None = None
    team_size: str
    specific_needs: str | None = None


class EnterpriseConfirmRequest(BaseModel):
    payment_method: str  # "invoice", "wire", "card"
    plan_id: str = "enterprise_custom_2023"


class ShareProfileRequest(BaseModel):
    recipients: str  # Comma separated emails
    subject: str
    message: str | None = None
    public_access: bool = True
    expiration: str = "never"
    access_control: str = "anyone"


# -------------------------
# Company Profile Schemas
# -------------------------
class CompanyProfileUpdate(BaseModel):
    company_name: str | None = None
    industry: str | None = None
    funding_stage: str | None = None
    contact_email: EmailStr | None = None

    vision: str | None = None
    problem: str | None = None
    solution: str | None = None

    arr: str | None = None
    users: str | None = None
    cac: str | None = None
    retention: str | None = None


class CompanyProfileOut(BaseModel):
    id: str
    company_name: str | None = None
    industry: str | None = None
    funding_stage: str | None = None
    contact_email: str | None = None

    vision: str | None = None
    problem: str | None = None
    solution: str | None = None

    arr: str | None = None
    users: str | None = None
    cac: str | None = None
    retention: str | None = None

    class Config:
        from_attributes = True


# -------------------------
# Team invitations
# -------------------------
from datetime import datetime

class InviteTeamMemberRequest(BaseModel):
    email: EmailStr
    role: str = Field(..., pattern=r"^(Admin|Editor|Viewer)$")


class TeamInvitationOut(BaseModel):
    id: int
    email: EmailStr
    role: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


# -------------------------
# Investors
# -------------------------
class RecentInvestmentOut(BaseModel):
    id: int
    name: str
    amount: str

    class Config:
        from_attributes = True


class InvestorOut(BaseModel):
    id: int
    name: str
    bio: str | None = None
    focus: str | None = None
    recent_investments: list[RecentInvestmentOut] | None = None

    class Config:
        from_attributes = True