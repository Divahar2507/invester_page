# 🚀 StartOS Developer Onboarding Guide

Welcome to the **StartOS** development team! This guide will help you set up your local environment and start contributing to the project.

---

## 🛠️ 1. Prerequisites
Before you start, ensure you have the following installed on your machine:

1.  **Git**: [Download Here](https://git-scm.com/downloads)
2.  **Docker Desktop**: Required to run the application containers. [Download Here](https://www.docker.com/products/docker-desktop/)
3.  **VS Code**: Recommended editor. [Download Here](https://code.visualstudio.com/)
    *   *Recommended Extensions*: Docker, Prettier, ESLint, Python.

---

## ⚡ 2. Getting Started

### Step 1: Clone the Repository
Open your terminal (PowerShell or Bash) and run:
```bash
git clone <YOUR_REPO_URL>
cd business_develop
```

### Step 2: Environment Setup
The project uses environment variables for configuration.
1.  Create a copy of the example env file (if available) or create a new `.env` file in the root directory:
    ```bash
    cp .env.example .env
    ```
2.  Add the following default keys to `.env` (ask the team lead for real keys if needed):
    ```env
    POSTGRES_USER=postgres
    POSTGRES_PASSWORD=password
    POSTGRES_DB=pitch_platform
    SECRET_KEY=dev_secret_key
    GEMINI_API_KEY=your_gemini_key_here
    ```

### Step 3: Run the Application
We use Docker Compose to run the entire stack (Frontend, Backend, Database) with one command.

**Start everything:**
*   **Database**: Port `5434` (as per docker-compose).
```bash
docker-compose up --build
```
*   *Note*: The first run may take 5-10 minutes to build all images.
*   Once you see "Listening on port...", the app is ready.

---

## 🖥️ 3. Accessing the App

| Service | URL | Description |
| :--- | :--- | :--- |
| **Landing Page** | [http://localhost:3010](http://localhost:3010) | Main Gateway |
| **Capital Intel (Investors)** | [http://localhost:3001](http://localhost:3001) | Investor Dashboard & Pitch Deck |
| **StartOS Documentation** | [http://localhost:3011](http://localhost:3011) | Official Docs & Sovereign Vault |
| **LeadGen AI** | [http://localhost:3003](http://localhost:3003) | AI Lead Generation Tool |
| **Backend API Docs** | [http://localhost:8001/docs](http://localhost:8001/docs) | Swagger UI for testing APIs |

---

## 📂 4. Project Structure

```
business_develop/
├── .env                  # Environment variables
├── docker-compose.yml    # Main orchestration file
├── documentation/        # Documentation site (React)
├── invester pitch/       # Main core module
│   ├── backend/          # FastAPI (Python) code
│   │   ├── app/main.py   # Entry point
│   │   └── app/models/   # Database Models
│   └── frontend/         # React + Vite code
│       └── src/pages/    # UI Pages (Dashboard, Login, etc.)
├── leadgen/              # Lead Generation Module
└── ... (other microservices)
```

---

## 👨‍💻 5. key Workflows

### 🟢 How to add a new Frontend Page?
1.  Go to `invester pitch/frontend/src/pages/`.
2.  Create your component (e.g., `NewFeature.jsx`).
3.  Add the route in `App.jsx`.
    ```jsx
    <Route path="/new-feature" element={<NewFeature />} />
    ```
4.  The browser will auto-reload (HMR) to show changes.

### 🟡 How to modify the Backend?
1.  Go to `invester pitch/backend/app/routes/`.
2.  Create or edit a route file (e.g., `startup.py`).
3.  If you changed the **Database Models** (`models/`), you must reset the DB or run migrations:
    ```bash
    # Quickest way for dev defaults:
    docker-compose down -v
    docker-compose up --build
    ```

### 🔴 How to restart a specific service?
If you only changed the backend and don't want to restart everything:
```bash
docker-compose restart backend-main
```

---

## 🐛 6. Troubleshooting

*   **"Port already in use"**:
    *   Stop other web servers or Postgres instances running on your machine.
    *   Check if another docker container is running: `docker ps`.
*   **"Connection refused" to Database**:
    *   The database takes a few seconds to start. Wait 10-15 seconds and try again.
*   **"Frontend not loading"**:
    *   Open the browser console (F12) to check for errors.
    *   Ensure the container is running: `docker ps`.

---

Happy Coding! 🚀
