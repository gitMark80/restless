const SYSTEM_PROMPT = `You are the response engine behind "Restless," an app for people who are hurting, doubting, or drifting, and who have a question about the Catholic faith they may not feel able to ask out loud.

ORDERING RULE — this is the whole product:
Address the PERSON before you address the QUESTION. Someone asking "why did God let my mom die" is not making an information request. Lead with their dignity and God's love for them, then give what the Church holds. Never open with a definition.

Core rules:
1. Ground every answer in the Catechism of the Catholic Church, Sacred Scripture, the Doctors of the Church (Aquinas, Augustine, etc.), and papal encyclicals. These are your doctrinal spine.
2. You may CITE modern Catholic communicators by name to describe how they teach on a topic — e.g. "Bishop Barron often explains..." NEVER write as if you ARE one of these living people, and NEVER invent a quote and attribute to them. Only describe general, well-known public teaching positions.
   - Pastoral/healing voices (prefer when the person is hurting): Sr. Miriam James Heidland SOLT, Fr. Mark-Mary Ames CFR, Fr. Dave Pivonka TOR, Fr. Columba Jordan CFR, Jennifer Fulwiler.
   - Doctrinal/apologetic voices: Bishop Robert Barron, Fr. Mike Schmitz, Trent Horn, Matthew Kelly, Jimmy Akin, Karlo Broussard, Joe Heschmeyer, Scott Hahn, Jeff Cavins.
3. Tone: Bishop Barron's model — clarity delivered gently, not traded away. State Church teaching plainly, without hedging and without apologizing for it. Never shame. Use beauty and reason as entry points, not just rules.
4. If a topic is genuinely disputed among faithful Catholics (as opposed to settled doctrine), say so honestly.
5. KNOW THE EDGE OF THE TOOL. For grief, despair, scrupulosity, abuse, or anything approaching self-harm: shorten, stop teaching, and name what you are not. Point toward a real person — a priest, a counselor, a crisis line. Warmth here means naming the limit, not generating more text.
6. Keep the main answer to 2-4 sentences.
7. When citing Scripture, use the Catholic 73-book canon. This includes the Deuterocanonical books where relevant (Tobit, Judith, Wisdom, Sirach, Baruch, 1–2 Maccabees, and the Greek additions to Esther and Daniel). Never treat these as non-canonical or omit them from consideration.

Respond ONLY with valid JSON. No markdown fences, no preamble. Exactly this shape:
{"text": "the pastoral answer, 2-4 sentences", "sources": [{"label": "e.g. Catechism of the Catholic Church, §XXX, or a person's name", "detail": "one sentence on what this source teaches, relevant to the question", "url": "optional — only include when explicitly given a URL to use in additional context below"}]}

Include 1-3 sources. At least one must be a primary source (Catechism paragraph, Scripture citation, or a Doctor of the Church).`;

const AGE_TONE = {
  Child: "Use very simple words and short sentences, as if speaking to a young child. Warm and concrete, no abstract theology.",
  Teen: "Direct, honest, conversational. Respect a teenager's intelligence. Never preachy or condescending.",
  Adult: "Warm, clear, thoughtful adult tone.",
  Senior: "Respectful, unhurried, warm.",
};

const LANGUAGE_INSTRUCTION = {
  en: "Respond entirely in English.",
  es: "Respond entirely in Spanish (español). Both the \"text\" field and every source \"label\" and \"detail\" must be in Spanish — for example, cite the Catechism as \"Catecismo de la Iglesia Católica, §XXX\" rather than the English form. Still return valid JSON with the same field names (text, sources, label, detail) in English — only the VALUES are translated, not the JSON keys.",
};

const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 8;
const buckets = new Map();

const DAY_WORD = "(today'?s?|tomorrow'?s?|yesterday'?s?|daily)";

const DAILY_READING_PATTERN = new RegExp(
  `\\b${DAY_WORD}\\b.{0,20}\\b(reading|readings|gospel|mass)\\b|\\b(reading|readings|gospel)\\b.{0,20}\\b(today|tomorrow|yesterday)\\b|lectionary (today|tomorrow|yesterday)|${DAY_WORD}\\s+lectionary`,
  "i"
);

const FEAST_DAY_PATTERN = new RegExp(
  `\\b(feast day|feast of|whose feast|which saint|what saint|saint'?s?\\s+day|(memorial|feast|solemnity)\\s+(today|tomorrow|yesterday)|${DAY_WORD}.{0,15}(saint|memorial|feast|solemnity)|(saint|memorial|feast|solemnity).{0,15}(today|tomorrow|yesterday)|liturgical (day|calendar)\\s+(today|tomorrow|yesterday)|what.{0,15}(are we celebrat|is the church celebrat).{0,20}(today|tomorrow|yesterday))`,
  "i"
);

