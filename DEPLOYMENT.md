# Production Deployment Guide

## Prerequisites
- Docker and Docker Compose installed
- Domain name configured
- SSL certificate (Let's Encrypt)
- Cloud database (AWS RDS, DigitalOcean, etc.)
- Email service API key (SendGrid, AWS SES)

## Step 1: Environment Setup

1. **Copy environment template:**
   ```bash
   cp .env.example .env.production
   ```

2. **Fill in production values in `.env.production`:**
   - `DATABASE_URL`: Your cloud database connection string
   - `SECRET_KEY`: Generate with `openssl rand -hex 32`
   - `GOOGLE_CLIENT_SECRET`: From Google Cloud Console
   - `SENDGRID_API_KEY`: From SendGrid dashboard
   - `FRONTEND_URL`: Your domain (e.g., https://yourapp.com)
   - `AWS_S3_BUCKET`: For file uploads (if using S3)

## Step 2: Database Migration

1. **Create production database:**
   ```bash
   # Example for PostgreSQL on cloud
   createdb yourappname_production
   ```

2. **Run migrations** (when you have Alembic setup):
   ```bash
   alembic upgrade head
   ```

## Step 3: Build for Production

1. **Build Docker images:**
   ```bash
   docker-compose -f docker-compose.prod.yml build
   ```

2. **Test locally with production config:**
   ```bash
   docker-compose -f docker-compose.prod.yml up
   ```

## Step 4: Deploy to Cloud

### Option A: DigitalOcean App Platform
1. Connect your GitHub repository
2. Configure environment variables in dashboard
3. Deploy automatically on push to main branch

### Option B: AWS ECS
1. Push Docker images to ECR
2. Create ECS task definition
3. Configure load balancer
4. Deploy to ECS service

### Option C: Manual VPS (DigitalOcean Droplet, Linode)

1. **SSH into server:**
   ```bash
   ssh root@your-server-ip
   ```

2. **Install Docker:**
   ``` bash
   curl -fsSL https://get.docker.com -o get-docker.sh
   sh get-docker.sh
   ```

3. **Clone repository:**
   ```bash
   git clone https://github.com/yourusername/yourrepo.git
   cd yourrepo
   ```

4. **Set up environment:**
   ```bash
   cp .env.example .env.production
   nano .env.production  # Edit with production values
   ```

5. **Run with Docker Compose:**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

6. **Set up Nginx reverse proxy:**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       
       location / {
           proxy_pass http://localhost:80;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
       
       location /api/ {
           proxy_pass http://localhost:8000/;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

7. **Install SSL with Certbot:**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com
   ```

## Step 5: Post-Deployment

1. **Verify health check:**
   ```bash
   curl https://yourdomain.com/api/health
   ```

2. **Monitor logs:**
   ```bash
   docker-compose -f docker-compose.prod.yml logs -f
   ```

3. **Set up automatic backups:**
   - Database: Daily snapshots
   - Files: S3 versioning

4. **Configure monitoring:**
   - Uptime: UptimeRobot, Pingdom
   - Errors: Sentry
   - Analytics: Google Analytics, PostHog

## Step 6: Continuous Deployment

### GitHub Actions (.github/workflows/deploy.yml)
```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /var/www/yourapp
            git pull origin main
            docker-compose -f docker-compose.prod.yml up -d --build
```

## Important Security Checklist

- [ ] All secrets in environment variables (not in code)
- [ ] HTTPS enabled (SSL certificate)
- [ ] Database password is strong (20+ characters)
- [ ] CORS restricted to your domain only
- [ ] Firewall configured (only ports 80, 443, 22 open)
- [ ] SSH key authentication (password disabled)
- [ ] Regular security updates scheduled

## Monitoring Commands

**Check container status:**
```bash
docker-compose ps
```

**View logs:**
```bash
docker-compose logs backend
docker-compose logs frontend
```

**Database backup:**
```bash
docker exec -t pitch_platform_db pg_dump -U postgres dbname > backup.sql
```

**Restore database:**
```bash
docker exec -i pitch_platform_db psql -U postgres dbname < backup.sql
```

## Rollback Procedure

If something goes wrong:

1. **Check logs:**
   ```bash
   docker-compose logs --tail=100
   ```

2. **Rollback to previous Docker image:**
   ```bash
   git checkout <previous-commit>
   docker-compose up -d --build
   ```

3. **Restore database from backup** (if needed)

## Performance Tips

1. **Enable gzip compression** in Nginx
2. **Use CDN** for static files (Cloudflare, AWS CloudFront)
3. **Enable database connection pooling**
4. **Add Redis caching** for frequently accessed data
5. **Monitor slow queries** and add indexes

## Support & Maintenance

- **Check health endpoint daily:** https://yourapp.com/api/health
- **Review logs weekly** for errors
- **Update dependencies monthly**
- **Test backups quarterly**
- **Security audit annually**
