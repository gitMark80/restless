// Builds the crawlable pages of restless.faith as static HTML:
//   /questions            hub of answered questions
//   /questions/<slug>     one page per topic in content/topics.js
//   /books                Books & Journals (src/books.js)
//   /privacy              short privacy note
//   /404.html             friendly not-found page
//   /sitemap.xml
// Called by the Vite plugin in vite.config.js on every build. Pages share
// public/site.css and public/rf.js and need no JavaScript to read.

import { TOPICS, TOPIC_BY_SLUG, SITE, topicUrl } from "../content/topics.js";
import { BOOKS, JOURNALS, RECOMMENDED, BOOKS_TEXT, bookUrl } from "../src/books.js";

const ALL_BOOKS = [...BOOKS, ...JOURNALS, ...RECOMMENDED];
const BOOK_BY_ID = Object.fromEntries(ALL_BOOKS.map((b) => [b.id, b]));
const OWN_IDS = new Set([...BOOKS, ...JOURNALS].map((b) => b.id));
const UPDATED = "2026-10-23";
const ASSET_VERSION = "2"; // bump to bust caches of site.css / rf.js

// --- text helpers -------------------------------------------------------------

export function esc(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// USCCB Bible URLs use these book slugs.
const BIBLE_SLUGS = {
  Genesis: "genesis", Deuteronomy: "deuteronomy", Isaiah: "isaiah", Malachi: "malachi", Psalm: "psalms",
  Matthew: "matthew", Mark: "mark", Luke: "luke", John: "john", Acts: "acts", Romans: "romans",
  "1 Corinthians": "1corinthians", "2 Corinthians": "2corinthians", Galatians: "galatians", Ephesians: "ephesians",
  "1 Timothy": "1timothy", "2 Thessalonians": "2thessalonians", Hebrews: "hebrews", James: "james",
  "1 Peter": "1peter", Revelation: "revelation",
};
const SCRIPTURE_REF = /^((?:\d )?[A-Z][a-z]+) (\d+)(?::(\d+)(?:-(\d+))?)?$/;

export function parseRef(ref) {
  const ccc = /^CCC (\d{1,4})$/.exec(ref);
  if (ccc) {
    const n = Number(ccc[1]);
    if (n < 1 || n > 2865) return null;
    return { kind: "ccc", label: `Catechism ${n}`, long: `Catechism of the Catholic Church, §${n}`, href: `/api/source?ccc=${n}`, sort: n };
  }
  const m = SCRIPTURE_REF.exec(ref);
  if (!m || !BIBLE_SLUGS[m[1]]) return null;
  const [, book, chapter, verse] = m;
  const href = `https://bible.usccb.org/bible/${BIBLE_SLUGS[book]}/${chapter}${verse ? `?${verse}=` : ""}`;
  return { kind: "bible", label: ref.replace("-", "–"), long: ref.replace("-", "–"), href };
}

function refsIn(text) {
  return [...String(text).matchAll(/\[\[([^\]]+)\]\]/g)].map((m) => m[1]);
}

// Inline markup → HTML: [[ref]], **bold**, [label](@slug | /path | https://…)
export function inline(text) {
  let html = esc(text);
  html = html.replace(/\[\[([^\]]+)\]\]/g, (whole, ref) => {
    const r = parseRef(ref);
    if (!r) throw new Error(`Bad citation: ${ref}`);
    const rel = r.kind === "ccc" ? "noopener nofollow" : "noopener";
    return `<a class="cite" href="${esc(r.href)}" target="_blank" rel="${rel}">${esc(r.label)}</a>`;
  });
  html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (whole, label, target) => {
    if (target.startsWith("@")) {
      const topic = TOPIC_BY_SLUG[target.slice(1)];
      if (!topic) throw new Error(`Unknown topic link: ${target}`);
      return `<a href="${topicUrl(topic)}" data-rf-related="${esc(topic.short)}">${label}</a>`;
    }
    const external = /^https?:/.test(target);
    return `<a href="${esc(target)}"${external ? ' target="_blank" rel="noopener"' : ""}>${label}</a>`;
  });
  return html;
}

function blockHtml(block) {
  if (block.h) return `<h2>${inline(block.h)}</h2>`;
  if (block.p) return `<p>${inline(block.p)}</p>`;
  if (block.ul) return `<ul>${block.ul.map((i) => `<li>${inline(i)}</li>`).join("")}</ul>`;
  if (block.ol) return `<ol>${block.ol.map((i) => `<li>${inline(i)}</li>`).join("")}</ol>`;
  if (block.table) {
    const { head, rows } = block.table;
    return `<div class="table-wrap" role="region" aria-label="${esc(head[0])}" tabindex="0"><table><thead><tr>${head
      .map((h) => `<th scope="col">${esc(h)}</th>`)
      .join("")}</tr></thead><tbody>${rows
      .map((row) => `<tr>${row.map((cell, i) => (i === 0 ? `<th scope="row">${inline(cell)}</th>` : `<td>${inline(cell)}</td>`)).join("")}</tr>`)
      .join("")}</tbody></table></div>`;
  }
  throw new Error(`Unknown block: ${JSON.stringify(block).slice(0, 80)}`);
}

