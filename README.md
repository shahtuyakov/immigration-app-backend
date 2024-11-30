# Immigration App Backend

Backend service for the Immigration Assistant application, providing news aggregation, case tracking, and lawyer appointment scheduling.

## Tech Stack

- Node.js (v22.11.0)
- TypeScript
- Express.js
- MongoDB
- Azure AD B2C
- New Relic (monitoring)

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

[To be added]

## Contributing

[To be added]

## License

[To be added]