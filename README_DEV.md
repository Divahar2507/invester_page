# 🚀 Developer Onboarding Guide
## Welcome to the Investor Platform Project!

This guide is designed to help new developers (like your friend!) get up and running with the codebase as quickly as possible. Follow these steps to start contributing.

---

### 1️⃣ Prerequisites (What you need installed)

Before you start, make sure you have these installed on your Windows/Mac/Linux machine:

1.  **Git**: To download the code. ([Download Git](https://git-scm.com/downloads))
2.  **Docker Desktop**: This runs the entire app (Frontend + Backend + Database) in containers. ([Download Docker](https://www.docker.com/products/docker-desktop/))
3.  **VS Code**: Recommended code editor. ([Download VS Code](https://code.visualstudio.com/))

---

### 2️⃣ Getting Started (First Time Setup)

#### Step 1: Clone the Repository
Open your terminal (PowerShell or Command Prompt) and run:
```bash
git clone <YOUR_REPOSITORY_URL>
cd invester_dev
```

#### Step 2: Setup Environment Variables
The project needs some secret keys to run.
1.  Copy `.env.example` to a new file named `.env`.
    ```bash
    cp .env.example .env
    ```
    *(Or just create a new file named `.env` and copy the contents manually)*
2.  Open `.env` and fill in the values. For local development, the defaults usually work fine.

#### Step 3: Run the Application
This is the magic command. It builds and starts everything:
```bash
docker-compose up --build
```
*Wait for a few minutes. You will see logs scrolling. Once it says "Started" or "Listening on port...", you are good!*

---

### 3️⃣ Accessing the App

*   **Frontend (The Website):** Open [http://localhost](http://localhost) in your browser.
*   **Backend API Docs:** Open [http://localhost:8000/docs](http://localhost:8000/docs) to see all available API endpoints.
*   **Database:** Port `5433` (as per docker-compose).

---

### 4️⃣ Project Structure (Where things are)

*   `frontend/`: React + Vite application.
    *   `src/pages/`: All the main pages (Login, Dashboard, BrowsePitches).
    *   `src/components/`: Reusable buttons, cards, modals.
    *   `src/services/api.js`: All calls to the backend happen here.
*   `backend/`: FastAPI (Python) application.
    *   `app/main.py`: The entry point.
    *   `app/routes/`: API endpoints (auth, pitches, social).
    *   `app/models/`: Database tables definition.

---

### 5️⃣ Common Tasks (How do I...?)

#### 🔹 How to add a new page?
1.  Create `NewPage.jsx` in `frontend/src/pages/`.
2.  Add a route in `frontend/src/App.jsx`.
    ```jsx
    <Route path="/new-page" element={<NewPage />} />
    ```

#### 🔹 How to Restart after changes?
*   **Frontend Changes:** Usually auto-reload. If not, refresh the browser.
*   **Backend Changes:** The server usually auto-reloads. If not, run:
    ```bash
    docker-compose restart backend
    ```

#### 🔹 How to View Database Data?
You can use the API Docs ([http://localhost:8000/docs](http://localhost:8000/docs)) or use a tool like DBeaver/pgAdmin to connect to `localhost:5433`.
*   User: `postgres`
*   Password: `password` (or check `.env`)
*   DB Name: `pitch_platform`

---

### 6️⃣ Troubleshooting

*   **"Port already in use"**: Make sure no other postgres or web server is running.
*   **"Connection refused"**: Wait a bit longer for the database to start up.
*   **"Container exited**: Run `docker-compose logs backend` to see the error message.

---

### ✅ You're Ready!
Happy Coding! 🚀
