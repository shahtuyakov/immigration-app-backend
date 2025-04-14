# Project Structure Documentation

This document outlines the current structure of the Immigration App Backend project, highlighting the key components and their relationships.

## Directory Structure

```
immigration-app-backend/
├── src/                          # Source code
│   ├── config/                   # Configuration files
│   │   ├── app.ts               # Express app configuration
│   │   ├── database.ts          # MongoDB connection
│   │   ├── env.ts               # Environment variable validation
│   │   └── security.ts          # Security-related configuration
│   │
│   ├── controllers/             # Request handlers
│   │   ├── AuthController.ts    # Authentication operations
│   │   ├── CaseTrackingController.ts # Case tracking
│   │   ├── NewsController.ts    # News retrieval
│   │   ├── OAuthController.ts   # Social login
│   │   └── UserManagementController.ts # User administration
│   │
│   ├── interfaces/              # TypeScript interfaces
│   │   └── dtos/                # Data Transfer Objects
│   │       └── UserDTO.ts       # User-related DTOs
│   │
│   ├── middlewares/             # Express middlewares
│   │   ├── auth.ts              # Authentication middleware
│   │   └── validateRequest.ts   # Request validation with Zod
│   │
│   ├── models/                  # MongoDB models
│   │   ├── ImmigrationCase.ts   # Case tracking model
│   │   ├── News.ts              # News article model
│   │   └── User.ts              # User model
│   │
│   ├── routes/                  # API routes
│   │   ├── auth.ts              # Authentication routes
│   │   ├── cases.ts             # Case tracking routes
│   │   ├── news.ts              # News routes
│   │   ├── oauth.ts             # OAuth routes
│   │   └── userManagement.ts    # User management routes
│   │
│   ├── services/                # Business logic
│   │   ├── AuthService.ts       # Authentication logic
│   │   ├── BaseService.ts       # Common CRUD operations
│   │   ├── CaseTrackingService.ts # Case tracking logic
│   │   ├── EmailService.ts      # Email sending functionality
│   │   ├── NewsService.ts       # News retrieval logic
│   │   ├── OAuthService.ts      # OAuth integration
│   │   ├── USCISApiService.ts   # USCIS API integration
│   │   └── UserManagementService.ts # User administration
│   │
│   ├── utils/                   # Utility functions
│   │   ├── apiResponse.ts       # Standardized API responses
│   │   └── errorHandler.ts      # Error handling
│   │
│   └── index.ts                 # Application entry point
│
├── tests/                       # Test files
│   ├── integration/             # Integration tests
│   ├── unit/                    # Unit tests
│   └── helpers/                 # Test helpers
│
├── .env                         # Environment variables (not in repo)
├── .env.backup                  # Template for environment variables
├── .gitignore                   # Git ignore file
├── nodemon.json                 # Nodemon configuration
├── package.json                 # Project dependencies
├── tsconfig.json                # TypeScript configuration
└── README.md                    # Project documentation
```

## Key Components

### 1. News Subsystem

The news subsystem has been simplified to focus on database operations rather than external API fetching:

- `NewsController`: Handles HTTP requests for news data
- `NewsService`: Provides methods to query the database for news articles
- `News` model: Represents news articles in the database

News is stored in the MongoDB database and accessed through API endpoints that support:
- Pagination
- Category filtering
- Text search
- Retrieval of recent news

### 2. Case Tracking Subsystem

The case tracking subsystem allows users to track their immigration cases:

- `CaseTrackingController`: Handles HTTP requests for case tracking
- `CaseTrackingService`: Manages case tracking logic, including USCIS API integration
- `USCISApiService`: Low-level service for communicating with USCIS APIs
- `ImmigrationCase` model: Represents case data in the database

### 3. Authentication Subsystem

The authentication subsystem manages user identity and access:

- `AuthController`: Handles registration, login, and related operations
- `AuthService`: Manages authentication logic
- `OAuthController` and `OAuthService`: Handle social login
- Authentication middlewares: Protect routes and enforce permissions
- `User` model: Represents user data in the database

### 4. Configuration

- Environment variables: Centralized in `env.ts` with validation
- Express configuration: In `app.ts`
- Security settings: In `security.ts`
- Database connection: In `database.ts`

## API Endpoints

### Authentication
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh-token`
- `GET /api/auth/profile`
- `PUT /api/auth/profile`
- `POST /api/auth/logout`
- `POST /api/auth/logout-all`
- `POST /api/auth/password/change`
- `POST /api/auth/password/forgot`
- `POST /api/auth/password/reset`

### OAuth
- `POST /api/auth/oauth/google`
- `POST /api/auth/oauth/apple`

### News
- `GET /api/news` (with optional filtering and pagination)
- `GET /api/news/:id`
- `GET /api/news/search`
- `GET /api/news/recent`

### Case Tracking
- `POST /api/cases/track`
- `GET /api/cases/my-cases`
- `GET /api/cases/:caseId`

### User Management
- `GET /api/admin/users`
- `GET /api/admin/users/:userId`
- `PUT /api/admin/users/:userId/role`

## Data Flow

1. User requests are received by Express routes
2. Middleware handles authentication and validation
3. Controllers process the request
4. Services contain the business logic
5. Models interact with the MongoDB database
6. Responses are formatted and returned to the user

## Development Workflow

1. Environment setup: Copy `.env.backup` to `.env` and configure
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`
4. Run tests: `npm test`
5. Build for production: `npm run build`