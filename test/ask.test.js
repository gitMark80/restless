import test from "node:test";
import assert from "node:assert/strict";
import { parseModelResponse } from "../api/ask.js";

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
