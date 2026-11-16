// Rewrites root-relative URLs in the built site so it works under a sub-path (GitHub Pages project site: /pro-nut/).
// Run after `astro build`, only for the Pages build. Local dev and local preview keep the root paths.
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

const BASE = (process.argv[2] || '/pro-nut').replace(/\/$/, '');
const DIST = 'dist';
const TEXT = new Set(['.html', '.css', '.js', '.json', '.xml', '.txt', '.webmanifest']);

// quoted, parenthesised or template-literal path starts, plus the common static folders
const PATHS = /(["'`(=])\/(products\/|banners\/|marquee\/|video\/|fonts\/|about\/|contact\/|logo\.png|_astro\/|favicon)/g;

const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });

let files = 0;
let changed = 0;
for (const file of walk(DIST)) {
  if (!TEXT.has(extname(file))) continue;
  files += 1;
  const before = readFileSync(file, 'utf8');
  let after = before
    .replace(PATHS, (_, q, rest) => `${q}${BASE}/${rest}`)
    .replace(/(["'`])\/(["'`])/g, (_, a, b) => `${a}${BASE}/${b}`)
    .replace(/(\s(?:href|src|poster)=["'])\/#/g, (_, head) => `${head}${BASE}/#`);
  if (after !== before) {
    writeFileSync(file, after);
    changed += 1;
  }
}
console.log(`rebased ${changed} of ${files} text files to ${BASE}/`);
