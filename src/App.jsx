import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
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
  Lightbulb,
  Users,
  Minus,
  Plus,
} from "lucide-react";
import { NEXT_STEP_TEXT, classifyNextStep, nextStepContent } from "./nextSteps.js";
import { BOOKS, JOURNALS, RECOMMENDED, BOOKS_TEXT, BOOKS_LANGUAGE_NOTE, bookUrl, matchBook } from "./books.js";

const AUDIENCES = ["Middle School", "High School", "College", "Adult"];

const THEMES = {
  dark: {
    bg: "#0B1020",
    surface: "#121A2B",
    cardBg: "#172136",
    elevated: "#1D2940",
    citationBg: "#111A2B",
    border: "rgba(233, 204, 150, 0.16)",
    citationBorder: "rgba(233, 204, 150, 0.24)",
    text: "#F6F0E5",
    subtext: "#C4BBAA",
    muted: "#8D95A5",
    accent: "#E0B96A",
    accentSecondary: "#A94E48",
    accentText: "#101522",
    success: "#9FC5A9",
    toggleInactiveBg: "#202B41",
    disabledBg: "#1C2639",
    disabledText: "#697286",
    dotColor: "rgba(224,185,106,0.65)",
    heroGlow: "rgba(224,185,106,0.08)",
  },
  light: {
    bg: "#F8F3E9",
    surface: "#FFFDF8",
    cardBg: "#FFFFFF",
    elevated: "#F3E9D9",
    citationBg: "#F7EFE2",
    border: "rgba(93, 48, 43, 0.14)",
    citationBorder: "rgba(93, 48, 43, 0.22)",
    text: "#2B241D",
    subtext: "#675D51",
    muted: "#8F8578",
    accent: "#7E3B36",
    accentSecondary: "#C79A4C",
    accentText: "#FFF9EF",
    success: "#3F7651",
    toggleInactiveBg: "#EFE6D8",
    disabledBg: "#EDE5D9",
    disabledText: "#AAA094",
    dotColor: "rgba(126,59,54,0.55)",
    heroGlow: "rgba(126,59,54,0.06)",
  },
};

const FONT_SCALES = [0.9, 1, 1.15];
const THEME_STORAGE_KEY = "restless-theme";
const FONT_SCALE_STORAGE_KEY = "restless-font-scale";

function readStoredMode() {
  if (typeof window === "undefined") return "dark";
  try {
    const storedMode = window.localStorage.getItem(THEME_STORAGE_KEY);
    return storedMode === "light" || storedMode === "dark" ? storedMode : "dark";
  } catch {
    return "dark";
  }
}

function readStoredFontScale() {
  if (typeof window === "undefined") return 1;
  try {
    const storedScale = Number(window.localStorage.getItem(FONT_SCALE_STORAGE_KEY));
    return FONT_SCALES.includes(storedScale) ? storedScale : 1;
  } catch {
    return 1;
  }
}

