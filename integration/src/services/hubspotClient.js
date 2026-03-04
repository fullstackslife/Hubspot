import dotenv from 'dotenv';
import { withRetries } from '../utils/retry.js';

dotenv.config();

const BASE_URL = process.env.HUBSPOT_BASE_URL || 'https://api.hubapi.com';
const ACCESS_TOKEN = process.env.HUBSPOT_ACCESS_TOKEN;

export class HubspotHttpError extends Error {
  /**
   * @param {number} statusCode
   * @param {string} detail
   */
  constructor(statusCode, detail) {
    super(`HubSpot API error ${statusCode}: ${detail}`);
    this.name = 'HubspotHttpError';
    this.statusCode = statusCode;
    this.detail = detail;
  }
}

/**
 * @param {string} path
 * @param {RequestInit} [options]
 */
export async function hubspotRequest(path, options = {}) {
  if (!ACCESS_TOKEN) {
    throw new Error('HUBSPOT_ACCESS_TOKEN is not set');
  }

  return withRetries(
    async () => {
      const response = await fetch(`${BASE_URL}${path}`, {
        ...options,
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
          ...(options.headers || {})
        }
      });

      if (!response.ok) {
        const detail = await response.text();
        throw new HubspotHttpError(response.status, detail);
      }

      if (response.status === 204) {
        return null;
      }

      return response.json();
    },
    (error) => (error instanceof HubspotHttpError ? error.statusCode : null)
  );
}
