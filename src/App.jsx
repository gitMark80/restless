import React, { useEffect, useRef, useState } from "react";
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
  Compass,
  ArrowRight,
} from "lucide-react";

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

const STRINGS = {
  en: {
    tagline: "Modern questions. Timeless truth.",
    humanBadge: "Human-first Catholic AI",
    heroTitle: "Ask boldly. Learn deeply. Stay human.",
    heroBody:
      "Restless uses AI to guide you toward Scripture, the Catechism, prayer, and real people — not replace them.",
    principles: [
      { title: "Think", body: "Put the answer into your own words." },
      { title: "Verify", body: "Open the primary Catholic sources." },
      { title: "Talk", body: "Bring important questions to a real person." },
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
      "Get a clear answer grounded in Catholic teaching, then use Go Deeper to verify it and make it your own.",
    starterQuestions: [
      "Why do Catholics believe the Eucharist is really Jesus?",
      "Is praying to saints the same as worshiping them?",
      "Why do Catholics believe Peter was the first Pope?",
      "Why do Catholics baptize babies?",
    ],
    startersLabel: "Try a question",
    placeholder: "Ask a question about faith, Scripture, morality, or the Church…",
    retryError: "That didn't come through. Tap send again to retry.",
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
    readFullText: "Read source ↗",
    aboutLabel: "About",
    contactLabel: "Contact",
    closeLabel: "Close",
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
    supportUrl: "https://buy.stripe.com/REPLACE_WITH_YOUR_PAYMENT_LINK",
    growthModeOn: "Go Deeper on",
    growthModeOff: "Go Deeper off",
    growthTitle: "Go deeper",
    growthSubtitle: "Don't just take the AI's word for it.",
    readTitle: "1. Verify it",
    readBody: "Open the sources and see the teaching in context.",
    thinkTitle: "2. Think without AI",
    thinkBody: "Explain the answer in your own words before asking another question.",
    thinkPrompt: "In my own words…",
    talkTitle: "3. Bring it to a person",
    talkBody:
      "For something important, ask a parent, teacher, priest, sponsor, youth minister, or trusted mentor what this looks like in real life.",
    saveReflection: "Keep reflection",
    reflectionSaved: "Saved on this screen",
    newQuestion: "Ask a follow-up",
    sourceFallback: "Open the cited source above.",
  },
  es: {
    tagline: "Preguntas modernas. Verdad eterna.",
    humanBadge: "IA católica centrada en la persona",
    heroTitle: "Pregunta con valentía. Aprende a fondo. Sigue siendo humano.",
    heroBody:
      "Restless usa IA para guiarte hacia la Escritura, el Catecismo, la oración y personas reales — no para reemplazarlas.",
    principles: [
      { title: "Piensa", body: "Explica la respuesta con tus propias palabras." },
      { title: "Verifica", body: "Abre las fuentes católicas primarias." },
      { title: "Habla", body: "Lleva las preguntas importantes a una persona real." },
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
      "Recibe una respuesta clara basada en la enseñanza católica y usa Profundiza para verificarla y hacerla tuya.",
    starterQuestions: [
      "¿Por qué creen los católicos que la Eucaristía es realmente Jesús?",
      "¿Rezar a los santos es lo mismo que adorarlos?",
      "¿Por qué creen los católicos que Pedro fue el primer Papa?",
      "¿Por qué bautizan los católicos a los bebés?",
    ],
    startersLabel: "Prueba una pregunta",
    placeholder: "Pregunta sobre la fe, la Escritura, la moral o la Iglesia…",
    retryError: "Eso no llegó. Toca enviar para intentarlo de nuevo.",
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
    readFullText: "Leer fuente ↗",
    aboutLabel: "Acerca de",
    contactLabel: "Contacto",
    closeLabel: "Cerrar",
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
    supportUrl: "https://buy.stripe.com/REPLACE_WITH_YOUR_PAYMENT_LINK",
    growthModeOn: "Profundiza activado",
    growthModeOff: "Profundiza desactivado",
    growthTitle: "Profundiza",
    growthSubtitle: "No aceptes algo solo porque lo dijo la IA.",
    readTitle: "1. Verifícalo",
    readBody: "Abre las fuentes y lee la enseñanza en contexto.",
    thinkTitle: "2. Piensa sin IA",
    thinkBody: "Explica la respuesta con tus propias palabras antes de hacer otra pregunta.",
    thinkPrompt: "Con mis propias palabras…",
    talkTitle: "3. Llévalo a una persona",
    talkBody:
      "Si es importante, háblalo con un padre, maestro, sacerdote, padrino, ministro juvenil o mentor de confianza.",
    saveReflection: "Guardar reflexión",
    reflectionSaved: "Guardado en esta pantalla",
    newQuestion: "Haz una pregunta de seguimiento",
    sourceFallback: "Abre la fuente citada arriba.",
  },
};

const SEED_MESSAGES = { en: [], es: [] };

async function askCompanion(question, ageBand, language, history) {
  const now = new Date();
  const todayDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
    now.getDate()
  ).padStart(2, "0")}`;

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
  if (!response.ok) throw new Error(data.error || "Something went wrong. Please try again.");
  if (!data.text || typeof data.text !== "string") {
    throw new Error("The answer was incomplete. Please try again.");
  }
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

function GrowthGuide({ message, questionText, theme, strings, onFollowUp }) {
  const [reflection, setReflection] = useState("");
  const [saved, setSaved] = useState(false);
  const firstSource = message.sources?.find((source) => source.url);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  return (
    <section
      className="rounded-2xl overflow-hidden"
      style={{
        border: `1px solid ${theme.citationBorder}`,
        background: `linear-gradient(145deg, ${theme.citationBg}, ${theme.cardBg})`,
      }}
    >
      <div
        className="px-4 py-4 flex items-start justify-between gap-3"
        style={{ borderBottom: `1px solid ${theme.border}` }}
      >
        <div>
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4" style={{ color: theme.accent }} />
            <h3 style={{ color: theme.text, fontSize: "17px", fontWeight: 700 }}>{strings.growthTitle}</h3>
          </div>
          <p className="mt-1" style={{ color: theme.subtext, fontSize: "14px" }}>
            {strings.growthSubtitle}
          </p>
        </div>
      </div>

      <div className="grid sm:grid-cols-3">
        <div className="p-4" style={{ borderBottom: `1px solid ${theme.border}` }}>
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" style={{ color: theme.accent }} />
            <h4 style={{ color: theme.text, fontSize: "15px", fontWeight: 700 }}>{strings.readTitle}</h4>
          </div>
          <p className="mt-2 leading-relaxed" style={{ color: theme.subtext, fontSize: "14px" }}>
            {strings.readBody}
          </p>
          {firstSource ? (
            <a
              href={firstSource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 mt-3"
              style={{ color: theme.accent, fontSize: "13px", fontWeight: 700 }}
            >
              {firstSource.label}
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          ) : (
            <p className="mt-3" style={{ color: theme.muted, fontSize: "13px" }}>
              {strings.sourceFallback}
            </p>
          )}
        </div>

        <div
          className="p-4"
          style={{ borderBottom: `1px solid ${theme.border}`, borderLeft: `1px solid ${theme.border}` }}
        >
          <div className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4" style={{ color: theme.accent }} />
            <h4 style={{ color: theme.text, fontSize: "15px", fontWeight: 700 }}>{strings.thinkTitle}</h4>
          </div>
          <p className="mt-2 leading-relaxed" style={{ color: theme.subtext, fontSize: "14px" }}>
            {strings.thinkBody}
          </p>
          <textarea
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            placeholder={strings.thinkPrompt}
            rows={3}
            maxLength={500}
            className="mt-3 w-full resize-none rounded-xl px-3 py-2 focus:outline-none"
            style={{
              backgroundColor: theme.surface,
              border: `1px solid ${theme.border}`,
              color: theme.text,
              fontSize: "14px",
            }}
          />
          <button
            onClick={handleSave}
            disabled={!reflection.trim()}
            className="mt-2"
            style={{
              color: reflection.trim() ? theme.accent : theme.muted,
              fontSize: "12px",
              fontWeight: 700,
            }}
          >
            {saved ? strings.reflectionSaved : strings.saveReflection}
          </button>
        </div>

        <div
          className="p-4"
          style={{ borderBottom: `1px solid ${theme.border}`, borderLeft: `1px solid ${theme.border}` }}
        >
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" style={{ color: theme.accent }} />
            <h4 style={{ color: theme.text, fontSize: "15px", fontWeight: 700 }}>{strings.talkTitle}</h4>
          </div>
          <p className="mt-2 leading-relaxed" style={{ color: theme.subtext, fontSize: "14px" }}>
            {strings.talkBody}
          </p>
          <button
            onClick={() => onFollowUp(questionText)}
            className="inline-flex items-center gap-1 mt-3"
            style={{ color: theme.accent, fontSize: "13px", fontWeight: 700 }}
          >
            {strings.newQuestion}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
}

function CompanionMessage({ message, questionText, theme, strings, growthMode, onFollowUp }) {
  const [openSources, setOpenSources] = useState({});

  return (
    <div className="flex justify-start min-w-0">
      <div className="space-y-3 min-w-0 flex-1" style={{ maxWidth: "100%" }}>
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
            {growthMode && (
              <GrowthGuide
                message={message}
                questionText={questionText}
                theme={theme}
                strings={strings}
                onFollowUp={onFollowUp}
              />
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
        <div className="flex items-center justify-between gap-4 mb-4">
          <h2 style={{ color: theme.text, fontSize: "22px", fontWeight: 700 }}>{title}</h2>
          <button onClick={onClose} aria-label={strings.closeLabel}>
            <X className="w-5 h-5" style={{ color: theme.subtext }} />
          </button>
        </div>
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
      </div>
    </div>
  );
}

function WelcomePanel({ theme, strings, chooseStarter }) {
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
            return (
              <div
                key={item.title}
                className="rounded-xl px-2.5 py-2 flex items-center gap-1.5 min-w-0"
                style={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.border}` }}
                title={item.body}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" style={{ color: theme.accent }} />
                <span
                  className="truncate whitespace-nowrap"
                  style={{ color: theme.text, fontSize: "12px", fontWeight: 700 }}
                >
                  {item.title}
                </span>
              </div>
            );
          })}
        </div>
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

        <p className="mt-4 mb-2" style={{ color: theme.muted, fontSize: "12px", fontWeight: 700 }}>
          {strings.startersLabel}
        </p>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {strings.starterQuestions.map((question) => (
            <button
              key={question}
              onClick={() => chooseStarter(question)}
              className="shrink-0 rounded-full px-3 py-2 text-left"
              style={{
                backgroundColor: theme.cardBg,
                color: theme.text,
                fontSize: "13px",
                border: `1px solid ${theme.border}`,
              }}
            >
              {question}
            </button>
          ))}
        </div>
      </div>
    </section>
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
  const [activeModal, setActiveModal] = useState(null);
  const [growthMode, setGrowthMode] = useState(true);
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

  useEffect(() => {
    document.documentElement.style.overflowX = "hidden";
    document.body.style.overflowX = "hidden";
    document.body.style.margin = "0";
  }, []);

  const handleLanguageToggle = () => {
    const next = language === "en" ? "es" : "en";
    setLanguage(next);
    setMessages(SEED_MESSAGES[next]);
    setError(null);
    setInput("");
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
      setError(err?.message || strings.retryError);
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
    requestAnimationFrame(() => document.querySelector("textarea[data-question-input]")?.focus());
  };

  const handleFollowUp = (questionText) => {
    const prompt =
      language === "en"
        ? `Help me go one level deeper on this: ${questionText}`
        : `Ayúdame a profundizar un nivel más en esto: ${questionText}`;
    chooseStarter(prompt);
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
        inset: 0,
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
                onClick={() => setGrowthMode((value) => !value)}
                aria-pressed={growthMode}
                className="hidden sm:flex h-9 px-3 rounded-full items-center gap-2"
                style={{
                  backgroundColor: growthMode ? theme.elevated : theme.toggleInactiveBg,
                  color: growthMode ? theme.accent : theme.subtext,
                  fontSize: "12px",
                  fontWeight: 700,
                }}
              >
                <Compass className="w-3.5 h-3.5" />
                {growthMode ? strings.growthModeOn : strings.growthModeOff}
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
                className="w-9 h-9 rounded-full flex items-center justify-center"
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

          <div className="mt-3 flex items-center gap-2">
            <p id="answer-level-label" className="shrink-0" style={{ color: theme.muted, fontSize: "11px", fontWeight: 700 }}>
              {strings.audienceLabel}
            </p>
            <div role="group" aria-labelledby="answer-level-label" className="flex gap-1.5 overflow-x-auto pb-1">
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

          <button
            onClick={() => setGrowthMode((value) => !value)}
            aria-pressed={growthMode}
            className="sm:hidden mt-2 inline-flex h-8 px-3 rounded-full items-center gap-2"
            style={{
              backgroundColor: growthMode ? theme.elevated : theme.toggleInactiveBg,
              color: growthMode ? theme.accent : theme.subtext,
              fontSize: "11px",
              fontWeight: 700,
            }}
          >
            <Compass className="w-3.5 h-3.5" />
            {growthMode ? strings.growthModeOn : strings.growthModeOff}
          </button>
        </div>
      </header>

      <main ref={scrollRef} className="flex-1 overflow-y-auto overflow-x-hidden px-3 sm:px-5 py-5">
        <div className="max-w-3xl mx-auto w-full space-y-4 min-w-0">
          {messages.length === 0 && (
            <WelcomePanel theme={theme} strings={strings} chooseStarter={chooseStarter} />
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
                  growthMode={growthMode}
                  onFollowUp={handleFollowUp}
                />
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div
                className="rounded-2xl px-5 py-4 flex items-center gap-1.5"
                style={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.border}` }}
              >
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full animate-bounce"
                    style={{ backgroundColor: theme.dotColor, animationDelay: `${-0.3 + i * 0.15}s` }}
                  />
                ))}
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
