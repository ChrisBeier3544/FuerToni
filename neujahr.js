/*
 * ===========================================================
 *  NEUJAHR: Am 31.12. zählt die Seite die letzten 10 Sekunden
 *  herunter, um Mitternacht gibt es Feuerwerk und einen Gruß.
 *  Wer erst später vorbeischaut, sieht das Feuerwerk beim ersten
 *  Besuch zwischen dem 1. und 6. Januar (einmal pro Gerät).
 * ===========================================================
 */
(function () {
  "use strict";

  const ak = window.adventkalender;
  if (!ak || !ak.intro) return;
  const ruhig = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const JAHR = KALENDER.jahr, NEU = JAHR + 1;
  const SCHLUESSEL = "toni-neujahr-" + NEU;
  const FARBEN = ["#ff8fab", "#ffd36b", "#ff4d7d", "#fff4d6", "#f7809b", "#ffe08a", "#ffffff"];
  let laeuft = false, countdown = null;

  function gesehen() { try { return localStorage.getItem(SCHLUESSEL) === "1"; } catch (_) { return false; } }
  function merke() { try { localStorage.setItem(SCHLUESSEL, "1"); } catch (_) { /* egal */ } }

  /* ---------- Countdown der letzten 10 Sekunden ---------- */
  let letzteZahl = null;
  function zeigeZahl(z) {
    if (z === letzteZahl) return;
    letzteZahl = z;
    if (!countdown) {
      countdown = document.createElement("div");
      countdown.className = "neujahr-countdown";
      countdown.setAttribute("aria-live", "assertive");
      document.body.appendChild(countdown);
    }
    countdown.textContent = z;
    countdown.animate([{ transform: "scale(1.6)", opacity: 0 }, { transform: "scale(1)", opacity: 1, offset: 0.3 }, { transform: "scale(.9)", opacity: 0.85 }],
      { duration: 950, easing: "ease-out", fill: "forwards" });
  }

  /* ---------- Feuerwerk ---------- */
  function feuerwerk() {
    if (laeuft) return;
    laeuft = true;
    merke();
    if (countdown) { countdown.remove(); countdown = null; }
    const ebene = document.createElement("div");
    ebene.className = "neujahr";
    ebene.innerHTML =
      '<canvas class="neujahr-himmel"></canvas>' +
      '<div class="neujahr-gruss"><p class="neujahr-jahr">' + NEU + '</p>' +
      '<p class="neujahr-titel">Frohes neues Jahr, mein Schatz ♥️</p>' +
      '<p class="neujahr-text">Danke für ' + JAHR + '. Ich freu mich auf jeden Tag ' + NEU + ' mit dir</p></div>';
    document.body.appendChild(ebene);
    const zu = () => {
      ebene.classList.add("weg");
      setTimeout(() => { ebene.remove(); laeuft = false; }, 900);
    };
    ebene.addEventListener("click", zu);
    if (ruhig) { setTimeout(zu, 7000); return; }

    const canvas = ebene.querySelector("canvas");
    const c = canvas.getContext("2d");
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    let W = 0, H = 0;
    const groesse = () => { W = window.innerWidth; H = window.innerHeight; canvas.width = W * dpr; canvas.height = H * dpr; c.setTransform(dpr, 0, 0, dpr, 0, 0); };
    groesse();
    window.addEventListener("resize", groesse);
    const raketen = [], funken = [];
    const DAUER = 13000, start = performance.now();
    let naechste = 0;
    function starteRakete(jetzt) {
      raketen.push({ x: W * (0.12 + Math.random() * 0.76), y: H + 10, vy: -(H * 0.011 + Math.random() * H * 0.004), ziel: H * (0.12 + Math.random() * 0.33),
        farbe: FARBEN[Math.floor(Math.random() * FARBEN.length)], herz: Math.random() < 0.3 });
      naechste = jetzt + 280 + Math.random() * 520;
    }
    function explodiere(r) {
      const n = r.herz ? 70 : 56 + Math.floor(Math.random() * 30);
      const kraft = 2.2 + Math.random() * 1.8;
      const zweite = FARBEN[Math.floor(Math.random() * FARBEN.length)];
      for (let k = 0; k < n; k++) {
        let vx, vy;
        if (r.herz) {
          // Funken in Herzform
          const t = (k / n) * Math.PI * 2;
          vx = 16 * Math.pow(Math.sin(t), 3) / 16 * kraft * 1.15;
          vy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) / 16 * kraft * 1.15;
        } else {
          const w = Math.random() * Math.PI * 2, s = kraft * (0.4 + Math.random() * 0.6);
          vx = Math.cos(w) * s; vy = Math.sin(w) * s;
        }
        funken.push({ x: r.x, y: r.y, vx, vy, leben: 1, abbau: 0.009 + Math.random() * 0.008, farbe: k % 3 ? r.farbe : zweite, g: 1.4 + Math.random() * 1.4 });
      }
    }
    function bild(jetzt) {
      const t = jetzt - start;
      c.globalCompositeOperation = "destination-out";
      c.fillStyle = "rgba(0,0,0,.22)";
      c.fillRect(0, 0, W, H);
      c.globalCompositeOperation = "lighter";
      if (t < DAUER - 2500 && jetzt >= naechste) starteRakete(jetzt);
      for (let i = raketen.length - 1; i >= 0; i--) {
        const r = raketen[i];
        r.y += r.vy; r.vy *= 0.985;
        c.fillStyle = r.farbe;
        c.fillRect(r.x - 1, r.y, 2, 7);
        if (r.y <= r.ziel || r.vy > -1.2) { explodiere(r); raketen.splice(i, 1); }
      }
      for (let i = funken.length - 1; i >= 0; i--) {
        const f = funken[i];
        f.x += f.vx; f.y += f.vy; f.vx *= 0.985; f.vy = f.vy * 0.985 + 0.035; f.leben -= f.abbau;
        if (f.leben <= 0) { funken.splice(i, 1); continue; }
        c.globalAlpha = Math.min(1, f.leben * 1.4);
        c.fillStyle = f.farbe;
        c.beginPath(); c.arc(f.x, f.y, f.g, 0, Math.PI * 2); c.fill();
      }
      c.globalAlpha = 1;
      if (t < DAUER) requestAnimationFrame(bild);
      else { window.removeEventListener("resize", groesse); zu(); }
    }
    requestAnimationFrame(bild);
  }

  /* ---------- Wann? ---------- */
  function pruefe() {
    if (!ak.intro.bereit()) return;
    const d = ak.intro.datum();
    if (d.jahr === JAHR && d.monat === 12 && d.tag === 31 && d.stunde === 23 && d.minute === 59 && d.sekunde >= 50) {
      if (!laeuft && !gesehen()) zeigeZahl(60 - d.sekunde);
      return;
    }
    if (d.jahr === NEU && d.monat === 1 && d.tag <= 6 && !gesehen()) {
      const intro = document.getElementById("intro");
      if (countdown || !intro || intro.hidden) feuerwerk();
    }
  }
  setInterval(pruefe, 250);

  window.adventkalender.neujahr = { feuerwerk, zuruecksetzen: () => { try { localStorage.removeItem(SCHLUESSEL); } catch (_) { /* egal */ } } };
})();
