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

## Countdown bis zum Geburtstag

Bis zum 26.11. um 0:00 Uhr ist der Umschlag verschlossen und zeigt einen Countdown.
Von 0:00 bis 0:30 Uhr erscheinen Konfetti, ein Geburtstagsgruß und ein zweiter Countdown.
Ab 0:30 Uhr lässt sich der Umschlag öffnen. Am Geburtstag steht im Brief ein eigener Gruß.
Einstellungen: `countdownBis`, `briefAb` und `geburtstag` in `inhalte.js`.
Lokal testen mit z. B. `?testdatum=2026-11-25&zeit=23:59`.

## Capybara-Specials vor dem Geburtstag

Vom 15. bis 25. November läuft auf dem Countdown-Bildschirm jeden Tag eine andere Capybara-Szene
(`specials.js`): Ballonfahrt, Gartenparty, Glühweinstand, Onsen, Rodelrennen, Matcha-Bad,
Feuerwerk, Schneeballschlacht, Polonaise, Plätzchenbacken und am Vorabend der Geburtstagskuchen.
Sie startet beim Öffnen automatisch und lässt sich über „🐹 Capy-Special nochmal ansehen“ wiederholen.

## Vogel

`vogel.js`: Ein kleines Rotkehlchen sitzt auf der Karte „Dein Tag“ (in der Countdown-Phase auf dem Countdown)
und sagt 2 Sekunden nach dem Öffnen des Umschlags für 5 Sekunden den Tagesgruß. Antippen wiederholt ihn.
Am Tag vor dem ersten Easter Egg gibt es zusätzlich einen Hinweis auf die versteckten Geheimnisse.
10 Sekunden nach dem Sprechen fliegt es auf einer von 10 Routen aus dem Bild und landet auf einem
von 5 Plätzen (Kalender: Karte, Polaroid, Lichterkette, Adventskranz bzw. „Unsere Momente“, Regal;
Countdown: Countdown, Umschlag links und rechts, Siegel, Hinweistext). Am 26.11., 21.12. und 24.12.
kommt ein Rotkehlchen-Weibchen mit Schleife dazu, setzt sich direkt neben das Männchen und folgt ihm.
Erster Abflug 10 Sekunden nach dem Gruß, danach jeweils 15 Sekunden nach der Landung.

## Herz im Titel

`herz.js`: Antippen des ♥️ in „Für Toni“ lässt es in viele kleine Herzen zerspringen. Sie fliegen
7 Sekunden über den Bildschirm und setzen sich dann Stück für Stück wieder zum Herz zusammen.
Das heutige Türchen wird nicht mehr angescrollt und hat nur eine feine goldene Umrandung.

## Himmel

`himmel.js`: Morgens geht die Sonne zwischen 6 und 9 Uhr auf. Tagsüber zieht sie über den Himmel,
je nach Tag sonnig, leicht bewölkt oder diesig (am Geburtstag und an Heiligabend immer sonnig).
Abends und nachts zeigt der Mond die echte Mondphase des Tages, nachts fliegen gelegentlich
Sternschnuppen. Gilt für den Countdown-Bildschirm und den Kalender.

## Vorfreude vom 26. bis 30. November

- **26.11. Geburtstagsmodus:** Ballons am Rand, alle Fenster-Capys mit Partyhut,
  Gruß „Happy Birthday“, das Capy unten trägt eine Krone.
- **Die Capy Crew baut den Kalender auf** (`aufbau.js`), jeweils etwa eine Minute,
  direkt nach dem Schließen der Postkarte:
  - Bis zum 26.11. ist das Regal leer (mit Schild).
  - 27.11.: Die Capys tragen alle 24 Päckchen einzeln herein und bringen sie an.
  - 28.11.: Schnee auf jedes Brett, Schleifen an jedes Päckchen, Lichterkette, Tannenzweige.
  - 29.11.: Adventskranz und erste Kerze (`vorfreude.js`).
  - 30.11.: Großputz: Spinnweben wegfegen, jedes Türchen blank wischen, Lichterkette und Zweige polieren.
  Fertige Schritte werden gemerkt und nicht wiederholt.