export function topicText(topic) {
  return [topic.answer, ...topic.body.flatMap((b) => b.p ? [b.p] : b.h ? [b.h] : b.ul || b.ol || (b.table ? b.table.rows.flat() : []))];
}

export function topicSources(topic) {
  const seen = new Set();
  const bible = [];
  const ccc = [];
  for (const text of topicText(topic)) {
    for (const ref of refsIn(text)) {
      if (seen.has(ref)) continue;
      seen.add(ref);
      const r = parseRef(ref);
      if (!r) throw new Error(`Bad citation in ${topic.slug}: ${ref}`);
      (r.kind === "ccc" ? ccc : bible).push(r);
    }
  }
  ccc.sort((a, b) => a.sort - b.sort);
  return { bible, ccc };
}

export function askHref(question, from) {
  const params = new URLSearchParams();
  if (question) params.set("q", question);
  if (from) params.set("from", from);
  const query = params.toString();
  return query ? `/?${query}` : "/";
}

// --- layout -----------------------------------------------------------------

const ICON = `<svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">`;
const ICONS = {
  send: `${ICON}<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>`,
  book: `${ICON}<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`,
  moon: `${ICON}<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`,
  arrow: `${ICON}<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>`,
};

function head({ title, description, path, type = "website", jsonLd = [], noindex = false }) {
  const url = `${SITE}${path}`;
  return `<!doctype html>
<html lang="en" data-theme="dark">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
${noindex ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="${esc(url)}">`}
<meta name="theme-color" content="#08192a">
<meta property="og:site_name" content="Restless.faith">
<meta property="og:type" content="${type}">
<meta property="og:url" content="${esc(url)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:image" content="${SITE}/social-card.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Restless.faith — Catholic answers for modern questions">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${SITE}/social-card.png">
<link rel="icon" type="image/png" sizes="32x32" href="/brand/icon-32.png">
<link rel="apple-touch-icon" href="/brand/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<link rel="stylesheet" href="/site.css?v=${ASSET_VERSION}">
<script>try{var t=localStorage.getItem("restless-theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}</script>
${jsonLd.map((data) => `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>`).join("\n")}
<script defer src="/rf.js?v=${ASSET_VERSION}"></script>
<script defer src="/_vercel/insights/script.js"></script>
</head>`;
}

function siteHeader() {
  return `<header class="site-header">
  <div class="wrap header-row">
    <a class="brand" href="/" aria-label="Restless.faith home"><span class="mark" aria-hidden="true">R.</span><span class="word">Restless<span>.faith</span></span></a>
    <nav class="header-nav" aria-label="Main">
      <a href="/questions">Questions</a>
      <a href="/books">Books</a>
      <button type="button" class="theme-toggle" aria-label="Switch light or dark mode" onclick="(function(){var r=document.documentElement,n=r.dataset.theme==='light'?'dark':'light';r.dataset.theme=n;try{localStorage.setItem('restless-theme',n)}catch(e){}})()">${ICONS.moon}</button>
      <a class="btn btn-small" href="/">${ICONS.send}<span>Ask</span></a>
    </nav>
  </div>
</header>`;
}

function newsletterBox(where) {
  return `<section class="card newsletter" data-rf-newsletter-box hidden aria-labelledby="nl-${where}">
  <h2 id="nl-${where}">Grow deeper in your Catholic faith</h2>
  <p>Receive thoughtful answers, reflections, and new resources from Restless.faith.</p>
  <form data-rf-newsletter="${where}" novalidate>
    <label class="sr-only" for="email-${where}">Email address</label>
    <div class="nl-row">
      <input id="email-${where}" type="email" name="email" autocomplete="email" inputmode="email" placeholder="you@example.com" required>
      <button class="btn" type="submit">Sign up</button>
    </div>
    <label class="consent"><input type="checkbox" name="consent" required> Yes, email me from Restless.faith. I can unsubscribe at any time.</label>
    <input class="hp" type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">
    <p class="fine">We'll email you a confirmation link first. Every email has an unsubscribe link. See our <a href="/privacy">privacy note</a>.</p>
    <p class="status" data-rf-status role="status" aria-live="polite"></p>
  </form>
</section>`;
}

function siteFooter() {
  return `<footer class="site-footer">
  <div class="wrap">
    <nav aria-label="Footer">
      <a href="/">Ask a question</a>
      <a href="/questions">All questions</a>
      <a href="/books">Books &amp; journals</a>
      <a href="mailto:hello@restless.faith">Contact</a>
      <a href="/privacy">Privacy</a>
    </nav>
    <p>Restless.faith is a companion for questions, not a replacement for a priest, teacher or counselor. Always check the sources.</p>
    <p>As an Amazon Associate, Restless Faith Media earns from qualifying purchases.</p>
    <p>© ${UPDATED.slice(0, 4)} Restless Faith Media LLC</p>
  </div>
</footer>`;
}

function page({ headHtml, main, bodyClass = "", pageKey = "", noCount = false }) {
  return `${headHtml}
<body class="${bodyClass}"${pageKey ? ` data-rf-page="${esc(pageKey)}"` : ""}${noCount ? " data-rf-nocount" : ""}>
<a class="skip" href="#main">Skip to content</a>
${siteHeader()}
<main id="main" class="wrap">
${main}
</main>
${siteFooter()}
</body>
</html>
`;
}

const ORG = {
  "@type": "Organization",
  "@id": `${SITE}/#org`,
  name: "Restless Faith Media",
  url: SITE,
  logo: `${SITE}/brand/icon-512.png`,
  sameAs: ["https://www.youtube.com/@restlessfaithmedia"],
};

function breadcrumbs(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({ "@type": "ListItem", position: i + 1, name: item.name, item: `${SITE}${item.path}` })),
  };
}