const STRINGS = {
  en: {
    tagline: "Ask boldly. Learn deeply. Stay human.",
    humanBadge: "Questions • Evidence • Next steps",
    heroTitle: "For the questions that won’t leave you alone.",
    heroBody: "Explore God, Christianity, and the Catholic faith with honesty, evidence, and real next steps.",
    principles: [
      { title: "Answers", body: "Honest, well-researched and easy to understand." },
      { title: "Sources", body: "Know where the answers come from." },
      { title: "Next steps", body: "Real-world guidance for your journey." },
    ],
    ageLabels: {
      "Middle School": "Middle school",
      "High School": "High school",
      College: "College",
      Adult: "Adult",
    },
    audienceLabel: "Answer level",
    studentTitle: "Studying theology? Ask anything.",
    studentBody:
      "Get a clear answer grounded in Catholic teaching, then open the sources to verify it and make it your own.",
    starterQuestions: [
      "Is Jesus really in the Eucharist?",
      "Do Catholics pray to saints?",
      "Was Peter the first pope?",
      "Why baptize babies?",
    ],
    startersLabel: "Try a question",
    ideasLabel: "Need an idea?",
    placeholder: "Ask about faith, Scripture, or the Church…",
    retryError: "That didn't come through. Tap send again to retry.",
    timeoutError: "That's taking longer than usual. Tap Try again.",
    rateLimitError: "Please wait a moment before asking again.",
    busyError: "Restless is busy right now. Please try again in a moment.",
    retryLabel: "Try again",
    langToggleLabel: "Switch language",
    shareLabel: "Share",
    shareFooter: "Shared from Restless — restless.faith",
    copiedLabel: "Copied",
    shareFailedLabel: "Copy failed",
    cardLabel: "Share card",
    cardSavedLabel: "Card saved",
    cardFailedLabel: "Card couldn't be shared",
    siteShareLabel: "Share site",
    siteShareCopied: "Link copied",
    siteShareFailed: "Copy failed",
    siteShareText: "Check out Restless.faith — clear Catholic answers for modern questions.",
    accessibilityLabel: "Text size",
    accessibilityTitle: "Text size",
    textSizeLabel: "Text size",
    smallerText: "Smaller text",
    defaultText: "Default text",
    largerText: "Larger text",
    lightMode: "Use light mode",
    darkMode: "Use dark mode",
    readFullText: "Read source ↗",
    aboutLabel: "About",
    contactLabel: "Contact",
    closeLabel: "Close",
    backToQuestions: "← Back to questions",
    aboutTitle: "About Restless",
    aboutBody:
      "Restless takes its name from St. Augustine: “Our hearts are restless until they rest in You.”\n\nRestless is designed to help people — especially students and younger users — ask difficult questions while staying rooted in Catholic teaching. It points you toward Sacred Scripture, the Catechism, the Fathers and Doctors of the Church, councils, and papal teaching.\n\nThe goal is not to make you dependent on AI. Restless should help you think, verify, pray, and have better conversations with parents, teachers, priests, sponsors, youth ministers, and other people who can walk with you.\n\nNo account is required. Restless is a companion for questions, not a replacement for a priest, spiritual director, teacher, counselor, or human relationship.",
    contactTitle: "Contact",
    contactBody:
      "Have a question, notice something that doesn't sound right, or want to bring Restless to your parish, school, or ministry? Reach out below.",
    contactEmail: "hello@restless.faith",
    supportLabel: "Support",
    supportTitle: "Support Restless",
    supportBody:
      "Restless.faith exists to help people bring questions about faith, doubt, and meaning into conversation with the Catholic tradition — free for anyone who needs it.\n\nIf Restless has helped you, you can support the cost of keeping it available.\n\nRestless.faith is an independent project, not a registered nonprofit. Contributions are not tax-deductible.",
    supportButtonLabel: "Support Restless →",
    supportUrl: "https://donate.stripe.com/00wbJ191k25t9cO5RK0Jq00",
  },
  es: {
    tagline: "Pregunta con valentía. Aprende a fondo. Sigue siendo humano.",
    humanBadge: "Preguntas • Evidencia • Próximos pasos",
    heroTitle: "Para las preguntas que no te dejan en paz.",
    heroBody: "Explora a Dios, el cristianismo y la fe católica con honestidad, evidencia y próximos pasos reales.",
    principles: [
      { title: "Respuestas", body: "Claras, bien investigadas y fáciles de entender." },
      { title: "Fuentes", body: "Mira de dónde vienen las respuestas." },
      { title: "Próximos pasos", body: "Orientación para llevarlo a la vida real." },
    ],
    ageLabels: {
      "Middle School": "Secundaria",
      "High School": "Preparatoria",
      College: "Universidad",
      Adult: "Adulto",
    },
    audienceLabel: "Nivel de respuesta",
    studentTitle: "¿Estudias teología? Pregunta lo que quieras.",
    studentBody:
      "Recibe una respuesta clara basada en la enseñanza católica, abre las fuentes para verificarla y hazla tuya.",
    starterQuestions: [
      "¿Está Jesús realmente en la Eucaristía?",
      "¿Rezan los católicos a los santos?",
      "¿Fue Pedro el primer Papa?",
      "¿Por qué bautizar a los bebés?",
    ],
    startersLabel: "Prueba una pregunta",
    ideasLabel: "¿Necesitas una idea?",
    placeholder: "Pregunta sobre la fe, la Escritura o la Iglesia…",
    retryError: "Eso no llegó. Toca enviar para intentarlo de nuevo.",
    timeoutError: "Está tardando más de lo normal. Toca Intentar de nuevo.",
    rateLimitError: "Espera un momento antes de volver a preguntar.",
    busyError: "Restless está ocupado ahora mismo. Inténtalo de nuevo en un momento.",
    retryLabel: "Intentar de nuevo",
    langToggleLabel: "Cambiar idioma",
    shareLabel: "Compartir",
    shareFooter: "Compartido desde Restless — restless.faith",
    copiedLabel: "Copiado",
    shareFailedLabel: "No se pudo copiar",
    cardLabel: "Tarjeta",
    cardSavedLabel: "Tarjeta guardada",
    cardFailedLabel: "No se pudo compartir",
    siteShareLabel: "Compartir sitio",
    siteShareCopied: "Enlace copiado",
    siteShareFailed: "No se pudo copiar",
    siteShareText: "Conoce Restless.faith — respuestas católicas claras para preguntas actuales.",
    accessibilityLabel: "Tamaño del texto",
    accessibilityTitle: "Tamaño del texto",
    textSizeLabel: "Tamaño del texto",
    smallerText: "Texto más pequeño",
    defaultText: "Texto predeterminado",
    largerText: "Texto más grande",
    lightMode: "Usar modo claro",
    darkMode: "Usar modo oscuro",
    readFullText: "Leer fuente ↗",
    aboutLabel: "Acerca de",
    contactLabel: "Contacto",
    closeLabel: "Cerrar",
    backToQuestions: "← Volver a las preguntas",
    aboutTitle: "Acerca de Restless",
    aboutBody:
      "Restless toma su nombre de San Agustín: “Nuestro corazón está inquieto hasta que descanse en Ti”.\n\nRestless está diseñado para ayudar a las personas — especialmente estudiantes y jóvenes — a hacer preguntas difíciles manteniéndose arraigadas en la enseñanza católica. Te dirige a la Sagrada Escritura, el Catecismo, los Padres y Doctores de la Iglesia, los concilios y la enseñanza papal.\n\nLa meta no es hacerte dependiente de la IA. Restless debe ayudarte a pensar, verificar, orar y tener mejores conversaciones con padres, maestros, sacerdotes, padrinos, ministros juveniles y otras personas que puedan acompañarte.\n\nNo se requiere cuenta. Restless acompaña tus preguntas; no reemplaza a un sacerdote, director espiritual, maestro, consejero o relación humana.",
    contactTitle: "Contacto",
    contactBody:
      "¿Tienes una pregunta, notaste algo que no suena bien o quieres llevar Restless a tu parroquia, escuela o ministerio? Escríbenos.",
    contactEmail: "hello@restless.faith",
    supportLabel: "Apoyar",
    supportTitle: "Apoyar Restless",
    supportBody:
      "Restless.faith existe para ayudar a las personas a llevar preguntas sobre la fe, la duda y el sentido de la vida a un diálogo con la tradición católica — gratis para quien lo necesite.\n\nSi Restless te ha ayudado, puedes apoyar el costo de mantenerlo disponible.\n\nRestless.faith es un proyecto independiente, no una organización sin fines de lucro registrada. Las contribuciones no son deducibles de impuestos.",
    supportButtonLabel: "Apoyar Restless →",
    supportUrl: "https://donate.stripe.com/00wbJ191k25t9cO5RK0Jq00",
  },
};

const SEED_MESSAGES = { en: [], es: [] };

function askError(kind) {
  const error = new Error(kind);
  error.kind = kind;
  return error;
}

// Maps a failure to a message in the reader's language (never raw browser text
// like "Failed to fetch").
function errorMessage(err, strings) {
  switch (err?.kind) {
    case "timeout":
      return strings.timeoutError;
    case "rateLimit":
      return strings.rateLimitError;
    case "busy":
      return strings.busyError;
    default:
      return strings.retryError;
  }
}

