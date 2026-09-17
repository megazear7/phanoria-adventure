import { readFile } from 'node:fs/promises';
import { getStore } from '@netlify/blobs';
import { createRemoteJWKSet, jwtVerify } from 'jose';

const artifactPath =
  process.env.CONTENT_ARTIFACT_PATH || '.netlify/content/phanoria-content.txt';
const identityDomain = requiredEnv('AUTH0_DOMAIN');
const identityAudience =
  process.env.AUTH0_AUDIENCE || 'https://identity.megazear7.com';
const jwks = createRemoteJWKSet(
  new URL(`https://${identityDomain}/.well-known/jwks.json`),
);

function requiredEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is not configured`);
  }
  return value;
}

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return json(405, { error: 'method_not_allowed' });
  }

  try {
    await authenticate(event);
    const body = JSON.parse(event.body || '{}');
    const question = typeof body.question === 'string' ? body.question.trim() : '';

    if (!question) {
      return json(400, { error: 'question_required' });
    }

    const state = await loadContent();
    const answer = await askJev(state, question);
    return json(200, { confidence: answer });
  } catch (error) {
    console.error('[phanoria/ask]', error);
    const status = error.status || (error.code === 'ERR_JWT_VERIFICATION_FAILED' ? 401 : 500);
    return json(status, {
      error: status === 401 ? 'unauthorized' : 'request_failed',
      message: status === 401 ? 'A valid login is required.' : 'Unable to answer the question.',
    });
  }
}

async function authenticate(event) {
  const authorization = event.headers.authorization || event.headers.Authorization;
  if (!authorization?.startsWith('Bearer ')) {
    throw Object.assign(new Error('Missing bearer token'), { status: 401 });
  }

  await jwtVerify(authorization.slice('Bearer '.length), jwks, {
    issuer: `https://${identityDomain}/`,
    audience: identityAudience,
  });
}

async function loadContent() {
  if (process.env.NETLIFY_SITE_ID && process.env.NETLIFY_AUTH_TOKEN) {
    const store = getStore({
      name: process.env.CONTENT_BLOB_STORE || 'phanoria-content',
      siteID: process.env.NETLIFY_SITE_ID,
      token: process.env.NETLIFY_AUTH_TOKEN,
    });
    const content = await store.get('phanoria-content.txt', { type: 'text' });
    if (content) return content;
  }

  return readFile(artifactPath, 'utf8');
}

async function askJev(state, question) {
  if (!process.env.TYPESAFE_API_KEY) {
    throw new Error('TYPESAFE_API_KEY is not configured');
  }

  let highestConfidence = 0;
  for (const stateChunk of splitState(state)) {
    const confidence = await askJevChunk(stateChunk, question);
    highestConfidence = Math.max(highestConfidence, confidence);
    if (confidence >= 0.8) return confidence;
  }
  return highestConfidence;
}

async function askJevChunk(state, question) {
  const response = await fetch('https://api.typesafe.ai/v1/systemone', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.TYPESAFE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      state,
      model: 'jev-latest',
      questions: {
        answer: {
          type: 'noul',
          instructions: question,
        },
      },
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`TypeSafe API returned ${response.status}: ${detail}`);
  }

  const result = await response.json();
  const confidence = result.answers?.answer?.noul;
  if (typeof confidence !== 'number') {
    throw new Error('TypeSafe response did not contain a Noul answer');
  }
  return confidence;
}

function splitState(state) {
  const chunkSize = 40000;
  const chunks = [];
  for (let start = 0; start < state.length; start += chunkSize) {
    chunks.push(state.slice(start, start + chunkSize));
  }
  return chunks;
}

function json(statusCode, body) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  };
}
