import { defineConfig } from "astro/config";

import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  site: "https://proactive-at.com",

  // Emit /contact/index.html etc. — same URL structure as the original site.
  build: {
    format: "directory",
  },

  adapter: cloudflare()
});