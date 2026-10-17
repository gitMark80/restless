// Restless Faith Pocket Guides — the ten books published by Restless Faith
// Media under the pen name M. B. Reston. Pure data + matching; rendered by
// BookCard / BooksModal in App.jsx.
//
// Order matters in BOOKS: matchBook() returns the FIRST pattern that hits, so
// the more specific books are listed before the broad ones (e.g. idolatry
// before the general Protestant book, "why a priest" before self-examination).
// `series` is the book's number on the cover and is what the modal sorts by.

export const AMAZON_TAG = "restlessfaith-20";

const amazon = (asin) => `https://www.amazon.com/dp/${asin}`;

export const BOOKS = [
  {
    id: "idolatry",
    series: 9,
    title: "I Thought That Was Idolatry",
    subtitle: "What the Bible Really Says About Statues, Relics, and Catholic Devotion",
    url: amazon("B0HN8X7F2W"),
    tagline: {
      en: "For anyone who looks at statues, relics, and candles and wonders whether Catholics broke the commandment — read with the Bible open.",
      es: "Para quien mira estatuas, reliquias y velas y se pregunta si los católicos rompieron el mandamiento — con la Biblia abierta.",
    },
    pattern:
      /idol|statue|graven image|relic|venerat|bow(ing)? (to|down)|kiss(ing)? (the|a) (statue|cross|icon)|icon|crucifix|scapular|rosary beads|superstition|[ií]dolo|estatua|imagen (tallada|esculpida)|reliquia|venerar|inclinarse|supersticion|supersticioso/,
  },
  {
    id: "confess-priest",
    series: 2,
    title: "Why Do Catholics Confess to a Priest?",
    subtitle: "Can't I Just Tell God?",
    url: amazon("B0HJWK8LH1"),
    tagline: {
      en: "If you've ever thought 'I can just tell God directly,' this walks through John 20, the early Church, and what actually happens in the confessional — fears included.",
      es: "Si alguna vez pensaste «puedo decírselo a Dios directamente», este libro recorre Juan 20, la Iglesia primitiva y lo que realmente pasa en el confesionario — miedos incluidos.",
    },
    pattern:
      /confess(ing|ion)? to (a )?priest|why (a )?priest|tell god directly|just (tell|confess to|ask) god|priest forgive|absolution|afraid of confession|scared of confession|first confession|haven'?t been to confession|years since confession|confesar(me)? (con|a) (un )?sacerdote|por qu[eé] (un )?sacerdote|decirle a dios directamente|absoluci[oó]n|miedo a la confesi[oó]n|primera confesi[oó]n/,
  },
  {
    id: "online-mass",
    series: 4,
    title: "Online Mass Doesn't Count",
    subtitle: "You Need the Eucharist",
    url: amazon("B0HKMHJX4L"),
    tagline: {
      en: "For anyone who got used to Mass on a screen — or who wonders whether showing up in person still matters — with a gentle four-Sunday path back.",
      es: "Para quien se acostumbró a la Misa por pantalla — o se pregunta si ir en persona sigue importando — con un camino suave de cuatro domingos de regreso.",
    },
    pattern:
      /online mass|virtual mass|livestream|live[- ]stream|mass on (tv|youtube|a screen|my phone)|watch(ing)? mass|sunday obligation|(have|do i have|need) to go to mass|skip(ping)? mass|miss(ing|ed)? mass|homebound|misa (en l[ií]nea|virtual|por internet|por televisi[oó]n)|ver (la )?misa|obligaci[oó]n dominical|faltar a misa|tengo que ir a misa/,
  },
  {
    id: "hate-sin",
    series: 8,
    title: "Hate the Sin, Love the Sinner",
    subtitle: "What Christian Love Actually Requires",
    url: amazon("B0HLYGTHC8"),
    tagline: {
      en: "For when the 'sinner' is someone you love, or someone who hurt you — how to speak truth without contempt, offer mercy without excuses, and set boundaries without giving up on a person.",
      es: "Para cuando el «pecador» es alguien a quien amas, o alguien que te hirió — cómo decir la verdad sin desprecio, ofrecer misericordia sin excusas y poner límites sin rendirse con la persona.",
    },
    pattern:
      /hate the sin|love the sinner|living in sin|friend (is|who is) (gay|trans|living)|\b(gay|trans|transgender|lgbt)\b|cohabit|living together|boundar(y|ies)|forgive (someone|him|her|them|my)|how (do|can|should) i (love|treat|respond to|talk to) (someone|a friend|my (mom|dad|brother|sister|son|daughter|friend)) who|judg(e|ing|mental)|correct(ing)? (a|my|someone)|enabl(e|ing)|odia el pecado|ama al pecador|viviendo en pecado|l[ií]mites|perdonar a|c[oó]mo (amo|trato|hablo con) a (alguien|mi (mam[aá]|pap[aá]|hermano|hermana|hijo|hija|amigo|amiga)) que|juzgar/,
  },
  {
    id: "the-goal",
    series: 7,
    title: "The Goal",
    url: amazon("B0HLY987S3"),
    tagline: {
      en: "For husbands, wives, and parents who want their family in heaven — marriage, family prayer, forgiveness, and the small daily choices that teach a household to follow Jesus.",
      es: "Para esposos, esposas y padres que quieren a su familia en el cielo — matrimonio, oración en familia, perdón y las pequeñas decisiones diarias que enseñan a un hogar a seguir a Jesús.",
    },
    pattern:
      /raise (my )?(kids|children)|raising (catholic|my|our) (kids|children)|my (son|daughter|kids|children|teen)|family prayer|pray (as|with) (a|my|our) family|domestic church|my (wife|husband|marriage|spouse)|parent(ing|s)? |pass (on|down) the faith|kids? (don'?t|won'?t) (want to )?go to mass|criar (a )?(mis )?hijos|mis hijos|mi (hijo|hija)|orar en familia|iglesia dom[eé]stica|mi (esposa|esposo|matrimonio)|transmitir la fe/,
  },
  {
    id: "sinner-mirror",
    series: 10,
    title: "The Sinner in the Mirror",
    url: amazon("B0HNBQ8N6T"),
    tagline: {
      en: "For anyone ready to look honestly at their own choices, prepare for Confession, and begin again — without drowning in shame or endless self-scrutiny.",
      es: "Para quien está listo para mirar con honestidad sus propias decisiones, prepararse para la Confesión y empezar de nuevo — sin ahogarse en vergüenza ni en un escrutinio interminable.",
    },
    pattern:
      /examination of conscience|examine my conscience|examen|am i a (bad|good) person|keep (sinning|falling|committing)|same sins?|struggl(e|ing) with (sin|the same)|scrupul|guilt|shame|ashamed|hypocri|how do i change|stop sinning|repent|contrition|penance|examen de conciencia|soy (una )?mala persona|sigo (pecando|cayendo)|mismos pecados|escr[uú]pulo|culpa|verg[uü]enza|hip[oó]crita|c[oó]mo cambio|dejar de pecar|arrepent|contrici[oó]n|penitencia/,
  },
  {
    id: "raised-catholic",
    series: 3,
    title: "I Was Raised Catholic",
    url: amazon("B0HJSW21JN"),
    tagline: {
      en: "For cradle Catholics who drifted, never really understood it, or are quietly wondering whether to come back — seven familiar claims tested against what the Church actually teaches.",
      es: "Para católicos de cuna que se alejaron, nunca lo entendieron del todo, o se preguntan en silencio si volver — siete afirmaciones conocidas puestas a prueba frente a lo que la Iglesia realmente enseña.",
    },
    pattern:
      /raised catholic|cradle catholic|grew up catholic|was catholic|used to (be|go)|lapsed|fallen away|fell away|stopped going|haven'?t been to (mass|church)|come back to (the church|church|mass|the faith)|return(ing)? to (the church|church|the faith)|revert|left the church|leaving the church|why (do|should) i (go|stay)|cafeteria catholic|catholic guilt|i know what the church teaches|crec[ií] cat[oó]lic|de cuna|me alej[eé]|dej[eé] de ir|volver a (la iglesia|misa|la fe)|regresar a la iglesia|alejad[oa] de la iglesia/,
  },
  {
    id: "protestants",
    series: 1,
    title: "Why Good Protestants Become Catholic",
    url: amazon("B0HJPN317Z"),
    tagline: {
      en: "For anyone wrestling with sola scriptura, the papacy, Mary, or the Eucharist — and wondering why serious Protestants keep following Scripture and history into the Catholic Church.",
      es: "Para quien lucha con la sola scriptura, el papado, María o la Eucaristía — y se pregunta por qué tantos protestantes serios terminan siguiendo la Escritura y la historia hasta la Iglesia católica.",
    },
    pattern:
      /protestant|evangelical|baptist|lutheran|methodist|presbyterian|pentecostal|non[- ]?denominational|sola (scriptura|fide)|faith alone|bible alone|scripture alone|once saved|justification by faith|is the pope|papacy|papal|infallib|peter.*(first|rock)|first pope|pray(ing)? to (mary|the saints|saints)|worship mary|mary.*(worship|queen|mother of god)|purgatory|call (him|anyone|priests?) father|apocrypha|deuterocanon|(why|how) (catholic|the church).*(different|wrong)|reformation|luther|calvin|cross(ing)? the tiber|convert(ed|ing)? (to|from)|protestante|evang[eé]lic|bautista|luteran|sola fe|solo la biblia|papado|papal|infalib|primer papa|ador\w* a (mar[ií]a|los santos)|rez\w* a (mar[ií]a|los santos)|purgatorio|reforma|lutero|calvino/,
  },
  {
    id: "jesus-taught",
    series: 6,
    title: "What Jesus Taught Us",
    url: amazon("B0HLBNFFC6"),
    tagline: {
      en: "What did Jesus actually expect his followers to do after the Ascension? A Church, a pastoral office, the Eucharist, forgiveness, mission — Catholic life as a response to him, not an addition.",
      es: "¿Qué esperaba Jesús que hicieran sus seguidores después de la Ascensión? Una Iglesia, un oficio pastoral, la Eucaristía, el perdón, la misión — la vida católica como respuesta a él, no como añadido.",
    },
    pattern:
      /did jesus (actually |really |even )?(start|found|establish|create)|jesus (started|founded|established) the church|apostolic (succession|authority)|great commission|what did jesus (command|teach|want|say to do)|re[- ]?sacrific|sacrifice (of the )?mass|mass (is|as) (a )?sacrifice|why (do we )?need (a|the) church|church (vs|versus|or) jesus|just (me|you) and jesus|jes[uú]s fund[oó] la iglesia|sucesi[oó]n apost[oó]lica|gran comisi[oó]n|qu[eé] (mand[oó]|ense[ñn][oó]) jes[uú]s|sacrificio de la misa|para qu[eé] (la|una) iglesia|solo jes[uú]s y yo/,
  },
  {
    id: "the-point",
    series: 5,
    title: "The Point",
    subtitle: "Everything Points to Jesus Christ",
    url: amazon("B0HKPT3B7H"),
    tagline: {
      en: "Catholic life can look crowded — creeds, saints, devotions, rules. This asks one question of all of it: where is Jesus here? For anyone who wants Christ at the center, not buried under the rest.",
      es: "La vida católica puede parecer abarrotada — credos, santos, devociones, reglas. Este libro hace una sola pregunta a todo ello: ¿dónde está Jesús aquí? Para quien quiere a Cristo en el centro, no enterrado bajo lo demás.",
    },
    pattern:
      /where is jesus|what'?s the point|so many (rules|saints|devotions|traditions)|too many rules|religion (vs|versus|or|not) relationship|relationship (with jesus|not religion)|about jesus or|jesus or the church|lost sight of jesus|focus on (jesus|christ)|christ[- ]centered|d[oó]nde est[aá] jes[uú]s|cu[aá]l es el (punto|sentido)|tantas (reglas|devociones|tradiciones)|religi[oó]n o relaci[oó]n|relaci[oó]n con jes[uú]s|centrado en cristo/,
  },
];