async function askCompanion(question, ageBand, language, history) {
  const now = new Date();
  const todayDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
    now.getDate()
  ).padStart(2, "0")}`;

  // The server gives up after ~50s (including one retry), so wait a little
  // longer than that here; otherwise slow-but-successful answers get dropped.
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60000);
  let response;
  try {
    response = await fetch("/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, ageBand, language, todayDate, history }),
      signal: controller.signal,
    });
  } catch (err) {
    throw askError(err?.name === "AbortError" ? "timeout" : "network");
  } finally {
    clearTimeout(timeout);
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (response.status === 429) throw askError("rateLimit");
    if (response.status === 504) throw askError("timeout");
    throw askError(response.status === 503 ? "busy" : "retry");
  }
  if (!data.text || typeof data.text !== "string") throw askError("retry");
  return data;
}

function wrapCanvasText(ctx, text, maxWidth, maxLines) {
  const words = text.replace(/\s+/g, " ").trim().split(" ");
  const lines = [];
  let line = "";
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width <= maxWidth) {
      line = next;
    } else {
      if (line) lines.push(line);
      line = word;
      if (lines.length === maxLines - 1) break;
    }
  }
  if (line && lines.length < maxLines) lines.push(line);
  if (lines.join(" ").length < text.replace(/\s+/g, " ").trim().length && lines.length) {
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
  gradient.addColorStop(0, "#0B1020");
  gradient.addColorStop(1, "#172136");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#E0B96A";
  ctx.fillRect(72, 72, 7, 96);
  ctx.font = "700 50px Arial";
  ctx.fillText("Restless", 108, 118);
  ctx.fillStyle = "#C4BBAA";
  ctx.font = "400 30px Arial";
  ctx.fillText(".faith", 300, 118);
  ctx.fillText("Ask boldly. Learn deeply. Stay human.", 108, 160);

  ctx.fillStyle = "#E0B96A";
  ctx.font = "700 26px Arial";
  ctx.fillText("QUESTION", 72, 260);
  ctx.fillStyle = "#F6F0E5";
  ctx.font = "700 46px Arial";
  const questionLines = wrapCanvasText(ctx, questionText, 936, 4);
  questionLines.forEach((line, i) => ctx.fillText(line, 72, 326 + i * 60));

  const answerTop = 378 + questionLines.length * 60;
  ctx.strokeStyle = "rgba(224,185,106,0.35)";
  ctx.beginPath();
  ctx.moveTo(72, answerTop);
  ctx.lineTo(1008, answerTop);
  ctx.stroke();

  ctx.fillStyle = "#F6F0E5";
  ctx.font = "400 37px Arial";
  const answerLines = wrapCanvasText(ctx, answerText, 936, 13);
  answerLines.forEach((line, i) => ctx.fillText(line, 72, answerTop + 72 + i * 50));

  ctx.fillStyle = "#E0B96A";
  ctx.font = "700 28px Arial";
  ctx.fillText("Verify it. Think about it. Talk about it.", 72, 1240);
  ctx.fillStyle = "#C4BBAA";
  ctx.font = "400 26px Arial";
  ctx.fillText("restless.faith", 72, 1286);

  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Could not create card"))),
      "image/png"
    )
  );
}

function parseMessageBlocks(text) {
  const lines = (text || "").split("\n");
  const blocks = [];
  let items = null;
  let type = null;

  const flush = () => {
    if (items?.length) blocks.push({ type, items });
    items = null;
    type = null;
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) {
      flush();
      continue;
    }

    const bullet = /^[-•]\s+(.*)$/.exec(line);
    const numbered = /^\d+[.)]\s+(.*)$/.exec(line);
    if (bullet) {
      if (type !== "ul") {
        flush();
        type = "ul";
        items = [];
      }
      items.push(bullet[1]);
    } else if (numbered) {
      if (type !== "ol") {
        flush();
        type = "ol";
        items = [];
      }
      items.push(numbered[1]);
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
  const style = {
    color: theme.text,
    fontSize: "19px",
    overflowWrap: "break-word",
    wordBreak: "break-word",
  };

  return (
    <div className="space-y-2.5">
      {blocks.map((block, i) => {
        if (block.type === "p") {
          return (
            <p key={i} className="leading-relaxed" style={style}>
              {block.text}
            </p>
          );
        }
        const Tag = block.type === "ul" ? "ul" : "ol";
        return (
          <Tag
            key={i}
            style={{ ...style, paddingLeft: "1.4rem" }}
            className={block.type === "ul" ? "list-disc space-y-1" : "list-decimal space-y-1"}
          >
            {block.items.map((item, j) => (
              <li key={j} className="leading-relaxed">
                {item}
              </li>
            ))}
          </Tag>
        );
      })}
    </div>
  );
}

function CitationCard({ source, isOpen, onToggle, theme, strings }) {
  return (
    <div
      className="min-w-0"
      style={{
        border: `1px solid ${theme.citationBorder}`,
        borderRadius: "0.85rem",
        overflow: "hidden",
        backgroundColor: theme.citationBg,
      }}
    >
      <button
        onClick={onToggle}
        className="flex items-center justify-between gap-3 text-left"
        style={{ width: "100%", padding: "0.8rem 0.95rem" }}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <BookOpen className="w-4 h-4 shrink-0" style={{ color: theme.accent }} />
          <span className="font-medium truncate" style={{ color: theme.text, fontSize: "16px" }}>
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
          <div style={{ padding: "0 0.95rem 0.95rem 0.95rem" }}>
            <div style={{ paddingLeft: "1rem", borderLeft: `2px solid ${theme.citationBorder}` }}>
              <p className="leading-relaxed" style={{ color: theme.subtext, fontSize: "16px" }}>
                {source.detail}
              </p>
              {source.url && (
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-2"
                  style={{ color: theme.accent, fontSize: "14px", fontWeight: 600 }}
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

function ShareButtons({ questionText, answerText, theme, strings }) {
  const [copied, setCopied] = useState(false);
  const [cardSaved, setCardSaved] = useState(false);
  const [shareError, setShareError] = useState(false);
  const [cardError, setCardError] = useState(false);

  const copyText = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      const ok = document.execCommand("copy");
      textarea.remove();
      if (!ok) throw new Error("Clipboard unavailable");
    }
  };

  const handleShare = async () => {
    const text = `Q: ${questionText}\n\nA: ${answerText}\n\n${strings.shareFooter}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "Restless.faith", text, url: "https://restless.faith" });
        setShareError(false);
        return;
      } catch (err) {
        if (err?.name === "AbortError") return;
      }
    }

    try {
      await copyText(text);
      setShareError(false);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setShareError(true);
    }
  };

  const handleCardShare = async () => {
    try {
      const blob = await createShareCard(questionText, answerText);
      const file = new File([blob], "restless-faith-answer.png", { type: "image/png" });
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        try {
          await navigator.share({ files: [file], title: "Restless.faith", text: strings.shareFooter });
          setCardError(false);
          return;
        } catch (err) {
          if (err?.name === "AbortError") return;
        }
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = file.name;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setCardError(false);
      setCardSaved(true);
      setTimeout(() => setCardSaved(false), 1800);
    } catch {
      setCardError(true);
    }
  };

  return (
    <div className="flex items-center gap-4 flex-wrap" aria-live="polite">
      <button
        onClick={handleShare}
        className="flex items-center gap-1.5"
        style={{ color: copied ? theme.accent : theme.subtext, fontSize: "13px" }}
      >
        {copied ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
        {shareError ? strings.shareFailedLabel : copied ? strings.copiedLabel : strings.shareLabel}
      </button>
      <button
        onClick={handleCardShare}
        className="flex items-center gap-1.5"
        style={{ color: cardSaved ? theme.accent : theme.subtext, fontSize: "13px" }}
      >
        {cardSaved ? <Check className="w-3.5 h-3.5" /> : <ImageDown className="w-3.5 h-3.5" />}
        {cardError ? strings.cardFailedLabel : cardSaved ? strings.cardSavedLabel : strings.cardLabel}
      </button>
    </div>
  );
}

