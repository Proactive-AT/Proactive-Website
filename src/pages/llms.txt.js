// Generated at build time from the site domain in astro.config.mjs.
// GEO: structured business summary for LLM crawlers.
export function GET({ site }) {
  const SITE = site.origin;
  const body = `# Proactive Accounting & Tax

> Proactive Accounting & Tax is a San Diego–area CPA and tax advisory firm founded by Ryan D. Sims, CPA, EA, MBA — a California-licensed CPA and IRS Enrolled Agent. The firm provides year-round tax planning, tax preparation, coordinated bookkeeping, and business advisory for individuals and small business owners — with an emphasis on proactive, ongoing communication rather than once-a-year tax filing.

Key facts:

- Business name: Proactive Accounting & Tax
- Website: ${SITE}/
- Address: 3605 Ocean Ranch Blvd, Suite 202, Oceanside, CA 92056
- Phone: (760) 205-0625
- Service area: San Diego County, California (San Diego and surrounding communities including Oceanside, Carlsbad, Encinitas, Vista, Escondido, Poway, La Jolla, Del Mar, and Rancho Santa Fe) and clients in all 50 states
- Founder: Ryan D. Sims, CPA, EA, MBA — Certified Public Accountant (California), IRS Enrolled Agent, MBA, small business owner, and military veteran
- Tax preparation available for clients in all 50 states
- Ideal clients: small and growing business owners who want one coordinated place for bookkeeping, tax strategy, and year-round planning
- Getting started: free, no-pressure discovery call, requested via the contact form or by phone

## Services

- [Tax Preparation & Compliance](${SITE}/tax-accounting-services/): individual and business tax returns, federal and state compliance in all 50 states, IRS and state correspondence support
- [Proactive Tax Planning](${SITE}/tax-accounting-services/): year-round planning to legally reduce tax liability — timing income and expenses, identifying deductions and credits early, planning for growth and major changes
- [Accounting & Bookkeeping](${SITE}/tax-accounting-services/): bookkeeping performed in-house for select clients or through vetted bookkeeping partners, always coordinated with tax strategy and overseen by the CPA
- [Business Advisory & Entity Structuring](${SITE}/tax-accounting-services/): LLC vs. S-Corp considerations, business structure changes, owner compensation planning

## Pages

- [Home](${SITE}/): overview of the firm's proactive approach to tax and accounting for San Diego area small business owners
- [Our Approach](${SITE}/our-approach/): how the firm coordinates bookkeeping and tax planning into one strategy led by the CPA
- [Tax + Accounting Services](${SITE}/tax-accounting-services/): full description of all four service areas
- [Meet Ryan Sims](${SITE}/meet-ryan-sims/): background and credentials — CPA, Enrolled Agent, MBA, former tax advisor, auditor, and bank examiner
- [Contact](${SITE}/contact/): contact form, office address, phone number, and map
- [Discovery Call](${SITE}/discovery-call/): how to schedule a free initial consultation

## Affiliations

- Oceanside Chamber of Commerce member
- BNI member
- IRS Enrolled Agent
- QuickBooks Online Advanced Certified ProAdvisor
`;
  return new Response(body, { headers: { "content-type": "text/plain; charset=utf-8" } });
}
