// Generated at build time from the site domain in astro.config.mjs.
// Add new pages here when they're created. The privacy policy is noindex
// and deliberately excluded.
const PAGES = [
  { path: "/", priority: "1.0" },
  { path: "/tax-accounting-services/", priority: "0.9" },
  { path: "/our-approach/", priority: "0.8" },
  { path: "/meet-ryan-sims/", priority: "0.7" },
  { path: "/contact/", priority: "0.7" },
  { path: "/discovery-call/", priority: "0.6" },
];

const LASTMOD = "2026-07-29";

export function GET({ site }) {
  const SITE = site.origin;
  const urls = PAGES.map(
    (p) => `  <url>
    <loc>${SITE}${p.path}</loc>
    <lastmod>${LASTMOD}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${p.priority}</priority>
  </url>`
  ).join("\n");
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
  return new Response(body, { headers: { "content-type": "application/xml; charset=utf-8" } });
}