function NextStepPanel({ questionText, theme, language, onPrompt }) {
  const text = NEXT_STEP_TEXT[language];
  const content = nextStepContent(classifyNextStep(questionText), language);
  const actionStyle = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "40px",
    padding: "0.55rem 0.8rem",
    borderRadius: "999px",
    border: `1px solid ${theme.citationBorder}`,
    color: theme.accent,
    background: "transparent",
    fontSize: "13px",
    fontWeight: 800,
    lineHeight: 1.2,
    textDecoration: "none",
    cursor: "pointer",
  };

  return (
    <section
      data-restless-next-step="true"
      style={{
        marginTop: "0.9rem",
        padding: "1rem",
        border: `1px solid ${theme.citationBorder}`,
        borderRadius: "1rem",
        background: theme.citationBg,
      }}
    >
      <p
        style={{
          margin: "0 0 0.3rem",
          color: theme.accent,
          fontSize: "11px",
          fontWeight: 900,
          letterSpacing: "0.08em",
        }}
      >
        {text.nextStepEyebrow}
      </p>
      <h3 style={{ margin: 0, color: theme.text, fontSize: "17px", fontWeight: 800 }}>{content.title}</h3>
      <p style={{ margin: "0.45rem 0 0", color: theme.subtext, fontSize: "14px", lineHeight: 1.55 }}>
        {content.body}
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.55rem", marginTop: "0.8rem" }}>
        {content.actions.map((action) => {
          if (action.href) {
            const external = action.href.startsWith("http");
            return (
              <a
                key={action.label}
                href={action.href}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                style={actionStyle}
              >
                {action.label}
              </a>
            );
          }
          return (
            <button key={action.label} type="button" onClick={() => onPrompt(action.prompt)} style={actionStyle}>
              {action.label}
            </button>
          );
        })}
      </div>
      {content.note && (
        <p style={{ margin: "0.7rem 0 0", color: theme.subtext, fontSize: "12px", lineHeight: 1.45 }}>
          {content.note}
        </p>
      )}
    </section>
  );
}

function BookCover({ book, theme, size = 72 }) {
  const w = size;
  const h = Math.round(size * 1.5);
  if (!book.cover) {
    return (
      <div
        aria-hidden="true"
        className="shrink-0 rounded-md flex items-center justify-center"
        style={{ width: w, height: h, backgroundColor: theme.elevated, border: `1px solid ${theme.border}` }}
      >
        <BookOpen className="w-5 h-5" style={{ color: theme.muted }} />
      </div>
    );
  }
  return (
    <img
      src={book.cover}
      alt={`${book.title} cover`}
      loading="lazy"
      className="shrink-0 rounded-md object-cover"
      style={{ width: w, height: h, boxShadow: "0 4px 14px rgba(0,0,0,0.25)" }}
    />
  );
}

function BookCard({ book, theme, language, onOpenBooks }) {
  const text = BOOKS_TEXT[language];
  const rec = !!book.recommended;
  const eyebrow = rec ? text.recommendedEyebrow : text.cardEyebrow;
  const isJournal = JOURNALS.some((j) => j.id === book.id);
  const intro = rec ? text.recommendedIntro : isJournal ? text.journalCardIntro : text.cardIntro;
  const note = rec ? text.recommendedNote : text.cardNote;
  return (
    <section
      data-restless-book="true"
      style={{
        marginTop: "0.9rem",
        padding: "1rem",
        border: `1px solid ${theme.citationBorder}`,
        borderRadius: "1rem",
        background: theme.citationBg,
      }}
    >
      <p style={{ margin: "0 0 0.3rem", color: theme.accent, fontSize: "11px", fontWeight: 900, letterSpacing: "0.08em" }}>
        {eyebrow}
      </p>
      <p style={{ margin: 0, color: theme.subtext, fontSize: "14px", lineHeight: 1.55 }}>{intro}</p>
      <div className="flex gap-3 items-start" style={{ marginTop: "0.6rem" }}>
        <BookCover book={book} theme={theme} size={76} />
        <div className="min-w-0 flex-1">
          <h3 style={{ margin: 0, color: theme.text, fontSize: "17px", fontWeight: 800 }}>{book.title}</h3>
          {book.subtitle && (
            <p style={{ margin: "0.1rem 0 0", color: theme.subtext, fontSize: "13px", fontWeight: 700 }}>{book.subtitle}</p>
          )}
          {book.author && (
            <p style={{ margin: "0.1rem 0 0", color: theme.muted, fontSize: "12px" }}>{book.author}</p>
          )}
          <p style={{ margin: "0.35rem 0 0", color: theme.subtext, fontSize: "14px", lineHeight: 1.55 }}>
            {book.tagline[language]}
          </p>
        </div>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.55rem", marginTop: "0.8rem" }}>
        <a
          href={bookUrl(book)}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="inline-flex items-center justify-center rounded-xl px-4 py-2.5"
          style={{ backgroundColor: theme.accent, color: theme.accentText, fontSize: "14px", fontWeight: 800 }}
        >
          {text.buy}
        </a>
        <button
          type="button"
          onClick={onOpenBooks}
          className="inline-flex items-center justify-center rounded-xl px-4 py-2.5"
          style={{ border: `1px solid ${theme.citationBorder}`, color: theme.accent, fontSize: "14px", fontWeight: 800 }}
        >
          {text.cardMore}
        </button>
      </div>
      <p style={{ margin: "0.7rem 0 0", color: theme.subtext, fontSize: "12px", lineHeight: 1.45 }}>
        {[note, rec ? "" : BOOKS_LANGUAGE_NOTE[language]].filter(Boolean).join(" ")}
      </p>
    </section>
  );
}

function useEscapeToClose(onClose) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);
}

