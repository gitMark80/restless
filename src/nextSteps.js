// Next-step cards shown under each answer. Pure data + classification; the
// card itself is rendered by NextStepPanel in App.jsx.

export const NEXT_STEP_TEXT = {
  en: {
    tagline: "Ask boldly. Learn deeply. Stay human.",
    nextStepEyebrow: "FROM ANSWER TO ENCOUNTER",
    nextStepTitle: "Take the next step",
    nextStepGeneral: "Choose one small step that moves this from information toward a real relationship with Jesus.",
    becomeCatholic: "Thinking about becoming Catholic?",
    becomeCatholicBody:
      "You do not have to figure it out alone. A parish OCIA team can walk with you, answer questions, and help you prepare for the sacraments.",
    sponsorBody:
      "If you do not already know a Catholic who can sponsor you, tell the parish OCIA coordinator. Parishes can often help connect you with an eligible sponsor who will walk with you.",
    findParish: "Find a Catholic parish",
    howOciaWorks: "How does OCIA work?",
    findSponsor: "How do I find an OCIA sponsor?",
    exploreCatholic: "Explore becoming Catholic",
    eucharistTitle: "Meet Jesus beyond the answer",
    eucharistBody:
      "Take one concrete step toward the Eucharist: read John 6, learn about Eucharistic miracles, or spend quiet time with Jesus in Adoration.",
    miracles: "Explore Eucharistic miracles",
    adorationPrompt: "Guide me through my first visit to Eucharistic Adoration.",
    adoration: "Prepare for Adoration",
    confessionTitle: "Take one step back toward mercy",
    confessionBody:
      "If this question is drawing you toward Confession, you can prepare gently, find a parish, and ask what to expect before you go.",
    confessionPrompt: "Help me prepare for Confession step by step without overwhelming me.",
    prepareConfession: "Prepare for Confession",
    prayerTitle: "Turn the answer into prayer",
    prayerBody: "You can stop reading for a moment and bring this question directly to God in your own words.",
    prayerPrompt: "Help me pray about this for two minutes in a simple Catholic way.",
    prayNow: "Help me pray now",
    hurtingTitle: "Do not carry this only with an app",
    hurtingBody:
      "If this question is personal or painful, bring it to someone who can stay with you — a priest, trusted Catholic mentor, counselor, family member, or friend.",
    talkPrompt: "Help me think of the right real person to talk to about this and what I could say to them.",
    helpMeTalk: "Help me talk to someone",
    scripturePrompt: "Give me one short Scripture passage to pray with about this, and explain why it fits.",
    scripture: "Pray with Scripture",
    crisisTitle: "You don't have to carry this alone",
    crisisBody:
      "If you're thinking about ending your life or hurting yourself, please reach out to someone right now. In the U.S., you can call or text 988 any time, day or night, to talk with someone at the 988 Suicide & Crisis Lifeline. If you're in immediate danger, call 911.",
    crisisCall: "Call 988",
    crisisText: "Text 988",
    crisisChat: "Chat at 988lifeline.org",
    sponsorNote: "Sponsors are normally connected through the local parish; Restless does not match strangers directly.",
  },
  es: {
    tagline: "Pregunta con valentía. Aprende a fondo. Sigue siendo humano.",
    nextStepEyebrow: "DE LA RESPUESTA AL ENCUENTRO",
    nextStepTitle: "Da el siguiente paso",
    nextStepGeneral: "Elige un paso pequeño que lleve esto de información a una relación real con Jesús.",
    becomeCatholic: "¿Estás pensando en hacerte católico?",
    becomeCatholicBody:
      "No tienes que resolverlo solo. Un equipo parroquial de OCIA puede acompañarte, responder preguntas y ayudarte a prepararte para los sacramentos.",
    sponsorBody:
      "Si todavía no conoces a un católico que pueda ser tu padrino o madrina, díselo al coordinador de OCIA. La parroquia normalmente puede ayudarte a encontrar a una persona apta que te acompañe.",
    findParish: "Encontrar una parroquia católica",
    howOciaWorks: "¿Cómo funciona OCIA?",
    findSponsor: "¿Cómo encuentro padrino de OCIA?",
    exploreCatholic: "Explorar cómo hacerse católico",
    eucharistTitle: "Encuentra a Jesús más allá de la respuesta",
    eucharistBody:
      "Da un paso concreto hacia la Eucaristía: lee Juan 6, conoce los milagros eucarísticos o pasa un rato en silencio con Jesús en la Adoración.",
    miracles: "Ver milagros eucarísticos",
    adorationPrompt: "Guíame en mi primera visita a la Adoración Eucarística.",
    adoration: "Prepararme para la Adoración",
    confessionTitle: "Da un paso hacia la misericordia",
    confessionBody:
      "Si esta pregunta te está acercando a la Confesión, puedes prepararte con calma, encontrar una parroquia y saber qué esperar antes de ir.",
    confessionPrompt: "Ayúdame a prepararme para la Confesión paso a paso sin abrumarme.",
    prepareConfession: "Prepararme para la Confesión",
    prayerTitle: "Convierte la respuesta en oración",
    prayerBody: "Puedes dejar de leer por un momento y llevar esta pregunta directamente a Dios con tus propias palabras.",
    prayerPrompt: "Ayúdame a orar sobre esto durante dos minutos de una manera católica sencilla.",
    prayNow: "Ayúdame a orar ahora",
    hurtingTitle: "No cargues esto solamente con una aplicación",
    hurtingBody:
      "Si esta pregunta es personal o dolorosa, llévala a alguien que pueda acompañarte: un sacerdote, mentor católico de confianza, consejero, familiar o amigo.",
    talkPrompt: "Ayúdame a pensar con qué persona real debería hablar sobre esto y qué podría decirle.",
    helpMeTalk: "Ayúdame a hablar con alguien",
    scripturePrompt: "Dame un pasaje breve de la Escritura para orar sobre esto y explícame por qué encaja.",
    scripture: "Orar con la Escritura",
    crisisTitle: "No tienes que cargar esto solo",
    crisisBody:
      "Si estás pensando en quitarte la vida o hacerte daño, busca a alguien ahora mismo. En EE. UU. puedes llamar o enviar un mensaje de texto al 988 a cualquier hora para hablar con alguien de la Línea 988 de Prevención del Suicidio y Crisis (con atención en español). Si estás en peligro inmediato, llama al 911.",
    crisisCall: "Llamar al 988",
    crisisText: "Texto al 988",
    crisisChat: "Chatear en 988lifeline.org",
    sponsorNote: "Los padrinos normalmente se coordinan por medio de la parroquia local; Restless no conecta directamente a desconocidos.",
  },
};

