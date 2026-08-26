import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  ChevronDown,
  BookOpen,
  Cross,
  Sun,
  Moon,
  Share2,
  Check,
  X,
  GraduationCap,
  ImageDown,
  RefreshCcw,
} from "lucide-react";

const AUDIENCES = ["Middle School", "High School", "College", "OCIA", "Adult"];

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
    tagline: "Modern questions.\nTimeless truth.",
    ageLabels: {
      "Middle School": "Middle school",
      "High School": "High school",
      College: "College",
      OCIA: "OCIA",
      Adult: "Adult",
    },
    audienceLabel: "Choose the answer level",
    studentTitle: "Studying theology? Ask anything.",
    studentBody: "Get a clear answer grounded in Catholic teaching, with sources you can use to keep studying.",
    starterQuestions: [
      "Why was the Arian heresy wrong?",
      "How do Catholics know Jesus is God?",
      "What is the Eucharist?",
      "Why do Catholics pray to saints?",
    ],
    startersLabel: "Try a question",
    placeholder: "What's on your mind?",
    retryError: "That didn't come through. Tap send again to retry.",
    retryLabel: "Try again",
    langToggleLabel: "Switch to Spanish",
    shareLabel: "Share this question and answer",
    shareFooter: "Shared from Restless — restless.faith",
    copiedLabel: "Copied",
    cardLabel: "Share card",
    cardSavedLabel: "Card saved",
    readFullText: "Read full text ↗",
    aboutLabel: "About",
    contactLabel: "Contact",
    closeLabel: "Close",
    aboutTitle: "About Restless",
    aboutBody:
      "Restless takes its name from a line by St. Augustine: \"Our hearts are restless until they rest in You.\" Restless helps you make sense of questions about the faith — the ones you can't quite put into words, and the ones you're not sure who to ask.\n\nEvery answer is grounded in the Catechism of the Catholic Church, Sacred Scripture, the Doctors of the Church, and papal encyclicals. Restless can describe how respected Catholic teachers explain a topic, but it never puts words in their mouths.\n\nNo account is required to talk with Restless, and nothing you ask is linked to who you are. Your questions aren't saved once you close the app — this is a space to be honest, not a place being watched.\n\nThis is a companion for the questions, not a substitute for a priest, a spiritual director, or a real conversation with someone who loves you. When something is bigger than a chat can hold, Restless will say so.",
    contactTitle: "Contact",
    contactBody:
      "Have a question, notice something that doesn't sound right, or want to bring Restless to your parish, school, or ministry website? Reach out below — every message gets read.",
    contactEmail: "hello@restless.faith",
    supportLabel: "Support Restless",
    supportTitle: "Support Restless",
    supportBody:
      "Restless.faith exists to help people bring their questions about faith, doubt, and meaning into conversation with the Catholic tradition — free, for anyone who needs it.\n\nIf Restless has helped you, consider supporting the cost of keeping it free for everyone else.\n\nRestless.faith is an independent project, not a registered nonprofit. Contributions are not tax-deductible.",
    supportButtonLabel: "Support Restless →",
    supportUrl: "https://buy.stripe.com/REPLACE_WITH_YOUR_PAYMENT_LINK",
  },
  es: {
    tagline: "Preguntas modernas.\nVerdad eterna.",
    ageLabels: {
      "Middle School": "Secundaria",
      "High School": "Preparatoria",
      College: "Universidad",
      OCIA: "OCIA",
      Adult: "Adulto",
    },
    audienceLabel: "Elige el nivel de la respuesta",
    studentTitle: "¿Estudias teología? Pregunta lo que quieras.",
    studentBody: "Recibe una respuesta clara basada en la enseñanza católica, con fuentes para seguir estudiando.",
    starterQuestions: [
      "¿Por qué estaba equivocada la herejía arriana?",
      "¿Cómo saben los católicos que Jesús es Dios?",
      "¿Qué es la Eucaristía?",
      "¿Por qué rezan los católicos a los santos?",
    ],
    startersLabel: "Prueba una pregunta",
    placeholder: "¿Cómo puedo ayudar?",
    retryError: "Eso no llegó. Toca enviar para volver a intentarlo.",
    retryLabel: "Intentar de nuevo",
    langToggleLabel: "Cambiar a inglés",
    shareLabel: "Compartir esta pregunta y respuesta",
    shareFooter: "Compartido desde Restless — restless.faith",
    copiedLabel: "Copiado",
    cardLabel: "Tarjeta para compartir",
    cardSavedLabel: "Tarjeta guardada",
    readFullText: "Leer el texto completo ↗",
    aboutLabel: "Acerca de",
    contactLabel: "Contacto",
    closeLabel: "Cerrar",
    aboutTitle: "Acerca de Restless",
    aboutBody:
      "Restless toma su nombre de una frase de San Agustín: \"Nuestro corazón está inquieto hasta que descanse en Ti\". Restless te ayuda a entender preguntas sobre la fe — las que no logras poner en palabras, y las que no sabes a quién preguntarle.\n\nCada respuesta se basa en el Catecismo de la Iglesia Católica, la Sagrada Escritura, los Doctores de la Iglesia y las encíclicas papales. Restless puede describir cómo respetados maestros católicos explican un tema, pero nunca pone palabras en su boca.\n\nNo se necesita una cuenta para hablar con Restless, y nada de lo que preguntas está vinculado a quién eres. Tus preguntas no se guardan al cerrar la app — este es un espacio para ser honesto, no un lugar donde te observan.\n\nEsto es un acompañante para las preguntas, no un sustituto de un sacerdote, un director espiritual, o una conversación real con alguien que te ama. Cuando algo es más grande de lo que un chat puede sostener, Restless lo dirá.",
    contactTitle: "Contacto",
    contactBody:
      "¿Tienes una pregunta, notaste algo que no suena bien, o quieres llevar Restless a tu parroquia, escuela o sitio de ministerio? Escríbenos abajo — leemos cada mensaje.",
    contactEmail: "hello@restless.faith",
    supportLabel: "Apoyar a Restless",
    supportTitle: "Apoyar a Restless",
    supportBody:
      "Restless.faith existe para ayudar a las personas a llevar sus preguntas sobre la fe, la duda y el sentido de la vida a un diálogo con la tradición católica — de forma gratuita, para quien lo necesite.\n\nSi Restless te ha ayudado, considera apoyar el costo de mantenerlo gratuito para todos los demás.\n\nRestless.faith es un proyecto independiente, no una organización sin fines de lucro registrada. Las contribuciones no son deducibles de impuestos.",
    supportButtonLabel: "Apoyar a Restless →",
    supportUrl: "https://buy.stripe.com/REPLACE_WITH_YOUR_PAYMENT_LINK",
  },
};

