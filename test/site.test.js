// Tests for the question pages, books page, sitemap, short links, topic
// matching in the app, and the newsletter endpoint.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { TOPICS, TOPIC_BY_SLUG } from "../content/topics.js";
import { renderSite, parseRef, topicSources, plainAnswer } from "../scripts/site-pages.mjs";
import { BOOKS, JOURNALS, RECOMMENDED } from "../src/books.js";
import { matchTopics, readDeepLink } from "../src/topicLinks.js";
import subscribe, { isConfigured, validateSignup } from "../api/subscribe.js";

const checked = JSON.parse(fs.readFileSync(new URL("./fixtures/citations-checked.json", import.meta.url), "utf8"));
const bookIds = new Set([...BOOKS, ...JOURNALS, ...RECOMMENDED].map((b) => b.id));
const site = renderSite();

test("every topic is complete and consistent", () => {
  const slugs = new Set();
  const shorts = new Set();
  for (const t of TOPICS) {
    assert.ok(!slugs.has(t.slug) && !shorts.has(t.short), `duplicate ${t.slug}`);
    slugs.add(t.slug);
    shorts.add(t.short);
    assert.match(t.slug, /^[a-z0-9-]+$/);
    assert.ok(t.question.endsWith("?"), `${t.slug}: question mark`);
    assert.ok(t.seoTitle.length <= 60, `${t.slug}: title ${t.seoTitle.length} chars`);
    assert.ok(t.description.length >= 70 && t.description.length <= 160, `${t.slug}: description ${t.description.length} chars`);
    assert.ok(t.answer.length > 150, `${t.slug}: short answer`);
    assert.ok(t.body.filter((b) => b.h).length >= 3, `${t.slug}: at least 3 sections`);
    assert.equal(t.followUps.length, 3);
    assert.ok(t.related.length >= 3);
    for (const r of t.related) assert.ok(TOPIC_BY_SLUG[r] && r !== t.slug, `${t.slug}: related ${r}`);
    assert.ok(t.books.length >= 1);
    for (const b of t.books) assert.ok(bookIds.has(b), `${t.slug}: book ${b} is not in src/books.js`);
    assert.ok(t.social.videoTitle && t.social.caption && t.social.hashtags.length);
  }
});

test("every citation is well-formed, and every Catechism paragraph has been checked", () => {
  for (const t of TOPICS) {
    const { bible, ccc } = topicSources(t);
    assert.ok(bible.length >= 3 && ccc.length >= 2, `${t.slug}: needs Scripture and Catechism sources`);
    for (const c of ccc) {
      assert.ok(checked.catechism[String(c.sort)], `${t.slug}: CCC ${c.sort} is not in test/fixtures/citations-checked.json — read it, then add it`);
    }
  }
  assert.equal(parseRef("CCC 3000"), null);
  assert.equal(parseRef("Hezekiah 1:1"), null);
  assert.equal(parseRef("John 6:53-56").href, "https://bible.usccb.org/bible/john/6?53=");
  assert.equal(parseRef("CCC 1374").href, "/api/source?ccc=1374");
});

test("short links in vercel.json match the topics", () => {
  const config = JSON.parse(fs.readFileSync(new URL("../vercel.json", import.meta.url), "utf8"));
  assert.equal(config.cleanUrls, true);
  const redirects = Object.fromEntries(config.redirects.map((r) => [r.source, r.destination]));
  for (const t of TOPICS) assert.equal(redirects[`/${t.short}`], `/questions/${t.slug}`, `missing short link /${t.short}`);
  const reserved = ["/api", "/reel", "/books", "/questions", "/covers", "/brand", "/privacy"];
  for (const source of Object.keys(redirects)) assert.ok(!reserved.includes(source), `${source} clashes with a real path`);
});

