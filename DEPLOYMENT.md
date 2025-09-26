# 🚀 ThinkSpira Deployment Guide

This guide covers multiple deployment options for your ThinkSpira application.

## 📋 Prerequisites

- Node.js 18+ and npm 8+
- MongoDB (local or cloud)
- Google OAuth credentials
- Git

## 🔧 Pre-Deployment Setup

### 1. Environment Variables

Create the following environment files:

#### Backend (.env in backend/ folder)

```env
# Database Configuration
MONGO_URI=mongodb://localhost:27017/thinkspira
# For production, use MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/thinkspira

# Server Configuration
PORT=5000
NODE_ENV=production

# Session Configuration
SESSION_SECRET=your-super-secret-session-key-here

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Frontend URL (for CORS and redirects)
FRONTEND_URL=https://your-frontend-domain.com
BACKEND_URL=https://your-backend-domain.com
```

#### Frontend (.env in frontend/ folder)

```env
# Backend API URL
REACT_APP_API_URL=https://your-backend-domain.com

# Google OAuth (if needed on frontend)
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id
```

### 2. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API and Google Classroom API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:5000/auth/google/callback` (development)
   - `https://your-backend-domain.com/auth/google/callback` (production)

## 🐳 Option 1: Docker Deployment (Recommended)

### Local Docker Deployment

```bash
# 1. Clone and navigate to project
git clone <your-repo>
cd ThinkSpira

# 2. Set up environment variables
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
# Edit the .env files with your actual values

# 3. Build and run with Docker Compose
docker-compose up --build

# 4. Access the application
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
# MongoDB: localhost:27017
```

### Production Docker Deployment

```bash
# 1. Set production environment variables
export NODE_ENV=production
export MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/thinkspira
export SESSION_SECRET=your-production-secret
export GOOGLE_CLIENT_ID=your-client-id
export GOOGLE_CLIENT_SECRET=your-client-secret
export FRONTEND_URL=https://your-domain.com
export BACKEND_URL=https://api.your-domain.com

# 2. Build and deploy
docker-compose -f docker-compose.prod.yml up -d
```

## ☁️ Option 2: Cloud Platform Deployment

### Heroku Deployment

#### Backend (Heroku)

1. **Create Heroku App:**

```bash
# Install Heroku CLI
npm install -g heroku

# Login to Heroku
heroku login

# Create backend app
heroku create thinkspira-backend

# Add MongoDB addon
heroku addons:create mongolab:sandbox

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set SESSION_SECRET=your-secret-key
heroku config:set GOOGLE_CLIENT_ID=your-client-id
heroku config:set GOOGLE_CLIENT_SECRET=your-client-secret
heroku config:set FRONTEND_URL=https://thinkspira-frontend.herokuapp.com
```

2. **Deploy Backend:**

```bash
cd backend
git init
git add .
git commit -m "Initial commit"
git push heroku main
```

#### Frontend (Netlify/Vercel)

1. **Build the frontend:**

```bash
cd frontend
npm run build
```

2. **Deploy to Netlify:**

   - Connect your GitHub repository
   - Set build command: `npm run build`
   - Set publish directory: `build`
   - Add environment variable: `REACT_APP_API_URL=https://thinkspira-backend.herokuapp.com`

3. **Deploy to Vercel:**

```bash
npm install -g vercel
cd frontend
vercel --prod
```

### Railway Deployment

1. **Connect GitHub repository to Railway**
2. **Set environment variables in Railway dashboard**
3. **Deploy automatically on push**

### DigitalOcean App Platform

1. **Create new app from GitHub**
2. **Configure services:**
   - Backend service (Node.js)
   - Frontend service (Static site)
   - Database service (MongoDB)

## 🔧 Option 3: VPS/Server Deployment

### Ubuntu Server Setup

```bash
# 1. Update system
sudo apt update && sudo apt upgrade -y

# 2. Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. Install PM2 for process management
sudo npm install -g pm2

# 4. Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org

# 5. Install Nginx
sudo apt install nginx -y

# 6. Clone and setup project
git clone <your-repo>
cd ThinkSpira
npm run install:all

# 7. Build frontend
npm run build:frontend

# 8. Start with PM2
pm2 start backend/server.js --name "thinkspira-backend"
pm2 start "npx serve -s frontend/build -l 3000" --name "thinkspira-frontend"
pm2 save
pm2 startup
```

### Nginx Configuration

Create `/etc/nginx/sites-available/thinkspira`:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Auth routes
    location /auth {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/thinkspira /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 🔒 SSL/HTTPS Setup

### Using Let's Encrypt (Certbot)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## 📊 Monitoring and Maintenance

### Health Checks

- Backend health: `GET /api/health`
- Frontend: Check if React app loads
- Database: Check MongoDB connection

### Logs

```bash
# Docker logs
docker-compose logs -f

# PM2 logs
pm2 logs

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Backup

```bash
# MongoDB backup
mongodump --uri="mongodb://localhost:27017/thinkspira" --out=/backup/$(date +%Y%m%d)

# Restore
mongorestore --uri="mongodb://localhost:27017/thinkspira" /backup/20240101/thinkspira
```

## 🚨 Troubleshooting

### Common Issues

1. **CORS Errors**: Check FRONTEND_URL and BACKEND_URL environment variables
2. **Google OAuth Issues**: Verify redirect URIs in Google Console
3. **Database Connection**: Check MONGO_URI and network access
4. **Session Issues**: Ensure SESSION_SECRET is set and consistent

### Debug Commands

```bash
# Check environment variables
printenv | grep -E "(MONGO|GOOGLE|SESSION|FRONTEND|BACKEND)"

# Test database connection
node -e "const mongoose = require('mongoose'); mongoose.connect(process.env.MONGO_URI).then(() => console.log('Connected')).catch(console.error)"

# Check if ports are open
netstat -tulpn | grep -E "(3000|5000|27017)"
```

## 📈 Performance Optimization

1. **Enable Gzip compression in Nginx**
2. **Use CDN for static assets**
3. **Implement Redis for session storage**
4. **Add database indexing**
5. **Use PM2 cluster mode for backend**

## 🔄 CI/CD Pipeline

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: "18"

      - name: Install dependencies
        run: npm run install:all

      - name: Build frontend
        run: npm run build:frontend

      - name: Deploy to server
        run: |
          # Add your deployment commands here
          echo "Deploying to production..."
```

---

## 🎯 Quick Start Commands

```bash
# Development
npm run dev

# Production build
npm run build

# Docker deployment
docker-compose up --build

# Install all dependencies
npm run install:all

# Check logs
npm run docker:logs
```

Choose the deployment option that best fits your needs and infrastructure requirements!
