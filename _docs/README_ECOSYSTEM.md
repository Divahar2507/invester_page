# Ecosystem Project Structure

This project has been unified into a single Docker Compose environment, connecting all components as per the "Complete Project" flow.

## 🚀 Quick Start

1. **Build and Run**:
   ```bash
   docker-compose up --build
   ```
   *Note: This brings up multiple services. It might take a few minutes.*

2. **Access the Portal**:
   - Open **[http://localhost:3000](http://localhost:3000)**
   - This is the **Central Landing Page** connecting to all apps.

## 🔗 Architecture & Ports

| Application | URL | Backend Port | Database Port |
|-------------|-----|--------------|---------------|
| **Landing Page** | [http://localhost:3000](http://localhost:3000) | N/A | N/A |
| **Investor Platform** | [http://localhost:80](http://localhost:80) | 8000 | 5433 |
| **Startup Dashboard** | [http://localhost:3001](http://localhost:3001) | 8000 | 5433 |
| **LeadGen Tool** | [http://localhost:3003](http://localhost:3003) | 8003 | 5435 |
| **Admin Dashboard** | [http://localhost:3004](http://localhost:3004) | 8004 | N/A |
| **Connector** | [http://localhost:3005](http://localhost:3005) | 8005 | 5436 |

## 📂 Directory Map

- `landing_page/`: The central portal code.
- `invester pitch/`: Main backend + Investor/Startup frontends.
- `leadgen/leadgen/`: LeadGen tool full stack.
- `collabrater/`: Connector application.
- `ai-admin/`: Super Admin & AI components.

## 🛠 Troubleshooting

- **Ports**: If a port is in use, check `docker-compose.yml` and modify the first number (e.g., `3001:5173` -> `3011:5173`).
- **Memory**: Ensure Docker has enough memory allocated (4GB+ recommended).
