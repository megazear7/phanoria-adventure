import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import 'dotenv/config';

const artifactPath =
  process.env.CONTENT_ARTIFACT_PATH || '.netlify/content/phanoria-content.txt';
const functionArtifactPath = 'src/server/content/phanoria-content.txt';

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

await mkdir('src/server/content', { recursive: true });
await writeFile(functionArtifactPath, content, 'utf8');
console.log(`Bundled the Phanoria content artifact at ${functionArtifactPath}.`);

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
