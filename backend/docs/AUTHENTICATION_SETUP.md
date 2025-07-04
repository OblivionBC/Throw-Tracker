# JWT Authentication Setup

## Overview

This application uses JWT (JSON Web Tokens) for authentication. Tokens are stored in HTTP-only cookies for security.

## Environment Variables Required

Create a `.env` file in the `backend/server/` directory with the following variables:

```env
# Database Configuration
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=your_database_name

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
JWT_EXPIRES_IN=24h

# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL for CORS
FRONTEND_URL=http://localhost:3000
```

## Authentication Flow

1. **Login**: User submits credentials to `/api/persons/login`

   - Server verifies credentials against database
   - If valid, creates JWT token and sets it as HTTP-only cookie
   - Returns success message

2. **Protected Routes**: All routes except login/logout require authentication

   - Middleware checks for JWT token in cookies
   - Verifies token using JWT_SECRET
   - Adds user info to `req.user` if valid
   - Returns 401/403 if invalid or missing

3. **Logout**: User calls `/api/persons/logout`
   - Server clears the JWT cookie

## Protected Routes

All the following routes now require authentication:

- `/api/persons/*` (except login/logout)
- `/api/practices/*`
- `/api/exercises/*`
- `/api/meets/*`
- `/api/events/*`
- `/api/measurables/*`
- `/api/measurements/*`
- `/api/exercise-assignments/*`
- `/api/programs/*`
- `/api/training-periods/*`

## Middleware

The authentication middleware is located in `middleware/auth.js`:

- `requireAuth`: Requires valid JWT token
- `optionalAuth`: Optional authentication (not currently used)

## Security Features

- HTTP-only cookies prevent XSS attacks
- Secure cookies in production
- CORS configured for frontend origin
- Rate limiting enabled
- Helmet.js for security headers
