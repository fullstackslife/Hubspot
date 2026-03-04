import test from 'node:test';
import assert from 'node:assert/strict';
import { validateAndNormalizeLead } from '../src/utils/validation.js';

test('validateAndNormalizeLead accepts valid lead and infers hotel pipeline', () => {
  const input = {
    email: 'Lead@Example.com',
    firstname: 'Jane',
    lastname: 'Doe',
    website_domain: 'hotelsales.online',
    lead_source: 'form',
    lead_type: 'hotel_group_booking',
    budget: '6000'
  };

  const result = validateAndNormalizeLead(input);

  assert.equal(result.valid, true);
  assert.equal(result.lead.email, 'lead@example.com');
  assert.equal(result.lead.pipeline_name, 'Hotel Leads');
  assert.equal(result.lead.budget, 6000);
  assert.equal(result.lead.intent_score, 'medium');
});

test('validateAndNormalizeLead infers high intent for company lead', () => {
  const input = {
    email: 'ops@example.com',
    firstname: 'Ops',
    lastname: 'Manager',
    website_domain: 'hotelsales.online',
    lead_source: 'form',
    lead_type: 'hotel_corporate_rate',
    company: 'Acme Construction'
  };

  const result = validateAndNormalizeLead(input);

  assert.equal(result.valid, true);
  assert.equal(result.lead.intent_score, 'high');
});

test('validateAndNormalizeLead fails with invalid enum values', () => {
  const result = validateAndNormalizeLead({
    email: 'lead@example.com',
    firstname: 'A',
    lastname: 'B',
    website_domain: 'unknown-site.com',
    lead_source: 'unknown',
    lead_type: 'not-a-type',
    intent_score: 'urgent'
  });

  assert.equal(result.valid, false);
  assert.deepEqual(result.errors, [
    'Invalid website_domain',
    'Invalid lead_source',
    'Invalid lead_type',
    'Invalid intent_score'
  ]);
});

test('validateAndNormalizeLead fails with missing required fields', () => {
  const result = validateAndNormalizeLead({ email: 'invalid' });
  assert.equal(result.valid, false);
  assert.ok(result.errors.length > 0);
});

test('validateAndNormalizeLead fails when budget is not numeric', () => {
  const result = validateAndNormalizeLead({
    email: 'lead@example.com',
    firstname: 'Jane',
    lastname: 'Doe',
    website_domain: 'hotelsales.online',
    lead_source: 'form',
    lead_type: 'hotel_group_booking',
    budget: 'abc'
  });

  assert.equal(result.valid, false);
  assert.ok(result.errors.includes('budget must be numeric'));
});
