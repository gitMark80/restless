import React, { useState, useRef, useEffect } from "react";
import { Send, ChevronDown, BookOpen, Cross, Sun, Moon, Share2, Check } from "lucide-react";

const AGE_BANDS = ["Child", "Teen", "Adult", "Senior"];

const THEMES = {
  dark: {
    bg: "#0F1420",
    border: "rgba(201,161,92,0.2)",
    cardBg: "#1B2233",
    citationBg: "#161C2C",
    citationBorder: "rgba(201,161,92,0.3)",
    text: "#EDE7DA",
    subtext: "#B8AF9C",
    accent: "#C9A15C",
    accentSecondary: "#7A2E2E",
    accentText: "#0F1420",
    placeholder: "#6B7280",
    disabledBg: "#1B2233",
    disabledText: "#4A5266",
    toggleInactiveBg: "#1B2233",
    dotColor: "rgba(201,161,92,0.6)",
  },
  light: {
    bg: "#FBF7EE",
    border: "rgba(122,46,46,0.15)",
    cardBg: "#FFFFFF",
    citationBg: "#F3ECDC",
    citationBorder: "rgba(122,46,46,0.25)",
    text: "#241F14",
    subtext: "#6B6152",
    accent: "#7A2E2E",
    accentSecondary: "#C9A15C",
    accentText: "#FBF7EE",
    placeholder: "#9C9284",
    disabledBg: "#EFE8D8",
    disabledText: "#B8AF9C",
    toggleInactiveBg: "#F3ECDC",
    dotColor: "rgba(122,46,46,0.5)",
  },
};

const STRINGS = {
  en: {
    tagline: "Our hearts are restless until they rest in You",
    ageLabels: { Child: "Child", Teen: "Teen", Adult: "Adult", Senior: "Senior" },
    placeholder: "Ask about faith, Scripture, or Church teaching…",
    retryError: "That didn't come through. Tap send again to retry.",
    langToggleLabel: "Switch to Spanish",
    shareLabel: "Share this question and answer",
    shareFooter: "Shared from Restless — restless.faith",
    copiedLabel: "Copied",
  },
  es: {
    tagline: "Nuestro corazón está inquieto hasta que descanse en Ti",
    ageLabels: { Child: "Niño", Teen: "Adolescente", Adult: "Adulto", Senior: "Mayor" },
    placeholder: "Pregunta sobre la fe, la Escritura o la enseñanza de la Iglesia…",
    retryError: "Eso no llegó. Toca enviar para volver a intentarlo.",
    langToggleLabel: "Cambiar a inglés",
    shareLabel: "Compartir esta pregunta y respuesta",
    shareFooter: "Compartido desde Restless — restless.faith",
    copiedLabel: "Copiado",
  },
};

const SEED_MESSAGES = {
  en: [
    { id: 1, role: "user", text: "Why does God let good people suffer?" },
    {
      id: 2,
      role: "companion",
      text: "This question sits at the very center of the human heart, and you're in good company asking it — even the Psalms are full of this cry. The short answer the Church gives isn't that suffering is good, but that God can bring good even out of what is not good, without ever willing the evil itself. Suffering entered through brokenness and human freedom, not because God delights in it. And in Christ, God didn't stay distant from suffering — He entered into it.",
      sources: [
        {
          label: "Catechism of the Catholic Church, §309–310",
          detail:
            "On the mystery of evil and suffering existing alongside a good and provident God, and how this is not fully answered by faith alone but held in hope.",
        },
        {
          label: "Bishop Robert Barron",
          detail:
            "Often teaches that the Cross doesn't explain suffering away — it shows that God chooses solidarity with the sufferer rather than distance from them.",
        },
      ],
    },
  ],
  es: [
    { id: 1, role: "user", text: "¿Por qué Dios permite que sufra la gente buena?" },
    {
      id: 2,
      role: "companion",
      text: "Esta pregunta está en el centro mismo del corazón humano, y estás en buena compañía al hacerla — hasta los Salmos están llenos de este clamor. La respuesta breve que da la Iglesia no es que el sufrimiento sea bueno, sino que Dios puede sacar el bien incluso de lo que no es bueno, sin nunca querer el mal en sí. El sufrimiento entró por el quebranto y la libertad humana, no porque Dios se deleite en él. Y en Cristo, Dios no se quedó distante del sufrimiento — entró en él.",
      sources: [
        {
          label: "Catecismo de la Iglesia Católica, §309–310",
          detail:
            "Sobre el misterio del mal y el sufrimiento que existen junto a un Dios bueno y provi­dente, y cómo esto no se responde solo con la fe, sino que se sostiene en la esperanza.",
        },
        {
          label: "Obispo Robert Barron",
          detail:
            "Suele enseñar que la Cruz no explica el sufrimiento — muestra que Dios elige la solidaridad con quien sufre en lugar de la distancia.",
        },
      ],
    },
  ],
};

