/*
 * ===========================================================
 *  WINTERNEST
 *  Am 19.11. fragt die Munkelvogeline (wenn sie da ist), ob
 *  Toni den beiden ein Winternest baut. Toni wählt Zweige,
 *  Polster, Decke und Deko. Das Nest steht dann auf der
 *  Fensterbank; tagsüber landen die Vögel manchmal darin,
 *  ab 22:30 Uhr schlafen beide darin.
 * ===========================================================
 */
(function () {
  "use strict";

  const ak = window.adventkalender;
  const intro = document.getElementById("intro");
  if (!ak || !ak.intro || !intro) return;
  const ruhig = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const f1 = (n) => n.toFixed(1);

  /* ---------- Material ---------- */
  const ZWEIGE = {
    hasel: { name: "Haselzweige", f: "#8a5a34", hell: "#a8744a", dunkel: "#5e3a20" },
    birke: { name: "Birkenzweige", f: "#d9cfbf", hell: "#efe7da", dunkel: "#8f857a", flecken: "#3a3430" },
    tanne: { name: "Tannenzweige", f: "#5a7a4a", hell: "#7aa363", dunkel: "#3f5a33", nadeln: true },
    weide: { name: "Weidenruten", f: "#a0523a", hell: "#c06e52", dunkel: "#6e3424" },
  };
  const POLSTER = {
    moos: { name: "Moos", f: "#7aa35a", f2: "#5f8a45" },
    stroh: { name: "Stroh", f: "#ecc96f", f2: "#d4a94a", halme: true },
    wolle_rosa: { name: "Rosa Wolle", f: "#f6a5bd", f2: "#e8829f", wolle: true },
    wolle_mint: { name: "Mintwolle", f: "#a8e0cc", f2: "#7cc7ad", wolle: true },
    watte: { name: "Watte", f: "#ffffff", f2: "#e6e9f2" },
  };
  const DECKE = {
    karo: { name: "Rot kariert", f: "#d6304f", muster: "karo" },
    strick: { name: "Rosa Strick", f: "#f49ab5", muster: "strick" },
    sterne: { name: "Sternendecke", f: "#3f5fa8", muster: "sterne" },
    herzen: { name: "Creme mit Herzen", f: "#f6eadb", muster: "herzen" },
  };
  const DEKO = {
    lichter: { name: "Mini-Lichter" },
    federn: { name: "Federn" },
    beeren: { name: "Beeren und Tanne" },
    herzen: { name: "Herzgirlande" },
  };
  const KATEGORIEN = [
    { id: "zweige", name: "Zweige", symbol: "🪵", liste: ZWEIGE, pflicht: true },
    { id: "polster", name: "Polster", symbol: "☁️", liste: POLSTER, pflicht: true },
    { id: "decke", name: "Decke", symbol: "🧣", liste: DECKE },
    { id: "deko", name: "Deko", symbol: "✨", liste: DEKO },
  ];
  const STANDARD = { zweige: "hasel", polster: "moos" };

  /* ---------- Zeichnung des Nests (viewBox 0 0 120 78) ---------- */
  const herzPfad = (x, y, s, f) => '<path d="M' + x + " " + f1(y + s * 0.85) + " C" + f1(x - s * 1.25) + " " + f1(y - s * 0.05) + " " + f1(x - s * 0.6) + " " + f1(y - s * 1.05) + " " + x + " " + f1(y - s * 0.35) +
    " C" + f1(x + s * 0.6) + " " + f1(y - s * 1.05) + " " + f1(x + s * 1.25) + " " + f1(y - s * 0.05) + " " + x + " " + f1(y + s * 0.85) + 'Z" fill="' + f + '"/>';
  function stern(x, y, r, f) {
    let d = "";
    for (let k = 0; k < 10; k++) { const rr = k % 2 ? r * 0.45 : r, w = (k / 10) * Math.PI * 2 - Math.PI / 2; d += (k ? "L" : "M") + f1(x + Math.cos(w) * rr) + " " + f1(y + Math.sin(w) * rr); }
    return '<path d="' + d + 'Z" fill="' + f + '"/>';
  }
  // ein Vogel als eingebettetes Bild, die Füße stecken im Nest
  function vogelIm(weiblich, x, groesse, blick) {
    if (!ak.voegel || !ak.voegel.svg) return "";
    const svg = ak.voegel.svg(weiblich);
    const spiegel = blick < 0 ? ' transform="translate(' + f1(2 * x + groesse) + ' 0) scale(-1 1)"' : "";
    return "<g" + spiegel + ">" + svg.replace("<svg ", '<svg x="' + x + '" y="2" width="' + groesse + '" height="' + groesse + '" ') + "</g>";
  }
  function nestSvg(w, mitVoegeln) {
    const z = ZWEIGE[w.zweige] || ZWEIGE.hasel, p = POLSTER[w.polster] || POLSTER.moos;
    let s = '<svg viewBox="0 0 120 78" aria-hidden="true" class="nest-bild">';
    // Rückseite und Mulde
    s += '<ellipse cx="60" cy="42" rx="53" ry="14" fill="' + z.dunkel + '"/><ellipse cx="60" cy="42" rx="45" ry="9" fill="#3a2418"/>';
    // Polster innen (oben sichtbar)
    for (let k = 0; k < 13; k++) { const x = 18 + k * 7, y = 36.5 + Math.sin(k * 1.7) * 1.2; s += '<circle cx="' + x + '" cy="' + f1(y) + '" r="' + (p.wolle ? 3.6 : 3.2) + '" fill="' + (k % 2 ? p.f : p.f2) + '"/>'; }
    // die Vögel sitzen im Nest
    if (mitVoegeln) s += vogelIm(false, 16, 44, 1) + vogelIm(true, 58, 44, -1);
    // Vorderseite aus Zweigen
    s += '<path d="M7 42 Q8 76 60 76 Q112 76 113 42 Q60 58 7 42Z" fill="' + z.f + '"/>';
    for (let k = 0; k < 7; k++) {
      const y = 47 + k * 4, b = 50 - k * 4.5;
      s += '<path d="M' + f1(60 - b) + " " + f1(y) + " Q60 " + f1(y + 10 - k) + " " + f1(60 + b) + " " + f1(y) + '" fill="none" stroke="' + (k % 2 ? z.hell : z.dunkel) + '" stroke-width="2" stroke-linecap="round"/>';
    }
    // abstehende Zweigenden
    for (const [x1, y1, x2, y2] of [[9, 47, 1, 43], [13, 58, 4, 60], [111, 47, 119, 42], [106, 60, 116, 63], [30, 72, 24, 77], [92, 72, 99, 77]]) s += '<path d="M' + x1 + " " + y1 + "L" + x2 + " " + y2 + '" stroke="' + z.dunkel + '" stroke-width="2" stroke-linecap="round"/>';
    if (z.flecken) for (const [x, y] of [[25, 54], [48, 62], [72, 58], [95, 52], [60, 70]]) s += '<rect x="' + x + '" y="' + y + '" width="4" height="1.4" rx=".7" fill="' + z.flecken + '"/>';
    if (z.nadeln) for (let k = 0; k < 18; k++) { const x = 12 + k * 5.5, y = 44 + Math.sin(k) * 2; s += '<path d="M' + f1(x) + " " + f1(y) + "l-3 4M" + f1(x) + " " + f1(y) + 'l3 4" stroke="' + z.hell + '" stroke-width="1.2" stroke-linecap="round"/>'; }
    // Polster über dem vorderen Rand
    for (let k = 0; k < 16; k++) {
      const t = k / 15, x = 9 + t * 102, y = 42 + Math.sin(t * Math.PI) * 7.5;
      s += p.halme
        ? '<path d="M' + f1(x) + " " + f1(y) + "l" + f1(((k % 3) - 1) * 3) + ' -5" stroke="' + (k % 2 ? p.f : p.f2) + '" stroke-width="1.6" stroke-linecap="round"/>'
        : '<circle cx="' + f1(x) + '" cy="' + f1(y) + '" r="' + (p.wolle ? 3.4 : 3) + '" fill="' + (k % 2 ? p.f : p.f2) + '"/>';
    }
    // Decke über der Vorderseite
    const d = DECKE[w.decke];
    if (d) {
      s += '<path d="M16 46 Q36 54 64 52 L60 70 Q40 74 22 66 Z" fill="' + d.f + '"/>';
      if (d.muster === "karo") s += '<path d="M24 50v18M34 52v19M44 53v19M54 53v18M18 56 L62 57M20 62 L60 63" stroke="#fff" stroke-width="1.6" opacity=".7"/>';
      if (d.muster === "strick") s += '<path d="M20 52 l4 4 4 -4 4 4 4 -4 4 4 4 -4 4 4 4 -4 4 4 M22 60 l4 4 4 -4 4 4 4 -4 4 4 4 -4 4 4 4 -4" fill="none" stroke="#fde0e8" stroke-width="1.2"/>';
      if (d.muster === "sterne") s += stern(26, 57, 2.6, "#f7d77c") + stern(40, 62, 2.2, "#fff3c4") + stern(52, 57, 2.4, "#f7d77c") + stern(34, 67, 1.8, "#fff3c4") + stern(50, 66, 1.6, "#f7d77c");
      if (d.muster === "herzen") s += herzPfad(26, 57, 2.6, "#ff76a6") + herzPfad(40, 62, 2.4, "#e8455a") + herzPfad(53, 57, 2.4, "#ff76a6") + herzPfad(34, 67, 1.8, "#e8455a");
      s += '<path d="M22 66 Q40 74 60 70" stroke="rgba(0,0,0,.15)" stroke-width="1.2" fill="none"/>';
    }
    // Deko
    if (w.deko === "lichter") {
      s += '<path d="M8 44 Q60 60 112 44" fill="none" stroke="#3a5a3a" stroke-width="1"/>';
      ["#ff4d7d", "#f3c84b", "#5aa9e6", "#6fd17a", "#b87cf0", "#ff8a3d", "#ff4d7d", "#f3c84b"].forEach((f, k) => {
        const t = (k + 0.5) / 8, x = (1 - t) * (1 - t) * 8 + 2 * (1 - t) * t * 60 + t * t * 112, y = (1 - t) * (1 - t) * 44 + 2 * (1 - t) * t * 60 + t * t * 44;
        s += '<g class="nest-licht' + (k % 2 ? " b" : "") + '"><circle cx="' + f1(x) + '" cy="' + f1(y + 3) + '" r="5" fill="' + f + '" opacity=".3"/><ellipse cx="' + f1(x) + '" cy="' + f1(y + 3) + '" rx="2.2" ry="3" fill="' + f + '"/></g>';
      });
    } else if (w.deko === "federn") {
      s += '<g transform="rotate(25 104 34)"><path d="M104 46 Q100 30 104 16 Q110 30 104 46Z" fill="#f6a5bd"/><path d="M104 44 V18" stroke="#c45a7e" stroke-width=".8"/></g>' +
        '<g transform="rotate(-15 112 38)"><path d="M112 48 Q108 34 112 22 Q117 34 112 48Z" fill="#9fd8f2"/><path d="M112 46 V24" stroke="#4a8fc6" stroke-width=".8"/></g>' +
        '<g transform="rotate(-30 12 38)"><path d="M12 48 Q8 34 12 22 Q17 34 12 48Z" fill="#f7d77c"/><path d="M12 46 V24" stroke="#c99528" stroke-width=".8"/></g>';
    } else if (w.deko === "beeren") {
      let zw = "";
      for (let k = 0; k < 7; k++) { const x = 92 + k * 3.2, y = 40 - k * 2; zw += '<path d="M' + f1(x) + " " + f1(y) + "l-4 -4M" + f1(x) + " " + f1(y) + 'l4 -3" stroke="#3f7f55" stroke-width="1.6" stroke-linecap="round"/>'; }
      s += '<path d="M90 42 L114 28" stroke="#6b4a2a" stroke-width="1.4"/>' + zw +
        '<circle cx="96" cy="44" r="3.2" fill="#d6304f"/><circle cx="101" cy="45.5" r="3" fill="#c22545"/><circle cx="98.5" cy="49" r="2.8" fill="#e0405f"/><circle cx="95" cy="43" r=".9" fill="#fff" opacity=".7"/>';
    } else if (w.deko === "herzen") {
      s += '<path d="M8 44 Q60 60 112 44" fill="none" stroke="#c45a7e" stroke-width=".9"/>';
      for (let k = 0; k < 7; k++) {
        const t = (k + 0.5) / 7, x = (1 - t) * (1 - t) * 8 + 2 * (1 - t) * t * 60 + t * t * 112, y = (1 - t) * (1 - t) * 44 + 2 * (1 - t) * t * 60 + t * t * 44;
        s += herzPfad(Math.round(x * 10) / 10, Math.round((y + 3) * 10) / 10, 2.6, k % 2 ? "#ff76a6" : "#e8455a");
      }
    }
    // schlafende Vögel: Zzz
    if (mitVoegeln === "schlaf") s += '<text class="nest-z z1" x="40" y="12" font-size="7" font-weight="800" fill="#e6dcff">z</text><text class="nest-z z2" x="86" y="10" font-size="6" font-weight="800" fill="#e6dcff">z</text>';
    return s + "</svg>";
  }

  /* ---------- Speichern ---------- */
  const SCHLUESSEL = "toni-wz-nest";
  function lies() { try { const s = JSON.parse(localStorage.getItem(SCHLUESSEL) || "{}"); return s && typeof s === "object" ? s : {}; } catch (_) { return {}; } }
  function schreib(s) { try { localStorage.setItem(SCHLUESSEL, JSON.stringify(s)); } catch (_) { /* egal */ } }
  let stand = lies();

  /* ---------- Das Nest auf der Fensterbank ---------- */
  let nestEl = null, zuletzt = "";
  const nachts = () => intro.classList.contains("wz-nacht");
  function zeige() {
    stand = lies();
    const bank = intro.querySelector(".wz-bank");
    const da = !!(stand.wahl && bank && intro.classList.contains("wz-aktiv"));
    if (!da) { if (nestEl) { nestEl.remove(); nestEl = null; zuletzt = ""; } return; }
    if (!nestEl || !nestEl.isConnected) { nestEl = document.createElement("div"); nestEl.className = "nest"; nestEl.setAttribute("aria-hidden", "true"); bank.appendChild(nestEl); zuletzt = ""; }
    const schlaf = nachts();
    const schluessel = JSON.stringify(stand.wahl) + (schlaf ? "|schlaf" : "") + (schlaf && ak.styling ? JSON.stringify(ak.styling.schichten ? [ak.styling.schichten(false), ak.styling.schichten(true)].map((x) => Object.values(x).join("").length) : "") : "");
    if (schluessel !== zuletzt) { zuletzt = schluessel; nestEl.innerHTML = nestSvg(stand.wahl, schlaf ? "schlaf" : false); }
    nestEl.classList.toggle("schlaeft", schlaf);
  }
  setInterval(zeige, 1000);

  /* ---------- Das Fenster zum Bauen ---------- */
  const dialog = document.createElement("dialog");
  dialog.className = "nest-menue";
  dialog.setAttribute("aria-label", "Winternest bauen");
  dialog.innerHTML =
    '<div class="nest-kopf"><h2>Winternest bauen 🪺</h2><p>Für Munkelvogel und Munkelvogeline</p><button class="schliessen nest-zu" type="button" aria-label="Schließen">×</button></div>' +
    '<div class="nest-vorschau"></div><div class="nest-reiter" role="tablist"></div><div class="nest-kacheln" role="radiogroup"></div>' +
    '<div class="nest-fuss"><button type="button" class="nest-fertig">Fertig ✨</button></div>';
  document.body.appendChild(dialog);
  const vorschau = dialog.querySelector(".nest-vorschau"), reiter = dialog.querySelector(".nest-reiter"), kacheln = dialog.querySelector(".nest-kacheln");
  let entwurf = {}, aktiv = "zweige";
  KATEGORIEN.forEach((k) => {
    const b = document.createElement("button");
    b.type = "button"; b.setAttribute("role", "tab"); b.dataset.kat = k.id;
    b.innerHTML = '<span aria-hidden="true">' + k.symbol + "</span> " + k.name;
    b.addEventListener("click", () => zeigeKategorie(k.id));
    reiter.appendChild(b);
  });
  const malVorschau = () => { vorschau.innerHTML = nestSvg(entwurf, true); };
  function kachelBild(kat, key) {
    // jede Kachel zeigt das ganze Nest mit genau dieser Wahl, so sieht Toni den Unterschied direkt
    const w = Object.assign({}, entwurf);
    if (key) w[kat] = key; else delete w[kat];
    return '<span class="nest-mini">' + nestSvg(w, false) + "</span>";
  }
  function zeigeKategorie(id) {
    aktiv = id;
    const k = KATEGORIEN.find((x) => x.id === id);
    reiter.querySelectorAll("button").forEach((b) => { const an = b.dataset.kat === id; b.classList.toggle("aktiv", an); b.setAttribute("aria-selected", an ? "true" : "false"); });
    kacheln.innerHTML = "";
    const eintraege = (k.pflicht ? [] : [[null, "Ohne"]]).concat(Object.entries(k.liste).map(([key, v]) => [key, v.name]));
    for (const [key, name] of eintraege) {
      const b = document.createElement("button");
      b.type = "button"; b.className = "nest-kachel"; b.setAttribute("role", "radio");
      const an = (entwurf[id] || null) === key;
      b.classList.toggle("an", an); b.setAttribute("aria-checked", an ? "true" : "false");
      b.innerHTML = kachelBild(id, key) + '<span class="nest-titel">' + name + "</span>";
      b.addEventListener("click", () => {
        if (key) entwurf[id] = key; else delete entwurf[id];
        malVorschau();
        kacheln.querySelectorAll(".nest-kachel").forEach((x) => { x.classList.remove("an"); x.setAttribute("aria-checked", "false"); });
        b.classList.add("an"); b.setAttribute("aria-checked", "true");
        if (!ruhig) { b.animate([{ transform: "scale(.92)" }, { transform: "scale(1.05)" }, { transform: "scale(1)" }], { duration: 260, easing: "ease-out" }); vorschau.animate([{ transform: "scale(.97)" }, { transform: "scale(1)" }], { duration: 300, easing: "ease-out" }); }
      });
      kacheln.appendChild(b);
    }
  }
  function oeffnen() {
    stand = lies();
    entwurf = Object.assign({}, STANDARD, stand.wahl || {});
    malVorschau();
    zeigeKategorie("zweige");
    if (typeof dialog.showModal === "function") dialog.showModal(); else dialog.setAttribute("open", "");
  }
  function fertig() {
    if (!dialog.open) return;
    const erstesMal = !stand.wahl;
    stand.wahl = entwurf; stand.angeboten = true;
    schreib(stand);
    dialog.close();
    zuletzt = ""; zeige();
    if (nestEl && !ruhig) nestEl.animate([{ transform: "translateY(10px) scale(.6)", opacity: 0 }, { transform: "translateY(-4px) scale(1.06)", opacity: 1, offset: 0.7 }, { transform: "none", opacity: 1 }], { duration: 650, easing: "ease-out" });
    if (ak.voegel && ak.voegel.nestFertig) ak.voegel.nestFertig(erstesMal);
  }
  dialog.querySelector(".nest-fertig").addEventListener("click", fertig);
  dialog.querySelector(".nest-zu").addEventListener("click", fertig);
  dialog.addEventListener("cancel", (e) => { e.preventDefault(); fertig(); });

  /* ---------- Schnittstelle ---------- */
  window.adventkalender.nest = {
    oeffnen,
    // die Munkelvogeline fragt nur am 19.11. (wenn sie da ist), bis das Nest gebaut ist
    frageAktiv: () => {
      stand = lies();
      if (stand.wahl || (ak.zeitreise && ak.zeitreise.aktiv())) return false;
      const d = ak.intro.datum();
      return d.jahr === KALENDER.jahr && d.monat === 11 && d.tag === 19 && ak.intro.phase() === "warten";
    },
    angeboten: () => { stand = lies(); stand.angeboten = true; schreib(stand); },
    vorab: () => "Brrr, Toni, uns wird langsam kalt 🥶",
    frage: () => "Baust du uns ein gemütliches Winternest? 🪺",
    // gibt es das Nest (für Tonis Ecke und als Landeplatz)?
    da: () => !!(nestEl && nestEl.isConnected),
    angebotenOderDa: () => { stand = lies(); return !!(stand.wahl || stand.angeboten); },
    // nachts schlafen beide im Nest, dann bleiben die fliegenden Vögel weg
    schlafen: () => !!(nestEl && nestEl.isConnected && nachts()),
    // Landeplatz oben auf dem Nest
    platz: () => {
      if (!nestEl || !nestEl.isConnected || nachts()) return null;
      const r = nestEl.getBoundingClientRect();
      if (!r.width) return null;
      return { x: r.left + r.width * 0.5, y: r.top + r.height * 0.56 };
    },
  };
})();
