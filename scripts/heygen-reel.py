#!/usr/bin/env python3
"""
Make a HeyGen avatar video over a restless.faith reel recording.

  python3 scripts/heygen-reel.py --video ~/Desktop/take.mp4 --question "Why do Catholics kneel at Mass?"

What it does
  1. Asks restless.faith for the real answer to the question (same answer the reel shows).
  2. Condenses it into a spoken script that fits the video length (about 2.4 words per second).
  3. Uploads the recording to HeyGen as the background, puts your avatar in the bottom-left corner,
     and has it read the script.
  4. Polls until the render is done and saves the MP4 next to the recording (or where --out says).

Setup (once)
  export HEYGEN_API_KEY=...        # from HeyGen > Settings > API
  export HEYGEN_AVATAR_ID=...      # your avatar id (HeyGen > Avatars, or GET /v2/avatars)
  export HEYGEN_VOICE_ID=...       # the voice to use (GET /v2/voices)
  export ANTHROPIC_API_KEY=...     # for the script condensing (any Claude key)

Useful flags
  --seconds 50            target spoken length (default: the video's duration if ffprobe is installed, else 50)
  --script-file notes.txt use your own script instead of generating one
  --dry-run               print the script and stop; nothing is uploaded or billed
  --scale 0.4 --x -0.28 --y 0.3   avatar size and position (negative x = left, positive y = down); tweak after a first run
  --style circle          circle-cropped avatar instead of the normal cut-out
  --level "High School"   answer level, same choices as the site

Only the standard library is used, so there's nothing to install.
"""
import argparse, json, os, re, subprocess, sys, time, urllib.request, urllib.error
from datetime import date
from pathlib import Path

HEYGEN = "https://api.heygen.com"
UPLOAD = "https://upload.heygen.com/v1/asset"
RESTLESS = "https://restless.faith/api/ask"
ANTHROPIC = "https://api.anthropic.com/v1/messages"


def http(url, data=None, headers=None, method=None, raw=None, timeout=120):
    body = raw if raw is not None else (json.dumps(data).encode() if data is not None else None)
    req = urllib.request.Request(url, data=body, method=method or ("POST" if body is not None else "GET"))
    for k, v in (headers or {}).items():
        req.add_header(k, v)
    if raw is None and body is not None:
        req.add_header("Content-Type", "application/json")
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            return json.loads(r.read().decode() or "{}")
    except urllib.error.HTTPError as e:
        msg = e.read().decode(errors="replace")[:600]
        sys.exit(f"HTTP {e.code} from {url}\n{msg}")


def need(name):
    v = os.environ.get(name)
    if not v:
        sys.exit(f"Set {name} in your environment first (see the top of this file).")
    return v


def video_seconds(path):
    try:
        out = subprocess.run(
            ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(path)],
            capture_output=True, text=True, timeout=30,
        ).stdout.strip()
        return float(out)
    except Exception:
        return None


def fetch_answer(question, level):
    today = date.today().isoformat()
    data = http(RESTLESS, {"question": question, "ageBand": level, "language": "en", "todayDate": today, "history": []})
    if not data.get("text"):
        sys.exit("restless.faith didn't return an answer; try again in a minute.")
    return data["text"], data.get("sources") or []


def condense(question, answer, sources, words):
    key = need("ANTHROPIC_API_KEY")
    src = "; ".join(s.get("label", "") for s in sources if s.get("label"))
    prompt = f"""You are writing the spoken script for a short vertical video. On screen, restless.faith is answering this question:

"{question}"

Here is the full on-screen answer:
---
{answer}
---
Sources shown on screen: {src or "none"}

Write what a warm, plain-spoken Catholic host says to camera while that answer appears. Rules:
- About {words} words. Not more. It must be spoken in the time available.
- Open by restating the question in your own words in one short line, then give the heart of the answer faithfully. Do not add claims that are not in the on-screen answer; do not soften or sharpen the Church's teaching.
- Conversational, first person plural where natural ("we", "us"), no lists, no headings, no stage directions, no emojis, no hashtags.
- End with one short line inviting people to ask their own question at restless dot faith, link in bio.
Return only the script text."""
    data = http(
        ANTHROPIC,
        {"model": os.environ.get("ANTHROPIC_MODEL", "claude-sonnet-4-5"), "max_tokens": 600,
         "messages": [{"role": "user", "content": prompt}]},
        headers={"x-api-key": key, "anthropic-version": "2023-06-01"},
    )
    text = "".join(b.get("text", "") for b in data.get("content", []) if b.get("type") == "text").strip()
    if not text:
        sys.exit("Script generation came back empty.")
    return text


def upload_asset(path):
    key = need("HEYGEN_API_KEY")
    raw = Path(path).read_bytes()
    ctype = "video/quicktime" if str(path).lower().endswith(".mov") else "video/mp4"
    data = http(UPLOAD, raw=raw, headers={"x-api-key": key, "Content-Type": ctype}, timeout=600)
    d = data.get("data") or {}
    if not d.get("id"):
        sys.exit(f"Upload didn't return an asset id: {json.dumps(data)[:400]}")
    return d["id"], d.get("url")