function crumbsHtml(items) {
  return `<nav class="crumbs" aria-label="Breadcrumb"><ol>${items
    .map((item, i) => (i === items.length - 1 ? `<li aria-current="page">${esc(item.name)}</li>` : `<li><a href="${item.path}">${esc(item.name)}</a></li>`))
    .join("")}</ol></nav>`;
}

// --- book card --------------------------------------------------------------

function bookCard(book, { compact = false, from = "" } = {}) {
  const own = OWN_IDS.has(book.id);
  const related = TOPICS.filter((t) => t.books.includes(book.id));
  return `<article class="book${compact ? " book-compact" : ""}" id="book-${esc(book.id)}">
  <img src="${esc(book.cover)}" alt="Cover of ${esc(book.title)}" width="120" height="193" loading="lazy" decoding="async">
  <div class="book-body">
    ${own ? "" : `<p class="eyebrow">Recommended · not ours</p>`}
    <h3>${esc(book.title)}</h3>
    ${book.subtitle ? `<p class="subtitle">${esc(book.subtitle)}</p>` : ""}
    ${book.author ? `<p class="byline">${esc(book.author)}</p>` : own ? `<p class="byline">M. B. Reston · Restless Faith Media</p>` : ""}
    <p class="for"><strong>Who it's for:</strong> ${esc(book.tagline.en)}</p>
    ${
      !compact && related.length
        ? `<p class="book-topics">Related: ${related.map((t) => `<a href="${topicUrl(t)}">${esc(t.label)}</a>`).join(" · ")}</p>`
        : ""
    }
    <a class="btn btn-amazon" href="${esc(bookUrl(book))}" target="_blank" rel="sponsored nofollow noopener" data-rf-book="${esc(book.id)}"${from ? ` data-rf-from="${esc(from)}"` : ""}>View on Amazon ${ICONS.arrow}</a>
  </div>
</article>`;
}

function bookJsonLd(book) {
  const own = OWN_IDS.has(book.id);
  return {
    "@type": "Book",
    name: book.subtitle ? `${book.title}: ${book.subtitle}` : book.title,
    image: `${SITE}${book.cover}`,
    url: book.url,
    description: book.tagline.en,
    ...(own
      ? { author: { "@type": "Person", name: "M. B. Reston" }, publisher: { "@id": `${SITE}/#org` } }
      : book.author
        ? { author: { "@type": "Person", name: book.author.split("·")[0].trim() } }
        : {}),
    inLanguage: "en",
  };
}

// --- pages ------------------------------------------------------------------