test("built pages have titles, canonicals, structured data and working internal links", () => {
  const pages = new Set(["/", "/questions", "/books", "/privacy", ...TOPICS.map((t) => `/questions/${t.slug}`)]);
  for (const [file, html] of Object.entries(site)) {
    if (!file.endsWith(".html")) continue;
    assert.match(html, /<title>[^<]{10,}<\/title>/, `${file}: title`);
    assert.match(html, /<meta name="description" content="[^"]{50,}">/, `${file}: description`);
    assert.equal((html.match(/<h1[ >]/g) || []).length, 1, `${file}: exactly one h1`);
    assert.ok(!/undefined|NaN|\[object Object\]|\[\[/.test(html), `${file}: leftover placeholder`);
    if (file !== "404.html") assert.match(html, /<link rel="canonical" href="https:\/\/restless\.faith\//);
    for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) JSON.parse(m[1]);
    for (const m of html.matchAll(/href="(\/[^"#?]*)/g)) {
      const href = m[1];
      if (/^\/(api|brand|covers|site\.|rf\.js|_vercel|site\.webmanifest)/.test(href)) continue;
      assert.ok(pages.has(href), `${file}: broken internal link ${href}`);
    }
  }
  const eucharist = site["questions/why-do-catholics-believe-in-the-eucharist.html"];
  assert.match(eucharist, /"@type":"Article"/);
  assert.match(eucharist, /href="\/\?q=Why\+can%27t\+non-Catholics\+receive\+Communion%3F&amp;from=eucharist"/);
  assert.match(eucharist, /rel="sponsored nofollow noopener"/);
});

test("sitemap lists every public page", () => {
  const xml = site["sitemap.xml"];
  for (const t of TOPICS) assert.ok(xml.includes(`https://restless.faith/questions/${t.slug}<`), t.slug);
  for (const p of ["https://restless.faith/<", "https://restless.faith/books<", "https://restless.faith/questions<"]) assert.ok(xml.includes(p), p);
  assert.ok(!xml.includes("/reel"));
});

test("social export and Reel Studio links come from the topics", () => {
  const csv = site["reel/topics.csv"];
  assert.equal(csv.trim().split(/\r\n/).length, TOPICS.length + 1);
  assert.ok(!/\[\[/.test(csv));
  assert.ok(plainAnswer(TOPICS[0]).endsWith("."));
  assert.match(site["reel/topic-links.js"], /"eucharist-real": \{\n  "short": "eucharist"/);
});

test("in-app answers link to the right question pages", () => {
  const first = (q, a = "") => matchTopics(q, a, 3).map((t) => t.short);
  assert.equal(first("Is Jesus really in the Eucharist?")[0], "eucharist");
  assert.equal(first("Why do I have to confess to a priest?")[0], "confession");
  assert.equal(first("Was Peter the first pope?")[0], "peter");
  assert.equal(first("how do I become Catholic as an adult?")[0], "become-catholic");
  assert.equal(first("¿Por qué rezan los católicos el rosario?")[0], "rosary");
  assert.deepEqual(first("What's a good name for my dog?"), []);
  assert.ok(first("What's the weather?", "...faith alone... purgatory...").length <= 1, "answer text adds at most one");
});

test("deep links are cleaned and never auto-send", () => {
  assert.deepEqual(readDeepLink("?q=%20Is%20Jesus%20%20real%3F%20&from=eucharist<script>"), { question: "Is Jesus real?", from: "eucharistscript", lang: "" });
  assert.equal(readDeepLink("?q=" + "a".repeat(2000)).question.length, 1000);
  assert.equal(readDeepLink("?lang=es").lang, "es");
  assert.equal(readDeepLink("?lang=fr").lang, "");
});

function mockRes() {
  return {
    statusCode: 0,
    body: null,
    headers: {},
    setHeader(k, v) {
      this.headers[k] = v;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      this.body = data;
      return this;
    },
  };
}

test("newsletter stays off until Kit is configured, and requires consent", async () => {
  assert.equal(isConfigured({}), false);
  assert.equal(isConfigured({ KIT_API_KEY: "x", KIT_FORM_ID: "abc" }), false);
  assert.equal(isConfigured({ KIT_API_KEY: "x", KIT_FORM_ID: "123" }), true);
  assert.equal(validateSignup({ email: "a@b.co" }).ok, false, "no consent");
  assert.equal(validateSignup({ email: "nope", consent: true }).ok, false);
  assert.equal(validateSignup({ email: " A@B.co ", consent: true }).email, "a@b.co");
  assert.equal(validateSignup({ email: "a@b.co", consent: true, website: "spam" }).silent, true);

  delete process.env.KIT_API_KEY;
  delete process.env.KIT_FORM_ID;
  const get = mockRes();
  await subscribe({ method: "GET", headers: {} }, get);
  assert.deepEqual(get.body, { enabled: false });
  const post = mockRes();
  await subscribe({ method: "POST", headers: {}, body: { email: "a@b.co", consent: true } }, post);
  assert.equal(post.statusCode, 503);
});
