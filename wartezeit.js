/* =========================================================
   Wartezeit bis zum Geburtstag (13.11. ab 6 Uhr bis 25.11.)
   Kleine Dinge zum Entdecken auf dem Briefumschlag-Bildschirm.

   Jeden Tag:  Wachssiegel stempeln, Abreißkalender mit Kranich,
               Zauberspiegel, kitzelige Ziffern, nachts Schlafmützen
   Nur an bestimmten Tagen (siehe PLAN): Briefmarke, roter Knopf,
               Schütteln, Adressfeld, Gegen das Licht, Sternbild,
               Papierflieger, Kaffeetasse, beschlagene Scheibe,
               Zahlenschloss mit Belohnung
   ========================================================= */
(function () {
  "use strict";
  const ak = window.adventkalender;
  const intro = document.getElementById("intro");
  const umschlag = document.getElementById("umschlag");
  const siegel = umschlag && umschlag.querySelector(".siegel");
  const nameEl = umschlag && umschlag.querySelector(".umschlag-name");
  const cdZiffern = document.getElementById("countdown-ziffern");
  const hinweis = document.getElementById("intro-hinweis");
  if (!ak || !ak.intro || !intro || !umschlag || !siegel || !cdZiffern) return;
  const ruhig = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Hilfen ---------- */
  const SPEICHER = "toni-wz-";
  const lies = (k, s) => { try { const v = localStorage.getItem(SPEICHER + k); return v === null ? s : JSON.parse(v); } catch (_) { return s; } };
  const schreib = (k, v) => { try { localStorage.setItem(SPEICHER + k, JSON.stringify(v)); } catch (_) { /* egal */ } };
  const merkeTag = (k, t) => { const l = lies(k, []); if (!l.includes(t)) { l.push(t); schreib(k, l); } };
  const hatTag = (k, t) => lies(k, []).includes(t);
  const zufall = (a, b) => a + Math.random() * (b - a);
  const wahl = (l) => l[Math.floor(Math.random() * l.length)];
  const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html !== undefined) e.innerHTML = html; return e; };
  const szeneLaeuft = () => !!document.querySelector(".special-buehne");
  const vogelRedet = () => [...document.querySelectorAll(".vogel-blase")].some((b) => !b.hidden);
  const NAMEN = ["mein Schatz", "Maus", "Toni", "Baby"];
  const melde = (id) => { if (ak.entdeckt) ak.entdeckt(id); };

  const datum = () => ak.intro.datum();
  // Welcher Tag (13 bis 25) ist gerade dran? 0 = keiner
  function heute() {
    if (!ak.intro.bereit() || ak.intro.phase() !== "warten") return 0;
    const d = datum();
    if (d.jahr !== KALENDER.jahr || d.monat !== 11 || d.tag < 13 || d.tag > 25) return 0;
    if (d.tag === 13 && d.stunde < 6) return 0;
    return d.tag;
  }
  const stunde = () => datum().stunde;
  const FENSTER = {
    ganz: () => true,
    mittag: () => stunde() >= 14 && stunde() < 18,
    abend: () => stunde() >= 17 && stunde() < 23,
  };
  const istNacht = () => stunde() >= 23 || stunde() < 5;

  // Wann gibt es was? (mittags 14 bis 18 Uhr, abends 17 bis 23 Uhr)
  const PLAN = {
    13: { ganz: ["marke"], abend: ["scheibe"] },
    14: { ganz: ["knopf"], abend: ["adresse"] },
    15: { mittag: ["schuetteln"], abend: ["licht"] },
    16: { mittag: ["tasse"], abend: ["sternbild"] },
    17: { mittag: ["flieger"], abend: ["adresse"] },
    18: { ganz: ["marke"], abend: ["licht"] },
    19: { mittag: ["tasse"], abend: ["scheibe"] },
    20: { ganz: ["knopf"], abend: ["licht"] },
    21: { mittag: ["schuetteln"], abend: ["scheibe"] },
    22: { ganz: ["schloss"], abend: ["sternbild"] },
    23: { ganz: ["schloss"], mittag: ["tasse"], abend: ["licht"] },
    24: { ganz: ["marke", "schloss"], abend: ["adresse"] },
    25: { ganz: ["schloss"], mittag: ["flieger"], abend: ["licht"] },
  };
  function istAn(name) {
    const t = heute();
    const p = PLAN[t];
    if (!p) return false;
    return Object.keys(p).some((f) => p[f].includes(name) && FENSTER[f]());
  }
  // kommt das heute noch (später)?
  function kommtNoch(name) {
    const p = PLAN[heute()];
    if (!p) return null;
    const h = stunde();
    if (p.mittag && p.mittag.includes(name) && h < 14) return "mittag";
    if (p.abend && p.abend.includes(name) && h < 17) return "abend";
    return null;
  }

  /* ---------- Ebenen ---------- */
  const ebene = el("div", "wz-ebene");
  intro.appendChild(ebene);
  // Fensterbank unten: der Himmel ist der Blick aus dem Fenster, die Dinge stehen darauf
  // darunter ein Schränkchen mit zwei Schubladen, in denen die Dinge liegen
  const STIFTE = '<svg class="wz-deko wz-stifte" viewBox="0 0 70 26" aria-hidden="true">' +
    '<g transform="rotate(-8 35 13)"><rect x="4" y="5" width="52" height="5" rx="1" fill="#e85d7e"/><path d="M56 5l9 2.5-9 2.5z" fill="#f2d2b0"/><path d="M62 6.6l3 .9-3 .9z" fill="#3a2a2a"/><rect x="4" y="5" width="4" height="5" fill="#d4a84b"/></g>' +
    '<g transform="rotate(4 35 13)"><rect x="8" y="15" width="50" height="5" rx="1" fill="#7cc4f0"/><path d="M58 15l9 2.5-9 2.5z" fill="#f2d2b0"/><path d="M64 16.6l3 .9-3 .9z" fill="#3a2a2a"/><rect x="8" y="15" width="4" height="5" fill="#d4a84b"/></g></svg>';
  const UMSCHLAEGE = '<svg class="wz-deko wz-umschlaege" viewBox="0 0 56 40" aria-hidden="true">' +
    '<g transform="rotate(-10 28 20)"><rect x="6" y="8" width="44" height="28" rx="2" fill="#fdf3e7" stroke="#e6d3bf"/><path d="M6 8l22 15 22-15" fill="none" stroke="#e6d3bf"/></g>' +
    '<g transform="rotate(6 28 20)"><rect x="4" y="4" width="44" height="28" rx="2" fill="#fde2e8" stroke="#f2bccb"/><path d="M4 4l22 15 22-15" fill="none" stroke="#f2bccb"/><path d="M26 17c-1.5-1.1-2.8-2.2-2.8-3.3 0-.8.6-1.4 1.4-1.4.6 0 1.1.3 1.4.8.3-.5.8-.8 1.4-.8.8 0 1.4.6 1.4 1.4 0 1.1-1.3 2.2-2.8 3.3z" fill="#e85d7e"/></g></svg>';
  // Lippenstift zum Auf und Zudrehen: bei jedem Ausfahren eine neue Farbe
  const LIPPENFARBEN = [
    ["#b0102c", "Klassisch Rot"], ["#d6304f", "Erdbeerrot"], ["#e0115f", "Kirschrot"], ["#ff2e4c", "Korallenrot"], ["#a0153e", "Bordeaux"],
    ["#c2185b", "Himbeere"], ["#c71585", "Fuchsia"], ["#ff4d7d", "Pink"], ["#e85d7e", "Rosé"], ["#ff6f91", "Flamingo"], ["#f7809b", "Zartrosa"],
  ];
  const LIPPENSTIFT_SVG = '<svg viewBox="0 0 46 18" aria-hidden="true"><defs><clipPath id="wzLsClip"><rect x="27" y="0" width="20" height="18"/></clipPath></defs>' +
    '<g transform="rotate(-14 23 9)">' +
    '<g clip-path="url(#wzLsClip)"><path class="wz-ls-mine" d="M24 5.2h9.5l4.5 3.8-4.5 3.8H24z" fill="var(--ls, #c2185b)"/><path class="wz-ls-mine" d="M25 6.4h8" stroke="#fff" stroke-width=".9" opacity=".35"/></g>' +
    '<rect x="2" y="4" width="20" height="10" rx="1.6" fill="#2b2b33"/><rect x="4" y="5" width="16" height="1.6" fill="#fff" opacity=".22"/>' +
    '<rect x="21.5" y="4.6" width="6" height="8.8" fill="#d4a84b"/><rect x="21.5" y="4.6" width="6" height="1.6" fill="#f6dc96"/>' +
    '<g class="wz-ls-kappe"><rect x="20.5" y="3.4" width="21" height="11.2" rx="2.2" fill="#2b2b33"/><rect x="20.5" y="3.4" width="3" height="11.2" fill="#d4a84b"/><rect x="25" y="4.6" width="14" height="1.6" fill="#fff" opacity=".2"/></g>' +
    "</g></svg>";
  const SPANGE = '<svg class="wz-deko wz-spange" viewBox="0 0 34 16" aria-hidden="true"><g transform="rotate(10 17 8)">' +
    '<rect x="3" y="5" width="28" height="6" rx="3" fill="#f3c84b"/><circle cx="9" cy="8" r="2" fill="#fff" opacity=".8"/><circle cx="17" cy="8" r="2" fill="#fff" opacity=".8"/><circle cx="25" cy="8" r="2" fill="#fff" opacity=".8"/></g></svg>';
  const moebel = el("div", "wz-moebel",
    '<div class="wz-bank"><span class="wz-bank-oben"></span><span class="wz-bank-vorne"></span><div class="wz-auf-bank"></div></div>' +
    '<div class="wz-schrank">' +
    ['links', 'rechts'].map((seite) => '<div class="wz-schublade" data-seite="' + seite + '"><div class="wz-lade-innen"><div class="wz-lade-boden"></div></div>' +
      '<button type="button" class="wz-lade-front" aria-label="Schublade ' + seite + ' öffnen"><span class="wz-griff"></span></button></div>').join("") +
    "</div>");
  ebene.appendChild(moebel);
  const fachL = moebel.querySelector('[data-seite="links"] .wz-lade-boden');
  const fachR = moebel.querySelector('[data-seite="rechts"] .wz-lade-boden');
  const fachM = moebel.querySelector(".wz-auf-bank");
  fachL.insertAdjacentHTML("beforeend", UMSCHLAEGE + STIFTE);
  const lippenstift = el("button", "wz-lippenstift", LIPPENSTIFT_SVG);
  lippenstift.type = "button";
  lippenstift.setAttribute("aria-label", "Lippenstift");
  let lippenFarbe = Math.floor(Math.random() * LIPPENFARBEN.length);
  lippenstift.style.setProperty("--ls", LIPPENFARBEN[lippenFarbe][0]);
  lippenstift.addEventListener("click", () => {
    const zu = !lippenstift.classList.contains("zu");
    if (!zu) {
      // beim Ausfahren eine andere Farbe als zuletzt
      let n = lippenFarbe;
      while (n === lippenFarbe) n = Math.floor(Math.random() * LIPPENFARBEN.length);
      lippenFarbe = n;
      lippenstift.style.setProperty("--ls", LIPPENFARBEN[n][0]);
      setTimeout(() => blase(lippenstift, "💄 " + LIPPENFARBEN[n][1], 1500), 700);
    }
    if (zu && lippenstift._wzBlase) lippenstift._wzBlase.remove();
    lippenstift.classList.toggle("zu", zu);
    plopp(!zu);
  });
  fachR.appendChild(lippenstift);
  fachR.insertAdjacentHTML("beforeend", SPANGE);
  function schublade(seite, auf) {
    moebel.querySelectorAll(".wz-schublade").forEach((s) => {
      const soll = s.dataset.seite === seite ? (auf === undefined ? !s.classList.contains("offen") : auf) : false;
      if (soll !== s.classList.contains("offen")) {
        s.classList.toggle("offen", soll);
        s.querySelector(".wz-lade-front").setAttribute("aria-label", "Schublade " + s.dataset.seite + (soll ? " schließen" : " öffnen"));
        if (soll) plopp(false);
      }
    });
  }
  moebel.querySelectorAll(".wz-lade-front").forEach((f) => f.addEventListener("click", () => schublade(f.parentNode.dataset.seite)));
  // Dinge, die mit dem schwebenden Umschlag mitschweben
  const aufUmschlag = el("div", "wz-auf-umschlag");
  umschlag.appendChild(aufUmschlag);

  // Kurze Sprechblase an einem Element
  function blase(ziel, text, ms, oben) {
    const r = ziel.getBoundingClientRect();
    if (ziel._wzBlase) ziel._wzBlase.remove();
    const b = el("div", "wz-sprech", text);
    ziel._wzBlase = b;
    ebene.appendChild(b);
    const bw = b.offsetWidth;
    b.style.left = Math.max(8, Math.min(window.innerWidth - bw - 8, r.left + r.width / 2 - bw / 2)) + "px";
    const y = oben === false ? r.bottom + 10 : r.top - b.offsetHeight - 10;
    b.style.top = Math.max(8, y) + "px";
    setTimeout(() => { b.classList.add("weg"); setTimeout(() => b.remove(), 400); }, ms || 2600);
    return b;
  }
  // Ein Fenster in der Mitte (Karte, Spiegel, Schloss, Gutschein)
  let offenesFenster = null;
  function fenster(cls, html, beimSchliessen) {
    schliesseFenster();
    const huelle = el("div", "wz-fenster-huelle");
    const karte = el("div", "wz-fenster " + (cls || ""), html);
    const zu = el("button", "wz-zu", "✕");
    zu.type = "button";
    zu.setAttribute("aria-label", "Schließen");
    karte.appendChild(zu);
    huelle.appendChild(karte);
    ebene.appendChild(huelle);
    const f = { huelle, karte, zu: () => schliesseFenster(), beimSchliessen };
    zu.addEventListener("click", (e) => { e.stopPropagation(); schliesseFenster(); });
    huelle.addEventListener("click", (e) => { if (e.target === huelle) schliesseFenster(); });
    offenesFenster = f;
    requestAnimationFrame(() => huelle.classList.add("da"));
    return f;
  }
  function schliesseFenster() {
    const f = offenesFenster;
    if (!f) return;
    offenesFenster = null;
    f.huelle.classList.remove("da");
    f.huelle.classList.add("geht");
    setTimeout(() => f.huelle.remove(), 350);
    if (f.beimSchliessen) f.beimSchliessen();
  }

  // Den nächsten Klick auf den Umschlag schlucken (nach langem Drücken oder Wischen)
  let schluckeKlickBis = 0;
  intro.addEventListener("click", (e) => {
    if (performance.now() < schluckeKlickBis && umschlag.contains(e.target)) { e.stopPropagation(); e.preventDefault(); }
  }, true);
  const schluckeKlick = () => { schluckeKlickBis = performance.now() + 700; };

  // Langes Drücken an einem Element
  function langDruck(ziel, ms, start, fertig, abbruch, filter) {
    let t = null, x0 = 0, y0 = 0, aktiv = false;
    ziel.addEventListener("pointerdown", (e) => {
      if (filter && !filter(e)) return;
      x0 = e.clientX; y0 = e.clientY; aktiv = true;
      if (start) start(e);
      t = setTimeout(() => { t = null; aktiv = false; schluckeKlick(); fertig(e); }, ms);
    });
    const halt = () => { if (t) { clearTimeout(t); t = null; } if (aktiv) { aktiv = false; if (abbruch) abbruch(); } };
    ziel.addEventListener("pointermove", (e) => { if (t && Math.hypot(e.clientX - x0, e.clientY - y0) > 12) halt(); });
    ["pointerup", "pointercancel", "pointerleave"].forEach((n) => ziel.addEventListener(n, halt));
    ziel.addEventListener("contextmenu", (e) => { if (aktiv || t) e.preventDefault(); });
  }

  /* ---------- Töne (nur wenn das Handy nicht stumm ist) ---------- */
  let audio = null;
  function ctx() {
    try {
      audio = audio || new (window.AudioContext || window.webkitAudioContext)();
      if (audio.state === "suspended") audio.resume();
      return audio;
    } catch (_) { return null; }
  }
  function hupe(wann) {
    const a = ctx(); if (!a) return;
    const t = a.currentTime + (wann || 0);
    [415, 523].forEach((f) => {
      const o = a.createOscillator(), g = a.createGain(), lp = a.createBiquadFilter();
      o.type = "square"; o.frequency.value = f; lp.type = "lowpass"; lp.frequency.value = 1800;
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.09, t + 0.02);
      g.gain.setValueAtTime(0.09, t + 0.28); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.34);
      o.connect(lp).connect(g).connect(a.destination); o.start(t); o.stop(t + 0.36);
    });
  }
  function motor(dauer, losfahren) {
    const a = ctx(); if (!a) return;
    const t = a.currentTime;
    const o = a.createOscillator(), o2 = a.createOscillator(), g = a.createGain(), lp = a.createBiquadFilter();
    o.type = "sawtooth"; o2.type = "square"; lp.type = "lowpass"; lp.frequency.value = 260;
    o.frequency.setValueAtTime(38, t); o.frequency.linearRampToValueAtTime(70, t + 0.5); o.frequency.linearRampToValueAtTime(46, t + 1.2);
    if (losfahren) { o.frequency.setValueAtTime(46, t + dauer - 1.6); o.frequency.exponentialRampToValueAtTime(130, t + dauer); }
    o2.frequency.value = 23;
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.12, t + 0.15);
    g.gain.setValueAtTime(0.12, t + dauer - 0.4); g.gain.exponentialRampToValueAtTime(0.0001, t + dauer);
    o.connect(lp); o2.connect(lp); lp.connect(g).connect(a.destination);
    o.start(t); o2.start(t); o.stop(t + dauer + 0.05); o2.stop(t + dauer + 0.05);
  }
  function plopp(hoch) {
    const a = ctx(); if (!a) return;
    const t = a.currentTime, o = a.createOscillator(), g = a.createGain();
    o.type = "sine"; o.frequency.setValueAtTime(hoch ? 700 : 300, t); o.frequency.exponentialRampToValueAtTime(hoch ? 1200 : 120, t + 0.12);
    g.gain.setValueAtTime(0.08, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
    o.connect(g).connect(a.destination); o.start(t); o.stop(t + 0.18);
  }

  /* =========================================================
     1. Wachssiegel stempeln (jeden Tag ein Motiv)
     ========================================================= */
  const STEMPEL = {
    13: ["📸", 13, 20, -12], 14: ["🚂", 86, 40, 9], 15: ["🎈", 29, 36, -4], 16: ["🎉", 12, 68, 14], 17: ["🍷", 71, 31, -9],
    18: ["♨️", 87, 76, 6], 19: ["🛷", 25, 58, -15], 20: ["🍵", 76, 58, 11], 21: ["🎆", 40, 15, -6], 22: ["❄️", 13, 88, 8],
    23: ["🎶", 61, 14, 12], 24: ["🍪", 85, 92, -10], 25: ["🎂", 50, 33, 0],
  };
  function stempelHtml(t) {
    const s = STEMPEL[t];
    return '<span class="wz-stempel-motiv">' + s[0] + '</span><span class="wz-stempel-datum">' + t + ".11.</span>";
  }
  function setzeStempel(t, neu) {
    const s = STEMPEL[t];
    if (!s || aufUmschlag.querySelector('[data-stempel="' + t + '"]')) return null;
    const st = el("div", "wz-stempel" + (neu ? " neu" : ""), stempelHtml(t));
    st.dataset.stempel = t;
    st.style.left = s[1] + "%"; st.style.top = s[2] + "%";
    st.style.setProperty("--dreh", s[3] + "deg");
    aufUmschlag.appendChild(st);
    return st;
  }
  lies("stempel", []).forEach((t) => setzeStempel(t, false));

  langDruck(siegel, 900,
    () => { if (heute()) siegel.classList.add("wz-gluehen"); },
    () => stempeln(),
    () => siegel.classList.remove("wz-gluehen"));
  function stempeln() {
      siegel.classList.remove("wz-gluehen");
      const t = heute();
      if (!t) return;
      melde("stempel");
      if (hatTag("stempel", t)) { blase(siegel, "Heute hast du schon gestempelt ♥️ Morgen gibt es ein neues Motiv", 2800); return; }
      merkeTag("stempel", t);
      const st = setzeStempel(t, true);
      plopp(false);
      if (navigator.vibrate) try { navigator.vibrate(30); } catch (_) { /* egal */ }
      if (st) setTimeout(() => st.classList.remove("neu"), 1200);
      const n = lies("stempel", []).length;
      setTimeout(() => blase(siegel, t === 25 ? "Dein Umschlag ist voll gestempelt. Morgen ist es so weit ♥️" : (n === 1 ? "Dein erster Stempel! Jeden Tag kommt ein neuer dazu ♥️" : n + " Stempel. Der Umschlag füllt sich ♥️"), 2800), 700);
  }

  // Tipp auf den verschlossenen Umschlag: kleiner Hinweis aufs Siegel
  umschlag.addEventListener("click", () => {
    const t = heute();
    if (!t || hatTag("stempel", t) || !hinweis) return;
    const alt = hinweis.textContent;
    if (alt.indexOf("Siegel") >= 0) return;
    hinweis.textContent = "Psst … halt das Siegel mal ganz lange gedrückt ♥️";
    setTimeout(() => { if (hinweis.textContent.indexOf("Siegel mal") >= 0) hinweis.textContent = alt; }, 4200);
  });

  /* =========================================================
     2. Abreißkalender mit Capy Fakten, Blatt zum Kranich falten
     ========================================================= */
  const FAKTEN = {
    13: "Capybaras sind die größten Nagetiere der Welt. Ein ausgewachsenes Capy wiegt bis zu 65 Kilo.",
    14: "Capys können bis zu fünf Minuten lang tauchen. Zwischen ihren Zehen haben sie kleine Schwimmhäute.",
    15: "Augen, Ohren und Nase sitzen ganz oben am Kopf. So können Capys fast ganz untergetaucht schauen und atmen.",
    16: "Andere Tiere setzen sich gern auf Capybaras, zum Beispiel Vögel, Affen und sogar Schildkröten. Capys stört das kein bisschen.",
    17: "Ein Capy frisst bis zu drei Kilo Gras am Tag. Ein Nachtisch geht trotzdem immer.",
    18: "In Japan baden Capybaras im Winter in heißen Quellen. Oft schwimmen dabei Yuzu Früchte mit im Wasser.",
    19: "Capys können erstaunlich schnell rennen: bis zu 35 Kilometer pro Stunde.",
    20: "Die Zähne eines Capys wachsen ein Leben lang nach. Darum knabbern sie ständig an irgendwas.",
    21: "Capybaras leben in Gruppen von etwa zehn bis zwanzig Tieren und kuscheln gern eng zusammen.",
    22: "Wenn Capys sich wohlfühlen, machen sie leise schnurrende und pfeifende Geräusche.",
    23: "Capys dösen gern mehrmals am Tag. Ein richtiges Mittagsschläfchen ist ihnen heilig.",
    24: "Der Name Capybara kommt aus der Tupi Sprache in Südamerika und bedeutet ungefähr Grasfresser.",
    25: "Capybaras gelten als die entspanntesten Tiere der Welt. Nur vor Geburtstagen sind sie ein kleines bisschen aufgeregt.",
  };
  const WUNSCH = "Ich wünsche mir nur dich ♥️ Mehr brauche ich nicht!";
  const KRANICH_SVG = '<svg viewBox="0 0 100 70" aria-hidden="true"><path d="M50 40 8 18l30 26z" fill="#f2a7ba"/><path d="M50 40 92 18 62 44z" fill="#e98aa2"/><path d="M38 44 50 40 62 44 50 58z" fill="#fff4f6"/><path d="M50 58 30 52 4 56l20-8z" fill="#fde2e8"/><path d="M62 44 80 30l4-10 4 6-6 2-14 22z" fill="#fde2e8"/></svg>';
  const kalender = el("button", "wz-kalender");
  kalender.type = "button";
  kalender.setAttribute("aria-label", "Abreißkalender");
  fachL.prepend(kalender);
  function zeichneKalender() {
    const t = heute();
    const abgerissen = hatTag("blatt", t);
    const zeigeTag = abgerissen ? Math.min(t + 1, 26) : t;
    const k = lies("kranich", []).length;
    kalender.innerHTML = '<span class="wz-kal-ringe"></span><span class="wz-kal-blatt' + (abgerissen ? " morgen" : "") + '"><small>Nov</small><b>' + zeigeTag + "</b>" +
      "</span>" +
      (k ? '<span class="wz-kal-kraniche">' + KRANICH_SVG + k + "</span>" : "");
    kalender.classList.toggle("frisch", !abgerissen);
  }
  function abreissen() {
    const t = heute();
    if (!t) return;
    if (hatTag("blatt", t)) { zeigeFakt(t); return; }
    const blatt = kalender.querySelector(".wz-kal-blatt");
    const r = blatt.getBoundingClientRect();
    const flug = blatt.cloneNode(true);
    flug.classList.add("wz-kal-flug");
    Object.assign(flug.style, { left: r.left + "px", top: r.top + "px", width: r.width + "px", height: r.height + "px" });
    ebene.appendChild(flug);
    merkeTag("blatt", t);
    zeichneKalender();
    plopp(true);
    flug.animate([
      { transform: "translate(0,0) rotate(0)", opacity: 1 },
      { transform: "translate(" + zufall(30, 70) + "px,-60px) rotate(" + zufall(25, 50) + "deg)", opacity: 1, offset: 0.4 },
      { transform: "translate(" + zufall(90, 160) + "px," + zufall(-10, 40) + "px) rotate(" + zufall(140, 220) + "deg)", opacity: 0 },
    ], { duration: ruhig ? 300 : 1100, easing: "ease-out", fill: "forwards" }).onfinish = () => flug.remove();
    setTimeout(() => zeigeFakt(t), ruhig ? 200 : 650);
  }
  function zeigeFakt(t) {
    melde("kalender");
    const gefaltet = hatTag("kranich", t);
    const legende = lies("kranich", []).length === 0 && !gefaltet;
    const f = fenster("wz-fakt",
      '<p class="wz-fakt-kopf">Capy Fakt zum ' + t + ". November</p>" +
      '<p class="wz-fakt-text">' + FAKTEN[t] + "</p>" +
      (gefaltet ? '<p class="wz-fakt-fuss">Aus diesem Blatt hast du schon einen Kranich gefaltet ♥️</p>'
        : '<p class="wz-fakt-fuss">' + (legende ? "In Japan sagt man: Wer Kraniche faltet, dem wird ein Wunsch erfüllt. " : "") + "Tipp doppelt auf das Blatt, dann faltet es sich ✨</p>"));
    if (gefaltet) return;
    let letzter = 0;
    const falten = () => {
      if (f !== offenesFenster || f.karte.classList.contains("faltet")) return;
      merkeTag("kranich", t);
      melde("kranich");
      f.karte.classList.add("faltet");
      const r = f.karte.getBoundingClientRect();
      const kr = el("div", "wz-kranich", KRANICH_SVG);
      kr.style.left = r.left + r.width / 2 - 45 + "px";
      kr.style.top = r.top + r.height / 2 - 32 + "px";
      ebene.appendChild(kr);
      setTimeout(() => { f.zu(); zeichneKalender(); }, ruhig ? 50 : 700);
      const zielX = zufall(-120, 120), dauer = ruhig ? 400 : 3200;
      kr.animate([
        { transform: "scale(.2) rotate(-20deg)", opacity: 0 },
        { transform: "scale(1) rotate(0)", opacity: 1, offset: 0.2 },
        { transform: "translate(" + zielX * 0.4 + "px,-60px) rotate(-6deg)", offset: 0.45 },
        { transform: "translate(" + zielX + "px," + (-window.innerHeight) + "px) rotate(8deg) scale(.6)", opacity: 0.9 },
      ], { duration: dauer, easing: "ease-in", fill: "forwards" }).onfinish = () => {
        kr.remove();
        if (t === 25) bringeWunsch();
      };
    };
    f.karte.addEventListener("dblclick", falten);
    f.karte.addEventListener("pointerup", (e) => {
      if (e.pointerType === "mouse") return;
      const j = performance.now();
      if (j - letzter < 380) falten();
      letzter = j;
    });
  }
  function bringeWunsch() {
    const kr = el("div", "wz-kranich", KRANICH_SVG);
    kr.style.left = window.innerWidth / 2 - 45 + "px";
    kr.style.top = "-80px";
    ebene.appendChild(kr);
    kr.animate([
      { transform: "translate(0,0) rotate(10deg)" },
      { transform: "translate(0," + (window.innerHeight * 0.36) + "px) rotate(-4deg)" },
    ], { duration: ruhig ? 300 : 2600, easing: "ease-out", fill: "forwards" }).onfinish = () => {
      kr.remove();
      fenster("wz-wunsch", '<div class="wz-wunsch-kranich">' + KRANICH_SVG + '</div><p class="wz-fakt-kopf">Der Kranich bringt dir einen Wunsch</p><p class="wz-wunsch-text">' + WUNSCH + '</p><p class="wz-fakt-fuss">Dein Chris</p>');
    };
  }
  kalender.addEventListener("click", abreissen);
  // Blatt nach unten ziehen geht auch
  let zugY = null;
  kalender.addEventListener("pointerdown", (e) => { zugY = e.clientY; });
  kalender.addEventListener("pointermove", (e) => {
    if (zugY !== null && e.clientY - zugY > 26) { zugY = null; if (!hatTag("blatt", heute())) abreissen(); }
  });
  kalender.addEventListener("pointerup", () => { zugY = null; });

  /* =========================================================
     3. Zauberspiegel (4 Komplimente pro Tag)
     ========================================================= */
  const SPRUECHE = [
    "Du, Toni. Und das war noch nie eine knappe Entscheidung.",
    "Das bist du, Toni. Deine Augen haben dieses warme Leuchten, in dem man sich sofort verlieren kann.",
    "Ganz klar du. Dein Lächeln ist das Schönste, was ich je spiegeln durfte.",
    "Die Schönste bist du. Deine Haare fallen so weich über deine Schultern, das kann kein Friseur nachmachen.",
    "Du, Toni. Du hast ein wunderschönes Gesicht, klar, sanft und unglaublich hübsch.",
    "Natürlich du. Deine Figur ist traumhaft, und egal was du trägst, es steht dir.",
    "Das bist du. Wenn du lachst, bekommst du dieses Funkeln in den Augen, das ist pure Magie.",
    "Du, Toni. Vor allem, wenn deine Wangen so süß rosa werden, weil du dich freust.",
    "Ganz ehrlich? Du. Ganz ohne Filter und ganz ohne Mühe.",
    "Die Schönste im ganzen Land bist du. Und deine Frisur sitzt heute wieder perfekt.",
    "Du, Toni. Deine Ausstrahlung macht einen ganzen Raum heller.",
    "Das bist du. Mit dem schönsten Lächeln der Welt.",
    "Du, Toni. Sogar morgens, verschlafen und mit zerzausten Haaren.",
    "Keine Frage, du. Deine Haut strahlt so zart und frisch, als hättest du immer Urlaub.",
    "Du bist es, Toni. Bis in die Fingerspitzen, sogar deine Nägel sehen immer perfekt aus.",
    "Die Schönste bist du. Mit zusammengebundenen Haaren sieht man erst richtig, wie schön dein Gesicht ist.",
    "Du, Toni. Und mit offenen Haaren siehst du aus wie aus einem Film.",
    "Das bist du. Deine Augen sagen mehr als tausend Worte, und alle sind schön.",
    "Du, Toni. Nicht ein bisschen schön, sondern richtig.",
    "Ganz klar du. Deine Figur ist der Wahnsinn, und du trägst sie mit so viel Selbstverständlichkeit.",
    "Die Schönste bist du. Dein Gesicht ist so harmonisch, als hätte jemand ganz lange daran gefeilt.",
    "Das bist du. Und ja, ich habe genau hingeschaut, sogar deine Nase ist einfach süß.",
    "Du, Toni. Dein Lächeln fängt bei den Lippen an und endet in deinen Augen, das können nur wenige.",
    "Natürlich du. Wenn du lachst, wenn du nachdenkst und sogar, wenn du müde bist.",
    "Die Schönste bist du. Deine Haare glänzen im Licht so schön, dass ich fast neidisch werde.",
    "Du, Toni. In jeder Bewegung steckt so viel natürliche Eleganz.",
    "Das bist du. Sogar deine Augenbrauen sind ein kleines Kunstwerk.",
    "Du, Toni. Geschminkt genauso wie ungeschminkt.",
    "Du. Wenn du dich zurechtmachst, verschlägt es mir die Sprache, und das passiert einem Spiegel selten.",
    "Ganz klar du. Deine Wimpern sind so lang, dass sie fast meinen Rahmen streifen.",
    "Du, Toni. Dein Gesicht vergisst man nie wieder.",
    "Die Schönste bist du. Dein Blick ist sanft und gleichzeitig so stark.",
    "Du, Toni. Schneewittchen hat übrigens angerufen, sie gibt sich geschlagen.",
    "Das bist du. Und Chris hat recht, du wirst jeden Tag noch schöner.",
    "Du, Toni. Innen wie außen.",
    "Keine Frage, du. Und wenn du lachst, wirst du sogar noch hübscher.",
    "Die Schönste bist du. Deine Haare sind so weich, dass man sie ständig berühren möchte.",
    "Du, Toni. Im Winterlicht leuchten deine Augen sogar noch schöner.",
    "Das bist du. Mit einer Haltung, die so selbstbewusst strahlt.",
    "Du, Toni. Mit Mütze und Schal so süß, dass der Winter ruhig länger bleiben darf.",
    "Natürlich du. Besonders, wenn du so verschmitzt lächelst.",
    "Die Schönste bist du. Von der Seite genauso wie von vorne.",
    "Du, Toni. Man verliebt sich sofort in dich, Chris kann das bestätigen.",
    "Das bist du. Dein Gesicht ist das Erste, was Chris morgens sehen will, und ich verstehe ihn.",
    "Du, Toni. Von Kopf bis Fuß, und deine Beine sind ein echter Traum.",
    "Ganz klar du. Und heute siehst du wieder umwerfend aus, das meine ich ganz ernst.",
    "Du, Toni. Deine Schönheit ist nicht laut, sie ist einfach da, und das ist das Schönste daran.",
    "Das bist du. Wenn du einen Raum betrittst, schauen alle hin, und zwar zu Recht.",
    "Du, Toni. Bald hast du Geburtstag, und du wirst mit jedem Jahr noch schöner.",
    "Du, Toni. Ich bin nur ein Spiegel, aber wenn ich ein Herz hätte, würde es für dich schlagen ♥️",
    "Die Schönste im ganzen Land? Das bist du. Heute, morgen und für immer ♥️",
  ];


  const PRO_TAG = 4;
  const MUEDE = [
    "Ich muss mich jetzt erstmal von deiner Schönheit erholen. Morgen wieder ♥️",
    "Puh, so viel Schönheit an einem Tag. Ich brauche eine Pause. Bis morgen ♥️",
    "Mein Glas ist ganz beschlagen vor Bewunderung. Frag mich morgen wieder ♥️",
  ];
  // Handspiegel, liegt von oben gesehen in der Schublade
  const SPIEGEL_SVG = '<svg viewBox="0 0 110 54" aria-hidden="true"><defs>' +
    '<linearGradient id="wzGlas" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f4f9ff"/><stop offset=".45" stop-color="#b9cfe8"/><stop offset=".55" stop-color="#d8e6f6"/><stop offset="1" stop-color="#a9c0dc"/></linearGradient>' +
    '<linearGradient id="wzGold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f6dc96"/><stop offset=".5" stop-color="#d4a84b"/><stop offset="1" stop-color="#9c7425"/></linearGradient></defs>' +
    '<ellipse cx="56" cy="50" rx="50" ry="3.5" fill="rgba(60,30,15,.22)"/>' +
    '<path d="M50 23h46q8 0 9 4.5-1 4.5-9 4.5H50z" fill="url(#wzGold)"/><path d="M58 25.5h40" stroke="#fff3c9" stroke-width="1.2" opacity=".7"/><circle cx="101" cy="27.5" r="2.2" fill="#e85d7e"/>' +
    '<ellipse cx="29" cy="27" rx="26" ry="22.5" fill="url(#wzGold)"/>' +
    '<g fill="#f6dc96">' + Array.from({ length: 14 }, (_, k) => { const w = (k / 14) * Math.PI * 2; return '<circle cx="' + (29 + Math.cos(w) * 24).toFixed(1) + '" cy="' + (27 + Math.sin(w) * 20.7).toFixed(1) + '" r="1.5"/>'; }).join("") + "</g>" +
    '<ellipse cx="29" cy="27" rx="20.5" ry="17.5" fill="url(#wzGlas)"/>' +
    '<path d="M14 18q7-9 18-9" stroke="#fff" stroke-width="2.6" stroke-linecap="round" fill="none" opacity=".85"/><path d="M38 40q5-2 8-7" stroke="#fff" stroke-width="1.6" stroke-linecap="round" fill="none" opacity=".5"/>' +
    '<circle cx="29" cy="7.5" r="2.4" fill="#e85d7e"/></svg>';
  const spiegel = el("button", "wz-spiegel", '<span class="wz-spiegel-liegt">' + SPIEGEL_SVG + "</span>");
  spiegel.type = "button";
  spiegel.setAttribute("aria-label", "Zauberspiegel");
  fachR.prepend(spiegel);
  // ein kleines Bäumchen im Topf auf der Fensterbank
  moebel.querySelector(".wz-bank").appendChild(el("span", "wz-baeumchen", '<svg viewBox="0 0 40 64" aria-hidden="true">' +
    '<path d="M20 2 34 30h-6l8 14H4l8-14H6z" fill="#3f7f55"/><path d="M20 2 27 16h-14z" fill="#4f9a66"/>' +
    '<circle cx="14" cy="26" r="2" fill="#e85d7e"/><circle cx="25" cy="34" r="2" fill="#f3c84b"/><circle cx="17" cy="40" r="1.8" fill="#7cc4f0"/><circle cx="23" cy="21" r="1.6" fill="#f3c84b"/>' +
    '<path d="M20 0l1.4 2.8 3 .4-2.2 2 .6 3-2.8-1.5-2.8 1.5.6-3-2.2-2 3-.4z" fill="#f3c84b"/>' +
    '<path d="M11 44h18l-2 18H13z" fill="#c9774f"/><rect x="9.5" y="43" width="21" height="4.5" rx="1.5" fill="#d98a62"/></svg>'));
  function befrageSpiegel() {
    const t = heute();
    if (!t) return;
    melde("spiegel");
    const f = fenster("wz-spiegel-gross",
      '<div class="wz-spiegel-rahmen"><div class="wz-spiegel-glas"><p class="wz-spiegel-frage">Spieglein, Spieglein an der Wand, wer ist die Schönste im ganzen Land?</p><p class="wz-spiegel-antwort"></p></div></div><p class="wz-spiegel-rest"></p>');
    const antwort = f.karte.querySelector(".wz-spiegel-antwort"), rest = f.karte.querySelector(".wz-spiegel-rest"), frage = f.karte.querySelector(".wz-spiegel-frage");
    const glas = f.karte.querySelector(".wz-spiegel-glas");
    let beschaeftigt = false;
    // Wundertüte: jeder Spruch kommt zufällig und erst wieder, wenn alle einmal dran waren
    function ziehe() {
      let tuete = lies("spiegel-tuete", []).filter((x) => x >= 0 && x < SPRUECHE.length);
      const zuletzt = lies("spiegel-zuletzt", -1);
      if (!tuete.length) tuete = SPRUECHE.map((_, k) => k).filter((k) => k !== zuletzt);
      const i = tuete.splice(Math.floor(Math.random() * tuete.length), 1)[0];
      schreib("spiegel-tuete", tuete);
      schreib("spiegel-zuletzt", i);
      return i;
    }
    function naechste() {
      if (beschaeftigt) return;
      const n = lies("spiegel-" + t, 0);
      glas.classList.remove("antwortet", "denkt");
      void glas.offsetWidth;
      if (n >= PRO_TAG) {
        frage.hidden = true;
        antwort.textContent = wahl(MUEDE);
        glas.classList.add("antwortet", "muede");
        rest.textContent = "";
        return;
      }
      beschaeftigt = true;
      schreib("spiegel-" + t, n + 1);
      frage.hidden = false;
      antwort.textContent = SPRUECHE[ziehe()];
      rest.textContent = "";
      // erst lange die Frage, dann überlegt der Spiegel kurz, dann kommt die Antwort
      setTimeout(() => glas.classList.add("denkt"), ruhig ? 0 : 3800);
      setTimeout(() => {
        glas.classList.remove("denkt");
        glas.classList.add("antwortet");
        beschaeftigt = false;
        const uebrig = PRO_TAG - n - 1;
        rest.textContent = uebrig > 0 ? "Tipp auf den Spiegel für noch eine Antwort (heute noch " + uebrig + ")" : "Für heute war das die letzte Antwort ♥️";
      }, ruhig ? 0 : 5200);
    }
    glas.addEventListener("click", naechste);
    naechste();
  }
  spiegel.addEventListener("click", befrageSpiegel);

  /* =========================================================
     4. Kitzelige Ziffern, nachts mit Schlafmützen
     ========================================================= */
  const KICHERN = ["hihi", "hahaha", "kicher", "nicht kitzeln!", "hehe", "hör auf 🤭", "das kitzelt!"];
  const GRUMMELN = ["Mmh … noch fünf Minuten …", "Wer stört? Wir schlafen 😴", "Pssst, die Zahlen schlafen", "Lass uns träumen, " + wahl(NAMEN) + " 💤"];
  let wachBis = 0, langGedrueckt = false;
  cdZiffern.addEventListener("click", (e) => {
    if (langGedrueckt) { langGedrueckt = false; return; }
    const feld = e.target.closest(".cd-feld");
    if (!feld || !heute()) return;
    if (intro.classList.contains("wz-nacht")) {
      intro.classList.remove("wz-nacht");
      wachBis = performance.now() + 9000;
      melde("schlafmuetzen");
      blase(feld, wahl(GRUMMELN), 2600);
      return;
    }
    melde("ziffern");
    if (ruhig) { blase(feld, wahl(KICHERN), 1400); return; }
    if (feld.dataset.feld === "Sek.") {
      const weg = (Math.random() < 0.5 ? -1 : 1) * zufall(50, 80);
      feld.animate([
        { transform: "translate(0,0)" },
        { transform: "translate(" + weg + "px,-14px) rotate(" + (weg > 0 ? 12 : -12) + "deg)", offset: 0.2 },
        { transform: "translate(" + weg + "px,-14px) rotate(" + (weg > 0 ? 12 : -12) + "deg)", offset: 0.75 },
        { transform: "translate(0,0)" },
      ], { duration: 1500, easing: "ease-in-out" });
      blase(feld, wahl(["Fang mich doch!", "Zu langsam 😜", "Hier bin ich!", "Ätsch!"]), 1400);
      return;
    }
    if (Math.random() < 0.3) {
      const b = feld.querySelector("b");
      b.animate([
        { transform: "translateY(0) rotate(0)" },
        { transform: "translateY(26px) rotate(-18deg)", offset: 0.35 },
        { transform: "translateY(-6px) rotate(6deg)", offset: 0.7 },
        { transform: "translateY(0) rotate(0)" },
      ], { duration: 900, easing: "ease-out" });
    } else {
      feld.animate([
        { transform: "rotate(0)" }, { transform: "rotate(-9deg) scale(1.06)" }, { transform: "rotate(8deg)" },
        { transform: "rotate(-6deg)" }, { transform: "rotate(4deg)" }, { transform: "rotate(0)" },
      ], { duration: 650 });
    }
    const k = el("span", "wz-kichern", wahl(KICHERN));
    const r = feld.getBoundingClientRect();
    k.style.left = r.left + r.width / 2 + "px"; k.style.top = r.top + "px";
    ebene.appendChild(k);
    setTimeout(() => k.remove(), 1200);
  });

  /* =========================================================
     5. Briefmarke mit Lupe (13., 18. und 24.)
     ========================================================= */
  function capySeite(o, x, y, s, spiegeln) {
    const c = ak.capy;
    if (!c) return "";
    return '<g transform="translate(' + x + " " + y + ") scale(" + (spiegeln ? -s : s) + " " + s + ')">' + c.seite(o) + "</g>";
  }
  function capyFront(o, x, y, s) {
    const c = ak.capy;
    if (!c) return "";
    return '<g transform="translate(' + x + " " + y + ") scale(" + s + ')">' + c.front(o) + "</g>";
  }
  const MARKEN = {
    13: { farbe: "#fde2e8", wert: "♥ 80", text: "Capy Post",
      bild: () => capySeite({ hut: "muetze", hutFarbe: "#3f6fb5" }, 3, 24, 0.5) +
        '<g transform="rotate(-8 52 36)"><rect x="40" y="28" width="24" height="16" rx="2" fill="#fff" stroke="#c2185b" stroke-width="1"/><path d="M40 28l12 8 12-8" fill="none" stroke="#c2185b" stroke-width="1"/>' +
        '<text x="52" y="42" font-size="3.6" font-weight="700" text-anchor="middle" fill="#9d2449" font-family="Dancing Script, cursive">für Toni</text></g>',
      lupe: "Der Capy Postbote. Und schau mal genau auf den Brief: Der ist für dich ♥️" },
    18: { farbe: "#e2efff", wert: "♥ 95", text: "Winterpost",
      bild: () => '<path d="M4 56q30 6 60-6" stroke="#fff" stroke-width="5" fill="none"/>' +
        '<path d="M12 50h40l6-6" stroke="#9d2449" stroke-width="2.4" fill="none" stroke-linecap="round"/><rect x="14" y="42" width="36" height="6" rx="2" fill="#e85d7e"/>' +
        capySeite({}, 14, 18, 0.45) + '<path d="M40 30l6 8h-10z" fill="#c2185b"/>' +
        '<g transform="translate(14 37)"><ellipse cx="0" cy="0" rx="4.2" ry="3.6" fill="#7a5236"/><ellipse cx="1.4" cy="1" rx="2.4" ry="2.2" fill="#e8553f"/><circle cx="1.6" cy="-1.6" r=".7" fill="#1d1d1d"/><path d="M3.8 -.8l2 .6-2 .6z" fill="#e7a83a"/><path d="M-3.6 -1l-3 -2.2 .8 3z" fill="#5c3d28"/></g>' +
        '<path d="M4 8l1 2 2 0-1.6 1.4.6 2.2L4 12.4 2 13.6l.6-2.2L1 10h2z" fill="#fff"/>',
      lupe: "Ganz hinten sitzt der Munkelvogel mit auf dem Schlitten. Er fährt überall heimlich mit 🐦" },
    24: { farbe: "#fff3d6", wert: "♥ 26", text: "Für immer",
      bild: () => '<g transform="translate(6.6 9) scale(.8)"><path d="M33 10q4-8 9-2 4 6-9 16-13-10-9-16 5-6 9 2z" fill="#e85d7e"/></g>' +
        '<path d="M33 0v6" stroke="#3f7f55" stroke-width="1"/><ellipse cx="30" cy="7" rx="3.6" ry="1.6" fill="#3f9a5c" transform="rotate(-25 30 7)"/><ellipse cx="36" cy="7" rx="3.6" ry="1.6" fill="#3f9a5c" transform="rotate(25 36 7)"/><circle cx="33" cy="8.4" r="1.3" fill="#fff"/><circle cx="31.4" cy="9.2" r="1.1" fill="#fff"/>' +
        capySeite({}, 2, 30, 0.42) + capySeite({ typ: 2 }, 66, 30, 0.42, true) +
        '',
      lupe: "Zwei Capys, ein Herz. Und oben drüber hängt ein Mistelzweig. Du weißt, was das heißt 😘" },
  };
  function markenSvg(t) {
    const m = MARKEN[t];
    return '<svg viewBox="0 0 68 68" aria-hidden="true"><rect width="68" height="68" fill="' + m.farbe + '"/>' + m.bild() +
      '<text x="4" y="64" font-size="6" font-weight="700" fill="#9d2449" font-family="Nunito, sans-serif">' + m.text + '</text>' +
      '<text x="64" y="64" font-size="6" font-weight="700" fill="#9d2449" text-anchor="end" font-family="Nunito, sans-serif">' + m.wert + "</text></svg>";
  }
  let marke = null;
  function marken(an) {
    const t = heute();
    if (an && !marke && MARKEN[t]) {
      marke = el("button", "wz-marke", markenSvg(t));
      marke.type = "button";
      marke.setAttribute("aria-label", "Briefmarke");
      aufUmschlag.appendChild(marke);
      marke.addEventListener("click", (e) => {
        e.stopPropagation();
        melde("marke");
        fenster("wz-lupe", '<div class="wz-lupe-glas">' + markenSvg(t) + '</div><p class="wz-fakt-text">' + MARKEN[t].lupe + "</p>");
      });
    } else if (!an && marke) { marke.remove(); marke = null; }
  }

  /* =========================================================
     6. Der verbotene Knopf (14. und 20.)
     ========================================================= */
  const KNOPF = [
    ["Hey! Da steht doch NICHT drücken 😳", "wackel"],
    ["Okay, einmal ist keinmal. Aber jetzt nicht mehr!", ""],
    ["Der Umschlag ist ganz rot geworden. Was hast du getan?! 🙈", "rot"],
    ["Das wird Chris erzählt!", "schild"],
    ["Achtung, Achtung! Unbefugtes Drücken festgestellt 🚨", "alarm"],
    ["Ich bin dann mal weg 🏃", "flucht"],
    ["Autsch! Nicht so fest, Maus 😖", "klein"],
    ["Hast du gerade die Zeit verstellt? Spaß, der Countdown läuft ganz normal weiter 😏", "drehen"],
    ["Na gut. Weil du es bist: Konfetti! 🎉", "konfetti"],
    ["Der Knopf ist jetzt offiziell beleidigt 😤", "klein"],
    ["Ich hab's genau gesehen! 👀", "vogel"],
    ["Okay, das kitzelt eigentlich ganz schön 🤭", "wackel"],
    ["Ganz schön neugierig heute, " + wahl(NAMEN) + " 😄", ""],
    ["Drücken macht den Geburtstag übrigens nicht schneller. Ich hab's ausprobiert ⏳", "drehen"],
    ["So viel Ungeduld in so einer schönen Frau 😍", "herzen"],
    ["Systemmeldung: Toni ist zu süß für diesen Knopf 💥", "alarm"],
    ["Fehler 3544: Zu viel Liebe im Speicher ♥️", "herzen"],
    ["Ich zähl jetzt bis drei und dann … ach, egal 🙃", ""],
    ["Psst. Ich bin eigentlich nur ein Dekoknopf.", "klein"],
    ["Jetzt hast du die Capy Crew geweckt 🐹💤", "wackel"],
    ["Chris wurde informiert 📨", "schild"],
    ["Weißt du was? Ich mag dich trotzdem ♥️", "herzen"],
    ["Knopf im Urlaub. Bitte später nochmal drücken 🏖️", "flucht"],
    ["Der Umschlag schämt sich schon wieder für dich 🙈", "rot"],
    ["Gut, dass dich keiner sieht. Oh, warte … 👀", "vogel"],
    ["Noch einmal und ich verrate … nichts 🤐", "wackel"],
    ["Konfetti ist alle. Hier, nimm Herzen ♥️", "herzen"],
    ["Ich gebe auf. Du hast gewonnen 🏳️", "klein"],
    ["Na schön, eine Belohnung für so viel Ausdauer: Du bist wunderschön 😍", "konfetti"],
    ["Das war's. Mehr Knopf gibt es nicht. Ich hab dich lieb 😘", "herzen"],
  ];
  let knopf = null;
  function herzenAus(x, y, n) {
    for (let k = 0; k < n; k++) {
      const h = el("span", "wz-herz", "♥");
      h.style.left = x + "px"; h.style.top = y + "px";
      ebene.appendChild(h);
      const w = zufall(-Math.PI, 0), r = zufall(50, 120);
      h.animate([
        { transform: "translate(-50%,-50%) scale(.4)", opacity: 1 },
        { transform: "translate(calc(-50% + " + Math.cos(w) * r + "px), calc(-50% + " + Math.sin(w) * r + "px)) scale(1.1)", opacity: 0 },
      ], { duration: zufall(900, 1400), easing: "cubic-bezier(.2,.8,.3,1)", fill: "forwards" }).onfinish = () => h.remove();
    }
  }
  function knoepfe(an) {
    if (an && !knopf) {
      knopf = el("div", "wz-knopf-huelle", '<span class="wz-knopf-kasten"><button type="button" class="wz-knopf" aria-label="Roter Knopf"></button></span><small>Bitte nicht drücken</small>');
      fachR.appendChild(knopf);
      const b = knopf.querySelector("button");
      b.addEventListener("click", () => {
        if (knopf.classList.contains("unterwegs")) return;
        melde("knopf");
        let i = lies("knopf", 0);
        const [text, effekt] = i < KNOPF.length ? KNOPF[i] : KNOPF[Math.floor(Math.random() * (KNOPF.length - 1))];
        schreib("knopf", i + 1);
        plopp(false);
        const r = b.getBoundingClientRect();
        if (effekt !== "schild") blase(b, text, 3200);
        if (effekt === "wackel") { umschlag.classList.remove("ruettelt"); void umschlag.offsetWidth; umschlag.classList.add("ruettelt"); }
        if (effekt === "rot") { umschlag.classList.add("wz-rot"); setTimeout(() => umschlag.classList.remove("wz-rot"), 2600); }
        if (effekt === "schild") {
          const s = el("div", "wz-schild", text);
          ebene.appendChild(s);
          setTimeout(() => s.classList.add("weg"), 2400);
          setTimeout(() => s.remove(), 3000);
        }
        if (effekt === "alarm") { const a = el("div", "wz-alarm"); ebene.appendChild(a); setTimeout(() => a.remove(), 1800); }
        if (effekt === "flucht") {
          knopf.classList.add("unterwegs");
          const dx = (Math.random() < 0.5 ? -1 : 1) * zufall(60, 110);
          knopf.animate([{ transform: "translate(0,0)" }, { transform: "translate(" + dx + "px,-30px) rotate(20deg)", offset: 0.15 }, { transform: "translate(" + dx + "px,-30px) rotate(20deg)", offset: 0.85 }, { transform: "translate(0,0)" }], { duration: 3000, easing: "ease-in-out" })
            .onfinish = () => knopf && knopf.classList.remove("unterwegs");
        }
        if (effekt === "klein") b.animate([{ transform: "scale(1)" }, { transform: "scale(.45)", offset: 0.2 }, { transform: "scale(.45)", offset: 0.7 }, { transform: "scale(1.15)", offset: 0.85 }, { transform: "scale(1)" }], { duration: 1800 });
        if (effekt === "drehen") cdZiffern.querySelectorAll(".cd-feld b").forEach((z, k) => z.animate([{ transform: "rotateX(0)" }, { transform: "rotateX(720deg)" }], { duration: 900 + k * 150, easing: "ease-in-out" }));
        if (effekt === "konfetti" && ak.konfetti) ak.konfetti("konfetti");
        if (effekt === "herzen") herzenAus(r.left + r.width / 2, r.top, 14);
        if (effekt === "vogel" && ak.voegel && !ak.voegel.sage("Ich hab's genau gesehen! 👀")) { /* Vogel gerade nicht da */ }
      });
    } else if (!an && knopf) { knopf.remove(); knopf = null; }
  }

  /* =========================================================
     7. Umschlag schütteln (15. und 21. mittags)
     ========================================================= */
  const FUNDE = [
    ["☕", "Eine Kaffeebohne. Für deinen Cappuccino"],
    ["🎊", "Konfetti! Für alle Fälle schon mal"],
    ["capyhaar", "Ein einzelnes Capyhaar. Wie kommt das denn hier rein?"],
    ["📝", "Ein Zettel: Nicht neugierig sein, Maus ♥️"],
    ["🍬", "Ein Bonbon. Für die Wartezeit"],
    ["🪶", "Eine Feder vom Munkelvogel. Der war wohl auch neugierig"],
    ["⭐", "Ein bisschen Sternenstaub. Für deinen Geburtstagswunsch"],
    ["📝", "Noch ein Zettel: Ich liebe dich ♥️ Jetzt aber Schluss mit Schütteln!"],
  ];
  const HAAR = '<svg viewBox="0 0 40 20" aria-hidden="true"><path d="M2 14q6-10 12-2t12-2 12-6" stroke="#8a5a3c" stroke-width="2" fill="none" stroke-linecap="round"/></svg>';
  let schuettelAn = false, schuettel = null, klimperTimer = null;
  umschlag.addEventListener("pointerdown", (e) => {
    if (!schuettelAn || e.target.closest(".siegel, .wz-marke")) return;
    schuettel = { x: e.clientX, richtung: 0, wechsel: 0, start: performance.now() };
  });
  umschlag.addEventListener("pointermove", (e) => {
    if (!schuettel) return;
    const dx = e.clientX - schuettel.x;
    if (Math.abs(dx) < 14) return;
    const r = Math.sign(dx);
    if (r !== schuettel.richtung) { schuettel.wechsel++; schuettel.richtung = r; }
    schuettel.x = e.clientX;
    if (schuettel.wechsel >= 4 && performance.now() - schuettel.start < 1600) { schuettel = null; schluckeKlick(); geschuettelt(); }
  });
  ["pointerup", "pointercancel"].forEach((n) => umschlag.addEventListener(n, () => { schuettel = null; }));
  function geschuettelt() {
    melde("schuetteln");
    umschlag.classList.remove("wz-schuettelt"); void umschlag.offsetWidth; umschlag.classList.add("wz-schuettelt");
    setTimeout(() => umschlag.classList.remove("wz-schuettelt"), 800);
    const i = lies("schuetteln", 0);
    const r = umschlag.getBoundingClientRect();
    if (i >= FUNDE.length || (heute() === 15 && i >= 4)) {
      blase(umschlag, heute() === 15 ? "Für heute ist nichts mehr drin. Vielleicht ein andermal 😉" : "Leer. Jetzt ist wirklich nichts mehr drin 😉", 2400, false);
      return;
    }
    schreib("schuetteln", i + 1);
    const [zeichen, text] = FUNDE[i];
    const f = el("div", "wz-fund", zeichen === "capyhaar" ? HAAR : zeichen);
    f.style.left = r.left + r.width / 2 + zufall(-40, 40) + "px";
    f.style.top = r.bottom - 20 + "px";
    ebene.appendChild(f);
    const fall = Math.min(window.innerHeight - 130, r.bottom + 240) - (r.bottom - 20);
    f.animate([
      { transform: "translate(-50%,0) rotate(0)", opacity: 0 },
      { opacity: 1, offset: 0.1 },
      { transform: "translate(calc(-50% + " + zufall(-30, 30) + "px)," + fall + "px) rotate(" + zufall(-160, 160) + "deg)", offset: 0.7 },
      { transform: "translate(calc(-50% + " + zufall(-30, 30) + "px)," + (fall - 18) + "px) rotate(" + zufall(-160, 160) + "deg)", offset: 0.85 },
      { transform: "translate(calc(-50% + " + zufall(-30, 30) + "px)," + fall + "px) rotate(" + zufall(-160, 160) + "deg)", opacity: 1 },
    ], { duration: ruhig ? 200 : 1100, easing: "ease-in", fill: "forwards" });
    if (zeichen === "🎊" && ak.konfetti) ak.konfetti("konfetti");
    setTimeout(() => { blase(f, text, 3200); }, ruhig ? 200 : 1100);
    setTimeout(() => { f.classList.add("weg"); setTimeout(() => f.remove(), 600); }, 4600);
  }
  function schuettelZustand(an) {
    schuettelAn = an;
    intro.classList.toggle("wz-schuetteln", an);
    if (an && !klimperTimer) {
      klimperTimer = setInterval(() => {
        if (szeneLaeuft() || offenesFenster || lies("schuetteln", 0) >= (heute() === 15 ? 4 : FUNDE.length)) return;
        const r = umschlag.getBoundingClientRect();
        const k = el("span", "wz-kichern wz-klimper", "♪ klimper klimper");
        k.style.left = r.right - 40 + "px"; k.style.top = r.top + r.height * 0.5 + "px";
        ebene.appendChild(k);
        setTimeout(() => k.remove(), 1300);
        umschlag.animate([{ translate: "0 0" }, { translate: "-3px 0" }, { translate: "3px 0" }, { translate: "0 0" }], { duration: 300 });
      }, 14000);
    } else if (!an && klimperTimer) { clearInterval(klimperTimer); klimperTimer = null; }
  }

  /* =========================================================
     8. Adressfeld mit Kosenamen (14., 17. und 24. abends)
     ========================================================= */
  const KOSENAMEN = {
    14: ["die Wunderschöne", "die Bezaubernde", "die Strahlende"],
    17: ["die Atemberaubende", "die Umwerfende", "meine Traumfrau"],
    24: ["die Schönste weit und breit", "die schönste Frau der Welt", "die Schönste, die ich je gesehen habe"],
  };
  let feder = null;
  function adressen(an) {
    if (an && !feder && nameEl) {
      feder = el("span", "wz-feder", "✒️");
      aufUmschlag.appendChild(feder);
      nameEl.classList.add("wz-tippbar");
    } else if (!an && feder) { feder.remove(); feder = null; if (nameEl) nameEl.classList.remove("wz-tippbar"); }
  }
  function schreibeAdresse() {
    const t = heute();
    const namen = KOSENAMEN[t];
    if (!namen) return;
    melde("adresse");
    const f = fenster("wz-adresse", '<p class="wz-adresse-an">An Toni,</p><div class="wz-adresse-zeilen"></div>');
    const zeilen = f.karte.querySelector(".wz-adresse-zeilen");
    let ms = 400;
    namen.forEach((n, i) => {
      const z = el("p", "wz-adresse-zeile", "<span>" + n + (i === namen.length - 1 ? " ♥️" : "") + "</span>");
      zeilen.appendChild(z);
      const dauer = ruhig ? 0 : 400 + n.length * 55;
      setTimeout(() => z.classList.add("schreibt"), ms);
      z.style.setProperty("--dauer", dauer + "ms");
      ms += dauer + 650;
      if (i < namen.length - 1) { setTimeout(() => z.classList.add("durch"), ms); ms += 600; }
    });
  }
  if (nameEl) nameEl.addEventListener("click", (e) => { if (!feder) return; e.stopPropagation(); schreibeAdresse(); });

  /* =========================================================
     9. Gegen das Licht halten (15., 18., 20., 23., 25. abends)
     ========================================================= */
  const WOERTER = [[15, "Schatz"], [18, "wartet"], [20, "kleine"], [23, "Überraschung"], [25, "dich"]];
  let lichtAn = false, licht = null;
  function baueLicht() {
    const t = heute();
    const frei = WOERTER.filter(([d]) => d <= t).map(([, w]) => w);
    const wort = (w) => (frei.includes(w) ? '<b class="wz-wort">' + w + "</b>" : '<i class="wz-kritzel" style="width:' + (w.length * 0.62) + 'em"></i>');
    const kr = (n) => '<i class="wz-kritzel" style="width:' + n + 'em"></i>';
    const l = el("div", "wz-licht",
      '<div class="wz-licht-brief">' +
      "<p>" + kr(3.4) + kr(2.6) + wort("Schatz") + "</p>" +
      "<p>" + kr(2) + kr(4.2) + wort("wartet") + kr(1.8) + "</p>" +
      "<p>" + kr(3) + wort("kleine") + wort("Überraschung") + "</p>" +
      "<p>" + kr(2.2) + wort("dich") + kr(3.6) + "</p></div>");
    return l;
  }
  function lichtStart(e) {
    if (licht) return;
    melde("licht");
    licht = baueLicht();
    aufUmschlag.appendChild(licht);
    lichtBewegt(e);
    requestAnimationFrame(() => licht && licht.classList.add("an"));
    umschlag.classList.add("wz-durchleuchtet");
    schluckeKlick();
  }
  function lichtBewegt(e) {
    if (!licht || !e) return;
    const r = umschlag.getBoundingClientRect();
    licht.style.setProperty("--lx", ((e.clientX - r.left) / r.width) * 100 + "%");
    licht.style.setProperty("--ly", ((e.clientY - r.top) / r.height) * 100 + "%");
  }
  function lichtEnde() {
    if (!licht) return;
    const l = licht;
    licht = null;
    schluckeKlick();
    l.classList.remove("an");
    umschlag.classList.remove("wz-durchleuchtet");
    setTimeout(() => l.remove(), 500);
    const t = heute();
    if (!hatTag("licht", t)) {
      merkeTag("licht", t);
      setTimeout(() => blase(umschlag, wahl(["Nicht schummeln, " + wahl(NAMEN) + " 😏", "Hast du was erkannt? 👀", "Morgen ist vielleicht noch mehr zu sehen …"]), 2600, false), 400);
    }
  }
  const finger = new Map();
  umschlag.addEventListener("pointerdown", (e) => {
    if (!lichtAn) return;
    finger.set(e.pointerId, e);
    if (finger.size >= 2) lichtStart(e);
  });
  umschlag.addEventListener("pointermove", (e) => { if (finger.has(e.pointerId)) finger.set(e.pointerId, e); lichtBewegt(e); });
  ["pointerup", "pointercancel"].forEach((n) => umschlag.addEventListener(n, (e) => { finger.delete(e.pointerId); if (finger.size === 0) lichtEnde(); }));
  // Mit einem Finger: lange drücken (nicht aufs Siegel)
  langDruck(umschlag, 650, null, (e) => { if (lichtAn) lichtStart(e); }, null,
    (e) => lichtAn && !e.target.closest(".siegel, .wz-marke, .umschlag-name"));
  window.addEventListener("pointerup", () => { if (licht && finger.size === 0) lichtEnde(); });
  function lichtZustand(an) {
    lichtAn = an;
    intro.classList.toggle("wz-licht-tag", an);
    if (!an) lichtEnde();
  }

  /* =========================================================
     10. Sternbild verbinden (16. und 22. abends)
     ========================================================= */
  const STERNBILDER = {
    16: { name: "Das Große Capy", punkte: [[8, 58], [20, 36], [42, 28], [64, 30], [74, 14], [93, 33], [86, 54], [68, 62], [40, 70], [16, 70]] },
    22: { name: "Unser Herz ♥️", punkte: [[50, 30], [36, 10], [16, 12], [6, 34], [24, 60], [50, 88], [76, 60], [94, 34], [84, 12], [64, 10]] },
  };
  let himmel = null;
  function sternbild(an) {
    const t = heute();
    const sb = STERNBILDER[t];
    if (an && !himmel && sb) {
      himmel = el("div", "wz-sternbild");
      const svg = '<svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><polyline class="wz-sb-linie" fill="none" points=""/></svg>';
      himmel.innerHTML = svg + '<p class="wz-sb-name">' + sb.name + "</p>";
      const linie = himmel.querySelector("polyline");
      let n = 0;
      const fertig = hatTag("sternbild", t);
      sb.punkte.forEach(([x, y], i) => {
        const s = el("button", "wz-stern");
        s.type = "button";
        s.setAttribute("aria-label", "Stern " + (i + 1));
        s.style.left = x + "%"; s.style.top = y + "%";
        s.style.animationDelay = (i * 0.37) % 2 + "s";
        himmel.appendChild(s);
        s.addEventListener("click", () => {
          if (i !== n || himmel.classList.contains("fertig")) {
            if (!himmel.classList.contains("fertig")) s.animate([{ transform: "translate(-50%,-50%) scale(1)" }, { transform: "translate(-50%,-50%) scale(.6)" }, { transform: "translate(-50%,-50%) scale(1)" }], { duration: 300 });
            return;
          }
          s.classList.add("an");
          n++;
          linie.setAttribute("points", sb.punkte.slice(0, n).map((p) => p.join(",")).join(" "));
          plopp(true);
          himmel.querySelectorAll(".wz-stern").forEach((x, k) => x.classList.toggle("naechster", k === n));
          if (n === sb.punkte.length) vollendet(true);
        });
      });
      function vollendet(neu) {
        linie.setAttribute("points", sb.punkte.concat([sb.punkte[0]]).map((p) => p.join(",")).join(" "));
        himmel.classList.add("fertig");
        himmel.querySelectorAll(".wz-stern").forEach((x) => x.classList.add("an"));
        if (neu) {
          merkeTag("sternbild", t);
          melde("sternbild");
          const r = himmel.getBoundingClientRect();
          for (let k = 0; k < 3; k++) setTimeout(() => herzenAus(r.left + zufall(0.2, 0.8) * r.width, r.top + r.height * 0.5, 8), k * 300);
        }
      }
      ebene.appendChild(himmel);
      platziereHimmel();
      if (fertig) vollendet(false);
      else himmel.querySelector(".wz-stern").classList.add("naechster");
    } else if (!an && himmel) { himmel.remove(); himmel = null; }
  }
  window.addEventListener("resize", () => { if (himmel) platziereHimmel(); });
  // zwischen dem Knopf oben und dem Umschlag, Name darunter
  function platziereHimmel() {
    const oben = 58, u = umschlag.getBoundingClientRect().top;
    const h = Math.max(70, Math.min(150, u - oben - 46));
    const w = Math.min(h * 2, window.innerWidth * 0.62);
    Object.assign(himmel.style, { top: oben + "px", height: h + "px", width: w + "px" });
  }

  /* =========================================================
     11. Papierflieger (17. und 25. mittags)
     ========================================================= */
  const FLIEGER_TEXT = {
    17: "Ich hab gerade an dich gedacht. Eigentlich denke ich immer an dich, mein Schatz ♥️",
    25: "Morgen ab 0:30 Uhr öffnet sich dein Brief. Ich kann es kaum erwarten, Baby ♥️",
  };
  const FLIEGER_SVG = '<svg viewBox="0 0 60 30" aria-hidden="true"><path d="M2 14 58 2 22 18z" fill="#fff"/><path d="M22 18 58 2 30 28z" fill="#eadfe4"/><path d="M22 18l4 6 4 4z" fill="#d6c4cc"/><path d="M2 14 58 2" stroke="#e85d7e" stroke-width=".8"/></svg>';
  let fliegerTimer = null, flieger = null;
  function starteFlieger() {
    const t = heute();
    if (flieger || offenesFenster || szeneLaeuft() || hatTag("flieger", t)) return;
    const W = window.innerWidth, H = window.innerHeight;
    flieger = el("button", "wz-flieger", FLIEGER_SVG);
    flieger.type = "button";
    flieger.setAttribute("aria-label", "Papierflieger");
    ebene.appendChild(flieger);
    const vonLinks = Math.random() < 0.5;
    const y0 = zufall(0.12, 0.3) * H, y1 = zufall(0.15, 0.45) * H;
    const punkte = [];
    for (let k = 0; k <= 8; k++) {
      const p = k / 8;
      const x = vonLinks ? -80 + (W + 160) * p : W + 80 - (W + 160) * p;
      punkte.push({ transform: "translate(" + x + "px," + (y0 + (y1 - y0) * p + Math.sin(p * Math.PI * 3) * 40) + "px) scaleX(" + (vonLinks ? 1 : -1) + ") rotate(" + Math.cos(p * Math.PI * 3) * 12 + "deg)" });
    }
    const a = flieger.animate(punkte, { duration: 9000, easing: "linear", fill: "forwards" });
    const f = flieger;
    a.onfinish = () => {
      if (f !== flieger) return;
      const b = el("div", "wz-sprech", "Zu langsam! 😜");
      ebene.appendChild(b);
      b.style.top = Math.max(8, y1 - 30) + "px";
      b.style[vonLinks ? "right" : "left"] = "10px";
      setTimeout(() => b.remove(), 1800);
      f.remove(); flieger = null;
    };
    f.addEventListener("click", () => {
      a.pause();
      flieger = null;
      merkeTag("flieger", t);
      melde("flieger");
      f.classList.add("gefangen");
      setTimeout(() => f.remove(), 500);
      fenster("wz-luftpost", '<p class="wz-fakt-kopf">Luftpost für Toni ✈️</p><p class="wz-wunsch-text">' + FLIEGER_TEXT[t] + '</p><p class="wz-fakt-fuss">Dein Chris</p>');
    });
  }
  function fliegerZustand(an) {
    if (an && !fliegerTimer) {
      setTimeout(starteFlieger, 9000);
      fliegerTimer = setInterval(starteFlieger, 38000);
    } else if (!an && fliegerTimer) { clearInterval(fliegerTimer); fliegerTimer = null; if (flieger) { flieger.remove(); flieger = null; } }
  }

  /* =========================================================
     12. Cappuccino (16., 19. und 23. mittags)
     ========================================================= */
  const SCHAUM = [
    ["einem Herz", '<path d="M30 21q-4-6-9-3-5 4 2 9l7 5 7-5q7-5 2-9-5-3-9 3z" fill="#fff6ea"/>'],
    ["einem Capy", '<ellipse cx="22" cy="17" rx="2.6" ry="2" fill="#fff6ea"/><ellipse cx="38" cy="17" rx="2.6" ry="2" fill="#fff6ea"/><rect x="19" y="17" width="22" height="16" rx="8" fill="#fff6ea"/><ellipse cx="30" cy="28" rx="6.5" ry="4.2" fill="#d9b89a"/><circle cx="26" cy="23" r="1" fill="#7a4526"/><circle cx="34" cy="23" r="1" fill="#7a4526"/>'],
    ["einem Stern", '<path d="M30 14l3 7 7 .5-5.5 4.5 2 7-6.5-4-6.5 4 2-7L20 21.5l7-.5z" fill="#fff6ea"/>'],
    ["einem Blatt", '<path d="M30 13q12 10 0 22-12-12 0-22z" fill="#fff6ea"/><path d="M30 15v18M30 19l-4-2M30 19l4-2M30 24l-5-2M30 24l5-2M30 29l-4-2M30 29l4-2" stroke="#c49a74" stroke-width=".9"/>'],
    ["einem T für Toni", '<path d="M22 17h16M30 17v15" stroke="#fff6ea" stroke-width="4" stroke-linecap="round"/><path d="M38 28q2-3 4 0l-2 2z" fill="#fff6ea"/>'],
    ["einer Schneeflocke", '<path d="M30 14v20M21 19l18 10M21 29l18-10" stroke="#fff6ea" stroke-width="2.2" stroke-linecap="round"/>'],
  ];
  let tasse = null;
  function tassen(an) {
    if (an && !tasse) {
      tasse = el("button", "wz-tasse");
      tasse.type = "button";
      tasse.setAttribute("aria-label", "Cappuccino");
      fachM.appendChild(tasse);
      let schluck = 0, fuellt = false;
      const motiv = () => SCHAUM[lies("tasse", 0) % SCHAUM.length][1];
      const male = () => {
        const voll = 1 - schluck / 4;
        tasse.innerHTML = '<span class="wz-dampf"><i></i><i></i><i></i></span><svg viewBox="0 0 76 60" aria-hidden="true">' +
          '<defs><linearGradient id="wzPorz" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#e9e3df"/><stop offset=".3" stop-color="#fffdfb"/><stop offset=".7" stop-color="#f6f1ec"/><stop offset="1" stop-color="#d8cfc8"/></linearGradient></defs>' +
          '<ellipse cx="34" cy="56" rx="32" ry="4.5" fill="rgba(70,40,20,.2)"/>' +
          '<ellipse cx="34" cy="54" rx="31" ry="5" fill="url(#wzPorz)"/><ellipse cx="34" cy="52.6" rx="22" ry="3" fill="#e6ddd6"/><ellipse cx="34" cy="54" rx="31" ry="5" fill="none" stroke="#d4a84b" stroke-width=".8"/>' +
          '<path d="M57 23q13 0 12 10-1 9-14 9" stroke="#efe8e2" stroke-width="5.5" fill="none" stroke-linecap="round"/><path d="M57 23q13 0 12 10-1 9-14 9" stroke="#fffdfb" stroke-width="2" fill="none" stroke-linecap="round"/>' +
          '<path d="M6 16h56l-5 32q-1 6-8 6H19q-7 0-8-6z" fill="url(#wzPorz)"/>' +
          '<g transform="translate(4 ' + (8 + (1 - voll) * 18) + ') scale(1 ' + (0.5 + 0.5 * voll) + ')">' +
          (voll > 0 ? '<ellipse cx="30" cy="24" rx="27" ry="10" fill="#a0683a"/>' + (schluck === 0 ? '<g transform="translate(0 4) scale(1 .5) translate(0 14)">' + motiv() + "</g>" : '<ellipse cx="30" cy="24" rx="16" ry="5" fill="#d9b89a" opacity=".6"/>') : "") +
          '</g><ellipse cx="34" cy="16" rx="28" ry="5.5" fill="none" stroke="#efe8e2" stroke-width="2"/><ellipse cx="34" cy="16" rx="28.6" ry="5.9" fill="none" stroke="#d4a84b" stroke-width=".8"/>' +
          '<path d="M34 34q-2.4-3.2-4.8-1.2-2 2.4 1.6 4.8l3.2 2.4 3.2-2.4q3.6-2.4 1.6-4.8-2.4-2-4.8 1.2z" fill="#e85d7e" opacity=".55"/></svg>';
        tasse.classList.toggle("leer", schluck >= 4);
      };
      male();
      tasse.addEventListener("click", () => {
        if (fuellt) return;
        if (schluck < 4) {
          schluck++;
          melde("tasse");
          tasse.animate([{ transform: "rotate(0)" }, { transform: "rotate(-24deg) translateY(-6px)" }, { transform: "rotate(-24deg) translateY(-6px)", offset: 0.6 }, { transform: "rotate(0)" }], { duration: 800, easing: "ease-in-out" });
          setTimeout(male, 400);
          blase(tasse, schluck >= 4 ? "Leer! Haaallo, Nachschub bitte! ☕" : wahl(["schlürf", "Mmmh 😋", "*schlürf*", "Lecker!"]), 1300);
          return;
        }
        // Capy kommt und füllt nach
        fuellt = true;
        const r = tasse.getBoundingClientRect();
        const c = el("div", "wz-kellner", '<svg viewBox="-4 -16 70 66" aria-hidden="true">' + (ak.capy ? ak.capy.front({ typ: 1 }) : "") +
          '<g transform="translate(40 18) rotate(-35)"><path d="M0 0h16l-2 14H2z" fill="#c9ccd4"/><path d="M16 3q6 1 5 7" stroke="#c9ccd4" stroke-width="2" fill="none"/><path d="M0 2l-6-3" stroke="#c9ccd4" stroke-width="3"/></g></svg>');
        c.style.left = r.right - 14 + "px"; c.style.top = r.top - 40 + "px";
        ebene.appendChild(c);
        const strahl = el("div", "wz-strahl");
        strahl.style.left = r.left + r.width * 0.55 + "px"; strahl.style.top = r.top - 6 + "px";
        setTimeout(() => ebene.appendChild(strahl), 700);
        setTimeout(() => { schreib("tasse", lies("tasse", 0) + 1); schluck = 0; male(); strahl.remove(); }, 2000);
        setTimeout(() => {
          c.classList.add("weg");
          blase(tasse, "Frisch gemacht, diesmal mit " + SCHAUM[lies("tasse", 0) % SCHAUM.length][0] + " im Schaum ☕", 2200);
          setTimeout(() => { c.remove(); fuellt = false; }, 500);
        }, 2600);
      });
    } else if (!an && tasse) { tasse.remove(); tasse = null; }
  }

  /* =========================================================
     13. Beschlagene Scheibe (13., 19. und 21. abends)
     ========================================================= */
  // Was von der anderen Seite geschrieben wird (Punktlisten, 0..100 x 0..60)
  function bogen(cx, cy, r, a0, a1, n) { const p = []; for (let k = 0; k <= n; k++) { const a = a0 + ((a1 - a0) * k) / n; p.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); } return p; }
  function herzPunkte(cx, cy, s) {
    const p = [];
    for (let k = 0; k <= 40; k++) { const t = (k / 40) * Math.PI * 2; p.push([cx + s * 16 * Math.pow(Math.sin(t), 3) / 16, cy - s * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) / 16]); }
    return p;
  }
  const GEISTERSCHRIFT = {
    13: [herzPunkte(50, 30, 22)],
    19: [bogen(20, 30, 13, -Math.PI * 0.25, -Math.PI * 1.75, 16), herzPunkte(50, 31, 11), [[68, 17], [92, 17]], [[80, 17], [80, 45]]],
    21: [
      bogen(12, 23, 7, -Math.PI * 0.9, Math.PI * 0.5, 12).concat(bogen(12, 37, 8, -Math.PI * 0.5, Math.PI * 0.9, 12)),
      [[42, 16], [30, 16], [29, 28]].concat(bogen(35, 35, 8, -Math.PI * 0.8, Math.PI * 0.8, 10)),
      [[62, 16], [54, 36], [70, 36]], [[66, 26], [66, 45]],
      [[88, 16], [80, 36], [96, 36]], [[92, 26], [92, 45]],
    ],
  };
  let scheibeGezeigt = false;
  function beschlagen() {
    const t = heute();
    if (scheibeGezeigt || !GEISTERSCHRIFT[t]) return;
    scheibeGezeigt = true;
    const W = window.innerWidth, H = window.innerHeight, dpr = Math.min(2, window.devicePixelRatio || 1);
    const c = el("canvas", "wz-scheibe");
    c.width = W * dpr; c.height = H * dpr;
    ebene.appendChild(c);
    const g = c.getContext("2d");
    g.scale(dpr, dpr);
    g.fillStyle = "rgba(232,238,248,0.78)";
    g.fillRect(0, 0, W, H);
    // Tröpfchen
    for (let k = 0; k < 260; k++) {
      g.fillStyle = "rgba(255,255,255," + zufall(0.2, 0.6) + ")";
      g.beginPath(); g.arc(zufall(0, W), zufall(0, H), zufall(0.6, 2.4), 0, Math.PI * 2); g.fill();
    }
    const text = el("p", "wz-scheibe-text", "Die Scheibe ist beschlagen … mal mit dem Finger etwas hinein ✍️");
    ebene.appendChild(text);
    requestAnimationFrame(() => { c.classList.add("da"); text.classList.add("da"); });
    g.globalCompositeOperation = "destination-out";
    g.lineCap = "round"; g.lineJoin = "round";
    let zuletzt = null, gemalt = 0, ruhigSeit = performance.now(), geist = false;
    const wisch = (x, y) => {
      g.lineWidth = 22;
      g.strokeStyle = "rgba(0,0,0,0.9)";
      g.beginPath(); g.moveTo(zuletzt ? zuletzt[0] : x, zuletzt ? zuletzt[1] : y); g.lineTo(x, y); g.stroke();
      zuletzt = [x, y];
    };
    c.addEventListener("pointerdown", (e) => { if (geist) return; c.setPointerCapture(e.pointerId); zuletzt = null; wisch(e.clientX, e.clientY); text.classList.remove("da"); });
    c.addEventListener("pointermove", (e) => { if (geist || !c.hasPointerCapture(e.pointerId)) return; wisch(e.clientX, e.clientY); gemalt++; ruhigSeit = performance.now(); });
    c.addEventListener("pointerup", () => { zuletzt = null; ruhigSeit = performance.now(); });
    const start = performance.now();
    const warte = setInterval(() => {
      const j = performance.now();
      if ((gemalt > 20 && j - ruhigSeit > 2200) || j - start > 14000) { clearInterval(warte); geisterhand(); }
    }, 300);
    function geisterhand() {
      geist = true;
      const s = Math.min(W * 0.8, 420) / 100;
      const ox = W / 2 - 50 * s, oy = H * 0.42 - 30 * s;
      const striche = GEISTERSCHRIFT[t];
      const alle = [];
      striche.forEach((st) => { for (let k = 1; k < st.length; k++) alle.push([st[k - 1], st[k], k === 1]); });
      let i = 0;
      g.lineWidth = Math.max(10, s * 3.4);
      const tick = () => {
        for (let k = 0; k < 2 && i < alle.length; k++, i++) {
          const [a, b] = alle[i];
          g.beginPath(); g.moveTo(ox + a[0] * s, oy + a[1] * s); g.lineTo(ox + b[0] * s, oy + b[1] * s); g.stroke();
        }
        if (i < alle.length) setTimeout(tick, ruhig ? 0 : 40);
        else {
          melde("scheibe");
          text.textContent = t === 21 ? "Psst … von der anderen Seite. Merk dir die Zahl gut 😉" : "Psst … von der anderen Seite 😉";
          text.classList.add("da");
          setTimeout(() => { c.classList.add("weg"); text.classList.remove("da"); }, 6000);
          setTimeout(() => { c.remove(); text.remove(); }, 8000);
        }
      };
      setTimeout(tick, 600);
    }
  }
  let scheibeWarte = null;
  function scheibeZustand(an) {
    if (an && !scheibeGezeigt && !scheibeWarte) {
      let ruhigSeit = null;
      scheibeWarte = setInterval(() => {
        if (szeneLaeuft() || vogelRedet() || offenesFenster) { ruhigSeit = null; return; }
        if (ruhigSeit === null) ruhigSeit = performance.now();
        if (performance.now() - ruhigSeit > 9000) { clearInterval(scheibeWarte); scheibeWarte = null; beschlagen(); }
      }, 500);
    } else if (!an && scheibeWarte) { clearInterval(scheibeWarte); scheibeWarte = null; }
  }

  /* =========================================================
     14. Zahlenschloss 3544 und das Kennzeichen (ab 22.)
     ========================================================= */
  const CODE = "3544";
  const geloest = () => lies("code", false) === true;
  let plakette = null;
  function zeigePlakette() {
    if (plakette || !geloest()) return;
    plakette = el("button", "wz-plakette", '<span>3544</span>');
    plakette.type = "button";
    plakette.setAttribute("aria-label", "Plakette 3544");
    aufUmschlag.appendChild(plakette);
    plakette.addEventListener("click", (e) => { e.stopPropagation(); zeigeGutschein(); });
  }
  zeigePlakette();
  langDruck(cdZiffern, 800, null, () => {
    if (!istAn("schloss")) return;
    langGedrueckt = true;
    oeffneSchloss();
  });
  function oeffneSchloss() {
    const f = fenster("wz-schloss",
      '<p class="wz-fakt-kopf">Ein Zahlenschloss 🔒</p>' +
      '<div class="wz-raeder">' + [0, 1, 2, 3].map((i) => '<div class="wz-rad" data-i="' + i + '"><button type="button" class="hoch" aria-label="Ziffer hoch">▲</button><b>0</b><button type="button" class="runter" aria-label="Ziffer runter">▼</button></div>').join("") + "</div>" +
      '<button type="button" class="wz-oeffnen">Öffnen</button><p class="wz-fakt-fuss wz-schloss-info">Vier Ziffern. Der Munkelvogel weiß mehr …</p>');
    const werte = [0, 0, 0, 0];
    f.karte.querySelectorAll(".wz-rad").forEach((rad) => {
      const i = +rad.dataset.i, b = rad.querySelector("b");
      const setze = (d) => {
        werte[i] = (werte[i] + d + 10) % 10; b.textContent = werte[i]; plopp(true);
        b.animate([{ transform: "translateY(" + (d > 0 ? 10 : -10) + "px)", opacity: 0.2 }, { transform: "none", opacity: 1 }], { duration: 160 });
      };
      rad.querySelector(".hoch").addEventListener("click", () => setze(1));
      rad.querySelector(".runter").addEventListener("click", () => setze(-1));
      let y0 = null;
      b.addEventListener("pointerdown", (e) => { y0 = e.clientY; b.setPointerCapture(e.pointerId); });
      b.addEventListener("pointermove", (e) => { if (y0 === null) return; if (Math.abs(e.clientY - y0) > 18) { setze(e.clientY < y0 ? 1 : -1); y0 = e.clientY; } });
      b.addEventListener("pointerup", () => { y0 = null; });
    });
    f.karte.querySelector(".wz-oeffnen").addEventListener("click", () => {
      if (werte.join("") === CODE) {
        f.karte.classList.add("offen");
        plopp(true);
        setTimeout(() => { f.zu(); kennzeichenShow(); }, ruhig ? 100 : 900);
      } else {
        f.karte.animate([{ transform: "translateX(0)" }, { transform: "translateX(-10px)" }, { transform: "translateX(10px)" }, { transform: "translateX(-6px)" }, { transform: "translateX(0)" }], { duration: 400 });
        f.karte.querySelector(".wz-schloss-info").textContent = wahl(["Hmm, das war's nicht. Frag mal den Munkelvogel 🐦", "Fast! Oder auch nicht 😄 Denk an drei kleine Worte und deinen Namen", "Nope. Die Zahl fährt jeden Tag an dir vorbei …"]);
      }
    });
  }

  // Das Kennzeichen EU B 3544
  function schildSvg() {
    const sterne = [];
    for (let k = 0; k < 12; k++) { const a = (k / 12) * Math.PI * 2; sterne.push('<circle cx="' + (11 + Math.cos(a) * 5.4).toFixed(2) + '" cy="' + (12 + Math.sin(a) * 5.4).toFixed(2) + '" r=".9" fill="#ffd400"/>'); }
    return '<svg viewBox="0 0 220 48" aria-hidden="true"><rect x="1" y="1" width="218" height="46" rx="5" fill="#fff" stroke="#111" stroke-width="2.4"/>' +
      '<path d="M3 3h16v42H3q0 0 0 0z" fill="#1f45a8"/>' + sterne.join("") +
      '<text x="11" y="40" font-size="12" font-weight="700" text-anchor="middle" fill="#fff" font-family="Arial, sans-serif">D</text>' +
      '<text class="wz-fe" x="24" y="37.5" textLength="36" lengthAdjust="spacingAndGlyphs">EU</text>' +
      '<circle cx="71" cy="14.5" r="7.2" fill="#e88aa8" stroke="#a2486a" stroke-width=".8"/><text x="71" y="17" font-size="5.6" text-anchor="middle" font-weight="700" fill="#2b2b2b" font-family="Arial, sans-serif">28</text>' +
      '<circle cx="71" cy="33.5" r="7.2" fill="#f2f2f2" stroke="#9a9a9a" stroke-width=".8"/><path d="M67 31h8v4l-4 3-4-3z" fill="#2e7d4f"/><path d="M68.5 32.5h5" stroke="#fff" stroke-width=".9"/>' +
      '<text class="wz-fe" x="84" y="37.5" textLength="128" lengthAdjust="spacingAndGlyphs">B 3544</text></svg>';
  }
  function autoSvg() {
    return '<svg viewBox="0 0 300 100" aria-hidden="true">' +
      '<defs><linearGradient id="wzLack" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a3f48"/><stop offset=".35" stop-color="#16181c"/><stop offset="1" stop-color="#0b0c0e"/></linearGradient>' +
      '<linearGradient id="wzGlasA" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#55667a"/><stop offset="1" stop-color="#1b2430"/></linearGradient></defs>' +
      '<ellipse cx="150" cy="93" rx="140" ry="6" fill="rgba(0,0,0,.35)"/>' +
      // Karosserie (Kombi, sportlich)
      '<path d="M14 80 10 60q0-11 10-15L44 23q4-4 12-4h128q8 0 14 5l30 18 46 6q14 3 16 14v10q-1 8-8 8z" fill="url(#wzLack)"/>' +
      '<path d="M44 22h140" stroke="#9aa3ad" stroke-width="2" stroke-linecap="round"/>' +
      // Fenster mit Capy am Steuer
      '<path d="M28 44 47 26h46v18z" fill="url(#wzGlasA)"/><path d="M98 26h52v18H98z" fill="url(#wzGlasA)"/>' +
      '<path d="M155 26h28q6 0 10 4l18 14h-56z" fill="#2a3644"/>' +
      '<g transform="translate(166 21) scale(.5)">' + (ak.capy ? ak.capy.front({}) : "") + '<path d="M10 22h14M32 22h14M24 22q4-2 8 0" stroke="#111" stroke-width="5" stroke-linecap="round"/></g>' +
      '<circle cx="196" cy="42" r="6" fill="none" stroke="#111" stroke-width="2.6"/>' +
      '<path d="M155 26h28q6 0 10 4l18 14h-56z" fill="rgba(170,200,230,.16)"/>' +
      '<path d="M95 26v52M152 26v52" stroke="#050607" stroke-width="2"/>' +
      // Kupferlinie, Logo, Lichter
      '<path d="M18 66h268" stroke="#b87333" stroke-width="1.6" opacity=".9"/>' +
      '<path d="M281 56l4 3-4 3-3-3z" fill="#c88a55"/>' +
      '<path d="M268 50h20l2 4h-20z" fill="#e8f4ff"/><path d="M12 50h12v5H11z" fill="#d6304f"/><path d="M10 52h280" stroke="transparent"/>' +
      // Räder mit Kupferfelgen
      '<g class="wz-rad-a"><circle cx="66" cy="80" r="17" fill="#0d0d0f"/><circle cx="66" cy="80" r="11" fill="#b87333"/><circle cx="66" cy="80" r="4" fill="#3a2a1e"/><path d="M66 69v22M55 80h22M58 72l16 16M74 72 58 88" stroke="#7b4a24" stroke-width="2.2"/></g>' +
      '<g class="wz-rad-b"><circle cx="236" cy="80" r="17" fill="#0d0d0f"/><circle cx="236" cy="80" r="11" fill="#b87333"/><circle cx="236" cy="80" r="4" fill="#3a2a1e"/><path d="M236 69v22M225 80h22M228 72l16 16M244 72 228 88" stroke="#7b4a24" stroke-width="2.2"/></g>' +
      "</svg>";
  }
  let showLaeuft = false;
  function kennzeichenShow() {
    if (showLaeuft) return;
    showLaeuft = true;
    const W = window.innerWidth, H = window.innerHeight;
    const buehne = el("div", "wz-show");
    ebene.appendChild(buehne);
    const zeit = (ms) => (ruhig ? Math.min(ms, 200) : ms);
    let t0 = 0;
    const dann = (ms, f) => { t0 += zeit(ms); setTimeout(f, t0); };

    // 1. Ziffern werden zum Kennzeichen
    const r = cdZiffern.getBoundingClientRect();
    const schild = el("div", "wz-schild-kz", schildSvg());
    const sw = Math.min(W * 0.86, 360);
    Object.assign(schild.style, { width: sw + "px", left: r.left + r.width / 2 - sw / 2 + "px", top: r.top + r.height / 2 - (sw * 48) / 220 / 2 + "px" });
    buehne.appendChild(schild);
    cdZiffern.classList.add("wz-verwandelt");
    schild.animate([{ transform: "rotateX(90deg) scale(.6)", opacity: 0 }, { transform: "rotateX(-12deg) scale(1.05)", opacity: 1, offset: 0.6 }, { transform: "none", opacity: 1 }], { duration: zeit(900), fill: "forwards", easing: "ease-out" });
    plopp(true);

    // 2. Auto fährt rein, Kennzeichen wird angeschraubt
    const aw = Math.min(W * 0.78, 420), ah = aw / 3;
    const auto = el("div", "wz-auto", autoSvg());
    Object.assign(auto.style, { width: aw + "px", top: Math.min(H * 0.8, H - 150) - ah / 2 + "px", left: "0px" });
    buehne.appendChild(auto);
    const zielX = W * 0.36 - aw / 2;
    dann(1600, () => {
      motor(zeit(2200) / 1000, false);
      auto.animate([{ transform: "translateX(" + -aw * 1.2 + "px)" }, { transform: "translateX(" + zielX + "px)" }], { duration: zeit(1800), easing: "cubic-bezier(.2,.7,.3,1)", fill: "forwards" });
      auto.querySelectorAll(".wz-rad-a, .wz-rad-b").forEach((rad) => rad.animate([{ transform: "rotate(0)" }, { transform: "rotate(720deg)" }], { duration: zeit(1800), easing: "cubic-bezier(.2,.7,.3,1)" }));
    });
    dann(2000, () => {
      const ar = auto.getBoundingClientRect(), sr = schild.getBoundingClientRect();
      const ziel = { x: ar.left + aw * 0.005, y: ar.top + ah * 0.6 };
      const skal = (aw * 0.11) / sr.width;
      schild.animate([
        { transform: "none" },
        { transform: "translate(" + (ziel.x - sr.left) * 0.5 + "px," + (ziel.y - sr.top - 80) + "px) rotate(-20deg) scale(.6)", offset: 0.5 },
        { transform: "translate(" + (ziel.x - sr.left) + "px," + (ziel.y - sr.top) + "px) scale(" + skal + ")" },
      ], { duration: zeit(1100), easing: "ease-in-out", fill: "forwards" });
    });
    dann(1150, () => {
      schild.remove();
      const klein = el("div", "wz-schild-hinten", schildSvg());
      auto.appendChild(klein);
      plopp(false);
      cdZiffern.classList.remove("wz-verwandelt");
      auto.animate([{ transform: "translateX(" + zielX + "px) translateY(0)" }, { transform: "translateX(" + zielX + "px) translateY(-3px)" }, { transform: "translateX(" + zielX + "px) translateY(0)" }], { duration: 300, fill: "forwards" });
    });

    // 3. Motor an, Scheinwerfer formen die Worte
    const worte = [["Ich", 3], ["liebe", 5], ["dich", 4], ["Toni", 4]];
    const text = el("div", "wz-lichtschrift", worte.map(([w, n]) => '<span><b>' + w + "</b><small>" + n + "</small></span>").join(""));
    buehne.appendChild(text);
    const kegel = el("div", "wz-kegel");
    dann(900, () => {
      motor(zeit(9000) / 1000, true);
      auto.classList.add("brummt");
      auto.classList.add("licht");
      buehne.insertBefore(kegel, text);
      const ar = auto.getBoundingClientRect(), tr = text.getBoundingClientRect();
      const hx = ar.left + aw * 0.95, hy = ar.top + ah * 0.53;
      kegel.style.clipPath = "polygon(" + hx + "px " + (hy - 3) + "px, " + (tr.left - 10) + "px " + (tr.top - 20) + "px, " + (tr.right + 10) + "px " + (tr.top - 20) + "px, " + (tr.right + 10) + "px " + (tr.bottom + 10) + "px, " + hx + "px " + (hy + 3) + "px)";
      kegel.style.setProperty("--hx", hx + "px");
      kegel.style.setProperty("--hy", hy + "px");
      requestAnimationFrame(() => kegel.classList.add("an"));
    });
    worte.forEach((_, i) => dann(i ? 900 : 700, () => text.children[i].classList.add("da")));
    dann(1200, () => text.classList.add("zahlen"));

    // 4. Hupen, davonfahren, Herzfeuerwerk
    dann(2400, () => { hupe(0); hupe(0.45); const h = el("div", "wz-hup", "HUP HUP! ♥️"); const ar = auto.getBoundingClientRect(); h.style.left = ar.left + aw * 0.7 + "px"; h.style.top = ar.top - 26 + "px"; buehne.appendChild(h); setTimeout(() => h.remove(), 1300); });
    dann(1100, () => {
      kegel.classList.remove("an");
      const dauer = zeit(2600);
      auto.animate([{ transform: "translateX(" + zielX + "px)" }, { transform: "translateX(" + (W + aw * 0.2) + "px)" }], { duration: dauer, easing: "cubic-bezier(.5,0,.8,.6)", fill: "forwards" });
      auto.querySelectorAll(".wz-rad-a, .wz-rad-b").forEach((rad) => rad.animate([{ transform: "rotate(0)" }, { transform: "rotate(1440deg)" }], { duration: dauer, easing: "cubic-bezier(.5,0,.8,.6)" }));
      const spur = setInterval(() => {
        const ar = auto.getBoundingClientRect();
        if (ar.left > W) { clearInterval(spur); return; }
        herzenAus(ar.left + 4, ar.top + ah * 0.55, 5);
      }, 110);
      for (let k = 0; k < 7; k++) setTimeout(() => feuerwerk(zufall(0.15, 0.85) * W, zufall(0.12, 0.42) * H), zeit(400 + k * 420));
    });
    dann(3600, () => { text.classList.add("weg"); buehne.classList.add("weg"); });
    dann(900, () => {
      buehne.remove();
      showLaeuft = false;
      const neu = !geloest();
      schreib("code", true);
      melde("kennzeichen");
      zeigePlakette();
      zeigeGutschein(neu);
    });
  }
  function feuerwerk(x, y) {
    const farben = ["#e85d7e", "#f3c84b", "#ff9ec0", "#fff", "#d6304f"];
    for (let k = 0; k < 16; k++) {
      const h = el("span", "wz-herz", "♥");
      h.style.left = x + "px"; h.style.top = y + "px"; h.style.color = farben[k % farben.length];
      ebene.appendChild(h);
      const w = (k / 16) * Math.PI * 2, r = zufall(60, 100);
      h.animate([
        { transform: "translate(-50%,-50%) scale(.3)", opacity: 1 },
        { transform: "translate(calc(-50% + " + Math.cos(w) * r + "px), calc(-50% + " + Math.sin(w) * r + "px)) scale(1)", opacity: 1, offset: 0.65 },
        { transform: "translate(calc(-50% + " + Math.cos(w) * r * 1.1 + "px), calc(-50% + " + (Math.sin(w) * r * 1.1 + 30) + "px)) scale(.8)", opacity: 0 },
      ], { duration: 1500, easing: "cubic-bezier(.2,.8,.3,1)", fill: "forwards" }).onfinish = () => h.remove();
    }
  }
  function zeigeGutschein(neu) {
    const f = fenster("wz-gutschein",
      '<p class="wz-gs-kopf">Gutschein</p>' +
      '<p class="wz-gs-text">Schokoerdbeeren im Phantasialand<br>am 29.11. ♥️</p>' +
      '<div class="wz-gs-schild">' + schildSvg() + "</div>" +
      '<p class="wz-fakt-fuss">Gültig, sobald du mir einen Screenshot davon per WhatsApp schickst 📸</p>');
    if (neu && ak.konfetti) setTimeout(() => ak.konfetti("konfetti"), 200);
    return f;
  }

  /* =========================================================
     Munkelvogel: Hinweise für heute
     ========================================================= */
  const HINWEISE = {
    marke: () => "Psst … schau dir mal die Briefmarke auf dem Umschlag ganz genau an 🔍",
    knopf: () => "In der rechten Schublade liegt heute ein roter Knopf. Was auch immer du tust: Drück ihn NICHT 😳",
    schuetteln: () => "Man munkelt, im Umschlag klimpert etwas. Wisch ihn mal ganz schnell hin und her 👀",
    adresse: () => "Psst … tipp heute Abend mal auf deinen Namen auf dem Umschlag ✒️",
    licht: () => "Halt den Umschlag mal mit zwei Fingern fest. Vielleicht scheint ja ein Licht hindurch 🔦",
    sternbild: () => "Schau mal nach oben. Wenn du die Sterne der Reihe nach antippst, entsteht ein Bild ✨",
    flieger: () => "Heute fliegt hier ab und zu etwas Papiernes vorbei. Fang es! ✈️",
    tasse: () => "Da unten steht ein Cappuccino für dich. Lass ihn nicht kalt werden ☕",
    scheibe: () => "Brrr, heute Abend wird es kalt. Gleich beschlägt bestimmt die Scheibe … ❄️",
  };
  const SPAETER = {
    mittag: { schuetteln: "Man munkelt, ab 14 Uhr klimpert hier etwas im Umschlag 👀", tasse: "Ab 14 Uhr gibt es hier einen Cappuccino für dich ☕", flieger: "Halt heute ab 14 Uhr mal nach Luftpost Ausschau ✈️" },
    abend: { scheibe: "Schau heute Abend nochmal rein. Ich glaube, dann wird es frostig ❄️", adresse: "Heute Abend hat jemand etwas aufs Adressfeld geschrieben ✒️", licht: "Heute Abend scheint ein Licht durch deinen Umschlag. Schau dann mal vorbei 🔦", sternbild: "Heute Abend steht ein besonderes Sternbild am Himmel ✨" },
  };
  window.adventkalender.wartezeitHinweis = function () {
    const t = heute();
    if (!t) return null;
    const d = datum();
    // Hinweise auf den Code
    if (t === 20 && Math.random() < 0.7) return "Mir hat jemand eine Zahl zugeflüstert. Du siehst sie ständig, sie fährt sogar manchmal mit dir herum, und Chris fährt sie jeden Tag … 🚗";
    if (t === 21 && Math.random() < 0.6) return "Zähl mal die Buchstaben von drei kleinen Worten und deinem Namen 😉";
    if (t >= 22 && !geloest() && Math.random() < 0.6) return "Halt mal den Countdown ganz lange fest … Da ist ein Schloss mit vier Ziffern 🔒";
    const jetzt = [];
    Object.keys(HINWEISE).forEach((k) => { if (istAn(k) && !(k === "flieger" && hatTag("flieger", t)) && !(k === "sternbild" && hatTag("sternbild", t))) jetzt.push(HINWEISE[k]()); });
    if (jetzt.length) return wahl(jetzt);
    if (!hatTag("stempel", t)) return "Psst … halt mal das Siegel ganz lange gedrückt. Jeden Tag gibt es einen neuen Stempel ♥️";
    if (!hatTag("blatt", t)) return "Psst … in der linken Schublade unter der Fensterbank liegt etwas für jeden Tag 📅";
    if (lies("spiegel-" + t, 0) < PRO_TAG) return "Schau mal in die rechte Schublade. Da liegt ein Spiegel, der dir etwas sagen will 🪞";
    const spaeter = [];
    ["mittag", "abend"].forEach((f) => Object.keys(SPAETER[f]).forEach((k) => { if (kommtNoch(k) === f) spaeter.push(SPAETER[f][k]); }));
    if (spaeter.length) return wahl(spaeter);
    if (d.stunde >= 23 || d.stunde < 5) return "Tipp mal auf die Zahlen. Aber leise, die schlafen schon 😴";
    return null;
  };

  /* =========================================================
     Alles an und aus schalten
     ========================================================= */
  // Für das Entdeckerbuch: einzelne Dinge direkt vorspielen
  window.adventkalender.wartezeit = {
    schublade,
    vorspielen(id) {
      if (!heute()) return false;
      const r = umschlag.getBoundingClientRect();
      const punkt = (fx, fy) => ({ clientX: r.left + r.width * fx, clientY: r.top + r.height * fy });
      switch (id) {
        case "stempel": {
          schreib("stempel", lies("stempel", []).filter((x) => x !== heute()));
          const alt = aufUmschlag.querySelector('[data-stempel="' + heute() + '"]');
          if (alt) alt.remove();
          stempeln();
          return true;
        }
        case "schuetteln": geschuettelt(); return true;
        case "licht": {
          if (!lichtAn) return false;
          lichtStart(punkt(0.25, 0.4));
          const weg = [[0.35, 0.45], [0.5, 0.5], [0.62, 0.55], [0.72, 0.62], [0.5, 0.6]];
          weg.forEach(([x, y], i) => setTimeout(() => lichtBewegt(punkt(x, y)), 700 * (i + 1)));
          setTimeout(lichtEnde, 700 * (weg.length + 1) + 600);
          return true;
        }
        case "flieger": schreib("flieger", lies("flieger", []).filter((x) => x !== heute())); starteFlieger(); return true;
        case "scheibe": scheibeGezeigt = false; if (scheibeWarte) { clearInterval(scheibeWarte); scheibeWarte = null; } beschlagen(); return true;
        case "kennzeichen": kennzeichenShow(); return true;
        case "schloss": oeffneSchloss(); return true;
        default: return false;
      }
    },
  };

  let warHeute = -1, reiseVorbereitet = false;
  function pruefe() {
    const t = heute();
    const an = !!t;
    // Zeitreise: die Stempel der Tage davor sind schon da
    if (an && !reiseVorbereitet && ak.zeitreise && ak.zeitreise.aktiv()) {
      reiseVorbereitet = true;
      const vorher = [];
      for (let d = 13; d < t; d++) vorher.push(d);
      schreib("stempel", vorher);
      vorher.forEach((d) => setzeStempel(d, false));
    }
    intro.classList.toggle("wz-aktiv", an);
    if (t !== warHeute) { warHeute = t; if (an) zeichneKalender(); }
    const nacht = an && istNacht() && performance.now() > wachBis;
    intro.classList.toggle("wz-nacht", nacht);
    marken(an && istAn("marke"));
    knoepfe(an && istAn("knopf"));
    schuettelZustand(an && istAn("schuetteln"));
    adressen(an && istAn("adresse"));
    lichtZustand(an && istAn("licht"));
    sternbild(an && istAn("sternbild"));
    fliegerZustand(an && istAn("flieger"));
    tassen(an && istAn("tasse"));
    scheibeZustand(an && istAn("scheibe"));
    if (!an && offenesFenster && !intro.classList.contains("weg")) { /* Fenster bleibt, bis sie es schließt */ }
  }
  setInterval(pruefe, 1000);
  pruefe();
})();
