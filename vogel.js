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
  function vogelSvg(weiblich, aussehen, kleidung) {
    const a = aussehen || {};
    // Kleidung aus dem Ankleidezimmer (nur für die beiden Munkelvögel, nicht für die Gäste)
    const L = !aussehen && ak.styling ? ak.styling.schichten(weiblich, kleidung) : { kopf: "", hals: "", augen: "", fuesse: "", extra: "" };
    const ruecken = a.ruecken || (weiblich ? "#a0704b" : "#8a5a3a"), brust = a.brust || (weiblich ? "#f6877a" : "#f26b5b"), fluegel = a.fluegel || (weiblich ? "#86593b" : "#6b4632");
    return '<svg viewBox="0 0 60 60" aria-hidden="true">' +
      '<g class="beine"><path d="M24 50l-3 6M30 50l3 6M21 56h-4M21 56l-2 3M33 56h4M33 56l2 3" stroke="#e39a3b" stroke-width="2.2" stroke-linecap="round"/>' + L.fuesse + '</g>' +
      '<g class="vogel-koerper">' +
      '<path class="fluegel-hinten" d="M30 26q-18-18-26-6q8 2 14 10z" fill="' + fluegel + '"/>' +
      '<path d="M8 34q-8 2-6 9q6-1 10-6z" fill="' + fluegel + '"/>' +
      '<ellipse cx="28" cy="32" rx="21" ry="19" fill="' + ruecken + '"/>' +
      '<ellipse cx="30" cy="38" rx="15" ry="13" fill="' + brust + '"/>' +
      '<ellipse cx="31" cy="42" rx="10" ry="8" fill="#fff2e4"/>' +
      '<ellipse class="bauch" cx="30.5" cy="44" rx="13.5" ry="10.5" fill="#fff2e4"/><ellipse class="bauch" cx="25.5" cy="40.5" rx="4.2" ry="2.4" fill="#fff" opacity=".7"/>' +
      '<path class="fluegel-vorne" d="M14 30q-4 10 6 14q-4-8-6-14z" fill="' + fluegel + '"/>' + L.hals +
      '<path d="M26 13q2-6 6-5q-3 1-3 5z" fill="' + ruecken + '"/>' +
      '<circle cx="22" cy="28" r="5" fill="#fff"/><circle cx="36" cy="28" r="5" fill="#fff"/>' +
      '<circle cx="23" cy="29" r="3.2" fill="#2a1a12"/><circle cx="37" cy="29" r="3.2" fill="#2a1a12"/>' +
      '<circle cx="24.2" cy="27.6" r="1.2" fill="#fff"/><circle cx="38.2" cy="27.6" r="1.2" fill="#fff"/>' +
      (weiblich ? '<path d="M17 23.5l-2-2M19.5 22.6l-.8-2.6M38.5 22.6l.8-2.6M41 23.5l2-2" stroke="#2a1a12" stroke-width="1.1" stroke-linecap="round"/>' : "") +
      '<rect class="augenlid" x="16.5" y="23" width="11" height="11" rx="5.5" fill="' + ruecken + '"/><rect class="augenlid" x="30.5" y="23" width="11" height="11" rx="5.5" fill="' + ruecken + '"/>' +
      '<path d="M27 33l2.5 4 2.5-4z" fill="#f3b23c"/>' +
      '<g class="kruemel"><path d="M32.6 36.4l2.4-.7 1 1.8-1.7 1.2-1.9-.7z" fill="#b8763f"/><path d="M33.4 36.6l1.4-.3" stroke="#fff4e6" stroke-width=".7" stroke-linecap="round"/><circle cx="25.4" cy="38.6" r="1" fill="#a0612e"/><circle cx="38.2" cy="40" r=".8" fill="#c98a4f"/></g>' +
      '<circle cx="17" cy="35" r="3" fill="#ff9fb4" opacity=".7"/><circle cx="41" cy="35" r="3" fill="#ff9fb4" opacity=".7"/>' +
      L.augen + (L.extra ? L.extra + '<path d="M44.5 31.5q5 9.5 -5.5 14q3.5 -7.5 5.5 -14z" fill="' + fluegel + '"/>' : "") +
      (weiblich && !a.deko && !L.kopf ? '<g transform="translate(36 14) rotate(18)"><path d="M0 0-6-4v8zM0 0l6-4v8z" fill="#ff7aa2"/><circle r="2" fill="#ffd0dc"/></g>' : "") +
      (a.deko ? DEKO[a.deko](a.farbe || "#d6304f") : "") + L.kopf +
      "</g></svg>";
  }
  // Weihnachtliche Deko für die Freunde der Munkelvogeline
  const DEKO = {
    muetze: (c) => '<path d="M14 18 C18 2 40 0 46 14 L40 18z" fill="' + c + '"/><rect x="12" y="15" width="34" height="6" rx="3" fill="#fff"/><circle cx="48" cy="12" r="4" fill="#fff"/>',
    schal: (c) => '<path d="M12 44 q18 8 36 0 v6 q-18 8 -36 0z" fill="' + c + '"/><rect x="36" y="46" width="6" height="12" rx="2" fill="' + c + '"/><path d="M15 47h28" stroke="#fff" stroke-width="1.6" stroke-dasharray="3 3"/>',
    ohren: (c) => '<path d="M12 26 q0 -18 34 -14" fill="none" stroke="#6b5560" stroke-width="2.4"/><circle cx="11" cy="28" r="6" fill="' + c + '"/><circle cx="47" cy="22" r="6" fill="' + c + '"/><circle cx="11" cy="28" r="3" fill="#fff" opacity=".5"/><circle cx="47" cy="22" r="3" fill="#fff" opacity=".5"/>',
    geweih: (c) => '<path d="M20 14 l-4 -10 M17 7 l-5 -2 M38 14 l4 -10 M41 7 l5 -2" stroke="#8a5a3a" stroke-width="2.4" stroke-linecap="round"/><circle cx="29.5" cy="35" r="3.4" fill="#ff3b3b"/>',
    pudel: (c) => '<path d="M15 20 a14 12 0 0 1 28 0z" fill="' + c + '"/><path d="M15 20h28" stroke="#fff" stroke-width="3"/><path d="M19 15h20M21 11h16" stroke="#fff" stroke-width="1.6" opacity=".6"/><circle cx="29" cy="6" r="4.5" fill="#fff"/>',
    stern: (c) => '<path d="M14 18 q15 -12 30 0" fill="none" stroke="#d4a84b" stroke-width="2"/><path d="M29 2 l2.4 5 5.4.6 -4 3.7 1.1 5.3 -4.9 -2.8 -4.9 2.8 1.1 -5.3 -4 -3.7 5.4 -.6z" fill="' + c + '"/>',
    fliege: (c) => '<path d="M30 46 l-8 -5 v10z M30 46 l8 -5 v10z" fill="' + c + '"/><circle cx="30" cy="46" r="2.4" fill="#fff" opacity=".8"/>',
    glocke: (c) => '<path d="M14 44 q16 7 32 0" fill="none" stroke="#d6304f" stroke-width="2.6"/><path d="M26 47 q4 -8 8 0 v3 h-8z" fill="' + c + '"/><circle cx="30" cy="51" r="1.6" fill="#a97b2c"/>',
    mistel: (c) => '<ellipse cx="38" cy="15" rx="6" ry="2.6" transform="rotate(-30 38 15)" fill="#3f7f55"/><ellipse cx="44" cy="16" rx="6" ry="2.6" transform="rotate(30 44 16)" fill="#4f8a5b"/><circle cx="40" cy="18" r="2" fill="#fff"/><circle cx="43" cy="19" r="2" fill="#fff"/>',
    krone: (c) => '<path d="M18 18 l2 -10 5 6 4.5 -8 4.5 8 5 -6 2 10z" fill="' + c + '"/><circle cx="29.5" cy="8" r="1.6" fill="#ff4d7d"/><rect x="18" y="16" width="23" height="4" rx="1" fill="#d4a84b"/>',
  };
  // Zehn verschiedene Freunde: andere Federfarben, andere Deko, keiner gleicht dem anderen
  const FREUNDE = [
    { ruecken: "#8a5a3a", brust: "#f26b5b", fluegel: "#6b4632", deko: "muetze", farbe: "#d6304f" },
    { ruecken: "#5a7fb0", brust: "#f3d45b", fluegel: "#3f5f8a", deko: "schal", farbe: "#e85d7e" },
    { ruecken: "#7a8a52", brust: "#f6a25b", fluegel: "#5a6a3a", deko: "ohren", farbe: "#b39ddb" },
    { ruecken: "#9a6a4a", brust: "#ffb3a0", fluegel: "#7a4e33", deko: "geweih" },
    { ruecken: "#6a5a8a", brust: "#ff9fc4", fluegel: "#4e4070", deko: "pudel", farbe: "#3f9a6a" },
    { ruecken: "#b08a5a", brust: "#fff0c2", fluegel: "#8a6a3a", deko: "stern", farbe: "#f3c84b" },
    { ruecken: "#4f7f7a", brust: "#ffcf8a", fluegel: "#3a605c", deko: "fliege", farbe: "#d6304f" },
    { ruecken: "#a05a5a", brust: "#ffd0dc", fluegel: "#7a3e3e", deko: "glocke", farbe: "#f3c84b" },
    { ruecken: "#8a8a8a", brust: "#ff8a7a", fluegel: "#666", deko: "mistel" },
    { ruecken: "#c08060", brust: "#b8e0ff", fluegel: "#9a5e40", deko: "krone", farbe: "#f3c84b" },
  ];

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
    // im Dezember: im Nest auf dem Wandbrett der Munkelvögel
    brett: () => (ak.dezember && ak.dezember.platz ? ak.dezember.platz() : null),
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
      // am schmalen Handy: oben mittig auf den Umschlag
      const u = document.getElementById("umschlag");
      if (!sichtbar(u)) return null;
      const ur = u.getBoundingClientRect();
      return { x: ur.left + ur.width * 0.5, y: ur.top + 3 };
    },
    umschlagLinks: () => ankerPunkt("34px", "oben", 3),
    umschlagRechts: () => ankerPunkt("calc(100% - 34px)", "oben", 3),
    siegel: () => { const e = document.querySelector("#umschlag .siegel"); if (!sichtbar(e)) return null; return ankerPunkt("50%", e.offsetTop + "px", 4); },
    // im Winternest auf der Fensterbank (nur wenn Toni es gebaut hat, nachts nicht)
    nest: () => (ak.nest && ak.nest.platz ? ak.nest.platz() : null),
    hinweis: () => { const e = document.getElementById("intro-hinweis"); if (!sichtbar(e) || !e.textContent) return null; const r = e.getBoundingClientRect(); return { x: Math.min(window.innerWidth - 30, r.right + 26), y: r.top + 14 }; },
  };
  // Unsichtbare Punkte im Umschlag. Weil sie im Brief stecken, folgen sie seinem
  // Schweben und Kippen genau, und die Vögel bewegen sich natürlich mit.
  const anker = new Map();
  function ankerPunkt(links, oben, plus) {
    const u = document.getElementById("umschlag");
    if (!sichtbar(u)) return null;
    const key = links + "|" + oben;
    let a = anker.get(key);
    if (!a || !a.isConnected) {
      a = document.createElement("span");
      a.className = "vogel-anker";
      a.setAttribute("aria-hidden", "true");
      a.style.left = links;
      if (oben === "unten") a.style.bottom = "0"; else a.style.top = oben === "oben" ? "0" : oben;
      u.appendChild(a);
      anker.set(key, a);
    }
    const r = a.getBoundingClientRect();
    return { x: r.left, y: r.top + (plus || 0) };
  }
  function kontext() {
    const phase = ak.intro.phase();
    if (ak.nest && ak.nest.schlafen && ak.nest.schlafen() && !gitarrenNacht()) return null;
    if (intro.hidden && ak.dezember && ak.dezember.schlafen && ak.dezember.schlafen()) return null;
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
    el.addEventListener("click", (e) => {
      const wahl = e.target.closest && e.target.closest(".vogel-wahl");
      if (wahl) { e.stopPropagation(); antworte(v, wahl.dataset.antwort); return; }
      if (v.zustand !== "sitzt" || v.fragt) return;
      if (v.beimKlick && v.beimKlick()) return;
      el.classList.remove("hopst"); void el.offsetWidth; el.classList.add("hopst");
      // vor dem Geburtstag fragt der Munkelvogel beim zweiten Antippen nach seiner Partnerin
      if (!weiblich && vorGeburtstag() && v.hatGesprochen && !weibchen && !frageBeantwortet && !gitarrenNacht()) { frage(v); return; }
      sprich(v);
    });
    voegel.push(v);
    return v;
  }

  // p ist in Bildschirmkoordinaten; gesetzt wird in Seitenkoordinaten, damit der Vogel beim Scrollen still sitzt
  function setzePosition(v, p) {
    v.pos = p;
    v.seite = { x: p.x + window.scrollX, y: p.y + window.scrollY };
    // nach der echten Größe ausrichten (die Gäste sind kleiner), damit die Füße genau auf dem Punkt stehen
    const b = v.el.offsetWidth || GROESSE, h = v.el.offsetHeight || GROESSE;
    v.el.style.transform = "translate(" + (v.seite.x - b / 2).toFixed(1) + "px," + (v.seite.y - h).toFixed(1) + "px)";
    v.el.querySelector("svg").style.transform = v.blick < 0 ? "scaleX(-1)" : "";
  }

  function sprich(v) {
    if (v.auftrag) return;
    v.timer.forEach(clearTimeout); v.timer = [];
    clearTimeout(v.flugTimer);
    const liste = v.saetze().filter(Boolean);
    if (!liste.length) { planeAbflug(v); return; }
    v.hatGesprochen = true;
    liste.forEach((satz, i) => v.timer.push(setTimeout(() => zeigeBlase(v, satz), i * 5600)));
    v.timer.push(setTimeout(() => { v.blase.hidden = true; v.el.classList.remove("redet"); planeAbflug(v); }, liste.length * 5600 - 600));
  }
  // anhang: Knöpfe, die schon beim Ausmessen in der Blase stecken müssen
  function zeigeBlase(v, satz, anhang) {
    if (v.zustand !== "sitzt") return;
    // erst den Vogel exakt auf seinen Platz setzen (die Seite kann gerade verschoben worden sein), dann messen
    if (v.platz && v.kontext && !v.auftrag) { const p = sitzpunkt(v, v.kontext, v.platz); if (p) setzePosition(v, p); }
    // nur sprechen, wenn der Vogel gerade zu sehen ist
    const sicht = v.el.getBoundingClientRect();
    if (sicht.bottom < 20 || sicht.top > window.innerHeight - 20) { v.blase.hidden = true; return; }
    // die Blase des anderen Vogels ausblenden, damit sie sich nicht überlappen
    voegel.forEach((a) => { if (a !== v) { a.blase.hidden = true; a.el.classList.remove("redet"); } });
    v.blase.textContent = satz;
    if (anhang) { v.blase.appendChild(anhang); v.blase.classList.add("mit-wahl"); } else v.blase.classList.remove("mit-wahl");
    v.blase.classList.remove("seitlich", "rechts-vom-vogel");
    v.blase.classList.toggle("unten", v.pos && v.pos.y < 140);
    v.blase.style.left = "0px"; v.blase.style.right = "auto";
    v.blase.hidden = false;
    v.el.classList.add("redet");
    // Blase so legen, dass die Spitze genau auf den Kopf zeigt, und im Bild halten
    const g = v.el.offsetWidth || GROESSE;
    const breite = v.blase.offsetWidth, kopf = g / 2, rand = 10;
    const vogelLinks = v.pos.x - g / 2;
    let links = kopf + 22 - breite;
    if (vogelLinks + links < rand) links = rand - vogelLinks;
    if (vogelLinks + links + breite > W() - rand) links = W() - rand - breite - vogelLinks;
    v.blase.style.left = links.toFixed(0) + "px";
    v.blase.style.setProperty("--spitze", Math.max(8, Math.min(breite - 22, kopf - links - 7)).toFixed(0) + "px");
    // Gesichter und wichtige Schrift nie verdecken: oben, seitlich oder unten probieren
    // und die erste Lage nehmen, die nichts verdeckt (sonst die mit der kleinsten Überdeckung)
    const andere = voegel.find((a) => a !== v && a.zustand === "sitzt" && a.pos && Math.abs(a.pos.x - v.pos.x) < 80);
    const platzLinks = vogelLinks - 4 - rand, platzRechts = W() - rand - (vogelLinks + g + 4);
    const lege = (art) => {
      v.blase.classList.remove("seitlich", "rechts-vom-vogel", "unten", "tief");
      v.blase.style.maxWidth = "";
      if (art === "oben" || art === "unten") {
        v.blase.classList.toggle("unten", art === "unten");
        v.blase.style.left = links.toFixed(0) + "px";
        return;
      }
      // „Tief“: neben dem Vogel, aber nach unten wachsend (passt oben am Umschlag neben das Siegel)
      const linksDavon = art === "links" || art === "linksTief";
      const platz = linksDavon ? platzLinks : platzRechts;
      v.blase.classList.add("seitlich");
      v.blase.classList.toggle("tief", art.endsWith("Tief"));
      v.blase.classList.toggle("rechts-vom-vogel", !linksDavon);
      v.blase.style.maxWidth = Math.max(110, Math.min(250, platz)) + "px";
      const b2 = v.blase.offsetWidth;
      v.blase.style.left = (linksDavon ? -b2 - 4 : g + 4).toFixed(0) + "px";
    };
    const vorne = v.pos && v.pos.y < 140 ? ["unten", "oben"] : ["oben", "unten"];
    // seitlich zuerst weg vom Partner, sonst dorthin, wo mehr Platz ist
    const seiten = (andere ? andere.pos.x > v.pos.x : platzLinks >= platzRechts) ? ["links", "rechts"] : ["rechts", "links"];
    const seitenFrei = seiten.filter((x) => (x === "links" ? platzLinks : platzRechts) >= 110);
    const reihe = [vorne[0], ...seitenFrei, ...seitenFrei.map((x) => x + "Tief"), vorne[1]];
    let beste = null;
    for (const art of reihe) {
      lege(art);
      const wert = verdeckung(v.blase);
      if (wert === 0) { beste = null; break; }
      if (!beste || wert < beste.wert) beste = { art, wert };
    }
    if (beste) {
      // nirgends Platz ohne ein Foto oder wichtige Schrift zu verdecken:
      // lieber schweigen und den Satz nach der nächsten Landung sagen
      if (beste.wert > 500) { v.blase.hidden = true; v.el.classList.remove("redet"); v.nachholen = satz; return; }
      lege(beste.art);
    }
    v.nachholen = null;
  }
  // Wie viel Fläche die Blase von Fotos, wichtiger Schrift oder dem Bildrand verdeckt
  function verdeckung(blase) {
    const b = blase.getBoundingClientRect();
    const intro = document.getElementById("intro");
    const sel = intro && !intro.hidden
      ? "#intro .umschlag-name, #intro .countdown-ziffern, #intro .countdown-titel, #intro .siegel, #intro .countdown-gruss, #intro .intro-hinweis, #intro .special-knopf, #intro .intro-spiel, .wz-sprech-ebene .wz-sprech, .munkel-buehne .munkel-zu, .munkel-buehne .munkel-hinweis, .munkel-buehne .munkel-karte"
      : ".polaroid img, .lightbox-figur img, #titel, .heute-karte .status, .zaehler-zahl";
    let summe = 0;
    // Siegel, Countdown-Ziffern und Name dürfen gar nicht verdeckt werden (zählt so stark, dass der Vogel lieber schweigt)
    const streng = "#intro .siegel, #intro .countdown-ziffern, #intro .umschlag-name, .wz-sprech-ebene .wz-sprech, .munkel-buehne .munkel-zu, .munkel-buehne .munkel-hinweis";
    document.querySelectorAll(sel).forEach((e) => {
      const r = e.getBoundingClientRect();
      if (!r.width) return;
      // Siegel und Vogel bewegen sich leicht, deshalb um wichtige Schrift einen Sicherheitsabstand halten
      const wichtig = e.matches(streng), m = wichtig ? -10 : 4;
      const w = Math.min(b.right, r.right - m) - Math.max(b.left, r.left + m), h = Math.min(b.bottom, r.bottom - m) - Math.max(b.top, r.top + m);
      if (w > 0 && h > 0) summe += w * h * (wichtig ? 100 : 1);
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
    // nur der jeweils neueste Flug bewegt den Vogel
    const id = (v.flugId = (v.flugId || 0) + 1);
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
        if (v.flugId !== id) { fertig(); return; }
        if (u < 1 && v.zustand === "fliegt") requestAnimationFrame(schritt); else fertig();
      }
      requestAnimationFrame(schritt);
    });
  }

  async function fliegeWeg(v) {
    if (v.auftrag) return;
    if (voegel.some((a) => a !== v && a.fragt)) { planeAbflug(v); return; }
    if (v.zustand !== "sitzt" || document.hidden) { planeAbflug(v); return; }
    v.blase.hidden = true; v.el.classList.remove("redet");
    v.zustand = "fliegt";
    v.el.classList.add("fliegt");
    const route = ROUTEN[Math.floor(Math.random() * ROUTEN.length)](v.pos);
    voegel.filter((a) => a.partner === v && a.zustand === "sitzt").forEach((a, i) => setTimeout(() => fliegeWeg(a), 700 + i * 450));
    await animiere(v, route, 2400 + Math.random() * 900);
    if (v.zustand !== "fliegt" || v.auftrag) return;
    v.el.hidden = true;
    if (v.partner) {
      // warten, bis das Männchen seinen neuen Platz ausgesucht hat
      while (!v.partner.ziel && v.partner.zustand !== "sitzt") await new Promise((r) => setTimeout(r, 200));
      await new Promise((r) => setTimeout(r, 600));
    } else {
      // setzt er nur für eine Frage um, kommt er gleich zurück
      await new Promise((r) => setTimeout(r, v.frageNachLandung ? 700 : 2500 + Math.random() * 3000));
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
    if (!v.kueken) return { x: p.x + (rechts ? 46 : -46), y: p.y };
    // das Küken sitzt auf der anderen Seite des Munkelvogels, sonst außen neben der Munkelvogeline
    const mitMama = weibchen && weibchen.el.isConnected && weibchen.zustand !== "weg";
    const seite = mitMama ? (rechts ? -1 : 1) : (rechts ? 1 : -1);
    if (p.x + seite * 40 > 20 && p.x + seite * 40 < W() - 20) return { x: p.x + seite * 40, y: p.y };
    return { x: p.x - seite * (mitMama ? 84 : 40), y: p.y };
  }
  function freierPlatz(v, k) {
    if (v.partner) return v.partner.ziel || v.partner.platz;
    const liste = Object.keys(plaetze(k)).filter((name) => name !== v.platz && !voegel.some((a) => a !== v && a.platz === name && a.kontext === k) && plaetze(k)[name]());
    if (!liste.length) return null;
    return liste[Math.floor(Math.random() * liste.length)];
  }

  // in der Gitarrennacht schläft nur die Munkelvogeline im Nest, er bleibt wach
  const kontextFuer = (v) => (v !== maennchen && gitarrenNacht() ? null : kontext());
  async function lande(v, sofort, ersterPlatz) {
    if (v.auftrag) return;
    const k = kontextFuer(v);
    if (!k) { v.zustand = "weg"; v.el.hidden = true; v.platz = null; await new Promise((r) => setTimeout(r, 1000)); return lande(v, sofort, ersterPlatz); }
    let name = sofort || ersterPlatz ? (v.partner ? freierPlatz(v, k) : ERSTER_PLATZ[k]) : freierPlatz(v, k);
    // ist der Lieblingsplatz gerade nicht frei (zum Beispiel zu wenig Platz am Handy), einen anderen nehmen
    if (name && !sitzpunkt(v, k, name)) name = freierPlatz(v, k);
    const zielFn = name && (() => sitzpunkt(v, k, name));
    if (!zielFn || !zielFn()) { await new Promise((r) => setTimeout(r, 1500)); return lande(v, sofort, ersterPlatz); }
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
    if (v.zustand !== "fliegt" || v.auftrag) return;
    v.zustand = "sitzt"; v.el.classList.remove("fliegt"); v.ziel = null;
    v.el.classList.remove("hopst"); void v.el.offsetWidth; v.el.classList.add("hopst");
    v.gelandet = (v.gelandet || 0) + 1;
    if (v.frageNachLandung) {
      v.frageNachLandung = false;
      setTimeout(() => { if (v.zustand === "sitzt" && !v.fragt && !v.auftrag && !weibchen && !frageBeantwortet) frage(v); }, 900);
    }
    if (v.nachholen) {
      const satz = v.nachholen;
      setTimeout(() => { if (v.zustand === "sitzt" && v.nachholen === satz) { zeigeBlase(v, satz); setTimeout(() => { v.blase.hidden = true; v.el.classList.remove("redet"); }, 5000); } }, 1200);
    }
    planeAbflug(v);
  }

  // Sitzende Vögel bleiben beim Scrollen auf ihrem Platz
  function festhalten() {
    for (const v of voegel) {
      if (v.zustand !== "sitzt") continue;
      const k = kontextFuer(v);
      // bei einem Auftrag (Spiel, Kerze, Brunch) führt der Auftrag selbst: nur am Zielpunkt festhalten
      if (v.auftrag) {
        const p = v.folge ? v.folge() : v.platz && v.kontext === k ? sitzpunkt(v, k, v.platz) : null;
        if (p && v.seite && (Math.abs(p.x + window.scrollX - v.seite.x) > 0.2 || Math.abs(p.y + window.scrollY - v.seite.y) > 0.2)) setzePosition(v, p);
        continue;
      }
      if (k !== v.kontext && v.partner) { v.zustand = "weg"; v.el.hidden = true; v.platz = null; v.blase.hidden = true; setTimeout(() => lande(v, false), 1800); continue; }
      if (k !== v.kontext) { v.zustand = "weg"; v.el.hidden = true; clearTimeout(v.flugTimer); v.timer.forEach(clearTimeout); v.blase.hidden = true; v.platz = null; lande(v, true).then(() => { if (v === voegel[0] || v.weiblich) setTimeout(() => sprich(v), 2000); }); continue; }
      // nur nachführen, wenn sich der Platz auf der Seite wirklich verschoben hat
      const p = sitzpunkt(v, k, v.platz);
      if (p && v.seite) {
        const dx = p.x + window.scrollX - v.seite.x, dy = p.y + window.scrollY - v.seite.y;
        const schwelle = k === "countdown" ? 0.2 : 1.5;
        if (Math.abs(dx) > schwelle || Math.abs(dy) > schwelle) setzePosition(v, p);
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
    3: () => "Psst … im Dorf ganz unten steht ein Briefkasten. Schau mal, ob Post für dich drin ist ✉️",
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
  const wahl = (liste) => liste[Math.floor(Math.random() * liste.length)];
  // Countdown vor dem Geburtstag (bis 26.11., 0:00 Uhr)
  const vorGeburtstag = () => kontext() === "countdown" && ak.intro.phase() === "warten";
  // Der Munkelvogel spricht immer selbst und sagt immer „Toni“
  // Besondere Tage: Toni arbeitet am 13., 14., 16., 18. und 19.11. abends, am 15.11. ist Brunch mit Karla und Chris
  function tagesGruss(d) {
    if (d.jahr !== KALENDER.jahr || d.monat !== 11 || (ak.zeitreise && ak.zeitreise.aktiv())) return null;
    const h = d.stunde, t = d.tag;
    // Tage, an denen Toni abends arbeitet
    const ARBEIT = [13, 14, 16, 18, 19];
    const wochenende = [0, 6].includes(new Date(Date.UTC(d.jahr, d.monat - 1, t)).getUTCDay());
    if (ARBEIT.includes(t)) {
      if (h >= 5 && h < 12) return !wochenende
        ? wahl(["Guten Morgen, Toni ☀️ Heute Abend musst du noch arbeiten. Ich wünsch dir jetzt schon eine entspannte Schicht!", "Morgen, Toni ☀️ Hab einen schönen Schultag, und heute Abend eine ganz ruhige Schicht!"])
        : wahl(["Guten Morgen, Toni ☀️ Genieß deinen Samstag! Und heute Abend wünsch ich dir eine schöne, entspannte Schicht.", "Morgen, Toni ☀️ Mach dir einen schönen Tag. Die Schicht heute Abend wird bestimmt ganz entspannt!"]);
      if (h >= 12 && h < 17) return wahl(["Hi Toni! Heute Abend musst du arbeiten. Ich wünsch dir eine schöne Schicht, ohne viel Stress 🍀", "Hallo Toni! Genieß noch die Zeit vor der Arbeit. Ich drück dir die Daumen für eine ruhige Schicht ☕"]);
      if (h >= 17 && h < 23) return wahl(["Hi Toni! Du bist bestimmt gerade bei der Arbeit. Ich halte hier solange die Stellung 🐦", "Hey Toni! Ich wünsch dir eine schöne Schicht, hoffentlich ist heute alles ganz entspannt 🍀", "Hallo Toni! Ich hoffe, die Schicht ist heute nicht zu anstrengend. Ich halte hier solange die Stellung 🐦"]);
      if (h >= 23) return t === 14
        ? "Na Toni, Feierabend? Ich hoffe, die Schicht war schön entspannt. Morgen ist Brunch mit Karla und Chris 🥐"
        : "Na Toni, Feierabend? Ich hoffe, die Schicht war schön entspannt. Ruh dich gut aus 🌙";
    }
    // nach Mitternacht: Feierabend nach der Schicht vom Vortag
    if (h < 5 && ARBEIT.includes(t - 1)) return t === 15
      ? "Feierabend, Toni! Schlaf schön, um 11 Uhr ist schon Brunch mit Karla und Chris 🥐"
      : "Feierabend, Toni! Ich hoffe, die Schicht war nicht zu anstrengend. Schlaf schön 🌙";
    // Klausuren: 23.11. Erdkunde, 25.11. Englisch
    if (t === 22 && h >= 17) return wahl(["Hi Toni! Morgen schreibst du Erdkunde. Du bist bestens vorbereitet, schlaf heute gut 🌙", "Hallo Toni! Morgen ist die Erdkundeklausur. Ich glaub ganz fest an dich 🍀"]);
    if (t === 24 && h >= 17) return wahl(["Hi Toni! Morgen schreibst du Englisch. Du bist so gut vorbereitet, das wird super 🌙", "Hallo Toni! Morgen ist die Englischklausur. Ich drück dir jetzt schon alle Federn 🍀"]);
    if (t === 23) {
      if (h >= 5 && h < 14) return wahl(["Guten Morgen, Toni ☀️ Heute ist die Erdkundeklausur. Du schaffst das, ich glaub ganz fest an dich! 🍀", "Morgen, Toni ☀️ Heute schreibst du Erdkunde. Du bist so gut vorbereitet, das wird super! 🍀"]);
      if (h >= 14) return wahl(["Hi Toni! Wie lief die Erdkundeklausur? Ich bin sicher, du warst super 🍀", "Hallo Toni! Erdkunde ist geschrieben. Jetzt kannst du dich erstmal ausruhen 🥰"]);
    }
    if (t === 25) {
      if (h >= 5 && h < 14) return wahl(["Guten Morgen, Toni ☀️ Heute ist die Englischklausur, und morgen hast du Geburtstag! Du schaffst das 🍀", "Morgen, Toni ☀️ Heute schreibst du Englisch. Ich glaub ganz fest an dich! 🍀"]);
      if (h >= 14) return wahl(["Hi Toni! Wie lief die Englischklausur? Und jetzt nur noch einmal schlafen bis zu deinem Geburtstag 🎂", "Hallo Toni! Englisch ist geschrieben. Jetzt darfst du dich ganz auf morgen freuen 🎂"]);
    }
    if (t === 15) {
      if (h >= 5 && h < 11) return wahl(["Guten Morgen, Toni ☀️ Um 11 Uhr ist Brunch mit Karla und Chris! Lasst es euch richtig schmecken 🥐", "Morgen, Toni ☀️ Heute um 11 Uhr geht es mit Karla und Chris zum Brunch. Ich bin ein bisschen neidisch 🥐"]);
      if (h >= 11 && h < 14) return wahl(["Hi Toni! Guten Appetit beim Brunch mit Karla und Chris 🥐 Grüß die beiden lieb von mir!", "Hallo Toni! Lasst es euch zu dritt schmecken, und hebt mir ein Croissant auf 🥐"]);
      if (h >= 14 && h < 18) return wahl(["Hi Toni! Wie war der Brunch mit Karla und Chris? Ich hoffe, ihr hattet richtig viel Spaß ☕", "Hallo Toni! Na, satt vom Brunch? Erzähl mal, war es schön mit Karla und Chris? 🥰"]);
      return wahl(["Hi Toni! Wie war der restliche Tag mit Chris? Ich hoffe, ihr hattet es richtig schön 🥰", "Schönen Sonntagabend, Toni! Wie war der Rest des Tages mit Chris? 🕯️"]);
    }
    return null;
  }
  function grussVogel() {
    const zeit = document.documentElement.getAttribute("data-tageszeit") || "mittag";
    const d = ak.intro.datum();
    const besonders = tagesGruss(d);
    if (besonders) return besonders;
    if (d.monat === 11 && d.tag === 26) return wahl(["Hi Toni! Happy Birthday 🎂", "Hallo Toni! Alles Liebe zum Geburtstag 🎂", "Hey Toni! Happy Birthday, heute ist dein Tag 🎂"]);
    const wochentag = new Date(Date.UTC(d.jahr, d.monat - 1, d.tag)).getUTCDay();
    // Weihnachtsferien vom 23.12. bis 6.1.
    const ferien = (d.monat === 12 && d.tag >= 23) || (d.monat === 1 && d.tag <= 6);
    const schultag = wochentag >= 1 && wochentag <= 5 && !ferien;
    const G = {
      morgen: schultag ? [
        "Hi Toni! Guten Morgen ☀️ Ich wünsch dir einen schönen Schultag!",
        "Morgen, Toni ☀️ Hab einen tollen Tag in der Schule!",
        "Hallo Toni! Ich drück dir die Daumen für einen schönen Schultag ☀️",
        "Hey Toni, guten Morgen! Hab einen richtig guten Tag in der Schule 📚",
        "Hi Toni! Einen wunderschönen guten Morgen ☀️ Hab einen schönen Schultag!",
      ] : ferien ? [
        "Hi Toni! Guten Morgen ☀️ Genieß deine Ferien!",
        "Morgen, Toni ☀️ Ferien! Ganz viel Zeit für dich!",
        "Hallo Toni! Ich wünsch dir einen gemütlichen Ferientag ☀️",
      ] : [
        "Hi Toni! Guten Morgen ☀️ Genieß dein Wochenende!",
        "Morgen, Toni ☀️ Heute ist keine Schule, ganz viel Zeit für dich!",
        "Hallo Toni! Ich wünsch dir einen gemütlichen Tag ☀️",
      ],
      vormittag: ["Hi Toni! Einen schönen Vormittag 🌤️", "Hallo Toni! Ich hoffe, dein Vormittag ist schön 🌤️", "Hey Toni! Ich wünsch dir einen tollen Vormittag 🌤️"],
      mittag: ["Hi Toni! Guten Mittag 🌞", "Hallo Toni! Lass es dir schmecken 🌞", "Hey Toni! Ich wünsch dir eine schöne Mittagspause 🌞"],
      nachmittag: ["Hi Toni! Einen gemütlichen Nachmittag 🍪", "Hallo Toni! Wie war dein Tag bis jetzt? 🍪", "Hey Toni, schön, dass du da bist! Genieß den Nachmittag 🍪"],
      abend: ["Hi Toni! Guten Abend 🕯️", "Hallo Toni! Mach es dir gemütlich 🕯️", "Hey Toni! Ich wünsch dir einen entspannten Abend 🕯️"],
      nacht: ["Hi Toni! Schlaf gleich schön 🌙", "Gute Nacht, Toni! Träum was Schönes 🌙", "Na, Toni, noch wach? Schlaf gleich gut 🌙"],
    };
    return wahl(G[zeit] || G.mittag);
  }
  const GEHEIMNIS = [
    "Wenn du wüsstest, was an deinem Geburtstag passiert … 🤫",
    "Ich weiß da etwas über deinen Geburtstag. Aber ich verrate nichts 🤐",
    "Psst … an deinem Geburtstag wartet etwas ganz Besonderes auf dich 🎁",
    "Wenn du ahnen würdest, was an deinem Geburtstag los ist … 😏",
    "Ich darf nichts sagen, aber dein Geburtstag wird richtig schön 🤭",
    "Ein Vögelchen hat mir gezwitschert, was an deinem Geburtstag passiert. Ich schweige wie ein Grab 🤐",
    "Du hast ja keine Ahnung, was an deinem Geburtstag auf dich wartet … 🎂",
    "Ich kenne ein Geheimnis über deinen Geburtstag. Und es ist ein schönes 🤫",
    "Wenn du wüsstest, was hier an deinem Geburtstag los ist, würdest du jetzt schon strahlen ✨",
    "Mehr verrate ich nicht, aber freu dich auf deinen Geburtstag 😉",
  ];
  const DANKE = [
    "Danke für die Einladung 🥰",
    "Vielen Dank, dass ich auch kommen darf ♥️",
    "Danke, dass du mich eingeladen hast 😊",
    "Wie lieb von dir, danke für die Einladung 🥰",
    "Danke schön! Ich freu mich so, dass ich dabei sein darf ♥️",
    "Ich bedanke mich ganz herzlich für die Einladung 🌸",
  ];
  const NEIN = [
    "Ist nicht schlimm. Dann haben wir mehr Zeit zu zweit 😊",
    "Alles gut! Dann bleibt mehr Zeit nur für uns zwei 😊",
    "Kein Problem, dann sind wir eben zu zweit 🥰",
    "Macht nichts, dann hab ich dich ganz für mich allein 😉",
  ];
  const FRAGE = [
    "Darf meine Partnerin auch vorbeikommen? 🥺",
    "Ist es okay für dich, wenn meine Partnerin auch kommt? 🥺",
    "Darf meine Liebste auch dazukommen? 🥺",
    "Darf ich meine Partnerin dazuholen? 🥺",
  ];
  // Sätze des Tages vom 16. bis 25.11. (je Vogel: 2 morgens, 1 mittags, 2 abends)
  const TAGESSAETZE = {
    16: {
      m: ["Guten Morgen, Toni! Ich hab extra früh angefangen zu zwitschern, damit du gut gelaunt aufwachst ☀️",
        "Toni, weißt du, was das Schönste an meinem Morgen ist? Wenn du hier vorbeischaust 🥰",
        "Ich hab heute schon drei Wolken gezählt. Alle sahen aus wie ein Herz, Toni ♥️",
        "Toni, ich hab gehört, dass Chris den ganzen Tag an dich denkt. Ich übrigens auch 🐦",
        "Psst, Toni… der Umschlag hat heute ganz leise gekichert. Ich glaube, er freut sich auf dich ✉️"],
      w: ["Guten Morgen, Toni! Er hat schon im Morgengrauen angefangen zu zwitschern. Er freut sich einfach so, dich zu sehen 😅",
        "Toni, ich hab heute meine schönste Schleife aufgesetzt. Für dich 🎀",
        "Weißt du, Toni, er redet den ganzen Tag nur von dir. Ich bin fast ein bisschen eifersüchtig 😜",
        "Toni, ich finde, du und Chris seid fast so süß wie wir zwei. Fast 😌",
        "Ich hab ihm beigebracht, wie man ein Herz in die Luft fliegt. Er übt noch, Toni ♥️"],
    },
    17: {
      m: ["Morgen, Toni! Ich hab dir einen Sonnenstrahl auf den Umschlag gelegt ☀️",
        "Toni, wenn du lächelst, muss ich jedes Mal mitzwitschern. Ich kann nicht anders 🎶",
        "Die Capys haben mich gefragt, ob du wirklich so lieb bist, wie alle sagen. Ich hab gesagt: noch viel lieber, Toni 🐹",
        "Noch 9 Mal schlafen, Toni. Ich zähle schon auf meinen Federn mit 🪶",
        "Toni, ich hab Chris heute heimlich beobachtet. Er hat ganz verliebt gegrinst 😏"],
      w: ["Morgen, Toni! Ich hab mir mit Morgentau das Gesicht gewaschen. Man will ja hübsch sein für dich ✨",
        "Toni, du hast so ein schönes Lächeln. Das sagen sogar die Capys 🐹",
        "Psst, Toni… ich weiß, was am 26. passiert. Aber ich bin viel besser im Schweigen als er 🤐",
        "Toni, danke, dass ich hier sein darf. Bei dir ist es so gemütlich 🥰",
        "Er hat mir erzählt, dass Chris dich die Allerschönste nennt. Recht hat er, Toni 😊"],
    },
    18: {
      m: ["Guten Morgen, Toni! Ich hab mein schönstes Federkleid angezogen, nur für dich ✨",
        "Toni, du bist der Grund, warum ich morgens so gerne hier sitze 🥰",
        "Das Siegel glänzt heute besonders, Toni. Ich glaube, es weiß schon, was an deinem Geburtstag passiert 🤫",
        "Toni, ich hab ein Lied für dich gedichtet. Es geht nur „Piep piep Toni piep“, aber es kommt von Herzen 🎶",
        "Weißt du, Toni, die Sterne über dem Umschlag leuchten heller, wenn du da bist 🌟"],
      w: ["Guten Morgen, Toni! Ich hab ihm Frühstück ans Nest gebracht. Rate mal, wer zuerst nach dir gefragt hat 🐦",
        "Toni, man sieht dir an, dass du geliebt wirst. Du strahlst richtig ☀️",
        "Toni, ich hab heute eine Feder verloren. Wenn du sie findest, darfst du dir was wünschen 🪶",
        "Weißt du, Toni, die schönsten Abende sind die, an denen jemand an einen denkt. Und Chris denkt gerade an dich ♥️",
        "Ich bin heute extra länger geblieben, Toni. Ich wollte noch ein bisschen bei dir sein 🌙"],
    },
    19: {
      m: ["Morgen, Toni! Ich hab geträumt, wir fliegen zusammen über den Rhein. Du warst schneller 😄",
        "Toni, falls dir heute jemand sagt, dass du toll bist: Das war ich, ich hab es überall herumgezwitschert 🐦",
        "Die Capys proben irgendwas, Toni. Ich darf nicht verraten was, aber es wird fröhlich 🥁",
        "Noch eine Woche, Toni! Ich bin so aufgeregt, dass ich kaum stillsitzen kann 🪶",
        "Toni, ich hab heute einen Brief gesehen, auf dem nur dein Name steht. Rate mal, wo 😏"],
      w: ["Morgen, Toni! Ich hab mir die Wangen extra rosa gepustet. Steht mir doch, oder? 😊",
        "Toni, ein guter Tag fängt mit dir an. Das sag ich ihm jeden Morgen 🥰",
        "Toni, die Capys wollten wissen, was du dir zum Geburtstag wünschst. Ich hab gesagt, das weiß nur einer 😏",
        "Noch eine Woche, Toni! Ich überlege schon, welche Schleife ich an deinem Geburtstag trage 🎀",
        "Toni, ich glaube, er übt heimlich ein Ständchen für dich. Ich hör ihn nachts piepsen 🎶"],
    },
    20: {
      m: ["Guten Morgen, Toni! Ich hab dir die Fensterbank schon schön warm gesessen 🐦",
        "Toni, du bist wie der erste Sonnenstrahl am Morgen. Nur viel hübscher ☀️",
        "Weißt du, was ich an dir mag, Toni? Alles. Die Liste war zu lang zum Aufzählen 📜",
        "Toni, der Umschlag hat geflüstert: „Nur noch ein paar Tage.“ Er kann es auch kaum erwarten ✉️",
        "Wenn du gleich schlafen gehst, Toni: Ich pass auf, dass niemand vor dir in den Umschlag guckt 🛡️"],
      w: ["Guten Morgen, Toni! Weißt du, dass du die Lieblingsperson von zwei kleinen Vögeln bist? 🐦🐦",
        "Toni, ich wünsch dir heute einen Tag so weich wie meine Brustfedern 🪶",
        "Toni, er ist heute ganz aufgeregt herumgeflattert. Er sagt, bald wird es hier richtig schön ✨",
        "Toni, wenn du müde bist, denk dran: Irgendwo sitzen zwei Munkelvögel und haben dich lieb ♥️",
        "Er behauptet, er hätte das schönere Gefieder. Was meinst du, Toni? 😏"],
    },
    21: {
      m: ["Guten Morgen, Toni! Wochenende! Ich hab beschlossen, heute nur nette Sachen zu zwitschern 🥰",
        "Toni, Chris hat mir verraten, dass er beim Aufwachen zuerst an dich denkt. Ich hab nicht gelauscht, ehrlich 🙈",
        "Toni, ich übe gerade „Happy Birthday“ zu pfeifen. Es klingt noch schief, aber bis zum 26. sitzt es 🎶",
        "Noch 5 Mal schlafen, Toni. Meine Federn kribbeln schon vor Vorfreude 🪶",
        "Toni, an deinem Geburtstag wird es hier ein bisschen voller als sonst. Mehr verrate ich nicht 🤫"],
      w: ["Guten Morgen, Toni! Samstag! Heute wird nur gekuschelt und gezwitschert ☺️",
        "Toni, Chris hat so ein Glück mit dir. Und du mit ihm. Ich seh doch, wie ihr euch anguckt 🥰",
        "Toni, ich hab gesehen, wie die Capys Luftballons aufgepustet haben. Einer ist geplatzt, alle haben sich erschrocken 😂",
        "Noch 5 Mal schlafen, Toni. Ich zähl mit, er zählt mit, sogar die Capys zählen mit 🐹",
        "Toni, ich wünsch dir einen kuscheligen Samstagabend. Am besten mit ganz viel Decke und Chris 🛋️"],
    },
    22: {
      m: ["Guten Morgen, Toni! Heute ist ein perfekter Tag zum Kuscheln. Sag das ruhig Chris ☺️",
        "Toni, heute Abend hab ich noch was ganz Besonderes für dich. Es hat mit Glück zu tun 🪶",
        "Toni, egal was morgen kommt: Du bist klug und stark, und ich bin unglaublich stolz auf dich 🍀",
        "Toni, ich hab heute Nacht von dir geträumt. Du hattest eine Krone auf und alle Capys haben applaudiert 👑",
        "Toni, die Capys haben heute heimlich Girlanden gezählt. Ich glaube, die planen was für den 26. 🎉"],
      w: ["Guten Morgen, Toni! Sonntagmorgen ist zum Ausschlafen da. Ich hab extra leise gepiepst 🤫",
        "Toni, ich hab ihm gesagt, dass du die tollste Toni der Welt bist. Er hat genickt, bis ihm schwindlig wurde 😄",
        "Toni, für morgen drück ich dir alle Krallen. Du schaffst das 🍀",
        "Toni, mach dir heute Abend keinen Stress mehr. Du bist bestens vorbereitet ♥️",
        "Ich leg dir eine Feder unters Kopfkissen, Toni. Die bringt gute Träume 🪶"],
    },
    23: {
      m: ["Guten Morgen, Toni! Ich hab extra leise gezwitschert, damit du entspannt in den Tag startest 🍀",
        "Toni, du weißt mehr, als du denkst. Und ich weiß, dass du das kannst 💪",
        "Ich bin so stolz auf dich, Toni. Egal wie es läuft 🥰",
        "Toni, heute Abend darfst du einfach nur durchatmen. Den Rest erledige ich mit Zwitschern 🎶",
        "Noch 3 Mal schlafen, Toni! Ich hab schon angefangen, mein Gefieder zu bürsten ✨"],
      w: ["Guten Morgen, Toni! Ich hab ein Kleeblatt gesucht und gefunden. Es ist für dich 🍀",
        "Toni, tief durchatmen. Wir zwei sitzen hier und drücken dir die Daumen, äh, die Flügel 🐦",
        "Toni, egal was heute war: Wir zwei sind stolz auf dich 🥰",
        "Toni, nach so einem Tag hast du dir ganz viel Kuscheln verdient. Ich hab Chris schon Bescheid gegeben 😌",
        "Noch 3 Mal schlafen, Toni. Ich glaub, er platzt bald vor Vorfreude 🎈"],
    },
    24: {
      m: ["Guten Morgen, Toni! Nur noch zwei Mal schlafen. Ich bin ganz zappelig 🪶",
        "Toni, wenn so ein kleiner Vogel wie ich schon so viel Liebe in sich hat, wie viel steckt dann erst in Chris? 🥰",
        "Toni, die Munkelvogeline hat gesagt, ich soll dir heute was Liebes sagen. Also: Du bist wundervoll ♥️",
        "Toni, morgen schreibst du Englisch. You are amazing! Siehst du, ich kann auch Englisch 🐦",
        "Toni, der Umschlag ist schon ganz unruhig. Er weiß, dass es bald so weit ist ✉️"],
      w: ["Guten Morgen, Toni! Er hat heute Nacht im Schlaf deinen Namen gepiepst. Süß, oder? 🥰",
        "Toni, nur noch zwei Mal schlafen. Ich hab schon meine schönste Schleife rausgesucht 🎀",
        "Toni, die Capys haben gerade eine sehr geheime Besprechung. Ich durfte nicht mit rein 🤫",
        "Toni, morgen Englisch und dann Geburtstag. Was für eine Woche! Du schaffst das 🍀",
        "Toni, ich bin so froh, dass du mich eingeladen hast. Ohne dich wär er hier ganz allein 🥺"],
    },
    25: {
      m: ["Guten Morgen, Toni! Heute noch Englisch, und morgen ist DEIN Tag 🎂",
        "Toni, ich male mir schon aus, wie du morgen strahlst. Allein der Gedanke macht mich glücklich ☀️",
        "Bald ist Englisch geschafft, Toni, und dann wird nur noch gefeiert 🎉",
        "Nur noch einmal schlafen, Toni! Ich bin so aufgeregt, ich mach heute bestimmt kein Auge zu 🥳",
        "Toni, um Mitternacht wird es hier ganz besonders. Vielleicht bleibst du ja ein bisschen wach 🤫"],
      w: ["Guten Morgen, Toni! Letzter Tag vor deinem großen Tag. Ich bin ganz kribbelig ✨",
        "Toni, viel Glück heute! Danach darfst du dich nur noch freuen 🍀",
        "Toni, ich hab heimlich in den Umschlag geschielt. Ich sag nur: Du wirst lächeln 🤭",
        "Nur noch einmal schlafen, Toni! Er hat sich schon die Federn gekämmt 🪶",
        "Toni, morgen bist du ein Jahr älter und noch genauso süß. Das ist so sicher wie mein Piepsen 🥰"],
    },
  };
  // Wundertüte: jeder Satz kommt einmal, in zufälliger Reihenfolge.
  // Morgens (ab 5 Uhr) sind 2 freigeschaltet, ab 12 Uhr 3, ab 17 Uhr alle 5.
  const SAETZE_SCHLUESSEL = "toni-wz-vogelsaetze";
  function naechsterTagessatz(wer) {
    const d = ak.intro.datum();
    if (d.jahr !== KALENDER.jahr || d.monat !== 11 || !TAGESSAETZE[d.tag] || (ak.zeitreise && ak.zeitreise.aktiv())) return null;
    const anzahl = d.stunde < 5 ? 0 : d.stunde < 12 ? 2 : d.stunde < 17 ? 3 : 5;
    let gesagt = {};
    try { gesagt = JSON.parse(localStorage.getItem(SAETZE_SCHLUESSEL) || "{}") || {}; } catch (_) { gesagt = {}; }
    const key = d.tag + wer;
    const schon = Array.isArray(gesagt[key]) ? gesagt[key] : [];
    const frei = [];
    // ein übrig gebliebener „Guten Morgen“ passt ab 12 Uhr nicht mehr
    const morgengruss = (i) => d.stunde >= 12 && /^(Guten )?Morgen\b/.test(TAGESSAETZE[d.tag][wer][i]);
    for (let i = 0; i < anzahl; i++) if (!schon.includes(i) && !morgengruss(i)) frei.push(i);
    if (!frei.length) return null;
    const i = wahl(frei);
    gesagt[key] = schon.concat(i);
    try { localStorage.setItem(SAETZE_SCHLUESSEL, JSON.stringify(gesagt)); } catch (_) { /* egal */ }
    return TAGESSAETZE[d.tag][wer][i];
  }
  /* ---------- 25.11. ab 20 Uhr: vor lauter Aufregung spielt er Gitarre ---------- */
  function gitarrenZeit() {
    if (!ak.intro.bereit() || (ak.zeitreise && ak.zeitreise.aktiv()) || ak.intro.phase() !== "warten") return false;
    const d = ak.intro.datum();
    return d.jahr === KALENDER.jahr && d.monat === 11 && d.tag === 25 && d.stunde >= 20;
  }
  function gitarrenNacht() {
    if (!gitarrenZeit()) return false;
    const d = ak.intro.datum(), m = d.stunde * 60 + d.minute;
    return m >= 22 * 60 + 30 && m < 23 * 60 + 58;
  }
  const GITARRE = ["Toni, ich bin so aufgeregt, ich kann gar nicht mehr aufhören zu spielen 🎸",
    "Morgen ist dein Geburtstag! Da muss ich einfach spielen 🎶",
    "Ich hab versucht aufzuhören, Toni … meine Flügel spielen einfach weiter 🎸😅",
    "Noch ein Lied! Und noch eins! Ich bin viel zu aufgeregt 🎶",
    "Dieses Lied heißt: Morgen hat Toni Geburtstag 🎸"];
  const GITARRE_NACHT = ["Schlafen? Heute? Unmöglich, Toni! Morgen ist dein Geburtstag 🎸",
    "Psst … ich spiel ganz leise, damit meine Liebste nicht aufwacht 🎶",
    "Ich bin viel zu aufgeregt zum Schlafen, Toni 🎸 Nur noch ein Lied …"];
  const GITARRE_W = ["Er spielt schon den ganzen Abend 🙉 Er ist einfach so aufgeregt",
    "Ich glaub, er hört erst an deinem Geburtstag wieder auf 😄",
    "Ich hab ihm gesagt, er soll eine Pause machen. Er hat einfach weitergespielt 🎸"];
  const GITARRE_SVG = '<svg viewBox="0 0 40 24" aria-hidden="true">' +
    '<path d="M24 11.2 L39 8.6 L39.4 11 L24.4 13.6Z" fill="#6b4226"/><rect x="36" y="6.4" width="4" height="7" rx="1.2" transform="rotate(-10 38 10)" fill="#4a2c18"/>' +
    '<circle cx="37" cy="7.4" r=".8" fill="#f3c84b"/><circle cx="38.8" cy="7.1" r=".8" fill="#f3c84b"/><circle cx="37.6" cy="12.6" r=".8" fill="#f3c84b"/><circle cx="39.3" cy="12.2" r=".8" fill="#f3c84b"/>' +
    '<path d="M3 12.5c0-4.6 3.4-6.6 6.6-5.4 1.8.7 3.4.6 5-.4 3.6-2.2 9.2-.6 9.2 5.4s-5.6 7.6-9.2 5.4c-1.6-1-3.2-1.1-5-.4C6.4 19.1 3 17.1 3 12.5z" fill="#f0a24a"/>' +
    '<path d="M3 12.5c0-4.6 3.4-6.6 6.6-5.4 1.8.7 3.4.6 5-.4 3.6-2.2 9.2-.6 9.2 5.4" fill="none" stroke="#d6304f" stroke-width="1.2"/>' +
    '<path d="M3 12.5c0 4.6 3.4 6.6 6.6 5.4 1.8-.7 3.4-.6 5 .4 3.6 2.2 9.2.6 9.2-5.4" fill="none" stroke="#3f9a6a" stroke-width="1.2"/>' +
    '<circle cx="13.6" cy="12.4" r="2.6" fill="#4a2c18"/><circle cx="13.6" cy="12.4" r="3.4" fill="none" stroke="#f3c84b" stroke-width=".7" stroke-dasharray="1 1"/>' +
    '<rect x="6" y="11.2" width="2" height="2.6" rx=".5" fill="#6b4226"/><path d="M7 11.8 L39 7.6M7 12.6 L39.2 8.6M7 13.4 L39.3 9.6" stroke="#fff6e6" stroke-width=".35"/></svg>';
  // Gitarre zeigen, solange er keinen anderen Auftrag hat; Noten steigen auf
  let notenZeit = 0;
  function gitarreZeigen() {
    const v = maennchen;
    const an = gitarrenZeit() && !v.auftrag && !v.vomNest && v.el.isConnected && !v.el.hidden;
    let g = v.el.querySelector(".gitarre");
    if (an && !g) { g = document.createElement("span"); g.className = "gitarre"; g.setAttribute("aria-hidden", "true"); g.innerHTML = GITARRE_SVG; v.el.appendChild(g); }
    if (!an && g) g.remove();
    v.el.classList.toggle("spielt", !!an && v.zustand === "sitzt");
    if (g) g.style.setProperty("--blick", v.blick < 0 ? "-1" : "1");
    const jetzt = performance.now();
    if (an && !ruhig && v.zustand === "sitzt" && v.seite && jetzt > notenZeit) {
      notenZeit = jetzt + 900 + Math.random() * 700;
      const n = teilchen("gitarren-note", v.seite.x + (v.blick < 0 ? -18 : 18), v.seite.y - 34, wahl(["♪", "♫", "♩", "♬"]));
      const dx = (v.blick < 0 ? -1 : 1) * (8 + Math.random() * 16);
      n.animate([{ transform: "translate(-50%,-50%) scale(.6)", opacity: 0 }, { transform: "translate(calc(-50% + " + (dx * 0.4).toFixed(1) + "px), calc(-50% - 14px)) scale(1)", opacity: 1, offset: 0.25 },
        { transform: "translate(calc(-50% + " + dx.toFixed(1) + "px), calc(-50% - 40px)) scale(.9) rotate(" + (dx > 0 ? 14 : -14) + "deg)", opacity: 0 }], { duration: 1700, easing: "ease-out", fill: "forwards" }).onfinish = () => n.remove();
    }
    requestAnimationFrame(gitarreZeigen);
  }
  // ein kleiner Akkord, wenn Toni ihn antippt (nur nach einem Tipp, so klingt es nur mit Ton)
  let gitarrenAudio = null;
  function akkord() {
    try {
      gitarrenAudio = gitarrenAudio || new (window.AudioContext || window.webkitAudioContext)();
      if (gitarrenAudio.state === "suspended") gitarrenAudio.resume();
      [392, 494, 587, 784].forEach((f, i) => {
        const t = gitarrenAudio.currentTime + i * 0.035, o = gitarrenAudio.createOscillator(), g = gitarrenAudio.createGain();
        o.type = "triangle"; o.frequency.setValueAtTime(f, t);
        g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.035, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.9);
        o.connect(g).connect(gitarrenAudio.destination); o.start(t); o.stop(t + 0.95);
      });
    } catch (_) { /* ohne Ton */ }
  }
  function saetzeMaennchen() {
    if (gitarrenZeit()) {
      if (maennchen.hatGesprochen) { akkord(); return [wahl(gitarrenNacht() ? GITARRE_NACHT : GITARRE)]; }
      return [grussVogel(), wahl(gitarrenNacht() ? GITARRE_NACHT : GITARRE)];
    }
    // ab dem zweiten Mal Sprechen: erst die Sätze des Tages
    if (maennchen.hatGesprochen) { const satz = naechsterTagessatz("m"); if (satz) return [satz]; }
    if (vorGeburtstag()) {
      // Hinweise auf die Entdeckungen des Tages (wartezeit.js), sonst ein Geheimnis
      let h = null;
      try { h = ak.wartezeitHinweis ? ak.wartezeitHinweis() : null; } catch (_) { h = null; }
      return [grussVogel(), h || wahl(GEHEIMNIS)];
    }
    const liste = [grussVogel()];
    const d = tag();
    if (d.jahr === KALENDER.jahr && d.monat === 12 && d.tag === erstesEi - 1) liste.push(HINWEIS);
    else if (d.jahr === KALENDER.jahr && d.monat === 12 && TIPPS[d.tag]) liste.push(TIPPS[d.tag]());
    return liste;
  }
  function saetzeWeibchen() {
    if (gitarrenZeit() && weibchen && weibchen.hatGesprochen) return [wahl(GITARRE_W)];
    if (weibchen && weibchen.hatGesprochen) { const satz = naechsterTagessatz("w"); if (satz) return [satz]; }
    if (vorGeburtstag() || weibchenEingeladen) return [wahl(DANKE)];
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

  /* ---------- Frage nach der Partnerin (vor dem Geburtstag) ---------- */
  let frageBeantwortet = false, weibchenEingeladen = false, frageTimer = null;
  function frage(v) {
    v.timer.forEach(clearTimeout); v.timer = [];
    clearTimeout(v.flugTimer);
    v.fragt = true;
    const knoepfe = document.createElement("span");
    knoepfe.className = "vogel-wahlen";
    knoepfe.innerHTML = '<span class="vogel-wahl ja" role="button" tabindex="0" data-antwort="ja">Ja 🥰</span><span class="vogel-wahl nein" role="button" tabindex="0" data-antwort="nein">Nein</span>';
    // die Knöpfe sind beim Ausmessen schon drin, damit die Blase nie auf Siegel oder Ziffern rutscht
    zeigeBlase(v, wahl(FRAGE), knoepfe);
    if (v.blase.hidden) {
      v.fragt = false; v.nachholen = null; v.blase.classList.remove("mit-wahl");
      // kein freier Platz für die Frage: woanders hinfliegen und dort fragen (höchstens dreimal)
      if ((v.frageVersuche || 0) < 3) { v.frageVersuche = (v.frageVersuche || 0) + 1; v.frageNachLandung = true; clearTimeout(v.flugTimer); fliegeWeg(v); }
      else planeAbflug(v);
      return;
    }
    v.frageVersuche = 0;
    clearTimeout(frageTimer);
    frageTimer = setTimeout(() => { if (v.fragt) { v.fragt = false; v.blase.hidden = true; v.blase.classList.remove("mit-wahl"); v.el.classList.remove("redet"); planeAbflug(v); } }, 20000);
  }
  function antworte(v, antwort) {
    if (!v.fragt) return;
    if (v.fragtArt === "vorab") return;
    if (v.fragtArt === "styling") { antworteStyling(v, antwort); return; }
    v.fragt = false;
    clearTimeout(frageTimer);
    frageBeantwortet = true;
    v.blase.classList.remove("mit-wahl");
    if (antwort === "ja") {
      if (ak.entdeckt) ak.entdeckt("vogeline");
      zeigeBlase(v, wahl(["Juhu, ich sag ihr Bescheid! 🥰", "Wie schön! Sie ist gleich da 🥰", "Danke! Ich ruf sie sofort 🥰"]));
      v.timer.push(setTimeout(() => { v.blase.hidden = true; v.el.classList.remove("redet"); }, 2600));
      weibchenEingeladen = true;
      setTimeout(holeWeibchen, 1400);
      v.timer.push(setTimeout(() => planeAbflug(v), 2600));
    } else {
      zeigeBlase(v, wahl(NEIN));
      v.timer.push(setTimeout(() => { v.blase.hidden = true; v.el.classList.remove("redet"); planeAbflug(v); }, 5000));
    }
  }
  // Tastatur: Enter oder Leertaste auf Ja oder Nein
  ebene.addEventListener("keydown", (e) => {
    const w = e.target.closest && e.target.closest(".vogel-wahl");
    if (w && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); e.stopPropagation(); antworte(maennchen, w.dataset.antwort); }
  });
  // An vier Tagen vor dem Geburtstag bringt sie zehn Freunde mit
  const SCHWARM_TAGE = [13, 17, 20, 24];
  const ANKUENDIGUNG = [
    "Danke für die Einladung! Ich hab noch ein paar Freunde mitgebracht 🥳",
    "Danke, dass ich kommen darf! Und schau mal, wer da noch kommt 🥳",
    "Wie lieb, danke! Meine Freunde wollten unbedingt auch mit 🥳",
  ];
  function holeWeibchen() {
    if (weibchen) return;
    const d = ak.intro.datum();
    const mitFreunden = d.jahr === KALENDER.jahr && d.monat === 11 && SCHWARM_TAGE.includes(d.tag);
    weibchen = erstelleVogel(true, saetzeWeibchen);
    weibchen.partner = maennchen;
    lande(weibchen, false).then(() => setTimeout(() => {
      if (weibchen.zustand !== "sitzt") return;
      if (mitFreunden) {
        // erst kündigt sie ihre Freunde an, dann kommen sie angeflogen
        weibchen.timer.forEach(clearTimeout); weibchen.timer = [];
        weibchen.hatGesprochen = true;
        zeigeBlase(weibchen, wahl(ANKUENDIGUNG));
        weibchen.timer.push(setTimeout(() => { weibchen.blase.hidden = true; weibchen.el.classList.remove("redet"); }, 4200));
        setTimeout(schwarm, 1800);
      } else sprich(weibchen);
    }, 1200));
  }
  // Zehn Plätze rund um den Umschlag: oben, an beiden Seiten und unten, nie auf Schrift
  function schwarmPlaetze() {
    const u = document.getElementById("umschlag");
    if (!u || !sichtbar(u)) return [];
    const r = u.getBoundingClientRect();
    const frei = (q) => !voegel.some((v) => v.pos && Math.abs(v.pos.x - q.x) < 40 && Math.abs(v.pos.y - q.y) < 60);
    // oben so viele Plätze, dass neben dem Paar noch genug frei bleiben
    const oben = Math.max(6, Math.min(9, Math.floor((r.width - 30) / 38)));
    const p = [];
    const platz = (links, wo, plus) => { const fn = () => ankerPunkt(links, wo, plus); const q = fn(); return q && Object.assign(q, { fn }); };
    for (let i = 0; i < oben; i++) p.push(platz("calc(20px + (100% - 40px) * " + (i / (oben - 1)).toFixed(3) + ")", "oben", 3));
    // auf der unteren Kante des Umschlags, links und rechts vom Namen
    for (const links of ["24px", "calc(100% - 24px)", "19%", "81%", "32%", "68%"]) p.push(platz(links, "unten", 2));
    return p.filter((q) => q && frei(q)).slice(0, 10);
  }
  async function schwarm() {
    if (ak.entdeckt) ak.entdeckt("freunde");
    if (ruhig) return;
    const plaetze = schwarmPlaetze();
    const gaeste = plaetze.map((ziel, i) => {
      const el = document.createElement("span");
      el.className = "vogel gast";
      el.setAttribute("aria-hidden", "true");
      el.innerHTML = vogelSvg(false, FREUNDE[i % FREUNDE.length]);
      // bis zum eigenen Abflug unsichtbar, sonst stünde er kurz oben links
      el.style.visibility = "hidden";
      ebene.appendChild(el);
      return { el, zustand: "fliegt", blick: 1, ziel };
    });
    // in kleinen Grüppchen mit Pausen, nach gut 10 Sekunden sind alle da
    const GRUPPEN = [[0, 2], [2000, 1], [3600, 3], [6400, 2], [7900, 2]];
    const startZeit = [];
    GRUPPEN.forEach(([t, n]) => { for (let k = 0; k < n; k++) startZeit.push(t + k * 300); });
    await Promise.all(gaeste.map((g, i) => new Promise((r) => setTimeout(r, startZeit[i] || i * 1000)).then(() => {
      const vonLinks = i % 2 === 0;
      const start = { x: vonLinks ? -60 : W() + 60, y: g.ziel.y - 160 - Math.random() * 140 };
      // erst außerhalb des Bildes hinsetzen, dann sichtbar machen
      g.blick = vonLinks ? 1 : -1;
      setzePosition(g, start);
      g.el.style.visibility = "";
      const mitte = { x: (start.x + g.ziel.x) / 2, y: Math.min(start.y, g.ziel.y) - 50 };
      g.el.classList.add("fliegt");
      return animiere(g, [start, mitte, { x: g.ziel.x + (vonLinks ? -24 : 24), y: g.ziel.y - 24 }, g.ziel], 2000 + Math.random() * 700).then(() => {
        g.zustand = "sitzt"; g.el.classList.remove("fliegt"); g.blick = g.ziel.x > W() / 2 ? -1 : 1; setzePosition(g, g.ziel);
        const mit = () => { if (g.zustand !== "sitzt" || !g.el.isConnected) return; const q = g.ziel.fn && g.ziel.fn(); if (q) setzePosition(g, q); requestAnimationFrame(mit); };
        requestAnimationFrame(mit);
        g.el.classList.add("hopst");
      });
    })));
    // ein bisschen herumhüpfen und dann gemeinsam wieder losfliegen
    const hops = setInterval(() => { const g = gaeste[Math.floor(Math.random() * gaeste.length)]; if (g.zustand !== "sitzt") return; g.el.classList.remove("hopst"); void g.el.offsetWidth; g.el.classList.add("hopst"); }, 700);
    // Sicherheitsnetz: nach spätestens 20 Sekunden sind alle Gäste wieder weg
    const aufraeumen = setTimeout(() => gaeste.forEach((g) => g.el.remove()), 40000);
    await new Promise((r) => setTimeout(r, 9000));
    clearInterval(hops);
    await Promise.all(gaeste.map((g, i) => new Promise((r) => setTimeout(r, i * 120)).then(() => {
      g.zustand = "fliegt"; g.el.classList.remove("hopst"); g.el.classList.add("fliegt");
      const nachRechts = g.ziel.x > W() / 2;
      return animiere(g, [g.ziel, { x: g.ziel.x + (nachRechts ? 40 : -40), y: g.ziel.y - 80 }, { x: nachRechts ? W() + 80 : -80, y: g.ziel.y - 260 - Math.random() * 120 }], 1800 + Math.random() * 600);
    })));
    clearTimeout(aufraeumen);
    gaeste.forEach((g) => g.el.remove());
  }


  /* ---------- Umstyling: der Munkelvogel fragt nach einem neuen Look ---------- */
  // Fragen mit Ja und Später: erst die Fashion Show, dann das Umstyling (jede höchstens einmal pro Besuch)
  const schonGefragt = new Set(), vorabGesagt = new Set();
  function naechsteAnfrage() {
    const show = ak.modenschau && !schonGefragt.has("show") ? ak.modenschau.frageText() : null;
    if (show) return { art: "show", text: show, vorab: vorabGesagt.has("show") ? null : ak.modenschau.vorabText() };
    // am 18.11. fragt die Munkelvogeline nach dem Einrichten, aber nur wenn sie da ist und Danke gesagt hat
    if (ak.raum && !schonGefragt.has("raum") && weibchen && weibchen.el.isConnected && ak.raum.frageAktiv())
      return { art: "raum", text: ak.raum.frage(), vorab: vorabGesagt.has("raum") ? null : ak.raum.vorab(), vogel: weibchen };
    // am 19.11. fragt die Munkelvogeline nach dem Winternest (nur wenn sie da ist)
    if (ak.nest && !schonGefragt.has("nest") && weibchen && weibchen.el.isConnected && ak.nest.frageAktiv())
      return { art: "nest", text: ak.nest.frage(), vorab: vorabGesagt.has("nest") ? null : ak.nest.vorab(), vogel: weibchen };
    // weitere Fragen der Munkelvögel (Glücksfeder, Ei, Verstecken, Wettfliegen, Füttern), in ihrer Reihenfolge
    for (const e of ANFRAGEN) {
      if (schonGefragt.has(e.art)) continue;
      let aktiv = false;
      try { aktiv = e.aktiv(); } catch (_) { aktiv = false; }
      if (!aktiv) continue;
      const wDa = weibchen && weibchen.el.isConnected && weibchen.zustand === "sitzt";
      if (e.vogel === "w" && !wDa) continue;
      return { art: e.art, text: e.frage(), vorab: vorabGesagt.has(e.art) ? null : (e.vorab ? e.vorab() : null), vogel: e.vogel === "m" ? maennchen : wDa ? weibchen : maennchen, eintrag: e };
    }
    const styling = ak.styling && !schonGefragt.has("styling") ? ak.styling.frageText() : null;
    if (styling) return { art: "styling", text: styling };
    return null;
  }
  // Einträge: { art, aktiv(), vorab(), frage(), vogel: "m" | "w" | "beide" (lieber sie, sonst er), knoepfe, ja(v), spaeter, angeboten() }
  const ANFRAGEN = [];
  const anfrage = (art) => ANFRAGEN.find((e) => e.art === art);
  let stylingGefragt = false, stylingRuhig = 0, stylingTimer = null, stylingWarteBisLandung = null;
  setInterval(() => {
    if (stylingGefragt || !maennchen) return;
    // war kein Platz für die Blase, erst nach der nächsten Landung wieder fragen
    if (stylingWarteBisLandung !== null && (maennchen.gelandet || 0) === stylingWarteBisLandung) return;
    const anfrage = naechsteAnfrage();
    if (!anfrage) return;
    const text = anfrage.text;
    const v = anfrage.vogel || maennchen;
    const r = v.el.getBoundingClientRect();
    const frei = v.zustand === "sitzt" && !v.el.hidden && v.hatGesprochen && !v.fragt && !v.auftrag && kontext() &&
      voegel.every((x) => x.blase.hidden) && !voegel.some((x) => x.auftrag) && !document.querySelector(".special-buehne, .aufbau-buehne, .munkel-buehne, .vogel.gast, dialog[open], .wz-fenster-huelle, .wz-klausur-frage, .mistel-ebene") &&
      !document.hidden && !gitarrenNacht() && ((anfrage.eintrag && anfrage.eintrag.ohneFrage && anfrage.eintrag.ueberall) || (r.top > -8 && r.bottom < window.innerHeight - 10));
    if (!frei) { stylingRuhig = 0; return; }
    stylingRuhig = stylingRuhig || performance.now();
    if (performance.now() - stylingRuhig < 3500) return;
    // Dinge ohne Frage (der Munkelvogel macht einfach etwas, z. B. Kaffee bringen)
    if (anfrage.eintrag && anfrage.eintrag.ohneFrage) {
      schonGefragt.add(anfrage.art);
      if (anfrage.eintrag.angeboten) anfrage.eintrag.angeboten();
      try { anfrage.eintrag.ja(v); } catch (fehler) { console.error(fehler); }
      stylingRuhig = 0;
      return;
    }
    stylingGefragt = true;
    stylingFrage(v, text, anfrage.art, anfrage.vorab);
  }, 500);
  function stylingFrage(v, text, art, vorab) {
    // erst der erzählende Satz in einer eigenen Blase, danach die Frage mit den Knöpfen
    if (vorab) {
      zeigeBlase(v, vorab);
      if (v.blase.hidden) { v.nachholen = null; stylingGefragt = false; stylingWarteBisLandung = v.gelandet || 0; return; }
      vorabGesagt.add(art);
      v.timer.forEach(clearTimeout); v.timer = [];
      clearTimeout(v.flugTimer);
      v.fragt = true; v.fragtArt = "vorab"; v.anfrageArt = art;
      v.timer.push(setTimeout(() => {
        v.fragt = false; v.fragtArt = null; v.blase.hidden = true; v.el.classList.remove("redet");
        if (v.zustand === "sitzt" && !v.auftrag) stylingFrage(v, text, art, null); else { stylingGefragt = false; planeAbflug(v); }
      }, 6200));
      return;
    }
    const knoepfe = document.createElement("span");
    knoepfe.className = "vogel-wahlen";
    const eintrag = anfrage(art), worte = (eintrag && eintrag.knoepfe) || ["Ja ✨", "Später"];
    knoepfe.innerHTML = '<span class="vogel-wahl ja" role="button" tabindex="0" data-antwort="ja">' + worte[0] + '</span><span class="vogel-wahl nein" role="button" tabindex="0" data-antwort="nein">' + worte[1] + "</span>";
    zeigeBlase(v, text, knoepfe);
    // keine freie Stelle für die Blase: nichts verändern und nach der nächsten Landung noch einmal versuchen
    if (v.blase.hidden) { v.nachholen = null; v.blase.classList.remove("mit-wahl"); stylingGefragt = false; stylingWarteBisLandung = v.gelandet || 0; return; }
    stylingWarteBisLandung = null;
    schonGefragt.add(art);
    if (art === "show" && ak.modenschau) ak.modenschau.angeboten();
    if (art === "raum" && ak.raum) ak.raum.angeboten();
    if (art === "nest" && ak.nest) ak.nest.angeboten();
    if (eintrag && eintrag.angeboten) eintrag.angeboten();
    v.timer.forEach(clearTimeout); v.timer = [];
    clearTimeout(v.flugTimer);
    v.fragt = true; v.fragtArt = "styling"; v.anfrageArt = art;
    clearTimeout(stylingTimer);
    // keine Antwort: Frage ausblenden, die nächste darf später kommen
    stylingTimer = setTimeout(() => { if (v.fragt && v.fragtArt === "styling") { v.fragt = false; v.fragtArt = null; v.blase.hidden = true; v.blase.classList.remove("mit-wahl"); v.el.classList.remove("redet"); stylingGefragt = false; stylingRuhig = 0; planeAbflug(v); } }, 20000);
  }
  // Nie zwei Dinge auf einmal: öffnet sich etwas anderes, während der Munkelvogel fragt,
  // nimmt er die Frage zurück und stellt sie später noch einmal
  const stoerung = () => document.querySelector("dialog[open], .special-buehne, .aufbau-buehne, .munkel-buehne, .wz-fenster-huelle:not(.geht), .mistel-ebene");
  function frageZuruecknehmen(v) {
    const art = v.fragtArt;
    v.fragt = false; v.fragtArt = null;
    clearTimeout(stylingTimer); clearTimeout(frageTimer);
    v.timer.forEach(clearTimeout); v.timer = [];
    v.blase.hidden = true; v.blase.classList.remove("mit-wahl"); v.el.classList.remove("redet");
    if (art === "styling" || art === "vorab") { schonGefragt.delete(v.anfrageArt); stylingGefragt = false; stylingRuhig = 0; }
    planeAbflug(v);
  }
  setInterval(() => {
    const v = voegel.find((x) => x.fragt);
    if (v && stoerung()) frageZuruecknehmen(v);
  }, 250);
  // Wächter: sollte eine Blase je doch Siegel, Ziffern oder Namen berühren (etwa weil das Handy kurz ruckelt),
  // verschwindet sie sofort; eine Frage wird zurückgenommen und später neu gestellt
  setInterval(() => {
    if (intro.hidden) return;
    const wichtig = [...document.querySelectorAll("#intro .siegel, #intro .countdown-ziffern, #intro .umschlag-name")].map((e) => e.getBoundingClientRect()).filter((r) => r.width);
    for (const v of voegel) {
      if (v.blase.hidden || v.zustand !== "sitzt") continue;
      const b = v.blase.getBoundingClientRect();
      const trifft = wichtig.some((r) => Math.max(0, Math.min(b.right, r.right) - Math.max(b.left, r.left)) * Math.max(0, Math.min(b.bottom, r.bottom) - Math.max(b.top, r.top)) > 30);
      if (!trifft) continue;
      if (v.fragt) frageZuruecknehmen(v);
      else { v.blase.hidden = true; v.el.classList.remove("redet"); }
    }
  }, 300);
  function antworteStyling(v, antwort) {
    v.fragt = false; v.fragtArt = null;
    clearTimeout(stylingTimer);
    v.blase.classList.remove("mit-wahl");
    const show = v.anfrageArt === "show", raum = v.anfrageArt === "raum", nest = v.anfrageArt === "nest";
    // nach dieser Frage darf später im Besuch noch die nächste kommen
    stylingGefragt = false; stylingRuhig = 0;
    const eintrag = anfrage(v.anfrageArt);
    if (eintrag) {
      if (antwort === "ja") {
        v.blase.hidden = true; v.el.classList.remove("redet");
        try { eintrag.ja(v); } catch (fehler) { console.error(fehler); }
        if (!v.partner) planeAbflug(v);
      } else {
        zeigeBlase(v, wahl(eintrag.spaeter || ["Okay, Toni! Vielleicht später 🥰"]));
        v.nachholen = null;
        v.timer.push(setTimeout(() => { v.blase.hidden = true; v.el.classList.remove("redet"); if (!v.partner) planeAbflug(v); }, 4200));
      }
      return;
    }
    if (antwort === "ja") {
      v.blase.hidden = true; v.el.classList.remove("redet");
      if (show) { if (ak.modenschau) ak.modenschau.oeffnen(); }
      else if (raum) { if (ak.raum) ak.raum.oeffnen(); }
      else if (nest) { if (ak.nest) ak.nest.oeffnen(); }
      else if (ak.styling) ak.styling.oeffnen();
      planeAbflug(v);
    } else {
      zeigeBlase(v, show
        ? wahl(["Okay, Toni! Ich lauf erst, wenn du zuschaust 😎 Der Knopf zur Fashion Show wartet auf dich ✨", "Kein Problem, Toni! Ich übe so lange meinen Laufstegblick 😎"])
        : raum ? wahl(["Okay, Toni! In Tonis Ecke kannst du jederzeit einrichten 🛋️", "Kein Problem, Toni. Vielleicht hast du später Lust 🥰"])
        : nest ? wahl(["Okay, Toni! Dann kuscheln wir uns so lange aneinander 🥰", "Kein Problem, Toni. In Tonis Ecke kannst du uns später ein Nest bauen 🪺"])
        : wahl(["Okay, Toni! Ich warte hier ganz geduldig 🐦", "Kein Problem, Toni. Der Knopf zum Umstylen wartet auf dich 👗"]));
      v.nachholen = null;
      v.timer.push(setTimeout(() => { v.blase.hidden = true; v.el.classList.remove("redet"); planeAbflug(v); }, 4200));
    }
  }
  const LOB_M = ["Danke, Toni! Ich seh ja richtig schick aus 😎", "Wow, Toni! Du hast echt einen guten Geschmack ✨", "Das gefällt mir, Toni! Ich fühl mich wie ein Model 🕺"];
  const LOB_W = ["Toni, ich fühl mich wunderschön! Danke 🥰", "Wie hübsch! Du hast so einen guten Geschmack, Toni ✨", "Danke, Toni! Darin dreh ich mich gleich noch mal 💃"];
  // neue Kleidung anziehen; nach dem Ankleidezimmer mit einer kleinen Drehung und Glitzer
  function einkleiden(mitFreude) {
    const aktive = voegel.filter((v) => v.el.isConnected && !v.kueken);
    for (const v of aktive) {
      const alt = v.el.querySelector("svg");
      if (!alt) continue;
      const tmp = document.createElement("span");
      tmp.innerHTML = vogelSvg(v.weiblich);
      alt.replaceWith(tmp.firstChild);
      if (v.pos) setzePosition(v, v.pos);
    }
    if (!mitFreude || ruhig) return;
    aktive.forEach((v, i) => {
      if (v.zustand !== "sitzt" || v.el.hidden || v.auftrag || !v.seite) return;
      setTimeout(() => {
        if (v.zustand !== "sitzt") return;
        const bild = v.el.querySelector("svg");
        bild.animate([{ rotate: "y 0deg", translate: "0 0" }, { rotate: "y 180deg", translate: "0 -12px", offset: 0.5 }, { rotate: "y 360deg", translate: "0 0" }], { duration: 900, easing: "ease-in-out" });
        for (let k = 0; k < 8; k++) {
          const w = (k / 8) * Math.PI * 2, t = teilchen("ankleide-glitzer", v.seite.x, v.seite.y - 26, k % 2 ? "✨" : "⭐");
          t.animate([{ transform: "translate(-50%,-50%) scale(.3)", opacity: 0 }, { transform: "translate(calc(-50% + " + (Math.cos(w) * 34).toFixed(1) + "px), calc(-50% + " + (Math.sin(w) * 30).toFixed(1) + "px)) scale(1)", opacity: 1, offset: 0.6 },
            { transform: "translate(calc(-50% + " + (Math.cos(w) * 44).toFixed(1) + "px), calc(-50% + " + (Math.sin(w) * 38).toFixed(1) + "px)) scale(.6)", opacity: 0 }], { duration: 1100, easing: "ease-out", fill: "forwards" }).onfinish = () => t.remove();
        }
        setTimeout(() => {
          if (v.zustand !== "sitzt" || v.fragt || v.auftrag) return;
          v.timer.forEach(clearTimeout); v.timer = []; clearTimeout(v.flugTimer);
          zeigeBlase(v, wahl(v.weiblich ? LOB_W : LOB_M)); v.nachholen = null;
          v.timer.push(setTimeout(() => { v.blase.hidden = true; v.el.classList.remove("redet"); if (!v.partner) planeAbflug(v); }, 4400));
        }, 950);
      }, 350 + i * 4800);
    });
  }

  /* ---------- Spontanes Special am 15.11. (14 bis 17 Uhr): der Munkelvogel war heimlich mit beim Brunch ---------- */
  const pause = (ms) => new Promise((r) => setTimeout(r, ms));
  function brunchHeute() {
    const d = ak.intro.datum();
    return d.jahr === KALENDER.jahr && d.monat === 11 && d.tag === 15 && d.stunde >= 14 && d.stunde < 17 &&
      kontext() === "countdown" && !(ak.zeitreise && ak.zeitreise.aktiv());
  }
  // kleine Teilchen in Seitenkoordinaten (Staub, Krümel, Schweißtropfen)
  function teilchen(klasse, x, y, inhalt) {
    const t = document.createElement("span");
    t.className = klasse;
    t.setAttribute("aria-hidden", "true");
    if (inhalt) t.textContent = inhalt;
    t.style.left = x + "px"; t.style.top = y + "px";
    ebene.appendChild(t);
    return t;
  }
  // Punkt im Vogelbild (viewBox 60×60) in Seitenkoordinaten, gespiegelt je nach Blickrichtung
  function amVogel(v, sx, sy) {
    const b = v.el.offsetWidth || GROESSE, h = v.el.offsetHeight || GROESSE;
    const x = v.blick < 0 ? 60 - sx : sx;
    return { x: v.seite.x - b / 2 + (x / 60) * b, y: v.seite.y - h + (sy / 60) * h };
  }
  function staubwolke(v) {
    const fuss = { x: v.seite.x, y: v.seite.y - 2 };
    for (let k = 0; k < 9; k++) {
      const s = teilchen("brunch-staub", fuss.x, fuss.y);
      const w = Math.PI * (0.04 + (0.92 * k) / 8), r = 26 + Math.random() * 14, g = 0.6 + Math.random() * 0.6;
      s.animate([
        { transform: "translate(-50%,-50%) scale(" + g * 0.5 + ")", opacity: 0.95 },
        { transform: "translate(calc(-50% + " + (-Math.cos(w) * r).toFixed(1) + "px), calc(-50% - " + (Math.sin(w) * r * 0.45 + 4).toFixed(1) + "px)) scale(" + (g * 1.4).toFixed(2) + ")", opacity: 0 },
      ], { duration: 700 + Math.random() * 250, easing: "cubic-bezier(.2,.7,.3,1)", fill: "forwards" }).onfinish = () => s.remove();
    }
  }
  // ein Krümel fliegt im Bogen aus dem Schnabel und fällt herunter
  function kruemelFliegt(v) {
    const p = amVogel(v, 33, 37);
    const k = teilchen("brunch-kruemel", p.x, p.y);
    const dx = (v.blick < 0 ? -1 : 1) * (34 + Math.random() * 26), hoch = 26 + Math.random() * 12, fall = 70 + Math.random() * 30;
    const bild = [];
    for (let i = 0; i <= 8; i++) {
      const u = i / 8, y = -4 * hoch * u * (1 - u) + fall * u * u;
      bild.push({ transform: "translate(-50%,-50%) translate(" + (dx * u).toFixed(1) + "px," + y.toFixed(1) + "px) rotate(" + Math.round(u * 540) + "deg)", opacity: u > 0.8 ? (1 - u) * 5 : 1 });
    }
    k.animate(bild, { duration: 950, easing: "linear", fill: "forwards" }).onfinish = () => k.remove();
  }
  function schweiss(v) {
    const p = amVogel(v, 44, 17);
    const t = teilchen("brunch-schweiss", p.x, p.y, "💦");
    t.animate([{ transform: "translate(-50%,-50%) scale(.3)", opacity: 0 }, { transform: "translate(-50%,-60%) scale(1)", opacity: 1, offset: 0.25 },
      { transform: "translate(-30%,40%) scale(.9)", opacity: 0 }], { duration: 1100, easing: "ease-out", fill: "forwards" }).onfinish = () => t.remove();
  }
  const bild = (v) => v.el.querySelector("svg");
  function plumps(v) {
    return bild(v).animate([
      { translate: "0 -8px", scale: "1 1" }, { translate: "0 0", scale: "1.32 .7", offset: 0.3 }, { translate: "0 -3px", scale: ".9 1.12", offset: 0.55 },
      { translate: "0 0", scale: "1.06 .95", offset: 0.78 }, { translate: "0 0", scale: "1 1" },
    ], { duration: 700, easing: "ease-out" }).finished.catch(() => {});
  }
  function hicks(v) {
    kruemelFliegt(v);
    return bild(v).animate([
      { translate: "0 0", scale: "1 1" }, { translate: "0 -8px", scale: ".9 1.14", offset: 0.28 }, { translate: "0 0", scale: "1.1 .92", offset: 0.6 }, { translate: "0 0", scale: "1 1" },
    ], { duration: 460, easing: "ease-out" }).finished.catch(() => {});
  }
  // Abheben versuchen: flattern, ein paar Pixel hoch, zappeln und wieder runterplumpsen
  async function abhebenVersuch(v, mitSchweiss) {
    v.el.classList.add("zappelt");
    if (mitSchweiss) setTimeout(() => schweiss(v), 500);
    await bild(v).animate([
      { translate: "0 0", scale: "1 1" }, { translate: "0 -10px", offset: 0.4 }, { translate: "1.5px -8px", offset: 0.5 }, { translate: "-1.5px -10px", offset: 0.6 },
      { translate: "1px -7px", offset: 0.7 }, { translate: "0 -6px", offset: 0.8 }, { translate: "0 0", scale: "1 1", offset: 0.87 },
      { translate: "0 0", scale: "1.28 .76", offset: 0.93 }, { translate: "0 0", scale: "1 1" },
    ], { duration: 1700, easing: "ease-in-out" }).finished.catch(() => {});
    v.el.classList.remove("zappelt");
  }
  async function sagUndWarte(v, text, ms) {
    zeigeBlase(v, text);
    v.nachholen = null;
    await pause(ms);
    v.blase.hidden = true; v.el.classList.remove("redet");
  }
  async function brunchSzene() {
    const v = maennchen;
    v.el.classList.add("satt");
    if (ruhig) { lande(v, false, true).then(() => setTimeout(() => sprich(v), 2000)); return; }
    // Platz suchen wie bei einer normalen Landung
    const k = "countdown";
    let name = ERSTER_PLATZ[k];
    if (!sitzpunkt(v, k, name)) name = freierPlatz(v, k);
    if (!name) { await pause(1500); return brunchSzene(); }
    const zielFn = () => sitzpunkt(v, k, name);
    v.auftrag = true;
    v.beimKlick = () => true;
    v.platz = name; v.kontext = k; v.ziel = name;
    v.el.classList.add("im-countdown");
    // schwerer Anflug: durchhängen, hochkämpfen, wieder durchhängen, Bruchlandung
    const z = zielFn(), vonRechts = z.x < W() / 2 ? false : true;
    const sx = vonRechts ? W() + 70 : -70, l = (a) => sx + (z.x - sx) * a;
    const weg = [{ x: sx, y: z.y - 150 }, { x: l(0.22), y: z.y - 118 }, { x: l(0.42), y: z.y - 62 }, { x: l(0.58), y: z.y - 96 }, { x: l(0.78), y: z.y - 34 }, { x: l(0.92), y: z.y - 52 }, z];
    v.zustand = "fliegt"; v.el.classList.add("fliegt", "schwer"); v.el.hidden = false;
    await animiere(v, weg, 4600, zielFn);
    v.zustand = "sitzt"; v.el.classList.remove("fliegt", "schwer"); v.ziel = null;
    v.blick = z.x < W() / 2 ? 1 : -1; setzePosition(v, zielFn() || z);
    staubwolke(v);
    await plumps(v);
    await bild(v).animate([{ rotate: "0deg" }, { rotate: "-14deg", offset: 0.25 }, { rotate: "9deg", offset: 0.55 }, { rotate: "-4deg", offset: 0.8 }, { rotate: "0deg" }],
      { duration: 1000, easing: "ease-in-out" }).finished.catch(() => {});
    await pause(500);
    await sagUndWarte(v, "Hi Toni! Ich war heimlich mit beim Brunch 🤭", 3600);
    await pause(300);
    await sagUndWarte(v, "Ich hab nur eine kleine Zimtschnecke mitgenommen… es waren sieben 😋", 4400);
    await pause(400);
    await abhebenVersuch(v, false);
    await pause(500);
    await abhebenVersuch(v, true);
    await pause(300);
    await sagUndWarte(v, "Puh, Toni… ich glaub, ich bin zu schwer zum Fliegen 😵", 4000);
    // jetzt darf Toni ihn anstupsen
    let stupser = 0, fertig;
    const getippt = new Promise((r) => (fertig = r));
    const SAETZE = ["Hicks! 🤭", "Hicks! Oh, da war noch ein Krümel 😳", "Bitte nicht mehr pieksen, Toni, sonst platz ich 😵"];
    let sprichtBis = 0;
    zeigeBlase(v, "Stups mich mal an, vielleicht hilft das 🥺");
    v.nachholen = null;
    v.beimKlick = () => {
      if (stupser >= 3) return true;
      const t = performance.now();
      if (t < sprichtBis) return true;
      sprichtBis = t + 900;
      hicks(v);
      v.timer.forEach(clearTimeout); v.timer = [];
      zeigeBlase(v, SAETZE[stupser]); v.nachholen = null;
      stupser++;
      if (stupser < 3) v.timer.push(setTimeout(() => { v.blase.hidden = true; v.el.classList.remove("redet"); }, 3200));
      else setTimeout(fertig, 3600);
      return true;
    };
    // wenn Toni nicht tippt: selbst ein Hickser, und nach einer Weile kommt die Munkelvogeline trotzdem
    const vonSelbst = (zeit, text) => setTimeout(() => { if (!stupser) { hicks(v); v.timer.forEach(clearTimeout); v.timer = []; zeigeBlase(v, text); v.nachholen = null; v.timer.push(setTimeout(() => { v.blase.hidden = true; v.el.classList.remove("redet"); }, 2600)); } }, zeit);
    const hickser = [vonSelbst(9000, "Hicks! 😳"), vonSelbst(16000, "Hicks! Huch, schon wieder 🙈")];
    const sicherheit = setTimeout(() => { if (stupser < 3) { stupser = 3; fertig(); } }, 23000);
    await getippt;
    hickser.forEach(clearTimeout); clearTimeout(sicherheit);
    v.timer.forEach(clearTimeout); v.timer = [];
    v.blase.hidden = true; v.el.classList.remove("redet");
    v.beimKlick = () => true;
    await pause(600);
    await vogelineHoltIhn(v);
    // später ganz normal wiederkommen, aber immer noch kugelrund
    v.beimKlick = () => { if (v.auftrag) return true; kruemelFliegt(v); return false; };
    await pause(5500);
    v.auftrag = false;
    lande(v, false).then(() => setTimeout(() => sprich(v), 2000));
  }
  async function vogelineHoltIhn(v) {
    const el = document.createElement("span");
    el.className = "vogel weibchen brunch-gast";
    el.setAttribute("aria-hidden", "true");
    el.innerHTML = '<span class="vogel-blase" hidden></span>' + vogelSvg(true);
    el.style.visibility = "hidden";
    ebene.appendChild(el);
    const w = { el, blase: el.querySelector(".vogel-blase"), weiblich: true, zustand: "fliegt", blick: 1, pos: null, timer: [] };
    const neben = () => { const p = v.pos; const rechts = p.x + 50 < W() - 20; return { x: p.x + (rechts ? 46 : -46), y: p.y }; };
    const z = neben(), vonLinks = z.x < v.pos.x;
    const start = { x: vonLinks ? -70 : W() + 70, y: z.y - 170 };
    w.blick = vonLinks ? 1 : -1; setzePosition(w, start); el.style.visibility = "";
    el.classList.add("fliegt");
    await animiere(w, [start, { x: (start.x + z.x) / 2, y: Math.min(start.y, z.y) - 50 }, { x: z.x + (vonLinks ? -26 : 26), y: z.y - 26 }, z], 2400, neben);
    w.zustand = "sitzt"; el.classList.remove("fliegt");
    let mitgehen = true;
    const folge = () => { if (!mitgehen || w.zustand !== "sitzt") return; w.blick = v.pos.x > w.pos.x ? 1 : -1; setzePosition(w, neben()); requestAnimationFrame(folge); };
    folge();
    el.classList.remove("hopst"); void el.offsetWidth; el.classList.add("hopst");
    await pause(500);
    // sie schüttelt den Kopf
    const kopf = () => bild(w).animate([{ rotate: "0deg" }, { rotate: "-11deg", offset: 0.15 }, { rotate: "11deg", offset: 0.35 }, { rotate: "-10deg", offset: 0.55 }, { rotate: "9deg", offset: 0.75 }, { rotate: "0deg" }],
      { duration: 1000, easing: "ease-in-out" }).finished.catch(() => {});
    zeigeBlase(w, "Da bist du ja! Sieben Zimtschnecken?! 🙈");
    await kopf();
    await pause(2900);
    w.blase.hidden = true; el.classList.remove("redet");
    await pause(250);
    v.blick = w.pos.x > v.pos.x ? 1 : -1; setzePosition(v, v.pos);
    await sagUndWarte(v, "Es waren sehr kleine Zimtschnecken… 😇", 3200);
    await pause(250);
    zeigeBlase(w, "Na komm, ich bring dich nach Hause, du kleiner Vielfraß 😄");
    await pause(3800);
    w.blase.hidden = true; el.classList.remove("redet");
    await pause(250);
    await sagUndWarte(v, "Tschüss, Toni! Nie wieder sieben… höchstens sechs 😋", 3800);
    // sie flattert über ihn und packt ihn
    mitgehen = false;
    const s = { x: v.pos.x, y: v.pos.y };
    const oben = { x: s.x, y: s.y - 40 };
    // beim Tragen flattert sie, die Füße halten ihn fest
    w.zustand = "fliegt"; el.classList.remove("hopst"); el.classList.add("zappelt");
    await animiere(w, [w.pos, { x: (w.pos.x + oben.x) / 2, y: oben.y - 26 }, oben], 900);
    // zusammen davon, er baumelt unter ihr
    const nachRechts = s.x > W() / 2, r = nachRechts ? 1 : -1;
    const pfad = [s, { x: s.x + r * 14, y: s.y - 26 }, { x: s.x + r * 50, y: s.y - 12 }, { x: s.x + r * 110, y: s.y - 80 }, { x: s.x + r * 175, y: s.y - 62 }, { x: nachRechts ? W() + 110 : -110, y: s.y - 230 }];
    v.zustand = "fliegt"; v.el.classList.add("haengt"); v.platz = null;
    await Promise.all([
      animiere(v, pfad.map((p) => ({ x: p.x, y: p.y })), 4400),
      animiere(w, pfad.map((p) => ({ x: p.x, y: p.y - 40 })), 4400),
    ]);
    el.remove();
    v.el.hidden = true; v.el.classList.remove("haengt"); v.zustand = "weg";
  }

  /* ---------- Start ---------- */
  const maennchen = erstelleVogel(false, saetzeMaennchen);
  let weibchen = null;
  let festhaltenLaeuft = false;
  requestAnimationFrame(gitarreZeigen);
  const warten = setInterval(() => {
    if (!ak.intro.bereit() || !grussQuelle.textContent) return;
    // morgens schlafen die zwei noch im Nest, bis Toni sie weckt
    if (weckenHeute()) { clearInterval(warten); schlafenLassen(); return; }
    if (!kontext()) return;
    clearInterval(warten);
    festhaltenLaeuft = true;
    requestAnimationFrame(festhalten);
    // Erst wenn die Animation des Tages vorbei ist (und noch 3 Sekunden mehr),
    // fliegt der Munkelvogel ins Bild
    wartAufRuhe().then(() => {
      if (brunchHeute()) { brunchSzene(); return; }
      lande(maennchen, false, true).then(() => setTimeout(() => sprich(maennchen), 2000));
      if (zuZweit()) {
        weibchen = erstelleVogel(true, saetzeWeibchen);
        weibchen.partner = maennchen;
        setTimeout(() => lande(weibchen, false).then(() => setTimeout(() => { if (weibchen.zustand === "sitzt") sprich(weibchen); }, 5200)), 3800);
      }
      if (kuekenErlaubt()) setTimeout(kuekenDazu, zuZweit() ? 5600 : 3200);
    });
  }, 250);

  // Läuft gerade eine Szene des Tages (Capy Special, Aufbau, Postbote)?
  const szeneLaeuft = () => !!document.querySelector(".special-buehne, .aufbau-buehne");
  // Gibt es heute eine Szene, die gleich von selbst startet?
  function szeneErwartet() {
    const d = ak.intro.datum();
    if (d.jahr !== KALENDER.jahr || d.monat !== 11) return false;
    if (kontext() === "countdown") return ak.intro.phase() === "warten" && d.tag >= 11 && d.tag <= 25;
    return d.tag >= 27 && d.tag <= 30;
  }
  function wartAufRuhe() {
    return new Promise((fertig) => {
      const start = performance.now();
      const erwartet = szeneErwartet();
      let gesehen = false, ruhigSeit = null;
      const t = setInterval(() => {
        const jetzt = performance.now();
        if (szeneLaeuft()) { gesehen = true; ruhigSeit = null; return; }
        // auf eine angekündigte Szene höchstens 6 Sekunden warten
        if (erwartet && !gesehen && jetzt - start < 6000) return;
        if (ruhigSeit === null) ruhigSeit = jetzt;
        if (jetzt - ruhigSeit >= (gesehen ? 3000 : 0) || jetzt - start > 120000) { clearInterval(t); fertig(); }
      }, 200);
    });
  }

  // Von außen: das Rotkehlchen sagt einen Satz, falls es gerade sitzt (sonst false)
  function sage(satz) {
    const v = voegel[0];
    if (!v || v.auftrag || v.zustand !== "sitzt" || v.el.hidden) return false;
    const r = v.el.getBoundingClientRect();
    if (r.bottom < 0 || r.top > window.innerHeight) return false;
    v.timer.forEach(clearTimeout); v.timer = [];
    clearTimeout(v.flugTimer);
    zeigeBlase(v, satz);
    v.timer.push(setTimeout(() => { v.blase.hidden = true; v.el.classList.remove("redet"); planeAbflug(v); }, 5600));
    return true;
  }
  /* ---------- Besondere Aufträge (z. B. die Kerze vor einer Klausur) ---------- */
  // Zu einem Punkt fliegen und dort sitzen bleiben
  async function fliegeZu(zielFn) {
    const v = maennchen, z0 = zielFn();
    if (!z0 || v.auftrag) return false;
    v.auftrag = true;
    v.timer.forEach(clearTimeout); v.timer = []; clearTimeout(v.flugTimer);
    v.blase.hidden = true; v.el.classList.remove("redet"); v.fragt = false;
    const start = v.zustand === "sitzt" && !v.el.hidden && v.pos ? v.pos : { x: W() + 80, y: Math.max(-60, z0.y - 220) };
    v.zustand = "fliegt"; v.el.hidden = false; v.el.classList.add("fliegt");
    await animiere(v, [start, { x: (start.x + z0.x) / 2, y: Math.min(start.y, z0.y) - 70 }, { x: z0.x + 26, y: z0.y - 24 }, z0], 2000, zielFn);
    v.zustand = "sitzt"; v.el.classList.remove("fliegt"); v.platz = null; v.ziel = null;
    v.kontext = kontext(); v.folge = zielFn;
    v.el.classList.remove("hopst"); void v.el.offsetWidth; v.el.classList.add("hopst");
    return true;
  }
  // Etwas sagen und warten, bis die Blase wieder weg ist
  function sagKurz(text, ms) {
    const v = maennchen;
    zeigeBlase(v, text);
    return new Promise((fertig) => setTimeout(() => { v.blase.hidden = true; v.el.classList.remove("redet"); fertig(); }, ms || 3800));
  }
  // Mit etwas im Schnabel davonfliegen und später wiederkommen
  async function fliegeDavon(mit) {
    const v = maennchen;
    if (!v.pos) return;
    v.blase.hidden = true; v.zustand = "fliegt"; v.el.classList.add("fliegt");
    let lauf = true;
    const trage = () => {
      if (!lauf || !mit) return;
      mit.style.left = v.pos.x + "px"; mit.style.top = v.pos.y - 14 + "px";
      requestAnimationFrame(trage);
    };
    trage();
    const s = v.pos;
    await animiere(v, [s, { x: s.x + 40, y: s.y - 80 }, { x: s.x + 160, y: s.y - 220 }, { x: W() + 100, y: -100 }], 3200);
    lauf = false;
    v.el.hidden = true;
    if (mit) mit.remove();
    v.auftrag = false; v.zustand = "weg";
    setTimeout(() => lande(v, false), 5000);
  }
  function weiter() { maennchen.auftrag = false; maennchen.folge = null; maennchen.hatGesprochen = true; planeAbflug(maennchen); }
  // Der Munkelvogel ist frei für einen Auftrag: gelandet, hat gesprochen, keine Frage offen, alle Vögel still
  const istDa = () => maennchen.zustand === "sitzt" && !maennchen.el.hidden && maennchen.hatGesprochen && !maennchen.fragt && !voegel.some((x) => x.auftrag) && !document.querySelector(".munkel-buehne") &&
    voegel.every((v) => v.blase.hidden) && (!weibchen || (weibchen.zustand === "sitzt" && weibchen.hatGesprochen)) && !document.querySelector(".vogel.gast");
  function raumFertig(erstesMal) {
    const v = weibchen && weibchen.zustand === "sitzt" && !weibchen.el.hidden ? weibchen : maennchen.zustand === "sitzt" && !maennchen.el.hidden ? maennchen : null;
    if (!v || v.fragt || v.auftrag) return;
    setTimeout(() => {
      if (v.zustand !== "sitzt" || v.fragt) return;
      v.timer.forEach(clearTimeout); v.timer = [];
      zeigeBlase(v, v.weiblich
        ? wahl(erstesMal ? ["Wie schön es hier jetzt ist, Toni! Danke 🥰", "Toni, das ist ja wunderschön geworden! Ich fühl mich wie in einem neuen Zuhause 🥰"] : ["Hübsch, Toni! Gefällt mir sehr 🥰"])
        : wahl(["Wow, Toni! Hier sieht es jetzt richtig gemütlich aus 🥰", "Toni, das hast du wunderschön eingerichtet ✨"]));
      v.nachholen = null;
      v.timer.push(setTimeout(() => { v.blase.hidden = true; v.el.classList.remove("redet"); if (!v.partner) planeAbflug(v); }, 4600));
    }, 1300);
  }
  function nestFertig(erstesMal) {
    const v = weibchen && weibchen.zustand === "sitzt" && !weibchen.el.hidden ? weibchen : maennchen.zustand === "sitzt" && !maennchen.el.hidden ? maennchen : null;
    if (!v || v.fragt || v.auftrag) return;
    setTimeout(() => {
      if (v.zustand !== "sitzt" || v.fragt) return;
      v.timer.forEach(clearTimeout); v.timer = [];
      zeigeBlase(v, v.weiblich
        ? (erstesMal ? wahl(["Danke, Toni! Wie gemütlich 🥰 Da kuscheln wir uns heute Nacht rein", "Toni, das ist das schönste Nest der Welt! Danke 🥰"]) : "Noch gemütlicher, Toni! Danke 🥰")
        : wahl(["Wow, Toni, so ein schönes Nest! Danke 🥰", "Toni, da schlafen wir heute Nacht wie im Himmel 🌙"]));
      v.nachholen = null;
      v.timer.push(setTimeout(() => { v.blase.hidden = true; v.el.classList.remove("redet"); if (!v.partner) planeAbflug(v); }, 4600));
    }, 1200);
  }


  /* ---------- Wecken: beim ersten Besuch vor 9 Uhr schlafen beide noch im Nest ---------- */
  const WECK_SCHLUESSEL = "toni-wz-geweckt";
  const geweckt = () => { try { return JSON.parse(localStorage.getItem(WECK_SCHLUESSEL) || "[]"); } catch (_) { return []; } };
  function weckenHeute() {
    const d = ak.intro.datum();
    if (d.jahr !== KALENDER.jahr || d.monat !== 11 || d.tag < 21 || d.tag > 25 || ak.intro.phase() !== "warten" || (ak.zeitreise && ak.zeitreise.aktiv())) return false;
    if (d.stunde < 5 || d.stunde >= 9 || geweckt().includes(d.tag)) return false;
    return !!(ak.nest && ak.nest.verschlafen && ak.nest.wahl && (ak.nest.wahl() || (ak.ei && ak.ei.brauchtNest && ak.ei.brauchtNest())));
  }
  const WECK_SAETZE = ["Gähn … 🥱 Oh, Toni! Danke fürs Wecken", "Huch, schon hell? 🥱", "Mmh … noch fünf Minuten … ach, du bist es, Toni! 🥰", "Gääähn 🥱 Ich hab gerade von dir geträumt, Toni"];
  let weckTimer = [], weckHinweis = null;
  function schlafenLassen() {
    maennchen.vomNest = true;
    ak.nest.verschlafen(true);
    const nestDa = () => ak.nest.element && ak.nest.element();
    // ein leiser Hinweis, sobald keine Szene mehr läuft; nach einer Weile kitzelt die Sonne sie wach
    let ruhigSeit = 0, hinweise = 0, sichtbar = 0;
    const t = setInterval(() => {
      if (!maennchen.vomNest) { clearInterval(t); return; }
      const ruhe = nestDa() && !document.querySelector(".special-buehne, dialog[open], .wz-fenster-huelle, .munkel-buehne") && !document.hidden;
      if (!ruhe) { ruhigSeit = 0; return; }
      ruhigSeit = ruhigSeit || performance.now();
      sichtbar += 0.5;
      const z = (performance.now() - ruhigSeit) / 1000;
      if ((hinweise === 0 && z > 3) || (hinweise === 1 && z > 25)) {
        hinweise++;
        if (ak.wartezeit && ak.wartezeit.blase) weckHinweis = ak.wartezeit.blase(nestDa(), hinweise === 1 ? "Psst … die zwei schlafen noch. Tipp mal aufs Nest 😴" : "Tipp aufs Nest, dann wachen sie auf ☀️", 4200);
      }
      if (sichtbar > 60) { clearInterval(t); aufwachen(true); }
    }, 500);
    weckTimer.push(t);
  }
  function aufwachen(vonSelbst) {
    if (!maennchen.vomNest) return;
    maennchen.vomNest = false;
    const d = ak.intro.datum();
    try { localStorage.setItem(WECK_SCHLUESSEL, JSON.stringify(geweckt().concat(d.tag))); } catch (_) { /* egal */ }
    weckTimer.forEach(clearInterval);
    if (weckHinweis) { weckHinweis.remove(); weckHinweis = null; }
    ak.nest.verschlafen(false);
    if (!festhaltenLaeuft) { festhaltenLaeuft = true; requestAnimationFrame(festhalten); }
    const v = maennchen, k = kontext();
    const p = k && sitzpunkt(v, k, "nest");
    if (!p) { lande(v, false, true).then(() => setTimeout(() => sprich(v), 2000)); return; }
    // er krabbelt aus dem Nest, streckt sich und gähnt
    v.platz = "nest"; v.kontext = k; v.ziel = null;
    v.el.classList.add("im-countdown");
    v.blick = p.x > W() / 2 ? -1 : 1;
    v.zustand = "sitzt"; v.el.hidden = false; v.auftrag = true;
    setzePosition(v, p);
    if (!ruhig) bild(v).animate([{ translate: "0 14px", scale: "1 .7", opacity: 0 }, { translate: "0 -6px", scale: ".92 1.12", opacity: 1, offset: 0.45 }, { translate: "0 0", scale: "1.08 .94", offset: 0.7 }, { translate: "0 0", scale: "1 1", opacity: 1 }], { duration: 900, easing: "ease-out" });
    setTimeout(() => {
      v.el.classList.add("zappelt");
      setTimeout(() => v.el.classList.remove("zappelt"), 700);
      zeigeBlase(v, vonSelbst ? "Gähn … 🥱 Die Sonne hat mich wach gekitzelt" : wahl(WECK_SAETZE)); v.nachholen = null;
    }, 950);
    setTimeout(() => { v.blase.hidden = true; v.el.classList.remove("redet"); v.auftrag = false; sprich(v); }, 4800);
  }

  /* ---------- Das Küken (ab dem 26.11. im Kalender, wenn es geschlüpft ist) ---------- */
  function kuekenSvg(hut) {
    let flaum = "";
    for (let k = 0; k < 14; k++) { const w = (k / 14) * Math.PI * 2; flaum += '<circle cx="' + (30 + Math.cos(w) * 17).toFixed(1) + '" cy="' + (35 + Math.sin(w) * 17).toFixed(1) + '" r="3.3" fill="#e8b27a"/>'; }
    return '<svg viewBox="0 0 60 60" aria-hidden="true">' +
      '<g class="beine"><path d="M25 51l-2 6M35 51l2 6M23 57h-3.5M37 57h3.5" stroke="#e39a3b" stroke-width="2.4" stroke-linecap="round"/></g>' +
      '<g class="vogel-koerper">' +
      '<path class="fluegel-hinten" d="M30 30q-16-14-24-4q8 2 12 9z" fill="#c98552"/>' +
      '<path d="M28 18q-2-8 2-10q0 5 2 9zM31 18q3-7 8-6q-4 3-5 7z" fill="#d99a62"/>' +
      flaum + '<circle cx="30" cy="35" r="17.5" fill="#e8b27a"/>' +
      '<ellipse cx="30" cy="43" rx="11" ry="8.5" fill="#fbe3c4"/><ellipse cx="30" cy="38.5" rx="8.5" ry="5" fill="#f6a07f" opacity=".5"/>' +
      '<path class="fluegel-vorne" d="M13.5 33q-5 8 3 12q-1.5-7-3-12z" fill="#c98552"/><path d="M46.5 33q5 8-3 12q1.5-7 3-12z" fill="#c98552"/>' +
      '<circle cx="23.5" cy="30.5" r="4.6" fill="#2a1a12"/><circle cx="36.5" cy="30.5" r="4.6" fill="#2a1a12"/>' +
      '<circle cx="25.2" cy="28.8" r="1.7" fill="#fff"/><circle cx="38.2" cy="28.8" r="1.7" fill="#fff"/><circle cx="22.4" cy="32.2" r=".7" fill="#fff"/><circle cx="35.4" cy="32.2" r=".7" fill="#fff"/>' +
      '<rect class="augenlid" x="18.4" y="25.5" width="10.2" height="10.2" rx="5.1" fill="#e8b27a"/><rect class="augenlid" x="31.4" y="25.5" width="10.2" height="10.2" rx="5.1" fill="#e8b27a"/>' +
      '<path d="M27 35.2l3 3.8 3-3.8q-3-1.6-6 0z" fill="#f3b23c"/>' +
      '<circle cx="18.2" cy="37" r="2.6" fill="#ff9fb4" opacity=".75"/><circle cx="41.8" cy="37" r="2.6" fill="#ff9fb4" opacity=".75"/>' +
      (hut ? '<g transform="translate(35 8) rotate(18)"><path d="M-7 12L0-8 7 12z" fill="#ff7aa2"/><path d="M-4.4 5h8.8M-2.2-1h4.4" stroke="#fff3b0" stroke-width="2"/><circle cy="-8.6" r="2.7" fill="#f3c84b"/><ellipse cy="12" rx="8" ry="2" fill="#e85d7e"/></g>' : "") +
      "</g></svg>";
  }
  const geburtstagHeute = () => { const d = ak.intro.datum(); return d.jahr === KALENDER.jahr && d.monat === 11 && d.tag === 26; };
  function kuekenErlaubt() {
    const d = ak.intro.datum();
    if (d.jahr !== KALENDER.jahr || !(d.monat === 12 || (d.monat === 11 && d.tag >= 26))) return false;
    return !!(ak.ei && ak.ei.geschluepft && ak.ei.geschluepft());
  }
  let kueken = null;
  const PIEP = () => {
    const name = ak.ei && ak.ei.name ? ak.ei.name() : "";
    return geburtstagHeute()
      ? ["Piep! Happy Birthday, Toni! 🎂", "Piep piep! Ich hab dich lieb, Toni ♥️", name ? "Piep! Ich bin " + name + " 🐣" : "Piep! 🐣"]
      : ["Piep! 🐣", "Piep piep, Toni! ♥️", "Piep! Ich kann schon fast fliegen 🪶", "Piep! Mama sagt, du hast mich ganz lieb warm gehalten 🥰", name ? "Piep! Ich bin " + name + " 🐣" : "Piep piep! 🐣"];
  };
  function kuekenDazu() {
    if (kueken && kueken.el.isConnected) return kueken;
    kueken = erstelleVogel(false, () => []);
    kueken.kueken = true;
    kueken.partner = maennchen;
    kueken.hatGesprochen = true;
    kueken.el.classList.add("kueken");
    kueken.el.setAttribute("aria-label", "Küken antippen");
    const tmp = document.createElement("span");
    tmp.innerHTML = kuekenSvg(geburtstagHeute());
    kueken.el.querySelector("svg").replaceWith(tmp.firstChild);
    let spricht = 0;
    kueken.beimKlick = () => {
      const t = performance.now();
      if (t < spricht || kueken.auftrag) return true;
      spricht = t + 2600;
      kueken.el.classList.remove("hopst"); void kueken.el.offsetWidth; kueken.el.classList.add("hopst");
      kueken.timer.forEach(clearTimeout); kueken.timer = [];
      zeigeBlase(kueken, wahl(PIEP())); kueken.nachholen = null;
      kueken.timer.push(setTimeout(() => { kueken.blase.hidden = true; kueken.el.classList.remove("redet"); }, 3000));
      return true;
    };
    lande(kueken, false);
    return kueken;
  }

  /* ---------- Werkzeuge für die Spiele mit den Munkelvögeln (munkelspiele.js, ei.js) ---------- */
  // die Munkelvogeline dazuholen, ohne dass sie gleich redet oder Freunde mitbringt
  function neuesWeibchen() {
    if (weibchen && weibchen.el.isConnected) return weibchen;
    weibchen = erstelleVogel(true, saetzeWeibchen);
    weibchen.partner = maennchen;
    weibchen.hatGesprochen = true;
    weibchenEingeladen = true; frageBeantwortet = true;
    return weibchen;
  }
  // ein Vogel fliegt zu einem Punkt (von dort, wo er gerade ist, sonst von außerhalb) und bleibt dort für einen Auftrag
  async function holeHer(v, zielFn, dauer) {
    const z0 = zielFn();
    if (!z0) return false;
    v.auftrag = true; v.folge = null;
    v.timer.forEach(clearTimeout); v.timer = []; clearTimeout(v.flugTimer);
    v.blase.hidden = true; v.el.classList.remove("redet", "hopst"); v.fragt = false; v.fragtArt = null;
    const da = v.zustand !== "weg" && !v.el.hidden && v.pos;
    const vonLinks = z0.x > W() / 2 ? false : true;
    const start = da ? v.pos : { x: vonLinks ? -80 : W() + 80, y: Math.max(-60, z0.y - 220) };
    v.zustand = "fliegt"; v.el.hidden = false; v.el.classList.add("fliegt");
    v.platz = null; v.ziel = null;
    await animiere(v, [start, { x: (start.x + z0.x) / 2, y: Math.min(start.y, z0.y) - 60 }, { x: z0.x + (start.x < z0.x ? -24 : 24), y: z0.y - 24 }, z0], dauer || 1900, zielFn);
    if (!v.auftrag) return false;
    v.zustand = "sitzt"; v.el.classList.remove("fliegt");
    v.kontext = kontext(); v.folge = zielFn;
    setzePosition(v, zielFn() || z0);
    v.el.classList.remove("hopst"); void v.el.offsetWidth; v.el.classList.add("hopst");
    return true;
  }
  // nach einem Auftrag zurück auf einen normalen Platz
  async function heimfliegen(v) {
    v.auftrag = false; v.folge = null; v.beimKlick = v.kueken ? v.beimKlick : null; v.fragt = false; v.fragtArt = null;
    v.timer.forEach(clearTimeout); v.timer = [];
    v.blase.hidden = true; v.el.classList.remove("redet", "zappelt");
    const k = kontext();
    let name = null;
    if (k && v.pos && !v.el.hidden) {
      if (v.partner) {
        for (let i = 0; i < 40 && !(v.partner.ziel || (v.partner.zustand === "sitzt" && v.partner.platz)); i++) await pause(150);
        if (v.auftrag) return;
        name = v.partner.ziel || v.partner.platz;
      } else name = freierPlatz(v, k);
    }
    if (!name || !sitzpunkt(v, k, name)) {
      // kein Platz frei: kurz wegfliegen und wie sonst wiederkommen
      if (v.pos && !v.el.hidden) {
        v.zustand = "fliegt"; v.el.classList.add("fliegt");
        const s = v.pos;
        await animiere(v, [s, { x: s.x + 50, y: s.y - 90 }, { x: W() + 90, y: s.y - 200 }], 1700);
        if (v.auftrag) return;
      }
      v.el.hidden = true; v.zustand = "weg"; v.platz = null;
      setTimeout(() => { if (!v.auftrag) lande(v, false); }, 1600);
      return;
    }
    v.ziel = name; v.platz = name; v.kontext = k;
    v.el.classList.toggle("im-countdown", k === "countdown");
    const zielFn = () => sitzpunkt(v, k, name), s = v.pos, z = zielFn();
    v.zustand = "fliegt"; v.el.classList.add("fliegt"); v.el.hidden = false;
    await animiere(v, [s, { x: (s.x + z.x) / 2, y: Math.min(s.y, z.y) - 60 }, { x: z.x + (s.x < z.x ? -26 : 26), y: z.y - 26 }, z], 1800, zielFn);
    if (v.zustand !== "fliegt" || v.auftrag) return;
    v.zustand = "sitzt"; v.el.classList.remove("fliegt"); v.ziel = null;
    v.el.classList.remove("hopst"); void v.el.offsetWidth; v.el.classList.add("hopst");
    v.gelandet = (v.gelandet || 0) + 1;
    planeAbflug(v);
  }
  // Etwas sagen (ohne Knöpfe) und warten, bis die Blase wieder weg ist
  async function sag(v, text, ms) {
    if (!v || v.zustand !== "sitzt") { await pause(ms || 3600); return false; }
    v.timer.forEach(clearTimeout); v.timer = [];
    zeigeBlase(v, text);
    v.nachholen = null;
    const da = !v.blase.hidden;
    await pause(ms || 3600);
    v.blase.hidden = true; v.el.classList.remove("redet");
    return da;
  }
  // Ein Vogel kommentiert etwas, wenn er gerade frei ist (lieber die Munkelvogeline). true, wenn einer gesprochen hat
  function kommentiere(text, lieberSie, ms) {
    const frei = (v) => v && v.el.isConnected && v.zustand === "sitzt" && !v.el.hidden && !v.fragt && !v.auftrag && !v.kueken;
    const liste = lieberSie ? [weibchen, maennchen] : [maennchen, weibchen];
    const v = liste.find(frei);
    if (!v || voegel.some((x) => x.fragt)) return false;
    v.timer.forEach(clearTimeout); v.timer = []; clearTimeout(v.flugTimer);
    zeigeBlase(v, text); v.nachholen = null;
    if (v.blase.hidden) { planeAbflug(v); return false; }
    v.timer.push(setTimeout(() => { v.blase.hidden = true; v.el.classList.remove("redet"); if (!v.partner) planeAbflug(v); }, ms || 4600));
    return true;
  }
  const intern = {
    get maennchen() { return maennchen; },
    get weibchen() { return weibchen && weibchen.el.isConnected ? weibchen : null; },
    get kueken() { return kueken && kueken.el.isConnected ? kueken : null; },
    neuesWeibchen, holeHer, heimfliegen, sag, animiere, setzePosition, zeigeBlase, pause, teilchen, kruemelFliegt, amVogel, bild, ankerPunkt, kontext, W, H, ruhig,
    hut: (v, an, art) => {
      let h = v.el.querySelector(".partyhut");
      if (!an) { if (h) h.remove(); return; }
      if (h && h.dataset.art === (art || "party")) return;
      if (h) h.remove();
      h = document.createElement("span");
      h.className = "partyhut" + (v.kueken ? " klein" : "");
      h.dataset.art = art || "party";
      if (art === "weihnacht") h.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 19C5 9 11 3 18 5c-2 2 0 6 2 8l-3 1C15 10 11 9 9 19z" fill="#d6304f"/><rect x="1.5" y="17" width="16" height="5" rx="2.5" fill="#fff"/><circle cx="20" cy="14" r="3" fill="#fff"/></svg>';
      else h.innerHTML = '<svg viewBox="0 0 20 24" aria-hidden="true"><path d="M3 21L10 2l7 19z" fill="' + (v.weiblich ? "#ff7aa2" : "#5aa9e6") + '"/><path d="M6 13h8M8 7.5h4" stroke="#fff3b0" stroke-width="2"/><circle cx="10" cy="2" r="2.4" fill="#f3c84b"/><ellipse cx="10" cy="21" rx="8" ry="2" fill="' + (v.weiblich ? "#e85d7e" : "#3f7fc4") + '"/></svg>';
      v.el.appendChild(h);
    },
    sitzpunkt: (v, k, name) => sitzpunkt(v, k, name),
    gitarrenNacht: () => gitarrenNacht(),
    hops: (v) => { v.el.classList.remove("hopst"); void v.el.offsetWidth; v.el.classList.add("hopst"); },
    still: (v) => { v.blase.hidden = true; v.el.classList.remove("redet"); },
  };
  window.adventkalender.voegel = { voegel, raumFertig, nestFertig, kommentiere, aufwachen: () => aufwachen(false), schlaeftNoch: () => !!maennchen.vomNest, intern, kuekenDazu, kuekenSvg, registriere: (e) => { ANFRAGEN.push(e); ANFRAGEN.sort((x, y) => (x.prio || 9) - (y.prio || 9)); }, svg: (weiblich, kleidung) => vogelSvg(weiblich, undefined, kleidung), einkleiden, sage, fliegeZu, sagKurz, fliegeDavon, weiter, istDa, frage: () => {
    // erst wenn er gelandet ist und seine Sätze gesagt hat (höchstens 30 Sekunden warten)
    let n = 0;
    const los = () => {
      const v = maennchen;
      if (weibchen || frageBeantwortet || v.fragt) return;
      if (v.zustand === "sitzt" && v.hatGesprochen && v.blase.hidden) { frage(v); return; }
      if (++n < 60) setTimeout(los, 500);
    };
    los();
  }, fliegeWeg: (i) => fliegeWeg(voegel[i || 0]), ROUTEN: ROUTEN.length };
})();
