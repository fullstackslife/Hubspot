import test from 'node:test';
import assert from 'node:assert/strict';

const envKeys = [
  'HUBSPOT_ACCESS_TOKEN',
  'STAGE_DEFAULT_LEAD_CAPTURED',
  'PIPELINE_HOTEL',
  'PIPELINE_CREATOR',
  'PIPELINE_AI',
  'PIPELINE_WARBOT'
];

for (const key of envKeys) {
  process.env[key] = 'test-value';
}

const { validateRuntimeEnv } = await import('../src/config/env.js');

test('validateRuntimeEnv passes when required env vars are set', () => {
  const result = validateRuntimeEnv();
  assert.equal(result.ok, true);
});

test('validateRuntimeEnv fails when pipeline env var is missing', () => {
  const original = process.env.PIPELINE_HOTEL;
  delete process.env.PIPELINE_HOTEL;

  const result = validateRuntimeEnv();

  assert.equal(result.ok, false);
  assert.ok(result.errors.some((error) => error.includes('PIPELINE_HOTEL')));

  process.env.PIPELINE_HOTEL = original;
});
