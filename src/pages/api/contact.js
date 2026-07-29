/**
 * Contact form endpoint — POST /api/contact
 *
 * Runs on-demand inside the Cloudflare Worker (this route is excluded from
 * prerendering; the @astrojs/cloudflare adapter compiles it into
 * dist/_worker.js). The static pages around it are unaffected.
 *
 * Environment variables (Cloudflare dashboard → the Worker → Settings →
 * Variables and Secrets; locally, put them in a .dev.vars file):
 *   RESEND_API_KEY        — API key from resend.com (sending access)
 *   CONTACT_TO_EMAIL      — where submissions are delivered (e.g. ryan@proactive-at.com)
 *   CONTACT_FROM_EMAIL    — verified sender on the Resend-verified domain
 *                           (e.g. noreply@atproactive.com)
 *   TURNSTILE_SECRET_KEY  — (optional) Cloudflare Turnstile secret; if set, tokens are verified
 */

export const prerender = false;

const REQUIRED_FIELDS = ["name", "email", "message"];

export async function POST({ request, locals }) {
  const env = locals.runtime.env;

  let data;
  const contentType = request.headers.get("content-type") || "";
  try {
    if (contentType.includes("application/json")) {
      data = await request.json();
    } else {
      const form = await request.formData();
      data = Object.fromEntries(form.entries());
    }
  } catch {
    return json({ ok: false, error: "Invalid request body." }, 400);
  }

  // Honeypot — real users never fill this hidden field.
  if (data.company_website) {
    return json({ ok: true }); // pretend success to bots
  }

  for (const field of REQUIRED_FIELDS) {
    if (!data[field] || String(data[field]).trim() === "") {
      return json({ ok: false, error: `Missing required field: ${field}` }, 400);
    }
  }

  const email = String(data.email).trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ ok: false, error: "Please enter a valid email address." }, 400);
  }

  // Optional Turnstile verification
  if (env.TURNSTILE_SECRET_KEY) {
    const token = data["cf-turnstile-response"];
    if (!token) {
      return json({ ok: false, error: "Please complete the verification." }, 400);
    }
    const verify = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret: env.TURNSTILE_SECRET_KEY,
        response: token,
        remoteip: request.headers.get("cf-connecting-ip") || "",
      }),
    });
    const outcome = await verify.json();
    if (!outcome.success) {
      return json({ ok: false, error: "Verification failed. Please try again." }, 400);
    }
  }

  const name = String(data.name).trim().slice(0, 200);
  const phone = String(data.phone || "").trim().slice(0, 50);
  const message = String(data.message).trim().slice(0, 5000);

  const bodyText = [
    `New contact form submission from the website`,
    ``,
    `Name:    ${name}`,
    `Email:   ${email}`,
    phone ? `Phone:   ${phone}` : null,
    ``,
    `Message:`,
    message,
  ]
    .filter((line) => line !== null)
    .join("\n");

  const mail = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${env.RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: `Proactive Accounting & Tax — Website <${env.CONTACT_FROM_EMAIL}>`,
      to: [env.CONTACT_TO_EMAIL],
      reply_to: `${name} <${email}>`,
      subject: `Website inquiry from ${name}`,
      text: bodyText,
    }),
  });

  if (!mail.ok) {
    // Surface the real Resend error in Worker logs (dashboard → Logs, or `wrangler tail`).
    const detail = await mail.text().catch(() => "");
    console.error(`Resend send failed: HTTP ${mail.status} — ${detail}`);
    return json(
      { ok: false, error: "Something went wrong sending your message. Please call us at (760) 205-0625." },
      502
    );
  }

  return json({ ok: true });
}

function json(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "content-type": "application/json" },
  });
}