- **Adventskranz** ab dem 1. Advent (29.11.), am 6., 13. und 20.12. brennt je eine Kerze mehr.
- **Postkarte:** Jeden Tag bringt ein Capy-Postbote eine Karte mit Foto (`postkarten` in `inhalte.js`).
  Sie kommt einmal automatisch, danach über „📮 Heutige Postkarte“.
- **Capy-Spiel** ab dem 26.11. (`spiel.js`): Schneeflocken, Herzen und Sterne fangen, Eiswürfeln
  ausweichen. Mit Kombos, Leveln und gespeichertem Rekord.

## Kopfbereich

Oben stehen Datum mit Wochentag, der Gruß zur Tageszeit, der Titel und ein Countdown
(„Noch 9 Überraschungen bis Weihnachten“). Darunter die Polaroids und die Karte „Dein Tag“
mit Statuszeile, Zähler und den Knöpfen für Gutscheine, Foto-Herz und Rückblick.

## Kalender-Regal

Die 24 Päckchen stehen auf einem Holzregal mit verschneiten Brettern. Türchen 1 und 24 sind groß,
6, 13 und 21 breit, 4, 17 und 20 hoch (`PAECKCHEN_FORM` in `app.js`). Das heutige Türchen trägt
das Band „Heute ✨“, und nach dem Umschlag scrollt die Seite dorthin. Unter dem Fotostreifen zeigt
ein Balken, wie weit man gewischt hat. In der Fußzeile kuscheln zwei Capybaras unter einer Laterne.

## Feine Details

- Geöffnete Türchen zeigen die aufgeklappte Papierseite, eine kleine Illustration und einen Stempel mit dem Datum.
- Noch gesperrte Türchen haben einen Frostrand, die Zahlenanhänger hängen an einer Kordel und schaukeln.
- Tannenzweige mit Beeren und schwingenden Kugeln oben in den Ecken, Washi-Tape an den Polaroids.
- Rauch aus den Schornsteinen der Winterlandschaft.
- Der Brief im Türchen hat Briefpapier-Look, ein Wachssiegel mit der Tageszahl und die Unterschrift
  aus `unterschrift` in `inhalte.js`.
- Beim Tippen auf die Seite steigen kleine Herzen auf.

## Persönliche Extras

- **Zusammen-Zähler** unter der Statuszeile (`zusammenSeit` und `kennenSeit` in `inhalte.js`).
  Am 21.12. erscheint stattdessen: „Heute vor genau einem Jahr haben wir uns kennengelernt“.
- **Sprachnachrichten** an Tag 1, 13 und 24: Lege die Dateien als `audio/tag01.m4a`,
  `audio/tag13.m4a` und `audio/tag24.m4a` ab. Fehlt eine Datei, wird nichts angezeigt.
- **Rubbelfeld** an Tag 6, 15 und 21 (`rubbeln: true`): Text und Zahlen liegen unter Gold.
- **Capy-Begleiter** läuft gemütlich einmal durchs Bild, ist dann 7 Sekunden weg und kommt
  von der anderen Seite zurück. Beim Antippen sagt es etwas Süßes.
  Alle 3 Tage trägt es ein neues Outfit: Bommelmütze und Schal (1. bis 3.), Nikolausmütze (4. bis 6.),
  Doktorhut und Brille (7. bis 9.), Ohrenschützer (10. bis 12.), Partyhut (13. bis 15.),
  Rentiergeweih (16. bis 18.), Lichterkette (19. bis 21.), Krone und Schleife (22. bis 24.).
- **Capybara-Fenster:** In der Winterlandschaft schauen Capybaras mit verschiedenen
  Accessoires aus den Fenstern. Am 1.12. eins, an Heiligabend fast alle.
- **Häuser antippen:** In den leeren Fenstern schauen 4 Sekunden lang Capybaras heraus.
- **Bäume antippen:** Der Baum wackelt, der Schnee fällt ab und wächst in 30 Sekunden nach.
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

## Testversion (vor dem 1. Dezember löschen!)

Im Ordner `vorschau-poyjy2er/` liegt eine Testversion mit Testleiste, die alle Tage
und Türchen freischaltet. Sie nutzt die Fotos und Inhalte der echten Seite mit.
**Diesen Ordner vor dem 1. Dezember löschen**, sonst könnte Toni darüber alles vorab sehen.