function isDailyReadingQuestion(question) {
  return DAILY_READING_PATTERN.test(question);
}

function isFeastDayQuestion(question) {
  return FEAST_DAY_PATTERN.test(question);
}

function resolveTargetDate(question, todayIso) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(todayIso || "");
  if (!match) return { isoDate: null, dayLabel: "today" };

  const base = new Date(Date.UTC(+match[1], +match[2] - 1, +match[3]));
  let offset = 0;
  let dayLabel = "today";
  if (/\byesterday'?s?\b/i.test(question)) {
    offset = -1;
    dayLabel = "yesterday";
  } else if (/\btomorrow'?s?\b/i.test(question)) {
    offset = 1;
    dayLabel = "tomorrow";
  }
  base.setUTCDate(base.getUTCDate() + offset);

  const y = base.getUTCFullYear();
  const m = String(base.getUTCMonth() + 1).padStart(2, "0");
  const d = String(base.getUTCDate()).padStart(2, "0");
  return { isoDate: `${y}-${m}-${d}`, dayLabel };
}

function toMMDDYY(isoDate) {
  // isoDate expected as "YYYY-MM-DD" from the client's local date
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate || "");
  if (!match) return null;
  const [, yyyy, mm, dd] = match;
  return `${mm}${dd}${yyyy.slice(2)}`;
}

function stripHtmlToLines(html) {
  const withoutScripts = html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "");
  const withBreaks = withoutScripts.replace(/<[^>]+>/g, "\n");
  const decoded = withBreaks
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"');
  return decoded
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

async function fetchTodaysReadingCitations(isoDate) {
  const mmddyy = toMMDDYY(isoDate);
  if (!mmddyy) {
    console.error("USCCB lookup: invalid isoDate:", isoDate);
    return null;
  }

  const pageUrl = `https://bible.usccb.org/bible/readings/${mmddyy}.cfm`;

  const res = await fetch(pageUrl, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9",
    },
  });

  if (!res.ok) {
    console.error("USCCB fetch failed:", pageUrl, "status:", res.status);
    return null;
  }

  const html = await res.text();

  const titleMatch = /<title>([^<]+)<\/title>/i.exec(html);
  const liturgicalDay = titleMatch
    ? titleMatch[1].replace(/\s*\|\s*USCCB\s*$/i, "").trim()
    : null;

  const lines = stripHtmlToLines(html);

  const sectionLabels = ["Reading 1", "Responsorial Psalm", "Reading 2", "Gospel"];
  const citations = {};

  for (let i = 0; i < lines.length; i++) {
    const label = sectionLabels.find(
      (l) => l.toLowerCase() === lines[i].toLowerCase()
    );
    if (label && lines[i + 1]) {
      // The line right after the header is the citation, e.g. "Isaiah 56:1, 6-7"
      citations[label] = lines[i + 1];
    }
  }

  // USCCB marks optional memorials as a separate line/link, e.g.
  // "Readings for the Optional Memorial of Our Lady of Mount Carmel"
  // which HTML-stripping may split across two lines, so check both forms.
  let memorialName = null;
  for (let i = 0; i < lines.length; i++) {
    const inline = /^readings for the (.+)$/i.exec(lines[i]);
    if (inline) {
      memorialName = inline[1].trim();
      break;
    }
    if (/^readings for the$/i.test(lines[i]) && lines[i + 1]) {
      memorialName = lines[i + 1].trim();
      break;
    }
  }

  if (!liturgicalDay || Object.keys(citations).length === 0) {
    console.error(
      "USCCB parse failed for",
      pageUrl,
      "— titleFound:",
      !!liturgicalDay,
      "citationsFound:",
      Object.keys(citations).length,
      "htmlLength:",
      html.length
    );
    return null;
  }

  return { liturgicalDay, memorialName, citations, pageUrl };
}

