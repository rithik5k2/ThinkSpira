# 🚀 Vercel Deployment Guide for ThinkSpira

This guide will help you deploy your ThinkSpira application to Vercel with both frontend and backend.

## 📋 Prerequisites

- Vercel account (free tier available)
- MongoDB Atlas account (for production database)
- Google OAuth credentials
- Git repository (GitHub recommended)

## 🔧 Pre-Deployment Setup

### 1. Environment Variables Setup

#### Backend Environment Variables (in Vercel Dashboard)

Go to your Vercel project settings and add these environment variables:

```env
# Database Configuration
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/thinkspira

# Server Configuration
NODE_ENV=production
PORT=5000

# Session Configuration
SESSION_SECRET=your-super-secret-session-key-here

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Frontend URL (will be set automatically by Vercel)
FRONTEND_URL=https://your-app-name.vercel.app
BACKEND_URL=https://your-app-name.vercel.app
```

#### Frontend Environment Variables

```env
# Backend API URL (will be the same as your Vercel app URL)
REACT_APP_API_URL=https://your-app-name.vercel.app

# Google OAuth (if needed on frontend)
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id
```

### 2. Google OAuth Setup for Vercel

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API and Google Classroom API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `https://your-app-name.vercel.app/auth/google/callback`
   - `http://localhost:5000/auth/google/callback` (for development)

## 🚀 Deployment Options

### Option 1: Single Vercel App (Recommended)

Deploy both frontend and backend as a single Vercel application.

#### Step 1: Prepare Your Repository

1. **Ensure your project structure looks like this:**

```
ThinkSpira/
├── api/
│   └── index.js              # ✅ Vercel serverless function
├── frontend/
│   ├── package.json
│   ├── vercel.json          # ✅ Frontend config
│   └── src/
├── backend/
│   ├── package.json
│   ├── vercel.json          # ✅ Backend config
│   └── routes/
├── vercel.json              # ✅ Main Vercel config
└── package.json
```

#### Step 2: Deploy to Vercel

1. **Install Vercel CLI:**

```bash
npm install -g vercel
```

2. **Login to Vercel:**

```bash
vercel login
```

3. **Deploy from project root:**

```bash
# Deploy to production
vercel --prod

# Or deploy to preview
vercel
```

4. **Set Environment Variables:**

```bash
# Set environment variables via CLI
vercel env add MONGO_URI
vercel env add SESSION_SECRET
vercel env add GOOGLE_CLIENT_ID
vercel env add GOOGLE_CLIENT_SECRET
vercel env add REACT_APP_API_URL
```

### Option 2: Separate Frontend and Backend Apps

Deploy frontend and backend as separate Vercel applications.

#### Deploy Backend First

1. **Navigate to backend directory:**

```bash
cd backend
```

2. **Deploy backend:**

```bash
vercel --prod
```

3. **Note the backend URL** (e.g., `https://thinkspira-backend.vercel.app`)

#### Deploy Frontend

1. **Navigate to frontend directory:**

```bash
cd frontend
```

2. **Update frontend environment:**

```bash
# Set the backend URL as environment variable
vercel env add REACT_APP_API_URL
# Enter: https://thinkspira-backend.vercel.app
```

3. **Deploy frontend:**

```bash
vercel --prod
```

## 🔧 Configuration Files Explained

### Root vercel.json

```json
{
  "version": 2,
  "builds": [
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    },
    {
      "src": "backend/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/backend/server.js"
    },
    {
      "src": "/auth/(.*)",
      "dest": "/backend/server.js"
    },
    {
      "src": "/(.*)",
      "dest": "/frontend/$1"
    }
  ]
}
```

### Frontend vercel.json

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

