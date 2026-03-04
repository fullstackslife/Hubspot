export const WEBSITE_DOMAINS = [
  'warbot.cloud',
  'hotelsales.online',
  'vibechain.ink',
  'fullstacks.us',
  'external_scraper'
];

export const LEAD_SOURCES = ['form', 'chat', 'scraper', 'import'];

export const LEAD_TYPES = [
  'hotel_group_booking',
  'hotel_corporate_rate',
  'warbot_access',
  'creator_collab',
  'client_project'
];

export const INTENT_LEVELS = ['low', 'medium', 'high'];

export const PIPELINE_NAMES = {
  hotel_group_booking: 'Hotel Leads',
  hotel_corporate_rate: 'Hotel Leads',
  creator_collab: 'Creator Partnerships',
  client_project: 'AI Clients',
  warbot_access: 'Warbot Users'
};

export const PIPELINE_ENV_MAP = {
  'Hotel Leads': 'PIPELINE_HOTEL',
  'Creator Partnerships': 'PIPELINE_CREATOR',
  'AI Clients': 'PIPELINE_AI',
  'Warbot Users': 'PIPELINE_WARBOT'
};

export const REQUIRED_LEAD_FIELDS = [
  'email',
  'firstname',
  'lastname',
  'website_domain',
  'lead_source',
  'lead_type'
];
