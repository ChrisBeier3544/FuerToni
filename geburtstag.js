/*
 * ===========================================================
 *  TONIS GEBURTSTAG (26.11.) IM KALENDER
 *  Gratulanten: die zehn Vogelfreunde kommen einzeln vorbei
 *  Erstes Familienfoto: Papa, Mama und das Küken
 *  Geburtstagsfeuerwerk ab 21 Uhr, die Vögel schauen zu
 *  Alles einmal, über die Warteschlange der Munkelvögel.
 * ===========================================================
 */
(function () {
  "use strict";

  const ak = window.adventkalender;
  const intro = document.getElementById("intro");
  if (!ak || !ak.intro || !intro || !ak.voegel || !ak.voegel.intern) return;
  const I = ak.voegel.intern;
  const ruhig = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const wahl = (l) => l[Math.floor(Math.random() * l.length)];
  const pause = (ms) => new Promise((r) => setTimeout(r, ms));
  const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html !== undefined) e.innerHTML = html; return e; };

  const SCHLUESSEL = "toni-geburtstag-" + KALENDER.jahr;
  function lies() { try { const s = JSON.parse(localStorage.getItem(SCHLUESSEL) || "{}"); return s && typeof s === "object" ? s : {}; } catch (_) { return {}; } }
  const merke = (k) => { const s = lies(); s[k] = true; try { localStorage.setItem(SCHLUESSEL, JSON.stringify(s)); } catch (_) { /* egal */ } };

  const heute = () => {
    if (!ak.intro.bereit() || (ak.zeitreise && ak.zeitreise.aktiv()) || ak.intro.phase() !== "offen") return false;
    const d = ak.intro.datum();
    return d.jahr === KALENDER.jahr && d.monat === 11 && d.tag === 26;
  };
  const stunde = () => ak.intro.datum().stunde;
  const geschluepft = () => !!(ak.ei && ak.ei.geschluepft && ak.ei.geschluepft());
  const ruhigImKalender = () => intro.hidden && !document.querySelector("dialog[open], .special-buehne, .aufbau-buehne, .munkel-buehne, .mistel-ebene, .neujahr, #finale:not([hidden])") && !I.maennchen.auftrag;

  function teilchen(x, y, n, zeichen) {
    for (let k = 0; k < n; k++) {
      const h = el("span", "ei-herz", wahl(zeichen));
      h.style.left = x + "px"; h.style.top = y + "px";
      document.body.appendChild(h);
      const dx = (Math.random() - 0.5) * 120, dy = -50 - Math.random() * 70;
      h.animate([{ transform: "translate(-50%,-50%) scale(.3)", opacity: 0 }, { transform: "translate(calc(-50% + " + (dx / 2).toFixed(1) + "px), calc(-50% + " + (dy / 2).toFixed(1) + "px)) scale(1)", opacity: 1, offset: 0.35 },
        { transform: "translate(calc(-50% + " + dx.toFixed(1) + "px), calc(-50% + " + dy.toFixed(1) + "px)) scale(.8)", opacity: 0 }], { duration: 1400, delay: k * 50, easing: "ease-out", fill: "both" }).onfinish = () => h.remove();
    }
  }
  function neueBuehne(art, titel) {
    const b = el("div", "munkel-buehne gb-buehne " + art, '<div class="gb-licht"></div><p class="gb-titel">' + titel + '</p><button type="button" class="munkel-zu" aria-label="Schließen">✕</button>');
    b.setAttribute("role", "dialog");
    document.body.appendChild(b);
    requestAnimationFrame(() => b.classList.add("da"));
    return b;
  }
  const weg = (b) => { b.classList.add("vorbei"); setTimeout(() => b.remove(), 650); };

  /* =========================================================
     1. GRATULANTEN: zehn Vogelfreunde, jeder mit einem Glückwunsch und einem kleinen Geschenk
     ========================================================= */
  const GAESTE = [
    ["Happy Birthday, Toni! 🎂", "🍓"], ["Alles Liebe zum Geburtstag! 🥳", "🪶"], ["Ich hab dir die schönste Beere mitgebracht 🫐", "🫐"],
    ["Hab einen wunderschönen Tag, Toni ✨", "⭐"], ["Für dich hab ich extra geübt: Piep piep hurra! 🎉", "🎈"], ["Bleib genau so, wie du bist ♥️", "🌸"],
    ["Ganz viel Glück im neuen Jahr! 🍀", "🍀"], ["Darf ich ein Stück Kuchen? Nur ein kleines 😋", "🧁"], ["Ich hab dir einen Sonnenstrahl eingepackt ☀️", "☀️"],
    ["Wir haben dich alle so lieb, Toni ♥️", "🎁"],
  ];
  async function gratulanten() {
    merke("gratulanten");
    const b = neueBuehne("gb-gratulanten", "Gratulanten für Toni 🎉");
    b.insertAdjacentHTML("beforeend", '<div class="gb-reihe"></div><div class="gb-tisch"><span class="gb-geschenke"></span></div><div class="gb-blase" hidden></div>');
    const reihe = b.querySelector(".gb-reihe"), geschenke = b.querySelector(".gb-geschenke"), blase = b.querySelector(".gb-blase");
    let ende = false;
    const zu = () => { if (ende) return; ende = true; weg(b); };
    b.querySelector(".munkel-zu").addEventListener("click", zu);
    await pause(700);
    for (let i = 0; i < GAESTE.length && !ende; i++) {
      const [satz, geschenk] = GAESTE[i];
      const g = el("span", "gb-gast", ak.voegel.gastSvg ? ak.voegel.gastSvg(i) : "");
      g.style.setProperty("--von", i % 2 ? "140vw" : "-140vw");
      reihe.appendChild(g);
      await pause(ruhig ? 50 : 900);
      if (ende) return;
      g.classList.add("da");
      // erst wenn er gelandet ist, steht seine Blase über ihm
      await pause(ruhig ? 50 : 950);
      if (ende) return;
      // Glückwunsch über dem Gast
      const r = g.getBoundingClientRect(), br = b.getBoundingClientRect();
      blase.textContent = satz; blase.hidden = false;
      const bw = blase.offsetWidth;
      blase.style.left = Math.max(10, Math.min(br.width - bw - 10, r.left + r.width / 2 - bw / 2)) + "px";
      blase.style.top = r.top - blase.offsetHeight - 10 + "px";
      blase.style.setProperty("--spitze", Math.max(14, Math.min(bw - 14, r.left + r.width / 2 - parseFloat(blase.style.left))) + "px");
      // Geschenk auf den Tisch legen
      const s = el("span", "gb-geschenk", geschenk);
      geschenke.appendChild(s);
      teilchen(r.left + r.width / 2, r.top + 10, 4, ["✨", "♥️"]);
      await pause(2400);
      blase.hidden = true;
      await pause(250);
    }
    if (ende) return;
    const r = reihe.getBoundingClientRect();
    teilchen(r.left + r.width / 2, r.top + 20, 22, ["🎉", "♥️", "✨", "🥳"]);
    reihe.classList.add("jubel");
    blase.textContent = "Alle zusammen: Happy Birthday, Toni! 🎂🥳"; blase.hidden = false;
    const bw = blase.offsetWidth, br = b.getBoundingClientRect();
    blase.style.left = Math.max(10, br.width / 2 - bw / 2) + "px"; blase.style.top = r.top - blase.offsetHeight - 14 + "px"; blase.style.setProperty("--spitze", bw / 2 + "px");
    await pause(3600);
    if (ende) return;
    blase.hidden = true;
    const fuss = el("div", "munkel-karte gb-ende", "<p>Zehn Freunde, zehn Glückwünsche und ein Tisch voller kleiner Geschenke 🎁</p>");
    const knopf = el("button", "munkel-knopf", "Danke, ihr Lieben ♥️");
    knopf.type = "button"; knopf.addEventListener("click", zu);
    fuss.appendChild(knopf);
    b.appendChild(fuss);
  }

  /* =========================================================
     2. ERSTES FAMILIENFOTO
     ========================================================= */
  async function familienfoto() {
    merke("familienfoto");
    const b = neueBuehne("gb-foto", "Unser erstes Familienfoto 📸");
    const vSvg = (w) => (ak.voegel.svg ? ak.voegel.svg(w) : "");
    b.insertAdjacentHTML("beforeend",
      '<div class="gb-motiv"><div class="foto-sucher gb-sucher"><i></i><i></i><i></i><i></i></div>' +
      '<span class="gb-pose m">' + vSvg(false) + '</span><span class="gb-pose k">' + (ak.voegel.kuekenSvg ? ak.voegel.kuekenSvg(true) : "") + '</span><span class="gb-pose w">' + vSvg(true) + "</span></div>" +
      '<div class="munkel-karte gb-ausloeser-karte"><button type="button" class="foto-ausloeser" aria-label="Foto machen"><span>📸</span></button><p>Alle lächeln! Tipp auf den Auslöser</p></div>');
    let ende = false;
    const zu = () => { if (ende) return; ende = true; weg(b); };
    b.querySelector(".munkel-zu").addEventListener("click", zu);
    await new Promise((r) => b.querySelector(".foto-ausloeser").addEventListener("click", r, { once: true }));
    if (ende) return;
    try {
      const a = new (window.AudioContext || window.webkitAudioContext)();
      [1800, 900].forEach((f, i) => { const t = a.currentTime + i * 0.06, o = a.createOscillator(), g = a.createGain(); o.type = "square"; o.frequency.setValueAtTime(f, t); g.gain.setValueAtTime(0.025, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.06); o.connect(g).connect(a.destination); o.start(t); o.stop(t + 0.07); });
    } catch (_) { /* ohne Ton */ }
    const blitz = el("div", "wettflug-blitz");
    b.appendChild(blitz);
    setTimeout(() => blitz.remove(), 700);
    // ins Fotoalbum
    let liste = [];
    try { liste = JSON.parse(localStorage.getItem("toni-wz-fotos") || "[]"); if (!Array.isArray(liste)) liste = []; } catch (_) { liste = []; }
    liste = liste.concat({ pose: "familie", tag: "26.11." }).slice(-12);
    try { localStorage.setItem("toni-wz-fotos", JSON.stringify(liste)); } catch (_) { /* egal */ }
    await pause(500);
    b.querySelector(".gb-ausloeser-karte").remove();
    b.querySelector(".gb-motiv").classList.add("weg");
    const svg = ak.munkelspiele && ak.munkelspiele.fotoSvg ? ak.munkelspiele.fotoSvg("familie") : "";
    const karte = el("div", "munkel-karte gb-foto-karte", '<div class="foto-polaroid">' + svg + "<p>26.11. · Wir drei ♥️</p></div><p>Das kommt ganz vorne ins Fotoalbum 📸 Du findest es in Tonis Ecke</p>");
    const knopf = el("button", "munkel-knopf", "Wie schön 🥹");
    knopf.type = "button"; knopf.addEventListener("click", zu);
    karte.appendChild(knopf);
    b.appendChild(karte);
    const r = karte.getBoundingClientRect();
    teilchen(r.left + r.width / 2, r.top + 30, 14, ["♥️", "✨"]);
  }

  /* =========================================================
     3. GEBURTSTAGSFEUERWERK (ab 21 Uhr)
     ========================================================= */
  async function feuerwerk() {
    merke("feuerwerk");
    if (!ak.neujahr || !ak.neujahr.feuerwerk) return;
    // die Vögel setzen Partyhüte auf und schauen von unten zu
    const m = I.maennchen, w = I.weibchen, k = I.kueken;
    const voegel = [m, w, k].filter(Boolean);
    document.documentElement.classList.add("voegel-vorne");
    voegel.forEach((v) => { v.auftrag = true; });
    const unten = (dx) => () => ({ x: window.innerWidth / 2 + dx, y: window.innerHeight - 64 });
    const plaetze = { m: -56, w: 56, k: 0 };
    await Promise.all(voegel.map((v, i) => pause(i * 250).then(() => I.holeHer(v, unten(v === m ? plaetze.m : v === w ? plaetze.w : plaetze.k)))));
    if (m) m.blick = 1; if (w) w.blick = -1;
    voegel.forEach((v) => { I.hut(v, true); I.hops(v); });
    let fertig;
    const vorbei = new Promise((r) => (fertig = r));
    ak.neujahr.feuerwerk({ gross: "Toni", titel: "Happy Birthday, mein Schatz ♥️", text: "Auf dein neues Lebensjahr und ganz viele wunderschöne Momente mit dir", ohneMerken: true, beimEnde: () => fertig() });
    await pause(2600);
    if (m) await I.sag(m, "Ohhh! 🎆", 2000);
    if (k) await I.sag(k, "Piep! So schön! 🥹", 2400);
    if (w) await I.sag(w, "Alles Liebe, Toni ♥️", 2600);
    await Promise.race([vorbei, pause(16000)]);
    document.documentElement.classList.remove("voegel-vorne");
    voegel.forEach((v, i) => setTimeout(() => { I.heimfliegen(v); }, i * 350));
    setTimeout(() => voegel.forEach((v) => I.hut(v, false)), 20 * 60000);
  }

  /* ---------- Reihenfolge über die Warteschlange ---------- */
  if (ak.voegel.registriere) {
    ak.voegel.registriere({ art: "gb-feuerwerk", vogel: "m", prio: 0.5, ohneFrage: true, ueberall: true, frage: () => "",
      aktiv: () => heute() && stunde() >= 21 && geschluepft() && !lies().feuerwerk && ruhigImKalender(), ja: () => feuerwerk() });
    ak.voegel.registriere({ art: "gb-gratulanten", vogel: "m", prio: 0.6, ohneFrage: true, ueberall: true, frage: () => "",
      aktiv: () => heute() && stunde() >= 8 && geschluepft() && !lies().gratulanten && ruhigImKalender(), ja: () => gratulanten() });
    ak.voegel.registriere({ art: "gb-familienfoto", vogel: "m", prio: 0.7, frage: () => "Toni, machen wir unser erstes Familienfoto? Zu dritt! 📸", knoepfe: ["Ja 📸", "Später"],
      vorab: () => "Krümel hat sich extra die Federn gekämmt 🐣",
      aktiv: () => heute() && stunde() >= 8 && geschluepft() && !!I.kueken && !lies().familienfoto && ruhigImKalender(), ja: () => familienfoto(),
      spaeter: ["Okay, Toni! In Tonis Ecke wartet das Familienfoto auf dich 📸"] });
  }
  if (ak.ecke) ak.ecke.eintrag({ id: "familienfoto", symbol: "📸", name: "Familienfoto", text: "Papa, Mama und das Küken", da: () => heute() && geschluepft() && !lies().familienfoto && !document.querySelector(".munkel-buehne"), los: () => familienfoto() });

  window.adventkalender.geburtstag = { gratulanten, familienfoto, feuerwerk };
})();
