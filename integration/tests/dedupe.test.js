import test from 'node:test';
import assert from 'node:assert/strict';
import { dedupeLead } from '../src/workflows/dedupe.js';

test('dedupeLead marks duplicate by email', () => {
  const memory = {};
  const leadA = { email: 'a@example.com', phone: null, company: null };
  const leadB = { email: 'a@example.com', phone: null, company: null };

  const first = dedupeLead(leadA, memory);
  const second = dedupeLead(leadB, memory);

  assert.equal(first.duplicate, false);
  assert.equal(second.duplicate, true);
  assert.equal(second.key, 'email:a@example.com');
});

test('dedupeLead marks duplicate by phone and company fallback', () => {
  const memory = {};
  const leadA = { email: null, phone: '555-0000', company: 'Acme Inc' };
  const leadB = { email: null, phone: '555-0000', company: 'acme inc' };

  const first = dedupeLead(leadA, memory);
  const second = dedupeLead(leadB, memory);

  assert.equal(first.duplicate, false);
  assert.equal(second.duplicate, true);
  assert.equal(second.key, 'phone_company:555-0000::acme inc');
});
