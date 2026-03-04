import test from 'node:test';
import assert from 'node:assert/strict';

process.env.HUBSPOT_ACCESS_TOKEN = 'token';
process.env.HUBSPOT_BASE_URL = 'https://api.hubapi.com';
process.env.HUBSPOT_MAX_RETRIES = '2';
process.env.HUBSPOT_RETRY_BACKOFF_MS = '1';

const { hubspotRequest, HubspotHttpError } = await import(`../src/services/hubspotClient.js?test=${Date.now()}`);

test('hubspotRequest retries on 429 and succeeds', async () => {
  let callCount = 0;
  global.fetch = async () => {
    callCount += 1;
    if (callCount === 1) {
      return {
        ok: false,
        status: 429,
        text: async () => 'rate limited'
      };
    }

    return {
      ok: true,
      status: 200,
      json: async () => ({ id: 'ok' })
    };
  };

  const result = await hubspotRequest('/crm/v3/objects/contacts/search', {
    method: 'POST',
    body: JSON.stringify({})
  });

  assert.equal(callCount, 2);
  assert.equal(result.id, 'ok');
});

test('hubspotRequest throws after retries are exhausted', async () => {
  let callCount = 0;
  global.fetch = async () => {
    callCount += 1;
    return {
      ok: false,
      status: 503,
      text: async () => 'service unavailable'
    };
  };

  await assert.rejects(
    () => hubspotRequest('/crm/v3/objects/contacts/search', { method: 'POST', body: '{}' }),
    (error) => {
      assert.equal(error instanceof HubspotHttpError, true);
      assert.equal(error.statusCode, 503);
      return true;
    }
  );

  assert.equal(callCount, 3);
});
