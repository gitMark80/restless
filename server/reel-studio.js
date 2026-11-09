import { createHash, createHmac, randomUUID, timingSafeEqual } from 'node:crypto';

export const PREFIX = 'rf:studio:v1:';
export const COOKIE = '__Secure-rf-studio';
const SESSION_SECONDS = 7 * 86400;
const KEEP_SECONDS = 90 * 86400;
export const PRESENTERS = {
  Gemma: { id: '97fcff8d319543d695a74bc61d74194a', voice: '37f59281ef2f45be907986788d12137e' },
  Luke: { id: 'e728310f9f3d486d849e186b250fb63a', voice: '4aAY71nHuGhzHyZuAAE2' },
};
export const PRICE_PER_MINUTE = 2.31; // Avatar IV photo avatar; reviewed 2026-11-09.
export const digest = value => createHash('sha256').update(value).digest('hex');
const equal = (a, b) => timingSafeEqual(Buffer.from(digest(String(a))), Buffer.from(digest(String(b))));
export function sign(payload, secret) {
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  return body + '.' + createHmac('sha256', secret).update(body).digest('base64url');
}
export function verify(token, secret, kind, now = Date.now()) {
  try {
    if (typeof token !== 'string' || token.length > 3000 || !secret) return null;
    const [body, signature, extra] = token.split('.');
    if (extra || !signature || !equal(signature, createHmac('sha256', secret).update(body).digest('base64url'))) return null;
    const value = JSON.parse(Buffer.from(body, 'base64url').toString());
    return value.kind === kind && Number.isFinite(value.exp) && value.exp > now ? value : null;
  } catch { return null; }
}
export function session(req, secret) {
  const cookie = String(req.headers.cookie || '').split(';').map(x => x.trim()).find(x => x.startsWith(COOKIE + '='));
  return verify(cookie?.slice(COOKIE.length + 1), secret, 'session');
}
export function cookie(value, maxAge = SESSION_SECONDS) {
  return `${COOKIE}=${value}; Path=/api/reel-studio; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAge}`;
}
export function cleanInput(body) {
  if (!Object.hasOwn(PRESENTERS, body.presenter)) throw new Error('Choose Gemma or Luke.');
  if (typeof body.script !== 'string' || !body.script.trim()) throw new Error('Paste the script you want read.');
  const words = body.script.trim().split(/\s+/).length;
  if (body.script.length > 6000 || words > 450) throw new Error('Keep this clip under 450 words and 6,000 characters.');
  const sources = Array.isArray(body.sources) ? body.sources.slice(0, 4).filter(s => s && typeof s.label === 'string').map(s => ({ label: s.label.slice(0, 180) })) : [];
  return { presenter: body.presenter, script: body.script, question: String(body.question || 'My question').slice(0, 140), level: ['Middle school', 'High school', 'College', 'Adult'].includes(body.level) ? body.level : 'Adult', sources };
}
export function estimate(script) {
  const words = script.trim().split(/\s+/).length;
  const seconds = Math.ceil(words / 150 * 60);
  return { words, seconds, usd: Math.ceil(seconds / 60 * PRICE_PER_MINUTE * 100) / 100, rate: PRICE_PER_MINUTE, pricingDate: '2026-11-09' };
}
export function safeMediaUrl(value) {
  try {
    const u = new URL(value);
    const allowed = ['heygen.ai', 'heygen.com'];
    return u.protocol === 'https:' && !u.username && !u.password && allowed.some(h => u.hostname === h || u.hostname.endsWith('.' + h)) ? u.href : null;
  } catch { return null; }
}
export function publicJob(job) {
  return { id: job.id, videoId: job.videoId || null, presenter: job.presenter, script: job.script, question: job.question, level: job.level, sources: job.sources, status: job.status, createdAt: job.createdAt, error: job.error || null, duration: job.duration || null, videoUrl: safeMediaUrl(job.videoUrl), subtitleUrl: safeMediaUrl(job.subtitleUrl) };
}
const fail = (status, message) => Object.assign(new Error(message), { status });