async function askCompanion(question, ageBand, language) {
  const response = await fetch("/api/ask", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, ageBand, language }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Something went wrong. Please try again.");
  }

  return data;
}

function CitationCard({ source, isOpen, onToggle, theme }) {
  return (
    <div
      className="min-w-0"
      style={{
        border: `1px solid ${theme.citationBorder}`,
        borderRadius: "0.5rem",
        overflow: "hidden",
        backgroundColor: theme.citationBg,
      }}
    >
      <button
        onClick={onToggle}
        style={{ width: "100%", padding: "0.75rem 1rem" }}
        className="flex items-center justify-between gap-3 text-left"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <BookOpen className="w-4 h-4 shrink-0" style={{ color: theme.accent }} />
          <span
            className="font-medium truncate"
            style={{ color: theme.text, fontSize: "18px" }}
          >
            {source.label}
          </span>
        </div>
        <ChevronDown
          className="w-4 h-4 shrink-0 transition-transform duration-300"
          style={{ color: theme.accent, transform: isOpen ? "rotate(180deg)" : "none" }}
        />
      </button>
      <div
        className="grid transition-all duration-300 ease-out"
        style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <div style={{ padding: "0 1rem 1rem 1rem" }}>
            <div style={{ paddingLeft: "1.5rem", borderLeft: `2px solid ${theme.citationBorder}` }}>
              <p
                className="leading-relaxed italic"
                style={{ color: theme.subtext, fontSize: "18px", overflowWrap: "break-word", wordBreak: "break-word" }}
              >
                {source.detail}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ShareButton({ questionText, answerText, theme, strings }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareText = `Q: ${questionText}\n\nA: ${answerText}\n\n${strings.shareFooter}`;

    if (navigator.share) {
      try {
        await navigator.share({ text: shareText });
      } catch (err) {
        // User cancelled the native share sheet — no action needed.
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Clipboard blocked — nothing more we can do here.
    }
  };

  return (
    <button
      onClick={handleShare}
      aria-label={strings.shareLabel}
      className="flex items-center gap-1.5 shrink-0"
      style={{ color: theme.subtext, fontSize: "14px", padding: "0.25rem 0" }}
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5" style={{ color: theme.accent }} />
          <span style={{ color: theme.accent }}>{strings.copiedLabel}</span>
        </>
      ) : (
        <>
          <Share2 className="w-3.5 h-3.5" />
          <span>{strings.shareLabel}</span>
        </>
      )}
    </button>
  );
}

