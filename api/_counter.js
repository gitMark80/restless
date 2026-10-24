// Anonymous counters for restless.faith/stats, stored in Upstash Redis.
//
// Restless shares the Upstash database that Beach Day Arcade and Sketchpad
// Arcade already use (one free database per account), so every key starts
// with "rf:". Connect that database to this Vercel project (Storage →
// Upstash → Connect Project) and Vercel adds the two environment variables
// read below. Until then /api/event quietly does nothing and /stats says so.
//
// Every count is a tally: <prefix>ev:<event>:all and <prefix>ev:<event>:day:<UTC date>,
// each a sorted set of key → count. Nothing about the visitor is stored: no
// IP address, no ID, no cookie, no question text.

import { TOPIC_INDEX } from "../content/topic-index.js";
import { BOOKS, JOURNALS, RECOMMENDED } from "../src/books.js";

const URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

export const ready = Boolean(URL && TOKEN);
export const PREFIX = "rf:";
export const RECENT_DAYS = 30;

export async function pipeline(cmds) {
  const response = await fetch(`${URL}/pipeline`, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(cmds),
    signal: AbortSignal.timeout(5000),
  });
  if (!response.ok) throw new Error(`Redis HTTP ${response.status}`);
  const out = await response.json();
  return out.map((x) => {
    if (x.error) throw new Error(x.error);
    return x.result;
  });
}

export const evAll = (e) => `${PREFIX}ev:${e}:all`;
export const evDay = (e, d) => `${PREFIX}ev:${e}:day:${d.toISOString().slice(0, 10)}`;

// Where a visitor first came from (public/rf.js decides).
export const SOURCES = ["youtube", "facebook", "instagram", "tiktok", "x", "reddit", "google", "bing", "search", "amazon", "email", "direct", "other"];
export const TOPICS = TOPIC_INDEX.map((t) => t.short);
export const PAGES = ["home", "questions", "books", "privacy", ...TOPICS];
export const BOOK_IDS = [...BOOKS, ...JOURNALS, ...RECOMMENDED].map((b) => b.id);
export const FAIL_REASONS = ["timeout", "rateLimit", "busy", "retry", "network", "unknown"];

// event → which keys it may be counted under. Anything else is rejected.
export const EVENTS = {
  visit: SOURCES, // a visit (browser session), by first source
  return: SOURCES, // a visit from someone who has been before
  page: PAGES, // a page opened (once per visit per page)
  ask: SOURCES, // a question sent in the app
  answer: SOURCES, // an answer delivered
  multi: SOURCES, // a visit that got 2+ answers
  fail: FAIL_REASONS, // an answer that failed
  related: TOPICS, // a "Keep exploring" / related-question link clicked, by destination
  topic_ask: [...TOPICS, "hub"], // "Ask" clicked on a question page
  books_open: SOURCES, // the in-app Books shelf opened
  amazon: BOOK_IDS, // an Amazon link clicked, by book
  amazon_src: SOURCES, // the same click, by visitor source
  signup: SOURCES, // newsletter signup (confirmation still pending)
};

// Unknown sources (odd utm_source tags) are counted as "other" rather than dropped.
export function normalizeKey(event, key) {
  const allowed = EVENTS[event];
  if (!allowed) return null;
  if (allowed.includes(key)) return key;
  if (allowed === SOURCES) return "other";
  return null;
}
