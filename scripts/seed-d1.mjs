import { readFileSync, existsSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { execSync } from 'node:child_process';

const root = new URL('..', import.meta.url).pathname;
const indexPath = join(root, '.search-index-build.json');
const dbName = process.env.D1_DATABASE ?? 'docfiy-search';

if (!existsSync(indexPath)) {
  console.error('Missing .search-index-build.json — run npm run prebuild first');
  process.exit(1);
}

const pages = JSON.parse(readFileSync(indexPath, 'utf8'));
const sqlPath = join(root, 'db/seed.sql');

const escape = (value) => String(value ?? '').replace(/'/g, "''");

const statements = pages.flatMap((page) => [
  `DELETE FROM pages WHERE site_id='${escape(page.siteId)}' AND url='${escape(page.path)}';`,
  `INSERT INTO pages (site_id, title, url, description, content, icon, breadcrumbs) VALUES ('${escape(page.siteId)}', '${escape(page.title)}', '${escape(page.path)}', '${escape(page.description)}', '${escape(page.content)}', '${escape(page.icon ?? 'hashtag')}', '${escape(JSON.stringify(page.breadcrumbs))}');`,
]);

writeFileSync(sqlPath, statements.join('\n'));

const remoteFlag = process.argv.includes('--local') ? '' : '--remote';
execSync(`npx wrangler d1 execute ${dbName} ${remoteFlag} --file db/seed.sql`, {
  cwd: root,
  stdio: 'inherit',
});

console.log(`Seeded ${pages.length} pages into D1 (${dbName})`);