function CompanionMessage({ message, questionText, theme, strings }) {
  const [openSources, setOpenSources] = useState({});
  const toggleSource = (idx) =>
    setOpenSources((prev) => ({ ...prev, [idx]: !prev[idx] }));

  return (
    <div className="flex justify-start min-w-0" style={{ maxWidth: "94%" }}>
      <div className="space-y-3 min-w-0 flex-1">
        <div
          className="rounded-3xl px-5 py-3.5"
          style={{ backgroundColor: theme.cardBg, borderBottomLeftRadius: "0.5rem" }}
        >
          <p
            className="leading-relaxed"
            style={{ color: theme.text, fontSize: "20px", overflowWrap: "break-word", wordBreak: "break-word" }}
          >
            {message.text}
          </p>
        </div>
        {message.sources && (
          <div className="space-y-2">
            {message.sources.map((source, idx) => (
              <CitationCard
                key={idx}
                source={source}
                isOpen={!!openSources[idx]}
                onToggle={() => toggleSource(idx)}
                theme={theme}
              />
            ))}
          </div>
        )}
        {questionText && (
          <ShareButton
            questionText={questionText}
            answerText={message.text}
            theme={theme}
            strings={strings}
          />
        )}
      </div>
    </div>
  );
}

function UserMessage({ message, theme }) {
  return (
    <div className="flex justify-end min-w-0">
      <div
        className="rounded-3xl px-5 py-3.5 min-w-0"
        style={{
          maxWidth: "94%",
          backgroundColor: theme.accent,
          borderBottomRightRadius: "0.5rem",
        }}
      >
        <p
          className="leading-relaxed"
          style={{ color: theme.accentText, fontSize: "20px", overflowWrap: "break-word", wordBreak: "break-word" }}
        >
          {message.text}
        </p>
      </div>
    </div>
  );
}

