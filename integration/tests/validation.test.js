import test from 'node:test';
import assert from 'node:assert/strict';
import { validateAndNormalizeLead } from '../src/utils/validation.js';

test('validateAndNormalizeLead accepts valid lead and infers pipeline', () => {
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

test('validateAndNormalizeLead fails with missing required fields', () => {
  const result = validateAndNormalizeLead({ email: 'invalid' });
  assert.equal(result.valid, false);
  assert.ok(result.errors.length > 0);
});