function ModalHeader({ title, theme, strings, onClose }) {
  useEscapeToClose(onClose);
  return (
    <div
      className="flex items-center justify-between gap-4"
      style={{
        position: "sticky",
        top: "-1.5rem",
        margin: "-1.5rem -1.5rem 1rem",
        padding: "1.25rem 1.5rem 0.75rem",
        backgroundColor: theme.cardBg,
        borderBottom: `1px solid ${theme.border}`,
        zIndex: 1,
      }}
    >
      <h2 style={{ color: theme.text, fontSize: "22px", fontWeight: 700 }}>{title}</h2>
      <button
        type="button"
        onClick={onClose}
        aria-label={strings.closeLabel}
        className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
        style={{ border: `1px solid ${theme.border}`, color: theme.subtext }}
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}

function ModalBackButton({ theme, strings, onClose }) {
  return (
    <button
      type="button"
      onClick={onClose}
      className="w-full mt-6 rounded-xl px-4 py-3"
      style={{
        backgroundColor: theme.accent,
        color: theme.accentText,
        fontSize: "15px",
        fontWeight: 800,
      }}
    >
      {strings.backToQuestions}
    </button>
  );
}

function BookShelf({ title, body, books, theme, strings, language, showSeries }) {
  const text = BOOKS_TEXT[language];
  // A swipe across the shelf must never count as a tap on a cover. Record
  // where the finger went down; if it moved more than a few pixels before
  // the click fires, swallow the click.
  const pointerStart = useRef(null);
  const onPointerDown = (e) => {
    pointerStart.current = { x: e.clientX, y: e.clientY };
  };
  const onTileClick = (e) => {
    const start = pointerStart.current;
    if (!start) return;
    const moved = Math.hypot(e.clientX - start.x, e.clientY - start.y);
    if (moved > 8) {
      e.preventDefault();
      e.stopPropagation();
    }
  };
  if (!books.length) return null;
  return (
    <section style={{ marginTop: "1.4rem" }}>
      <h3 style={{ margin: 0, color: theme.text, fontSize: "18px", fontWeight: 800 }}>{title}</h3>
      {body && (
        <p style={{ margin: "0.2rem 0 0", color: theme.subtext, fontSize: "13px", lineHeight: 1.5 }}>{body}</p>
      )}
      <div
        className="flex overflow-x-auto"
        style={{
          gap: "14px",
          marginTop: "0.75rem",
          marginLeft: "-1.5rem",
          marginRight: "-1.5rem",
          padding: "4px 1.5rem 10px",
          scrollSnapType: "x proximity",
          WebkitOverflowScrolling: "touch",
          touchAction: "pan-x pan-y",
        }}
        onPointerDown={onPointerDown}
      >
        {books.map((book) => (
          <a
            key={book.id}
            data-rf-shelf="true"
            onClick={onTileClick}
            draggable={false}
            href={bookUrl(book)}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="shrink-0 flex flex-col"
            style={{ width: "140px", scrollSnapAlign: "start", textDecoration: "none", color: theme.text }}
          >
            <div
              className="flex items-end justify-center"
              style={{ height: "214px", width: "140px" }}
            >
              {book.cover ? (
                <img
                  src={book.cover}
                  alt={`${book.title} cover`}
                  loading="lazy"
                  draggable={false}
                  style={{
                    maxWidth: "140px",
                    maxHeight: "214px",
                    width: "auto",
                    height: "auto",
                    borderRadius: "8px",
                    boxShadow: "0 6px 18px rgba(0,0,0,0.28)",
                    display: "block",
                  }}
                />
              ) : (
                <div
                  aria-hidden="true"
                  className="rounded-lg flex items-center justify-center"
                  style={{ width: "140px", height: "214px", backgroundColor: theme.elevated, border: `1px solid ${theme.border}` }}
                >
                  <BookOpen className="w-6 h-6" style={{ color: theme.muted }} />
                </div>
              )}
            </div>
            {showSeries && (
              <p style={{ margin: "0.55rem 0 0", color: theme.accent, fontSize: "10px", fontWeight: 900, letterSpacing: "0.08em" }}>
                {text.bookLabel.toUpperCase()} {book.series}
              </p>
            )}
            <p
              style={{
                margin: showSeries ? "0.15rem 0 0" : "0.55rem 0 0",
                color: theme.text,
                fontSize: "13px",
                fontWeight: 800,
                lineHeight: 1.25,
              }}
            >
              {book.title}
            </p>
            {book.author && (
              <p style={{ margin: "0.15rem 0 0", color: theme.muted, fontSize: "11px", lineHeight: 1.3 }}>{book.author}</p>
            )}
            <p style={{ margin: "0.35rem 0 0", color: theme.accent, fontSize: "12px", fontWeight: 800 }}>{text.buy}</p>
          </a>
        ))}
      </div>
    </section>
  );
}

function BooksModal({ theme, strings, language, onClose }) {
  const text = BOOKS_TEXT[language];
  const guides = [...BOOKS].sort((a, b) => a.series - b.series);
  return (
    <div
      className="fixed inset-0 flex items-end sm:items-center justify-center px-0 sm:px-4"
      style={{ backgroundColor: "rgba(3, 7, 18, 0.68)", zIndex: 50 }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full sm:max-w-lg overflow-y-auto overflow-x-hidden"
        style={{
          backgroundColor: theme.cardBg,
          maxHeight: "88vh",
          padding: "1.5rem",
          borderRadius: "1.4rem 1.4rem 0 0",
          border: `1px solid ${theme.border}`,
        }}
      >
        <ModalHeader title={text.title} theme={theme} strings={strings} onClose={onClose} />
        <p className="leading-relaxed" style={{ color: theme.subtext, fontSize: "15px" }}>
          {text.intro}
        </p>
        <p style={{ margin: "0.4rem 0 0", color: theme.muted, fontSize: "12px" }}>{text.byline}</p>

        <BookShelf
          title={text.journalsTitle}
          body={text.journalsBody}
          books={JOURNALS}
          theme={theme}
          strings={strings}
          language={language}
        />
        <BookShelf
          title={text.guidesTitle}
          body={text.guidesBody}
          books={guides}
          theme={theme}
          strings={strings}
          language={language}
          showSeries
        />
        <BookShelf
          title={text.recommendedTitle}
          body={text.recommendedBody}
          books={RECOMMENDED}
          theme={theme}
          strings={strings}
          language={language}
        />

        <p style={{ margin: "1rem 0 0", color: theme.subtext, fontSize: "12px", lineHeight: 1.45 }}>
          {[text.disclosure, BOOKS_LANGUAGE_NOTE[language]].filter(Boolean).join(" ")}
        </p>
        <ModalBackButton theme={theme} strings={strings} onClose={onClose} />
      </div>
    </div>
  );
}

function CompanionMessage({ message, questionText, theme, strings, language, onPrompt, onOpenBooks }) {
  const [openSources, setOpenSources] = useState({});
  const matchedBook = questionText ? matchBook(questionText, classifyNextStep(questionText)) : null;

  return (
    <div className="flex justify-start min-w-0">
      <div className="space-y-4 min-w-0 flex-1" style={{ maxWidth: "100%" }}>
        <div
          className="rounded-2xl px-5 py-4"
          style={{
            backgroundColor: theme.cardBg,
            border: `1px solid ${theme.border}`,
            boxShadow: "0 8px 30px rgba(0,0,0,0.07)",
          }}
        >
          <MessageBlocks text={message.text} theme={theme} />
        </div>

        {!!message.sources?.length && (
          <div className="space-y-2">
            {message.sources.map((source, idx) => (
              <CitationCard
                key={`${source.label}-${idx}`}
                source={source}
                isOpen={!!openSources[idx]}
                onToggle={() => setOpenSources((prev) => ({ ...prev, [idx]: !prev[idx] }))}
                theme={theme}
                strings={strings}
              />
            ))}
          </div>
        )}

        {questionText && (
          <>
            <ShareButtons
              questionText={questionText}
              answerText={message.text}
              theme={theme}
              strings={strings}
            />
            <NextStepPanel questionText={questionText} theme={theme} language={language} onPrompt={onPrompt} />
            {matchedBook && (
              <BookCard book={matchedBook} theme={theme} language={language} onOpenBooks={onOpenBooks} />
            )}
          </>
        )}
      </div>
    </div>
  );
}

function UserMessage({ message, theme }) {
  return (
    <div className="flex justify-end min-w-0">
      <div
        className="rounded-2xl px-5 py-3.5"
        style={{
          maxWidth: "92%",
          backgroundColor: theme.accent,
          color: theme.accentText,
          boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
        }}
      >
        <p className="leading-relaxed" style={{ fontSize: "18px", overflowWrap: "break-word" }}>
          {message.text}
        </p>
      </div>
    </div>
  );
}

function InfoModal({ title, body, cta, theme, strings, onClose }) {
  return (
    <div
      className="fixed inset-0 flex items-end sm:items-center justify-center px-0 sm:px-4"
      style={{ backgroundColor: "rgba(3, 7, 18, 0.68)", zIndex: 50 }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full sm:max-w-lg overflow-y-auto"
        style={{
          backgroundColor: theme.cardBg,
          maxHeight: "82vh",
          padding: "1.5rem",
          borderRadius: "1.4rem 1.4rem 0 0",
          border: `1px solid ${theme.border}`,
        }}
      >
        <ModalHeader title={title} theme={theme} strings={strings} onClose={onClose} />
        <p className="whitespace-pre-line leading-relaxed" style={{ color: theme.subtext, fontSize: "16px" }}>
          {body}
        </p>
        {cta && (
          <a
            href={cta.href}
            target={cta.href.startsWith("http") ? "_blank" : undefined}
            rel={cta.href.startsWith("http") ? "noopener noreferrer" : undefined}
            className="inline-flex items-center gap-1 mt-5 rounded-xl px-4 py-2.5"
            style={{ backgroundColor: theme.accent, color: theme.accentText, fontSize: "15px", fontWeight: 700 }}
          >
            {cta.label}
          </a>
        )}
        <ModalBackButton theme={theme} strings={strings} onClose={onClose} />
      </div>
    </div>
  );
}

function TextSizeControls({ fontScale, setFontScale, theme, strings }) {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef(null);
  const triggerRef = useRef(null);
  const fontSizeLabels = [strings.smallerText, strings.defaultText, strings.largerText];

  useEffect(() => {
    if (!isOpen) return undefined;

    const handlePointerDown = (event) => {
      if (!panelRef.current?.contains(event.target) && !triggerRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className="relative ml-auto">
      {isOpen ? (
        <div
          id="text-size-panel"
          ref={panelRef}
          role="dialog"
          aria-label={strings.accessibilityTitle}
          className="absolute right-0 bottom-full mb-2 w-64 rounded-2xl p-4"
          style={{
            backgroundColor: theme.cardBg,
            border: `1px solid ${theme.border}`,
            boxShadow: "0 18px 48px rgba(0,0,0,0.28)",
            zIndex: 40,
          }}
        >
          <div className="flex items-center justify-between gap-3">
            <h2 style={{ color: theme.text, fontSize: "15px", fontWeight: 700 }}>
              {strings.accessibilityTitle}
            </h2>
            <button
              onClick={() => setIsOpen(false)}
              aria-label={strings.closeLabel}
              autoFocus
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ backgroundColor: theme.toggleInactiveBg }}
            >
              <X className="w-4 h-4" style={{ color: theme.subtext }} />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-3" role="group" aria-label={strings.textSizeLabel}>
            {FONT_SCALES.map((scale, index) => {
              const isSelected = scale === fontScale;
              return (
                <button
                  key={scale}
                  onClick={() => setFontScale(scale)}
                  aria-label={fontSizeLabels[index]}
                  aria-pressed={isSelected}
                  className="h-10 rounded-xl flex items-center justify-center"
                  style={{
                    backgroundColor: isSelected ? theme.accent : theme.toggleInactiveBg,
                    color: isSelected ? theme.accentText : theme.subtext,
                    border: `1px solid ${isSelected ? theme.accent : theme.border}`,
                    fontSize: `${12 + index * 3}px`,
                    fontWeight: 800,
                  }}
                >
                  {index === 0 ? <Minus className="w-3 h-3 mr-0.5" /> : null}
                  A
                  {index === 2 ? <Plus className="w-3 h-3 ml-0.5" /> : null}
                </button>
              );
            })}
          </div>

        </div>
      ) : null}

      <button
        ref={triggerRef}
        onClick={() => setIsOpen((value) => !value)}
        aria-label={strings.accessibilityLabel}
        aria-expanded={isOpen}
        aria-controls="text-size-panel"
        className="h-8 rounded-full px-3 inline-flex items-center gap-1.5"
        style={{
          backgroundColor: isOpen ? theme.elevated : theme.toggleInactiveBg,
          color: isOpen ? theme.accent : theme.subtext,
          fontSize: "12px",
          fontWeight: 700,
        }}
      >
        <span className="inline-flex items-end gap-0.5" aria-hidden="true">
          <span style={{ fontSize: "10px", lineHeight: 1 }}>A</span>
          <span style={{ fontSize: "15px", lineHeight: 1 }}>A</span>
        </span>
        {strings.textSizeLabel}
      </button>
    </div>
  );
}

function WelcomePanel({ theme, strings }) {
  const [openPrinciple, setOpenPrinciple] = useState(null);
  return (
    <section
      className="rounded-3xl overflow-hidden"
      style={{
        background: `radial-gradient(circle at top right, ${theme.heroGlow}, transparent 45%), ${theme.surface}`,
        border: `1px solid ${theme.border}`,
      }}
    >
      <div className="p-5 sm:p-6">
        <div
          className="inline-flex items-center gap-2 rounded-full px-3 py-1.5"
          style={{ backgroundColor: theme.elevated, color: theme.accent, fontSize: "12px", fontWeight: 700 }}
        >
          <Cross className="w-3.5 h-3.5" />
          {strings.humanBadge}
        </div>

        <h2
          className="mt-4"
          style={{
            color: theme.text,
            fontSize: "clamp(28px, 6vw, 40px)",
            lineHeight: 1.08,
            fontWeight: 800,
            letterSpacing: "-0.03em",
          }}
        >
          {strings.heroTitle}
        </h2>
        <p className="mt-3 leading-relaxed" style={{ color: theme.subtext, fontSize: "16px", maxWidth: "36rem" }}>
          {strings.heroBody}
        </p>

        <div className="grid grid-cols-3 gap-1.5 mt-4">
          {strings.principles.map((item, idx) => {
            const Icon = idx === 0 ? Lightbulb : idx === 1 ? BookOpen : Users;
            const isOpen = openPrinciple === idx;
            return (
              <button
                key={item.title}
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpenPrinciple(isOpen ? null : idx)}
                className="rounded-xl px-2.5 py-2 flex items-center gap-1.5 min-w-0"
                style={{
                  backgroundColor: theme.cardBg,
                  border: `1px solid ${isOpen ? theme.accent : theme.border}`,
                  boxShadow: isOpen ? `0 0 0 2px ${theme.accent}33` : "none",
                }}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" style={{ color: theme.accent }} />
                <span
                  className="truncate whitespace-nowrap"
                  style={{ color: theme.text, fontSize: "12px", fontWeight: 700 }}
                >
                  {item.title}
                </span>
              </button>
            );
          })}
        </div>
        {openPrinciple !== null && (
          <p
            className="mt-2 rounded-xl px-3 py-2.5 leading-relaxed"
            style={{
              backgroundColor: theme.cardBg,
              border: `1px solid ${theme.border}`,
              color: theme.subtext,
              fontSize: "14px",
            }}
          >
            <strong style={{ color: theme.text }}>{strings.principles[openPrinciple].title}.</strong>{" "}
            {strings.principles[openPrinciple].body}
          </p>
        )}
      </div>

      <div
        className="px-5 sm:px-6 py-4"
        style={{ backgroundColor: theme.citationBg, borderTop: `1px solid ${theme.border}` }}
      >
        <div className="flex items-start gap-3">
          <GraduationCap className="w-5 h-5 shrink-0 mt-0.5" style={{ color: theme.accent }} />
          <div>
            <h3 style={{ color: theme.text, fontSize: "17px", fontWeight: 700 }}>{strings.studentTitle}</h3>
            <p className="mt-1 leading-relaxed" style={{ color: theme.subtext, fontSize: "14px" }}>
              {strings.studentBody}
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}

function StarterQuestions({ theme, strings, chooseStarter }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mb-2">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5"
        style={{
          color: theme.accent,
          fontSize: "12px",
          fontWeight: 700,
          border: `1px solid ${theme.citationBorder}`,
          backgroundColor: open ? theme.citationBg : "transparent",
        }}
      >
        <Lightbulb className="w-3.5 h-3.5" />
        {strings.ideasLabel}
        <ChevronDown
          className="w-3.5 h-3.5"
          style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 150ms" }}
        />
      </button>
      {open && (
        <div className="grid grid-cols-2 gap-2 mt-2">
          {strings.starterQuestions.map((question) => (
            <button
              key={question}
              type="button"
              onClick={() => {
                setOpen(false);
                chooseStarter(question);
              }}
              className="rounded-xl px-3 py-2.5 text-left"
              style={{
                backgroundColor: theme.cardBg,
                color: theme.text,
                fontSize: "13px",
                lineHeight: 1.35,
                fontWeight: 600,
                border: `1px solid ${theme.border}`,
                minHeight: "44px",
              }}
            >
              {question}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Restless() {
  const [language, setLanguage] = useState("en");
  const [messages, setMessages] = useState(SEED_MESSAGES.en);
  const [input, setInput] = useState("");
  const [ageBand, setAgeBand] = useState("High School");
  const [isTyping, setIsTyping] = useState(false);
  const [mode, setMode] = useState(readStoredMode);
  const [fontScale, setFontScale] = useState(readStoredFontScale);
  const [error, setError] = useState(null);
  const [activeModal, setActiveModal] = useState(null);
  const [siteShareCopied, setSiteShareCopied] = useState(false);
  const [siteShareError, setSiteShareError] = useState(false);

  const theme = THEMES[mode];
  const strings = STRINGS[language];
  const scrollRef = useRef(null);
  const lastMessageRef = useRef(null);

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [messages]);

  useEffect(() => {
    if (isTyping) {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [isTyping]);

  // The mockup stylesheets key off body[data-restless-theme].
  useLayoutEffect(() => {
    document.body.dataset.restlessTheme = mode;
  }, [mode]);

  useEffect(() => {
    document.documentElement.style.overflowX = "hidden";
    document.body.style.overflowX = "hidden";
    document.body.style.margin = "0";
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch {
      // The preference still works for this visit if storage is unavailable.
    }
  }, [mode]);

  useEffect(() => {
    try {
      window.localStorage.setItem(FONT_SCALE_STORAGE_KEY, String(fontScale));
    } catch {
      // The preference still works for this visit if storage is unavailable.
    }
  }, [fontScale]);

  const handleLanguageToggle = () => {
    const next = language === "en" ? "es" : "en";
    setLanguage(next);
    setError(null);
  };

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isTyping) return;

    const history = messages
      .map((m) => ({ role: m.role, text: m.text, sources: m.sources }))
      .slice(-6);

    setMessages((prev) => [...prev, { id: Date.now(), role: "user", text: trimmed }]);
    setInput("");
    setIsTyping(true);
    setError(null);

    try {
      const responseAgeBand = ageBand === "Adult" ? "OCIA" : ageBand;
      const result = await askCompanion(trimmed, responseAgeBand, language, history);
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: "companion", text: result.text, sources: result.sources || [] },
      ]);
    } catch (err) {
      setIsTyping(false);
      setError(errorMessage(err, strings));
      setInput(trimmed);
      setMessages((prev) => prev.slice(0, -1));
    }
  };

  // Enter sends only on devices with a real keyboard. On phones and tablets
  // the return key inserts a newline — people tap it mid-thought, and
  // autocorrect/dictation can fire it too — so there the send button is the
  // only way to submit. Keystrokes that are part of IME composition are
  // ignored (keyCode 229 is the legacy signal for that).
  const handleKeyDown = (e) => {
    if (e.key !== "Enter" || e.shiftKey) return;
    if (e.isComposing || e.keyCode === 229) return;
    const touchDevice =
      typeof window !== "undefined" && window.matchMedia?.("(pointer: coarse)").matches;
    if (touchDevice) return;
    e.preventDefault();
    handleSend();
  };

  const chooseStarter = (question) => {
    setInput(question);
    requestAnimationFrame(() => document.querySelector("textarea[data-question-input]")?.focus());
  };

  const handleSiteShare = async () => {
    const url = "https://restless.faith";
    if (navigator.share) {
      try {
        await navigator.share({ title: "Restless.faith", text: strings.siteShareText, url });
        setSiteShareError(false);
        return;
      } catch (err) {
        if (err?.name === "AbortError") return;
      }
    }

    try {
      try {
        await navigator.clipboard.writeText(url);
      } catch {
        const textarea = document.createElement("textarea");
        textarea.value = url;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        const ok = document.execCommand("copy");
        textarea.remove();
        if (!ok) throw new Error("Clipboard unavailable");
      }
      setSiteShareError(false);
      setSiteShareCopied(true);
      setTimeout(() => setSiteShareCopied(false), 1800);
    } catch {
      setSiteShareError(true);
    }
  };

  return (
    <div
      className="flex flex-col overflow-x-hidden"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: `${100 / fontScale}%`,
        height: `${100 / fontScale}%`,
        transform: `scale(${fontScale})`,
        transformOrigin: "top left",
        backgroundColor: theme.bg,
        fontFamily: 'Arial, Helvetica, "Helvetica Neue", sans-serif',
        overscrollBehaviorX: "none",
        touchAction: "pan-y",
      }}
    >
      <header
        className="shrink-0 px-4 sm:px-5 py-3.5"
        style={{ borderBottom: `1px solid ${theme.border}`, backgroundColor: theme.bg }}
      >
        <div className="max-w-3xl mx-auto w-full">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentSecondary})` }}
              >
                <Cross className="w-4 h-4" style={{ color: theme.bg }} strokeWidth={2.6} />
              </div>
              <div className="min-w-0">
                <h1 className="font-semibold leading-tight" style={{ color: theme.text, fontSize: "20px" }}>
                  Restless<span style={{ color: theme.subtext, fontWeight: 400 }}>.faith</span>
                </h1>
                <p className="truncate" style={{ color: theme.subtext, fontSize: "12px" }}>
                  {strings.tagline}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                data-rf-books="true"
                onClick={() => setActiveModal("books")}
                aria-label={BOOKS_TEXT[language].label}
                title={BOOKS_TEXT[language].label}
                className="h-9 px-3 rounded-full inline-flex items-center gap-1.5"
                style={{ backgroundColor: theme.accent, color: "#f5d76e", fontSize: "13px", fontWeight: 700 }}
              >
                <BookOpen className="w-4 h-4" />
                <span className="hidden sm:inline">{BOOKS_TEXT[language].label}</span>
              </button>

              <button
                onClick={handleLanguageToggle}
                aria-label={strings.langToggleLabel}
                className="h-9 px-3 rounded-full"
                style={{ backgroundColor: theme.toggleInactiveBg, color: theme.subtext, fontSize: "13px", fontWeight: 700 }}
              >
                {language === "en" ? "ES" : "EN"}
              </button>

              <button
                onClick={() => setMode(mode === "dark" ? "light" : "dark")}
                aria-label={mode === "dark" ? strings.lightMode : strings.darkMode}
                title={mode === "dark" ? strings.lightMode : strings.darkMode}
                className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{ backgroundColor: theme.toggleInactiveBg, color: theme.accent }}
              >
                {mode === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div
            role="group"
            aria-label={strings.audienceLabel}
            className="mt-3 flex gap-1.5 overflow-x-auto pb-1"
          >
            {AUDIENCES.map((band) => (
              <button
                key={band}
                onClick={() => setAgeBand(band)}
                aria-pressed={ageBand === band}
                className="px-3 py-1 rounded-full shrink-0"
                style={
                  ageBand === band
                    ? { backgroundColor: theme.accent, color: theme.accentText, fontSize: "12px", fontWeight: 700 }
                    : { backgroundColor: theme.toggleInactiveBg, color: theme.subtext, fontSize: "12px" }
                }
              >
                {strings.ageLabels[band]}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main ref={scrollRef} className="flex-1 overflow-y-auto overflow-x-hidden px-3 sm:px-5 py-5">
        <div className="max-w-3xl mx-auto w-full space-y-4 min-w-0">
          {messages.length === 0 && (
            <WelcomePanel theme={theme} strings={strings} />
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
                  language={language}
                  onPrompt={chooseStarter}
                  onOpenBooks={() => setActiveModal("books")}
                />
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div
                className="rounded-2xl px-5 py-4 flex items-center gap-1.5"
                style={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.border}`, padding: "0.75rem 1rem" }}
              >
                <div className="restless-orbit-spinner" role="status" aria-label="Loading answer">
                  {[0, 1, 2].map((i) => (
                    <span key={i} style={{ backgroundColor: theme.dotColor }} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer
        className="shrink-0 px-4 sm:px-5 py-3.5"
        style={{ borderTop: `1px solid ${theme.border}`, backgroundColor: theme.bg }}
      >
        <div className="max-w-3xl mx-auto w-full">
          {error && (
            <div className="mb-2 flex items-center justify-between gap-3">
              <p style={{ color: theme.accentSecondary, fontSize: "13px" }}>{error}</p>
              <button
                onClick={handleSend}
                className="flex items-center gap-1.5 shrink-0"
                style={{ color: theme.accent, fontSize: "13px", fontWeight: 700 }}
              >
                <RefreshCcw className="w-3.5 h-3.5" />
                {strings.retryLabel}
              </button>
            </div>
          )}

          <StarterQuestions theme={theme} strings={strings} chooseStarter={chooseStarter} />

          <div className="flex items-end gap-2.5 min-w-0">
            <textarea
              data-question-input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              maxLength={1000}
              aria-label={strings.placeholder}
              placeholder={strings.placeholder}
              rows={2}
              className="flex-1 min-w-0 resize-none rounded-2xl px-4 py-3 focus:outline-none overflow-y-auto max-h-40"
              style={{
                backgroundColor: theme.cardBg,
                color: theme.text,
                border: `1px solid ${theme.border}`,
                fontSize: "17px",
                boxSizing: "border-box",
              }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              aria-label="Send question"
              className="shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center"
              style={
                input.trim() && !isTyping
                  ? { backgroundColor: theme.accent, color: theme.accentText }
                  : { backgroundColor: theme.disabledBg, color: theme.disabledText }
              }
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-start gap-2.5 mt-2.5 flex-wrap" aria-live="polite">
            <button onClick={() => setActiveModal("about")} style={{ color: theme.subtext, fontSize: "12px" }}>
              {strings.aboutLabel}
            </button>
            <span style={{ color: theme.muted, fontSize: "12px" }}>·</span>
            <button onClick={() => setActiveModal("contact")} style={{ color: theme.subtext, fontSize: "12px" }}>
              {strings.contactLabel}
            </button>
            <span style={{ color: theme.muted, fontSize: "12px" }}>·</span>
            <button
              data-rf-books="true"
              onClick={() => setActiveModal("books")}
              style={{ color: "#f5d76e", fontSize: "12px", fontWeight: 700 }}
            >
              {BOOKS_TEXT[language].label}
            </button>
            <span style={{ color: theme.muted, fontSize: "12px" }}>·</span>
            <button
              onClick={() => setActiveModal("support")}
              style={{ color: theme.accent, fontSize: "12px", fontWeight: 700 }}
            >
              {strings.supportLabel}
            </button>
            <span style={{ color: theme.muted, fontSize: "12px" }}>·</span>
            <button
              onClick={handleSiteShare}
              className="inline-flex items-center gap-1"
              style={{ color: siteShareCopied ? theme.accent : theme.subtext, fontSize: "12px", fontWeight: 600 }}
            >
              {siteShareCopied ? <Check className="w-3 h-3" /> : <Share2 className="w-3 h-3" />}
              {siteShareError
                ? strings.siteShareFailed
                : siteShareCopied
                  ? strings.siteShareCopied
                  : strings.siteShareLabel}
            </button>
            <TextSizeControls
              fontScale={fontScale}
              setFontScale={setFontScale}
              theme={theme}
              strings={strings}
            />
          </div>
        </div>
      </footer>

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

      {activeModal === "books" && (
        <BooksModal theme={theme} strings={strings} language={language} onClose={() => setActiveModal(null)} />
      )}

      {activeModal === "support" && (
        <InfoModal
          title={strings.supportTitle}
          body={strings.supportBody}
          cta={
            strings.supportUrl.includes("REPLACE_WITH")
              ? undefined
              : { label: strings.supportButtonLabel, href: strings.supportUrl }
          }
          theme={theme}
          strings={strings}
          onClose={() => setActiveModal(null)}
        />
      )}
    </div>
  );
}
