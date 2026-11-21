/*
 * ===========================================================
 *  DAS EI IM WINTERNEST
 *  Ab dem 20.11. liegt ein kleines Ei im Nest auf der
 *  Fensterbank. Toni hält es jeden Tag einmal lange gedrückt,
 *  dann bleibt es warm. Es wackelt, bekommt Risse und piept.
 *  Am 25.11. abends sucht Toni einen Namen aus, am 26.11.
 *  schlüpft das Küken und wohnt danach bei den Munkelvögeln.
 * ===========================================================
 */
(function () {
  "use strict";

  const ak = window.adventkalender;
  const intro = document.getElementById("intro");
  if (!ak || !ak.intro || !intro) return;
  const ruhig = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const f1 = (n) => n.toFixed(1);
  const wahl = (l) => l[Math.floor(Math.random() * l.length)];
  const pause = (ms) => new Promise((r) => setTimeout(r, ms));
  const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html !== undefined) e.innerHTML = html; return e; };

  /* ---------- Speichern ---------- */
  const SCHLUESSEL = "toni-wz-ei";
  function lies() { try { const s = JSON.parse(localStorage.getItem(SCHLUESSEL) || "{}"); return s && typeof s === "object" ? s : {}; } catch (_) { return {}; } }
  function schreib(s) { try { localStorage.setItem(SCHLUESSEL, JSON.stringify(s)); } catch (_) { /* egal */ } }
  const warmTage = () => (Array.isArray(lies().warm) ? lies().warm : []);

  /* ---------- Welcher Tag? ---------- */
  const reise = () => !!(ak.zeitreise && ak.zeitreise.aktiv());
  // 20. bis 25.11. im Countdown, sonst 0
  function eiTag() {
    if (!ak.intro.bereit() || ak.intro.phase() !== "warten" || reise()) return 0;
    const d = ak.intro.datum();
    if (d.jahr !== KALENDER.jahr || d.monat !== 11 || d.tag < 20 || d.tag > 25) return 0;
    return d.tag;
  }
  const stunde = () => ak.intro.datum().stunde;
  const nachts = () => intro.classList.contains("wz-nacht");
  // wie weit das Küken schon ist: 0 am 20.11. bis 5 am 25.11.
  const stufe = () => Math.max(0, Math.min(5, eiTag() - 20));
  const heuteWarm = () => warmTage().includes(eiTag());

  /* ---------- Zeichnung ---------- */
  let glutNr = 0;
  // Ei mit Mitte cx, von oben bis unten, Breite b; st = Stufe (Risse ab 3, Schnabel ab 5)
  function eiSvg(cx, oben, unten, b, st, warm, klasse) {
    const h = unten - oben, id = "eiGlut" + ++glutNr;
    const x = (a) => f1(cx + b * a), y = (a) => f1(oben + h * a);
    const pfad = "M" + x(0) + " " + y(0) + " C" + x(0.42) + " " + y(0) + " " + x(0.5) + " " + y(0.55) + " " + x(0.5) + " " + y(0.68) +
      " C" + x(0.5) + " " + y(0.9) + " " + x(0.27) + " " + y(1) + " " + x(0) + " " + y(1) +
      " C" + x(-0.27) + " " + y(1) + " " + x(-0.5) + " " + y(0.9) + " " + x(-0.5) + " " + y(0.68) +
      " C" + x(-0.5) + " " + y(0.55) + " " + x(-0.42) + " " + y(0) + " " + x(0) + " " + y(0) + "Z";
    let s = '<g class="' + (klasse || "nest-ei") + (warm ? " warm" : "") + " s" + st + '">' +
      '<defs><radialGradient id="' + id + '"><stop offset="0" stop-color="#ffc27a" stop-opacity=".95"/><stop offset=".55" stop-color="#ff9f6b" stop-opacity=".45"/><stop offset="1" stop-color="#ff9f6b" stop-opacity="0"/></radialGradient></defs>' +
      '<ellipse class="ei-glut" cx="' + x(0) + '" cy="' + y(0.58) + '" rx="' + f1(b * 1.05) + '" ry="' + f1(h * 0.78) + '" fill="url(#' + id + ')"/>' +
      '<g class="ei-koerper">' +
      '<path d="' + pfad + '" fill="#e6f4f7"/>' +
      '<path d="M' + x(0.12) + " " + y(0.04) + " C" + x(0.45) + " " + y(0.12) + " " + x(0.5) + " " + y(0.6) + " " + x(0.48) + " " + y(0.72) + " C" + x(0.46) + " " + y(0.92) + " " + x(0.22) + " " + y(1) + " " + x(0) + " " + y(1) +
      " C" + x(0.3) + " " + y(0.86) + " " + x(0.36) + " " + y(0.5) + " " + x(0.12) + " " + y(0.04) + 'Z" fill="#c6e1ea"/>' +
      '<ellipse cx="' + x(-0.2) + '" cy="' + y(0.3) + '" rx="' + f1(b * 0.11) + '" ry="' + f1(h * 0.13) + '" fill="#fff" opacity=".85" transform="rotate(-18 ' + x(-0.2) + " " + y(0.3) + ')"/>';
    // Sprenkel
    for (const [a, c, r, f] of [[-0.18, 0.55, 0.05, "#c08a72"], [0.16, 0.36, 0.04, "#e8a0b4"], [0.26, 0.66, 0.05, "#c08a72"], [-0.3, 0.76, 0.035, "#e8a0b4"], [0.02, 0.84, 0.04, "#c08a72"], [0.06, 0.2, 0.03, "#c08a72"], [-0.06, 0.66, 0.03, "#e8a0b4"]])
      s += '<circle cx="' + x(a) + '" cy="' + y(c) + '" r="' + f1(b * r) + '" fill="' + f + '" opacity=".7"/>';
    // Risse
    const riss = (pkte, w) => '<path d="M' + pkte.map(([a, c]) => x(a) + " " + y(c)).join(" L") + '" fill="none" stroke="#7a5a4a" stroke-width="' + f1(w) + '" stroke-linecap="round" stroke-linejoin="round"/>';
    if (st >= 3) s += riss([[-0.1, 0.4], [-0.02, 0.47], [0.06, 0.39], [0.14, 0.46]], b * 0.035);
    if (st >= 4) s += riss([[-0.38, 0.45], [-0.28, 0.38], [-0.18, 0.46], [-0.1, 0.4]], b * 0.035) + riss([[0.14, 0.46], [0.24, 0.38], [0.33, 0.45], [0.42, 0.4]], b * 0.035);
    if (st >= 5) {
      // ein kleines Loch, aus dem schon die Schnabelspitze schaut
      s += '<path d="M' + x(-0.06) + " " + y(0.42) + " L" + x(0.02) + " " + y(0.36) + " L" + x(0.1) + " " + y(0.43) + " L" + x(0.06) + " " + y(0.5) + " L" + x(-0.04) + " " + y(0.5) + 'Z" fill="#4a3428"/>' +
        '<path class="ei-schnabel" d="M' + x(-0.02) + " " + y(0.44) + " L" + x(0.1) + " " + y(0.46) + " L" + x(0.02) + " " + y(0.5) + 'Z" fill="#f3b23c"/>';
    }
    return s + "</g></g>";
  }
  // im Nest auf der Fensterbank (rechts in der Mulde, damit daneben noch ein Vogel sitzen kann)
  // und groß in der Mitte (für das Fenster mit dem Ei)
  function imNest(wo, art) {
    if (art === "gross") return wo === "mulde" ? eiSvg(60, 7, 50, 31, grossStufe, grossWarm, "nest-ei gross") : "";
    if (wo !== "mulde" || !zeigeEi()) return "";
    return eiSvg(80, 16, 46, 22, stufe(), heuteWarm());
  }
  let grossStufe = 0, grossWarm = false;
  const zeigeEi = () => !!(eiTag() && ak.nest && ak.nest.element && ak.nest.element() && !nachts() && !(ak.nest.verschlafen && ak.nest.verschlafen()));
  if (ak.nest && ak.nest.zusatz) ak.nest.zusatz(imNest);

  /* ---------- Töne (sehr leise, nur nach einem Tipp von Toni) ---------- */
  let audio = null;
  function piepTon(hoch) {
    try {
      audio = audio || new (window.AudioContext || window.webkitAudioContext)();
      if (audio.state === "suspended") audio.resume();
      const t = audio.currentTime, o = audio.createOscillator(), g = audio.createGain();
      o.type = "sine";
      o.frequency.setValueAtTime(hoch ? 2300 : 1900, t);
      o.frequency.exponentialRampToValueAtTime(hoch ? 3100 : 2600, t + 0.07);
      o.frequency.exponentialRampToValueAtTime(hoch ? 2500 : 2100, t + 0.13);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.05, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.15);
      o.connect(g).connect(audio.destination);
      o.start(t); o.stop(t + 0.17);
    } catch (_) { /* ohne Ton */ }
  }
  function klopfTon() {
    try {
      audio = audio || new (window.AudioContext || window.webkitAudioContext)();
      if (audio.state === "suspended") audio.resume();
      const t = audio.currentTime, o = audio.createOscillator(), g = audio.createGain();
      o.type = "triangle"; o.frequency.setValueAtTime(900, t); o.frequency.exponentialRampToValueAtTime(300, t + 0.05);
      g.gain.setValueAtTime(0.06, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.07);
      o.connect(g).connect(audio.destination); o.start(t); o.stop(t + 0.08);
    } catch (_) { /* ohne Ton */ }
  }

  /* ---------- Kleine Effekte ---------- */
  const effektEbene = el("div", "ei-effekte");
  effektEbene.setAttribute("aria-hidden", "true");
  document.body.appendChild(effektEbene);
  function herzen(x, y, n) {
    for (let k = 0; k < n; k++) {
      const h = el("span", "ei-herz", k % 3 === 2 ? "✨" : "♥️");
      h.style.left = x + "px"; h.style.top = y + "px";
      effektEbene.appendChild(h);
      const dx = (Math.random() - 0.5) * 70, dy = -40 - Math.random() * 50;
      h.animate([{ transform: "translate(-50%,-50%) scale(.3)", opacity: 0 }, { transform: "translate(calc(-50% + " + f1(dx * 0.5) + "px), calc(-50% + " + f1(dy * 0.5) + "px)) scale(1)", opacity: 1, offset: 0.35 },
        { transform: "translate(calc(-50% + " + f1(dx) + "px), calc(-50% + " + f1(dy) + "px)) scale(.8)", opacity: 0 }], { duration: 1200 + Math.random() * 500, delay: k * 60, easing: "ease-out", fill: "both" }).onfinish = () => h.remove();
    }
  }
  function piepWort(x, y) {
    const p = el("span", "ei-piep", wahl(["piep", "piep!", "pieps"]));
    p.style.left = x + "px"; p.style.top = y + "px";
    effektEbene.appendChild(p);
    p.animate([{ transform: "translate(-50%,-50%) scale(.6)", opacity: 0 }, { transform: "translate(-50%,-110%) scale(1)", opacity: 1, offset: 0.3 }, { transform: "translate(-50%,-190%) scale(1)", opacity: 0 }],
      { duration: 1500, easing: "ease-out", fill: "forwards" }).onfinish = () => p.remove();
  }

  /* ---------- Lang drücken ---------- */
  function langDruck(ziel, ms, { start, fertig, abbruch, tipp }) {
    let t = null, x0 = 0, y0 = 0, seit = 0;
    const halt = (kurz) => {
      if (!t) return;
      clearTimeout(t); t = null;
      if (abbruch) abbruch();
      if (kurz && performance.now() - seit < 450 && tipp) tipp();
    };
    ziel.addEventListener("pointerdown", (e) => {
      if (e.button > 0 || t) return;
      x0 = e.clientX; y0 = e.clientY; seit = performance.now();
      try { ziel.setPointerCapture(e.pointerId); } catch (_) { /* egal */ }
      if (start) start();
      t = setTimeout(() => { t = null; fertig(); }, ms);
    });
    ziel.addEventListener("pointermove", (e) => { if (t && Math.hypot(e.clientX - x0, e.clientY - y0) > 16) halt(false); });
    ziel.addEventListener("pointerup", () => halt(true));
    ziel.addEventListener("pointercancel", () => halt(false));
    ziel.addEventListener("contextmenu", (e) => e.preventDefault());
    ziel.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fertig(); } });
  }

  /* ---------- Wärmen ---------- */
  const WARM_SAETZE = {
    20: ["Danke, Toni! Jetzt hat es unser Ei schön warm 🥰", "Toni, du bist die beste Brüthilfe der Welt 🥰"],
    21: ["Toni, ich glaube, es hat sich gerade bewegt 🥹", "Danke, Toni! Ganz warm und gemütlich ♥️"],
    22: ["Es wackelt! Ich glaub, es mag dich, Toni ♥️", "Danke, Toni! Es kuschelt sich richtig in deine Wärme 🥰"],
    23: ["Hast du das gehört, Toni? Da drin klopft jemand 🥚", "Danke, Toni! Ich glaub, da wächst jemand ganz schnell 🥹"],
    24: ["Toni, es piept schon ganz leise 🐣", "Danke, Toni! Es piept, wenn du es wärmst 🥹"],
    25: ["Morgen ist es so weit, Toni! Danke fürs Warmhalten ♥️", "Toni, schau, die Schnabelspitze! Danke, dass du es so lieb gewärmt hast 🥹"],
  };
  function waermen(gross) {
    const t = eiTag();
    if (!t) return false;
    if (heuteWarm()) return false;
    const s = lies();
    s.warm = warmTage().concat(t);
    s.gezeigt = true;
    schreib(s);
    if (ak.nest && ak.nest.neuZeichnen) ak.nest.neuZeichnen();
    if (t >= 23) { piepTon(false); setTimeout(() => piepTon(true), 180); }
    if (!gross) {
      const r = knopf.getBoundingClientRect();
      herzen(r.left + r.width / 2, r.top + r.height * 0.3, 9);
      nestKlasse("ei-freut", 900);
      if (t >= 24) setTimeout(() => piepWort(r.left + r.width / 2, r.top), 400);
      setTimeout(() => {
        if (!(ak.voegel && ak.voegel.kommentiere && ak.voegel.kommentiere(wahl(WARM_SAETZE[t]), true)))
          wzBlase(knopf, "Schön warm ♥️ Danke, Toni", 2600);
      }, 700);
    }
    return true;
  }
  const wzBlase = (ziel, text, ms) => { if (ak.wartezeit && ak.wartezeit.blase) ak.wartezeit.blase(ziel, text, ms); };
  function nestKlasse(k, ms) {
    const n = ak.nest && ak.nest.element && ak.nest.element();
    if (!n) return;
    n.classList.remove(k); void n.offsetWidth; n.classList.add(k);
    if (ms) setTimeout(() => n.classList.remove(k), ms);
  }

  // unsichtbarer, größerer Knopf über dem Ei auf der Fensterbank
  const knopf = el("button", "nest-ei-knopf", '<span class="nest-ei-ring"></span>');
  knopf.type = "button";
  knopf.setAttribute("aria-label", "Ei warm halten (lange drücken)");
  knopf.hidden = true;
  langDruck(knopf, 1300, {
    start: () => { if (!heuteWarm()) { knopf.classList.add("drueckt"); nestKlasse("ei-druck"); } },
    abbruch: () => { knopf.classList.remove("drueckt"); const n = ak.nest && ak.nest.element && ak.nest.element(); if (n) n.classList.remove("ei-druck"); },
    fertig: () => {
      knopf.classList.remove("drueckt");
      const n = ak.nest && ak.nest.element && ak.nest.element(); if (n) n.classList.remove("ei-druck");
      if (!waermen(false)) wzBlase(knopf, heuteWarm() ? "Das Ei ist heute schon schön warm ♥️ Morgen wieder" : "Das Ei schläft gerade 💤", 2600);
    },
    tipp: () => {
      if (heuteWarm()) wzBlase(knopf, "Das Ei ist heute schon schön warm ♥️ Morgen wieder", 2600);
      else { wzBlase(knopf, "Halt das Ei lange gedrückt, dann wird es warm 🤲", 2800); nestKlasse("ei-freut", 900); }
    },
  });
  setInterval(() => {
    const da = zeigeEi() && !document.querySelector(".munkel-buehne");
    const bank = intro.querySelector(".wz-bank");
    if (da && bank && knopf.parentNode !== bank) bank.appendChild(knopf);
    knopf.hidden = !da;
  }, 600);
  // ab dem 24.11. piept es ab und zu von selbst
  setInterval(() => {
    if (knopf.hidden || stufe() < 4 || document.hidden || document.querySelector("dialog[open], .munkel-buehne, .special-buehne")) return;
    if (Math.random() > 0.35) return;
    const r = knopf.getBoundingClientRect();
    if (r.width && r.top > 0 && r.bottom < window.innerHeight) piepWort(r.left + r.width / 2, r.top + 4);
  }, 7000);

  /* ---------- Fenster: das Ei groß ---------- */
  const fensterEi = document.createElement("dialog");
  fensterEi.className = "nest-menue ei-menue";
  fensterEi.setAttribute("aria-label", "Das Ei");
  fensterEi.innerHTML =
    '<div class="nest-kopf"><h2>Ein Ei! 🥚</h2><p>Im Winternest auf der Fensterbank</p><button class="schliessen nest-zu" type="button" aria-label="Schließen">×</button></div>' +
    '<div class="ei-gross" role="button" tabindex="0" aria-label="Ei lange gedrückt halten"><div class="ei-gross-bild"></div><span class="ei-gross-ring"></span>' +
    '<svg class="ei-stetho" viewBox="0 0 120 78" aria-hidden="true"><path d="M78 30 C94 30 100 16 108 6" fill="none" stroke="#7d8696" stroke-width="2.2" stroke-linecap="round"/>' +
    '<path d="M108 6 L101 2 M108 6 L113 1" stroke="#7d8696" stroke-width="1.8" stroke-linecap="round"/><circle cx="101" cy="2" r="1.6" fill="#3a3f4a"/><circle cx="113" cy="1" r="1.6" fill="#3a3f4a"/>' +
    '<circle cx="77" cy="30" r="5" fill="#cfd6e2" stroke="#8a93a3" stroke-width="1.2"/><circle cx="77" cy="30" r="2.4" fill="#eef2f7"/></svg></div>' +
    '<p class="ei-text"></p><p class="ei-status" aria-live="polite"></p>' +
    '<div class="nest-fuss"><button type="button" class="nest-fertig ei-ok">Mach ich ♥️</button></div>';
  document.body.appendChild(fensterEi);
  const gross = fensterEi.querySelector(".ei-gross"), grossBild = fensterEi.querySelector(".ei-gross-bild");
  const eiText = fensterEi.querySelector(".ei-text"), eiStatus = fensterEi.querySelector(".ei-status");
  let nachSchliessen = null;
  function malGross() {
    grossStufe = stufe(); grossWarm = heuteWarm();
    grossBild.innerHTML = ak.nest && ak.nest.svg ? ak.nest.svg(null, false, "gross") : "";
    const n = warmTage().length;
    eiStatus.textContent = heuteWarm()
      ? (n > 1 ? "Heute schon schön warm ♥️ Schon " + n + " Tage gewärmt" : "Heute schon schön warm ♥️")
      : "Halt das Ei jetzt mal gedrückt 🤲";
  }
  let lauschen = false;
  function oeffneEi(text, danach, modus) {
    if (!eiTag()) return;
    lauschen = modus === "lauschen" || (!modus && !!lies().gelauscht && eiTag() >= 24);
    fensterEi.classList.toggle("lauschen", lauschen);
    fensterEi.querySelector("h2").textContent = lauschen ? "Lauschen 🩺" : "Ein Ei! 🥚";
    fensterEi.querySelector(".ei-ok").textContent = lauschen ? "Wie schön 🥹" : "Mach ich ♥️";
    if (lauschen && !text) text = "Halt das Ei gedrückt und lausch mal ganz genau 🩺";
    const s = lies(); s.gezeigt = true; s.angeboten = true; schreib(s);
    eiText.textContent = text || TEXT_INFO();
    nachSchliessen = danach || null;
    malGross();
    if (lauschen) eiStatus.textContent = "Drück aufs Ei und hör mal hin 🩺";
    if (typeof fensterEi.showModal === "function") fensterEi.showModal(); else fensterEi.setAttribute("open", "");
  }
  // Herzschlag beim Lauschen: Ton, Vibration und ein kleines Pochen
  let herzTakt = null;
  function herzTon() {
    try {
      audio = audio || new (window.AudioContext || window.webkitAudioContext)();
      if (audio.state === "suspended") audio.resume();
      [0, 0.17].forEach((v, i) => {
        const t = audio.currentTime + v, o = audio.createOscillator(), g = audio.createGain();
        o.type = "sine"; o.frequency.setValueAtTime(75, t); o.frequency.exponentialRampToValueAtTime(42, t + 0.12);
        g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(i ? 0.18 : 0.3, t + 0.015); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.14);
        o.connect(g).connect(audio.destination); o.start(t); o.stop(t + 0.16);
      });
    } catch (_) { /* ohne Ton */ }
  }
  function herzschlag(an) {
    clearInterval(herzTakt); herzTakt = null;
    if (!an) return;
    const schlag = () => {
      herzTon();
      if (navigator.vibrate) try { navigator.vibrate([22, 120, 16]); } catch (_) { /* egal */ }
      gross.classList.remove("pocht"); void gross.offsetWidth; gross.classList.add("pocht");
      const r = gross.getBoundingClientRect();
      if (Math.random() < 0.5) herzen(r.left + r.width * 0.5, r.top + r.height * 0.25, 1);
    };
    schlag();
    herzTakt = setInterval(schlag, 520);
    eiStatus.textContent = "Bumm bumm … bumm bumm 🥹";
  }
  ["pointerup", "pointercancel", "pointerleave"].forEach((n) => gross.addEventListener(n, () => {
    if (!herzTakt) return;
    herzschlag(false);
    eiStatus.textContent = "Das ist sein kleines Herz, Toni 🥹";
  }));
  const TEXT_INFO = () => {
    const t = eiTag();
    if (t >= 25) return "Das Ei piept schon ganz laut, Toni! 🐣 Lange dauert es nicht mehr. Halt es heute noch einmal schön warm ♥️";
    if (t >= 23) return "Es klopft und wackelt, Toni! 🐣 Bis zu deinem Geburtstag muss das Ei schön warm bleiben. Halt es jeden Tag einmal lange gedrückt ♥️";
    return "Wir bekommen ein Küken, Toni! 🐣 Bis zu deinem Geburtstag muss das Ei schön warm bleiben. Halt es jeden Tag einmal lange gedrückt, dann hilfst du uns beim Brüten ♥️";
  };
  langDruck(gross, 1300, {
    start: () => { if (!heuteWarm()) gross.classList.add("drueckt"); if (lauschen) herzschlag(true); },
    abbruch: () => gross.classList.remove("drueckt"),
    fertig: () => {
      gross.classList.remove("drueckt");
      if (waermen(true)) {
        malGross();
        const r = gross.getBoundingClientRect();
        herzen(r.left + r.width / 2, r.top + r.height * 0.35, 12);
        gross.classList.remove("freut"); void gross.offsetWidth; gross.classList.add("freut");
        eiStatus.textContent = lauschen && herzTakt ? "Bumm bumm … bumm bumm 🥹" : wahl(WARM_SAETZE[eiTag()]);
      }
    },
    tipp: () => { if (lauschen) { eiStatus.textContent = "Länger drücken und lauschen 🩺"; return; } if (!heuteWarm()) { eiStatus.textContent = "Länger drücken, ganz sanft 🤲"; gross.classList.remove("freut"); void gross.offsetWidth; gross.classList.add("freut"); } },
  });
  function schliesseEi() {
    if (!fensterEi.open) return;
    herzschlag(false);
    fensterEi.close();
    const f = nachSchliessen; nachSchliessen = null;
    if (f) setTimeout(f, 500);
  }
  fensterEi.querySelector(".ei-ok").addEventListener("click", schliesseEi);
  fensterEi.querySelector(".nest-zu").addEventListener("click", schliesseEi);
  fensterEi.addEventListener("cancel", (e) => { e.preventDefault(); schliesseEi(); });

  /* ---------- Fenster: Name fürs Küken ---------- */
  const VORSCHLAEGE = ["Krümel", "Piepsi", "Flöckchen", "Zimti", "Pünktchen", "Fritzi", "Kiki", "Federchen"];
  const fensterName = document.createElement("dialog");
  fensterName.className = "nest-menue ei-menue name-menue";
  fensterName.setAttribute("aria-label", "Name fürs Küken");
  fensterName.innerHTML =
    '<div class="nest-kopf"><h2>Wie soll es heißen? 🐣</h2><p>Such einen Namen fürs Küken aus</p><button class="schliessen nest-zu" type="button" aria-label="Schließen">×</button></div>' +
    '<div class="name-chips"></div>' +
    '<label class="name-eigen"><span>Oder ein eigener Name</span><input type="text" maxlength="14" autocomplete="off" spellcheck="false" placeholder="Name eintippen"></label>' +
    '<div class="nest-fuss"><button type="button" class="nest-fertig name-ok" disabled>Das ist der Name ♥️</button></div>';
  document.body.appendChild(fensterName);
  const chips = fensterName.querySelector(".name-chips"), eingabe = fensterName.querySelector("input"), nameOk = fensterName.querySelector(".name-ok");
  let gewaehlt = "", nameFertig = null;
  const sauber = (t) => String(t || "").replace(/[<>]/g, "").replace(/\s+/g, " ").trim().slice(0, 14);
  VORSCHLAEGE.forEach((n) => {
    const b = el("button", "name-chip", n);
    b.type = "button";
    b.addEventListener("click", () => { gewaehlt = n; eingabe.value = ""; markiere(); });
    chips.appendChild(b);
  });
  function markiere() {
    chips.querySelectorAll(".name-chip").forEach((b) => b.classList.toggle("an", b.textContent === gewaehlt && !sauber(eingabe.value)));
    nameOk.disabled = !(sauber(eingabe.value) || gewaehlt);
  }
  eingabe.addEventListener("input", () => { if (sauber(eingabe.value)) gewaehlt = ""; markiere(); });
  eingabe.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); if (!nameOk.disabled) nameOk.click(); } });
  function oeffneName(fertig) {
    gewaehlt = ""; eingabe.value = ""; markiere();
    nameFertig = fertig || null;
    if (typeof fensterName.showModal === "function") fensterName.showModal(); else fensterName.setAttribute("open", "");
  }
  function schliesseName(name) {
    if (!fensterName.open) return;
    fensterName.close();
    const f = nameFertig; nameFertig = null;
    if (f) f(name || "");
  }
  nameOk.addEventListener("click", () => {
    const n = sauber(eingabe.value) || gewaehlt;
    if (!n) return;
    const s = lies(); s.name = n; schreib(s);
    schliesseName(n);
  });
  fensterName.querySelector(".nest-zu").addEventListener("click", () => schliesseName(""));
  fensterName.addEventListener("cancel", (e) => { e.preventDefault(); schliesseName(""); });

  /* ---------- Fragen der Munkelvögel ---------- */
  if (ak.voegel && ak.voegel.registriere) {
    // ab dem 20.11.: „Im Nest liegt was“ (einmal)
    ak.voegel.registriere({
      art: "ei", vogel: "beide", prio: 2,
      aktiv: () => !!eiTag() && !lies().angeboten && zeigeEi() && stunde() >= 5 && stunde() < 22,
      vorab: () => (ak.nest && ak.nest.vonVoegeln && ak.nest.vonVoegeln() ? "Toni, wir haben uns schnell selbst ein kleines Nest gebaut. Und jetzt liegt da was drin 🥹" : "Toni, Toni! In unserem Nest liegt was ganz Kleines 🥹"),
      frage: () => "Magst du es dir anschauen? 🪺",
      knoepfe: ["Ja 🥰", "Später"],
      angeboten: () => { const s = lies(); s.angeboten = true; schreib(s); },
      ja: () => oeffneEi(null, () => { if (ak.voegel.kommentiere) ak.voegel.kommentiere(wahl(["Wir freuen uns so, Toni 🥹", "Danke, Toni! Mit dir als Brüthilfe kann ja nichts schiefgehen ♥️"]), true); }),
      spaeter: ["Okay, Toni! Schau einfach mal ins Nest auf der Fensterbank 🪺", "Kein Problem, Toni. Es liegt im Nest und wartet auf dich 🥚"],
    });
    // 24.11. mittags: am Ei lauschen
    ak.voegel.registriere({
      art: "herzschlag", vogel: "beide", prio: 3.5,
      aktiv: () => eiTag() === 24 && stunde() >= 12 && stunde() < 17 && !lies().gelauscht && zeigeEi(),
      vorab: () => "Toni, ich hab da was gehört … ganz leise 🥹",
      frage: () => "Willst du mal am Ei lauschen? 🩺",
      knoepfe: ["Ja 🥹", "Später"],
      angeboten: () => { const s = lies(); s.gelauscht = true; schreib(s); },
      ja: () => oeffneEi(null, () => { if (ak.voegel.kommentiere) ak.voegel.kommentiere(wahl(["Hast du es gehört, Toni? Das ist unser Baby 🥹", "So ein kleines, schnelles Herz. Ich bin so glücklich 🥹"]), true); }, "lauschen"),
      spaeter: ["Okay, Toni! In Tonis Ecke kannst du unter „Das Ei“ später lauschen 🩺"],
    });
    // 25.11. ab 17 Uhr: Name fürs Küken
    ak.voegel.registriere({
      art: "name", vogel: "beide", prio: 3,
      aktiv: () => eiTag() === 25 && stunde() >= 17 && stunde() < 23 && !lies().name && zeigeEi(),
      vorab: () => "Toni, hörst du das? Das Ei piept schon ganz laut 🐣",
      frage: () => "Suchst du mit uns einen Namen fürs Küken aus? 🥚",
      knoepfe: ["Ja 🥰", "Später"],
      ja: () => oeffneName((n) => {
        if (!n) return;
        if (ak.voegel.kommentiere) ak.voegel.kommentiere(wahl([n + "! Was für ein schöner Name, Toni 🥰", n + "! Den Namen hat es sich bestimmt schon gewünscht 🥹"]), true);
      }),
      spaeter: ["Okay, Toni! Vielleicht fällt dir ja noch ein schöner Name ein 🥰"],
    });
  }

  /* ---------- Tonis Ecke ---------- */
  if (ak.ecke) {
    ak.ecke.eintrag({ id: "ei", symbol: "🥚", name: "Das Ei", text: "Nachschauen und warm halten", nach: "nest", da: () => zeigeEi() && !!(lies().gezeigt || lies().angeboten), los: () => oeffneEi() });
    ak.ecke.eintrag({ id: "kueken", symbol: "🐣", name: "Das Küken", text: "Den großen Moment nochmal sehen", da: () => geschluepft() && ak.intro.phase() === "offen", los: () => schluepfen(true) });
  }

  /* ---------- Schlüpfen am 26.11. ---------- */
  function geschluepft() { return !!lies().geschluepft; }
  const geburtstag = () => { const d = ak.intro.datum(); return d.jahr === KALENDER.jahr && d.monat === 11 && d.tag === 26 && ak.intro.phase() === "offen"; };
  let buehne = null;
  function schluepfen(nochmal) {
    if (buehne || document.querySelector(".munkel-buehne")) return;
    const s0 = lies();
    let name = s0.name || "";
    buehne = el("div", "munkel-buehne schluepf-buehne");
    buehne.setAttribute("role", "dialog");
    buehne.setAttribute("aria-label", "Das Küken schlüpft");
    buehne.innerHTML =
      '<div class="schluepf-licht"></div><p class="schluepf-titel">Ein ganz besonderer Moment 🥚</p>' +
      '<div class="schluepf-raum"><div class="schluepf-nest"></div>' +
      '<div class="schluepf-ei" role="button" tabindex="0" aria-label="Ei antippen"><div class="ei-ganz"></div><div class="ei-deckel"></div><div class="schluepf-kueken"></div><div class="ei-boden"></div></div>' +
      '<div class="schluepf-vogel m"></div><div class="schluepf-vogel w"></div><div class="schluepf-blase" hidden></div></div>' +
      '<p class="munkel-hinweis schluepf-hinweis" hidden></p><div class="schluepf-ende" hidden></div>' +
      '<button type="button" class="munkel-zu" aria-label="Schließen">✕</button>';
    document.body.appendChild(buehne);
    const b = buehne, raum = b.querySelector(".schluepf-raum");
    const q = (s) => b.querySelector(s);
    q(".schluepf-nest").innerHTML = ak.nest && ak.nest.svg ? ak.nest.svg(null, false, false) : "";
    const vSvg = (w) => (ak.voegel && ak.voegel.svg ? ak.voegel.svg(w) : "");
    q(".schluepf-vogel.m").innerHTML = vSvg(false);
    q(".schluepf-vogel.w").innerHTML = vSvg(true);
    q(".schluepf-kueken").innerHTML = ak.voegel && ak.voegel.kuekenSvg ? ak.voegel.kuekenSvg(true) : "";
    let riss = 0;
    const eiBild = (st) => '<svg viewBox="0 0 60 80" aria-hidden="true">' + eiSvg(30, 6, 76, 46, st, riss > 0, "schluepf-eibild") + "</svg>";
    const malEi = () => { q(".ei-ganz").innerHTML = eiBild(Math.min(5, 3 + Math.floor(riss / 2))); };
    malEi();
    let ende = false;
    const timer = [];
    const spaeter = (ms, f) => timer.push(setTimeout(() => { if (!ende) f(); }, ms));
    const warte = (ms) => new Promise((r) => spaeter(ms, r));
    const blase = q(".schluepf-blase");
    async function sag(wer, text, ms) {
      if (ende) return;
      const ziel = q(wer === "k" ? ".schluepf-kueken" : ".schluepf-vogel." + wer);
      blase.textContent = text; blase.hidden = false;
      const rr = raum.getBoundingClientRect(), zr = ziel.getBoundingClientRect();
      const bw = blase.offsetWidth, mitte = zr.left + zr.width / 2 - rr.left;
      const links = Math.max(-rr.left + 8, Math.min(window.innerWidth - rr.left - bw - 8, mitte - bw / 2));
      blase.style.left = links + "px";
      blase.style.top = zr.top - rr.top - blase.offsetHeight - 12 + "px";
      blase.style.setProperty("--spitze", Math.max(14, Math.min(bw - 14, mitte - links)) + "px");
      ziel.classList.add("redet");
      await warte(ms);
      blase.hidden = true; ziel.classList.remove("redet");
      await warte(250);
    }
    function schliessen() {
      if (ende) return;
      ende = true;
      timer.forEach(clearTimeout);
      b.classList.add("vorbei");
      setTimeout(() => { b.remove(); if (buehne === b) buehne = null; }, 650);
      if (lies().geschluepft && ak.voegel && ak.voegel.kuekenDazu && intro.hidden) setTimeout(() => ak.voegel.kuekenDazu(), 900);
    }
    q(".munkel-zu").addEventListener("click", schliessen);
    requestAnimationFrame(() => b.classList.add("da"));
    const hinweis = q(".schluepf-hinweis");

    // Toni hilft mit Antippen, sonst geht es von selbst weiter
    let weiter = null;
    const eiEl = q(".schluepf-ei");
    function knack(vonToni) {
      if (riss >= 6 || ende) return;
      riss++;
      klopfTon();
      if (riss % 2 === 0) piepTon(riss > 3);
      malEi();
      eiEl.classList.remove("knack"); void eiEl.offsetWidth; eiEl.classList.add("knack");
      // Schalensplitter
      const r = eiEl.getBoundingClientRect();
      for (let k = 0; k < 3; k++) {
        const sp = el("span", "schluepf-splitter");
        sp.style.left = r.left + r.width * (0.3 + Math.random() * 0.4) + "px"; sp.style.top = r.top + r.height * 0.4 + "px";
        effektEbene.appendChild(sp);
        const dx = (Math.random() - 0.5) * 80;
        sp.animate([{ transform: "translate(-50%,-50%) rotate(0)", opacity: 1 }, { transform: "translate(calc(-50% + " + f1(dx) + "px), -40px) rotate(" + Math.round(dx * 6) + "deg)", opacity: 1, offset: 0.4 },
          { transform: "translate(calc(-50% + " + f1(dx * 1.4) + "px), 30px) rotate(" + Math.round(dx * 9) + "deg)", opacity: 0 }], { duration: 900, easing: "ease-out", fill: "forwards" }).onfinish = () => sp.remove();
      }
      if (vonToni && riss === 1) hinweis.textContent = "Weiter so, ganz sanft 🥚";
      if (riss >= 6 && weiter) { const w = weiter; weiter = null; w(); }
    }
    eiEl.addEventListener("click", () => { if (eiEl.classList.contains("bereit")) knack(true); });
    eiEl.addEventListener("keydown", (e) => { if ((e.key === "Enter" || e.key === " ") && eiEl.classList.contains("bereit")) { e.preventDefault(); knack(true); } });

    (async () => {
      await warte(700);
      b.classList.add("eltern-da");
      await warte(1700);
      await sag("w", nochmal ? "Weißt du noch, Toni? So war es an deinem Geburtstag 🥹" : "Toni, schnell! Das Ei wackelt ganz doll 🥚", 3200);
      await sag("m", "Ich glaub, es geht los! 🥹", 2600);
      eiEl.classList.add("bereit");
      hinweis.textContent = "Tipp ganz sanft auf das Ei 🥚"; hinweis.hidden = false;
      // ohne Tippen knackt es alle 3 Sekunden von selbst
      const selbst = setInterval(() => { if (ende) { clearInterval(selbst); return; } knack(false); }, 3000);
      timer.push(selbst);
      await new Promise((r) => { weiter = r; });
      clearInterval(selbst);
      eiEl.classList.remove("bereit");
      hinweis.hidden = true;
      await warte(500);
      // Schlüpfen: Deckel fliegt weg, Küken hüpft heraus
      q(".ei-deckel").innerHTML = eiBild(4); q(".ei-boden").innerHTML = eiBild(4);
      b.classList.add("geschluepft");
      piepTon(true); setTimeout(() => piepTon(false), 160); setTimeout(() => piepTon(true), 320);
      if (!nochmal) { const s = lies(); s.geschluepft = true; schreib(s); }
      const r = eiEl.getBoundingClientRect();
      konfetti(r.left + r.width / 2, r.top + r.height * 0.3);
      await warte(1500);
      await sag("k", "Piep! Happy Birthday, Toni! 🎂", 3400);
      await sag("w", "Toni, das ist unser Baby 🥹", 2800);
      const n = warmTage().length;
      await sag("m", n >= 5 ? "Du hast es jeden Tag gewärmt. Danke, Toni ♥️" : n >= 1 ? "Danke, dass du es so lieb gewärmt hast, Toni ♥️" : "Danke, Toni ♥️ Jetzt sind wir zu dritt", 3400);
      if (!name && !nochmal) {
        await sag("w", "Wie soll es denn heißen, Toni? 🥺", 2600);
        if (ende) return;
        name = await new Promise((fertig) => oeffneName(fertig));
        if (!name) { name = "Krümel"; const s = lies(); s.name = name; schreib(s); }
        await warte(400);
        await sag("w", name + "! Was für ein schöner Name 🥰", 3000);
      } else if (name) await sag("w", "Darf ich vorstellen: " + name + " 🐣", 3000);
      q(".schluepf-kueken").classList.add("hopst");
      await sag("k", "Piep piep! Ich hab dich lieb, Toni ♥️", 3000);
      if (ende) return;
      const raumR = raum.getBoundingClientRect();
      for (let k = 0; k < 3; k++) spaeter(k * 350, () => herzen(raumR.left + raumR.width * (0.25 + k * 0.25), raumR.top + raumR.height * 0.4, 10));
      const endeEl = q(".schluepf-ende");
      endeEl.innerHTML = "<p>" + (name || "Das Küken") + " wohnt jetzt bei den Munkelvögeln und fliegt ab und zu mit 🐣</p>";
      const los = el("button", "nest-fertig", nochmal ? "Schließen" : "Zum Kalender ♥️");
      los.type = "button";
      los.addEventListener("click", schliessen);
      endeEl.appendChild(los);
      endeEl.hidden = false;
    })();
  }
  function konfetti(x, y) {
    const farben = ["#ff7aa2", "#f3c84b", "#7cc4f0", "#9be3a8", "#c9a0ff"];
    for (let k = 0; k < 34; k++) {
      const c = el("span", "schluepf-konfetti");
      c.style.left = x + "px"; c.style.top = y + "px"; c.style.background = farben[k % farben.length];
      effektEbene.appendChild(c);
      const w = (k / 34) * Math.PI * 2, r = 80 + Math.random() * 90;
      c.animate([{ transform: "translate(-50%,-50%) rotate(0)", opacity: 1 }, { transform: "translate(calc(-50% + " + f1(Math.cos(w) * r) + "px), calc(-50% + " + f1(Math.sin(w) * r * 0.7 - 40) + "px)) rotate(" + Math.round(Math.random() * 540) + "deg)", opacity: 1, offset: 0.5 },
        { transform: "translate(calc(-50% + " + f1(Math.cos(w) * r * 1.2) + "px), calc(-50% + " + f1(Math.sin(w) * r * 0.7 + 90) + "px)) rotate(" + Math.round(Math.random() * 900) + "deg)", opacity: 0 }], { duration: 1800 + Math.random() * 700, easing: "cubic-bezier(.2,.7,.4,1)", fill: "forwards" }).onfinish = () => c.remove();
    }
  }
  // am Geburtstag einmal von selbst, sobald im Kalender alles ruhig ist (offene Karten haben Vorrang)
  let ruhigSeit = 0, wartetSeit = 0;
  setInterval(() => {
    if (geschluepft() || buehne || !geburtstag() || !intro.hidden || reise() || document.hidden) { ruhigSeit = 0; return; }
    const unruhig = document.querySelector("dialog[open], .special-buehne, .aufbau-buehne, .munkel-buehne, .mistel-ebene, .wz-fenster-huelle, #finale:not([hidden])");
    if (unruhig) { ruhigSeit = 0; return; }
    const jetzt = performance.now();
    ruhigSeit = ruhigSeit || jetzt;
    wartetSeit = wartetSeit || jetzt;
    // lieber warten, bis beide Munkelvögel gelandet sind und Hallo gesagt haben (höchstens 30 Sekunden)
    const voegelDa = ak.voegel && ak.voegel.istDa && ak.voegel.istDa();
    if (jetzt - ruhigSeit < 3500 || (!voegelDa && jetzt - wartetSeit < 30000)) return;
    schluepfen(false);
  }, 500);

  window.adventkalender.ei = {
    brauchtNest: () => !!eiTag(),
    // kurz vor Mitternacht klopft es im Ei
    klopf: () => {
      if (!zeigeEi()) return;
      klopfTon(); setTimeout(klopfTon, 180); setTimeout(() => piepTon(true), 420);
      nestKlasse("ei-freut", 900);
      const r = knopf.getBoundingClientRect();
      if (r.width) { piepWort(r.left + r.width / 2, r.top); herzen(r.left + r.width / 2, r.top + 10, 4); }
    },
    imNestSichtbar: () => zeigeEi(),
    geschluepft,
    name: () => lies().name || "",
    oeffnen: () => oeffneEi(),
    schluepfen,
  };
})();
