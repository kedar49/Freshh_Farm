# Freshh Farm - E-commerce Platform

A full-stack e-commerce platform for fresh fruits and vegetables built with React 19, Node.js, and MongoDB.

## What It Does

**For Customers:**
- Browse and search products
- Shopping cart with persistent storage
- Secure checkout and order management
- User account with order history

**For Admins:**
- Product management (add, edit, delete)
- Order processing and tracking
- User management with role-based access
- Sales analytics dashboard

## Tech Stack

**Frontend:** React 19, Vite, TailwindCSS, Clerk Auth  
**Backend:** Node.js, Express, MongoDB, Clerk  
**Deployment:** Vercel

## Quick Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Clerk account

### Installation

```bash
# Clone and install
git clone https://github.com/kedar49/Freshh_Farm.git
cd Freshh_Farm
npm install

# Install frontend and backend dependencies
cd Frontend && npm install
cd ../Backend && npm install
```

### Environment Setup

**Frontend (.env):**
```
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key
VITE_API_URL=http://localhost:3000
VITE_APP_NAME=Freshh Farm
```

**Backend (.env):**
```
MONGODB_URI=your_mongodb_connection_string
CLERK_SECRET_KEY=your_clerk_secret
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

### Run Development

```bash
# Start both frontend and backend
npm run dev

# Or run separately
npm run dev:frontend  # Port 5173
npm run dev:backend   # Port 3000
```

## Project Structure

```
Freshh_Farm/
├── Frontend/           # React app
│   ├── src/
│   │   ├── components/ # UI components
│   │   ├── pages/      # Route pages
│   │   └── context/    # State management
│   └── package.json
├── Backend/            # Node.js API
│   ├── models/         # Database models
│   ├── routes/         # API endpoints
│   ├── controllers/    # Business logic
│   └── server.js
└── docs/              # Documentation
```

## Deployment

### Quick Deploy
```bash
npm install -g vercel
vercel --prod
```

Set these environment variables in Vercel Dashboard:

**Frontend:**
```
VITE_CLERK_PUBLISHABLE_KEY=pk_live_your_key
VITE_API_URL=https://your-backend.vercel.app
```

**Backend:**
```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/freshhfarm
CLERK_SECRET_KEY=sk_live_your_secret
NODE_ENV=production
CORS_ORIGIN=https://your-frontend.vercel.app
```

## Key Features

**Security:**
- Clerk authentication with role-based access
- Input validation and sanitization
- CORS protection
- Secure environment variables

**Performance:**
- Code splitting and lazy loading
- Image optimization
- CDN delivery via Vercel
- Responsive design

## Available Scripts

```bash
npm run dev          # Start development servers
npm run build        # Build for production
npm run lint         # Code linting
npm run install:all  # Install all dependencies
```

## Common Issues

**Build fails:** Check Node.js version (18+) and clear node_modules  
**Environment variables not working:** Frontend vars need VITE_ prefix  
**API not connecting:** Verify CORS_ORIGIN matches frontend URL exactly  
**Auth not working:** Check Clerk keys and add domain to Clerk dashboard

## What's Next

**Planned Features:**
- Payment integration (Stripe/Razorpay)
- Email notifications
- Customer reviews and ratings
- Advanced analytics
- Mobile app


## Support

- Email: support@freshhfarm.com
- Issues: [GitHub Issues](https://github.com/yourusername/Freshh_Farm/issues)

## License

MIT License - see [LICENSE](LICENSE) file for details.

---

**Made for farmers and fresh food lovers**