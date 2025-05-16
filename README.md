# Freshh Farm - 

## Overview
Freshh Farm is a modern e-commerce platform built with the MERN stack (MongoDB, Express.js, React, Node.js) and Clerk authentication. The platform features both customer-facing e-commerce functionality and an admin dashboard for inventory and order management.

## Tech Stack
- **Frontend**: React.js with Vite, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas
- **Authentication**: Clerk
- **Deployment**: Vercel

## Project Structure
```
Freshh_Farm/
├── .env                 # Root environment variables
├── Frontend/           # React frontend application
├── Backend/            # Express.js backend API
└── README.md          # Project documentation
```

## Prerequisites
- Node.js (v16 or later)
- MongoDB Atlas account
- Clerk account
- Vercel account (for deployment)

## Environment Variables
Create a `.env` file in the root directory with the following variables:

```env
# MongoDB Configuration
MONGODB_URI=your_mongodb_connection_string

# Clerk Authentication
CLERK_SECRET_KEY=your_clerk_secret_key
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key

# Server Configuration
PORT=3000
NODE_ENV=production

# Frontend Configuration
VITE_API_URL=your_api_url

# CORS Configuration
CORS_ORIGIN=your_frontend_domain
```

## Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/Freshh_Farm.git
   cd Freshh_Farm
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd Backend
   npm install

   # Install frontend dependencies
   cd ../Frontend
   npm install
   ```

3. **Development**
   ```bash
   # Start backend server
   cd Backend
   npm run dev

   # Start frontend development server
   cd Frontend
   npm run dev
   ```

## API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Product Endpoints
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create new product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)

### Order Endpoints
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get order by ID

### Admin Endpoints
- `GET /api/admin/users` - Get all users (Admin only)
- `GET /api/admin/orders` - Get all orders (Admin only)
- `PUT /api/admin/users/:id/role` - Update user role (Admin only)

## Clerk Authentication Setup

1. **Create a Clerk Application**
   - Sign up at [Clerk.dev](https://clerk.dev)
   - Create a new application
   - Get your API keys

2. **Configure Clerk**
   - Add your domain in Clerk Dashboard
   - Set up OAuth providers if needed
   - Configure email templates

3. **Production Setup**
   - Replace development keys with production keys
   - Update allowed origins
   - Deploy certificates

## MongoDB Atlas Setup

1. **Create Cluster**
   - Sign up for [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a new cluster
   - Configure network access

2. **Database Setup**
   - Create database user
   - Get connection string
   - Update environment variables

## Deployment

### Backend Deployment
1. **Prepare for Production**
   ```bash
   cd Backend
   npm run build
   ```

2. **Deploy to Vercel**
   - Connect your GitHub repository
   - Configure environment variables
   - Set up custom domain if needed

### Frontend Deployment
1. **Build Frontend**
   ```bash
   cd Frontend
   npm run build
   ```

2. **Deploy to Vercel**
   - Import your project
   - Configure environment variables
   - Set up custom domain

## Admin Panel Configuration

1. **Create Admin User**
   - Register a new user
   - Use MongoDB to set role as 'admin'
   ```javascript
   db.users.updateOne(
     { email: 'admin@example.com' },
     { $set: { role: 'admin' } }
   )
   ```

2. **Access Admin Dashboard**
   - Login with admin credentials
   - Navigate to /clerk-dashboard

## Security Considerations
- Use environment variables for sensitive data
- Enable CORS protection
- Implement rate limiting
- Use secure headers
- Regular security audits

## Troubleshooting

### Common Issues
1. **Connection Issues**
   - Check MongoDB connection string
   - Verify network access settings
   - Check CORS configuration

2. **Authentication Problems**
   - Verify Clerk API keys
   - Check token expiration
   - Confirm user roles

3. **Deployment Issues**
   - Check environment variables
   - Verify build process
   - Review Vercel logs

## Support
For support, please create an issue in the GitHub repository or contact the development team.

## License
This project is licensed under the MIT License - see the LICENSE file for details.