export function renderTopic(topic) {
  const path = topicUrl(topic);
  const { bible, ccc } = topicSources(topic);
  const related = topic.related.map((slug) => {
    const t = TOPIC_BY_SLUG[slug];
    if (!t) throw new Error(`${topic.slug}: unknown related topic ${slug}`);
    return t;
  });
  const books = topic.books.map((id) => {
    const b = BOOK_BY_ID[id];
    if (!b) throw new Error(`${topic.slug}: unknown book ${id}`);
    return b;
  });
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Questions", path: "/questions" },
    { name: topic.label, path },
  ];
  const plainAnswer = topic.answer.replace(/\s*\[\[[^\]]+\]\]/g, "");
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: topic.question,
      description: topic.description,
      abstract: plainAnswer,
      image: `${SITE}/social-card.png`,
      datePublished: UPDATED,
      dateModified: UPDATED,
      inLanguage: "en",
      mainEntityOfPage: `${SITE}${path}`,
      author: ORG,
      publisher: ORG,
      about: { "@type": "Thing", name: topic.label },
      citation: ccc.map((c) => c.long).concat(bible.map((b) => b.long)).slice(0, 40),
    },
    breadcrumbs(crumbs),
  ];

  const main = `${crumbsHtml(crumbs)}
<article class="topic">
  <header class="topic-head">
    <p class="eyebrow">A Catholic answer</p>
    <h1>${esc(topic.question)}</h1>
    <p class="meta">Grounded in Scripture and the Catechism · ${bible.length + ccc.length} sources · Updated ${new Date(UPDATED).toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" })}</p>
  </header>

  <section class="card answer" aria-labelledby="short-answer">
    <h2 id="short-answer">The short answer</h2>
    <p>${inline(topic.answer)}</p>
    <p class="answer-cta"><a href="${esc(askHref("", topic.short))}" data-rf-ask="${esc(topic.short)}">Have a follow-up? Ask Restless ${ICONS.arrow}</a></p>
  </section>

  <div class="prose">
    ${topic.body.map(blockHtml).join("\n    ")}
  </div>

  <section class="card ask" aria-labelledby="ask-title">
    <h2 id="ask-title">Still have a question?</h2>
    <p>Ask Restless anything about this. You'll get a clear answer with the Scripture and Catechism sources to check it.</p>
    <ul class="ask-list">
      ${topic.followUps
        .map((q) => `<li><a href="${esc(askHref(q, topic.short))}" data-rf-ask="${esc(topic.short)}">${esc(q)} ${ICONS.arrow}</a></li>`)
        .join("\n      ")}
    </ul>
    <a class="btn" href="${esc(askHref("", topic.short))}" data-rf-ask="${esc(topic.short)}">${ICONS.send} Ask your own question</a>
  </section>

  <section aria-labelledby="related-title">
    <h2 id="related-title" class="section-title">Related questions</h2>
    <ul class="related">
      ${related
        .map(
          (t) => `<li><a class="card related-card" href="${topicUrl(t)}" data-rf-related="${esc(t.short)}"><span class="q">${esc(t.question)}</span><span class="d">${esc(t.description)}</span></a></li>`
        )
        .join("\n      ")}
    </ul>
    <p class="more"><a href="/questions">See all questions ${ICONS.arrow}</a></p>
  </section>

  <section class="sources" aria-labelledby="sources-title">
    <h2 id="sources-title" class="section-title">Sources</h2>
    <p class="fine">Scripture links open the New American Bible at the U.S. bishops' site. Catechism links open the paragraph in the USCCB's online Catechism.</p>
    <div class="source-cols">
      ${bible.length ? `<div><h3>Scripture</h3><ul>${bible.map((b) => `<li><a href="${esc(b.href)}" target="_blank" rel="noopener">${esc(b.long)}</a></li>`).join("")}</ul></div>` : ""}
      ${ccc.length ? `<div><h3>Catechism of the Catholic Church</h3><ul class="ccc">${ccc.map((c) => `<li><a href="${esc(c.href)}" target="_blank" rel="noopener nofollow">§${c.sort}</a></li>`).join("")}</ul></div>` : ""}
    </div>
  </section>

  <section class="go-deeper" aria-labelledby="books-title">
    <h2 id="books-title" class="section-title">Go deeper</h2>
    <p class="fine">Short books from Restless Faith Media on this question.</p>
    ${books.map((b) => bookCard(b, { compact: true, from: topic.short })).join("\n    ")}
    <p class="more"><a href="/books">All books &amp; journals ${ICONS.arrow}</a></p>
  </section>

  ${newsletterBox(`topic-${topic.short}`)}
</article>`;

  return page({
    headHtml: head({ title: `${topic.seoTitle}`, description: topic.description, path, type: "article", jsonLd }),
    main,
    bodyClass: "page-topic",
    pageKey: topic.short,
  });
}

export function renderHub() {
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Questions", path: "/questions" },
  ];
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Catholic questions, answered",
      url: `${SITE}/questions`,
      publisher: ORG,
      mainEntity: {
        "@type": "ItemList",
        itemListElement: TOPICS.map((t, i) => ({ "@type": "ListItem", position: i + 1, url: `${SITE}${topicUrl(t)}`, name: t.question })),
      },
    },
    breadcrumbs(crumbs),
  ];
  const main = `${crumbsHtml(crumbs)}
<header class="topic-head">
  <p class="eyebrow">Questions</p>
  <h1>Catholic questions, answered</h1>
  <p class="lede">Honest questions about the Catholic faith, with clear answers from Scripture and the Catechism, and the sources so you can check them yourself.</p>
</header>
<ul class="related hub">
  ${TOPICS.map(
    (t) => `<li><a class="card related-card" href="${topicUrl(t)}"><span class="q">${esc(t.question)}</span><span class="d">${esc(t.description)}</span></a></li>`
  ).join("\n  ")}
</ul>
<section class="card ask">
  <h2>Don't see your question?</h2>
  <p>Ask Restless. It answers in plain language and shows you where the answer comes from.</p>
  <a class="btn" href="/?from=questions" data-rf-ask="hub">${ICONS.send} Ask a question</a>
</section>
${newsletterBox("questions")}`;
  return page({
    headHtml: head({
      title: "Catholic Questions, Answered | Restless.faith",
      description: "Why Catholics pray to saints, believe in the Eucharist, confess to a priest and more. Clear answers with Scripture and Catechism sources.",
      path: "/questions",
      jsonLd,
    }),
    main,
    bodyClass: "page-hub",
    pageKey: "questions",
  });
}