function isRateLimited(ip) {
  const now = Date.now();
  const bucket = buckets.get(ip) || { count: 0, resetAt: now + RATE_LIMIT_WINDOW_MS };

  if (now > bucket.resetAt) {
    bucket.count = 0;
    bucket.resetAt = now + RATE_LIMIT_WINDOW_MS;
  }

  bucket.count += 1;
  buckets.set(ip, bucket);

  if (buckets.size > 5000) {
    for (const [key, value] of buckets) {
      if (now > value.resetAt) buckets.delete(key);
    }
  }

  return bucket.count > MAX_REQUESTS_PER_WINDOW;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const ip =
    (req.headers["x-forwarded-for"] || "").split(",")[0].trim() || "unknown";

  if (isRateLimited(ip)) {
    return res.status(429).json({
      error: "Please wait a moment before asking again.",
    });
  }

  const { question, ageBand, language, todayDate } = req.body || {};

  if (!question || typeof question !== "string") {
    return res.status(400).json({ error: "Missing question" });
  }

  if (question.length > 1000) {
    return res.status(400).json({ error: "Question is too long." });
  }

  const tone = AGE_TONE[ageBand] || AGE_TONE.Adult;
  const languageInstruction =
    LANGUAGE_INSTRUCTION[language] || LANGUAGE_INSTRUCTION.en;

  let readingContext = "";
  if (isDailyReadingQuestion(question) || isFeastDayQuestion(question)) {
    const { isoDate: targetIso, dayLabel } = resolveTargetDate(question, todayDate);
    try {
      const readings = await fetchTodaysReadingCitations(targetIso);
      if (readings) {
        const { liturgicalDay, memorialName, citations, pageUrl } = readings;
        readingContext = `\n\nLITURGICAL CONTEXT FOR ${dayLabel.toUpperCase()} (from the USCCB daily readings page, for reference only):
${dayLabel[0].toUpperCase() + dayLabel.slice(1)} is: ${liturgicalDay}${memorialName ? ` — with the ${memorialName}` : ""}
${Object.entries(citations)
  .map(([label, cite]) => `${label}: ${cite}`)
  .join("\n")}

IMPORTANT: Only use the feast/memorial/saint name and the citations above — never invent or guess any other observance, and be clear you're referring to ${dayLabel}, not any other day. The Mass readings are copyrighted by the USCCB Lectionary: do NOT quote or reproduce their text, even briefly. If the person asked about the feast day or saint, answer that directly using the information above. If they asked about the readings, name the citations and offer a short original pastoral reflection in your own words on what they're about — never quoting them. Include one source with "label": "${dayLabel[0].toUpperCase() + dayLabel.slice(1)}'s Readings — USCCB", a "detail" summarizing the day, and a "url" field set to exactly "${pageUrl}" so the person can read the full text themselves.`;
      } else {
        readingContext = `\n\nNOTE: The person is asking about ${dayLabel}'s feast day, saint, or Mass readings, but this information could not be retrieved right now. Say so honestly and suggest they check bible.usccb.org directly. Do not guess or invent any feast, saint, or reading citation.`;
      }
    } catch (err) {
      console.error("USCCB fetch error:", err);
      readingContext = `\n\nNOTE: The person is asking about ${dayLabel}'s feast day, saint, or Mass readings, but this information could not be retrieved right now. Say so honestly and suggest they check bible.usccb.org directly. Do not guess or invent any feast, saint, or reading citation.`;
    }
  }

  try {
    const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: process.env.MODEL_ID || "claude-sonnet-4-5",
        max_tokens: 1000,
        system: `${SYSTEM_PROMPT}\n\nAudience tone for this response: ${tone}\n\n${languageInstruction}${readingContext}`,
        messages: [{ role: "user", content: question }],
      }),
    });

    if (!anthropicRes.ok) {
      const detail = await anthropicRes.text();
      console.error("Anthropic error:", anthropicRes.status, detail);
      return res
        .status(502)
        .json({ error: "Restless is unavailable right now." });
    }

    const data = await anthropicRes.json();

    const raw = (data.content || [])
      .map((block) => (block.type === "text" ? block.text : ""))
      .join("");

    const cleaned = raw.replace(/```json/g, "").replace(/```/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch (e) {
      const start = cleaned.indexOf("{");
      const end = cleaned.lastIndexOf("}");
      if (start !== -1 && end > start) {
        try {
          parsed = JSON.parse(cleaned.slice(start, end + 1));
        } catch (e2) {
          parsed = { text: cleaned, sources: [] };
        }
      } else {
        parsed = { text: cleaned, sources: [] };
      }
    }

    return res.status(200).json({
      text: parsed.text || cleaned,
      sources: Array.isArray(parsed.sources) ? parsed.sources : [],
    });
  } catch (err) {
    console.error("Handler error:", err);
    return res
      .status(500)
      .json({ error: "Something went wrong. Please try again." });
  }
}
