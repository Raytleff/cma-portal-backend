# CMA Portal Backend

A robust Node.js backend application built with Express, TypeScript, Prisma, and PostgreSQL. Features JWT authentication, Google OAuth integration, and real-time Socket.IO capabilities.

## 🚀 Features

- **TypeScript** for type-safe development
- **Express.js** for RESTful API
- **Prisma ORM** for database management
- **JWT Authentication** with refresh tokens
- **Google OAuth 2.0** integration
- **Socket.IO** for real-time communication
- **Rate limiting** for security
- **bcrypt** password hashing
- **CORS** enabled with custom options

## 📋 Prerequisites

- **Node.js** (v19 or higher)
- **npm** or **yarn**
- **PostgreSQL** (v12 or higher)
- **Git** with configured user credentials

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd cma-portal-backend
```

### 2. Configure Git (First Time Only)

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Environment Setup

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
DATABASE_URL="postgresql://username:password@localhost:5432/cma_portal"

# JWT Secrets (generate strong random strings)
JWT_SECRET=your_super_secret_jwt_key_here
REFRESH_TOKEN_SECRET=your_super_secret_refresh_token_key_here

# Session Secret
SESSION_SECRET=your_session_secret_key_here

# Google OAuth (Optional)
GOOGLE_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Supabase (if using)
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key

# Frontend URL
CLIENT_URL=http://localhost:3000
```

### 5. Database Setup

#### Create PostgreSQL Database

```bash
# Access PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE cma_portal;

# Exit
\q
```

#### Run Prisma Migrations

```bash
# Generate Prisma Client
npx prisma generate

# Create and run migrations
npx prisma migrate dev --name init

# (Optional) Open Prisma Studio to view data
npx prisma studio
```

### 6. Start Development Server

```bash
npm run dev
```

Server will be running at `http://localhost:5000` 🎉

## 📁 Project Structure

```
cma-portal-backend/
├── config/
│   ├── corsOptions.ts       # CORS configuration
│   ├── prisma.ts            # Prisma client instance
│   └── supabase.ts          # Supabase client
├── controller/
│   ├── usersController.ts   # User CRUD operations
│   └── googleController.ts  # Google OAuth handlers
├── middleware/
│   ├── authMiddleware.ts    # JWT verification
│   ├── errorMiddleware.ts   # Error handling
│   ├── generateToken.ts     # Token generation
│   └── limiterMiddleware.ts # Rate limiting
├── routes/
│   ├── usersRoutes.ts       # User endpoints
│   ├── googleRoutes.ts      # OAuth endpoints
│   └── uploadImageRoutes.ts # Image upload endpoints
├── service/
│   └── googleService.ts     # Google OAuth service
├── prisma/
│   └── schema.prisma        # Database schema
├── .env                     # Environment variables
├── server.ts                # Application entry point
├── tsconfig.json            # TypeScript config
└── package.json             # Dependencies
```

## 🔌 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/users/loginUser` | User login | ❌ |
| POST | `/api/users/createUser` | Register new user | ❌ |
| GET | `/api/users/refreshToken` | Refresh JWT token | ❌ |

### Users (Protected)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/users/allUsers` | Get all users | ✅ |
| GET | `/api/users/userById/:id` | Get user by ID | ✅ |
| PUT | `/api/users/updateUser/:id` | Update user | ✅ |
| DELETE | `/api/users/deleteUser/:id` | Delete user | ✅ |

### Google OAuth (Optional)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/auth/google` | Initiate Google OAuth | ❌ |
| GET | `/api/auth/google/callback` | OAuth callback | ❌ |
| GET | `/api/auth/logout` | User logout | ❌ |

## 📝 Available Scripts

```bash
# Development
npm run dev              # Start with hot reload (tsx watch)

# Production
npm run build            # Compile TypeScript to JavaScript
npm start                # Run compiled code

# Database
npx prisma studio        # Open Prisma Studio GUI
npx prisma migrate dev   # Create new migration
npx prisma generate      # Regenerate Prisma Client
npx prisma db push       # Push schema without migration
```

## 🔐 Authentication Flow

### JWT Authentication
1. User logs in with credentials
2. Server validates and returns JWT access token + refresh token (HTTP-only cookie)
3. Client includes JWT in Authorization header for protected routes
4. Refresh token used to obtain new access token when expired

### Google OAuth
1. User clicks "Login with Google"
2. Redirected to Google consent screen
3. Google redirects back with authorization code
4. Server exchanges code for user profile
5. User registered/logged in, refresh token set in cookie

## 🛡️ Security Features

- **JWT tokens** with expiration
- **Refresh tokens** stored in HTTP-only cookies
- **bcrypt** password hashing (10 salt rounds)
- **Rate limiting** on login endpoint
- **CORS** with whitelist configuration
- **Secure session** management
- **Environment variable** protection

## 🐛 Troubleshooting

### Module Not Found Error
```bash
# Ensure all imports have .js extensions
import { something } from './file.js'  # ✅ Correct
import { something } from './file'     # ❌ Wrong

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Database Connection Issues
```bash
# Check if PostgreSQL is running
sudo service postgresql status

# Verify DATABASE_URL in .env
# Format: postgresql://USER:PASSWORD@HOST:PORT/DATABASE

# Regenerate Prisma Client
npx prisma generate
```

### CORS Errors
- Verify `CLIENT_URL` in `.env` matches your frontend
- Check `corsOptions` in `config/corsOptions.ts`
- Ensure credentials are included in frontend requests

### Port Already in Use
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>

# Or use a different port in .env
PORT=5001
```

## 🚢 Production Deployment

### 1. Environment Setup
```bash
NODE_ENV=production
# Update DATABASE_URL to production database
# Use strong, randomly generated secrets
```

### 2. Build Application
```bash
npm run build
```

### 3. Database Migration
```bash
npx prisma migrate deploy
```

### 4. Start Server
```bash
npm start
```

### 5. Frontend Integration
- Build frontend: `npm run build` (in frontend directory)
- Place build folder in `../frontend/build`
- Server automatically serves static files in production

## 📚 Tech Stack

- **Runtime:** Node.js
- **Language:** TypeScript
- **Framework:** Express.js
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** JWT, Passport.js
- **Real-time:** Socket.IO
- **Validation:** express-validator
- **Security:** bcrypt, cors, helmet
- **Development:** tsx, nodemon

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👥 Authors

- Your Name - CMA-PORTAL DEVS

---
