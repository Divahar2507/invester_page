# VentureFlow Project Workflow

This document outlines the complete user journey and workflow for the VentureFlow Investor & Startup Platform.

## 1. User Roles
There are two primary user roles:
- **Startup**: Founders looking for funding.
- **Investor**: VCs or Angels looking for investment opportunities.

---

## 2. Authentication & Onboarding

### Registration
- **Startup**: Sign up with email/password.
  - **Step 1**: Personal Details (Name, Contact).
  - **Step 2**: Startup Details (Company Name, Industry, Stage, Funding Goal, Pitch Deck upload).
  - *Result*: Creates a User account, a Startup Profile, and a default Pitch.
- **Investor**: Sign up with email/password.
  - **Single Step**: Personal Details + Investment Preferences (Firm Name, Focus Industries).
  - *Result*: Creates a User account and an Investor Profile.

### Login
- Both users login via `/login` or Google OAuth.
- Redirects to `/dashboard` upon success.

---

## 3. The Startup Journey

### Dashboard
- View analytics (Profile Views, Search Appearances).
- See recent Messages and Notifications.

### Profile Management
- **Edit Profile**: Update company info, team members, and financials.
- **My Pitch**: Manage the active pitch visibility and details.

### Networking
- **Investors**: Browse/Search for investors.
- **Messages**: Chat with investors who have connected.
- **Notifications**: Alerts for new connection requests or messages.

---

## 4. The Investor Journey

### Dashboard
- Overview of Portfolio value, Active deals, and recent activity.

### Discovery (Browse Pitches)
- **Browse Page**: View a feed of startup pitches.
- **Filtering**: Filter by Industry (AI, Fintech, etc.), Stage (Seed, Series A), or Deal Size.
- **Pitch View**: Click a card to view full details (Pitch Deck PDF, Financials, Team).
- **Actions**:
  - **Add to Watchlist**: Save for later.
  - **Connect**: Send a connection request to the founder.

### Portfolio Management
- **In Review**: Track startups currently in due diligence.
- **Watchlist**: Manage saved startups.
- **Portfolio**: Log actual investments (Amount invested, Equity, Date). Upload documents (Terms Sheets).
- **Export Reports**: Generate PDF/Excel reports of portfolio performance.

### Communication
- **Messaging**: Real-time chat with connected founders. Supports file/image sharing.
- **Schedule Meeting**: Request meetings via Calendar integration.

---

## 5. Key Features Flow

### Connection Flow
1. **Investor** finds a Startup in "Browse Pitches".
2. **Investor** clicks "Connect".
3. **Startup** receives detailed Notification + Connection Request.
4. **Startup** accepts request.
5. **Result**: Both parties can now Message each other.

### Investment Flow
1. **Investor** decides to invest.
2. Goes to "Log Investment" page.
3. Enters details (Startup Name, Amount, Equity, Date).
4. Uploads signed documents.
5. Investment appears in "My Portfolio".

### Messaging System
- Both users can send text messages.
- Supports **File & Image Uploads** (PDFs, PNGs, etc.).
- Real-time updates via WebSocket.

---

## 6. Technical Stack
- **Frontend**: React + Vite + Tailwind CSS.
- **Backend**: FastAPI (Python).
- **Database**: PostgreSQL.
- **Containerization**: Docker & Docker Compose.
