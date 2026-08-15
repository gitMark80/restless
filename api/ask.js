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

Respond ONLY with valid JSON. No markdown fences, no preamble. Exactly this shape:
{"text": "the pastoral answer, 2-4 sentences", "sources": [{"label": "e.g. Catechism of the Catholic Church, §XXX, or a person's name", "detail": "one sentence on what this source teaches, relevant to the question"}]}

Include 1-3 sources. At least one must be a primary source (Catechism paragraph, Scripture citation, or a Doctor of the Church).`;

const AGE_TONE = {
  Child: "Use very simple words and short sentences, as if speaking to a young child. Warm and concrete, no abstract theology.",
  Teen: "Direct, honest, conversational. Respect a teenager's intelligence. Never preachy or condescending.",
  Adult: "Warm, clear, thoughtful adult tone.",
  Senior: "Respectful, unhurried, warm.",
};

const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 8;
const buckets = new Map();

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

  const { question, ageBand } = req.body || {};

  if (!question || typeof question !== "string") {
    return res.status(400).json({ error: "Missing question" });
  }

  if (question.length > 1000) {
    return res.status(400).json({ error: "Question is too long." });
  }

  const tone = AGE_TONE[ageBand] || AGE_TONE.Adult;

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
        system: `${SYSTEM_PROMPT}\n\nAudience tone for this response: ${tone}`,
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
