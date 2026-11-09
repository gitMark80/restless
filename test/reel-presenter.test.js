import test from 'node:test';
import assert from 'node:assert/strict';
import { chunkAnswer, parseCaptions, cueAt, pageAt } from '../public/reel/presenter-utils.js';
test('answer sections preserve all words without repeating or dropping them', () => {
  const answer='Bring your everyday questions about family and faith. Each answer stays rooted in Catholic teaching and offers practical next steps.';
  const pages=chunkAnswer(answer,45);
  assert.equal(pages.join(' '),answer);
  assert.ok(pages.every(page=>page.length<=45));
  assert.equal(pageAt(pages,999,30),pages.length-1);
  assert.equal(pageAt(pages,-1,30),0);
});
test('SRT and WebVTT timestamps produce cues with gaps and precise boundaries', () => {
  const cues=parseCaptions('WEBVTT\n\n00:00.500 --> 00:02.000\nFirst words\n\nsecond\n00:03.000 --> 00:04.500 align:start\nMore words');
  assert.equal(cueAt(cues,0),'');assert.equal(cueAt(cues,.5),'First words');
  assert.equal(cueAt(cues,2),'');assert.equal(cueAt(cues,3),'More words');
  const srt=parseCaptions('1\r\n00:00:01,200 --> 00:00:03,400\r\n<b>Caption</b>\r\nsecond line');
  assert.deepEqual(srt,[{start:1.2,end:3.4,text:'Caption second line'}]);
});
test('invalid caption files and reversed timings are rejected', () => {
  assert.throws(()=>parseCaptions('plain text without times'));
  assert.throws(()=>parseCaptions('00:03.000 --> 00:02.000\nNo'));
  assert.throws(()=>parseCaptions('00:75.000 --> 00:80.000\nNo'));
});
