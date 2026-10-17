import test from "node:test";
import assert from "node:assert/strict";
import { matchBook, bookUrl, BOOKS } from "../src/books.js";
import { classifyNextStep } from "../src/nextSteps.js";

const match = (q) => matchBook(q, classifyNextStep(q))?.id ?? null;

test("Protestant / apologetics questions match book 1", () => {
  assert.equal(match("Why do Catholics pray to Mary?"), "protestants");
  assert.equal(match("Is sola scriptura in the Bible?"), "protestants");
  assert.equal(match("Was Peter really the first pope?"), "protestants");
  assert.equal(match("I'm Baptist and my girlfriend is Catholic"), "protestants");
  assert.equal(match("¿Por qué los católicos rezan a los santos?"), "protestants");
});

test("Lapsed / cradle-Catholic questions match book 2", () => {
  assert.equal(match("I was raised Catholic but stopped going years ago"), "raised-catholic");
  assert.equal(match("How do I come back to the Church after 20 years?"), "raised-catholic");
  assert.equal(match("Crecí católico pero me alejé de la iglesia"), "raised-catholic");
});

test("Ordinary questions get no book", () => {
  assert.equal(match("What is the Bible?"), null);
  assert.equal(match("How do I pray the Rosary?"), null);
  assert.equal(match("What does the Church teach about the Eucharist?"), null);
});

test("Crisis and hurting questions never get a book, even on a matching topic", () => {
  assert.equal(match("I was raised Catholic and I want to die"), null);
  assert.equal(match("My Protestant dad passed away and I feel so alone"), null);
});

test("bookUrl leaves the plain URL alone when no affiliate tag is set", () => {
  assert.equal(bookUrl(BOOKS[0]), BOOKS[0].url);
});
