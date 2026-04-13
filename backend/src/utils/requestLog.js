// In-memory request log for /api/logs endpoint
export const requestLog = [];

export function addToRequestLog(entry) {
  requestLog.push(entry);
  // Keep only last 1000 entries
  if (requestLog.length > 1000) {
    requestLog.shift();
  }
}

export function getRequestLog() {
  return [...requestLog];
}

export function clearRequestLog() {
  requestLog.length = 0;
}
