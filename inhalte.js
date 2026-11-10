/*
 * ===========================================================
 *  INHALTE DES ADVENTSKALENDERS – hier trägst du alles ein!
 * ===========================================================
 *
 *  Felder pro Tag:
 *    titel      – Überschrift im geöffneten Türchen
 *    text       – deine Nachricht (Zeilenumbruch mit \n)
 *    briefzahl  – Zahl für den Weihnachtsbrief
 *    paeckchen  – Nummer des Extra-Päckchens (leer lassen "" = keins)
 *    konfetti   – true = Konfetti regnet über die Seite
 *    status     – (optional) Text oben auf der Seite an diesem Tag
 *    bild       – (optional) Foto, z. B. "bilder/tag01.jpg"
 *    hinweis    – (optional) zusätzlicher Hinweis-Kasten
 *
 *  Wichtig: Texte stehen in "Anführungszeichen". Wenn du im Text
 *  selbst ein " brauchst, nimm einfach „ “.
 */

const KALENDER = {
  // Das Jahr, in dem die Türchen aufgehen sollen
  jahr: 2026,

  titel: "Für Toni ❤️",
  untertitel: "24 kleine Überraschungen bis Weihnachten",

  tage: {
    1: {
      titel: "Es geht los! ✨",
      text: "Mein Schatz, heute beginnt unsere Adventszeit – 24 Tage, an denen du jeden Morgen ein kleines Stück Liebe auspacken darfst.\nIch freu mich auf jeden einzelnen davon mit dir. ❤️",
      briefzahl: 14,
      paeckchen: "",
    },
    2: {
      titel: "Mein Lieblingsmensch",
      text: "Wusstest du, dass du das Schönste an jedem meiner Tage bist?\nDas gilt natürlich das ganze Jahr – aber im Dezember sag ich's dir eben jeden Tag. 💕",
      briefzahl: 3,
      paeckchen: "",
    },
    3: {
      titel: "Einfach du",
      text: "Du bist mein Lieblingsmensch, mein Zuhause und mein allerbester Grund zu lächeln. 🥰",
      briefzahl: 17,
      paeckchen: "",
    },
    4: {
      titel: "Happy Birthday, Joris! 🎉",
      text: "Heute wird gefeiert – dein Bruder hat Geburtstag! 🥳\nDrück ihn ganz fest von mir und richte ihm die allerbesten Wünsche aus.\nUnd du feierst einfach mit – heute gibt's doppelt Grund zur Freude!",
      briefzahl: 8,
      paeckchen: 2603,
      konfetti: true,
      status: "Heute hat Joris Geburtstag 🎉 Türchen 4 wartet!",
    },
    5: {
      titel: "Kuschelwarm",
      text: "Draußen ist es kalt und grau – aber mit dir wird selbst der trübste Dezembertag kuschelig warm. ☕️❤️",
      briefzahl: 11,
      paeckchen: 48,
    },
    6: {
      titel: "Ho ho ho! 🎅",
      text: "Der Nikolaus hat mir verraten, dass du dieses Jahr ganz besonders brav warst … na ja, meistens. 😏\nIch hoffe, dein Stiefel war heute gut gefüllt!",
      briefzahl: 1,
      paeckchen: 500,
      status: "Frohen Nikolaus, mein Schatz 🎅",
    },
    7: {
      titel: "Morgen ist Bio-Tag 🧬",
      text: "Morgen steht deine Bio-Klausur an. Du hast so viel gelernt – du bist bereit, auch wenn es sich vielleicht gerade nicht so anfühlt.\nHeute Abend: nochmal kurz durchgehen, dann ab ins Bett. Ich glaub an dich! 💪",
      briefzahl: 19,
      paeckchen: 51,
    },
    8: {
      titel: "Viel Erfolg in Bio! 🍀",
      text: "Heute ist deine Bio-Klausur – und du wirst sie rocken!\nDu weißt mehr, als du denkst. Atme tief durch, lies die Aufgaben in Ruhe und fang mit dem an, was du sicher kannst.\nEgal wie es läuft: Ich bin unglaublich stolz auf dich. ❤️",
      briefzahl: 6,
      paeckchen: 89,
      status: "Heute ist Bio-Klausur – ich drück dir die Daumen! 🍀",
    },
    9: {
      titel: "Eine geschafft! 🙌",
      text: "Die erste Klausur ist geschafft! Ich hoffe, Bio lief richtig gut.\nHeute gibt's eine Extra-Portion Liebe – die hast du dir mehr als verdient. 💕",
      briefzahl: 12,
      paeckchen: 2611,
    },
    10: {
      titel: "Morgen ist Deutsch dran 📚",
      text: "Morgen kommt die Deutsch-Klausur. Du findest doch immer die richtigen Worte – bei mir sowieso.\nAlso wird das morgen auch klappen. Ich bin bei dir! 💕",
      briefzahl: 5,
      paeckchen: 123,
    },
    11: {
      titel: "Viel Erfolg in Deutsch! ✍️",
      text: "Heute zeigst du in der Deutsch-Klausur, was du draufhast!\nLies genau, nimm dir Zeit für deine Gedanken und schreib einfach so klug, wie du bist.\nIch drück dir ganz fest die Daumen – du schaffst das! 🍀",
      briefzahl: 16,
      paeckchen: "",
      status: "Heute ist Deutsch-Klausur – du schaffst das! ✍️",
    },
    12: {
      titel: "Halbzeit! 🎈",
      text: "Die Hälfte des Kalenders ist geschafft – und zwei von drei Klausuren auch!\nIch bin so stolz auf dich, mein Schatz. Nur noch eine, dann hast du's hinter dir. 💪",
      briefzahl: 9,
      paeckchen: 92,
    },
    13: {
      titel: "Alles Gute, Henning! 🎂",
      text: "Heute hat dein Papa Geburtstag! 🥳\nDrück ihn ganz fest von mir und richte ihm die allerbesten Glückwünsche aus.\nOhne ihn gäbe es dich nicht – und dafür bin ich ihm unendlich dankbar. ❤️",
      briefzahl: 2,
      paeckchen: 77,
      konfetti: true,
      status: "Heute hat dein Papa Geburtstag 🎂 Türchen 13 wartet!",
    },
    14: {
      titel: "Alles an dir",
      text: "Ich liebe dein Lachen, deine Art und wie du mich ansiehst.\nEigentlich liebe ich einfach alles an dir. 💖",
      briefzahl: 18,
      paeckchen: 3544,
    },
    15: {
      titel: "Dauerlächeln",
      text: "Wenn ich an dich denke, muss ich lächeln.\nAlso lächle ich ziemlich oft. 😊",
      briefzahl: 7,
      paeckchen: 33,
    },
    16: {
      titel: "Morgen: Mathe-Endspurt 🧮",
      text: "Morgen kommt die letzte Klausur: Mathe! Zwei hast du schon geschafft, die dritte packst du auch.\nHeute nochmal ruhig die wichtigsten Aufgaben durchgehen und dann gut schlafen. Ich glaub an dich! 💪",
      briefzahl: 13,
      paeckchen: 58,
    },
    17: {
      titel: "Viel Erfolg in Mathe! 📐",
      text: "Letzte Klausur, letzter Endspurt!\nRechne in Ruhe, schau dir jede Aufgabe genau an und lass dich nicht stressen – du kannst das.\nUnd danach: Klausurenphase geschafft! Ich bin jetzt schon unfassbar stolz auf dich. ❤️",
      briefzahl: 4,
      paeckchen: "",
      status: "Heute ist Mathe-Klausur – die letzte! Du packst das 📐",
    },
    18: {
      titel: "Alle Klausuren geschafft! 🎉",
      text: "Bio, Deutsch, Mathe – alles hinter dir! Ich hoffe, Mathe lief gestern super.\nAb jetzt beginnt der gemütliche Teil vom Dezember – und den verbringen wir hoffentlich ganz viel zusammen. 🥰",
      briefzahl: 15,
      paeckchen: 78,
    },
    19: {
      titel: "Bunter mit dir",
      text: "Du machst mein Leben jeden Tag ein bisschen bunter, wärmer und schöner. 🌈",
      briefzahl: 10,
      paeckchen: 100,
    },
    20: {
      titel: "Noch fünf Türchen",
      text: "Nur noch fünf Türchen bis Heiligabend – die Vorfreude steigt!\nAm meisten freue ich mich aber darauf, Weihnachten mit dir zu verbringen. 🎄",
      briefzahl: 20,
      paeckchen: 72,
    },
    21: {
      titel: "Der kürzeste Tag ☀️",
      text: "Heute ist der kürzeste Tag des Jahres.\nAber mit dir fühlt sich jeder Tag hell an. 💛",
      briefzahl: 21,
      paeckchen: 925,
    },
    22: {
      titel: "Danke",
      text: "Danke, dass du immer für mich da bist, mich zum Lachen bringst und mich so nimmst, wie ich bin.\nIch bin so froh, dass es dich gibt. ❤️",
      briefzahl: 22,
      paeckchen: 44,
    },
    23: {
      titel: "Noch einmal schlafen …",
      text: "Morgen ist Heiligabend! 🎁\nIch freu mich so sehr darauf, Weihnachten mit dir zu feiern.",
      briefzahl: 23,
      paeckchen: 64,
    },
    24: {
      titel: "Frohe Weihnachten, mein Schatz 🎄",
      text: "Das letzte Türchen.\nDanke, dass du da bist, dass du genau so bist, wie du bist, und dass ich diesen Dezember mit dir erleben durfte.\nDu bist mein allerschönstes Geschenk – heute und jeden Tag.\nIch liebe dich. ❤️",
      briefzahl: 24,
      paeckchen: 902,
    },
  },
};
