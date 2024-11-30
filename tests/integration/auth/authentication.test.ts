import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import { User } from '../../../src/models/User.js';
import { connectDatabase } from '../../../src/config/database.js';

describe('Authentication Flow Tests', async () => {
  // We'll use these variables throughout our tests
  let testUserData = {
    email: 'test.user@example.com',
    password: 'TestPass123!@#',
    firstName: 'John',
    lastName: 'Doe'
  };
  
  let tokens = {
    accessToken: '',
    refreshToken: ''
  };

  before(async () => {
    // Connect to test database and clean up any existing data
    await connectDatabase();
    await User.deleteMany({});
    console.log('Test database connected and cleaned');
  });

  describe('Registration Process', () => {
    it('should register a new user successfully', async () => {
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testUserData)
      });

      const data = await response.json();
      console.log('Registration response:', data);

      assert.strictEqual(response.status, 201);
      assert.strictEqual(data.success, true);
      assert.ok(data.data.user.id);
      assert.ok(data.data.tokens.accessToken);
      assert.ok(data.data.tokens.refreshToken);

      // Save tokens for subsequent tests
      tokens = data.data.tokens;
    });

    it('should prevent duplicate email registration', async () => {
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testUserData)
      });

      const data = await response.json();
      assert.strictEqual(response.status, 409);
      assert.strictEqual(data.success, false);
    });
  });

  describe('Login Process', () => {
    it('should login successfully with correct credentials', async () => {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: testUserData.email,
          password: testUserData.password
        })
      });

      const data = await response.json();
      assert.strictEqual(response.status, 200);
      assert.strictEqual(data.success, true);
      assert.ok(data.data.tokens.accessToken);
    });

    it('should reject invalid password', async () => {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: testUserData.email,
          password: 'WrongPass123!@#'
        })
      });

      assert.strictEqual(response.status, 401);
    });
  });

  describe('Profile Management', () => {
    it('should fetch user profile with valid token', async () => {
      const response = await fetch('http://localhost:3000/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${tokens.accessToken}`
        }
      });

      const data = await response.json();
      assert.strictEqual(response.status, 200);
      assert.strictEqual(data.data.user.email, testUserData.email);
    });

    it('should update profile successfully', async () => {
      const updateData = {
        firstName: 'John Updated',
        lastName: 'Doe Updated'
      };

      const response = await fetch('http://localhost:3000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${tokens.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });

      const data = await response.json();
      assert.strictEqual(response.status, 200);
      assert.strictEqual(data.data.user.firstName, updateData.firstName);
    });
  });

  describe('Password Management', () => {
    it('should change password successfully', async () => {
      const newPassword = 'NewTestPass123!@#';
      
      const response = await fetch('http://localhost:3000/api/auth/password/change', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${tokens.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          currentPassword: testUserData.password,
          newPassword: newPassword,
          confirmPassword: newPassword
        })
      });

      assert.strictEqual(response.status, 200);

      // Verify can login with new password
      const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: testUserData.email,
          password: newPassword
        })
      });

      assert.strictEqual(loginResponse.status, 200);
    });
  });

  describe('Token Management', () => {
    it('should refresh access token successfully', async () => {
      const response = await fetch('http://localhost:3000/api/auth/refresh-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          refreshToken: tokens.refreshToken
        })
      });

      const data = await response.json();
      assert.strictEqual(response.status, 200);
      assert.ok(data.data.accessToken);
    });

    it('should logout successfully', async () => {
      const response = await fetch('http://localhost:3000/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${tokens.accessToken}`
        }
      });

      assert.strictEqual(response.status, 200);

      // Verify token is invalidated
      const profileResponse = await fetch('http://localhost:3000/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${tokens.accessToken}`
        }
      });

      assert.strictEqual(profileResponse.status, 401);
    });
  });

  after(async () => {
    // Clean up test data
    await User.deleteMany({});
    console.log('Test cleanup completed');
  });
});