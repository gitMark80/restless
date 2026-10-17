// Restless Faith Pocket Guides — the books published by Restless Faith Media
// under the pen name M. B. Reston. Pure data + matching; rendered by
// BookCard / BooksModal in App.jsx.
//
// TO DO before merging: replace each `url` with the real Amazon listing.
// If you have an Amazon Associates tag, set AMAZON_TAG and it is appended
// to every link automatically.

export const AMAZON_TAG = "restlessfaith-20";

export const BOOKS = [
  {
    id: "protestants",
    series: 1,
    title: "Why Good Protestants Become Catholic",
    url: "https://www.amazon.com/dp/REPLACE_ASIN_1",
    tagline: {
      en: "For anyone wrestling with sola scriptura, the papacy, Mary, or the Eucharist — and wondering why thoughtful Protestants keep crossing the Tiber.",
      es: "Para quien lucha con la sola scriptura, el papado, María o la Eucaristía — y se pregunta por qué tantos protestantes reflexivos terminan siendo católicos.",
    },
    // Protestant / apologetics questions. Phrases, not bare words, so an
    // ordinary question about "the church" or "the bible" does not trigger it.
    pattern:
      /protestant|evangelical|baptist|lutheran|methodist|presbyterian|pentecostal|non[- ]?denominational|sola (scriptura|fide)|faith alone|bible alone|scripture alone|once saved|justification by faith|is the pope|papacy|peter.*(first|rock)|first pope|pray(ing)? to (mary|the saints|saints)|worship mary|mary.*(worship|idol)|statues?.*(idol|worship)|purgatory|call (him|anyone|priests?) father|apocrypha|deuterocanon|(why|how) (catholic|the church).*(different|wrong)|reformation|luther|calvin|cross(ing)? the tiber|convert(ed|ing)? (to|from)|protestante|evang[eé]lic|bautista|luteran|sola fe|solo la biblia|papado|primer papa|ador\w* a (mar[ií]a|los santos)|rez\w* a (mar[ií]a|los santos)|purgatorio|reforma|lutero|calvino/,
  },
  {
    id: "raised-catholic",
    series: 2,
    title: "I Was Raised Catholic",
    url: "https://www.amazon.com/dp/REPLACE_ASIN_2",
    tagline: {
      en: "For cradle Catholics who drifted, never really understood it, or are quietly wondering whether to come back.",
      es: "Para católicos de cuna que se alejaron, nunca lo entendieron del todo, o se preguntan en silencio si volver.",
    },
    pattern:
      /raised catholic|cradle catholic|grew up catholic|was catholic|used to (be|go)|lapsed|fallen away|fell away|stopped going|haven'?t been to (mass|church)|come back to (the church|church|mass|the faith)|return(ing)? to (the church|church|the faith)|revert|left the church|leaving the church|why (do|should) i (go|stay)|cafeteria catholic|catholic guilt|crec[ií] cat[oó]lic|de cuna|me alej[eé]|dej[eé] de ir|volver a (la iglesia|misa|la fe)|regresar a la iglesia|alejad[oa] de la iglesia/,
  },
  // Add the remaining pocket guides here as you list them:
  // { id: "...", series: 3, title: "...", url: "...", tagline: { en, es }, pattern: /.../ },
];

export const BOOKS_TEXT = {
  en: {
    label: "Books",
    title: "Restless Faith Pocket Guides",
    intro:
      "Short, plain-language books from the makers of Restless. Each one takes a single question that keeps people up at night and walks through it the way a patient friend would — with Scripture, the Catechism, and the Church's reasons, not slogans.",
    byline: "Written by M. B. Reston · Restless Faith Media",
    bookLabel: "Book",
    buy: "Get it on Amazon ↗",
    cardEyebrow: "GO DEEPER",
    cardIntro: "If this question is one you keep coming back to, there's a short Restless Faith Pocket Guide on it:",
    cardNote: "From the makers of Restless. Purchases help keep Restless free.",
    cardMore: "All pocket guides",
  },
  es: {
    label: "Libros",
    title: "Guías de bolsillo de Restless Faith",
    intro:
      "Libros breves y en lenguaje sencillo, de los creadores de Restless. Cada uno toma una sola pregunta que no deja dormir a la gente y la recorre como lo haría un amigo paciente — con la Escritura, el Catecismo y las razones de la Iglesia, no con consignas.",
    byline: "Escrito por M. B. Reston · Restless Faith Media",
    bookLabel: "Libro",
    buy: "Consíguelo en Amazon ↗",
    cardEyebrow: "PROFUNDIZA",
    cardIntro: "Si esta pregunta es una a la que siempre vuelves, hay una Guía de bolsillo de Restless Faith sobre ella:",
    cardNote: "De los creadores de Restless. Las compras ayudan a mantener Restless gratuito.",
    cardMore: "Todas las guías de bolsillo",
  },
};

// Books are currently English-only on Amazon; the note is shown in Spanish
// only to be honest about what the reader will get.
export const BOOKS_LANGUAGE_NOTE = {
  en: "",
  es: "Por ahora los libros están disponibles solo en inglés.",
};

export function bookUrl(book) {
  if (!AMAZON_TAG) return book.url;
  const sep = book.url.includes("?") ? "&" : "?";
  return `${book.url}${sep}tag=${encodeURIComponent(AMAZON_TAG)}`;
}

// Next-step kinds under which a book pitch would be tone-deaf. Someone in
// crisis or grieving should never see a product card under their answer.
const SUPPRESSED_KINDS = new Set(["crisis", "hurting"]);

export function matchBook(question, nextStepKind) {
  if (SUPPRESSED_KINDS.has(nextStepKind)) return null;
  const text = String(question || "").toLowerCase();
  return BOOKS.find((book) => book.pattern.test(text)) || null;
}
