/*
 * ===========================================================
 *  INHALTE DES ADVENTSKALENDERS : hier trägst du alles ein!
 * ===========================================================
 *
 *  Felder pro Tag:
 *    titel      : Überschrift im geöffneten Türchen
 *    text       : deine Nachricht (Zeilenumbruch mit \n)
 *    briefzahl  : Zahl für den Weihnachtsbrief
 *    paeckchen  : Nummer des Extra-Päckchens (leer lassen "" = keins)
 *    konfetti   : true = Konfetti regnet über die Seite
 *    geschenkregen : true = langsam fallende Geschenke 🎁
 *    rubbeln    : true = Text und Zahlen erst freirubbeln
 *    audio      : (optional) Sprachnachricht, z. B. "audio/tag01.m4a"
 *    status     : (optional) Text oben auf der Seite an diesem Tag
 *    bild       : (optional) Foto, z. B. "bilder/tag01.jpg"
 *    hinweis    : (optional) zusätzlicher Hinweis-Kasten
 *
 *  Wichtig: Texte stehen in "Anführungszeichen". Wenn du im Text
 *  selbst ein " brauchst, nimm einfach „ “.
 */

const KALENDER = {
  // Das Jahr, in dem die Türchen aufgehen sollen
  jahr: 2026,

  titel: "Für Toni ♥️",

  // Unterschrift unter jedem Türchen-Text
  unterschrift: "Dein Chris ♥️",

  // Für den Zähler „seit X Tagen zusammen“ (Jahr-Monat-Tag)
  zusammenSeit: "2026-03-01",
  kennenSeit: "2025-12-21",
  untertitel: "24 kleine Überraschungen bis Weihnachten",

  /*
   * Fotos (liegen im Ordner bilder/, kleine Vorschau in bilder/klein/)
   *   titel   : die Polaroids oben unter der Überschrift (am besten 3)
   *   galerie : der Fotostreifen „Unsere Momente“ unter dem Kalender
   *   text    : kleine Beschriftung unter dem Foto
   *   fokus   : (optional) welcher Bildteil im Ausschnitt zu sehen ist,
   *             z. B. "70% 50%" = etwas weiter rechts
   */
  fotos: {
    titel: [
      { datei: "kuss-am-meer.jpg", text: "Am Meer", fokus: "68% 50%" },
      { datei: "bank.jpg", text: "Lieblingsmensch" },
      { datei: "wangenkuss.jpg", text: "Küsschen", fokus: "40% 50%" },
    ],
    galerie: [
      { datei: "sonnenuntergang.jpg", text: "Mein liebstes Motiv" },
      { datei: "strand-lachen.jpg", text: "Lachflash am Strand", fokus: "50% 70%" },
      { datei: "palma.jpg", text: "Palma" },
      { datei: "sofa.jpg", text: "Festhalten" },
      { datei: "dom.jpg", text: "Am Dom", fokus: "50% 85%" },
      { datei: "partnerlook.jpg", text: "Partnerlook" },
      { datei: "meeresluft.jpg", text: "Meeresluft", fokus: "50% 30%" },
      { datei: "schlafmuetze.jpg", text: "Schlafmütze" },
      { datei: "bucht.jpg", text: "Sommer am Meer" },
      { datei: "capybara-tasse.jpg", text: "Unser Capybara", fokus: "50% 45%" },
      { datei: "gondel.jpg", text: "Ganz oben" },
      { datei: "tanzen.jpg", text: "Tanzen", fokus: "40% 35%" },
      { datei: "caps.jpg", text: "Caps im Partnerlook" },
      { datei: "picknick.jpg", text: "Sommerpicknick", fokus: "55% 35%" },
      { datei: "kopfueber.jpg", text: "Kopfüber" },
      { datei: "bahn.jpg", text: "Heimweg" },
      { datei: "augenpads.jpg", text: "Beautyabend", fokus: "40% 30%" },
      { datei: "palma-kuesschen.jpg", text: "Küsschen in Palma" },
      { datei: "wald.jpg", text: "Waldspaziergang", fokus: "50% 60%" },
      { datei: "sofatag.jpg", text: "Sofatag" },
      { datei: "muetzen.jpg", text: "Mützenmodels" },
      { datei: "gemuetlich.jpg", text: "Gemütlich" },
      { datei: "abendspaziergang.jpg", text: "Abendspaziergang" },
      { datei: "gondel-abend.jpg", text: "Gondelfahrt" },
      { datei: "capybaras.jpg", text: "Capybara Kuschelparty" },
    ],
  },

  /*
   * Versteckte Easter Eggs (Gutscheine)
   *   emblem : welches kleine Bild (matcha, acai, capybara, ente, blumen, heimat)
   *   ab     : ab welchem Dezembertag es auftauchen darf
   *   versteck : { tuerchen: 5 }   = klein im geöffneten Türchen 5
   *              { foto: "x.jpg" } = in der großen Ansicht dieses Fotos
   *              { hinter: 10 }    = hinter Türchen 10, wenn es offen ist
   *              { seite: "titelfotos" } = hinter den Polaroids oben
   *              { seite: "fuss" }       = unten neben der Fußzeile
   *   bild   : (optional) Foto auf dem Gutschein, aus bilder/
   *   art    : (optional) "foto" = kein Gutschein, nur ein lustiger Fund
   *   fundtext : (optional) eigene Überschrift beim Finden
   *   quiz   : (optional) Frage, die sie vorher richtig beantworten muss.
   *            Bleibt „richtig“ leer (""), wird die Frage übersprungen.
   */
  eastereggs: [
    {
      emblem: "matcha",
      quiz: { frage: "Wann haben wir uns kennengelernt?", richtig: "21. Dezember 2025", falsch: ["14. Februar 2026", "1. März 2026"] },
      ab: 5,
      versteck: { tuerchen: 5 },
      bild: "kaffeedate.jpg",
      titel: "Ein Iced Matcha Latte",
      text: "Einmal Iced Matcha Latte, ganz nach deinem Geschmack. Einzulösen, wann immer du Lust drauf hast ♥️",
    },
    {
      emblem: "acai",
      quiz: { frage: "Wo war unser erster gemeinsamer Urlaub?", richtig: "Noordwijk aan Zee", falsch: ["Sant Elm", "Renesse"] },
      ab: 7,
      versteck: { seite: "titelfotos" },
      titel: "Ein Acai Bowl Date",
      text: "Wir gehen zusammen Acai Bowls essen. Wo, das bestimmst ganz allein du ♥️",
    },
    {
      emblem: "capybara",
      quiz: { frage: "Was ist unser Lieblingstier?", richtig: "Capybara", falsch: ["Faultier", "Otter"] },
      ab: 10,
      versteck: { hinter: 10 },
      art: "foto",
      bild: "capy-crew.jpg",
      fundtext: "Du hast die Capy Crew gefunden! 🎉",
      titel: "Geheime Capy Party",
      text: "Psst … sobald du nicht hinschaust, feiert die Capy Crew heimlich Party. Jetzt kennst du ihr Geheimnis ♥️",
    },
    {
      emblem: "ente",
      quiz: { frage: "Wo hatten wir unser erstes Date?", richtig: "Café in Köln", falsch: ["Restaurant Heimat", "Cologne Sky"] },
      ab: 16,
      versteck: { tuerchen: 16 },
      bild: "masken.jpg",
      titel: "Eine Wellnessmassage",
      text: "Eine Massage im New Soul Studio Köln, ganz nach deinen Wünschen. Lehn dich zurück und lass dich so richtig verwöhnen ♥️",
    },
    {
      emblem: "blumen",
      quiz: { frage: "Was habe ich dir als Erstes geschrieben?", richtig: "Niemals breche ich das Versprechen 🫶🏻", falsch: ["Du bist wunderschön 🥰", "Danke für diesen schönen Abend ♥️"] },
      ab: 19,
      versteck: { seite: "fuss" },
      bild: "cafe.jpg",
      titel: "Ein Date deiner Wahl",
      text: "Du planst, ich bin dabei. Egal was du dir aussuchst, es geht auf mich ♥️",
    },
    {
      emblem: "heimat",
      quiz: { frage: "An welchem Tag sind wir zusammengekommen?", richtig: "1. März 2026", falsch: ["21. Dezember 2025", "14. Februar 2026"] },
      ab: 24,
      versteck: { tuerchen: 24 },
      titel: "Ein Dinner im Restaurant „Heimat“",
      text: "Ein schöner Abend für uns zwei im Restaurant Heimat. Du bestellst, worauf du Lust hast, und ich lade dich ein ♥️",
    },
  ],

  tage: {
    1: {
      titel: "Es geht los ✨",
      text: "Guten Morgen, Maus ♥️\nHeute öffnest du das erste Türchen. Ab jetzt wartet jeden Morgen eine kleine Überraschung auf dich, weil du mir so unendlich viel bedeutest.",
      briefzahl: 14,
      paeckchen: "",
      audio: "audio/tag01.m4a",
    },
    2: {
      titel: "Mein Lieblingsmensch",
      text: "Weißt du eigentlich, wie glücklich du mich machst? Jeden einzelnen Tag.\nIch liebe dich ♥️",
      briefzahl: 3,
      paeckchen: "",
    },
    3: {
      titel: "Mein Zuhause",
      text: "Egal wo wir sind, bei dir fühle ich mich zuhause. Du bist mein sicherer Ort und mein liebster Mensch auf der ganzen Welt ♥️",
      briefzahl: 17,
      paeckchen: "",
    },
    4: {
      titel: "Happy Birthday, Joris 🎉",
      text: "Heute hat dein Bruder Geburtstag! 🥳\nRichte ihm schon mal meine besten Glückwünsche aus. Mein kleines Geschenk folgt zeitnah!\nIch wünsche euch einen wunderschönen Tag zusammen ♥️",
      briefzahl: 8,
      paeckchen: 2603,
      konfetti: true,
      status: "Heute hat Joris Geburtstag 🎉 Türchen 4 wartet auf dich!",
    },
    5: {
      titel: "Kuschelwetter",
      text: "Draußen wird es immer kälter, aber in deinen Armen ist es immer warm. Ich freu mich schon auf unseren nächsten Kuschelabend ♥️",
      briefzahl: 11,
      paeckchen: 48,
    },
    6: {
      titel: "Frohen Nikolaus 🎅",
      text: "Heute bringt der Nikolaus allen etwas Schönes. Mein schönstes Geschenk habe ich aber schon längst bekommen, und das bist du.\nIch liebe dich, Baby ♥️",
      briefzahl: 1,
      paeckchen: 500,
      rubbeln: true,
      status: "Frohen Nikolaus, Toni 🎅",
    },
    7: {
      titel: "Dein Lächeln",
      text: "Dein Lächeln ist das Erste, an das ich morgens denke, und das Letzte vor dem Einschlafen. Bitte hör nie auf damit ♥️",
      briefzahl: 19,
      paeckchen: 51,
    },
    8: {
      titel: "Viel Erfolg in Bio 🍀",
      text: "Heute ist deine Bioklausur und ich bin mir ganz sicher, dass sie richtig gut klappen wird. Du hast so viel dafür getan und du kannst das!\nIch drück dir ganz fest die Daumen, mein Schatz ♥️",
      briefzahl: 6,
      paeckchen: 89,
      status: "Heute ist deine Bioklausur. Ich drück dir die Daumen 🍀",
    },
    9: {
      titel: "Du bist wunderbar",
      text: "Ich glaube, ich sag dir viel zu selten, wie wunderbar du bist. Deshalb heute ganz offiziell: Du bist wunderbar ♥️",
      briefzahl: 12,
      paeckchen: 2611,
    },
    10: {
      titel: "Mit dir",
      text: "Mit dir ist alles schöner. Die großen Momente genauso wie die kleinen, ganz normalen Tage ♥️",
      briefzahl: 5,
      paeckchen: 123,
    },
    11: {
      titel: "Viel Erfolg in Deutsch 🍀",
      text: "Heute steht deine Deutschklausur an! Ich wünsche dir ganz viel Erfolg, du wirst das super machen.\nIch halte heute den ganzen Tag die Daumen für dich gedrückt ♥️",
      briefzahl: 16,
      paeckchen: "",
      status: "Heute ist deine Deutschklausur. Ich drück dir die Daumen 🍀",
    },
    12: {
      titel: "Halbzeit",
      text: "Die Hälfte vom Kalender ist schon geschafft. Und ich verliebe mich immer noch jeden Tag ein bisschen mehr in dich ♥️",
      briefzahl: 9,
      paeckchen: 92,
    },
    13: {
      titel: "Alles Gute, Henning 🎂",
      text: "Heute hat dein Papa Geburtstag! 🥳\nRichte ihm meine herzlichen Glückwünsche aus. Ich wünsche euch einen schönen Tag zusammen ♥️",
      briefzahl: 2,
      paeckchen: 77,
      audio: "audio/tag13.m4a",
      konfetti: true,
      status: "Heute hat dein Papa Geburtstag 🎂 Türchen 13 wartet auf dich!",
    },
    14: {
      titel: "Alles an dir",
      text: "Ich liebe dein Lachen, deine Art und wie du mich ansiehst. Eigentlich liebe ich einfach alles an dir ♥️",
      briefzahl: 18,
      paeckchen: 3544,
    },
    15: {
      titel: "Dauerlächeln",
      text: "Wenn ich an dich denke, muss ich lächeln. Also lächle ich ziemlich oft 😊♥️",
      briefzahl: 7,
      paeckchen: 33,
      rubbeln: true,
    },
    16: {
      titel: "Herzklopfen",
      text: "Ich bekomme immer noch Herzklopfen, wenn du mich anlächelst. Und ich hoffe, das hört nie auf ♥️",
      briefzahl: 13,
      paeckchen: 58,
    },
    17: {
      titel: "Viel Erfolg in Mathe 🍀",
      text: "Heute ist Mathe dran! Bleib ganz ruhig, du hast das drauf und es wird gut klappen.\nIch drück dir fest die Daumen, Maus ♥️",
      briefzahl: 4,
      paeckchen: "",
      status: "Heute ist deine Matheklausur. Ich drück dir die Daumen 🍀",
    },
    18: {
      titel: "Lieblingsmomente",
      text: "Meine liebsten Momente sind die, in denen wir einfach zusammen sind. Ohne Plan, ohne Stress, nur du und ich ♥️",
      briefzahl: 15,
      paeckchen: 78,
    },
    19: {
      titel: "Bunter mit dir",
      text: "Du machst mein Leben jeden Tag ein bisschen bunter, wärmer und schöner. Danke, dass es dich gibt ♥️",
      briefzahl: 10,
      paeckchen: 100,
    },
    20: {
      titel: "Noch fünf Türchen",
      text: "Nur noch fünf Türchen bis Heiligabend. Ich freu mich so sehr auf die Weihnachtstage mit dir ♥️",
      briefzahl: 20,
      paeckchen: 72,
    },
    21: {
      titel: "Ein Jahr wir ♥️",
      text: "Heute ist der kürzeste Tag des Jahres und gleichzeitig mein liebster: Genau heute vor einem Jahr habe ich dich kennengelernt ♥️",
      briefzahl: 21,
      paeckchen: 925,
      rubbeln: true,
    },
    22: {
      titel: "Danke",
      text: "Danke, dass du immer für mich da bist, mich zum Lachen bringst und mich so nimmst, wie ich bin. Ich bin so froh, dass ich dich habe ♥️",
      briefzahl: 22,
      paeckchen: 44,
    },
    23: {
      titel: "Noch einmal schlafen",
      text: "Morgen ist schon Heiligabend! Und dann geht es direkt weiter: am ersten Feiertag ins Sauerland zu deiner Familie und am zweiten zur großen Wichtelrunde bei meiner.\nIch freu mich so auf die Feiertage mit dir ♥️",
      briefzahl: 23,
      paeckchen: 64,
    },
    24: {
      titel: "Frohe Weihnachten, mein Schatz 🎄",
      text: "Das letzte Türchen.\nDanke, dass du da bist, dass du genau so bist, wie du bist, und dass ich diesen Dezember mit dir erleben durfte.\nDu bist mein allerschönstes Geschenk, heute und jeden Tag.\nAuch wenn wir heute nicht zusammen sind, bin ich in Gedanken ganz bei dir. Und morgen sehen wir uns endlich wieder.\nIch liebe dich ♥️",
      briefzahl: 24,
      paeckchen: 902,
      audio: "audio/tag24.m4a",
      geschenkregen: true,
    },
  },
};
