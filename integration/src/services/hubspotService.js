import { PIPELINE_ENV_MAP } from '../config/constants.js';
import { hubspotRequest } from './hubspotClient.js';

const QUALIFICATION_DEFAULT = process.env.QUALIFICATION_STATUS_DEFAULT || 'new';
const DEFAULT_OWNER = process.env.DEFAULT_OWNER_ID || '';
const DEFAULT_CURRENCY = process.env.DEFAULT_CURRENCY || 'USD';

/**
 * @param {Record<string, unknown>} lead
 */
export async function create_or_update_contact(lead) {
  const existing = await findContactByEmail(lead.email);
  const properties = {
    email: lead.email,
    firstname: lead.firstname,
    lastname: lead.lastname,
    phone: lead.phone,
    company: lead.company,
    lead_source: lead.lead_source,
    lead_type: lead.lead_type,
    website_domain: lead.website_domain,
    industry: lead.industry,
    budget: lead.budget,
    location: lead.location,
    intent_score: lead.intent_score,
    source_campaign: lead.source_campaign,
    qualification_status: QUALIFICATION_DEFAULT
  };

  if (existing?.id) {
    const result = await hubspotRequest(`/crm/v3/objects/contacts/${existing.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ properties })
    });
    return result;
  }

  return hubspotRequest('/crm/v3/objects/contacts', {
    method: 'POST',
    body: JSON.stringify({ properties })
  });
}

/**
 * @param {Record<string, unknown>} lead
 * @param {string} contactId
 */
export async function create_or_update_deal(lead, contactId) {
  const pipelineId = resolvePipelineId(lead.pipeline_name);
  const stageId = resolveStageId(lead.pipeline_name, lead.pipeline_stage);

  const dealName = `${lead.lead_type}:${lead.company || lead.email}`;
  const existing = await findDealByNameAndPipeline(dealName, pipelineId);

  const properties = {
    dealname: dealName,
    pipeline: pipelineId,
    dealstage: stageId,
    amount: lead.budget || 0,
    hubspot_owner_id: DEFAULT_OWNER || undefined,
    closedate: undefined,
    lead_source: lead.lead_source,
    lead_type: lead.lead_type,
    website_domain: lead.website_domain,
    source_campaign: lead.source_campaign,
    currency: DEFAULT_CURRENCY
  };

  let deal;
  if (existing?.id) {
    deal = await hubspotRequest(`/crm/v3/objects/deals/${existing.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ properties })
    });
  } else {
    deal = await hubspotRequest('/crm/v3/objects/deals', {
      method: 'POST',
      body: JSON.stringify({ properties })
    });
  }

  await associate_contact_deal(contactId, deal.id);
  return deal;
}

/**
 * @param {string} contactId
 * @param {string} dealId
 */
export async function associate_contact_deal(contactId, dealId) {
  return hubspotRequest(`/crm/v3/objects/contacts/${contactId}/associations/deals/${dealId}/contact_to_deal`, {
    method: 'PUT'
  });
}

/**
 * @param {string} dealId
 * @param {string} stageId
 */
export async function update_pipeline_stage(dealId, stageId) {
  return hubspotRequest(`/crm/v3/objects/deals/${dealId}`, {
    method: 'PATCH',
    body: JSON.stringify({
      properties: {
        dealstage: stageId
      }
    })
  });
}

/**
 * @param {string} contactId
 * @param {string[]} tags
 */
export async function tag_lead(contactId, tags) {
  return hubspotRequest(`/crm/v3/objects/contacts/${contactId}`, {
    method: 'PATCH',
    body: JSON.stringify({
      properties: {
        hs_lead_status: tags.join(',')
      }
    })
  });
}

/**
 * @param {string} email
 */
async function findContactByEmail(email) {
  const response = await hubspotRequest('/crm/v3/objects/contacts/search', {
    method: 'POST',
    body: JSON.stringify({
      filterGroups: [
        {
          filters: [
            {
              propertyName: 'email',
              operator: 'EQ',
              value: email
            }
          ]
        }
      ],
      properties: ['email', 'firstname', 'lastname', 'lead_type'],
      limit: 1
    })
  });

  return response.results?.[0] || null;
}

/**
 * @param {string} dealName
 * @param {string} pipelineId
 */
async function findDealByNameAndPipeline(dealName, pipelineId) {
  const response = await hubspotRequest('/crm/v3/objects/deals/search', {
    method: 'POST',
    body: JSON.stringify({
      filterGroups: [
        {
          filters: [
            {
              propertyName: 'dealname',
              operator: 'EQ',
              value: dealName
            },
            {
              propertyName: 'pipeline',
              operator: 'EQ',
              value: pipelineId
            }
          ]
        }
      ],
      properties: ['dealname', 'pipeline', 'dealstage'],
      limit: 1
    })
  });

  return response.results?.[0] || null;
}

/**
 * @param {string} pipelineName
 */
function resolvePipelineId(pipelineName) {
  const envKey = PIPELINE_ENV_MAP[pipelineName];
  if (!envKey) {
    throw new Error(`No pipeline mapping found for pipeline name: ${pipelineName}`);
  }

  const value = process.env[envKey];
  if (!value) {
    throw new Error(`Missing environment variable ${envKey} for pipeline ${pipelineName}`);
  }

  return value;
}

/**
 * @param {string} pipelineName
 * @param {string | null | undefined} requestedStage
 */
function resolveStageId(pipelineName, requestedStage) {
  if (requestedStage) {
    return requestedStage;
  }

  const fallback = process.env.STAGE_DEFAULT_LEAD_CAPTURED;
  if (!fallback) {
    throw new Error(`Missing STAGE_DEFAULT_LEAD_CAPTURED for pipeline ${pipelineName}`);
  }

  return fallback;
}
