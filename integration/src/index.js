import dotenv from 'dotenv';
import { createServer } from 'node:http';
import { validateRuntimeEnv } from './config/env.js';
import { processLeadPayload } from './workflows/processLead.js';

dotenv.config();

const envValidation = validateRuntimeEnv();
if (!envValidation.ok) {
  for (const error of envValidation.errors) {
    console.error(`[env] ${error}`);
  }
  process.exit(1);
}
for (const warning of envValidation.warnings) {
  console.warn(`[env] ${warning}`);
}

const port = Number(process.env.PORT || 8787);

const server = createServer(async (req, res) => {
  if (req.method === 'GET' && req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        ok: true,
        service: 'hubspot-lead-engine',
        status: 'running',
        endpoints: ['GET /health', 'POST /ingest/lead']
      })
    );
    return;
  }

  if (req.method === 'GET' && req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok' }));
    return;
  }

  if (req.method === 'POST' && req.url === '/ingest/lead') {
    try {
      const body = await readJsonBody(req);
      const result = await processLeadPayload(body);
      res.writeHead(result.status, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
      return;
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          ok: false,
          status: 500,
          errors: [error instanceof Error ? error.message : 'Unknown server error']
        })
      );
      return;
    }
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ ok: false, status: 404, errors: ['Not found'] }));
});

server.listen(port, () => {
  console.log(`HubSpot lead engine listening on http://localhost:${port}`);
});

/**
 * @param {import('node:http').IncomingMessage} req
 */
function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];

    req.on('data', (chunk) => chunks.push(chunk));
    req.on('error', reject);
    req.on('end', () => {
      try {
        const raw = Buffer.concat(chunks).toString('utf8') || '{}';
        resolve(JSON.parse(raw));
      } catch (error) {
        reject(new Error('Invalid JSON body'));
      }
    });
  });
}
