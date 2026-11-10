/*
 * ===========================================================
 *  DIE CAPY CREW BAUT DEN KALENDER AUF
 *  27.11. Päckchen anbringen, 28.11. dekorieren, 30.11. putzen.
 *  Jede Animation dauert etwa eine Minute und spielt direkt
 *  am Kalender. Fertige Schritte werden gemerkt.
 * ===========================================================
 */
(function () {
  "use strict";

  const ak = window.adventkalender;
  const grafik = window.capyGrafik;
  const kal = document.getElementById("kalender");
  const kette = document.getElementById("lichterkette");
  if (!ak || !kal || !grafik) return;
  const JAHR = KALENDER.jahr;
  const ruhig = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const html = document.documentElement;

  const warte = (ms) => new Promise((r) => setTimeout(r, ruhig ? Math.min(ms, 60) : ms));
  const FERTIG = (tag) => "toni-aufbau-" + JAHR + "-" + tag;
  const istFertig = (tag) => { try { return localStorage.getItem(FERTIG(tag)) === "1"; } catch (_) { return false; } };
  const merkeFertig = (tag) => { try { localStorage.setItem(FERTIG(tag), "1"); } catch (_) { /* egal */ } };
  let laeuft = false;

  /* ---------- Vorbereitung: Schild, Staub, Spinnweben ---------- */
  const schild = document.createElement("div");
  schild.className = "regal-schild";
  schild.innerHTML = "Hier baut die Capy Crew morgen deinen Kalender auf 🐹<small>Bis morgen, Toni ♥️</small>";
  schild.hidden = true;
  kal.appendChild(schild);
  const WEBE = '<svg viewBox="0 0 70 70"><g fill="none" stroke="rgba(255,255,255,.85)" stroke-width="1"><path d="M0 0 L70 70 M0 0 L35 70 M0 0 L70 35 M0 0 L10 70 M0 0 L70 10"/><path d="M14 0 Q12 12 0 14 M28 0 Q24 24 0 28 M42 0 Q36 36 0 42 M56 0 Q48 48 0 56"/></g></svg>';
  ["links", "rechts"].forEach((s) => {
    const w = document.createElement("div");
    w.className = "spinnwebe " + s;
    w.innerHTML = WEBE;
    kal.appendChild(w);
  });
  function staubVorbereiten() {
    kal.querySelectorAll(".tuer").forEach((t) => {
      const blatt = t.querySelector(".tuer-blatt");
      if (blatt && !blatt.querySelector(".staub")) {
        const s = document.createElement("span");
        s.className = "staub";
        blatt.appendChild(s);
      }
    });
  }

  /* ---------- Zustand je nach Datum ---------- */
  const tueren = () => [...kal.querySelectorAll(":scope > .tuer")];
  function zustand(d) {
    if (laeuft) return;
    const nov = d.jahr === JAHR && d.monat === 11;
    const vorDem = (tag) => nov && d.tag < tag;
    const amTag = (tag) => nov && d.tag === tag;
    const leer = vorDem(27) || (amTag(27) && !istFertig(27));
    kal.classList.toggle("leer", leer);
    schild.hidden = !vorDem(27);
    if (!leer) tueren().forEach((t) => t.classList.remove("angebracht"));
    const ohneDeko = vorDem(28) || (amTag(28) && !istFertig(28));
    kal.classList.toggle("ohne-deko", ohneDeko);
    html.toggleAttribute("data-ohne-deko", ohneDeko);
    kette.classList.toggle("noch-nicht", ohneDeko);
    if (!ohneDeko) tueren().forEach((t) => t.classList.remove("dekoriert"));
    const staubig = amTag(30) && !istFertig(30);
    if (staubig) staubVorbereiten();
    html.toggleAttribute("data-staubig", staubig);
    if (!staubig) tueren().forEach((t) => t.classList.remove("sauber"));
  }

  /* ---------- Hilfsmittel ---------- */
  function rechteck(el) {
    // Position relativ zum Kalender (der Kalender ist position: relative)
    return { x: el.offsetLeft, y: el.offsetTop, b: el.offsetWidth, h: el.offsetHeight };
  }
  function sortiert() {
    return tueren().sort((a, b) => (a.offsetTop - b.offsetTop) || (a.offsetLeft - b.offsetLeft));
  }
  function zeilen() {
    const liste = sortiert();
    const zeile = Math.min(...liste.map((t) => t.offsetHeight));
    const map = new Map();
    for (const t of liste) {
      const key = Math.round(t.offsetTop);
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(t);
    }
    return [...map.entries()].map(([y, ts]) => ({ y, unten: y + zeile, tueren: ts }));
  }
  async function zeige(y, hoehe) {
    const r = kal.getBoundingClientRect();
    const oben = r.top + y, unten = oben + (hoehe || 120);
    if (oben < 70 || unten > window.innerHeight - 30) {
      window.scrollTo({ top: window.scrollY + oben - window.innerHeight * 0.4, behavior: ruhig ? "auto" : "smooth" });
      await warte(650);
    }
  }
  function capy(opt, breite) {
    const c = document.createElement("div");
    c.className = "bau-capy";
    c.style.width = breite + "px";
    c.innerHTML = grafik.seite(opt || {}) + (opt && opt.werkzeug ? '<span class="werkzeug">' + opt.werkzeug + "</span>" : "");
    kal.appendChild(c);
    return c;
  }
  const capyHoehe = (b) => b * 0.79;
  function laufen(c, x0, x1, y, dauer) {
    const blick = x1 >= x0 ? 1 : -1;
    c.firstChild.style.transform = blick > 0 ? "" : "scaleX(-1)";
    c.style.left = "0px"; c.style.top = y + "px";
    const a = c.animate([{ transform: "translateX(" + x0 + "px)" }, { transform: "translateX(" + x1 + "px)" }], { duration: dauer, easing: "ease-in-out", fill: "forwards" });
    c.firstChild.animate([{ translate: "0 0" }, { translate: "0 -3px" }], { duration: 180, iterations: Math.ceil(dauer / 180), direction: "alternate" });
    return a.finished.catch(() => {});
  }
  function funken(x, y, zeichen, n, weite) {
    for (let k = 0; k < n; k++) {
      const s = document.createElement("span");
      s.className = "bau-funke";
      s.textContent = zeichen[k % zeichen.length];
      s.style.left = x + "px"; s.style.top = y + "px";
      kal.appendChild(s);
      const w = (k / n) * Math.PI * 2 + Math.random() * 0.5, r = (weite || 30) * (0.6 + Math.random() * 0.6);
      s.animate([
        { transform: "translate(-50%,-50%) scale(.4)", opacity: 1 },
        { transform: "translate(calc(-50% + " + Math.cos(w) * r + "px), calc(-50% + " + Math.sin(w) * r + "px)) scale(1)", opacity: 0 },
      ], { duration: 900, easing: "ease-out", fill: "forwards" }).finished.then(() => s.remove(), () => s.remove());
    }
  }
  let banner = null;
  function zeigeBanner(text, unter) {
    if (!banner) { banner = document.createElement("p"); banner.className = "bau-banner"; document.body.appendChild(banner); }
    banner.innerHTML = "";
    banner.append(text);
    if (unter) { const s = document.createElement("small"); s.textContent = unter; banner.appendChild(s); }
  }
  function bannerWeg() { if (banner) { const b = banner; banner = null; b.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 600, fill: "forwards" }).finished.then(() => b.remove()); } }

  /* ===========================================================
     27.11.: alle 24 Päckchen hereintragen und anbringen
     =========================================================== */
  async function aufbauen() {
    kal.classList.add("leer");
    schild.hidden = true;
    const liste = sortiert();
    liste.forEach((t) => t.classList.remove("angebracht"));
    zeigeBanner("Die Capy Crew baut deinen Kalender auf 🐹", "Päckchen 0 von 24");
    await zeige(0, 200);
    await warte(1200);
    const breiteKal = kal.clientWidth;
    for (let i = 0; i < liste.length; i++) {
      const t = liste[i], r = rechteck(t);
      zeigeBanner("Die Capy Crew baut deinen Kalender auf 🐹", "Päckchen " + (i + 1) + " von 24");
      await zeige(r.y, r.h);
      const gross = t.classList.contains("gross") || t.classList.contains("breit");
      const cb = Math.max(56, Math.min(92, r.h * 0.72));
      const vonLinks = r.x + r.b / 2 > breiteKal / 2 ? false : true;
      const start = vonLinks ? -cb - 20 : breiteKal + 20;
      const ziel = r.x + r.b / 2 - cb / 2;
      const y = r.y + r.h - capyHoehe(cb) - 2;
      const helfer = [capy({ hut: i % 3 === 0 ? "muetze" : null }, cb)];
      if (gross) helfer.push(capy({ hut: "party", hutFarbe: "#9be3b0" }, cb * 0.9));
      // Paket auf dem Kopf: eine kleine Kopie des Türchens
      const paket = document.createElement("div");
      paket.className = "trage-paket";
      const kopie = t.cloneNode(true);
      kopie.classList.remove("wackeln");
      kopie.classList.add("angebracht");
      kopie.setAttribute("aria-hidden", "true");
      kopie.tabIndex = -1;
      paket.appendChild(kopie);
      // Originalgröße, damit beim Ablegen nichts springt
      const pb = r.b, ph = r.h;
      paket.style.width = pb + "px"; paket.style.height = ph + "px";
      paket.style.left = "0px"; paket.style.top = "0px"; paket.style.transformOrigin = "0 0";
      kal.appendChild(paket);
      const laufzeit = 900;
      const paketBahn = (x) => [{ transform: "translate(" + (x + cb / 2 - pb / 2) + "px," + (y - ph + cb * 0.12) + "px) rotate(" + (vonLinks ? -4 : 4) + "deg)" }];
      paket.animate([paketBahn(start)[0], paketBahn(ziel)[0]], { duration: laufzeit, easing: "ease-in-out", fill: "forwards" });
      const laeufe = helfer.map((h, k) => laufen(h, start + (k ? (vonLinks ? -cb * 0.7 : cb * 0.7) : 0), ziel + (k ? (vonLinks ? -cb * 0.75 : cb * 0.75) : 0), y + (k ? cb * 0.08 : 0), laufzeit));
      await Promise.all(laeufe);
      // hochheben und ins Fach setzen
      helfer.forEach((h) => h.firstChild.animate([{ transform: h.firstChild.style.transform + " translateY(0)" }, { transform: h.firstChild.style.transform + " translateY(-10px)" }, { transform: h.firstChild.style.transform + " translateY(0)" }], { duration: 500 }));
      await paket.animate([
        paketBahn(ziel)[0],
        { transform: "translate(" + (r.x + (r.b - pb) / 2) + "px," + (r.y - ph * 0.35) + "px) rotate(0deg)", offset: 0.55 },
        { transform: "translate(" + r.x + "px," + r.y + "px) rotate(0deg)" },
      ], { duration: 600, easing: "ease-in-out", fill: "forwards" }).finished;
      paket.remove();
      t.classList.add("angebracht");
      funken(r.x + 6, r.y + r.h, ["💨"], 2, 18);
      funken(r.x + r.b - 6, r.y + r.h, ["💨"], 2, 18);
      if (i % 4 === 3) funken(r.x + r.b / 2, r.y - 4, ["🔨", "✨"], 3, 26);
      // und wieder hinaus
      const weg = vonLinks ? -cb - 30 : breiteKal + 30;
      helfer.forEach((h, k) => laufen(h, ziel + (k ? (vonLinks ? -cb * 0.75 : cb * 0.75) : 0), weg, y + (k ? cb * 0.08 : 0), 650).then(() => h.remove()));
      await warte(420);
    }
    zeigeBanner("Dein Kalender steht! 🎁", "Morgen kommt die Deko");
    kal.classList.remove("leer");
    liste.forEach((t) => t.classList.remove("angebracht"));
    const mitte = kal.clientWidth / 2;
    await zeige(0, 240);
    funken(mitte, 80, ["✨", "♥️", "🎁"], 14, 90);
    await warte(3200);
    bannerWeg();
  }

  /* ===========================================================
     28.11.: Schnee auf die Bretter, Schleifen, Lichterkette, Zweige
     =========================================================== */
  async function dekorieren() {
    kal.classList.add("ohne-deko");
    html.setAttribute("data-ohne-deko", "");
    kette.classList.add("noch-nicht");
    const z = zeilen();
    const breiteKal = kal.clientWidth;
    const proZeile = Math.max(2400, 33000 / z.length);
    zeigeBanner("Die Capy Crew schmückt deinen Kalender ✨", "Schnee und Schleifen");
    await zeige(0, 200);
    await warte(900);
    const pad = parseFloat(getComputedStyle(kal).paddingLeft) || 12;
    for (let n = 0; n < z.length; n++) {
      const reihe = z[n];
      zeigeBanner("Die Capy Crew schmückt deinen Kalender ✨", "Brett " + (n + 1) + " von " + z.length + ": Schnee und Schleifen");
      await zeige(reihe.y, reihe.unten - reihe.y);
      const cb = Math.max(54, Math.min(88, (reihe.unten - reihe.y) * 0.62));
      const y = reihe.unten - capyHoehe(cb) + 2;
      const vonLinks = n % 2 === 0;
      const c = capy({ hut: n % 2 ? "muetze" : null, werkzeug: "🎀" }, cb);
      const streifen = document.createElement("div");
      streifen.className = "schnee-streifen";
      streifen.style.top = reihe.unten + "px";
      streifen.style.left = pad + "px";
      streifen.style.width = breiteKal - 2 * pad + "px";
      streifen.style.transformOrigin = vonLinks ? "left" : "right";
      kal.appendChild(streifen);
      streifen.animate([{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }], { duration: proZeile, easing: "linear", fill: "forwards" });
      const x0 = vonLinks ? -cb : breiteKal, x1 = vonLinks ? breiteKal : -cb;
      for (const t of reihe.tueren) {
        const mitteX = t.offsetLeft + t.offsetWidth / 2;
        const anteil = Math.abs((mitteX - cb / 2) - x0) / Math.abs(x1 - x0);
        setTimeout(() => {
          t.classList.add("dekoriert");
          funken(mitteX, t.offsetTop + t.offsetHeight * 0.34, ["✨"], 5, 24);
        }, anteil * proZeile);
      }
      const schnee = setInterval(() => {
        const m = c.getBoundingClientRect(), k = kal.getBoundingClientRect();
        funken(m.left - k.left + cb / 2, reihe.unten - 4, ["❄"], 1, 10);
      }, 260);
      await laufen(c, x0, x1, y, proZeile);
      clearInterval(schnee);
      c.remove();
    }
    // Lichterkette aufhängen
    zeigeBanner("Jetzt kommt die Lichterkette 💡");
    kette.classList.remove("noch-nicht");
    kette.scrollIntoView({ behavior: ruhig ? "auto" : "smooth", block: "center" });
    await warte(700);
    const kr = kette.getBoundingClientRect(), kalR = kal.getBoundingClientRect();
    const cb = Math.min(window.innerWidth * 0.17, 72);
    const yK = kr.top - kalR.top + 6;
    const xL = kr.left - kalR.left - cb * 0.35, xR = kr.right - kalR.left - cb * 0.65;
    const links = capy({ hut: "muetze" }, cb), zieher = capy({}, cb);
    links.style.top = yK + "px"; links.style.transform = "translateX(" + xL + "px)";
    const dauerKette = ruhig ? 1 : 5200;
    await Promise.all([
      kette.animate([{ clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0 0 0)" }], { duration: dauerKette, easing: "linear", fill: "both" }).finished.catch(() => {}),
      laufen(zieher, xL, xR, yK, dauerKette),
    ]);
    kette.getAnimations().forEach((a) => a.cancel());
    funken(kr.right - kalR.left - 10, yK + 10, ["✨"], 6, 30);
    links.remove(); zieher.remove();
    if (ak.starteLichtershow) ak.starteLichtershow();
    await warte(3200);
    // Tannenzweige mit Kugeln oben anbringen
    zeigeBanner("Und zum Schluss die Tannenzweige 🌲");
    window.scrollTo({ top: 0, behavior: ruhig ? "auto" : "smooth" });
    await warte(900);
    html.removeAttribute("data-ohne-deko");
    await warte(1800);
    document.querySelectorAll(".zweig .kugel").forEach((k) => k.animate([{ transform: "rotate(-25deg)" }, { transform: "rotate(18deg)" }, { transform: "rotate(-8deg)" }, { transform: "rotate(0)" }], { duration: 1600 }));
    await warte(1600);
    kal.classList.remove("ohne-deko");
    tueren().forEach((t) => t.classList.remove("dekoriert"));
    zeigeBanner("Fertig geschmückt! ✨", "Übermorgen wird noch geputzt");
    if (ak.konfetti) ak.konfetti();
    await warte(3500);
    bannerWeg();
  }

  /* ===========================================================
     30.11.: alles putzen und polieren
     =========================================================== */
  async function putzen() {
    staubVorbereiten();
    html.setAttribute("data-staubig", "");
    const z = zeilen();
    const breiteKal = kal.clientWidth;
    const proZeile = Math.max(2600, 38000 / z.length);
    zeigeBanner("Großputz bei der Capy Crew 🧽", "Alles wird blitzblank");
    await zeige(0, 200);
    await warte(900);
    // erst die Spinnweben wegfegen
    const besen = capy({ werkzeug: "🧹" }, 60);
    await laufen(besen, -70, 10, 4, 900);
    besen.querySelector(".werkzeug").animate([{ transform: "rotate(-30deg)" }, { transform: "rotate(25deg)" }], { duration: 220, iterations: 8, direction: "alternate" });
    await warte(1000);
    const webeL = kal.querySelector(".spinnwebe.links"), webeR = kal.querySelector(".spinnwebe.rechts");
    webeL.animate([{ opacity: 0.85 }, { opacity: 0, transform: "translate(-20px, 30px) rotate(-30deg)" }], { duration: 700, fill: "forwards" });
    await laufen(besen, 10, breiteKal - 70, 4, 1600);
    besen.querySelector(".werkzeug").animate([{ transform: "rotate(-30deg)" }, { transform: "rotate(25deg)" }], { duration: 220, iterations: 6, direction: "alternate" });
    await warte(800);
    webeR.animate([{ opacity: 0.85 }, { opacity: 0, transform: "scaleX(-1) translate(-20px, 30px) rotate(-30deg)" }], { duration: 700, fill: "forwards" });
    await laufen(besen, breiteKal - 70, breiteKal + 30, 4, 700);
    besen.remove();
    // dann jedes Türchen wischen, Brett für Brett
    let gezaehlt = 0;
    for (let n = 0; n < z.length; n++) {
      const reihe = z[n];
      zeigeBanner("Großputz bei der Capy Crew 🧽", "Türchen " + gezaehlt + " von 24 blitzblank");
      await zeige(reihe.y, reihe.unten - reihe.y);
      const cb = Math.max(54, Math.min(88, (reihe.unten - reihe.y) * 0.62));
      const y = reihe.unten - capyHoehe(cb) + 2;
      const vonLinks = n % 2 === 0;
      const c = capy({ hut: n % 3 === 0 ? "muetze" : null, werkzeug: "🧽" }, cb);
      const x0 = vonLinks ? -cb : breiteKal, x1 = vonLinks ? breiteKal : -cb;
      c.querySelector(".werkzeug").animate([{ transform: "rotate(-25deg) translateY(0)" }, { transform: "rotate(20deg) translateY(-6px)" }], { duration: 260, iterations: Math.ceil(proZeile / 260), direction: "alternate" });
      for (const t of reihe.tueren) {
        const mitteX = t.offsetLeft + t.offsetWidth / 2;
        const anteil = Math.max(0, Math.min(1, Math.abs((mitteX - cb / 2) - x0) / Math.abs(x1 - x0)));
        setTimeout(() => {
          const staub = t.querySelector(".staub");
          if (staub) staub.animate([{ clipPath: "inset(0 0 0 0)" }, { clipPath: vonLinks ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)" }], { duration: 650, fill: "forwards" })
            .finished.then(() => { t.classList.add("sauber"); staub.getAnimations().forEach((a) => a.cancel()); }, () => {});
          funken(mitteX, t.offsetTop + t.offsetHeight * 0.45, ["✨", "🫧"], 6, 30);
          gezaehlt++;
          zeigeBanner("Großputz bei der Capy Crew 🧽", "Türchen " + gezaehlt + " von 24 blitzblank");
        }, anteil * proZeile);
      }
      await laufen(c, x0, x1, y, proZeile);
      c.remove();
    }
    // Lichterkette polieren
    zeigeBanner("Die Lichterkette wird poliert 💡");
    kette.scrollIntoView({ behavior: ruhig ? "auto" : "smooth", block: "center" });
    await warte(700);
    html.removeAttribute("data-staubig");
    kette.classList.add("poliert");
    if (ak.starteLichtershow) ak.starteLichtershow();
    await warte(3400);
    kette.classList.remove("poliert");
    // Tannenzweige oben abstauben
    zeigeBanner("Die Tannenzweige werden abgestaubt 🌲");
    window.scrollTo({ top: 0, behavior: ruhig ? "auto" : "smooth" });
    await warte(800);
    document.querySelectorAll(".zweig").forEach((z) => {
      z.animate([{ filter: "grayscale(.7) brightness(.85)" }, { filter: "none" }], { duration: 1400, fill: "forwards" }).finished.then(() => z.getAnimations().forEach((a) => a.cancel()), () => {});
      z.querySelectorAll(".kugel").forEach((k) => k.animate([{ transform: "rotate(-20deg)" }, { transform: "rotate(16deg)" }, { transform: "rotate(0)" }], { duration: 1300 }));
      const r = z.getBoundingClientRect();
      for (let k = 0; k < 3; k++) setTimeout(() => {
        const f = document.createElement("span");
        f.className = "bau-funke"; f.style.position = "fixed"; f.textContent = "✨";
        f.style.left = r.left + Math.random() * r.width + "px"; f.style.top = r.top + Math.random() * r.height + "px";
        document.body.appendChild(f);
        f.animate([{ opacity: 1, transform: "scale(.4)" }, { opacity: 0, transform: "scale(1.4)" }], { duration: 900 }).finished.then(() => f.remove());
      }, k * 300);
    });
    await warte(1800);
    // Türchen 1 glänzt extra
    const t1 = kal.querySelector(':scope > .tuer[data-tag="1"]');
    if (t1) {
      zeigeBanner("Türchen 1 ist bereit. Morgen geht's los! ✨");
      t1.scrollIntoView({ behavior: ruhig ? "auto" : "smooth", block: "center" });
      await warte(800);
      t1.classList.add("glaenzt");
      for (let k = 0; k < 4; k++) setTimeout(() => funken(t1.offsetLeft + Math.random() * t1.offsetWidth, t1.offsetTop + Math.random() * t1.offsetHeight, ["✨"], 6, 30), k * 600);
      await warte(3600);
      t1.classList.remove("glaenzt");
    }
    tueren().forEach((t) => t.classList.remove("sauber"));
    bannerWeg();
  }

  const ANIMATIONEN = { 27: aufbauen, 28: dekorieren, 30: putzen };
  async function spiele(tag) {
    if (laeuft || !ANIMATIONEN[tag]) return;
    laeuft = true;
    try { await ANIMATIONEN[tag](); merkeFertig(tag); }
    catch (_) { /* eine Animation darf nie die Seite stören */ }
    finally {
      laeuft = false;
      kal.querySelectorAll(".bau-capy, .trage-paket, .schnee-streifen, .bau-funke").forEach((e) => e.remove());
      bannerWeg();
      zustand(ak.intro.datum());
    }
  }

  window.capyAufbau = {
    zustand,
    spiele,
    hatAnimation: (tag) => !!ANIMATIONEN[tag],
    istFertig,
    laeuft: () => laeuft,
  };
})();
