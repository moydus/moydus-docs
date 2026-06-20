type SearchResult = {
  path: string;
  title: string;
  description: string;
  icon: string;
  breadcrumbs: string[];
  snippet?: string;
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  });
}

function makeSnippet(content: string, query: string): string {
  const lower = content.toLowerCase();
  const q = query.toLowerCase();
  const index = lower.indexOf(q);
  if (index === -1) return content.slice(0, 120);
  const start = Math.max(0, index - 40);
  const end = Math.min(content.length, index + q.length + 80);
  return `${start > 0 ? '…' : ''}${content.slice(start, end).replace(/\s+/g, ' ').trim()}${end < content.length ? '…' : ''}`;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const body = (await request.json()) as { query?: string; siteId?: string };
    const query = body.query?.trim();

    if (!query) {
      return json({ error: 'query is required' }, 400);
    }

    const siteId = body.siteId ?? env.SITE_ID ?? 'docfiy-ornek';

    if (!env.DB) {
      return json({ error: 'Search database not configured', results: [] }, 503);
    }

    const pattern = `%${query}%`;

    const { results } = await env.DB.prepare(
      `SELECT title, url, description, content, icon, breadcrumbs
       FROM pages
       WHERE site_id = ?
         AND (
           title LIKE ? OR
           description LIKE ? OR
           content LIKE ? OR
           url LIKE ?
         )
       ORDER BY
         CASE
           WHEN title LIKE ? THEN 1
           WHEN description LIKE ? THEN 2
           WHEN content LIKE ? THEN 3
           ELSE 4
         END,
         title ASC
       LIMIT 10`,
    )
      .bind(
        siteId,
        pattern,
        pattern,
        pattern,
        pattern,
        pattern,
        pattern,
        pattern,
      )
      .all<{
        title: string;
        url: string;
        description: string;
        content: string;
        icon: string;
        breadcrumbs: string;
      }>();

    const mapped: SearchResult[] = (results ?? []).map((row) => ({
      path: row.url,
      title: row.title,
      description: row.description || makeSnippet(row.content, query),
      icon: row.icon || 'hashtag',
      breadcrumbs: JSON.parse(row.breadcrumbs || '[]'),
      snippet: makeSnippet(row.content, query),
    }));

    return json({ results: mapped, siteId });
  } catch {
    return json({ error: 'Search failed' }, 500);
  }
};

export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
};
