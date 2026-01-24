# InfiniteBZ - Community Event Platform

**Short Description**: Only for Chennai. InfiniteBZ is a hyperlocal event aggregation and management platform designed to connect the Chennai tech and startup community. It scrapes events from multiple sources and provides a seamless registration experience for local meetups.

---

## 🎯 Project Purpose

The main goal is to solve the fragmented event discovery problem in Chennai.
*   **For Attendees**: One place to find all tech/startup events (Aggregated + Exclusive).
*   **For Organizers**: A free, feature-rich platform to list events, manage tickets, and track registrations.

### Key Features
*   **Auto-Scraping**: Automatically pulls events from Eventbrite & Meetup using Playwright.
*   **Ticketing Engine**: Create Free, Paid, or VIP tickets with capacity limits.
*   **Smart Registration**: 3-step checkout flow (Tickets -> Details -> Payment).
*   **PDF Tickets**: Auto-generates professional PDF tickets with QR codes and emails them to attendees.
*   **Interactive Dashboard**: Analytics for organizers to see views and sales.

---

## 📅 Update Summary

### Previous Push (What was already there)
*   Basic Event Listing & Search functionality.
*   Authentication System (Login/Signup with JWT).
*   Scraper groundwork (Playwright setup).
*   Basic "Create Event" form.

### 🚀 Current Update (My New Module Work)
I have built the **Full Registration & Ticketing Module**.
Before this update, clicking "Register" just blindly added a user to an event. Now, it is a complete e-commerce style flow.

#### **What I Added:**
1.  **Checkout Modal (`CheckoutModal.jsx`)**:
    *   A completely new 3-step popup.
    *   Step 1: **Select Tickets** (e.g., 2 VIP, 1 General).
    *   Step 2: **Attendee Info** (Name, Phone, Email).
    *   Step 3: **Payment & Confirmation**.
2.  **Ticketing Backend**:
    *   Updated Database to store `TicketClass` and Registration Details.
    *   New API endpoints to handle ticket selection payloads.
3.  **Event Details Redesign**:
    *   The "Event Details" popup now shows **Agenda**, **Speakers**, and **Ticket Prices** clearly.
    *   Fixed layout issues where text was overlapping.

---

## 📂 Updated Files & Purpose

| File | Purpose |
| :--- | :--- |
| `frontend/src/components/CheckoutModal.jsx` | **[NEW]** The main UI for the 3-step registration process. |
| `frontend/src/components/EventDetailModal.jsx` | Refactored to include the "Speakers" tab and open the new Checkout Modal. |
| `frontend/src/components/Dashboard.jsx` | Updated to handle the new registration API payload correctly. |
| `backend/app/api/routes.py` | Updated `/register` endpoint to accept `tickets` and `attendee` data. |
| `backend/app/models/schemas.py` | Added `raw_data` JSON column to `UserRegistration` table. |
| `backend/app/services/ticket_service.py` | **[NEW]** Logic to generate the PDF Ticket. |
| `backend/migrate_schema.py` | **[NEW]** Script to manually update the database (run this if you get DB errors). |

---

## 📁 Folder Structure
```
Infinite_BZ/
├── backend/
│   ├── app/
│   │   ├── api/            # API Route definitions (endpoints)
│   │   ├── core/           # Config, Database, Email utils
│   │   ├── models/         # Database Schemas (User, Event, Ticket)
│   │   └── services/       # Business Logic (Scraper, PDF Gen)
│   ├── requirements.txt    # Python dependencies
│   ├── run.py              # Entry point to start server
│   └── migrate_schema.py   # Database migration script
└── frontend/
    ├── src/
    │   ├── components/     # React Components (UI)
    │   └── ...
    ├── package.json        # Node dependencies
    └── vite.config.js      # Build config
```

---

## ⚙️ Setup Instructions

### 1. Clone & Prepare
```bash
git clone <repo-url>
cd Infinite_BZ
```

### 2. Backend Setup
**Prerequisites**: Python 3.10+ installed.

```bash
cd backend

# Create Virtual Environment
python -m venv venv

# Activate (Windows)
.\venv\Scripts\activate
# Activate (Mac/Linux)
source venv/bin/activate

# Install Dependencies
pip install -r requirements.txt

# Install Playwright Browsers (Required for Scraper)
playwright install
```

### 3. Frontend Setup
**Prerequisites**: Node.js installed.

```bash
cd frontend
npm install
```

---

## ▶️ How to Run (Step-by-Step)

You need **two terminals** open (one for Backend, one for Frontend).

**Terminal 1: Backend**
```bash
cd backend
# Make sure venv is activated!
python run.py
```
*   Server starts at: `http://localhost:8000`
*   **Swagger API Docs**: `http://localhost:8000/docs` (Useful for testing APIs)

**Terminal 2: Frontend**
```bash
cd frontend
npm run dev
```
*   App opens at: `http://localhost:5173` (or similar port)

---

## 📝 Requirements Explanation

Here is why we use these libraries in `backend/requirements.txt`:

| Library | Purpose |
| :--- | :--- |
| **`fastapi`** | The main web framework. Fast, async, and auto-generates API docs. |
| **`uvicorn`** | The server that runs the FastAPI app. |
| **`sqlalchemy` & `sqlmodel`** | ORM to interact with the PostgreSQL database using Python classes. |
| **`asyncpg`** | Async driver for PostgreSQL (makes DB queries super fast). |
| **`playwright`** | Controls a real browser to scrape events from complex sites like Eventbrite. |
| **`apscheduler`** | Runs background jobs (like scraping events every 24 hours). |
| **`passlib[bcrypt]`** | Securely hashes user passwords (security standard). |
| **`python-jose`** | Handles JWT tokens for secure Login/Signup. |
| **`fastapi-mail`** | Sends emails (Welcome emails, OTPs, Tickets). |
| **`reportlab`** | GENERATES PDF FILES. Used to create the event tickets. |
| **`qrcode`** | Generates the QR code images for the tickets. |

---

## ⚠️ Notes for Collaborators

1.  **Database Error?**
    If you pull the code and get an error like `column "raw_data" does not exist`, simply run:
    ```bash
    cd backend
    python migrate_schema.py
    ```
    This will update your local database to match the new changes.

    If you see "Registration failed: Could not validate credentials", just **Logout and Login again**. The server restart invalidated old sessions.
