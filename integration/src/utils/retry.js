import { RETRYABLE_STATUS_CODES } from '../config/constants.js';

const DEFAULT_MAX_RETRIES = Number(process.env.HUBSPOT_MAX_RETRIES || 3);
const DEFAULT_BACKOFF_MS = Number(process.env.HUBSPOT_RETRY_BACKOFF_MS || 500);

/**
 * @param {number} statusCode
 */
export function isRetryableStatus(statusCode) {
  return RETRYABLE_STATUS_CODES.includes(statusCode);
}

/**
 * @param {number} attempt 1-based attempt number
 */
function computeBackoff(attempt) {
  return DEFAULT_BACKOFF_MS * Math.pow(2, Math.max(0, attempt - 1));
}

/**
 * @param {number} ms
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * @template T
 * @param {() => Promise<T>} operation
 * @param {(error: unknown) => number | null} getStatusCode
 */
export async function withRetries(operation, getStatusCode) {
  let attempt = 0;
  while (attempt <= DEFAULT_MAX_RETRIES) {
    try {
      return await operation();
    } catch (error) {
      attempt += 1;
      const statusCode = getStatusCode(error);
      const shouldRetry = statusCode != null && isRetryableStatus(statusCode) && attempt <= DEFAULT_MAX_RETRIES;
      if (!shouldRetry) {
        throw error;
      }
      await sleep(computeBackoff(attempt));
    }
  }

  throw new Error('Retry loop exited unexpectedly');
}
