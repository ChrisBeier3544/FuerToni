# Toni-Adeventskalender ❤️

Ein romantischer Online-Adventskalender mit 24 Türchen. Jedes Türchen lässt sich
erst an seinem Tag öffnen (1. Türchen am 01.12., 2. am 02.12. usw., deutsche Zeit).

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