const SEED_MESSAGES = {
  en: [
    {
      id: 1,
      role: "companion",
      isSeed: true,
      text: "Hi there — I'm here for your questions about the faith, big or small. What would you like to know?",
    },
  ],
  es: [
    {
      id: 1,
      role: "companion",
      isSeed: true,
      text: "Bienvenido — me alegra que estés aquí. Sin importar cuán grande o pequeña sea la pregunta, haré lo posible por acompañarte a resolverla. Adelante, pregúntame lo que quieras.",
    },
  ],
};

async function askCompanion(question, ageBand, language, history) {
  const now = new Date();
  const todayDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 45000);
  let response;
  try {
    response = await fetch("/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, ageBand, language, todayDate, history }),
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || "Something went wrong. Please try again.");
  }

  if (!data.text || typeof data.text !== "string") {
    throw new Error("The answer was incomplete. Please try again.");
  }

  return data;
}

function wrapCanvasText(ctx, text, maxWidth, maxLines) {
  const normalized = text.replace(/\s+/g, " ").trim();
  const words = normalized.split(" ");
  const lines = [];
  let line = "";
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (ctx.measureText(candidate).width <= maxWidth) {
      line = candidate;
    } else {
      if (line) lines.push(line);
      line = word;
      if (lines.length === maxLines - 1) break;
    }
  }
  if (line && lines.length < maxLines) lines.push(line);
  if (lines.join(" ").length < normalized.length && lines.length) {
    lines[lines.length - 1] = `${lines[lines.length - 1].replace(/[.,;:!?]?$/, "")}…`;
  }
  return lines;
}

