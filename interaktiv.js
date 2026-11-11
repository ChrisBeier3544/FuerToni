/*
 * ===========================================================
 *  KLEINE ÜBERRASCHUNGEN ZUM ANTIPPEN
 *  Antippen, eine kurze Animation läuft, danach ist alles wie vorher.
 *    1. Kerzen am Adventskranz: auspusten, Rauchherz, gehen wieder an
 *    2. Lichterkette: Lichtwelle, ein Birnchen mit Wackelkontakt
 *    3. Polaroids oben: gedrückt halten, das Foto entwickelt sich neu
 *    4. Kugeln an den Tannenzweigen: schwingen, Glöckchen, Glitzer
 *    5. Capy Paar unten: Mistelzweig und Bussi
 *    6. Mond: Sternschnuppenregen / Sonne: Sonnenbrille
 * ===========================================================
 */
(function () {
  "use strict";
  const melde = (id) => { const a = window.adventkalender; if (a && a.entdeckt) a.entdeckt(id); };

  const ruhig = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const html = document.documentElement;
  const NS = "http://www.w3.org/2000/svg";
  const warte = (ms) => new Promise((r) => setTimeout(r, ms));

  /* ---------- 1. Kerzen auspusten ---------- */
  function kerzen() {
    const kranz = document.getElementById("adventskranz");
    if (!kranz) return;
    kranz.addEventListener("click", async (e) => {
      const kerze = e.target.closest && e.target.closest(".kerze");
      if (!kerze || ruhig || kerze.dataset.laeuft) return;
      kerze.dataset.laeuft = "1";
      const flamme = kerze.querySelector(".flamme");
      if (!kerze.classList.contains("brennt")) {
        // Kerze brennt noch nicht: sie wackelt nur kurz
        await kerze.animate([{ transform: "rotate(0)" }, { transform: "rotate(-4deg)" }, { transform: "rotate(3deg)" }, { transform: "rotate(0)" }],
          { duration: 500, easing: "ease-in-out" }).finished.catch(() => {});
        delete kerze.dataset.laeuft;
        return;
      }
      // hochflackern und auspusten
      await flamme.animate([
        { transform: "scale(1)", opacity: 1 },
        { transform: "scale(1.35, 1.7)", opacity: 1, offset: 0.35 },
        { transform: "scale(.8, 1.1) skewX(-25deg)", opacity: 1, offset: 0.7 },
        { transform: "scale(.15, .25) skewX(-35deg)", opacity: 0 },
      ], { duration: 950, easing: "ease-in" }).finished.catch(() => {});
      kerze.classList.add("aus");
      rauchHerz(kerze);
      melde("kerze");
      await warte(2300);
      kerze.classList.remove("aus");
      flamme.animate([
        { transform: "scale(0)", opacity: 0 },
        { transform: "scale(1.25)", opacity: 1, offset: 0.6 },
        { transform: "scale(1)", opacity: 1 },
      ], { duration: 600, easing: "ease-out" });
      await warte(600);
      delete kerze.dataset.laeuft;
    });
  }
  function rauchHerz(kerze) {
    const docht = kerze.querySelector("rect");
    const x = +docht.getAttribute("x") + 9, y = +docht.getAttribute("y") - 6;
    const g = document.createElementNS(NS, "g");
    g.setAttribute("class", "rauch-herz");
    g.setAttribute("transform", "translate(" + x + " " + y + ")");
    const p = document.createElementNS(NS, "path");
    p.setAttribute("d", "M0 -2 c-2.5 -4 -8 -3 -8 1.5 c0 4 8 8.5 8 8.5 s8 -4.5 8 -8.5 c0 -4.5 -5.5 -5.5 -8 -1.5z");
    const faden = document.createElementNS(NS, "path");
    faden.setAttribute("d", "M0 10 q-3 5 0 9 q3 4 0 8");
    g.append(faden, p);
    kerze.parentNode.appendChild(g);
    p.animate([
      { transform: "translateY(0) scale(.4)", opacity: 0 },
      { transform: "translate(2px,-10px) scale(.9)", opacity: 0.85, offset: 0.3 },
      { transform: "translate(-3px,-28px) scale(1.5)", opacity: 0.5, offset: 0.7 },
      { transform: "translate(1px,-40px) scale(1.9)", opacity: 0 },
    ], { duration: 2400, easing: "ease-out", fill: "forwards" });
    faden.animate([{ opacity: 0.7 }, { opacity: 0, transform: "translateY(-14px)" }], { duration: 1400, fill: "forwards" })
      .finished.then(() => setTimeout(() => g.remove(), 1100), () => g.remove());
  }

  /* ---------- 2. Lichterkette: Lichtwelle ---------- */
  function lichterkette() {
    const box = document.getElementById("lichterkette");
    if (!box) return;
    let laeuft = false;
    box.addEventListener("click", (e) => {
      if (ruhig || laeuft || box.classList.contains("fest")) return;
      const birnen = [...box.querySelectorAll(".birne")];
      if (!birnen.length) return;
      laeuft = true;
      melde("welle");
      const r = box.getBoundingClientRect();
      const start = Math.max(0, Math.min(birnen.length - 1, Math.floor(((e.clientX - r.left) / r.width) * birnen.length)));
      const farben = ["#ff8fab", "#ffd36b"];
      let ende = 0;
      birnen.forEach((b, i) => {
        const abstand = Math.abs(i - start);
        const t = abstand * 65;
        ende = Math.max(ende, t);
        setTimeout(() => {
          b.style.setProperty("--welle", farben[(i + start) % 2]);
          b.classList.add("welle");
          setTimeout(() => b.classList.remove("welle"), 420);
        }, t);
      });
      // ein Birnchen hat kurz einen Wackelkontakt
      const wackel = birnen[Math.floor(Math.random() * birnen.length)];
      setTimeout(() => {
        wackel.classList.add("wackelkontakt");
        setTimeout(() => wackel.classList.remove("wackelkontakt"), 1100);
      }, ende + 500);
      setTimeout(() => { laeuft = false; }, ende + 1700);
    });
  }

  /* ---------- 3. Polaroid entwickelt sich neu (gedrückt halten) ---------- */
  function polaroids() {
    const box = document.getElementById("titelfotos");
    if (!box) return;
    let timer = null, gehalten = false, startX = 0, startY = 0;
    box.addEventListener("contextmenu", (e) => { if (e.target.closest(".polaroid")) e.preventDefault(); });
    box.addEventListener("pointerdown", (e) => {
      const p = e.target.closest(".polaroid");
      if (!p || ruhig) return;
      gehalten = false; startX = e.clientX; startY = e.clientY;
      clearTimeout(timer);
      timer = setTimeout(() => { gehalten = true; entwickle(p); }, 480);
    });
    const abbrechen = () => clearTimeout(timer);
    box.addEventListener("pointerup", abbrechen);
    box.addEventListener("pointercancel", abbrechen);
    box.addEventListener("pointerleave", abbrechen);
    box.addEventListener("pointermove", (e) => {
      if (Math.hypot(e.clientX - startX, e.clientY - startY) > 10) clearTimeout(timer);
    });
    // nach dem Halten nicht zusätzlich das Foto groß öffnen
    box.addEventListener("click", (e) => {
      if (gehalten) { e.stopPropagation(); e.preventDefault(); gehalten = false; }
    }, true);
  }
  function entwickle(p) {
    if (p.dataset.entwickelt) return;
    p.dataset.entwickelt = "1";
    melde("polaroid");
    const img = p.querySelector("img");
    if (!img) return;
    const schicht = document.createElement("i");
    schicht.className = "polaroid-chemie";
    p.appendChild(schicht);
    const r = img.getBoundingClientRect(), pr = p.getBoundingClientRect();
    schicht.style.left = r.left - pr.left + "px";
    schicht.style.top = r.top - pr.top + "px";
    schicht.style.width = r.width + "px";
    schicht.style.height = r.height + "px";
    if (navigator.vibrate) try { navigator.vibrate(15); } catch (_) { /* egal */ }
    // kurz wedeln wie bei einem echten Sofortbild
    p.animate([
      { translate: "0 0", rotate: "0deg" }, { translate: "-3px 0", rotate: "-2deg" }, { translate: "3px 0", rotate: "2deg" },
      { translate: "-2px 0", rotate: "-1deg" }, { translate: "0 0", rotate: "0deg" },
    ], { duration: 700, easing: "ease-in-out" });
    schicht.animate([{ opacity: 1 }, { opacity: 1, offset: 0.15 }, { opacity: 0 }], { duration: 3200, easing: "ease-in", fill: "forwards" });
    img.animate([
      { filter: "sepia(.9) saturate(.3) contrast(.6) brightness(.6) blur(2px)" },
      { filter: "sepia(.5) saturate(.6) contrast(.8) brightness(.85) blur(1px)", offset: 0.55 },
      { filter: "none" },
    ], { duration: 3400, easing: "ease-out" }).finished.then(() => {
      schicht.remove();
      delete p.dataset.entwickelt;
    }, () => { schicht.remove(); delete p.dataset.entwickelt; });
  }

  /* ---------- 4. Kugeln: schwingen, Glöckchen, Glitzer ---------- */
  let ton = null;
  function gloeckchen(tief) {
    try {
      ton = ton || new (window.AudioContext || window.webkitAudioContext)();
      if (ton.state === "suspended") ton.resume();
      const jetzt = ton.currentTime;
      const grund = tief ? 1046.5 : 1318.5;
      [[1, 0.16], [2.76, 0.05], [5.4, 0.025]].forEach(([f, lautstaerke]) => {
        const o = ton.createOscillator(), v = ton.createGain();
        o.type = "sine";
        o.frequency.value = grund * f;
        v.gain.setValueAtTime(0.0001, jetzt);
        v.gain.exponentialRampToValueAtTime(lautstaerke, jetzt + 0.01);
        v.gain.exponentialRampToValueAtTime(0.0001, jetzt + 1.6);
        o.connect(v).connect(ton.destination);
        o.start(jetzt);
        o.stop(jetzt + 1.7);
      });
    } catch (_) { /* ohne Ton */ }
  }
  function glitzer(x, y) {
    for (let k = 0; k < 10; k++) {
      const s = document.createElement("span");
      s.className = "glitzer-funke";
      s.textContent = k % 3 ? "✦" : "✧";
      s.style.left = x + (Math.random() * 16 - 8) + "px";
      s.style.top = y + (Math.random() * 8) + "px";
      s.style.color = ["#f3c84b", "#ffe9a8", "#ff8fab", "#fff"][k % 4];
      s.style.fontSize = 7 + Math.random() * 7 + "px";
      document.body.appendChild(s);
      const dx = Math.random() * 40 - 20, dy = 50 + Math.random() * 60;
      s.animate([
        { transform: "translate(0,0) scale(.4)", opacity: 0 },
        { transform: "translate(" + dx * 0.3 + "px," + dy * 0.2 + "px) scale(1)", opacity: 1, offset: 0.2 },
        { transform: "translate(" + dx + "px," + dy + "px) rotate(" + (dx * 6) + "deg) scale(.6)", opacity: 0 },
      ], { duration: 1200 + Math.random() * 700, delay: k * 40, easing: "ease-in", fill: "both" })
        .finished.then(() => s.remove(), () => s.remove());
    }
  }
  function kugeln() {
    const start = setInterval(() => {
      const liste = document.querySelectorAll(".zweig .kugel");
      if (!liste.length) return;
      clearInterval(start);
      liste.forEach((kugel) => {
        // größere, unsichtbare Fläche zum Antippen
        const kreis = kugel.querySelector("circle");
        const treffer = document.createElementNS(NS, "circle");
        treffer.setAttribute("cx", kreis.getAttribute("cx"));
        treffer.setAttribute("cy", kreis.getAttribute("cy"));
        treffer.setAttribute("r", 17);
        treffer.setAttribute("class", "kugel-treffer");
        kugel.appendChild(treffer);
        kugel.addEventListener("click", (e) => {
          e.stopPropagation();
          gloeckchen(kugel.classList.contains("kugel-b"));
          if (ruhig || kugel.dataset.laeuft) return;
          kugel.dataset.laeuft = "1";
          melde("kugel");
          const r = kreis.getBoundingClientRect();
          glitzer(r.left + r.width / 2, r.bottom);
          kugel.animate([
            { transform: "rotate(0deg)" }, { transform: "rotate(30deg)" }, { transform: "rotate(-24deg)" },
            { transform: "rotate(17deg)" }, { transform: "rotate(-11deg)" }, { transform: "rotate(6deg)" }, { transform: "rotate(0deg)" },
          ], { duration: 2400, easing: "ease-in-out" }).finished.then(() => delete kugel.dataset.laeuft, () => delete kugel.dataset.laeuft);
        });
      });
    }, 300);
  }

  /* ---------- 5. Capy Paar: Mistelzweig und Bussi ---------- */
  function capyPaar() {
    const box = document.querySelector(".capy-familie");
    const svg = box && box.querySelector("svg");
    if (!svg) return;
    box.removeAttribute("aria-hidden");
    box.setAttribute("role", "button");
    box.setAttribute("aria-label", "Capy Paar antippen");
    box.tabIndex = 0;
    const gruppen = [...svg.children].filter((g) => g.tagName === "g" && !g.classList.contains("laterne"));
    const [links, rechts] = gruppen.map((g) => {
      const huelle = document.createElementNS(NS, "g");
      huelle.setAttribute("class", "capy-huelle");
      g.parentNode.insertBefore(huelle, g);
      huelle.appendChild(g);
      return huelle;
    });
    if (!links || !rechts) return;
    const mistel = document.createElementNS(NS, "g");
    mistel.setAttribute("class", "mistelzweig");
    mistel.innerHTML =
      '<path d="M72 -60 V-4" stroke="#c9a58f" stroke-width="1"/>' +
      '<g transform="translate(72 0)">' +
      '<ellipse cx="-7" cy="2" rx="8" ry="3.4" transform="rotate(-28 -7 2)" fill="#4f8a5b"/>' +
      '<ellipse cx="7" cy="2" rx="8" ry="3.4" transform="rotate(28 7 2)" fill="#3f7f55"/>' +
      '<ellipse cx="-4" cy="6" rx="7" ry="3" transform="rotate(-60 -4 6)" fill="#5c9a66"/>' +
      '<ellipse cx="4" cy="6" rx="7" ry="3" transform="rotate(60 4 6)" fill="#4f8a5b"/>' +
      '<circle cx="-2" cy="4" r="2.4" fill="#fffaf0"/><circle cx="2.6" cy="4.6" r="2.4" fill="#fffaf0"/><circle cx="0.3" cy="7.4" r="2.2" fill="#fffaf0"/>' +
      '<path d="M-5 -3 q5 -5 10 0 q-5 3 -10 0z" fill="#d6304f"/></g>';
    svg.appendChild(mistel);
    const wangen = [...svg.querySelectorAll('circle[fill="#f7809b"]')];
    let laeuft = false;
    async function bussi() {
      if (laeuft || ruhig) return;
      laeuft = true;
      melde("paar");
      const opt = (ms) => ({ duration: ms, easing: "ease-in-out", fill: "forwards" });
      mistel.animate([{ transform: "translateY(-50px)", opacity: 0 }, { transform: "translateY(4px)", opacity: 1, offset: 0.75 }, { transform: "translateY(0)", opacity: 1 }], opt(700));
      await warte(750);
      links.animate([{ transform: "none" }, { transform: "translate(3px,-3px) rotate(7deg)" }], opt(550));
      rechts.animate([{ transform: "none" }, { transform: "translate(-3px,-3px) rotate(-7deg)" }], opt(550));
      await warte(560);
      // Bussi!
      herzchen(box);
      wangen.forEach((w) => w.animate([{ opacity: 0.6 }, { opacity: 1, fill: "#ff4d7d" }], opt(400)));
      await warte(1000);
      // verlegen zur Seite schauen
      links.animate([{ transform: "translate(3px,-3px) rotate(7deg)" }, { transform: "translate(-4px,0) rotate(-12deg)" }], opt(450));
      rechts.animate([{ transform: "translate(-3px,-3px) rotate(-7deg)" }, { transform: "translate(4px,0) rotate(13deg)" }], opt(450));
      await warte(1300);
      links.animate([{ transform: "translate(-4px,0) rotate(-12deg)" }, { transform: "none" }], opt(600));
      rechts.animate([{ transform: "translate(4px,0) rotate(13deg)" }, { transform: "none" }], opt(600));
      wangen.forEach((w) => w.animate([{ opacity: 1, fill: "#ff4d7d" }, { opacity: 0.6, fill: "#f7809b" }], opt(900)));
      mistel.animate([{ transform: "translateY(0)", opacity: 1 }, { transform: "translateY(-50px)", opacity: 0 }], opt(700));
      await warte(950);
      for (const el of [links, rechts, mistel, ...wangen]) el.getAnimations().forEach((a) => a.cancel());
      laeuft = false;
    }
    box.addEventListener("click", bussi);
    box.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); bussi(); } });
  }
  function herzchen(box) {
    for (let k = 0; k < 7; k++) {
      const h = document.createElement("span");
      h.className = "bussi-herz";
      h.textContent = "♥";
      h.style.left = 31 + Math.random() * 8 + "%";
      h.style.top = 14 + Math.random() * 10 + "%";
      h.style.fontSize = 11 + Math.random() * 10 + "px";
      box.appendChild(h);
      const dx = Math.random() * 50 - 25;
      h.animate([
        { transform: "translate(0,0) scale(.3)", opacity: 0 },
        { transform: "translate(" + dx * 0.3 + "px,-14px) scale(1.1)", opacity: 1, offset: 0.25 },
        { transform: "translate(" + dx + "px,-70px) scale(.8)", opacity: 0 },
      ], { duration: 1500 + Math.random() * 500, delay: k * 90, easing: "ease-out", fill: "both" })
        .finished.then(() => h.remove(), () => h.remove());
    }
  }

  /* ---------- 6. Mond: Sternschnuppenregen, Sonne: Sonnenbrille ---------- */
  function aktiverHimmel() {
    const intro = document.getElementById("intro");
    if (intro && !intro.hidden) return intro.querySelector(":scope > .himmel2");
    return document.querySelector(".himmel > .himmel2");
  }
  function getroffen(el, x, y, rand) {
    if (!el || +getComputedStyle(el).opacity < 0.3) return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && x >= r.left - rand && x <= r.right + rand && y >= r.top - rand && y <= r.bottom + rand;
  }
  let regen = false;
  function sternschnuppenRegen(h, mond) {
    if (regen) return;
    regen = true;
    melde("mond");
    mond.animate([
      { transform: "scale(1)", filter: "drop-shadow(0 0 14px rgba(253,241,204,.6))" },
      { transform: "scale(1.25)", filter: "drop-shadow(0 0 30px rgba(255,248,220,1))", offset: 0.3 },
      { transform: "scale(1)", filter: "drop-shadow(0 0 14px rgba(253,241,204,.6))" },
    ], { duration: 1200, easing: "ease-out" });
    const box = h.querySelector(".h2-schnuppen");
    const ANZAHL = 26;
    for (let k = 0; k < ANZAHL; k++) {
      setTimeout(() => {
        const s = document.createElement("span");
        s.className = "h2-schnuppe";
        const x = -5 + Math.random() * 85, y = -4 + Math.random() * 40;
        const winkel = 24 + Math.random() * 14, laenge = 220 + Math.random() * 220;
        s.style.left = x + "%"; s.style.top = y + "%";
        s.style.width = 80 + Math.random() * 70 + "px";
        box.appendChild(s);
        const dx = Math.cos(winkel * Math.PI / 180) * laenge, dy = Math.sin(winkel * Math.PI / 180) * laenge;
        s.animate([
          { transform: "translate(0,0) rotate(" + winkel + "deg) scaleX(.2)", opacity: 0 },
          { opacity: 1, offset: 0.15 },
          { transform: "translate(" + dx + "px," + dy + "px) rotate(" + winkel + "deg) scaleX(1)", opacity: 0 },
        ], { duration: 800 + Math.random() * 600, easing: "ease-in", fill: "forwards" }).finished.then(() => s.remove(), () => s.remove());
      }, 150 + k * 130 + Math.random() * 90);
    }
    setTimeout(() => { regen = false; }, ANZAHL * 130 + 1800);
  }
  let brille = false;
  function sonnenbrille(sonne) {
    if (brille) return;
    brille = true;
    melde("sonne");
    let b = sonne.querySelector(".sonnenbrille");
    if (!b) {
      b = document.createElement("div");
      b.className = "sonnenbrille";
      b.innerHTML = '<svg viewBox="0 0 100 40"><path d="M8 10h84" stroke="#1d1d24" stroke-width="4" stroke-linecap="round"/>' +
        '<path d="M10 10h32c0 14-6 22-16 22S10 24 10 10z" fill="#1d1d24"/><path d="M58 10h32c0 14-6 22-16 22S58 24 58 10z" fill="#1d1d24"/>' +
        '<path d="M16 14l10 10M64 14l10 10" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".5"/></svg>';
      sonne.appendChild(b);
    }
    const opt = { duration: 700, easing: "cubic-bezier(.3,1.4,.5,1)", fill: "forwards" };
    b.animate([{ transform: "translate(-50%,-260%) rotate(-12deg)", opacity: 0 }, { transform: "translate(-50%,-60%) rotate(0)", opacity: 1 }], opt);
    sonne.animate([
      { filter: "brightness(1)", scale: "1" },
      { filter: "brightness(1.45)", scale: "1.18", offset: 0.35 },
      { filter: "brightness(1.2)", scale: "1.06", offset: 0.6 },
      { filter: "brightness(1)", scale: "1" },
    ], { duration: 1600, delay: 500, easing: "ease-out" });
    setTimeout(() => {
      b.animate([{ transform: "translate(-50%,-60%) rotate(0)", opacity: 1 }, { transform: "translate(-50%,-260%) rotate(14deg)", opacity: 0 }],
        { duration: 600, easing: "ease-in", fill: "forwards" }).finished.then(() => { brille = false; }, () => { brille = false; });
    }, 2800);
  }
  function himmel() {
    const NICHT = "button, a, input, select, textarea, label, dialog, .tuer, .polaroid, .capy-familie, .lichterkette, .adventskranz, .kugel, .vogel, .testleiste, .umschlag";
    document.addEventListener("click", (e) => {
      if (ruhig || (e.target.closest && e.target.closest(NICHT))) return;
      const h = aktiverHimmel();
      if (!h) return;
      const mond = h.querySelector(".h2-mond"), sonne = h.querySelector(".h2-sonne");
      if (getroffen(mond, e.clientX, e.clientY, 16)) sternschnuppenRegen(h, mond);
      else if (getroffen(sonne, e.clientX, e.clientY, 4)) sonnenbrille(sonne);
    });
  }

  kerzen();
  lichterkette();
  polaroids();
  kugeln();
  capyPaar();
  himmel();
  if (window.adventkalender) window.adventkalender.interaktiv = { sternschnuppenRegen: () => { const h = aktiverHimmel(); if (h) sternschnuppenRegen(h, h.querySelector(".h2-mond")); } };
})();
