import { appendFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

export const CONTENT_ARTIFACT_PATH =
  process.env.CONTENT_ARTIFACT_PATH || '.netlify/content/phanoria-content.txt';

export function resetContentArtifact() {
  mkdirSync(dirname(CONTENT_ARTIFACT_PATH), { recursive: true });
  writeFileSync(CONTENT_ARTIFACT_PATH, '', 'utf8');
}

export function recordContent(source, content) {
  mkdirSync(dirname(CONTENT_ARTIFACT_PATH), { recursive: true });
  const seen = new WeakSet();
  const serializedContent = JSON.stringify(content, (_key, value) => {
    if (value && typeof value === 'object') {
      if (seen.has(value)) return '[Circular reference omitted]';
      seen.add(value);
    }
    return value;
  }, 2);
  appendFileSync(
    CONTENT_ARTIFACT_PATH,
    `\n\n===== ${source} =====\n${serializedContent}\n`,
    'utf8',
  );
}
