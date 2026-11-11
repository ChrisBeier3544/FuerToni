/*
 * ===========================================================
 *  HERZ IM TITEL: Antippen lässt es in viele kleine Herzen
 *  zerspringen. Sie fliegen 7 Sekunden über den Bildschirm und
 *  setzen sich danach Stück für Stück wieder zum Herz zusammen.
 * ===========================================================
 */
(function () {
  "use strict";

  const herz = document.querySelector(".titel-herz");
  if (!herz) return;
  const ruhig = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const ANZAHL = 46, FLUGZEIT = 7000;
  let laeuft = false;

  herz.addEventListener("click", () => {
    if (laeuft) return;
    laeuft = true;
    const r = herz.getBoundingClientRect();
    const mitte = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    const zeichen = herz.textContent;
    const ebene = document.createElement("div");
    ebene.className = "herz-ebene";
    document.body.appendChild(ebene);
    herz.classList.add("zersprungen");

    const W = window.innerWidth, H = window.innerHeight;
    const teile = [];
    for (let i = 0; i < ANZAHL; i++) {
      const s = document.createElement("span");
      s.className = "mini-herz";
      s.textContent = zeichen;
      const groesse = 14 + Math.random() * 16;
      s.style.fontSize = groesse + "px";
      ebene.appendChild(s);
      const w = (i / ANZAHL) * Math.PI * 2 + Math.random() * 0.3;
      const tempo = 260 + Math.random() * 380;
      teile.push({ el: s, x: mitte.x, y: mitte.y, vx: Math.cos(w) * tempo, vy: Math.sin(w) * tempo - 120,
        dreh: Math.random() * 360, vdreh: (Math.random() - 0.5) * 300, phase: Math.random() * 6.28, g: groesse, heim: false, fertig: false });
    }
    const start = performance.now();
    let letzte = start, angekommen = 0;
    const zurueckAb = start + FLUGZEIT;

    function schritt(t) {
      const dt = Math.min(0.04, (t - letzte) / 1000);
      letzte = t;
      // aktuelles Ziel: das Herz (bewegt sich beim Scrollen mit)
      const hr = herz.getBoundingClientRect();
      const ziel = { x: hr.left + hr.width / 2, y: hr.top + hr.height / 2 };
      teile.forEach((p, i) => {
        if (p.fertig) return;
        if (t < zurueckAb) {
          // frei herumfliegen: sanft schweben, an den Rändern abprallen
          p.phase += dt * 2;
          p.vx += Math.cos(p.phase) * 40 * dt;
          p.vy += Math.sin(p.phase * 0.8) * 40 * dt;
          const v = Math.hypot(p.vx, p.vy), max = 260, min = 70;
          if (v > max) { p.vx *= 0.985; p.vy *= 0.985; } else if (v < min) { p.vx *= 1.03; p.vy *= 1.03; }
          p.x += p.vx * dt; p.y += p.vy * dt;
          if (p.x < 10 || p.x > W - 10) { p.vx *= -1; p.x = Math.max(10, Math.min(W - 10, p.x)); }
          if (p.y < 10 || p.y > H - 10) { p.vy *= -1; p.y = Math.max(10, Math.min(H - 10, p.y)); }
          p.dreh += p.vdreh * dt;
        } else {
          // Stück für Stück zurück: alle 90 ms macht sich das nächste Herz auf den Weg
          if (!p.heim && t > zurueckAb + i * 90) { p.heim = true; p.heimStart = t; p.von = { x: p.x, y: p.y }; }
          if (p.heim) {
            const u = Math.min(1, (t - p.heimStart) / 700);
            const e = 1 - Math.pow(1 - u, 3);
            p.x = p.von.x + (ziel.x - p.von.x) * e;
            p.y = p.von.y + (ziel.y - p.von.y) * e - Math.sin(u * Math.PI) * 40;
            p.dreh *= 0.9;
            p.el.style.opacity = String(1 - u * 0.9);
            if (u >= 1) {
              p.fertig = true; p.el.remove(); angekommen++;
              // das Herz wächst mit jedem heimgekehrten Herzchen
              const anteil = angekommen / ANZAHL;
              herz.style.setProperty("--herz-skala", (0.25 + anteil * 0.75).toFixed(3));
              herz.classList.add("waechst");
            }
          }
        }
        const skala = p.heim ? 1 - Math.min(1, (t - p.heimStart) / 700) * 0.6 : 1;
        p.el.style.transform = "translate(" + (p.x - p.g / 2).toFixed(1) + "px," + (p.y - p.g / 2).toFixed(1) + "px) rotate(" + p.dreh.toFixed(0) + "deg) scale(" + skala.toFixed(2) + ")";
      });
      if (angekommen < ANZAHL) requestAnimationFrame(schritt);
      else {
        ebene.remove();
        herz.classList.remove("zersprungen", "waechst");
        herz.style.removeProperty("--herz-skala");
        herz.classList.add("pocht");
        setTimeout(() => { herz.classList.remove("pocht"); laeuft = false; }, 900);
      }
    }
    if (ruhig) {
      setTimeout(() => { ebene.remove(); herz.classList.remove("zersprungen"); laeuft = false; }, 800);
      return;
    }
    requestAnimationFrame(schritt);
  });
})();