// Books by other Catholic publishers that Restless recommends. Kept separate
// from BOOKS so the modal and card can be honest that these are not ours.
export const RECOMMENDED = [
  {
    id: "ignatius-study-bible",
    title: "Ignatius Catholic Study Bible",
    subtitle: "Old and New Testaments (RSV-2CE)",
    author: "Scott Hahn & Curtis Mitch · Ignatius Press",
    url: amazon("1586176145"),
    tagline: {
      en: "The complete Catholic study Bible: a solid translation, thousands of footnotes, and references to the Catechism on nearly every page. If you're going to own one Bible, this is the one we'd hand you.",
      es: "La Biblia de estudio católica completa: una traducción sólida, miles de notas y referencias al Catecismo en casi cada página. Si vas a tener una sola Biblia, esta es la que te daríamos. (Solo en inglés.)",
    },
    pattern:
      /(which|what|good|best|recommend(ed)?)\s+(catholic\s+)?(bible|translation)|bible (should|do|can|would) i (buy|get|read|use)|study bible|catholic bible|bible translation|rsv|douay|nabre|new american bible|(how|where) (do|should|can) i (start|begin) (reading|with) the bible|read the bible for the first time|never read the bible|(qu[eé]|cu[aá]l) biblia|biblia (cat[oó]lica|de estudio)|traducci[oó]n de la biblia|(c[oó]mo|por d[oó]nde) (empiezo|empezar) a leer la biblia/,
  },
];