def generate(asset_id, asset_url, script, args):
    key = need("HEYGEN_API_KEY")
    background = {"type": "video", "play_style": "fit_to_scene", "fit": "cover"}
    if asset_id:
        background["video_asset_id"] = asset_id
    else:
        background["url"] = asset_url
    body = {
        "title": args.title or f"Restless reel: {args.question[:60]}",
        "dimension": {"width": 1080, "height": 1920},
        "video_inputs": [{
            "character": {
                "type": "avatar", "avatar_id": need("HEYGEN_AVATAR_ID"), "avatar_style": args.style,
                "scale": args.scale, "offset": {"x": args.x, "y": args.y},
            },
            "voice": {"type": "text", "voice_id": need("HEYGEN_VOICE_ID"), "input_text": script, "speed": args.speed},
            "background": background,
        }],
    }
    data = http(f"{HEYGEN}/v2/video/generate", body, headers={"x-api-key": key})
    vid = (data.get("data") or {}).get("video_id")
    if not vid:
        sys.exit(f"Generate didn't return a video id: {json.dumps(data)[:400]}")
    return vid


def wait_and_download(video_id, out_path):
    key = need("HEYGEN_API_KEY")
    print(f"HeyGen is rendering (video {video_id}). This usually takes a few minutes.", flush=True)
    started = time.time()
    while True:
        data = http(f"{HEYGEN}/v1/video_status.get?video_id={video_id}", headers={"x-api-key": key})
        d = data.get("data") or {}
        status = d.get("status")
        if status == "completed":
            url = d.get("video_url")
            if not url:
                sys.exit("Completed but no video_url in the response.")
            print("Downloading…", flush=True)
            urllib.request.urlretrieve(url, out_path)
            return out_path
        if status in ("failed", "error"):
            sys.exit(f"HeyGen reported a failure: {json.dumps(d.get('error') or d)[:600]}")
        mins = int((time.time() - started) // 60)
        print(f"  status: {status or 'pending'} ({mins} min)", flush=True)
        if time.time() - started > 60 * 30:
            sys.exit("Gave up after 30 minutes; check the video in your HeyGen dashboard.")
        time.sleep(15)


def main():
    p = argparse.ArgumentParser(description="Avatar video over a restless.faith reel recording.")
    p.add_argument("--video", required=True, help="the screen recording of the reel (.mp4 or .mov)")
    p.add_argument("--question", required=True, help="the question the reel answers, exactly as typed in Reel Studio")
    p.add_argument("--level", default="High School", choices=["Middle School", "High School", "College", "OCIA", "Adult"])
    p.add_argument("--seconds", type=float, help="target spoken length; default: the video's length, else 50")
    p.add_argument("--script-file", help="use this text as the script instead of generating one")
    p.add_argument("--out", help="where to save the finished MP4 (default: next to the recording)")
    p.add_argument("--title", help="title in your HeyGen dashboard")
    p.add_argument("--scale", type=float, default=0.4, help="avatar size relative to the frame (default 0.4)")
    p.add_argument("--x", type=float, default=-0.28, help="horizontal offset; negative moves left (default -0.28)")
    p.add_argument("--y", type=float, default=0.3, help="vertical offset; positive moves down (default 0.3)")
    p.add_argument("--style", default="normal", choices=["normal", "circle", "closeUp"])
    p.add_argument("--speed", type=float, default=1.0, help="voice speed (default 1.0)")
    p.add_argument("--dry-run", action="store_true", help="print the script and stop (nothing uploaded or billed)")
    args = p.parse_args()

    video = Path(args.video).expanduser()
    if not video.exists():
        sys.exit(f"Can't find {video}")
    if args.level == "Adult":
        args.level = "OCIA"

    seconds = args.seconds or video_seconds(video) or 50
    words = max(40, int(seconds * 2.4) - 10)  # leave a breath at the end

    if args.script_file:
        script = Path(args.script_file).expanduser().read_text().strip()
    else:
        print("Fetching the answer from restless.faith…", flush=True)
        answer, sources = fetch_answer(args.question, args.level)
        print(f"Writing a ~{words}-word script for a {seconds:.0f}s video…", flush=True)
        script = condense(args.question, answer, sources, words)

    print("\n--- Script ---\n" + script + "\n--------------\n")
    wc = len(re.findall(r"\S+", script))
    print(f"{wc} words ≈ {wc / 2.4:.0f}s spoken (video is {seconds:.0f}s)\n")
    if args.dry_run:
        return

    out = Path(args.out).expanduser() if args.out else video.with_name(video.stem + "-avatar.mp4")
    print(f"Uploading {video.name} to HeyGen…", flush=True)
    asset_id, asset_url = upload_asset(video)
    vid = generate(asset_id, asset_url, script, args)
    wait_and_download(vid, out)
    print(f"\nSaved: {out}")


if __name__ == "__main__":
    main()
