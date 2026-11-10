# Toni-Adeventskalender ❤️

Ein romantischer Online-Adventskalender mit 24 Türchen. Jedes Türchen lässt sich
erst an seinem Tag öffnen (1. Türchen am 01.12., 2. am 02.12. usw., deutsche Zeit).

## Inhalte eintragen

Alles, was hinter den Türchen steckt, steht in **`inhalte.js`**. Pro Tag:

| Feld      | Bedeutung                                                     |
|-----------|---------------------------------------------------------------|
| `titel`   | Überschrift im geöffneten Türchen                             |
| `text`    | Deine Nachricht (neue Zeile mit `\n`)                         |
| `bild`    | Pfad zu einem Foto, z. B. `"bilder/tag01.jpg"` – oder `""`    |
| `hinweis` | Hinweis aufs echte Türchen – oder `""` für keinen Hinweis     |

Fotos legst du in den Ordner **`bilder/`**. Tipp: Fotos vorher auf ca. 1200 px
Breite verkleinern, dann lädt die Seite auf dem Handy schneller.

Ganz oben in `inhalte.js` stehen außerdem das Jahr, der Titel und der Untertitel.

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
