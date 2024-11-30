import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import { app } from '../../../src/index.js';
import { TEST_USER, setupTestEnvironment, teardownTestEnvironment } from '../../setup.js';
import { createTestData } from '../../helpers/testUtils.js';

describe('Authentication Integration Tests', () => {
  before(async () => {
    await setupTestEnvironment();
  });

  after(async () => {
    await teardownTestEnvironment();
  });

  it('should login user with valid credentials', async () => {
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: TEST_USER.email,
        password: TEST_USER.password
      })
    });

    const data = await response.json();
    
    assert.strictEqual(response.status, 200);
    assert.ok(data.token);
    assert.strictEqual(data.user.email, TEST_USER.email);
  });

  it('should reject login with invalid credentials', async () => {
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: TEST_USER.email,
        password: 'wrongpassword'
      })
    });

    assert.strictEqual(response.status, 401);
  });
});