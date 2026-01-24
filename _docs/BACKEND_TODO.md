# Backend Todo List for Full Production Readiness

This document outlines the remaining tasks to move the backend from a developer/demo state to a fully production-ready system.

## 1. Integrations & External Services

- [ ] **Google Calendar API Integration**
  - **Current Status**: Button exists, data saved to DB, but no event created on Google Calendar.
  - **Task**: Implement server-side Google Calendar API flow (using service account or OAuth token) to actually schedule the meeting and generate a Meet link.
  - **File**: `backend/app/routes/social.py` (see TODO).
  
- [ ] **Email Service (SendGrid / AWS SES)**
  - **Current Status**: Emails are printed to console (`mock_send_email`).
  - **Task**: Integrate a real email provider to send:
    - Welcome emails on registration.
    - Password reset links.
    - Notifications (New match, Message received, Meeting scheduled).
  - **File**: `backend/app/routes/auth.py` and `backend/app/utils/email.py` (needs creation).

- [ ] **Cloud Storage (AWS S3 / Cloudinary)**
  - **Current Status**: Files are saved locally to `backend/uploads/`. This will vanish if the container is rebuilt or on serverless deployment.
  - **Task**: Switch file upload logic to use AWS S3 (boto3) or Cloudinary.
  - **File**: `backend/app/routes/pitch.py`, `backend/app/routes/file_upload.py`.

## 2. Advanced Features

- [ ] **Real-Time Messaging (WebSockets)**
  - **Current Status**: Messaging works via REST API (polling required for updates).
  - **Task**: Implement `FastAPI WebSockets` for instant message delivery and connection status ("User is typing...").
  - **File**: `backend/app/routes/messaging.py`.

- [ ] **AI Analysis Integration**
  - **Current Status**: Matching uses basic heuristic (`matching.py`). Frontend calls `aiService` which needs a backend endpoint if we want to hide API keys.
  - **Task**: Create a backend endpoint that acts as a proxy to OpenAI/Gemini APIs to analyze pitch decks and return summaries/scores, keeping keys secure on the server.
  - **File**: `backend/app/routes/ai_analysis.py` (needs creation).

- [ ] **Payment Gateway (Stripe/Razorpay)**
  - **Current Status**: None.
  - **Task**: If the platform has paid tiers (e.g. for investors to see premium deal flow), integrate Stripe webhooks and checkout sessions.

## 3. Data & Models

- [ ] **Valuation Logic**
  - **Current Status**: Frontend expects `valuation`, backend sends `TBD`.
  - **Task**: Add `valuation` field to `Pitch` model and `PitchBase` schema. Allow startups to input this or calculate based on `ask` / `equity`.
  
- [ ] **Admin Panel**
  - **Current Status**: None.
  - **Task**: Create Admin routes (or use `sqladmin`) to:
    - Approve/Ban users.
    - Verify startups (KYB).
    - View platform analytics.

## 4. Security & Optimization

- [ ] **Rate Limiting**
  - **Task**: Use `fastapi-limiter` to prevent abuse of API endpoints (especially Auth and Messaging).
  
- [ ] **Input Sanitization**
  - **Task**: Ensure all inputs (especially rich text descriptions) are sanitized to prevent XSS.

- [ ] **Database Migrations (Alembic)**
  - **Current Status**: Using `Base.metadata.create_all(bind=engine)` which is good for dev, but bad for evolving schema.
  - **Task**: Initialize Alembic (`alembic init alembic`) and create migration scripts for all table changes.

## 5. Deployment

- [ ] **CI/CD Pipeline**
  - **Task**: Create GitHub Actions to run tests (`pytest`) and build Docker images on push.
  
- [ ] **HTTPS/SSL**
  - **Task**: Ensure Nginx or Load Balancer handles SSL termination in production.
