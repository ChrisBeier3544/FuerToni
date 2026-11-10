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
  // Capybara von der Seite, schaut nach rechts
  function capySeite(o) {
    o = o || {};
    const beine = o.ohneBeine ? "" :
      '<rect x="16" y="40" width="7" height="11" rx="3" fill="' + DUNKEL + '"/><rect x="26" y="40" width="7" height="11" rx="3" fill="#8a5a3a"/>' +
      '<rect x="42" y="40" width="7" height="11" rx="3" fill="' + DUNKEL + '"/><rect x="51" y="40" width="7" height="11" rx="3" fill="#8a5a3a"/>';
    return '<svg viewBox="0 -16 86 68" aria-hidden="true">' + beine +
      (o.unten || "") +
      '<ellipse cx="34" cy="31" rx="27" ry="16" fill="' + FELL + '"/>' +
      '<rect x="48" y="12" width="24" height="24" rx="10" fill="' + FELL + '"/>' +
      '<rect x="62" y="18" width="13" height="16" rx="6" fill="' + DUNKEL + '"/>' +
      '<ellipse cx="55" cy="12" rx="3.5" ry="3" fill="' + OHR + '"/>' +
      '<path d="M60 22q2.5-2 5 0" fill="none" stroke="' + AUGE + '" stroke-width="1.8" stroke-linecap="round"/>' +
      '<ellipse cx="72" cy="23" rx="1.4" ry="1" fill="' + AUGE + '"/>' +
      '<circle cx="62" cy="28" r="2.4" fill="#f7809b" opacity=".55"/>' +
      (o.hut ? HUETE[o.hut](o.hutFarbe) : "") +
      (o.halt ? HALTEN[o.halt] : "") +
      "</svg>";
  }
  // Capybara von vorne (Gesicht)
  function capyFront(o) {
    o = o || {};
    return '<svg viewBox="0 -12 56 58" aria-hidden="true">' +
      '<ellipse cx="14" cy="9" rx="5" ry="4" fill="' + OHR + '"/><ellipse cx="42" cy="9" rx="5" ry="4" fill="' + OHR + '"/>' +
      '<rect x="7" y="6" width="42" height="36" rx="17" fill="' + FELL + '"/>' +
      '<ellipse cx="28" cy="31" rx="13" ry="9.5" fill="' + DUNKEL + '"/>' +
      '<ellipse cx="23.5" cy="28.5" rx="1.8" ry="1.1" fill="' + AUGE + '"/><ellipse cx="32.5" cy="28.5" rx="1.8" ry="1.1" fill="' + AUGE + '"/>' +
      '<path d="M25 35q3 2 6 0" fill="none" stroke="' + AUGE + '" stroke-width="1.4" stroke-linecap="round"/>' +
      '<path d="M14 20q3-2.5 6 0M36 20q3-2.5 6 0" fill="none" stroke="' + AUGE + '" stroke-width="1.8" stroke-linecap="round"/>' +
      '<circle cx="14" cy="27" r="2.6" fill="#f7809b" opacity=".6"/><circle cx="42" cy="27" r="2.6" fill="#f7809b" opacity=".6"/>' +
      (o.yuzu ? '<circle cx="28" cy="1" r="7" fill="#ffb020"/><circle cx="25.5" cy="-1.5" r="1.6" fill="#fff" opacity=".5"/><path d="M28 -6q3-4 7-2" stroke="#4a8a5c" stroke-width="2" fill="none"/>' : "") +
      (o.helm ? '<path d="M7 18a21 21 0 0 1 42 0z" fill="#7cc4f0" opacity=".35"/>' : "") +
      "</svg>";
  }

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
    15: { titel: "Die Capy Crew geht auf Ballonfahrt 🎈", dauer: 12500, spiel() {
      const farben = ["#e85d7e", "#f3c84b", "#7cc4f0", "#9be3b0", "#c2185b", "#fda4b8", "#b39ddb"];
      for (let i = 0; i < 7; i++) {
        const gr = zufall(70, 110);
        const f = figur(
          '<svg class="sp-ballon" viewBox="0 0 60 90"><path d="M30 60 Q26 75 30 90" stroke="#9d8a90" fill="none"/><ellipse cx="30" cy="30" rx="24" ry="29" fill="' + farben[i] + '"/><ellipse cx="22" cy="20" rx="6" ry="9" fill="#fff" opacity=".35"/><path d="M27 58h6l-3 5z" fill="' + farben[i] + '"/></svg>' + capyFront(),
          "sp-ballonfahrer", { left: (i / 7) * 92 + zufall(-2, 4) + "%", bottom: "-260px", width: gr + "px" });
        f.animate([{ transform: "translateY(0)" }, { transform: "translateY(-" + (H + 420) + "px)" }],
          { duration: zufall(8000, 10500), delay: i * 420, easing: "ease-in-out", fill: "forwards" });
        f.firstChild.animate([{ transform: "rotate(-6deg)" }, { transform: "rotate(6deg)" }],
          { duration: 1600, direction: "alternate", iterations: Infinity, easing: "ease-in-out" });
      }
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

    18: { titel: "Wellness-Tag im Capy-Onsen ♨️", dauer: 10500, spiel() {
      const breite = Math.min(W * 0.95, 460);
      const quelle = figur('<div class="sp-becken"></div>', "sp-onsen", { width: breite + "px" });
      quelle.animate([{ opacity: 0, transform: "translate(-50%, 30px)" }, { opacity: 1, transform: "translate(-50%, 0)" }], { duration: 900, fill: "forwards" });
      const becken = quelle.firstChild;
      for (let i = 0; i < 3; i++) {
        const c = document.createElement("div");
        c.className = "sp-badegast";
        c.innerHTML = capyFront({ yuzu: true });
        c.style.left = 12 + i * 29 + "%";
        c.style.animationDelay = -i * 0.7 + "s";
        becken.appendChild(c);
        c.animate([{ transform: "translateY(60%)" }, { transform: "translateY(0)" }], { duration: 1200, delay: 700 + i * 400, easing: "cubic-bezier(.3,1.4,.5,1)", fill: "backwards" });
      }
      const wasser = document.createElement("div");
      wasser.className = "sp-wasser";
      becken.appendChild(wasser);
      const ente = document.createElement("span");
      ente.className = "sp-ente"; ente.textContent = "🐤";
      becken.appendChild(ente);
      for (let k = 0; k < 6; k++) dampf(becken, breite * (0.12 + k * 0.15), 10, 2);
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

    20: { titel: "Matcha-Bad für die Capy Crew 🍵", dauer: 10000, spiel() {
      const gr = Math.min(W * 0.52, 230);
      const becher = figur(
        '<div class="sp-matcha-koepfe"></div>' +
        '<svg viewBox="0 0 200 260"><path d="M120 10 L105 70" stroke="#9d2449" stroke-width="8" stroke-linecap="round"/><path d="M20 40 h160 l-16 205 a14 14 0 0 1-14 13 H50 a14 14 0 0 1-14-13z" fill="#eef7e6" opacity=".92" stroke="#4a7c3a" stroke-width="3"/>' +
        '<path d="M26 90 h148 l-11 152 a10 10 0 0 1-10 9 H47 a10 10 0 0 1-10-9z" fill="#8fbf5a"/><path d="M26 90 q37 18 74 0 t74 0" fill="none" stroke="#f6fbef" stroke-width="7" stroke-linecap="round"/>' +
        '<rect x="55" y="140" width="34" height="34" rx="8" fill="#fff" opacity=".6" transform="rotate(-12 72 157)"/><rect x="105" y="170" width="30" height="30" rx="8" fill="#fff" opacity=".6" transform="rotate(10 120 185)"/>' +
        '<rect x="12" y="30" width="176" height="16" rx="8" fill="#4a7c3a"/></svg>',
        "sp-matcha", { width: gr + "px" });
      becher.animate([{ transform: "translate(-50%, 110%)" }, { transform: "translate(-50%, 0)" }], { duration: 1300, easing: "cubic-bezier(.2,.9,.3,1.1)", fill: "forwards" });
      const koepfe = becher.firstChild;
      for (let i = 0; i < 3; i++) {
        const k = document.createElement("div");
        k.className = "sp-matcha-kopf";
        k.innerHTML = capyFront();
        k.style.left = 14 + i * 26 + "%";
        koepfe.appendChild(k);
        k.animate([{ transform: "translateY(90%)" }, { transform: "translateY(0)" }, { transform: "translateY(10%)" }, { transform: "translateY(0)" }],
          { duration: 1600, delay: 1500 + i * 450, easing: "ease-out", fill: "backwards" });
      }
      for (const t of [3200, 5200, 7200]) spaeter(t, () => partikel(W / 2, H - gr * 1.15, ["♥", "🍵", "♥"], 7, 80, ["#4a8a5c", "#e85d7e"]));
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

    22: { titel: "Schneeballschlacht! ❄️", dauer: 10000, spiel() {
      const gr = Math.min(W * 0.3, 140);
      const links = figur(capySeite({ hut: "muetze" }), "sp-werfer", { left: "4%", width: gr + "px" });
      const rechts = figur(capySeite(), "sp-werfer sp-gespiegelt", { right: "4%", width: gr + "px" });
      [links, rechts].forEach((f, i) => f.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 600, delay: i * 200, fill: "both" }));
      const yBoden = H - gr * 0.62 - H * 0.08;
      for (let w = 0; w < 7; w++) spaeter(900 + w * 1150, () => {
        const vonLinks = w % 2 === 0;
        const x0 = vonLinks ? W * 0.04 + gr * 0.85 : W * 0.96 - gr * 0.85, x1 = vonLinks ? W * 0.96 - gr * 0.55 : W * 0.04 + gr * 0.55;
        const ball = figur("", "sp-schneeball", { left: "0", top: "0" });
        const hoch = yBoden - Math.min(H * 0.35, 260);
        ball.animate([
          { transform: "translate(" + x0 + "px," + yBoden + "px)" },
          { transform: "translate(" + (x0 + x1) / 2 + "px," + hoch + "px)" },
          { transform: "translate(" + x1 + "px," + (yBoden + 10) + "px)" },
        ], { duration: 950, easing: "linear", fill: "forwards" }).onfinish = () => {
          ball.remove();
          partikel(x1, yBoden + 14, ["●"], 9, 40, ["#fff"]);
          (vonLinks ? rechts : links).firstChild.animate([{ transform: "rotate(0)" }, { transform: "rotate(-10deg)" }, { transform: "rotate(6deg)" }, { transform: "rotate(0)" }], { duration: 500 });
        };
        (vonLinks ? links : rechts).firstChild.animate([{ transform: "rotate(0)" }, { transform: "rotate(-14deg)" }, { transform: "rotate(0)" }], { duration: 400 });
      });
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
    W = window.innerWidth; H = window.innerHeight;
    buehne = document.createElement("div");
    buehne.className = "special-buehne";
    intro.appendChild(buehne);
    const titel = document.createElement("p");
    titel.className = "special-titel";
    titel.textContent = s.titel;
    buehne.appendChild(titel);
    if (ruhig) {
      spaeter(4000, ende);
    } else {
      try { s.spiel(); } catch (_) { /* eine Szene darf nie die Seite stören */ }
      spaeter(s.dauer, ende);
    }
    function ende() {
      const b = buehne;
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
