/*
 * ===========================================================
 *  CAPY-SPIEL: Capy fängt Schneeflocken
 *  Fang Schneeflocken, Herzen und Sterne, weich den Eiswürfeln
 *  aus. Mit Kombos, Leveln, Rekord und Partikeln.
 * ===========================================================
 */
(function () {
  "use strict";

  const ak = window.adventkalender;
  const dialog = document.getElementById("spiel");
  const leinwand = document.getElementById("spiel-leinwand");
  if (!ak || !dialog || !leinwand) return;
  const ctx = leinwand.getContext("2d");
  const knopf = document.getElementById("spiel-knopf");
  const menue = document.getElementById("spiel-menue");
  const menueTitel = document.getElementById("spiel-titel");
  const menueText = document.getElementById("spiel-text");
  const rekordText = document.getElementById("spiel-rekord");
  const startKnopf = document.getElementById("spiel-start");
  const punkteAnzeige = document.getElementById("spiel-punkte");
  const lebenAnzeige = document.getElementById("spiel-leben");
  const ruhig = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const REKORD_SCHLUESSEL = "toni-capy-spiel-rekord";

  let W = 0, H = 0, dpr = 1, boden = 0;
  function groesse() {
    const r = leinwand.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = Math.max(280, r.width); H = Math.max(360, r.height);
    leinwand.width = Math.round(W * dpr); leinwand.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    boden = H - Math.max(70, H * 0.12);
    if (capy) capy.y = boden;
  }

  const ladeRekord = () => { try { return +localStorage.getItem(REKORD_SCHLUESSEL) || 0; } catch (_) { return 0; } };
  const speichereRekord = (p) => { try { localStorage.setItem(REKORD_SCHLUESSEL, String(p)); } catch (_) { /* egal */ } };

  /* ---------- Spielzustand ---------- */
  let capy = null, dinge = [], partikel = [], texte = [], hintergrund = [];
  let punkte = 0, leben = 3, kombo = 0, level = 1, zeit = 0, spawnTimer = 0;
  let laeuft = false, pausiert = false, letzteZeit = 0, wackeln = 0, blitz = 0, levelBanner = 0, unverwundbar = 0;
  const eingabe = { links: false, rechts: false, ziel: null };

  function neuesSpiel() {
    capy = { x: W / 2, y: boden, vx: 0, blick: 1, quetsch: 0, hopp: 0, breite: Math.min(96, W * 0.22) };
    dinge = []; partikel = []; texte = [];
    punkte = 0; leben = 3; kombo = 0; level = 1; zeit = 0; spawnTimer = 0.6;
    wackeln = 0; blitz = 0; levelBanner = 1.6; unverwundbar = 0;
    hintergrund = Array.from({ length: 70 }, () => ({ x: Math.random() * W, y: Math.random() * H, r: 0.6 + Math.random() * 1.8, v: 10 + Math.random() * 30 }));
    aktualisiereAnzeige();
  }

  const ARTEN = {
    flocke: { punkte: 1, r: 13, farbe: "#ffffff" },
    herz: { punkte: 3, r: 14, farbe: "#ff5c85" },
    stern: { punkte: 10, r: 16, farbe: "#f3c84b" },
    eis: { punkte: 0, r: 15, farbe: "#9fd8f2", gefahr: true },
  };
  function erzeuge() {
    const schwer = Math.min(1, (level - 1) / 8);
    const z = Math.random();
    let art = "flocke";
    if (z < 0.16 + schwer * 0.16) art = "eis";
    else if (z < 0.2 + schwer * 0.16) art = "stern";
    else if (z < 0.42 + schwer * 0.1) art = "herz";
    const a = ARTEN[art];
    dinge.push({
      art, r: a.r * (W < 400 ? 0.95 : 1.1),
      x: 30 + Math.random() * (W - 60), y: -30,
      vy: (90 + level * 18 + Math.random() * 40) * (art === "stern" ? 1.25 : 1),
      phase: Math.random() * 6.28, schwingen: art === "flocke" ? 28 : art === "herz" ? 18 : 8,
      dreh: Math.random() * 6.28,
    });
  }

  function aktualisiereAnzeige() {
    punkteAnzeige.textContent = punkte + (kombo >= 5 ? "  ×" + multiplikator() : "");
    lebenAnzeige.textContent = "♥️".repeat(Math.max(0, leben)) + "🤍".repeat(Math.max(0, 3 - leben));
  }
  const multiplikator = () => (kombo >= 25 ? 3 : kombo >= 10 ? 2 : 1);

  function funken(x, y, farbe, n, staerke) {
    for (let k = 0; k < n; k++) {
      const w = Math.random() * Math.PI * 2, v = (60 + Math.random() * 160) * (staerke || 1);
      partikel.push({ x, y, vx: Math.cos(w) * v, vy: Math.sin(w) * v - 60, leben: 0.6 + Math.random() * 0.4, max: 1, farbe, r: 2 + Math.random() * 3 });
    }
  }
  function schwebeText(x, y, text, farbe) { texte.push({ x, y, text, farbe, leben: 1 }); }

  /* ---------- Spiellogik ---------- */
  function schritt(dt) {
    zeit += dt;
    // Level steigt alle 40 Punkte
    const neuesLevel = 1 + Math.floor(punkte / 40);
    if (neuesLevel > level) { level = neuesLevel; levelBanner = 1.6; funken(W / 2, H * 0.3, "#f3c84b", 30, 1.4); }

    // Capybara bewegen: Finger folgen oder Tasten
    const tempo = 520 + level * 25;
    if (eingabe.ziel !== null) {
      const diff = eingabe.ziel - capy.x;
      capy.vx = Math.max(-tempo * 1.4, Math.min(tempo * 1.4, diff * 12));
    } else {
      const richtung = (eingabe.rechts ? 1 : 0) - (eingabe.links ? 1 : 0);
      capy.vx += (richtung * tempo - capy.vx) * Math.min(1, dt * 12);
    }
    capy.x = Math.max(capy.breite * 0.5, Math.min(W - capy.breite * 0.5, capy.x + capy.vx * dt));
    if (Math.abs(capy.vx) > 20) capy.blick = capy.vx > 0 ? 1 : -1;
    capy.hopp += Math.abs(capy.vx) * dt * 0.04;
    capy.quetsch = Math.max(0, capy.quetsch - dt * 4);
    unverwundbar = Math.max(0, unverwundbar - dt);

    // Neue Dinge
    spawnTimer -= dt;
    if (spawnTimer <= 0) {
      erzeuge();
      if (level >= 4 && Math.random() < 0.25) erzeuge();
      spawnTimer = Math.max(0.28, 0.95 - level * 0.07) * (0.7 + Math.random() * 0.6);
    }

    // Fallende Dinge
    const maulX = capy.x + capy.blick * capy.breite * 0.32, maulY = capy.y - capy.breite * 0.42;
    for (let i = dinge.length - 1; i >= 0; i--) {
      const d = dinge[i];
      d.phase += dt * 2.4;
      d.dreh += dt * (d.art === "stern" ? 3 : 1);
      d.y += d.vy * dt;
      d.xs = d.x + Math.sin(d.phase) * d.schwingen;
      const nahX = Math.abs(d.xs - capy.x) < capy.breite * 0.52 + d.r * 0.5;
      const nahY = d.y > capy.y - capy.breite * 0.75 && d.y < capy.y - capy.breite * 0.05;
      if (nahX && nahY) {
        dinge.splice(i, 1);
        if (ARTEN[d.art].gefahr) {
          if (unverwundbar <= 0) {
            leben--; kombo = 0; unverwundbar = 1.2; wackeln = 0.45; blitz = 0.35;
            funken(d.xs, d.y, "#9fd8f2", 18, 1.2);
            schwebeText(d.xs, d.y - 20, "Brrr!", "#9fd8f2");
            if (navigator.vibrate) try { navigator.vibrate(120); } catch (_) { /* egal */ }
            if (leben <= 0) { spielEnde(); return; }
          }
        } else {
          kombo++;
          const p = ARTEN[d.art].punkte * multiplikator();
          punkte += p;
          capy.quetsch = 1;
          funken(maulX, maulY, ARTEN[d.art].farbe, d.art === "stern" ? 22 : 10, d.art === "stern" ? 1.3 : 0.8);
          schwebeText(d.xs, d.y - 16, "+" + p, d.art === "flocke" ? "#ffffff" : ARTEN[d.art].farbe);
          if (kombo === 10 || kombo === 25) schwebeText(W / 2, H * 0.42, "Kombo ×" + multiplikator() + "!", "#f3c84b");
        }
        aktualisiereAnzeige();
        continue;
      }
      if (d.y > H + 40) {
        dinge.splice(i, 1);
        if (!ARTEN[d.art].gefahr && d.art !== "flocke") { kombo = 0; aktualisiereAnzeige(); }
      }
    }

    // Partikel und Texte
    for (let i = partikel.length - 1; i >= 0; i--) {
      const p = partikel[i];
      p.leben -= dt; p.vy += 420 * dt; p.x += p.vx * dt; p.y += p.vy * dt;
      if (p.leben <= 0) partikel.splice(i, 1);
    }
    for (let i = texte.length - 1; i >= 0; i--) { texte[i].leben -= dt * 1.2; texte[i].y -= 40 * dt; if (texte[i].leben <= 0) texte.splice(i, 1); }
    for (const s of hintergrund) { s.y += s.v * dt; if (s.y > H) { s.y = -4; s.x = Math.random() * W; } }
    wackeln = Math.max(0, wackeln - dt); blitz = Math.max(0, blitz - dt); levelBanner = Math.max(0, levelBanner - dt);
  }

  /* ---------- Zeichnen ---------- */
  function zeichneHintergrund() {
    const g = ctx.createLinearGradient(0, 0, 0, H);
    const farbwechsel = Math.min(1, (level - 1) / 6);
    g.addColorStop(0, farbwechsel > 0.5 ? "#1a1238" : "#251343");
    g.addColorStop(0.6, "#4a1f4f");
    g.addColorStop(1, "#7a2e5a");
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    // Polarlicht ab Level 3
    if (level >= 3) {
      ctx.save(); ctx.globalAlpha = 0.18 + 0.06 * Math.sin(zeit);
      const a = ctx.createLinearGradient(0, H * 0.1, W, H * 0.3);
      a.addColorStop(0, "rgba(155,227,176,0)"); a.addColorStop(0.5, "rgba(155,227,176,1)"); a.addColorStop(1, "rgba(124,196,240,0)");
      ctx.fillStyle = a; ctx.beginPath(); ctx.moveTo(0, H * 0.18);
      for (let x = 0; x <= W; x += 20) ctx.lineTo(x, H * 0.18 + Math.sin(x / 70 + zeit) * 22);
      ctx.lineTo(W, H * 0.32); ctx.lineTo(0, H * 0.32); ctx.fill(); ctx.restore();
    }
    // Mond und Sterne
    ctx.fillStyle = "#fdf1cc"; ctx.beginPath(); ctx.arc(W * 0.82, H * 0.12, 22, 0, 6.3); ctx.fill();
    ctx.fillStyle = "#251343"; ctx.beginPath(); ctx.arc(W * 0.82 + 10, H * 0.12 - 6, 20, 0, 6.3); ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,.85)";
    for (const s of hintergrund) { ctx.globalAlpha = 0.35 + (s.r / 2.4) * 0.5; ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 6.3); ctx.fill(); }
    ctx.globalAlpha = 1;
    // Häuser in der Ferne
    ctx.fillStyle = "#3a1e44";
    let x = -10;
    let i = 0;
    while (x < W) {
      const b = 50 + ((i * 37) % 40), h = 40 + ((i * 53) % 50);
      ctx.fillRect(x, boden - h, b, h + 10);
      ctx.beginPath(); ctx.moveTo(x - 4, boden - h); ctx.lineTo(x + b / 2, boden - h - 20); ctx.lineTo(x + b + 4, boden - h); ctx.fill();
      ctx.fillStyle = "#ffd36b";
      for (let f = 0; f < 3; f++) if ((i + f) % 2 === 0) ctx.fillRect(x + 8 + f * 14, boden - h + 12, 7, 8);
      ctx.fillStyle = "#3a1e44";
      x += b + 14; i++;
    }
    // Schneeboden
    ctx.fillStyle = "#f3eef8";
    ctx.beginPath(); ctx.moveTo(0, boden + 4);
    for (let xx = 0; xx <= W; xx += 30) ctx.quadraticCurveTo(xx + 15, boden - 6, xx + 30, boden + 4);
    ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.fill();
  }

  function zeichneCapy() {
    const b = capy.breite, x = capy.x, y = capy.y;
    if (unverwundbar > 0 && Math.floor(unverwundbar * 10) % 2 === 0) return;
    const quetsch = 1 + capy.quetsch * 0.18, hopp = Math.abs(Math.sin(capy.hopp)) * 4;
    ctx.save();
    ctx.translate(x, y - hopp);
    ctx.scale(capy.blick * quetsch, 1 / quetsch);
    const s = b / 80;
    ctx.scale(s, s);
    // Schatten
    ctx.fillStyle = "rgba(0,0,0,.18)"; ctx.beginPath(); ctx.ellipse(0, 4 + hopp / s, 38, 6, 0, 0, 6.3); ctx.fill();
    // Beine
    ctx.fillStyle = "#8a5a3a";
    const bein = Math.sin(capy.hopp * 2) * 4;
    [[-26, bein], [-14, -bein], [10, bein], [22, -bein]].forEach(([bx, by]) => { ctx.beginPath(); ctx.roundRect(bx, -14 + by * 0.3, 8, 14, 3); ctx.fill(); });
    // Körper
    ctx.fillStyle = "#b07a52"; ctx.beginPath(); ctx.ellipse(-4, -28, 34, 20, 0, 0, 6.3); ctx.fill();
    // Kopf
    ctx.beginPath(); ctx.roundRect(14, -58, 28, 30, 12); ctx.fill();
    ctx.fillStyle = "#9a6844"; ctx.beginPath(); ctx.roundRect(30, -50, 16, 20, 7); ctx.fill();
    ctx.fillStyle = "#7a4e33"; ctx.beginPath(); ctx.ellipse(20, -58, 4.5, 3.6, 0, 0, 6.3); ctx.fill();
    // Auge: offen oder fröhlich zugekniffen
    ctx.strokeStyle = "#3a2418"; ctx.lineWidth = 2.2; ctx.lineCap = "round";
    if (capy.quetsch > 0.3) { ctx.beginPath(); ctx.moveTo(25, -46); ctx.quadraticCurveTo(28, -49, 31, -46); ctx.stroke(); }
    else { ctx.fillStyle = "#3a2418"; ctx.beginPath(); ctx.arc(28, -46, 2.2, 0, 6.3); ctx.fill(); }
    ctx.fillStyle = "#3a2418"; ctx.beginPath(); ctx.ellipse(43, -44, 1.6, 1.2, 0, 0, 6.3); ctx.fill();
    ctx.fillStyle = "rgba(247,128,155,.6)"; ctx.beginPath(); ctx.arc(30, -38, 3, 0, 6.3); ctx.fill();
    // Mund offen beim Fangen
    if (capy.quetsch > 0.3) { ctx.fillStyle = "#6b1532"; ctx.beginPath(); ctx.ellipse(41, -34, 3, 2.4 * capy.quetsch, 0, 0, 6.3); ctx.fill(); }
    // Nikolausmütze
    ctx.fillStyle = "#d6304f"; ctx.beginPath(); ctx.moveTo(14, -58); ctx.quadraticCurveTo(22, -80, 44, -72); ctx.lineTo(38, -58); ctx.fill();
    ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.roundRect(11, -62, 30, 7, 3.5); ctx.fill();
    ctx.beginPath(); ctx.arc(45, -72, 4.5, 0, 6.3); ctx.fill();
    ctx.restore();
  }

  function zeichneDing(d) {
    const x = d.xs ?? d.x, y = d.y, r = d.r;
    ctx.save(); ctx.translate(x, y);
    if (d.art === "flocke") {
      ctx.rotate(d.dreh); ctx.strokeStyle = "#ffffff"; ctx.lineWidth = 2.4; ctx.lineCap = "round";
      ctx.shadowColor = "rgba(255,255,255,.8)"; ctx.shadowBlur = 8;
      for (let k = 0; k < 6; k++) {
        ctx.rotate(Math.PI / 3); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -r);
        ctx.moveTo(0, -r * 0.55); ctx.lineTo(-r * 0.25, -r * 0.75); ctx.moveTo(0, -r * 0.55); ctx.lineTo(r * 0.25, -r * 0.75); ctx.stroke();
      }
    } else if (d.art === "herz") {
      const puls = 1 + Math.sin(d.phase * 2) * 0.08; ctx.scale(puls, puls);
      ctx.fillStyle = "#ff5c85"; ctx.shadowColor = "rgba(255,92,133,.7)"; ctx.shadowBlur = 10;
      ctx.beginPath(); ctx.moveTo(0, r * 0.7);
      ctx.bezierCurveTo(-r * 1.3, -r * 0.1, -r * 0.6, -r * 1.1, 0, -r * 0.35);
      ctx.bezierCurveTo(r * 0.6, -r * 1.1, r * 1.3, -r * 0.1, 0, r * 0.7); ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,.55)"; ctx.beginPath(); ctx.arc(-r * 0.4, -r * 0.35, r * 0.18, 0, 6.3); ctx.fill();
    } else if (d.art === "stern") {
      ctx.rotate(d.dreh); ctx.fillStyle = "#f3c84b"; ctx.shadowColor = "rgba(243,200,75,.9)"; ctx.shadowBlur = 16;
      ctx.beginPath();
      for (let k = 0; k < 10; k++) { const rr = k % 2 ? r * 0.45 : r; const w = (k / 10) * Math.PI * 2 - Math.PI / 2; ctx.lineTo(Math.cos(w) * rr, Math.sin(w) * rr); }
      ctx.closePath(); ctx.fill();
    } else {
      ctx.rotate(Math.sin(d.phase) * 0.3);
      ctx.fillStyle = "rgba(159,216,242,.9)"; ctx.strokeStyle = "#ffffff"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.roundRect(-r * 0.8, -r * 0.8, r * 1.6, r * 1.6, 5); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "rgba(255,255,255,.7)"; ctx.fillRect(-r * 0.5, -r * 0.55, r * 0.35, r * 0.25);
      ctx.fillStyle = "#3a5a7a"; ctx.font = "bold " + r + "px sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("!", 0, r * 0.1);
    }
    ctx.restore();
  }

  function zeichne() {
    ctx.save();
    if (wackeln > 0 && !ruhig) ctx.translate((Math.random() - 0.5) * 12 * wackeln, (Math.random() - 0.5) * 12 * wackeln);
    zeichneHintergrund();
    for (const d of dinge) zeichneDing(d);
    zeichneCapy();
    for (const p of partikel) { ctx.globalAlpha = Math.max(0, p.leben); ctx.fillStyle = p.farbe; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.3); ctx.fill(); }
    ctx.globalAlpha = 1;
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    for (const t of texte) {
      ctx.globalAlpha = Math.max(0, t.leben); ctx.fillStyle = t.farbe;
      ctx.font = "800 " + (t.text.startsWith("Kombo") ? 30 : 20) + "px Nunito, sans-serif";
      ctx.shadowColor = "rgba(0,0,0,.35)"; ctx.shadowBlur = 6; ctx.fillText(t.text, t.x, t.y); ctx.shadowBlur = 0;
    }
    ctx.globalAlpha = 1;
    if (levelBanner > 0 && laeuft) {
      ctx.globalAlpha = Math.min(1, levelBanner * 1.5);
      ctx.fillStyle = "#fff"; ctx.font = "700 " + Math.min(54, W * 0.12) + "px 'Dancing Script', cursive";
      ctx.shadowColor = "rgba(232,93,126,.9)"; ctx.shadowBlur = 18;
      ctx.fillText("Level " + level, W / 2, H * 0.34);
      ctx.shadowBlur = 0; ctx.globalAlpha = 1;
    }
    ctx.restore();
    if (blitz > 0) { ctx.fillStyle = "rgba(159,216,242," + blitz * 0.9 + ")"; ctx.fillRect(0, 0, W, H); }
  }

  function schleife(t) {
    if (!dialog.open) { laeuft = false; return; }
    const dt = Math.min(0.033, (t - letzteZeit) / 1000 || 0);
    letzteZeit = t;
    if (laeuft && !pausiert) schritt(dt);
    zeichne();
    requestAnimationFrame(schleife);
  }

  /* ---------- Start, Ende, Menü ---------- */
  function zeigeMenue(titel, text, knopfText) {
    menueTitel.textContent = titel;
    menueText.textContent = text;
    startKnopf.textContent = knopfText;
    const r = ladeRekord();
    rekordText.textContent = r ? "Dein Rekord: " + r + " Punkte 🏆" : "";
    menue.hidden = false;
    startKnopf.focus({ preventScroll: true });
  }
  function starten() {
    menue.hidden = true;
    groesse();
    neuesSpiel();
    laeuft = true; pausiert = false;
  }
  function spielEnde() {
    laeuft = false;
    const alt = ladeRekord();
    const rekord = punkte > alt;
    if (rekord) { speichereRekord(punkte); if (ak.konfetti) ak.konfetti(); }
    const name = ["Maus", "Baby", "Toni", "mein Schatz"][Math.floor(Math.random() * 4)];
    zeigeMenue(
      rekord ? "Neuer Rekord! 🎉" : "Gut gemacht, " + name + "!",
      "Du hast " + punkte + " Punkte gesammelt und Level " + level + " erreicht." + (rekord && alt ? " Vorher waren es " + alt + "." : ""),
      "Nochmal spielen");
  }
  startKnopf.addEventListener("click", starten);

  function oeffnen() {
    if (typeof dialog.showModal === "function") dialog.showModal(); else dialog.setAttribute("open", "");
    requestAnimationFrame(() => {
      groesse();
      neuesSpiel();
      laeuft = false;
      zeigeMenue("Capy fängt Schneeflocken", "Fang Schneeflocken, Herzen und Sterne mit dem Capybara. Weich den Eiswürfeln aus!", "Los geht's");
      letzteZeit = performance.now();
      requestAnimationFrame(schleife);
    });
  }
  function schliessen() { laeuft = false; if (dialog.open) dialog.close(); }
  knopf.addEventListener("click", oeffnen);
  dialog.querySelector(".spiel-zu").addEventListener("click", schliessen);
  dialog.addEventListener("cancel", () => { laeuft = false; });
  document.addEventListener("visibilitychange", () => { pausiert = document.hidden; letzteZeit = performance.now(); });
  window.addEventListener("resize", () => { if (dialog.open) groesse(); });

  /* ---------- Steuerung ---------- */
  function zielAus(e) { const r = leinwand.getBoundingClientRect(); eingabe.ziel = e.clientX - r.left; }
  leinwand.addEventListener("pointerdown", (e) => { leinwand.setPointerCapture(e.pointerId); zielAus(e); });
  leinwand.addEventListener("pointermove", (e) => { if (e.pointerType !== "mouse" || e.buttons || laeuft) zielAus(e); });
  leinwand.addEventListener("pointerup", (e) => { if (e.pointerType !== "mouse") eingabe.ziel = null; });
  leinwand.addEventListener("pointercancel", () => { eingabe.ziel = null; });
  leinwand.addEventListener("pointerleave", (e) => { if (e.pointerType === "mouse") eingabe.ziel = null; });
  window.addEventListener("keydown", (e) => {
    if (!dialog.open) return;
    if (e.key === "ArrowLeft" || e.key === "a") { eingabe.links = true; eingabe.ziel = null; e.preventDefault(); }
    if (e.key === "ArrowRight" || e.key === "d") { eingabe.rechts = true; eingabe.ziel = null; e.preventDefault(); }
  });
  window.addEventListener("keyup", (e) => {
    if (e.key === "ArrowLeft" || e.key === "a") eingabe.links = false;
    if (e.key === "ArrowRight" || e.key === "d") eingabe.rechts = false;
  });

  /* ---------- Spiel-Knopf ab dem Geburtstag anzeigen ---------- */
  setInterval(() => {
    if (!ak.intro || !ak.intro.bereit()) return;
    const d = ak.intro.datum();
    const ab26 = d.jahr > KALENDER.jahr || (d.jahr === KALENDER.jahr && (d.monat === 12 || (d.monat === 11 && d.tag >= 26)));
    knopf.hidden = !(ab26 && ak.intro.phase() === "offen");
  }, 1000);

  window.adventkalender.spiel = { oeffnen };
})();
