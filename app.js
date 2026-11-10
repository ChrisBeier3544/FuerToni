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
    herz.textContent = "♥️";
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
    aktualisiereEier(d);
  }

  function aktualisiereStatus(d) {
    if (!zeitBereit) { el.status.textContent = "Einen Moment …"; return; }

    if (d.jahr > KALENDER.jahr || (d.jahr === KALENDER.jahr && d.monat === 12 && d.tag > 24)) {
      el.status.textContent = "Frohe Weihnachten, mein Schatz 🎄♥️";
      return;
    }
    if (d.jahr === KALENDER.jahr && d.monat === 12) {
      if (inhalt(d.tag).status) el.status.textContent = inhalt(d.tag).status;
      else if (d.tag === 24) el.status.textContent = "Heute ist Heiligabend. Das letzte Türchen wartet auf dich ✨";
      else if (!geoeffnet.has(d.tag)) el.status.textContent = "Heute darfst du Türchen " + d.tag + " öffnen ✨";
      else el.status.textContent = "Morgen wartet Türchen " + (d.tag + 1) + " auf dich ♥️";
      return;
    }
    const tage = tageBis(1, d);
    el.status.textContent = tage === 1
      ? "Morgen geht's los! ♥️"
      : "Noch " + tage + " Tage bis zum ersten Türchen ♥️";
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
    const spruch = ["Geduld, mein Schatz ♥️", "Nicht schummeln 😘", "Die Capys bewachen dieses Türchen noch 🔒", "Na na na 🙈"][n % 4];
    return spruch + " Türchen " + n + " öffnet sich erst am " + n + ". Dezember. Noch " + tage + " Tage ♥️";
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

    if (i.geschenkregen) konfettiRegen("geschenke");
    else if (i.konfetti) konfettiRegen("konfetti");
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
    const zeichen = ["♥️", "♥️", "✨", "♥️", "✨"];
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

  /* Konfetti (Geburtstage) oder langsam fallende Geschenke (Heiligabend),
     die über die ganze Seite regnen */
  let regenLaeuft = false;
  function konfettiRegen(art) {
    const geschenke = art === "geschenke";
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
    const anzahl = geschenke
      ? (bewegungReduziert ? 12 : breite < 600 ? 22 : 34)
      : (bewegungReduziert ? 60 : breite < 600 ? 140 : 220);
    const teile = [];
    for (let k = 0; k < anzahl; k++) {
      if (geschenke) {
        teile.push({
          x: Math.random() * breite,
          y: -50 - Math.random() * hoehe * 1.2,
          groesse: 22 + Math.random() * 18,
          vx: 0,
          vy: 0.6 + Math.random() * 0.9,
          dreh: -0.3 + Math.random() * 0.6,
          vdreh: -0.008 + Math.random() * 0.016,
          wackel: Math.random() * Math.PI * 2,
        });
        continue;
      }
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

    const dauer = geschenke ? 14000 : 5000;
    const rand = geschenke ? 50 : 20;
    const start = performance.now();
    function schritt(t) {
      const vergangen = t - start;
      ctx.clearRect(0, 0, breite, hoehe);
      let sichtbar = 0;
      for (const p of teile) {
        p.wackel += geschenke ? 0.02 : 0.05;
        p.x += p.vx + Math.sin(p.wackel) * (geschenke ? 0.5 : 0.8);
        p.y += p.vy;
        p.dreh += p.vdreh;
        if (p.y < hoehe + rand) sichtbar++;
        if (vergangen < dauer - 1500 && p.y > hoehe + rand) p.y = -rand; // nachrieseln
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.dreh);
        if (geschenke) {
          ctx.font = p.groesse + "px serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("🎁", 0, 0);
          ctx.restore();
          continue;
        }
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
      if (sichtbar > 0 && vergangen < dauer + (geschenke ? 15000 : 4000)) {
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
   * Easter Eggs (versteckte Gutscheine)
   * ------------------------------------------------------------ */
  const EMBLEME = {
    matcha: { ort: "kopf", svg: '<svg viewBox="0 0 48 48"><path d="M26 14 31 2" stroke="#9d2449" stroke-width="3" stroke-linecap="round"/><path d="M12 14h24l-3.2 29.4A3 3 0 0 1 29.8 46H18.2a3 3 0 0 1-3-2.6z" fill="#eef7e6" stroke="#4a7c3a" stroke-width="2"/><path d="M13.7 23h20.6l-2.3 20.3a1.5 1.5 0 0 1-1.5 1.3H17.5a1.5 1.5 0 0 1-1.5-1.3z" fill="#8fbf5a"/><path d="M14 23c4 3 7-2 10 1s7-1 10 0" fill="none" stroke="#f6fbef" stroke-width="2.2" stroke-linecap="round"/><rect x="17.5" y="27" width="6" height="6" rx="1.6" fill="#fff" opacity=".75" transform="rotate(-12 20.5 30)"/><rect x="25" y="31" width="6" height="6" rx="1.6" fill="#fff" opacity=".75" transform="rotate(10 28 34)"/><rect x="10" y="11" width="28" height="4.5" rx="2.2" fill="#4a7c3a"/></svg>' },
    ente: { ort: "kopf", svg: '<svg viewBox="0 0 48 48"><circle cx="9" cy="10" r="3" fill="none" stroke="#7cc4f0" stroke-width="1.5"/><circle cx="15" cy="5" r="2" fill="none" stroke="#7cc4f0" stroke-width="1.5"/><circle cx="5" cy="18" r="1.6" fill="none" stroke="#7cc4f0" stroke-width="1.3"/><ellipse cx="22" cy="33" rx="17" ry="10" fill="#ffd54a"/><path d="M8 30c6 2 12 1 16-3" fill="none" stroke="#f0b400" stroke-width="2" stroke-linecap="round"/><circle cx="30" cy="18" r="9" fill="#ffd54a"/><path d="M38 17l8 2.5-8 3.5z" fill="#ff8a3d"/><circle cx="32.5" cy="15.5" r="1.6" fill="#3a2a2a"/><path d="M4 44c6-3 10 0 16-1s10-3 18 0" fill="none" stroke="#7cc4f0" stroke-width="2.2" stroke-linecap="round"/></svg>' },
    acai: { ort: "fuss", svg: '<svg viewBox="0 0 48 48"><path d="M5 22h38a19 17 0 0 1-38 0z" fill="#fff" stroke="#9d2449" stroke-width="2"/><ellipse cx="24" cy="22" rx="18" ry="5" fill="#5b2a6e"/><circle cx="15" cy="20.5" r="3" fill="#f6e27a" stroke="#e6c84a"/><circle cx="21" cy="19" r="3" fill="#f6e27a" stroke="#e6c84a"/><circle cx="28" cy="21" r="2.3" fill="#c2185b"/><circle cx="32" cy="19" r="2.3" fill="#3949ab"/><circle cx="35" cy="22" r="1.8" fill="#c2185b"/><path d="M25 17c1-3 4-4 6-3-1 2-3 4-6 3z" fill="#66bb6a"/><rect x="17" y="38" width="14" height="3.5" rx="1.7" fill="#9d2449"/></svg>' },
    blumen: { ort: "fuss", svg: '<svg viewBox="0 0 48 48"><path d="M24 40 15 18M24 40V13M24 40l9-22" stroke="#4a7c3a" stroke-width="2"/><circle cx="14" cy="16" r="6.5" fill="#f7809b"/><circle cx="24" cy="10" r="6.5" fill="#e85d7e"/><circle cx="34" cy="16" r="6.5" fill="#fda4b8"/><circle cx="14" cy="16" r="2.2" fill="#f3dc9f"/><circle cx="24" cy="10" r="2.2" fill="#f3dc9f"/><circle cx="34" cy="16" r="2.2" fill="#f3dc9f"/><path d="M13 26h22l-8.5 20h-5z" fill="#fff3cf" stroke="#d4a84b" stroke-width="1.6"/><path d="M19 33c3 2 7 2 10 0" fill="none" stroke="#e85d7e" stroke-width="2.2" stroke-linecap="round"/></svg>' },
    capybara: { ort: "kalender", svg: '<svg viewBox="0 0 56 46"><ellipse cx="14" cy="9" rx="5" ry="4" fill="#7a4e33"/><ellipse cx="42" cy="9" rx="5" ry="4" fill="#7a4e33"/><rect x="7" y="6" width="42" height="36" rx="17" fill="#b07a52"/><ellipse cx="28" cy="31" rx="13" ry="9.5" fill="#9a6844"/><ellipse cx="23.5" cy="28.5" rx="1.8" ry="1.1" fill="#3a2418"/><ellipse cx="32.5" cy="28.5" rx="1.8" ry="1.1" fill="#3a2418"/><path d="M25 35q3 2 6 0" fill="none" stroke="#3a2418" stroke-width="1.4" stroke-linecap="round"/><path d="M14 20q3-2.5 6 0M36 20q3-2.5 6 0" fill="none" stroke="#3a2418" stroke-width="1.8" stroke-linecap="round"/><circle cx="14" cy="27" r="2.6" fill="#f7809b" opacity=".55"/><circle cx="42" cy="27" r="2.6" fill="#f7809b" opacity=".55"/><path d="M27 4c1-3 4-3 5-1-2 0-3 1-5 1z" fill="#66bb6a"/><ellipse cx="17" cy="43" rx="6" ry="3.2" fill="#9a6844"/><ellipse cx="39" cy="43" rx="6" ry="3.2" fill="#9a6844"/></svg>' },
    heimat: { ort: "fuss", svg: '<svg viewBox="0 0 48 48"><rect x="31" y="8" width="5" height="9" fill="#9d2449"/><path d="M6 23 24 7l18 16" fill="none" stroke="#9d2449" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M11 21v21a2 2 0 0 0 2 2h22a2 2 0 0 0 2-2V21L24 10z" fill="#fff" stroke="#9d2449" stroke-width="2"/><path d="M24 38s-7-4.3-7-9a3.8 3.8 0 0 1 7-2 3.8 3.8 0 0 1 7 2c0 4.7-7 9-7 9z" fill="#e85d7e"/></svg>' },
  };
  const EIER_SCHLUESSEL = "toni-advent-gutscheine-" + KALENDER.jahr;
  const eier = (KALENDER.eastereggs || []).filter((e) => EMBLEME[e.emblem]);
  const eierKnoepfe = new Map();

  function ladeGefunden() {
    try {
      const liste = JSON.parse(localStorage.getItem(EIER_SCHLUESSEL) || "[]");
      return new Set(Array.isArray(liste) ? liste : []);
    } catch (_) { return new Set(); }
  }
  const gefunden = ladeGefunden();
  function speichereGefunden() {
    try { localStorage.setItem(EIER_SCHLUESSEL, JSON.stringify([...gefunden])); } catch (_) { /* egal */ }
  }

  function eiSichtbar(ei, d) {
    if (d.jahr > KALENDER.jahr) return true;
    return d.jahr === KALENDER.jahr && d.monat === 12 && d.tag >= ei.ab;
  }

  const gutscheinDialog = document.getElementById("gutschein");
  const sammlungDialog = document.getElementById("sammlung");
  const sammlungKnopf = document.getElementById("sammlung-knopf");
  const sammlungListe = document.getElementById("sammlung-liste");

  function oeffne(dlg) {
    if (typeof dlg.showModal === "function") dlg.showModal(); else dlg.setAttribute("open", "");
  }
  function schliesse(dlg) {
    if (typeof dlg.close === "function") dlg.close(); else dlg.removeAttribute("open");
  }
  for (const dlg of [gutscheinDialog, sammlungDialog]) {
    dlg.querySelector(".schliessen").addEventListener("click", () => schliesse(dlg));
    dlg.addEventListener("click", (e) => { if (e.target === dlg) schliesse(dlg); });
  }

  function baueEier() {
    const orte = {
      kopf: document.querySelector(".kopf"),
      kalender: document.querySelector("main"),
      fuss: document.querySelector(".fuss"),
    };
    for (const ei of eier) {
      const knopf = document.createElement("button");
      knopf.type = "button";
      knopf.className = "ei ei-" + ei.emblem;
      knopf.hidden = true;
      knopf.setAttribute("aria-label", "Geheimnis");
      knopf.innerHTML = EMBLEME[ei.emblem].svg;
      knopf.addEventListener("click", () => findeEi(ei));
      orte[EMBLEME[ei.emblem].ort].appendChild(knopf);
      eierKnoepfe.set(ei.emblem, knopf);
    }
    sammlungKnopf.addEventListener("click", zeigeSammlung);
  }

  function aktualisiereEier(d) {
    for (const ei of eier) {
      eierKnoepfe.get(ei.emblem).hidden = !(zeitBereit && eiSichtbar(ei, d));
    }
    sammlungKnopf.hidden = !eier.some((ei) => gefunden.has(ei.emblem));
  }

  function findeEi(ei) {
    if (!zeitBereit || !eiSichtbar(ei, berlinDatum(jetzt()))) return;
    const neu = !gefunden.has(ei.emblem);
    if (neu) {
      gefunden.add(ei.emblem);
      speichereGefunden();
      sammlungKnopf.hidden = false;
    }
    zeigeGutschein(ei, neu);
  }

  function zeigeGutschein(ei, neu) {
    const istFoto = ei.art === "foto";
    document.getElementById("gutschein-gefunden").textContent = neu
      ? (ei.fundtext || "Du hast ein Easter Egg gefunden! 🎉")
      : (istFoto ? "Dein Fund 🔍" : "Dein Gutschein 🎟️");
    gutscheinDialog.querySelector(".ticket-label").hidden = istFoto;
    gutscheinDialog.querySelector(".ticket-fuss").hidden = istFoto;
    gutscheinDialog.querySelector(".ticket").classList.toggle("ticket-foto", istFoto);
    document.getElementById("gutschein-emblem").innerHTML = EMBLEME[ei.emblem].svg;
    const bild = document.getElementById("gutschein-bild");
    bild.hidden = !ei.bild;
    if (ei.bild) {
      bild.src = "bilder/klein/" + ei.bild;
      bild.onerror = () => { bild.hidden = true; };
    }
    document.getElementById("gutschein-titel").textContent = ei.titel;
    document.getElementById("gutschein-text").textContent = ei.text;
    oeffne(gutscheinDialog);
    if (neu) konfettiRegen("konfetti");
  }

  function zeigeSammlung() {
    sammlungListe.textContent = "";
    for (const ei of eier) {
      if (!gefunden.has(ei.emblem)) continue;
      const eintrag = document.createElement("button");
      eintrag.type = "button";
      eintrag.className = "sammlung-eintrag";
      eintrag.innerHTML = EMBLEME[ei.emblem].svg;
      const name = document.createElement("span");
      name.textContent = ei.titel;
      eintrag.appendChild(name);
      eintrag.addEventListener("click", () => {
        schliesse(sammlungDialog);
        zeigeGutschein(ei, false);
      });
      sammlungListe.appendChild(eintrag);
    }
    oeffne(sammlungDialog);
  }

  /* ------------------------------------------------------------
   * Fotos: Polaroids oben, Fotostreifen unten, große Ansicht
   * ------------------------------------------------------------ */
  const fotoListe = [];
  const lightbox = document.getElementById("lightbox");
  const lightboxBild = document.getElementById("lightbox-bild");
  const lightboxText = document.getElementById("lightbox-text");
  let fotoIndex = 0;

  function baueFotos() {
    const fotos = KALENDER.fotos || {};
    const ziele = [
      [fotos.titel || [], document.getElementById("titelfotos")],
      [fotos.galerie || [], document.getElementById("fotostreifen")],
    ];
    for (const [liste, ziel] of ziele) {
      for (const f of liste) {
        if (!f || !f.datei) continue;
        const index = fotoListe.length;
        fotoListe.push(f);
        const knopf = document.createElement("button");
        knopf.type = "button";
        knopf.className = "polaroid";
        knopf.setAttribute("aria-label", "Foto ansehen: " + (f.text || ""));
        const img = document.createElement("img");
        img.src = "bilder/klein/" + f.datei;
        img.alt = f.text || "";
        if (f.fokus) img.style.objectPosition = f.fokus;
        img.loading = ziel.id === "titelfotos" ? "eager" : "lazy";
        img.onerror = () => { knopf.remove(); };
        const text = document.createElement("span");
        text.textContent = f.text || "";
        knopf.append(img, text);
        knopf.addEventListener("click", () => zeigeFoto(index));
        ziel.appendChild(knopf);
      }
    }
    document.getElementById("momente").hidden = !(fotos.galerie && fotos.galerie.length);
  }

  function zeigeFoto(index) {
    fotoIndex = (index + fotoListe.length) % fotoListe.length;
    const f = fotoListe[fotoIndex];
    lightboxBild.src = "bilder/" + f.datei;
    lightboxBild.alt = f.text || "";
    lightboxText.textContent = f.text || "";
    lightboxText.hidden = !f.text;
    if (!lightbox.open) oeffne(lightbox);
  }

  lightbox.querySelector(".schliessen").addEventListener("click", () => schliesse(lightbox));
  lightbox.querySelector(".zurueck").addEventListener("click", () => zeigeFoto(fotoIndex - 1));
  lightbox.querySelector(".weiter").addEventListener("click", () => zeigeFoto(fotoIndex + 1));
  lightbox.addEventListener("click", (e) => { if (e.target === lightbox) schliesse(lightbox); });
  lightbox.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") zeigeFoto(fotoIndex - 1);
    if (e.key === "ArrowRight") zeigeFoto(fotoIndex + 1);
  });
  let wischStart = null;
  lightbox.addEventListener("touchstart", (e) => { wischStart = e.touches[0].clientX; }, { passive: true });
  lightbox.addEventListener("touchend", (e) => {
    if (wischStart === null) return;
    const dx = e.changedTouches[0].clientX - wischStart;
    wischStart = null;
    if (Math.abs(dx) > 50) zeigeFoto(fotoIndex + (dx < 0 ? 1 : -1));
  });

  /* ------------------------------------------------------------
   * Start
   * ------------------------------------------------------------ */
  baueKalender();
  baueEier();
  baueFotos();
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
