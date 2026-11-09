// One user-initiated dictation session. No audio is stored or sent to our API.
export function createDictationSession({ Recognition, language, initialText, onText, onEnd, onError }) {
  const recognition = new Recognition();
  recognition.lang = language === "es" ? "es-ES" : "en-US";
  recognition.continuous = true;
  recognition.interimResults = true;
  let closed = false;
  let stopTimer;
  const finish = () => {
    if (closed) return;
    closed = true;
    clearTimeout(stopTimer);
    recognition.onresult = recognition.onerror = recognition.onend = null;
    onEnd();
  };
  recognition.onresult = (event) => {
    if (closed) return;
    // Results are cumulative; replace the interim portion instead of appending it twice.
    const spoken = Array.from(event.results, (result) => result[0].transcript).join(" ").trim();
    onText([initialText.trimEnd(), spoken].filter(Boolean).join(" ").slice(0, 1000));
  };
  recognition.onend = finish;
  recognition.onerror = (event) => {
    if (closed) return;
    if (event.error !== "aborted") onError(event.error);
    finish();
    try { recognition.abort(); } catch { /* already ended */ }
  };
  return {
    start() {
      try { recognition.start(); } catch {
        onError("unavailable");
        finish();
      }
    },
    stop() {
      if (closed) return;
      // stop() allows the recognizer to deliver its final transcript.
      try { recognition.stop(); } catch { finish(); }
      if (closed) return;
      stopTimer = setTimeout(() => {
        finish();
        try { recognition.abort(); } catch { /* already ended */ }
      }, 1500);
    },
    abort() {
      finish();
      try { recognition.abort(); } catch { /* already ended */ }
    },
  };
}
