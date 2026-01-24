from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import random

app = FastAPI(title="Ecosystem Central AI", description="Centralized Engine for Startup Ecosystem")

# --- CONFIGURATION ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Production: limit to frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- MOCK DATA ---
# Enhanced mock data to match frontend UI requirements
STARTUPS_DB = [
    {"id": "1", "name": "TechGenius Solutions", "subtitle": "Tech Innovators", "industry": "Tech", "funding": 1500000, "stage": "Series A"},
    {"id": "2", "name": "AI Dynamics Inc.", "subtitle": "AI Pioneers", "industry": "AI", "funding": 2500000, "stage": "Seed"},
    {"id": "3", "name": "EcoPower Systems", "subtitle": "Green Energy Leaders", "industry": "Energy", "funding": 800000, "stage": "Pre-Seed"},
    {"id": "4", "name": "FinTech Innovations", "subtitle": "FinTech Disruptors", "industry": "Finance", "funding": 5000000, "stage": "Series B"},
    {"id": "5", "name": "HealthTech Solutions", "subtitle": "HealthTech Innovators", "industry": "Health", "funding": 1200000, "stage": "Series A"},
]

INVESTORS_DB = [
    {"id": "1", "name": "Capital Growth Partners", "subtitle": "Venture Capital Firm", "type": "VC", "aum": "500M"},
    {"id": "2", "name": "Angel Investors Alliance", "subtitle": "Angel Investor Network", "type": "Angel", "aum": "50M"},
    {"id": "3", "name": "Equity Horizon Investments", "subtitle": "Private Equity Group", "type": "PE", "aum": "1B"},
    {"id": "4", "name": "TechCorp Ventures", "subtitle": "Corporate Venture Arm", "type": "CVC", "aum": "200M"},
    {"id": "5", "name": "Social Impact Capital", "subtitle": "Impact Investing Fund", "type": "Impact", "aum": "100M"},
]

EVENTS_DB = [
    {"id": "1", "name": "Tech Summit 2026", "date": "2026-03-15", "type": "Conference"},
    {"id": "2", "name": "Startup Pitch Night", "date": "2026-02-10", "type": "Pitch"},
]

# --- MODELS ---
class Startup(BaseModel):
    name: str
    subtitle: str
    industry: str
    description: Optional[str] = None

# --- ROUTES ---

@app.get("/", tags=["Health"])
def read_root():
    return {"status": "active", "message": "Ecosystem Central AI Online"}

@app.get("/api/dashboard/stats", tags=["Dashboard"])
def get_dashboard_stats():
    """Returns aggregated statistics for the dashboard."""
    total_funding = sum(s.get("funding", 0) for s in STARTUPS_DB)
    # Format simplified for UI (e.g. $500M) - Logic can be improved
    funding_display = f"${total_funding / 1000000:.0f}M"
    
    return {
        "totalStartups": len(STARTUPS_DB),
        "investorCapital": funding_display, # Mock value or calculated
        "liveEvents": len(EVENTS_DB) + 23 # Matches UI mock of 25
    }

@app.get("/api/startups", tags=["Directory"])
def get_startups():
    """Returns list of startups."""
    return STARTUPS_DB

@app.get("/api/investors", tags=["Directory"])
def get_investors():
    """Returns list of investors."""
    return INVESTORS_DB

@app.get("/api/events", tags=["Events"])
def get_events():
    """Returns list of upcoming events."""
    return EVENTS_DB

# Keep duplicate check logic for potential future use
@app.post("/api/startups/check-duplicate", tags=["Validation"])
def check_duplicate(name: str):
    exists = any(s["name"].lower() == name.lower() for s in STARTUPS_DB)
    return {"exists": exists}