export function renderBooks() {
  const t = BOOKS_TEXT.en;
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Books", path: "/books" },
  ];
  const guides = [...BOOKS].sort((a, b) => a.series - b.series);
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Books & Journals from Restless Faith Media",
      url: `${SITE}/books`,
      publisher: ORG,
      mainEntity: { "@type": "ItemList", itemListElement: [...guides, ...JOURNALS].map((b, i) => ({ "@type": "ListItem", position: i + 1, item: bookJsonLd(b) })) },
    },
    breadcrumbs(crumbs),
  ];
  const main = `${crumbsHtml(crumbs)}
<header class="topic-head">
  <p class="eyebrow">Books &amp; journals</p>
  <h1>Books &amp; Journals</h1>
  <p class="lede">Short, plain-language books and 90-day journals by M. B. Reston, from the makers of Restless.faith. Each one takes a question people keep asking and walks through it with Scripture and the Church.</p>
  <p class="fine">${esc(t.disclosure)}</p>
</header>
<section aria-labelledby="guides">
  <h2 id="guides" class="section-title">${esc(t.guidesTitle)}</h2>
  <p class="fine">${esc(t.guidesBody)}</p>
  <div class="shelf">
    ${guides.map((b) => bookCard(b, { from: "books" })).join("\n    ")}
  </div>
</section>
<section aria-labelledby="journals">
  <h2 id="journals" class="section-title">${esc(t.journalsTitle)}</h2>
  <p class="fine">${esc(t.journalsBody)}</p>
  <div class="shelf">
    ${JOURNALS.map((b) => bookCard(b, { from: "books" })).join("\n    ")}
  </div>
</section>
<section aria-labelledby="recommended">
  <h2 id="recommended" class="section-title">${esc(t.recommendedTitle)}</h2>
  <p class="fine">${esc(t.recommendedBody)}</p>
  <div class="shelf">
    ${RECOMMENDED.map((b) => bookCard(b, { from: "books" })).join("\n    ")}
  </div>
</section>
${newsletterBox("books")}`;
  return page({
    headHtml: head({
      title: "Catholic Books & Journals by M. B. Reston | Restless.faith",
      description: "Restless Faith Pocket Guides and 90-day Catholic journals by M. B. Reston: short books on confession, the Mass, Protestant questions and more.",
      path: "/books",
      jsonLd,
    }),
    main,
    bodyClass: "page-books",
    pageKey: "books",
  });
}

export function renderPrivacy() {
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Privacy", path: "/privacy" },
  ];
  const main = `${crumbsHtml(crumbs)}
<article class="topic">
  <header class="topic-head"><h1>Privacy</h1><p class="meta">Updated ${new Date(UPDATED).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" })}</p></header>
  <div class="prose">
    <p>Restless.faith is run by Restless Faith Media LLC. No account is needed to use it. In plain terms:</p>
    <h2>Your questions</h2>
    <p>When you ask a question, it is sent to our AI provider, Anthropic, to write the answer. Restless.faith does not save your questions in a database. Your current conversation is kept in your browser tab so it survives a refresh, and it disappears when you close the tab.</p>
    <h2>Analytics</h2>
    <p>We use Vercel Web Analytics, which does not use cookies, to count visits and a few actions such as questions asked, links opened and books viewed. We never send the text of your questions to analytics. Your browser stores two small values, where your first visit came from (for example "youtube") and how many visits you've made, so we can see in aggregate whether people come back. They aren't linked to your name or email. We also keep simple running totals of our own, such as "12 visits from YouTube today" or "3 Amazon clicks on this book", which contain nothing about who you are.</p>
    <h2>Newsletter</h2>
    <p>If you sign up, your email address is stored by our email provider, Kit, and used only to send Restless.faith emails. You'll get a confirmation email first, and every email has an unsubscribe link.</p>
    <h2>Amazon links</h2>
    <p>Book links go to Amazon. As an Amazon Associate, Restless Faith Media earns from qualifying purchases. Amazon's own privacy policy applies on its site.</p>
    <h2>Questions</h2>
    <p>Email <a href="mailto:hello@restless.faith">hello@restless.faith</a>.</p>
  </div>
</article>`;
  return page({
    headHtml: head({ title: "Privacy | Restless.faith", description: "How Restless.faith handles your questions, analytics, the newsletter and Amazon links.", path: "/privacy" }),
    main,
    bodyClass: "page-privacy",
    pageKey: "privacy",
  });
}

