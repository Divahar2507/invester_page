# Startup-Investor Pitch Platform Backend

This is a FastAPI-based backend for a platform connecting startups with investors.

## 🚀 Features

- **Authentication**: JWT-based auth with role management (Startup/Investor).
- **Profiles**: Create and manage startup and investor profiles.
- **Pitch Decks**: Upload PDF pitch decks.
- **Matching**: Deterministic algorithm to match startups with potential investors.
- **Messaging**: Simple messaging system between users.

## 🛠 Tech Stack

- **FastAPI**: Modern, fast web framework for building APIs.
- **PostgreSQL**: Robust relational database.
- **SQLAlchemy**: ORM for database interactions.
- **Pydantic**: Data validation.

## 🏃‍♂️ How to Run

### Prerequisites

- Python 3.9+
- PostgreSQL installed and running locally.
- Create a database named `pitch_platform` (or update `DATABASE_URL` in `.env` or `app/database.py`). Note: The code defaults to `pitch_platform` with user `postgres` and password `Diva@2004`.

### Setup

1.  **Navigate to backend directory:**
    ```bash
    cd backend
    ```

2.  **Create virtual environment:**
    ```bash
    python -m venv venv
    ```

3.  **Activate virtual environment:**
    - Windows:
      ```bash
      venv\Scripts\activate
      ```
    - Mac/Linux:
      ```bash
      source venv/bin/activate
      ```

4.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

5.  **Run the server:**
    ```bash
    uvicorn app.main:app --reload
    ```

6.  **Access API:**
    - Swagger UI: [http://localhost:8000/docs](http://localhost:8000/docs)
    - ReDoc: [http://localhost:8000/redoc](http://localhost:8000/redoc)

## 🧪 Seed Data

On the first run, the application will automatically populate the database with:

- **Investor**: `investor@test.com` / `password`
- **Startup**: `startup@test.com` / `password`

## 📡 API Endpoints Overview

### **1. Authentication (`/auth`)**
*   **`POST /auth/register`**: Register a new user (Startup or Investor).
*   **`POST /auth/login`**: Login to receive an access token.
*   **`GET /auth/me`**: Get details of the currently logged-in user.

### **2. Startup (`/startup`)**
*   **`POST /startup/profile`**: Create a startup profile.
*   **`GET /startup/profile/{id}`**: View a specific startup profile.

### **3. Investor (`/investors`)**
*   **`POST /investors/profile`**: Create an investor profile.
*   **`GET /investors/`**: List all investors.
*   **`GET /investors/{id}`**: View a specific investor.

### **4. Pitch (`/pitches`)**
*   **`POST /pitches/upload`**: Upload a pitch deck (PDF, PPT).
*   **`POST /pitches/`**: Create a new pitch entry.
*   **`GET /pitches/my`**: View your created pitches (Startup only).
*   **`GET /pitches/feed`**: Pitch Feed for investors (supports filtering).

### **5. Matches (`/matches`)**
*   **`GET /matches/startup/{startup_id}`**: View potential investor matches for your startup.

### **6. Messaging (`/messages`)**
*   **`POST /messages/send`**: Send a message.
*   **`GET /messages/{user_id}`**: View message history with a specific user.

### **7. Notifications (`/notifications`)**
*   **`GET /notifications/`**: View all notifications.
*   **`PUT /notifications/{id}/read`**: Mark a notification as read.
*   **`POST /notifications/debug/create`**: (Debug) Manually create a notification.

### **8. Check Images (`/check-images`)**
*   **`GET /check-images/`**: List all images in the `images_check_api` folder.
*   **`GET /check-images/{filename}`**: View a specific image.

## 📝 Notes

- Pitch decks are stored in the `backend/uploads/` directory.
- The matching algorithm boosts scores based on Industry match (+50), Funding Stage match (+30), and a random factor (+0-20).
