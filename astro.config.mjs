import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  // SINGLE SOURCE OF TRUTH for the site's domain. Canonicals, Open Graph URLs,
  // JSON-LD, sitemap.xml, robots.txt, and llms.txt all derive from this value.
  // When proactive-at.com comes back (60-day registrar lock), change it here only.
  site: "https://atproactive.com",
  // Emit /contact/index.html etc. — same URL structure as the original site.
  build: {
    format: "directory",
  },
});