// Unlisted dashboard of the anonymous counters (api/stats.js). Not in the sitemap, noindex.
export function renderStats() {
  const meta = {
    topics: Object.fromEntries(TOPICS.map((t) => [t.short, { label: t.label, url: topicUrl(t) }])),
    pages: { home: "Ask (home)", questions: "Questions list", books: "Books page", privacy: "Privacy" },
    books: Object.fromEntries(ALL_BOOKS.map((b) => [b.id, { title: b.title, own: OWN_IDS.has(b.id) }])),
  };
  const main = `<header class="topic-head stats-head">
  <p class="eyebrow">Unlisted</p>
  <h1>Restless stats</h1>
  <p class="meta" id="updated">Loading…</p>
</header>
<div class="stats-tabs" role="tablist" aria-label="Time range">
  <button type="button" data-r="1">Today</button><button type="button" data-r="7" class="on">7 days</button><button type="button" data-r="30">30 days</button><button type="button" data-r="all">All time</button>
</div>
<div class="stat-tiles">
  <div class="card stat-tile"><b id="t-visits">–</b><span>visits</span></div>
  <div class="card stat-tile"><b id="t-answers">–</b><span>questions answered</span></div>
  <div class="card stat-tile"><b id="t-amazon">–</b><span>Amazon clicks</span></div>
  <div class="card stat-tile"><b id="t-return">–</b><span>returning visits</span></div>
  <div class="card stat-tile"><b id="t-multi">–</b><span>asked 2+ questions</span></div>
  <div class="card stat-tile"><b id="t-signup">–</b><span>newsletter signups</span></div>
</div>
<section class="card stats-card">
  <h2>Visits per day <small>last 30 days</small></h2>
  <div class="bars" id="c-visits"></div>
  <div class="axis"><span id="ax0"></span><span>today</span></div>
  <h2 class="mt">Questions answered per day</h2>
  <div class="bars bars-answers" id="c-answers"></div>
  <div class="axis"><span id="ax1"></span><span>today</span></div>
</section>
<section class="card stats-card">
  <h2>Where visitors come from</h2>
  <div class="stats-table" id="sources"><p class="fine">Loading…</p></div>
  <p class="fine">Source is where a person's <b>first</b> visit came from, so a YouTube viewer who comes back later still counts as YouTube. "Answers / visit" shows who actually uses Restless.</p>
</section>
<section class="card stats-card">
  <h2>Pages</h2>
  <div class="stats-table" id="pages"><p class="fine">Loading…</p></div>
  <p class="fine"><b>Views</b>: page opened (once per visit). <b>Clicked to</b>: a "Keep exploring" or related link that led here. <b>Ask clicks</b>: someone tapped a question or "Ask" on this page to go ask Restless.</p>
</section>
<section class="card stats-card">
  <h2>Books</h2>
  <div class="stats-table" id="books"><p class="fine">Loading…</p></div>
  <p class="fine">Amazon link clicks from answers, the Books shelf, the Books page and question pages. Amazon reports actual sales in your Associates account. <span id="shelf"></span></p>
</section>
<section class="card stats-card">
  <h2>More</h2>
  <p id="fails" class="fine"></p>
  <label class="consent"><input type="checkbox" id="nocount"> Don't count my visits on this device (turn this on on your own phone and computer)</label>
  <p class="fine">Vercel Analytics has page views, countries and devices: <a href="https://vercel.com/dashboard" target="_blank" rel="noopener">Vercel → restless → Analytics</a>. Google search clicks: <a href="https://search.google.com/search-console" target="_blank" rel="noopener">Search Console</a>.</p>
  <p class="fine">Everything here is an anonymous tally: no names, IDs, cookies, IP addresses or question text. Days run on UTC (they roll over at 7pm Central). Reel Studio recordings and this page aren't counted.</p>
</section>
<script>
const META = ${JSON.stringify(meta).replace(/</g, "\u003c")};
const SOURCE_NAMES = { youtube: "YouTube", facebook: "Facebook", instagram: "Instagram", tiktok: "TikTok", x: "X", reddit: "Reddit", google: "Google", bing: "Bing", search: "Other search", amazon: "Amazon", email: "Email", direct: "Direct / app", other: "Other" };
const $ = (id) => document.getElementById(id);
const fmt = (n) => Number(n || 0).toLocaleString();
const sum = (o) => Object.values(o || {}).reduce((a, b) => a + b, 0);
const short = (d) => new Date(d + "T12:00:00Z").toLocaleDateString([], { month: "short", day: "numeric" });
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
let data = null, range = "7";

function bars(el, vals) {
  const max = Math.max(1, ...vals);
  el.innerHTML = vals.map((v, i) => \`<div style="height:\${Math.max(2, (v / max) * 100)}%"\${i === vals.length - 1 ? ' class="today"' : ""} title="\${v}"></div>\`).join("");
}
function table(el, head, rows, empty) {
  if (!rows.length) { el.innerHTML = \`<p class="fine">\${empty}</p>\`; return; }
  el.innerHTML = \`<table><thead><tr>\${head.map((h, i) => \`<th\${i ? "" : ' class="l"'}>\${h}</th>\`).join("")}</tr></thead><tbody>\${rows
    .map((r) => \`<tr>\${r.map((c, i) => (i ? \`<td\${c === 0 || c === "0" || c === "–" ? ' class="z"' : ""}>\${typeof c === "number" ? fmt(c) : c}</td>\` : \`<td class="l">\${c}</td>\`)).join("")}</tr>\`)
    .join("")}</tbody></table>\`;
}

function render() {
  const R = data.ranges[range] || {};
  const g = (e) => R[e] || {};
  $("t-visits").textContent = fmt(sum(g("visit")));
  $("t-answers").textContent = fmt(sum(g("answer")));
  $("t-amazon").textContent = fmt(sum(g("amazon")));
  $("t-return").textContent = fmt(sum(g("return")));
  $("t-multi").textContent = fmt(sum(g("multi")));
  $("t-signup").textContent = fmt(sum(g("signup")));

  const srcs = Object.keys(SOURCE_NAMES)
    .map((s) => {
      const v = g("visit")[s] || 0, a = g("answer")[s] || 0;
      return { s, row: [SOURCE_NAMES[s], v, g("return")[s] || 0, g("ask")[s] || 0, a, v ? (a / v).toFixed(1) : "–", g("multi")[s] || 0, g("amazon_src")[s] || 0, g("signup")[s] || 0], v, a };
    })
    .filter((x) => x.row.slice(1).some((c) => c && c !== "–"))
    .sort((x, y) => y.v - x.v || y.a - x.a);
  table($("sources"), ["Source", "Visits", "Returning", "Asked", "Answers", "Answers / visit", "2+ questions", "Amazon", "Signups"], srcs.map((x) => x.row), "Nothing counted yet for this range.");

  const pageKeys = ["home", ...Object.keys(META.topics), "questions", "books", "privacy"];
  const pages = pageKeys
    .map((k) => {
      const t = META.topics[k];
      const name = t ? \`<a href="\${t.url}">\${esc(t.label)}</a>\` : esc(META.pages[k] || k);
      return { views: g("page")[k] || 0, row: [name, g("page")[k] || 0, t ? g("related")[k] || 0 : "–", t ? g("topic_ask")[k] || 0 : k === "questions" ? g("topic_ask").hub || 0 : "–"] };
    })
    .filter((x) => x.row.slice(1).some((c) => c && c !== "–"))
    .sort((a, b) => b.views - a.views);
  table($("pages"), ["Page", "Views", "Clicked to", "Ask clicks"], pages.map((x) => x.row), "No page views counted yet for this range.");

  const books = Object.entries(META.books)
    .map(([id, b]) => ({ n: g("amazon")[id] || 0, row: [esc(b.title) + (b.own ? "" : ' <small>(recommended)</small>'), g("amazon")[id] || 0] }))
    .filter((x) => x.n)
    .sort((a, b) => b.n - a.n);
  table($("books"), ["Book", "Amazon clicks"], books.map((x) => x.row), "No Amazon clicks yet for this range.");
  $("shelf").textContent = \`The in-app Books shelf was opened \${fmt(sum(g("books_open")))} time\${sum(g("books_open")) === 1 ? "" : "s"}.\`;

  const fails = Object.entries(g("fail")).filter(([, n]) => n);
  const names = { timeout: "took too long", rateLimit: "too many questions at once", busy: "AI service unavailable", retry: "incomplete answer", network: "visitor's connection", unknown: "other" };
  $("fails").textContent = fails.length
    ? "Answers that failed: " + fails.map(([k, n]) => \`\${fmt(n)} \${names[k] || k}\`).join(", ") + "."
    : "No failed answers in this range.";
}

document.querySelectorAll(".stats-tabs button").forEach((b) =>
  b.addEventListener("click", () => {
    document.querySelectorAll(".stats-tabs button").forEach((x) => x.classList.toggle("on", x === b));
    range = b.dataset.r;
    try { localStorage.setItem("rf-stats-range", range); } catch (e) {}
    if (data) render();
  })
);
try {
  const saved = localStorage.getItem("rf-stats-range");
  if (saved) { range = saved; document.querySelectorAll(".stats-tabs button").forEach((x) => x.classList.toggle("on", x.dataset.r === saved)); }
} catch (e) {}

const box = $("nocount");
try { box.checked = localStorage.getItem("rf-nocount") === "1"; } catch (e) { box.disabled = true; }
box.addEventListener("change", () => {
  try { box.checked ? localStorage.setItem("rf-nocount", "1") : localStorage.removeItem("rf-nocount"); } catch (e) {}
});

fetch("/api/stats", { cache: "no-store" })
  .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
  .then((d) => {
    data = d;
    $("updated").textContent = "Updated " + new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) + " · pull down to refresh";
    bars($("c-visits"), d.daily.map((x) => x.visits));
    bars($("c-answers"), d.daily.map((x) => x.answers));
    $("ax0").textContent = $("ax1").textContent = short(d.daily[0].date);
    render();
  })
  .catch((e) => {
    $("updated").textContent = "Couldn't load stats";
    const msg = e === 503
      ? "The counter isn't connected yet. In Vercel, open Storage, choose the Upstash database your arcade sites use, and connect it to the restless project. Then redeploy."
      : "Couldn't reach the stats right now. Try again in a minute.";
    ["sources", "pages", "books"].forEach((id) => ($(id).innerHTML = \`<p class="fine">\${msg}</p>\`));
  });
</script>`;
  return page({
    headHtml: head({ title: "Stats | Restless.faith", description: "Unlisted dashboard of anonymous Restless.faith visit, question and book-click counts.", path: "/stats", noindex: true }),
    main,
    bodyClass: "page-stats",
    noCount: true,
  });
}