const NEXT_STEP_LINKS = {
  crisisCall: "tel:988",
  crisisText: "sms:988",
  crisisChat: "https://988lifeline.org/chat/",
  parish: "https://masstimes.org/",
  miracles: "https://www.miracolieucaristici.org/",
};

// Checked first, before any topical match: a question that mentions suicide or
// self-harm always gets the crisis card, even if it also mentions a sacrament.
const CRISIS_PATTERN =
  /suicid|kill(ing)? (my ?self|myself)|end(ing)? my (own )?life|end it all|take my (own )?life|want(ed)? to die|wish i (was|were) dead|better off dead|no reason to live|don'?t want to (live|be alive|exist)|self[- ]?harm|hurt(ing)? myself|cut(ting)? myself|matarme|quitarme la vida|quiero morir|no quiero vivir|hacerme da[ñn]o|autolesi|cortarme/;

export function classifyNextStep(question) {
  const text = String(question || "").toLowerCase();
  if (CRISIS_PATTERN.test(text)) {
    return "crisis";
  }
  if (/become catholic|becoming catholic|convert|conversion|ocia|rcia|join the church|sponsor|padrin|hacerme cat[oó]lico|convertirme|entrar a la iglesia/.test(text)) {
    return "ocia";
  }
  if (/euchar|communion|adoration|blessed sacrament|real presence|body and blood|misa|comuni[oó]n|adoraci[oó]n|sant[ií]simo/.test(text)) {
    return "eucharist";
  }
  if (/confess|confession|reconciliation|mortal sin|venial sin|confesi[oó]n|reconciliaci[oó]n|pecado mortal/.test(text)) {
    return "confession";
  }
  // Phrases rather than bare words: "faith alone", "solo los hombres" and
  // "life after death" are doctrine questions, not someone who is hurting.
  if (/grief|grieving|\bdied\b|passed away|funeral|lost my|miscarriage|lonely|loneliness|feel(ing)? (so )?alone|i'?m hurting|hurts so much|suffering|abuse|despair|hopeless|duelo|muri[oó]|falleci|me siento sol[oa]|soledad|sufrimiento|abuso|desesper/.test(text)) {
    return "hurting";
  }
  if (/pray|prayer|rosary|how do i talk to god|orar|oraci[oó]n|rosario|hablar con dios/.test(text)) {
    return "prayer";
  }
  return "general";
}

