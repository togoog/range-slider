/* eslint-disable no-console */
import { logError, logWarn, logInfo, logDebug } from '../../services/logger';

function spyConsole() {
  // https://github.com/facebook/react/issues/7047
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const spy: any = {};

  beforeAll(() => {
    spy.error = jest.spyOn(console, 'error').mockImplementation(() => {});
    spy.warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    spy.info = jest.spyOn(console, 'info').mockImplementation(() => {});
    spy.debug = jest.spyOn(console, 'debug').mockImplementation(() => {});
  });

  afterAll(() => {
    spy.error.mockRestore();
    spy.warn.mockRestore();
    spy.info.mockRestore();
    spy.debug.mockRestore();
  });

  return spy;
}

const spy = spyConsole();

test('logError', () => {
  logError('Test', 123, 'foo');
  expect(console.error).toHaveBeenCalled();
  expect(spy.error.mock.calls[0][0]).toContain('Test');
  expect(spy.error.mock.calls[0][1]).toEqual([123, 'foo']);
});

test('logWarn', () => {
  logWarn('Test', 123, 'foo');
  expect(console.warn).toHaveBeenCalled();
  expect(spy.warn.mock.calls[0][0]).toEqual('Test');
  expect(spy.warn.mock.calls[0][1]).toEqual([123, 'foo']);
});

test('logInfo', () => {
  logInfo('Test', 123, 'foo');
  expect(console.info).toHaveBeenCalled();
  expect(spy.info.mock.calls[0][0]).toContain('Test');
  expect(spy.info.mock.calls[0][1]).toEqual([123, 'foo']);
});

test('logDebug', () => {
  logDebug('Test', 123, 'foo');
  expect(console.debug).toHaveBeenCalled();
  expect(spy.debug.mock.calls[0][0]).toContain('Test');
  expect(spy.debug.mock.calls[0][1]).toEqual([123, 'foo']);
});
