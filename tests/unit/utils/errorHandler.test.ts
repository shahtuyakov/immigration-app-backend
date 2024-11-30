import { describe, it, mock } from 'node:test';
import assert from 'node:assert';
import { AppError, errorHandler } from '../../../src/utils/errorHandler.js';
import { mockResponse } from '../../helpers/testUtils.js';

describe('Error Handler', () => {
  it('should handle operational errors correctly', async () => {
    const error = new AppError(400, 'Bad Request');
    const req = {} as any;
    const res = mockResponse();
    const next = mock.fn();

    await errorHandler(error, req, res, next);

    assert.strictEqual(res.status.mock.calls[0].arguments[0], 400);
    assert.deepStrictEqual(res.json.mock.calls[0].arguments[0], {
      status: 'error',
      message: 'Bad Request'
    });
  });

  it('should handle unexpected errors correctly', async () => {
    const error = new Error('Unexpected Error');
    const req = {} as any;
    const res = mockResponse();
    const next = mock.fn();

    await errorHandler(error, req, res, next);

    assert.strictEqual(res.status.mock.calls[0].arguments[0], 500);
    assert.strictEqual(
      res.json.mock.calls[0].arguments[0].message,
      'Something went wrong'
    );
  });
});