### Backend vercel.json

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/server.js"
    }
  ]
}
```

## 🗄️ Database Setup

### MongoDB Atlas (Recommended)

1. **Create MongoDB Atlas account:**

   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create a free cluster

2. **Get connection string:**

   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database password

3. **Set in Vercel:**
   ```bash
   vercel env add MONGO_URI
   # Enter: mongodb+srv://username:password@cluster.mongodb.net/thinkspira
   ```

## 🔐 Security Configuration

### Environment Variables Security

1. **Never commit .env files to Git**
2. **Use Vercel's environment variable system**
3. **Use strong, unique secrets for production**

### CORS Configuration

The app is configured to handle CORS automatically for Vercel URLs:

- Development: `http://localhost:3000`
- Production: Your Vercel app URL
- Custom domains: Add to `allowedOrigins` array

## 📊 Monitoring and Debugging

### Vercel Dashboard

1. **View deployment logs:**

   - Go to your project dashboard
   - Click on deployments
   - View function logs

2. **Monitor performance:**
   - Check function execution times
   - Monitor cold starts
   - View error rates

### Debug Commands

```bash
# View environment variables
vercel env ls

# View deployment logs
vercel logs

# Check function status
vercel inspect

# Redeploy with new environment variables
vercel --prod
```

## 🚨 Troubleshooting

### Common Issues

1. **Build Failures:**

   - Check Node.js version compatibility
   - Ensure all dependencies are in package.json
   - Check build logs in Vercel dashboard

2. **API Routes Not Working:**

   - Verify vercel.json routing configuration
   - Check function logs for errors
   - Ensure proper export in api/index.js

3. **Database Connection Issues:**

   - Verify MONGO_URI is set correctly
   - Check MongoDB Atlas IP whitelist
   - Ensure database user has proper permissions

4. **CORS Errors:**
   - Check FRONTEND_URL environment variable
   - Verify allowedOrigins configuration
   - Test with different browsers

### Debug Steps

```bash
# 1. Test locally with Vercel CLI
vercel dev

# 2. Check environment variables
vercel env pull .env.local

# 3. View function logs
vercel logs --follow

# 4. Test API endpoints
curl https://your-app.vercel.app/api/health
```

## 🔄 CI/CD with GitHub

### Automatic Deployments

1. **Connect GitHub repository to Vercel**
2. **Enable automatic deployments:**
   - Push to main branch = production deployment
   - Push to other branches = preview deployment

### GitHub Actions (Optional)

Create `.github/workflows/vercel.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          working-directory: ./
```

## 📈 Performance Optimization

### Vercel Optimizations

1. **Enable Edge Functions** for better performance
2. **Use Vercel's CDN** for static assets
3. **Optimize bundle size** with webpack analysis
4. **Implement caching** for API responses

### Database Optimizations

1. **Use MongoDB Atlas connection pooling**
2. **Implement proper indexing**
3. **Use MongoDB's built-in caching**

## 🎯 Quick Deployment Commands

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Login to Vercel
vercel login

# 3. Deploy to production
vercel --prod

# 4. Set environment variables
vercel env add MONGO_URI
vercel env add SESSION_SECRET
vercel env add GOOGLE_CLIENT_ID
vercel env add GOOGLE_CLIENT_SECRET

# 5. Redeploy with new environment variables
vercel --prod
```

## 🌐 Custom Domain Setup

1. **Add domain in Vercel dashboard:**

   - Go to project settings
   - Add your custom domain
   - Configure DNS records

2. **Update Google OAuth:**

   - Add custom domain to authorized redirect URIs
   - Update environment variables

3. **Update environment variables:**
   ```bash
   vercel env add FRONTEND_URL
   # Enter: https://your-custom-domain.com
   ```

---

## ✅ Deployment Checklist

- [ ] MongoDB Atlas database configured
- [ ] Google OAuth credentials set up
- [ ] Environment variables configured in Vercel
- [ ] Repository connected to Vercel
- [ ] Build successful
- [ ] API endpoints working
- [ ] Frontend loading correctly
- [ ] Authentication flow working
- [ ] Custom domain configured (optional)

Your ThinkSpira application is now ready for Vercel deployment! 🚀
