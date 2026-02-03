from passlib.context import CryptContext
from typing import Optional
from datetime import datetime, timedelta
# We are adapting the Node logic which didn't actually use JWTs for API protection broadly 
# but relied on simple password checks for /login and then FE state.
# However, `run_command` allows us to be better. We will implement standard password utils.

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)
