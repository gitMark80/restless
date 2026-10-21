// Question counter for the /stats page. Counts only how many questions were answered,
// never what was asked: people bring grief and other very personal things here.
// Uses the Upstash Redis store shared with Beach Day Arcade (one free database per account),
// so every key starts with "restless:". Without the store connected this does nothing.
const URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

export const ready = Boolean(URL && TOKEN);
export const ALL_KEY = "restless:q:all";
export const RECENT_DAYS = 30;

// Days roll over at midnight Central, where Restless is run from.
export const dayString = (d) =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "America/Chicago", year: "numeric", month: "2-digit", day: "2-digit" }).format(d);
export const dayKey = (d) => `restless:q:day:${dayString(d)}`;

export async function pipeline(cmds, timeoutMs = 3000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const r = await fetch(`${URL}/pipeline`, {
      method: "POST",
      headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify(cmds),
      signal: controller.signal,
    });
    if (!r.ok) throw new Error(`Redis HTTP ${r.status}`);
    const out = await r.json();
    return out.map((x) => {
      if (x.error) throw new Error(x.error);
      return x.result;
    });
  } finally {
    clearTimeout(timer);
  }
}

// Adds one answered question. `followUp` = it continued a conversation; `language` = "en" or "es".
// Never throws and gives up after a second, so counting can't slow down or break an answer.
export async function countQuestion({ followUp, language }) {
  if (!ready) return;
  const day = dayKey(new Date());
  const fields = ["total"];
  if (followUp) fields.push("followup");
  if (language === "es") fields.push("es");
  const cmds = [];
  for (const f of fields) cmds.push(["HINCRBY", day, f, "1"], ["HINCRBY", ALL_KEY, f, "1"]);
  cmds.push(["EXPIRE", day, String(400 * 86400)]);
  try {
    await pipeline(cmds, 1000);
  } catch (e) {
    /* counting is best-effort */
  }
}
