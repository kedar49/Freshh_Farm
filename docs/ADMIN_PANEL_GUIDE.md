# Freshh Farm Admin Panel Setup

Hey! Here's everything you need to know about setting up and working with the Freshh Farm admin panel.

## What We're Using

We built this with some solid tools that work well together:
- **React 19** with Vite for fast development
- **Tailwind CSS** for styling (makes everything look clean)
- **Clerk** handles all our authentication and user roles
- **React Router** for navigation between pages
- **React Context** to manage app state

## Where to Find It

When you're developing locally, you'll find the dashboard at:
`http://localhost:5173/clerk-dashboard`

Once it's live, it'll be at your main domain with the same path.

## How the Pages Are Set Up

The dashboard has several main sections:
- **Home** - Main dashboard overview
- **Products** - Add, edit, and manage all products
- **Orders** - Handle customer orders and order status
- **Users** - Manage customer accounts and staff
- **Inventory** - Track stock levels and manage supplies
- **Analytics** - View sales reports and performance data
- **Settings** - Configure system preferences

## File Organization

I've organized the code to make it easy to find what you need:

```
src/pages/ClerkDashboard/
├── index.jsx        # Main layout and navigation
├── Products.jsx     # Everything product-related
├── Orders.jsx       # Order management features
├── Users.jsx        # User and customer management
├── Inventory.jsx    # Stock tracking and updates
├── Analytics.jsx    # Charts and reports
└── Settings.jsx     # System configuration
```

## Security and Access

We use Clerk to make sure only the right people can access the admin panel. Here's how the different roles work:

**Admin** - Can do everything:
- Manage all products and orders
- Add/remove users and change their roles
- View all analytics and reports
- Change system settings
- Handle inventory

**Seller** - Focused on sales:
- Manage their own products
- View and process orders
- Update inventory levels
- See basic sales analytics

**Inventory Manager** - Stock focused:
- Manage all inventory and stock levels
- View product information
- Update stock quantities

**Support** - Customer service:
- View customer orders
- Update order statuses
- Access customer information

## API Setup

The backend API is pretty straightforward. Here are the main endpoints you'll work with:

**For Products:**
- Get all products: `GET /api/products`
- Add new product: `POST /api/products`
- Update product: `PUT /api/products/:id`
- Delete product: `DELETE /api/products/:id`

**For Orders:**
- Get all orders: `GET /api/orders`
- Update order status: `PUT /api/orders/:id/status`

**For Users:**
- Get user list: `GET /api/users`
- Change user role: `PUT /api/users/role`

## Development Setup

If you're setting this up for development, add these to your `.env` file:

```
# This will automatically make your email an admin (only use in development!)
ADMIN_EMAIL=your-email@example.com
AUTO_PROMOTE_ADMIN=true
```

**Important:** Make sure to remove or set `AUTO_PROMOTE_ADMIN=false` before going to production!

## Getting Started

1. Clone the project and install dependencies
2. Set up your environment variables
3. Start the development server
4. Sign in with Clerk - if you used the admin email above, you'll automatically get admin access
5. Start managing your farm's data!

The interface is designed to be intuitive, but if you get stuck on anything, the code is well-commented and organized logically.