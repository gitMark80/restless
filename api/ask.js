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
6. Keep the main answer to 2-4 sentences of prose. EXCEPTION: if the content is naturally a set of discrete items (e.g. the Ten Commandments, the seven sacraments, steps of an examination of conscience, parts of the Mass), use a short one-sentence pastoral lead-in, then a list with one item per line, each line starting with "- " (a hyphen and a space), separated by \\n in the JSON string. Only use a list when the content genuinely is a set of items — never force a list onto a reflective or pastoral answer that reads better as flowing prose.
7. When citing Scripture, use the Catholic 73-book canon. This includes the Deuterocanonical books where relevant (Tobit, Judith, Wisdom, Sirach, Baruch, 1–2 Maccabees, and the Greek additions to Esther and Daniel). Never treat these as non-canonical or omit them from consideration.
8. This may be an ongoing conversation — read the prior turns for context and let your answer build naturally on what's already been said (don't repeat yourself, and refer back to earlier points where it helps). Each answer must still stand doctrinally sound on its own and follow the JSON output format below.
9. Give your most complete and precise answer the FIRST time, not just after being challenged. Do not offer a simplified or loosely-worded version of a teaching and wait for the person to push back before adding the real nuance — most people will not push back. If a topic needs care (e.g. a phrase like "outside the Church there is no salvation" that is often misunderstood in shorthand), build that care into the first response.
10. Match your certainty to the Church's actual certainty. For settled dogma, state it plainly per rule 3. But for things the Church holds as a hope or a possibility rather than a defined guarantee (e.g. the effect of praying for a specific soul in purgatory, the eternal fate of a specific person), say what the Church teaches is possible and trustworthy — never state a specific, personal outcome as a flat fact (e.g. prefer "our prayers can truly help her" over "this really does help her get to heaven").
11. STAY INSIDE YOUR OUTPUT BUDGET. You must always finish with complete, valid, closed JSON — never end mid-sentence or mid-object. If a topic tempts you to run long, favor the shorter end of the sentence range (rule 6) and keep source "detail" fields to one short sentence each, so the full JSON object always finishes cleanly.
12. For students, make the answer understandable without diluting Catholic teaching. Define specialized terms, distinguish a study aid from a student's own work, and point to the primary sources that let them verify and learn more.

Respond ONLY with valid JSON. No markdown fences, no preamble. Exactly this shape:
{"text": "the pastoral answer — either 2-4 sentences of prose, or a short lead-in sentence followed by a \\n-separated \"- item\" list per rule 6", "sources": [{"label": "e.g. Catechism of the Catholic Church, §XXX, or a person's name", "detail": "one sentence on what this source teaches, relevant to the question", "url": "optional — only include when explicitly given a URL to use in additional context below"}]}

Include 1-3 sources. At least one must be a primary source (Catechism paragraph, Scripture citation, or a Doctor of the Church).`;

// Static correction for a fact younger than most model training data.
// Update this whenever Pope Leo XIV issues a significant new document —
// check vatican.va periodically.
const CURRENT_POPE_CONTEXT = `

<current_pope>
The reigning pope is Leo XIV (born Robert Francis Prevost), elected May 8, 2025,
succeeding Pope Francis. He is the first American-born pope. He chose the name
Leo partly in honor of Leo XIII, who wrote the 1891 social encyclical Rerum
Novarum addressing the first industrial revolution.

Pope Leo XIV has spoken and written extensively on artificial intelligence:
- "Preserving Human Voices and Faces" (May 17, 2026) — his message for the
  World Day of Social Communications, on AI, deepfakes, and the sacredness of
  human faces and voices, warning against outsourcing the effort of thinking.
- "Magnifica Humanitas: On Safeguarding the Human Person in the Time of
  Artificial Intelligence" (May 25, 2026) — his first encyclical, warning AI
  must be "disarmed" and framing the challenge as anthropological rather than
  merely technological.