async function createShareCard(questionText, answerText) {
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1350;
  const ctx = canvas.getContext("2d");
  const gradient = ctx.createLinearGradient(0, 0, 1080, 1350);
  gradient.addColorStop(0, "#0F1420");
  gradient.addColorStop(1, "#1B2233");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#C9A15C";
  ctx.fillRect(76, 78, 8, 90);
  ctx.font = "700 48px Arial";
  ctx.fillText("Restless", 112, 120);
  ctx.fillStyle = "#B8AF9C";
  ctx.font = "400 30px Arial";
  ctx.fillText(".faith", 300, 120);
  ctx.fillText("Modern questions. Timeless truth.", 112, 162);

  ctx.fillStyle = "#C9A15C";
  ctx.font = "700 28px Arial";
  ctx.fillText("QUESTION", 76, 264);
  ctx.fillStyle = "#EDE7DA";
  ctx.font = "700 48px Arial";
  const questionLines = wrapCanvasText(ctx, questionText, 928, 4);
  questionLines.forEach((line, index) => ctx.fillText(line, 76, 330 + index * 62));

  const answerTop = 380 + questionLines.length * 62;
  ctx.strokeStyle = "rgba(201,161,92,0.35)";
  ctx.beginPath();
  ctx.moveTo(76, answerTop);
  ctx.lineTo(1004, answerTop);
  ctx.stroke();
  ctx.fillStyle = "#EDE7DA";
  ctx.font = "400 38px Arial";
  const availableAnswerLines = Math.max(4, Math.floor((1180 - (answerTop + 76)) / 51) + 1);
  const answerLines = wrapCanvasText(ctx, answerText, 928, availableAnswerLines);
  answerLines.forEach((line, index) => ctx.fillText(line, 76, answerTop + 76 + index * 51));

  ctx.fillStyle = "#C9A15C";
  ctx.font = "700 30px Arial";
  ctx.fillText("Explore the question at restless.faith", 76, 1264);
  return new Promise((resolve, reject) =>
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("Could not create card"))), "image/png")
  );
}

