from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth, pitches, ecosystem, research_engine

from app.db.session import engine, Base
from app.db.seed import seed_database
from sqlalchemy import text

app = FastAPI(title="InnoSphere API")

@app.on_event("startup")
def startup_event():
    # Create tables and seed data
    Base.metadata.create_all(bind=engine)
    seed_database()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to InnoSphere API"}

@app.get("/health")
def health_check():
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        return {"status": "unhealthy", "database": str(e)}

# Include routers
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(pitches.router, prefix="/pitches", tags=["pitches"])
app.include_router(ecosystem.router, prefix="/ecosystem", tags=["ecosystem"])
app.include_router(research_engine.router, prefix="/research-engine", tags=["research-engine"])
