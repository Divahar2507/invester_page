# 🚀 Pitch Platform - Startup Investor Portal

A full-stack platform connecting startups with investors. Built with **FastAPI** (backend) and **React + Vite** (frontend), fully containerized with **Docker**.

## 📁 Project Structure

```
pitch-platform/
├── 📂 backend/                 # FastAPI Backend
│   ├── app/
│   │   ├── models/            # SQLAlchemy models
│   │   ├── routes/            # API endpoints
│   │   ├── schemas/           # Pydantic schemas
│   │   ├── utils/             # Utilities (auth, security)
│   │   ├── database.py        # Database connection
│   │   ├── dependencies.py    # FastAPI dependencies
│   │   └── main.py            # App entry point
│   ├── data/                  # CSV data files
│   ├── uploads/               # File uploads
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── create_db.py          # Database initialization
│   ├── seed_data.py          # Sample data seeder
│   └── load_diwahar_data.py  # CSV data loader
│
├── 📂 frontend/               # React + Vite Frontend
│   ├── src/                   # Source Code
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Page components
│   │   ├── services/         # API services
│   │   ├── App.jsx
│   │   └── index.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
│
├── docker-compose.yml         # Docker orchestration
├── .env.example               # Environment template
├── .gitignore
└── README.md
```

## 🔄 Project Workflow & User Journey

### 1. User Roles
- **Startup**: Founders looking for funding.
- **Investor**: VCs or Angels looking for investment opportunities.

### 2. Authentication & Onboarding
- **Registration**:
  - **Startups**: Multi-step registration (Personal Details → Startup Details → Pitch Deck).
  - **Investors**: Single-step registration (Personal Details → Investment Preferences).
- **Login**: Secure login via Email/Password or Google OAuth.

### 3. The Startup Journey
- **Dashboard**: View profile analytics, recent messages, and notifications.
- **Profile Management**: Update company info, team members, and financials.
- **Networking**:
  - **Browse Investors**: Search for investors by industry or stage.
  - **Messages**: Real-time chat with file/image sharing support.

### 4. The Investor Journey
- **Dashboard**: Track portfolio value, active deals, and investment activity.
- **Discovery (Browse Pitches)**:
  - Filter startups by Industry, Stage, or Deal Size.
  - View detailed Pitch Cards (Deck PDF, Financials, Team).
  - **Action**: Add to Watchlist or Connect.
- **Portfolio Management**:
  - **In Review**: Pipeline for due diligence.
  - **Portfolio**: Log completed investments and upload term sheets.
  - **Export**: Generate PDF/Excel performance reports.

### 5. Key Feature Flows
- **Connection**: Investor Connects → Startup Accepts → Messaging Channel Opens.
- **Investment**: Investor Logs Deal → Uploads Docs → Added to Portfolio.
- **Communication**: WebSocket-enabled chat with attachment support.


## 🐳 Quick Start with Docker

### Prerequisites
- [Docker](https://www.docker.com/get-started) installed
- [Docker Compose](https://docs.docker.com/compose/) installed

### 1. Setup Environment
```bash
cp .env.example .env
# Edit .env with your secure passwords
```

### 2. Build & Run
```bash
docker-compose up --build -d
```

### 3. Load Data
```bash
# Create database tables
docker-compose exec backend python -c "from app.database import Base, engine; from app.models.core import *; Base.metadata.create_all(bind=engine)"

# Seed sample data
docker-compose exec backend python seed_data.py

# Load CSV data (5000+ startups)
docker-compose exec backend python load_diwahar_data.py
```

### 4. Access Application
| Service | URL |
|---------|-----|
| **Frontend** | http://localhost |
| **Backend API** | http://localhost:8000 |
| **API Docs** | http://localhost:8000/docs |

## 💻 Local Development (Without Docker)

### Backend
```bash
cd backend
python -m venv venv
.\venv\Scripts\activate  # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 🔐 Test Credentials
| Role | Email | Password |
|------|-------|----------|
| Startup | startup@test.com | password |
| Investor | investor@test.com | password |

## 📊 Database Schema

| Table | Description |
|-------|-------------|
| users | User accounts (startup/investor) |
| startup_profiles | Startup company details |
| investor_profiles | Investor firm details |
| pitches | Startup funding pitches |
| matches | Startup-Investor matches |
| messages | Direct messages |
| notifications | User notifications |
| connections | Connection requests |
| investments | Investment records |

## 🛠️ Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - ORM
- **PostgreSQL** - Database
- **Pydantic** - Data validation
- **JWT** - Authentication

### Frontend
- **React 19** - UI library
- **Vite** - Build tool
- **React Router** - Navigation
- **Lucide React** - Icons

### DevOps
- **Docker** - Containerization
- **Nginx** - Reverse proxy
- **Docker Compose** - Orchestration

## 📝 API Endpoints

### Authentication
- `POST /auth/register` - Register user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user

### Startups
- `GET /startup/profile/me` - My profile
- `PUT /startup/profile` - Update profile

### Investors
- `GET /investors/me` - My profile
- `PUT /investors/profile` - Update profile

### Pitches
- `GET /pitches/feed` - Browse pitches
- `POST /pitches/` - Create pitch

### Connections
- `POST /connections/request` - Send request
- `GET /connections/requests` - View requests
- `POST /connections/respond` - Accept/Reject

## 📄 License
MIT License
