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
      '<div class="h2-schnuppen"></div>' +
      '<div class="h2-niederschlag"></div><div class="h2-blitz"></div>';
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

  /* ---------- Echtes Wetter in Köln Merheim (Open-Meteo, ohne Schlüssel) ---------- */
  const WETTER_URL = "https://api.open-meteo.com/v1/forecast?latitude=50.954&longitude=7.057" +
    "&current=temperature_2m,weather_code,cloud_cover,precipitation,wind_speed_10m,is_day&timezone=Europe%2FBerlin";
  const CACHE = "toni-wetter-koeln";
  let live = null;
  // Nur zum Testen: ?wetter=regen (klar, wolkig, bedeckt, nebel, niesel, regen, starkregen, schnee, gewitter)
  const TEST_CODES = { klar: 0, heiter: 1, wolkig: 2, bedeckt: 3, nebel: 45, niesel: 53, regen: 63, starkregen: 65, schnee: 73, schneesturm: 75, gewitter: 95 };
  const testWetter = new URLSearchParams(location.search).get("wetter");
  if (testWetter && TEST_CODES[testWetter] !== undefined) {
    const c = TEST_CODES[testWetter];
    live = { code: c, wolken: c === 0 ? 5 : c === 1 ? 30 : c === 2 ? 60 : 100, wind: c >= 95 ? 40 : 15, zeit: Date.now(), test: true };
  }
  function liesCache() {
    try { const v = JSON.parse(localStorage.getItem(CACHE) || "null"); return v && Date.now() - v.zeit < 14 * 60000 ? v : null; } catch (_) { return null; }
  }
  async function holeWetter() {
    if (live && live.test) return;
    const c = liesCache();
    if (c) { live = c; aktualisiere(); return; }
    try {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 8000);
      const a = await fetch(WETTER_URL, { signal: ctrl.signal, cache: "no-store" });
      clearTimeout(t);
      if (!a.ok) return;
      const j = await a.json();
      const cur = j && j.current;
      if (!cur || typeof cur.weather_code !== "number") return;
      live = { code: cur.weather_code, wolken: cur.cloud_cover || 0, wind: cur.wind_speed_10m || 0, temperatur: cur.temperature_2m, zeit: Date.now() };
      try { localStorage.setItem(CACHE, JSON.stringify(live)); } catch (_) { /* egal */ }
      aktualisiere();
    } catch (_) { /* ohne Netz bleibt das ausgedachte Wetter */ }
  }
  // Echtes Wetter nur für die echte Gegenwart (nicht bei einer Zeitreise)
  function liveGilt(d) {
    if (!live) return false;
    const zr = ak.zeitreise;
    if (zr && zr.aktiv()) return false;
    const e = zr && zr.echtDatum && zr.echtDatum();
    return !e || (e.jahr === d.jahr && e.monat === d.monat && e.tag === d.tag);
  }
  // WMO Wettercode in Bild übersetzen
  function ausLive(l) {
    const c = l.code, n = Math.round(Math.min(100, l.wolken) / 100 * 7);
    const schief = Math.min(30, l.wind * 0.6);
    const w = (name, hell, wolken, dunst, extra) => Object.assign({ name, hell, wolken, dunst, niederschlag: null, staerke: 0, schief, grau: false, blitz: false }, extra || {});
    if (c === 0) return w("sonnig", 1, Math.min(n, 1), 0);
    if (c === 1) return w("sonnig", 1, Math.max(1, Math.min(n, 3)), 0);
    if (c === 2) return w("leicht bewölkt", 0.85, Math.max(3, n), 0.1);
    if (c === 3) return w("bedeckt", 0.3, 7, 0.28, { grau: true });
    if (c === 45 || c === 48) return w("nebel", 0.25, 2, 0.75, { grau: true });
    if (c >= 51 && c <= 57) return w("regen", 0.25, 7, 0.3, { grau: true, niederschlag: "regen", staerke: 0.35 });
    if ((c >= 61 && c <= 67) || (c >= 80 && c <= 82)) {
      const stark = c === 65 || c === 67 || c === 82 ? 1 : c === 63 || c === 81 ? 0.7 : 0.45;
      return w("regen", 0.2, 7, 0.32, { grau: true, niederschlag: "regen", staerke: stark });
    }
    if ((c >= 71 && c <= 77) || c === 85 || c === 86) {
      const stark = c === 75 || c === 86 ? 1 : c === 73 ? 0.7 : 0.45;
      return w("schnee", 0.35, 6, 0.3, { grau: true, niederschlag: "schnee", staerke: stark });
    }
    if (c >= 95) return w("gewitter", 0.1, 7, 0.4, { grau: true, niederschlag: "regen", staerke: 1, blitz: true });
    return w("leicht bewölkt", 0.85, Math.max(2, n), 0.1);
  }

  /* ---------- Wetter für den Tag ---------- */
  const SONNE = { name: "sonnig", hell: 1, wolken: 1, dunst: 0, niederschlag: null, staerke: 0, schief: 0, grau: false, blitz: false };
  function wetter(d) {
    // An ihrem Geburtstag und an Heiligabend scheint immer die Sonne
    if ((d.monat === 11 && d.tag === 26) || (d.monat === 12 && d.tag === 24)) return SONNE;
    if (liveGilt(d)) return ausLive(live);
    // ohne echte Daten: ausgedachtes Wetter, immer gleich für denselben Tag
    const z = Math.abs(Math.sin(d.jahr * 31 + d.monat * 97 + d.tag * 13.37)) * 1000 % 1;
    if (z < 0.4) return SONNE;
    if (z < 0.75) return Object.assign({}, SONNE, { name: "leicht bewölkt", hell: 0.85, wolken: 3, dunst: 0.12 });
    return Object.assign({}, SONNE, { name: "diesig", hell: 0.7, wolken: 4, dunst: 0.26 });
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

  /* ---------- Regen, Schnee und Blitze ---------- */
  function setzeNiederschlag(h, art, staerke, schief) {
    const box = h.querySelector(".h2-niederschlag");
    const schluessel = (art || "") + "|" + staerke + "|" + Math.round(schief);
    if (box.dataset.schluessel === schluessel) return;
    box.dataset.schluessel = schluessel;
    box.innerHTML = "";
    box.className = "h2-niederschlag" + (art ? " " + art : "");
    if (!art || ruhig) return;
    const anzahl = Math.round((art === "regen" ? 120 : 80) * staerke) + 20;
    box.style.setProperty("--schief", (art === "regen" ? schief : schief * 0.5) + "deg");
    for (let k = 0; k < anzahl; k++) {
      const t = document.createElement("i");
      t.style.left = (Math.random() * 120 - 10) + "%";
      t.style.animationDuration = (art === "regen" ? 0.55 + Math.random() * 0.4 : 5 + Math.random() * 6) + "s";
      t.style.animationDelay = -Math.random() * 8 + "s";
      if (art === "schnee") { const g = 3 + Math.random() * 5; t.style.width = t.style.height = g + "px"; t.style.opacity = 0.5 + Math.random() * 0.5; }
      else t.style.opacity = 0.35 + Math.random() * 0.45;
      box.appendChild(t);
    }
  }
  let blitzAn = false;
  (function blitze() {
    setTimeout(() => {
      if (blitzAn && !ruhig && !document.hidden) {
        himmelListe.forEach((h) => {
          const b = h.querySelector(".h2-blitz");
          b.animate([{ opacity: 0 }, { opacity: 0.85 }, { opacity: 0.1 }, { opacity: 0.7 }, { opacity: 0 }], { duration: 650, easing: "ease-out" });
        });
      }
      blitze();
    }, 6000 + Math.random() * 12000);
  })();

  /* ---------- Sternschnuppen ---------- */
  function sternschnuppe() {
    const zeit = html.getAttribute("data-tageszeit");
    if (zeit !== "nacht" || ruhig || document.hidden || html.classList.contains("wetter-grau")) return;
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
    html.dataset.wetter = { sonnig: "sonnig", diesig: "diesig", bedeckt: "bedeckt", nebel: "nebel", regen: "regen", schnee: "schnee", gewitter: "gewitter" }[w.name] || "wolkig";
    html.classList.toggle("wetter-grau", !!w.grau);
    blitzAn = !!w.blitz;
    const nacht = zeit === "abend" || zeit === "nacht";
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
        // nachts nur bei echtem schlechtem Wetter Wolken und Dunst
        dunst.style.opacity = w.grau ? (w.dunst * 0.6).toFixed(2) : 0;
        setzeWolken(h, w.grau ? Math.min(w.wolken, 5) : 0, d.tag);
      }
      if (zeit === "morgen" && w.grau) { sonne.style.opacity = w.hell; dunst.style.opacity = w.dunst; setzeWolken(h, w.wolken, d.tag); }
      setzeNiederschlag(h, w.niederschlag, w.staerke, w.schief || 0);
      // Abends und nachts: Mond mit der echten Phase des Tages
      const mond = h.querySelector(".h2-mond");
      mond.querySelector(".h2-mond-licht").setAttribute("d", mondPfad(p));
      mond.querySelector(".h2-mond-clip").setAttribute("d", mondPfad(p));
      mond.setAttribute("aria-label", mondName(p));
      mond.style.opacity = !nacht ? 0 : w.grau ? 0.3 : zeit === "abend" ? 0.8 : 1;
      mond.style.top = zeit === "abend" ? "13%" : "7%";
      mond.style.right = zeit === "abend" ? "16%" : "11%";
    }
  }
  setInterval(aktualisiere, 10000);
  const start = setInterval(() => { if (ak.intro.bereit()) { aktualisiere(); clearInterval(start); } }, 200);
  new MutationObserver(aktualisiere).observe(html, { attributes: true, attributeFilter: ["data-tageszeit"] });

  // Wetter holen und alle 15 Minuten neu
  holeWetter();
  setInterval(holeWetter, 15 * 60000);
  document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible") holeWetter(); });

  window.adventkalender.himmel = { mondphase, mondName, wetter, sternschnuppe, aktualisiere, live: () => live };
})();
