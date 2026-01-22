from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# Default to a local postgres connection if not set
# Users can update this in their environment variables
# Note: Password 'Diva@2004' is URL-encoded as 'Diva%402004' to handle the '@' symbol
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:Diva%402004@localhost:5432/pitch_platform")

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
