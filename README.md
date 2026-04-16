# Store Ratings - PlayStation Edition

A role-based store rating application inspired by the PlayStation design system.

## 🚀 Deployment & Supabase Setup

This project is configured to use **Supabase** (PostgreSQL) for production-ready data persistence.

### 1. Database Setup
1. Create a project on [Supabase.com](https://supabase.com).
2. Go to **Settings > Database > Connection string** and copy the **Node.js** connection string.
3. Replace `[YOUR-PASSWORD]` with your actual database password.

### 2. Backend Configuration
Create a `.env` file in the `/server` directory:
```env
PORT=5000
DATABASE_URL=your_supabase_connection_string
JWT_SECRET=any_random_secure_string
```

### 3. Bootstrap the Roles
To initialize your database and create your first **System Administrator**, run the following command from the `/server` directory:
```bash
node scripts/setup-supabase.js "My Name" "admin@email.com" "SecurePassword123!"
```
*Note: The password must be 8-16 chars with 1 Uppercase and 1 Special Char.*

## 👥 User Role System

1. **System Administrator**: Can add/remove Users and Stores. Manage overall system metrics.
2. **Normal User**: Can search for stores, rate them (1-5), and write comments.
3. **Store Owner**: Associated with a specific store. Can view ratings and performance metrics for their own entity.

## 🛠️ Tech Stack
- **Frontend**: React, Tailwind CSS v4, Lucide Icons.
- **Backend**: Node.js, Express, PostgreSQL (Supabase).
- **Security**: JWT Authentication, Bcrypt password hashing.

---

Created with ❤️ for the PlayStation Gaming Community.
