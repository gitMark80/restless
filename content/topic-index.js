// The list of question pages: titles, links, matching patterns, related
// questions, book picks and social-post text. Small enough to ship in the app
// bundle (src/topicLinks.js uses it). The article text lives in
// content/topics.js.
//
// - `books` are ids from src/books.js. Only real, published titles.
// - `short` is the short link: restless.faith/<short> redirects to the page
//   (vercel.json; npm test checks they match).
// - `social` feeds the content export (scripts/export-social.mjs) and Reel
//   Studio; `reel` lists Reel Studio question slugs that belong to this page.

export const SITE = "https://restless.faith";

export const TOPIC_INDEX = [
  {
    slug: "why-do-catholics-pray-to-saints",
    short: "saints",
    question: "Why do Catholics pray to saints?",
    label: "Praying to saints",
    seoTitle: "Why Do Catholics Pray to Saints? A Clear Catholic Answer",
    description: "Catholics don't worship saints. They ask them to pray for us, the way you'd ask a friend. What Scripture and the Catechism say, and how to start.",
    // Matched against a visitor's question in the app to suggest this page.
    pattern: /\bsaints?\b|intercession|intercede|pray(ing)? to (mary|the saints|saints)|patron saint|communion of (the )?saints|necroman|talk(ing)? to the dead|\bsantos?\b|interce(sión|sion|der)|rezar a (los santos|mar[ií]a)/,
    related: ["why-do-catholics-pray-the-rosary","catholic-vs-protestant-beliefs","why-do-protestants-become-catholic","what-did-jesus-teach-about-salvation"],
    books: ["idolatry","protestants"],
    followUps: [
      "How do I choose a patron saint?",
      "Do Catholics worship Mary?",
      "How does someone become a canonized saint?",
    ],
    social: {
      videoTitle: "Do Catholics pray TO saints? 🙏",
      caption: "Catholics don't worship saints. We ask them to pray for us, the same way you'd ask a friend. Here's the actual teaching.",
      hashtags: ["#Catholic","#Saints","#CatholicTok","#Christian","#Faith"],
      reel: ["pray-to-saints"],
    },
  },
  {
    slug: "why-do-catholics-believe-in-the-eucharist",
    short: "eucharist",
    question: "Why do Catholics believe Jesus is really present in the Eucharist?",
    label: "The Eucharist",
    seoTitle: "Why Catholics Believe Jesus Is Really in the Eucharist",
    description: "Why Catholics believe the bread and wine become Christ's Body and Blood: the Last Supper, John 6, Saint Paul and the early Church.",
    // Matched against a visitor's question in the app to suggest this page.
    pattern: /euchar|real presence|transubstantia|holy communion|\bcommunion\b|body and blood|this is my body|john 6|bread of life|consecrat|blessed sacrament|adoration|eucarist|presencia real|comuni[oó]n|cuerpo y (la )?sangre|sant[ií]simo/,
    related: ["what-happens-at-catholic-mass","catholic-vs-protestant-beliefs","why-do-catholics-confess-to-a-priest","why-do-protestants-become-catholic"],
    books: ["online-mass","jesus-taught"],
    followUps: [
      "Why can't non-Catholics receive Communion?",
      "What is Eucharistic adoration?",
      "How should I prepare to receive Communion?",
    ],
    social: {
      videoTitle: "Is Jesus REALLY in the Eucharist?",
      caption: "Symbol or really Jesus? What Jesus said in John 6, what the first Christians believed, and what Catholics mean by transubstantiation.",
      hashtags: ["#Catholic","#Eucharist","#RealPresence","#John6","#CatholicTok"],
      reel: ["eucharist-real"],
    },
  },
  {
    slug: "why-do-protestants-become-catholic",
    short: "protestants",
    question: "Why do Protestants become Catholic?",
    label: "Protestants becoming Catholic",
    seoTitle: "Why Do Protestants Become Catholic? The Most Common Reasons",
    description: "Why serious Bible-reading Protestants keep becoming Catholic: authority, the Bible's origins, the early Church, the Eucharist, and unity.",
    // Matched against a visitor's question in the app to suggest this page.
    pattern: /protestants? (become|becoming|convert|converting)|why (do|did) (protestants|evangelicals|baptists)|convert(ing|ed)? (to|from)|conversion|cross(ing)? the tiber|leav(e|ing) (my|the) (church|denomination)|evangelical|baptist|non[- ]?denominational|protestante|convertirme|hacerme cat[oó]lico/,
    related: ["catholic-vs-protestant-beliefs","why-is-peter-the-first-pope","why-do-catholics-believe-in-the-eucharist","how-to-become-catholic"],
    books: ["protestants","raised-catholic"],
    followUps: [
      "What do Catholics believe about the Bible?",
      "What's it like to become Catholic as a former Protestant?",
      "What do Catholics believe about faith and works?",
    ],
    social: {
      videoTitle: "Why do Protestants become Catholic?",
      caption: "They didn't stop loving the Bible. Often it's the Bible that led them home. The reasons converts give most often.",
      hashtags: ["#Catholic","#Convert","#Protestant","#CatholicConvert","#Christian"],
      reel: [],
    },
  },
  {
    slug: "why-is-peter-the-first-pope",
    short: "peter",
    question: "Why is Peter considered the first pope?",
    label: "Peter and the papacy",
    seoTitle: "Why Is Peter Considered the First Pope? Scripture & History",
    description: "Jesus renamed Simon \"Rock,\" gave him the keys and told him to feed his sheep. Why Catholics see Peter as the first pope, from Scripture and history.",
    // Matched against a visitor's question in the app to suggest this page.
    pattern: /\bpeter\b|first pope|\bpopes?\b|papa(cy|l)|keys of the kingdom|on this rock|upon this rock|vicar of christ|infallib|successor|bishop of rome|\bpedro\b|primer papa|\bpapa\b|papado|infalib/,
    related: ["why-do-protestants-become-catholic","catholic-vs-protestant-beliefs","why-do-catholics-confess-to-a-priest","how-to-become-catholic"],
    books: ["protestants","jesus-taught"],
    followUps: [
      "What does papal infallibility actually mean?",
      "How is a new pope chosen?",
      "Why don't the Orthodox accept the pope's authority?",
    ],
    social: {
      videoTitle: "Was Peter really the first pope? 🗝️",
      caption: "A new name, the keys of the kingdom and \"feed my sheep.\" Why Catholics see Peter as the first pope, from the Gospels and history.",
      hashtags: ["#Catholic","#Pope","#SaintPeter","#Matthew16","#Bible"],
      reel: ["peter-first-pope","why-pope"],
    },
  },
  {
    slug: "why-do-catholics-confess-to-a-priest",
    short: "confession",
    question: "Why do Catholics confess their sins to a priest?",
    label: "Confession",
    seoTitle: "Why Do Catholics Confess Their Sins to a Priest?",
    description: "Only God forgives sins. So why confess to a priest? John 20, what really happens in confession, the seal, and how to go if it's been years.",
    // Matched against a visitor's question in the app to suggest this page.
    pattern: /confess|confession|reconciliation|penance|absolution|forgive(ness)? of sins?|tell god directly|why (a )?priest|\bsins?\b.*priest|priest.*\bsins?\b|confesi[oó]n|confesar|reconciliaci[oó]n|penitencia|absoluci[oó]n|perd[oó]n de los pecados/,
    related: ["what-did-jesus-teach-about-salvation","why-do-catholics-believe-in-the-eucharist","why-is-peter-the-first-pope","how-to-become-catholic"],
    books: ["confess-priest","sinner-mirror"],
    followUps: [
      "How do I make a good examination of conscience?",
      "What's the difference between mortal and venial sin?",
      "What do I say in confession if it's been years?",
    ],
    social: {
      videoTitle: "Why confess to a priest and not just God?",
      caption: "Only God forgives sins. So why a priest? John 20:23, what really happens in confession, and why the priest can never tell.",
      hashtags: ["#Catholic","#Confession","#Mercy","#John20","#CatholicTok"],
      reel: ["confession-priest"],
    },
  },
  {
    slug: "why-do-catholics-pray-the-rosary",
    short: "rosary",
    question: "Why do Catholics pray the Rosary?",
    label: "The Rosary",
    seoTitle: "Why Do Catholics Pray the Rosary? Meaning & How to Start",
    description: "The Rosary is a way of praying through the life of Jesus with Mary. Where it comes from, whether it's \"vain repetition,\" and how to pray it.",
    // Matched against a visitor's question in the app to suggest this page.
    pattern: /rosary|rosaries|hail mary|decade|mysteries|vain repetition|repetitive prayer|rosario|ave mar[ií]a|misterios|repetici[oó]n/,
    related: ["why-do-catholics-pray-to-saints","catholic-vs-protestant-beliefs","what-happens-at-catholic-mass","what-did-jesus-teach-about-salvation"],
    books: ["idolatry","five-minute-journal"],
    followUps: [
      "How do I pray the Rosary step by step?",
      "Do Catholics worship Mary?",
      "What are the Luminous Mysteries?",
    ],
    social: {
      videoTitle: "Isn't the Rosary just repetitive prayer? 📿",
      caption: "Jesus warned about vain repetition. So why the Rosary? What it actually is: the life of Jesus, prayed with Mary.",
      hashtags: ["#Catholic","#Rosary","#HailMary","#Prayer","#CatholicTok"],
      reel: ["rosary-repetitive"],
    },
  },
  {
    slug: "catholic-vs-protestant-beliefs",
    short: "differences",
    question: "What is the difference between Catholic and Protestant beliefs?",
    label: "Catholic vs. Protestant",
    seoTitle: "Catholic vs. Protestant Beliefs: The Key Differences",
    description: "What Catholics and Protestants share, and where they differ: Scripture and Tradition, salvation, the sacraments, the Eucharist, the pope, Mary.",
    // Matched against a visitor's question in the app to suggest this page.
    pattern: /catholic (and|vs\.?|versus|or) protestant|protestant (and|vs\.?|versus|or) catholic|difference(s)? between|sola (scriptura|fide)|faith alone|bible alone|scripture alone|tradition|apocrypha|deuterocanon|extra books|purgatory|seven sacraments|diferencia|cat[oó]licos y protestantes|sola fe|solo la biblia|purgatorio/,
    related: ["why-do-protestants-become-catholic","what-did-jesus-teach-about-salvation","why-do-catholics-believe-in-the-eucharist","why-is-peter-the-first-pope"],
    books: ["protestants","the-point"],
    followUps: [
      "Why does the Catholic Bible have more books?",
      "What is purgatory?",
      "Can Catholics and Protestants pray together?",
    ],
    social: {
      videoTitle: "Catholic vs. Protestant: what's actually different?",
      caption: "We share more than most people think. The real differences: Scripture and Tradition, salvation, the sacraments, the pope and Mary.",
      hashtags: ["#Catholic","#Protestant","#Christian","#Bible","#Faith"],
      reel: ["bible-alone","catholic-bible-extra-books"],
    },
  },
  {
    slug: "what-happens-at-catholic-mass",
    short: "mass",
    question: "What happens during a Catholic Mass?",
    label: "The Mass",
    seoTitle: "What Happens During a Catholic Mass? A Step-by-Step Guide",
    description: "A plain guide to the Catholic Mass: the Liturgy of the Word, the Liturgy of the Eucharist, why it's a sacrifice, and what to do if you're visiting.",
    // Matched against a visitor's question in the app to suggest this page.
    pattern: /\bmass\b|liturgy|homily|eucharistic prayer|sunday obligation|go to church|church every (week|sunday)|first time (at|going to) (a )?(catholic )?(mass|church)|visit(ing)? (a )?catholic church|\bmisa\b|liturgia|homil[ií]a|obligaci[oó]n dominical/,
    related: ["why-do-catholics-believe-in-the-eucharist","how-to-become-catholic","why-do-catholics-confess-to-a-priest","catholic-vs-protestant-beliefs"],
    books: ["online-mass","jesus-taught"],
    followUps: [
      "Why can't non-Catholics receive Communion?",
      "What should I wear to Mass?",
      "Why do Catholics stand, sit and kneel at Mass?",
    ],
    social: {
      videoTitle: "What actually happens at a Catholic Mass?",
      caption: "Never been to Mass, or never understood it? The whole thing in one minute, and what to do if you're visiting.",
      hashtags: ["#Catholic","#Mass","#CatholicMass","#Eucharist","#Church"],
      reel: ["eucharist-why-weekly"],
    },
  },
  {
    slug: "what-did-jesus-teach-about-salvation",
    short: "salvation",
    question: "What did Jesus teach about salvation?",
    label: "Salvation",
    seoTitle: "What Did Jesus Teach About Salvation? The Catholic View",
    description: "Salvation as Jesus taught it: God's free gift, repentance and faith, baptism, and a faith that lives in love. The Catholic answer from Scripture.",
    // Matched against a visitor's question in the app to suggest this page.
    pattern: /salvation|saved|\bsave(d)? by|go to heaven|get (in)?to heaven|eternal life|faith (and|or|vs\.?|versus) works|works (and|or) faith|born again|once saved|lose (my|your) salvation|grace|justif|salvaci[oó]n|salvarse|salvo|ir al cielo|vida eterna|fe y obras|gracia/,
    related: ["catholic-vs-protestant-beliefs","why-do-catholics-confess-to-a-priest","how-to-become-catholic","why-do-catholics-believe-in-the-eucharist"],
    books: ["jesus-taught","the-point"],
    followUps: [
      "Can a Catholic lose their salvation?",
      "What is grace?",
      "Do Catholics believe only Catholics go to heaven?",
    ],
    social: {
      videoTitle: "What did Jesus ACTUALLY say about getting saved?",
      caption: "Faith or works? Once saved, always saved? What Jesus taught about salvation, and why Catholics say grace comes first.",
      hashtags: ["#Catholic","#Salvation","#Jesus","#Grace","#Bible"],
      reel: [],
    },
  },
  {
    slug: "how-to-become-catholic",
    short: "become-catholic",
    question: "How do I become Catholic?",
    label: "Becoming Catholic",
    seoTitle: "How to Become Catholic: OCIA Steps and What to Expect",
    description: "How to become Catholic, step by step: contacting a parish, OCIA (formerly RCIA), what happens if you're already baptized, sponsors, and Easter.",
    // Matched against a visitor's question in the app to suggest this page.
    pattern: /become (a )?catholic|becoming (a )?catholic|join the (catholic )?church|joining the (catholic )?church|\bocia\b|\brcia\b|convert to catholic|baptized (as an adult|catholic)|get confirmed|confirmation|sponsor|hacerme cat[oó]lico|hacerse cat[oó]lico|unirme a la iglesia|padrino|confirmaci[oó]n/,
    related: ["why-do-protestants-become-catholic","what-happens-at-catholic-mass","why-do-catholics-confess-to-a-priest","catholic-vs-protestant-beliefs"],
    books: ["protestants","restless-journal"],
    followUps: [
      "What happens at the Easter Vigil?",
      "What does an OCIA sponsor do?",
      "What if I was baptized in another church?",
    ],
    social: {
      videoTitle: "How do you actually become Catholic?",
      caption: "Curious about becoming Catholic? The real steps: call a parish, OCIA, what happens if you're already baptized, and Easter.",
      hashtags: ["#Catholic","#OCIA","#RCIA","#BecomingCatholic","#Convert"],
      reel: [],
    },
  },
];

export function topicUrl(topic) {
  return `/questions/${topic.slug}`;
}