function CitationCard({ source, isOpen, onToggle, theme, strings }) {
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
              {source.url && (
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2"
                  style={{ color: theme.accent, fontSize: "16px", fontWeight: 500 }}
                >
                  {strings.readFullText}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ShareButton({ questionText, answerText, theme, strings }) {
  const [copied, setCopied] = useState(false);
  const [cardSaved, setCardSaved] = useState(false);

  const handleShare = async () => {
    const shareText = `Q: ${questionText}\n\nA: ${answerText}\n\n${strings.shareFooter}`;

    if (navigator.share) {
      try {
        await navigator.share({ title: "Restless.faith", text: shareText, url: "https://restless.faith" });
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

  const handleCardShare = async () => {
    try {
      const blob = await createShareCard(questionText, answerText);
      const file = new File([blob], "restless-faith-answer.png", { type: "image/png" });
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: "Restless.faith" });
        return;
      }
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = file.name;
      link.click();
      URL.revokeObjectURL(url);
      setCardSaved(true);
      setTimeout(() => setCardSaved(false), 2000);
    } catch (err) {
      // A cancelled share sheet needs no follow-up.
    }
  };

  return (
    <div className="flex items-center gap-4 flex-wrap">
      <button
        onClick={handleShare}
        aria-label={strings.shareLabel}
        className="flex items-center gap-1.5 shrink-0"
        style={{ color: theme.subtext, fontSize: "14px", padding: "0.25rem 0" }}
      >
        {copied ? <Check className="w-3.5 h-3.5" style={{ color: theme.accent }} /> : <Share2 className="w-3.5 h-3.5" />}
        <span style={copied ? { color: theme.accent } : undefined}>
          {copied ? strings.copiedLabel : strings.shareLabel}
        </span>
      </button>
      <button
        onClick={handleCardShare}
        aria-label={strings.cardLabel}
        className="flex items-center gap-1.5 shrink-0"
        style={{ color: cardSaved ? theme.accent : theme.subtext, fontSize: "14px", padding: "0.25rem 0" }}
      >
        {cardSaved ? <Check className="w-3.5 h-3.5" /> : <ImageDown className="w-3.5 h-3.5" />}
        <span>{cardSaved ? strings.cardSavedLabel : strings.cardLabel}</span>
      </button>
    </div>
  );
}

// Parses plain text with markdown-lite bullet ("- item") or numbered ("1. item")
// lines into paragraph/list blocks, so answers can render as real lists instead
// of a single flat paragraph with dashes shown inline.
function parseMessageBlocks(text) {
  const lines = (text || "").split("\n");
  const blocks = [];
  let currentItems = null;
  let currentType = null;

  const flush = () => {
    if (currentItems && currentItems.length > 0) {
      blocks.push({ type: currentType, items: currentItems });
    }
    currentItems = null;
    currentType = null;
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (line === "") {
      flush();
      continue;
    }
    const bulletMatch = /^[-•]\s+(.*)$/.exec(line);
    const numberedMatch = /^\d+[.)]\s+(.*)$/.exec(line);

    if (bulletMatch) {
      if (currentType !== "ul") {
        flush();
        currentType = "ul";
        currentItems = [];
      }
      currentItems.push(bulletMatch[1]);
    } else if (numberedMatch) {
      if (currentType !== "ol") {
        flush();
        currentType = "ol";
        currentItems = [];
      }
      currentItems.push(numberedMatch[1]);
    } else {
      flush();
      blocks.push({ type: "p", text: line });
    }
  }
  flush();
  return blocks;
}

function MessageBlocks({ text, theme }) {
  const blocks = parseMessageBlocks(text);
  const textStyle = {
    color: theme.text,
    fontSize: "20px",
    overflowWrap: "break-word",
    wordBreak: "break-word",
  };

  return (
    <div className="space-y-2">
      {blocks.map((block, i) => {
        if (block.type === "p") {
          return (
            <p key={i} className="leading-relaxed" style={textStyle}>
              {block.text}
            </p>
          );
        }
        const ListTag = block.type === "ul" ? "ul" : "ol";
        return (
          <ListTag
            key={i}
            style={{ ...textStyle, paddingLeft: "1.4rem" }}
            className={block.type === "ul" ? "list-disc space-y-1" : "list-decimal space-y-1"}
          >
            {block.items.map((item, j) => (
              <li key={j} className="leading-relaxed">
                {item}
              </li>
            ))}
          </ListTag>
        );
      })}
    </div>
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
          <MessageBlocks text={message.text} theme={theme} />
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
                strings={strings}
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

function InfoModal({ title, body, cta, theme, strings, onClose }) {
  return (
    <div
      className="fixed inset-0 flex items-end sm:items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.6)", zIndex: 50 }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full sm:max-w-md overflow-y-auto"
        style={{
          backgroundColor: theme.cardBg,
          maxHeight: "80vh",
          padding: "1.5rem",
          borderTopLeftRadius: "1.5rem",
          borderTopRightRadius: "1.5rem",
          borderBottomLeftRadius: "0",
          borderBottomRightRadius: "0",
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 style={{ color: theme.text, fontSize: "22px", fontWeight: 600 }}>{title}</h2>
          <button onClick={onClose} aria-label={strings.closeLabel}>
            <X className="w-5 h-5" style={{ color: theme.subtext }} />
          </button>
        </div>
        <p
          className="whitespace-pre-line leading-relaxed"
          style={{ color: theme.subtext, fontSize: "17px" }}
        >
          {body}
        </p>
        {cta && (
          <a
            href={cta.href}
            target={cta.href.startsWith("http") ? "_blank" : undefined}
            rel={cta.href.startsWith("http") ? "noopener noreferrer" : undefined}
            className="inline-block mt-4"
            style={{ color: theme.accent, fontSize: "17px", fontWeight: 600 }}
          >
            {cta.label}
          </a>
        )}
      </div>
    </div>
  );
}

export default function Restless() {
  const [language, setLanguage] = useState("en");
  const [messages, setMessages] = useState(SEED_MESSAGES.en);
  const [input, setInput] = useState("");
  const [ageBand, setAgeBand] = useState("High School");
  const [isTyping, setIsTyping] = useState(false);
  const [mode, setMode] = useState("dark");
  const [error, setError] = useState(null);
  const [activeModal, setActiveModal] = useState(null); // 'about' | 'contact' | null
  const theme = THEMES[mode];
  const strings = STRINGS[language];
  const scrollRef = useRef(null);
  const lastMessageRef = useRef(null);

  useEffect(() => {
    // Scroll so the newest message's top is visible, rather than jumping to
    // the very bottom — for a long companion answer, that means landing on
    // its first line instead of its last.
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  useEffect(() => {
    // While the typing indicator is showing, keep it in view at the bottom.
    if (isTyping) {
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [isTyping]);

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

    // Build history from the real conversation so far (seed examples excluded),
    // capped to the last few exchanges to match the backend's limit.
    const history = messages
      .filter((m) => !m.isSeed)
      .map((m) => ({ role: m.role, text: m.text, sources: m.sources }))
      .slice(-6);

    setMessages((prev) => [...prev, { id: Date.now(), role: "user", text: trimmed }]);
    setInput("");
    setIsTyping(true);
    setError(null);

    try {
      const result = await askCompanion(trimmed, ageBand, language, history);
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

  const chooseStarter = (question) => {
    setInput(question);
    requestAnimationFrame(() => document.querySelector("textarea")?.focus());
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
                Restless<span style={{ color: theme.subtext, fontWeight: 400 }}>.faith</span>
              </h1>
              <p
                className="leading-tight"
                style={{ color: theme.subtext, fontSize: "16px", whiteSpace: "pre-line" }}
              >
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
        <p className="max-w-2xl mx-auto w-full mt-3" style={{ color: theme.subtext, fontSize: "12px" }}>
          {strings.audienceLabel}
        </p>
        <div className="max-w-2xl mx-auto w-full mt-1.5 flex gap-1.5 overflow-x-auto pb-1">
          {AUDIENCES.map((band) => (
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
          {messages.length === 1 && (
            <section
              className="rounded-2xl p-5"
              style={{ backgroundColor: theme.citationBg, border: `1px solid ${theme.citationBorder}` }}
            >
              <div className="flex items-start gap-3">
                <GraduationCap className="w-6 h-6 shrink-0 mt-0.5" style={{ color: theme.accent }} />
                <div>
                  <h2 style={{ color: theme.text, fontSize: "21px", fontWeight: 700 }}>
                    {strings.studentTitle}
                  </h2>
                  <p className="mt-1 leading-relaxed" style={{ color: theme.subtext, fontSize: "16px" }}>
                    {strings.studentBody}
                  </p>
                </div>
              </div>
              <p className="mt-4 mb-2" style={{ color: theme.subtext, fontSize: "13px", fontWeight: 600 }}>
                {strings.startersLabel}
              </p>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {strings.starterQuestions.map((question) => (
                  <button
                    key={question}
                    onClick={() => chooseStarter(question)}
                    className="shrink-0 rounded-full px-3 py-2 text-left"
                    style={{ backgroundColor: theme.cardBg, color: theme.text, fontSize: "14px", border: `1px solid ${theme.border}` }}
                  >
                    {question}
                  </button>
                ))}
              </div>
            </section>
          )}
          {messages.map((msg, idx) => (
            <div key={msg.id} ref={idx === messages.length - 1 ? lastMessageRef : null}>
              {msg.role === "user" ? (
                <UserMessage message={msg} theme={theme} />
              ) : (
                <CompanionMessage
                  message={msg}
                  questionText={idx > 0 ? messages[idx - 1].text : null}
                  theme={theme}
                  strings={strings}
                />
              )}
            </div>
          ))}
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
          <div className="max-w-2xl mx-auto w-full mb-2 flex items-center justify-between gap-3">
            <p style={{ color: theme.accentSecondary, fontSize: "14px" }}>
              {error}
            </p>
            <button
              onClick={handleSend}
              className="flex items-center gap-1.5 shrink-0"
              style={{ color: theme.accent, fontSize: "14px", fontWeight: 600 }}
            >
              <RefreshCcw className="w-3.5 h-3.5" />
              {strings.retryLabel}
            </button>
          </div>
        )}
        <div className="max-w-2xl mx-auto w-full flex items-end gap-2.5 min-w-0">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            maxLength={1000}
            aria-label={strings.placeholder}
            placeholder={strings.placeholder}
            rows={2}
            className="flex-1 min-w-0 resize-none rounded-xl px-4 py-3 focus:outline-none overflow-y-auto max-h-40"
            style={{ backgroundColor: theme.cardBg, color: theme.text, fontSize: "20px", boxSizing: "border-box", width: "100%" }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            aria-label="Send question"
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
        <div className="max-w-2xl mx-auto w-full flex items-center justify-center gap-3 mt-3">
          <button
            onClick={() => setActiveModal("about")}
            style={{ color: theme.subtext, fontSize: "13px" }}
          >
            {strings.aboutLabel}
          </button>
          <span style={{ color: theme.subtext, fontSize: "13px" }}>·</span>
          <button
            onClick={() => setActiveModal("contact")}
            style={{ color: theme.subtext, fontSize: "13px" }}
          >
            {strings.contactLabel}
          </button>
          <span style={{ color: theme.subtext, fontSize: "13px" }}>·</span>
          <button
            onClick={() => setActiveModal("support")}
            style={{ color: theme.accent, fontSize: "13px", fontWeight: 600 }}
          >
            {strings.supportLabel}
          </button>
        </div>
      </div>

      {activeModal === "about" && (
        <InfoModal
          title={strings.aboutTitle}
          body={strings.aboutBody}
          theme={theme}
          strings={strings}
          onClose={() => setActiveModal(null)}
        />
      )}
      {activeModal === "contact" && (
        <InfoModal
          title={strings.contactTitle}
          body={strings.contactBody}
          cta={{ label: strings.contactEmail, href: `mailto:${strings.contactEmail}` }}
          theme={theme}
          strings={strings}
          onClose={() => setActiveModal(null)}
        />
      )}
      {activeModal === "support" && (
        <InfoModal
          title={strings.supportTitle}
          body={strings.supportBody}
          theme={theme}
          strings={strings}
          onClose={() => setActiveModal(null)}
        />
      )}
    </div>
  );
}
