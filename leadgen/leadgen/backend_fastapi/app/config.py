import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql+asyncpg://postgres:password@localhost:5432/leadgen_db")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "supersecretkey")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    BREVO_API_KEY: str = os.getenv("BREVO_API_KEY", "")
    BREVO_SENDER_EMAIL: str = os.getenv("BREVO_SENDER_EMAIL", "")
    BREVO_SENDER_NAME: str = os.getenv("BREVO_SENDER_NAME", "LeadGen AI")
    
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")

    model_config = {
        "env_file": ".env",
        "extra": "ignore"
    }

settings = Settings()
