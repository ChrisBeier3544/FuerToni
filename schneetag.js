/*
 * ===========================================================
 *  SCHNEETAG: An zwei Tagen im Dezember ist der ganze Kalender
 *  über Nacht eingeschneit. Erst wenn mindestens 85 % frei
 *  geschaufelt sind, lassen sich die Türchen wieder öffnen.
 *  Welche Tage es sind, ergibt sich fest aus dem Jahr.
 * ===========================================================
 */
(function () {
  "use strict";

  const ak = window.adventkalender;
  const kal = document.getElementById("kalender");
  if (!ak || !ak.intro || !kal) return;
  const JAHR = KALENDER.jahr;
  const html = document.documentElement;
  const ruhig = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const ZIEL = 0.85;
  const MASKE = 4; // Auflösung der Zählmaske: 1 Punkt pro 4 × 4 Pixel

  /* ---------- Welche zwei Tage? ---------- */
  function schneetage(jahr) {
    // nicht an Prüfungs, Geburtstags oder Sondertagen
    const kandidaten = [3, 9, 12, 14, 23];
    let s = (jahr * 2654435761) >>> 0;
    const zufall = () => { s = (s + 0x6d2b79f5) >>> 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
    const liste = kandidaten.slice();
    for (let i = liste.length - 1; i > 0; i--) { const j = Math.floor(zufall() * (i + 1)); [liste[i], liste[j]] = [liste[j], liste[i]]; }
    const erster = liste[0];
    const zweiter = liste.slice(1).find((t) => Math.abs(t - erster) >= 5) || liste[1];
    return [erster, zweiter].sort((a, b) => a - b);
  }
  const TAGE = schneetage(JAHR);
  const fertigSchluessel = (tag) => "toni-schnee-" + JAHR + "-12-" + String(tag).padStart(2, "0");
  const standSchluessel = (tag) => "toni-schnee-stand-" + JAHR + "-12-" + String(tag).padStart(2, "0");
  const lies = (k) => { try { return localStorage.getItem(k); } catch (_) { return null; } };
  const schreib = (k, v) => { try { if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch (_) { /* egal */ } };

  let aktiv = null;

  // Solange es geschneit hat, lässt sich im Kalender nichts antippen (auch nicht per Tastatur)
  kal.addEventListener("click", (e) => {
    if (aktiv && !e.target.closest(".schnee-decke")) { e.stopPropagation(); e.preventDefault(); }
  }, true);

  /* ---------- Schneedecke zeichnen ---------- */
  function zeichneSchnee(ctx, w, h, oben) {
    ctx.save();
    ctx.globalCompositeOperation = "source-over";
    ctx.clearRect(0, 0, w, h);
    // gewellte Oberkante: der Schnee türmt sich etwas über dem Regal
    ctx.beginPath();
    ctx.moveTo(0, h);
    ctx.lineTo(0, oben * 0.7);
    const wellen = Math.max(4, Math.round(w / 70));
    for (let i = 0; i < wellen; i++) {
      const x0 = (i / wellen) * w, x1 = ((i + 1) / wellen) * w;
      ctx.quadraticCurveTo((x0 + x1) / 2, (i % 2 ? oben * 0.15 : oben * 0.05) - 2, x1, oben * (0.55 + (i % 3) * 0.12));
    }
    ctx.lineTo(w, h);
    ctx.closePath();
    // Grunddecke leicht durchscheinend: die Päckchen ahnt man darunter
    const verlauf = ctx.createLinearGradient(0, 0, 0, h);
    verlauf.addColorStop(0, "rgba(255,255,255,.985)");
    verlauf.addColorStop(1, "rgba(240,246,255,.96)");
    ctx.fillStyle = verlauf;
    ctx.fill();
    ctx.clip();
    // jedes Päckchen trägt eine eigene Schneehaube mit Licht und Schatten
    for (const t of kal.querySelectorAll(":scope > .tuer")) {
      const x = t.offsetLeft + (aktiv ? aktiv.links : 4), y = t.offsetTop + oben, bw = t.offsetWidth, bh = t.offsetHeight;
      const schatten = ctx.createLinearGradient(0, y, 0, y + bh + 10);
      schatten.addColorStop(0, "rgba(255,255,255,0)");
      schatten.addColorStop(0.75, "rgba(175,195,230,.18)");
      schatten.addColorStop(1, "rgba(150,175,220,.32)");
      ctx.fillStyle = schatten;
      runde(ctx, x - 2, y - 4, bw + 4, bh + 10, 18);
      ctx.fill();
      // gewölbte Haube oben
      ctx.fillStyle = "rgba(255,255,255,.95)";
      ctx.beginPath();
      ctx.moveTo(x - 4, y + 14);
      const n = Math.max(2, Math.round(bw / 34));
      for (let i = 0; i < n; i++) {
        const x0 = x - 4 + (i / n) * (bw + 8), x1 = x - 4 + ((i + 1) / n) * (bw + 8);
        ctx.quadraticCurveTo((x0 + x1) / 2, y - 8 - (i % 2) * 4, x1, y + 12 + (i % 2) * 3);
      }
      ctx.lineTo(x + bw + 4, y + 30);
      ctx.quadraticCurveTo(x + bw / 2, y + 42, x - 4, y + 30);
      ctx.closePath();
      ctx.fill();
      const licht = ctx.createRadialGradient(x + bw * 0.3, y + 6, 2, x + bw * 0.3, y + 6, bw * 0.6);
      licht.addColorStop(0, "rgba(255,255,255,.9)");
      licht.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = licht;
      ctx.fillRect(x - 4, y - 10, bw + 8, bh * 0.6);
      // kleine Schneewehe unten am Brett
      ctx.fillStyle = "rgba(255,255,255,.92)";
      ctx.beginPath();
      ctx.ellipse(x + bw * 0.5, y + bh + 4, bw * 0.55, 9, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(160,185,225,.35)";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.ellipse(x + bw * 0.5, y + bh + 4, bw * 0.55, 9, 0, Math.PI * 0.05, Math.PI * 0.95);
      ctx.stroke();
    }
    // feine Körnung und Glitzer
    for (let i = 0; i < Math.round((w * h) / 320); i++) {
      ctx.fillStyle = "rgba(150,170,210," + (0.06 + Math.random() * 0.12).toFixed(2) + ")";
      ctx.fillRect(Math.random() * w, Math.random() * h, 1.2, 1.2);
    }
    for (let i = 0; i < Math.round((w * h) / 1600); i++) {
      const x = Math.random() * w, y = Math.random() * h, g = Math.random() < 0.12 ? 2.4 : 1.4;
      ctx.fillStyle = Math.random() < 0.5 ? "rgba(255,255,255,1)" : "rgba(170,215,255,.95)";
      ctx.fillRect(x, y, g, g);
      if (g > 2) { ctx.fillRect(x - 2, y + 0.9, 6.4, 0.6); ctx.fillRect(x + 0.9, y - 2, 0.6, 6.4); }
    }
    ctx.restore();
  }

  function runde(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  /* ---------- Fortschrittsanzeige oben ---------- */
  function baueLeiste() {
    const grob = window.matchMedia("(pointer: coarse)").matches;
    const l = document.createElement("div");
    l.className = "schnee-leiste";
    l.setAttribute("role", "status");
    l.innerHTML =
      '<p class="schnee-titel">Über Nacht hat es ganz viel geschneit ❄️</p>' +
      '<p class="schnee-hinweis">' + (grob ? "Wisch mit dem Finger zur Seite und schaufel deinen Kalender frei" : "Fahr mit gedrückter Maustaste über den Kalender und schaufel ihn frei") + "</p>" +
      '<div class="schnee-balken" role="progressbar" aria-label="Freigeschaufelt" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">' +
      '<span class="schnee-fuellung"></span><span class="schnee-marke" style="left:' + ZIEL * 100 + '%"><span>85 %</span></span></div>' +
      '<p class="schnee-prozent"><span class="schnee-zahl">0 %</span> freigeschaufelt</p>';
    document.body.appendChild(l);
    return l;
  }
  function zeigeStand(anteil) {
    if (!aktiv) return;
    const p = Math.min(100, Math.floor(anteil * 100));
    aktiv.leiste.querySelector(".schnee-fuellung").style.width = p + "%";
    aktiv.leiste.querySelector(".schnee-zahl").textContent = p + " %";
    aktiv.leiste.querySelector(".schnee-balken").setAttribute("aria-valuenow", String(p));
    aktiv.leiste.classList.toggle("fast", anteil >= 0.6);
  }

  /* ---------- Start ---------- */
  function starte(tag) {
    html.setAttribute("data-schneetag", "");
    const decke = document.createElement("div");
    decke.className = "schnee-decke";
    decke.setAttribute("aria-label", "Eingeschneiter Kalender: zum Freischaufeln darüber wischen");
    const canvas = document.createElement("canvas");
    decke.appendChild(canvas);
    kal.appendChild(decke);
    const maske = document.createElement("canvas");
    aktiv = { tag, decke, canvas, ctx: canvas.getContext("2d"), maske, mctx: maske.getContext("2d", { willReadFrequently: true }), leiste: baueLeiste(),
      w: 0, h: 0, oben: 0, links: 0, dpr: Math.min(2, window.devicePixelRatio || 1), zuletzt: null, fertig: false, zaehlen: false, speicherTimer: null, stiftId: null };
    groesse(true);
    const stand = lies(standSchluessel(tag));
    if (stand) {
      const bild = new Image();
      bild.onload = () => {
        if (!aktiv || aktiv.tag !== tag) return;
        aktiv.mctx.globalCompositeOperation = "copy";
        aktiv.mctx.drawImage(bild, 0, 0, aktiv.maske.width, aktiv.maske.height);
        aktiv.mctx.globalCompositeOperation = "source-over";
        uebertrageMaske();
        zaehle();
      };
      bild.src = stand;
    }
    zeigeStand(0);
    // Leiste und Decke sanft einblenden
    if (!ruhig) {
      aktiv.leiste.animate([{ transform: "translate(-50%,-140%)" }, { transform: "translate(-50%,0)" }], { duration: 600, easing: "cubic-bezier(.3,1.3,.5,1)" });
      decke.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 900 });
    }
    setTimeout(() => {
      if (!aktiv || document.querySelector("dialog[open]")) return;
      const r = kal.getBoundingClientRect();
      if (r.top > window.innerHeight * 0.6 || r.bottom < 120) kal.scrollIntoView({ behavior: ruhig ? "auto" : "smooth", block: "start" });
    }, 700);
    decke.addEventListener("pointerdown", runter);
    decke.addEventListener("pointermove", bewege);
    decke.addEventListener("pointerup", hoch);
    decke.addEventListener("pointercancel", hoch);
    decke.addEventListener("pointerleave", hoch);
    if (window.ResizeObserver) { aktiv.beobachter = new ResizeObserver(() => groesse(false)); aktiv.beobachter.observe(kal); }
  }

  // Größe der Decke an den Kalender anpassen (auch beim Drehen des Handys)
  function groesse(neu) {
    const a = aktiv;
    if (!a) return;
    const kw = kal.offsetWidth, kh = kal.offsetHeight;
    const oben = 22, rand = 4;
    const w = kw + 2 * rand, h = kh + oben + rand;
    if (!neu && w === a.w && h === a.h) return;
    let alt = null, altMaske = null;
    if (!neu && a.w) {
      alt = document.createElement("canvas"); alt.width = a.canvas.width; alt.height = a.canvas.height; alt.getContext("2d").drawImage(a.canvas, 0, 0);
      altMaske = document.createElement("canvas"); altMaske.width = a.maske.width; altMaske.height = a.maske.height; altMaske.getContext("2d").drawImage(a.maske, 0, 0);
    }
    a.w = w; a.h = h; a.oben = oben; a.links = rand; a.kw = kw; a.kh = kh;
    a.decke.style.top = -oben + "px";
    a.decke.style.left = -rand + "px";
    a.decke.style.width = w + "px";
    a.decke.style.height = h + "px";
    a.canvas.width = Math.round(w * a.dpr);
    a.canvas.height = Math.round(h * a.dpr);
    a.ctx.setTransform(a.dpr, 0, 0, a.dpr, 0, 0);
    a.maske.width = Math.max(1, Math.ceil(kw / MASKE));
    a.maske.height = Math.max(1, Math.ceil(kh / MASKE));
    if (altMaske) {
      a.mctx.drawImage(altMaske, 0, 0, a.maske.width, a.maske.height);
    } else {
      a.mctx.fillStyle = "#000";
      a.mctx.fillRect(0, 0, a.maske.width, a.maske.height);
    }
    zeichneSchnee(a.ctx, w, h, oben);
    if (alt) uebertrageMaske();
  }
  // Was in der Maske schon frei ist, auch in der sichtbaren Decke entfernen
  function uebertrageMaske() {
    const a = aktiv;
    const t = document.createElement("canvas");
    t.width = a.canvas.width; t.height = a.canvas.height;
    const c = t.getContext("2d");
    c.setTransform(a.dpr, 0, 0, a.dpr, 0, 0);
    c.fillStyle = "#000";
    c.fillRect(0, 0, a.w, a.oben + 2);
    c.fillRect(0, 0, a.links, a.h);
    c.fillRect(a.w - a.links, 0, a.links, a.h);
    c.fillRect(0, a.h - 4, a.w, 4);
    c.drawImage(a.maske, a.links, a.oben, a.kw, a.kh);
    a.ctx.save();
    a.ctx.setTransform(1, 0, 0, 1, 0, 0);
    a.ctx.globalCompositeOperation = "destination-in";
    a.ctx.drawImage(t, 0, 0);
    a.ctx.restore();
  }

  /* ---------- Schaufeln ---------- */
  const radius = () => Math.max(30, Math.min(56, (aktiv ? aktiv.kw : 360) * 0.1));
  function punkt(e) {
    const r = aktiv.decke.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }
  function runter(e) {
    if (!aktiv || aktiv.fertig) return;
    if (e.pointerType === "mouse" && e.button !== 0) return;
    aktiv.stiftId = e.pointerId;
    aktiv.zuletzt = punkt(e);
    schaufel(aktiv.zuletzt, aktiv.zuletzt);
    zeigeSchaufel(e, true);
  }
  function bewege(e) {
    if (!aktiv || aktiv.fertig || aktiv.stiftId !== e.pointerId) return;
    if (e.pointerType === "mouse" && !(e.buttons & 1)) return;
    const p = punkt(e);
    schaufel(aktiv.zuletzt || p, p);
    zeigeSchaufel(e, true, p.x - (aktiv.zuletzt ? aktiv.zuletzt.x : p.x));
    aktiv.zuletzt = p;
  }
  function hoch(e) {
    if (!aktiv || aktiv.stiftId !== e.pointerId) return;
    aktiv.stiftId = null;
    aktiv.zuletzt = null;
    zeigeSchaufel(e, false);
  }
  function schaufel(von, bis) {
    const a = aktiv, r = radius();
    a.ctx.save();
    a.ctx.globalCompositeOperation = "destination-out";
    a.ctx.lineCap = "round";
    a.ctx.lineJoin = "round";
    a.ctx.lineWidth = r * 2;
    a.ctx.shadowColor = "rgba(0,0,0,1)";
    a.ctx.shadowBlur = 10;
    a.ctx.beginPath();
    a.ctx.moveTo(von.x, von.y);
    a.ctx.lineTo(bis.x + 0.01, bis.y);
    a.ctx.stroke();
    a.ctx.restore();
    // gleiche Spur in der Zählmaske
    const m = a.mctx;
    m.save();
    m.globalCompositeOperation = "destination-out";
    m.lineCap = "round";
    m.lineWidth = (r * 2) / MASKE;
    m.beginPath();
    m.moveTo((von.x - a.links) / MASKE, (von.y - a.oben) / MASKE);
    m.lineTo((bis.x - a.links) / MASKE + 0.01, (bis.y - a.oben) / MASKE);
    m.stroke();
    m.restore();
    flocken(bis, bis.x - von.x);
    if (!a.zaehlen) { a.zaehlen = true; requestAnimationFrame(() => { if (aktiv) { aktiv.zaehlen = false; zaehle(); } }); }
    clearTimeout(a.speicherTimer);
    a.speicherTimer = setTimeout(speichere, 700);
  }
  function zaehle() {
    const a = aktiv;
    if (!a || a.fertig) return;
    const daten = a.mctx.getImageData(0, 0, a.maske.width, a.maske.height).data;
    let frei = 0;
    for (let i = 3; i < daten.length; i += 4) if (daten[i] < 128) frei++;
    const anteil = frei / (daten.length / 4);
    zeigeStand(anteil);
    if (anteil >= ZIEL) geschafft();
  }
  function speichere() {
    if (!aktiv || aktiv.fertig) return;
    try { schreib(standSchluessel(aktiv.tag), aktiv.maske.toDataURL("image/png")); } catch (_) { /* egal */ }
  }

  // kleine Schneebrocken fliegen beim Schaufeln weg
  let letzteFlocke = 0;
  function flocken(p, richtung) {
    if (ruhig) return;
    const jetzt = performance.now();
    if (jetzt - letzteFlocke < 45) return;
    letzteFlocke = jetzt;
    const r = aktiv.decke.getBoundingClientRect();
    for (let k = 0; k < 3; k++) {
      const s = document.createElement("span");
      s.className = "schnee-brocken";
      const g = 3 + Math.random() * 5;
      s.style.width = s.style.height = g + "px";
      s.style.left = r.left + p.x + "px";
      s.style.top = r.top + p.y + "px";
      document.body.appendChild(s);
      const dx = (richtung >= 0 ? 1 : -1) * (20 + Math.random() * 50), dy = -(20 + Math.random() * 40);
      s.animate([
        { transform: "translate(-50%,-50%)", opacity: 1 },
        { transform: "translate(calc(-50% + " + dx * 0.6 + "px), calc(-50% + " + dy + "px))", opacity: 1, offset: 0.4 },
        { transform: "translate(calc(-50% + " + dx + "px), calc(-50% + " + (dy + 70) + "px))", opacity: 0 },
      ], { duration: 650 + Math.random() * 300, easing: "ease-out", fill: "forwards" }).finished.then(() => s.remove(), () => s.remove());
    }
  }
  // Schaufel am Finger bzw. an der Maus
  let schaufelEl = null;
  function zeigeSchaufel(e, an, dx) {
    if (!schaufelEl) {
      schaufelEl = document.createElement("div");
      schaufelEl.className = "schnee-schaufel";
      schaufelEl.innerHTML = '<svg viewBox="0 0 40 60" aria-hidden="true"><rect x="18" y="2" width="4" height="34" rx="2" fill="#a96f47"/><rect x="12" y="0" width="16" height="6" rx="3" fill="#6b4a3a"/>' +
        '<path d="M6 34 h28 l-3 20 q-11 6 -22 0z" fill="#d6304f" stroke="#9d2449" stroke-width="1.5"/><path d="M10 38 h20" stroke="#fff" stroke-width="2" opacity=".5"/></svg>';
      document.body.appendChild(schaufelEl);
    }
    schaufelEl.hidden = !an;
    if (!an) return;
    schaufelEl.style.left = e.clientX + "px";
    schaufelEl.style.top = e.clientY + "px";
    if (dx) schaufelEl.style.setProperty("--neigung", Math.max(-35, Math.min(35, dx * 3)) + "deg");
  }

  /* ---------- Geschafft ---------- */
  function geschafft() {
    const a = aktiv;
    if (!a || a.fertig) return;
    a.fertig = true;
    clearTimeout(a.speicherTimer);
    schreib(fertigSchluessel(a.tag), "1");
    schreib(standSchluessel(a.tag), null);
    if (schaufelEl) schaufelEl.hidden = true;
    zeigeStand(1);
    a.leiste.classList.add("fertig");
    a.leiste.querySelector(".schnee-titel").textContent = "Geschafft! Dein Kalender ist frei 🎉";
    a.leiste.querySelector(".schnee-hinweis").textContent = "Danke fürs Schaufeln, mein Schatz ♥️";
    const ende = () => {
      if (a.beobachter) a.beobachter.disconnect();
      a.decke.remove();
      html.removeAttribute("data-schneetag");
      if (aktiv === a) aktiv = null;
    };
    if (ruhig) ende();
    else a.canvas.animate([{ opacity: 1, filter: "blur(0)", transform: "none" }, { opacity: 0, filter: "blur(6px)", transform: "translateY(18px) scaleY(.96)" }], { duration: 1500, easing: "ease-in", fill: "forwards" })
      .finished.then(ende, ende);
    if (ak.konfetti) setTimeout(() => ak.konfetti("konfetti"), 300);
    setTimeout(() => { if (ak.voegel && ak.voegel.sage) ak.voegel.sage("Super gemacht! Jetzt kommst du wieder an deine Türchen ❄️"); }, 1800);
    setTimeout(() => {
      if (ruhig) { a.leiste.remove(); return; }
      a.leiste.animate([{ transform: "translate(-50%,0)", opacity: 1 }, { transform: "translate(-50%,-140%)", opacity: 0 }], { duration: 500, easing: "ease-in", fill: "forwards" })
        .finished.then(() => a.leiste.remove(), () => a.leiste.remove());
    }, 3200);
  }

  function beende() {
    // nur nötig, wenn sich das Datum ändert (z. B. in der Testversion)
    const a = aktiv;
    if (!a) return;
    if (a.beobachter) a.beobachter.disconnect();
    a.decke.remove();
    a.leiste.remove();
    html.removeAttribute("data-schneetag");
    aktiv = null;
  }

  /* ---------- Prüfen, ob heute ein Schneetag ist ---------- */
  function pruefe() {
    if (!ak.intro.bereit()) return;
    const intro = document.getElementById("intro");
    const d = ak.kalenderDatum();
    const heute = d.jahr === JAHR && d.monat === 12 && TAGE.includes(d.tag) ? d.tag : null;
    if (aktiv && aktiv.tag !== heute && !aktiv.fertig) beende();
    if (!heute || aktiv || lies(fertigSchluessel(heute)) === "1") return;
    if (intro && !intro.hidden) return;
    if (document.querySelector(".aufbau-buehne, .special-buehne")) return;
    starte(heute);
  }
  setInterval(pruefe, 500);

  // Testversion: Schneetage in der Testleiste markieren
  const testSel = document.getElementById("test-datum");
  if (testSel) {
    TAGE.forEach((t) => {
      const o = testSel.querySelector('option[value="dez-' + String(t).padStart(2, "0") + '"]');
      if (o && !o.textContent.includes("❄️ Schneetag")) o.textContent += " ❄️ Schneetag";
    });
  }

  window.adventkalender.schneetag = { tage: TAGE, aktiv: () => !!aktiv, schaufelAlles: () => { if (aktiv) { aktiv.mctx.clearRect(0, 0, aktiv.maske.width, aktiv.maske.height); zaehle(); } } };
})();
