from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str
    CORS_ORIGINS: str = "http://localhost:5173"
    JWT_SECRET: str
    JWT_EXPIRES_MINUTES: int = 120
    
    # Brevo settings
    BREVO_API_KEY: str = ""
    BREVO_SENDER_EMAIL: str = "noreply@example.com"
    SALES_RECIPIENT_EMAIL: str = "admin@example.com"

    class Config:
        env_file = ".env"
        extra = "ignore" # Allow extra fields in .env

settings = Settings()