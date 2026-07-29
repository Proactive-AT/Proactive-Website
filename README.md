# Proactive Accounting & Tax — proactive-at.com

Rebuild of the original WordPress site as a static **Astro** project.
The build outputs plain, zero-JavaScript-framework HTML/CSS — deployed on
**Cloudflare Pages**.

## Structure

```
.
├── astro.config.mjs                # site URL + directory-style output
├── package.json                    # scripts: dev / build / preview
├── src/
│   ├── layouts/BaseLayout.astro    # <head>, header, footer, site JS — shared by every page
│   ├── components/
│   │   ├── Header.astro            # header + mobile off-canvas nav (edit once, applies everywhere)
│   │   └── Footer.astro            # CTA banner + footer (same)
│   └── pages/                      # one file per page → /our-approach/, /contact/, etc.
│       ├── index.astro
│       ├── our-approach.astro
│       ├── tax-accounting-services.astro
│       ├── contact.astro           # Contact form (posts to /api/contact)
│       ├── discovery-call.astro
│       ├── meet-ryan-sims.astro
│       └── privacy-policy.astro    # noindex
├── public/                         # copied to the build output verbatim
│   ├── robots.txt                  # Allows all crawlers incl. AI bots; points to sitemap
│   ├── sitemap.xml                 # All indexable pages (privacy policy is noindex, excluded)
│   ├── llms.txt                    # GEO: structured business summary for LLM crawlers
│   └── assets/
│       ├── css/style.css           # Single shared stylesheet
│       ├── css/fonts.css           # Self-hosted @font-face rules (no Google Fonts CDN)
│       ├── fonts/                  # Trirong + Source Sans 3 woff2 (latin subset)
│       ├── js/main.js              # Sticky header, mobile nav, form submit, click-to-load map
│       └── img/                    # All images
└── functions/
    └── api/contact.js              # Cloudflare Pages Function (POST /api/contact)
```

Page metadata (title, description, canonical, Open Graph, optional JSON-LD
schema) is passed to `BaseLayout` as props from each page's frontmatter.
URLs match the original site (`/our-approach/`, `/contact/`, etc.).

## Changing the site domain

The domain lives in exactly one place: **`site` in `astro.config.mjs`**.
Canonical URLs, Open Graph tags, JSON-LD schema, `sitemap.xml`, `robots.txt`,
and `llms.txt` all derive from it at build time (the latter three are generated
by `src/pages/*.txt.js` / `*.xml.js` endpoints). Currently
`https://atproactive.com` during the 60-day registrar lock on proactive-at.com;
when the lock expires, change that one line back to `https://proactive-at.com`
and rebuild. Email addresses (`ryan@proactive-at.com`) are unrelated to the
site domain and hardcoded where they appear.

## Local development

```
npm install
npm run dev        # live-reload dev server at localhost:4321
npm run build      # static output → dist/
npm run preview    # serve dist/ locally
```

## Deploying to Cloudflare Pages

1. Push this repo to Git and connect it in the Cloudflare dashboard
   (**Workers & Pages → Create → Pages**).
   - Framework preset: **Astro**
   - Build command: `npm run build`
   - Build output directory: `dist`
2. The `functions/` directory at the repo root is picked up automatically —
   `functions/api/contact.js` becomes the `POST /api/contact` endpoint.

## Contact form configuration

The form on `/contact/` posts to `/api/contact`, which emails the submission via
[Resend](https://resend.com) (free tier: 3,000 emails/month). Setup:

1. Create a Resend account and verify the domain: **Resend → Domains → Add Domain**
   → `atproactive.com` (its DNS is on Cloudflare, so the DKIM/SPF records Resend
   shows are added in the Cloudflare DNS dashboard). Click Verify.
2. Create an API key: **Resend → API Keys → Create** (Sending access is enough).
3. Set these environment variables in **Pages → Settings → Environment variables**:

| Variable | Required | Example |
|---|---|---|
| `RESEND_API_KEY` | yes | `re_…` (from step 2) |
| `CONTACT_TO_EMAIL` | yes | `ryan@proactive-at.com` |
| `CONTACT_FROM_EMAIL` | yes | `noreply@atproactive.com` (must match the Resend-verified domain) |
| `TURNSTILE_SECRET_KEY` | no | enables Cloudflare Turnstile bot protection |

### Optional: Turnstile (bot protection)

1. Create a Turnstile widget in the Cloudflare dashboard for `proactive-at.com`.
2. Set `TURNSTILE_SECRET_KEY` in the Pages env vars.
3. Add to the form in `src/pages/contact.astro`, just above the submit button:
   ```html
   <div class="cf-turnstile" data-sitekey="YOUR_SITE_KEY"></div>
   <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
   ```

Without Turnstile the form still has a honeypot field that silently drops bot
submissions.

## Notes vs. the original site

- **Fonts:** Trirong + Source Sans 3, self-hosted from `public/assets/fonts/`
  (no Google Fonts CDN — no visitor data goes to Google).
  Root font-size is 14px to preserve the original em-based sizing.
- **Icons:** the original loaded all of FontAwesome; this rebuild uses small
  inline SVGs (phone, map pin, checkmarks, service icons) — no icon font.
- **Dropped:** LeadConnector/GoHighLevel booking widget and form embeds; the
  discovery-call page now routes to the contact form and phone number.
- **Content fixes** (deliberate, from the source): "financial managment" →
  "management"; "trusted a partner" → "a trusted partner"; "lead by your CPA" →
  "led by your CPA"; the Business Advisory section's duplicated kicker got
  advisory-specific copy; the privacy policy was rewritten for a static site
  (the original was unmodified WordPress boilerplate) — **have Ryan review it**.
- Original visual quirks preserved: transparent header that darkens on scroll,
  95vh home hero, 240px parallax-style banner, sage eyebrows, gold hover
  accents, 18px image radii, pattern strips, green hairline dividers.

## Testing the contact form locally

`npm run dev` serves the pages but not the Cloudflare function. To exercise
`/api/contact` locally, build first and run wrangler against the output:

```
npm run build
npx wrangler pages dev dist
```
