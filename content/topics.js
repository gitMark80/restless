// Restless.faith question pages (/questions/<slug>), built into static HTML at
// deploy time by scripts/site-pages.mjs, and matched to in-app answers by
// src/topicLinks.js.
//
// Writing rules for this file:
// - [[John 6:53-56]] and [[CCC 1374]] mark citations. They become links (USCCB
//   Bible / the site's Catechism resolver) and fill the "Sources" list.
//   `npm test` checks that every one is well-formed; test/fixtures holds the
//   checked text. Use modern (NABRE/RSV) chapter and verse numbers.
// - Quote Scripture only in short phrases that read the same in common
//   Catholic translations; otherwise paraphrase and cite.
// - [label](@slug) links to another question page; [label](/path) or a full
//   URL links anywhere; **bold** is bold.
// - Titles, links, related questions, book picks and social text are in
//   content/topic-index.js.

import { TOPIC_INDEX, SITE, topicUrl } from "./topic-index.js";

export { SITE, topicUrl };

// Article text for each page, by slug: `answer` is the short answer shown
// first; `body` is the article (h = heading, p = paragraph, ul/ol = lists,
// table = { head, rows }).
const ARTICLES = {
  "why-do-catholics-pray-to-saints": {
    answer:
      "Catholics don't worship saints. To \"pray to\" a saint means to ask that saint to pray for us, the same thing Christians do when they ask a friend or a pastor to pray for them. Because Christ has conquered death, the saints in heaven are alive in him and still part of his one Body, so they can still pray for us [[CCC 956]].",
    body: [
      { h: "Asking, not worshiping" },
      {
        p: "Worship, the adoration that acknowledges someone as God, belongs to God alone [[CCC 2096]]. Catholics give the saints honor, the way you might honor a hero of the faith, but never worship. The old English word \"pray\" simply meant \"ask\" (as in \"pray, tell me\"), and that is what Catholics are doing: asking.",
      },
      {
        p: "Asking for prayers does not compete with Jesus. Scripture says there is one mediator between God and men, Christ Jesus [[1 Timothy 2:5]], and just a few verses earlier it urges Christians to pray and intercede for everyone [[1 Timothy 2:1]]. Christians have always asked one another for prayer. Asking a saint is the same request made to a brother or sister who is now closer to God.",
      },
      { h: "The saints are alive in Christ" },
      {
        p: "Jesus told the Sadducees that God \"is not the God of the dead, but of the living\" [[Mark 12:26-27]]. Those who die in Christ are not cut off from his Body. Saint Paul says nothing, not even death, can separate us from the love of God in Christ [[Romans 8:38-39]]. The Church calls this bond the **communion of saints**: the faithful on earth, those being purified, and the saints in heaven are one family [[CCC 946]] [[CCC 957]].",
      },
      {
        p: "Hebrews pictures the faithful who have gone before us as a great cloud of witnesses surrounding us as we run our race [[Hebrews 12:1]].",
      },
      { h: "Scripture shows the saints in heaven praying" },
      {
        p: "In the Book of Revelation, the elders before the throne of God hold golden bowls of incense, \"which are the prayers of saints\" [[Revelation 5:8]], and an angel offers incense with the prayers of the saints before God [[Revelation 8:3-4]]. James says the prayer of a righteous person is powerful [[James 5:16]]. If that is true on earth, it is not less true of those who now see God face to face.",
      },
      { h: "Isn't that talking to the dead?" },
      {
        p: "The Bible forbids consulting the dead through mediums and spells [[Deuteronomy 18:10-11]], and so does the Church [[CCC 2116]]. That is about trying to get hidden knowledge or power. Asking a saint to pray for you is the opposite: no séance, no secret information, just a request that goes, through them, to God.",
      },
      { h: "How to start" },
      {
        p: "Pick one saint: the one you were named after, the patron of your work or your parish, or someone whose story moves you. Read a little about their life, then simply say, \"Saint ____, pray for me.\" The second half of the Hail Mary does the same thing with Jesus' mother: \"Holy Mary, Mother of God, pray for us sinners\" [[CCC 2677]].",
      },
    ],
  },
  "why-do-catholics-believe-in-the-eucharist": {
    answer:
      "Because Jesus said so, and his first followers took him at his word. At the Last Supper he took bread and said, \"This is my body\" [[Matthew 26:26]]. In John 6 he insisted his flesh is real food, even when many disciples walked away. The Church teaches that at Mass the bread and wine become, truly, really and substantially, his Body and Blood, while still looking like bread and wine [[CCC 1374]] [[CCC 1376]].",
    body: [
      { h: "What Jesus said at the Last Supper" },
      {
        p: "Matthew, Mark, Luke and Paul all record the same words: Jesus took bread, blessed it, broke it and said, \"This is my body,\" then took the cup and called it his blood of the covenant [[Matthew 26:26-28]] [[Mark 14:22-24]] [[Luke 22:19-20]] [[1 Corinthians 11:23-25]]. He did not say \"this represents my body.\" Catholics take him at his word.",
      },
      { h: "John 6: the teaching that cost Jesus followers" },
      {
        p: "A year before the Last Supper, Jesus called himself the living bread come down from heaven and said the bread he would give is his flesh for the life of the world [[John 6:51]]. When the crowd objected, he did not soften it. He said that unless they ate his flesh and drank his blood they would not have life in them, and that his flesh is true food and his blood true drink [[John 6:53-56]].",
      },
      {
        p: "Many of his disciples called it a hard saying and walked away [[John 6:60]] [[John 6:66]]. Jesus let them go rather than say he meant it only as a symbol. Then he turned to the Twelve and asked if they would leave too, and Peter answered that Jesus has the words of eternal life [[John 6:67-69]].",
      },
      { h: "Saint Paul and the first Christians" },
      {
        p: "Paul calls the cup of blessing a participation in the blood of Christ and the bread a participation in his body [[1 Corinthians 10:16]], and warns that whoever receives unworthily will answer for the body and blood of the Lord [[1 Corinthians 11:27-29]]. That warning makes little sense if the bread is only a reminder.",
      },
      {
        p: "The earliest Christian writers say the same. Around AD 107, Saint Ignatius of Antioch warned against people who would not confess that the Eucharist is the flesh of Jesus Christ (Letter to the Smyrnaeans, 7). Around AD 155, Saint Justin Martyr explained to the Roman emperor that Christians do not receive this as common bread and drink, but as the flesh and blood of the incarnate Jesus (First Apology, 66).",
      },
      { h: "What \"transubstantiation\" means" },
      {
        p: "When the priest speaks Christ's words over the bread and wine, the Church teaches that the whole substance of the bread becomes the Body of Christ and the whole substance of the wine becomes his Blood. What it is changes; what it looks, tastes and feels like does not. The Council of Trent called this change **transubstantiation** [[CCC 1376]]. Christ is wholly present under each form and in each part, and he remains present as long as the forms of bread and wine remain [[CCC 1377]]. That is why Catholics kneel, genuflect before the tabernacle and pray in Eucharistic adoration [[CCC 1378]].",
      },
      { h: "Why it matters" },
      {
        p: "The Church calls the Eucharist \"the source and summit of the Christian life\" [[CCC 1324]]. In Communion, Jesus gives himself to us and unites us more closely to himself [[CCC 1391]]. Because it is truly him, Catholics prepare to receive: anyone aware of a grave sin goes to [confession](@why-do-catholics-confess-to-a-priest) first [[CCC 1385]].",
      },
    ],
  },
  "why-do-protestants-become-catholic": {
    answer:
      "Most Protestants who become Catholic don't do it because they stopped loving Jesus or the Bible. Usually it's the opposite: taking Scripture seriously raises questions about who decided which books belong in the Bible, what the first Christians believed about the Eucharist, and where authority lies when sincere Christians disagree. Many find that the answers lead to the Catholic Church.",
    body: [
      { h: "Following Scripture, not leaving it" },
      {
        p: "Converts often say they came because of the Bible. Scripture itself calls the Church \"the pillar and ground of the truth\" [[1 Timothy 3:15]] and tells believers to hold fast to the traditions they were taught, whether by word of mouth or by letter [[2 Thessalonians 2:15]]. That raises a question: if the Bible is the only authority, where does the Bible say so?",
      },
      {
        p: "Then there is the list of books itself. The Bible does not come with a table of contents. The Catechism explains that it was by the apostolic Tradition that the Church discerned which writings belong in the list of sacred books, the canon of Scripture [[CCC 120]]. For many converts, trusting the Bible's contents but not the Church that recognized them stops making sense.",
      },
      { h: "The question of authority" },
      {
        p: "Sincere, Bible-believing Christians disagree about baptism, Communion, divorce, how salvation can be lost, and much more. Jesus prayed that his followers would be one, so that the world would believe [[John 17:20-23]]. Converts often conclude that he would not leave his Church without a way to settle those disagreements. Catholics believe he gave one: the apostles and their successors, with Peter at their head [[Matthew 16:18-19]] [[CCC 85]]. That teaching office is not above God's word; it serves it [[CCC 86]]. See [why Peter is called the first pope](@why-is-peter-the-first-pope).",
      },
      { h: "Reading the early Church" },
      {
        p: "Many converts start reading the Christians who lived just after the apostles: Ignatius of Antioch, Justin Martyr, Irenaeus. They find bishops, a Church that called itself catholic, and belief in the [real presence of Jesus in the Eucharist](@why-do-catholics-believe-in-the-eucharist), centuries before the Reformation. The Anglican-turned-Catholic John Henry Newman summed up his own journey this way: \"To be deep in history is to cease to be a Protestant\" (An Essay on the Development of Christian Doctrine, 1845).",
      },
      { h: "What stays the same" },
      {
        p: "Becoming Catholic does not mean throwing away faith in Jesus. The Church recognizes baptized Protestants as brothers and sisters in the Lord [[CCC 818]], and teaches that much that is good and true exists in their communities: the written word of God, the life of grace, faith, hope and charity [[CCC 819]]. The Church recognizes their baptism, and it is never repeated [[CCC 1271]] [[CCC 1272]]. Converts often describe it as bringing everything they loved home, and finding more.",
      },
      { h: "If you're asking this for yourself" },
      {
        p: "You don't have to have every answer worked out. Talk to a local parish about OCIA, read the early Christians for yourself, and bring your hardest questions. Here is [what the process of becoming Catholic looks like](@how-to-become-catholic).",
      },
    ],
  },
  "why-is-peter-the-first-pope": {
    answer:
      "Jesus singled Peter out. He renamed him \"Rock,\" promised to build his Church on him and gave him the keys of the kingdom [[Matthew 16:18-19]]. He prayed for Peter so that he could strengthen his brothers [[Luke 22:31-32]], and after the Resurrection he told him three times to feed his sheep [[John 21:15-17]]. Peter led the early Church and died in Rome, and the bishops of Rome have carried on his office ever since [[CCC 881]] [[CCC 882]].",
    body: [
      { h: "A new name with a mission" },
      {
        p: "When Jesus first met Simon, he gave him a new name: Cephas, Aramaic for \"rock,\" which in Greek is Peter [[John 1:42]]. In Scripture, when God changes someone's name, he is giving them a new mission, as when Abram became Abraham [[Genesis 17:5]]. Later, after Peter confessed that Jesus is the Christ, Jesus said: \"thou art Peter; and upon this rock I will build my church\" (Douay-Rheims) [[Matthew 16:18]].",
      },
      { h: "The keys of the kingdom" },
      {
        p: "Jesus then gave Peter the keys of the kingdom of heaven and the power to bind and loose [[Matthew 16:19]]. His Jewish listeners would have recognized the image from Isaiah: the king's chief steward held the key of the house of David, and what he opened no one could shut [[Isaiah 22:22]]. The keys mean authority to govern the household on the king's behalf. The other apostles also received the power to bind and loose [[Matthew 18:18]], but only Peter received the keys [[CCC 553]] [[CCC 881]].",
      },
      { h: "Peter leads the early Church" },
      {
        p: "Peter is named first in every list of the apostles [[Matthew 10:2]]. He preaches the first sermon at Pentecost [[Acts 2:14-41]], and at the Council of Jerusalem his words settle the debate over the Gentiles [[Acts 15:7-11]]. After his conversion, Paul went up to Jerusalem specifically to see Peter [[Galatians 1:18]].",
      },
      { h: "Peter and Rome" },
      {
        p: "Peter's first letter sends greetings from \"Babylon\" [[1 Peter 5:13]], a name early Christians used for Rome. Ancient Christian writers agree that Peter and Paul were martyred in Rome. Around AD 180, Saint Irenaeus listed the bishops of Rome in order, starting from the Church founded there by Peter and Paul (Against Heresies, Book 3, chapter 3). The title \"pope\" came later; the office is what goes back to Peter.",
      },
      { h: "What the pope is, and isn't" },
      {
        p: "Christ is the head of the Church [[CCC 792]]. The pope is his servant: the bishop of Rome and Peter's successor, \"the perpetual and visible source and foundation of the unity\" of the bishops and the faithful [[CCC 882]]. Infallibility does not mean the pope never sins or is right about everything. It applies only when he solemnly defines a teaching of faith or morals for the whole Church [[CCC 891]].",
      },
    ],
  },
  "why-do-catholics-confess-to-a-priest": {
    answer:
      "Only God forgives sins, and Catholics agree completely [[CCC 1441]]. But Jesus chose to share that work with his apostles: on Easter night he breathed on them and told them that the sins they forgave would be forgiven [[John 20:21-23]]. In confession the priest acts in the person of Christ. It is God who forgives, and you get to hear it said out loud [[CCC 1442]] [[CCC 1461]].",
    body: [
      { h: "\"Can't I just tell God?\"" },
      {
        p: "You can, and you should, every day. Catholics pray for mercy in their own words, and everyday sins can be forgiven in many ways, including through receiving the Eucharist [[CCC 1394]]. But Jesus gave the Church a sacrament for the times we have seriously turned away from God. For grave (mortal) sin, confession is the ordinary way back [[CCC 1456]] [[CCC 1468]]. If someone is truly sorry out of love for God and intends to go to confession as soon as they can, God's forgiveness reaches them even before they get there [[CCC 1452]].",
      },
      { h: "What Jesus gave his apostles" },
      {
        p: "On the evening of the Resurrection, Jesus sent the apostles as the Father had sent him, breathed on them and gave them the Holy Spirit, then said that whose sins they forgave would be forgiven, and whose they retained would be retained [[John 20:21-23]]. They could not decide what to forgive or retain without hearing the sins. Paul calls this the \"ministry of reconciliation\" entrusted to the apostles [[2 Corinthians 5:18-20]], and James tells Christians to confess their sins to one another [[James 5:16]].",
      },
      { h: "What actually happens" },
      {
        p: "Confession has a simple shape. The Catechism describes it as the penitent's sorrow, confession of sins and willingness to make amends, together with the priest's absolution [[CCC 1491]]. In practice:",
      },
      {
        ol: [
          "Prepare by looking honestly at your life since your last confession (an examination of conscience).",
          "Go to the confessional. You can usually choose to kneel behind a screen or sit face to face.",
          "Tell the priest how long it has been, then name your sins simply. If you're nervous or it's been years, just say so. He will help.",
          "The priest may offer a few words of advice and give you a penance, often a prayer.",
          "Say an act of contrition, telling God you're sorry. The priest then speaks the words of absolution.",
        ],
      },
      { h: "Nothing you say leaves the room" },
      {
        p: "A priest can never reveal what he hears in confession, to anyone, for any reason. The Church calls this the sacramental seal. It admits no exceptions, and a priest who broke it would face very severe penalties [[CCC 1467]].",
      },
      { h: "If it's been a long time" },
      {
        p: "Priests have heard everything, and they are glad when someone comes back. Jesus told the story of the father who ran to meet his returning son before the son could finish his apology [[Luke 15:11-32]]. Catholics are asked to confess grave sins at least once a year [[CCC 1457]], but there is no wrong time to go. Most parishes list confession times on their website, and you can always call and ask for an appointment.",
      },
    ],
  },
  "why-do-catholics-pray-the-rosary": {
    answer:
      "The Rosary is a way of praying through the life of Jesus with his mother. While the lips repeat familiar prayers, the Our Father, the Hail Mary and the Glory Be, the mind meditates on scenes from the Gospels called mysteries: his birth, his ministry, his death and his Resurrection. The Catechism calls the Rosary an \"epitome of the whole Gospel\" [[CCC 971]].",
    body: [
      { h: "A prayer made of Scripture" },
      {
        p: "The Our Father is the prayer Jesus himself taught [[Matthew 6:9-13]]. The first half of the Hail Mary is the angel Gabriel's greeting [[Luke 1:28]] joined to Elizabeth's [[Luke 1:42]]. The second half asks Mary to pray for us, now and at the hour of our death [[CCC 2676]] [[CCC 2677]]. Mary is not the destination; she is the one who \"kept all these words, pondering them in her heart\" [[Luke 2:19]] and who told the servants at Cana, \"Whatever he shall say to you, do ye\" (Douay-Rheims) [[John 2:5]].",
      },
      { h: "The mysteries" },
      {
        p: "Each set of five mysteries walks through part of Jesus' life:",
      },
      {
        ul: [
          "**Joyful** (Mondays and Saturdays): the Annunciation, the Visitation, the Nativity, the Presentation, the Finding in the Temple.",
          "**Luminous** (Thursdays): the Baptism in the Jordan, the Wedding at Cana, the Proclamation of the Kingdom, the Transfiguration, the Institution of the Eucharist. Pope Saint John Paul II added these in 2002.",
          "**Sorrowful** (Tuesdays and Fridays): the Agony in the Garden, the Scourging, the Crowning with Thorns, the Carrying of the Cross, the Crucifixion.",
          "**Glorious** (Wednesdays and Sundays): the Resurrection, the Ascension, the Descent of the Holy Spirit, the Assumption, the Coronation of Mary.",
        ],
      },
      { h: "Isn't it \"vain repetition\"?" },
      {
        p: "Jesus warned against babbling like the pagans, who thought they would be heard for their many words [[Matthew 6:7]]. His concern was empty words used to pressure God, not repetition itself. Psalm 136 repeats the same refrain in every verse [[Psalm 136]]; the angels around God's throne never stop repeating \"Holy, holy, holy\" [[Revelation 4:8]]; and in Gethsemane Jesus prayed a third time, saying the same words [[Matthew 26:44]]. In the Rosary, the repeated words are like a steady rhythm that frees the mind to dwell on Christ. The Church describes it as meditation on the mysteries of Christ [[CCC 2708]].",
      },
      { h: "How to pray it" },
      {
        ol: [
          "Holding the crucifix, make the Sign of the Cross and pray the Apostles' Creed.",
          "On the first bead pray the Our Father, on the next three a Hail Mary each, then a Glory Be.",
          "For each of the five decades: name the mystery, pray one Our Father, ten Hail Marys while thinking about that scene, and one Glory Be.",
          "Finish with the Hail, Holy Queen and the Sign of the Cross.",
        ],
      },
      {
        p: "A whole Rosary takes about 20 minutes. If that feels like a lot, start with one decade a day.",
      },
    ],
  },
  "catholic-vs-protestant-beliefs": {
    answer:
      "Catholics and Protestants share a great deal: faith in the Trinity, in Jesus Christ as true God and true man, in his death and Resurrection, in the Bible as God's word and in baptism. The main differences are about how God's revelation is handed on (Scripture and Tradition, or Scripture alone), how we are justified, the sacraments, especially the Eucharist, the authority of the Church and the pope, and the place of Mary and the saints.",
    body: [
      { h: "What Catholics and Protestants share" },
      {
        p: "The Catholic Church teaches that all who are baptized and believe in Christ are truly Christians, brothers and sisters in the Lord, in real though imperfect communion with the Catholic Church [[CCC 818]] [[CCC 838]]. The differences are real, and they matter, but they sit inside a large shared faith.",
      },
      { h: "The main differences at a glance" },
      {
        p: "Protestant churches differ from one another, so the right-hand column describes common Protestant positions, not every denomination.",
      },
      {
        table: {
          head: ["Question","Catholic teaching","Common Protestant view"],
          rows: [
            ["Where is God's revelation found?","In Sacred Scripture and Sacred Tradition together, faithfully interpreted by the Church's teaching office [[CCC 80]] [[CCC 82]] [[CCC 85]]","Scripture alone is the final authority (sola scriptura)"],
            ["Which books are in the Bible?","73 books, including Tobit, Judith, Wisdom, Sirach, Baruch and 1 and 2 Maccabees [[CCC 120]]","66 books; those seven are called the Apocrypha"],
            ["How are we saved?","By grace, received in faith and baptism. Justification makes us truly righteous, and grace moves us to cooperate through faith working in love [[CCC 1987]] [[CCC 1993]] [[CCC 2010]]","By grace through faith alone (sola fide); justification is often described as God declaring the believer righteous"],
            ["How many sacraments?","Seven, instituted by Christ [[CCC 1113]]","Usually two (baptism and the Lord's Supper), and some see them as symbols or ordinances"],
            ["What is the Eucharist?","Christ's true Body and Blood, and the Mass makes present his one sacrifice on the cross [[CCC 1366]] [[CCC 1374]]","Varies: Lutherans affirm a real presence; many evangelicals see a memorial"],
            ["Who leads the Church?","Bishops as successors of the apostles, with the pope as Peter's successor [[CCC 862]] [[CCC 882]]","Local congregations or denominations; no pope"],
            ["Mary and the saints","Mary is honored as Mother of God, conceived without sin and assumed into heaven; the saints are asked to pray for us [[CCC 491]] [[CCC 966]] [[CCC 956]]","Generally no prayers asking the saints' intercession"],
            ["After death","Those who die in God's grace but still need purification pass through purgatory before heaven [[CCC 1030]] [[CCC 1031]]","Purgatory is generally rejected"],
          ],
        },
      },
      { h: "Why the differences go back to authority" },
      {
        p: "Most of these differences trace back to one question: who has the authority to say what the Bible means when sincere Christians disagree? Catholics believe Jesus left a visible Church with apostles and their successors, with Peter at their head, to hand on what he taught [[Matthew 16:18-19]] [[2 Thessalonians 2:15]]. See [why Peter is called the first pope](@why-is-peter-the-first-pope) and [why many Protestants become Catholic](@why-do-protestants-become-catholic).",
      },
      { h: "Talking about it well" },
      {
        p: "Jesus prayed that all his followers would be one [[John 17:21]]. Whatever side of these questions you're on, start from what you share, ask what the other person actually believes, and go to the sources: the Bible, the early Christians and the Catechism.",
      },
    ],
  },
  "what-happens-at-catholic-mass": {
    answer:
      "The Mass has two main parts. In the Liturgy of the Word, Scripture is read and explained. In the Liturgy of the Eucharist, bread and wine are offered and become the Body and Blood of Christ, and Catholics receive Communion. Christians were already describing this same shape around AD 155 [[CCC 1345]] [[CCC 1346]].",
    body: [
      { h: "The shape of the Mass" },
      {
        p: "The Mass follows the pattern of the road to Emmaus, where the risen Jesus first explained the Scriptures to two disciples and then was recognized in the breaking of the bread [[Luke 24:13-35]] [[CCC 1347]].",
      },
      { h: "1. Introductory rites" },
      {
        p: "The priest and ministers process in during a hymn. Everyone makes the Sign of the Cross, the priest greets the people, and all acknowledge their sins together and ask for God's mercy (\"Lord, have mercy\"). On most Sundays the Gloria is sung, except during Advent and Lent, and the priest prays the opening prayer.",
      },
      { h: "2. Liturgy of the Word" },
      {
        ul: [
          "**First reading**, usually from the Old Testament.",
          "**Responsorial psalm**, often sung, with a refrain everyone repeats.",
          "**Second reading** on Sundays and major feasts, usually from a New Testament letter.",
          "**Gospel**. Everyone stands; it is read by a deacon or priest.",
          "**Homily**, where the priest or deacon explains the readings.",
          "On Sundays, the **Creed**, then the **Prayer of the Faithful**, petitions for the Church and the world.",
        ],
      },
      { h: "3. Liturgy of the Eucharist" },
      {
        ul: [
          "**Preparation of the gifts**: bread and wine are brought to the altar, often with the collection.",
          "**Eucharistic Prayer**: the heart of the Mass. It includes the \"Holy, Holy, Holy,\" the calling down of the Holy Spirit, and the words of Jesus at the Last Supper, when the bread and wine become his Body and Blood [[CCC 1352]] [[CCC 1353]]. It ends with the great \"Amen.\"",
          "**Communion rite**: the Our Father, the sign of peace, the Lamb of God, and Holy Communion [[CCC 1355]].",
        ],
      },
      { h: "4. Concluding rites" },
      {
        p: "The priest blesses the people and sends them out. The word \"Mass\" comes from the Latin words of dismissal, \"Ite, missa est\": go, you are sent.",
      },
      { h: "Why Catholics call it a sacrifice" },
      {
        p: "The Mass is not a new sacrifice and does not repeat Calvary. It makes present the one sacrifice Jesus offered once for all on the cross, and applies its fruit to us today [[CCC 1366]] [[CCC 1367]]. Early Christians saw the Eucharist as the pure offering the prophet Malachi foresaw among the nations [[Malachi 1:11]].",
      },
      { h: "If you're visiting" },
      {
        p: "You are welcome. Sit toward the back if you like, and stand, sit and kneel with everyone else as you're comfortable. Catholics believe Communion is truly Christ and a sign of full unity with the Church, so the U.S. bishops' guidelines ask those who are not Catholic not to receive. In many parishes you can come forward with your arms crossed over your chest to receive a blessing instead, or simply stay in the pew and pray.",
      },
      { h: "Why every Sunday?" },
      {
        p: "From the beginning, Christians gathered on the first day of the week, the day of the Resurrection, to break bread [[Acts 20:7]]. The Church asks Catholics to take part in Mass every Sunday and on holy days of obligation [[CCC 2180]] [[CCC 2181]], because the Eucharist is the center of Christian life, not an optional extra.",
      },
    ],
  },
  "what-did-jesus-teach-about-salvation": {
    answer:
      "Jesus taught that salvation is God's free gift: the Father so loved the world that he gave his Son, so that whoever believes in him would not perish but have eternal life [[John 3:16]]. Jesus called people to repent and believe [[Mark 1:15]], to be born of water and the Spirit [[John 3:5]], and to follow him and keep his commandments out of love [[John 14:15]]. Catholics believe we are saved by grace, through a faith that works through love [[Galatians 5:6]] [[CCC 1987]] [[CCC 1996]].",
    body: [
      { h: "Salvation is a gift" },
      {
        p: "No one earns salvation. Paul says we are saved by grace through faith, not by our own doing, and created for the good works God prepared for us [[Ephesians 2:8-10]]. The Catholic Church agrees: grace is a free and undeserved gift, and no one can merit the first grace that brings us to conversion [[CCC 1996]] [[CCC 2010]]. Even our good works are God's grace at work in us [[CCC 2008]].",
      },
      { h: "Repent and believe" },
      {
        p: "Jesus began his preaching with, in Mark's words, \"repent, and believe the gospel\" [[Mark 1:15]]. His parables show a God who goes looking for the lost: the shepherd who leaves the ninety-nine, and the father who runs to his returning son [[Luke 15:3-7]] [[Luke 15:11-32]].",
      },
      { h: "New birth through baptism" },
      {
        p: "Jesus told Nicodemus that no one can enter the kingdom of God without being born of water and the Spirit [[John 3:5]], and he sent his apostles to make disciples of all nations, baptizing them [[Matthew 28:19-20]]. That is why the Church teaches that baptism is necessary for salvation for those to whom the Gospel has been proclaimed, while God himself is not bound by his sacraments [[CCC 1257]].",
      },
      { h: "A faith that lives" },
      {
        p: "Jesus said that not everyone who calls him \"Lord\" will enter the kingdom, but the one who does the Father's will [[Matthew 7:21]]. In his picture of the last judgment, people are judged by how they treated the hungry, the stranger and the prisoner [[Matthew 25:31-46]]. This doesn't contradict salvation by grace. Paul says we are justified by faith apart from works of the law [[Romans 3:28]]; James says faith without works is dead [[James 2:26]]. Both describe the same living faith: trust in Christ that shows itself in love [[Galatians 5:6]].",
      },
      { h: "Can salvation be lost?" },
      {
        p: "Jesus called himself the vine and his disciples the branches, and warned that a branch that does not remain in him is cut off [[John 15:5-6]]. He said the one who endures to the end will be saved [[Matthew 24:13]]. The Church teaches that grave sin freely chosen breaks our friendship with God, but that his mercy is always open to anyone who repents [[CCC 1861]] [[CCC 1446]]. Catholics live in hope, trusting God without presuming on his mercy or despairing of it [[CCC 1821]] [[CCC 2091]] [[CCC 2092]].",
      },
      { h: "What about people who never heard of Jesus?" },
      {
        p: "God wants everyone to be saved and to come to the knowledge of the truth [[1 Timothy 2:4]]. The Church teaches that those who, through no fault of their own, do not know Christ but seek God sincerely and try to do his will as they understand it may also be saved [[CCC 847]]. That is not a reason to stay quiet. It is why the Church still has an urgent mission to share the Gospel [[CCC 848]].",
      },
    ],
  },
  "how-to-become-catholic": {
    answer:
      "Contact a Catholic parish near you and ask about OCIA, the Order of Christian Initiation of Adults (many parishes still call it RCIA). A team will walk with you as you learn the faith, pray and get to know parish life. Adults who have never been baptized usually receive Baptism, Confirmation and First Communion together at the Easter Vigil. Christians already baptized in another church are received into full communion without being baptized again [[CCC 1232]] [[CCC 1247]] [[CCC 1272]].",
    body: [
      { h: "Step 1: Reach out to a parish" },
      {
        p: "Find a Catholic parish near you, for example with [MassTimes.org](https://masstimes.org/), then call or email the parish office and ask for the OCIA coordinator. You don't need to have everything figured out or be sure yet. Saying \"I'm curious about becoming Catholic\" is enough.",
      },
      { h: "Step 2: Inquiry and learning" },
      {
        p: "Most parishes begin with an informal period of questions, often called inquiry. If you continue, you'll meet regularly with the OCIA team to learn about Scripture, the Creed, the sacraments, prayer and the moral life, and you'll start coming to Sunday Mass. Since the early Church, adults preparing for baptism have gone through this kind of formation, called the catechumenate [[CCC 1247]] [[CCC 1248]]. Many parishes run from the fall to Easter, but there is no fixed length; it depends on where you're starting from.",
      },
      { h: "Step 3: Receiving the sacraments" },
      {
        p: "Adults who have never been baptized usually receive all three sacraments of initiation, Baptism, Confirmation and the Eucharist, at the Easter Vigil, the night before Easter [[CCC 1232]] [[CCC 1233]]. It is the same path the first Christians walked: Jesus sent the apostles to baptize and to teach [[Matthew 28:19-20]], Peter told the crowd at Pentecost to repent and be baptized [[Acts 2:38]], and Philip explained the Scriptures to the Ethiopian official before baptizing him [[Acts 8:35-38]].",
      },
      { h: "If you're already a baptized Christian" },
      {
        p: "If you were baptized in another Christian church with water and in the name of the Father, the Son and the Holy Spirit, the Catholic Church recognizes that baptism, and it is not repeated [[CCC 1271]] [[CCC 1272]]. You'll prepare to be received into full communion: you usually make your first confession, then make a profession of faith, are confirmed and receive your First Communion. Your preparation may be shorter, depending on what you already know and practice.",
      },
      { h: "If you were baptized Catholic but drifted away" },
      {
        p: "You don't need OCIA to come back. Go to [confession](@why-do-catholics-confess-to-a-priest) and start coming to Mass. If you were never confirmed or never received First Communion, ask your parish how to prepare; many parishes have a program for adults in exactly that situation.",
      },
      { h: "Sponsors and special situations" },
      {
        p: "You'll have a sponsor, a practicing Catholic who walks with you. If you don't know anyone, tell the OCIA coordinator; parishes can usually help connect you with someone. If you have been married before, mention it early. Some situations need to be looked at before you can be received, and the coordinator can explain the process gently and privately.",
      },
      { h: "What to do today" },
      {
        ul: [
          "Go to a Sunday Mass. Just watch, listen and pray. Here's [what happens at Mass](@what-happens-at-catholic-mass).",
          "Read one of the Gospels. Mark is the shortest.",
          "Write down your questions, and bring them to the parish, or ask Restless.",
        ],
      },
    ],
  },
};

export const TOPICS = TOPIC_INDEX.map((topic) => {
  const article = ARTICLES[topic.slug];
  if (!article) throw new Error(`No article for ${topic.slug}`);
  return { ...topic, ...article };
});

export const TOPIC_BY_SLUG = Object.fromEntries(TOPICS.map((t) => [t.slug, t]));
