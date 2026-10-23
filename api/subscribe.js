// Newsletter signup → Kit (kit.com), with double opt-in.
//
// Off until both environment variables are set in Vercel:
//   KIT_API_KEY  — Kit → Settings → Developer → API key (v4)
//   KIT_FORM_ID  — the numeric ID of a Kit form (Grow → Landing Pages & Forms)
// While either is missing, GET returns {enabled:false} and the site hides
// every signup box, so nothing half-works in public.
//
// Consent: the request must carry consent:true (the visitor ticked the box).
// Kit then emails a confirmation link; the person is only added to the list
// after they click it, and every Kit email carries an unsubscribe link.

const KIT_API = "https://api.kit.com/v4";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const buckets = new Map();

export function isConfigured(env = process.env) {
  return Boolean(env.KIT_API_KEY && /^\d+$/.test(String(env.KIT_FORM_ID || "")));
}

export function validateSignup(body) {
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  if (body?.website) return { ok: false, status: 200, silent: true }; // honeypot: pretend success
  if (body?.consent !== true) return { ok: false, status: 400, error: "Please confirm you'd like to receive the emails." };
  if (!email || email.length > 254 || !EMAIL_PATTERN.test(email)) {
    return { ok: false, status: 400, error: "Please enter a valid email address." };
  }
  const where = typeof body?.where === "string" ? body.where.replace(/[^a-z0-9_-]/gi, "").slice(0, 40) : "";
  return { ok: true, email, where };
}

function rateLimited(ip) {
  const now = Date.now();
  const bucket = buckets.get(ip) || { count: 0, resetAt: now + WINDOW_MS };
  if (now > bucket.resetAt) {
    bucket.count = 0;
    bucket.resetAt = now + WINDOW_MS;
  }
  bucket.count += 1;
  buckets.set(ip, bucket);
  if (buckets.size > 5000) {
    for (const [key, value] of buckets) if (now > value.resetAt) buckets.delete(key);
  }
  return bucket.count > MAX_PER_WINDOW;
}

async function kit(path, body, apiKey) {
  const response = await fetch(`${KIT_API}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json", "X-Kit-Api-Key": apiKey },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    const error = new Error(`Kit ${path} failed: ${response.status} ${detail.slice(0, 200)}`);
    error.status = response.status;
    throw error;
  }
  return response.json().catch(() => ({}));
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  const enabled = isConfigured();

  if (req.method === "GET") return res.status(200).json({ enabled });
  if (req.method !== "POST") {
    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  if (!enabled) return res.status(503).json({ error: "The newsletter isn't open yet." });

  const ip = (req.headers["x-forwarded-for"] || "").split(",")[0].trim() || "unknown";
  if (rateLimited(ip)) return res.status(429).json({ error: "Please wait a few minutes and try again." });

  const check = validateSignup(req.body || {});
  if (check.silent) return res.status(200).json({ ok: true });
  if (!check.ok) return res.status(check.status).json({ error: check.error });

  try {
    // 1) create (or find) the subscriber as inactive, 2) add them to the form,
    // which sends Kit's confirmation email (double opt-in).
    await kit("/subscribers", { email_address: check.email, state: "inactive" }, process.env.KIT_API_KEY);
    await kit(
      `/forms/${process.env.KIT_FORM_ID}/subscribers`,
      { email_address: check.email, referrer: `https://restless.faith/${check.where ? `#${check.where}` : ""}` },
      process.env.KIT_API_KEY
    );
    console.log(JSON.stringify({ route: "/api/subscribe", event: "subscribed_pending_confirmation", where: check.where }));
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(JSON.stringify({ route: "/api/subscribe", event: "failed", status: err.status || 0, error: err.message }));
    return res.status(502).json({ error: "That didn't go through. Please try again in a moment." });
  }
}
