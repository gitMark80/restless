// Tests for the anonymous counters behind restless.faith/stats.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { EVENTS, SOURCES, PAGES, normalizeKey, evAll, evDay } from "../api/_counter.js";
import eventHandler from "../api/event.js";
import statsHandler from "../api/stats.js";
import { renderSite } from "../scripts/site-pages.mjs";

function mockRes() {
  return {
    statusCode: 0, body: null, headers: {}, ended: false,
    setHeader(k, v) { this.headers[k] = v; },
    status(code) { this.statusCode = code; return this; },
    json(data) { this.body = data; return this; },
    end() { this.ended = true; return this; },
  };
}

test("only known events and keys are counted", () => {
  assert.equal(normalizeKey("visit", "youtube"), "youtube");
  assert.equal(normalizeKey("visit", "my-weird-utm"), "other", "unknown sources become other");
  assert.equal(normalizeKey("page", "eucharist"), "eucharist");
  assert.equal(normalizeKey("page", "../../etc"), null);
  assert.equal(normalizeKey("amazon", "protestants"), "protestants");
  assert.equal(normalizeKey("amazon", "not-a-book"), null);
  assert.equal(normalizeKey("delete_everything", "youtube"), null);
  assert.ok(PAGES.includes("home") && PAGES.includes("saints"));
  assert.ok(SOURCES.includes("youtube") && SOURCES.includes("direct"));
});

test("keys are prefixed so Restless never touches the arcade sites' data", () => {
  for (const e of Object.keys(EVENTS)) {
    assert.ok(evAll(e).startsWith("rf:"));
    assert.ok(evDay(e, new Date("2026-10-24T12:00:00Z")).endsWith(":day:2026-10-24"));
  }
});

test("event endpoint: POST only, rejects junk, and is a quiet no-op until Redis is connected", async () => {
  const get = mockRes();
  await eventHandler({ method: "GET", query: {} }, get);
  assert.equal(get.statusCode, 405);
  const junk = mockRes();
  await eventHandler({ method: "POST", query: { e: "page", k: "<script>" } }, junk);
  assert.equal(junk.statusCode, 400);
  const ok = mockRes();
  await eventHandler({ method: "POST", query: { e: "visit", k: "youtube" } }, ok);
  assert.equal(ok.statusCode, 204);
  const stats = mockRes();
  await statsHandler({ method: "GET", query: {} }, stats);
  assert.equal(stats.statusCode, 503);
});

test("rf.js counts only events the server accepts", () => {
  const rf = fs.readFileSync(new URL("../public/rf.js", import.meta.url), "utf8");
  for (const [, event] of rf.matchAll(/\[\["?([a-z_]+)", "/g)) assert.ok(EVENTS[event], `rf.js sends unknown event ${event}`);
  for (const [, event] of rf.matchAll(/count\("([a-z_]+)"/g)) assert.ok(EVENTS[event], `rf.js sends unknown event ${event}`);
});

test("the stats page is unlisted and not itself counted", () => {
  const html = renderSite()["stats.html"];
  assert.match(html, /<meta name="robots" content="noindex">/);
  assert.match(html, /data-rf-nocount/);
  const robots = fs.readFileSync(new URL("../public/robots.txt", import.meta.url), "utf8");
  assert.match(robots, /^Disallow: \/stats$/m);
});
