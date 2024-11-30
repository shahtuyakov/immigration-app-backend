import { Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../../src/config/env.js';

// Helper to create test JWT tokens
export function generateTestToken(userId: string): string {
  return jwt.sign({ id: userId }, env.JWT_SECRET, {
    expiresIn: '1h'
  });
}

// Mock response object
export function mockResponse() {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

// Helper to create test data
export function createTestData(type: 'user' | 'case' | 'news') {
  switch (type) {
    case 'user':
      return {
        email: `test-${Date.now()}@example.com`,
        password: 'TestPassword123!',
        firstName: 'Test',
        lastName: 'User'
      };
    case 'case':
      return {
        caseNumber: `CASE-${Date.now()}`,
        status: 'pending',
        type: 'immigration'
      };
    case 'news':
      return {
        title: `Test News ${Date.now()}`,
        content: 'Test content',
        category: 'immigration'
      };
    default:
      throw new Error(`Unknown test data type: ${type}`);
  }
}