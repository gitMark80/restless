import test from 'node:test';
import assert from 'node:assert/strict';
import { makeHandler, sign, verify, cookie, cleanInput, estimate, safeMediaUrl, PREFIX } from '../server/reel-studio.js';
const PASSWORD = 'test-only-studio-password';
function fixture({ apiError, redisDown = false, password = PASSWORD } = {}) {
  const data = new Map(), jobs = [], calls = [];
  const fetcher = async (url, options = {}) => {
    if (url === 'https://redis.test') {
      if (redisDown) return {ok:false};
      const [command, ...args] = JSON.parse(options.body); let result = null;
      if (command === 'EVAL') { result = +(data.get(args[2]) || 0) + 1; data.set(args[2], result); }
      if (command === 'GET') result = data.get(args[0]) ?? null;
      if (command === 'SET') { if (!args.includes('NX') || !data.has(args[0])) { data.set(args[0], args[1]); result = 'OK'; } }
      if (command === 'ZADD') { jobs.push(args[2]); result = 1; }
      if (command === 'ZREVRANGE') result = [...jobs].reverse().slice(0, 20);
      return {ok:true, json:async()=>({result})};
    }
    calls.push({url, ...options});
    if (url.includes('/avatars/looks/')) return {ok:true,json:async()=>({data:{status:'completed',avatar_type:'photo_avatar',supported_api_engines:['avatar_iv']}})};
    if (url.endsWith('/users/me')) return {ok:true,json:async()=>({data:{email:'private@example.test',billing_type:'wallet',wallet:{currency:'usd',remaining_balance:15}}})};
    if (url.endsWith('/videos') && options.method === 'POST') {
      if (apiError === 'timeout') throw new Error('Uncertain outcome');
      if (apiError === 'unauthorized') return {ok:false,status:401,json:async()=>({error:{message:'secret error DO NOT EXPOSE'}})};
      return {ok:true,json:async()=>({data:{video_id:'test-video-1',status:'waiting'}})};
    }
    if (url.endsWith('/videos/test-video-1')) return {ok:true,json:async()=>({data:{status:'completed',duration:35,video_url:'https://files2.heygen.ai/video.mp4',subtitle_url:'https://files2.heygen.ai/file.srt'}})};
    throw new Error('Unexpected network call: ' + url);
  };
  const handler = makeHandler({env:{REEL_STUDIO_PASSWORD:password,HEYGEN_API_KEY:'not-a-real-key',KV_REST_API_URL:'https://redis.test',KV_REST_API_TOKEN:'fake-redis'},fetcher});
  const auth = cookie(sign({kind:'session',exp:Date.now()+60000},PASSWORD)).split(';')[0];
  async function call(action, body, {authenticated = true, origin = 'https://restless.faith'} = {}) {
    let status, result; const headers = {};
    await handler({method:body ? 'POST':'GET',url:'/api/reel-studio' + (body ? '' : '?action='+action),body:body ? {action,...body}:undefined,headers:{origin,'content-type':'application/json',cookie:authenticated ? auth : '', 'x-vercel-forwarded-for':'192.0.2.1'}},{setHeader:(k,v)=>headers[k]=v,status(n){status=n;return this},json(v){result=v;return this}});
    return {status,result,headers};
  }
  return {call,calls,data};
}
const input = {presenter:'Gemma',script:"An exact script — don't rewrite it.\n- Keep this line",question:'Does God exist?',level:'Adult',sources:[{label:'CCC §31'}]};
const generate = async f => {
  const q = await f.call('quote', input);
  return f.call('generate',{...input,quote:q.result.token,confirmed:true});
};
test('sessions reject tampering, expiration and password changes', () => {
  const t = sign({kind:'session',exp:1000},PASSWORD);
  assert.ok(verify(t,PASSWORD,'session',999));
  assert.equal(verify(t,PASSWORD,'session',1000),null);
  assert.equal(verify(t+'x',PASSWORD,'session',999),null);
  assert.equal(verify(t,'different-password','session',999),null);
  assert.match(cookie(t),/HttpOnly; Secure; SameSite=Strict/);
});
test('missing password fails closed without calling HeyGen', async () => {
  const f=fixture({password:''});
  assert.equal((await f.call('session')).result.setup.password,false);
  assert.equal((await f.call('generate',input)).status,503);
  assert.equal(f.calls.length,0);
});
test('login requires correct password and has a durable attempt limit', async () => {
  const f=fixture();
  assert.equal((await f.call('login',{password:'wrong'},{authenticated:false})).status,401);
  const ok=await f.call('login',{password:PASSWORD},{authenticated:false});
  assert.equal(ok.status,200); assert.match(ok.headers['Set-Cookie'],/HttpOnly/);
  for(let i=0;i<8;i++) await f.call('login',{password:'wrong'},{authenticated:false});
  assert.equal((await f.call('login',{password:PASSWORD},{authenticated:false})).status,429);
});
test('paid calls require authentication, same-origin JSON, storage and review', async () => {
  const f=fixture();
  assert.equal((await f.call('generate',input,{authenticated:false})).status,401);
  assert.equal((await f.call('generate',input,{origin:'https://evil.test'})).status,403);
  assert.equal((await f.call('generate',input)).status,409);
  assert.equal((await generate(fixture({redisDown:true}))).status,503);
  assert.equal(f.calls.length,0);
});
test('review token binds all approved content and no generation occurs after edits', async () => {
  const f=fixture(); const q=await f.call('quote',input);
  assert.equal((await f.call('generate',{...input,script:'Changed',quote:q.result.token,confirmed:true})).status,409);
  assert.equal((await f.call('generate',{...input,quote:q.result.token,confirmed:false})).status,409);
  assert.equal(f.calls.length,0);
});
test('exact script reaches Avatar IV using API key, without transformations', async () => {
  const f=fixture(); const r=await generate(f);
  assert.equal(r.status,202); assert.equal(r.result.job.videoId,'test-video-1');
  const request=f.calls.find(x=>x.method==='POST'); const payload=JSON.parse(request.body);
  assert.equal(payload.script,input.script); assert.equal(payload.engine.type,'avatar_iv');
  assert.equal(payload.aspect_ratio,'1:1'); assert.equal(payload.resolution,'1080p');
  assert.equal(request.headers['X-Api-Key'],'not-a-real-key');
  assert.ok(!JSON.stringify(r.result).includes('not-a-real-key'));
});
test('repeated and concurrent approvals create only one paid video', async () => {
  const f=fixture(); const q=await f.call('quote',input);
  const body={...input,quote:q.result.token,confirmed:true};
  await Promise.all([f.call('generate',body),f.call('generate',body)]);
  const repeated=await f.call('generate',body);
  assert.equal(repeated.result.reused,true);
  assert.equal(f.calls.filter(x=>x.method==='POST').length,1);
});
test('ambiguous submission failure is retained and never automatically retried', async () => {
  const f=fixture({apiError:'timeout'}); const first=await generate(f); const second=await generate(f);
  assert.equal(first.result.job.status,'unknown'); assert.equal(second.result.reused,true);
  assert.equal(f.calls.filter(x=>x.method==='POST').length,1);
});
test('provider errors are sanitized and account details stay private', async () => {
  const f=fixture({apiError:'unauthorized'}); const r=await generate(f);
  assert.equal(r.result.job.status,'failed'); assert.ok(!JSON.stringify(r).includes('DO NOT EXPOSE'));
  const account=await f.call('account'); assert.equal(account.result.balance,15);
  assert.ok(!JSON.stringify(account).includes('private@example'));
});
test('only Studio-owned jobs can be polled; completed jobs recover after refresh', async () => {
  const f=fixture(); const r=await generate(f);
  assert.equal((await f.call('job&id=00000000-0000-0000-0000-000000000000')).status,404);
  const done=await f.call('job&id='+r.result.job.id);
  assert.equal(done.result.job.status,'completed'); assert.match(done.result.job.videoUrl,/^https:/);
  assert.equal((await f.call('jobs')).result.jobs[0].script,input.script);
});
test('input bounds, URL safety and estimates', () => {
  assert.throws(()=>cleanInput({...input,presenter:'__proto__'}));
  assert.throws(()=>cleanInput({...input,script:'a '.repeat(451)}));
  assert.equal(cleanInput(input).script,input.script);
  assert.equal(estimate('word '.repeat(150)).usd,2.31);
  assert.equal(safeMediaUrl('https://files2.heygen.ai/test.mp4'),'https://files2.heygen.ai/test.mp4');
  for(const u of ['javascript:alert(1)','https://heygen.ai.evil.test/x','http://files2.heygen.ai/x','https://a:b@files2.heygen.ai/x']) assert.equal(safeMediaUrl(u),null);
});
