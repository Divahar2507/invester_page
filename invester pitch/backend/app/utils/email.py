import os
import logging
from typing import List
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType
from pydantic import EmailStr

logger = logging.getLogger(__name__)

# Connection configuration using environment variables
conf = ConnectionConfig(
    MAIL_USERNAME = os.getenv("MAIL_USERNAME", "your-email@gmail.com"),
    MAIL_PASSWORD = os.getenv("MAIL_PASSWORD", "your-app-password"),
    MAIL_FROM = os.getenv("MAIL_FROM", "your-email@gmail.com"),
    MAIL_PORT = int(os.getenv("MAIL_PORT", 587)),
    MAIL_SERVER = os.getenv("MAIL_SERVER", "smtp.gmail.com"),
    MAIL_STARTTLS = os.getenv("MAIL_STARTTLS", "True") == "True",
    MAIL_SSL_TLS = os.getenv("MAIL_SSL_TLS", "False") == "True",
    USE_CREDENTIALS = os.getenv("USE_CREDENTIALS", "True") == "True",
    VALIDATE_CERTS = True
)

async def send_email(to_email: str, subject: str, html_content: str):
    """
    Send an email using fastapi-mail (SMTP).
    Fallbacks to logging if credentials are not configured properly in dev.
    """
    if os.getenv("MAIL_PASSWORD") == "your-app-password" or not os.getenv("MAIL_PASSWORD"):
        logger.warning(f"MOCK EMAIL (SMTP NOT CONFIGURED) to {to_email} | Subject: {subject}")
        print(f"------------ MOCK EMAIL ------------")
        print(f"To: {to_email}")
        print(f"Subject: {subject}")
        print(f"Body: {html_content}")
        print(f"------------------------------------")
        return True

    message = MessageSchema(
        subject=subject,
        recipients=[to_email],
        body=html_content,
        subtype=MessageType.html
    )

    fm = FastMail(conf)
    try:
        await fm.send_message(message)
        logger.info(f"Email sent to {to_email}")
        return True
    except Exception as e:
        logger.error(f"Failed to send email via SMTP: {e}")
        return False

async def send_welcome_email(to_email: str, name: str):
    subject = "Welcome to VentureFlow!"
    content = f"""
    <h1>Welcome, {name}!</h1>
    <p>We are excited to have you on board. Start exploring high-potential startups or showcasing your venture today.</p>
    <br>
    <p>Best,<br>The VentureFlow Team</p>
    """
    return await send_email(to_email, subject, content)

async def send_password_reset_email(to_email: str, reset_link: str):
    subject = "Reset Your Password - VentureFlow"
    content = f"""
    <html>
    <body>
        <p>You requested a password reset.</p>
        <p>Click the link below to reset your password:</p>
        <a href="{reset_link}" style="padding: 10px 20px; background-color: #2563eb; color: white; text-decoration: none; rounded: 5px;">Reset Password</a>
        <p>This link expires in 15 minutes.</p>
        <p>If you did not request this, please ignore this email.</p>
    </body>
    </html>
    """
    return await send_email(to_email, subject, content)
