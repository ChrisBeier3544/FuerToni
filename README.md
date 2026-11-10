# Toni-Adeventskalender ❤️

Ein romantischer Online-Adventskalender mit 24 Türchen. Jedes Türchen lässt sich
erst an seinem Tag öffnen (1. Türchen am 01.12., 2. am 02.12. usw.), jeweils um
4:00 Uhr nachts deutscher Zeit.

## Inhalte eintragen

Alles, was hinter den Türchen steckt, steht in **`inhalte.js`**. Pro Tag:

| Feld        | Bedeutung                                                    |
|-------------|--------------------------------------------------------------|
| `titel`     | Überschrift im geöffneten Türchen                            |
| `text`      | Deine Nachricht (neue Zeile mit `\n`)                        |
| `briefzahl` | Zahl für den Weihnachtsbrief                                 |
| `paeckchen` | Nummer des Extra-Päckchens – oder `""`, wenn es keins gibt   |
| `konfetti`  | `true` = Konfetti regnet über die Seite (z. B. Geburtstage)  |
| `geschenkregen` | `true` = langsam fallende Geschenke 🎁 (Heiligabend)   |
| `status`    | optional: eigener Text oben auf der Seite an diesem Tag      |
| `bild`      | optional: Foto, z. B. `"bilder/tag01.jpg"`                   |
| `hinweis`   | optional: zusätzlicher Hinweis-Kasten                        |

Fotos legst du in den Ordner **`bilder/`**. Tipp: Fotos vorher auf ca. 1200 px
Breite verkleinern, dann lädt die Seite auf dem Handy schneller.

Ganz oben in `inhalte.js` stehen außerdem das Jahr, der Titel und der Untertitel.

## Effekte

- **Umschlag zum Einstieg:** Beim ersten Besuch pro Sitzung öffnet sie einen versiegelten Brief.
- **Türchen als Päckchen:** Geschenkpapier, Band, Schleife und Anhänger mit der Zahl.
- **Türchen wird zum Brief:** Der Inhalt fliegt aus dem Türchen in die Mitte.
- **Lichterkette:** Für jedes geöffnete Türchen leuchtet ein Birnchen mehr.
- **Schnee und Herzen:** weht beim Scrollen und Neigen des Handys mit.
- **Winterlandschaft** mit leuchtenden Fenstern unten auf der Seite.
- **Tageszeiten** (deutsche Zeit) mit eigener Optik und Gruß über dem Titel:
  morgens 6:00 bis 9:00 (Sonnenaufgang), vormittags 9:00 bis 12:00 (frisch und hell),
  mittags 12:00 bis 14:00 (am hellsten), nachmittags 14:00 bis 16:30 (goldene Stunde),
  abends 16:30 bis 22:00 (gemütlich dunkel), nachts 22:00 bis 6:00 (Mond und Sterne).
  Lokal testen mit z. B. `&zeit=morgen` oder einer Uhrzeit wie `&zeit=03:59`.
- **Finale:** Sind alle 24 Türchen offen, fliegen alle Fotos zu einem Herz zusammen.
  Danach lässt es sich über „♥️ Unser Herz“ jederzeit wieder ansehen.

## Persönliche Extras

- **Zusammen-Zähler** unter der Statuszeile (`zusammenSeit` und `kennenSeit` in `inhalte.js`).
  Am 21.12. erscheint stattdessen: „Heute vor genau einem Jahr haben wir uns kennengelernt“.
- **Sprachnachrichten** an Tag 1, 13 und 24: Lege die Dateien als `audio/tag01.m4a`,
  `audio/tag13.m4a` und `audio/tag24.m4a` ab. Fehlt eine Datei, wird nichts angezeigt.
- **Rubbelfeld** an Tag 6, 15 und 21 (`rubbeln: true`): Text und Zahlen liegen unter Gold.
- **Capy-Begleiter** läuft durch die Winterlandschaft und sagt beim Antippen etwas Süßes.
  Alle 3 Tage trägt es ein neues Outfit: Bommelmütze und Schal (1. bis 3.), Nikolausmütze (4. bis 6.),
  Doktorhut und Brille (7. bis 9.), Ohrenschützer (10. bis 12.), Partyhut (13. bis 15.),
  Rentiergeweih (16. bis 18.), Lichterkette (19. bis 21.), Krone und Schleife (22. bis 24.).
- **Schneekugel:** Handy schütteln für ein Schneegestöber mit Herzen.
- **Quiz vor den Easter Eggs** (`quiz` bei `eastereggs`). Leere Antwort = kein Quiz.
- **Lichtershow** an Heiligabend, bevor Türchen 24 aufgeht.
- **Rückblick** ab dem 25.12.: „📖 Unser Dezember“ mit allen 24 Türchen zum Nachlesen.
- **Als App:** Manifest und Capybara-Icon, damit sie die Seite auf den Homescreen legen kann.

## Easter Eggs

Sechs versteckte Funde (fünf Gutscheine und die Capy Crew). Einstellungen unter
`eastereggs` in `inhalte.js`. Nach dem Fund verschwindet das Easter Egg und ist nur
noch über „🎟️ Meine Gutscheine“ zu finden.

| Emblem       | Fund                        | Versteck                                  | Ab     |
|--------------|-----------------------------|-------------------------------------------|--------|
| Matcha Latte | Iced Matcha Latte           | klein im geöffneten Türchen 5             | 5.12.  |
| Acai Bowl    | Acai Bowl Date              | hinter den Polaroids oben (lugt hervor)   | 7.12.  |
| Capybara     | Geheime Capy Party (Foto)   | hinter Türchen 10, wenn es offen ist      | 10.12. |
| Badeente     | Massage New Soul Studio     | klein im geöffneten Türchen 16            | 16.12. |
| Blumen       | Date deiner Wahl            | klein unten neben der Fußzeile            | 19.12. |
| Häuschen     | Dinner im Restaurant Heimat | klein im geöffneten Türchen 24            | 24.12. |

## Lokal ansehen und testen

```bash
python3 -m http.server 8000
```

Dann im Browser öffnen:

- `http://localhost:8000/` – zeigt den Kalender mit dem echten Datum
- `http://localhost:8000/?testdatum=2026-12-05` – tut so, als wäre der 5. Dezember
- `http://localhost:8000/?testdatum=2026-12-05&zeit=nacht` – dasselbe nachts (auch morgen, vormittag, mittag, nachmittag, abend)

Der Parameter `?testdatum=` funktioniert **nur lokal** (localhost) und wird auf der
echten Website ignoriert.

## Veröffentlichen mit GitHub Pages

1. Auf GitHub im Repository auf **Settings → Pages** gehen.
2. Bei *Source* „Deploy from a branch“ wählen, den Branch (z. B. `main`) und den
   Ordner `/ (root)` auswählen und speichern.
3. Nach ca. 1 Minute ist die Seite unter
   `https://<dein-github-name>.github.io/Toni-Adeventskalender/` erreichbar.

## Wie sicher ist die Sperre?

- Das Datum wird nach **deutscher Zeit** (Europe/Berlin) berechnet.
- Die Uhrzeit kommt **vom Server**, nicht vom Handy. Uhr vorstellen bringt also nichts.
- Nur wenn das Gerät offline ist, wird ersatzweise die Geräteuhr benutzt.
- Wer sich mit Webentwicklung auskennt, könnte die Texte in `inhalte.js` bzw. die
  Bilder im Ordner `bilder/` direkt aufrufen. Ist das Repository öffentlich, sind die
  Inhalte auch auf GitHub sichtbar. Für eine echte Sperre bräuchte man einen Server.
