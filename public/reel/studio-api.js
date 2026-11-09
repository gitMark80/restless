// Private creator controls. API keys never enter this module or browser storage.
export function initStudio({ getAnswer, getQuestion, useClip }) {
  const $ = id => document.getElementById(id);
  let authenticated = false, quote = null, sourceText = '', sourceLabels = [], activeJob = null, pollTimer = null, pending = false;
  const message = text => { $('studioStatus').textContent = text; };
  async function api(action, body) {
    const response = await fetch('/api/reel-studio' + (body ? '' : '?action=' + action), {
      method:body ? 'POST' : 'GET', credentials:'same-origin', cache:'no-store',
      ...(body ? { headers:{'Content-Type':'application/json'}, body:JSON.stringify({action, ...body}) } : {}),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      if (response.status === 401) { authenticated = false; $('studioLogin').hidden = false; $('studioTools').hidden = true; }
      throw new Error(data.error || 'Could not connect. Refresh your clips before trying again.');
    }
    return data;
  }
  function input() {
    return { presenter:$('studioPresenter').value, script:$('studioScript').value, question:$('studioQuestion').value, level:getQuestion().level, sources:$('studioScript').value === sourceText ? sourceLabels : [] };
  }
  function invalidate() { quote = null; $('studioReview').hidden = true; $('studioGenerate').disabled = true; }
  function wordCount() {
    const words = $('studioScript').value.trim().split(/\s+/).filter(Boolean).length;
    $('studioWordCount').textContent = `${words} / 450 words · approximately ${Math.ceil(words / 150 * 60)} seconds at a natural reading pace`;
    invalidate();
  }
  function useAnswer() {
    const answer = getAnswer();
    if (!answer) { message('Prepare an answer above first, or paste your own script.'); return; }
    $('studioScript').value = answer.text; $('studioQuestion').value = answer.q;
    sourceText = answer.text; sourceLabels = answer.sources || []; wordCount();
    message('The prepared answer is copied exactly. Review it before generating.');
  }
  async function account() {
    const data = await api('account');
    const balance = data.balance !== null ? ` · ${data.currency === 'usd' ? '$' : ''}${data.balance}${data.currency === 'usd' ? ' API balance' : ' ' + (data.currency || '')}` : '';
    $('studioAccount').textContent = `HeyGen developer API connected${balance}`;
    for (const option of $('studioPresenter').options) option.disabled = !data.presenters.some(p => p.name === option.value && p.ready);
    if ($('studioPresenter').selectedOptions[0]?.disabled) $('studioPresenter').value = data.presenters.find(p => p.ready)?.name || '';
    $('studioReviewButton').disabled = !data.presenters.some(p => p.ready);
    if (!$('studioPresenter').value) message('Gemma and Luke are not available to this API key. Check the HeyGen account and key permissions.');
  }
  async function jobs() {
    const data = await api('jobs'); $('studioJobs').replaceChildren();
    for (const job of data.jobs) {
      const button = document.createElement('button'); button.type = 'button'; button.className = 'studio-job';
      button.textContent = `${job.presenter} · ${job.question} — ${job.status}`;
      button.onclick = () => watch(job.id); $('studioJobs').appendChild(button);
    }
    $('studioEmpty').hidden = !!data.jobs.length;
    return data.jobs;
  }
  function schedule(id) {
    clearTimeout(pollTimer);
    if (!document.hidden) pollTimer = setTimeout(() => watch(id), 10000);
  }
  function showJob(job) {
    activeJob = job; $('studioResult').hidden = false;
    $('studioResultTitle').textContent = `${job.presenter} · ${job.question}`;
    $('studioResultStatus').textContent = job.error || (job.status === 'completed' ? `Ready${job.duration ? ' · ' + Math.round(job.duration) + ' seconds' : ''}` : `HeyGen status: ${job.status}. You can leave and return to Your clips.`);
    const ready = job.status === 'completed' && !!job.videoUrl;
    $('studioVideo').hidden = !ready;
    if (ready) { if ($('studioVideo').getAttribute('src') !== job.videoUrl) $('studioVideo').src = job.videoUrl; }
    else { $('studioVideo').pause(); $('studioVideo').removeAttribute('src'); }
    $('studioUseClip').hidden = !ready; $('studioDownload').hidden = !ready;
    if (ready) $('studioDownload').href = job.videoUrl;
    $('studioCaptions').hidden = !job.subtitleUrl;
    if (job.subtitleUrl) $('studioCaptions').href = job.subtitleUrl;
    $('studioCheck').hidden = !job.videoId;
  }
  async function watch(id) {
    clearTimeout(pollTimer);
    try {
      const data = await api('job&id=' + encodeURIComponent(id));
      showJob(data.job);
      if (['waiting', 'pending', 'queued', 'processing', 'rendering', 'submitting'].includes(data.job.status) && data.job.videoId) schedule(id);
    } catch (error) { message(error.message + ' Use Check status to resume.'); }
  }
  async function connected() {
    authenticated = true; $('studioLogin').hidden = true; $('studioTools').hidden = false;
    $('studioQuestion').value ||= getQuestion().q;
    await account(); const previous = await jobs();
    const unfinished = previous.find(j => !['completed', 'failed', 'unknown'].includes(j.status));
    if (unfinished) watch(unfinished.id);
  }
  $('studioPanel').addEventListener('toggle', async () => {
    if (!$('studioPanel').open) return;
    try {
      const data = await api('session');
      if (!Object.values(data.setup).every(Boolean)) {
        $('studioLogin').hidden = true; $('studioTools').hidden = true;
        message(data.setup.password ? 'Private generation needs its API key and storage settings completed.' : 'One-time setup: save REEL_STUDIO_PASSWORD (at least 16 characters) as a Production Secret in Vercel, then redeploy. Use that password here to unlock generation.');
        return;
      }
      if (data.authenticated) await connected();
      else { $('studioLogin').hidden = false; message('Enter your Studio password to use your HeyGen API credits.'); }
    } catch (e) { message(e.message); }
  });
  $('studioLogin').onsubmit = async event => {
    event.preventDefault(); const button = $('studioUnlock'); button.disabled = true;
    try { await api('login', {password:$('studioPassword').value}); $('studioPassword').value = ''; message('Studio unlocked.'); await connected(); }
    catch (e) { message(e.message); } finally { button.disabled = false; }
  };
  $('studioLogout').onclick = async () => { try { await api('logout', {}); authenticated = false; clearTimeout(pollTimer); $('studioVideo').pause(); $('studioTools').hidden = true; $('studioLogin').hidden = false; message('Studio locked.'); } catch(e) { message(e.message); } };
  $('studioUseAnswer').onclick = useAnswer;
  $('studioScript').oninput = wordCount;
  $('studioQuestion').oninput = invalidate;
  $('studioPresenter').onchange = invalidate;
  $('studioReviewButton').onclick = async () => {
    invalidate(); const button = $('studioReviewButton'); button.disabled = true;
    try {
      const captured = input(); const data = await api('quote', captured);
      if (JSON.stringify(input()) !== JSON.stringify(captured)) { message('The script changed. Review it again.'); return; }
      quote = { ...data, input:captured };
      $('studioExactScript').textContent = captured.script;
      $('studioEstimate').textContent = `${captured.presenter} · about ${data.seconds} seconds · estimated $${data.usd.toFixed(2)}. Avatar IV photo avatar: $${data.rate.toFixed(2)}/minute. Actual duration determines the charge; this is not a price cap. Rate checked ${data.pricingDate}.`;
      $('studioReview').hidden = false; $('studioGenerate').disabled = false;
      message('Review the exact script below. Generate uses your HeyGen API balance.');
      $('studioReview').scrollIntoView({behavior:'smooth', block:'nearest'});
    } catch(e) { message(e.message); } finally { button.disabled = false; }
  };
  $('studioGenerate').onclick = async () => {
    if (pending || !quote) return;
    if (JSON.stringify(input()) !== JSON.stringify(quote.input)) { invalidate(); message('The script or question changed. Review it again.'); return; }
    pending = true; $('studioGenerate').disabled = true; $('studioReviewButton').disabled = true;
    message('Submitting once to HeyGen…');
    try {
      const data = await api('generate', { ...quote.input, quote:quote.token, confirmed:true });
      showJob(data.job); await jobs();
      message(data.reused ? 'Found the existing clip for this exact script. No duplicate video was requested.' : 'Request saved. Your clip will appear here when HeyGen finishes.');
      if (data.job.videoId) watch(data.job.id);
    } catch(e) { message(e.message + ' Refresh Your clips before submitting again.'); }
    finally { pending = false; invalidate(); $('studioReviewButton').disabled = false; }
  };
  $('studioRefreshJobs').onclick = async () => { try { await jobs(); message('Your clips are up to date.'); } catch(e) { message(e.message); } };
  $('studioCheck').onclick = () => activeJob && watch(activeJob.id);
  $('studioUseClip').onclick = async () => {
    const button = $('studioUseClip'); button.disabled = true; $('studioVideo').pause();
    try { await useClip(activeJob); message('Clip loaded into the reel with its exact script. Tap Load site, then Ready.'); }
    catch(e) { message(e.message); } finally { button.disabled = false; }
  };
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) clearTimeout(pollTimer);
    else if (authenticated && activeJob?.videoId && !['completed','failed'].includes(activeJob.status)) watch(activeJob.id);
  });
  wordCount();
}
