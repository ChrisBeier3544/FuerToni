/*
 * ===========================================================
 *  ROTKEHLCHEN
 *  Sitzt auf einem von 5 Plätzen, sagt den Tagesgruß, fliegt
 *  10 Sekunden später auf einer von 10 Routen davon und landet
 *  danach auf einem neuen Platz. An besonderen Tagen zu zweit.
 * ===========================================================
 */
(function () {
  "use strict";

  const ak = window.adventkalender;
  const intro = document.getElementById("intro");
  const grussQuelle = document.getElementById("gruss");
  if (!ak || !ak.intro || !grussQuelle) return;
  const ruhig = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const GROESSE = 52;

  /* ---------- Aussehen ---------- */
  function vogelSvg(weiblich) {
    const ruecken = weiblich ? "#a0704b" : "#8a5a3a", brust = weiblich ? "#f6877a" : "#f26b5b", fluegel = weiblich ? "#86593b" : "#6b4632";
    return '<svg viewBox="0 0 60 60" aria-hidden="true">' +
      '<g class="beine"><path d="M24 50l-3 6M30 50l3 6M21 56h-4M21 56l-2 3M33 56h4M33 56l2 3" stroke="#e39a3b" stroke-width="2.2" stroke-linecap="round"/></g>' +
      '<g class="vogel-koerper">' +
      '<path class="fluegel-hinten" d="M30 26q-18-18-26-6q8 2 14 10z" fill="' + fluegel + '"/>' +
      '<path d="M8 34q-8 2-6 9q6-1 10-6z" fill="' + fluegel + '"/>' +
      '<ellipse cx="28" cy="32" rx="21" ry="19" fill="' + ruecken + '"/>' +
      '<ellipse cx="30" cy="38" rx="15" ry="13" fill="' + brust + '"/>' +
      '<ellipse cx="31" cy="42" rx="10" ry="8" fill="#fff2e4"/>' +
      '<path class="fluegel-vorne" d="M14 30q-4 10 6 14q-4-8-6-14z" fill="' + fluegel + '"/>' +
      '<path d="M26 13q2-6 6-5q-3 1-3 5z" fill="' + ruecken + '"/>' +
      '<circle cx="22" cy="28" r="5" fill="#fff"/><circle cx="36" cy="28" r="5" fill="#fff"/>' +
      '<circle cx="23" cy="29" r="3.2" fill="#2a1a12"/><circle cx="37" cy="29" r="3.2" fill="#2a1a12"/>' +
      '<circle cx="24.2" cy="27.6" r="1.2" fill="#fff"/><circle cx="38.2" cy="27.6" r="1.2" fill="#fff"/>' +
      (weiblich ? '<path d="M17 23.5l-2-2M19.5 22.6l-.8-2.6M38.5 22.6l.8-2.6M41 23.5l2-2" stroke="#2a1a12" stroke-width="1.1" stroke-linecap="round"/>' : "") +
      '<rect class="augenlid" x="16.5" y="23" width="11" height="11" rx="5.5" fill="' + ruecken + '"/><rect class="augenlid" x="30.5" y="23" width="11" height="11" rx="5.5" fill="' + ruecken + '"/>' +
      '<path d="M27 33l2.5 4 2.5-4z" fill="#f3b23c"/>' +
      '<circle cx="17" cy="35" r="3" fill="#ff9fb4" opacity=".7"/><circle cx="41" cy="35" r="3" fill="#ff9fb4" opacity=".7"/>' +
      (weiblich ? '<g transform="translate(36 14) rotate(18)"><path d="M0 0-6-4v8zM0 0l6-4v8z" fill="#ff7aa2"/><circle r="2" fill="#ffd0dc"/></g>' : "") +
      "</g></svg>";
  }

  /* ---------- Plätze (Bildschirmkoordinaten der Füße) ---------- */
  const sichtbar = (el) => el && el.offsetParent !== null && el.getBoundingClientRect().width > 0;
  const PLAETZE_KALENDER = {
    karte: () => { const e = document.querySelector(".heute-karte"); if (!sichtbar(e)) return null; const r = e.getBoundingClientRect(); return { x: r.right - 40, y: r.top + 1 }; },
    polaroid: () => { const e = document.querySelector("#titelfotos .polaroid:last-child"); if (!sichtbar(e)) return null; const r = e.getBoundingClientRect(); return { x: r.left + r.width * 0.68, y: r.top + 4 }; },
    kette: () => { const k = document.getElementById("lichterkette"); const b = k && k.querySelectorAll(".birne")[7]; if (!sichtbar(k) || !b || k.classList.contains("noch-nicht")) return null; const r = b.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top - 2 }; },
    // Adventskranz (ab dem 1. Advent), vorher die Überschrift „Unsere Momente“
    kranz: () => {
      const k = document.querySelector("#adventskranz svg");
      if (sichtbar(k) && !document.getElementById("adventskranz").hidden) { const r = k.getBoundingClientRect(); return { x: r.left + r.width * 0.86, y: r.top + r.height * 0.42 }; }
      const m = document.getElementById("momente-titel"); if (!sichtbar(m)) return null;
      const r = m.getBoundingClientRect(); return { x: r.left + r.width * 0.5 + 92, y: r.top + 17 };
    },
    regal: () => { const e = document.getElementById("kalender"); if (!sichtbar(e)) return null; const r = e.getBoundingClientRect(); return { x: r.left + r.width * 0.22, y: r.top + 2 }; },
  };
  const PLAETZE_COUNTDOWN = {
    countdown: () => {
      const e = document.getElementById("countdown-ziffern"); if (!sichtbar(e) || !e.textContent) return null;
      const r = e.getBoundingClientRect();
      // am liebsten rechts neben den Ziffern, damit nichts von der Schrift verdeckt wird
      if (r.right + 24 + GROESSE / 2 < W() - 8) return { x: r.right + 24, y: r.bottom - 4 };
      const t = document.getElementById("countdown-titel"), tr = t && t.getBoundingClientRect();
      if (!tr || !tr.width || r.right - 22 - GROESSE / 2 > tr.right + 4) return { x: r.right - 22, y: r.top + 1 };
      return null;
    },
    umschlagLinks: () => { const e = document.getElementById("umschlag"); if (!sichtbar(e)) return null; const r = e.getBoundingClientRect(); return { x: r.left + 34, y: r.top + 3 }; },
    umschlagRechts: () => { const e = document.getElementById("umschlag"); if (!sichtbar(e)) return null; const r = e.getBoundingClientRect(); return { x: r.right - 34, y: r.top + 3 }; },
    siegel: () => { const e = document.querySelector("#umschlag .siegel"); if (!sichtbar(e)) return null; const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + 4 }; },
    hinweis: () => { const e = document.getElementById("intro-hinweis"); if (!sichtbar(e) || !e.textContent) return null; const r = e.getBoundingClientRect(); return { x: Math.min(window.innerWidth - 30, r.right + 26), y: r.top + 14 }; },
  };
  function kontext() {
    const phase = ak.intro.phase();
    if (!intro.hidden && (phase === "warten" || phase === "geburtstag")) return "countdown";
    if (intro.hidden) return "kalender";
    return null; // Umschlag zu, aber noch nicht geöffnet: kein Vogel
  }
  const plaetze = (k) => (k === "countdown" ? PLAETZE_COUNTDOWN : PLAETZE_KALENDER);
  const ERSTER_PLATZ = { countdown: "countdown", kalender: "karte" };

  /* ---------- Flugrouten (10 Stück), Punkte relativ zum Bildschirm ---------- */
  const W = () => window.innerWidth, H = () => window.innerHeight;
  const ROUTEN = [
    (s) => [s, { x: s.x + 60, y: s.y - 80 }, { x: W() + 90, y: -60 }],                                       // schräg nach rechts oben
    (s) => [s, { x: s.x - 60, y: s.y - 80 }, { x: -90, y: -60 }],                                            // schräg nach links oben
    (s) => [s, { x: s.x + 70, y: s.y - 40 }, { x: s.x + 40, y: s.y - 130 }, { x: s.x - 30, y: s.y - 70 }, { x: s.x + 30, y: s.y - 20 }, { x: W() + 90, y: s.y - 160 }], // Looping
    (s) => [s, { x: s.x - 50, y: s.y - 50 }, { x: s.x + 10, y: s.y - 100 }, { x: s.x - 70, y: s.y - 150 }, { x: s.x - 10, y: s.y - 200 }, { x: -90, y: -80 }], // Zickzack
    (s) => [s, { x: s.x + 40, y: s.y + 70 }, { x: s.x + 140, y: s.y + 40 }, { x: W() + 90, y: s.y - 200 }],   // Sturzflug mit Aufschwung
    (s) => { const p = [s]; for (let k = 1; k <= 7; k++) { const w = k * 1.1, r = 26 + k * 12; p.push({ x: s.x + Math.cos(w) * r, y: s.y - k * 28 + Math.sin(w) * r * 0.5 }); } p.push({ x: s.x, y: -100 }); return p; }, // Spirale
    (s) => [s, { x: s.x - 40, y: s.y - 90 }, { x: W() * 0.5, y: Math.max(40, s.y - 220) }, { x: W() + 90, y: s.y - 60 }],  // großer Bogen
    (s) => { const p = [s]; const n = 6; for (let k = 1; k <= n; k++) p.push({ x: s.x + ((W() + 100 - s.x) * k) / n, y: s.y - 40 + (k % 2 ? -30 : 30) }); return p; }, // Wellenflug
    (s) => [s, { x: s.x - 20, y: s.y - 18 }, { x: s.x - 40, y: s.y }, { x: s.x - 60, y: s.y - 18 }, { x: s.x - 80, y: s.y }, { x: s.x - 160, y: s.y - 120 }, { x: -90, y: s.y - 220 }], // Hüpfer und Abflug
    (s) => { const p = [s]; for (let k = 1; k <= 8; k++) { const w = -Math.PI / 2 + (k / 8) * Math.PI * 2; p.push({ x: s.x + Math.cos(w) * 55, y: s.y - 55 + Math.sin(w) * 40 }); } p.push({ x: -90, y: s.y - 120 }); return p; }, // Kreis um den Platz
  ];
  // Kurve durch alle Punkte (Catmull-Rom)
  function punktAuf(p, t) {
    const n = p.length - 1, i = Math.min(n - 1, Math.floor(t * n)), u = t * n - i;
    const p0 = p[Math.max(0, i - 1)], p1 = p[i], p2 = p[i + 1], p3 = p[Math.min(n, i + 2)];
    const f = (a, b, c, d) => 0.5 * ((2 * b) + (-a + c) * u + (2 * a - 5 * b + 4 * c - d) * u * u + (-a + 3 * b - 3 * c + d) * u * u * u);
    return { x: f(p0.x, p1.x, p2.x, p3.x), y: f(p0.y, p1.y, p2.y, p3.y) };
  }

  /* ---------- Ein Vogel ---------- */
  const ebene = document.createElement("div");
  ebene.className = "vogel-ebene";
  document.body.appendChild(ebene);
  const voegel = [];

  function erstelleVogel(weiblich, saetze) {
    const el = document.createElement("button");
    el.type = "button";
    el.className = "vogel" + (weiblich ? " weibchen" : "");
    el.setAttribute("aria-label", weiblich ? "Munkelvogel Weibchen antippen" : "Munkelvogel antippen");
    el.innerHTML = '<span class="vogel-blase" hidden></span>' + vogelSvg(weiblich);
    el.hidden = true;
    ebene.appendChild(el);
    const v = { el, blase: el.querySelector(".vogel-blase"), weiblich, saetze, platz: null, kontext: null, zustand: "weg", pos: null, blick: 1, timer: [], flugTimer: null };
    el.addEventListener("click", () => {
      if (v.zustand !== "sitzt") return;
      el.classList.remove("hopst"); void el.offsetWidth; el.classList.add("hopst");
      sprich(v);
    });
    voegel.push(v);
    return v;
  }

  // p ist in Bildschirmkoordinaten; gesetzt wird in Seitenkoordinaten, damit der Vogel beim Scrollen still sitzt
  function setzePosition(v, p) {
    v.pos = p;
    v.seite = { x: p.x + window.scrollX, y: p.y + window.scrollY };
    v.el.style.transform = "translate(" + (v.seite.x - GROESSE / 2).toFixed(1) + "px," + (v.seite.y - GROESSE).toFixed(1) + "px)";
    v.el.querySelector("svg").style.transform = v.blick < 0 ? "scaleX(-1)" : "";
  }

  function sprich(v) {
    v.timer.forEach(clearTimeout); v.timer = [];
    clearTimeout(v.flugTimer);
    const liste = v.saetze().filter(Boolean);
    if (!liste.length) { planeAbflug(v); return; }
    liste.forEach((satz, i) => v.timer.push(setTimeout(() => zeigeBlase(v, satz), i * 5600)));
    v.timer.push(setTimeout(() => { v.blase.hidden = true; v.el.classList.remove("redet"); planeAbflug(v); }, liste.length * 5600 - 600));
  }
  function zeigeBlase(v, satz) {
    if (v.zustand !== "sitzt") return;
    // nur sprechen, wenn der Vogel gerade zu sehen ist
    const sicht = v.el.getBoundingClientRect();
    if (sicht.bottom < 20 || sicht.top > window.innerHeight - 20) { v.blase.hidden = true; return; }
    // die Blase des anderen Vogels ausblenden, damit sie sich nicht überlappen
    voegel.forEach((a) => { if (a !== v) { a.blase.hidden = true; a.el.classList.remove("redet"); } });
    v.blase.textContent = satz;
    v.blase.classList.remove("seitlich", "rechts-vom-vogel");
    v.blase.classList.toggle("unten", v.pos && v.pos.y < 140);
    v.blase.style.left = "0px"; v.blase.style.right = "auto";
    v.blase.hidden = false;
    v.el.classList.add("redet");
    // Blase so legen, dass die Spitze genau auf den Kopf zeigt, und im Bild halten
    const breite = v.blase.offsetWidth, kopf = GROESSE / 2, rand = 10;
    const vogelLinks = v.pos.x - GROESSE / 2;
    let links = kopf + 22 - breite;
    if (vogelLinks + links < rand) links = rand - vogelLinks;
    if (vogelLinks + links + breite > W() - rand) links = W() - rand - breite - vogelLinks;
    v.blase.style.left = links.toFixed(0) + "px";
    v.blase.style.setProperty("--spitze", Math.max(8, Math.min(breite - 22, kopf - links - 7)).toFixed(0) + "px");
    // Gesichter und wichtige Schrift nie verdecken: oben, seitlich oder unten probieren
    // und die erste Lage nehmen, die nichts verdeckt (sonst die mit der kleinsten Überdeckung)
    const andere = voegel.find((a) => a !== v && a.zustand === "sitzt" && a.pos && Math.abs(a.pos.x - v.pos.x) < 80);
    const platzLinks = vogelLinks - 4 - rand, platzRechts = W() - rand - (vogelLinks + GROESSE + 4);
    const lege = (art) => {
      v.blase.classList.remove("seitlich", "rechts-vom-vogel", "unten");
      v.blase.style.maxWidth = "";
      if (art === "oben" || art === "unten") {
        v.blase.classList.toggle("unten", art === "unten");
        v.blase.style.left = links.toFixed(0) + "px";
        return;
      }
      const linksDavon = art === "links";
      const platz = linksDavon ? platzLinks : platzRechts;
      v.blase.classList.add("seitlich");
      v.blase.classList.toggle("rechts-vom-vogel", !linksDavon);
      v.blase.style.maxWidth = Math.max(110, Math.min(250, platz)) + "px";
      const b2 = v.blase.offsetWidth;
      v.blase.style.left = (linksDavon ? -b2 - 4 : GROESSE + 4).toFixed(0) + "px";
    };
    const vorne = v.pos && v.pos.y < 140 ? ["unten", "oben"] : ["oben", "unten"];
    // seitlich zuerst weg vom Partner, sonst dorthin, wo mehr Platz ist
    const seiten = (andere ? andere.pos.x > v.pos.x : platzLinks >= platzRechts) ? ["links", "rechts"] : ["rechts", "links"];
    const reihe = [vorne[0], ...seiten.filter((x) => (x === "links" ? platzLinks : platzRechts) >= 110), vorne[1]];
    let beste = null;
    for (const art of reihe) {
      lege(art);
      const wert = verdeckung(v.blase);
      if (wert === 0) { beste = null; break; }
      if (!beste || wert < beste.wert) beste = { art, wert };
    }
    if (beste) lege(beste.art);
  }
  // Wie viel Fläche die Blase von Fotos, wichtiger Schrift oder dem Bildrand verdeckt
  function verdeckung(blase) {
    const b = blase.getBoundingClientRect();
    const intro = document.getElementById("intro");
    const sel = intro && !intro.hidden
      ? "#intro .umschlag-name, #intro .countdown-ziffern, #intro .countdown-titel, #intro .siegel, #intro .countdown-gruss, #intro .intro-hinweis"
      : ".polaroid img, .lightbox-figur img, #titel, .heute-karte .status, .zaehler-zahl";
    let summe = 0;
    document.querySelectorAll(sel).forEach((e) => {
      const r = e.getBoundingClientRect();
      if (!r.width) return;
      const w = Math.min(b.right, r.right - 4) - Math.max(b.left, r.left + 4), h = Math.min(b.bottom, r.bottom - 4) - Math.max(b.top, r.top + 4);
      if (w > 0 && h > 0) summe += w * h;
    });
    // außerhalb des Bildschirms zählt doppelt
    const aussen = Math.max(0, 4 - b.top) + Math.max(0, b.bottom - (window.innerHeight - 4)) + Math.max(0, 4 - b.left) + Math.max(0, b.right - (W() - 4));
    return summe + aussen * b.width * 2;
  }

  // 10 Sekunden nach dem Sprechen (oder Landen) geht es los
  // 10 Sekunden nach dem ersten Gruß, nach jeder weiteren Landung 15 Sekunden.
  // Das Weibchen fliegt nie allein los, es folgt dem Männchen.
  function planeAbflug(v) {
    clearTimeout(v.flugTimer);
    if (ruhig || v.partner) return;
    v.flugTimer = setTimeout(() => fliegeWeg(v), v.gelandet ? 15000 : 10000);
  }

  function animiere(v, punkte, dauer, zielFn) {
    return new Promise((fertig) => {
      const start = performance.now();
      let letztes = punkte[0];
      function schritt(t) {
        const u = Math.min(1, (t - start) / dauer);
        const e = u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2;
        if (zielFn) { const z = zielFn(); if (z) punkte[punkte.length - 1] = z; }
        const p = punktAuf(punkte, e);
        if (Math.abs(p.x - letztes.x) > 0.5) v.blick = p.x > letztes.x ? 1 : -1;
        letztes = p;
        setzePosition(v, p);
        if (u < 1 && v.zustand === "fliegt") requestAnimationFrame(schritt); else fertig();
      }
      requestAnimationFrame(schritt);
    });
  }

  async function fliegeWeg(v) {
    if (v.zustand !== "sitzt" || document.hidden) { planeAbflug(v); return; }
    v.blase.hidden = true; v.el.classList.remove("redet");
    v.zustand = "fliegt";
    v.el.classList.add("fliegt");
    const route = ROUTEN[Math.floor(Math.random() * ROUTEN.length)](v.pos);
    const folger = voegel.find((a) => a.partner === v && a.zustand === "sitzt");
    if (folger) setTimeout(() => fliegeWeg(folger), 700);
    await animiere(v, route, 2400 + Math.random() * 900);
    if (v.zustand !== "fliegt") return;
    v.el.hidden = true;
    if (v.partner) {
      // warten, bis das Männchen seinen neuen Platz ausgesucht hat
      while (!v.partner.ziel && v.partner.zustand !== "sitzt") await new Promise((r) => setTimeout(r, 200));
      await new Promise((r) => setTimeout(r, 600));
    } else {
      await new Promise((r) => setTimeout(r, 2500 + Math.random() * 3000));
    }
    lande(v, false);
  }

  // Das Weibchen sitzt direkt neben dem Männchen
  function sitzpunkt(v, k, name) {
    const f = plaetze(k)[name];
    const p = f && f();
    if (!p) return null;
    if (!v.partner) return p;
    const rechts = p.x + 50 < W() - 20;
    return { x: p.x + (rechts ? 46 : -46), y: p.y };
  }
  function freierPlatz(v, k) {
    if (v.partner) return v.partner.ziel || v.partner.platz;
    const liste = Object.keys(plaetze(k)).filter((name) => name !== v.platz && !voegel.some((a) => a !== v && a.platz === name && a.kontext === k) && plaetze(k)[name]());
    if (!liste.length) return null;
    return liste[Math.floor(Math.random() * liste.length)];
  }

  async function lande(v, sofort) {
    const k = kontext();
    if (!k) { v.zustand = "weg"; v.el.hidden = true; v.platz = null; await new Promise((r) => setTimeout(r, 1000)); return lande(v, sofort); }
    const name = sofort ? (v.partner ? freierPlatz(v, k) : ERSTER_PLATZ[k]) : freierPlatz(v, k);
    const zielFn = name && (() => sitzpunkt(v, k, name));
    if (!zielFn || !zielFn()) { await new Promise((r) => setTimeout(r, 1500)); return lande(v, sofort); }
    v.ziel = name;
    v.platz = name; v.kontext = k;
    v.el.classList.toggle("im-countdown", k === "countdown");
    if (sofort || ruhig) {
      v.zustand = "sitzt"; v.el.classList.remove("fliegt"); v.el.hidden = false; v.ziel = null;
      setzePosition(v, zielFn());
      return;
    }
    // Anflug von außerhalb des Bildschirms
    const z = zielFn(), vonLinks = Math.random() < 0.5;
    const start = { x: vonLinks ? -80 : W() + 80, y: Math.max(-60, z.y - 200 - Math.random() * 120) };
    const mitte = { x: (start.x + z.x) / 2 + (vonLinks ? 40 : -40), y: Math.min(start.y, z.y) - 60 };
    v.zustand = "fliegt"; v.el.classList.add("fliegt"); v.el.hidden = false;
    await animiere(v, [start, mitte, { x: z.x + (vonLinks ? -30 : 30), y: z.y - 30 }, z], 2600, zielFn);
    if (v.zustand !== "fliegt") return;
    v.zustand = "sitzt"; v.el.classList.remove("fliegt"); v.ziel = null;
    v.el.classList.remove("hopst"); void v.el.offsetWidth; v.el.classList.add("hopst");
    v.gelandet = (v.gelandet || 0) + 1;
    planeAbflug(v);
  }

  // Sitzende Vögel bleiben beim Scrollen auf ihrem Platz
  function festhalten() {
    for (const v of voegel) {
      if (v.zustand !== "sitzt") continue;
      const k = kontext();
      if (k !== v.kontext && v.partner) { v.zustand = "weg"; v.el.hidden = true; v.platz = null; v.blase.hidden = true; setTimeout(() => lande(v, false), 1800); continue; }
      if (k !== v.kontext) { v.zustand = "weg"; v.el.hidden = true; clearTimeout(v.flugTimer); v.timer.forEach(clearTimeout); v.blase.hidden = true; v.platz = null; lande(v, true).then(() => { if (v === voegel[0] || v.weiblich) setTimeout(() => sprich(v), 2000); }); continue; }
      // nur nachführen, wenn sich der Platz auf der Seite wirklich verschoben hat
      const p = sitzpunkt(v, k, v.platz);
      if (p && v.seite) {
        const dx = p.x + window.scrollX - v.seite.x, dy = p.y + window.scrollY - v.seite.y;
        if (Math.abs(dx) > 1.5 || Math.abs(dy) > 1.5) setzePosition(v, p);
      }
    }
    requestAnimationFrame(festhalten);
  }

  /* ---------- Was die Vögel sagen ---------- */
  const erstesEi = Math.min(...(KALENDER.eastereggs || []).map((e) => e.ab || 99));
  const HINWEIS = "Psst … auf dieser Seite sind Geheimnisse versteckt 🤫 Wenn ein Emoji mal an einer komischen Stelle ist, lohnt sich ein Klick darauf!";
  // An einigen Tagen verrät das Rotkehlchen eine kleine Überraschung zum Antippen
  const abends = () => /abend|nacht/.test(document.documentElement.getAttribute("data-tageszeit") || "");
  const TIPPS = {
    2: () => "Psst … tipp mal auf eine brennende Kerze am Adventskranz 🕯️",
    7: () => "Psst … die Lichterkette mag es, wenn man sie antippt ✨",
    9: () => "Psst … halt mal ein Polaroid oben ein bisschen gedrückt 📸",
    12: () => "Psst … tipp mal auf eine Weihnachtskugel oben in der Ecke 🎄 Mit Ton klingt sie sogar!",
    15: () => abends() ? "Psst … tipp heute mal auf den Mond 🌙" : "Psst … wenn die Sonne scheint, tipp sie mal an ☀️",
    18: () => "Psst … schau mal, was die zwei Capys ganz unten machen, wenn du sie antippst 😘",
    22: () => abends() ? "Psst … tipp mal auf den Mond, aber nur, wenn du dir was wünschen willst 🌠" : "Psst … heute Abend lohnt sich ein Tipp auf den Mond 🌙",
    1: () => "Psst … unter dem Kalender liegt Plätzchenteig. Tipp mal drauf 🍪",
    3: () => "Psst … im Dorf ganz unten steht ein Briefkasten. Schau mal, ob Post für dich drin ist 💌",
    6: () => "Psst … unten im Schnee liegt eine kleine Kugel. Daraus lässt sich bestimmt was bauen ⛄",
    10: () => "Psst … schüttel mal die Schneekugel neben dem Adventskranz ❄️",
    11: () => abends() ? "Psst … oben blinkt heute ein Stern. Tipp ihn an und wünsch dir was 🌟" : "Psst … heute Abend blinkt oben ein Stern. Dem darfst du einen Wunsch verraten 🌟",
    14: () => "Psst … leg mal einen Daumen ganz an den linken und einen ganz an den rechten Rand und halt kurz fest 🌿",
    16: () => "Psst … tipp mal auf ein Fenster unten im Dorf. Mal sehen, was die Capys gerade machen 🏠",
    19: () => "Psst … tipp mal auf einen Schornstein im Dorf 🏡",
    20: () => "Psst … heute fallen ab und zu goldene Schneeflocken. Fang mal 5 Stück ✨",
    23: () => "Psst … zieh mal ein Birnchen der Lichterkette nach unten 💡",
  };
  const tag = () => (ak.kalenderDatum ? ak.kalenderDatum() : ak.intro.datum());
  function saetzeMaennchen() {
    const liste = [grussQuelle.textContent || ""];
    const d = tag();
    if (d.jahr === KALENDER.jahr && d.monat === 12 && d.tag === erstesEi - 1) liste.push(HINWEIS);
    else if (d.jahr === KALENDER.jahr && d.monat === 12 && TIPPS[d.tag]) liste.push(TIPPS[d.tag]());
    return liste;
  }
  function saetzeWeibchen() {
    const d = ak.intro.datum();
    if (d.monat === 11 && d.tag === 26) return ["Happy Birthday, Toni! Wir zwei feiern heute mit dir 🎂"];
    if (d.monat === 12 && d.tag === 21) return ["Wir zwei feiern heute mit euch. Ein Jahr, wie schön ♥️"];
    if (d.monat === 12 && d.tag === 24) return ["Frohe Weihnachten! Heute sind wir zu zweit für dich da 🎄"];
    return ["Wir zwei sind heute zusammen hier ♥️"];
  }
  // Zu zweit: am Geburtstag, am Jahrestag und an Heiligabend
  function zuZweit() {
    const d = ak.intro.datum();
    return d.jahr === KALENDER.jahr && ((d.monat === 11 && d.tag === 26) || (d.monat === 12 && (d.tag === 21 || d.tag === 24)));
  }

  /* ---------- Start ---------- */
  const maennchen = erstelleVogel(false, saetzeMaennchen);
  let weibchen = null;
  const warten = setInterval(() => {
    if (!ak.intro.bereit() || !grussQuelle.textContent) return;
    if (!kontext()) return;
    clearInterval(warten);
    lande(maennchen, true).then(() => setTimeout(() => sprich(maennchen), 2000));
    if (zuZweit()) {
      weibchen = erstelleVogel(true, saetzeWeibchen);
      weibchen.partner = maennchen;
      setTimeout(() => lande(weibchen, false).then(() => setTimeout(() => { if (weibchen.zustand === "sitzt") sprich(weibchen); }, 5200)), 3800);
    }
    requestAnimationFrame(festhalten);
  }, 250);

  // Von außen: das Rotkehlchen sagt einen Satz, falls es gerade sitzt (sonst false)
  function sage(satz) {
    const v = voegel[0];
    if (!v || v.zustand !== "sitzt" || v.el.hidden) return false;
    const r = v.el.getBoundingClientRect();
    if (r.bottom < 0 || r.top > window.innerHeight) return false;
    v.timer.forEach(clearTimeout); v.timer = [];
    clearTimeout(v.flugTimer);
    zeigeBlase(v, satz);
    v.timer.push(setTimeout(() => { v.blase.hidden = true; v.el.classList.remove("redet"); planeAbflug(v); }, 5600));
    return true;
  }
  window.adventkalender.voegel = { voegel, sage, fliegeWeg: (i) => fliegeWeg(voegel[i || 0]), ROUTEN: ROUTEN.length };
})();