export function nextStepContent(kind, language) {
  const text = NEXT_STEP_TEXT[language];
  if (kind === "crisis") {
    return {
      title: text.crisisTitle,
      body: text.crisisBody,
      actions: [
        { label: text.crisisCall, href: NEXT_STEP_LINKS.crisisCall },
        { label: text.crisisText, href: NEXT_STEP_LINKS.crisisText },
        { label: text.crisisChat, href: NEXT_STEP_LINKS.crisisChat },
        { label: text.helpMeTalk, prompt: text.talkPrompt },
      ],
    };
  }
  if (kind === "ocia") {
    return {
      title: text.becomeCatholic,
      body: `${text.becomeCatholicBody} ${text.sponsorBody}`,
      note: text.sponsorNote,
      actions: [
        { label: text.findParish, href: NEXT_STEP_LINKS.parish },
        {
          label: text.howOciaWorks,
          prompt: language === "es" ? "Explícame cómo funciona OCIA y cómo empezar en una parroquia." : "Explain how OCIA works and how I can get started at a parish.",
        },
        { label: text.findSponsor, prompt: language === "es" ? "¿Cómo encuentro un padrino o madrina para OCIA si todavía no conozco a nadie?" : "How do I find an OCIA sponsor if I do not already know someone?" },
      ],
    };
  }
  if (kind === "eucharist") {
    return {
      title: text.eucharistTitle,
      body: text.eucharistBody,
      actions: [
        { label: text.adoration, prompt: text.adorationPrompt },
        { label: text.miracles, href: NEXT_STEP_LINKS.miracles },
        { label: text.findParish, href: NEXT_STEP_LINKS.parish },
      ],
    };
  }
  if (kind === "confession") {
    return {
      title: text.confessionTitle,
      body: text.confessionBody,
      actions: [
        { label: text.prepareConfession, prompt: text.confessionPrompt },
        { label: text.findParish, href: NEXT_STEP_LINKS.parish },
      ],
    };
  }
  if (kind === "prayer") {
    return {
      title: text.prayerTitle,
      body: text.prayerBody,
      actions: [
        { label: text.prayNow, prompt: text.prayerPrompt },
        { label: text.scripture, prompt: text.scripturePrompt },
      ],
    };
  }
  if (kind === "hurting") {
    return {
      title: text.hurtingTitle,
      body: text.hurtingBody,
      actions: [
        { label: text.helpMeTalk, prompt: text.talkPrompt },
        { label: text.findParish, href: NEXT_STEP_LINKS.parish },
      ],
    };
  }
  return {
    title: text.nextStepTitle,
    body: text.nextStepGeneral,
    actions: [
      { label: text.prayNow, prompt: text.prayerPrompt },
      { label: text.scripture, prompt: text.scripturePrompt },
      {
        label: text.exploreCatholic,
        prompt: language === "es" ? "Estoy pensando en hacerme católico. ¿Cuál debería ser mi primer paso?" : "I am thinking about becoming Catholic. What should my first step be?",
      },
    ],
  };
}

// Base styles for the "thinking" indicator (mockupCleanup.js restyles it).
if (typeof document !== "undefined" && !document.getElementById("restless-spinner-styles")) {
  const style = document.createElement("style");
  style.id = "restless-spinner-styles";
  style.textContent = `
    @keyframes restless-orbit { to { transform: rotate(360deg); } }
    .restless-orbit-spinner {
      position: relative;
      width: 30px;
      height: 30px;
      animation: restless-orbit 1.05s linear infinite;
    }
    .restless-orbit-spinner > span {
      position: absolute;
      left: 50%;
      top: 50%;
      width: 5px;
      height: 5px;
      border-radius: 999px;
      transform-origin: 0 0;
    }
  `;
  document.head.appendChild(style);
}
