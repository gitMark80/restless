const USCCB_CATECHISM_BASE = "https://www.usccb.org/sites/default/files/flipbooks/catechism";

// Known paragraph-to-page anchors from the USCCB online Catechism. Interpolation
// gets us very close; the resolver then checks nearby pages for the exact paragraph.
const PAGE_ANCHORS = [
  [1, 9],
  [17, 12],
  [1374, 348],
  [1397, 355],
  [1701, 426],
  [2267, 548],
  [2865, 690],
];

const resolvedPages = new Map();

export function estimateCatechismPage(paragraph) {
  const n = Number(paragraph);
  if (!Number.isFinite(n)) return 9;
  if (n <= PAGE_ANCHORS[0][0]) return PAGE_ANCHORS[0][1];
  if (n >= PAGE_ANCHORS[PAGE_ANCHORS.length - 1][0]) {
    return PAGE_ANCHORS[PAGE_ANCHORS.length - 1][1];
  }

  for (let i = 1; i < PAGE_ANCHORS.length; i += 1) {
    const [rightParagraph, rightPage] = PAGE_ANCHORS[i];
    const [leftParagraph, leftPage] = PAGE_ANCHORS[i - 1];
    if (n <= rightParagraph) {
      const ratio = (n - leftParagraph) / (rightParagraph - leftParagraph);
      return Math.round(leftPage + ratio * (rightPage - leftPage));
    }
  }
  return 9;
}

function decodeHtml(value) {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&ldquo;|&rdquo;/gi, '"')
    .replace(/&lsquo;|&rsquo;/gi, "'");
}

export function pageHasParagraph(html, paragraph) {
  if (typeof html !== "string") return false;
  const text = decodeHtml(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
  )
    .replace(/\s+/g, " ")
    .trim();

  // Main Catechism paragraphs appear as a paragraph number followed by prose.
  // Requiring prose after the number avoids most footnote/index cross-reference matches.
  const pattern = new RegExp(`(?:^|\\s)${paragraph}\\s+(?:[A-ZÀ-ÖØ-Þ“\"'¿¡])`);
  return pattern.test(text);
}

async function fetchPage(page) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3500);
  try {
    const response = await fetch(`${USCCB_CATECHISM_BASE}/${page}/`, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });
    if (!response.ok) return null;
    return response.text();
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

async function findExactPage(paragraph) {
  if (resolvedPages.has(paragraph)) return resolvedPages.get(paragraph);

  const estimate = estimateCatechismPage(paragraph);
  const groups = [
    [0, -1, 1, -2, 2],
    [-3, 3, -4, 4, -5, 5, -6, 6],
    [-7, 7, -8, 8, -9, 9, -10, 10, -11, 11, -12, 12],
  ];
  const checked = new Set();

  for (const offsets of groups) {
    const pages = offsets
      .map((offset) => estimate + offset)
      .filter((page) => page >= 9 && page <= 690 && !checked.has(page));
    pages.forEach((page) => checked.add(page));

    const results = await Promise.all(
      pages.map(async (page) => ({ page, html: await fetchPage(page) }))
    );
    const found = results.find(
      ({ html }) => html && pageHasParagraph(html, paragraph)
    );
    if (found) {
      resolvedPages.set(paragraph, found.page);
      return found.page;
    }
  }

  // If USCCB temporarily blocks the lookup, the estimate is still much closer
  // than sending the reader to the Catechism home page.
  return estimate;
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).send("Method not allowed");
  }

  const paragraph = Number(req.query?.ccc);
  if (!Number.isInteger(paragraph) || paragraph < 1 || paragraph > 2865) {
    return res.status(400).send("Invalid Catechism paragraph");
  }

  const page = await findExactPage(paragraph);
  const target = `${USCCB_CATECHISM_BASE}/${page}/#zoom=z`;
  res.setHeader("Cache-Control", "public, max-age=86400, s-maxage=604800");
  res.setHeader("Location", target);
  return res.status(302).end();
}
