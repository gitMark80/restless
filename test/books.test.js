import test from "node:test";
import assert from "node:assert/strict";
import { matchBook, bookUrl, BOOKS, JOURNALS, RECOMMENDED } from "../src/books.js";
import { classifyNextStep } from "../src/nextSteps.js";

const match = (q) => matchBook(q, classifyNextStep(q))?.series ?? null;

test("all ten pocket guides are present with real ASINs", () => {
  const nums = BOOKS.map((b) => b.series).sort((a, b) => a - b);
  assert.deepEqual(nums, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  for (const b of BOOKS) assert.match(b.url, /^https:\/\/www\.amazon\.com\/dp\/B0[A-Z0-9]{8}$/);
});

test("Book 1 — Protestant / apologetics", () => {
  assert.equal(match("Why do Catholics pray to Mary?"), 1);
  assert.equal(match("Is sola scriptura in the Bible?"), 1);
  assert.equal(match("Was Peter really the first pope?"), 1);
  assert.equal(match("I'm Baptist and my girlfriend is Catholic"), 1);
  assert.equal(match("¿Por qué los católicos rezan a los santos?"), 1);
});

test("Book 2 — why confess to a priest", () => {
  assert.equal(match("Why do I have to confess to a priest? Can't I just tell God?"), 2);
  assert.equal(match("I'm scared of confession, it's been 15 years"), 2);
  assert.equal(match("¿Por qué confesarme con un sacerdote?"), 2);
});

test("Book 3 — raised Catholic / lapsed", () => {
  assert.equal(match("I was raised Catholic but stopped going years ago"), 3);
  assert.equal(match("How do I come back to the Church after 20 years?"), 3);
  assert.equal(match("Crecí católico pero me alejé de la iglesia"), 3);
});

test("Book 4 — online Mass / obligation", () => {
  assert.equal(match("Does watching Mass on YouTube count?"), 4);
  assert.equal(match("Do I really have to go to Mass every Sunday?"), 4);
  assert.equal(match("¿Vale ver la misa en línea?"), 4);
});

test("Book 5 — where is Jesus in all this", () => {
  assert.equal(match("Why does Catholicism have so many rules and saints? Where is Jesus?"), 5);
  assert.equal(match("Isn't it about a relationship with Jesus, not religion?"), 5);
});

test("Book 6 — what Jesus commanded / founded", () => {
  assert.equal(match("Did Jesus actually start the Catholic Church?"), 6);
  assert.equal(match("Isn't the Mass a re-sacrifice of Christ?"), 6);
  assert.equal(match("¿Jesús fundó la iglesia católica?"), 6);
});

test("Book 7 — family and marriage", () => {
  assert.equal(match("How do I raise my kids Catholic when my husband isn't interested?"), 7);
  assert.equal(match("My teen says she doesn't believe anymore"), 7);
  assert.equal(match("¿Cómo transmitir la fe a mis hijos?"), 7);
});

test("Book 8 — loving someone in sin / boundaries", () => {
  assert.equal(match("My brother is gay and getting married. Should I go to the wedding?"), 8);
  assert.equal(match("What does 'hate the sin, love the sinner' actually mean?"), 8);
  assert.equal(match("How do I set boundaries with a toxic parent as a Christian?"), 8);
});

test("Book 9 — statues, relics, idolatry (beats Book 1)", () => {
  assert.equal(match("Isn't praying in front of a statue idolatry?"), 9);
  assert.equal(match("Why do Catholics keep relics of dead saints?"), 9);
  assert.equal(match("¿No es idolatría tener imágenes?"), 9);
});

test("Book 10 — self-examination / recurring sin (not Book 2)", () => {
  assert.equal(match("I keep confessing the same sins over and over. Am I a bad person?"), 10);
  assert.equal(match("How do I do an examination of conscience?"), 10);
  assert.equal(match("Me siento culpable todo el tiempo, ¿cómo cambio?"), 10);
});

test("Recommended — which Bible to buy → Ignatius Study Bible, flagged as not ours", () => {
  const q = "Which Catholic Bible should I buy?";
  const hit = matchBook(q, classifyNextStep(q));
  assert.equal(hit?.id, "ignatius-study-bible");
  assert.equal(hit?.recommended, true);
  assert.equal(matchBook("I've never read the Bible, where do I start?", "general")?.id, "ignatius-study-bible");
  assert.equal(matchBook("¿Qué biblia católica me recomiendan?", "general")?.id, "ignatius-study-bible");
  assert.match(RECOMMENDED[0].url, /^https:\/\/www\.amazon\.com\/dp\/[A-Z0-9]{10}$/);
});

test("Recommended — Catechism questions → Ascension Catechism", () => {
  assert.equal(matchBook("Which edition of the Catechism should I buy?", "general")?.id, "catechism-ascension");
  assert.equal(matchBook("What is the Catechism, and can I read it myself?", "general")?.id, "catechism-ascension");
  assert.equal(matchBook("¿Dónde puedo leer el catecismo?", "general")?.id, "catechism-ascension");
  // Citing the Catechism in a doctrinal question is not a request for the book.
  assert.equal(matchBook("Does the Catechism say gambling is a sin?", "general"), null);
  for (const b of RECOMMENDED) assert.match(b.url, /^https:\/\/www\.amazon\.com\/dp\/[A-Z0-9]{10}$/);
});

test("Pocket guides win over recommended books when both match", () => {
  assert.equal(match("Is sola scriptura — the Bible alone — really what the Bible teaches?"), 1);
});

test("Journal — prayer habit / gratitude / examen → Five-Minute Catholic Journal", () => {
  for (const q of [
    "How can I pray more consistently every day?",
    "Is there a Catholic gratitude journal?",
    "How do I do a daily examen?",
    "What should I do for Lent this year?",
    "¿Cómo puedo orar todos los días?",
  ]) {
    assert.equal(matchBook(q, "general")?.id, "five-minute-journal", q);
  }
  assert.equal(matchBook("How can I pray more?", "general")?.recommended, false);
  assert.match(JOURNALS[0].url, /^https:\/\/www\.amazon\.com\/dp\/B0[A-Z0-9]{8}$/);
});

test("Ordinary questions get no book", () => {
  assert.equal(match("What is the Bible?"), null);
  assert.equal(match("What does the Bible say about forgiveness?"), null);
  assert.equal(match("How do I pray the Rosary?"), null);
  assert.equal(match("What does the Church teach about the Eucharist?"), null);
  assert.equal(match("Who was St. Augustine?"), null);
});

test("Crisis and hurting questions never get a book, even on a matching topic", () => {
  assert.equal(match("I was raised Catholic and I want to die"), null);
  assert.equal(match("My Protestant dad passed away and I feel so alone"), null);
  assert.equal(match("I'm so ashamed of myself, I'm hurting and don't know who to talk to"), null);
});

test("bookUrl appends the Associates tag", () => {
  assert.equal(bookUrl(BOOKS[0]), `${BOOKS[0].url}?tag=restlessfaith-20`);
});
