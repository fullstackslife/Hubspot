import { PIPELINE_ENV_MAP } from './constants.js';

const REQUIRED_BASE_ENV = ['HUBSPOT_ACCESS_TOKEN', 'STAGE_DEFAULT_LEAD_CAPTURED'];

/**
 * Validate critical env configuration before server accepts traffic.
 * @returns {{ok: true} | {ok: false, errors: string[]}}
 */
export function validateRuntimeEnv() {
  const errors = [];

  for (const key of REQUIRED_BASE_ENV) {
    if (!process.env[key] || String(process.env[key]).trim().length === 0) {
      errors.push(`Missing required environment variable: ${key}`);
    }
  }

  for (const envKey of Object.values(PIPELINE_ENV_MAP)) {
    if (!process.env[envKey] || String(process.env[envKey]).trim().length === 0) {
      errors.push(`Missing required pipeline environment variable: ${envKey}`);
    }
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  return { ok: true };
}
