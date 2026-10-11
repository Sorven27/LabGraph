import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const [html, script, styles] = await Promise.all([
  readFile('index.html', 'utf8'),
  readFile('app.js', 'utf8'),
  readFile('styles.css', 'utf8')
]);

assert.match(html, /<html lang="en">/);
assert.match(html, /<title>LabGraph — experimental charts<\/title>/);
assert.match(script, /getItem\('labgraph-language'\)==='ru'\?'ru':'en'/);
assert.match(script, /chartTitle: 'Current versus voltage'/);
assert.match(styles, /html\[data-theme="dark"\]/);
assert.match(html, /id="themeBtn"/);

const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
assert.equal(new Set(ids).size, ids.length, 'HTML element IDs must be unique');

const htmlKeys = new Set([...html.matchAll(/data-i18n="([^"]+)"/g)].map(match => match[1]));
for (const key of htmlKeys) {
  assert.match(script, new RegExp(`(?:^|[,\\s])${key}:`), `Missing translation key: ${key}`);
}

console.log(`Smoke tests passed (${ids.length} unique IDs, ${htmlKeys.size} translated labels).`);