export function renderNotFound() {
  const main = `<header class="topic-head">
  <p class="eyebrow">Page not found</p>
  <h1>We couldn't find that page</h1>
  <p class="lede">But you can still ask your question, or start with one of these.</p>
  <p><a class="btn" href="/">${ICONS.send} Ask a question</a></p>
</header>
<ul class="related hub">
  ${TOPICS.slice(0, 6)
    .map((t) => `<li><a class="card related-card" href="${topicUrl(t)}"><span class="q">${esc(t.question)}</span></a></li>`)
    .join("\n  ")}
</ul>`;
  return page({
    headHtml: head({ title: "Page not found | Restless.faith", description: "That page doesn't exist. Ask a question or browse Catholic questions answered.", path: "/404", noindex: true }),
    main,
    bodyClass: "page-404",
  });
}

export function renderSitemap() {
  const urls = ["/", "/questions", ...TOPICS.map(topicUrl), "/books", "/privacy"];
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${SITE}${u === "/" ? "/" : u}</loc><lastmod>${UPDATED}</lastmod></url>`).join("\n")}
</urlset>
`;
}

// --- social reuse (Reel Studio + export) ------------------------------------

export function plainAnswer(topic) {
  return topic.answer.replace(/\s*\[\[[^\]]+\]\]/g, "").replace(/\s+([.,;])/g, "$1").trim();
}

