import dotenv from 'dotenv';

dotenv.config();

const BASE_URL = process.env.HUBSPOT_BASE_URL || 'https://api.hubapi.com';
const ACCESS_TOKEN = process.env.HUBSPOT_ACCESS_TOKEN;

/**
 * @param {string} path
 * @param {RequestInit} [options]
 */
export async function hubspotRequest(path, options = {}) {
  if (!ACCESS_TOKEN) {
    throw new Error('HUBSPOT_ACCESS_TOKEN is not set');
  }

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
    throw new Error(`HubSpot API error ${response.status}: ${detail}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}
