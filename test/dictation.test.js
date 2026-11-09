import test from 'node:test';
import assert from 'node:assert/strict';
import { createDictationSession } from '../src/dictation.js';
function setup(initialText = 'Existing question') {
  let recognition;
  const text = [], errors = [];
  let ended = 0;
  class Recognition {
    constructor() { recognition = this; }
    start() {}
    stop() {}
    abort() { this.aborted = true; }
  }
  const session = createDictationSession({ Recognition, language: 'en', initialText,
    onText: value => text.push(value), onError: code => errors.push(code), onEnd: () => ended++ });
  session.start();
  return { session, recognition, text, errors, ended: () => ended };
}
const result = (...words) => ({ results: words.map(transcript => [{ transcript }]) });
test('dictation replaces interim results and preserves the existing draft', () => {
  const t = setup();
  t.recognition.onresult(result('why'));
  t.recognition.onresult(result('why am I', 'sad'));
  assert.deepEqual(t.text, ['Existing question why', 'Existing question why am I sad']);
  assert.equal(t.recognition.lang, 'en-US');
  t.session.abort();
});
test('stop accepts the final words, then ignores late callbacks', () => {
  const t = setup('');
  const late = t.recognition.onresult;
  t.session.stop();
  t.recognition.onresult(result('My final question'));
  t.recognition.onend();
  late(result('stale text'));
  assert.deepEqual(t.text, ['My final question']);
  assert.equal(t.ended(), 1);
});
test('aborting clears callbacks and prevents a previous session overwriting a new draft', () => {
  const t = setup();
  const late = t.recognition.onresult;
  t.session.abort();
  late(result('late speech'));
  assert.deepEqual(t.text, []);
  assert.equal(t.recognition.onresult, null);
  assert.equal(t.ended(), 1);
});
test('permission denial ends listening with a recoverable error', () => {
  const t = setup();
  t.recognition.onerror({ error: 'not-allowed' });
  assert.deepEqual(t.errors, ['not-allowed']);
  assert.equal(t.ended(), 1);
  assert.equal(t.recognition.aborted, true);
});
test('dictation respects the question length limit', () => {
  const t = setup('');
  t.recognition.onresult(result('x'.repeat(1200)));
  assert.equal(t.text[0].length, 1000);
  t.session.abort();
});
