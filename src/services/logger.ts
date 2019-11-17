/* eslint-disable no-console */
function emitLogMsg(
  type: 'debug' | 'info' | 'warn' | 'error',
  msg: string,
  details: unknown[],
): void {
  if (details.length > 0) {
    console[type](msg, details);
  } else {
    console[type](msg);
  }
}

function logDebug(msg: string, ...details: unknown[]): void {
  emitLogMsg('debug', msg, details);
}

function logInfo(msg: string, ...details: unknown[]): void {
  emitLogMsg('info', msg, details);
}

function logWarn(msg: string, ...details: unknown[]): void {
  emitLogMsg('warn', msg, details);
}

function logError(msg: string, ...details: unknown[]): void {
  emitLogMsg('error', msg, details);
}

export { logDebug, logInfo, logWarn, logError };
