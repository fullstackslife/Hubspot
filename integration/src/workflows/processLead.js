import {
  create_or_update_contact,
  create_or_update_deal,
  tag_lead
} from '../services/hubspotService.js';
import { validateAndNormalizeLead } from '../utils/validation.js';
import { dedupeLead } from './dedupe.js';

const dedupeMemory = {};
const INTENT_AUTO_DEAL_LEVEL = process.env.INTENT_AUTO_DEAL_LEVEL || 'high';

/**
 * @param {Record<string, unknown>} payload
 */
export async function processLeadPayload(payload) {
  const normalized = validateAndNormalizeLead(payload);
  if (!normalized.valid) {
    return {
      ok: false,
      status: 400,
      errors: normalized.errors
    };
  }

  const lead = normalized.lead;
  const dedupe = dedupeLead(lead, dedupeMemory);

  const contact = await create_or_update_contact(lead);
  await tag_lead(contact.id, [lead.lead_source, lead.lead_type, lead.website_domain]);

  let deal = null;
  if (shouldCreateDeal(lead)) {
    deal = await create_or_update_deal(lead, contact.id);
  }

  return {
    ok: true,
    status: 200,
    data: {
      dedupe,
      contact_id: contact.id,
      deal_id: deal?.id || null,
      pipeline_name: lead.pipeline_name,
      intent_score: lead.intent_score
    }
  };
}

/**
 * @param {Record<string, unknown>} lead
 */
function shouldCreateDeal(lead) {
  if (lead.intent_score === INTENT_AUTO_DEAL_LEVEL) {
    return true;
  }

  const budget = Number(lead.budget || 0);
  if (budget >= 5000) {
    return true;
  }

  return false;
}
