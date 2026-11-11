/*
 * ===========================================================
 *  VORFREUDE vom 26. bis 30. November
 *  Geburtstagsmodus, die Capy Crew baut den Kalender auf,
 *  Adventskranz ab dem 1. Advent und tägliche Postkarten.
 * ===========================================================
 */
(function () {
  "use strict";

  const ak = window.adventkalender;
  if (!ak || !ak.intro) return;
  const grafik = window.capyGrafik;
  const ruhig = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const intro = document.getElementById("intro");
  const lichterkette = document.getElementById("lichterkette");
  const kranzBox = document.getElementById("adventskranz");
  const JAHR = KALENDER.jahr;

  const zwei = (z) => String(z).padStart(2, "0");
  const schluessel = (d) => zwei(d.monat) + "-" + zwei(d.tag);
  // Datumswert zum Vergleichen, z. B. 11 * 100 + 28 = 1128
  const wert = (d) => (d.jahr - JAHR) * 10000 + d.monat * 100 + d.tag;
  const ab = (d, monat, tag) => wert(d) >= monat * 100 + tag;

  /* ---------- Adventskranz ---------- */
  const ADVENTE = [[11, 29], [12, 6], [12, 13], [12, 20]];
  function kerzenAn(d) {
    if (d.jahr > JAHR) return 4;
    return ADVENTE.filter(([m, t]) => ab(d, m, t)).length;
  }
  function baueKranz() {
    let zweige = "";
    for (let k = 0; k < 26; k++) {
      const w = (k / 26) * Math.PI * 2;
      const x = 130 + Math.cos(w) * 92, y = 92 + Math.sin(w) * 34;
      zweige += '<ellipse cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" rx="22" ry="11" transform="rotate(' + ((w * 180) / Math.PI + 20).toFixed(0) + " " + x.toFixed(1) + " " + y.toFixed(1) + ')" fill="' + (k % 2 ? "#2f6a45" : "#3f7f55") + '"/>';
    }
    let deko = "";
    for (let k = 0; k < 10; k++) {
      const w = (k / 10) * Math.PI * 2 + 0.3;
      const x = 130 + Math.cos(w) * 96, y = 94 + Math.sin(w) * 36;
      deko += k % 2
        ? '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="5" fill="#d6304f"/><circle cx="' + (x + 6).toFixed(1) + '" cy="' + (y + 2).toFixed(1) + '" r="4" fill="#e8455f"/>'
        : '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="5.5" fill="#f3c84b"/><circle cx="' + (x - 1.6).toFixed(1) + '" cy="' + (y - 1.8).toFixed(1) + '" r="1.6" fill="#fff" opacity=".6"/>';
    }
    const kerzen = [[62, 78], [106, 64], [154, 64], [198, 78]].map(([x, y], i) =>
      '<g class="kerze" data-nr="' + i + '">' +
      '<rect x="' + (x - 9) + '" y="' + (y - 46) + '" width="18" height="50" rx="3" fill="#d6304f"/>' +
      '<rect x="' + (x - 9) + '" y="' + (y - 46) + '" width="5" height="50" rx="2" fill="#fff" opacity=".2"/>' +
      '<path d="M' + (x - 9) + " " + (y - 42) + " q4 6 6 0 q3 8 6 0 q3 5 6 0 v-4 h-18z" + '" fill="#fff" opacity=".85"/>' +
      '<path d="M' + x + " " + (y - 46) + " v-5" + '" stroke="#3a2418" stroke-width="1.6"/>' +
      '<g class="flamme"><ellipse cx="' + x + '" cy="' + (y - 58) + '" rx="10" ry="12" fill="#ffd36b" opacity=".35"/>' +
      '<path d="M' + x + " " + (y - 68) + " c6 7 6 12 0 15 c-6 -3 -6 -8 0 -15z" + '" fill="#ffb648"/>' +
      '<path d="M' + x + " " + (y - 62) + " c2.6 3 2.6 5.4 0 7 c-2.6 -1.6 -2.6 -4 0 -7z" + '" fill="#fff2b0"/></g></g>').join("");
    kranzBox.innerHTML =
      '<svg viewBox="0 0 260 150" role="img" aria-label="Adventskranz">' +
      '<ellipse cx="130" cy="104" rx="118" ry="36" fill="rgba(107,21,50,.12)"/>' +
      '<g class="kranz-hinten">' + zweige + "</g>" + kerzen + deko +
      "</svg>" +
      '<p class="kranz-text" id="kranz-text"></p>';
  }
  function aktualisiereKranz(d, sofort) {
    const n = kerzenAn(d);
    kranzBox.hidden = n === 0;
    kranzBox.querySelectorAll(".kerze").forEach((k, i) => k.classList.toggle("brennt", i < n || sofort === i));
    const t = document.getElementById("kranz-text");
    if (t) t.textContent = n ? ["", "1. Advent", "2. Advent", "3. Advent", "4. Advent"][n] + " 🕯️" : "";
  }

  /* ---------- Bühne für die kleinen Aufbau-Szenen ---------- */
  let buehne = null;
  function neueBuehne(titel) {
    buehne = document.createElement("div");
    buehne.className = "aufbau-buehne";
    const t = document.createElement("p");
    t.className = "special-titel";
    t.textContent = titel;
    buehne.appendChild(t);
    document.body.appendChild(buehne);
    return buehne;
  }
  function figur(html, stil) {
    const f = document.createElement("div");
    f.className = "sp-figur";
    f.innerHTML = html;
    Object.assign(f.style, { position: "fixed" }, stil || {});
    buehne.appendChild(f);
    return f;
  }
  function funkeln(x, y, n, zeichen) {
    for (let k = 0; k < n; k++) {
      const s = document.createElement("span");
      s.className = "sp-partikel";
      s.textContent = zeichen || "✨";
      s.style.position = "fixed";
      s.style.left = x + "px"; s.style.top = y + "px";
      buehne.appendChild(s);
      const w = (k / n) * Math.PI * 2, r = 30 + Math.random() * 40;
      s.animate([
        { transform: "translate(-50%,-50%) scale(.3)", opacity: 1 },
        { transform: "translate(calc(-50% + " + Math.cos(w) * r + "px), calc(-50% + " + Math.sin(w) * r + "px)) scale(1)", opacity: 0 },
      ], { duration: 1100, easing: "ease-out", fill: "forwards" });
    }
  }
  function ende(dauer) {
    return new Promise((fertig) => setTimeout(() => {
      if (buehne) { const b = buehne; b.classList.add("vorbei"); setTimeout(() => b.remove(), 700); buehne = null; }
      fertig();
    }, dauer));
  }
  const warte = (ms) => new Promise((r) => setTimeout(r, ms));
  // Warten, bis kein Fenster (Türchen, Spiel, Gutschein …) mehr offen ist
  async function bisFrei() {
    while (document.querySelector("dialog[open]") || document.querySelector(".special-buehne")) await warte(400);
  }
  function hinScrollen(el) {
    const r = el.getBoundingClientRect();
    if (r.top < 90 || r.bottom > window.innerHeight - 60) el.scrollIntoView({ behavior: ruhig ? "auto" : "smooth", block: "center" });
    return warte(ruhig ? 50 : 900);
  }

  const SZENEN = {
    // 29.11.: der Adventskranz kommt, die erste Kerze geht an
    "11-29": async () => {
      kranzBox.hidden = false;
      aktualisiereKranz({ jahr: JAHR, monat: 11, tag: 28 });
      kranzBox.hidden = false;
      await hinScrollen(kranzBox);
      neueBuehne("Heute ist der 1. Advent 🕯️");
      kranzBox.animate([{ transform: "translateY(-60px) scale(.8)", opacity: 0 }, { transform: "translateY(6px) scale(1.03)", opacity: 1 }, { transform: "none", opacity: 1 }],
        { duration: ruhig ? 1 : 1100, easing: "ease-out" });
      const r = kranzBox.getBoundingClientRect();
      const gr = Math.min(window.innerWidth * 0.2, 90);
      const c = figur(grafik.seite(), { width: gr + "px", left: Math.max(4, r.left - gr * 0.55) + "px", top: r.top + r.height * 0.2 + "px", zIndex: 3 });
      c.animate([{ opacity: 0, transform: "translateX(-30px)" }, { opacity: 1, transform: "none" }], { duration: 700, delay: 500, fill: "both" });
      await warte(2000);
      aktualisiereKranz(ak.intro.datum());
      const k = kranzBox.querySelector('.kerze[data-nr="0"]').getBoundingClientRect();
      funkeln(k.left + k.width / 2, k.top, 10);
      return ende(4500);
    },
  };

  /* ---------- Postkarte ---------- */
  const karte = document.getElementById("postkarte");
  const karteKnopf = document.getElementById("postkarte-knopf");
  karte.querySelector(".schliessen").addEventListener("click", () => karte.close());
  karte.addEventListener("click", (e) => { if (e.target === karte) karte.close(); });
  function heutigeKarte(d) {
    return d.jahr === JAHR && KALENDER.postkarten ? KALENDER.postkarten[schluessel(d)] : null;
  }
  function zeigeKarte(mitPostbote) {
    const d = ak.intro.datum();
    const k = heutigeKarte(d);
    if (!k) return Promise.resolve();
    document.getElementById("postkarte-titel").textContent = k.titel;
    document.getElementById("postkarte-text").textContent = k.text;
    const bild = document.getElementById("postkarte-bild");
    bild.hidden = !k.bild;
    if (k.bild) bild.src = "bilder/klein/" + k.bild;
    bild.style.objectPosition = k.fokus || "";
    document.getElementById("postkarte-stempel").textContent = "KÖLN · " + d.tag + ". NOV.";
    const oeffnen = () => { if (typeof karte.showModal === "function") karte.showModal(); else karte.setAttribute("open", ""); };
    if (!mitPostbote || ruhig || !grafik) { oeffnen(); return Promise.resolve(); }
    // Ein Capy-Postbote bringt die Karte
    neueBuehne("Post für dich! 📮");
    const gr = Math.min(window.innerWidth * 0.3, 130);
    const bote = figur(grafik.seite({ hut: "muetze" }) + '<span class="post-brief">✉️</span>', { width: gr + "px", left: "0", bottom: "12%", zIndex: 3 });
    bote.firstChild.style.transform = "scaleX(-1)";
    bote.animate([{ transform: "translateX(" + (window.innerWidth + 20) + "px)" }, { transform: "translateX(" + (window.innerWidth / 2 - gr / 2) + "px)" }],
      { duration: 1800, easing: "ease-out", fill: "forwards" });
    return warte(2000).then(() => { oeffnen(); return ende(300); });
  }
  karteKnopf.addEventListener("click", () => zeigeKarte(false));

  /* ---------- Geburtstags-Ballons am Rand ---------- */
  function baueBallons() {
    const box = document.createElement("div");
    box.className = "geb-ballons";
    box.setAttribute("aria-hidden", "true");
    const farben = ["#e85d7e", "#f3c84b", "#7cc4f0", "#9be3b0", "#b39ddb", "#fda4b8"];
    for (let i = 0; i < 6; i++) {
      const b = document.createElement("span");
      b.className = "geb-ballon " + (i < 3 ? "links" : "rechts");
      b.style.setProperty("--farbe", farben[i]);
      b.style.top = 18 + (i % 3) * 26 + "%";
      b.style.animationDelay = -i * 0.9 + "s";
      box.appendChild(b);
    }
    document.body.appendChild(box);
  }

  function karteSchonGezeigt(tag) {
    try { return localStorage.getItem("toni-postkarte-" + JAHR + "-" + tag) === "1"; } catch (_) { return false; }
  }
  function merkeKarte(tag) {
    try { localStorage.setItem("toni-postkarte-" + JAHR + "-" + tag, "1"); } catch (_) { /* egal */ }
  }

  /* ---------- Ablauf ---------- */
  baueKranz();
  baueBallons();
  let gestartet = false;
  async function ablauf() {
    const d = ak.intro.datum();
    const vorDezember = d.jahr === JAHR && d.monat === 11;
    const bau = window.capyAufbau;
    if (bau) bau.zustand(d);
    aktualisiereKranz(d);
    karteKnopf.hidden = !heutigeKarte(d);
    if (gestartet || !intro.hidden) return;
    gestartet = true;
    const tag = schluessel(d);
    // 27., 28. und 30.: erst die Postkarte, dann baut die Capy Crew am Kalender
    if (vorDezember && bau && bau.hatAnimation(d.tag) && !ruhig) {
      await warte(800);
      await bisFrei();
      if (!karteSchonGezeigt(tag)) {
        await zeigeKarte(true);
        merkeKarte(tag);
        await bisFrei();
        await warte(500);
      }
      if (!bau.istFertig(d.tag)) await bau.spiele(d.tag);
      return;
    }
    let gesehen = false;
    try { gesehen = sessionStorage.getItem("toni-vorfreude-" + tag) === "1"; } catch (_) { /* egal */ }
    if (gesehen || !vorDezember) return;
    try { sessionStorage.setItem("toni-vorfreude-" + tag, "1"); } catch (_) { /* egal */ }
    await warte(800);
    await bisFrei();
    if (SZENEN[tag] && grafik && !ruhig) await SZENEN[tag]();
    if (heutigeKarte(d) && !karteSchonGezeigt(tag)) {
      await warte(400);
      await bisFrei();
      await zeigeKarte(true);
      merkeKarte(tag);
    }
  }
  setInterval(() => { if (ak.intro.bereit() && ak.intro.phase() === "offen") ablauf(); }, 500);
})();