export const BOOKS_TEXT = {
  en: {
    label: "Books",
    title: "Restless Faith Pocket Guides",
    intro:
      "Ten short, plain-language books from the makers of Restless. Each one takes a single question that keeps people up at night and walks through it the way a patient friend would — with Scripture, the Catechism, and the Church's reasons, not slogans.",
    byline: "Written by M. B. Reston · Restless Faith Media",
    disclosure: "As an Amazon Associate, Restless Faith Media earns from qualifying purchases.",
    bookLabel: "Book",
    buy: "Get it on Amazon ↗",
    cardEyebrow: "GO DEEPER",
    cardIntro: "If this question is one you keep coming back to, there's a short Restless Faith Pocket Guide on it:",
    cardNote: "From the makers of Restless. As an Amazon Associate, Restless Faith Media earns from qualifying purchases, which helps keep Restless free.",
    cardMore: "All pocket guides",
    recommendedEyebrow: "A BOOK WE RECOMMEND",
    recommendedIntro: "Not ours — but if this is the question you're asking, it's the book we'd point you to:",
    recommendedNote: "As an Amazon Associate, Restless Faith Media earns from qualifying purchases, which helps keep Restless free.",
    recommendedTitle: "Also recommended",
    recommendedBody: "A few books by other Catholic publishers that we reach for ourselves.",
  },
  es: {
    label: "Libros",
    title: "Guías de bolsillo de Restless Faith",
    intro:
      "Diez libros breves y en lenguaje sencillo, de los creadores de Restless. Cada uno toma una sola pregunta que no deja dormir a la gente y la recorre como lo haría un amigo paciente — con la Escritura, el Catecismo y las razones de la Iglesia, no con consignas.",
    byline: "Escrito por M. B. Reston · Restless Faith Media",
    disclosure: "Como Asociado de Amazon, Restless Faith Media recibe ingresos por las compras que cumplen los requisitos.",
    bookLabel: "Libro",
    buy: "Consíguelo en Amazon ↗",
    cardEyebrow: "PROFUNDIZA",
    cardIntro: "Si esta pregunta es una a la que siempre vuelves, hay una Guía de bolsillo de Restless Faith sobre ella:",
    cardNote: "De los creadores de Restless. Como Asociado de Amazon, Restless Faith Media recibe ingresos por las compras que cumplen los requisitos, lo que ayuda a mantener Restless gratuito.",
    cardMore: "Todas las guías de bolsillo",
    recommendedEyebrow: "UN LIBRO QUE RECOMENDAMOS",
    recommendedIntro: "No es nuestro — pero si esta es la pregunta que te haces, es el libro al que te enviaríamos:",
    recommendedNote: "Como Asociado de Amazon, Restless Faith Media recibe ingresos por las compras que cumplen los requisitos, lo que ayuda a mantener Restless gratuito.",
    recommendedTitle: "También recomendamos",
    recommendedBody: "Algunos libros de otras editoriales católicas que nosotros mismos usamos.",
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
  const own = BOOKS.find((book) => book.pattern.test(text));
  if (own) return { ...own, recommended: false };
  const rec = RECOMMENDED.find((book) => book.pattern.test(text));
  return rec ? { ...rec, recommended: true } : null;
}
