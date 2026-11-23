/*
 * ===========================================================
 *  DIE MUNKELVÖGEL IM DEZEMBER
 *  Ein kleines Wandbrett unter Adventskranz und Schneekugel
 *  ist ihr Zuhause: links das Vogelbäumchen, in der Mitte
 *  das Winternest, rechts Platz für den Nikolausstiefel.
 *  Dazu: Flugschule fürs Küken (1. bis 7.12.), Erinnerung
 *  ans Türchen, Plätzchen klauen (Wochenenden), Kerzen am
 *  Adventskranz (2. bis 4. Advent), Nikolaus, Jahrestag,
 *  Heiligabend, Silvester und jeden Abend eine Geschichte.
 * ===========================================================
 */
(function () {
  "use strict";

  const ak = window.adventkalender;
  const intro = document.getElementById("intro");
  if (!ak || !ak.intro || !intro || !ak.voegel || !ak.voegel.intern) return;
  const I = ak.voegel.intern;
  const ruhig = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const f1 = (n) => n.toFixed(1);
  const wahl = (l) => l[Math.floor(Math.random() * l.length)];
  const pause = (ms) => new Promise((r) => setTimeout(r, ms));
  const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html !== undefined) e.innerHTML = html; return e; };
  const W = () => window.innerWidth, H = () => window.innerHeight;

  /* ---------- Speichern ---------- */
  const SCHLUESSEL = "toni-dezember";
  function lies() { try { const s = JSON.parse(localStorage.getItem(SCHLUESSEL) || "{}"); return s && typeof s === "object" ? s : {}; } catch (_) { return {}; } }
  function schreib(s) { try { localStorage.setItem(SCHLUESSEL, JSON.stringify(s)); } catch (_) { /* egal */ } }
  const merke = (k, v) => { const s = lies(); s[k] = v; schreib(s); };

  /* ---------- Wann? ---------- */
  const reise = () => !!(ak.zeitreise && ak.zeitreise.aktiv());
  // Tag im Dezember (1 bis 31), sonst 0; im Januar bis zum 6. ist das Brett noch da
  function dTag() {
    if (!ak.intro.bereit() || reise()) return 0;
    const d = ak.intro.datum();
    return d.jahr === KALENDER.jahr && d.monat === 12 ? d.tag : 0;
  }
  function brettZeit() {
    if (!ak.intro.bereit() || reise() || ak.intro.phase() !== "offen") return false;
    const d = ak.intro.datum();
    return (d.jahr === KALENDER.jahr && d.monat === 12) || (d.jahr === KALENDER.jahr + 1 && d.monat === 1 && d.tag <= 6);
  }
  const datum = () => ak.intro.datum();
  const stunde = () => datum().stunde;
  const minuten = () => { const d = datum(); return d.stunde * 60 + d.minute; };
  // nachts (22:30 bis 5 Uhr) schläft die Familie im Nest; an Silvester sind alle bis nach Mitternacht wach
  function nachts() {
    const d = datum(), m = minuten();
    if (d.monat === 12 && d.tag === 31 && m >= 22 * 60 + 30) return false;
    if (d.monat === 1 && d.tag === 1 && m < 15) return false;
    return m >= 22 * 60 + 30 || m < 5 * 60;
  }
  const kalenderRuhig = () => intro.hidden && !document.querySelector("dialog[open], .special-buehne, .aufbau-buehne, .munkel-buehne, .mistel-ebene, #finale:not([hidden]), .neujahr, .neujahr-countdown") && !document.documentElement.hasAttribute("data-schneetag");
  const kName = () => (ak.ei && ak.ei.name ? ak.ei.name() : "") || "Krümel";
  // ist ein Element zu großen Teilen im Bild?
  function imBild(e, anteil) {
    if (!e || !e.isConnected || e.hidden) return false;
    const r = e.getBoundingClientRect();
    if (!r.width || !r.height) return false;
    const sicht = Math.max(0, Math.min(r.bottom, H() - 6) - Math.max(r.top, 6));
    return sicht / r.height >= (anteil || 0.9) && r.left >= -2 && r.right <= W() + 2;
  }

  /* ---------- kleine Töne ---------- */
  let audio = null;
  function ton(f, dauer, art, laut, wann) {
    try {
      audio = audio || new (window.AudioContext || window.webkitAudioContext)();
      if (audio.state === "suspended") audio.resume();
      const t = audio.currentTime + (wann || 0), o = audio.createOscillator(), g = audio.createGain();
      o.type = art || "triangle"; o.frequency.setValueAtTime(f, t);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(laut || 0.04, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + dauer);
      o.connect(g).connect(audio.destination); o.start(t); o.stop(t + dauer + 0.02);
    } catch (_) { /* ohne Ton */ }
  }
  const effekte = el("div", "dez-effekte");
  effekte.setAttribute("aria-hidden", "true");
  document.body.appendChild(effekte);
  function teilchen(x, y, n, zeichen, weit) {
    for (let k = 0; k < n; k++) {
      const h = el("span", "dez-teilchen", wahl(zeichen || ["♥️", "✨"]));
      h.style.left = x + "px"; h.style.top = y + "px";
      effekte.appendChild(h);
      const dx = (Math.random() - 0.5) * (weit || 80), dy = -40 - Math.random() * 50;
      h.animate([{ transform: "translate(-50%,-50%) scale(.3)", opacity: 0 }, { transform: "translate(calc(-50% + " + f1(dx * 0.5) + "px), calc(-50% + " + f1(dy * 0.5) + "px)) scale(1)", opacity: 1, offset: 0.35 },
        { transform: "translate(calc(-50% + " + f1(dx) + "px), calc(-50% + " + f1(dy) + "px)) scale(.8)", opacity: 0 }], { duration: 1300 + Math.random() * 400, delay: k * 50, easing: "ease-out", fill: "both" }).onfinish = () => h.remove();
    }
  }

  /* =========================================================
     DAS WANDBRETT
     ========================================================= */
  const BAUM_SVG = '<svg viewBox="0 0 80 104" aria-hidden="true">' +
    '<path d="M31 88h18l-2 14H33z" fill="#c0563c"/><rect x="29" y="86" width="22" height="5" rx="2" fill="#d96a4e"/><rect x="37" y="80" width="6" height="8" fill="#7a4e33"/>' +
    '<path d="M40 6 L64 40 H54 L70 62 H58 L76 84 H4 L22 62 H10 L26 40 H16Z" fill="#3f7f55"/>' +
    '<path d="M40 6 L64 40 H54 L70 62 H58 L76 84 H40Z" fill="#356c48"/>' +
    '<path d="M18 46q22 8 46 -4M12 68q28 10 56 -4" fill="none" stroke="#f3c84b" stroke-width="1.4" stroke-dasharray="1 3" stroke-linecap="round"/></svg>';
  const STERN_SVG = '<svg viewBox="-12 -12 24 24" aria-hidden="true"><path d="M0-11 3.2-3.6 11-3.4 4.9 1.6 7 9.4 0 5 -7 9.4 -4.9 1.6 -11-3.4 -3.2-3.6Z" fill="#f3c84b" stroke="#c99528" stroke-width="1"/></svg>';
  const KUGEL_FARBEN = ["#e8455a", "#f3c84b", "#5aa9e6", "#ff8fab", "#9be3a8", "#b87cf0", "#ff8a3d", "#ffffff"];
  const kugelSvg = (f) => '<svg viewBox="-6 -8 12 14" aria-hidden="true"><rect x="-1.6" y="-7.4" width="3.2" height="2.4" rx=".6" fill="#c99528"/><circle r="5" fill="' + f + '"' + (f === "#ffffff" ? ' stroke="#d9dde6" stroke-width=".8"' : "") + '/><circle cx="-1.6" cy="-1.6" r="1.4" fill="#fff" opacity=".7"/></svg>';
  const STIEFEL_SVG = (voll) => '<svg viewBox="0 0 44 54" aria-hidden="true">' +
    (voll ? '<path d="M14 14 q-1 -10 6 -12 q6 -2 6 4" fill="none" stroke="#e8455a" stroke-width="3.4" stroke-linecap="round"/><path d="M14 14 q-1 -10 6 -12" fill="none" stroke="#fff" stroke-width="3.4" stroke-dasharray="2.5 2.5" stroke-linecap="round"/>' +
      '<path d="M24 16 q2 -11 9 -10 q5 2 1 12z" fill="#7a4526"/><circle cx="31" cy="9" r="1.2" fill="#fff"/><path d="M19 10c-1.8-1.4-3.4-2.7-3.4-4.1 0-1 .8-1.7 1.7-1.7.7 0 1.3.4 1.7.9.4-.5 1-.9 1.7-.9.9 0 1.7.7 1.7 1.7 0 1.4-1.6 2.7-3.4 4.1z" fill="#ff8fab"/>' : "") +
    '<path d="M10 14h20v22q0 4 4 5l6 2q3 1 3 5v2H10z" fill="#d6304f"/><path d="M10 40h33" stroke="#9d2449" stroke-width="1.4"/><rect x="7" y="10" width="26" height="8" rx="4" fill="#fff"/><circle cx="26" cy="27" r="2" fill="#f3c84b"/></svg>';

  let brett = null, baumEl = null, kugelnEl = null, nestEl = null, nestKnopf = null, stiefelEl = null, zuletztNest = "";
  function baueBrett() {
    const reihe = document.querySelector(".kranz-reihe");
    if (!reihe) return null;
    brett = el("div", "vogel-brett");
    brett.innerHTML =
      '<div class="vb-platz vb-baum"><button type="button" class="vb-baum-knopf" aria-label="Vogelbäumchen">' + BAUM_SVG + '<span class="vb-kugeln"></span></button></div>' +
      '<div class="vb-platz vb-nest"><div class="vb-nest-bild"></div><span class="vb-kueken-schlaf"></span><button type="button" class="vb-nest-knopf" aria-label="Geschichte zum Einschlafen hören" hidden></button></div>' +
      '<div class="vb-platz vb-stiefel"></div>' +
      '<div class="vb-holz"><i></i><i></i></div>';
    reihe.after(brett);
    baumEl = brett.querySelector(".vb-baum-knopf");
    kugelnEl = brett.querySelector(".vb-kugeln");
    nestEl = brett.querySelector(".vb-nest-bild");
    nestKnopf = brett.querySelector(".vb-nest-knopf");
    stiefelEl = brett.querySelector(".vb-stiefel");
    baumEl.addEventListener("click", baumGetippt);
    nestKnopf.addEventListener("click", () => geschichte());
    return brett;
  }

  /* ---------- Nest ---------- */
  function malNest() {
    const schlaf = nachts();
    const schluessel = (schlaf ? "s" : "w") + JSON.stringify(ak.nest && ak.nest.wahl ? ak.nest.wahl() : "");
    if (schluessel !== zuletztNest && ak.nest && ak.nest.svg) {
      zuletztNest = schluessel;
      nestEl.innerHTML = ak.nest.svg(null, schlaf ? "schlaf" : false, true);
      const k = brett.querySelector(".vb-kueken-schlaf");
      k.innerHTML = schlaf && ak.voegel.kuekenSvg ? ak.voegel.kuekenSvg(false) : "";
    }
    brett.classList.toggle("schlaeft", schlaf);
    nestKnopf.hidden = !schlaf;
  }

  /* ---------- Bäumchen ---------- */
  // Plätze im Baum (Prozent der Fläche), damit Kugeln nie neben den Baum geraten
  function imBaum(x, y) {
    // Dreieck grob: Spitze bei (50, 8), unten von 8 bis 92 bei y 80
    if (y < 14 || y > 79) return false;
    const halb = ((y - 8) / 72) * 44;
    return Math.abs(x - 50) <= halb - 3;
  }
  function naechsterPlatz(x, y) {
    y = Math.max(18, Math.min(78, y));
    const halb = ((y - 8) / 72) * 44 - 4;
    return { x: Math.max(50 - halb, Math.min(50 + halb, x)), y };
  }
  function zufallsPlatz(tag) {
    let s = (tag * 9301 + 49297) % 233280;
    for (let i = 0; i < 40; i++) {
      s = (s * 9301 + 49297) % 233280; const x = 10 + (s / 233280) * 80;
      s = (s * 9301 + 49297) % 233280; const y = 20 + (s / 233280) * 56;
      if (imBaum(x, y)) return { x, y };
    }
    return { x: 50, y: 50 };
  }
  const kugeln = () => (Array.isArray(lies().kugeln) ? lies().kugeln : []);
  function malBaum() {
    const liste = kugeln();
    kugelnEl.innerHTML = liste.map((k) => k.stern
      ? '<span class="vb-stern" style="left:50%;top:7%">' + STERN_SVG + "</span>"
      : '<span class="vb-kugel" style="left:' + f1(k.x) + "%;top:" + f1(k.y) + '%">' + kugelSvg(KUGEL_FARBEN[(k.tag - 1) % KUGEL_FARBEN.length]) + "</span>").join("");
  }
  // verpasste Tage: der Kugel des Tages hängt das Küken selbst auf
  function fehlendeKugeln() {
    const t = dTag();
    if (!t) return;
    const liste = kugeln(), bis = Math.min(t - 1, 23);
    let neu = false;
    for (let d = 1; d <= bis; d++) if (!liste.some((k) => k.tag === d)) { liste.push(Object.assign({ tag: d }, zufallsPlatz(d))); neu = true; }
    if (t > 24 && !liste.some((k) => k.stern)) { liste.push({ tag: 24, stern: true }); neu = true; }
    if (neu) { merke("kugeln", liste); malBaum(); }
  }
  let baumWahl = null;
  function baumGetippt(e) {
    if (!baumWahl) {
      const n = kugeln().filter((k) => !k.stern).length;
      if (ak.wartezeit && ak.wartezeit.blase) ak.wartezeit.blase(baumEl, kugeln().some((k) => k.stern) ? "Unser Bäumchen ist fertig 🎄✨" : n ? n + (n === 1 ? " Kugel" : " Kugeln") + " hängen schon 🎄" : "Jeden Tag bringt " + kName() + " eine Kugel 🎄", 2600);
      return;
    }
    const r = baumEl.getBoundingClientRect();
    const p = naechsterPlatz(((e.clientX - r.left) / r.width) * 100, ((e.clientY - r.top) / r.height) * 100);
    const f = baumWahl; baumWahl = null;
    f(p);
  }

  /* ---------- Stiefel ---------- */
  let stiefelZuletzt = "";
  function malStiefel() {
    const t = dTag(), s = lies();
    const voll = t === 6 || t === 7;
    const da = (t === 5 && s.stiefel) || voll;
    const art = da ? (voll ? (s.nikolausGesehen ? "leer" : "voll") : "leer") : "";
    if (art === stiefelZuletzt) return;
    stiefelZuletzt = art;
    stiefelEl.innerHTML = da ? '<button type="button" class="vb-stiefel-knopf" aria-label="Nikolausstiefel">' + STIEFEL_SVG(art === "voll") + "</button>" : "";
    const k = stiefelEl.querySelector("button");
    if (k) k.addEventListener("click", nikolausGetippt);
  }

  /* ---------- Zustand ---------- */
  function pruefe() {
    const an = brettZeit();
    if (an && !brett) baueBrett();
    if (!brett) return;
    brett.hidden = !an;
    if (!an) return;
    malNest();
    if (!kugelnEl.dataset.gemalt) { kugelnEl.dataset.gemalt = "1"; fehlendeKugeln(); malBaum(); }
    malStiefel();
  }
  setInterval(pruefe, 1000);

  /* =========================================================
     GUTE-NACHT-GESCHICHTEN (1. bis 24.12., ab 22:30 Uhr)
     ========================================================= */
  const GESCHICHTEN = {
    1: ["Gähn … Heute erzähl ich dir, wie " + "{k}" + " zum ersten Mal Schnee gesehen hat ❄️", "Es hat eine Flocke gefangen und sie ganz vorsichtig festgehalten.", "Dann war sie weg, und {k} hat geweint. Bis wir gesagt haben: Morgen kommen tausend neue 🥰"],
    2: ["Mmh … Weißt du, was Munkelvögel im Winter träumen? 🥱", "Von warmen Nestern, von Beeren und von Menschen, die sie lieb haben.", "Und seit diesem Jahr träumen wir alle drei von dir ♥️"],
    3: ["Psst … Es war einmal ein Stern, der zu schüchtern zum Leuchten war 🌟", "Bis er ein Mädchen gesehen hat, das jeden Abend zu ihm hochgelächelt hat.", "Seitdem leuchtet er für dich, Toni. Schau mal raus ✨"],
    4: ["Gähn … Heute hat {k} gefragt, warum es dich so lieb hat 🐣", "Ich hab gesagt: Weil du sein Ei gewärmt hast, bevor es dich kannte.", "Da hat {k} genickt und ist sofort eingeschlafen 🥰"],
    5: ["Mmh … Heute Nacht schleicht der Nikolaus durch die Stadt 🎅", "Er hat eine Liste, und ganz oben steht ein Name mit vier Buchstaben.", "Rate mal, welcher 🤭"],
    6: ["Psst … Der Nikolaus hat erzählt, dass er bei dir ganz leise sein musste 🎅", "Er wollte dich nicht wecken, weil du im Schlaf so süß lächelst.", "Das hat er so gesagt, ehrlich ♥️"],
    7: ["Gähn … {k} hat heute einen Looping geflogen 🐣", "Danach war ihm so schwindelig, dass es dreimal gegen mich geplumpst ist.", "Es war der schönste Tag in meinem Vogelleben 🥹"],
    8: ["Mmh … Es war einmal eine Schneeflocke, die keine Lust hatte zu fallen ❄️", "Sie ist einfach in der Luft geblieben und hat sich die Lichter angeschaut.", "Morgen fällt sie bestimmt. Vielleicht auf deine Nase 🥰"],
    9: ["Psst … Weißt du, warum die Capys im Winter so viel kuscheln? 🐹", "Weil zusammen alles wärmer ist. Das haben sie von dir und Chris gelernt.", "Gute Nacht, ihr zwei ♥️"],
    10: ["Gähn … Heute Nacht leuchtet der Mond nur für dich 🌙", "Wir haben ihn ganz lieb gefragt, und er hat sofort ja gesagt.", "Er ist ja auch ein Fan von dir 😌"],
    11: ["Mmh … Ich erzähl dir von dem Tag, an dem er mir zum ersten Mal gesagt hat, dass er mich lieb hat 🥰", "Er war so nervös, dass er dabei rückwärts vom Ast gefallen ist.", "Ich hab trotzdem ja gesagt ♥️"],
    12: ["Psst … Wenn es draußen schneit, ist es drinnen am gemütlichsten ❄️", "Dann kuscheln wir uns zu dritt ins Nest und zählen die Flocken.", "{k} schläft meistens schon bei drei ein 😴"],
    13: ["Gähn … Heute hat {k} die dritte Kerze ganz allein angezündet 🕯️", "Es war so stolz, dass es die ganze Zeit gepiepst hat.", "Ich glaube, es will dir morgen davon erzählen 🥰"],
    14: ["Mmh … Es war einmal ein Lebkuchen, der unbedingt geknuspert werden wollte 🍪", "Er hat so lange gewartet, bis ein gewisser Munkelvogel vorbeikam.", "Den Rest der Geschichte erzählt er dir lieber nicht 😋"],
    15: ["Psst … Weißt du, was das Schönste am Dezember ist? 🎄", "Dass jeder Tag ein kleines Geschenk hat.", "Und das größte Geschenk bist du, Toni ♥️"],
    16: ["Gähn … Heute hab ich beobachtet, wie die Lichterkette geblinzelt hat ✨", "Sie wollte dir Gute Nacht sagen, aber sie kann ja nicht sprechen.", "Also sag ich es für sie: Gute Nacht, Toni 🥰"],
    17: ["Mmh … Ich erzähl dir von einem kleinen Vogel, der Angst vor der Dunkelheit hatte 🌙", "Bis er gemerkt hat, dass im Dunkeln die Sterne leuchten.", "Seitdem mag {k} die Nacht am liebsten 🐣"],
    18: ["Psst … Es war einmal ein Brief, der den weiten Weg zu einem Mädchen geflogen ist ✉️", "Darin stand nur ein einziger Satz: Ich hab dich lieb.", "Rate mal, von wem 😌"],
    19: ["Gähn … Heute hab ich eine Feder verloren 🪶", "{k} hat sie gefunden und gesagt, die bekommt Toni.", "Morgen leg ich sie dir hin ♥️"],
    20: ["Mmh … Alle vier Kerzen brennen jetzt 🕯️🕯️🕯️🕯️", "{k} hat gefragt, was danach kommt.", "Ich hab gesagt: Danach kommt das Schönste. Weihnachten mit dir 🎄"],
    21: ["Psst … Heute vor einem Jahr habt ihr zwei euch kennengelernt ♥️", "Wir Vögel haben damals schon gewusst, dass das was ganz Besonderes wird.", "Wir haben nämlich zugeschaut 🤭"],
    22: ["Gähn … Nur noch zweimal schlafen bis Heiligabend 🎄", "{k} ist so aufgeregt, dass es im Schlaf mit den Flügeln flattert.", "Gute Nacht, Toni. Träum was Weihnachtliches ✨"],
    23: ["Mmh … Morgen ist Heiligabend 🎄", "Wir haben heimlich ein Lied geübt. Es klingt noch ein bisschen piepsig.", "Aber es kommt von Herzen ♥️"],
    24: ["Psst … Frohe Weihnachten, Toni 🎄", "Das war der schönste Dezember, den drei kleine Vögel je erlebt haben.", "Und das lag nur an dir ♥️"],
  };
  let erzaehlt = false;
  function geschichte() {
    if (erzaehlt || !nestEl || !ak.wartezeit || !ak.wartezeit.blase) return;
    const d = datum(), nacht = d.stunde < 5 ? d.tag - 1 : d.tag;
    const g = d.monat === 12 ? GESCHICHTEN[nacht] : null;
    brett.classList.remove("geweckt"); void brett.offsetWidth; brett.classList.add("geweckt");
    const gehoert = Array.isArray(lies().geschichten) ? lies().geschichten : [];
    if (!g || gehoert.includes(nacht)) { ak.wartezeit.blase(nestEl, wahl(["Psst … die drei schlafen schon tief und fest 😴", "Zzz … Gute Nacht, Toni 💤"]), 2800); return; }
    erzaehlt = true;
    merke("geschichten", gehoert.concat(nacht));
    const saetze = g.map((s) => s.replace(/\{k\}/g, kName())).concat(wahl(["Gute Nacht, Toni 💤", "Schlaf schön, Toni 💤", "Träum was Schönes, Toni 💤"]));
    saetze.forEach((satz, i) => setTimeout(() => {
      if (nachts() && imBild(nestEl, 0.5)) ak.wartezeit.blase(nestEl, satz, i === saetze.length - 1 ? 3600 : 5400);
      if (i === saetze.length - 1) setTimeout(() => { erzaehlt = false; }, 3600);
    }, i * 5700));
  }

  /* =========================================================
     Gemeinsame Hilfen für die Szenen
     ========================================================= */
  // Punkt auf dem Brett (Prozent der Breite), in Bildschirmkoordinaten
  const aufBrett = (anteil) => () => {
    if (!brett || brett.hidden) return null;
    const r = brett.querySelector(".vb-holz").getBoundingClientRect();
    return r.width ? { x: r.left + r.width * anteil, y: r.top + 2 } : null;
  };
  const nestPlatz = () => {
    if (!nestEl || brett.hidden || nachts()) return null;
    const r = nestEl.getBoundingClientRect();
    return r.width ? { x: r.left + r.width * 0.5, y: r.top + r.height * 0.56 } : null;
  };
  // Szene läuft: niemand fliegt dazwischen
  let szene = false;
  async function familieHolen(mitMama) {
    const m = I.maennchen, k = I.kueken;
    m.auftrag = true;
    if (k) k.auftrag = true;
    let w = I.weibchen;
    if (mitMama && !w) w = I.neuesWeibchen();
    if (w) w.auftrag = true;
    return { m, k, w };
  }
  function familieLos(f) {
    I.heimfliegen(f.m);
    if (f.w) setTimeout(() => I.heimfliegen(f.w), 400);
    if (f.k) setTimeout(() => I.heimfliegen(f.k), 800);
  }
  const frei = () => !szene && kalenderRuhig() && !I.maennchen.auftrag && !nachts() && !!I.maennchen.pos;

  /* =========================================================
     1. FLUGSCHULE (1. bis 7.12. morgens)
     ========================================================= */
  async function flugschule(tag) {
    if (!frei() || !I.kueken) return;
    szene = true;
    merke("flugschule", Object.assign({}, lies().flugschule, { [tag]: true }));
    const f = await familieHolen(false), n = kName();
    await Promise.all([I.holeHer(f.m, nestPlatz), pause(300).then(() => I.holeHer(f.k, aufBrett(0.72)))]);
    f.m.blick = 1; f.k.blick = -1;
    const k = f.k, start = aufBrett(0.72)();
    const fliege = async (punkte, ms) => {
      k.zustand = "fliegt"; k.el.classList.add("fliegt");
      await I.animiere(k, punkte.map((p) => ({ x: Math.max(24, Math.min(W() - 24, p.x)), y: Math.max(60, p.y) })), ms);
      k.zustand = "sitzt"; k.el.classList.remove("fliegt");
      const z = aufBrett(0.72)(); if (z) I.setzePosition(k, z);
      I.hops(k);
    };
    const s = start;
    await I.sag(f.m, ["Flugschule, Tag 1! Zeig mal, " + n + " 🐣", "Flugschule, Tag 2! Bereit, " + n + "? 🐣", "Tag 3 der Flugschule! Heute wird geflattert 🪶", "Tag 4! Heute fliegst du zu mir, " + n + " 🥰", "Tag 5! Eine kleine Runde, " + n + " 🐣", "Tag 6! Heute ein großer Bogen 🪶", "Letzter Tag der Flugschule! Heute der Looping, " + n + " 🥹"][tag - 1], 3000);
    if (tag === 1) {
      k.el.classList.add("zappelt");
      await I.bild(k).animate([{ translate: "0 0" }, { translate: "0 -10px", offset: 0.5 }, { translate: "0 0", scale: "1.25 .75", offset: 0.85 }, { translate: "0 0", scale: "1 1" }], { duration: 1500, easing: "ease-in" }).finished.catch(() => {});
      k.el.classList.remove("zappelt");
      await I.sag(k, "Autsch 🙈", 1800);
      await I.sag(f.m, "Fast, " + n + "! Morgen klappt es bestimmt 🥰", 3000);
    } else if (tag === 2) {
      for (let i = 0; i < 3; i++) { await I.bild(k).animate([{ translate: "0 0" }, { translate: "0 -14px", offset: 0.4 }, { translate: "0 0", scale: "1.15 .85", offset: 0.85 }, { translate: "0 0" }], { duration: 520 }).finished.catch(() => {}); ton(900 + i * 120, 0.08); }
      await I.sag(k, "Hüpf, hüpf, hüpf! 🐣", 2200);
      await I.sag(f.m, "Schon richtig sportlich, " + n + " 😄", 2800);
    } else if (tag === 3) {
      k.el.classList.add("zappelt");
      await fliege([s, { x: s.x, y: s.y - 30 }, { x: s.x + 4, y: s.y - 34 }, { x: s.x - 2, y: s.y - 30 }, s], 2600);
      k.el.classList.remove("zappelt");
      await I.sag(k, "Ich flieg! … ein bisschen 😳", 2400);
      await I.sag(f.m, "Ich bin so stolz auf dich 🥹", 2800);
    } else if (tag === 4) {
      const z = nestPlatz();
      await fliege([s, { x: (s.x + z.x) / 2, y: Math.min(s.y, z.y) - 40 }, { x: z.x + 34, y: z.y - 4 }, s], 2600);
      await I.sag(k, "Bis zu dir, Papa! Und zurück 🐣", 2600);
      await I.sag(f.m, "Ganz allein geflogen! 🥹", 2600);
    } else if (tag === 5) {
      const p = [s]; for (let i = 1; i <= 10; i++) { const w = Math.PI / 2 + (i / 10) * Math.PI * 2; p.push({ x: s.x + Math.cos(w) * 46, y: s.y - 50 + Math.sin(w) * 34 }); } p.push(s);
      await fliege(p, 3200);
      await I.sag(k, "Eine ganze Runde! 🐣", 2400);
      await I.sag(f.m, "Toni, hast du das gesehen? 🥹", 2600);
    } else if (tag === 6) {
      await fliege([s, { x: s.x - 60, y: s.y - 90 }, { x: s.x - 150, y: s.y - 120 }, { x: s.x - 200, y: s.y - 60 }, { x: s.x - 120, y: s.y - 30 }, s], 3600);
      await I.sag(k, "Juhuuu! 🪶", 2200);
      await I.sag(f.m, "Bald fliegst du schneller als ich 😄", 2800);
    } else {
      const m0 = { x: s.x - 40, y: s.y - 110 };
      const p = [s, { x: s.x - 20, y: s.y - 60 }];
      for (let i = 0; i <= 12; i++) { const w = Math.PI / 2 - (i / 12) * Math.PI * 2; p.push({ x: m0.x + Math.cos(w) * 50, y: m0.y + Math.sin(w) * 50 }); }
      p.push({ x: s.x - 10, y: s.y - 30 }, s);
      await fliege(p, 4200);
      const r = k.el.getBoundingClientRect();
      teilchen(r.left + r.width / 2, r.top, 14, ["♥️", "✨", "🎉"]);
      ton(880, 0.12); ton(1320, 0.16, "triangle", 0.04, 0.14);
      await I.sag(k, "Piep! Hast du das gesehen, Toni? 🐣", 2800);
      await I.sag(f.m, "Ein Looping! Unser kleiner Flieger 🥹", 3000);
    }
    familieLos(f);
    szene = false;
  }

  /* =========================================================
     2. TÜRCHEN-ERINNERUNG (1. bis 24.12.)
     ========================================================= */
  const heutigeTuer = () => { const t = dTag(); return t && t <= 24 ? document.querySelector('.tuer[data-tag="' + t + '"]') : null; };
  async function tuerErinnern() {
    const tuer = heutigeTuer();
    if (!tuer || tuer.classList.contains("offen") || !frei()) return;
    szene = true;
    merke("erinnert", dTag());
    const m = I.maennchen;
    if (imBild(tuer, 0.8)) {
      m.auftrag = true;
      const punkt = () => { const r = tuer.getBoundingClientRect(); return { x: r.left + r.width * 0.5, y: r.top + 4 }; };
      if (await I.holeHer(m, punkt)) {
        for (let i = 0; i < 3; i++) {
          await I.bild(m).animate([{ rotate: "0deg" }, { rotate: (m.blick < 0 ? -1 : 1) * 24 + "deg", offset: 0.4 }, { rotate: "0deg" }], { duration: 300 }).finished.catch(() => {});
          ton(1400, 0.05, "square", 0.025);
          tuer.animate([{ transform: "none" }, { transform: "rotate(-1.5deg)" }, { transform: "none" }], { duration: 200 });
        }
        await I.sag(m, wahl(["Psst, Toni … da wartet was auf dich 🎁", "Klopf, klopf! Dein Türchen von heute ist noch zu 🎁"]), 3600);
      }
      I.heimfliegen(m);
    } else {
      await I.sag(m, "Psst, Toni … dein Türchen von heute wartet noch auf dich 🎁", 3800);
    }
    szene = false;
  }
  // nach dem Öffnen: erst wenn die Karte wieder zu ist, sagt er etwas Liebes
  let warOffen = null;
  setInterval(() => {
    const tuer = heutigeTuer();
    if (!tuer || !intro.hidden) return;
    const offen = tuer.classList.contains("offen");
    if (warOffen === false && offen) {
      const t = dTag();
      const warte = setInterval(() => {
        if (document.querySelector("dialog[open]") || szene) return;
        clearInterval(warte);
        if (lies().gefreut === t) return;
        setTimeout(() => {
          if (ak.voegel.kommentiere && ak.voegel.kommentiere(wahl(["Wie schön, Toni! 🥰", "Oh, das ist ja süß ♥️", "Das hat Chris sich toll ausgedacht 🥹", "Ich freu mich so mit dir, Toni 🥰"]))) merke("gefreut", t);
        }, 1200);
      }, 600);
    }
    warOffen = offen;
  }, 700);

  /* =========================================================
     3. VOGELBÄUMCHEN (1. bis 24.12. mittags)
     ========================================================= */
  async function baumSchmuecken(tag) {
    if (!frei() || !I.kueken || !imBild(brett, 0.85)) return;
    szene = true;
    const stern = tag === 24;
    const f = await familieHolen(stern);
    const k = f.k;
    // das Küken holt die Kugel
    k.zustand = "fliegt"; k.el.classList.add("fliegt");
    const s = k.pos;
    await I.animiere(k, [s, { x: s.x + 30, y: s.y - 60 }, { x: W() + 60, y: Math.max(-30, s.y - 140) }], 1400);
    k.el.hidden = true; k.zustand = "weg";
    if (stern) await Promise.all([I.holeHer(f.m, aufBrett(0.08)), I.holeHer(f.w, aufBrett(0.3))]);
    else await I.holeHer(f.m, nestPlatz);
    await pause(900);
    const getragen = el("span", "vb-getragen", stern ? STERN_SVG : kugelSvg(KUGEL_FARBEN[(tag - 1) % KUGEL_FARBEN.length]));
    document.body.appendChild(getragen);
    let tragen = true;
    const mit = () => { if (!tragen) return; if (k.pos) { getragen.style.left = k.pos.x + "px"; getragen.style.top = k.pos.y + 2 + "px"; } requestAnimationFrame(mit); };
    k.pos = null;
    requestAnimationFrame(mit);
    const baumOben = () => { const r = baumEl.getBoundingClientRect(); return r.width ? { x: r.left + r.width * 0.5, y: r.top + r.height * 0.04 } : null; };
    const ueberBaum = () => { const r = baumEl.getBoundingClientRect(); return r.width ? { x: r.right + 18, y: r.top + r.height * 0.35 } : null; };
    await I.holeHer(k, stern ? baumOben : ueberBaum, 2200);
    // Toni tippt, wo die Kugel hängen soll (sonst nach 20 Sekunden selbst)
    brett.classList.add("baum-waehlen");
    I.sag(k, stern ? "Toni, tipp auf die Spitze. Der Stern kommt ganz nach oben ⭐" : "Toni, tipp aufs Bäumchen, wo meine Kugel hängen soll 🎄", 4200);
    let platz = await Promise.race([new Promise((r) => { baumWahl = r; }), pause(20000).then(() => null)]);
    baumWahl = null;
    brett.classList.remove("baum-waehlen");
    if (stern) platz = { x: 50, y: 7 };
    else if (!platz) platz = zufallsPlatz(tag);
    // hinfliegen und aufhängen
    const zr = baumEl.getBoundingClientRect();
    const ziel = () => { const r = baumEl.getBoundingClientRect(); return { x: r.left + (r.width * platz.x) / 100, y: r.top + (r.height * platz.y) / 100 - 4 }; };
    k.zustand = "fliegt"; k.el.classList.add("fliegt");
    await I.animiere(k, [k.pos, { x: (k.pos.x + ziel().x) / 2, y: Math.min(k.pos.y, ziel().y) - 24 }, ziel()], 1000, ziel);
    tragen = false; getragen.remove();
    const liste = kugeln().filter((x) => x.tag !== tag && !(stern && x.stern));
    liste.push(stern ? { tag: 24, stern: true } : { tag, x: platz.x, y: platz.y });
    merke("kugeln", liste);
    malBaum();
    ton(1500, 0.08); ton(2000, 0.1, "triangle", 0.035, 0.08);
    teilchen(zr.left + (zr.width * platz.x) / 100, zr.top + (zr.height * platz.y) / 100, stern ? 16 : 6, stern ? ["✨", "⭐", "♥️"] : ["✨"]);
    k.zustand = "sitzt"; k.el.classList.remove("fliegt");
    I.setzePosition(k, ueberBaum());
    k.folge = ueberBaum;
    I.hops(k);
    if (stern) {
      await I.sag(f.w, "Wie schön! Jetzt ist unser Bäumchen fertig 🥹", 3200);
      await I.sag(f.m, "Frohe Weihnachten, Toni 🎄", 2800);
    } else {
      const n = kugeln().filter((x) => !x.stern).length;
      await I.sag(k, n === 1 ? "Die erste Kugel! 🐣" : wahl(["Piep! Hängt schön, oder? 🎄", "Schon " + n + " Kugeln, Toni! 🎄", "Morgen bring ich die nächste 🐣"]), 2800);
    }
    familieLos(f);
    szene = false;
  }

  /* =========================================================
     4. PLÄTZCHEN KLAUEN (Wochenenden, mittags)
     ========================================================= */
  const PLAETZCHEN_SVG = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 2l2.3 4.6 5.1.7-3.7 3.6.9 5.1L10 13.6 5.4 16l.9-5.1L2.6 7.3l5.1-.7z" fill="#e8b15c" stroke="#b97a2c" stroke-width="1"/><circle cx="10" cy="9" r="1.4" fill="#d6304f"/></svg>';
  async function plaetzchen(wochenende) {
    const dose = document.querySelector(".backstube:not([hidden]) .dose");
    if (!frei() || !imBild(dose, 0.8)) return;
    szene = true;
    merke("plaetzchen", Object.assign({}, lies().plaetzchen, { [wochenende]: true }));
    const m = I.maennchen;
    m.auftrag = true;
    const oben = () => { const r = dose.getBoundingClientRect(); return { x: r.left + r.width * 0.5, y: r.top + r.height * 0.14 }; };
    if (!(await I.holeHer(m, oben))) { szene = false; I.heimfliegen(m); return; }
    const deckel = dose.querySelector(".dose-deckel");
    if (deckel) deckel.animate([{ transform: "none" }, { transform: "translate(-6px,-10px) rotate(-12deg)", offset: 0.4 }, { transform: "translate(-6px,-10px) rotate(-12deg)", offset: 0.7 }, { transform: "none" }], { duration: 1400, easing: "ease-in-out" });
    await pause(500);
    const keks = el("span", "vb-getragen keks", PLAETZCHEN_SVG);
    document.body.appendChild(keks);
    let tragen = true;
    const mit = () => { if (!tragen) return; if (m.seite) { const p = I.amVogel(m, 33, 37); keks.style.left = p.x - window.scrollX + "px"; keks.style.top = p.y - window.scrollY + "px"; } requestAnimationFrame(mit); };
    requestAnimationFrame(mit);
    await I.sag(m, "Psst … 🤫", 1600);
    // er schleicht davon, Toni kann ihn erwischen
    let erwischt = false;
    m.beimKlick = () => { erwischt = true; return true; };
    const s = oben(), richtung = s.x > W() / 2 ? -1 : 1;
    for (let i = 1; i <= 10 && !erwischt; i++) {
      m.blick = richtung;
      const z = { x: s.x + richtung * i * 12, y: s.y };
      m.folge = () => { const o = oben(); return { x: o.x + richtung * i * 12, y: o.y }; };
      I.setzePosition(m, z);
      I.bild(m).animate([{ translate: "0 0" }, { translate: "0 -5px", offset: 0.5 }, { translate: "0 0" }], { duration: 300 });
      await pause(620);
    }
    m.beimKlick = null;
    if (erwischt) {
      tragen = false;
      const r = keks.getBoundingClientRect();
      keks.animate([{ transform: "translate(-50%,-50%)" }, { transform: "translate(-50%,-50%) scale(1.6)", opacity: 0 }], { duration: 500, fill: "forwards" }).onfinish = () => keks.remove();
      teilchen(r.left + r.width / 2, r.top, 8, ["♥️", "🍪"]);
      await I.sag(m, "Ertappt! 😳 Ich wollte es dir bringen, ehrlich 🍪", 3400);
      await I.sag(m, "Hier, für dich, Toni ♥️", 2200);
      I.heimfliegen(m);
    } else {
      await I.sag(m, "Hihi, zu langsam, Toni! 😋", 2400);
      m.zustand = "fliegt"; m.el.classList.add("fliegt");
      const p = m.pos;
      await I.animiere(m, [p, { x: p.x + richtung * 40, y: p.y - 60 }, { x: richtung > 0 ? W() + 80 : -80, y: Math.max(-40, p.y - 180) }], 1600);
      tragen = false; keks.remove();
      m.el.hidden = true; m.zustand = "weg";
      await pause(3000);
      m.el.classList.add("satt");
      setTimeout(() => m.el.classList.remove("satt"), 120000);
      m.zustand = "sitzt"; I.setzePosition(m, { x: richtung > 0 ? W() + 60 : -60, y: 120 }); m.el.hidden = false;
      await I.heimfliegen(m);
      setTimeout(() => { if (ak.voegel.kommentiere) ak.voegel.kommentiere("Mmpf … war lecker 😋"); }, 1200);
    }
    szene = false;
  }

  /* =========================================================
     5. KERZEN AM ADVENTSKRANZ (2., 3. und 4. Advent abends)
     ========================================================= */
  const ADVENTE = { 6: 2, 13: 3, 20: 4 };
  async function kranzKerze(tag) {
    const kranz = document.getElementById("adventskranz");
    const nr = ADVENTE[tag] - 1;
    const kerze = kranz && kranz.querySelector('.kerze[data-nr="' + nr + '"]');
    if (!frei() || !I.kueken || !kerze || !imBild(kranz, 0.85)) return;
    szene = true;
    merke("kranz", Object.assign({}, lies().kranz, { [tag]: true }));
    kranz.classList.add("zuenden-" + nr);
    const f = await familieHolen(true), n = kName();
    const kr = () => kranz.getBoundingClientRect();
    const docht = () => { const r = kerze.getBoundingClientRect(); return { x: r.left + r.width * 0.5 + 16, y: r.top + 2 }; };
    await Promise.all([I.holeHer(f.m, () => ({ x: kr().left + kr().width * 0.1, y: kr().top + kr().height * 0.55 })), pause(300).then(() => I.holeHer(f.w, () => ({ x: kr().left + kr().width * 0.9, y: kr().top + kr().height * 0.55 }))), pause(600).then(() => I.holeHer(f.k, docht))]);
    f.m.blick = 1; f.w.blick = -1;
    await I.sag(f.w, ["Heute ist der 2. Advent! " + n + " darf die Kerze anzünden 🕯️", "Der 3. Advent! Und wieder ist " + n + " dran 🕯️", "Der 4. Advent! Die letzte Kerze, " + n + " 🕯️"][ADVENTE[tag] - 2], 3000);
    const zuenden = () => {
      kranz.classList.remove("zuenden-" + nr);
      const d = docht();
      teilchen(d.x - 16, d.y - 6, 8, ["✨"], 50);
      ton(1200, 0.1); ton(1600, 0.1, "triangle", 0.03, 0.1);
    };
    I.hops(f.k);
    await pause(600);
    zuenden();
    if (tag === 6) {
      await I.sag(f.k, "Huiii, ist die schön! 🥹", 2200);
      kranz.classList.add("zuenden-" + nr);
      ton(300, 0.2, "sine", 0.03);
      await I.sag(f.k, "Ups 🙈 Ich hab sie ausgepustet", 2400);
      await I.sag(f.m, "Nicht pusten, " + n + "! 😄 Noch mal", 2400);
      I.hops(f.k);
      await pause(500);
      zuenden();
      await I.sag(f.k, "Geschafft! 🕯️", 2200);
    } else if (tag === 13) {
      await I.sag(f.k, "Ganz allein! 🐣 Und ich hab nicht gepustet", 2800);
      await I.sag(f.m, "Wir sind so stolz auf dich 🥹", 2600);
    } else {
      await I.sag(f.k, "Alle vier brennen! 🕯️🕯️🕯️🕯️", 2600);
      await I.sag(f.w, "Bald ist Weihnachten, Toni 🎄", 2800);
    }
    familieLos(f);
    szene = false;
  }

  /* =========================================================
     6. NIKOLAUS (5. abends Stiefel, 6. morgens gefüllt)
     ========================================================= */
  // Den Satz im Stiefel hat Chris für Toni ausgesucht
  const NIKOLAUS_TEXT = "Für die süßeste Toni der Welt. Ich hab dich so lieb ♥️ Dein Chris";
  async function stiefelStellen() {
    if (!frei() || !I.kueken || !imBild(brett, 0.85)) return;
    szene = true;
    merke("stiefel", true);
    const f = await familieHolen(false), k = f.k;
    k.zustand = "fliegt"; k.el.classList.add("fliegt");
    const s = k.pos;
    await I.animiere(k, [s, { x: s.x + 30, y: s.y - 60 }, { x: W() + 60, y: Math.max(-30, s.y - 140) }], 1400);
    k.el.hidden = true; k.zustand = "weg";
    await I.holeHer(f.m, nestPlatz);
    await pause(900);
    const getragen = el("span", "vb-getragen stiefel", STIEFEL_SVG(false));
    document.body.appendChild(getragen);
    let tragen = true;
    const mit = () => { if (!tragen) return; if (k.pos) { getragen.style.left = k.pos.x + "px"; getragen.style.top = k.pos.y + 2 + "px"; } requestAnimationFrame(mit); };
    k.pos = null;
    requestAnimationFrame(mit);
    const platz = () => { const r = stiefelEl.getBoundingClientRect(); return r.width ? { x: r.left + r.width * 0.5, y: r.top - 30 } : null; };
    await I.holeHer(k, platz, 2200);
    tragen = false; getragen.remove();
    stiefelZuletzt = ""; malStiefel();
    I.hops(k);
    await I.sag(k, "Für den Nikolaus 🥾", 2400);
    await I.sag(f.m, "Ob er heute Nacht vorbeikommt? 🤭", 2800);
    familieLos(f);
    szene = false;
  }
  function nikolausGetippt() {
    const t = dTag();
    if (!(t === 6 || t === 7)) { if (ak.wartezeit && ak.wartezeit.blase) ak.wartezeit.blase(stiefelEl, "Noch leer … mal sehen, was heute Nacht passiert 🤭", 2600); return; }
    merke("nikolausGesehen", true);
    stiefelZuletzt = ""; malStiefel();
    const b = el("div", "munkel-buehne dez-buehne gedimmt", '<div class="munkel-dimmer"></div><button type="button" class="munkel-zu" aria-label="Schließen">✕</button>' +
      '<div class="munkel-karte dez-karte"><div class="dez-stiefel-gross">' + STIEFEL_SVG(true) + '</div><h3>Der Nikolaus war da! 🎅</h3><p>Im Stiefel: ein Schokonikolaus, eine Zuckerstange und ein kleiner Zettel</p>' +
      '<p class="dez-zettel">' + NIKOLAUS_TEXT + '</p><div class="munkel-knoepfe"><button type="button" class="munkel-knopf" data-wahl="zu">Danke, Nikolaus ♥️</button></div></div>');
    document.body.appendChild(b);
    requestAnimationFrame(() => b.classList.add("da"));
    const r = stiefelEl.getBoundingClientRect();
    teilchen(r.left + r.width / 2, r.top, 10, ["✨", "♥️", "⭐"]);
    const zu = () => { b.classList.add("vorbei"); setTimeout(() => b.remove(), 450); };
    b.querySelector(".munkel-zu").addEventListener("click", zu);
    b.querySelector("[data-wahl]").addEventListener("click", zu);
  }

  /* =========================================================
     7. JAHRESTAG (21.12.): Fotos ansehen, dann ein Herz fliegen
     ========================================================= */
  async function jahrestag() {
    if (!frei() || !I.weibchen) return;
    szene = true;
    merke("jahrestag", true);
    const f = await familieHolen(true);
    const fotos = (() => { try { const l = JSON.parse(localStorage.getItem("toni-wz-fotos") || "[]"); return Array.isArray(l) ? l : []; } catch (_) { return []; } })();
    const mitte = () => ({ x: W() / 2, y: Math.max(140, H() * 0.42) });
    // erst kommen beide ins Bild
    await Promise.all([I.holeHer(f.m, () => ({ x: mitte().x - 34, y: mitte().y - 30 })), pause(300).then(() => I.holeHer(f.w, () => ({ x: mitte().x + 34, y: mitte().y - 30 })))]);
    f.m.blick = 1; f.w.blick = -1;
    if (fotos.length && ak.munkelspiele && ak.munkelspiele.album) {
      await I.sag(f.w, "Heute vor einem Jahr ♥️ Toni, guck mal, was wir alles erlebt haben 🥹", 3600);
      ak.munkelspiele.album();
      // Toni schaut die Fotos an; schließt sie das Album nicht, macht es nach einer Minute von selbst zu
      for (let i = 0; i < 200 && document.querySelector(".munkel-buehne:not(.vorbei)"); i++) await pause(300);
      const offen = document.querySelector(".foto-buehne.album:not(.vorbei) [data-wahl]");
      if (offen) offen.click();
      await pause(600);
    } else await I.sag(f.w, "Heute vor einem Jahr ♥️ Dafür fliegen wir dir was 🥹", 3200);
    // ein Herz in die Luft fliegen: er links herum, sie rechts herum
    const s = 6.2, c = mitte();
    const punkt = (t) => ({ x: c.x + 16 * Math.pow(Math.sin(t), 3) * s, y: c.y - (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * s });
    const bahn = (vz) => { const p = []; for (let i = 0; i <= 24; i++) p.push(punkt((vz * i * Math.PI) / 24)); return p; };
    await Promise.all([I.holeHer(f.m, () => punkt(0)), I.holeHer(f.w, () => punkt(0.0001))]);
    let spur = true;
    const spurTimer = setInterval(() => { if (!spur) return; [f.m, f.w].forEach((v) => { if (v.pos) teilchen(v.pos.x, v.pos.y - 20, 1, ["✨", "♥️"], 10); }); }, 160);
    [f.m, f.w].forEach((v) => { v.zustand = "fliegt"; v.el.classList.add("fliegt"); });
    await Promise.all([I.animiere(f.m, bahn(-1), 3800), I.animiere(f.w, bahn(1), 3800)]);
    spur = false; clearInterval(spurTimer);
    const tief = punkt(Math.PI);
    [f.m, f.w].forEach((v, i) => { v.zustand = "sitzt"; v.el.classList.remove("fliegt"); v.folge = null; I.setzePosition(v, { x: tief.x + (i ? 22 : -22), y: tief.y + 30 }); I.hops(v); });
    f.m.blick = 1; f.w.blick = -1;
    teilchen(c.x, c.y - 20, 18, ["♥️", "✨"], 160);
    ton(660, 0.12); ton(880, 0.14, "triangle", 0.04, 0.14); ton(1320, 0.2, "triangle", 0.04, 0.3);
    await I.sag(f.w, "Ein Jahr, Toni ♥️", 2800);
    await I.sag(f.m, "Danke für jeden einzelnen Tag ♥️", 3000);
    familieLos(f);
    szene = false;
  }

  /* =========================================================
     8. HEILIGABEND (24.12. abends): Ständchen mit Mützen
     ========================================================= */
  // Stille Nacht, die ersten Takte (Frequenz, Dauer in Achteln)
  const G4 = 392, A4 = 440, E4 = 330, D5 = 587, B4 = 494, C5 = 523;
  const MELODIE = [[G4, 3], [A4, 1], [G4, 2], [E4, 6], [G4, 3], [A4, 1], [G4, 2], [E4, 6], [D5, 4], [D5, 2], [B4, 6], [C5, 4], [C5, 2], [G4, 6]];
  function spieleMelodie() {
    let t = 0;
    const achtel = 0.27;
    for (const [f, d] of MELODIE) { ton(f * 2, d * achtel * 0.9, "triangle", 0.035, t); t += d * achtel; }
    return t;
  }
  async function heiligabend() {
    if (!frei() || !imBild(brett, 0.85)) return;
    szene = true;
    merke("heiligabend", true);
    const f = await familieHolen(true);
    await Promise.all([I.holeHer(f.m, aufBrett(0.56)), pause(250).then(() => I.holeHer(f.w, aufBrett(0.84))), f.k ? pause(500).then(() => I.holeHer(f.k, aufBrett(0.7))) : null]);
    f.m.blick = 1; f.w.blick = -1;
    [f.m, f.w, f.k].forEach((v) => { if (v) { I.hut(v, true, "weihnacht"); I.hops(v); } });
    await I.sag(f.w, "Toni, wir haben ein Lied für dich geübt 🎶", 2800);
    const dauer = spieleMelodie();
    const zeilen = [[f.w, "♪ Stille Nacht, heilige Nacht ♪"], [f.m, "♪ Alles schläft, einsam wacht ♪"], [f.k || f.m, f.k ? "♪ Piep piep, piep piep piep ♪" : "♪ Nur das traute, hochheilige Paar ♪"]];
    for (const [v, z] of zeilen) { I.hops(v); await I.sag(v, z, Math.max(2600, (dauer * 1000) / zeilen.length)); }
    const r = brett.getBoundingClientRect();
    teilchen(r.left + r.width / 2, r.top, 18, ["✨", "⭐", "♥️", "❄️"], 200);
    await I.sag(f.m, "Frohe Weihnachten, Toni! 🎄", 3000);
    await I.sag(f.w, "Wir haben dich so lieb ♥️", 2800);
    if (f.k) await I.sag(f.k, "Piep! ♥️", 1800);
    familieLos(f);
    szene = false;
  }

  /* =========================================================
     9. SILVESTER: mitzählen beim Countdown
     ========================================================= */
  let silvester = false;
  async function silvesterParty() {
    silvester = true;
    for (let i = 0; i < 50 && (I.maennchen.auftrag || szene); i++) await pause(400);
    szene = true;
    document.documentElement.classList.add("voegel-vorne");
    const f = await familieHolen(true);
    const unten = (dx) => () => ({ x: W() / 2 + dx, y: H() - 70 });
    await Promise.all([I.holeHer(f.m, unten(-56)), pause(250).then(() => I.holeHer(f.w, unten(56))), f.k ? pause(500).then(() => I.holeHer(f.k, unten(0))) : null]);
    f.m.blick = 1; f.w.blick = -1;
    [f.m, f.w, f.k].forEach((v) => { if (v) I.hut(v, true); });
    const sek = () => { const d = datum(); return d.monat === 12 && d.stunde === 23 && d.minute === 59 ? d.sekunde : d.monat === 12 ? -1 : 60; };
    if (sek() < 40) await I.sag(f.w, "Toni! Gleich ist das Jahr vorbei 🥳", 3000);
    while (sek() < 50) await pause(200);
    let letzte = -1;
    const reihe = [f.m, f.w, f.k || f.m];
    while (sek() < 60) {
      const s = sek();
      if (s >= 50 && s !== letzte) {
        letzte = s;
        const v = reihe[s % reihe.length];
        reihe.forEach((x) => { if (x !== v) I.still(x); });
        I.zeigeBlase(v, String(60 - s) + "!"); v.nachholen = null;
        I.hops(v);
      }
      await pause(120);
    }
    reihe.forEach((x) => I.still(x));
    await pause(300);
    I.zeigeBlase(f.m, "Frohes neues Jahr, Toni! 🎆"); f.m.nachholen = null;
    [f.m, f.w, f.k].forEach((v) => { if (v) I.hops(v); });
    await pause(3400);
    I.still(f.m);
    await I.sag(f.w, "Auf ein wunderschönes Jahr mit dir ♥️", 3200);
    if (f.k) await I.sag(f.k, "Piep! Mein erstes Silvester 🐣", 2600);
    familieLos(f);
    szene = false;
    // die Vögel bleiben über dem Feuerwerk, bis es vorbei ist
    const weg = setInterval(() => { if (!document.querySelector(".neujahr, .neujahr-countdown")) { clearInterval(weg); document.documentElement.classList.remove("voegel-vorne"); } }, 1000);
    setTimeout(() => [f.m, f.w, f.k].forEach((v) => { if (v) I.hut(v, false); }), 10 * 60000);
  }
  setInterval(() => {
    if (silvester || !ak.intro.bereit() || reise()) return;
    const d = datum();
    if (d.jahr === KALENDER.jahr && d.monat === 12 && d.tag === 31 && d.stunde === 23 && d.minute === 59 && d.sekunde < 45 && intro.hidden && I.maennchen.pos) silvesterParty();
  }, 400);

  /* =========================================================
     Anfragen: alles läuft über die Warteschlange der Munkelvögel,
     nie zwei Dinge auf einmal (Reihenfolge = prio)
     ========================================================= */
  if (ak.voegel.registriere) {
    const s = () => lies();
    ak.voegel.registriere({ art: "dez-nikolaus", vogel: "m", prio: 11, ohneFrage: true, ueberall: true, frage: () => "",
      aktiv: () => dTag() === 5 && stunde() >= 17 && !s().stiefel && frei() && !!I.kueken && imBild(brett, 0.85), ja: () => stiefelStellen() });
    ak.voegel.registriere({ art: "dez-jahrestag", vogel: "m", prio: 11.5, ohneFrage: true, ueberall: true, frage: () => "",
      aktiv: () => dTag() === 21 && stunde() >= 8 && !s().jahrestag && frei() && !!I.weibchen && I.weibchen.zustand === "sitzt", ja: () => jahrestag() });
    ak.voegel.registriere({ art: "dez-heiligabend", vogel: "m", prio: 12, ohneFrage: true, ueberall: true, frage: () => "",
      aktiv: () => dTag() === 24 && stunde() >= 16 && !s().heiligabend && frei() && imBild(brett, 0.85), ja: () => heiligabend() });
    ak.voegel.registriere({ art: "dez-kranz", vogel: "m", prio: 12.5, ohneFrage: true, ueberall: true, frage: () => "",
      aktiv: () => !!ADVENTE[dTag()] && stunde() >= 16 && !(s().kranz || {})[dTag()] && frei() && !!I.kueken, ja: () => kranzKerze(dTag()) });
    ak.voegel.registriere({ art: "dez-flugschule", vogel: "m", prio: 13, ohneFrage: true, ueberall: true, frage: () => "",
      aktiv: () => dTag() >= 1 && dTag() <= 7 && stunde() >= 5 && stunde() < 13 && !(s().flugschule || {})[dTag()] && frei() && !!I.kueken && I.kueken.zustand === "sitzt" && imBild(brett, 0.85), ja: () => flugschule(dTag()) });
    ak.voegel.registriere({ art: "dez-tuer", vogel: "m", prio: 14, ohneFrage: true, ueberall: true, frage: () => "",
      aktiv: () => { const t = heutigeTuer(); return !!t && !t.classList.contains("offen") && s().erinnert !== dTag() && frei(); }, ja: () => tuerErinnern() });
    ak.voegel.registriere({ art: "dez-baum", vogel: "m", prio: 15, ohneFrage: true, ueberall: true, frage: () => "",
      aktiv: () => { const t = dTag(); return t >= 1 && t <= 24 && stunde() >= 11 && stunde() < 22 && !kugeln().some((k) => (t === 24 ? k.stern : k.tag === t && !k.stern)) && frei() && !!I.kueken && I.kueken.zustand === "sitzt" && imBild(brett, 0.85); }, ja: () => baumSchmuecken(dTag()) });
    ak.voegel.registriere({ art: "dez-plaetzchen", vogel: "m", prio: 16, ohneFrage: true, ueberall: true, frage: () => "",
      aktiv: () => { const t = dTag(), we = [5, 6].includes(t) ? 5 : [12, 13].includes(t) ? 12 : [19, 20].includes(t) ? 19 : 0; return !!we && stunde() >= 11 && stunde() < 18 && !(s().plaetzchen || {})[we] && frei() && imBild(document.querySelector(".backstube:not([hidden]) .dose"), 0.8); },
      ja: () => { const t = dTag(); plaetzchen([5, 6].includes(t) ? 5 : [12, 13].includes(t) ? 12 : 19); } });
  }

  window.adventkalender.dezember = {
    schlafen: () => !!(brett && !brett.hidden && nachts()),
    platz: () => (brett && !brett.hidden && imBild(nestEl, 0.6) ? nestPlatz() : null),
    // zum Testen und für die Entdeckungen
    _zustand: () => ({ frei: frei(), kueken: !!I.kueken, kz: I.kueken && I.kueken.zustand, brett: imBild(brett, 0.85), szene, ruhig: kalenderRuhig(), nachts: nachts(), pos: !!I.maennchen.pos, auftrag: !!I.maennchen.auftrag, kugeln: kugeln().length }),
    flugschule, tuerErinnern, baumSchmuecken, plaetzchen, kranzKerze, stiefelStellen, jahrestag, heiligabend, silvesterParty, geschichte,
  };
})();
