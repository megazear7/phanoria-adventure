import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { getStore } from '@netlify/blobs';
import 'dotenv/config';

const artifactPath =
  process.env.CONTENT_ARTIFACT_PATH || '.netlify/content/phanoria-content.txt';

await rm(artifactPath, { force: true });
await run(process.execPath, [
  'node_modules/orison/bin/cli.js',
  'build',
  './',
  '--buildDir',
  './dist',
]);

const content = await readFile(artifactPath, 'utf8');
if (!content.trim()) {
  throw new Error(`Content artifact is empty: ${artifactPath}`);
}

if (process.env.NETLIFY_SITE_ID && process.env.NETLIFY_AUTH_TOKEN) {
  const store = getStore({
    name: process.env.CONTENT_BLOB_STORE || 'phanoria-content',
    siteID: process.env.NETLIFY_SITE_ID,
    token: process.env.NETLIFY_AUTH_TOKEN,
  });
  await store.set('phanoria-content.txt', content, {
    metadata: { source: 'contentful-build' },
  });
  console.log('Persisted the Phanoria content artifact to Netlify Blobs.');
} else {
  await mkdir('.netlify/content', { recursive: true });
  await writeFile(artifactPath, content, 'utf8');
  console.log(`Kept the Phanoria content artifact at ${artifactPath}.`);
}

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: 'inherit' });
    child.on('error', reject);
    child.on('exit', code => {
      if (code === 0) resolve();
      else reject(new Error(`${command} exited with code ${code}`));
    });
  });
}
