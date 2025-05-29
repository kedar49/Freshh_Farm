# Freshh Farm - Deployment Guide

## What You're Deploying

**Frontend:** React 19 + Vite + Tailwind + Clerk  
**Backend:** Node.js + Express + MongoDB + Clerk  
**Platform:** Vercel

## Before You Start

Make sure you have:
- MongoDB Atlas cluster ready
- Clerk app configured for production
- Latest code pushed to GitHub
- Domain name (if using custom domain)

## Environment Variables

**Frontend (.env):**
```
VITE_CLERK_PUBLISHABLE_KEY=pk_live_your_key
VITE_API_URL=https://your-backend.vercel.app
VITE_APP_NAME=Freshh Farm
VITE_APP_VERSION=1.0.0
```

**Backend (.env):**
```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/freshhfarm
CLERK_SECRET_KEY=sk_live_your_secret
PORT=3000
NODE_ENV=production
CORS_ORIGIN=https://your-frontend.vercel.app
```

## Quick Deploy (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy from project root
vercel

# Follow the prompts
# Project name: freshh-farm
# Framework: Other (for monorepo)
```

Add your environment variables in Vercel Dashboard → Settings → Environment Variables.

## Separate Deployments

If you want to deploy frontend and backend separately:

**Frontend:**
```bash
cd Frontend
vercel
# Framework: Vite
# Build: npm run build
# Output: dist
```

**Backend:**
```bash
cd Backend
vercel
# Framework: Other
# No build command needed
```

## Build Settings

**Frontend:**
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

**Backend:**
- No build command needed
- Runs as serverless functions

## Custom Domain Setup

1. Add domain in Vercel Dashboard → Domains
2. Update DNS as instructed
3. Update environment variables with new URLs
4. Add domain to Clerk dashboard
