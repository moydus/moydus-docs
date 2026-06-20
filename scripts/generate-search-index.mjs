import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const docsDir = join(root, 'docs');
const docsConfig = JSON.parse(readFileSync(join(docsDir, 'docs.json'), 'utf8'));
const siteId = process.env.SITE_ID ?? 'docfiy-ornek';

function collectPages(nav) {
  const pages = [];
  if (!nav) return pages;
  if (Array.isArray(nav.pages)) pages.push(...nav.pages);
  if (Array.isArray(nav.groups)) {
    for (const group of nav.groups) pages.push(...collectPages(group));
  }
  if (Array.isArray(nav.tabs)) {
    for (const tab of nav.tabs) pages.push(...collectPages(tab));
  }
  return pages;
}

function stripMdxContent(raw) {
  const withoutFrontmatter = raw.replace(/^---\n[\s\S]*?\n---\n?/, '');
  return withoutFrontmatter
    .replace(/<[^>]+>/g, ' ')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]+`/g, ' ')
    .replace(/[#>*_\[\]()!-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function readMdxPage(pagePath) {
  const filePath = join(docsDir, `${pagePath}.mdx`);
  try {
    const raw = readFileSync(filePath, 'utf8');
    const match = raw.match(/^---\n([\s\S]*?)\n---/);
    const frontmatter = match?.[1] ?? '';
    const title = frontmatter.match(/^title:\s*["']?(.+?)["']?\s*$/m)?.[1];
    const description = frontmatter.match(/^description:\s*["']?(.+?)["']?\s*$/m)?.[1];
    const icon = frontmatter.match(/^icon:\s*["']?(.+?)["']?\s*$/m)?.[1];
    const content = stripMdxContent(raw);
    return { title, description, icon, content };
  } catch {
    return { content: '' };
  }
}

const slugs = [...new Set(collectPages(docsConfig.navigation))];
const index = slugs.map((slug) => {
  const meta = readMdxPage(slug);
  const path = slug === 'index' ? '/' : `/${slug}`;
  const segments = slug.split('/').map((s) => s.charAt(0).toUpperCase() + s.slice(1));
  return {
    siteId,
    path,
    title: meta.title ?? segments[segments.length - 1] ?? slug,
    description: meta.description ?? '',
    content: meta.content ?? '',
    icon: meta.icon ?? 'hashtag',
    breadcrumbs: segments,
  };
});

writeFileSync(join(root, 'public/search-index.json'), JSON.stringify(index, null, 2));
writeFileSync(join(root, '.search-index-build.json'), JSON.stringify(index, null, 2));
console.log(`Generated search index with ${index.length} pages for site "${siteId}"`);
