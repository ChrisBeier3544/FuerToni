/*
 * Baut aus den einzelnen Quelldateien je eine verkleinerte Datei:
 *   kalender.min.js  (alle Programmteile, ohne inhalte.js)
 *   style.min.css
 *   vorschau-poyjy2er/kalender.min.js (Testversion, falls vorhanden)
 * und trägt sie mit Versionsnummer in index.html ein.
 *
 * Aufruf im Hauptordner:  node werkzeug/bauen.js
 * Nur prüfen, ob alles aktuell ist:  node werkzeug/bauen.js --pruefen
 * Braucht esbuild (npx lädt es bei Bedarf).
 */
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { execFileSync } = require("child_process");

const WURZEL = path.join(__dirname, "..");
const TEILE = ["app.js", "specials.js", "himmel.js", "vogel.js", "herz.js", "aufbau.js", "vorfreude.js", "spiel.js",
  "interaktiv.js", "neujahr.js", "feinschliff.js", "entdecken.js", "schneetag.js", "album.js"];
const pruefen = process.argv.includes("--pruefen");
const esbuild = process.env.ESBUILD || "npx";
const esArgs = process.env.ESBUILD ? [] : ["--yes", "esbuild@0.24.0"];

function verkleinere(code, art) {
  return execFileSync(esbuild, [...esArgs, "--minify", "--loader=" + art, "--target=es2020", "--legal-comments=none"], { input: code, maxBuffer: 64 << 20 }).toString();
}
function buendel(appDatei) {
  // jede Datei für sich absichern: ein Fehler in einem Teil hält die anderen nicht auf
  return TEILE.map((d) => {
    const quelle = fs.readFileSync(path.join(WURZEL, d === "app.js" ? appDatei : d), "utf8");
    return "/* " + d + " */\ntry {\n" + quelle + "\n} catch (fehler) { console.error(" + JSON.stringify(d) + ", fehler); }\n";
  }).join("\n");
}
const kurz = (s) => crypto.createHash("sha256").update(s).digest("hex").slice(0, 10);

const ziele = [
  { html: "index.html", app: "app.js", js: "kalender.min.js", css: "style.min.css", cssPfad: "style.min.css", jsPfad: "kalender.min.js" },
];
if (fs.existsSync(path.join(WURZEL, "vorschau-poyjy2er/app.js"))) {
  ziele.push({ html: "vorschau-poyjy2er/index.html", app: "vorschau-poyjy2er/app.js", js: "vorschau-poyjy2er/kalender.min.js", css: "style.min.css", cssPfad: "style.min.css", jsPfad: "vorschau-poyjy2er/kalender.min.js" });
}

const css = verkleinere(fs.readFileSync(path.join(WURZEL, "style.css"), "utf8"), "css");
let veraltet = [];
for (const z of ziele) {
  const js = verkleinere(buendel(z.app), "js");
  for (const [datei, inhalt] of [[z.js, js], [z.css, css]]) {
    const voll = path.join(WURZEL, datei);
    const alt = fs.existsSync(voll) ? fs.readFileSync(voll, "utf8") : "";
    if (alt !== inhalt) { veraltet.push(datei); if (!pruefen) fs.writeFileSync(voll, inhalt); }
  }
  // Seite auf die verkleinerten Dateien umstellen
  const htmlPfad = path.join(WURZEL, z.html);
  let seite = fs.readFileSync(htmlPfad, "utf8");
  const alt = seite;
  seite = seite.replace(/<link rel="stylesheet" href="style(\.min)?\.css(\?v=[0-9a-f]+)?">/, '<link rel="stylesheet" href="' + z.cssPfad + "?v=" + kurz(css) + '">');
  // alle einzelnen Programmdateien durch das Bündel ersetzen
  const einzeln = new RegExp('\\n\\s*<script src="(?:vorschau-poyjy2er/)?(?:' + TEILE.map((t) => t.replace(".", "\\.")).join("|") + ')"></script>', "g");
  const bundleTag = '\n  <script src="' + z.jsPfad + "?v=" + kurz(js) + '"></script>';
  if (einzeln.test(seite)) {
    let erster = true;
    seite = seite.replace(einzeln, (m) => (erster ? ((erster = false), bundleTag) : ""));
  }
  seite = seite.replace(/\n\s*<script src="(?:vorschau-poyjy2er\/)?kalender\.min\.js(\?v=[0-9a-f]+)?"><\/script>/, bundleTag);
  if (seite !== alt) { veraltet.push(z.html); if (!pruefen) fs.writeFileSync(htmlPfad, seite); }
}
if (pruefen) {
  if (veraltet.length) { console.error("Nicht aktuell: " + [...new Set(veraltet)].join(", ") + "  (node werkzeug/bauen.js ausführen)"); process.exit(1); }
  console.log("Alles aktuell.");
} else console.log(veraltet.length ? "Neu gebaut: " + [...new Set(veraltet)].join(", ") : "Alles war schon aktuell.");
