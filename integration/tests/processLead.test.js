import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdir, rm, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

process.env.HUBSPOT_ACCESS_TOKEN = 'token';
process.env.HUBSPOT_BASE_URL = 'https://api.hubapi.com';
process.env.HUBSPOT_MAX_RETRIES = '1';
process.env.HUBSPOT_RETRY_BACKOFF_MS = '1';
process.env.PIPELINE_HOTEL = 'pipeline_hotel';
process.env.PIPELINE_CREATOR = 'pipeline_creator';
process.env.PIPELINE_AI = 'pipeline_ai';
process.env.PIPELINE_WARBOT = 'pipeline_warbot';
process.env.STAGE_DEFAULT_LEAD_CAPTURED = 'stage_lead_captured';

const deadLetterPath = resolve(process.cwd(), 'dead-letter/test-failed-leads.ndjson');
process.env.DEAD_LETTER_FILE = 'dead-letter/test-failed-leads.ndjson';

await mkdir(resolve(process.cwd(), 'dead-letter'), { recursive: true });
await rm(deadLetterPath, { force: true });

const { processLeadPayload } = await import(`../src/workflows/processLead.js?test=${Date.now()}`);

function baseLead() {
  return {
    email: 'lead@example.com',
    firstname: 'Jane',
    lastname: 'Doe',
    website_domain: 'hotelsales.online',
    lead_source: 'form',
    lead_type: 'hotel_group_booking'
  };
}

test('processLeadPayload creates deal for high-intent hotel lead', async () => {
  const calls = [];
  global.fetch = async (url, options = {}) => {
    calls.push({ url, method: options.method });

    if (url.endsWith('/crm/v3/objects/contacts/search')) {
      return { ok: true, status: 200, json: async () => ({ results: [] }) };
    }

    if (url.endsWith('/crm/v3/objects/contacts') && options.method === 'POST') {
      return { ok: true, status: 201, json: async () => ({ id: 'contact_1' }) };
    }

    if (url.includes('/crm/v3/objects/contacts/contact_1') && options.method === 'PATCH') {
      return { ok: true, status: 200, json: async () => ({ id: 'contact_1' }) };
    }

    if (url.endsWith('/crm/v3/objects/deals/search')) {
      return { ok: true, status: 200, json: async () => ({ results: [] }) };
    }

    if (url.endsWith('/crm/v3/objects/deals') && options.method === 'POST') {
      return { ok: true, status: 201, json: async () => ({ id: 'deal_1' }) };
    }

    if (url.includes('/crm/v3/objects/contacts/contact_1/associations/deals/deal_1/contact_to_deal')) {
      return { ok: true, status: 204, text: async () => '' };
    }

    throw new Error(`Unexpected fetch call: ${url}`);
  };

  const result = await processLeadPayload({
    ...baseLead(),
    budget: 12000
  });

  assert.equal(result.ok, true);
  assert.equal(result.data.deal_id, 'deal_1');
  assert.equal(result.data.pipeline_name, 'Hotel Leads');
  assert.equal(result.data.intent_score, 'high');
  assert.ok(calls.some((call) => call.url.endsWith('/crm/v3/objects/deals')));
});

test('processLeadPayload keeps low-intent hotel lead as contact-only', async () => {
  const calls = [];
  global.fetch = async (url, options = {}) => {
    calls.push({ url, method: options.method });

    if (url.endsWith('/crm/v3/objects/contacts/search')) {
      return { ok: true, status: 200, json: async () => ({ results: [] }) };
    }

    if (url.endsWith('/crm/v3/objects/contacts') && options.method === 'POST') {
      return { ok: true, status: 201, json: async () => ({ id: 'contact_2' }) };
    }

    if (url.includes('/crm/v3/objects/contacts/contact_2') && options.method === 'PATCH') {
      return { ok: true, status: 200, json: async () => ({ id: 'contact_2' }) };
    }

    throw new Error(`Unexpected fetch call: ${url}`);
  };

  const result = await processLeadPayload({
    ...baseLead(),
    email: 'low-intent@example.com',
    budget: 200
  });

  assert.equal(result.ok, true);
  assert.equal(result.data.deal_id, null);
  assert.equal(result.data.intent_score, 'low');
  assert.equal(calls.some((call) => call.url.endsWith('/crm/v3/objects/deals')), false);
});

test('processLeadPayload writes dead-letter record on validation failure', async () => {
  const result = await processLeadPayload({
    email: 'bad-input'
  });

  assert.equal(result.ok, false);
  assert.equal(result.status, 400);

  const deadLetter = await readFile(deadLetterPath, 'utf8');
  assert.ok(deadLetter.includes('"stage":"validation"'));
});
