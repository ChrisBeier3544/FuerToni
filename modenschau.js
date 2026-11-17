/*
 * ===========================================================
 *  FASHION SHOW „HAUTE CAPYTURE“
 *  Am 17.11. fragt der Munkelvogel, ob Toni seine Show
 *  sehen will. 5 Capys und 5 Munkelvögel laufen in 10 Looks
 *  mit Teilen aus dem Ankleidezimmer über den Laufsteg.
 *  Zum Schluss läuft der Munkelvogel selbst für Louis Vogel.
 * ===========================================================
 */
(function () {
  "use strict";

  const ak = window.adventkalender;
  if (!ak || !ak.intro) return;
  const ruhig = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Die Looks ---------- */
  // art: "capy", "vogel" (Munkelvogel) oder "vogeline"
  // Bei den Capys: das zweite Teil einer Kategorie wird dazu getragen
  // (Socken in Schuhen, Wimpern unter der Brille, Brille am Kragen, Extra in der anderen Pfote)
  // 10 Looks: 5 Capys und 5 Munkelvögel, abwechselnd; zum Schluss der Munkelvogel selbst
  const LOOKS = [
    { art: "capy", marke: "Dolce & Capybana", motto: "Zuckerstangenzauber", t: { kopf: ["rentierreif", "partyhut_pink"], hals: ["glueckband"], augen: ["herzbrille"], fuesse: ["ballerinas"], extra: ["zuckerstange", "toertchen"] } },
    { art: "vogeline", marke: "Schnanel", motto: "Mademoiselle Noël", t: { kopf: "barett_rosa", hals: "perlenkette", augen: "katzenaugen", fuesse: "high_heels", extra: "handtasche" } },
    { art: "capy", marke: "Herr Kappi", motto: "Gentleman im Schnee", t: { kopf: ["zylinder_schnee"], hals: ["karoschal"], augen: ["professorenbrille"], fuesse: ["ringelsocken", "lackschuhe_gold"], extra: ["buch", "kaffeebecher"] } },
    { art: "vogel", marke: "Yves Saint Laupiep", motto: "Detektiv im Schneegestöber", t: { kopf: "detektivmuetze", hals: "krawatte", augen: "monokel", fuesse: "gummistiefel", extra: "regenschirm" } },
    { art: "capy", marke: "Balencapy", motto: "Oversize auf der Piste", t: { kopf: ["ohrenschuetzer", "strickmuetze"], hals: ["schal_flocken"], augen: ["fliegerbrille"], fuesse: ["ringelsocken_w", "schneestiefel"], extra: ["schneekugel"] } },
    { art: "vogeline", marke: "Piep Piep", motto: "Popstar in Pink", t: { kopf: "diadem", hals: "federboa_pink", augen: "sternsonnenbrille", fuesse: "rollschuhe_pink", extra: "mikrofon" } },
    { art: "capy", marke: "Karl Capyfeld", motto: "Avantgarde", t: { kopf: ["doktorhut"], hals: ["fliege_punkte"], augen: ["taucherbrille", "brille_3d"], fuesse: ["turnschuhe"], extra: ["bleistift", "pokal"] } },
    { art: "vogel", marke: "Federsace", motto: "Disco Inferno", t: { kopf: "glitzerzylinder", hals: "fliege_gold", augen: "discobrille", fuesse: "tanzschuhe", extra: "troete" } },
    { art: "capy", marke: "Gucapy", motto: "Gartengala", t: { kopf: ["strohhut", "blumenkranz"], hals: ["seidentuch"], augen: ["herzbrille_gold"], fuesse: ["glitzerschuhe"], extra: ["wunderkerze", "geschenk"] } },
    { art: "vogel", marke: "Louis Vogel", motto: "Le Petit Parisien", star: true, t: { kopf: "barett", hals: "strickschal", augen: "brille_rund", fuesse: "lackschuhe", extra: "croissant" } },
  ];
  const KAT = ["kopf", "hals", "augen", "fuesse", "extra"];

  /* ---------- Teile nachschlagen ---------- */
  function teil(id) {
    const K = ak.styling && ak.styling.KLEIDUNG;
    if (!K) return null;
    for (const wer of ["m", "w"]) for (const k of KAT) { const t = (K[wer][k] || []).find((x) => x.id === id); if (t) return t; }
    return null;
  }
  const svgVon = (id) => { const t = teil(id); return t ? t.svg : ""; };
  // Brillen oder Masken als zweites Teil hängen am Kragen, Wimpern bleiben an den Augen
  const istWimpern = (id) => /wimpern/.test(id);

  /* ---------- Capy von vorne (gleiche Koordinaten wie der Vogel, damit alle Teile passen) ---------- */
  function capySvg(t) {
    const L = {};
    for (const k of KAT) L[k] = (t[k] || []).map((id, i) => {
      let s = svgVon(id);
      if (k === "augen" && i > 0 && !istWimpern(id)) s = '<g transform="translate(29 45.5) rotate(-10) scale(.62) translate(-29 -28)">' + s + "</g>";
      if (k === "extra" && i > 0) s = '<g transform="matrix(-1 0 0 1 58 0)">' + s + '<path d="M44.5 33.5q5 8.5 -5 13q3.5 -7 5 -13z" fill="#9a6844"/></g>';
      return s;
    });
    const fell = "#b07a52", dunkel = "#9a6844", ohr = "#8a5a3a";
    return '<svg viewBox="0 0 60 60" aria-hidden="true" class="ls-capy">' +
      '<g class="ls-beine"><rect x="19" y="47" width="5.2" height="10.4" rx="2.6" fill="' + dunkel + '"/><rect x="30.8" y="47" width="5.2" height="10.4" rx="2.6" fill="' + dunkel + '"/>' + L.fuesse.join("") + "</g>" +
      '<ellipse cx="27.6" cy="46" rx="18" ry="10.5" fill="' + fell + '"/><ellipse cx="27.6" cy="48" rx="10" ry="6" fill="#c8946a" opacity=".55"/>' +
      '<ellipse cx="16" cy="13.5" rx="3.8" ry="3.2" fill="' + ohr + '"/><ellipse cx="42" cy="13.5" rx="3.8" ry="3.2" fill="' + ohr + '"/><ellipse cx="16" cy="14" rx="1.8" ry="1.4" fill="#6b4632"/><ellipse cx="42" cy="14" rx="1.8" ry="1.4" fill="#6b4632"/>' +
      '<rect x="12.5" y="12.5" width="33" height="29.5" rx="13.5" fill="' + fell + '"/><path d="M17 16 Q29 12 41 16" stroke="#c8946a" stroke-width="2" fill="none" opacity=".5" stroke-linecap="round"/>' +
      '<circle cx="22" cy="27.4" r="2.5" fill="#2a1a12"/><circle cx="36" cy="27.4" r="2.5" fill="#2a1a12"/><circle cx="22.8" cy="26.6" r=".8" fill="#fff"/><circle cx="36.8" cy="26.6" r=".8" fill="#fff"/>' +
      '<rect class="augenlid" x="19" y="24.4" width="6" height="6" rx="3" fill="' + fell + '"/><rect class="augenlid" x="33" y="24.4" width="6" height="6" rx="3" fill="' + fell + '"/>' +
      '<circle cx="17.6" cy="33.4" r="2.6" fill="#ff9fb4" opacity=".55"/><circle cx="40.4" cy="33.4" r="2.6" fill="#ff9fb4" opacity=".55"/>' +
      '<ellipse cx="29" cy="35.4" rx="9.4" ry="6.2" fill="' + dunkel + '"/><ellipse cx="26.2" cy="33.6" rx="1.3" ry=".9" fill="#3a2418"/><ellipse cx="31.8" cy="33.6" rx="1.3" ry=".9" fill="#3a2418"/>' +
      '<path d="M26 37.6 Q29 39.8 32 37.6" stroke="#3a2418" stroke-width=".9" fill="none" stroke-linecap="round"/>' +
      L.hals.join("") + L.augen.join("") + (L.extra.length ? L.extra[0] + '<path d="M44.5 31.5q5 9.5 -5.5 14q3.5 -7.5 5.5 -14z" fill="' + dunkel + '"/>' + L.extra.slice(1).join("") : "") +
      L.kopf.join("") + "</svg>";
  }
  function figurSvg(look) {
    if (look.art === "capy") return capySvg(look.t);
    const kleidung = {};
    for (const k of KAT) kleidung[k] = look.t[k];
    return ak.voegel && ak.voegel.svg ? ak.voegel.svg(look.art === "vogeline", kleidung) : "";
  }

  /* ---------- Speichern ---------- */
  const SCHLUESSEL = "toni-wz-modenschau";
  function lies() { try { return JSON.parse(localStorage.getItem(SCHLUESSEL) || "{}") || {}; } catch (_) { return {}; } }
  function merke(feld) { const s = lies(); s[feld] = true; try { localStorage.setItem(SCHLUESSEL, JSON.stringify(s)); } catch (_) { /* egal */ } }

  // ab dem 17.11. (bis zum Geburtstag fragt der Munkelvogel, bis Toni die Show gesehen hat)
  function abHeute() {
    if (ak.zeitreise && ak.zeitreise.aktiv()) return false;
    const d = ak.intro.datum();
    if (d.jahr > KALENDER.jahr) return true;
    return d.jahr === KALENDER.jahr && (d.monat === 12 || (d.monat === 11 && d.tag >= 17));
  }
  function frageText() {
    if (!abHeute() || !ak.styling) return null;
    const s = lies();
    if (s.gesehen) return null;
    const d = ak.intro.datum();
    // nur am 17.11. erzählt der Munkelvogel von seiner Show
    if (!(d.jahr === KALENDER.jahr && d.monat === 11 && d.tag === 17)) return null;
    return "Ich laufe für das berühmte Modehaus Louis Vogel 😎 Willst du zuschauen?";
  }
  // vor der Frage erzählt der Munkelvogel, wie es dazu kam (eigene Blase, damit beide gut Platz finden)
  function vorabText() {
    const d = ak.intro.datum();
    const gestern = d.jahr === KALENDER.jahr && d.monat === 11 && d.tag === 17;
    const eingekleidet = ak.styling && ak.styling.gewaehlt && ak.styling.gewaehlt(1);
    return eingekleidet
      ? "Toni, weil du mich " + (gestern ? "gestern" : "neulich") + " so wunderbar eingekleidet hast, hab ich mich getraut, mich bei einer Fashion Show anzumelden! ✨"
      : "Toni, seit ich weiß, wie gut mir schicke Sachen stehen, hab ich mich bei einer Fashion Show angemeldet! ✨";
  }

  /* ---------- Das Fenster mit dem Laufsteg ---------- */
  const dialog = document.createElement("dialog");
  dialog.className = "laufsteg";
  dialog.setAttribute("aria-label", "Fashion Show Haute Capyture");
  dialog.innerHTML =
    '<div class="ls-buehne" tabindex="-1">' +
    '<div class="ls-wand"><p class="ls-logo">Haute Capyture</p><p class="ls-unter">Fashion Week Paris · Winterkollektion</p></div>' +
    '<div class="ls-lichter" aria-hidden="true">' + Array.from({ length: 16 }, (_, i) => '<i style="--i:' + i + '"></i>').join("") + "</div>" +
    '<div class="ls-spot links" aria-hidden="true"></div><div class="ls-spot rechts" aria-hidden="true"></div>' +
    '<div class="ls-steg" aria-hidden="true"><div class="ls-glitzer"></div></div>' +
    '<div class="ls-models"></div>' +
    '<div class="ls-publikum links" aria-hidden="true"></div><div class="ls-publikum rechts" aria-hidden="true"></div>' +
    '<div class="ls-vogue" aria-hidden="true"></div>' +
    '<div class="ls-karte" aria-live="polite"><p class="ls-nr"></p><p class="ls-marke"></p><p class="ls-motto"></p></div>' +
    '<div class="ls-titel" aria-hidden="true"><p>Haute Capyture</p><span>präsentiert die Winterkollektion</span></div>' +
    '<div class="ls-ende" hidden><p class="ls-ende-titel">Bravo! 👏</p><p class="ls-ende-text">Danke fürs Zuschauen, Toni! Mit dir in der ersten Reihe war das die schönste Show der Welt ♥️</p>' +
    '<div class="ls-ende-knoepfe"><button type="button" class="ls-nochmal">Nochmal ansehen</button><button type="button" class="ls-fertig">Schließen</button></div></div>' +
    '<button type="button" class="ls-applaus" aria-label="Applaus">👏</button>' +
    '<button type="button" class="schliessen ls-zu" aria-label="Show schließen">×</button>' +
    "</div>";
  document.body.appendChild(dialog);
  const buehne = dialog.querySelector(".ls-buehne"), models = dialog.querySelector(".ls-models"), karte = dialog.querySelector(".ls-karte"), ende = dialog.querySelector(".ls-ende");

  // Publikum: kleine Capys mit Kameras, die blitzen
  const kopfSilhouette = (f) => '<svg viewBox="0 0 40 30" aria-hidden="true"><ellipse cx="9" cy="5" rx="3" ry="2.6" fill="' + f + '"/><ellipse cx="31" cy="5" rx="3" ry="2.6" fill="' + f + '"/><rect x="5" y="4" width="30" height="26" rx="12" fill="' + f + '"/><ellipse cx="20" cy="20" rx="8" ry="5" fill="rgba(0,0,0,.18)"/></svg>';
  function baueFuellung() {
    for (const seite of ["links", "rechts"]) {
      const p = dialog.querySelector(".ls-publikum." + seite);
      p.innerHTML = "";
      for (let i = 0; i < 10; i++) {
        const s = document.createElement("span");
        s.className = "ls-zuschauer";
        s.style.setProperty("--r", String(i % 2));
        s.style.setProperty("--d", (Math.random() * 2).toFixed(2) + "s");
        s.innerHTML = kopfSilhouette(["#5a3a4a", "#4a2e3e", "#6a4458"][i % 3]);
        p.appendChild(s);
      }
    }
    dialog.querySelector(".ls-vogue").innerHTML = capySvg({ augen: ["sonnenbrille"], hals: ["perlenkette"] }) + '<span class="ls-magazin">VÖGUE</span>';
  }
  function blitz() {
    if (!dialog.open || ruhig) return;
    const z = dialog.querySelectorAll(".ls-zuschauer");
    const s = z[Math.floor(Math.random() * z.length)];
    if (!s) return;
    const b = document.createElement("i");
    b.className = "ls-blitz";
    s.appendChild(b);
    b.animate([{ opacity: 0, transform: "scale(.4)" }, { opacity: 1, transform: "scale(1.4)", offset: 0.15 }, { opacity: 0, transform: "scale(2)" }], { duration: 420, easing: "ease-out" }).onfinish = () => b.remove();
  }

  /* ---------- Ablauf ---------- */
  let lauf = 0, timer = [], blitzTimer = null;
  const warte = (ms, id) => new Promise((r) => timer.push(setTimeout(() => r(id === lauf), ms)));
  function stoppe() { lauf++; timer.forEach(clearTimeout); timer = []; clearInterval(blitzTimer); models.innerHTML = ""; }

  function figur(look, extraKlasse) {
    const el = document.createElement("div");
    el.className = "ls-model " + look.art + (extraKlasse ? " " + extraKlasse : "");
    el.innerHTML = '<div class="ls-geh"><div class="ls-dreh">' + figurSvg(look) + '</div></div><div class="ls-schatten"></div>';
    return el;
  }
  function zeigeKarte(i, look) {
    karte.querySelector(".ls-nr").textContent = "Look " + (i + 1) + " von " + LOOKS.length;
    karte.querySelector(".ls-marke").textContent = look.marke;
    karte.querySelector(".ls-motto").textContent = look.motto + (look.star ? " · getragen von deinem Munkelvogel ♥️" : "");
    karte.classList.remove("an"); void karte.offsetWidth; karte.classList.add("an");
  }
  // ein Model läuft nach vorne, posiert und läuft zurück
  async function laufe(i, id) {
    const look = LOOKS[i];
    const el = figur(look);
    models.appendChild(el);
    const H = buehne.clientHeight, B = buehne.clientWidth;
    // vorne bleibt das Model über der Karte stehen
    const hinten = H * 0.36, vorne = H * 0.66;
    const pos = (y, s, dx) => "translate(calc(-50% + " + (dx || 0).toFixed(0) + "px), " + y.toFixed(0) + "px) translate(0, -100%) scale(" + s + ")";
    el.style.zIndex = "2";
    if (ruhig) {
      el.style.transform = pos(vorne, 1);
      zeigeKarte(i, look);
      if (!(await warte(3200, id))) return;
      el.remove();
      return;
    }
    el.classList.add("geht");
    await el.animate([{ transform: pos(hinten, 0.34), opacity: 0 }, { transform: pos(hinten + (vorne - hinten) * 0.08, 0.4), opacity: 1, offset: 0.08 }, { transform: pos(vorne, 1), opacity: 1 }],
      { duration: 2700, easing: "cubic-bezier(.35,.1,.45,1)", fill: "forwards" }).finished.catch(() => {});
    if (id !== lauf) return;
    el.classList.remove("geht"); el.classList.add("posiert", ["pose-a", "pose-b", "pose-c"][i % 3]);
    zeigeKarte(i, look);
    for (let k = 0; k < 5; k++) timer.push(setTimeout(blitz, 80 + k * 140));
    if (!(await warte(2600, id))) return;
    el.classList.remove("posiert"); el.classList.add("geht", "zurueck");
    el.style.zIndex = "1";
    karte.classList.remove("an");
    // zurück auf der linken Spur, damit das nächste Model frei in der Mitte laufen kann
    const spur = -Math.min(B * 0.2, 90);
    el.animate([{ transform: pos(vorne, 1, 0), opacity: 1 }, { transform: pos(vorne - (vorne - hinten) * 0.25, 0.82, spur), opacity: 1, offset: 0.3 }, { transform: pos(hinten + (vorne - hinten) * 0.2, 0.44, spur * 0.55), opacity: 0.85, offset: 0.85 }, { transform: pos(hinten, 0.34, spur * 0.4), opacity: 0 }],
      { duration: 2300, easing: "cubic-bezier(.4,0,.7,1)", fill: "forwards" }).onfinish = () => el.remove();
  }
  async function finale(id) {
    karte.classList.remove("an");
    // alle noch einmal als Parade
    const reihe = document.createElement("div");
    reihe.className = "ls-parade";
    LOOKS.forEach((look, i) => { const f = figur(look, "klein"); f.style.setProperty("--i", String(i)); reihe.appendChild(f); });
    models.appendChild(reihe);
    karte.querySelector(".ls-nr").textContent = "Finale";
    karte.querySelector(".ls-marke").textContent = "Haute Capyture";
    karte.querySelector(".ls-motto").textContent = "Alle " + LOOKS.length + " Looks der Winterkollektion";
    karte.classList.add("an");
    if (!(await warte(ruhig ? 2500 : 5200, id))) return;
    // der Star kommt nach vorne und verbeugt sich
    const star = figur(LOOKS[LOOKS.length - 1], "star");
    models.appendChild(star);
    karte.querySelector(".ls-nr").textContent = "Finale";
    karte.querySelector(".ls-marke").textContent = "Louis Vogel";
    karte.querySelector(".ls-motto").textContent = "Dein Munkelvogel verbeugt sich 🎩";
    karte.classList.remove("an"); void karte.offsetWidth; karte.classList.add("an");
    konfetti();
    for (let k = 0; k < 12; k++) timer.push(setTimeout(blitz, k * 120));
    if (!(await warte(ruhig ? 2500 : 4200, id))) return;
    karte.classList.remove("an");
    ende.hidden = false;
    clearInterval(blitzTimer);
    ende.querySelector(".ls-nochmal").focus({ preventScroll: true });
  }
  function konfetti() {
    if (ruhig) return;
    const farben = ["#ff4d8d", "#f7d77c", "#5aa9e6", "#6fd17a", "#b87cf0", "#fff"];
    for (let k = 0; k < 70; k++) {
      const c = document.createElement("i");
      c.className = "ls-konfetti";
      c.style.left = Math.random() * 100 + "%";
      c.style.background = farben[k % farben.length];
      buehne.appendChild(c);
      const dx = (Math.random() - 0.5) * 120, r = Math.random() * 720;
      c.animate([{ transform: "translate(0,-20px) rotate(0)", opacity: 1 }, { transform: "translate(" + dx + "px," + (buehne.clientHeight + 40) + "px) rotate(" + r + "deg)", opacity: 0.9 }],
        { duration: 2600 + Math.random() * 1800, delay: Math.random() * 900, easing: "ease-in", fill: "both" }).onfinish = () => c.remove();
    }
  }
  async function spiele() {
    stoppe();
    const id = lauf;
    ende.hidden = true;
    karte.classList.remove("an");
    buehne.classList.remove("titel-weg");
    blitzTimer = setInterval(blitz, 650);
    // Titel, dann gehen die Lichter an
    if (!(await warte(ruhig ? 1200 : 3200, id))) return;
    buehne.classList.add("titel-weg");
    for (let i = 0; i < LOOKS.length; i++) {
      laufe(i, id);
      // das nächste Model startet, während das vorige umdreht
      if (!(await warte(ruhig ? 3400 : 5400, id))) return;
    }
    if (!(await warte(ruhig ? 400 : 2400, id))) return;
    finale(id);
  }

  function oeffnen() {
    if (!ak.styling) return;
    merke("angeboten");
    baueFuellung();
    if (typeof dialog.showModal === "function") dialog.showModal(); else dialog.setAttribute("open", "");
    // kein Fokusrahmen auf einem Knopf, nur weil das Fenster aufgeht
    buehne.focus({ preventScroll: true });
    spiele();
  }
  function schliessen() {
    stoppe();
    if (dialog.open) dialog.close();
    merke("gesehen");
  }
  dialog.querySelector(".ls-zu").addEventListener("click", schliessen);
  dialog.querySelector(".ls-fertig").addEventListener("click", schliessen);
  dialog.querySelector(".ls-nochmal").addEventListener("click", spiele);
  dialog.addEventListener("cancel", (e) => { e.preventDefault(); schliessen(); });
  // Applaus: Herzen steigen auf
  dialog.querySelector(".ls-applaus").addEventListener("click", (e) => {
    const b = e.currentTarget;
    b.classList.remove("klatscht"); void b.offsetWidth; b.classList.add("klatscht");
    if (ruhig) return;
    for (let k = 0; k < 7; k++) {
      const h = document.createElement("span");
      h.className = "ls-herz";
      h.textContent = k % 3 ? "♥️" : "👏";
      const r = b.getBoundingClientRect(), br = buehne.getBoundingClientRect();
      h.style.left = r.left - br.left + r.width / 2 + "px"; h.style.top = r.top - br.top + "px";
      buehne.appendChild(h);
      h.animate([{ transform: "translate(-50%,0) scale(.5)", opacity: 1 }, { transform: "translate(calc(-50% + " + ((Math.random() - 0.5) * 140).toFixed(0) + "px), -" + (140 + Math.random() * 160).toFixed(0) + "px) scale(1.2)", opacity: 0 }],
        { duration: 1300 + Math.random() * 600, easing: "ease-out", fill: "forwards" }).onfinish = () => h.remove();
    }
  });

  /* ---------- Knöpfe zum erneuten Ansehen ---------- */
  const knopfHtml = '<span aria-hidden="true">✨</span> Fashion Show';
  const introKnopf = document.createElement("button");
  introKnopf.type = "button"; introKnopf.className = "special-knopf intro-show"; introKnopf.hidden = true; introKnopf.innerHTML = '<span aria-hidden="true">✨</span> Show'; introKnopf.setAttribute("aria-label", "Fashion Show ansehen");
  introKnopf.addEventListener("click", oeffnen);
  const kalenderKnopf = document.createElement("button");
  kalenderKnopf.type = "button"; kalenderKnopf.className = "sammlung-knopf knopf-show"; kalenderKnopf.hidden = true; kalenderKnopf.innerHTML = knopfHtml;
  kalenderKnopf.addEventListener("click", oeffnen);
  setInterval(() => {
    if (!ak.intro.bereit()) return;
    const intro = document.getElementById("intro");
    const reihe = intro && intro.querySelector(".intro-knoepfe");
    if (reihe && introKnopf.parentNode !== reihe) reihe.appendChild(introKnopf);
    const spiel = document.getElementById("spiel-knopf");
    if (spiel && !kalenderKnopf.parentNode) spiel.after(kalenderKnopf);
    const s = lies(), phase = ak.intro.phase();
    // erst nachdem der Munkelvogel die Show angeboten hat
    const da = abHeute() && (s.angeboten || s.gesehen);
    introKnopf.hidden = !(da && intro && !intro.hidden && (phase === "warten" || phase === "geburtstag")) || !!document.querySelector(".special-buehne");
    kalenderKnopf.hidden = !(da && phase === "offen");
  }, 500);

  window.adventkalender.modenschau = {
    frageText,
    vorabText,
    oeffnen,
    verfuegbar: () => { const st = lies(); return abHeute() && !!(st.angeboten || st.gesehen); },
    angeboten: () => merke("angeboten"),
    LOOKS,
  };
})();
