const UI_TEXT = {
  en: {
    tagline: "Ask boldly. Learn deeply. Stay human.",
    verify: "1. Verify it",
    notes: "2. Take notes",
    notesBody: "Write down what you learned, questions you still have, or what you want to remember.",
    notesPlaceholder: "My notes…",
    talk: "3. Bring it to a person",
    followUp: "Ask a follow-up",
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
    sponsorNote: "Sponsors are normally connected through the local parish; Restless does not match strangers directly.",
  },
  es: {
    tagline: "Pregunta con valentía. Aprende a fondo. Sigue siendo humano.",
    verify: "1. Verifícalo",
    notes: "2. Toma notas",
    notesBody: "Escribe lo que aprendiste, las preguntas que aún tienes o lo que quieres recordar.",
    notesPlaceholder: "Mis notas…",
    talk: "3. Llévalo a una persona",
    followUp: "Haz una pregunta de seguimiento",
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
    sponsorNote: "Los padrinos normalmente se coordinan por medio de la parroquia local; Restless no conecta directamente a desconocidos.",
  },
};

const NEXT_STEP_LINKS = {
  parish: "https://masstimes.org/",
  miracles: "https://www.miracolieucaristici.org/",
};

function getLanguage() {
  const toggle = Array.from(document.querySelectorAll("button")).find((button) => {
    const text = button.textContent?.trim();
    return text === "ES" || text === "EN";
  });
  return toggle?.textContent?.trim() === "EN" ? "es" : "en";
}

function findGrowthSections() {
  return Array.from(document.querySelectorAll("section")).filter((section) => {
    const heading = section.querySelector("h3");
    const text = heading?.textContent?.trim().toLowerCase();
    return text === "go deeper" || text === "profundiza";
  });
}

function sourceCardsFor(section) {
  const messageColumn = section.parentElement;
  if (!messageColumn) return [];

  const sources = [];
  for (const anchor of messageColumn.querySelectorAll("a")) {
    if (section.contains(anchor)) continue;
    const text = anchor.textContent?.trim().toLowerCase() || "";
    if (!text.startsWith("read source") && !text.startsWith("leer fuente")) continue;

    let card = anchor.parentElement;
    while (card && card !== messageColumn && !card.querySelector("button span")) {
      card = card.parentElement;
    }
    const label = card?.querySelector("button span")?.textContent?.trim();
    if (!label) continue;
    sources.push({ label, href: anchor.href });
  }

  return sources.filter((source, index, all) =>
    index === all.findIndex((candidate) => candidate.label === source.label && candidate.href === source.href)
  );
}

function addSourceList(section, verifyCard, language) {
  const sources = sourceCardsFor(section);
  if (!sources.length) return;

  const key = sources.map((source) => `${source.label}|${source.href}`).join("||");
  const currentList = verifyCard.querySelector("[data-restless-source-list]");
  if (currentList && verifyCard.dataset.restlessSourcesKey === key) return;
  currentList?.remove();

  const existingLinks = Array.from(verifyCard.querySelectorAll("a"));
  const sourceColor = existingLinks[0] ? getComputedStyle(existingLinks[0]).color : "";
  existingLinks.forEach((link) => link.remove());
  Array.from(verifyCard.querySelectorAll("p")).forEach((paragraph, index) => {
    if (index > 0) paragraph.remove();
  });

  const list = document.createElement("div");
  list.dataset.restlessSourceList = "true";
  list.style.marginTop = "0.7rem";
  list.style.display = "flex";
  list.style.flexDirection = "column";
  list.style.gap = "0.55rem";

  sources.forEach((source) => {
    const row = document.createElement("a");
    row.href = source.href;
    row.target = "_blank";
    row.rel = "noopener noreferrer";
    row.style.display = "flex";
    row.style.alignItems = "flex-start";
    row.style.gap = "0.45rem";
    row.style.fontSize = "13px";
    row.style.fontWeight = "700";
    row.style.lineHeight = "1.35";
    row.style.color = sourceColor || "inherit";
    row.style.textDecoration = "none";

    const arrow = document.createElement("span");
    arrow.setAttribute("aria-hidden", "true");
    arrow.textContent = "↗";
    arrow.style.marginTop = "1px";

    const label = document.createElement("span");
    label.textContent = source.label;

    row.append(arrow, label);
    list.appendChild(row);
  });

  verifyCard.appendChild(list);
  verifyCard.dataset.restlessSourcesKey = key;
  verifyCard.title = `${sources.length} ${language === "es" ? "fuentes" : "sources"}`;
}

