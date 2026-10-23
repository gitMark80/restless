// Connects in-app answers to the static question pages (/questions/<slug>).
// Pure functions; rendered by RelatedTopics in App.jsx.

import { TOPIC_INDEX, topicUrl } from "../content/topic-index.js";

export { topicUrl };

export const TOPIC_BY_SHORT = Object.fromEntries(TOPIC_INDEX.map((t) => [t.short, t]));

// Topics whose pattern matches the visitor's question come first; if fewer
// than `limit` match, the answer text can fill in (it often names related
// ideas, e.g. an answer about confession mentioning the Eucharist).
export function matchTopics(question, answer = "", limit = 3) {
  const q = String(question || "").toLowerCase();
  const a = String(answer || "").toLowerCase();
  const scored = TOPIC_INDEX.map((topic, order) => {
    let score = 0;
    if (q && topic.pattern.test(q)) score += 2;
    if (a && topic.pattern.test(a)) score += 1;
    return { topic, score, order };
  }).filter((x) => x.score > 0);
  scored.sort((x, y) => y.score - x.score || x.order - y.order);
  // At most one answer-only match, so a passing word doesn't fill the list.
  const fromQuestion = scored.filter((x) => x.score >= 2);
  const fromAnswer = scored.filter((x) => x.score === 1).slice(0, 1);
  return [...fromQuestion, ...fromAnswer].slice(0, limit).map((x) => x.topic);
}

// Reads ?q= and ?from= when someone arrives from a question page, a YouTube
// link or a shared link. The question is only pre-filled, never sent
// automatically, so a link can't spend an AI call without the visitor.
export function readDeepLink(search) {
  let params;
  try {
    params = new URLSearchParams(search || "");
  } catch {
    return { question: "", from: "", lang: "" };
  }
  const question = (params.get("q") || "").replace(/\s+/g, " ").trim().slice(0, 1000);
  const from = (params.get("from") || "").replace(/[^a-z0-9-]/gi, "").slice(0, 40);
  const lang = params.get("lang") === "es" ? "es" : params.get("lang") === "en" ? "en" : "";
  return { question, from, lang };
}
