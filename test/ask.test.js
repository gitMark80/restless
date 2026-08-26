import test from "node:test";
import assert from "node:assert/strict";
import { addAuthoritativeSourceLinks, parseModelResponse } from "../api/ask.js";

test("parses a complete model response", () => {
  assert.deepEqual(
    parseModelResponse('{"text":"Jesus is truly God.","sources":[{"label":"John 1:1","detail":"The Word is God."}]}'),
    {
      text: "Jesus is truly God.",
      sources: [{ label: "John 1:1", detail: "The Word is God." }],
    }
  );
});

test("extracts JSON surrounded by harmless prose or fences", () => {
  assert.deepEqual(
    parseModelResponse('```json\n{"text":"A complete answer","sources":[]}\n```'),
    { text: "A complete answer", sources: [] }
  );
});

test("rejects truncated answers instead of showing partial text", () => {
  assert.equal(parseModelResponse('{"text":"An unfinished answer'), null);
});

test("drops malformed sources and caps the source count", () => {
  const parsed = parseModelResponse(
    JSON.stringify({
      text: "Answer",
      sources: [
        { label: "A", detail: "One" },
        { label: "B", detail: "Two" },
        { label: "C", detail: "Three" },
        { label: "D", detail: "Four" },
        { label: "Invalid" },
      ],
    })
  );
  assert.equal(parsed.sources.length, 3);
});

test("adds authoritative links for Catechism and Scripture citations", () => {
  const linked = addAuthoritativeSourceLinks({
    text: "Answer",
    sources: [
      { label: "Catechism of the Catholic Church, §1374", detail: "Christ is truly present." },
      { label: "John 6:51", detail: "Jesus identifies himself as the living bread." },
    ],
  });

  assert.equal(linked.sources[0].url, "https://www.vatican.va/archive/ENG0015/_INDEX.HTM");
  assert.equal(linked.sources[1].url, "https://bible.usccb.org/bible");
});