function questionForGrowthSection(section) {
  const messageWrapper = section.parentElement?.parentElement?.parentElement;
  const previousTurn = messageWrapper?.previousElementSibling;
  if (!previousTurn) return "";
  return previousTurn.querySelector("p")?.textContent?.trim() || "";
}

function classifyNextStep(question) {
  const text = question.toLowerCase();
  if (/become catholic|becoming catholic|convert|conversion|ocia|rcia|join the church|sponsor|padrin|hacerme cat[oó]lico|convertirme|entrar a la iglesia/.test(text)) {
    return "ocia";
  }
  if (/euchar|communion|adoration|blessed sacrament|real presence|body and blood|misa|comuni[oó]n|adoraci[oó]n|sant[ií]simo/.test(text)) {
    return "eucharist";
  }
  if (/confess|confession|reconciliation|mortal sin|venial sin|confesi[oó]n|reconciliaci[oó]n|pecado mortal/.test(text)) {
    return "confession";
  }
  if (/grief|grieving|died|death|loss|alone|lonely|hurt|hurting|suffering|abuse|despair|duelo|muri[oó]|muerte|p[eé]rdida|solo|sola|dolor|sufrimiento|abuso|desesper/.test(text)) {
    return "hurting";
  }
  if (/pray|prayer|rosary|how do i talk to god|orar|oraci[oó]n|rosario|hablar con dios/.test(text)) {
    return "prayer";
  }
  return "general";
}

function getInputTheme(section) {
  const style = getComputedStyle(section);
  const heading = section.querySelector("h3, h4");
  const paragraph = section.querySelector("p");
  const link = section.querySelector("a, button");
  return {
    background: style.backgroundColor || "transparent",
    border: style.borderColor || "rgba(127,127,127,0.2)",
    text: heading ? getComputedStyle(heading).color : "inherit",
    subtext: paragraph ? getComputedStyle(paragraph).color : "inherit",
    accent: link ? getComputedStyle(link).color : "inherit",
  };
}

function fillQuestion(prompt) {
  const input = document.querySelector("textarea[data-question-input]");
  if (!input) return;
  const descriptor = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, "value");
  descriptor?.set?.call(input, prompt);
  input.dispatchEvent(new Event("input", { bubbles: true }));
  input.focus();
  input.scrollIntoView({ behavior: "smooth", block: "center" });
}

function makeActionButton(label, theme, action) {
  const element = action.href ? document.createElement("a") : document.createElement("button");
  element.textContent = label;
  element.style.display = "inline-flex";
  element.style.alignItems = "center";
  element.style.justifyContent = "center";
  element.style.minHeight = "40px";
  element.style.padding = "0.55rem 0.8rem";
  element.style.borderRadius = "999px";
  element.style.border = `1px solid ${theme.border}`;
  element.style.color = theme.accent;
  element.style.background = "transparent";
  element.style.fontSize = "13px";
  element.style.fontWeight = "800";
  element.style.lineHeight = "1.2";
  element.style.textDecoration = "none";
  element.style.cursor = "pointer";

  if (action.href) {
    element.href = action.href;
    element.target = "_blank";
    element.rel = "noopener noreferrer";
  } else if (action.prompt) {
    element.type = "button";
    element.addEventListener("click", () => fillQuestion(action.prompt));
  }

  return element;
}

