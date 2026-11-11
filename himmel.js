/*
 * ===========================================================
 *  HIMMEL: Sonnenaufgang, Mittagssonne mit wechselndem Wetter,
 *  Mond mit echter Mondphase und Sternschnuppen.
 *  Läuft auf dem Countdown-Bildschirm und auf dem Kalender.
 * ===========================================================
 */
(function () {
  "use strict";

  const ak = window.adventkalender;
  if (!ak || !ak.intro) return;
  const html = document.documentElement;
  const intro = document.getElementById("intro");
  const ruhig = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  html.classList.add("himmel-neu");

  /* ---------- Zwei Himmel: hinter dem Kalender und hinter dem Umschlag ---------- */
  function baueHimmel(ziel, vorne) {
    const h = document.createElement("div");
    h.className = "himmel2";
    h.setAttribute("aria-hidden", "true");
    h.innerHTML =
      '<div class="h2-glut"></div>' +
      '<div class="h2-sonne"><div class="h2-strahlen"></div></div>' +
      '<div class="h2-wolken"></div>' +
      '<div class="h2-dunst"></div>' +
      '<svg class="h2-mond" viewBox="-30 -30 60 60"><defs><radialGradient id="mondlicht' + (vorne ? "v" : "h") + '"><stop offset="0" stop-color="#fffbe8"/><stop offset="1" stop-color="#f6e7b4"/></radialGradient></defs>' +
      '<clipPath id="mondclip' + (vorne ? "v" : "h") + '"><path class="h2-mond-clip"/></clipPath>' +
      '<circle r="25" fill="rgba(240,232,210,.13)"/><path class="h2-mond-licht" fill="url(#mondlicht' + (vorne ? "v" : "h") + ')"/>' +
      '<g class="h2-krater" clip-path="url(#mondclip' + (vorne ? "v" : "h") + ')" fill="rgba(200,185,150,.35)"><circle cx="-8" cy="-6" r="3.5"/><circle cx="6" cy="8" r="4.5"/><circle cx="9" cy="-9" r="2.3"/><circle cx="-6" cy="11" r="2"/></g></svg>' +
      '<div class="h2-schnuppen"></div>';
    if (vorne) ziel.prepend(h); else ziel.appendChild(h);
    return h;
  }
  const hinten = baueHimmel(document.querySelector(".himmel") || document.body, false);
  const vorne = intro ? baueHimmel(intro, true) : null;
  const himmelListe = [hinten, vorne].filter(Boolean);

  /* ---------- Mondphase ---------- */
  // Bekannter Neumond: 6. Januar 2000, 18:14 UTC. Ein Mondzyklus dauert 29,53 Tage.
  function mondphase(ms) {
    const tage = (ms - Date.UTC(2000, 0, 6, 18, 14)) / 86400000;
    const p = (tage / 29.530588853) % 1;
    return p < 0 ? p + 1 : p;
  }
  // Leuchtender Teil der Mondscheibe (Radius 25), zunehmend rechts, abnehmend links
  function mondPfad(p) {
    const r = 25;
    const zunehmend = p < 0.5;
    const t = Math.cos(2 * Math.PI * p);           // 1 = Neumond, -1 = Vollmond
    const rx = Math.abs(t) * r;
    const sweepAussen = zunehmend ? 1 : 0;
    // Terminator: bei Sichel zur hellen Seite gewölbt, bei Dreiviertel zur dunklen
    const sweepInnen = (t > 0) === zunehmend ? 0 : 1;
    return "M0 " + -r + " A" + r + " " + r + " 0 0 " + sweepAussen + " 0 " + r +
      " A" + rx.toFixed(2) + " " + r + " 0 0 " + sweepInnen + " 0 " + -r + "Z";
  }
  function mondName(p) {
    if (p < 0.03 || p > 0.97) return "Neumond";
    if (p < 0.22) return "zunehmende Sichel";
    if (p < 0.28) return "zunehmender Halbmond";
    if (p < 0.47) return "zunehmender Mond";
    if (p < 0.53) return "Vollmond";
    if (p < 0.72) return "abnehmender Mond";
    if (p < 0.78) return "abnehmender Halbmond";
    return "abnehmende Sichel";
  }

  /* ---------- Wetter für den Tag (immer gleich für denselben Tag) ---------- */
  function wetter(d) {
    // An ihrem Geburtstag und an Heiligabend scheint immer die Sonne
    if ((d.monat === 11 && d.tag === 26) || (d.monat === 12 && d.tag === 24)) return { name: "sonnig", hell: 1, wolken: 1, dunst: 0 };
    const z = Math.abs(Math.sin(d.jahr * 31 + d.monat * 97 + d.tag * 13.37)) * 1000 % 1;
    if (z < 0.4) return { name: "sonnig", hell: 1, wolken: 1, dunst: 0 };
    if (z < 0.75) return { name: "leicht bewölkt", hell: 0.85, wolken: 3, dunst: 0.12 };
    return { name: "diesig", hell: 0.7, wolken: 4, dunst: 0.26 };
  }
  const WOLKE = '<svg viewBox="0 0 120 50"><path d="M18 46h86a16 16 0 0 0 0-32 22 22 0 0 0-40-8 18 18 0 0 0-30 8 16 16 0 0 0-16 32z" fill="#fff"/></svg>';
  function setzeWolken(h, anzahl, tag) {
    const box = h.querySelector(".h2-wolken");
    if (+box.dataset.anzahl === anzahl && box.dataset.tag === String(tag)) return;
    box.dataset.anzahl = anzahl; box.dataset.tag = tag;
    box.innerHTML = "";
    for (let k = 0; k < anzahl; k++) {
      const w = document.createElement("span");
      w.className = "h2-wolke";
      w.innerHTML = WOLKE;
      w.style.top = 4 + ((k * 37 + tag * 11) % 26) + "%";
      w.style.width = 110 + ((k * 53 + tag) % 90) + "px";
      w.style.animationDuration = 70 + k * 23 + "s";
      w.style.animationDelay = -((k * 41 + tag * 7) % 70) + "s";
      w.style.opacity = 0.55 + (k % 3) * 0.15;
      box.appendChild(w);
    }
  }

  /* ---------- Sternschnuppen ---------- */
  function sternschnuppe() {
    const zeit = html.getAttribute("data-tageszeit");
    if (zeit !== "nacht" || ruhig || document.hidden) return;
    const h = vorne && !intro.hidden ? vorne : hinten;
    const box = h.querySelector(".h2-schnuppen");
    const s = document.createElement("span");
    s.className = "h2-schnuppe";
    const x = 10 + Math.random() * 75, y = 3 + Math.random() * 30;
    const winkel = 18 + Math.random() * 22, laenge = 160 + Math.random() * 160;
    s.style.left = x + "%"; s.style.top = y + "%";
    s.style.setProperty("--winkel", winkel + "deg");
    box.appendChild(s);
    const dx = Math.cos(winkel * Math.PI / 180) * laenge, dy = Math.sin(winkel * Math.PI / 180) * laenge;
    s.animate([
      { transform: "translate(0,0) rotate(" + winkel + "deg) scaleX(.2)", opacity: 0 },
      { opacity: 1, offset: 0.15 },
      { transform: "translate(" + dx + "px," + dy + "px) rotate(" + winkel + "deg) scaleX(1)", opacity: 0 },
    ], { duration: 900 + Math.random() * 500, easing: "ease-in", fill: "forwards" }).finished.then(() => s.remove(), () => s.remove());
  }
  (function planen() {
    setTimeout(() => { sternschnuppe(); planen(); }, 5000 + Math.random() * 10000);
  })();

  /* ---------- Himmel je nach Uhrzeit einstellen ---------- */
  function aktualisiere() {
    if (!ak.intro.bereit()) return;
    const d = ak.intro.datum();
    const zeit = html.getAttribute("data-tageszeit") || "mittag";
    const minuten = d.stunde * 60 + d.minute;
    const p = mondphase(Date.UTC(d.jahr, d.monat - 1, d.tag, 20));
    const w = wetter(d);
    html.dataset.wetter = w.name === "sonnig" ? "sonnig" : w.name === "diesig" ? "diesig" : "wolkig";
    for (const h of himmelListe) {
      h.dataset.zeit = zeit;
      const sonne = h.querySelector(".h2-sonne");
      const glut = h.querySelector(".h2-glut");
      const dunst = h.querySelector(".h2-dunst");
      // Morgens: Sonnenaufgang von 6:00 (am Horizont) bis 9:00
      if (zeit === "morgen") {
        const t = Math.max(0, Math.min(1, (minuten - 360) / 180));
        sonne.style.left = (12 + t * 10) + "%";
        sonne.style.top = (82 - t * 58) + "%";
        sonne.style.setProperty("--sonnenfarbe", "hsl(" + (18 + t * 28) + " 100% " + (60 + t * 10) + "%)");
        sonne.style.opacity = 0.95;
        glut.style.opacity = (1 - t * 0.6).toFixed(2);
        dunst.style.opacity = 0;
        setzeWolken(h, 1, d.tag);
      } else if (zeit === "vormittag" || zeit === "mittag" || zeit === "nachmittag") {
        // Tagsüber: Sonne zieht über den Himmel, Helligkeit je nach Wetter
        const t = Math.max(0, Math.min(1, (minuten - 540) / (990 - 540)));
        sonne.style.left = (20 + t * 66) + "%";
        sonne.style.top = (10 + Math.pow(Math.abs(t - 0.45) / 0.55, 2) * 18) + "%";
        sonne.style.setProperty("--sonnenfarbe", zeit === "nachmittag" ? "hsl(" + (40 - t * 12) + " 100% 66%)" : "hsl(48 100% 72%)");
        sonne.style.opacity = w.hell;
        glut.style.opacity = zeit === "nachmittag" ? (0.25 + t * 0.4).toFixed(2) : 0;
        dunst.style.opacity = w.dunst;
        setzeWolken(h, w.wolken, d.tag);
      } else {
        sonne.style.opacity = 0;
        glut.style.opacity = 0;
        dunst.style.opacity = 0;
        setzeWolken(h, 0, d.tag);
      }
      // Abends und nachts: Mond mit der echten Phase des Tages
      const mond = h.querySelector(".h2-mond");
      mond.querySelector(".h2-mond-licht").setAttribute("d", mondPfad(p));
      mond.querySelector(".h2-mond-clip").setAttribute("d", mondPfad(p));
      mond.setAttribute("aria-label", mondName(p));
      mond.style.opacity = zeit === "abend" ? 0.8 : zeit === "nacht" ? 1 : 0;
      mond.style.top = zeit === "abend" ? "13%" : "7%";
      mond.style.right = zeit === "abend" ? "16%" : "11%";
    }
  }
  setInterval(aktualisiere, 10000);
  const start = setInterval(() => { if (ak.intro.bereit()) { aktualisiere(); clearInterval(start); } }, 200);
  new MutationObserver(aktualisiere).observe(html, { attributes: true, attributeFilter: ["data-tageszeit"] });

  window.adventkalender.himmel = { mondphase, mondName, wetter, sternschnuppe, aktualisiere };
})();
