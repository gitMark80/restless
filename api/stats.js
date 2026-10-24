// GET /api/stats — numbers for restless.faith/stats.
// {
//   today: "YYYY-MM-DD",
//   daily: [{date, visits, answers}]            last 30 days, oldest first (UTC days)
//   ranges: {"1": {<event>: {key: n}}, "7": …, "30": …, all: …}
// }
import { ready, pipeline, RECENT_DAYS, EVENTS, evAll, evDay } from "./_counter.js";

const toMap = (flat, allowed) => {
  const out = {};
  for (let i = 0; i < (flat || []).length; i += 2) {
    if (allowed.includes(flat[i])) out[flat[i]] = Math.round(Number(flat[i + 1]));
  }
  return out;
};
const total = (flat) => {
  let n = 0;
  for (let i = 1; i < (flat || []).length; i += 2) n += Number(flat[i]);
  return Math.round(n);
};

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (!ready) return res.status(503).json({ error: "counter not connected" });

  const now = Date.now();
  const dates = Array.from({ length: RECENT_DAYS }, (_, i) => new Date(now - (RECENT_DAYS - 1 - i) * 86400000));
  const names = Object.keys(EVENTS);
  const spans = [1, 7, 30];
  const union = (event, n) => {
    const keys = dates.slice(-n).map((d) => evDay(event, d));
    return ["ZUNION", String(keys.length), ...keys, "WITHSCORES"];
  };

  const cmds = [];
  for (const e of names) {
    cmds.push(["ZREVRANGE", evAll(e), "0", "-1", "WITHSCORES"]);
    for (const n of spans) cmds.push(union(e, n));
  }
  for (const d of dates) {
    cmds.push(["ZRANGE", evDay("visit", d), "0", "-1", "WITHSCORES"]);
    cmds.push(["ZRANGE", evDay("answer", d), "0", "-1", "WITHSCORES"]);
  }

  try {
    const results = await pipeline(cmds);
    const ranges = { all: {}, 1: {}, 7: {}, 30: {} };
    names.forEach((e, i) => {
      const base = i * (1 + spans.length);
      ranges.all[e] = toMap(results[base], EVENTS[e]);
      spans.forEach((n, j) => {
        ranges[n][e] = toMap(results[base + 1 + j], EVENTS[e]);
      });
    });
    const d0 = names.length * (1 + spans.length);
    const daily = dates.map((d, i) => ({
      date: d.toISOString().slice(0, 10),
      visits: total(results[d0 + 2 * i]),
      answers: total(results[d0 + 2 * i + 1]),
    }));
    return res.status(200).json({ today: daily[daily.length - 1].date, daily, ranges });
  } catch {
    return res.status(502).json({ error: "counter unavailable" });
  }
}