function nextStepContent(kind, language) {
  const text = UI_TEXT[language];
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

function ensureNextStep(section, language) {
  const question = questionForGrowthSection(section);
  if (!question) return;

  const kind = classifyNextStep(question);
  const content = nextStepContent(kind, language);
  const key = `${language}|${kind}|${question}`;
  const followWrap = section.nextElementSibling?.matches?.("[data-restless-follow-up]")
    ? section.nextElementSibling
    : null;
  let panel = followWrap?.nextElementSibling;
  if (!panel?.matches?.("[data-restless-next-step]")) {
    panel = section.parentElement?.querySelector(":scope > [data-restless-next-step]");
  }

  if (panel?.dataset.restlessNextStepKey === key) return;
  panel?.remove();

  const theme = getInputTheme(section);
  panel = document.createElement("section");
  panel.dataset.restlessNextStep = "true";
  panel.dataset.restlessNextStepKey = key;
  panel.style.marginTop = "0.9rem";
  panel.style.padding = "1rem";
  panel.style.border = `1px solid ${theme.border}`;
  panel.style.borderRadius = "1rem";
  panel.style.background = theme.background;

  const eyebrow = document.createElement("p");
  eyebrow.textContent = UI_TEXT[language].nextStepEyebrow;
  eyebrow.style.margin = "0 0 0.3rem";
  eyebrow.style.color = theme.accent;
  eyebrow.style.fontSize = "11px";
  eyebrow.style.fontWeight = "900";
  eyebrow.style.letterSpacing = "0.08em";

  const title = document.createElement("h3");
  title.textContent = content.title;
  title.style.margin = "0";
  title.style.color = theme.text;
  title.style.fontSize = "17px";
  title.style.fontWeight = "800";

  const body = document.createElement("p");
  body.textContent = content.body;
  body.style.margin = "0.45rem 0 0";
  body.style.color = theme.subtext;
  body.style.fontSize = "14px";
  body.style.lineHeight = "1.55";

  const actions = document.createElement("div");
  actions.style.display = "flex";
  actions.style.flexWrap = "wrap";
  actions.style.gap = "0.55rem";
  actions.style.marginTop = "0.8rem";
  content.actions.forEach((action) => actions.appendChild(makeActionButton(action.label, theme, action)));

  panel.append(eyebrow, title, body, actions);

  if (content.note) {
    const note = document.createElement("p");
    note.textContent = content.note;
    note.style.margin = "0.7rem 0 0";
    note.style.color = theme.subtext;
    note.style.fontSize = "12px";
    note.style.lineHeight = "1.45";
    panel.appendChild(note);
  }

  const anchor = followWrap || section;
  anchor.insertAdjacentElement("afterend", panel);
}

function polishGrowthSection(section, language) {
  const text = UI_TEXT[language];
  const grid = Array.from(section.children).find((child) => child.classList?.contains("grid"));
  if (!grid) return;
  const cards = Array.from(grid.children).filter((child) => child.tagName === "DIV");
  if (cards.length < 3) return;

  const [verifyCard, notesCard, talkCard] = cards;

  const verifyTitle = verifyCard.querySelector("h4");
  if (verifyTitle && verifyTitle.textContent !== text.verify) verifyTitle.textContent = text.verify;
  addSourceList(section, verifyCard, language);

  const notesTitle = notesCard.querySelector("h4");
  if (notesTitle && notesTitle.textContent !== text.notes) notesTitle.textContent = text.notes;
  const notesBody = notesCard.querySelector("p");
  if (notesBody && notesBody.textContent !== text.notesBody) notesBody.textContent = text.notesBody;
  const notesArea = notesCard.querySelector("textarea");
  if (notesArea && notesArea.placeholder !== text.notesPlaceholder) notesArea.placeholder = text.notesPlaceholder;

  const talkTitle = talkCard.querySelector("h4");
  if (talkTitle && talkTitle.textContent !== text.talk) talkTitle.textContent = text.talk;

  const followButton = Array.from(talkCard.querySelectorAll("button")).find((button) =>
    /follow-up|seguimiento/i.test(button.textContent || "")
  );

  if (followButton) {
    let followWrap = section.nextElementSibling;
    if (!followWrap?.matches?.("[data-restless-follow-up]")) {
      followWrap = document.createElement("div");
      followWrap.dataset.restlessFollowUp = "true";
      followWrap.style.display = "flex";
      followWrap.style.justifyContent = "center";
      followWrap.style.marginTop = "0.9rem";
      section.insertAdjacentElement("afterend", followWrap);
    }

    followWrap.appendChild(followButton);
    followButton.style.fontSize = "17px";
    followButton.style.fontWeight = "800";
    followButton.style.display = "inline-flex";
    followButton.style.alignItems = "center";
    followButton.style.gap = "0.5rem";
    followButton.style.padding = "0.55rem 0.75rem";
    followButton.style.marginTop = "0";
    followButton.setAttribute("aria-label", text.followUp);

    const icon = followButton.querySelector("svg");
    if (icon) {
      icon.style.transform = "rotate(90deg)";
      icon.style.width = "18px";
      icon.style.height = "18px";
    }
  }

  ensureNextStep(section, language);
}

function ensureConversionPath(language) {
  const heading = Array.from(document.querySelectorAll("h3")).find((node) =>
    /studying theology|estudias teolog/i.test(node.textContent || "")
  );
  const welcomeSection = heading?.closest("section");
  if (!welcomeSection) return;

  let card = welcomeSection.querySelector("[data-restless-conversion-path]");
  if (card) {
    if (card.dataset.language === language) return;
    card.remove();
  }

  const text = UI_TEXT[language];
  const theme = getInputTheme(welcomeSection);
  card = document.createElement("div");
  card.dataset.restlessConversionPath = "true";
  card.dataset.language = language;
  card.style.marginTop = "1rem";
  card.style.padding = "0.9rem";
  card.style.border = `1px solid ${theme.border}`;
  card.style.borderRadius = "0.9rem";
  card.style.background = "transparent";

  const title = document.createElement("h4");
  title.textContent = text.becomeCatholic;
  title.style.margin = "0";
  title.style.color = theme.text;
  title.style.fontSize = "15px";
  title.style.fontWeight = "800";

  const body = document.createElement("p");
  body.textContent = text.becomeCatholicBody;
  body.style.margin = "0.35rem 0 0";
  body.style.color = theme.subtext;
  body.style.fontSize = "13px";
  body.style.lineHeight = "1.5";

  const actions = document.createElement("div");
  actions.style.display = "flex";
  actions.style.flexWrap = "wrap";
  actions.style.gap = "0.5rem";
  actions.style.marginTop = "0.7rem";
  actions.append(
    makeActionButton(text.findParish, theme, { href: NEXT_STEP_LINKS.parish }),
    makeActionButton(text.findSponsor, theme, {
      prompt: language === "es" ? "¿Cómo encuentro un padrino o madrina para OCIA si todavía no conozco a nadie?" : "How do I find an OCIA sponsor if I do not already know someone?",
    })
  );

  card.append(title, body, actions);
  welcomeSection.appendChild(card);
}

function polishHeader(language) {
  const brand = Array.from(document.querySelectorAll("h1")).find((heading) =>
    /restless/i.test(heading.textContent || "")
  );
  if (brand) {
    if (brand.textContent !== "Restless.faith") brand.textContent = "Restless.faith";
    brand.style.fontSize = "20px";
    brand.style.fontWeight = "600";
    brand.style.letterSpacing = "-0.01em";
  }

  if (brand?.parentElement) {
    const tagline = brand.parentElement.querySelector("p");
    if (tagline && tagline.textContent !== UI_TEXT[language].tagline) {
      tagline.textContent = UI_TEXT[language].tagline;
    }
  }
}

function ensureSpinnerStyles() {
  if (document.getElementById("restless-spinner-styles")) return;
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

function polishSpinner() {
  ensureSpinnerStyles();
  const groups = Array.from(document.querySelectorAll("div")).filter((div) => {
    const directDots = Array.from(div.children).filter((child) => child.matches?.("span.animate-bounce"));
    return directDots.length === 3;
  });

  groups.forEach((group) => {
    if (group.dataset.restlessSpinner === "true") return;
    const oldDots = Array.from(group.children).filter((child) => child.matches?.("span.animate-bounce"));
    const color = oldDots[0]?.style.backgroundColor || "currentColor";
    oldDots.forEach((dot) => dot.remove());

    const spinner = document.createElement("div");
    spinner.className = "restless-orbit-spinner";
    spinner.setAttribute("role", "status");
    spinner.setAttribute("aria-label", "Loading answer");

    for (let i = 0; i < 8; i += 1) {
      const dot = document.createElement("span");
      const angle = i * 45;
      const opacity = 0.35 + i * 0.08;
      dot.style.backgroundColor = color;
      dot.style.opacity = String(Math.min(opacity, 1));
      dot.style.transform = `rotate(${angle}deg) translate(10px, -2.5px)`;
      spinner.appendChild(dot);
    }

    group.appendChild(spinner);
    group.dataset.restlessSpinner = "true";
    group.style.padding = "0.75rem 1rem";
  });
}

let scheduled = false;
function polish() {
  if (scheduled) return;
  scheduled = true;
  requestAnimationFrame(() => {
    scheduled = false;
    const language = getLanguage();
    polishHeader(language);
    ensureConversionPath(language);
    findGrowthSections().forEach((section) => polishGrowthSection(section, language));
    polishSpinner();
  });
}

const observer = new MutationObserver(polish);
observer.observe(document.documentElement, { childList: true, subtree: true, characterData: true });
window.addEventListener("load", polish);
polish();
