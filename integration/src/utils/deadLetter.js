import { mkdir, appendFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const DEAD_LETTER_PATH = resolve(process.cwd(), process.env.DEAD_LETTER_FILE || 'dead-letter/failed-leads.ndjson');

/**
 * @param {{payload: Record<string, unknown>, error: string, stage: string}} entry
 */
export async function writeDeadLetter(entry) {
  const record = {
    timestamp: new Date().toISOString(),
    stage: entry.stage,
    error: entry.error,
    payload: entry.payload
  };

  await mkdir(dirname(DEAD_LETTER_PATH), { recursive: true });
  await appendFile(DEAD_LETTER_PATH, `${JSON.stringify(record)}\n`, 'utf8');
}
