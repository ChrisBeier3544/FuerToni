# Für Toni ♥️

Eine kleine Webseite für einen ganz besonderen Menschen.

## Aufbau

| Datei / Ordner      | Inhalt                                                        |
|---------------------|---------------------------------------------------------------|
| `index.html`        | die Seite                                                     |
| `inhalte.js`        | alle Inhalte (teilweise verschlüsselt)                        |
| `*.js`, `style.css` | Quelltext der einzelnen Teile                                 |
| `kalender.min.js`, `style.min.css` | gebündelte, verkleinerte Fassung, die die Seite lädt |
| `bilder/`, `audio/`, `icons/` | Fotos, Sprachnachrichten, Symbole                   |
| `werkzeug/bauen.js` | baut die gebündelten Dateien neu                              |

## Nach einer Änderung neu bauen

```
node werkzeug/bauen.js
```

Prüfen, ob alles aktuell ist: `node werkzeug/bauen.js --pruefen`

## Veröffentlichung

Die Seite läuft über GitHub Pages (Zweig `main`, Ordner `/`) unter
https://chrisbeier3544.github.io/FuerToni/
