# Admin Configuration Guide for Freshh Farm

## Overview

This guide explains how to configure admin roles in your Freshh Farm application using Clerk authentication and MongoDB.

## Setting Up Admin Roles

### 1. Create an Admin User in Clerk

1. Log in to your [Clerk Dashboard](https://dashboard.clerk.dev/)
2. Navigate to your application
3. Go to the "Users" section
4. Create a new user or select an existing user
5. Note the Clerk User ID for this user (you'll need it later)

### 2. Update User Role in MongoDB

You can set a user as an admin in two ways:

#### Option 1: Using the API Endpoint

Make a PUT request to the admin role update endpoint:

```bash
curl -X PUT http://localhost:3000/api/users/role \
  -H "Authorization: Bearer YOUR_CLERK_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"userId": "MONGODB_USER_ID", "role": "admin"}'
```

Note: This requires an existing admin user to make the request.

#### Option 2: Directly in MongoDB

If you don't have an admin user yet, you can update the role directly in MongoDB:

1. Connect to your MongoDB database
2. Find the user document in the `users` collection that corresponds to your Clerk user
3. Update the role field to "admin":

```javascript
db.users.updateOne(
  { clerkId: "user_2x0pnimjL2hsneEHqYwUnBJnnrc" },
  { $set: { role: "admin" } }
)
```

### 3. Verify Admin Status

To verify that a user has admin privileges:

1. Log in with the admin user credentials
2. Access the admin dashboard or make a request to a protected admin endpoint
3. Check that you have access to admin-only features

## Admin Features

As an admin, you can:

1. View all users in the system
2. Manage product inventory
3. Update other users' roles
4. Access sales and analytics data
5. Manage coupons and promotions

## Troubleshooting

### Common Issues

1. **Cannot see users list**: Make sure your user has the admin role set in MongoDB and you're properly authenticated with Clerk.

2. **Access denied to admin features**: Verify that:
   - Your user has the "admin" role in the database
   - You're properly authenticated with Clerk
   - The frontend is correctly checking for admin privileges

3. **Clerk development mode warning**: This is normal in development. For production, follow the [Clerk deployment guide](https://clerk.com/docs/deployments/overview) to set up production keys.

### Checking User Role

To check if a user has admin privileges in your React components:

```jsx
import { useAuth } from '@clerk/clerk-react';
import { useState, useEffect } from 'react';

function AdminComponent() {
  const { getToken } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const token = await getToken();
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setIsAdmin(data.user.role === 'admin');
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
      }
    };
    
    checkAdminStatus();
  }, []);
  
  if (!isAdmin) {
    return <p>You don't have admin access</p>;
  }
  
  return (
    <div>
      {/* Admin content here */}
    </div>
  );
}
```

## Next Steps

After configuring admin roles:

1. Create admin-only routes in your frontend application
2. Implement admin dashboards and management interfaces
3. Add role-based access control to sensitive API endpoints

For more information, refer to the [Clerk documentation](https://clerk.com/docs) and your application's API documentation.