function csvCell(value) {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

// One row per question page, for planning Shorts/Reels and pasting post text.
export function renderSocialCsv() {
  const head = ["question", "short_answer", "video_title", "social_description", "hashtags", "link", "short_link", "page_title", "reel_studio_questions"];
  const rows = TOPICS.map((t) => [
    t.question,
    plainAnswer(t),
    t.social.videoTitle,
    `${t.social.caption} Full answer with sources: ${SITE}/${t.short}`,
    t.social.hashtags.join(" "),
    `${SITE}${topicUrl(t)}`,
    `restless.faith/${t.short}`,
    t.seoTitle,
    t.social.reel.join(" "),
  ]);
  return "\ufeff" + [head, ...rows].map((r) => r.map(csvCell).join(",")).join("\r\n") + "\r\n";
}

// Reel Studio question slug → its question page, so post text links there.
export function renderReelTopicLinks() {
  const map = {};
  for (const t of TOPICS) for (const slug of t.social.reel) map[slug] = { short: t.short, question: t.question };
  return `// Generated at build time from content/topic-index.js — do not edit.\nwindow.REEL_TOPICS = ${JSON.stringify(map, null, 1)};\n`;
}

// File name → contents. With cleanUrls on Vercel, questions/x.html is served at /questions/x.
export function renderSite() {
  const files = {
    "questions.html": renderHub(),
    "books.html": renderBooks(),
    "privacy.html": renderPrivacy(),
    "404.html": renderNotFound(),
    "stats.html": renderStats(),
    "sitemap.xml": renderSitemap(),
    "reel/topic-links.js": renderReelTopicLinks(),
    "reel/topics.csv": renderSocialCsv(),
  };
  for (const topic of TOPICS) files[`questions/${topic.slug}.html`] = renderTopic(topic);
  return files;
}
