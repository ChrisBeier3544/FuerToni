/*
 * ===========================================================
 *  UMSTYLING DER MUNKELVÖGEL
 *  Vier Runden im November (16., 19., 22. und 25.11., je 3 Tage)
 *  und ein letztes Umstyling am 1.12. mit allen Teilen.
 *  Toni wählt im Ankleidezimmer für Kopf, Hals, Augen, Füße
 *  und Extra je eins von drei Teilen aus (oder nichts).
 *  Alle Teile sind in den Koordinaten der Vogelgrafik
 *  (viewBox 0 0 60 60) gezeichnet und wachsen mit ihr mit.
 * ===========================================================
 */
(function () {
  "use strict";

  const ak = window.adventkalender;
  if (!ak || !ak.intro) return;
  const ruhig = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- kleine Zeichenhilfen ---------- */
  // linker Schuh, gespiegelt zum rechten Fuß (linkes Bein endet bei x 21, rechtes bei x 33)
  const paar = (l) => l + '<g transform="matrix(-1 0 0 1 54 0)">' + l + "</g>";
  // linkes Glas, gespiegelt zum rechten Auge (Augen bei x 22 und x 36)
  const glaeser = (l, mitte) => l + '<g transform="matrix(-1 0 0 1 58 0)">' + l + "</g>" + (mitte || "");
  const buegel = (farbe, b) => '<path d="M15.6 27 L10.5 25.4M42.4 27 L47.5 25.4" stroke="' + farbe + '" stroke-width="' + (b || 1.5) + '" stroke-linecap="round" fill="none"/>';
  const herz = (x, y, s, f, extra) => '<path d="M' + x + " " + (y + s * 0.85) + " C" + (x - s * 1.25) + " " + (y - s * 0.05) + " " + (x - s * 0.6) + " " + (y - s * 1.05) + " " + x + " " + (y - s * 0.35) +
    " C" + (x + s * 0.6) + " " + (y - s * 1.05) + " " + (x + s * 1.25) + " " + (y - s * 0.05) + " " + x + " " + (y + s * 0.85) + 'Z" fill="' + f + '"' + (extra || "") + "/>";
  function stern(x, y, r, f, innen, extra) {
    let d = "";
    for (let k = 0; k < 10; k++) {
      const rr = k % 2 ? r * (innen || 0.45) : r, w = (k / 10) * Math.PI * 2 - Math.PI / 2;
      d += (k ? "L" : "M") + (x + Math.cos(w) * rr).toFixed(2) + " " + (y + Math.sin(w) * rr).toFixed(2);
    }
    return '<path d="' + d + 'Z" fill="' + f + '"' + (extra || "") + "/>";
  }
  function flocke(x, y, r, f, b) {
    let d = "";
    for (let k = 0; k < 3; k++) { const w = (k / 3) * Math.PI; d += "M" + (x + Math.cos(w) * r).toFixed(2) + " " + (y + Math.sin(w) * r).toFixed(2) + "L" + (x - Math.cos(w) * r).toFixed(2) + " " + (y - Math.sin(w) * r).toFixed(2); }
    return '<path d="' + d + '" stroke="' + f + '" stroke-width="' + (b || 0.8) + '" stroke-linecap="round"/>';
  }
  function blume(x, y, r, f, mitte) {
    let s = "";
    for (let k = 0; k < 5; k++) { const w = (k / 5) * Math.PI * 2; s += '<circle cx="' + (x + Math.cos(w) * r * 0.62).toFixed(2) + '" cy="' + (y + Math.sin(w) * r * 0.62).toFixed(2) + '" r="' + (r * 0.5).toFixed(2) + '" fill="' + f + '"/>'; }
    return s + '<circle cx="' + x + '" cy="' + y + '" r="' + (r * 0.4).toFixed(2) + '" fill="' + (mitte || "#f3c84b") + '"/>';
  }
  // Perlen oder Kugeln entlang des Halses (Bogen von links nach rechts)
  function kette(n, r, farben, tief, glanz, rand) {
    let s = "";
    const a = { x: 12.5, y: 38.5 }, c = { x: 29.5, y: 38.5 + (tief || 13) }, b = { x: 46.5, y: 38.5 };
    for (let k = 0; k < n; k++) {
      const t = (k + 0.5) / n, x = (1 - t) * (1 - t) * a.x + 2 * (1 - t) * t * c.x + t * t * b.x, y = (1 - t) * (1 - t) * a.y + 2 * (1 - t) * t * c.y + t * t * b.y;
      s += '<circle cx="' + x.toFixed(2) + '" cy="' + y.toFixed(2) + '" r="' + r + '" fill="' + farben[k % farben.length] + '"' + (rand ? ' stroke="' + rand + '" stroke-width=".35"' : "") + "/>";
      if (glanz) s += '<circle cx="' + (x - r * 0.35).toFixed(2) + '" cy="' + (y - r * 0.35).toFixed(2) + '" r="' + (r * 0.32).toFixed(2) + '" fill="#fff" opacity=".8"/>';
    }
    return s;
  }
  // Schal: Band um den Hals und ein Ende, das rechts herunterhängt
  const schal = (f, f2, muster) => '<path d="M10 37.5 Q29 48.5 48 37.5 L48 44 Q29 55 10 44Z" fill="' + f + '"/>' +
    '<path d="M37.5 44.5 L39.5 57 L46 57 L44 43Z" fill="' + f2 + '"/>' + (muster || "");
  const kettchen = (f) => '<path d="M13 38.5 Q29.5 52 46 38.5" fill="none" stroke="' + f + '" stroke-width=".9"/>';
  // Text, der beim Umdrehen des Vogels nicht spiegelverkehrt wird
  const text = (x, y, t, f, g) => '<text class="ankleide-text" x="' + x + '" y="' + y + '" font-size="' + (g || 4.2) + '" font-family="Nunito, sans-serif" font-weight="800" fill="' + f + '" text-anchor="middle">' + t + "</text>";

  /* ---------- Alle Kleidungsstücke ---------- */
  // je Vogel und Kategorie 12 Teile, je 3 pro Runde (Runde 1 bis 4)
  const K = { m: {}, w: {} };
  const teil = (wer, kat, id, name, svg) => { (K[wer][kat] = K[wer][kat] || []).push({ id, name, svg, runde: Math.floor(K[wer][kat].length / 3) + 1 }); };

  /* ===== Munkelvogel: Kopf ===== */
  teil("m", "kopf", "barett", "Baskenmütze",
    '<ellipse cx="27" cy="14.5" rx="15.5" ry="5" fill="#6e1a30" transform="rotate(-10 27 14.5)"/><ellipse cx="25.5" cy="11.8" rx="12" ry="5" fill="#8f2a44" transform="rotate(-10 25.5 11.8)"/>' +
    '<ellipse cx="22" cy="10.5" rx="5" ry="1.6" fill="#b0405c" opacity=".55" transform="rotate(-12 22 10.5)"/><path d="M26.5 7.2 L27.6 4.4" stroke="#4e1222" stroke-width="2" stroke-linecap="round"/>');
  teil("m", "kopf", "schiebermuetze", "Schiebermütze",
    '<path d="M13 17.5 Q14 6.5 28 6 Q41 6 42.5 15.5 Z" fill="#8a6a4a"/><path d="M33.5 15.2 Q45 13.5 50.5 17.5 Q42.5 19.6 33 18.4Z" fill="#6b4f35"/>' +
    '<path d="M16.5 10.5 H40.5 M14.5 14 H42 M21 6.6 V17.4 M28 6 V17.4 M35 6.5 V17" stroke="#5c4330" stroke-width=".7" opacity=".7"/><circle cx="28" cy="6.4" r="1.4" fill="#6b4f35"/>');
  teil("m", "kopf", "strickmuetze", "Strickmütze",
    '<path d="M13 18 Q13.5 4 28 4 Q42.5 4 43 18Z" fill="#d9a33a"/><path d="M17 8 Q28 5 39 8 M15 12 Q28 9 41 12" stroke="#c18a27" stroke-width=".9" fill="none"/>' +
    '<rect x="11.5" y="14.5" width="33" height="6.5" rx="3.2" fill="#b8852a"/><path d="M15 15v5.5M18.5 15v5.5M22 15v5.5M25.5 15v5.5M29 15v5.5M32.5 15v5.5M36 15v5.5M39.5 15v5.5M43 15.5v4.5" stroke="#9c6f1f" stroke-width=".9"/>' +
    '<circle cx="28" cy="3" r="4.8" fill="#f0c860"/><circle cx="26.5" cy="1.8" r="1.6" fill="#fbe39b"/>');
  teil("m", "kopf", "ohrenschuetzer", "Ohrenschützer",
    '<path d="M10 27 Q9 6 28.5 6 Q48 6 47.5 27" fill="none" stroke="#2f5d9e" stroke-width="2.4"/>' +
    '<circle cx="9.5" cy="27.5" r="5.6" fill="#7cc4f0"/><circle cx="48" cy="27.5" r="5.6" fill="#7cc4f0"/><circle cx="8.5" cy="26.5" r="2.2" fill="#fff" opacity=".6"/><circle cx="47" cy="26.5" r="2.2" fill="#fff" opacity=".6"/>');
  teil("m", "kopf", "skimuetze", "Skimütze",
    '<path d="M13 18 Q13 5 28 5 Q40 5 44 12 Q50 13 53 20 Q47 16 43 17 L43 18Z" fill="#2bb5b0"/>' +
    '<path d="M15 12 Q28 8 42 12" stroke="#fff" stroke-width="2" fill="none"/><path d="M45 13.5 Q49 15 51.5 18" stroke="#fff" stroke-width="1.6" fill="none"/>' +
    '<rect x="11.5" y="14.8" width="33" height="6" rx="3" fill="#1f8f8b"/><circle cx="53.5" cy="21" r="3.6" fill="#fff"/>');
  teil("m", "kopf", "zylinder_schnee", "Zylinder mit Schnee",
    '<ellipse cx="28" cy="16" rx="15" ry="3.4" fill="#1f1f2a"/><rect x="19" y="1" width="18" height="15" rx="1.5" fill="#2a2a38"/><rect x="19" y="11" width="18" height="3.2" fill="#c8323e"/>' +
    '<path d="M18.2 2.6 Q19 -2 23 -0.6 Q25 -3 28.5 -1.2 Q31.5 -3.2 34 -0.8 Q37.8 -1.6 37.8 2.6 Q28 4.4 18.2 2.6Z" fill="#fff" stroke="#cfd8e6" stroke-width=".6"/><circle cx="21" cy="5.5" r=".8" fill="#fff"/><circle cx="34.5" cy="7" r=".7" fill="#fff"/>');
  teil("m", "kopf", "doktorhut", "Doktorhut",
    '<path d="M16 15.5 Q16 10 28 10 Q40 10 40 15.5 Z" fill="#1f2b4d"/><path d="M28 2 L47 7.5 L28 13 L9 7.5Z" fill="#26355e"/><path d="M28 2 L47 7.5 L28 13 L9 7.5Z" fill="none" stroke="#14203d" stroke-width=".6"/>' +
    '<circle cx="28" cy="7.5" r="1.3" fill="#e0b04e"/><path d="M28 7.5 L42 10.5 L42 18" stroke="#e0b04e" stroke-width="1" fill="none"/><path d="M40.6 18 h2.8 l-.4 4 h-2z" fill="#e0b04e"/>');
  teil("m", "kopf", "detektivmuetze", "Detektivmütze",
    '<path d="M13 18 Q13.5 5 28 5 Q42.5 5 43 18Z" fill="#9a7a52"/><path d="M15 9.5 H41 M13.8 13.5 H42.4 M20 5.8 V17.6 M28 5 V17.6 M36 5.8 V17.6" stroke="#6e5536" stroke-width=".8" opacity=".8"/>' +
    '<path d="M38 16 Q47 15 50 19.5 Q42 20.5 37 18.5Z" fill="#8a6a46"/><path d="M18 16 Q9 15 6 19.5 Q14 20.5 19 18.5Z" fill="#8a6a46"/><path d="M28 5 Q28 2 30 1.5" stroke="#6e5536" stroke-width="1.4" fill="none" stroke-linecap="round"/>');
  teil("m", "kopf", "kochmuetze", "Kochmütze",
    '<rect x="17" y="10" width="22" height="7" rx="1.2" fill="#f4f1ec" stroke="#d9d2c8" stroke-width=".6"/><path d="M17.5 10.5 Q12 9 13 3.5 Q15 -1 20 1 Q22 -3.5 28 -2.5 Q34 -3.5 36 1 Q41 -1 43 3.5 Q44 9 38.5 10.5Z" fill="#fff" stroke="#d9d2c8" stroke-width=".6"/>' +
    '<path d="M21 4 Q22 7 21.5 10 M28 2 V10 M35 4 Q34 7 34.5 10" stroke="#e2ddd5" stroke-width=".9" fill="none"/><path d="M17 13.5 H39" stroke="#e2ddd5" stroke-width=".8"/>');
  teil("m", "kopf", "glitzerzylinder", "Glitzerzylinder",
    '<ellipse cx="28" cy="16" rx="15" ry="3.4" fill="#2a2a38"/><rect x="19" y="0" width="18" height="16" rx="1.5" fill="#3a3550"/><rect x="19" y="11" width="18" height="3.2" fill="#ff4d8d"/>' +
    '<circle cx="22" cy="3" r=".9" fill="#f7d77c"/><circle cx="26" cy="6.5" r=".8" fill="#fff"/><circle cx="31" cy="2.5" r=".9" fill="#f7d77c"/><circle cx="34" cy="7.5" r=".8" fill="#fff"/><circle cx="23.5" cy="9" r=".7" fill="#f7d77c"/><circle cx="29.5" cy="9" r=".7" fill="#fff"/>' +
    stern(35, 1.5, 2.2, "#f7d77c"));
  teil("m", "kopf", "partyhut", "Partyhut",
    '<path d="M18 16 L30 -6 L40 15 Q29 19 18 16Z" fill="#5aa9e6"/><path d="M22.5 7.8 L35.4 6 M20 12.5 L38 11.2 M26.5 0.5 L32.6 -0.4" stroke="#f7d77c" stroke-width="2.2"/>' +
    '<circle cx="30" cy="-6" r="3" fill="#ff4d8d"/><path d="M18 16 Q29 19 40 15" stroke="#fff" stroke-width="1.6" fill="none" stroke-dasharray="1.5 1.5"/>');
  teil("m", "kopf", "kapitaensmuetze", "Kapitänsmütze",
    '<path d="M12 12 Q13 4.5 28 4.5 Q43 4.5 44 12 L42 15.5 H14Z" fill="#fff" stroke="#cfd3dc" stroke-width=".6"/><rect x="14" y="13.5" width="28" height="4" fill="#1f2b4d"/>' +
    '<path d="M19 17.5 Q28 22.5 37 17.5Z" fill="#14182a"/><path d="M28 7.2 v4.6 M26.2 8.6 h3.6 M25.8 10.8 Q28 13 30.2 10.8" stroke="#e0b04e" stroke-width="1" fill="none" stroke-linecap="round"/><path d="M14.5 17.5 H41.5" stroke="#e0b04e" stroke-width=".8"/>');

  /* ===== Munkelvogel: Hals ===== */
  teil("m", "hals", "strickschal", "Strickschal",
    schal("#c8323e", "#b02a35", '<path d="M13 40.5 Q29 50 45 40.5" stroke="#e05a63" stroke-width="1" fill="none" stroke-dasharray="2 2"/><path d="M40.5 57v2.2M42.8 57v2.2M45 57v2.2" stroke="#b02a35" stroke-width="1.1" stroke-linecap="round"/>'));
  teil("m", "hals", "fliege_punkte", "Fliege mit Punkten",
    '<path d="M29.5 42 L21 37 V47Z M29.5 42 L38 37 V47Z" fill="#2f5d9e"/><circle cx="29.5" cy="42" r="2.5" fill="#22467a"/>' +
    '<circle cx="23.5" cy="39.8" r=".9" fill="#fff"/><circle cx="24.5" cy="44.6" r=".9" fill="#fff"/><circle cx="35.5" cy="39.8" r=".9" fill="#fff"/><circle cx="34.5" cy="44.6" r=".9" fill="#fff"/>');
  teil("m", "hals", "halstuch_streifen", "Halstuch",
    '<path d="M11 37.5 Q29.5 47 48 37.5 L29.5 55Z" fill="#23407a"/><path d="M16.5 40.3 Q29.5 46.5 42.5 40.3 L29.5 51Z" fill="#fff"/><path d="M21.5 42.2 Q29.5 46 37.5 42.2 L29.5 47.5Z" fill="#23407a"/><circle cx="29.5" cy="41.8" r="2" fill="#c8323e"/>');
  teil("m", "hals", "rollkragen", "Rollkragen",
    '<path d="M9.5 36.5 Q29 47 48.5 36.5 L48 45 Q29 55.5 10 45Z" fill="#2bb5b0"/><path d="M12 38.3v7.3M16 40.4v7.6M20 41.9v7.8M24 42.9v7.8M28 43.3v7.9M32 43.2v7.9M36 42.5v7.8M40 41.2v7.7M44 39.3v7.5" stroke="#1f8f8b" stroke-width="1"/>');
  teil("m", "hals", "schal_flocken", "Schal mit Schneeflocken",
    schal("#2f6fbf", "#285fa6", flocke(17, 42, 1.6, "#fff") + flocke(25, 45, 1.6, "#fff") + flocke(34, 45, 1.6, "#fff") + flocke(42, 42, 1.6, "#fff") + flocke(41.8, 52, 1.6, "#fff")));
  teil("m", "hals", "lebkuchenkette", "Lebkuchenkette",
    '<path d="M13 38.5 Q29.5 49 46 38.5" fill="none" stroke="#c8323e" stroke-width="1.2"/>' + herz(29.5, 48.5, 5.4, "#a0612e") +
    '<path d="M29.5 52.3 C25 49.2 25.2 45.6 27.3 45.2 Q28.8 45 29.5 46.6 Q30.2 45 31.7 45.2 C33.8 45.6 34 49.2 29.5 52.3Z" fill="none" stroke="#fff" stroke-width=".7" stroke-dasharray="1 .8"/><circle cx="29.5" cy="48.4" r=".9" fill="#ff4d7d"/>');
  teil("m", "hals", "krawatte", "Krawatte",
    '<path d="M24 38.5 L29.5 41.5 L26 44Z M35 38.5 L29.5 41.5 L33 44Z" fill="#fff"/><path d="M28 41 h3 l.8 2.4 h-4.6z" fill="#1f2b4d"/><path d="M27.3 43.4 h4.4 l1.6 9 l-3.8 3.2 l-3.8 -3.2z" fill="#26355e"/>' +
    '<path d="M27 46.5 l5 -2 M26.5 50 l6 -2.4 M27.5 53.2 l4.5 -1.8" stroke="#e0b04e" stroke-width=".9"/>');
  teil("m", "hals", "kleeblattkette", "Kleeblattkette",
    kettchen("#c9a23a") + '<g transform="translate(29.5 48.5)">' + [0, 90, 180, 270].map((w) => herz(0, -2.4, 2.2, "#3f9a55", ' transform="rotate(' + (w + 45) + ')"')).join("") + '<path d="M0 0 Q1 3 2.5 4" stroke="#3f9a55" stroke-width=".9" fill="none"/></g>');
  teil("m", "hals", "medaille", "Goldmedaille",
    '<path d="M18 38 L27.5 48 L31.5 48 L41 38 L37 38 L29.5 45 L22 38Z" fill="#c8323e"/><path d="M22 38 L29.5 45 L37 38" stroke="#2f5d9e" stroke-width="1.4" fill="none"/>' +
    '<circle cx="29.5" cy="51.5" r="5" fill="#e9b949"/><circle cx="29.5" cy="51.5" r="3.6" fill="#f7d77c"/>' + stern(29.5, 51.6, 2.4, "#d19a2a"));
  teil("m", "hals", "fliege_gold", "Goldene Fliege",
    '<path d="M29.5 42 L20.5 36.5 Q19 42 20.5 47.5Z M29.5 42 L38.5 36.5 Q40 42 38.5 47.5Z" fill="#e9b949"/><path d="M22.5 39 L27 41.6 M22.5 45 L27 42.4 M36.5 39 L32 41.6 M36.5 45 L32 42.4" stroke="#fff3c4" stroke-width=".8"/>' +
    '<rect x="27.2" y="39.6" width="4.6" height="4.8" rx="1.4" fill="#c99528"/>');
  teil("m", "hals", "konfettischal", "Konfettischal",
    schal("#fdf6ff", "#efe4f5", '<circle cx="15" cy="41" r=".9" fill="#ff4d8d"/><circle cx="20" cy="44.5" r=".9" fill="#5aa9e6"/><circle cx="26" cy="46" r=".9" fill="#f3c84b"/><circle cx="32" cy="46.2" r=".9" fill="#6fd17a"/><circle cx="38" cy="44.5" r=".9" fill="#b87cf0"/><circle cx="44" cy="41" r=".9" fill="#ff4d8d"/>' +
      '<rect x="22" y="41.6" width="2" height=".8" fill="#5aa9e6" transform="rotate(30 23 42)"/><rect x="35" y="41.6" width="2" height=".8" fill="#ff4d8d" transform="rotate(-30 36 42)"/><circle cx="41" cy="49" r=".9" fill="#f3c84b"/><circle cx="43.5" cy="53.5" r=".9" fill="#5aa9e6"/>'));
  teil("m", "hals", "partykette", "Lichterkette",
    '<path d="M12.5 38.5 Q29.5 52 46.5 38.5" fill="none" stroke="#3a6a3a" stroke-width=".9"/>' +
    [[15, 41.3, "#ff4d8d"], [20, 44.2, "#f3c84b"], [25.5, 45.6, "#5aa9e6"], [31.5, 45.6, "#6fd17a"], [37.5, 44, "#b87cf0"], [42.8, 41, "#ff8a3d"]].map(([x, y, f]) =>
      '<ellipse cx="' + x + '" cy="' + (y + 1.8) + '" rx="1.4" ry="2" fill="' + f + '"/><circle cx="' + (x - 0.4) + '" cy="' + (y + 1.2) + '" r=".5" fill="#fff" opacity=".85"/>').join(""));

  /* ===== Munkelvogel: Augen ===== */
  teil("m", "augen", "brille_rund", "Runde Brille",
    glaeser('<circle cx="22" cy="28" r="6.4" fill="#d9f0ff" fill-opacity=".18" stroke="#3a2a22" stroke-width="1.5"/>', '<path d="M28.4 27.6 Q29 26.4 29.6 27.6" stroke="#3a2a22" stroke-width="1.4" fill="none"/>') + buegel("#3a2a22"));
  teil("m", "augen", "sonnenbrille", "Sonnenbrille",
    glaeser('<path d="M15.2 24 H28.2 V27.6 Q28.2 33.5 21.7 33.5 Q15.2 33.5 15.2 27.6Z" fill="#1d1d24"/><path d="M17.2 25.8 L21.5 25.8" stroke="#fff" stroke-width="1.1" opacity=".55" stroke-linecap="round"/>',
      '<path d="M28 25.2 H30" stroke="#1d1d24" stroke-width="1.8"/>') + buegel("#1d1d24", 1.6));
  teil("m", "augen", "monokel", "Monokel",
    '<circle cx="36" cy="28" r="6.4" fill="#e9f6ff" fill-opacity=".22" stroke="#c9a23a" stroke-width="1.8"/><path d="M33 25 Q35 24 37 24.6" stroke="#fff" stroke-width=".9" fill="none" opacity=".8"/><path d="M41.2 32 Q45.5 40 42 50" fill="none" stroke="#c9a23a" stroke-width=".8"/>');
  teil("m", "augen", "skibrille", "Skibrille",
    '<path d="M8.5 27 Q8 21 12 21.5 M50.5 27 Q51 21 47 21.5" stroke="#2f5d9e" stroke-width="2.6" fill="none"/>' +
    '<path d="M12 22 Q29.5 18.5 47 22 Q48.5 28 46 32 Q38 34 31.5 31 Q29.5 29.6 27.5 31 Q21 34 13 32 Q10.5 28 12 22Z" fill="#ff9a3d" fill-opacity=".62" stroke="#fff" stroke-width="1.4"/>' +
    '<path d="M15 24 Q29.5 21.5 44 24 Q44.5 27 43.5 29" stroke="#ffd36b" stroke-width="1.3" fill="none" opacity=".9"/>');
  teil("m", "augen", "fliegerbrille", "Fliegerbrille",
    '<path d="M9 27.5 H15.5 M42.5 27.5 H50" stroke="#7a4a2a" stroke-width="2.6"/>' +
    glaeser('<circle cx="22" cy="28" r="6.2" fill="#9fd8f2" fill-opacity=".45" stroke="#b8862f" stroke-width="2.2"/><path d="M19 25.2 Q21 24 23 24.6" stroke="#fff" stroke-width="1" fill="none"/>', '<path d="M28 27.2 Q29 25.6 30 27.2" stroke="#7a4a2a" stroke-width="1.8" fill="none"/>'));
  teil("m", "augen", "sternenbrille", "Sternenbrille",
    glaeser(stern(22, 28.3, 7.4, "#f3c84b", 0.55, ' fill-opacity=".9" stroke="#e0a22a" stroke-width=".8"') + '<circle cx="22" cy="28.3" r="3.4" fill="#fff6d0" opacity=".55"/>', '<path d="M28.8 27.6 H29.2" stroke="#e0a22a" stroke-width="1.6"/>') + buegel("#e0a22a"));
  teil("m", "augen", "professorenbrille", "Hornbrille",
    glaeser('<rect x="15.6" y="24" width="12.6" height="9" rx="2.4" fill="#fff" fill-opacity=".12" stroke="#5a3a2a" stroke-width="1.9"/>', '<path d="M28.2 27 Q29 25.8 29.8 27" stroke="#5a3a2a" stroke-width="1.6" fill="none"/>') + buegel("#5a3a2a", 1.7));
  teil("m", "augen", "taucherbrille", "Taucherbrille",
    '<path d="M9 27 H13 M46 27 H50" stroke="#2f5d9e" stroke-width="2.6"/><path d="M13 21.5 H46 Q47.5 21.5 47.5 23 V31 Q47.5 34.5 44 34.5 H15 Q11.5 34.5 11.5 31 V23 Q11.5 21.5 13 21.5Z" fill="#9fe0f5" fill-opacity=".35" stroke="#2bb5b0" stroke-width="2"/>' +
    '<path d="M15 24.5 L20 24.5" stroke="#fff" stroke-width="1.2" stroke-linecap="round"/><path d="M48.5 30 Q53 30 53 24 V12" stroke="#ff9a3d" stroke-width="2.4" fill="none" stroke-linecap="round"/><path d="M51.6 12 h2.8" stroke="#2f5d9e" stroke-width="1.6" stroke-linecap="round"/>');
  teil("m", "augen", "brille_3d", "3D Brille",
    '<path d="M14 22.5 H45 V33 H32 Q29.5 30 27 33 H14Z" fill="#fff" stroke="#e8e8ee" stroke-width=".6"/><rect x="16" y="24" width="11.5" height="7.5" rx="1" fill="#ff3b4a" fill-opacity=".8"/><rect x="31.5" y="24" width="11.5" height="7.5" rx="1" fill="#2fd0f0" fill-opacity=".8"/>' + buegel("#fff", 1.8));
  teil("m", "augen", "discobrille", "Discobrille",
    glaeser('<rect x="15.2" y="23.6" width="13" height="9.4" rx="3" fill="#c9ced8" stroke="#8a8fa0" stroke-width=".7"/><path d="M15.4 26.7 H28 M15.4 29.8 H28 M19.5 23.8 V32.8 M23.8 23.8 V32.8" stroke="#fff" stroke-width=".6" opacity=".9"/>', '<path d="M28 26 H30" stroke="#8a8fa0" stroke-width="1.6"/>') +
    buegel("#8a8fa0", 1.6) + stern(16, 23.5, 2, "#fff") + stern(43.5, 31.5, 1.6, "#fff"));
  teil("m", "augen", "herzbrille_gold", "Goldene Herzbrille",
    glaeser(herz(22, 28.4, 7, "#ffcf5a", ' fill-opacity=".55" stroke="#d19a2a" stroke-width="1.4"'), '<path d="M28.6 26.6 Q29 25.4 29.4 26.6" stroke="#d19a2a" stroke-width="1.4" fill="none"/>') + buegel("#d19a2a"));
  teil("m", "augen", "partymaske", "Partymaske",
    '<path fill-rule="evenodd" d="M11 24 Q20 19.5 28 24.5 Q29.5 25.5 31 24.5 Q39 19.5 48 24 Q49 31 43 33.5 Q36 35 31.5 31 Q29.5 29.8 27.5 31 Q23 35 16 33.5 Q10 31 11 24Z M17.2 28.6 a5.2 4.2 0 1 0 10.4 0 a5.2 4.2 0 1 0 -10.4 0Z M31.4 28.6 a5.2 4.2 0 1 0 10.4 0 a5.2 4.2 0 1 0 -10.4 0Z" fill="#1d1d24" stroke="#e0b04e" stroke-width="1"/>' +
    '<circle cx="12.5" cy="25" r=".7" fill="#e0b04e"/><circle cx="46.5" cy="25" r=".7" fill="#e0b04e"/>');

  /* ===== Munkelvogel: Füße ===== */
  teil("m", "fuesse", "gummistiefel", "Gummistiefel",
    paar('<path d="M20.8 50.8 H25.6 L24.6 55.4 L24.8 58.6 H15.4 Q15.2 55.4 18.6 55 H20.2Z" fill="#f2c230"/><path d="M15.4 58.6 H24.8" stroke="#c99a1a" stroke-width="1"/><path d="M21 52 H25.3" stroke="#ffe17a" stroke-width=".8"/>'));
  teil("m", "fuesse", "turnschuhe", "Turnschuhe",
    paar('<path d="M15.3 58.6 Q15.3 55 18.8 54.6 L22.6 54 Q24.4 54 24.4 55.6 V58.6Z" fill="#fff" stroke="#c9c9d6" stroke-width=".6"/><path d="M17.4 56.6 L22.4 55.4" stroke="#e8455a" stroke-width="1.2" stroke-linecap="round"/><path d="M15.3 58.6 H24.4" stroke="#8a8aa0" stroke-width="1"/>'));
  teil("m", "fuesse", "ringelsocken", "Ringelsocken",
    paar('<path d="M23.4 51.6 L21.2 56.4 L17.4 57" stroke="#e8455a" stroke-width="3.8" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M21.6 52.6 L24.8 53.4 M20.8 54.6 L23.8 55.4 M18.6 55.6 L18.6 58.4" stroke="#fff" stroke-width="1" fill="none"/>'));
  teil("m", "fuesse", "schlittschuhe", "Schlittschuhe",
    paar('<path d="M20.6 51 H25.4 L24.4 55 V57.4 H15.6 Q15.4 54.8 18.6 54.4 H20Z" fill="#2a2a38"/><path d="M21 52.4 L25 52.4 M20.6 53.8 L24.6 53.8" stroke="#fff" stroke-width=".6"/><path d="M15 59.8 H25.6 M17 57.4 V59.8 M23.4 57.4 V59.8" stroke="#c9ced8" stroke-width="1.1" stroke-linecap="round"/>'));
  teil("m", "fuesse", "schneestiefel", "Schneestiefel",
    paar('<path d="M20.2 51.6 H26 L25 55.4 L25.2 58.8 H15 Q14.8 55.2 18.4 54.8 H19.8Z" fill="#7a4a2a"/><path d="M15 58.8 H25.2" stroke="#4a2c18" stroke-width="1.3"/>' +
      '<ellipse cx="23.1" cy="51.4" rx="3.6" ry="1.8" fill="#fff"/><circle cx="20.6" cy="51" r="1" fill="#fff"/><circle cx="25.6" cy="51" r="1" fill="#fff"/>'));
  teil("m", "fuesse", "skier", "Skier",
    paar('<path d="M8 58.6 Q7 56.8 8.6 56.8 H26 V58.6Z" fill="#e8455a"/><path d="M10 57.6 H25" stroke="#fff" stroke-width=".6"/><rect x="18.4" y="55" width="5" height="2" rx=".6" fill="#2a2a38"/>'));
  teil("m", "fuesse", "lackschuhe", "Lackschuhe",
    paar('<path d="M15.4 58.6 Q15.2 55.4 18.6 54.8 L22.8 54.2 Q24.4 54.2 24.4 55.8 V58.6Z" fill="#14141c"/><path d="M17.4 56 Q19.4 55 21.6 55" stroke="#fff" stroke-width=".9" opacity=".8" stroke-linecap="round"/>'));
  teil("m", "fuesse", "glueckssocken", "Glückssocken",
    paar('<path d="M23.4 51.6 L21.2 56.4 L17.4 57" stroke="#3f9a55" stroke-width="3.8" stroke-linecap="round" stroke-linejoin="round" fill="none"/><circle cx="22.6" cy="53.4" r=".75" fill="#c8f0b0"/><circle cx="21.4" cy="55.8" r=".75" fill="#c8f0b0"/><circle cx="18.4" cy="57" r=".7" fill="#c8f0b0"/>'));
  teil("m", "fuesse", "leuchtsneaker", "Leuchtsneaker",
    paar('<path d="M15.3 58 Q15.3 54.8 18.8 54.4 L22.6 53.8 Q24.4 53.8 24.4 55.4 V58Z" fill="#2a2a38"/><path d="M15.2 58.4 H24.6" stroke="#2ff0e0" stroke-width="1.6" stroke-linecap="round"/><path d="M17.6 56.2 L22.4 55" stroke="#ff4dd8" stroke-width="1.1" stroke-linecap="round"/>'));
  teil("m", "fuesse", "tanzschuhe", "Tanzschuhe",
    paar('<path d="M15.4 58.6 Q15.2 55.4 18.6 54.8 L22.8 54.2 Q24.4 54.2 24.4 55.8 V58.6Z" fill="#fff"/><path d="M15.4 58.6 Q15.2 55.6 17.8 55 L19.4 55 V58.6Z M22 54.4 L24.4 55 V58.6 H22Z" fill="#14141c"/><path d="M15.4 58.6 H24.4" stroke="#14141c" stroke-width="1"/>'));
  teil("m", "fuesse", "rollschuhe", "Rollschuhe",
    paar('<path d="M20.6 51 H25.4 L24.4 55 V57 H15.6 Q15.4 54.6 18.6 54.2 H20Z" fill="#e8455a"/><path d="M21 52.6 H25 M20.6 54 H24.6" stroke="#fff" stroke-width=".7"/><rect x="15.4" y="57" width="9.4" height="1.2" fill="#c9ced8"/>' +
      '<circle cx="17.6" cy="59.2" r="1.5" fill="#f3c84b"/><circle cx="22.6" cy="59.2" r="1.5" fill="#f3c84b"/>'));
  teil("m", "fuesse", "lackschuhe_gold", "Goldene Lackschuhe",
    paar('<path d="M15.4 58.6 Q15.2 55.4 18.6 54.8 L22.8 54.2 Q24.4 54.2 24.4 55.8 V58.6Z" fill="#e9b949"/><path d="M17.4 56 Q19.4 55 21.6 55" stroke="#fff3c4" stroke-width=".9" stroke-linecap="round"/><path d="M15.4 58.6 H24.4" stroke="#b8862f" stroke-width="1"/>'));

  /* ===== Munkelvogel: Extra (rechts unter dem Flügel) ===== */
  teil("m", "extra", "regenschirm", "Regenschirm",
    '<path d="M51.5 27 V49 Q51.5 52 48.5 52" fill="none" stroke="#5a3a2a" stroke-width="1.4" stroke-linecap="round"/>' +
    '<path d="M41.5 28 Q42.5 16 51.5 15.5 Q60.5 16 61.5 28 Q59 26.2 56.5 28 Q54 26.2 51.5 28 Q49 26.2 46.5 28 Q44 26.2 41.5 28Z" fill="#2f6fbf"/><path d="M51.5 15.5 Q48.5 21 46.5 28 M51.5 15.5 Q54.5 21 56.5 28" stroke="#24589c" stroke-width=".8" fill="none"/><path d="M51.5 15.5 V13.5" stroke="#5a3a2a" stroke-width="1.2"/>');
  teil("m", "extra", "croissant", "Croissant",
    '<path d="M42 47 Q49.5 36 58 46 Q56 48.2 54 46.6 Q52 49.4 49.8 47.2 Q47.6 49.4 45.6 47 Q43.8 48.8 42 47Z" fill="#e2a84a" stroke="#b8763f" stroke-width=".7"/><path d="M46 42.5 L47.6 47 M50 40.6 L50 47.2 M54 42.4 L52.4 46.8" stroke="#b8763f" stroke-width=".7"/>');
  teil("m", "extra", "kaffeebecher", "Kaffeebecher",
    '<path d="M44.5 38.5 H56 L54.4 53 H46.1Z" fill="#fff" stroke="#d6c7b8" stroke-width=".6"/><rect x="44" y="36" width="12.5" height="3" rx="1" fill="#7a4a2a"/><path d="M45.4 43.5 H55.1 L54.6 48 H45.9Z" fill="#c9a07a"/>' +
    herz(50.25, 45.9, 1.4, "#fff") + '<path d="M48 33.8 Q49 32 48 30.2 M51.5 33.8 Q52.5 32 51.5 30.2" stroke="#c9c2bb" stroke-width=".8" fill="none" stroke-linecap="round"/>');
  teil("m", "extra", "thermoskanne", "Thermoskanne",
    '<rect x="45" y="34" width="10" height="20" rx="2.4" fill="#c8323e"/><rect x="45" y="38" width="10" height="2" fill="#a02633"/><rect x="45.6" y="30" width="8.8" height="5" rx="1.4" fill="#5a5f6e"/>' +
    '<rect x="47" y="43" width="6" height="6" rx="1" fill="#fff" opacity=".85"/>' + flocke(50, 46, 2, "#c8323e", 0.7) + '<path d="M46.4 41 V52" stroke="#fff" stroke-width=".8" opacity=".5"/>');
  teil("m", "extra", "schneeball", "Schneeball",
    '<circle cx="50.5" cy="45" r="6.2" fill="#fff"/><circle cx="50.5" cy="45" r="6.2" fill="none" stroke="#d6e6f2" stroke-width=".8"/><path d="M46 47 Q50 50.5 55 47.5" stroke="#d6e6f2" stroke-width="1.6" fill="none" stroke-linecap="round"/><circle cx="48.4" cy="42.6" r="1.6" fill="#fff" stroke="#eef5fb" stroke-width=".5"/><circle cx="53" cy="43" r=".7" fill="#d6e6f2"/>');
  teil("m", "extra", "laterne", "Laterne",
    '<path d="M50.5 26 Q47 26 47 30" stroke="#3a3a48" stroke-width="1" fill="none"/><path d="M45.5 33 H55.5 L54.5 30.5 H46.5Z" fill="#3a3a48"/><rect x="46.2" y="33" width="8.6" height="12" rx="1" fill="#fff4c0" stroke="#3a3a48" stroke-width="1"/>' +
    '<ellipse cx="50.5" cy="39.5" rx="2" ry="3" fill="#ffb84d"/><ellipse cx="50.5" cy="40.2" rx="1" ry="1.6" fill="#fff3c4"/><path d="M45.5 45 H55.5 L54 47 H47Z" fill="#3a3a48"/><path d="M50.5 26 Q54 26 54 30.5" stroke="#3a3a48" stroke-width="1" fill="none"/>' +
    '<circle cx="50.5" cy="39.5" r="7.5" fill="#ffd36b" opacity=".18"/>');
  teil("m", "extra", "bleistift", "Bleistift",
    '<g transform="rotate(-28 50 42)"><rect x="47.6" y="28" width="5" height="24" fill="#f3c84b"/><path d="M47.6 28 H52.6 V25 H47.6Z" fill="#ff8fab"/><rect x="47.6" y="27.4" width="5" height="1.6" fill="#c9ced8"/>' +
    '<path d="M47.6 52 L50.1 57 L52.6 52Z" fill="#f2d3a8"/><path d="M49.4 55.6 L50.1 57 L50.8 55.6Z" fill="#3a3a48"/><path d="M49.3 28 V52 M50.9 28 V52" stroke="#e0a22a" stroke-width=".6"/></g>');
  teil("m", "extra", "buch", "Buch",
    '<g transform="rotate(8 50.5 44)"><rect x="44" y="35" width="13" height="17" rx="1.2" fill="#c8323e"/><rect x="44" y="35" width="2.4" height="17" fill="#a02633"/><rect x="47.6" y="38" width="7.6" height="3.2" rx=".6" fill="#f7d77c"/><path d="M47.6 44 H55.2 M47.6 46.4 H53.6" stroke="#ffb3bd" stroke-width=".7"/><path d="M57 36 V51.4" stroke="#fff" stroke-width="1"/></g>');
  teil("m", "extra", "pokal", "Pokal",
    '<path d="M44.5 33 H56.5 Q56.5 43 50.5 44 Q44.5 43 44.5 33Z" fill="#e9b949"/><path d="M44.5 35 Q41 35 41.5 38.5 Q42 41 45.5 41 M56.5 35 Q60 35 59.5 38.5 Q59 41 55.5 41" stroke="#e9b949" stroke-width="1.4" fill="none"/>' +
    '<rect x="49.4" y="44" width="2.2" height="4" fill="#d19a2a"/><rect x="46" y="48" width="9" height="3.6" rx=".8" fill="#7a4a2a"/>' + stern(50.5, 38, 2.6, "#fff3c4") + '<path d="M46.4 34.6 Q46.6 39 48.4 41" stroke="#fff3c4" stroke-width=".8" fill="none"/>');
  teil("m", "extra", "troete", "Tröte",
    '<path d="M42 41 L52 37 L53.2 40.4 L43.2 44.2Z" fill="#5aa9e6"/><path d="M45 39.8 L46.2 43.2 M48.4 38.5 L49.6 41.9" stroke="#f7d77c" stroke-width="1"/>' +
    '<path d="M52.6 38.6 Q58 37 59 41 Q60 45 56 45.4 Q53 45.6 53.6 43.2 Q54.2 41.4 56.2 42.2" stroke="#ff4d8d" stroke-width="1.8" fill="none" stroke-linecap="round"/>');
  teil("m", "extra", "geschenk", "Geschenk",
    '<rect x="44" y="40" width="13.5" height="12" rx="1.2" fill="#ff4d8d"/><rect x="43.4" y="37.6" width="14.7" height="3.6" rx="1" fill="#ff76a6"/><rect x="49.6" y="37.6" width="2.4" height="14.4" fill="#f7d77c"/>' +
    '<path d="M50.8 37.6 Q45.5 31 44.6 35 Q44.2 37.6 50.8 37.6Z M50.8 37.6 Q56 31 57 35 Q57.4 37.6 50.8 37.6Z" fill="#f7d77c" stroke="#d19a2a" stroke-width=".6"/>');
  teil("m", "extra", "luftballon", "Luftballon",
    '<path d="M47.5 48 Q51 40 53 34 Q55 28 54 21.5" stroke="#9a9aa8" stroke-width=".7" fill="none"/>' +
    '<ellipse cx="54.5" cy="13" rx="6.6" ry="8" fill="#5aa9e6"/><path d="M53.4 21 L55.6 21 L54.5 22.6Z" fill="#4a8fc6"/><ellipse cx="52" cy="9.6" rx="1.8" ry="2.8" fill="#fff" opacity=".55" transform="rotate(20 52 9.6)"/>');

  /* ===== Munkelvogeline: Kopf ===== */
  teil("w", "kopf", "barett_rosa", "Baskenmütze mit Perle",
    '<ellipse cx="27.5" cy="14.5" rx="15.5" ry="5" fill="#e0789a" transform="rotate(-10 27.5 14.5)"/><ellipse cx="26" cy="11.8" rx="12" ry="5" fill="#f49ab5" transform="rotate(-10 26 11.8)"/>' +
    '<ellipse cx="22.5" cy="10.5" rx="5" ry="1.6" fill="#ffd0dc" opacity=".6" transform="rotate(-12 22.5 10.5)"/><circle cx="35.5" cy="11.2" r="2.1" fill="#fff"/><circle cx="35" cy="10.6" r=".7" fill="#fff" stroke="#e8e0e6" stroke-width=".3"/><path d="M27 7.2 L28 4.6" stroke="#c45a7e" stroke-width="2" stroke-linecap="round"/>');
  teil("w", "kopf", "herbstreif", "Haarreif mit Herbstblättern",
    '<path d="M11.5 23 Q12.5 9.5 28.5 9.5 Q44.5 9.5 45.5 23" fill="none" stroke="#8a5a3a" stroke-width="1.8"/>' +
    '<ellipse cx="19" cy="12" rx="3.6" ry="2" fill="#e8742a" transform="rotate(-35 19 12)"/><ellipse cx="25" cy="9" rx="3.6" ry="2" fill="#d6304f" transform="rotate(-10 25 9)"/>' +
    '<ellipse cx="31.5" cy="8.8" rx="3.6" ry="2" fill="#f3b23c" transform="rotate(15 31.5 8.8)"/><ellipse cx="37.5" cy="11.2" rx="3.6" ry="2" fill="#c8562a" transform="rotate(40 37.5 11.2)"/><circle cx="28.3" cy="10.2" r="1.3" fill="#7a3a1a"/><circle cx="22" cy="10.6" r="1" fill="#7a3a1a"/>');
  teil("w", "kopf", "strohhut", "Strohhut",
    '<ellipse cx="28" cy="15.5" rx="20.5" ry="4.6" fill="#e8c77a"/><path d="M18.5 15.5 Q18 4 28 4 Q38 4 37.5 15.5Z" fill="#f0d38a"/><path d="M14 15 Q28 18 42 15 M20 9 Q28 7.5 36 9" stroke="#d6b060" stroke-width=".7" fill="none"/>' +
    '<path d="M18.4 11 Q28 13.5 37.6 11 L37.6 14.4 Q28 17 18.4 14.4Z" fill="#f2789a"/><path d="M37 12.6 L42.5 9.6 V15.6Z M37 12.6 L42 17.5 L40 18.5Z" fill="#f2789a"/>');
  teil("w", "kopf", "stirnband_pompons", "Stirnband mit Pompons",
    '<path d="M11.5 22 Q12 11 28.5 11 Q45 11 45.5 22" fill="none" stroke="#9b6fd6" stroke-width="5" stroke-linecap="round"/><path d="M13 19 Q14 13.4 28.5 13.4 Q43 13.4 44 19" fill="none" stroke="#b896ea" stroke-width="1" stroke-dasharray="1.6 1.6"/>' +
    '<circle cx="10.5" cy="24" r="4.2" fill="#e8dcff"/><circle cx="46.5" cy="24" r="4.2" fill="#e8dcff"/><circle cx="9.5" cy="23" r="1.6" fill="#fff"/><circle cx="45.5" cy="23" r="1.6" fill="#fff"/>');
  teil("w", "kopf", "eiskroenchen", "Eiskrönchen",
    '<path d="M18 15.5 L19.5 6.5 L23 11.5 L28.5 3 L34 11.5 L37.5 6.5 L39 15.5Z" fill="#cdeefc" stroke="#7cc4f0" stroke-width=".9" stroke-linejoin="round"/><path d="M18 15.5 H39" stroke="#7cc4f0" stroke-width="2"/>' +
    '<path d="M28.5 4.5 V13 M24 12 L26 9 M33 12 L31 9" stroke="#fff" stroke-width=".8"/><circle cx="28.5" cy="10.5" r="1.4" fill="#b8a2f0"/>' + stern(19.5, 5.5, 1.6, "#fff") + stern(37.5, 5.5, 1.6, "#fff"));
  teil("w", "kopf", "rentierreif", "Rentierhaarreif",
    '<path d="M12 22 Q13 10.5 28.5 10.5 Q44 10.5 45 22" fill="none" stroke="#c8323e" stroke-width="1.8"/>' +
    '<path d="M18 12 L14 3.5 M15.8 7.2 L11.5 6 M15 5.5 L16.5 2 M39 12 L43 3.5 M41.2 7.2 L45.5 6 M42 5.5 L40.5 2" stroke="#8a5a3a" stroke-width="2" stroke-linecap="round"/>' +
    '<ellipse cx="21" cy="12" rx="2.4" ry="3.4" fill="#a0704b" transform="rotate(-30 21 12)"/><ellipse cx="36" cy="12" rx="2.4" ry="3.4" fill="#a0704b" transform="rotate(30 36 12)"/><circle cx="28.5" cy="10.6" r="1.6" fill="#f3c84b"/>');
  teil("w", "kopf", "kleespange", "Kleeblattspange",
    '<rect x="31" y="12.4" width="10" height="2.2" rx="1.1" fill="#c9a23a" transform="rotate(-20 36 13.5)"/><g transform="translate(37.5 10.2) scale(1.3)">' + [0, 90, 180, 270].map((w) => herz(0, -2.7, 2.5, "#3f9a55", ' transform="rotate(' + (w + 45) + ')"')).join("") + '<circle r="1" fill="#2f7a42"/></g>');
  teil("w", "kopf", "marienkaeferreif", "Marienkäferreif",
    '<path d="M11.5 22.5 Q12.5 10 28.5 10 Q44.5 10 45.5 22.5" fill="none" stroke="#2a2a38" stroke-width="1.6"/>' +
    '<path d="M27 10 Q24 4 21 3.5 M30 10 Q33 4 36 3.5" stroke="#2a2a38" stroke-width="1" fill="none"/><circle cx="21" cy="3.5" r="1.6" fill="#d6304f"/><circle cx="36" cy="3.5" r="1.6" fill="#d6304f"/>' +
    '<path d="M32 10.5 A5 4.4 0 0 1 42 10.5Z" fill="#d6304f"/><path d="M37 6.2 V10.5" stroke="#2a2a38" stroke-width=".7"/><circle cx="34.6" cy="8.6" r=".9" fill="#2a2a38"/><circle cx="39.4" cy="8.6" r=".9" fill="#2a2a38"/><path d="M35 6.4 A2 1.6 0 0 1 39 6.4Z" fill="#2a2a38"/>');
  teil("w", "kopf", "blumenkranz", "Blumenkranz",
    '<path d="M11.5 21 Q13 10 28.5 10 Q44 10 45.5 21" fill="none" stroke="#5a9a4a" stroke-width="1.4"/>' +
    blume(14.5, 15.5, 3.4, "#ffb3c6") + blume(20.5, 11.2, 3.6, "#fff", "#f3c84b") + blume(28.5, 9.6, 3.8, "#ff8fab") + blume(36.5, 11.2, 3.6, "#d9c2ff", "#f3c84b") + blume(42.5, 15.5, 3.4, "#fff") +
    '<ellipse cx="24.5" cy="9.6" rx="1.8" ry=".9" fill="#5a9a4a" transform="rotate(-20 24.5 9.6)"/><ellipse cx="32.5" cy="9.6" rx="1.8" ry=".9" fill="#5a9a4a" transform="rotate(20 32.5 9.6)"/>');
  teil("w", "kopf", "diadem", "Diadem",
    '<path d="M17 16 Q28.5 11 40 16" fill="none" stroke="#d6dbe6" stroke-width="2"/><path d="M19.5 14.4 L21.5 9.5 L24.5 13 L28.5 4.5 L32.5 13 L35.5 9.5 L37.5 14.4" fill="none" stroke="#e8ecf4" stroke-width="1.4" stroke-linejoin="round"/>' +
    '<path d="M28.5 6.5 L30.5 9.8 L28.5 13 L26.5 9.8Z" fill="#ff4d8d"/><circle cx="21.5" cy="10" r="1.2" fill="#ffb3c6"/><circle cx="35.5" cy="10" r="1.2" fill="#ffb3c6"/>' + stern(28.5, 3.8, 1.5, "#fff"));
  teil("w", "kopf", "partyhut_pink", "Partyhut",
    '<path d="M18 16 L28 -6 L39 15 Q28.5 19 18 16Z" fill="#ff76a6"/><circle cx="24" cy="9" r="1.2" fill="#fff"/><circle cx="30.5" cy="5" r="1.2" fill="#fff"/><circle cx="33.5" cy="11.5" r="1.2" fill="#fff"/><circle cx="27.5" cy="13.5" r="1.1" fill="#f7d77c"/><circle cx="28" cy="1.5" r="1" fill="#f7d77c"/>' +
    '<circle cx="28" cy="-6" r="3" fill="#f7d77c"/><path d="M18 16 Q28.5 19 39 15" stroke="#fff" stroke-width="1.6" fill="none" stroke-dasharray="1.5 1.5"/>');
  teil("w", "kopf", "bluetenkrone", "Rosenkrone",
    '<path d="M12 20 Q14 9.5 28.5 9.5 Q43 9.5 45 20" fill="none" stroke="#c9a23a" stroke-width="1.4"/>' +
    [[16, 13.5, "#ff4d7d"], [22.5, 9.8, "#ffb3c6"], [28.5, 8.2, "#ff4d7d"], [34.5, 9.8, "#ffb3c6"], [41, 13.5, "#ff4d7d"]].map(([x, y, f]) =>
      '<circle cx="' + x + '" cy="' + y + '" r="3.1" fill="' + f + '"/><path d="M' + (x - 1.6) + " " + y + " Q" + x + " " + (y - 2) + " " + (x + 1.6) + " " + y + " Q" + x + " " + (y + 1.6) + " " + (x - 0.6) + " " + (y - 0.2) + '" stroke="#fff" stroke-width=".6" fill="none" opacity=".75"/>').join("") +
    '<ellipse cx="19.2" cy="10.4" rx="1.8" ry=".8" fill="#e0b04e" transform="rotate(-30 19.2 10.4)"/><ellipse cx="37.8" cy="10.4" rx="1.8" ry=".8" fill="#e0b04e" transform="rotate(30 37.8 10.4)"/>');

  /* ===== Munkelvogeline: Hals ===== */
  teil("w", "hals", "perlenkette", "Perlenkette", kette(13, 1.55, ["#fffaf2"], 12, true, "#d8cbb8"));
  teil("w", "hals", "seidentuch", "Seidentuch",
    '<path d="M10.5 38 Q29 47.5 47.5 38 L47.5 42.5 Q29 52 10.5 42.5Z" fill="#f49ab5"/><path d="M13 40.4 Q29 48.6 45 40.4" stroke="#fff" stroke-width=".7" fill="none" opacity=".6"/>' +
    '<circle cx="40" cy="45" r="2.6" fill="#e0789a"/><path d="M39 46.5 Q36 52 38 57 Q40 54 40.6 50Z M41.2 46.5 Q45 51 47.5 54 Q44 54.5 41.6 50Z" fill="#f49ab5"/>');
  teil("w", "hals", "schal_creme", "Strickschal",
    schal("#f4e9d8", "#ead9c0", '<path d="M13 40.5 Q29 50 45 40.5" stroke="#d9c3a5" stroke-width="1" fill="none" stroke-dasharray="2 2"/><path d="M40.5 57v2.4M42.8 57v2.4M45 57v2.4" stroke="#d9c3a5" stroke-width="1.1" stroke-linecap="round"/>'));
  teil("w", "hals", "federboa_weiss", "Weiße Federboa", kette(15, 2.6, ["#ffffff", "#f1f3fb"], 12, false, "#dde1ec"));
  teil("w", "hals", "flockenkette", "Flockenkette",
    kettchen("#c9ced8") + '<g>' + flocke(29.5, 48.6, 3.4, "#9fd8f2", 1.1) + '<circle cx="29.5" cy="48.6" r="1" fill="#fff"/></g>');
  teil("w", "hals", "karoschal", "Karoschal",
    schal("#c8323e", "#b02a35", '<path d="M12 40 Q29 49.5 46 40 M11 43 Q29 52.5 47 43" stroke="#2f7a42" stroke-width="1.3" fill="none"/><path d="M17 40.5 V47.5 M23 42.6 V49.6 M29 43.4 V50.6 M35 42.6 V49.6 M41 40.5 V47.5 M40.5 46 L42 57 M43 45 L44.6 57" stroke="#f3c84b" stroke-width=".7"/>'));
  teil("w", "hals", "hufeisenkette", "Hufeisenkette",
    kettchen("#c9ced8") + '<path d="M26.4 46.2 Q26 52.6 29.5 52.6 Q33 52.6 32.6 46.2" fill="none" stroke="#c9ced8" stroke-width="2.4" stroke-linecap="round"/><circle cx="27" cy="49" r=".45" fill="#8a8fa0"/><circle cx="32" cy="49" r=".45" fill="#8a8fa0"/><circle cx="29.5" cy="52.1" r=".45" fill="#8a8fa0"/>');
  teil("w", "hals", "halstuch_gruen", "Halstuch",
    '<path d="M11 37.5 Q29.5 47 48 37.5 L29.5 55Z" fill="#3f9a55"/><circle cx="21" cy="42" r=".9" fill="#fff"/><circle cx="29.5" cy="45" r=".9" fill="#fff"/><circle cx="38" cy="42" r=".9" fill="#fff"/><circle cx="25.5" cy="47.5" r=".9" fill="#fff"/><circle cx="33.5" cy="47.5" r=".9" fill="#fff"/><circle cx="29.5" cy="51" r=".9" fill="#fff"/>');
  teil("w", "hals", "glueckband", "Glücksbändchen",
    '<path d="M12.5 38.5 Q29.5 51 46.5 38.5" fill="none" stroke="#ff4d7d" stroke-width="2.2"/><path d="M12.5 38.5 Q29.5 51 46.5 38.5" fill="none" stroke="#fff" stroke-width="2.2" stroke-dasharray="1.4 2.2"/>' +
    '<path d="M12.5 38.5 Q29.5 51 46.5 38.5" fill="none" stroke="#3f9a55" stroke-width="2.2" stroke-dasharray="1 4.6" stroke-dashoffset="1.8"/>');
  teil("w", "hals", "federboa_pink", "Pinke Federboa", kette(15, 2.6, ["#ff76a6", "#ff9fc0"], 12));
  teil("w", "hals", "diamantkette", "Diamantkette",
    kettchen("#e8ecf4") + '<path d="M29.5 46.4 L33 49.2 L29.5 54 L26 49.2Z" fill="#cdeefc" stroke="#9fd8f2" stroke-width=".6"/><path d="M26 49.2 H33 M29.5 46.4 L28 49.2 L29.5 54 L31 49.2Z" stroke="#fff" stroke-width=".5" fill="none"/>' + stern(32.6, 46.4, 1.2, "#fff"));
  teil("w", "hals", "luftschlangen", "Luftschlangen",
    '<path d="M12 38 Q16 44 20 40 Q24 36 26 43 Q28 48 32 43 Q35 38 38 44 Q41 49 46 39" fill="none" stroke="#5aa9e6" stroke-width="1.4" stroke-linecap="round"/>' +
    '<path d="M13 41 Q17 47 21 43.5 Q25 40 27.5 46 Q30 50.5 33.5 46 Q36.5 42 39.5 47 Q42.5 51 46.5 42" fill="none" stroke="#ff76a6" stroke-width="1.4" stroke-linecap="round"/>' +
    '<path d="M41 45 Q44 50 41.5 53 Q39 56 42 58" fill="none" stroke="#f3c84b" stroke-width="1.4" stroke-linecap="round"/>');

  /* ===== Munkelvogeline: Augen ===== */
  teil("w", "augen", "herzbrille", "Herzbrille",
    glaeser(herz(22, 28.4, 7, "#ff8fab", ' fill-opacity=".45" stroke="#e8457a" stroke-width="1.4"'), '<path d="M28.6 26.6 Q29 25.4 29.4 26.6" stroke="#e8457a" stroke-width="1.4" fill="none"/>') + buegel("#e8457a"));
  teil("w", "augen", "katzenaugen", "Katzenaugenbrille",
    glaeser('<path d="M14 23.5 Q21 21.6 28.4 24.6 Q28.4 33.4 21.6 33.4 Q15.6 33.4 15.2 27.4 Q13.6 25.6 14 23.5Z" fill="#fff" fill-opacity=".14" stroke="#2a2a38" stroke-width="1.8" stroke-linejoin="round"/><circle cx="15.6" cy="24" r=".8" fill="#ff8fab"/>',
      '<path d="M28.4 26.6 Q29 25.4 29.6 26.6" stroke="#2a2a38" stroke-width="1.5" fill="none"/>') + buegel("#2a2a38"));
  teil("w", "augen", "wimpern", "Lange Wimpern",
    glaeser('<path d="M16.8 25 Q22 21.2 27.2 25" stroke="#2a1a12" stroke-width="1.3" fill="none" stroke-linecap="round"/><path d="M17.4 24.2 L14.4 21.8 M19 23 L17.2 19.8 M21.4 22.2 L20.8 18.8 M23.8 22.4 L24.6 19.2 M25.8 23.4 L27.6 20.8" stroke="#2a1a12" stroke-width="1.05" stroke-linecap="round"/>'));
  teil("w", "augen", "glitzerbrille", "Glitzerbrille",
    glaeser('<rect x="15.6" y="23.6" width="12.6" height="9.4" rx="4.6" fill="#fff" fill-opacity=".12" stroke="#9b6fd6" stroke-width="1.9"/><circle cx="16.6" cy="24.8" r=".6" fill="#fff"/><circle cx="27.2" cy="31.6" r=".6" fill="#fff"/><circle cx="21" cy="23.6" r=".5" fill="#f3c84b"/>',
      '<path d="M28.2 27 Q29 25.8 29.8 27" stroke="#9b6fd6" stroke-width="1.6" fill="none"/>') + buegel("#9b6fd6") + stern(14.5, 22.6, 1.6, "#f3c84b") + stern(44, 22.8, 1.3, "#fff"));
  teil("w", "augen", "flockenbrille", "Flockenbrille",
    glaeser('<circle cx="22" cy="28.2" r="5.8" fill="#e6f6ff" fill-opacity=".25" stroke="#7cc4f0" stroke-width="1.4"/>' + [0, 60, 120, 180, 240, 300].map((w) => {
      const r = (w * Math.PI) / 180, x = 22 + Math.cos(r) * 5.8, y = 28.2 + Math.sin(r) * 5.8, x2 = 22 + Math.cos(r) * 8.4, y2 = 28.2 + Math.sin(r) * 8.4;
      return '<path d="M' + x.toFixed(2) + " " + y.toFixed(2) + "L" + x2.toFixed(2) + " " + y2.toFixed(2) + '" stroke="#7cc4f0" stroke-width="1.1" stroke-linecap="round"/><circle cx="' + x2.toFixed(2) + '" cy="' + y2.toFixed(2) + '" r=".7" fill="#fff"/>';
    }).join(""), '<path d="M28 27.4 H30.4" stroke="#7cc4f0" stroke-width="1.3"/>'));
  teil("w", "augen", "glitzerwimpern", "Glitzerwimpern",
    glaeser('<path d="M16.8 25 Q22 21.2 27.2 25" stroke="#4a2a5a" stroke-width="1.2" fill="none" stroke-linecap="round"/><path d="M17.6 24.2 L15.2 21.6 M19.6 22.8 L18.4 19.6 M22 22.2 L22 18.8 M24.4 22.6 L25.6 19.4 M26.4 23.8 L28.6 21.6" stroke="#4a2a5a" stroke-width="1" stroke-linecap="round"/>' +
      '<circle cx="15.2" cy="21.4" r=".75" fill="#b896ea"/><circle cx="18.4" cy="19.4" r=".75" fill="#9fd8f2"/><circle cx="22" cy="18.6" r=".75" fill="#fff"/><circle cx="25.6" cy="19.2" r=".75" fill="#9fd8f2"/><circle cx="28.6" cy="21.4" r=".75" fill="#b896ea"/>'));
  teil("w", "augen", "kleeblattbrille", "Kleeblattbrille",
    glaeser('<g transform="translate(22 28.3)">' + [0, 90, 180, 270].map((w) => herz(0, -3.4, 3.6, "#6fd17a", ' fill-opacity=".35" stroke="#3f9a55" stroke-width="1.1" transform="rotate(' + (w + 45) + ')"')).join("") + "</g>",
      '<path d="M28.4 27.4 Q29 26 29.6 27.4" stroke="#3f9a55" stroke-width="1.4" fill="none"/>') + buegel("#3f9a55"));
  teil("w", "augen", "brille_rund_w", "Feine runde Brille",
    glaeser('<circle cx="22" cy="28" r="6" fill="#fff6e0" fill-opacity=".15" stroke="#d19a2a" stroke-width="1"/>', '<path d="M28 27.6 Q29 26.6 30 27.6" stroke="#d19a2a" stroke-width="1" fill="none"/>') + buegel("#d19a2a", 1));
  teil("w", "augen", "sternsonnenbrille", "Dunkle Sternenbrille",
    glaeser(stern(22, 28.3, 7.6, "#3a2a40", 0.55, ' stroke="#ff76a6" stroke-width="1.2" stroke-linejoin="round"') + '<path d="M19 26.6 L21 25.6" stroke="#fff" stroke-width=".9" opacity=".6" stroke-linecap="round"/>', '<path d="M28.8 27.4 H29.2" stroke="#ff76a6" stroke-width="1.6"/>') + buegel("#ff76a6"));
  teil("w", "augen", "glitzermaske", "Glitzermaske",
    '<path fill-rule="evenodd" d="M11 24 Q20 19.5 28 24.5 Q29.5 25.5 31 24.5 Q39 19.5 48 24 Q49 31 43 33.5 Q36 35 31.5 31 Q29.5 29.8 27.5 31 Q23 35 16 33.5 Q10 31 11 24Z M17.2 28.6 a5.2 4.2 0 1 0 10.4 0 a5.2 4.2 0 1 0 -10.4 0Z M31.4 28.6 a5.2 4.2 0 1 0 10.4 0 a5.2 4.2 0 1 0 -10.4 0Z" fill="#ff76a6" stroke="#f7d77c" stroke-width="1"/>' +
    '<circle cx="14" cy="27" r=".6" fill="#fff"/><circle cx="44" cy="29" r=".6" fill="#fff"/><circle cx="18" cy="32" r=".5" fill="#f7d77c"/><circle cx="41" cy="23.5" r=".5" fill="#f7d77c"/>' +
    '<path d="M47 23.5 Q52 14 56 12 Q53 18 50 24Z" fill="#b87cf0"/><path d="M48 23.5 Q52 17 55 13" stroke="#fff" stroke-width=".5" fill="none" opacity=".7"/>');
  teil("w", "augen", "regenbogenbrille", "Regenbogenbrille",
    glaeser('<circle cx="22" cy="28" r="6.6" fill="none" stroke="#ff5c6a" stroke-width="1.1"/><circle cx="22" cy="28" r="5.6" fill="none" stroke="#f3c84b" stroke-width="1.1"/><circle cx="22" cy="28" r="4.6" fill="#fff" fill-opacity=".14" stroke="#5aa9e6" stroke-width="1.1"/>',
      '<path d="M28.6 27.4 Q29 26.2 29.4 27.4" stroke="#b87cf0" stroke-width="1.4" fill="none"/>') + buegel("#b87cf0"));
  teil("w", "augen", "sternchenwimpern", "Sternwimpern",
    glaeser('<path d="M16.8 25 Q22 21.2 27.2 25" stroke="#2a1a12" stroke-width="1.2" fill="none" stroke-linecap="round"/><path d="M18 23.8 L16.2 21.4 M22 22.2 L22 19.6 M26 23.8 L27.8 21.4" stroke="#2a1a12" stroke-width=".9" stroke-linecap="round"/>' +
      stern(16, 20.8, 1.5, "#f3c84b") + stern(22, 18.8, 1.6, "#ff76a6") + stern(28, 20.8, 1.5, "#f3c84b")));

  /* ===== Munkelvogeline: Füße ===== */
  teil("w", "fuesse", "ballerinas", "Ballerinas",
    paar('<path d="M15.6 58.6 Q15.4 55.8 18.4 55.4 L22.6 55 Q24.2 55 24.2 56.4 V58.6Z" fill="#f49ab5"/><path d="M15.6 58.6 H24.2" stroke="#e0789a" stroke-width=".8"/><path d="M18.8 55.6 l-1.4 -1 v2z M18.8 55.6 l1.4 -1 v2z" fill="#fff"/>'));
  teil("w", "fuesse", "gummistiefel_punkte", "Gummistiefel mit Punkten",
    paar('<path d="M20.8 50.8 H25.6 L24.6 55.4 L24.8 58.6 H15.4 Q15.2 55.4 18.6 55 H20.2Z" fill="#ff76a6"/><path d="M15.4 58.6 H24.8" stroke="#d6457a" stroke-width="1"/><circle cx="22.4" cy="52.6" r=".7" fill="#fff"/><circle cx="23.8" cy="55.2" r=".7" fill="#fff"/><circle cx="18.4" cy="56.8" r=".7" fill="#fff"/><circle cx="21.4" cy="57.2" r=".7" fill="#fff"/>'));
  teil("w", "fuesse", "pantoffeln", "Plüschpantoffeln",
    paar('<ellipse cx="19.8" cy="57" rx="5.2" ry="2.8" fill="#ffe0ea"/><circle cx="16.6" cy="56" r="1.6" fill="#fff"/><circle cx="18.2" cy="54.8" r="1.4" fill="#fff"/><circle cx="15.6" cy="57.6" r="1.3" fill="#fff"/><circle cx="16" cy="55.4" r="1.4" fill="#ff8fab"/>'));
  teil("w", "fuesse", "fellstiefel", "Fellstiefel",
    paar('<path d="M20.2 51.6 H26 L25 55.4 L25.2 58.8 H15 Q14.8 55.2 18.4 54.8 H19.8Z" fill="#b08a62"/><path d="M15 58.8 H25.2" stroke="#7a5a3a" stroke-width="1.3"/><rect x="19.6" y="49.8" width="7" height="3" rx="1.5" fill="#fff8f0"/><circle cx="20.4" cy="51.2" r="1" fill="#fff"/><circle cx="25.8" cy="51.2" r="1" fill="#fff"/>'));
  teil("w", "fuesse", "schlittschuhe_weiss", "Weiße Schlittschuhe",
    paar('<path d="M20.6 51 H25.4 L24.4 55 V57.4 H15.6 Q15.4 54.8 18.6 54.4 H20Z" fill="#fff" stroke="#e0dce6" stroke-width=".5"/><path d="M21 52.4 H25 M20.6 53.8 H24.6" stroke="#ff8fab" stroke-width=".6"/><path d="M15 59.8 H25.6 M17 57.4 V59.8 M23.4 57.4 V59.8" stroke="#b8bdcc" stroke-width="1.1" stroke-linecap="round"/>'));
  teil("w", "fuesse", "kuschelsocken", "Kuschelsocken",
    paar('<path d="M23.4 51.4 L21.2 56.4 L17.4 57" stroke="#ffb3c6" stroke-width="4.6" stroke-linecap="round" stroke-linejoin="round" fill="none"/><circle cx="22.8" cy="53" r=".7" fill="#fff"/><circle cx="21" cy="55.8" r=".7" fill="#fff"/><circle cx="18.2" cy="56.6" r=".7" fill="#fff"/><path d="M21.6 51 H25.4" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/>'));
  teil("w", "fuesse", "glitzerschuhe", "Glitzerschuhe",
    paar('<path d="M15.6 58.6 Q15.4 55.6 18.6 55 L22.6 54.6 Q24.2 54.6 24.2 56 V58.6Z" fill="#e9b949"/><circle cx="17.4" cy="57" r=".5" fill="#fff"/><circle cx="19.6" cy="56" r=".5" fill="#fff3c4"/><circle cx="21.6" cy="57.4" r=".5" fill="#fff"/><circle cx="23" cy="55.8" r=".5" fill="#fff3c4"/><path d="M15.6 58.6 H24.2" stroke="#b8862f" stroke-width=".8"/>'));
  teil("w", "fuesse", "ringelsocken_w", "Ringelsocken",
    paar('<path d="M23.4 51.6 L21.2 56.4 L17.4 57" stroke="#9b6fd6" stroke-width="3.8" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M21.6 52.6 L24.8 53.4 M20.8 54.6 L23.8 55.4 M18.6 55.6 L18.6 58.4" stroke="#fff" stroke-width="1" fill="none"/>'));
  teil("w", "fuesse", "stiefeletten", "Stiefeletten",
    paar('<path d="M20.6 52.4 H25.4 L24.6 55.4 L24.8 57.6 H22.8 L22.6 58.8 H15.4 Q15.2 55.6 18.6 55.2 H20.2Z" fill="#26355e"/><path d="M22.8 57.6 V58.8 H24.6 V57.6" fill="#14203d"/><path d="M21 53.6 H25" stroke="#e0b04e" stroke-width=".6"/>'));
  teil("w", "fuesse", "high_heels", "High Heels",
    paar('<path d="M15.8 58.4 Q16 56 18.4 55.8 L22.4 53.6 Q24.2 52.8 24.6 54.2 L24.4 55.6 L24.6 59 H23.4 L23 56.6 Q20 57.6 17.6 58.6Z" fill="#ff4d8d"/><path d="M18.4 55.8 Q20.4 55.4 22.2 54.2" stroke="#fff" stroke-width=".6" opacity=".7"/>'));
  teil("w", "fuesse", "rollschuhe_pink", "Pinke Rollschuhe",
    paar('<path d="M20.6 51 H25.4 L24.4 55 V57 H15.6 Q15.4 54.6 18.6 54.2 H20Z" fill="#ff8fab"/><path d="M21 52.6 H25 M20.6 54 H24.6" stroke="#fff" stroke-width=".7"/><rect x="15.4" y="57" width="9.4" height="1.2" fill="#c9ced8"/>' +
      '<circle cx="17.6" cy="59.2" r="1.5" fill="#9fd8f2"/><circle cx="22.6" cy="59.2" r="1.5" fill="#9fd8f2"/>'));
  teil("w", "fuesse", "glitzerballerinas", "Glitzerballerinas",
    paar('<path d="M15.6 58.6 Q15.4 55.8 18.4 55.4 L22.6 55 Q24.2 55 24.2 56.4 V58.6Z" fill="#d6dbe6"/><circle cx="17.4" cy="57.2" r=".55" fill="#fff"/><circle cx="19.8" cy="56.2" r=".55" fill="#ffb3c6"/><circle cx="22" cy="57.4" r=".55" fill="#fff"/><path d="M15.6 58.6 H24.2" stroke="#a0a6b8" stroke-width=".8"/>' + stern(19.6, 55.4, 1.2, "#ff76a6")));

  /* ===== Munkelvogeline: Extra ===== */
  teil("w", "extra", "handtasche", "Handtasche",
    '<path d="M46.5 41 Q50.5 33.5 54.5 41" fill="none" stroke="#c45a7e" stroke-width="1.3"/><path d="M44.5 41 H56.5 L55.4 51 Q50.5 52.6 45.6 51Z" fill="#f49ab5"/><path d="M44.5 41 H56.5 L55.8 44.6 Q50.5 46.6 45.2 44.6Z" fill="#e0789a"/><circle cx="50.5" cy="45" r="1.1" fill="#f7d77c"/>');
  teil("w", "extra", "blumenstrauss", "Blumenstrauß",
    '<path d="M49 52 L46 38 M50.5 52 L50.5 36 M52 52 L55 38" stroke="#5a9a4a" stroke-width="1"/>' + blume(46, 37, 3, "#ff8fab") + blume(50.5, 34.4, 3.2, "#fff", "#f3c84b") + blume(55.2, 37.4, 3, "#d9c2ff") +
    '<path d="M46.5 43 L54.5 43 L52 53 H49Z" fill="#fff4e6" stroke="#f2bccb" stroke-width=".6"/><path d="M48.6 47 H52.4" stroke="#ff76a6" stroke-width="1.2"/>');
  teil("w", "extra", "herzballon", "Herzballon",
    '<path d="M47.5 48 Q51 40 52.6 34 Q54 28 53.4 21" stroke="#9a9aa8" stroke-width=".7" fill="none"/>' + herz(54, 14.6, 7.6, "#ff4d7d") + '<ellipse cx="50.6" cy="11.2" rx="1.4" ry="2.4" fill="#fff" opacity=".5" transform="rotate(30 50.6 11.2)"/>');
  teil("w", "extra", "muff", "Muff",
    '<rect x="43.5" y="40" width="14" height="10" rx="5" fill="#fff" stroke="#ddd8e8" stroke-width=".7"/><circle cx="45" cy="41.5" r="1.8" fill="#fff"/><circle cx="56" cy="41.5" r="1.8" fill="#fff"/><circle cx="45" cy="48.5" r="1.8" fill="#fff"/><circle cx="56" cy="48.5" r="1.8" fill="#fff"/>' +
    '<ellipse cx="57.4" cy="45" rx="1.6" ry="4" fill="#e8e4f0"/><path d="M47 43 Q50.5 42 54 43 M47 47 Q50.5 48 54 47" stroke="#ece8f4" stroke-width=".8" fill="none"/><circle cx="50.5" cy="45" r="1.2" fill="#b896ea"/>');
  teil("w", "extra", "zuckerstange", "Zuckerstange",
    '<path d="M48 54 V34 Q48 28.5 52.5 28.5 Q57 28.5 57 33" fill="none" stroke="#fff" stroke-width="3.4" stroke-linecap="round"/><path d="M48 54 V34 Q48 28.5 52.5 28.5 Q57 28.5 57 33" fill="none" stroke="#d6304f" stroke-width="3.4" stroke-linecap="round" stroke-dasharray="2 2.2"/>');
  teil("w", "extra", "schneekugel", "Schneekugel",
    '<circle cx="50.5" cy="41" r="7" fill="#d9f0ff" fill-opacity=".55" stroke="#bfe0f5" stroke-width=".8"/><path d="M50.5 36.5 L47.5 43.5 H53.5Z" fill="#3f9a55"/><rect x="50" y="43.5" width="1" height="1.6" fill="#7a4a2a"/>' +
    '<circle cx="47" cy="38.4" r=".5" fill="#fff"/><circle cx="54" cy="39.6" r=".5" fill="#fff"/><circle cx="52" cy="36.4" r=".5" fill="#fff"/><circle cx="48.4" cy="44.8" r=".5" fill="#fff"/><path d="M46 37.4 Q47.4 35.4 49.6 34.8" stroke="#fff" stroke-width=".9" fill="none" opacity=".8"/>' +
    '<path d="M44.5 46.5 H56.5 L55 51 H46Z" fill="#c9a23a"/><path d="M45.2 48.4 H55.8" stroke="#e9c86a" stroke-width=".7"/>');
  teil("w", "extra", "pompons", "Pompons",
    [[47, 41, "#3f9a55"], [54.5, 43.5, "#e9b949"]].map(([x, y, f]) => {
      let s = "";
      for (let k = 0; k < 12; k++) { const w = (k / 12) * Math.PI * 2; s += '<path d="M' + x + " " + y + "L" + (x + Math.cos(w) * 5).toFixed(2) + " " + (y + Math.sin(w) * 5).toFixed(2) + '" stroke="' + f + '" stroke-width="1.6" stroke-linecap="round"/>'; }
      return s + '<circle cx="' + x + '" cy="' + y + '" r="2" fill="' + f + '"/>';
    }).join(""));
  teil("w", "extra", "gluecksschwein", "Glücksschwein",
    '<ellipse cx="50.5" cy="46" rx="6.4" ry="5" fill="#ffb3c6"/><circle cx="55.6" cy="44" r="3.4" fill="#ffb3c6"/><ellipse cx="58" cy="44.6" rx="1.5" ry="1.2" fill="#ff8fab"/><circle cx="57.6" cy="44.4" r=".3" fill="#c45a7e"/><circle cx="58.4" cy="44.4" r=".3" fill="#c45a7e"/>' +
    '<circle cx="55.6" cy="42.8" r=".55" fill="#2a1a12"/><path d="M53.6 41 L54.4 39.2 L55.6 40.8Z" fill="#ff8fab"/><path d="M46.6 50 V52.4 M49.4 50.6 V52.8 M52.4 50.6 V52.8 M54.6 49.8 V52.2" stroke="#ff8fab" stroke-width="1.4" stroke-linecap="round"/>' +
    '<path d="M44.4 45 Q42.6 44 43.4 42.6 Q44.4 41.6 44.4 43.4" stroke="#ff8fab" stroke-width=".8" fill="none"/><g transform="translate(51 42.2) scale(.55)">' + [0, 90, 180, 270].map((w) => herz(0, -2.4, 2.2, "#3f9a55", ' transform="rotate(' + (w + 45) + ')"')).join("") + "</g>");
  teil("w", "extra", "faehnchen", "Fähnchen mit Toni",
    '<path d="M47 54 V27" stroke="#8a5a3a" stroke-width="1.2" stroke-linecap="round"/><path d="M47.4 27.5 H60 L57.6 32 L60 36.5 H47.4Z" fill="#ff76a6"/>' + text(53.2, 33.6, "Toni", "#fff", 4) + '<circle cx="47" cy="26.6" r="1" fill="#f7d77c"/>');
  teil("w", "extra", "wunderkerze", "Wunderkerze",
    '<path d="M46 53 L54 31" stroke="#8a8fa0" stroke-width="1.1" stroke-linecap="round"/><path d="M51.4 38 L54 31" stroke="#5a5f6e" stroke-width="1.6" stroke-linecap="round"/>' +
    '<g class="ankleide-funkeln">' + stern(54.4, 30, 3.6, "#fff3c4") + '<path d="M54.4 24 V26.4 M54.4 33.6 V36 M48.4 30 H50.8 M58 30 H60.4 M50.2 25.8 L51.8 27.4 M57 32.6 L58.6 34.2 M58.6 25.8 L57 27.4 M51.8 32.6 L50.2 34.2" stroke="#ffd36b" stroke-width=".8" stroke-linecap="round"/></g>');
  teil("w", "extra", "toertchen", "Törtchen",
    '<path d="M45 45 H56 L54.6 53 H46.4Z" fill="#f49ab5"/><path d="M47.2 45 L48 53 M50.5 45 V53 M53.8 45 L53 53" stroke="#e0789a" stroke-width=".7"/>' +
    '<path d="M44.4 45.4 Q44 40.6 48 41 Q49 37.6 52.4 38.4 Q56.6 38.6 56.6 42.4 Q57.4 45 56.6 45.4Z" fill="#fff6f0"/><circle cx="48" cy="42.6" r=".6" fill="#ff4d7d"/><circle cx="53.6" cy="42" r=".6" fill="#5aa9e6"/><circle cx="51" cy="43.6" r=".6" fill="#f3c84b"/>' +
    '<rect x="50" y="32.6" width="1.2" height="6" fill="#9fd8f2"/><path d="M50.6 29.4 Q52 31.4 50.6 32.6 Q49.2 31.4 50.6 29.4Z" fill="#ffb84d"/>');
  teil("w", "extra", "mikrofon", "Mikrofon",
    '<g transform="rotate(-24 50.5 42)"><rect x="49" y="40" width="3" height="13" rx="1.4" fill="#2a2a38"/><circle cx="50.5" cy="37.4" r="4.2" fill="#c9ced8"/><path d="M47 36 H54 M46.6 38.4 H54.4 M48.2 34 V40.6 M50.5 33.4 V41.4 M52.8 34 V40.6" stroke="#8a8fa0" stroke-width=".55"/><rect x="48.4" y="41" width="4.2" height="1.6" rx=".6" fill="#ff4d8d"/></g>');

  const KATEGORIEN = [
    { id: "kopf", name: "Kopf", symbol: "🎩" },
    { id: "hals", name: "Hals", symbol: "🧣" },
    { id: "augen", name: "Augen", symbol: "👓" },
    { id: "fuesse", name: "Füße", symbol: "👟" },
    { id: "extra", name: "Extra", symbol: "🎒" },
  ];
  const finde = (wer, kat, id) => (K[wer][kat] || []).find((t) => t.id === id) || null;

  /* ---------- Runden ---------- */
  // Runde 1 bis 4 im November (je 3 Tage), Runde 5 am 1.12. mit allen Teilen
  const RUNDEN = [
    { nr: 1, monat: 11, von: 16, bis: 18 },
    { nr: 2, monat: 11, von: 19, bis: 21 },
    { nr: 3, monat: 11, von: 22, bis: 24 },
    { nr: 4, monat: 11, von: 25, bis: 27 },
    { nr: 5, monat: 12, von: 1, bis: 3, finale: true },
  ];
  function aktuelleRunde() {
    if (ak.zeitreise && ak.zeitreise.aktiv()) return null;
    const d = ak.intro.datum();
    if (d.jahr !== KALENDER.jahr) return null;
    return RUNDEN.find((r) => r.monat === d.monat && d.tag >= r.von && d.tag <= r.bis) || null;
  }
  // welche Teile es in einer Runde zur Auswahl gibt
  const teileDerRunde = (wer, kat, runde) => (K[wer][kat] || []).filter((t) => (runde.finale ? true : t.runde === runde.nr));

  /* ---------- Speichern ---------- */
  const SCHLUESSEL = "toni-wz-outfit";
  const leer = () => ({ m: {}, w: {} });
  function lies() {
    try {
      const s = JSON.parse(localStorage.getItem(SCHLUESSEL) || "null");
      if (s && s.outfit && s.outfit.m && s.outfit.w) return { outfit: s.outfit, runden: Array.isArray(s.runden) ? s.runden : [] };
    } catch (_) { /* egal */ }
    return { outfit: leer(), runden: [] };
  }
  function schreib(stand) { try { localStorage.setItem(SCHLUESSEL, JSON.stringify(stand)); } catch (_) { /* egal */ } }
  let stand = lies();

  // Was der Vogel gerade trägt (vor dem 16.11. noch nichts)
  function outfit(weiblich) {
    const d = ak.intro.datum();
    if (d.jahr === KALENDER.jahr && d.monat === 11 && d.tag < 16) return {};
    return stand.outfit[weiblich ? "w" : "m"] || {};
  }
  // Grafik der Kleidung, nach Schichten getrennt, damit vogel.js sie an der richtigen Stelle einsetzt
  function schichten(weiblich, eigenes) {
    const wer = weiblich ? "w" : "m", o = eigenes || outfit(weiblich), s = {};
    for (const k of KATEGORIEN) { const t = o[k.id] && finde(wer, k.id, o[k.id]); s[k.id] = t ? '<g class="ankleide-' + k.id + '">' + t.svg + "</g>" : ""; }
    return s;
  }

  /* ---------- Ankleidezimmer ---------- */
  const dialog = document.createElement("dialog");
  dialog.className = "ankleide";
  dialog.setAttribute("aria-label", "Ankleidezimmer");
  dialog.innerHTML =
    '<div class="ankleide-kopf"><h2>Ankleidezimmer ✨</h2><p class="ankleide-unter"></p><button class="schliessen ankleide-zu" type="button" aria-label="Schließen">×</button></div>' +
    '<div class="ankleide-buehne"><button type="button" class="ankleide-figur" data-wer="m" aria-label="Munkelvogel einkleiden"></button><button type="button" class="ankleide-figur" data-wer="w" aria-label="Munkelvogeline einkleiden"></button></div>' +
    '<div class="ankleide-reiter" role="tablist"><button type="button" role="tab" data-wer="m">Munkelvogel</button><button type="button" role="tab" data-wer="w">Munkelvogeline</button></div>' +
    '<div class="ankleide-liste"></div>' +
    '<div class="ankleide-fuss"><button type="button" class="ankleide-fertig">Fertig ✨</button></div>';
  document.body.appendChild(dialog);
  const unter = dialog.querySelector(".ankleide-unter"), liste = dialog.querySelector(".ankleide-liste");
  const figuren = { m: dialog.querySelector('.ankleide-figur[data-wer="m"]'), w: dialog.querySelector('.ankleide-figur[data-wer="w"]') };
  let entwurf = leer(), wer = "m", offeneRunde = null;

  const svgVogel = (weiblich, o) => (ak.voegel && ak.voegel.svg ? ak.voegel.svg(weiblich, o) : "");
  function zeichneFiguren() {
    for (const w of ["m", "w"]) {
      figuren[w].innerHTML = svgVogel(w === "w", entwurf[w]) + '<span class="ankleide-name">' + (w === "m" ? "Munkelvogel" : "Munkelvogeline") + "</span>";
      figuren[w].classList.toggle("aktiv", w === wer);
    }
    dialog.querySelectorAll(".ankleide-reiter button").forEach((b) => { const an = b.dataset.wer === wer; b.classList.toggle("aktiv", an); b.setAttribute("aria-selected", an ? "true" : "false"); });
  }
  // kleines Bild eines Teils: die Zeichnung allein, passend zugeschnitten
  function kachelBild(t) {
    const ns = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(ns, "svg");
    svg.setAttribute("aria-hidden", "true");
    svg.innerHTML = '<g class="ankleide-teil">' + t.svg + "</g>";
    return svg;
  }
  function passeAn(svg) {
    try {
      const b = svg.querySelector("g").getBBox();
      const r = Math.max(b.width, b.height) / 2 + 1.6, cx = b.x + b.width / 2, cy = b.y + b.height / 2;
      svg.setAttribute("viewBox", (cx - r).toFixed(2) + " " + (cy - r).toFixed(2) + " " + (2 * r).toFixed(2) + " " + (2 * r).toFixed(2));
    } catch (_) { svg.setAttribute("viewBox", "0 0 60 60"); }
  }
  function zeichneListe() {
    liste.innerHTML = "";
    const bilder = [];
    for (const k of KATEGORIEN) {
      const angebot = teileDerRunde(wer, k.id, offeneRunde);
      const jetzt = entwurf[wer][k.id] && finde(wer, k.id, entwurf[wer][k.id]);
      // ein Teil aus einer früheren Runde, das gerade getragen wird, darf bleiben
      const bisher = jetzt && !angebot.includes(jetzt) ? jetzt : null;
      const reihe = document.createElement("section");
      reihe.className = "ankleide-reihe";
      reihe.innerHTML = '<h3><span aria-hidden="true">' + k.symbol + "</span> " + k.name + '</h3><div class="ankleide-kacheln" role="radiogroup" aria-label="' + k.name + '"></div>';
      const kacheln = reihe.querySelector(".ankleide-kacheln");
      const kachel = (t, titel, zusatz) => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "ankleide-kachel" + (zusatz || "");
        b.setAttribute("role", "radio");
        const an = t ? entwurf[wer][k.id] === t.id : !entwurf[wer][k.id];
        b.setAttribute("aria-checked", an ? "true" : "false");
        b.classList.toggle("an", an);
        if (t) { const svg = kachelBild(t); b.appendChild(svg); bilder.push(svg); }
        else b.insertAdjacentHTML("beforeend", '<span class="ankleide-ohne" aria-hidden="true">⊘</span>');
        b.insertAdjacentHTML("beforeend", '<span class="ankleide-titel">' + titel + "</span>");
        b.addEventListener("click", () => {
          if (t) entwurf[wer][k.id] = t.id; else delete entwurf[wer][k.id];
          zeichneFiguren();
          kacheln.querySelectorAll(".ankleide-kachel").forEach((x) => { x.classList.remove("an"); x.setAttribute("aria-checked", "false"); });
          b.classList.add("an"); b.setAttribute("aria-checked", "true");
          if (!ruhig) b.animate([{ transform: "scale(.9)" }, { transform: "scale(1.06)" }, { transform: "scale(1)" }], { duration: 280, easing: "ease-out" });
        });
        kacheln.appendChild(b);
      };
      kachel(null, "Ohne");
      if (bisher) kachel(bisher, "Bisher: " + bisher.name, " bisher");
      angebot.forEach((t) => kachel(t, t.name));
      liste.appendChild(reihe);
    }
    // erst im Dokument lässt sich die Größe der Zeichnung messen
    requestAnimationFrame(() => bilder.forEach(passeAn));
  }
  function waehle(neu) { wer = neu; zeichneFiguren(); zeichneListe(); liste.scrollTop = 0; }
  dialog.querySelectorAll(".ankleide-reiter button, .ankleide-figur").forEach((b) => b.addEventListener("click", () => waehle(b.dataset.wer)));

  function oeffnen() {
    offeneRunde = aktuelleRunde();
    if (!offeneRunde) return;
    stand = lies();
    entwurf = JSON.parse(JSON.stringify(stand.outfit));
    const r = offeneRunde, bis = r.bis + "." + r.monat + ".";
    unter.textContent = r.finale ? "Das letzte Umstyling: Stell das schönste Outfit für die Weihnachtszeit zusammen 🎄" : "Runde " + r.nr + " von 4 · dieser Look bleibt bis zum " + (r.nr === 4 ? "27.11." : bis);
    wer = "m";
    zeichneFiguren(); zeichneListe();
    if (typeof dialog.showModal === "function") dialog.showModal(); else dialog.setAttribute("open", "");
  }
  function fertig() {
    if (!dialog.open) return;
    stand.outfit = entwurf;
    if (offeneRunde && !stand.runden.includes(offeneRunde.nr)) stand.runden.push(offeneRunde.nr);
    schreib(stand);
    dialog.close();
    if (ak.voegel && ak.voegel.einkleiden) ak.voegel.einkleiden(true);
    aktualisiereKnoepfe();
  }
  dialog.querySelector(".ankleide-fertig").addEventListener("click", fertig);
  dialog.querySelector(".ankleide-zu").addEventListener("click", fertig);
  dialog.addEventListener("cancel", (e) => { e.preventDefault(); fertig(); });
  // Klick neben die Karte (auf den Hintergrund) schließt ebenfalls
  dialog.addEventListener("click", (e) => { if (e.target === dialog) fertig(); });

  /* ---------- Knöpfe ---------- */
  const knopfHtml = '<span aria-hidden="true">👗</span> Umstylen';
  // auf der Seite mit dem Umschlag neben dem Capy-Spiel
  const introKnopf = document.createElement("button");
  introKnopf.type = "button";
  introKnopf.className = "special-knopf intro-umstylen";
  introKnopf.hidden = true;
  introKnopf.innerHTML = knopfHtml;
  introKnopf.addEventListener("click", oeffnen);
  // im Kalender neben den anderen Knöpfen
  const kalenderKnopf = document.createElement("button");
  kalenderKnopf.type = "button";
  kalenderKnopf.className = "sammlung-knopf knopf-umstylen";
  kalenderKnopf.hidden = true;
  kalenderKnopf.innerHTML = knopfHtml;
  kalenderKnopf.addEventListener("click", oeffnen);
  function setzeKnoepfe() {
    const intro = document.getElementById("intro");
    const reihe = intro && intro.querySelector(".intro-knoepfe");
    if (reihe && introKnopf.parentNode !== reihe) reihe.appendChild(introKnopf);
    else if (!reihe && intro && !introKnopf.parentNode) intro.appendChild(introKnopf);
    const spiel = document.getElementById("spiel-knopf");
    if (spiel && !kalenderKnopf.parentNode) spiel.after(kalenderKnopf);
  }
  function aktualisiereKnoepfe() {
    if (!ak.intro.bereit()) return;
    setzeKnoepfe();
    const r = aktuelleRunde(), phase = ak.intro.phase();
    const intro = document.getElementById("intro");
    introKnopf.hidden = !(r && intro && !intro.hidden && (phase === "warten" || phase === "geburtstag")) || !!document.querySelector(".special-buehne");
    kalenderKnopf.hidden = !(r && phase === "offen");
    // in einer neuen Runde, bevor Toni gewählt hat, funkelt der Knopf ein bisschen
    const neu = !!(r && !stand.runden.includes(r.nr));
    introKnopf.classList.toggle("neu", neu); kalenderKnopf.classList.toggle("neu", neu);
  }
  setInterval(aktualisiereKnoepfe, 500);

  window.adventkalender.styling = {
    schichten,
    oeffnen,
    // soll der Munkelvogel heute nach einem neuen Look fragen?
    frageText: () => {
      const r = aktuelleRunde();
      if (!r || stand.runden.includes(r.nr)) return null;
      if (r.finale) return "Toni, jetzt kommt das letzte Umstyling! Stellst du uns das schönste Outfit für die Weihnachtszeit zusammen? 🎄";
      if (r.nr === 1) return "Toni, ich brauch einen neuen Look! Suchst du uns was Schönes zum Anziehen aus? 👗";
      return "Toni, Zeit für ein Umstyling! Suchst du uns was Neues zum Anziehen aus? 👗";
    },
    gewaehlt: (nr) => stand.runden.includes(nr),
    offen: () => !!aktuelleRunde(),
    KLEIDUNG: K,
    KATEGORIEN,
  };
})();
