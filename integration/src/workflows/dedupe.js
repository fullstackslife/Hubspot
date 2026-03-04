/**
 * @param {Record<string, unknown>} lead
 * @param {Record<string, Record<string, unknown>>} memoryIndex
 */
export function dedupeLead(lead, memoryIndex) {
  const emailKey = lead.email ? `email:${String(lead.email).toLowerCase()}` : null;
  const phoneCompanyKey = lead.phone && lead.company
    ? `phone_company:${String(lead.phone).trim()}::${String(lead.company).trim().toLowerCase()}`
    : null;

  if (emailKey && memoryIndex[emailKey]) {
    return { duplicate: true, key: emailKey, existing: memoryIndex[emailKey] };
  }

  if (phoneCompanyKey && memoryIndex[phoneCompanyKey]) {
    return { duplicate: true, key: phoneCompanyKey, existing: memoryIndex[phoneCompanyKey] };
  }

  if (emailKey) {
    memoryIndex[emailKey] = lead;
  }

  if (phoneCompanyKey) {
    memoryIndex[phoneCompanyKey] = lead;
  }

  return { duplicate: false, key: emailKey || phoneCompanyKey || 'none', existing: null };
}
