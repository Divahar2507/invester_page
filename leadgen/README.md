# LeadGen Project

A full-stack lead generation application built with FastAPI (Backend) and React (Frontend).

## Project Structure

- **backend_fastapi**: Python FastAPI application for the backend API.
- **frontend**: React application for the user interface.
- **data**: Contains source data files locally.

## Prerequisites

- Python 3.9+
- Node.js & npm
- PostgreSQL database

## Setup & Installation

### Backend

1. Navigate to the backend directory:
   ```bash
   cd backend_fastapi
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   # Windows
   .\venv\Scripts\Activate
   # Linux/Mac
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure environment variables in `.env` (ensure DB credentials are set).

### Frontend

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Application

You can run both servers simultaneously using separate terminals.

**Backend:**
```bash
cd backend_fastapi
# Activate venv first
uvicorn app.main:app --reload
```
Server runs at: http://localhost:8000

**Frontend:**
```bash
cd frontend
npm start
```
App runs at: http://localhost:3000

## Features

- User Authentication & Role Management
- Influencer Management
- Lead Management & Data Import
- Email Campaigns