If asked about the pope or Catholic teaching on AI, reference these documents
accurately. Do not claim no Pope Leo XIV exists or that the most recent Leo
was Leo XIII — he is the current pope.
</current_pope>`;

const AGE_TONE = {
  "Middle School": "Use concrete language and short explanations for a middle-school student. Define theological words when you use them, but preserve the full Catholic teaching.",
  "High School": "Write for a high-school theology student: direct, clear, and conversational. Explain necessary terms without sounding preachy or condescending.",
  College: "Write for a college student. Be intellectually serious and concise, distinguish doctrine from theological opinion, and make the primary sources useful for further study.",
  OCIA: "Write for someone in OCIA who may be new to Catholic vocabulary. Explain terms plainly, connect the teaching to Christian life, and never assume prior formation.",
  Adult: "Warm, clear, thoughtful adult tone.",
};

const LANGUAGE_INSTRUCTION = {
  en: "Respond entirely in English.",
  es: "Respond entirely in Spanish (español). Both the \"text\" field and every source \"label\" and \"detail\" must be in Spanish — for example, cite the Catechism as \"Catecismo de la Iglesia Católica, §XXX\" rather than the English form. Still return valid JSON with the same field names (text, sources, label, detail) in English — only the VALUES are translated, not the JSON keys.",
};

// Set to true to re-enable the USCCB daily reading / feast day lookup.
// Currently off because bible.usccb.org fetches weren't reliably succeeding —
// see console.error logs in fetchTodaysReadingCitations if revisiting this.
const ENABLE_LITURGICAL_LOOKUP = false;

// Verified public-domain prayer texts only. The Nicene Creed and the Missal's
// Apostles' Creed are deliberately excluded — the current Mass wording (2011
// Roman Missal) is copyrighted by ICEL. These traditional prayer texts predate
// modern copyright and are safe to reproduce verbatim.
const PRAYERS = {
  ourFather: {
    name: "The Our Father (The Lord's Prayer)",
    aliases: ["our father", "lord's prayer", "lords prayer", "pater noster"],
    text: "Our Father, who art in heaven, hallowed be thy name. Thy kingdom come. Thy will be done, on earth as it is in heaven. Give us this day our daily bread, and forgive us our trespasses, as we forgive those who trespass against us. And lead us not into temptation, but deliver us from evil. Amen.",
  },
  hailMary: {
    name: "The Hail Mary",
    aliases: ["hail mary"],
    text: "Hail Mary, full of grace, the Lord is with thee. Blessed art thou among women, and blessed is the fruit of thy womb, Jesus. Holy Mary, Mother of God, pray for us sinners, now and at the hour of our death. Amen.",
  },
  gloryBe: {
    name: "The Glory Be (Doxology)",
    aliases: ["glory be", "gloria patri"],
    text: "Glory be to the Father, and to the Son, and to the Holy Spirit. As it was in the beginning, is now, and ever shall be, world without end. Amen.",
  },
  apostlesCreed: {
    name: "The Apostles' Creed (traditional text)",
    aliases: ["apostles' creed", "apostles creed"],
    text: "I believe in God, the Father almighty, Creator of heaven and earth; and in Jesus Christ, His only Son, our Lord, who was conceived by the Holy Spirit, born of the Virgin Mary, suffered under Pontius Pilate, was crucified, died, and was buried. He descended into hell; on the third day He rose again from the dead. He ascended into heaven, and is seated at the right hand of God the Father almighty. From there He will come to judge the living and the dead. I believe in the Holy Spirit, the holy Catholic Church, the communion of saints, the forgiveness of sins, the resurrection of the body, and life everlasting. Amen.",
  },
  memorare: {
    name: "The Memorare",
    aliases: ["memorare"],
    text: "Remember, O most gracious Virgin Mary, that never was it known that anyone who fled to thy protection, implored thy help, or sought thy intercession, was left unaided. Inspired by this confidence, I fly unto thee, O Virgin of virgins, my Mother. To thee do I come, before thee I stand, sinful and sorrowful. O Mother of the Word Incarnate, despise not my petitions, but in thy mercy hear and answer me. Amen.",
  },
  actOfContrition: {
    name: "Act of Contrition",
    aliases: ["act of contrition"],
    text: "O my God, I am heartily sorry for having offended Thee, and I detest all my sins, because of Thy just punishments, but most of all because they offend Thee, my God, who art all good and deserving of all my love. I firmly resolve, with the help of Thy grace, to sin no more and to avoid the near occasions of sin. Amen.",
  },
  guardianAngel: {
    name: "Guardian Angel Prayer",
    aliases: ["guardian angel prayer", "angel of god"],
    text: "Angel of God, my guardian dear, to whom God's love commits me here, ever this day be at my side, to light and guard, to rule and guide. Amen.",
  },
  angelus: {
    name: "The Angelus",
    aliases: ["angelus"],
    text: "V. The Angel of the Lord declared unto Mary,\nR. And she conceived of the Holy Spirit.\nHail Mary...\n\nV. Behold the handmaid of the Lord,\nR. Be it done unto me according to thy word.\nHail Mary...\n\nV. And the Word was made flesh,\nR. And dwelt among us.\nHail Mary...\n\nV. Pray for us, O holy Mother of God,\nR. That we may be made worthy of the promises of Christ.\n\nLet us pray: Pour forth, we beseech Thee, O Lord, Thy grace into our hearts, that we, to whom the Incarnation of Christ, Thy Son, was made known by the message of an angel, may by His Passion and Cross be brought to the glory of His Resurrection. Through the same Christ our Lord. Amen.",
  },
  hailHolyQueen: {
    name: "Hail, Holy Queen (Salve Regina)",
    aliases: ["hail holy queen", "salve regina"],
    text: "Hail, holy Queen, Mother of mercy, our life, our sweetness, and our hope. To thee do we cry, poor banished children of Eve. To thee do we send up our sighs, mourning and weeping in this valley of tears. Turn then, most gracious advocate, thine eyes of mercy toward us, and after this our exile show unto us the blessed fruit of thy womb, Jesus. O clement, O loving, O sweet Virgin Mary. Pray for us, O holy Mother of God, that we may be made worthy of the promises of Christ. Amen.",
  },
  fatimaPrayer: {
    name: "The Fatima Prayer (O My Jesus)",
    aliases: ["fatima prayer", "o my jesus", "decade prayer"],
    text: "O my Jesus, forgive us our sins, save us from the fires of hell, lead all souls to Heaven, especially those who have most need of Thy mercy. Amen.",
  },
  stMichael: {
    name: "Prayer to St. Michael the Archangel",
    aliases: ["st michael prayer", "saint michael prayer", "prayer to st michael", "prayer to saint michael", "st. michael prayer"],
    text: "Saint Michael the Archangel, defend us in battle. Be our protection against the wickedness and snares of the devil. May God rebuke him, we humbly pray, and do thou, O Prince of the heavenly host, by the power of God, cast into hell Satan and all the evil spirits who prowl about the world seeking the ruin of souls. Amen.",
  },
  graceBeforeMeals: {
    name: "Grace Before Meals",
    aliases: ["grace before meals", "table grace", "meal prayer", "grace before eating"],
    text: "Bless us, O Lord, and these Thy gifts, which we are about to receive from Thy bounty, through Christ our Lord. Amen.",
  },
  eternalRest: {
    name: "Eternal Rest (Prayer for the Dead)",
    aliases: ["eternal rest", "prayer for the dead"],
    text: "Eternal rest grant unto them, O Lord, and let perpetual light shine upon them. May they rest in peace. Amen.",
  },
};

function findMatchedPrayer(question) {
  const lower = question.toLowerCase();
  for (const key of Object.keys(PRAYERS)) {
    const prayer = PRAYERS[key];
    if (prayer.aliases.some((alias) => lower.includes(alias))) {
      return prayer;
    }
  }
  return null;
}

const NICENE_CREED_PATTERN = /nicene creed/i;

const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 8;
const buckets = new Map();

// Cap how much prior conversation gets replayed to the model each turn —
// keeps token usage/cost bounded as a conversation grows long.
const MAX_HISTORY_MESSAGES = 6; // 3 question/answer exchanges
const MAX_HISTORY_CHARS_PER_MESSAGE = 2000;

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

export function parseModelResponse(raw) {
  if (typeof raw !== "string" || !raw.trim()) return null;
  const cleaned = raw.replace(/```json/gi, "").replace(/```/g, "").trim();
  const candidates = [cleaned];
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start !== -1 && end > start) candidates.push(cleaned.slice(start, end + 1));

  for (const candidate of candidates) {
    try {
      const parsed = JSON.parse(candidate);
      if (parsed && typeof parsed.text === "string" && parsed.text.trim()) {
        return {
          text: parsed.text.trim(),
          sources: Array.isArray(parsed.sources)
            ? parsed.sources
                .filter((source) => source && typeof source.label === "string" && typeof source.detail === "string")
                .slice(0, 3)
            : [],
        };
      }
    } catch {
      // Try the next candidate; an incomplete object is retried upstream.
    }
  }
  return null;
}

async function requestModel({ apiMessages, systemContext, maxTokens }) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 40000);
  try {
    const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: process.env.MODEL_ID || "claude-sonnet-5",
        max_tokens: maxTokens,
        thinking: { type: "disabled" },
        system: [
          {
            type: "text",
            text: `${SYSTEM_PROMPT}${CURRENT_POPE_CONTEXT}`,
            cache_control: { type: "ephemeral" },
          },
          { type: "text", text: systemContext },
        ],
        messages: apiMessages,
      }),
      signal: controller.signal,
    });

    if (!anthropicRes.ok) {
      const detail = await anthropicRes.text();
      console.error("Anthropic error:", anthropicRes.status, detail.slice(0, 500));
      const error = new Error("Model request failed");
      error.status = anthropicRes.status;
      throw error;
    }
    return anthropicRes.json();
  } finally {
    clearTimeout(timeout);
  }
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
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

  const { question, ageBand, language, todayDate, history } = req.body || {};

  if (!question || typeof question !== "string") {
    return res.status(400).json({ error: "Missing question" });
  }

  const cleanQuestion = question.trim();
  if (!cleanQuestion) {
    return res.status(400).json({ error: "Missing question" });
  }

  if (cleanQuestion.length > 1000) {
    return res.status(400).json({ error: "Question is too long." });
  }

  const tone = AGE_TONE[ageBand] || AGE_TONE.Adult;
  const safeLanguage = language === "es" ? "es" : "en";
  const safeTodayDate = /^\d{4}-\d{2}-\d{2}$/.test(todayDate || "") ? todayDate : null;
  const languageInstruction =
    LANGUAGE_INSTRUCTION[safeLanguage];

  const currentDateContext = safeTodayDate
    ? `\n\nTODAY'S DATE: ${safeTodayDate} (YYYY-MM-DD). If the person asks something involving today's date, someone's current age, or how long ago something happened, calculate the answer yourself using this date and state it directly — never say "do the math" or leave it to the person to figure out.`
    : "";

  let readingContext = "";
  if (ENABLE_LITURGICAL_LOOKUP && (isDailyReadingQuestion(cleanQuestion) || isFeastDayQuestion(cleanQuestion))) {
    const { isoDate: targetIso, dayLabel } = resolveTargetDate(cleanQuestion, safeTodayDate);
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

  let prayerContext = "";
  const matchedPrayer = findMatchedPrayer(cleanQuestion);
  if (matchedPrayer) {
    prayerContext = `\n\n=== PRAYER REQUEST — READ CAREFULLY, THIS CHANGES YOUR OUTPUT FORMAT ===
The person asked for the text of a specific prayer: "${matchedPrayer.name}". You must reproduce it in FULL, WORD FOR WORD, with NOTHING cut, shortened, summarized, or paraphrased. This is not optional and it overrides rule 6 (the 2-4 sentence limit) — rule 6 does NOT apply to this response.

The exact text to reproduce is between the triple quotes below. Copy it EXACTLY, character for character, including all punctuation:
"""
${matchedPrayer.text}
"""

Your "text" field must be built as exactly these three parts concatenated:
1. One short warm sentence naming the prayer (e.g. "Here is the ${matchedPrayer.name}:")
2. The ENTIRE prayer text above, copied verbatim with no omissions — every sentence, every word
3. Optionally, one brief closing sentence after the prayer (not required)

Do NOT summarize the prayer. Do NOT describe what it says instead of giving the text. Do NOT truncate it partway through. If you are unsure whether you have room, prioritize the full prayer text over the closing sentence — cut the closing sentence first, never the prayer itself.

Include exactly one source with "label": "${matchedPrayer.name}", and "detail" describing its traditional use or origin in one sentence.
=== END PRAYER REQUEST INSTRUCTIONS ===`;
  } else if (NICENE_CREED_PATTERN.test(cleanQuestion)) {
    prayerContext = `\n\nNOTE: The person is asking for the text of the Nicene Creed. The current English wording used at Mass (the 2011 Roman Missal translation, e.g. "consubstantial with the Father," "was incarnate of the Virgin Mary") is copyrighted by ICEL and cannot be reproduced. Do NOT provide any wording of the Creed, full or partial, and do NOT substitute an older translation as if it were the current one. Instead, explain this honestly and warmly, and suggest they check their parish missal, worship aid, or usccb.org for the exact current text. You may briefly describe in your own words what the Creed affirms as a summary of belief, without quoting any translation.`;
  }

  const maxTokens = matchedPrayer ? 1500 : 2000;

  const safeHistory = Array.isArray(history) ? history.slice(-MAX_HISTORY_MESSAGES) : [];
  const apiMessages = [];
  for (const turn of safeHistory) {
    if (!turn || typeof turn.text !== "string") continue;
    const historyText = turn.text.slice(0, MAX_HISTORY_CHARS_PER_MESSAGE);
    if (turn.role === "user") {
      apiMessages.push({ role: "user", content: historyText });
    } else if (turn.role === "companion") {
      // Reconstruct exactly what the model previously produced (JSON shape)
      // so the conversation it sees matches what it actually said.
      apiMessages.push({
        role: "assistant",
        content: JSON.stringify({
          text: historyText,
          sources: Array.isArray(turn.sources)
            ? turn.sources.slice(0, 3).map((source) => ({
                label: String(source?.label || "").slice(0, 200),
                detail: String(source?.detail || "").slice(0, 500),
              }))
            : [],
        }),
      });
    }
  }
  apiMessages.push({ role: "user", content: cleanQuestion });

  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error("ANTHROPIC_API_KEY is not configured");
      return res.status(503).json({ error: "Restless is unavailable right now." });
    }

    const baseSystemContext = `${currentDateContext}\n\nAudience tone for this response: ${tone}\n\n${languageInstruction}${readingContext}${prayerContext}`;
    let data = await requestModel({ apiMessages, systemContext: baseSystemContext, maxTokens });

    if (data.usage) {
      console.log(
        "Cache usage — read:",
        data.usage.cache_read_input_tokens || 0,
        "created:",
        data.usage.cache_creation_input_tokens || 0,
        "uncached:",
        data.usage.input_tokens || 0
      );
    }

    let raw = (data.content || [])
      .map((block) => (block.type === "text" ? block.text : ""))
      .join("");
    let parsed = parseModelResponse(raw);

    if (!parsed || data.stop_reason === "max_tokens") {
      console.error("Incomplete model response; retrying once:", raw.slice(0, 300));
      data = await requestModel({
        apiMessages,
        systemContext: `${baseSystemContext}\n\nRETRY REQUIREMENT: Your previous response was incomplete or invalid. Return a shorter, complete JSON object with all braces and quotes closed.`,
        maxTokens,
      });
      raw = (data.content || [])
        .map((block) => (block.type === "text" ? block.text : ""))
        .join("");
      parsed = parseModelResponse(raw);
    }

    if (!parsed) {
      console.error("Model returned malformed JSON twice:", raw.slice(0, 300));
      return res.status(502).json({ error: "The answer was incomplete. Please try again." });
    }

    return res.status(200).json(parsed);
  } catch (err) {
    console.error("Handler error:", err);
    const timedOut = err && err.name === "AbortError";
    return res.status(timedOut ? 504 : 502).json({
      error: timedOut ? "The answer took too long. Please try again." : "Restless is unavailable right now.",
    });
  }
}
