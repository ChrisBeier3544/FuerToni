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
  untertitel: "24 kleine Überraschungen bis Weihnachten",

  tage: {
    1: {
      titel: "Es geht los ✨",
      text: "Guten Morgen, mein Schatz ♥️\nHeute öffnest du das erste Türchen. Ab jetzt wartet jeden Morgen eine kleine Überraschung auf dich, weil du mir so unendlich viel bedeutest.",
      briefzahl: 14,
      paeckchen: "",
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
      text: "Heute hat dein Bruder Geburtstag! 🥳\nRichte ihm schon mal meine besten Glückwünsche aus. Mein kleines Präsent folgt zeitnah!\nIch wünsche euch einen wunderschönen Tag zusammen ♥️",
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
      text: "Heute bringt der Nikolaus allen etwas Schönes. Mein schönstes Geschenk habe ich aber schon längst bekommen, und das bist du.\nIch liebe dich, mein Schatz ♥️",
      briefzahl: 1,
      paeckchen: 500,
      status: "Frohen Nikolaus, mein Schatz 🎅",
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
      text: "Heute schreibst du deine Deutschklausur und ich weiß, dass sie richtig gut klappen wird. Du bist so klug und findest immer die richtigen Worte.\nIch drück dir ganz fest die Daumen, mein Schatz ♥️",
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
      text: "Heute hat dein Papa Geburtstag! 🥳\nDrück ihn ganz fest von mir und richte ihm meine herzlichsten Glückwünsche aus. Ohne ihn gäbe es dich nicht, und dafür bin ich ihm unendlich dankbar ♥️",
      briefzahl: 2,
      paeckchen: 77,
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
    },
    16: {
      titel: "Herzklopfen",
      text: "Ich bekomme immer noch Herzklopfen, wenn du mich anlächelst. Und ich hoffe, das hört nie auf ♥️",
      briefzahl: 13,
      paeckchen: 58,
    },
    17: {
      titel: "Viel Erfolg in Mathe 🍀",
      text: "Heute ist deine Matheklausur und ich bin mir sicher, dass sie richtig gut klappen wird. Lass dich nicht stressen, du kannst das!\nIch drück dir ganz fest die Daumen, mein Schatz ♥️",
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
      text: "Nur noch fünf Türchen bis Heiligabend. Ich freu mich so sehr darauf, Weihnachten mit dir zu feiern ♥️",
      briefzahl: 20,
      paeckchen: 72,
    },
    21: {
      titel: "Der kürzeste Tag ☀️",
      text: "Heute ist der kürzeste Tag des Jahres. Aber mit dir an meiner Seite fühlt sich jeder Tag hell und warm an ♥️",
      briefzahl: 21,
      paeckchen: 925,
    },
    22: {
      titel: "Danke",
      text: "Danke, dass du immer für mich da bist, mich zum Lachen bringst und mich so nimmst, wie ich bin. Ich bin so froh, dass ich dich habe ♥️",
      briefzahl: 22,
      paeckchen: 44,
    },
    23: {
      titel: "Noch einmal schlafen",
      text: "Morgen ist Heiligabend! Nur noch einmal schlafen und dann feiern wir zusammen Weihnachten. Ich kann es kaum erwarten ♥️",
      briefzahl: 23,
      paeckchen: 64,
    },
    24: {
      titel: "Frohe Weihnachten, mein Schatz 🎄",
      text: "Das letzte Türchen.\nDanke, dass du da bist, dass du genau so bist, wie du bist, und dass ich diesen Dezember mit dir erleben durfte.\nDu bist mein allerschönstes Geschenk, heute und jeden Tag.\nIch liebe dich ♥️",
      briefzahl: 24,
      paeckchen: 902,
    },
  },
};
