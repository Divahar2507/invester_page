# 🌌 IPA Ecosystem: Unified Venture Intelligence Platform

Welcome to the **Integrated Platform Authority (IPA)** Ecosystem. This is a state-of-the-art, multi-module tech stack designed to revolutionize the lifecycle of venture capital, startup fundraising, and strategic business development.

---

## 🏛️ Ecosystem Architecture

The project is built on a **Shared-Intelligence Microservice Architecture**, containerized with Docker, and unified through a central "Galaxy" gateway.

### 🧩 Core Modules

| Module | Purpose | URL | Port |
| :--- | :--- | :--- | :--- |
| **🌌 Landing Hub** | The entrance to the ecosystem (Galaxy Dashboard UI) | `http://localhost:3000` | 3000 |
| **🛡️ IPA Command Center** | Global administrative controller & data source of truth | `http://localhost:3004` | 3004 |
| **🚀 Investor Platform** | Founder pitching, investor discovery & dealflow manage | `http://localhost` | 80 |
| **📅 Infinite_BZ (Events)** | Community webinars, demo days & high-precision networking | `http://localhost:3006` | 3006 |
| **🔗 Connector Hub** | Strategic capital matchmaking and partnership bridge | `http://localhost:3005` | 3005 |
| **🎯 LeadGen Engine** | AI-driven scraping and marketing automation | `http://localhost:3003` | 3003 |

---

## 🚀 System Flow & Implementation

### 1. The Gateway (Hub)
The system begins at the **Galaxy Hub (v2.0)**. It uses a modern Bento Grid layout to provide authenticated access to different operational nodes.

### 2. The Command Center (IPA)
The Super Admin panel (IPA Global Command Center) acts as the **Nerve Center**. It intercepts data from all other modules:
*   **Registry**: Unified ledger of all Startups and Investors.
*   **Orchestration**: Real-time health monitoring of microservice latency and load via specialized health endpoints.
*   **Integration**: Direct data streams from the Events module and LeadGen scrapers.

### 3. Investor-Founder Lifecycle
*   **Submission**: Founders submit pitches via the main Investor Platform.
*   **Upgrade**: Admin reviews and approves stage progressions (e.g., Seed → Series A) in the Global Ledger.
*   **Matchmaking**: The Connector Hub facilitates strategic introductions based on IPA-verified data.

---

## 🛠️ Technology Stack

*   **Frontend**: React (v18/19), Vite, Tailwind CSS, Lucide Icons, Framer Motion (Animations).
*   **Backend**: FastAPI (Python), Python-Jose (JWT Auth), SQLAlchemy.
*   **Database**: PostgreSQL 15 (Distinct instances for each service for data isolation).
*   **DevOps**: Docker, Docker Compose, Nginx.

---

## 🚦 Getting Started

### Prerequisites
*   **Docker Desktop** (Required)
*   **Node.js v18+** (Optional, for local dev outside Docker)

### Installation
1.  **Clone and Enter**:
    ```bash
    git clone <repository_url>
    cd business_develop
    ```

2.  **Environment Setup**:
    Copy `.env.example` to `.env` and configure your API keys (e.g., Gemini API for AI features).

3.  **Launch the Ecosystem**:
    ```bash
    docker-compose up --build
    ```
    *This will build and start all 12+ containers (Frontends, Backends, Databases).*

---

## 📂 Project Organization

We maintain a clean, high-efficiency directory structure:
*   `/admin`: Super Admin controller frontend and backend.
*   `/invester pitch`: The main investment marketplace.
*   `/Infinite_BZ`: High-precision events and community engine.
*   `/collabrater`: The strategic connector module.
*   `/leadgen`: Marketing automation and lead scraping.
*   `/landing_page`: The central galaxy entry point.
*   `/_docs`: Comprehensive documentation and roadmaps.
*   `/_archive`: Legacy and debug logs (isolated for stability).

---

## 🛡️ Authentication
*   **Super Admin**: Default credentials `admin` / `admin` (Use for initial setup).
*   **Global Registry**: All users must be verified by the **Integrated Platform Authority** registry before accessing premium dealflow.

---
**IPA Ecosystem v2.0** - *Seamlessly Connecting Capital and Innovation.*
