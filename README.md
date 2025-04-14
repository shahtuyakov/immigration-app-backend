# Immigration App Backend

Backend service for the Immigration Assistant application, providing news aggregation, case tracking, and lawyer appointment scheduling.

## Tech Stack

- Node.js (v22.11.0)
- TypeScript
- Express.js
- MongoDB
- Azure AD B2C
- New Relic (monitoring)

## Features

- **User Authentication**: Secure login, registration, and profile management
- **News Repository**: Access to immigration news stored in the database
- **Case Tracking**: Monitor immigration case status
- **Lawyer Appointments**: Schedule consultations with immigration lawyers

## Prerequisites

- Node.js (v22.11.0)
- npm (v10.9.0)
- MongoDB

## Setup

1. Clone the repository
```bash
git clone [repository-url]
cd immigration-app-backend
```

2. Install dependencies
```bash
npm install
```

3. Create `.env` file in the root directory and add your environment variables:
```
NODE_ENV=development
PORT=3000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
# Add other required environment variables
```

4. Run the development server
```bash
npm run dev
```

## Available Scripts

- `npm start` - Start the production server
- `npm run dev` - Start the development server
- `npm run build` - Build the TypeScript code
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode

## Project Structure

```
immigration-app-backend/
├── src/
│   ├── config/         # Configuration files
│   ├── controllers/    # Request handlers
│   ├── interfaces/     # TypeScript interfaces
│   ├── middlewares/    # Custom middleware
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── services/       # Business logic
│   ├── utils/          # Helper functions
│   └── index.ts        # Application entry point
└── tests/              # Test files
```

## API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token
- `POST /api/auth/refresh-token` - Refresh access token
- `GET /api/auth/profile` - Get current user's profile
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/logout` - Logout

### News Endpoints

- `GET /api/news` - Get paginated news (with optional category filter)
- `GET /api/news/:id` - Get a specific news article
- `GET /api/news/search` - Search news by keyword
- `GET /api/news/recent` - Get most recent news

### Case Tracking Endpoints

- `POST /api/cases/track` - Track a new immigration case
- `GET /api/cases/my-cases` - Get all cases for the logged-in user
- `GET /api/cases/:caseId` - Get details for a specific case

## Data Management

The application relies on MongoDB for data storage. News articles are stored in the database and retrieved through the API endpoints. There is no automatic news fetching - all news data must be previously stored in the database.

## Contributing

[Contribution guidelines to be added]
