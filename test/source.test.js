import test from "node:test";
import assert from "node:assert/strict";
import { estimateCatechismPage, pageHasParagraph } from "../api/source.js";

test("estimates known Catechism pages", () => {
  assert.equal(estimateCatechismPage(1), 9);
  assert.equal(estimateCatechismPage(1374), 348);
  assert.equal(estimateCatechismPage(1701), 426);
  assert.equal(estimateCatechismPage(2267), 548);
  assert.equal(estimateCatechismPage(2865), 690);
});

test("recognizes a main Catechism paragraph in page HTML", () => {
  const html = "<div>1373 Earlier paragraph.</div><p>1374 The mode of Christ's presence under the Eucharistic species is unique.</p>";
  assert.equal(pageHasParagraph(html, 1374), true);
  assert.equal(pageHasParagraph(html, 1375), false);
});

test("does not treat a bare cross-reference as the paragraph start", () => {
  const html = "<p>See 1374, 1396, and 2856 for related topics.</p>";
  assert.equal(pageHasParagraph(html, 1374), false);
});