export default function Restless() {
  const [language, setLanguage] = useState("en");
  const [messages, setMessages] = useState(SEED_MESSAGES.en);
  const [input, setInput] = useState("");
  const [ageBand, setAgeBand] = useState("Adult");
  const [isTyping, setIsTyping] = useState(false);
  const [mode, setMode] = useState("dark");
  const [error, setError] = useState(null);
  const theme = THEMES[mode];
  const strings = STRINGS[language];
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isTyping]);

  useEffect(() => {
    document.documentElement.style.overflowX = "hidden";
    document.body.style.overflowX = "hidden";
    document.body.style.margin = "0";
  }, []);

  const handleLanguageToggle = () => {
    const next = language === "en" ? "es" : "en";
    setLanguage(next);
    // Reset to that language's seed conversation so the transcript stays coherent.
    setMessages(SEED_MESSAGES[next]);
    setError(null);
  };

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isTyping) return;
    setMessages((prev) => [...prev, { id: Date.now(), role: "user", text: trimmed }]);
    setInput("");
    setIsTyping(true);
    setError(null);

    try {
      const result = await askCompanion(trimmed, ageBand, language);
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: "companion", text: result.text, sources: result.sources || [] },
      ]);
    } catch (err) {
      setIsTyping(false);
      setError(err && err.message ? err.message : strings.retryError);
      setInput(trimmed);
      setMessages((prev) => prev.slice(0, -1));
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      className="flex flex-col overflow-x-hidden"
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: theme.bg,
        fontFamily: 'Arial, Helvetica, "Helvetica Neue", sans-serif',
        overscrollBehaviorX: "none",
        touchAction: "pan-y",
      }}
    >
      <div
        className="shrink-0 px-5 py-4"
        style={{ borderBottom: `1px solid ${theme.border}`, backgroundColor: theme.bg }}
      >
        <div className="flex items-center justify-between max-w-2xl mx-auto w-full">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentSecondary})`,
              }}
            >
              <Cross className="w-4 h-4" style={{ color: theme.bg }} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="font-semibold leading-tight" style={{ color: theme.text, fontSize: "20px" }}>
                Restless
              </h1>
              <p className="leading-tight" style={{ color: theme.subtext, fontSize: "16px" }}>
                {strings.tagline}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleLanguageToggle}
              aria-label={strings.langToggleLabel}
              className="h-9 px-3 rounded-full flex items-center justify-center gap-1"
              style={{ backgroundColor: theme.toggleInactiveBg }}
            >
              <span
                style={{
                  color: language === "en" ? theme.accent : theme.subtext,
                  fontWeight: language === "en" ? 700 : 400,
                  fontSize: "14px",
                }}
              >
                EN
              </span>
              <span style={{ color: theme.subtext, fontSize: "14px" }}>/</span>
              <span
                style={{
                  color: language === "es" ? theme.accent : theme.subtext,
                  fontWeight: language === "es" ? 700 : 400,
                  fontSize: "14px",
                }}
              >
                ES
              </span>
            </button>
            <button
              onClick={() => setMode(mode === "dark" ? "light" : "dark")}
              className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
              style={{ backgroundColor: theme.toggleInactiveBg }}
              aria-label="Toggle light and dark mode"
            >
              {mode === "dark" ? (
                <Sun className="w-4 h-4" style={{ color: theme.accent }} />
              ) : (
                <Moon className="w-4 h-4" style={{ color: theme.accent }} />
              )}
            </button>
          </div>
        </div>
        <div className="max-w-2xl mx-auto w-full mt-3 flex gap-1.5">
          {AGE_BANDS.map((band) => (
            <button
              key={band}
              onClick={() => setAgeBand(band)}
              className="px-3 py-1 rounded-full transition-colors"
              style={
                ageBand === band
                  ? { backgroundColor: theme.accent, color: theme.accentText, fontWeight: 500, fontSize: "14px" }
                  : { backgroundColor: theme.toggleInactiveBg, color: theme.subtext, fontSize: "14px" }
              }
            >
              {strings.ageLabels[band]}
            </button>
          ))}
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-6">
        <div className="max-w-2xl mx-auto w-full space-y-4 min-w-0">
          {messages.map((msg, idx) =>
            msg.role === "user" ? (
              <UserMessage key={msg.id} message={msg} theme={theme} />
            ) : (
              <CompanionMessage
                key={msg.id}
                message={msg}
                questionText={idx > 0 ? messages[idx - 1].text : null}
                theme={theme}
                strings={strings}
              />
            )
          )}
          {isTyping && (
            <div className="flex justify-start">
              <div
                className="rounded-3xl px-5 py-4 flex items-center gap-1.5"
                style={{ backgroundColor: theme.cardBg, borderBottomLeftRadius: "0.5rem" }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full animate-bounce"
                  style={{ backgroundColor: theme.dotColor, animationDelay: "-0.3s" }}
                />
                <span
                  className="w-1.5 h-1.5 rounded-full animate-bounce"
                  style={{ backgroundColor: theme.dotColor, animationDelay: "-0.15s" }}
                />
                <span
                  className="w-1.5 h-1.5 rounded-full animate-bounce"
                  style={{ backgroundColor: theme.dotColor }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div
        className="shrink-0 px-5 py-4"
        style={{ borderTop: `1px solid ${theme.border}`, backgroundColor: theme.bg }}
      >
        {error && (
          <div className="max-w-2xl mx-auto w-full mb-2">
            <p style={{ color: theme.accentSecondary, fontSize: "14px" }}>
              {error}
            </p>
          </div>
        )}
        <div className="max-w-2xl mx-auto w-full flex items-end gap-2.5 min-w-0">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={strings.placeholder}
            rows={4}
            className="flex-1 min-w-0 resize-none rounded-xl px-4 py-3 focus:outline-none overflow-y-auto max-h-40"
            style={{ backgroundColor: theme.cardBg, color: theme.text, fontSize: "20px", boxSizing: "border-box", width: "100%" }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="shrink-0 w-11 h-11 rounded-xl flex items-center justify-center transition-colors"
            style={
              input.trim()
                ? { backgroundColor: theme.accent, color: theme.accentText }
                : { backgroundColor: theme.disabledBg, color: theme.disabledText }
            }
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
