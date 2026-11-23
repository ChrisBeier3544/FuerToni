/*
 * ===========================================================
 *  SPIELE MIT DEN MUNKELVÖGELN (Countdown, 21. bis 25.11.)
 *  21.11. Verstecken: Toni sucht mit kalt, warm und heiß
 *  22.11. Wettfliegen: Toni tippt, wer gewinnt, mit Zielfoto
 *  22.11. und 24.11. abends: Glücksfeder für die Klausur
 *  23.11. ab 14 Uhr: Füttern, jeder hat seine Vorlieben
 *  Danach gibt es Verstecken, Wettfliegen und Füttern
 *  jederzeit in Tonis Ecke.
 * ===========================================================
 */
(function () {
  "use strict";

  const ak = window.adventkalender;
  const intro = document.getElementById("intro");
  const umschlag = document.getElementById("umschlag");
  if (!ak || !ak.intro || !intro || !umschlag || !ak.voegel || !ak.voegel.intern) return;
  const I = ak.voegel.intern;
  const ruhig = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const f1 = (n) => n.toFixed(1);
  const wahl = (l) => l[Math.floor(Math.random() * l.length)];
  const pause = (ms) => new Promise((r) => setTimeout(r, ms));
  const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html !== undefined) e.innerHTML = html; return e; };
  const W = () => window.innerWidth, H = () => window.innerHeight;

  /* ---------- Speichern ---------- */
  const SCHLUESSEL = "toni-wz-spiele";
  function lies() { try { const s = JSON.parse(localStorage.getItem(SCHLUESSEL) || "{}"); return s && typeof s === "object" ? s : {}; } catch (_) { return {}; } }
  function schreib(s) { try { localStorage.setItem(SCHLUESSEL, JSON.stringify(s)); } catch (_) { /* egal */ } }
  const merke = (k, v) => { const s = lies(); s[k] = v; schreib(s); };

  /* ---------- Wann? ---------- */
  const reise = () => !!(ak.zeitreise && ak.zeitreise.aktiv());
  function tag() {
    if (!ak.intro.bereit() || ak.intro.phase() !== "warten" || reise()) return 0;
    const d = ak.intro.datum();
    if (d.jahr !== KALENDER.jahr || d.monat !== 11 || d.tag < 13 || d.tag > 25) return 0;
    return d.tag;
  }
  const stunde = () => ak.intro.datum().stunde;
  const nachts = () => intro.classList.contains("wz-nacht") || !!(ak.nest && ak.nest.schlafen && ak.nest.schlafen());
  const tagsueber = () => stunde() >= 5 && stunde() < 22 && !nachts();
  // darf jetzt ein Spiel beginnen? (nie zusammen mit etwas anderem)
  const frei = () => !!tag() && tagsueber() && !intro.hidden && I.kontext() === "countdown" && !I.maennchen.auftrag &&
    !document.querySelector(".munkel-buehne, .special-buehne, .aufbau-buehne, .vogel.gast, .wz-fenster-huelle, .mistel-ebene");

  /* ---------- Bühne: fängt alle Tipps ab, damit nichts anderes aufgeht ---------- */
  let buehne = null;
  function neueBuehne(art) {
    const b = el("div", "munkel-buehne " + art);
    b.innerHTML = '<div class="munkel-dimmer"></div><button type="button" class="munkel-zu" aria-label="Spiel beenden">✕</button><p class="munkel-hinweis" aria-live="polite" hidden></p>';
    document.body.appendChild(b);
    requestAnimationFrame(() => b.classList.add("da"));
    buehne = b;
    return b;
  }
  function hinweis(b, text) {
    const h = b.querySelector(".munkel-hinweis");
    if (!text) { h.hidden = true; return; }
    h.textContent = text; h.hidden = false;
    h.classList.remove("neu"); void h.offsetWidth; h.classList.add("neu");
  }
  function buehneWeg(b) {
    if (!b || !b.isConnected) return;
    b.classList.add("vorbei");
    setTimeout(() => b.remove(), 450);
    if (buehne === b) buehne = null;
  }
  // Wächter: wird es Nacht oder geht der Brief auf, endet jedes Spiel freundlich
  const SPIEL_ABBRUCH = new Set();
  setInterval(() => {
    if (!buehne || buehne.classList.contains("schluepf-buehne")) return;
    if (nachts() || intro.hidden || !tag()) SPIEL_ABBRUCH.forEach((f) => f("nacht"));
  }, 700);

  /* ---------- Töne (sehr leise) ---------- */
  let audio = null;
  function ton(frequenz, dauer, art, laut) {
    try {
      audio = audio || new (window.AudioContext || window.webkitAudioContext)();
      if (audio.state === "suspended") audio.resume();
      const t = audio.currentTime, o = audio.createOscillator(), g = audio.createGain();
      o.type = art || "sine"; o.frequency.setValueAtTime(frequenz, t);
      o.frequency.exponentialRampToValueAtTime(frequenz * 1.25, t + dauer * 0.5);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(laut || 0.05, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + dauer);
      o.connect(g).connect(audio.destination); o.start(t); o.stop(t + dauer + 0.02);
    } catch (_) { /* ohne Ton */ }
  }
  const plopp = () => { if (ak.wartezeit && ak.wartezeit.plopp) ak.wartezeit.plopp(true); else ton(600, 0.12); };

  function herzenBei(x, y, n, zeichen) {
    for (let k = 0; k < n; k++) {
      const h = el("span", "ei-herz", zeichen ? wahl(zeichen) : (k % 3 === 2 ? "✨" : "♥️"));
      h.style.left = x + "px"; h.style.top = y + "px";
      document.body.appendChild(h);
      const dx = (Math.random() - 0.5) * 90, dy = -50 - Math.random() * 60;
      h.animate([{ transform: "translate(-50%,-50%) scale(.3)", opacity: 0 }, { transform: "translate(calc(-50% + " + f1(dx * 0.5) + "px), calc(-50% + " + f1(dy * 0.5) + "px)) scale(1)", opacity: 1, offset: 0.35 },
        { transform: "translate(calc(-50% + " + f1(dx) + "px), calc(-50% + " + f1(dy) + "px)) scale(.8)", opacity: 0 }], { duration: 1300 + Math.random() * 500, delay: k * 55, easing: "ease-out", fill: "both" }).onfinish = () => h.remove();
    }
  }
  // Bildschirmpunkt des Vogels (Mitte des Körpers)
  const mitteVon = (v) => { const r = v.el.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height * 0.55 }; };

  /* =========================================================
     1. VERSTECKEN (21.11.)
     ========================================================= */
  const ruecken = "#8a5a3a", fluegel = "#6b4632";
  const SCHWANZ_SVG = '<svg viewBox="0 0 40 30" aria-hidden="true"><path d="M2 15 Q20 2 38 8 Q26 14 38 22 Q20 28 2 15Z" fill="' + fluegel + '"/><path d="M4 15 Q20 8 36 14" stroke="' + ruecken + '" stroke-width="2.4" fill="none" stroke-linecap="round"/>' +
    '<path d="M6 15 Q20 20 34 21" stroke="#5a3a28" stroke-width="1.4" fill="none" stroke-linecap="round"/></svg>';
  // Verstecke: Schwanzspitze (x, y, Drehung) und wo er dann herauskommt
  const rechteck = (s) => { const e = document.querySelector(s); if (!e || !e.offsetParent) return null; const r = e.getBoundingClientRect(); return r.width && r.bottom > 0 && r.top < H() ? r : null; };
  const VERSTECKE = [
    { id: "umschlagLinks", text: "Hinter dem Umschlag war ich doch so gut versteckt 😆", wo: (streng) => { const r = rechteck("#umschlag"); return r && (!streng || r.left > 26) ? { x: r.left - 6, y: r.top + r.height * 0.66, dreh: 180, fuss: { x: r.left + 30, y: r.top + 3 } } : null; } },
    { id: "umschlagRechts", text: "Fast hättest du mich nicht gefunden, Toni 😆", wo: (streng) => { const r = rechteck("#umschlag"); return r && (!streng || W() - r.right > 26) ? { x: r.right + 6, y: r.top + r.height * 0.5, dreh: 0, fuss: { x: r.right - 30, y: r.top + 3 } } : null; } },
    { id: "ladeLinks", text: "In der Schublade war es ganz schön eng 😆", wo: () => { const r = rechteck('.wz-schublade[data-seite="links"] .wz-lade-front'); const b = rechteck(".wz-bank"); return r && b ? { x: r.left + r.width * 0.72, y: r.top + 3, dreh: -70, fuss: { x: r.left + r.width * 0.72, y: b.top + 4 } } : null; } },
    { id: "ladeRechts", text: "Zwischen dem Lippenstift und der Spange war noch Platz 😆", wo: () => { const r = rechteck('.wz-schublade[data-seite="rechts"] .wz-lade-front'); const b = rechteck(".wz-bank"); return r && b ? { x: r.left + r.width * 0.28, y: r.top + 3, dreh: -110, fuss: { x: r.left + r.width * 0.28, y: b.top + 4 } } : null; } },
    { id: "nest", text: "Im Nest ist es halt am gemütlichsten 😆", wo: () => { const n = ak.nest && ak.nest.element && ak.nest.element(); if (!n) return null; const r = n.getBoundingClientRect(); return r.width ? { x: r.left + r.width * 0.36, y: r.top + r.height * 0.32, dreh: -150, fuss: { x: r.left + r.width * 0.3, y: r.top + r.height * 0.56 } } : null; } },
    { id: "zahlen", text: "Ich hab mich hinter den Zahlen versteckt. Die haben gekichert 😆", wo: (streng) => { const r = rechteck("#countdown-ziffern"); return r && (!streng || W() - r.right > 24) ? { x: r.right + 4, y: r.top + r.height * 0.55, dreh: 10, fuss: { x: r.right - 22, y: r.top + 1 } } : null; } },
    { id: "baeumchen", text: "Das Bäumchen hat mich verraten, oder? 😆", wo: () => { const r = rechteck(".wz-bank .wz-baeumchen"); const b = rechteck(".wz-bank"); return r && b ? { x: r.left + r.width * 0.5 + 8, y: r.top + r.height * 0.5, dreh: -30, fuss: { x: r.left + r.width / 2, y: r.top + 9 } } : null; } },
  ];
  const TEMP = [[95, "🔥 Heiß!", "heiss"], [175, "☀️ Warm", "warm"], [285, "🌤️ Lauwarm", "lau"], [Infinity, "❄️ Kalt", "kalt"]];
  let aktuellesVersteck = null;
  async function verstecken() {
    if (!frei()) return;
    const m = I.maennchen, w = I.weibchen;
    const b = neueBuehne("versteck-buehne");
    // die Munkelvogeline schaut von oben auf dem Umschlag zu (dort ist kein Versteck), Tipps gehen durch sie hindurch
    if (w) { w.el.classList.add("schaut-zu"); I.holeHer(w, () => I.ankerPunkt("50%", "oben", 3)); }
    let ende = false, gefundenFn = null;
    const schwanz = el("div", "versteck-schwanz", SCHWANZ_SVG);
    b.appendChild(schwanz);
    const vorhang = el("div", "versteck-vorhang", '<div><span class="versteck-haende" aria-hidden="true">🙈</span><p>Augen zu, Toni …</p><b class="versteck-zahl"></b></div>');
    const zahl = vorhang.querySelector(".versteck-zahl");
    function aufhoeren(grund) {
      if (ende) return;
      ende = true;
      SPIEL_ABBRUCH.delete(aufhoeren);
      vorhang.remove();
      buehneWeg(b);
      if (gefundenFn) gefundenFn(false);
      // er kommt aus seinem Versteck zurück
      if (m.el.hidden || m.zustand !== "sitzt") { m.folge = null; I.setzePosition(m, { x: W() + 60, y: 90 }); m.el.hidden = false; m.zustand = "sitzt"; }
      if (w) { w.el.classList.remove("schaut-zu"); setTimeout(() => I.heimfliegen(w), 400); }
      I.heimfliegen(m).then(() => setTimeout(() => {
        if (ak.voegel.kommentiere) ak.voegel.kommentiere(grund === "nacht" ? "Gähn … für heute ist Schluss mit Verstecken, Toni 😴" : "Okay, Toni! Ein andermal verstecke ich mich wieder 🥰");
      }, 900));
    }
    SPIEL_ABBRUCH.add(aufhoeren);
    b.querySelector(".munkel-zu").addEventListener("click", () => aufhoeren("zu"));
    m.auftrag = true;
    m.timer.forEach(clearTimeout); m.timer = []; clearTimeout(m.flugTimer);
    if (m.zustand === "sitzt" && !m.el.hidden) await I.sag(m, "Juhu! Augen zu, Toni, ich versteck mich 🙈", 2600);
    // ab jetzt hat er keinen festen Platz mehr (sonst zöge es ihn dorthin zurück)
    m.platz = null; m.ziel = null;
    const benutzt = [];
    for (let runde = 1; runde <= 3 && !ende; runde++) {
      // Augen zu: der Vorhang verdeckt, wohin er fliegt
      b.appendChild(vorhang);
      vorhang.classList.remove("auf"); void vorhang.offsetWidth; vorhang.classList.add("zu");
      await pause(450);
      I.still(m); m.el.hidden = true; m.zustand = "versteckt"; m.folge = null;
      for (const n of ["3", "2", "1"]) { if (ende) return; zahl.textContent = n; zahl.classList.remove("tick"); void zahl.offsetWidth; zahl.classList.add("tick"); ton(520, 0.12, "triangle", 0.03); await pause(750); }
      if (ende) return;
      // ein Versteck aussuchen, das gerade zu sehen ist
      const moeglich = VERSTECKE.filter((v) => !benutzt.includes(v.id) && v.wo(true));
      const versteck = moeglich.length ? wahl(moeglich) : VERSTECKE.find((v) => v.wo(true));
      if (!versteck) { aufhoeren("zu"); return; }
      benutzt.push(versteck.id);
      aktuellesVersteck = versteck;
      zahl.textContent = "👀";
      await pause(400);
      vorhang.classList.remove("zu"); vorhang.classList.add("auf");
      setTimeout(() => vorhang.remove(), 420);
      hinweis(b, runde === 1 ? "Wo bin ich? Tipp dahin, wo du mich vermutest 👀" : "Runde " + runde + " von 3. Wo bin ich jetzt? 👀");
      const hinweisWeg = setTimeout(() => hinweis(b, ""), 4500);
      let fehl = 0, geguckt = 0;
      const zeigeSchwanz = (dauer) => {
        const p = versteck.wo(); if (!p) return;
        schwanz.style.left = p.x + "px"; schwanz.style.top = p.y + "px"; schwanz.style.setProperty("--dreh", p.dreh + "deg");
        schwanz.classList.remove("guckt"); void schwanz.offsetWidth; schwanz.classList.add("guckt");
        clearTimeout(schwanz._t);
        if (dauer) schwanz._t = setTimeout(() => schwanz.classList.remove("guckt"), dauer);
      };
      const gefunden = await new Promise((fertig) => {
        gefundenFn = fertig;
        const tipp = (e) => {
          if (e.target.closest(".munkel-zu")) return;
          const p = versteck.wo();
          if (!p) return;
          const d = Math.hypot(e.clientX - p.x, e.clientY - p.y), d2 = Math.hypot(e.clientX - (p.fuss.x), e.clientY - (p.fuss.y - 20));
          if (Math.min(d, d2) < 46) { b.removeEventListener("pointerdown", tipp); fertig(true); return; }
          const [, text, art] = TEMP.find(([grenze]) => Math.min(d, d2) < grenze);
          const t = el("span", "versteck-temp " + art, text);
          t.style.left = Math.max(56, Math.min(W() - 56, e.clientX)) + "px"; t.style.top = Math.max(60, e.clientY) + "px";
          b.appendChild(t);
          setTimeout(() => t.remove(), 1300);
          ton(art === "heiss" ? 880 : art === "warm" ? 660 : art === "lau" ? 520 : 380, 0.1, "sine", 0.025);
          if (art === "heiss") zeigeSchwanz(1300);
          fehl++;
          // nach ein paar Versuchen hilft die Munkelvogeline, sonst wackelt kurz der Schwanz
          if (fehl === 4 || fehl === 8) {
            if (w && w.zustand === "sitzt" && !geguckt++) {
              hinweis(b, ""); clearTimeout(hinweisWeg);
              I.sag(w, "Psst, Toni … " + (versteck.id.startsWith("lade") ? "schau mal bei den Schubladen 🤭" : versteck.id.startsWith("umschlag") ? "schau mal beim Umschlag 🤭" : versteck.id === "nest" ? "schau mal beim Nest 🤭" : versteck.id === "zahlen" ? "schau mal bei den Zahlen 🤭" : versteck.id === "baeumchen" ? "schau mal beim Bäumchen 🤭" : "schau mal genau hin 🤭"), 2800);
            }
            else zeigeSchwanz(fehl >= 8 ? 0 : 1600);
          }
        };
        b.addEventListener("pointerdown", tipp);
      });
      gefundenFn = null;
      clearTimeout(hinweisWeg);
      hinweis(b, "");
      if (!gefunden || ende) return;
      // gefunden: er hüpft aus dem Versteck
      schwanz.classList.remove("guckt");
      hinweis(b, "");
      const p = versteck.wo();
      m.blick = p.fuss.x > W() / 2 ? -1 : 1;
      m.folge = () => { const q = versteck.wo(); return q && q.fuss; };
      I.setzePosition(m, p.fuss);
      m.el.hidden = false; m.zustand = "sitzt";
      I.hops(m); plopp();
      herzenBei(p.fuss.x, p.fuss.y - 30, 6, ["✨", "⭐"]);
      const fundText = runde < 3 ? "Gefunden! " + versteck.text : versteck.text;
      // findet seine Blase dort keinen Platz, steht der Satz im Hinweis oben
      setTimeout(() => { if (!ende && m.blase.hidden) hinweis(b, fundText); }, 250);
      await I.sag(m, fundText, 3200);
      hinweis(b, "");
      if (ende) return;
      if (runde < 3) { await I.sag(m, runde === 1 ? "Noch mal! Augen zu 🙈" : "Letzte Runde! Augen zu 🙈", 2000); }
    }
    if (ende) return;
    ende = true;
    SPIEL_ABBRUCH.delete(aufhoeren);
    const r = mitteVon(m);
    herzenBei(r.x, r.y - 20, 14);
    ton(660, 0.12); setTimeout(() => ton(880, 0.16), 140);
    await I.sag(m, "Du hast mich jedes Mal gefunden, Toni! Du bist die beste Sucherin 🏆", 4200);
    if (w && w.zustand === "sitzt") await I.sag(w, "Er war aber auch nicht schwer zu finden 😄", 3000);
    buehneWeg(b);
    I.heimfliegen(m);
    if (w) { w.el.classList.remove("schaut-zu"); setTimeout(() => I.heimfliegen(w), 400); }
  }

  /* =========================================================
     2. WETTFLIEGEN (22.11.)
     ========================================================= */
  const rennenWerte = { gewonnen: 0, gespielt: 0 };
  async function wettfliegen() {
    if (!frei()) return;
    const m = I.maennchen;
    const b = neueBuehne("wettflug-buehne");
    let ende = false, karteFertig = null;
    const karte = el("div", "munkel-karte wettflug-karte");
    function aufhoeren(grund) {
      if (ende) return;
      ende = true;
      SPIEL_ABBRUCH.delete(aufhoeren);
      if (karteFertig) karteFertig(null);
      buehneWeg(b);
      const w = I.weibchen;
      [m, w].forEach((v, i) => { if (!v) return; v.el.classList.remove("fliegt"); if (v.el.hidden || v.zustand !== "sitzt") { v.el.hidden = false; v.zustand = "sitzt"; } setTimeout(() => I.heimfliegen(v), i * 350); });
      if (grund === "nacht") setTimeout(() => ak.voegel.kommentiere && ak.voegel.kommentiere("Gähn … morgen fliegen wir weiter, Toni 😴"), 2600);
    }
    SPIEL_ABBRUCH.add(aufhoeren);
    b.querySelector(".munkel-zu").addEventListener("click", () => aufhoeren("zu"));
    m.auftrag = true;
    m.timer.forEach(clearTimeout); m.timer = []; clearTimeout(m.flugTimer);
    let w = I.weibchen;
    if (!w) {
      if (m.zustand === "sitzt" && !m.el.hidden) await I.sag(m, "Ich ruf schnell meine Liebste 🥰", 2200);
      if (ende) return;
      w = I.neuesWeibchen();
    }
    w.auftrag = true;
    const startM = () => I.ankerPunkt("calc(50% - 34px)", "oben", 3), startW = () => I.ankerPunkt("calc(50% + 34px)", "oben", 3);
    const [a, c] = await Promise.all([I.holeHer(m, startM), pause(350).then(() => I.holeHer(w, startW))]);
    if (ende || !a || !c) { if (!ende) aufhoeren("zu"); return; }
    m.blick = 1; w.blick = -1; I.setzePosition(m, startM()); I.setzePosition(w, startW());
    await I.sag(w, "Ich bin sowieso schneller 😌", 2400);
    await I.sag(m, "Das werden wir ja sehen 😤", 2200);
    let runde = 0;
    while (!ende) {
      runde++;
      // Toni tippt auf den Sieger
      const portrait = (weiblich) => (ak.voegel.svg ? ak.voegel.svg(weiblich) : "");
      karte.innerHTML = "<h3>Wer gewinnt? 🏁</h3><p>Tipp auf deinen Favoriten</p><div class=\"wettflug-wahl\">" +
        '<button type="button" data-tipp="m"><span class="wettflug-bild">' + portrait(false) + "</span><b>Munkelvogel</b></button>" +
        '<button type="button" data-tipp="w"><span class="wettflug-bild">' + portrait(true) + "</span><b>Munkelvogeline</b></button></div>";
      b.appendChild(karte);
      karte.classList.remove("weg");
      b.classList.add("gedimmt");
      const tipp = await new Promise((fertig) => {
        karteFertig = fertig;
        karte.querySelectorAll("[data-tipp]").forEach((k) => k.addEventListener("click", () => fertig(k.dataset.tipp)));
      });
      karteFertig = null;
      if (!tipp || ende) return;
      b.classList.remove("gedimmt");
      karte.classList.add("weg");
      await pause(300);
      karte.remove();
      const favorit = tipp === "m" ? m : w;
      I.hops(favorit);
      await I.sag(favorit, tipp === "m" ? "Danke, Toni! Jetzt muss ich gewinnen 😎" : "Danke, Toni! Du kennst mich einfach 🥰", 2200);
      if (ende) return;
      // 3, 2, 1, Los!
      const zaehler = el("div", "wettflug-zaehler");
      b.appendChild(zaehler);
      for (const n of ["3", "2", "1", "Los! 🏁"]) {
        if (ende) return;
        zaehler.textContent = n;
        zaehler.classList.remove("tick"); void zaehler.offsetWidth; zaehler.classList.add("tick");
        ton(n.length > 1 ? 880 : 520, n.length > 1 ? 0.3 : 0.12, "triangle", 0.035);
        await pause(n.length > 1 ? 500 : 800);
      }
      zaehler.remove();
      const sieger = Math.random() < 0.5 ? "m" : "w";
      await rennen(m, w, sieger, b, () => ende);
      if (ende) return;
      // Zielfoto
      rennenWerte.gespielt++;
      const richtig = tipp === sieger;
      if (richtig) rennenWerte.gewonnen++;
      const blitz = el("div", "wettflug-blitz");
      b.appendChild(blitz);
      ton(1400, 0.08, "square", 0.02);
      setTimeout(() => blitz.remove(), 700);
      await pause(450);
      const vorne = sieger === "w";
      karte.innerHTML = '<p class="wettflug-foto-kopf">📸 Zielfoto</p><div class="wettflug-foto"><span class="wettflug-linie"></span>' +
        '<span class="wettflug-foto-vogel ' + (vorne ? "zweiter" : "erster") + '">' + portrait(false) + "</span>" +
        '<span class="wettflug-foto-vogel unten ' + (vorne ? "erster" : "zweiter") + '">' + portrait(true) + "</span></div>" +
        "<h3>" + (vorne ? "Die Munkelvogeline gewinnt! 🏆" : "Der Munkelvogel gewinnt! 🏆") + "</h3>" +
        "<p>Mit einer Schnabelspitze Vorsprung. " + (richtig ? "Du hast richtig getippt, Toni! 🎉" : "Knapp daneben, Toni 😄") +
        (rennenWerte.gespielt > 1 ? "<br>" + rennenWerte.gewonnen + " von " + rennenWerte.gespielt + " richtig getippt" : "") + "</p>" +
        '<div class="munkel-knoepfe"><button type="button" class="munkel-knopf zweit" data-wahl="nochmal">Revanche 🔁</button><button type="button" class="munkel-knopf" data-wahl="fertig">Fertig ♥️</button></div>';
      b.appendChild(karte);
      karte.classList.remove("weg");
      b.classList.add("gedimmt");
      if (richtig) { const r = karte.getBoundingClientRect(); herzenBei(r.left + r.width / 2, r.top + 30, 12, ["🎉", "✨", "♥️"]); }
      const weiter = await new Promise((fertig) => {
        karteFertig = fertig;
        karte.querySelectorAll("[data-wahl]").forEach((k) => k.addEventListener("click", () => fertig(k.dataset.wahl)));
      });
      karteFertig = null;
      if (!weiter || ende) return;
      b.classList.remove("gedimmt");
      karte.classList.add("weg");
      await pause(300);
      karte.remove();
      // zurück an den Start
      const [a2, c2] = await Promise.all([I.holeHer(m, startM), pause(300).then(() => I.holeHer(w, startW))]);
      if (ende || !a2 || !c2) { if (!ende) aufhoeren("zu"); return; }
      m.blick = 1; w.blick = -1; I.setzePosition(m, startM()); I.setzePosition(w, startW());
      const gew = sieger === "m" ? m : w, verl = sieger === "m" ? w : m;
      await I.sag(gew, sieger === "w" ? "Hab ich doch gesagt 😌" : "Schnellster Vogel der Fensterbank 😎", 2600);
      await I.sag(verl, sieger === "w" ? "Ich hab sie gewinnen lassen … ehrlich 😅" : "Er hatte Rückenwind 🙄", 2800);
      if (weiter === "fertig") break;
      await I.sag(verl, "Revanche! Diesmal gewinne ich 😤", 2200);
    }
    if (ende) return;
    ende = true;
    SPIEL_ABBRUCH.delete(aufhoeren);
    buehneWeg(b);
    I.heimfliegen(m);
    setTimeout(() => I.heimfliegen(w), 400);
  }
  // Zwei Runden um den Umschlag, mit Überholen, einem Zusammenstoß und knappem Zieleinlauf
  function rennen(m, w, sieger, b, abgebrochen) {
    const u = umschlag.getBoundingClientRect();
    const cx = u.left + u.width / 2, cy = u.top + u.height / 2;
    const rx = Math.min(W() / 2 - 40, u.width / 2 + 36), ry = Math.min(u.height / 2 + 58, cy - 48);
    const ziel = el("div", "wettflug-ziel");
    ziel.style.left = cx + "px"; ziel.style.top = cy - ry + "px";
    b.appendChild(ziel);
    const s = sieger === "w" ? 1 : -1;
    const punkt = (p, aussen) => {
      const t = -Math.PI / 2 + p * Math.PI * 2;
      return { x: cx + (rx + aussen) * Math.cos(t), y: cy + (ry + aussen) * Math.sin(t) };
    };
    const startM = { x: m.pos.x, y: m.pos.y }, startW = { x: w.pos.x, y: w.pos.y };
    [m, w].forEach((v) => { v.zustand = "rennt"; v.el.classList.add("fliegt"); I.still(v); });
    const DAUER = ruhig ? 4000 : 9800;
    let uhr = 0, letzte = performance.now(), bremse = 0, bonk = false, gemeldet = 0;
    return new Promise((fertig) => {
      function schritt(jetzt) {
        if (abgebrochen()) { ziel.remove(); fertig(); return; }
        const dt = Math.min(50, jetzt - letzte); letzte = jetzt;
        // nach dem Zusammenstoß kurz langsamer
        const faktor = bremse > 0 ? 0.15 : 1;
        bremse = Math.max(0, bremse - dt);
        uhr += dt * faktor;
        const t = Math.min(1.12, uhr / DAUER);
        // erst beschleunigen, dann gleichmäßig schnell (auch über die Ziellinie hinaus)
        const e = (t < 0.15 ? (t * t) / 0.3 : t - 0.075) / 0.925;
        const basis = 2 * e;
        const tt = Math.min(1, t);
        const d = 0.075 * Math.sin(3 * Math.PI * tt) * (1 - 0.6 * tt) + s * 0.03 * Math.pow(tt, 4);
        const nah = Math.exp(-Math.pow((tt - 2 / 3) / 0.04, 2));
        const bahn = 23 * (1 - nah);
        let pm = punkt(basis - d / 2, -bahn), pw = punkt(basis + d / 2, bahn);
        // Start: von den Plätzen auf die Bahn
        const st = Math.min(1, t / 0.07), lerp = (a2, b2, k) => ({ x: a2.x + (b2.x - a2.x) * k, y: a2.y + (b2.y - a2.y) * k });
        if (st < 1) { const k = st * st * (3 - 2 * st); pm = lerp(startM, pm, k); pw = lerp(startW, pw, k); }
        [[m, pm], [w, pw]].forEach(([v, p]) => {
          if (Math.abs(p.x - v.pos.x) > 0.4) v.blick = p.x > v.pos.x ? 1 : -1;
          I.setzePosition(v, p);
        });
        if (!bonk && nah > 0.92) {
          bonk = true; bremse = 520;
          const mitte = { x: (pm.x + pw.x) / 2, y: (pm.y + pw.y) / 2 };
          const stern = el("span", "wettflug-bonk", "💫");
          stern.style.left = mitte.x + "px"; stern.style.top = mitte.y - 30 + "px";
          b.appendChild(stern);
          setTimeout(() => stern.remove(), 1200);
          ton(300, 0.15, "square", 0.025);
          [m, w].forEach((v, i) => I.bild(v).animate([{ rotate: "0deg" }, { rotate: (i ? 1 : -1) * 22 + "deg", offset: 0.3 }, { rotate: (i ? -1 : 1) * 12 + "deg", offset: 0.65 }, { rotate: "0deg" }], { duration: 650, easing: "ease-out" }));
        }
        const runde = basis < 1 ? 1 : 2;
        if (runde !== gemeldet && t < 1) { gemeldet = runde; hinweis(b, runde === 1 ? "Runde 1 von 2 🏁" : "Letzte Runde! 🏁"); }
        if (t > 0.9 && gemeldet !== 3 && t < 1) { gemeldet = 3; hinweis(b, "Zieleinlauf! 🏁"); }
        if (t < 1.12) { requestAnimationFrame(schritt); return; }
        // durchs Ziel und hinaus aus dem Bild, gleich gibt es das Foto
        hinweis(b, "");
        ziel.classList.add("weg");
        setTimeout(() => ziel.remove(), 500);
        Promise.all([m, w].map((v, i) => {
          const p = v.pos;
          return I.animiere(Object.assign(v, { zustand: "fliegt" }), [p, { x: p.x + 70, y: p.y - 40 - i * 20 }, { x: W() + 90, y: Math.max(-40, p.y - 160) }], 1200);
        })).then(() => { if (!abgebrochen()) [m, w].forEach((v) => { v.el.hidden = true; v.zustand = "weg"; v.el.classList.remove("fliegt"); }); fertig(); });
      }
      requestAnimationFrame(schritt);
    });
  }

  /* =========================================================
     3. FÜTTERN (23.11. ab 14 Uhr)
     ========================================================= */
  const FUTTER = {
    korn: { name: "Körner", svg: '<svg viewBox="0 0 40 30" aria-hidden="true"><ellipse cx="20" cy="24" rx="17" ry="5" fill="#b07a3e"/>' + [[9, 20], [14, 17], [20, 15], [26, 17], [31, 20], [17, 21], [24, 21], [12, 23], [28, 23], [20, 19]].map(([x, y], k) => '<ellipse cx="' + x + '" cy="' + y + '" rx="2.6" ry="1.7" fill="' + (k % 2 ? "#e8c27a" : "#d4a050") + '" transform="rotate(' + (k * 37) + " " + x + " " + y + ')"/>').join("") + "</svg>" },
    beere: { name: "Beeren", svg: '<svg viewBox="0 0 40 30" aria-hidden="true"><path d="M20 5 q2 -3 6 -2" stroke="#4f8a5b" stroke-width="1.6" fill="none"/><circle cx="13" cy="18" r="6" fill="#5a6fc4"/><circle cx="24" cy="15" r="6.4" fill="#4a5bb0"/><circle cx="27" cy="23" r="5.4" fill="#6a7fd6"/><circle cx="17" cy="25" r="4.4" fill="#d6304f"/>' +
      '<circle cx="11" cy="16" r="1.5" fill="#fff" opacity=".6"/><circle cx="22" cy="13" r="1.6" fill="#fff" opacity=".6"/><path d="M23 12.5l1.6 1.2 1.6-1.2" stroke="#2e3a78" stroke-width=".9" fill="none"/></svg>' },
    apfel: { name: "Apfel", svg: '<svg viewBox="0 0 40 30" aria-hidden="true"><path d="M5 22 Q20 2 35 22 Z" fill="#fff4dc"/><path d="M5 22 Q20 2 35 22" fill="none" stroke="#d6304f" stroke-width="3.4" stroke-linejoin="round"/><path d="M5 22h30" stroke="#e85d5d" stroke-width="2.4" stroke-linecap="round"/><ellipse cx="17" cy="16" rx="1.4" ry="2.2" fill="#6b4226"/><ellipse cx="23" cy="16" rx="1.4" ry="2.2" fill="#6b4226"/></svg>' },
    zimt: { name: "Zimtschnecke", svg: '<svg viewBox="0 0 40 30" aria-hidden="true"><ellipse cx="20" cy="17" rx="15" ry="11" fill="#c98a4f"/><path d="M20 17 m0 -1.5 a1.5 1.5 0 1 1 -1.5 1.5 a3.5 3.5 0 1 1 3.5 3.5 a5.8 5.8 0 1 1 -5.8 -5.8 a8.4 8.4 0 1 1 8.4 8.4" fill="none" stroke="#7a4526" stroke-width="2" stroke-linecap="round"/>' +
      '<path d="M10 12 q4 -3 8 0 q4 3 8 0" stroke="#fff8ee" stroke-width="2" fill="none" stroke-linecap="round" opacity=".9"/></svg>' },
  };
  const REAKTION = {
    m: {
      korn: ["Mmh, Körner! Lecker, Toni 😋", "Knusper, knusper 😋"],
      beere: ["Huch, sauer! 😖 Aber trotzdem danke, Toni", "Die ist aber sauer 😝"],
      apfel: ["Knackig! 🍎", "Apfel! Gesund und lecker, Toni 😋"],
      zimt: ["Eine Zimtschnecke! Toni, du kennst mich einfach 😍", "Noch eine? Na gut, wenn du so lieb fragst 😋", "Uff … ich glaub, das waren schon wieder zu viele 😵"],
      genug: "Bitte keine Zimtschnecke mehr, Toni, sonst kann ich nicht mehr fliegen 😵",
    },
    w: {
      korn: ["Danke, Toni! Schön knusprig 😋", "Mmh, die schmecken nach Sommer 🌾"],
      beere: ["Meine Lieblingsbeeren! Du kennst mich, Toni 🥰", "Mmh, so süß! Danke, Toni 🫐"],
      apfel: ["Mmh, ein Apfelstückchen 🍎", "Lecker, Toni! Ganz frisch 😋"],
      zimt: ["Nur ein ganz kleines Stück … okay, das ganze 😋", "Psst, sag ihm nicht, dass ich auch eine hatte 🤭"],
    },
  };
  async function fuettern() {
    if (!frei()) return;
    const m = I.maennchen;
    const b = neueBuehne("futter-buehne");
    let ende = false;
    const tablett = el("div", "munkel-karte futter-tablett");
    function aufhoeren(grund) {
      if (ende) return;
      ende = true;
      SPIEL_ABBRUCH.delete(aufhoeren);
      buehneWeg(b);
      const w = I.weibchen;
      [m, w].forEach((v, i) => { if (!v) return; v.beimKlick = null; setTimeout(() => I.heimfliegen(v), i * 350); });
      if (zimt >= 3) setTimeout(() => m.el.classList.remove("satt"), 60000);
      if (grund === "nacht") setTimeout(() => ak.voegel.kommentiere && ak.voegel.kommentiere("Gähn … danke fürs Füttern, Toni. Jetzt geht es ins Nest 😴"), 2400);
    }
    let zimt = 0, gefuettert = 0, beschaeftigt = false, gewaehlt = null;
    SPIEL_ABBRUCH.add(aufhoeren);
    b.querySelector(".munkel-zu").addEventListener("click", () => aufhoeren("zu"));
    m.auftrag = true;
    m.timer.forEach(clearTimeout); m.timer = []; clearTimeout(m.flugTimer);
    let w = I.weibchen;
    if (!w) {
      if (m.zustand === "sitzt" && !m.el.hidden) await I.sag(m, "Ich hol schnell meine Liebste, die hat bestimmt auch Hunger 🥰", 2600);
      if (ende) return;
      w = I.neuesWeibchen();
    }
    w.auftrag = true;
    const platzM = () => I.ankerPunkt("26%", "oben", 3), platzW = () => I.ankerPunkt("74%", "oben", 3);
    const [a, c] = await Promise.all([I.holeHer(m, platzM), pause(350).then(() => I.holeHer(w, platzW))]);
    if (ende || !a || !c) { if (!ende) aufhoeren("zu"); return; }
    m.blick = 1; w.blick = -1; I.setzePosition(m, platzM()); I.setzePosition(w, platzW());
    // Tablett mit dem Futter
    tablett.innerHTML = "<h3>Futter für die Munkelvögel 🍽️</h3><p>Zieh etwas zu einem Vogel. Oder tipp erst aufs Futter und dann auf den Vogel</p>" +
      '<div class="futter-reihe">' + Object.keys(FUTTER).map((k) => '<button type="button" class="futter" data-futter="' + k + '"><span>' + FUTTER[k].svg + "</span><b>" + FUTTER[k].name + "</b></button>").join("") + "</div>" +
      '<div class="munkel-knoepfe"><button type="button" class="munkel-knopf" data-wahl="fertig">Fertig ♥️</button></div>';
    b.appendChild(tablett);
    tablett.querySelector('[data-wahl="fertig"]').addEventListener("click", () => schluss());
    let zuletztGefuettert = performance.now();
    const muede = setInterval(() => { if (ende || schlussLaeuft) { clearInterval(muede); return; } if (performance.now() - zuletztGefuettert > 45000) { clearInterval(muede); schluss(); } }, 1000);
    const vogelBei = (x, y) => [m, w].find((v) => { const r = v.el.getBoundingClientRect(); return x > r.left - 26 && x < r.right + 26 && y > r.top - 30 && y < r.bottom + 20; });
    [m, w].forEach((v) => { v.beimKlick = () => { if (gewaehlt && !beschaeftigt) { const k = gewaehlt; waehle(null); gib(v, k, tablett.querySelector('[data-futter="' + k + '"]').getBoundingClientRect()); } else if (!beschaeftigt) hinweis(b, "Tipp erst auf ein Futter 🍓"); return true; }; });
    function waehle(k) {
      gewaehlt = k;
      tablett.querySelectorAll(".futter").forEach((x) => x.classList.toggle("gewaehlt", x.dataset.futter === k));
      [m, w].forEach((v) => v.el.classList.toggle("futter-ziel", !!k));
    }
    tablett.querySelectorAll(".futter").forEach((knopf) => {
      let geist = null, x0 = 0, y0 = 0, bewegt = false;
      knopf.addEventListener("pointerdown", (e) => {
        if (beschaeftigt || e.button > 0) return;
        x0 = e.clientX; y0 = e.clientY; bewegt = false;
        try { knopf.setPointerCapture(e.pointerId); } catch (_) { /* egal */ }
      });
      knopf.addEventListener("pointermove", (e) => {
        if (x0 === 0 && y0 === 0) return;
        if (!bewegt && Math.hypot(e.clientX - x0, e.clientY - y0) < 8) return;
        if (!bewegt) {
          bewegt = true; waehle(null);
          geist = el("span", "futter-geist", FUTTER[knopf.dataset.futter].svg);
          document.body.appendChild(geist);
        }
        geist.style.left = e.clientX + "px"; geist.style.top = e.clientY + "px";
        const v = vogelBei(e.clientX, e.clientY);
        [m, w].forEach((x) => x.el.classList.toggle("futter-ziel", x === v));
      });
      const los = (e) => {
        if (x0 === 0 && y0 === 0) return;
        x0 = 0; y0 = 0;
        [m, w].forEach((x) => x.el.classList.remove("futter-ziel"));
        if (!bewegt) { if (!beschaeftigt) waehle(gewaehlt === knopf.dataset.futter ? null : knopf.dataset.futter); return; }
        const v = e && e.type === "pointerup" ? vogelBei(e.clientX, e.clientY) : null;
        const g = geist; geist = null;
        if (v && !beschaeftigt) { const r = g.getBoundingClientRect(); g.remove(); gib(v, knopf.dataset.futter, r); }
        else if (g) g.animate([{ opacity: 1 }, { opacity: 0, transform: "translate(-50%,-50%) scale(.4)" }], { duration: 300, fill: "forwards" }).onfinish = () => g.remove();
      };
      knopf.addEventListener("pointerup", los);
      knopf.addEventListener("pointercancel", los);
    });
    // Futter fliegt zum Schnabel, der Vogel futtert und sagt, wie es ihm schmeckt
    async function gib(v, art, von) {
      if (beschaeftigt || ende) return;
      beschaeftigt = true;
      const wer = v === m ? "m" : "w";
      const stueck = el("span", "futter-geist", FUTTER[art].svg);
      document.body.appendChild(stueck);
      const schnabel = I.amVogel(v, 33, 36), zx = schnabel.x - window.scrollX, zy = schnabel.y - window.scrollY;
      const sx0 = von.left + von.width / 2, sy0 = von.top + von.height / 2;
      const zuviel = wer === "m" && art === "zimt" && zimt >= 3;
      const bild = [];
      for (let i = 0; i <= 10; i++) {
        const u = i / 10, x = sx0 + (zx - sx0) * u, y = sy0 + (zy - sy0) * u - Math.sin(u * Math.PI) * 60;
        bild.push({ left: x + "px", top: y + "px", transform: "translate(-50%,-50%) scale(" + (1 - u * 0.55) + ")" });
      }
      await stueck.animate(bild, { duration: 520, easing: "ease-in", fill: "forwards" }).finished.catch(() => {});
      if (ende) { stueck.remove(); return; }
      if (zuviel) {
        // er schüttelt den Kopf, die Zimtschnecke fällt herunter
        stueck.animate([{ left: zx + "px", top: zy + "px" }, { left: zx + 30 + "px", top: zy - 20 + "px", offset: 0.3 }, { left: zx + 50 + "px", top: H() + 40 + "px", transform: "translate(-50%,-50%) rotate(300deg) scale(.4)" }], { duration: 900, easing: "ease-in", fill: "forwards" }).onfinish = () => stueck.remove();
        I.bild(v).animate([{ rotate: "0deg" }, { rotate: "-12deg", offset: 0.2 }, { rotate: "12deg", offset: 0.45 }, { rotate: "-8deg", offset: 0.7 }, { rotate: "0deg" }], { duration: 800 });
        I.sag(v, REAKTION.m.genug, 3000);
        await pause(1000);
        beschaeftigt = false;
        return;
      }
      stueck.remove();
      // knabbern
      I.bild(v).animate([{ translate: "0 0" }, { translate: "0 3px", offset: 0.2 }, { translate: "0 0", offset: 0.4 }, { translate: "0 3px", offset: 0.6 }, { translate: "0 0", offset: 0.8 }, { translate: "0 2px" }, { translate: "0 0" }], { duration: 700 });
      I.kruemelFliegt(v); setTimeout(() => I.kruemelFliegt(v), 260);
      ton(1100, 0.06, "triangle", 0.025); setTimeout(() => ton(1200, 0.06, "triangle", 0.025), 180);
      gefuettert++;
      zuletztGefuettert = performance.now();
      let satz;
      if (wer === "m" && art === "zimt") { satz = REAKTION.m.zimt[Math.min(2, zimt)]; zimt++; if (zimt === 3) { v.el.classList.add("satt"); I.bild(v).animate([{ scale: "1 1" }, { scale: "1.25 .8", offset: 0.4 }, { scale: ".95 1.06", offset: 0.7 }, { scale: "1 1" }], { duration: 700 }); } }
      else satz = wahl(REAKTION[wer][art]);
      if ((wer === "w" && art === "beere") || (wer === "m" && art === "zimt" && zimt < 3)) { const p = mitteVon(v); herzenBei(p.x, p.y - 26, 5); }
      if (wer === "m" && art === "beere") I.bild(v).animate([{ scale: "1 1" }, { scale: ".9 1.08", offset: 0.3 }, { scale: "1.04 .96", offset: 0.6 }, { scale: "1 1" }], { duration: 600 });
      // der andere Vogel schweigt, solange einer redet
      const andere = v === m ? w : m;
      I.still(andere);
      I.sag(v, satz, 2800);
      await pause(500);
      beschaeftigt = false;
      if (gefuettert >= 8) schluss();
    }
    let schlussLaeuft = false;
    async function schluss() {
      if (ende || schlussLaeuft) return;
      schlussLaeuft = true;
      tablett.classList.add("weg");
      await pause(900);
      if (ende) return;
      await I.sag(w, gefuettert ? "Danke, Toni! Wir sind pappsatt 🥰" : "Danke, Toni! Vielleicht haben wir später Hunger 🥰", 3000);
      if (gefuettert) await I.sag(m, zimt >= 3 ? "Ich roll jetzt einfach nach Hause 😵" : "Das war lecker 😋 Danke, Toni ♥️", 2800);
      if (ende) return;
      ende = true;
      SPIEL_ABBRUCH.delete(aufhoeren);
      buehneWeg(b);
      m.beimKlick = null; w.beimKlick = null;
      I.heimfliegen(m);
      setTimeout(() => I.heimfliegen(w), 400);
      if (zimt >= 3) setTimeout(() => m.el.classList.remove("satt"), 60000);
    }
  }

  /* =========================================================
     4. GLÜCKSFEDER (22.11. und 24.11. abends)
     Am Abend vor jeder Klausur schenkt der Munkelvogel Toni
     eine Feder. Sie steckt am Umschlag, bis die Klausur
     geschafft ist, dann kommt sie zum Ei ins Nest.
     ========================================================= */
  const KLAUSUR = { 23: "Erdkunde", 25: "Englisch" };
  const FEDER_SVG = '<svg viewBox="0 0 30 80" aria-hidden="true"><defs><linearGradient id="federVerlauf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffd27a"/><stop offset=".45" stop-color="#f26b5b"/><stop offset="1" stop-color="#8a5a3a"/></linearGradient></defs>' +
    '<path d="M15 4 C27 18 27 46 16 66 C4 46 3 18 15 4Z" fill="url(#federVerlauf)"/>' +
    '<path d="M15 6 L15.6 78" stroke="#6b4632" stroke-width="1.5" stroke-linecap="round"/>' +
    '<path d="M15 20 l-7 -4 M15 30 l-8 -4 M15 40 l-8 -3 M15.4 50 l-6 -2 M15 20 l7 -4 M15 30 l8 -4 M15 40 l8 -3 M15.4 50 l6 -2" stroke="#fff" stroke-width=".9" opacity=".55" stroke-linecap="round"/>' +
    '<path d="M10 22 Q12 12 15 8" stroke="#fff" stroke-width="1.6" opacity=".7" fill="none" stroke-linecap="round"/></svg>';
  const federStand = () => lies().feder || {};
  function merkeFeder(t, wert) { const s = lies(); s.feder = Object.assign({}, s.feder, { [t]: wert }); schreib(s); }
  // Federn am Umschlag: Erdkunde links, Englisch rechts
  const amUmschlag = {};
  function federAmUmschlag(t, neu) {
    if (amUmschlag[t] && amUmschlag[t].isConnected) return amUmschlag[t];
    const f = el("span", "feder-am-umschlag " + (t === 23 ? "links" : "rechts"), FEDER_SVG);
    f.setAttribute("aria-hidden", "true");
    umschlag.appendChild(f);
    amUmschlag[t] = f;
    if (neu && !ruhig) f.animate([{ opacity: 0, scale: ".4" }, { opacity: 1, scale: "1.15", offset: 0.6 }, { opacity: 1, scale: "1" }], { duration: 600, easing: "ease-out" });
    return f;
  }
  // die Federn im Nest (für das Küken)
  if (ak.nest && ak.nest.zusatz) ak.nest.zusatz((wo, art) => {
    if (wo !== "vorne" || art === "gross") return "";
    const st = federStand();
    let s = "";
    if (st[23] === "nest") s += '<g transform="translate(6 20) rotate(-38 6 26) scale(.36)">' + FEDER_SVG.replace(/<svg[^>]*>|<\/svg>/g, "").replace(/federVerlauf/g, "federNest1") + "</g>";
    if (st[25] === "nest") s += '<g transform="translate(103 18) rotate(32 6 26) scale(.36)">' + FEDER_SVG.replace(/<svg[^>]*>|<\/svg>/g, "").replace(/federVerlauf/g, "federNest2") + "</g>";
    return s;
  });
  function pruefeFedern() {
    const t = tag();
    const st = federStand();
    for (const k of [23, 25]) {
      const f = amUmschlag[k];
      const soll = st[k] === "dran" && t && t <= k;
      // Klausur geschafft (Kerze ausgepustet) oder der Tag vorbei: die Feder kommt ins Nest
      const geschafft = st[k] === "dran" && (!t ? false : t > k || (ak.wartezeit && ak.wartezeit.kerze && ak.wartezeit.kerze(k) === "fertig"));
      if (geschafft) {
        merkeFeder(k, "nest");
        if (f && f.isConnected) fliegtInsNest(f);
        continue;
      }
      if (soll && !umschlag.classList.contains("offen")) federAmUmschlag(k, false);
      else if (f && f.isConnected && !geschafft) { f.remove(); }
    }
  }
  setInterval(pruefeFedern, 1000);
  function fliegtInsNest(f) {
    const n = ak.nest && ak.nest.element && ak.nest.element();
    const von = f.getBoundingClientRect();
    f.remove();
    const flieger = el("span", "feder-fliegt", FEDER_SVG);
    document.body.appendChild(flieger);
    flieger.style.left = von.left + von.width / 2 + "px"; flieger.style.top = von.top + von.height / 2 + "px";
    if (!n || ruhig) { setTimeout(() => flieger.remove(), 10); if (ak.nest && ak.nest.neuZeichnen) ak.nest.neuZeichnen(); return; }
    const r = n.getBoundingClientRect(), zx = r.left + r.width * 0.5, zy = r.top + r.height * 0.4;
    const x0 = von.left + von.width / 2, y0 = von.top + von.height / 2, bahn = [];
    for (let i = 0; i <= 16; i++) { const u = i / 16; bahn.push({ left: x0 + (zx - x0) * u + Math.sin(u * Math.PI * 3) * 26 * (1 - u) + "px", top: y0 + (zy - y0) * u + "px", transform: "translate(-50%,-50%) rotate(" + Math.sin(u * Math.PI * 4) * 30 + "deg) scale(" + (1 - u * 0.6) + ")" }); }
    flieger.animate(bahn, { duration: 2600, easing: "ease-in-out", fill: "forwards" }).onfinish = () => {
      flieger.remove();
      if (ak.nest && ak.nest.neuZeichnen) ak.nest.neuZeichnen();
      if (ak.wartezeit && ak.wartezeit.blase) ak.wartezeit.blase(n, "Die Glücksfeder wohnt jetzt im Nest, beim Ei 🪶", 3000);
    };
  }
  async function feder(t) {
    if (!frei() || !KLAUSUR[t]) return;
    const m = I.maennchen;
    const b = neueBuehne("feder-buehne");
    let ende = false, festFn = null;
    const f = el("div", "feder-frei", FEDER_SVG);
    f.setAttribute("role", "button");
    f.setAttribute("aria-label", "Glücksfeder auf den Umschlag ziehen");
    function aufhoeren(grund) {
      if (ende) return;
      ende = true;
      SPIEL_ABBRUCH.delete(aufhoeren);
      umschlag.classList.remove("feder-ziel");
      if (festFn) festFn(false);
      f.remove();
      buehneWeg(b);
      I.heimfliegen(m);
      if (grund !== "nacht") setTimeout(() => ak.voegel.kommentiere && ak.voegel.kommentiere("Okay, Toni! Ich heb dir die Feder auf 🪶"), 2400);
    }
    SPIEL_ABBRUCH.add(aufhoeren);
    b.querySelector(".munkel-zu").addEventListener("click", () => aufhoeren("zu"));
    const platz = () => I.ankerPunkt("50%", "oben", 3);
    if (!(await I.holeHer(m, platz))) { aufhoeren("zu"); return; }
    if (ende) return;
    m.blick = 1; I.setzePosition(m, platz());
    await I.sag(m, "Moment, Toni …", 1500);
    if (ende) return;
    // er zupft sich eine Feder aus dem Flügel
    m.el.classList.add("zappelt");
    await I.bild(m).animate([{ rotate: "0deg", translate: "0 0" }, { rotate: "-16deg", translate: "0 -3px", offset: 0.25 }, { rotate: "10deg", translate: "0 -6px", offset: 0.55 }, { rotate: "-4deg", translate: "0 0", offset: 0.8 }, { rotate: "0deg", translate: "0 0" }], { duration: 900, easing: "ease-in-out" }).finished.catch(() => {});
    m.el.classList.remove("zappelt");
    ton(1500, 0.08, "triangle", 0.03);
    const start = I.amVogel(m, 10, 34);
    const sx0 = start.x - window.scrollX, sy0 = start.y - window.scrollY;
    const u = umschlag.getBoundingClientRect();
    // unter dem Countdown schweben (die Knöpfe sind während des Spiels ausgeblendet), nie über den Zahlen
    const unterkante = Math.max(u.bottom, ...["#countdown-ziffern", "#intro-hinweis"].map((sel) => { const e = document.querySelector(sel); const r = e && e.getBoundingClientRect(); return r && r.height ? r.bottom : 0; }));
    const hx = Math.max(60, Math.min(W() - 60, u.left + u.width * 0.5)), hy = Math.min(H() - 150, unterkante + 62);
    f.style.left = sx0 + "px"; f.style.top = sy0 + "px";
    b.appendChild(f);
    // sanft wie ein Blatt herunterschaukeln
    const bahn = [];
    for (let i = 0; i <= 20; i++) { const k = i / 20; bahn.push({ left: sx0 + (hx - sx0) * k + Math.sin(k * Math.PI * 3) * 40 * (1 - k) + "px", top: sy0 + (hy - sy0) * k + "px", transform: "translate(-50%,-50%) rotate(" + Math.sin(k * Math.PI * 3 + 0.6) * 35 + "deg)" }); }
    I.sag(m, "Autsch … aber für dich mach ich das gern 😅", 2600);
    await f.animate(bahn, { duration: ruhig ? 400 : 2600, easing: "ease-in-out", fill: "forwards" }).finished.catch(() => {});
    if (ende) return;
    f.getAnimations().forEach((a) => a.cancel());
    f.style.left = hx + "px"; f.style.top = hy + "px";
    f.classList.add("schwebt");
    await I.sag(m, "Für dich, Toni! Meine Glücksfeder 🪶", 2800);
    if (ende) return;
    hinweis(b, "Zieh die Feder auf deinen Umschlag 🪶");
    umschlag.classList.add("feder-ziel");
    // Ziehen, auf den Umschlag tippen, oder nach einer Weile steckt er sie selbst an
    const fest = await new Promise((fertig) => {
      festFn = fertig;
      let zieht = false, dx = 0, dy = 0;
      const ueberUmschlag = (x, y) => { const r = umschlag.getBoundingClientRect(); return x > r.left - 20 && x < r.right + 20 && y > r.top - 20 && y < r.bottom + 20; };
      f.addEventListener("pointerdown", (e) => {
        zieht = true; f.classList.remove("schwebt"); f.classList.add("zieht");
        const r = f.getBoundingClientRect(); dx = e.clientX - (r.left + r.width / 2); dy = e.clientY - (r.top + r.height / 2);
        try { f.setPointerCapture(e.pointerId); } catch (_) { /* egal */ }
        e.stopPropagation();
      });
      f.addEventListener("pointermove", (e) => {
        if (!zieht) return;
        f.style.left = e.clientX - dx + "px"; f.style.top = e.clientY - dy + "px";
        umschlag.classList.toggle("feder-drueber", ueberUmschlag(e.clientX, e.clientY));
      });
      const los = (e) => {
        if (!zieht) return;
        zieht = false; f.classList.remove("zieht");
        umschlag.classList.remove("feder-drueber");
        if (e.type === "pointerup" && ueberUmschlag(e.clientX, e.clientY)) { fertig(true); return; }
        // zurück an ihren Platz
        f.animate([{ left: f.style.left, top: f.style.top }, { left: hx + "px", top: hy + "px" }], { duration: 400, easing: "ease-out" });
        f.style.left = hx + "px"; f.style.top = hy + "px";
        f.classList.add("schwebt");
      };
      f.addEventListener("pointerup", los);
      f.addEventListener("pointercancel", los);
      b.addEventListener("pointerdown", (e) => { if (e.target === b && ueberUmschlag(e.clientX, e.clientY)) fertig(true); });
      setTimeout(() => fertig("selbst"), 25000);
    });
    festFn = null;
    if (!fest || ende) return;
    umschlag.classList.remove("feder-ziel", "feder-drueber");
    hinweis(b, "");
    // an ihren Platz am Umschlag fliegen
    const ziel = federAmUmschlag(t, false);
    ziel.style.visibility = "hidden";
    const zr = ziel.getBoundingClientRect(), fr = f.getBoundingClientRect();
    f.classList.remove("schwebt");
    await f.animate([{ left: fr.left + fr.width / 2 + "px", top: fr.top + fr.height / 2 + "px", transform: "translate(-50%,-50%) rotate(0deg)" },
      { left: zr.left + zr.width / 2 + "px", top: zr.top + zr.height / 2 + "px", transform: "translate(-50%,-50%) rotate(" + (t === 23 ? -28 : 26) + "deg) scale(" + (zr.height / fr.height).toFixed(2) + ")" }], { duration: 700, easing: "ease-in-out", fill: "forwards" }).finished.catch(() => {});
    f.remove();
    ziel.style.visibility = "";
    merkeFeder(t, "dran");
    herzenBei(zr.left + zr.width / 2, zr.top + zr.height / 2, 10, ["✨", "🍀", "♥️"]);
    ton(880, 0.12); setTimeout(() => ton(1320, 0.16), 120);
    if (ende) return;
    await I.sag(m, fest === "selbst" ? "Ich steck sie dir einfach an, Toni 🪶 Sie bleibt da, bis " + KLAUSUR[t] + " geschafft ist 🍀" : "Die bleibt da, bis " + KLAUSUR[t] + " geschafft ist. Ganz viel Glück, Toni 🍀", 4200);
    if (ende) return;
    ende = true;
    SPIEL_ABBRUCH.delete(aufhoeren);
    buehneWeg(b);
    I.heimfliegen(m);
  }

  /* =========================================================
     5. KAFFEE ZUM SCHULWEG (24.11. morgens)
     Der Munkelvogel holt eine kleine Tasse und stellt sie
     auf die Fensterbank. Sie dampft bis zum Mittag.
     ========================================================= */
  const TASSE_SVG = '<svg viewBox="0 0 40 40" aria-hidden="true"><g class="kaffee-dampf"><path d="M14 12q-3-4 0-8M20 12q-3-4 0-8M26 12q-3-4 0-8" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round" opacity=".85"/></g>' +
    '<ellipse cx="20" cy="37" rx="15" ry="2.6" fill="rgba(60,30,20,.2)"/><path d="M9 16h22l-2.5 17q-.5 3-3.5 3h-10q-3 0-3.5-3z" fill="#fff6f0"/><path d="M9 16h22l-.6 4H9.6z" fill="#e85d7e"/>' +
    '<path d="M30.5 20q6 0 5 6t-6.5 5" stroke="#fff6f0" stroke-width="3" fill="none"/><ellipse cx="20" cy="16" rx="11" ry="2.6" fill="#8a5a3a"/><ellipse cx="17" cy="15.4" rx="5" ry="1.4" fill="#fff8ee"/>' +
    '<path d="M18 26c-1.6-1.2-3-2.4-3-3.6 0-.9.7-1.6 1.5-1.6.7 0 1.2.3 1.5.9.3-.6.8-.9 1.5-.9.8 0 1.5.7 1.5 1.6 0 1.2-1.4 2.4-3 3.6z" fill="#e85d7e"/></svg>';
  let tasse = null, kaffeeUnterwegs = false;
  const kaffeeTag = () => tag() === 24;
  function tasseZustand() {
    const soll = kaffeeTag() && lies().kaffee === 24 && !kaffeeUnterwegs && stunde() < 14 && !intro.hidden;
    const bank = intro.querySelector(".wz-bank");
    if (soll && bank && (!tasse || !tasse.isConnected)) {
      tasse = el("button", "kaffee-tasse", TASSE_SVG);
      tasse.type = "button";
      tasse.setAttribute("aria-label", "Tasse");
      tasse.addEventListener("click", () => { if (ak.wartezeit && ak.wartezeit.blase) ak.wartezeit.blase(tasse, wahl(["Mmh, Kakao mit Sahne 😋", "Noch schön warm ☕ Trink schön aus, Toni", "Mit Liebe gerührt ♥️"]), 2400); });
      bank.appendChild(tasse);
    }
    if (!soll && tasse) { tasse.remove(); tasse = null; }
  }
  setInterval(tasseZustand, 1000);
  const tassenPunkt = () => { const b = intro.querySelector(".wz-bank"); if (!b) return null; const r = b.getBoundingClientRect(); return r.width ? { x: r.left + Math.max(r.width * 0.09, r.width / 2 - 250) + 15, y: r.top + 6 } : null; };
  async function kaffee() {
    const m = I.maennchen;
    if (!tassenPunkt()) return;
    merke("kaffee", 24);
    kaffeeUnterwegs = true;
    m.auftrag = true;
    m.timer.forEach(clearTimeout); m.timer = []; clearTimeout(m.flugTimer);
    await I.sag(m, "Moment, Toni, ich hol dir schnell was ☕", 2600);
    // kurz wegfliegen …
    if (m.pos && !m.el.hidden) {
      m.zustand = "fliegt"; m.el.classList.add("fliegt");
      const s = m.pos;
      await I.animiere(m, [s, { x: s.x + 40, y: s.y - 70 }, { x: W() + 90, y: Math.max(-40, s.y - 160) }], 1500);
    }
    m.el.hidden = true; m.zustand = "weg";
    await pause(1600);
    // … und mit der Tasse unter den Füßen wiederkommen
    const getragen = el("span", "kaffee-getragen", TASSE_SVG);
    document.body.appendChild(getragen);
    let tragen = true;
    const mit = () => { if (!tragen) return; if (m.pos) { getragen.style.left = m.pos.x + "px"; getragen.style.top = m.pos.y + 6 + "px"; } requestAnimationFrame(mit); };
    const ziel = () => { const p = tassenPunkt(); return p && { x: p.x, y: p.y - 26 }; };
    m.el.hidden = true; m.pos = null;
    requestAnimationFrame(mit);
    const da = await I.holeHer(m, ziel, 2400);
    kaffeeUnterwegs = false;
    if (!da) { tragen = false; getragen.remove(); I.heimfliegen(m); return; }
    // abstellen und auf der Fensterbank daneben landen
    tragen = false;
    getragen.remove();
    tasseZustand();
    plopp();
    const neben = () => { const p = tassenPunkt(); return p && { x: p.x + 34, y: p.y }; };
    await I.holeHer(m, neben, 600);
    if (tasse) { const r = tasse.getBoundingClientRect(); herzenBei(r.left + r.width / 2, r.top, 6, ["☕", "♥️", "✨"]); }
    await I.sag(m, wahl(["Für den Schulweg, Toni ☕ Vorsichtig, ganz heiß!", "Ein warmer Kakao für dich, Toni ☕ Hab einen schönen Schultag!"]), 4200);
    I.heimfliegen(m);
  }

  /* =========================================================
     6. FOTOBOX (25.11. nachmittags, danach in Tonis Ecke)
     ========================================================= */
  const POSEN = [
    { id: "herz", satz: "Wir machen ein Herz 🥰" },
    { id: "huete", satz: "Partyhüte auf, morgen wird gefeiert 🥳" },
    { id: "brillen", satz: "Ganz cool gucken 😎" },
    { id: "schild", satz: "Wir halten ein Schild für dich hoch ♥️" },
    { id: "kuss", satz: "Küsschen! 😘" },
  ];
  const FOTO_SCHLUESSEL = "toni-wz-fotos";
  const fotos = () => { try { const l = JSON.parse(localStorage.getItem(FOTO_SCHLUESSEL) || "[]"); return Array.isArray(l) ? l : []; } catch (_) { return []; } };
  function vogelImFoto(weiblich, x, y, g, spiegeln) {
    const svg = ak.voegel.svg ? ak.voegel.svg(weiblich) : "";
    const inner = svg.replace("<svg ", '<svg x="' + x + '" y="' + y + '" width="' + g + '" height="' + g + '" ');
    return spiegeln ? '<g transform="translate(' + (2 * x + g) + ' 0) scale(-1 1)">' + inner + "</g>" : inner;
  }
  let fotoNr = 0;
  function fotoSvg(pose) {
    const id = "fotoHimmel" + ++fotoNr, nah = pose === "kuss" ? 18 : 0;
    let s = '<svg viewBox="0 0 200 150" aria-hidden="true"><defs><linearGradient id="' + id + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe4ea"/><stop offset="1" stop-color="#fff6ec"/></linearGradient></defs>' +
      '<rect width="200" height="150" fill="url(#' + id + ')"/>';
    for (let k = 0; k < 9; k++) s += '<circle cx="' + (12 + k * 23) + '" cy="' + (18 + (k % 3) * 9) + '" r="' + (2 + (k % 2)) + '" fill="#fff" opacity=".7"/>';
    s += '<rect y="118" width="200" height="32" fill="#ecd3b6"/><rect y="116" width="200" height="4" fill="#c99c74"/>';
    s += vogelImFoto(false, 36 + nah, 52, 66, false) + vogelImFoto(true, 98 - nah, 52, 66, true);
    const herz = (x, y, g, f) => '<path d="M' + x + " " + (y + g * 0.85) + "C" + (x - g * 1.25) + " " + y + " " + (x - g * 0.6) + " " + (y - g) + " " + x + " " + (y - g * 0.35) + "C" + (x + g * 0.6) + " " + (y - g) + " " + (x + g * 1.25) + " " + y + " " + x + " " + (y + g * 0.85) + 'Z" fill="' + f + '"/>';
    if (pose === "herz") s += herz(100, 34, 16, "#e8455a") + herz(70, 24, 6, "#ff8fab") + herz(132, 26, 5, "#ff8fab");
    if (pose === "kuss") s += herz(100, 50, 7, "#e8455a") + herz(88, 34, 4, "#ff8fab") + herz(113, 30, 5, "#ff8fab");
    if (pose === "huete") for (const x of [69, 131]) s += '<path d="M' + (x - 9) + ' 64L' + x + ' 38l9 26z" fill="' + (x < 100 ? "#5aa9e6" : "#ff7aa2") + '"/><circle cx="' + x + '" cy="38" r="3.4" fill="#f3c84b"/><path d="M' + (x - 5) + " 54h10M" + (x - 3) + ' 47h6" stroke="#fff3b0" stroke-width="2"/>';
    if (pose === "brillen") for (const x of [36, 98]) {
      const k = (sx) => (x === 98 ? x + 66 - sx * 1.1 : x + sx * 1.1);
      s += '<g fill="#2b2b33"><rect x="' + (Math.min(k(17), k(29)) ) + '" y="81" width="13" height="9" rx="3"/><rect x="' + (Math.min(k(32), k(44))) + '" y="81" width="13" height="9" rx="3"/></g>';
    }
    if (pose === "schild") s += '<g transform="rotate(-4 100 112)"><rect x="64" y="100" width="72" height="26" rx="5" fill="#fff" stroke="#e85d7e" stroke-width="2"/><text x="100" y="118" text-anchor="middle" font-family="Dancing Script, cursive" font-size="16" font-weight="700" fill="#9d2449">Toni ♥️</text></g>';
    return s + "</svg>";
  }
  async function fotobox() {
    if (!frei()) return;
    const m = I.maennchen;
    const b = neueBuehne("foto-buehne");
    let ende = false, wahlFn = null;
    const karte = el("div", "munkel-karte foto-karte");
    const sucher = el("div", "foto-sucher", "<i></i><i></i><i></i><i></i>");
    function aufhoeren() {
      if (ende) return;
      ende = true;
      SPIEL_ABBRUCH.delete(aufhoeren);
      if (wahlFn) wahlFn(null);
      buehneWeg(b);
      const w = I.weibchen;
      [m, w].forEach((v, i) => { if (v) setTimeout(() => I.heimfliegen(v), i * 350); });
    }
    SPIEL_ABBRUCH.add(aufhoeren);
    b.querySelector(".munkel-zu").addEventListener("click", aufhoeren);
    m.auftrag = true;
    m.timer.forEach(clearTimeout); m.timer = []; clearTimeout(m.flugTimer);
    let w = I.weibchen;
    if (!w) {
      if (m.zustand === "sitzt" && !m.el.hidden) await I.sag(m, "Ich hol schnell meine Liebste, ohne sie ist es kein schönes Foto 🥰", 2600);
      if (ende) return;
      w = I.neuesWeibchen();
    }
    w.auftrag = true;
    const platzM = () => I.ankerPunkt("calc(50% - 27px)", "oben", 3), platzW = () => I.ankerPunkt("calc(50% + 27px)", "oben", 3);
    const [a, c] = await Promise.all([I.holeHer(m, platzM), pause(300).then(() => I.holeHer(w, platzW))]);
    if (ende || !a || !c) { if (!ende) aufhoeren(); return; }
    m.blick = 1; w.blick = -1; I.setzePosition(m, platzM()); I.setzePosition(w, platzW());
    while (!ende) {
      const pose = wahl(POSEN);
      // Sucher um die beiden legen
      const rm = m.el.getBoundingClientRect(), rw = w.el.getBoundingClientRect();
      const l = Math.min(rm.left, rw.left) - 22, r = Math.max(rm.right, rw.right) + 22, o = Math.min(rm.top, rw.top) - 26, u = Math.max(rm.bottom, rw.bottom) + 12;
      Object.assign(sucher.style, { left: l + "px", top: o + "px", width: r - l + "px", height: u - o + "px" });
      b.appendChild(sucher);
      sucher.classList.remove("weg");
      await I.sag(w, pose.satz, 2400);
      if (ende) return;
      [m, w].forEach((v) => I.hops(v));
      if (pose.id === "huete") { I.hut(m, true); I.hut(w, true); }
      karte.innerHTML = '<button type="button" class="foto-ausloeser" aria-label="Foto machen"><span>📸</span></button><p>Tipp auf den Auslöser</p>';
      b.appendChild(karte);
      karte.classList.remove("weg");
      const los = await new Promise((fertig) => { wahlFn = fertig; karte.querySelector(".foto-ausloeser").addEventListener("click", () => fertig(true)); });
      wahlFn = null;
      if (!los || ende) return;
      // Blitz und Klick
      ton(1800, 0.05, "square", 0.03); setTimeout(() => ton(900, 0.06, "square", 0.02), 60);
      const blitz = el("div", "wettflug-blitz");
      b.appendChild(blitz);
      setTimeout(() => blitz.remove(), 700);
      sucher.classList.add("weg");
      I.hut(m, false); I.hut(w, false);
      const d = ak.intro.datum();
      const liste = fotos().concat({ pose: pose.id, tag: d.tag + "." + d.monat + "." }).slice(-12);
      try { localStorage.setItem(FOTO_SCHLUESSEL, JSON.stringify(liste)); } catch (_) { /* egal */ }
      await pause(500);
      karte.innerHTML = '<div class="foto-polaroid">' + fotoSvg(pose.id) + '<p>' + d.tag + "." + d.monat + ". · Wir zwei ♥️</p></div>" +
        (liste.length > 1 ? '<div class="foto-album" aria-label="Fotoalbum">' + liste.slice(0, -1).reverse().slice(0, 5).map((f) => '<span>' + fotoSvg(f.pose) + "</span>").join("") + "</div>" : "") +
        "<p>" + (liste.length > 1 ? liste.length + " Fotos im Album. Du findest sie in Tonis Ecke 📸" : "Das kommt ins Album. Du findest es in Tonis Ecke 📸") + "</p>" +
        '<div class="munkel-knoepfe"><button type="button" class="munkel-knopf zweit" data-wahl="nochmal">Noch eins 📸</button><button type="button" class="munkel-knopf" data-wahl="fertig">Fertig ♥️</button></div>';
      b.classList.add("gedimmt");
      const weiter = await new Promise((fertig) => { wahlFn = fertig; karte.querySelectorAll("[data-wahl]").forEach((k) => k.addEventListener("click", () => fertig(k.dataset.wahl))); });
      wahlFn = null;
      b.classList.remove("gedimmt");
      if (!weiter || ende) return;
      karte.classList.add("weg");
      if (weiter === "fertig") break;
      await pause(300);
    }
    if (ende) return;
    await I.sag(m, "Das ist unser neues Lieblingsfoto, Toni 🥰", 2800);
    ende = true;
    SPIEL_ABBRUCH.delete(aufhoeren);
    buehneWeg(b);
    I.heimfliegen(m);
    setTimeout(() => I.heimfliegen(w), 400);
  }
  // Fotoalbum in Tonis Ecke ansehen (ohne Vögel)
  function album() {
    const liste = fotos();
    if (!liste.length) return;
    const b = neueBuehne("foto-buehne album");
    b.classList.add("gedimmt");
    const karte = el("div", "munkel-karte foto-karte", "<h3>Fotoalbum 📸</h3><div class=\"foto-album gross\">" + liste.slice().reverse().map((f) => '<figure>' + fotoSvg(f.pose) + "<figcaption>" + f.tag + "</figcaption></figure>").join("") + '</div><div class="munkel-knoepfe"><button type="button" class="munkel-knopf" data-wahl="fertig">Schließen</button></div>');
    b.appendChild(karte);
    const zu = () => buehneWeg(b);
    karte.querySelector("[data-wahl]").addEventListener("click", zu);
    b.querySelector(".munkel-zu").addEventListener("click", zu);
  }

  /* =========================================================
     7. GUTE-NACHT-GESCHICHTE (ab 22:30 Uhr, Nest antippen)
     ========================================================= */
  const GESCHICHTEN = {
    21: ["Gähn … Es war einmal ein kleiner Munkelvogel, der wollte unbedingt einen Stern fangen 🌟", "Er flog die ganze Nacht, aber der Stern war immer ein Stückchen weiter weg.", "Am Morgen merkte er: Der schönste Stern saß die ganze Zeit neben ihm im Nest. Das war ich 😌", "Gute Nacht, Toni 💤"],
    22: ["Mmh … Weißt du, wie wir zwei uns kennengelernt haben? 🥱", "Er hat mir eine Beere gebracht. Sie war viel zu sauer, und er hat sich so geschämt.", "Ich hab sie trotzdem gegessen. Seitdem teilen wir alles, sogar saure Beeren ♥️", "Schlaf schön, Toni 💤"],
    23: ["Psst … Heute erzähl ich dir von einer kleinen Schneeflocke ❄️", "Sie wollte nicht auf irgendein Dach fallen, sondern auf eine Nase, die sie anlächelt.", "Sie hat lange gesucht und ist heute auf deiner gelandet. Darum war heute so ein guter Tag 🍀", "Träum was Schönes, Toni 💤"],
    24: ["Gähn … Unser Ei hat heute ganz leise geklopft 🥚", "Ich glaube, es wollte wissen, wem die liebe Stimme da draußen gehört.", "Ich hab gesagt: Das ist Toni. Bald lernst du sie kennen ♥️", "Gute Nacht, Toni 💤"],
    25: ["Mmh … Die letzte Geschichte vor deinem Geburtstag 🥹", "Es war einmal ein Mädchen, das so lieb war, dass sogar zwei kleine Vögel bei ihm einziehen wollten.", "Und bald feiern alle zusammen: das Ei, die Capys, Chris und wir zwei 🎂", "Schlaf schön, Geburtstagskind 💤"],
  };
  let erzaehlt = false;
  function geschichte(nestEl) {
    if (erzaehlt || !nestEl || !ak.wartezeit || !ak.wartezeit.blase) return;
    const d = ak.intro.datum();
    const nacht = d.stunde < 5 ? d.tag - 1 : d.tag;
    const g = GESCHICHTEN[nacht];
    if (!g) return;
    const s = lies(), gehoert = Array.isArray(s.geschichten) ? s.geschichten : [];
    if (gehoert.includes(nacht)) { ak.wartezeit.blase(nestEl, wahl(["Psst … die zwei schlafen schon tief und fest 😴", "Zzz … Gute Nacht, Toni 💤"]), 2800); return; }
    erzaehlt = true;
    merke("geschichten", gehoert.concat(nacht));
    g.forEach((satz, i) => setTimeout(() => {
      const n = ak.nest && ak.nest.element && ak.nest.element();
      if (n && ak.nest.schlafen && ak.nest.schlafen()) ak.wartezeit.blase(n, satz, i === g.length - 1 ? 3600 : 5400);
      if (i === g.length - 1) setTimeout(() => { erzaehlt = false; }, 3600);
    }, i * 5700));
  }

  /* =========================================================
     8. MITTERNACHT (25. auf 26.11.)
     Ab 23:58 Uhr sind beide wach, setzen Partyhüte auf und
     zählen die letzten zehn Sekunden mit.
     ========================================================= */
  let party = false;
  const vorMitternacht = () => { const d = ak.intro.datum(); return d.jahr === KALENDER.jahr && d.monat === 11 && d.tag === 25 && d.stunde === 23 && d.minute >= 58 && ak.intro.phase() === "warten" && !reise(); };
  setInterval(() => { if (!party && ak.intro.bereit() && vorMitternacht() && !intro.hidden) mitternacht(); }, 400);
  async function mitternacht() {
    party = true;
    // warten, bis der Munkelvogel frei ist (höchstens 20 Sekunden)
    for (let i = 0; i < 50 && (I.maennchen.auftrag || document.querySelector(".munkel-buehne")); i++) await pause(400);
    const m = I.maennchen;
    let w = I.weibchen || I.neuesWeibchen();
    m.auftrag = true; w.auftrag = true;
    const platzM = () => I.ankerPunkt("calc(50% - 40px)", "oben", 3), platzW = () => I.ankerPunkt("calc(50% + 40px)", "oben", 3);
    await Promise.all([I.holeHer(m, platzM), pause(400).then(() => I.holeHer(w, platzW))]);
    m.blick = 1; w.blick = -1;
    I.hut(m, true); I.hut(w, true);
    I.hops(m); I.hops(w);
    const sek = () => { const d = ak.intro.datum(); return d.stunde === 23 && d.minute === 59 ? d.sekunde : d.stunde === 23 ? -1 : 60; };
    if (sek() < 40) {
      await I.sag(m, "Toni! Gleich ist es so weit 🥳", 3200);
      await I.sag(w, "Wir haben uns extra schick gemacht 🎉", 3000);
    }
    while (sek() < 50) await pause(200);
    let letzte = -1;
    while (ak.intro.phase() === "warten") {
      const s = sek();
      if (s >= 50 && s < 60 && s !== letzte) {
        letzte = s;
        const v = s % 2 ? w : m;
        I.still(s % 2 ? m : w);
        I.zeigeBlase(v, s === 50 ? "Zehn! 🥳" : String(60 - s) + (60 - s <= 3 ? "! 🎉" : "!"));
        v.nachholen = null;
        I.hops(v);
        if (s === 55 && ak.ei && ak.ei.klopf) ak.ei.klopf();
      }
      await pause(120);
    }
    I.still(m); I.still(w);
    if (ak.konfetti) ak.konfetti("konfetti");
    const r = umschlag.getBoundingClientRect();
    herzenBei(r.left + r.width / 2, r.top, 18, ["🎉", "♥️", "✨", "🥳"]);
    I.zeigeBlase(m, "Happy Birthday, Toni! 🎂🥳"); m.nachholen = null;
    await pause(3400);
    I.still(m);
    await I.sag(w, "Alles Liebe zum Geburtstag, Toni ♥️", 3400);
    I.heimfliegen(m);
    setTimeout(() => I.heimfliegen(w), 400);
    setTimeout(() => { I.hut(m, false); I.hut(w, false); }, 30 * 60000);
  }

  /* ---------- Fragen der Munkelvögel ---------- */
  if (ak.voegel.registriere) {
    ak.voegel.registriere({
      art: "feder", vogel: "m", prio: 1,
      aktiv: () => (tag() === 22 || tag() === 24) && stunde() >= 17 && stunde() < 22 && !federStand()[tag() + 1] && frei(),
      vorab: () => (tag() === 22 ? "Toni, morgen schreibst du doch Erdkunde 🍀" : "Toni, morgen ist doch Englisch dran 🍀"),
      frage: () => "Darf ich dir meine Glücksfeder schenken? 🪶",
      knoepfe: ["Ja 🥰", "Später"],
      ja: () => feder(tag() + 1),
      spaeter: ["Okay, Toni! Ich heb sie dir auf 🪶"],
    });
    ak.voegel.registriere({
      art: "verstecken", vogel: "m", prio: 4,
      aktiv: () => tag() === 21 && tagsueber() && !lies().verstecken && frei(),
      vorab: () => "Toni, mir ist sooo langweilig 🥱",
      frage: () => "Spielst du Verstecken mit mir? 🙈",
      knoepfe: ["Ja 🙈", "Später"],
      angeboten: () => merke("verstecken", true),
      ja: () => verstecken(),
      spaeter: ["Okay, Toni! In Tonis Ecke kannst du jederzeit Verstecken mit mir spielen 🙈"],
    });
    ak.voegel.registriere({
      art: "wettflug", vogel: "m", prio: 5,
      aktiv: () => tag() === 22 && tagsueber() && !lies().wettflug && frei(),
      vorab: () => "Toni, meine Liebste behauptet, sie fliegt schneller als ich 😤",
      frage: () => "Machen wir ein Wettfliegen? Du darfst tippen, wer gewinnt 🏁",
      knoepfe: ["Ja 🏁", "Später"],
      angeboten: () => merke("wettflug", true),
      ja: () => wettfliegen(),
      spaeter: ["Okay, Toni! In Tonis Ecke kannst du uns jederzeit um die Wette fliegen lassen 🏁"],
    });
    ak.voegel.registriere({
      art: "fuettern", vogel: "m", prio: 6,
      aktiv: () => tag() === 23 && stunde() >= 14 && tagsueber() && !lies().fuettern && frei(),
      vorab: () => "Toni, mein Bauch knurrt 🥺",
      frage: () => "Hast du was zu futtern für uns? 🍓",
      knoepfe: ["Ja 🥰", "Später"],
      angeboten: () => merke("fuettern", true),
      ja: () => fuettern(),
      spaeter: ["Okay, Toni! In Tonis Ecke kannst du uns später füttern 🍓"],
    });
  }

  if (ak.voegel.registriere) {
    ak.voegel.registriere({
      art: "kaffee", vogel: "m", prio: 7, ohneFrage: true,
      aktiv: () => kaffeeTag() && stunde() >= 5 && stunde() < 12 && lies().kaffee !== 24 && frei() && !!tassenPunkt(),
      frage: () => "", ja: () => kaffee(),
    });
    ak.voegel.registriere({
      art: "fotobox", vogel: "m", prio: 6,
      aktiv: () => tag() === 25 && stunde() >= 14 && stunde() < 17 && !lies().fotobox && frei(),
      vorab: () => "Toni, wir haben uns heute so schick gemacht 🥰",
      frage: () => "Machst du ein Foto von uns zwei? 📸",
      knoepfe: ["Ja 📸", "Später"],
      angeboten: () => merke("fotobox", true),
      ja: () => fotobox(),
      spaeter: ["Okay, Toni! In Tonis Ecke wartet die Fotobox auf dich 📸"],
    });
  }

  /* ---------- Tonis Ecke ---------- */
  if (ak.ecke) {
    ak.ecke.eintrag({ id: "fotobox", symbol: "📸", name: "Fotobox", text: "Ein Foto von den Munkelvögeln", da: () => !!lies().fotobox && frei(), los: () => fotobox() });
    ak.ecke.eintrag({ id: "album", symbol: "🖼️", name: "Fotoalbum", text: "Alle Fotos ansehen", da: () => fotos().length > 0 && !document.querySelector(".munkel-buehne"), los: () => album() });
    ak.ecke.eintrag({ id: "verstecken", symbol: "🙈", name: "Verstecken", text: "Such den Munkelvogel", da: () => !!lies().verstecken && frei(), los: () => verstecken() });
    ak.ecke.eintrag({ id: "wettflug", symbol: "🏁", name: "Wettfliegen", text: "Wer ist schneller?", da: () => !!lies().wettflug && frei(), los: () => wettfliegen() });
    ak.ecke.eintrag({ id: "fuettern", symbol: "🍓", name: "Füttern", text: "Was schmeckt wem?", da: () => !!lies().fuettern && frei(), los: () => fuettern() });
  }

  window.adventkalender.munkelspiele = { kaffee, fotobox, album, geschichte, mitternacht, versteckJetzt: () => (aktuellesVersteck ? Object.assign({ id: aktuellesVersteck.id }, aktuellesVersteck.wo()) : null), verstecken, wettfliegen, fuettern, feder, laeuft: () => !!buehne };
})();
