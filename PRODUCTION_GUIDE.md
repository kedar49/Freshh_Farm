# Freshh Farm Production Deployment Guide

## Overview

This guide provides comprehensive instructions for deploying Freshh Farm to production using Vercel, configuring Clerk authentication, setting up MongoDB Atlas, and managing webhooks.

## 1. Vercel Deployment Setup

### Frontend Deployment

1. **Prepare Your Repository**
   - Ensure your code is in a Git repository (GitHub, GitLab, or Bitbucket)
   - Verify all dependencies are listed in package.json
   - Check that build scripts are properly configured

2. **Deploy to Vercel**
   - Log in to [Vercel](https://vercel.com)
   - Click "New Project"
   - Import your repository
   - Configure project settings:
     ```env
     VITE_CLERK_PUBLISHABLE_KEY=pk_live_your_production_key
     VITE_API_URL=https://your-api-domain.com
     ```

3. **Configure Domain**
   - Add your custom domain in Vercel dashboard
   - Update DNS settings as per Vercel's instructions
   - Wait for SSL certificate provisioning

### Backend Deployment

1. **Configure Environment Variables**
   ```env
   # MongoDB Configuration
   MONGODB_URI=mongodb+srv://your-production-mongodb-uri

   # Clerk Authentication
   CLERK_SECRET_KEY=sk_live_your_production_secret_key

   # Server Configuration
   PORT=3000
   NODE_ENV=production

   # CORS Configuration
   CORS_ORIGIN=https://your-frontend-domain.com
   ```

2. **Deploy API**
   - Push your changes to the repository
   - Vercel will automatically build and deploy
   - Verify API endpoints are accessible

## 2. MongoDB Atlas Setup

1. **Create Production Cluster**
   - Log in to [MongoDB Atlas](https://cloud.mongodb.com)
   - Create a new cluster or upgrade existing to M0 (Free) or higher
   - Configure network access:
     - Add IP addresses for Vercel deployment
     - Set up network security rules

2. **Database Configuration**
   - Create production database
   - Set up collections:
     - users
     - products
     - orders
     - categories
   - Configure indexes for optimal performance

3. **Connection String**
   - Get your connection string from Atlas dashboard
   - Add to Vercel environment variables
   - Format: `mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority`

## 3. Clerk Production Setup

1. **Create Production Instance**
   - Log in to [Clerk Dashboard](https://dashboard.clerk.dev)
   - Create new production instance
   - Configure authentication settings

2. **API Keys**
   - Get production API keys:
     ```env
     CLERK_SECRET_KEY=sk_live_your_production_secret_key
     VITE_CLERK_PUBLISHABLE_KEY=pk_live_your_production_key
     ```
   - Add to Vercel environment variables

3. **Domain Configuration**
   - Add your production domain
   - Configure allowed origins
   - Set up email templates

## 4. Webhook Configuration

### Clerk Webhooks

1. **Setup Webhook Endpoints**
   - In Clerk Dashboard, go to Webhooks
   - Add endpoint: `https://your-api-domain.com/api/webhooks/clerk`
   - Select events to monitor:
     - user.created
     - user.updated
     - user.deleted

2. **Configure Webhook Security**
   - Get webhook signing secret from Clerk
   - Add to backend environment variables:
     ```env
     CLERK_WEBHOOK_SECRET=whsec_your_webhook_secret
     ```

3. **Implement Webhook Handlers**
   - Verify webhook signatures
   - Process user events
   - Update MongoDB accordingly

### Order Processing Webhooks

1. **Setup Order Webhooks**
   - Configure endpoints for order status updates
   - Implement order tracking system
   - Set up email notifications

## 5. Monitoring and Maintenance

1. **Setup Monitoring**
   - Configure Vercel analytics
   - Set up MongoDB Atlas monitoring
   - Implement error tracking (e.g., Sentry)

2. **Backup Strategy**
   - Configure MongoDB Atlas backups
   - Set up automated backup schedule
   - Test backup restoration process

3. **Performance Optimization**
   - Enable Vercel Edge Functions
   - Configure MongoDB indexes
   - Implement caching strategies

## Troubleshooting

### Common Issues

1. **Deployment Failures**
   - Check Vercel build logs
   - Verify environment variables
   - Review dependency versions

2. **Database Connection Issues**
   - Verify MongoDB connection string
   - Check network access settings
   - Review database user permissions

3. **Authentication Problems**
   - Confirm Clerk API keys
   - Check webhook configurations
   - Verify CORS settings

### Security Checklist

- [ ] SSL certificates are valid
- [ ] Environment variables are properly set
- [ ] Database access is restricted
- [ ] Webhook endpoints are secured
- [ ] CORS is properly configured
- [ ] Rate limiting is implemented
- [ ] Error handling doesn't expose sensitive data

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com)
- [Clerk Documentation](https://clerk.com/docs)
- [Vite Production Build Guide](https://vitejs.dev/guide/build.html)