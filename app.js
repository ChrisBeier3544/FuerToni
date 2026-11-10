(function () {
  "use strict";

  const ZEITZONE = "Europe/Berlin";
  const SPEICHER_SCHLUESSEL = "toni-advent-geoeffnet-" + KALENDER.jahr;
  const bewegungReduziert = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const el = {
    titel: document.getElementById("titel"),
    untertitel: document.getElementById("untertitel"),
    status: document.getElementById("status"),
    kalender: document.getElementById("kalender"),
    toast: document.getElementById("toast"),
    dialog: document.getElementById("dialog"),
    dialogTag: document.getElementById("dialog-tag"),
    dialogTitel: document.getElementById("dialog-titel"),
    dialogBild: document.getElementById("dialog-bild"),
    dialogText: document.getElementById("dialog-text"),
    dialogHinweis: document.getElementById("dialog-hinweis"),
    dialogHinweisText: document.getElementById("dialog-hinweis-text"),
    dialogBrief: document.getElementById("dialog-brief"),
    dialogBriefZahl: document.getElementById("dialog-brief-zahl"),
    dialogPaeckchen: document.getElementById("dialog-paeckchen"),
    dialogPaeckchenZahl: document.getElementById("dialog-paeckchen-zahl"),
    regen: document.getElementById("konfetti-regen"),
  };

  /* ------------------------------------------------------------
   * Zeit
   * Die Uhrzeit wird – wenn möglich – vom Webserver geholt
   * (HTTP-"Date"-Header). So bringt es nichts, die Uhr am
   * Handy oder Laptop vorzustellen. Nur wenn der Server nicht
   * erreichbar ist (offline), wird die Geräteuhr verwendet.
   * ------------------------------------------------------------ */
  let basisMs = Date.now();
  let basisPerf = performance.now();
  let zeitBereit = false;

  function jetzt() {
    return basisMs + (performance.now() - basisPerf);
  }

  function istLokaleVorschau() {
    const h = location.hostname;
    return location.protocol === "file:" || h === "localhost" || h === "127.0.0.1" || h === "";
  }

  // Nur lokal zum Testen: index.html?testdatum=2026-12-05
  function testdatum() {
    if (!istLokaleVorschau()) return null;
    const wert = new URLSearchParams(location.search).get("testdatum");
    const m = wert && /^(\d{4})-(\d{2})-(\d{2})$/.exec(wert);
    if (!m) return null;
    // 11:00 UTC = 12:00 Uhr deutsche Winterzeit
    return Date.UTC(+m[1], +m[2] - 1, +m[3], 11, 0, 0);
  }

  async function holeServerzeit() {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 4000);
      const antwort = await fetch(location.href.split("#")[0], {
        method: "HEAD",
        cache: "no-store",
        signal: controller.signal,
      });
      clearTimeout(timer);
      const datum = antwort.headers.get("Date");
      const ms = datum ? Date.parse(datum) : NaN;
      return Number.isNaN(ms) ? null : ms;
    } catch (_) {
      return null;
    }
  }

  async function synchronisiereZeit() {
    const test = testdatum();
    if (test !== null) {
      basisMs = test;
      basisPerf = performance.now();
      return;
    }
    const server = await holeServerzeit();
    if (server !== null) {
      basisMs = server;
      basisPerf = performance.now();
    } else if (!zeitBereit) {
      basisMs = Date.now();
      basisPerf = performance.now();
    }
  }

  const datumsFormat = new Intl.DateTimeFormat("de-DE", {
    timeZone: ZEITZONE,
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hourCycle: "h23",
  });

  function berlinDatum(ms) {
    const teile = {};
    for (const t of datumsFormat.formatToParts(new Date(ms))) teile[t.type] = t.value;
    return {
      jahr: +teile.year,
      monat: +teile.month,
      tag: +teile.day,
      stunde: +teile.hour,
      minute: +teile.minute,
      sekunde: +teile.second,
    };
  }

  // Ist Türchen n (1–24) zu diesem Zeitpunkt schon offen?
  function istVerfuegbar(n, d) {
    if (d.jahr > KALENDER.jahr) return true;
    if (d.jahr < KALENDER.jahr) return false;
    return d.monat === 12 && d.tag >= n;
  }

  // Tage zwischen dem heutigen Datum (Berlin) und dem n. Dezember
  function tageBis(n, d) {
    const heute = Date.UTC(d.jahr, d.monat - 1, d.tag);
    const ziel = Date.UTC(KALENDER.jahr, 11, n);
    return Math.round((ziel - heute) / 86400000);
  }

  /* ------------------------------------------------------------
   * Speicher (welche Türchen wurden schon geöffnet?)
   * ------------------------------------------------------------ */
  function ladeGeoeffnet() {
    try {
      const roh = localStorage.getItem(SPEICHER_SCHLUESSEL);
      const liste = roh ? JSON.parse(roh) : [];
      return new Set(Array.isArray(liste) ? liste : []);
    } catch (_) {
      return new Set();
    }
  }
  function speichereGeoeffnet(menge) {
    try {
      localStorage.setItem(SPEICHER_SCHLUESSEL, JSON.stringify([...menge]));
    } catch (_) { /* egal – dann eben ohne Merken */ }
  }
  const geoeffnet = ladeGeoeffnet();

  /* ------------------------------------------------------------
   * Durcheinander, aber immer gleiche Reihenfolge
   * ------------------------------------------------------------ */
  function zufall(seed) {
    return function () {
      seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function gemischteTage() {
    const tage = Array.from({ length: 24 }, (_, i) => i + 1);
    const rnd = zufall(2412);
    for (let i = tage.length - 1; i > 0; i--) {
      const j = Math.floor(rnd() * (i + 1));
      [tage[i], tage[j]] = [tage[j], tage[i]];
    }
    return tage;
  }

  /* ------------------------------------------------------------
   * Aufbau
   * ------------------------------------------------------------ */
  const tueren = new Map();

  function inhalt(n) {
    return (KALENDER.tage && KALENDER.tage[n]) || {};
  }

  function baueKalender() {
    el.titel.textContent = KALENDER.titel || "Adventskalender";
    document.title = KALENDER.titel || "Adventskalender";
    el.untertitel.textContent = KALENDER.untertitel || "";

    for (const n of gemischteTage()) {
      const knopf = document.createElement("button");
      knopf.type = "button";
      knopf.className = "tuer gesperrt";
      knopf.dataset.tag = String(n);

      const innen = document.createElement("span");
      innen.className = "tuer-innen";
      innen.setAttribute("aria-hidden", "true");

      const blatt = document.createElement("span");
      blatt.className = "tuer-blatt";
      const nummer = document.createElement("span");
      nummer.className = "nummer";
      nummer.textContent = String(n);
      const schloss = document.createElement("span");
      schloss.className = "schloss";
      schloss.textContent = "🔒";
      blatt.append(nummer, schloss);

      knopf.append(innen, blatt);
      knopf.addEventListener("click", () => klickAufTuer(n));
      el.kalender.appendChild(knopf);
      tueren.set(n, { knopf, innen, schloss });
    }
  }

  function fuelleInnenraum(n) {
    const t = tueren.get(n);
    if (t.innen.childElementCount) return;
    const bild = inhalt(n).bild;
    if (bild) {
      const img = document.createElement("img");
      img.src = bild;
      img.alt = "";
      img.loading = "lazy";
      img.onerror = () => { img.remove(); fuelleHerz(t.innen); };
      t.innen.appendChild(img);
    } else {
      fuelleHerz(t.innen);
    }
  }
  function fuelleHerz(container) {
    const herz = document.createElement("span");
    herz.className = "innen-herz";
    herz.textContent = "❤️";
    container.appendChild(herz);
  }

  function aktualisiere() {
    const d = berlinDatum(jetzt());
    for (const [n, t] of tueren) {
      const frei = zeitBereit && istVerfuegbar(n, d);
      const istOffen = frei && geoeffnet.has(n);
      const istHeute = frei && d.jahr === KALENDER.jahr && d.monat === 12 && d.tag === n;

      t.knopf.classList.toggle("gesperrt", !frei);
      t.knopf.classList.toggle("verfuegbar", frei);
      t.knopf.classList.toggle("offen", istOffen);
      t.knopf.classList.toggle("heute", istHeute);
      t.schloss.hidden = frei;
      if (istOffen) fuelleInnenraum(n);

      let label = "Türchen " + n;
      if (!frei) label += ", noch verschlossen";
      else if (istOffen) label += ", schon geöffnet";
      else label += ", kann geöffnet werden";
      t.knopf.setAttribute("aria-label", label);
    }
    aktualisiereStatus(d);
  }

  function aktualisiereStatus(d) {
    if (!zeitBereit) { el.status.textContent = "Einen Moment …"; return; }

    if (d.jahr > KALENDER.jahr || (d.jahr === KALENDER.jahr && d.monat === 12 && d.tag > 24)) {
      el.status.textContent = "Frohe Weihnachten, mein Schatz 🎄❤️";
      return;
    }
    if (d.jahr === KALENDER.jahr && d.monat === 12) {
      if (inhalt(d.tag).status) el.status.textContent = inhalt(d.tag).status;
      else if (d.tag === 24) el.status.textContent = "Heute ist Heiligabend – das letzte Türchen wartet ✨";
      else if (!geoeffnet.has(d.tag)) el.status.textContent = "Heute darfst du Türchen " + d.tag + " öffnen ✨";
      else el.status.textContent = "Morgen wartet Türchen " + (d.tag + 1) + " auf dich 💕";
      return;
    }
    const tage = tageBis(1, d);
    el.status.textContent = tage === 1
      ? "Morgen geht's los! 💕"
      : "Noch " + tage + " Tage bis zum ersten Türchen 💕";
  }

  /* ------------------------------------------------------------
   * Interaktion
   * ------------------------------------------------------------ */
  let toastTimer;
  function zeigeToast(text) {
    el.toast.textContent = text;
    el.toast.classList.add("sichtbar");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.toast.classList.remove("sichtbar"), 3200);
  }

  function gesperrtNachricht(n, d) {
    const tage = tageBis(n, d);
    if (tage === 1) {
      const rest = 86400 - (d.stunde * 3600 + d.minute * 60 + d.sekunde);
      const std = Math.floor(rest / 3600);
      const min = Math.floor((rest % 3600) / 60);
      return "Nicht schummeln 😘 Türchen " + n + " öffnet sich in " + std + " Std. " + min + " Min.";
    }
    const spruch = ["Geduld, mein Schatz 💕", "Nicht schummeln 😘", "Noch nicht! ❤️", "Na na na 🙈"][n % 4];
    return spruch + " Türchen " + n + " öffnet sich erst am " + n + ". Dezember – noch " + tage + " Tage.";
  }

  function klickAufTuer(n) {
    const t = tueren.get(n);
    if (!zeitBereit) return;
    const d = berlinDatum(jetzt());

    if (!istVerfuegbar(n, d)) {
      t.knopf.classList.remove("wackeln");
      void t.knopf.offsetWidth; // Animation neu starten
      t.knopf.classList.add("wackeln");
      zeigeToast(gesperrtNachricht(n, d));
      return;
    }

    if (geoeffnet.has(n)) {
      zeigeInhalt(n);
      return;
    }

    geoeffnet.add(n);
    speichereGeoeffnet(geoeffnet);
    fuelleInnenraum(n);
    t.knopf.classList.add("offen");
    herzKonfetti(t.knopf);
    aktualisiere();
    setTimeout(() => zeigeInhalt(n), bewegungReduziert ? 0 : 750);
  }

  function zeigeInhalt(n) {
    // Sicherheitsnetz: Inhalt nur zeigen, wenn der Tag wirklich erreicht ist
    if (!istVerfuegbar(n, berlinDatum(jetzt()))) return;

    const i = inhalt(n);
    el.dialogTag.textContent = n + ". Dezember";
    el.dialogTitel.textContent = i.titel || "Türchen " + n;
    el.dialogText.textContent = i.text || "";

    if (i.bild) {
      el.dialogBild.hidden = false;
      el.dialogBild.onerror = () => { el.dialogBild.hidden = true; };
      el.dialogBild.src = i.bild;
    } else {
      el.dialogBild.hidden = true;
      el.dialogBild.removeAttribute("src");
    }

    const hat = (w) => w !== undefined && w !== null && w !== "";
    el.dialogBrief.hidden = !hat(i.briefzahl);
    el.dialogBriefZahl.textContent = hat(i.briefzahl) ? String(i.briefzahl) : "";
    el.dialogPaeckchen.hidden = !hat(i.paeckchen);
    el.dialogPaeckchenZahl.textContent = hat(i.paeckchen) ? "Nr. " + i.paeckchen : "";

    el.dialogHinweis.hidden = !i.hinweis;
    el.dialogHinweisText.textContent = i.hinweis || "";

    if (typeof el.dialog.showModal === "function") el.dialog.showModal();
    else el.dialog.setAttribute("open", "");

    if (i.konfetti) konfettiRegen();
  }

  function schliesseDialog() {
    if (typeof el.dialog.close === "function") el.dialog.close();
    else el.dialog.removeAttribute("open");
  }

  el.dialog.querySelector(".schliessen").addEventListener("click", schliesseDialog);
  el.dialog.addEventListener("click", (e) => { if (e.target === el.dialog) schliesseDialog(); });

  function herzKonfetti(ziel) {
    if (bewegungReduziert) return;
    const r = ziel.getBoundingClientRect();
    const x = r.left + r.width / 2;
    const y = r.top + r.height / 2;
    const zeichen = ["❤️", "💕", "💖", "✨", "💗"];
    for (let k = 0; k < 14; k++) {
      const s = document.createElement("span");
      s.className = "konfetti";
      s.textContent = zeichen[k % zeichen.length];
      const winkel = (Math.PI * 2 * k) / 14 + Math.random() * 0.4;
      const weite = 60 + Math.random() * 70;
      s.style.left = x + "px";
      s.style.top = y + "px";
      s.style.setProperty("--dx", Math.cos(winkel) * weite + "px");
      s.style.setProperty("--dy", Math.sin(winkel) * weite + "px");
      document.body.appendChild(s);
      setTimeout(() => s.remove(), 1200);
    }
  }

  /* Konfetti, das über die ganze Seite regnet (Geburtstage) */
  let regenLaeuft = false;
  function konfettiRegen() {
    if (regenLaeuft) return;
    regenLaeuft = true;
    const canvas = el.regen;
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const breite = window.innerWidth;
    const hoehe = window.innerHeight;
    canvas.width = breite * dpr;
    canvas.height = hoehe * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Über den geöffneten Dialog legen (Top-Layer), sonst einfach über die Seite
    let alsPopover = false;
    if (typeof canvas.showPopover === "function") {
      try { canvas.showPopover(); alsPopover = true; } catch (_) { /* ignorieren */ }
    }
    if (!alsPopover) canvas.classList.add("aktiv");

    const farben = ["#e85d7e", "#f7809b", "#9d2449", "#d4a84b", "#f3dc9f", "#ffffff", "#7cc4f0", "#9be3b0"];
    const anzahl = bewegungReduziert ? 60 : breite < 600 ? 140 : 220;
    const teile = [];
    for (let k = 0; k < anzahl; k++) {
      teile.push({
        x: Math.random() * breite,
        y: -20 - Math.random() * hoehe * 0.8,
        w: 6 + Math.random() * 6,
        h: 8 + Math.random() * 8,
        vx: -1.5 + Math.random() * 3,
        vy: 2 + Math.random() * 3,
        dreh: Math.random() * Math.PI,
        vdreh: -0.15 + Math.random() * 0.3,
        wackel: Math.random() * Math.PI * 2,
        farbe: farben[k % farben.length],
        rund: Math.random() < 0.3,
      });
    }

    const dauer = 5000;
    const start = performance.now();
    function schritt(t) {
      const vergangen = t - start;
      ctx.clearRect(0, 0, breite, hoehe);
      let sichtbar = 0;
      for (const p of teile) {
        p.wackel += 0.05;
        p.x += p.vx + Math.sin(p.wackel) * 0.8;
        p.y += p.vy;
        p.dreh += p.vdreh;
        if (p.y < hoehe + 20) sichtbar++;
        if (vergangen < dauer - 1500 && p.y > hoehe + 20) p.y = -20; // nachrieseln
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.dreh);
        ctx.fillStyle = p.farbe;
        if (p.rund) {
          ctx.beginPath();
          ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h * Math.abs(Math.cos(p.wackel)));
        }
        ctx.restore();
      }
      if (sichtbar > 0 && vergangen < dauer + 4000) {
        requestAnimationFrame(schritt);
      } else {
        ctx.clearRect(0, 0, breite, hoehe);
        if (alsPopover) { try { canvas.hidePopover(); } catch (_) { /* ignorieren */ } }
        canvas.classList.remove("aktiv");
        regenLaeuft = false;
      }
    }
    requestAnimationFrame(schritt);
  }

  function baueHerzen() {
    if (bewegungReduziert) return;
    const box = document.querySelector(".herzen");
    const anzahl = window.innerWidth < 600 ? 10 : 18;
    for (let k = 0; k < anzahl; k++) {
      const s = document.createElement("span");
      s.textContent = k % 3 === 0 ? "♡" : "♥";
      s.style.left = Math.random() * 100 + "%";
      s.style.fontSize = 10 + Math.random() * 18 + "px";
      s.style.animationDuration = 12 + Math.random() * 14 + "s";
      s.style.animationDelay = -Math.random() * 20 + "s";
      box.appendChild(s);
    }
  }

  /* ------------------------------------------------------------
   * Start
   * ------------------------------------------------------------ */
  baueKalender();
  baueHerzen();
  aktualisiere();

  synchronisiereZeit().then(() => {
    zeitBereit = true;
    aktualisiere();
  });

  // Regelmäßig prüfen, damit um Mitternacht das neue Türchen aufgeht
  setInterval(aktualisiere, 20000);

  // Nach dem Aufwecken des Handys die Zeit neu holen
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") synchronisiereZeit().then(aktualisiere);
  });
})();
