/*
 * ===========================================================
 *  CAPYBARA-SPECIALS vor dem Geburtstag (15. bis 25. November)
 *  Jeden Tag läuft auf dem Countdown-Bildschirm eine andere
 *  kleine Capybara-Szene.
 * ===========================================================
 */
(function () {
  "use strict";

  const api = window.adventkalender && window.adventkalender.intro;
  if (!api) return;
  // capySeite und capyFront sind weiter unten definiert (Funktionsdeklarationen)
  window.capyGrafik = { seite: (o) => capySeite(o), front: (o) => capyFront(o) };
  const intro = document.getElementById("intro");
  const ruhig = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Bausteine: Capybaras und Requisiten ---------- */
  const FELL = "#b07a52", DUNKEL = "#9a6844", OHR = "#7a4e33", AUGE = "#3a2418";
  const HUETE = {
    party: (f) => '<path d="M54 13 L61 -11 L69 13z" fill="' + (f || "#f3dc9f") + '"/><path d="M57.5 1 L65 1.5 M56 7 L67.5 7.5" stroke="#fff" stroke-width="2" opacity=".8"/><circle cx="61" cy="-11" r="3.4" fill="#e85d7e"/>',
    koch: () => '<path d="M50 13h22v-6a6 6 0 0 0-4-10 6.5 6.5 0 0 0-13 0 6 6 0 0 0-5 10z" fill="#fff" stroke="#e6d6dc"/>',
    muetze: () => '<path d="M50 13 C54 -2 72 -4 76 6 L66 13z" fill="#d6304f"/><circle cx="77" cy="5" r="3.6" fill="#fff"/><rect x="47" y="10" width="24" height="5.5" rx="2.7" fill="#fff"/>',
  };
  const HALTEN = {
    tasse: '<rect x="68" y="30" width="11" height="12" rx="2.5" fill="#c2185b"/><path d="M79 33h2a3 3 0 0 1 0 6h-2" stroke="#c2185b" fill="none" stroke-width="2"/><rect x="69" y="31" width="9" height="2.5" fill="#7a1035"/>',
    matcha: '<rect x="69" y="25" width="9" height="15" rx="1.5" fill="#eef7e6" stroke="#4a7c3a"/><rect x="69.5" y="30" width="8" height="9.5" fill="#8fbf5a"/><path d="M75 25l3-9" stroke="#9d2449" stroke-width="1.4"/>',
  };
  /* Verschiedene Capybaras: Fellfarbe und Accessoire */
  const FELLE = [
    { fell: "#b07a52", dunkel: "#9a6844", ohr: "#7a4e33" },   // klassisch
    { fell: "#c99566", dunkel: "#b5804f", ohr: "#8a5a3a" },   // karamell
    { fell: "#8a5a3a", dunkel: "#74492e", ohr: "#5a3820" },   // schoko
    { fell: "#c47a45", dunkel: "#a8653a", ohr: "#7a4526" },   // rotbraun
    { fell: "#a89080", dunkel: "#907868", ohr: "#6e5a4e" },   // graubraun
  ];
  const TYPEN = [
    { f: 0, extra: "schleife", farbe: "#e85d7e" },
    { f: 1, extra: "brille" },
    { f: 2, extra: "muetze", farbe: "#7cc4f0" },
    { f: 3, extra: "blume" },
    { f: 4, extra: "schal", farbe: "#9be3b0" },
    { f: 1, extra: "stirnband", farbe: "#b39ddb" },
    { f: 2, extra: "sommersprossen" },
    { f: 0, extra: "kopfhoerer", farbe: "#f3c84b" },
    { f: 3, extra: "schal", farbe: "#e85d7e" },
    { f: 4, extra: "schleife", farbe: "#f3c84b" },
  ];
  const typ = (n) => { const t = TYPEN[((n % TYPEN.length) + TYPEN.length) % TYPEN.length]; return Object.assign({}, FELLE[t.f], t); };
  function frontExtra(t) {
    const c = t.farbe || "#e85d7e";
    switch (t.extra) {
      case "schleife": return '<path d="M40 7 33 2v10zM40 7l7-5v10z" fill="' + c + '"/><circle cx="40" cy="7" r="2.2" fill="#fff" opacity=".7"/>';
      case "brille": return '<g fill="rgba(255,255,255,.25)" stroke="#3a2418" stroke-width="1.4"><circle cx="23.5" cy="28.5" r="4.2"/><circle cx="32.5" cy="28.5" r="4.2"/></g><path d="M27.7 28.5h.6" stroke="#3a2418" stroke-width="1.4"/>';
      case "muetze": return '<path d="M8 15a20 14 0 0 1 40 0z" fill="' + c + '"/><rect x="7" y="13" width="42" height="5" rx="2.5" fill="#fff"/><circle cx="28" cy="0" r="4" fill="#fff"/>';
      case "blume": return '<g transform="translate(11 6)"><circle r="2.6" cx="0" cy="-3" fill="#fda4b8"/><circle r="2.6" cx="3" cy="0" fill="#fda4b8"/><circle r="2.6" cx="0" cy="3" fill="#fda4b8"/><circle r="2.6" cx="-3" cy="0" fill="#fda4b8"/><circle r="1.8" fill="#f3c84b"/></g>';
      case "schal": return '<path d="M9 38q19 10 38 0v6q-19 9-38 0z" fill="' + c + '"/><rect x="37" y="40" width="5" height="10" rx="2" fill="' + c + '"/><path d="M12 41h32" stroke="#fff" stroke-width="1.2" stroke-dasharray="3 3"/>';
      case "stirnband": return '<rect x="7" y="13" width="42" height="4.5" rx="2" fill="' + c + '"/><circle cx="44" cy="15" r="2.6" fill="#fff"/>';
      case "sommersprossen": return '<g fill="#7a4526" opacity=".55"><circle cx="13" cy="29" r=".9"/><circle cx="15.5" cy="31" r=".9"/><circle cx="12" cy="31.5" r=".8"/><circle cx="43" cy="29" r=".9"/><circle cx="40.5" cy="31" r=".9"/><circle cx="44" cy="31.5" r=".8"/></g>';
      case "kopfhoerer": return '<path d="M8 22a20 20 0 0 1 40 0" fill="none" stroke="#3a3a48" stroke-width="2.6"/><rect x="3" y="18" width="8" height="12" rx="3" fill="' + c + '"/><rect x="45" y="18" width="8" height="12" rx="3" fill="' + c + '"/>';
      default: return "";
    }
  }
  function seiteExtra(t) {
    const c = t.farbe || "#e85d7e";
    switch (t.extra) {
      case "schleife": return '<path d="M56 10 50 5v10zM56 10l6-5v10z" fill="' + c + '"/>';
      case "brille": return '<circle cx="62.5" cy="22" r="4" fill="rgba(255,255,255,.25)" stroke="#3a2418" stroke-width="1.3"/><path d="M66.5 22l5-1" stroke="#3a2418" stroke-width="1.3"/>';
      case "muetze": return '<path d="M49 15a12 10 0 0 1 24 0z" fill="' + c + '"/><rect x="48" y="13" width="26" height="4.5" rx="2.2" fill="#fff"/><circle cx="61" cy="4" r="3.4" fill="#fff"/>';
      case "blume": return '<g transform="translate(54 9)"><circle r="2.3" cx="0" cy="-2.6" fill="#fda4b8"/><circle r="2.3" cx="2.6" cy="0" fill="#fda4b8"/><circle r="2.3" cx="0" cy="2.6" fill="#fda4b8"/><circle r="2.3" cx="-2.6" cy="0" fill="#fda4b8"/><circle r="1.6" fill="#f3c84b"/></g>';
      case "schal": return '<path d="M46 31q8 6 18 1v6q-10 5-18-1z" fill="' + c + '"/><rect x="49" y="34" width="6" height="13" rx="2" fill="' + c + '"/>';
      case "stirnband": return '<rect x="48" y="14" width="24" height="4" rx="2" fill="' + c + '"/>';
      case "sommersprossen": return '<g fill="#7a4526" opacity=".55"><circle cx="61" cy="27" r=".9"/><circle cx="64" cy="29" r=".9"/><circle cx="60" cy="30" r=".8"/></g>';
      case "kopfhoerer": return '<path d="M50 20a11 11 0 0 1 22 0" fill="none" stroke="#3a3a48" stroke-width="2.4"/><rect x="51" y="17" width="7" height="10" rx="3" fill="' + c + '"/>';
      default: return "";
    }
  }
  // Capybara von der Seite, schaut nach rechts
  function capySeiteInhalt(o) {
    o = o || {};
    const t = o.typ !== undefined ? typ(o.typ) : { fell: FELL, dunkel: DUNKEL, ohr: OHR };
    const beine = o.ohneBeine ? "" :
      '<rect x="16" y="40" width="7" height="11" rx="3" fill="' + t.dunkel + '"/><rect x="26" y="40" width="7" height="11" rx="3" fill="' + t.ohr + '"/>' +
      '<rect x="42" y="40" width="7" height="11" rx="3" fill="' + t.dunkel + '"/><rect x="51" y="40" width="7" height="11" rx="3" fill="' + t.ohr + '"/>';
    return beine + (o.unten || "") +
      '<ellipse cx="34" cy="31" rx="27" ry="16" fill="' + t.fell + '"/>' +
      '<rect x="48" y="12" width="24" height="24" rx="10" fill="' + t.fell + '"/>' +
      '<rect x="62" y="18" width="13" height="16" rx="6" fill="' + t.dunkel + '"/>' +
      '<ellipse cx="55" cy="12" rx="3.5" ry="3" fill="' + t.ohr + '"/>' +
      '<path d="M60 22q2.5-2 5 0" fill="none" stroke="' + AUGE + '" stroke-width="1.8" stroke-linecap="round"/>' +
      '<ellipse cx="72" cy="23" rx="1.4" ry="1" fill="' + AUGE + '"/>' +
      '<circle cx="62" cy="28" r="2.4" fill="#f7809b" opacity=".55"/>' +
      (o.typ !== undefined && !o.hut ? seiteExtra(t) : "") +
      (o.hut ? HUETE[o.hut](o.hutFarbe) : "") +
      (o.halt ? HALTEN[o.halt] : "");
  }
  function capySeite(o) { return '<svg viewBox="0 -16 86 68" aria-hidden="true">' + capySeiteInhalt(o) + "</svg>"; }
  // Capybara von vorne (Gesicht), Koordinaten 0..56 x -12..46
  function capyFrontInhalt(o) {
    o = o || {};
    const t = o.typ !== undefined ? typ(o.typ) : { fell: FELL, dunkel: DUNKEL, ohr: OHR };
    return '<ellipse cx="14" cy="9" rx="5" ry="4" fill="' + t.ohr + '"/><ellipse cx="42" cy="9" rx="5" ry="4" fill="' + t.ohr + '"/>' +
      '<rect x="7" y="6" width="42" height="36" rx="17" fill="' + t.fell + '"/>' +
      '<ellipse cx="28" cy="31" rx="13" ry="9.5" fill="' + t.dunkel + '"/>' +
      '<ellipse cx="23.5" cy="28.5" rx="1.8" ry="1.1" fill="' + AUGE + '"/><ellipse cx="32.5" cy="28.5" rx="1.8" ry="1.1" fill="' + AUGE + '"/>' +
      (o.mund === "offen" ? '<ellipse cx="28" cy="35.5" rx="2.6" ry="2" fill="#6b1532"/>' : '<path d="M25 35q3 2 6 0" fill="none" stroke="' + AUGE + '" stroke-width="1.4" stroke-linecap="round"/>') +
      '<path d="M14 20q3-2.5 6 0M36 20q3-2.5 6 0" fill="none" stroke="' + AUGE + '" stroke-width="1.8" stroke-linecap="round"/>' +
      '<circle cx="14" cy="27" r="2.6" fill="#f7809b" opacity=".6"/><circle cx="42" cy="27" r="2.6" fill="#f7809b" opacity=".6"/>' +
      (o.typ !== undefined && !o.yuzu && !o.handtuch ? frontExtra(t) : "") +
      (o.yuzu ? '<circle cx="28" cy="1" r="7" fill="#ffb020"/><circle cx="25.5" cy="-1.5" r="1.6" fill="#fff" opacity=".5"/><path d="M28 -6q3-4 7-2" stroke="#4a8a5c" stroke-width="2" fill="none"/>' : "") +
      (o.handtuch ? '<path d="M11 9q17-12 34 0l-3 6q-14-7-28 0z" fill="' + (o.handtuch === true ? "#fff" : o.handtuch) + '"/><path d="M15 6q13-6 26 0" stroke="rgba(0,0,0,.08)" fill="none"/>' : "") +
      (o.helm ? '<path d="M7 18a21 21 0 0 1 42 0z" fill="#7cc4f0" opacity=".35"/>' : "");
  }
  function capyFront(o) { return '<svg viewBox="0 -12 56 58" aria-hidden="true">' + capyFrontInhalt(o) + "</svg>"; }

  let W = 0, H = 0;
  function figur(html, cls, stil) {
    const d = document.createElement("div");
    d.className = "sp-figur " + (cls || "");
    d.innerHTML = html;
    Object.assign(d.style, stil || {});
    buehne.appendChild(d);
    return d;
  }
  const zufall = (a, b) => a + Math.random() * (b - a);
  const spaeter = (ms, f) => timer.push(setTimeout(f, ms));
  let buehne = null, timer = [];

  function dampf(ziel, x, y, n) {
    for (let k = 0; k < (n || 3); k++) {
      const s = document.createElement("span");
      s.className = "sp-dampf";
      s.style.left = x + "px"; s.style.top = y + "px";
      s.style.animationDelay = (k * 0.6) + "s";
      ziel.appendChild(s);
    }
  }
  function partikel(x, y, zeichen, n, weite, farben) {
    for (let k = 0; k < n; k++) {
      const s = document.createElement("span");
      s.className = "sp-partikel";
      s.textContent = zeichen[k % zeichen.length];
      if (farben) s.style.color = farben[k % farben.length];
      s.style.left = x + "px"; s.style.top = y + "px";
      buehne.appendChild(s);
      const w = (k / n) * Math.PI * 2 + zufall(-0.2, 0.2), r = weite * zufall(0.6, 1);
      s.animate([
        { transform: "translate(-50%,-50%) scale(.3)", opacity: 1 },
        { transform: "translate(calc(-50% + " + Math.cos(w) * r + "px), calc(-50% + " + Math.sin(w) * r + "px)) scale(1)", opacity: 1, offset: 0.6 },
        { transform: "translate(calc(-50% + " + Math.cos(w) * r * 1.1 + "px), calc(-50% + " + (Math.sin(w) * r * 1.1 + 40) + "px)) scale(.9)", opacity: 0 },
      ], { duration: 1600, easing: "cubic-bezier(.2,.8,.3,1)", fill: "forwards" });
    }
  }

  /* ---------- Die elf Szenen ---------- */
  const SZENEN = {
    15: { titel: "Die Capy Crew geht auf Ballonfahrt 🎈", dauer: 13000, spiel() {
      const farben = ["#e85d7e", "#f3c84b", "#7cc4f0", "#9be3b0", "#b39ddb", "#fda4b8", "#ff8a65"];
      const capyIn = (n, x, y, s) => '<g transform="translate(' + x + " " + y + ") scale(" + (s || 1) + ')">' + capyFrontInhalt({ typ: n }) + "</g>";
      // 1. Luftballon-Strauß: die Schnüre enden in den Pfoten über dem Kopf
      const strauss = (n) => {
        const pfote = '<ellipse cx="54" cy="142" rx="4.5" ry="5.5" fill="' + typ(n).fell + '"/><ellipse cx="66" cy="142" rx="4.5" ry="5.5" fill="' + typ(n).fell + '"/>';
        const ballons = [[38, 44, 0], [62, 30, 1], [86, 48, 2], [52, 70, 3], [76, 74, 4]].map(([x, y, k]) =>
          '<path d="M' + x + " " + (y + 20) + " Q" + (x + 60) / 2 + " " + (y + 70) + " 60 140" + '" stroke="#9d8a90" stroke-width="1.2" fill="none"/>' +
          '<ellipse cx="' + x + '" cy="' + y + '" rx="15" ry="19" fill="' + farben[(n + k) % farben.length] + '"/><ellipse cx="' + (x - 5) + '" cy="' + (y - 7) + '" rx="4" ry="6" fill="#fff" opacity=".4"/>' +
          '<path d="M' + (x - 3) + " " + (y + 18) + "h6l-3 4z" + '" fill="' + farben[(n + k) % farben.length] + '"/>').join("");
        return '<svg viewBox="0 0 120 200" aria-hidden="true">' + ballons + capyIn(n, 32, 146) + pfote + "</svg>";
      };
      // 2. Heißluftballon: Capy sitzt im Korb
      const heissluft = (n) => {
        const f1 = farben[n % farben.length], f2 = farben[(n + 3) % farben.length];
        return '<svg viewBox="0 0 120 220" aria-hidden="true">' +
          '<path d="M60 8C20 8 8 40 14 70c6 28 26 46 30 60h32c4-14 24-32 30-60C112 40 100 8 60 8z" fill="' + f1 + '"/>' +
          '<path d="M60 8C44 8 36 40 40 70c3 28 10 46 12 60h16c2-14 9-32 12-60C84 40 76 8 60 8z" fill="' + f2 + '"/>' +
          '<path d="M60 8C55 8 52 40 54 70c1 28 3 46 4 60h4c1-14 3-32 4-60C68 40 65 8 60 8z" fill="#fff" opacity=".7"/>' +
          '<path d="M20 50h80M16 80h88" stroke="#fff" stroke-width="2" opacity=".5"/>' +
          '<rect x="44" y="128" width="32" height="6" rx="2" fill="#8a5a3a"/>' +
          '<path class="sp-brenner" d="M60 136c4 5 4 9 0 11c-4-2-4-6 0-11z" fill="#ffb648"/>' +
          '<path d="M46 134 L40 176 M74 134 L80 176" stroke="#6b4a3a" stroke-width="1.5"/>' +
          capyIn(n, 32, 150) +
          '<rect x="36" y="176" width="48" height="30" rx="4" fill="#b5763e"/><path d="M36 184h48M36 192h48M36 200h48" stroke="#8a5a3a" stroke-width="1.4"/><rect x="34" y="173" width="52" height="6" rx="3" fill="#8a5a3a"/>' +
          "</svg>";
      };
      // 3. Luftschiff mit Gondel und Banner
      const luftschiff = (n) =>
        '<svg viewBox="0 0 200 150" aria-hidden="true">' +
        '<path d="M14 40l-12-18v40z" fill="#c2185b"/><path d="M18 46l-14 14 18-2z" fill="#c2185b"/>' +
        '<ellipse cx="100" cy="44" rx="86" ry="32" fill="#fda4b8"/><ellipse cx="100" cy="44" rx="86" ry="10" fill="#fff" opacity=".35"/><ellipse cx="80" cy="30" rx="30" ry="7" fill="#fff" opacity=".4"/>' +
        '<text x="104" y="52" text-anchor="middle" font-family="Dancing Script, cursive" font-weight="700" font-size="22" fill="#9d2449">Capy Air ♥</text>' +
        '<path d="M80 74 L82 96 M120 74 L118 96" stroke="#6b4a3a" stroke-width="1.5"/>' +
        capyIn(n, 75, 80, 0.9) +
        '<rect x="70" y="108" width="60" height="24" rx="8" fill="#9d2449"/><circle cx="88" cy="120" r="4" fill="#ffd36b"/><circle cx="112" cy="120" r="4" fill="#ffd36b"/>' +
        '<g class="sp-propeller"><ellipse cx="190" cy="44" rx="3" ry="14" fill="#6b4a3a"/></g>' +
        "</svg>";
      const flieger = [
        { art: strauss, gr: 92 }, { art: heissluft, gr: 112 }, { art: strauss, gr: 86 },
        { art: heissluft, gr: 100 }, { art: strauss, gr: 96 }, { art: heissluft, gr: 106 },
      ];
      flieger.forEach((fl, i) => {
        const gr = Math.min(fl.gr * 1.25, W * 0.36);
        const f = figur(fl.art(i), "sp-ballonfahrer", { left: (i / flieger.length) * 88 + 2 + "%", bottom: "-280px", width: gr + "px" });
        f.animate([{ transform: "translateY(0)" }, { transform: "translateY(-" + (H + 560) + "px)" }],
          { duration: zufall(8500, 11000), delay: i * 520, easing: "ease-in-out", fill: "both" });
        f.firstChild.animate([{ transform: "rotate(-5deg)" }, { transform: "rotate(5deg)" }], { duration: zufall(1500, 2200), direction: "alternate", iterations: Infinity, easing: "ease-in-out" });
      });
      // das Luftschiff zieht quer über den Himmel
      const sb = Math.min(W * 0.55, 240);
      const schiff = figur(luftschiff(7), "sp-luftschiff", { left: "0", top: "22%", width: sb + "px" });
      schiff.animate([{ transform: "translate(" + -sb + "px, 40px)" }, { transform: "translate(" + (W + 20) + "px, -60px)" }], { duration: 11000, delay: 900, easing: "linear", fill: "both" });
    } },

    16: { titel: "Geheime Gartenparty der Capy Crew 🎉", dauer: 11500, spiel() {
      const garten = figur(
        '<svg viewBox="0 0 400 120" preserveAspectRatio="none"><path d="M0 40 Q100 10 200 30 T400 25 V120 H0z" fill="#8fd18a"/><path d="M0 60 Q120 40 220 58 T400 50 V120 H0z" fill="#6fbf6b"/></svg>' +
        '<div class="sp-blumen">' + Array.from("🌷🌼🌸🌷🌼🌸🌷").map((b) => "<span>" + b + "</span>").join("") + "</div>",
        "sp-garten");
      garten.animate([{ transform: "translateY(100%)" }, { transform: "translateY(0)" }], { duration: 1200, easing: "cubic-bezier(.2,.9,.3,1.1)", fill: "forwards" });
      const kette = figur('<svg viewBox="0 0 400 60" preserveAspectRatio="none"><path d="M0 8 Q100 50 200 12 T400 10" stroke="#6b4a3a" stroke-width="1.5" fill="none"/>' +
        [40, 95, 150, 250, 305, 360].map((x, i) => '<rect x="' + (x - 7) + '" y="' + (i % 2 ? 26 : 30) + '" width="14" height="18" rx="6" fill="' + ["#f3c84b", "#e85d7e", "#7cc4f0"][i % 3] + '"/>').join("") + "</svg>", "sp-lampions");
      kette.animate([{ transform: "translateY(-120%)" }, { transform: "translateY(0)" }], { duration: 1000, delay: 500, easing: "ease-out", fill: "forwards" });
      const kugel = figur('<div class="sp-disco"></div>', "sp-discohalter");
      kugel.animate([{ transform: "translate(-50%, -140%)" }, { transform: "translate(-50%, 0)" }], { duration: 1200, delay: 900, easing: "cubic-bezier(.3,1.4,.5,1)", fill: "forwards" });
      const hutfarben = ["#f3dc9f", "#fda4b8", "#9be3b0", "#7cc4f0", "#f3c84b"];
      for (let i = 0; i < 5; i++) {
        const f = figur(capySeite({ hut: "party", hutFarbe: hutfarben[i] }), "sp-taenzer",
          { left: 6 + i * 18 + "%", bottom: (10 + (i % 2) * 6) + "%", width: "min(22vw, 110px)", transform: i % 2 ? "scaleX(-1)" : "" });
        spaeter(1300 + i * 120, () => f.firstChild.animate(
          [{ transform: "translateY(0) rotate(0)" }, { transform: "translateY(-22px) rotate(" + (i % 2 ? 8 : -8) + "deg)" }, { transform: "translateY(0) rotate(0)" }],
          { duration: 520, iterations: 17, easing: "ease-in-out" }));
      }
      for (let k = 0; k < 6; k++) spaeter(1500 + k * 1300, () => partikel(zufall(W * 0.15, W * 0.85), H * 0.62, ["♪", "♫", "♥"], 6, 90, ["#9d2449", "#e85d7e"]));
    } },

    17: { titel: "Glühwein-Abend am Capy-Stand 🍷", dauer: 11000, spiel() {
      const breite = Math.min(W * 0.92, 440);
      const stand = figur('<svg viewBox="0 0 300 200"><rect x="20" y="70" width="10" height="130" fill="#8a5a3a"/><rect x="270" y="70" width="10" height="130" fill="#8a5a3a"/>' +
        '<path d="M5 74 L150 18 L295 74z" fill="#d6304f"/>' +
        Array.from({ length: 10 }, (_, i) => '<path d="M' + (5 + i * 29) + ' 74 q14.5 16 29 0z" fill="' + (i % 2 ? "#fff" : "#d6304f") + '"/>').join("") +
        '<rect x="70" y="40" width="160" height="26" rx="6" fill="#fff8e6" stroke="#d4a84b" stroke-width="2"/><text x="150" y="59" text-anchor="middle" font-family="Dancing Script, cursive" font-size="20" font-weight="700" fill="#9d2449">Glühwein ♥</text>' +
        '<path d="M30 92 Q90 110 150 92 T270 92" stroke="#6b4a3a" fill="none"/>' +
        [60, 105, 150, 195, 240].map((x, i) => '<circle cx="' + x + '" cy="' + (98 + (i % 2) * 4) + '" r="4" fill="' + ["#ffd36b", "#ff8fab"][i % 2] + '"/>').join("") +
        '<rect x="15" y="150" width="270" height="50" rx="4" fill="#a0683e"/><rect x="15" y="146" width="270" height="8" rx="3" fill="#c08a5a"/></svg>',
        "sp-stand", { width: breite + "px" });
      stand.animate([{ opacity: 0, transform: "translate(-50%, 40px)" }, { opacity: 1, transform: "translate(-50%, 0)" }], { duration: 800, fill: "forwards" });
      const links = figur(capySeite({ hut: "muetze", halt: "tasse" }), "sp-prost", { left: "calc(50% - " + breite * 0.42 + "px)", width: breite * 0.36 + "px" });
      const rechts = figur(capySeite({ halt: "tasse" }), "sp-prost sp-gespiegelt", { left: "calc(50% + " + breite * 0.06 + "px)", width: breite * 0.36 + "px" });
      [links, rechts].forEach((f, i) => {
        f.animate([{ opacity: 0, transform: (i ? "scaleX(-1) " : "") + "translateX(-60px)" }, { opacity: 1, transform: (i ? "scaleX(-1) " : "") + "translateX(0)" }], { duration: 900, delay: 500, fill: "forwards" });
        dampf(f, f.offsetWidth * 0.86, f.offsetHeight * 0.2, 3);
        for (const t of [2600, 5600, 8200]) spaeter(t, () => f.firstChild.animate(
          [{ transform: "rotate(0)" }, { transform: "rotate(-14deg) translateY(-6px)" }, { transform: "rotate(0)" }],
          { duration: 700, easing: "ease-in-out" }));
      });
      for (const t of [2950, 5950, 8550]) spaeter(t, () => {
        partikel(W / 2, H - stand.offsetHeight * 0.55, ["✨", "♥"], 8, 60, ["#f3c84b", "#e85d7e"]);
        const b = figur('<span>Prost! 🥂</span>', "sp-blase", { left: "50%", bottom: stand.offsetHeight * 0.95 + "px" });
        spaeter(1300, () => b.remove());
      });
    } },

    18: { titel: "Wellness-Tag im Capy-Onsen ♨️", dauer: 12000, spiel() {
      const breite = Math.min(W * 0.95, 460);
      const quelle = figur('<div class="sp-becken"></div>', "sp-onsen", { width: breite + "px" });
      quelle.animate([{ opacity: 0, transform: "translate(-50%, 30px)" }, { opacity: 1, transform: "translate(-50%, 0)" }], { duration: 900, fill: "forwards" });
      const becken = quelle.firstChild;
      const gaeste = [
        { o: { typ: 1, yuzu: true }, x: 6 }, { o: { typ: 2, handtuch: "#fda4b8" }, x: 28 },
        { o: { typ: 4, yuzu: true }, x: 52 }, { o: { typ: 3, handtuch: true }, x: 74 },
      ].map((g, i) => {
        const c = document.createElement("div");
        c.className = "sp-badegast";
        c.innerHTML = capyFront(g.o);
        c.style.left = g.x + "%";
        c.style.width = "22%";
        c.style.animationDelay = -i * 0.7 + "s";
        becken.appendChild(c);
        c.animate([{ transform: "translateY(60%)" }, { transform: "translateY(0)" }], { duration: 1200, delay: 600 + i * 300, easing: "cubic-bezier(.3,1.4,.5,1)", fill: "backwards" });
        return c;
      });
      const wasser = document.createElement("div");
      wasser.className = "sp-wasser";
      becken.appendChild(wasser);
      const ente = document.createElement("span");
      ente.className = "sp-ente"; ente.textContent = "🐤";
      becken.appendChild(ente);
      for (let k = 0; k < 6; k++) dampf(becken, breite * (0.12 + k * 0.15), 10, 2);
      // Wasserball, der zwischen den Capys hin und her fliegt
      const ball = figur('<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="18" fill="#fff"/><path d="M20 2a18 18 0 0 1 0 36z" fill="#e85d7e"/><path d="M2 20a18 18 0 0 1 36 0z" fill="#7cc4f0" opacity=".85"/><circle cx="20" cy="20" r="18" fill="none" stroke="rgba(0,0,0,.1)"/><circle cx="13" cy="12" r="4" fill="#fff" opacity=".6"/></svg>', "sp-wasserball", { left: "0", top: "0" });
      const mitte = (c) => { const r = c.getBoundingClientRect(), b = buehne.getBoundingClientRect(); return { x: r.left - b.left + r.width / 2, y: r.top - b.top + r.height * 0.1 }; };
      const spritzer = (x, y, n) => partikel(x, y, ["💧"], n || 8, 60, ["#5aa9dd"]);
      const folge = [0, 2, 1, 3, 0, 3, 1, 2];
      let k = 0;
      const wurf = () => {
        if (k >= folge.length - 1) return;
        const von = mitte(gaeste[folge[k]]), nach = mitte(gaeste[folge[k + 1]]);
        const hoch = Math.min(von.y, nach.y) - Math.min(140, H * 0.22);
        ball.animate([
          { transform: "translate(" + (von.x - 16) + "px," + (von.y - 16) + "px) rotate(0)" },
          { transform: "translate(" + ((von.x + nach.x) / 2 - 16) + "px," + (hoch - 16) + "px) rotate(200deg)" },
          { transform: "translate(" + (nach.x - 16) + "px," + (nach.y - 16) + "px) rotate(400deg)" },
        ], { duration: 950, easing: "linear", fill: "forwards" });
        gaeste[folge[k]].animate([{ transform: "translateY(0)" }, { transform: "translateY(-14px)" }, { transform: "translateY(0)" }], { duration: 400 });
        spaeter(940, () => { spritzer(nach.x, nach.y + 20, 7); gaeste[folge[k]].animate([{ transform: "translateY(0)" }, { transform: "translateY(10px)" }, { transform: "translateY(0)" }], { duration: 400 }); k++; spaeter(250, wurf); });
      };
      spaeter(2000, wurf);
      // ein Capy taucht ab und kommt mit einer Fontäne wieder hoch
      spaeter(7600, () => {
        const c = gaeste[1];
        c.animate([{ transform: "translateY(0)" }, { transform: "translateY(85%)" }, { transform: "translateY(85%)" }, { transform: "translateY(-10%)" }, { transform: "translateY(0)" }],
          { duration: 2200, easing: "ease-in-out" });
        spaeter(1500, () => { const m = mitte(c); partikel(m.x, m.y + 10, ["💧", "💦"], 16, 100, ["#5aa9dd"]); });
      });
      // alle spritzen sich zum Schluss gegenseitig nass
      spaeter(10000, () => gaeste.forEach((c, i) => spaeter(i * 150, () => { const m = mitte(c); spritzer(m.x, m.y + 18, 10); })));
    } },

    19: { titel: "Großes Capy-Rodelrennen 🛷", dauer: 9500, spiel() {
      const hang = figur('<svg viewBox="0 0 400 300" preserveAspectRatio="none"><path d="M0 60 L400 250 V300 H0z" fill="#fff"/><path d="M0 60 L400 250" stroke="#dfe9f5" stroke-width="6"/></svg>', "sp-hang");
      hang.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 600, fill: "forwards" });
      const winkel = Math.atan2(H * 0.633, W) * 180 / Math.PI;
      const schlitten = '<path d="M4 54 h62 q10 0 12 -8" stroke="#9d2449" stroke-width="3" fill="none"/><rect x="6" y="44" width="58" height="6" rx="2" fill="#d4a84b"/>';
      for (let i = 0; i < 4; i++) {
        const gr = Math.min(W * 0.26, 120);
        const f = figur(capySeite({ ohneBeine: true, unten: schlitten, hut: i % 2 ? "muetze" : null }), "sp-rodler", { width: gr + "px" });
        const y0 = H * 0.2 - gr * 0.7, y1 = H * 0.833 - gr * 0.7;
        f.animate([
          { transform: "translate(-" + gr * 1.2 + "px," + y0 + "px) rotate(" + winkel + "deg)" },
          { transform: "translate(" + (W + gr) + "px," + (y1 + (H * 0.633 * gr * 2.2) / W) + "px) rotate(" + winkel + "deg)" },
        ], { duration: 3200 - i * 250, delay: 900 + i * 1500, easing: "cubic-bezier(.5,0,.8,.6)", fill: "both" });
      }
    } },

    20: { titel: "Die Capy Crew trinkt den Matcha leer 🍵", dauer: 12500, spiel() {
      const gr = Math.min(W * 0.78, 320);
      const koepfe = [0, 1, 2].map((n, i) => {
        const x = 18 + i * 74;
        return '<g class="sp-trinker" data-i="' + i + '"><g transform="translate(' + x + ' 24) scale(1.05)">' + capyFrontInhalt({ typ: [5, 2, 8][i], mund: "offen" }) + "</g></g>" +
          '<path d="M' + (x + 30) + " 62 L" + (x + 40 + (i - 1) * 6) + ' 270" stroke="' + ["#e85d7e", "#7cc4f0", "#f3c84b"][i] + '" stroke-width="7" stroke-linecap="round"/>';
      }).join("");
      const becher = figur(
        '<svg viewBox="0 0 240 310" aria-hidden="true"><defs><clipPath id="sp-becher-innen"><path d="M30 90 h180 l-14 196 a10 10 0 0 1-10 9 H54 a10 10 0 0 1-10-9z"/></clipPath></defs>' +
        koepfe +
        '<path d="M22 74 h196 l-18 222 a14 14 0 0 1-14 13 H54 a14 14 0 0 1-14-13z" fill="#eef7e6" opacity=".85" stroke="#4a7c3a" stroke-width="3"/>' +
        '<g clip-path="url(#sp-becher-innen)"><g class="sp-fuellung">' +
        '<rect x="20" y="96" width="200" height="220" fill="#8fbf5a"/>' +
        '<path d="M20 96 q25 12 50 0 t50 0 t50 0 t50 0 v8 H20z" fill="#a8d07a"/>' +
        '<rect x="70" y="160" width="40" height="40" rx="9" fill="#fff" opacity=".55" transform="rotate(-12 90 180)"/><rect x="128" y="196" width="36" height="36" rx="9" fill="#fff" opacity=".55" transform="rotate(10 146 214)"/>' +
        "</g></g>" +
        '<rect x="14" y="64" width="212" height="18" rx="9" fill="#4a7c3a"/></svg>',
        "sp-matcha", { width: gr + "px" });
      becher.animate([{ transform: "translate(-50%, 110%)" }, { transform: "translate(-50%, 0)" }], { duration: 1300, easing: "cubic-bezier(.2,.9,.3,1.1)", fill: "forwards" });
      const svg = becher.querySelector("svg");
      const fuell = svg.querySelector(".sp-fuellung");
      // Trinken: Füllstand sinkt über 8 Sekunden ganz nach unten
      spaeter(1800, () => fuell.animate([{ transform: "translateY(0)" }, { transform: "translateY(205px)" }], { duration: 8000, easing: "ease-in", fill: "forwards" }));
      svg.querySelectorAll(".sp-trinker").forEach((t, i) => {
        spaeter(1800 + i * 200, () => t.animate([{ transform: "translateY(0)" }, { transform: "translateY(3px)" }, { transform: "translateY(0)" }], { duration: 420, iterations: 19 }));
      });
      // Bläschen beim Schlürfen
      for (let k = 0; k < 14; k++) spaeter(2200 + k * 520, () => {
        const r = becher.getBoundingClientRect(), b = buehne.getBoundingClientRect();
        const x = r.left - b.left + r.width * zufall(0.3, 0.7), y = r.top - b.top + r.height * 0.4;
        partikel(x, y, ["○"], 3, 22, ["#f6fbef"]);
      });
      spaeter(4800, () => { const b = figur("<span>Schlürf! 😋</span>", "sp-blase", { left: "50%", top: "18%" }); spaeter(1400, () => b.remove()); });
      // Ende: leer, alle reiben sich zufrieden den Bauch
      spaeter(10100, () => {
        const b = figur("<span>Alle! Ausgetrunken 😋💚</span>", "sp-blase", { left: "50%", top: "18%" });
        svg.querySelectorAll(".sp-trinker").forEach((t, i) => t.animate([{ transform: "rotate(0)" }, { transform: "rotate(" + (i % 2 ? 8 : -8) + "deg) translateY(-6px)" }, { transform: "rotate(0)" }], { duration: 600, iterations: 3 }));
        const r = becher.getBoundingClientRect(), bb = buehne.getBoundingClientRect();
        partikel(r.left - bb.left + r.width / 2, r.top - bb.top + r.height * 0.15, ["♥", "✨"], 12, 90, ["#4a8a5c", "#e85d7e"]);
        spaeter(2000, () => b.remove());
      });
    } },

    21: { titel: "Capy-Feuerwerk nur für dich 🎆", dauer: 11000, spiel() {
      const nacht = figur("", "sp-nacht");
      nacht.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 700, fill: "forwards" });
      const gr = Math.min(W * 0.22, 90);
      const rakete = figur('<svg viewBox="0 0 60 120"><path d="M30 0 C48 20 50 55 46 85 H14 C10 55 12 20 30 0z" fill="#fff" stroke="#e6d6dc"/><path d="M14 70 L0 100 L16 92z M46 70 L60 100 L44 92z" fill="#e85d7e"/><circle cx="30" cy="45" r="14" fill="#7cc4f0" stroke="#d4a84b" stroke-width="3"/></svg>' +
        '<div class="sp-raketen-capy">' + capyFront() + "</div><span class=\"sp-flamme\"></span>", "sp-rakete", { width: gr + "px" });
      rakete.animate([{ transform: "translate(-50%, 0)" }, { transform: "translate(-50%, -" + (H * 0.72) + "px)" }], { duration: 1900, delay: 500, easing: "cubic-bezier(.6,0,.9,.6)", fill: "forwards" });
      spaeter(2400, () => { rakete.style.opacity = "0"; partikel(W / 2, H * 0.25, ["♥"], 26, Math.min(W, H) * 0.32, ["#ff5c85", "#f3c84b", "#7cc4f0", "#fff"]); });
      spaeter(3300, () => partikel(W * 0.25, H * 0.35, ["♥", "✦"], 18, Math.min(W, H) * 0.22, ["#f3c84b", "#fff"]));
      spaeter(4100, () => partikel(W * 0.75, H * 0.3, ["♥", "✦"], 18, Math.min(W, H) * 0.22, ["#ff8fab", "#b39ddb"]));
      spaeter(4600, () => {
        const schirm = figur('<svg class="sp-schirmtuch" viewBox="0 0 100 70"><path d="M2 40 A48 40 0 0 1 98 40 Q86 32 74 40 Q62 32 50 40 Q38 32 26 40 Q14 32 2 40z" fill="#e85d7e"/><path d="M26 40 Q38 32 50 40 Q62 32 74 40 A48 40 0 0 0 26 40" fill="#f3c84b" opacity=".85"/><path d="M4 40 L42 68 M96 40 L58 68 M50 40 V66" stroke="#9d8a90" fill="none"/></svg>' + capyFront(),
          "sp-fallschirm", { width: gr * 1.3 + "px" });
        schirm.animate([{ transform: "translate(-50%, 0) rotate(-6deg)" }, { transform: "translate(-30%, " + H * 0.45 + "px) rotate(6deg)" }, { transform: "translate(-60%, " + H * 0.8 + "px) rotate(-4deg)" }],
          { duration: 5800, easing: "ease-in-out", fill: "forwards" });
      });
    } },

    22: { titel: "Große Schneeballschlacht! ❄️", dauer: 13000, spiel() {
      const gr = Math.min(W * 0.3, 140);
      const links = figur(capySeite({ typ: 2 }), "sp-werfer", { left: "4%", width: gr + "px" });
      const rechts = figur(capySeite({ typ: 4 }), "sp-werfer sp-gespiegelt", { right: "4%", width: gr + "px" });
      [links, rechts].forEach((f, i) => f.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 600, delay: i * 200, fill: "both" }));
      // kleine Schneeburgen als Deckung
      ["4%", "auto"].forEach((l, i) => figur('<svg viewBox="0 0 120 40"><path d="M0 40 Q10 8 30 14 Q48 0 64 12 Q84 2 98 16 Q114 12 120 40z" fill="#fff"/><path d="M14 28 q20 -8 40 0" stroke="#dfe9f5" stroke-width="3" fill="none"/></svg>',
        "sp-schneeburg", i ? { right: "1%", width: gr * 0.9 + "px" } : { left: "1%", width: gr * 0.9 + "px" }));
      const yBoden = H - gr * 0.62 - H * 0.08;
      const wuerfe = [
        { von: "l", r: 9 }, { von: "r", r: 14 }, { von: "l", r: 11 }, { von: "r", r: 7 }, { von: "l", r: 17 },
        { von: "r", r: 10 }, { von: "l", r: 13 }, { von: "r", r: 18 },
      ];
      const wirf = (w, i, letzter) => {
        const vonLinks = w.von === "l";
        const x0 = vonLinks ? W * 0.04 + gr * 0.85 : W * 0.96 - gr * 0.85, x1 = vonLinks ? W * 0.96 - gr * 0.55 : W * 0.04 + gr * 0.55;
        const ball = figur("", "sp-schneeball", { left: "0", top: "0", width: w.r * 2 + "px", height: w.r * 2 + "px", margin: -w.r + "px 0 0 " + -w.r + "px" });
        const hoch = yBoden - Math.min(H * (letzter ? 0.42 : 0.3), letzter ? 300 : 230) - w.r;
        const werfer = vonLinks ? links : rechts, ziel = vonLinks ? rechts : links;
        werfer.firstChild.animate([{ transform: "rotate(0)" }, { transform: "rotate(-16deg)" }, { transform: "rotate(0)" }], { duration: 420 });
        ball.animate([
          { transform: "translate(" + x0 + "px," + yBoden + "px) rotate(0)" },
          { transform: "translate(" + (x0 + x1) / 2 + "px," + hoch + "px) rotate(180deg)" },
          { transform: "translate(" + x1 + "px," + (yBoden + 8) + "px) rotate(360deg)" },
        ], { duration: letzter ? 1300 : 900 + w.r * 12, easing: "linear", fill: "forwards" }).onfinish = () => {
          ball.remove();
          partikel(x1, yBoden + 12, ["●"], Math.round(w.r * 0.9), w.r * 3, ["#fff"]);
          if (!letzter) {
            ziel.firstChild.animate([{ transform: "rotate(0)" }, { transform: "rotate(-10deg)" }, { transform: "rotate(6deg)" }, { transform: "rotate(0)" }], { duration: 500 });
            return;
          }
          // Der Riesen-Schneeball katapultiert das rechte Capy aus dem Bild
          const b = figur("<span>Huiii! 💫</span>", "sp-blase", { left: Math.min(W - 70, W * 0.96 - gr * 0.5) + "px", bottom: gr * 1.4 + H * 0.08 + "px" });
          spaeter(1200, () => b.remove());
          rechts.animate([
            { transform: "translate(0,0) rotate(0)" },
            { transform: "translate(" + W * 0.25 + "px," + -H * 0.45 + "px) rotate(260deg)", offset: 0.5 },
            { transform: "translate(" + W * 0.6 + "px," + -H * 0.9 + "px) rotate(620deg) scale(.6)" },
          ], { duration: 1500, easing: "cubic-bezier(.2,.7,.4,1)", fill: "forwards" });
          spaeter(400, () => partikel(W * 0.85, yBoden - H * 0.3, ["✨", "⭐"], 8, 40, ["#f3c84b"]));
          // Das linke Capy hat gewonnen und tanzt
          spaeter(1400, () => {
            const sieg = figur("<span>Gewonnen! 🏆</span>", "sp-blase", { left: Math.max(70, W * 0.04 + gr * 0.5) + "px", bottom: gr * 1.35 + H * 0.08 + "px" });
            links.firstChild.animate([
              { transform: "translateY(0) rotate(0)" }, { transform: "translateY(-30px) rotate(-12deg)" }, { transform: "translateY(0) rotate(0)" },
              { transform: "translateY(-30px) rotate(12deg)" }, { transform: "translateY(0) rotate(0)" },
            ], { duration: 900, iterations: 3, easing: "ease-in-out" });
            links.animate([{ transform: "translateX(0)" }, { transform: "translateX(" + W * 0.25 + "px)" }, { transform: "translateX(0)" }], { duration: 2700, easing: "ease-in-out" });
            for (let k = 0; k < 4; k++) spaeter(k * 600, () => partikel(W * 0.2 + k * 20, yBoden - 30, ["♪", "🎉", "♫"], 6, 60, ["#9d2449", "#e85d7e"]));
            spaeter(2600, () => sieg.remove());
          });
        };
      };
      wuerfe.forEach((w, i) => spaeter(900 + i * 1000, () => wirf(w, i, false)));
      spaeter(900 + wuerfe.length * 1000 + 300, () => wirf({ von: "l", r: 34 }, 99, true));
    } },

    23: { titel: "Capy-Polonaise 🎶", dauer: 12500, spiel() {
      const gr = Math.min(W * 0.2, 96);
      const farben = ["#f3dc9f", "#fda4b8", "#9be3b0", "#7cc4f0", "#f3c84b", "#b39ddb", "#ff8fab", "#f3dc9f", "#9be3b0"];
      for (let i = 0; i < 9; i++) {
        const f = figur(capySeite({ hut: "party", hutFarbe: farben[i] }), "sp-polonaise", { width: gr + "px" });
        const y = H * 0.8 - gr * 0.6;
        const kf = [];
        for (let s = 0; s <= 10; s++) {
          const t = s / 10;
          kf.push({ transform: "translate(" + (-gr * 1.5 + t * (W + gr * 3)) + "px," + (y + Math.sin(t * Math.PI * 4) * H * 0.07) + "px) rotate(" + Math.cos(t * Math.PI * 4) * 6 + "deg)" });
        }
        f.animate(kf, { duration: 8500, delay: 600 + i * 380, easing: "linear", fill: "both" });
        f.firstChild.animate([{ transform: "translateY(0)" }, { transform: "translateY(-8px)" }], { duration: 300, direction: "alternate", iterations: Infinity });
      }
      for (let k = 0; k < 7; k++) spaeter(1200 + k * 1300, () => partikel(zufall(W * 0.1, W * 0.9), H * 0.45, ["♪", "♫"], 5, 70, ["#9d2449", "#e85d7e"]));
    } },

    24: { titel: "Die Capys backen Plätzchen 🍪", dauer: 10000, spiel() {
      const breite = Math.min(W * 0.62, 280);
      const blech = figur('<svg viewBox="0 0 200 40"><rect x="4" y="10" width="192" height="22" rx="6" fill="#9aa3ad"/><rect x="10" y="6" width="180" height="8" rx="4" fill="#c4cbd3"/></svg>', "sp-blech", { width: breite + "px" });
      const baecker = figur(capySeite({ hut: "koch" }), "sp-baecker", { width: Math.min(W * 0.3, 140) + "px" });
      [blech, baecker].forEach((f) => f.animate([{ opacity: 0, transform: f === blech ? "translate(-50%, 30px)" : "translateY(30px)" }, { opacity: 1, transform: f === blech ? "translate(-50%, 0)" : "none" }], { duration: 700, fill: "forwards" }));
      const kekse = [
        '<path d="M20 36S5 26 5 16A8 8 0 0 1 20 11a8 8 0 0 1 15 5c0 10-15 20-15 20z" fill="#d9a066" stroke="#b5763e" stroke-width="2"/><path d="M12 17h16" stroke="#fff" stroke-width="2" stroke-dasharray="3 3"/>',
        '<path d="M20 3l5 10 11 1.5-8 7.5 2 11-10-5.5-10 5.5 2-11-8-7.5 11-1.5z" fill="#e8b86d" stroke="#b5763e" stroke-width="2"/><circle cx="20" cy="20" r="3" fill="#e85d7e"/>',
        '<circle cx="20" cy="20" r="15" fill="#d9a066" stroke="#b5763e" stroke-width="2"/><circle cx="14" cy="16" r="2.4" fill="#5a3418"/><circle cx="24" cy="24" r="2.4" fill="#5a3418"/><circle cx="25" cy="14" r="2" fill="#5a3418"/>',
        '<path d="M20 4c6 0 9 4 9 9v2h3v6h-3v10a4 4 0 0 1-4 4H15a4 4 0 0 1-4-4V21H8v-6h3v-2c0-5 3-9 9-9z" fill="#c98a4e"/><circle cx="16" cy="12" r="1.6" fill="#3a2418"/><circle cx="24" cy="12" r="1.6" fill="#3a2418"/><path d="M15 24h10" stroke="#fff" stroke-width="2"/>',
      ];
      const yBlech = H - blech.offsetHeight - H * 0.1;
      for (let k = 0; k < 14; k++) spaeter(1200 + k * 520, () => {
        const keks = figur('<svg viewBox="0 0 40 40">' + kekse[k % kekse.length] + "</svg>", "sp-keks", { left: "0", top: "0" });
        const x0 = W / 2 + zufall(-breite * 0.35, breite * 0.35), dx = zufall(-W * 0.35, W * 0.35), hoch = zufall(H * 0.35, H * 0.65);
        keks.animate([
          { transform: "translate(" + x0 + "px," + yBlech + "px) rotate(0)" , opacity: 1 },
          { transform: "translate(" + (x0 + dx * 0.6) + "px," + (yBlech - hoch) + "px) rotate(" + zufall(-200, 200) + "deg)", opacity: 1, offset: 0.55 },
          { transform: "translate(" + (x0 + dx) + "px," + (yBlech - hoch * 0.6) + "px) rotate(" + zufall(-360, 360) + "deg)", opacity: 0 },
        ], { duration: 2200, easing: "cubic-bezier(.2,.8,.4,1)", fill: "forwards" });
      });
      for (const t of [1000, 3600, 6400]) spaeter(t, () => partikel(W / 2, yBlech, ["●"], 10, 50, ["rgba(255,255,255,.9)"]));
    } },

    25: { titel: "Morgen ist es so weit! 🎂", dauer: 12000, spiel() {
      const banner = figur('<span>Morgen ist dein Tag, Toni! ♥️</span>', "sp-banner");
      banner.animate([{ transform: "translateX(-50%) scaleX(0)" }, { transform: "translateX(-50%) scaleX(1)" }], { duration: 900, delay: 300, easing: "cubic-bezier(.3,1.3,.5,1)", fill: "both" });
      const breite = Math.min(W * 0.5, 230);
      const kuchen = figur('<svg viewBox="0 0 200 170">' +
        [50, 80, 110, 140].map((x, i) => '<rect x="' + (x - 3) + '" y="18" width="6" height="30" rx="2" fill="' + ["#7cc4f0", "#f3c84b", "#9be3b0", "#fda4b8"][i] + '"/><path class="sp-kerze" d="M' + x + ' 4c5 6 5 10 0 13-5-3-5-7 0-13z" fill="#ffb648"/>').join("") +
        '<rect x="22" y="46" width="156" height="50" rx="10" fill="#fda4b8"/><path d="M22 60q13 14 26 0t26 0 26 0 26 0 26 0 26 0" fill="#fff"/>' +
        '<rect x="10" y="94" width="180" height="62" rx="12" fill="#e85d7e"/><path d="M10 110q15 14 30 0t30 0 30 0 30 0 30 0 30 0" fill="#fff"/>' +
        '<circle cx="50" cy="132" r="5" fill="#f3c84b"/><circle cx="100" cy="136" r="5" fill="#fff"/><circle cx="150" cy="132" r="5" fill="#f3c84b"/>' +
        '<rect x="0" y="154" width="200" height="12" rx="6" fill="#d4a84b"/></svg>', "sp-kuchen", { width: breite + "px" });
      const gr = Math.min(W * 0.26, 120);
      const traeger = [
        figur(capySeite({ hut: "party", hutFarbe: "#9be3b0" }), "sp-traeger", { width: gr + "px" }),
        figur(capySeite({ hut: "party", hutFarbe: "#f3c84b" }), "sp-traeger sp-gespiegelt", { width: gr + "px" }),
      ];
      kuchen.animate([{ transform: "translate(-50%, 130%)" }, { transform: "translate(-50%, 0)" }], { duration: 2600, delay: 600, easing: "cubic-bezier(.2,.8,.3,1)", fill: "both" });
      traeger[0].animate([{ left: -gr + "px" }, { left: "calc(50% - " + (breite / 2 + gr * 0.85) + "px)" }], { duration: 2600, delay: 600, easing: "ease-out", fill: "both" });
      traeger[1].animate([{ left: W + "px" }, { left: "calc(50% + " + (breite / 2 - gr * 0.15) + "px)" }], { duration: 2600, delay: 600, easing: "ease-out", fill: "both" });
      traeger.forEach((t) => t.firstChild.animate([{ transform: "translateY(0)" }, { transform: "translateY(-6px)" }], { duration: 260, direction: "alternate", iterations: 10 }));
      const farben = ["#e85d7e", "#f3c84b", "#7cc4f0", "#9be3b0", "#b39ddb"];
      spaeter(3300, () => {
        for (let i = 0; i < 8; i++) {
          const b = figur('<svg viewBox="0 0 60 90"><path d="M30 60 Q26 75 30 90" stroke="#9d8a90" fill="none"/><ellipse cx="30" cy="30" rx="24" ry="29" fill="' + farben[i % 5] + '"/><ellipse cx="22" cy="20" rx="6" ry="9" fill="#fff" opacity=".35"/></svg>',
            "sp-ballon-frei", { left: zufall(2, 92) + "%", width: zufall(40, 64) + "px" });
          b.animate([{ transform: "translateY(0)" }, { transform: "translateY(-" + (H + 200) + "px)" }], { duration: zufall(5500, 8000), delay: i * 250, easing: "ease-in", fill: "both" });
        }
        partikel(W / 2, H * 0.5, ["♥", "✨", "🎉"], 16, 140, ["#e85d7e", "#f3c84b"]);
      });
    } },
  };

  /* ---------- Bühne und Ablauf ---------- */
  function heutigeSzene() {
    if (!api.bereit() || api.phase() !== "warten") return null;
    const d = api.datum();
    if (d.monat !== 11 || !SZENEN[d.tag]) return null;
    return d.tag;
  }

  const knopf = document.createElement("button");
  knopf.type = "button";
  knopf.className = "special-knopf";
  knopf.hidden = true;
  knopf.textContent = "🐹 Capy-Special nochmal ansehen";
  intro.appendChild(knopf);

  let laeuft = false;
  function spiele(tag) {
    const s = SZENEN[tag];
    if (!s || laeuft) return;
    laeuft = true;
    knopf.hidden = true;
    const rahmen = document.createElement("div");
    rahmen.className = "special-buehne";
    intro.appendChild(rahmen);
    const titel = document.createElement("p");
    titel.className = "special-titel";
    titel.textContent = s.titel;
    rahmen.appendChild(titel);
    // Die Szene spielt etwas über dem unteren Bildschirmrand
    buehne = document.createElement("div");
    buehne.className = "special-raum";
    rahmen.appendChild(buehne);
    W = buehne.offsetWidth || window.innerWidth;
    H = buehne.offsetHeight || window.innerHeight;
    if (ruhig) {
      spaeter(4000, ende);
    } else {
      try { s.spiel(); } catch (_) { /* eine Szene darf nie die Seite stören */ }
      spaeter(s.dauer, ende);
    }
    function ende() {
      const b = rahmen;
      b.classList.add("vorbei");
      setTimeout(() => b.remove(), 700);
      timer.forEach(clearTimeout); timer = [];
      laeuft = false;
      if (heutigeSzene()) knopf.hidden = false;
    }
  }
  knopf.addEventListener("click", () => { const t = heutigeSzene(); if (t) spiele(t); });

  // Einmal automatisch abspielen, sobald die Zeit vom Server da ist
  let gestartet = false;
  const warte = setInterval(() => {
    if (!api.bereit()) return;
    const t = heutigeSzene();
    if (!t) { if (api.phase() !== "laden") clearInterval(warte); knopf.hidden = true; return; }
    if (!gestartet) { gestartet = true; setTimeout(() => spiele(t), 900); }
    else if (!laeuft && api.phase() !== "warten") knopf.hidden = true;
  }, 300);

  window.adventkalender.spieleSpecial = spiele;
})();
