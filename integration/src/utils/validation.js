import {
  INTENT_LEVELS,
  LEAD_SOURCES,
  LEAD_TYPES,
  PIPELINE_NAMES,
  REQUIRED_LEAD_FIELDS,
  WEBSITE_DOMAINS
} from '../config/constants.js';

/**
 * @param {Record<string, unknown>} payload
 * @returns {{valid: true, lead: Record<string, unknown>} | {valid: false, errors: string[]}}
 */
export function validateAndNormalizeLead(payload) {
  const errors = [];
  const lead = { ...payload };

  for (const field of REQUIRED_LEAD_FIELDS) {
    if (!lead[field] || typeof lead[field] !== 'string') {
      errors.push(`Missing or invalid required field: ${field}`);
    }
  }

  if (lead.email && typeof lead.email === 'string') {
    lead.email = lead.email.trim().toLowerCase();
    if (!lead.email.includes('@')) {
      errors.push('Invalid email format');
    }
  }

  if (lead.website_domain && !WEBSITE_DOMAINS.includes(lead.website_domain)) {
    errors.push('Invalid website_domain');
  }

  if (lead.lead_source && !LEAD_SOURCES.includes(lead.lead_source)) {
    errors.push('Invalid lead_source');
  }

  if (lead.lead_type && !LEAD_TYPES.includes(lead.lead_type)) {
    errors.push('Invalid lead_type');
  }

  if (lead.intent_score && !INTENT_LEVELS.includes(lead.intent_score)) {
    errors.push('Invalid intent_score');
  }

  if (!lead.intent_score) {
    lead.intent_score = inferIntent(lead);
  }

  if (!lead.pipeline_name && lead.lead_type) {
    lead.pipeline_name = PIPELINE_NAMES[lead.lead_type];
  }

  if (lead.budget != null) {
    const budgetNum = Number(lead.budget);
    if (Number.isNaN(budgetNum)) {
      errors.push('budget must be numeric');
    } else {
      lead.budget = budgetNum;
    }
  }

  lead.phone = normalizeNullableText(lead.phone);
  lead.company = normalizeNullableText(lead.company);
  lead.industry = normalizeNullableText(lead.industry);
  lead.location = normalizeNullableText(lead.location);
  lead.timeline = normalizeNullableText(lead.timeline);
  lead.source_campaign = normalizeNullableText(lead.source_campaign);
  lead.raw_payload_ref = normalizeNullableText(lead.raw_payload_ref);

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return { valid: true, lead };
}

/**
 * @param {Record<string, unknown>} lead
 */
function inferIntent(lead) {
  const budget = Number(lead.budget || 0);
  const hasCompany = Boolean(lead.company);

  if (budget >= 10000 || hasCompany) {
    return 'high';
  }

  if (budget >= 1000) {
    return 'medium';
  }

  return 'low';
}

/**
 * @param {unknown} value
 */
function normalizeNullableText(value) {
  if (value == null) {
    return null;
  }

  const text = String(value).trim();
  return text.length > 0 ? text : null;
}