export function makeHandler({ env = process.env, fetcher = fetch } = {}) {
  const password = () => env.REEL_STUDIO_PASSWORD || '';
  const configured = () => ({ apiKey: !!env.HEYGEN_API_KEY, password: password().length >= 16, storage: !!((env.KV_REST_API_URL || env.UPSTASH_REDIS_REST_URL) && (env.KV_REST_API_TOKEN || env.UPSTASH_REDIS_REST_TOKEN)) });
  async function redis(...command) {
    const url = env.KV_REST_API_URL || env.UPSTASH_REDIS_REST_URL;
    const token = env.KV_REST_API_TOKEN || env.UPSTASH_REDIS_REST_TOKEN;
    const r = await fetcher(url, { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify(command), signal: AbortSignal.timeout(6000) });
    if (!r.ok) throw fail(503, 'Studio storage is unavailable. No new video was requested.');
    const data = await r.json();
    if (data.error) throw fail(503, 'Studio storage is unavailable.');
    return data.result;
  }
  async function limit(key, max, seconds) {
    // Atomic counter + TTL so interrupted functions cannot leave permanent limits.
    const n = await redis('EVAL', "local n=redis.call('INCR',KEYS[1]); if n==1 then redis.call('EXPIRE',KEYS[1],ARGV[1]); end; return n", '1', PREFIX + key, String(seconds));
    if (+n > max) throw fail(429, 'Too many attempts. Please try again later.');
  }
  async function heygen(path, body) {
    const r = await fetcher('https://api.heygen.com/v3' + path, { method: body ? 'POST' : 'GET', headers: { 'X-Api-Key': env.HEYGEN_API_KEY, ...(body ? { 'Content-Type': 'application/json' } : {}) }, ...(body ? { body: JSON.stringify(body) } : {}), signal: AbortSignal.timeout(25000), redirect: 'error' });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) {
      const message = ({401:'HeyGen rejected the API key. Check the saved key in Vercel.',403:'The HeyGen key cannot access this resource. Check its permissions.',402:'HeyGen reports insufficient API credits.',429:'HeyGen is busy. Please wait before trying again.'})[r.status] || 'HeyGen could not accept this request. Check your HeyGen dashboard.';
      throw Object.assign(fail(502, message), { definitive: r.status >= 400 && r.status < 500 });
    }
    return data.data || data;
  }
  const readJob = async id => { const raw = await redis('GET', PREFIX + 'job:' + id); return raw ? JSON.parse(raw) : null; };
  const saveJob = job => redis('SET', PREFIX + 'job:' + job.id, JSON.stringify(job), 'EX', String(KEEP_SECONDS));
  async function checkLook(name) {
    const look = await heygen('/avatars/looks/' + PRESENTERS[name].id);
    if (look.status !== 'completed' || look.avatar_type !== 'photo_avatar' || !look.supported_api_engines?.includes('avatar_iv')) throw fail(409, `${name} is not ready for Avatar IV. Check the avatar in HeyGen.`);
    return look;
  }
  return async function handler(req, res) {
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Vary', 'Cookie');
    try {
      if (!['GET', 'POST'].includes(req.method)) return res.status(405).json({ error: 'Use GET or POST.' });
      const setup = configured();
      const loggedIn = setup.password && !!session(req, password());
      const url = new URL(req.url, 'https://restless.faith');
      let body = {};
      if (req.method === 'POST') {
        const origins = ['https://restless.faith', 'https://www.restless.faith', env.VERCEL_URL && 'https://' + env.VERCEL_URL];
        if (env.NODE_ENV === 'test') origins.push('http://localhost:4173', 'http://terminal.local:4173');
        if (!origins.includes(req.headers.origin)) throw fail(403, 'Open Reel Studio on its own site to continue.');
        if (!String(req.headers['content-type'] || '').startsWith('application/json')) throw fail(415, 'Use JSON.');
        if (+req.headers['content-length'] > 24000) throw fail(413, 'Request too large.');
        try { body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {}; } catch { throw fail(400, 'Invalid request.'); }
        if (JSON.stringify(body).length > 24000) throw fail(413, 'Request too large.');
      }
      const action = req.method === 'GET' ? url.searchParams.get('action') || 'session' : body.action;
      if (action === 'session' && req.method === 'GET') return res.status(200).json({ authenticated: loggedIn, setup });
      if (!Object.values(setup).every(Boolean)) throw fail(503, 'Private generation is locked. Save HEYGEN_API_KEY and a REEL_STUDIO_PASSWORD of at least 16 characters in Vercel, then redeploy.');
      if (action === 'login' && req.method === 'POST') {
        const ip = String(req.headers['x-vercel-forwarded-for'] || req.headers['x-forwarded-for'] || 'unknown').split(',')[0].trim();
        await limit('login:global', 60, 900); await limit('login:' + digest(ip), 10, 900);
        if (typeof body.password !== 'string' || !equal(body.password, password())) throw fail(401, 'That Studio password did not match.');
        res.setHeader('Set-Cookie', cookie(sign({ kind:'session', exp:Date.now() + SESSION_SECONDS * 1000, nonce:randomUUID() }, password())));
        return res.status(200).json({ authenticated:true });
      }
      if (!loggedIn) throw fail(401, 'Unlock the private studio first.');
      if (action === 'logout' && req.method === 'POST') { res.setHeader('Set-Cookie', cookie('', 0)); return res.status(200).json({ authenticated:false }); }
      if (action === 'account' && req.method === 'GET') {
        await limit('reads', 300, 60);
        const account = await heygen('/users/me');
        const looks = await Promise.all(Object.keys(PRESENTERS).map(async name => { try { const look = await checkLook(name); return { name, ready:true, previewUrl:safeMediaUrl(look.preview_image_url) }; } catch { return { name, ready:false }; } }));
        return res.status(200).json({ connected:true, billingType:account.billing_type, balance:account.wallet?.remaining_balance ?? null, currency:account.wallet?.currency ?? null, presenters:looks });
      }
      if (action === 'quote' && req.method === 'POST') {
        let input; try { input = cleanInput(body); } catch (e) { throw fail(400, e.message); }
        return res.status(200).json({ ...estimate(input.script), token:sign({ kind:'quote', exp:Date.now() + 10 * 60000, hash:digest(JSON.stringify(input)) }, password()) });
      }
      if (action === 'generate' && req.method === 'POST') {
        let input; try { input = cleanInput(body); } catch (e) { throw fail(400, e.message); }
        const quote = verify(body.quote, password(), 'quote');
        if (!quote || quote.hash !== digest(JSON.stringify(input)) || body.confirmed !== true) throw fail(409, 'Review this exact script and cost estimate again before generating.');
        const fingerprint = digest(input.presenter + '\n' + input.script);
        const dedupKey = PREFIX + 'request:' + fingerprint;
        const existing = await redis('GET', dedupKey);
        if (existing) { const job = await readJob(existing); if (!job) throw fail(409, 'An earlier submission is being checked. Please wait; do not resubmit.'); return res.status(200).json({ job:publicJob(job), reused:true }); }
        await limit('create', 5, 3600);
        const [, account] = await Promise.all([checkLook(input.presenter), heygen('/users/me')]);
        if (account.billing_type === 'subscription') throw fail(409, 'This key reports subscription billing. Use your HeyGen developer API key.');
        if (account.wallet?.currency === 'usd' && account.wallet.remaining_balance < estimate(input.script).usd) throw fail(409, 'Your HeyGen API balance is below the estimated cost.');
        const job = { ...input, id:randomUUID(), createdAt:Date.now(), status:'submitting' };
        const acquired = await redis('SET', dedupKey, job.id, 'NX', 'EX', '86400');
        if (!acquired) throw fail(409, 'This script is already being submitted. Refresh your clips.');
        await saveJob(job);
        await redis('ZADD', PREFIX + 'jobs', String(job.createdAt), job.id);
        try {
          const result = await heygen('/videos', { type:'avatar', avatar_id:PRESENTERS[input.presenter].id, voice_id:PRESENTERS[input.presenter].voice, script:input.script, engine:{type:'avatar_iv'}, aspect_ratio:'1:1', resolution:'1080p', output_format:'mp4', caption:{file_format:'srt'}, title:'Restless Faith · ' + input.presenter + ' · ' + input.question });
          if (!result.video_id && !result.id) throw new Error('Missing video id');
          job.videoId = result.video_id || result.id; job.status = result.status || 'waiting';
        } catch (e) {
          job.status = e.definitive ? 'failed' : 'unknown';
          job.error = e.definitive ? e.message : 'HeyGen may have received this request. Do not submit it again; check your HeyGen dashboard first.';
          if (!e.definitive) await redis('SET', dedupKey, job.id, 'EX', String(KEEP_SECONDS));
          // Keep the reservation even on uncertain failures. Never repeat a paid POST automatically.
        }
        await saveJob(job);
        return res.status(202).json({ job:publicJob(job) });
      }
      if (action === 'jobs' && req.method === 'GET') {
        const ids = await redis('ZREVRANGE', PREFIX + 'jobs', '0', '19');
        const jobs = await Promise.all((ids || []).map(readJob));
        return res.status(200).json({ jobs:jobs.filter(Boolean).map(publicJob) });
      }
      if (action === 'job' && req.method === 'GET') {
        const id = url.searchParams.get('id');
        if (!/^[\da-f-]{36}$/.test(id || '')) throw fail(400, 'Invalid clip ID.');
        const job = await readJob(id); if (!job) throw fail(404, 'Clip not found in this studio.');
        if (job.videoId) {
          await limit('reads', 300, 60);
          const video = await heygen('/videos/' + encodeURIComponent(job.videoId));
          job.status = video.status; job.duration = video.duration;
          job.videoUrl = safeMediaUrl(video.video_url); job.subtitleUrl = safeMediaUrl(video.subtitle_url);
          if (video.status === 'failed') job.error = 'HeyGen could not render this clip. Check the video in your HeyGen dashboard.';
          await saveJob(job);
        }
        return res.status(200).json({ job:publicJob(job) });
      }
      throw fail(404, 'Unknown Studio action.');
    } catch (error) {
      return res.status(error.status || 503).json({ error:error.status ? error.message : 'The Studio connection is unavailable. Refresh your clips before trying anything again.' });
    }
  };
}
