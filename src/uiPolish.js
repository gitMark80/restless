const UI_TEXT = {
  en: {
    tagline: "Ask boldly. Learn deeply. Stay human.",
    verify: "1. Verify it",
    notes: "2. Take notes",
    notesBody: "Write down what you learned, questions you still have, or what you want to remember.",
    notesPlaceholder: "My notes…",
    talk: "3. Bring it to a person",
    followUp: "Ask a follow-up",
    readSource: "Read source",
  },
  es: {
    tagline: "Pregunta con valentía. Aprende a fondo. Sigue siendo humano.",
    verify: "1. Verifícalo",
    notes: "2. Toma notas",
    notesBody: "Escribe lo que aprendiste, las preguntas que aún tienes o lo que quieres recordar.",
    notesPlaceholder: "Mis notas…",
    talk: "3. Llévalo a una persona",
    followUp: "Haz una pregunta de seguimiento",
    readSource: "Leer fuente",
  },
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

  verifyCard.querySelectorAll("[data-restless-source-list]").forEach((node) => node.remove());

  const existingLinks = Array.from(verifyCard.querySelectorAll("a"));
  existingLinks.forEach((link) => link.remove());
  Array.from(verifyCard.querySelectorAll("p")).forEach((paragraph, index) => {
    if (index > 0) paragraph.remove();
  });

  const list = document.createElement("div");
  list.dataset.restlessSourceList = "true";
  list.style.marginTop = "0.7rem";
  list.style.display = "flex";
  list.style.flexDirection = "column";
  list.style.gap = "0.5rem";

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
    row.style.color = "inherit";
    row.style.textDecoration = "none";
    row.innerHTML = `<span aria-hidden="true" style="margin-top:1px">↗</span><span>${source.label}</span>`;
    list.appendChild(row);
  });

  verifyCard.appendChild(list);
  verifyCard.dataset.restlessSources = String(sources.length);
  verifyCard.title = `${sources.length} ${language === "es" ? "fuentes" : "sources"}`;
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

    if (!followWrap.contains(followButton)) followWrap.appendChild(followButton);
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
    findGrowthSections().forEach((section) => polishGrowthSection(section, language));
    polishSpinner();
  });
}

const observer = new MutationObserver(polish);
observer.observe(document.documentElement, { childList: true, subtree: true, characterData: true });
window.addEventListener("load", polish);
polish();
