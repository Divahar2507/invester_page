import socketio
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from .database import engine, Base
from .routers import auth, leads, influencers, email, admin, insights, webhooks, icps
from .config import settings

# --- Socket.IO Setup ---
sio = socketio.AsyncServer(async_mode='asgi', cors_allowed_origins="*")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    async with engine.begin() as conn:
        # Create tables
        await conn.run_sync(Base.metadata.create_all)
    yield
    # Shutdown
    # await engine.dispose()

app = FastAPI(title="LeadGen API", lifespan=lifespan)

# --- CORS Setup for FastAPI ---
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3001",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all for FastAPI too during dev for simplicity
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ... (routers and other code remain)





# --- Include Routers ---
app.include_router(auth.router)
app.include_router(leads.router)
app.include_router(influencers.router)
app.include_router(email.router)
app.include_router(admin.router)
app.include_router(insights.router)
app.include_router(webhooks.router)
app.include_router(icps.router)

socket_app = socketio.ASGIApp(sio, app)

@app.get("/")
async def root():
    return {"message": "LeadGen API is running"}



# Helper to access sio from other modules if needed
# (Though circular imports make this tricky, simplest is to pass around or use a singleton)
