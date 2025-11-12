import { logError } from '../errorLogger';

describe('logError', () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('logs Error instances with message and stack', () => {
    const error = new Error('Test error message');
    error.stack = 'Error: Test error message\n    at test.ts:1:1';

    logError('TestContext', error);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      '[TestContext] Test error message',
      'Error: Test error message\n    at test.ts:1:1',
    );
  });

  it('logs Error instances without stack trace', () => {
    const error = new Error('Test error');
    error.stack = undefined;

    logError('TestContext', error);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      '[TestContext] Test error',
      'Stack trace unavailable',
    );
  });

  it('logs string errors', () => {
    logError('TestContext', 'String error message');

    expect(consoleErrorSpy).toHaveBeenCalledWith('[TestContext] String error message');
  });

  it('logs unexpected error types', () => {
    const unexpectedError = { code: 500, message: 'Server error' };

    logError('TestContext', unexpectedError);

    expect(consoleErrorSpy).toHaveBeenCalledWith('[TestContext] Unexpected error', unexpectedError);
  });
});
