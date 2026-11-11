/*
 * Inhalte des Adventskalenders.
 * Türchen, Gutscheine und Geburtstagsbrief sind verschlüsselt und
 * werden erst am jeweiligen Tag lesbar.
 */

const KALENDER = {
  // Das Jahr, in dem die Türchen aufgehen sollen
  jahr: 2026,

  titel: "Für Toni ♥️",

  // Vor ihrem Geburtstag: Countdown bis zum Geburtstag, danach lässt sich der Brief öffnen
  // (deutsche Zeit, Jahr-Monat-Tag T Stunde:Minute)
  countdownBis: "2026-11-26T00:00",
  briefAb: "2026-11-26T00:30",
  geburtstag: {
    datum: "2026-11-26",
    geheim:
      "u58V+oCD5LIeJQgMFXFuC+sQOE+fqWUpXnNvCzKiJDhYS1ezFBvtrqGtYzcNsO3MBrfvqzANxwHewjYi1FwqvEl9zkbobEvQ" +
      "zAF6yVYELCtiDPtwezdDvhUgdPmeeFPPFigYWJvWDdRjE5olkJBBUMf1eWsFhw4VRIBwJt1tsipD3kUM7FUtG7EDVyUVv4G8" +
      "g/54RXhtwHKLdI3/S3wrnr6SrkNgZfRluVsRLQp4Z6ZY15I5i+R4XQ==",
  },

  // Postkarten vom 26. bis 30. November (Monat-Tag)
  postkarten: {
    "11-26": { titel: "Happy Birthday, Toni! 🎂", text: "Heute ist dein Tag! Ich wünsche dir einen wunderschönen Geburtstag voller Lachen, Kuchen und Liebe ♥️", bild: "strand-lachen.jpg" },
    "11-27": { titel: "Noch 4 Mal schlafen", text: "Dann öffnest du das erste Türchen. Die Capy Crew arbeitet schon ganz fleißig an deinem Kalender 🐹", bild: "capybara-tasse.jpg" },
    "11-28": { titel: "Noch 3 Mal schlafen", text: "Heute wird geschmückt! Gleich bringen die Capys Schnee, Schleifen und die Lichterkette an. Schau ihnen ruhig zu ✨", bild: "dom.jpg", fokus: "50% 100%" },
    "11-29": { titel: "Frohen 1. Advent 🕯️", text: "Heute brennt die erste Kerze. Ich wünsche dir einen gemütlichen Sonntag und denk ganz fest an dich ♥️", bild: "sofatag.jpg" },
    "11-30": { titel: "Morgen geht es los!", text: "Nur noch einmal schlafen, dann öffnest du das erste Türchen. Ich freu mich so auf diesen Dezember mit dir ♥️", bild: "meeresluft.jpg" },
  },

  // Anleitung als Brief, erscheint ab dem Geburtstag um 0:30 (wird verschlüsselt)
  anleitung: {
    geheim:
      "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",
  },

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
      { datei: "bank.jpg", text: "Lieblingsmensch", fokus: "68% 50%" },
      { datei: "wangenkuss.jpg", text: "Küsschen", fokus: "40% 50%" },
    ],
    galerie: [
      { datei: "sonnenuntergang.jpg", text: "Mein liebstes Motiv" },
      { datei: "capy-mittagsschlaf.jpg", text: "Capy Mittagsschlaf", fokus: "0% 50%" },
      { datei: "strand-lachen.jpg", text: "Lachflash am Strand", fokus: "50% 70%" },
      { datei: "nordseewind.jpg", text: "Nordseewind", fokus: "50% 60%" },
      { datei: "palma.jpg", text: "Palma" },
      { datei: "kniffel.jpg", text: "Kniffel!", fokus: "50% 22%" },
      { datei: "sofa.jpg", text: "Festhalten" },
      { datei: "ueber-dem-rhein.jpg", text: "Über dem Rhein", fokus: "35% 50%" },
      { datei: "dom.jpg", text: "Am Dom", fokus: "50% 85%" },
      { datei: "waffel.jpg", text: "Waffelliebe", fokus: "40% 50%" },
      { datei: "partnerlook.jpg", text: "Partnerlook" },
      { datei: "sonnenuntergang-zu-zweit.jpg", text: "Sonnenuntergang zu zweit", fokus: "50% 60%" },
      { datei: "meeresluft.jpg", text: "Meeresluft", fokus: "50% 30%" },
      { datei: "gamerin.jpg", text: "Gamerin", fokus: "45% 28%" },
      { datei: "schlafmuetze.jpg", text: "Schlafmütze" },
      { datei: "huckepack.jpg", text: "Huckepack", fokus: "50% 40%" },
      { datei: "bucht.jpg", text: "Sommer am Meer" },
      { datei: "amsterdam.jpg", text: "Amsterdam", fokus: "50% 45%" },
      { datei: "capybara-tasse.jpg", text: "Unser Capybara", fokus: "50% 45%" },
      { datei: "bussi-am-strand.jpg", text: "Bussi am Strand", fokus: "55% 55%" },
      { datei: "gondel.jpg", text: "Ganz oben" },
      { datei: "esel.jpg", text: "Neuer Freund", fokus: "100% 50%" },
      { datei: "tanzen.jpg", text: "Tanzen", fokus: "40% 35%" },
      { datei: "sommerabend.jpg", text: "Sommerabend", fokus: "45% 50%" },
      { datei: "caps.jpg", text: "Caps im Partnerlook" },
      { datei: "lego.jpg", text: "Wir als Lego" },
      { datei: "picknick.jpg", text: "Sommerpicknick", fokus: "55% 35%" },
      { datei: "kuss.jpg", text: "Kuss", fokus: "50% 22%" },
      { datei: "kopfueber.jpg", text: "Kopfüber" },
      { datei: "sonnenblumen.jpg", text: "Sonnenblumen", fokus: "50% 40%" },
      { datei: "bahn.jpg", text: "Heimweg" },
      { datei: "hoch-hinaus.jpg", text: "Hoch hinaus", fokus: "45% 30%" },
      { datei: "augenpads.jpg", text: "Beautyabend", fokus: "40% 30%" },
      { datei: "blauer-himmel.jpg", text: "Blauer Himmel", fokus: "50% 55%" },
      { datei: "palma-kuesschen.jpg", text: "Küsschen in Palma" },
      { datei: "maedels.jpg", text: "Mit den Mädels", fokus: "100% 50%" },
      { datei: "wald.jpg", text: "Waldspaziergang", fokus: "50% 60%" },
      { datei: "quatschkoepfe.jpg", text: "Quatschköpfe", fokus: "45% 50%" },
      { datei: "sofatag.jpg", text: "Sofatag" },
      { datei: "stirnkuss.jpg", text: "Stirnkuss", fokus: "40% 25%" },
      { datei: "muetzen.jpg", text: "Mützenmodels", fokus: "55% 28%" },
      { datei: "hoehle.jpg", text: "Tropfsteinhöhle", fokus: "70% 15%" },
      { datei: "gemuetlich.jpg", text: "Gemütlich" },
      { datei: "meisterfeier.jpg", text: "Meisterfeier", fokus: "45% 40%" },
      { datei: "abendspaziergang.jpg", text: "Abendspaziergang" },
      { datei: "schafe.jpg", text: "Schafe füttern", fokus: "25% 35%" },
      { datei: "gondel-abend.jpg", text: "Gondelfahrt" },
      { datei: "fensterplatz.jpg", text: "Fensterplatz", fokus: "35% 50%" },
      { datei: "capybaras.jpg", text: "Capybara Kuschelparty" },
      { datei: "ganz-fest.jpg", text: "Ganz fest", fokus: "50% 45%" },
      { datei: "kneipenabend.jpg", text: "Kneipenabend" },
      { datei: "herz-mit-a.jpg", text: "Herzensstück", fokus: "50% 40%" },
      { datei: "bienchen.jpg", text: "Zwei Bienchen", fokus: "50% 35%" },
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
   *   fokus  : (optional) Bildausschnitt, z. B. "100% 50%" = rechter Teil
   *   art    : (optional) "foto" = kein Gutschein, nur ein lustiger Fund
   *   fundtext : (optional) eigene Überschrift beim Finden
   *   quiz   : (optional) Frage, die sie vorher richtig beantworten muss.
   *            Bleibt „richtig“ leer (""), wird die Frage übersprungen.
   */
  eastereggs: [
    {
      emblem: "matcha",
      ab: 5,
      versteck: {tuerchen: 5},
      geheim:
        "M2MVQkkKr5A50Nkohjj1bXUVH8tXiVZcc6drS65+4XFRKKJL7OYReAWAc1/2VirKrU6RmCF3G2mONiO9ECvNxh5G8iPBmUnu" +
        "30tT4nbnQcfeB5UiFR9ZAqCGbU9xMRTBzIzMCWHa1UkFNMchckGS4Ao1IL3cSDYEEjpiRcghocZUx60zUfxJ+pwgzLTyFBVl" +
        "TsRoy3A/+c90HkU5N9Uetiv3aGuRhwTxjj37BrfTCJwbbk/WDVGeQAL9NJRMzcsf/rM32nPuGl0C1Uw86KMgXVh2RhHOVfCS" +
        "1Lt5+z0mZN7ZHn1EDNfeQZM1+WvwldrqSo0bNyJJlOzqLdS/4IUi35ZyOUp57+oDLvCzdwEJ8CrAH3IzUEkdVcs/lB9/8KaE" +
        "V1skcfp3VIXxn3A=",
    },
    {
      emblem: "acai",
      ab: 7,
      versteck: {seite: "titelfotos"},
      geheim:
        "3j7Te+tG8Yt+FxjMgLwuIcVLG2Y/RbdzPY7K7+154EvhcIVRoYKs6c3fYMCBoF2yce9RO7TBSXb5wjKRB3ANwxW2aWzPvhN1" +
        "Y2ZYnRgC236x7Qpq6LU4bUfudaVeuYqY9Ej4I8zY+4PdPw0sTLM8BjDT7WpFodgtUYpTS5G1xEz8jwqeDVWoKcAfj9L8m2d0" +
        "FHx6BtLkkEcoCvmeTsjuTY6CrtdskOnrA+FLpmNdTyA4LtnQmLi2/McXI70+8PQKaL/6FlMRDYyaV5oYJvmg3jhIFuu8sVrJ" +
        "SiFCQSx9CuaFHLZtdzpSGZ1VS7D7",
    },
    {
      emblem: "capybara",
      ab: 10,
      versteck: {hinter: 10},
      geheim:
        "+JI3Kz/mEEbWHl9qxkHB1OXBN5JvqnPV05hAoRZDV19nQchJ03IN+TYf2Ui5tGwcAIJ1Gft/zgQyFwlotOoW4phMLiBXKCWo" +
        "BeHmEtWMBf7gu8BioBJb6yBBtUU3Y0p3kuBA2KaYBmkiMJJ5jgzsilUtUSyZS5o4a9CtbK+hIfUO29Guihd6xNOPGBwjM2rd" +
        "AmH9QO2vz+eqAQe9iNpntV3otvOFbFw8vD3uUV7JfGiTwVeW+U/TLKMXpaYeEahXoSvlzuv0xQU9gcqsUeAQ5y4L7oeG9YMu" +
        "uFSH8j6C/QshauKoxX9Re9GOTfmSBr0YKkr+sBvG3nIKLwyjoQhySKJazaS0HH3SSvJFGBbYIddn8z00kxD0cYeRYyKIH9X0" +
        "quUIr8/pyowK4xRSHFapiTlJB3EoAxjujiAwY5yG0gAYsDWr43itxUS6jPeAtmI=",
    },
    {
      emblem: "ente",
      ab: 16,
      versteck: {tuerchen: 16},
      geheim:
        "5bkFnwiRXFrEHoofRaJsqaVTYaUzfxZoCp5TdxVQrvvjYF1FggFC3rpuMlzDbcblT9f7m+wUbwrotku4IE5cWJbDWVaBy51O" +
        "f58Q+9IRBZYEM3bYVhE7JPlRSXRsZTz+9LHfnmcbaa75S1aIlqJfswrmzCerVAprncoviyyZazkV5e5u0W1R82HRTAnSOWB0" +
        "8X0gIURSygODh8QcDc4+s8ihcmi/HmzigUW2eC6GqKRg5PtmqF2UpaccMT9hWtcdpXBlYwxF4WXMoUcvVE5DjeJ+Vd76FTOt" +
        "e8nPcApDUE3qUrz8WUd2385IUr2USAKdHIu1D9s/wyDN+cVz7lrAjEyI7CEI686SpnR5VRuhvEHj0JnJReDpmzOmDj1JuQv8" +
        "VyQ5iaJPVvEJcjHVEfahm0Gwifq9JSipFg==",
    },
    {
      emblem: "blumen",
      ab: 19,
      versteck: {seite: "fuss"},
      geheim:
        "+L4TRfydiAD2qYT0JMG7qls2ykVVljrRWudNtwmGImvjh9k6Kt8LH1HYygEfY8XuuxvdWjRP3lmY3Ow28jHLTKSwT6sN/Ifb" +
        "D+VbA7jJ44miejbPoqgTcAcYaniNCekbrFqtuA/Q0+JQ+XfnpQtngnvVl9vtYXkC2abCOM8+3DbRunyNoKhAUth+XHb/87GQ" +
        "bi5vPSwERaSR72eiVha+zIU652/FZz0aVzqFdfkGubwQRHGSkOM9Gl99H29DPujA7NbAyVjnV1KKDvM0c+mNeLNSdXUvTxIe" +
        "5bd9YSyBjlvLbRXXHwh7HlS8yFbZmntnCemQACQ6s6RT/CjS3n4M4sABRTRkvcRPJYIxjStlhNGSc7FP1MvJoeqYeyJKySg4" +
        "SqT3actv0aKiB8Ly/51FKC4UqksDTI+UpMu8PheUDJ5P8AJV2UT7Hwrt/okwmm+fvzzShiYZ1TWxtGV1gKlFjg==",
    },
    {
      emblem: "heimat",
      ab: 24,
      versteck: {tuerchen: 24},
      geheim:
        "NaFD8IDnaeiluqwrAgn5lJshMhvyJ2Kc+DsddoT4RchpRKhqclfgieaa3om8tHORLgjFPhNqw0NwiGupB0Gaq2mYoZltaWwv" +
        "CyhKqEj/X8wDOd8dXNuOjqGl83xXl9l901a9B2lns6K8H/BW1aVJsdNPkTswXF3qj4UoLFG3fOvRc+tIuWbbacyhd1+ujB/x" +
        "WB78ZqOCjwbDorDe77MPv+71eZHngXa70T4+OjEhiuh/vazWWozpgSeFoVipPt4kYFx9gF9LvumyPzGFpGxJLR0rB5ioVSqQ" +
        "EWIbMRhAdtcmrayGNxEtLBLhY2Rlp2bIshvJZRmHxbjG0c3BAFfFDbRc9bXL2xMbsjvYB4wK2j7VOXxmg9Pf/yOo3lWHMa9P" +
        "9M8lJckEDkjKJIpdIuQ8zQ8/Tqr2ksK2QW0=",
    },
  ],

  tage: {
    1:
      "SiBVFyFpOQTosY+8Hxtr4s6kPA2jnCsMsaUN7SPDld0PnQqwoLQFpCNz4l07QVmOytArjqOoIyACDcP4e2dM2mtMmdkpDLhK" +
      "RlivoAl0YT4Z18aHGOAWygrTLYUsW1NfutxawncUh83ijQOGUVHRU6MvRYpEDRkyqd7IuH09RD6X9ZGm7nckqiZ8XZvPDSF6" +
      "DotrJfwDH2ILyAucFczdctMidQx6VyaPkuRlHqURtgttitPqIg7w55jTFcGd8/vlSDAq9mSUNQ7ccBN9DsDgLlfJK9cHUDnn" +
      "dRhAf0Z/62yWENRke7MPUtWN4/geE2KkgyI2+pK1kku8Uu3RF2xJ97v6Qf+X4NAF15KzBgKN",
    2:
      "WHxZcTwnQgNcISK7xkQph3RORc/D/mGQ+giRnCizywi0O0uFV+TyDRPYTniwGxKqkHPiEdTWrhA1ja+T4HCXjNm2BQEIvi+q" +
      "bDPE9GJeCBTlyJZJ76eWsx+swkItaVGVl0/0oPNOenJLtVCbyLqoA/+K8trhaeLiIqr36RB9F849MrokzkenBvvoCyMlcpBj" +
      "DhAo7t8/KXp7d9AhhLTmvoB4G6fvWIQ=",
    3:
      "JjrOVlv/heQbxXbR8qlk4bjjVZ5Slqeq/ufBepz4wUQ0fHHxedU8pkcNIoVORAL1FHo8Tv8wNkXInGGnroQvoN+x9SGRtKPR" +
      "Nr/QExIjE+sTNi8LT5IcW0VVj0+nzHXnwwZ+INzHc4BB7uQU+kIRsw95NzCrSQIRqySBl8INDOfsebQKVrfrUEj/it0WkN7k" +
      "Ut057LZzoISKVuM/3TqICs9/tHWlaRsmXYXD82zf4vYINOeZCypoHTFcj26UBMCj",
    4:
      "SI7a9Six/hKv4HNkCawbataMiHVpt8zvtzIZC9iosJZ429rr/gMJBh1MNRaR84yB9WJKVTsVJ8ok0c2iYGv/zMq0dfvt45KT" +
      "l2f7MXGf9mkVly2AbiB2u+igakpMbcXZUCw+kT0PGoRsh+XsqFQDXQjTo1dYIgCqepO6e5unxNIyFm9Prr6axQiLonghX0QX" +
      "NZG7mh/w17ZM0Yl7aHi0ve+ErHF9rz8KVdjWq/sc1xN+19tIRAOvnsVcP/rRWcyU/J0kbUaMXk6SGz1CipzqdDiIvb6gujVY" +
      "/86mw5ZMpzWRv7GQTULKcpKLskf4cZKmCsO9AK3l5i4B3p18xY5tK10JzzACvttj+vcAC6bKYdAoUB45/HcPUaVHLB3fvoRN" +
      "hW4sjmOeh+Uyxc1q7bCl6aDYVBnyF73TaUSIFZaUiFWnghJB8U5T4/XzVhfsMO4Ez5rBU5WzDrD+8KNyyGAT4vphp5ES2oF5" +
      "qL5CY8O2VGiWljQHa+twrpfcKviOgl+3oqPccLSLgbyZhAIHBKAsAMCq2ZM0+GU9XLc29HANLW6JMHg=",
    5:
      "3q1meMeKnJVxrLh1nRkUD++edX7rTNl5uGfW6CYkQJgT0IU52w3+9nIp9gQVgh7WojE+kcWctJG9gr4hmolRuhrFU3UvB6M+" +
      "aXwmT+j7iapoipjK3YVYuOG8+nhyX/uM7H7mDxCLE10F9t58T0PKKZCFzkDD5PQGJgtBJQbkhMGPxi5kUqou/SqkiMqQc8kL" +
      "ne8Uu063savCFTo0GyVE2DCjBfDfzW65G4Sjs4Gv23GfqtP9U/jgZJRH7bu6eporlVNYy5ObzRi3VAdnnVaop2pU1JnZhzLq" +
      "FvAfn6ITyklSamD0VdIZMYeK3AD+Rkth03+BZxO1a6GOv0avFWKA5qn5tdGc8M7eZLzzqZQxwBlcbVmxJLSNcVEjRjX+zops" +
      "XkDPM3mx/rQvKsK/0oUQ27WXkRKNV1DC1kqx0mDLo7hdXOadpuxRuszso4HDDpDbgxw=",
    6:
      "xxEEOF/XK37vUzLJkVVOgIv2CjSjYlII7cuJff7O3l9OoMT/XRI4NKr002FBWwVvjyhEGzFWSKjDimdwp/KjEww8NyREkIsI" +
      "pvhY68Y9TN7vu6t3pEfLLGPdluob1gEhWwarBrdeKq7p3TNvlHmkOgVE7JNE01i0hzyLBC7pL9enGAGnJ4WX4v2C7jmYShz2" +
      "GFMGbChlU/EGSyqXYy0FEEB26L7EBpy/ljE//6K5ZH2xxGu0cKu6BUjrYqygIkCqkTwZclQbfeYt7V+QjUMaP/ccp66vq4Ws" +
      "jNGIWwPS3ouxpx+No6BSVLZ+fD8bmg7ZmuF1OoI4jA6COx8H4A2bLHcluAxZLeO65llY+Hgzy6QcbixT1sNHLpc=",
    7:
      "/zR9e7hiIwiOd3AdGXEzrTu7jIbvwckdcECuaijwGPWP6B/0Xrjm3BXXym+/3Ob63N6YC2Yf0+OblclBAWokadQo5qsfuV3c" +
      "m4Spjvjoyks0E9OqAm1/hTm6LxT6bCCCmlVC/HZn11vfbjplMkSMNQqy+PQKXqakbewp/MvbhEbU+sjFi4XxpNmSco6BHT03" +
      "2FXXQzXqlLqD9pdOYfXkOmXKA+qcYglq3Ix2MtElTj+iuu9RIfBwQ00rUQ==",
    8:
      "HOvk8PWcOm6a9o1FUxPGHCTZUkMw8ESK3SI/9njSg8OFebSgNigWNpCMOWR/oYgECmqzHsoMdRVSiB2JEGvtoaIJ3xNSZsXQ" +
      "Jew0zJO7HYl/XxRP7XT5ZM/mBUGEeMCNXzfy/5p3SGzLiFpy92MAQPz5i1TTcFHVNtUNpS6IuyMzaqy4crymBtlUeSoWV6IS" +
      "t2GEh6YbA6+mt6dzjgH5gkNlUVh0VI2dkvXKi1zg1fbV/H+90Tz50hbREVYm9wkDtv3SXdCArwy+K+nxtQx6VPdBNEXGfd5A" +
      "OhEm19/NJ/zLw+p+nedXTKmnKM/eqetm7dP5DCnTcc61gaKVsEZbBDaGqGccN7/zMo0f/1zvznG4GXFeIK9OYeck3Ps2LpqS" +
      "ah8lxzTJm7g68PMRlDF/o2Ut5RV2f/Q4jpa1ba6sGDI86DJmeRK52xsWFruuMUR8MvVL",
    9:
      "T1/TyRt+71o3MH//zn26vH5l+oLmGfks4Utocm51onbvCL01H/vvogdlhUyHKWZ46b+CP+pacQOyH0GqjcyyXAPuJsSQAEOQ" +
      "1OnTmQ2OWPhTksRIQ9+sfknO9bYD51T+8pHvVNWvrXHhF1rs8Gde89DSM4rbGOhKMayKNtsAe7xBE0M4CRfMzn65vSA8Pwf0" +
      "w7opS362r829tGPi/ombbf6MhVaQloyzNhsp2ZuYhn1ULWkZVe6OUdGVmFY=",
    10:
      "1rrLFZL4sj94bSIMWUfsacOhOyBIit6pwwPwS8Hisuq/JmZtcnoAq1unglKea/9jOG0MDEm44vv1Wyb8p16C4h1/MbudQYqZ" +
      "WQ0tRS3zmBZY0pjnWIH0DGqYHQPIqj3tqNRLjkXUn71vZnO4F5obsE8UrBVlmmlAOVabfodk113BGbanfWUdBctZ9zCZ/IGN" +
      "YQ7YmEwqZLeeLQFDIg==",
    11:
      "54ZW/2qHhLY1K9FjnvM+1LEYI3uD/z1c+RWSeqwfd/vZlIwXHZDp1a1nTFmiyfFNNoEyEvseqmWku5Uf+a+8lo8fUYugav9L" +
      "LTZNVb7/Q0xel2XVF/7Lzzrl7SyYvkllCrIwl+vg9jh+3FpWOQiWkt3lUqioPMpndxpCqCKdZ96Bf4DYZZo8SNraVifLeg15" +
      "jYzco7P+tmai4CU02lp7JW2kzk5IF/b/UtBSvvKKrIc/9+S/NeNUX8Zy2QXFi1+kFZbb250msoDywJGfzuYJqXRpA969OXIL" +
      "xwnIFl1Z1sI2R1kVr+qRLVtQ9423Vhml3ISj8zFRR3jbQJqokrm3dM8NYIBegtUapVv8ZlX+BTF5ycmHQlFvBUZWdysiEIgN" +
      "DCEyQHvuAxkmBM0WSKQl5zvqxVdvn+UkL5objb9s2AwM",
    12:
      "UpoXaSfyfLFeAWfImFepbZ4IXQhMabaTZTEP2fFJ8PPkgNKjTQLF0eOXLuxjyGWgrWfp0DeRfSLBfPM7FcJ3/1yVnCzBYPoi" +
      "wH/6cKmSqPj0Xcs7Y5aWtww1ExbKlZZA42tiq2sxL+AC+WSzMswAt1hv5zej1LpzXNrPLbOudolXauKjwtJEjCJ1JljyQ5w1" +
      "WsXrvo7sRFVnL4z/mxZy0cXYtrd365oOjEpfX4DPXzWyDimE",
    13:
      "dES2V6x4ZVmtvAi9sSqUXU8w4w+u66Nt+ND3IbBdFlM68if3rUfq73ndlDAAO4kESW1ym8+0GWQAvN7P2G2faZnTeXa1qqps" +
      "9JCEeYZIavDTQpK59DkinvOg99tns9kLnolZiserwZaMX6qrNS8x8XnDv/SxLs0P9IIsfO0sDvHRcoxdi8+zsKcOXLSSBdXn" +
      "Pp7biu8Sj/YoGX8lABGEWhJC/XcRY6uduqF1MLuYwcRJ5bV1IRJsbN28AF62tcHotxDeLr2IYcKoAcHiczTfNjCUmyz5q0dh" +
      "Bljlq1GZ+y9R3p3lKXu9fjLDVjliktP5PyzaglrH75vIgi6U7aCPKocMMEcCU5AbUixkm99gLTy71DDimM0BwBCB6MfO8xD6" +
      "lEA5KggNzse9oIznMhi8zHTxl/8MMdtFlz4wgh+7OpZIiwE+cXOeMA/d3Ra+AOIIDLbuCn+ng3oaBtV371OB4xmbgf6JmSLd" +
      "cmM+ljnV4idm9KIxClDzniAJQXaukFZYvXFEmP5U9eQOaG2w3lCe5YfCBFIN",
    14:
      "zOpByeiatp2fRTc2iejcFnIMqXfY5yyd/U73d4IBUV+6aSoHJI0TJ+ICqsVN4S12bD5nxjvVPHFJIhIAQPeOXn6XJdXFWyfu" +
      "1EDwaTylXfP1FOIG3CWyvp79FAWfZEn2p7BRodxTOag93Ix7eLCgPQ0ItN5iP9HA3EdcWVUWFhBh+TqBh2xoxLVhzyYOKo/F" +
      "oG07X2e4qq6CTFYZIpJMtMsyXFUEZiB2GJrW+sA=",
    15:
      "Sal5bnYXm8+32BHVJPMZsNohHrHSG371Q36KAore2V8EPVQtzodDpnFy4NFSc1jZxYtlnD8n91QEgB/Z/7+D+2Zd1eV+iLR9" +
      "EQngnuuqvhwMY80S0vrtCzi4XkEtpNWfP0S9ZwQzGSh/CoFHIh1S/4O7AE532gsJGz/+mZZJ6Ij9jWVsMDhOORUYYyJt18ba" +
      "BZe/t1L5AjG4PiHcnomXPJiT",
    16:
      "u+iVLqIV4TRKu+9sE/HYwefS1fuyQdCnbL/o9aGhsVxvm6WKgageF5GpbGCEeCTiKmLzHWxiMsl8fzWCcOZsg2nMnJfvgfGB" +
      "xhynL6a1m3XAh6YppXHLaPjaFPTmFfu/tBsWtBrYKQhtgX5wwJ46ScWQRFx0tdFpNW2lmYGMzASl1hmab4ieEcLx51hMIZaN" +
      "3zI0xYu7cTn3NQnFl8qXAlePQpg=",
    17:
      "BH44/cCUzGZuqY9BMx7JJwCs43K/iH6fmK1ZwPIIxlRJSesslcTQinEZsibhJQf28pYoUCwn9burcOvClDOhBad8bMs8LZ94" +
      "NH+ZajyPRHs6vrUgwWQRvMZE0On6tPxFe0txAx26qd08pJOdsbymGVPUws/dw9PV0fZo3UqUTOxwgJw73318n7oRdqRpa3k4" +
      "nmhFFqWmB8EpcgxFG48aPv/MZrxcUA45P2yfHxIJ3uXQj4KhdINtuw9UXMQY/8ideVGVTv2bXpVpNPIO9ZnUgwrL/OQYQAS8" +
      "AGPFBHCHDBB43FGdeOeQgxwN9fF0oMu5odcjm5KMiVV8gWZiHI4GMrCHj1jqUGvVN2ZX6koyHT5mKKw=",
    18:
      "z77Cjm8LxT4Nb7GBOBDcS/p//G/TRpY308K7cMrIitsRDHVkuEkzuY2S5g4y7kPcDRPNF4XwrrJBa435gUJrESSuxAvUC0gz" +
      "Wm/V4dFPuAyr3LU2cYi2+l6f3Oirx4mlHt/cbTfwR4qGezkc1x7p3a1WudH46oVfOmVwIRK5W6XPY6xiKPxKVgpQDNnhawpc" +
      "P8NOsQazzgdec47f0pVuuXMBvPQMf6eQa/MVHRtxETM9+c64QYdnipE1fyEqhiyA0HMdOKYtBbaUiH4CuWu5ZtlgUNbVMl6k" +
      "c8StU9kewIWMAC3zBU71QeCRVKaCyMrkP05+3Ci8GQLVZRQ4ovAGffneKLCXtpiR4xz66uPSj/XNfeoR/IWkR65A/f6iMFhN" +
      "8ZsMwtWCAPAp7sAY7QUO6B6M0Korg7AQUzrnRFupGu8avE86p+MfMPaQ0mMxyEGlbn8s3oEjvF09qj9ke2Plmk08WBvZ3Ick" +
      "HPBh49RviURKEM4=",
    19:
      "eItHax5ukvsPHcgT6NkglBsQcXAET6eLRWqxjXhEKxTBusov1zKNC7wPo6LinzGMGFc1xQ1xcfQd08+shG5F2af+WyoUpLgu" +
      "qwLANjG1fg2y8CauOH2uhUx5q/Pp0n7RFSWgWcqDMiVKpYhDTRF4Ja1na5pXVHOkELtMbD1TQ0t9MxqXgTAGRManh/bn3h0N" +
      "J4tl0JcBmDTA4LQwLMoqHbnZiediywI18S9v8Q==",
    20:
      "Br/LmAwF/1mhL5fppfs/KzGvWALHVc32HZTTuXlv49X7raHIYHaUg3u4XcF+1SOi/tn5W/HfSi5C+erGA6ZPur6fUNU2zfkF" +
      "SAgZqcj+wnIfZOnJucdHxzvE+JB0PkgJyvZjZPuHx0Q3l7SvIHZEJ85yaAfTEU5axOzImg4DbsRCnKIRluI9tIIpeFxrXhgy" +
      "4/GIMsOW3laDeM2AUPk5U0NXuVE1TN6xf8pFGygt5xddGchOlfOQTTkrqynH4yI2S7opUnxGJTpfUJ5DRCLI6/22geB4wMAA" +
      "07IlPSwt3EoCv888aKotEBFD7SgbnULD8pgjZUIdSZI627n036mrR1+JdJL1/8mYy0GbOqHkqnFxT1D/Uon1xJpPQqz0Epoo" +
      "wk88rHn2aGpVRuYMICG9FBHVYpczFdeYzv52ERcXDQ7+N/dz0HSfj54y5e+gtywiuwXZmmbTyzkUcz8DDwkEkTYiOn1I/q/W" +
      "4MNh",
    21:
      "ePYkdzKiMcKrWetPGUyksXNveraDRv9jal/x+1VO3gjnzYvzzMVLK39MnCb3YykKbjep3v4GuqIaQo3UE5pfWDfGm23TgqGv" +
      "ySWBVwHVmCWdD0Th1zNZDgtNbjtwAJI4Nyce7HkeW05o5LjTdhEP/ldb7fj4tFLqcyIyKjh9v/tnLWh1WoW/XRSTECchotAI" +
      "pfenBjvW5/9SmSZHJ/6D0FS//ndv6AfAr+7ot3ylYk3y8YRKtP4xPyQdrNvSdwfxWoUy+LzfA9IqtODrNpZVMyn9Yjb5ShDm" +
      "FKJpyFLkvx9h7kAABiGof4Bs/4Xxb1v4J+FRnpWzoo9Cz9hL+g61FbN+vm0kQS+HWltoLsqKbJiHAuAphQZXqLubSteSRw==",
    22:
      "WRuG4Lq7SJnA96hT5hXLEEs0rt3Tczb8zfISCMCuIpS/8J2InzjVmWla2MWjPAywmJlr2Q9BYvWy7sr8M2/2LPCOefq3+ZM8" +
      "+RfXQTrvI0m6naPo1aYdXHvHNympWoAqwtJHHQeoZUFSKf9MB+cXflEVeRCkVFgC0FQWpwXlG777FjqdOpIxNncGO5IkL9Ig" +
      "8KtuvfZ4nIvbJsZzn5Su8PIOYG235LugjOMg6Nqx6f4MOxgHpZW6V6Bh9uR4GpKQdTn/0CvvXnyx1pdUJ3NUu8DpL6Z4Sp9t" +
      "upP8YmTE769Q4MVQOBPfs6Nd+kWlwp/BWQdQtiC0fazmOhgYFoDCwTkZX83sp3k3GzvoMOWSXhP509VJULl5Nt6ipBePZ3Ai" +
      "wgoxS8Ll0bme4opFOh8Br3T4J9jy6fqqr8VNZmTb0fe51QpQijYt1Dp5zTISWftYZhvZu0cir+NR4cyKnC2tVBdT795AMp+e" +
      "QKHgFmuX4UYVHSFN37bgZFyP",
    23:
      "nGYD3M+ON5U/yngEyJe2Fqm8OBCbCzb8waXKVwvzVi5gRh523GYYyMXUEjR+vBQ3LhTx6KXCWv9oxmIrY+nzwShuzJTqei3J" +
      "fOq0CzHwkc2JBuS/g2+NNx/wV8amqFaN8fgMczSHKrnpGpV6JH6OpdjiCoMJnoGNlrf4TJ8HnH2g0fzOrFi7a/oTxhJO57rs" +
      "sNwfzGvoYvg08cPbBaFE4biaKiuRA+38OIdTA6mpAlBtBjUPupKZ5IrifUnYoDYHVw7CHeo8uHBJH1pvwN1nZfImaw08r93n" +
      "b3kGizcfUNJtyryXxD3jufNN2cYDbWSq6WzX8UgUTVhWvrqeSuN4UQQ7w/VirldSCHfzJ1iegLygsratpW5qDdnPlt48Ueo=",
    24:
      "IIlOMWfb5oJ5jtmfg9TD7Z6sLrItNt+aYa5uGxQYnsJ7OAQq9EBGCzOuq3iLZQCrjtUs9ZE8KCj1CZz3ryxR4WWBrH8mZ/Z+" +
      "Ncj4hsU3tlcInFBlzUEZInSqbwDu40J59XZbM7oMdqnt4IaXp01RhYXIxEmDL6U67AzNpVVZ+zEw74wLJD8h5PgQRfnxRT9m" +
      "F3B1wDy4qkHtH4V3GT7bkzR196hXCd5zQf+u6aUHcQrC99MaDBQ0voWnswg5+/+vqAlaxxarnHg/dziyfMFEvJMJyQvPu1+T" +
      "LCE5mDkCJ/qForBJ6cUimyz8VC958PZm3byl/2BD2N/gjiouJJHvg8SepLXO0vrdRq0NiVCuPRJCiKRsm5vFDGKfesPxvO1o" +
      "+kQelWV1SHVTWChICOlimDjIDrEx7WDzBNiFoXytyCEMBFHBRp9FmkzsiHvbTIzu08m49ggf+QLsMEMMfFt7qi7wwZVr+LoF" +
      "UdjB4/eoYqiz2lLekRVGlWzpOJckFlMAtddTN61w2ySwVDc8UfkBoNOxCKuRvd+1jdy7wmmu2nBUbAldAupRAnGgqQWEJRTD" +
      "jNInOsQeIhDQQXoQJEm3uZf4fUdp8v9KRHp3TC6fuKS0zovnOjPfLrhvsmcs",
  },
};
