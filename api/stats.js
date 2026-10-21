// GET /api/stats — question counts for the /stats page (numbers only, never question text).
// { today, days: [{date, total, followup, es}] (oldest first, last 30 days), allTime: {total, followup, es} }
import { ready, pipeline, ALL_KEY, RECENT_DAYS, dayKey, dayString } from "./_counter.js";

const toCounts = (flat) => {
  const out = { total: 0, followup: 0, es: 0 };
  for (let i = 0; i < (flat || []).length; i += 2) if (flat[i] in out) out[flat[i]] = Number(flat[i + 1]) || 0;
  return out;
};

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (!ready) return res.status(503).json({ error: "question counter not connected" });
  const now = Date.now();
  const dates = Array.from({ length: RECENT_DAYS }, (_, i) => new Date(now - (RECENT_DAYS - 1 - i) * 86400000));
  try {
    const results = await pipeline([["HGETALL", ALL_KEY], ...dates.map((d) => ["HGETALL", dayKey(d)])]);
    const days = dates.map((d, i) => ({ date: dayString(d), ...toCounts(results[i + 1]) }));
    return res.status(200).json({ today: days[days.length - 1].date, days, allTime: toCounts(results[0]) });
  } catch (e) {
    return res.status(502).json({ error: "counter unavailable" });
  }
}
