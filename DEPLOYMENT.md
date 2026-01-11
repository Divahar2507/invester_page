# Deployment Guide for Real World Production

This project is containerized using Docker, making it easy to deploy on any server (AWS EC2, DigitalOcean Droplet, Azure VM) or container platform (Render, Railway).

## Prerequisites
- A server with **Docker** and **Docker Compose** installed.
- A valid domain name (optional, but recommended for production).

## Steps to Deploy

### 1. Security Configuration
Before deploying, you **MUST** change the default passwords and secret keys.
Create a `.env.prod` file or set these environment variables on your server:

```bash
POSTGRES_USER=postgres
POSTGRES_PASSWORD=UseAStrongPasswordHere
POSTGRES_DB=pitch_platform_prod
SECRET_KEY=GenerateAComplexRandomStringForSecurity
```

### 2. Run in Production Mode
Use the production docker-compose file which sets up Nginx (Frontend), FastAPI (Backend), and PostgreSQL (Database).

```bash
# Build and run in detached mode
docker-compose -f docker-compose.prod.yml up --build -d
```

### 3. Verify Deployment
Visit your server's IP address (e.g., `http://your-server-ip`).
- The Frontend should load via Nginx on port 80.
- Ensure API calls work (Nginx proxies `/api` calls to the backend).

## Domain & SSL (HTTPS)
For a real-world app, you need HTTPS.
1. Point your domain A record to your server IP.
2. Use **Certbot** or run a separate Nginx Reverse Proxy container (like `nginx-proxy` + `acme-companion`) to handle SSL encryption automatically.

## Data Persistence
- Database data is stored in the `postgres_data_prod` Docker volume.
- Uploaded files are stored in `production_uploads`.
- backups: Ensure you regularly backup the `/var/lib/docker/volumes` or configure an external database (e.g., AWS RDS).

## Troubleshooting
Check logs if something isn't working:
```bash
docker-compose -f docker-compose.prod.yml logs -f
```
