// Generated at build time so the sitemap URL always follows the site domain
// configured in astro.config.mjs.
export function GET({ site }) {
  const SITE = site.origin;
  const body = `# ${site.hostname} — all crawlers welcome
User-agent: *
Allow: /

# --- AI / LLM crawlers (explicitly allowed for generative-engine visibility) ---
User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Applebot-Extended
Allow: /

User-agent: cohere-ai
Allow: /

User-agent: Bytespider
Allow: /

Sitemap: ${SITE}/sitemap.xml
`;
  return new Response(body, { headers: { "content-type": "text/plain; charset=utf-8" } });
}
