// POST /api/event?e=<event>&k=<key> — adds one to an anonymous tally (all-time and today).
// Sent by public/rf.js with navigator.sendBeacon. See api/_counter.js for the events and keys.
import { ready, pipeline, RECENT_DAYS, evAll, evDay, normalizeKey } from "./_counter.js";

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "POST only" });
  }
  const event = String(req.query?.e || "");
  const key = normalizeKey(event, String(req.query?.k || "").slice(0, 40));
  if (!key) return res.status(400).json({ error: "unknown event or key" });
  if (!ready) return res.status(204).end(); // counter not connected yet: accept and drop

  const day = evDay(event, new Date());
  try {
    await pipeline([
      ["ZINCRBY", evAll(event), "1", key],
      ["ZINCRBY", day, "1", key],
      ["EXPIRE", day, String((RECENT_DAYS + 5) * 86400)],
    ]);
    return res.status(204).end();
  } catch {
    return res.status(502).json({ error: "counter unavailable" });
  }
}
