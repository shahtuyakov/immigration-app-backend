import { env } from '../src/config/env.js';

// Test environment setup
process.env.NODE_ENV = 'test';

// Test database configuration
export const TEST_DB_URI = 'mongodb://localhost:27017/immigration-app-test';

// Test user credentials
export const TEST_USER = {
  email: 'test@example.com',
  password: 'TestPassword123!'
};

// Helper function to clear test database
export async function clearDatabase() {
  if (env.NODE_ENV === 'test') {
    // Add database cleanup logic here
  }
}

// Global test setup
export async function setupTestEnvironment() {
  // Add any global test setup here
}

// Global test teardown
export async function teardownTestEnvironment() {
  // Add any global test cleanup here
}