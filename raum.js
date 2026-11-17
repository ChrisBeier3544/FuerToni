/*
 * ===========================================================
 *  RAUM EINRICHTEN
 *  Am 18.11. fragt die Munkelvogeline (wenn sie da ist), ob
 *  Toni den Raum mit dem Brief neu einrichten möchte.
 *  Briefrand, Kommode, Countdown, Fenster und Fensterbank
 *  gibt es je wie bisher oder in 5 neuen Varianten.
 *  Danach bündelt „Tonis Ecke“ Spiel, Umstylen, Einrichten
 *  und Fashion Show in einem einzigen Knopf.
 * ===========================================================
 */
(function () {
  "use strict";

  const ak = window.adventkalender;
  const intro = document.getElementById("intro");
  if (!ak || !ak.intro || !intro) return;
  const ruhig = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- kleine Zeichenhilfen ---------- */
  const f2 = (n) => n.toFixed(1);
  function blume(x, y, r, f, mitte) {
    let s = "";
    for (let k = 0; k < 5; k++) { const w = (k / 5) * Math.PI * 2 - Math.PI / 2; s += '<circle cx="' + f2(x + Math.cos(w) * r * 0.62) + '" cy="' + f2(y + Math.sin(w) * r * 0.62) + '" r="' + f2(r * 0.52) + '" fill="' + f + '"/>'; }
    return s + '<circle cx="' + x + '" cy="' + y + '" r="' + f2(r * 0.38) + '" fill="' + (mitte || "#f3c84b") + '"/>';
  }
  function rose(x, y, r, f, f2r) {
    return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + f + '"/>' +
      '<path d="M' + f2(x - r * 0.62) + " " + y + " A" + f2(r * 0.62) + " " + f2(r * 0.62) + " 0 1 1 " + f2(x + r * 0.42) + " " + f2(y + r * 0.42) + '" fill="none" stroke="' + f2r + '" stroke-width="' + f2(r * 0.2) + '" stroke-linecap="round"/>' +
      '<path d="M' + f2(x - r * 0.28) + " " + f2(y + r * 0.05) + " A" + f2(r * 0.3) + " " + f2(r * 0.3) + " 0 1 1 " + f2(x + r * 0.2) + " " + f2(y + r * 0.22) + '" fill="none" stroke="' + f2r + '" stroke-width="' + f2(r * 0.17) + '" stroke-linecap="round"/>';
  }
  const blatt = (x, y, l, w, f) => '<ellipse cx="' + x + '" cy="' + y + '" rx="' + f2(l) + '" ry="' + f2(l * 0.42) + '" fill="' + f + '" transform="rotate(' + w + " " + x + " " + y + ')"/>';
  function stern(x, y, r, f, extra) {
    let d = "";
    for (let k = 0; k < 10; k++) { const rr = k % 2 ? r * 0.45 : r, w = (k / 10) * Math.PI * 2 - Math.PI / 2; d += (k ? "L" : "M") + f2(x + Math.cos(w) * rr) + " " + f2(y + Math.sin(w) * rr); }
    return '<path d="' + d + 'Z" fill="' + f + '"' + (extra || "") + "/>";
  }
  function zweig(x, y, laenge, winkel, f) {
    // Tannenzweig: Stiel mit Nadeln zu beiden Seiten
    const r = (winkel * Math.PI) / 180, dx = Math.cos(r), dy = Math.sin(r);
    let s = '<path d="M' + x + " " + y + "L" + f2(x + dx * laenge) + " " + f2(y + dy * laenge) + '" stroke="#6b4a2a" stroke-width="1.6" stroke-linecap="round"/>';
    for (let t = 0.08; t <= 1; t += 0.075) {
      const px = x + dx * laenge * t, py = y + dy * laenge * t, n = 9 * (1 - t * 0.45);
      for (const seite of [-1, 1]) {
        const w = r + seite * 0.95;
        s += '<path d="M' + f2(px) + " " + f2(py) + "L" + f2(px + Math.cos(w) * n) + " " + f2(py + Math.sin(w) * n) + '" stroke="' + f + '" stroke-width="2" stroke-linecap="round"/>';
      }
    }
    return s;
  }
  const beeren = (x, y) => '<circle cx="' + x + '" cy="' + y + '" r="3.2" fill="#d6304f"/><circle cx="' + (x + 5) + '" cy="' + (y + 2) + '" r="3" fill="#c22545"/><circle cx="' + (x + 1.5) + '" cy="' + (y + 5) + '" r="2.8" fill="#e0405f"/>' +
    '<circle cx="' + (x - 0.8) + '" cy="' + (y - 0.8) + '" r=".9" fill="#fff" opacity=".7"/>';
  const zapfen = (x, y, w) => '<g transform="rotate(' + w + " " + x + " " + y + ')"><ellipse cx="' + x + '" cy="' + y + '" rx="5" ry="8" fill="#8a5a34"/>' +
    '<path d="M' + (x - 4) + " " + (y - 3) + "h8M" + (x - 4.6) + " " + (y + 1) + "h9.2M" + (x - 4) + " " + (y + 5) + 'h8" stroke="#6b4426" stroke-width="1"/></g>';

  /* ---------- 1. Briefrand (Zeichnungen im Format des Umschlags 300 × 200) ---------- */
  function lichterRand() {
    // Kabel rund um den Umschlag, das zwischen den Haltepunkten leicht durchhängt
    const pkt = [], farben = ["#ff4d7d", "#f3c84b", "#5aa9e6", "#6fd17a", "#b87cf0", "#ff8a3d"];
    const seiten = [[[-6, -6], [306, -6]], [[306, -6], [306, 206]], [[306, 206], [-6, 206]], [[-6, 206], [-6, -6]]];
    let d = "", birnen = "", i = 0;
    for (const [[x1, y1], [x2, y2]] of seiten) {
      const len = Math.hypot(x2 - x1, y2 - y1), n = Math.round(len / 38);
      for (let k = 0; k < n; k++) {
        const a = k / n, b = (k + 1) / n;
        const ax = x1 + (x2 - x1) * a, ay = y1 + (y2 - y1) * a, bx = x1 + (x2 - x1) * b, by = y1 + (y2 - y1) * b;
        // nach außen durchhängen
        const nx = -(y2 - y1) / len, ny = (x2 - x1) / len, mx = (ax + bx) / 2 - nx * 7, my = (ay + by) / 2 - ny * 7;
        d += (d ? "" : "M" + f2(ax) + " " + f2(ay)) + "Q" + f2(mx) + " " + f2(my) + " " + f2(bx) + " " + f2(by);
        const lx = 0.25 * ax + 0.5 * mx + 0.25 * bx, ly = 0.25 * ay + 0.5 * my + 0.25 * by;
        const f = farben[i % farben.length];
        birnen += '<g class="raum-birne' + (i % 3 === 0 ? " b1" : i % 3 === 1 ? " b2" : " b3") + '"><circle cx="' + f2(lx - nx * 4) + '" cy="' + f2(ly - ny * 4) + '" r="9" fill="' + f + '" opacity=".25"/>' +
          '<ellipse cx="' + f2(lx - nx * 4) + '" cy="' + f2(ly - ny * 4) + '" rx="3.6" ry="5" fill="' + f + '" transform="rotate(' + f2((Math.atan2(-ny, -nx) * 180) / Math.PI - 90) + " " + f2(lx - nx * 4) + " " + f2(ly - ny * 4) + ')"/>' +
          '<circle cx="' + f2(lx - nx * 3) + '" cy="' + f2(ly - ny * 3) + '" r="1" fill="#fff" opacity=".8"/></g>';
        i++;
      }
    }
    return '<path d="' + d + '" fill="none" stroke="#3a5a3a" stroke-width="1.4"/>' + birnen;
  }
  function spitzenRand() {
    let s = "";
    const bogen = (x, y, w, dx, dy) => {
      // Halbkreis nach außen mit einem Loch in der Mitte
      const nx = dy, ny = -dx;
      return '<path d="M' + f2(x) + " " + f2(y) + " a" + f2(w / 2) + " " + f2(w / 2) + " 0 0 1 " + f2(dx * w) + " " + f2(dy * w) + '" fill="#fffaf5" stroke="#f0d9df" stroke-width=".8"/>' +
        '<circle cx="' + f2(x + dx * w / 2 + nx * w * 0.22) + '" cy="' + f2(y + dy * w / 2 + ny * w * 0.22) + '" r="' + f2(w * 0.11) + '" fill="#f6c3d0"/>';
    };
    for (let x = 0; x < 300; x += 15) s += bogen(x, 0, 15, 1, 0);
    for (let y = 0; y < 200; y += 15.38) s += bogen(300, y, 15.38, 0, 1);
    for (let x = 300; x > 0; x -= 15) s += bogen(x, 200, 15, -1, 0);
    for (let y = 200; y > 0; y -= 15.38) s += bogen(0, y, 15.38, 0, -1);
    s += '<rect x="5" y="5" width="290" height="190" rx="6" fill="none" stroke="#fffaf5" stroke-width="2.4" stroke-dasharray="1 4" stroke-linecap="round" opacity=".95"/>';
    return s;
  }
  function sternRand() {
    let s = '<rect x="5" y="5" width="290" height="190" rx="6" fill="none" stroke="#e0b04e" stroke-width="1.6"/><rect x="9" y="9" width="282" height="182" rx="4" fill="none" stroke="#f7d77c" stroke-width=".8"/>';
    const p = [[-2, 18, 7], [12, -6, 5], [40, -10, 4], [286, -8, 6], [306, 26, 4.5], [303, 160, 6], [272, 208, 4], [24, 206, 5.5], [-8, 120, 4], [150, -12, 3.6], [180, 210, 3.4], [-6, 70, 3.2]];
    p.forEach(([x, y, r], i) => { s += stern(x, y, r * 1.7, i % 3 ? "#f7d77c" : "#fff3c4", ' class="raum-funkel f' + (i % 3) + '"'); });
    for (const [x, y] of [[60, -4], [110, -7], [230, -5], [305, 95], [120, 205], [240, 207], [-5, 160]]) s += '<circle cx="' + x + '" cy="' + y + '" r="2.2" fill="#f7d77c"/>';
    return s;
  }
  const RAND = {
    blumen: { name: "Rosenranke", svg: () =>
      '<path d="M-4 40 Q-12 110 -5 170 Q0 208 50 206 Q150 212 250 205" fill="none" stroke="#5a9a4a" stroke-width="2.2" stroke-linecap="round"/>' +
      blatt(-9, 70, 7, 60, "#6fb35a") + blatt(-2, 100, 6.5, -50, "#5a9a4a") + blatt(-10, 135, 7, 70, "#6fb35a") + blatt(80, 211, 7, 20, "#5a9a4a") + blatt(130, 205, 6.5, -20, "#6fb35a") + blatt(190, 212, 7, 25, "#5a9a4a") + blatt(230, 205, 6, -15, "#6fb35a") +
      blume(-8, 88, 4.4, "#ffd0dc") + blume(-6, 150, 4.4, "#fff", "#f3c84b") + blume(105, 210, 4.4, "#ffb3c6") + blume(160, 208, 4.4, "#fff", "#f3c84b") + blume(212, 211, 4.2, "#ffd0dc") +
      blatt(12, 2, 9, -30, "#5a9a4a") + blatt(-2, 16, 9, 70, "#6fb35a") + blatt(28, -6, 8, 10, "#6fb35a") +
      rose(4, 2, 14, "#ff8fab", "#e85d7e") + rose(27, -7, 10.5, "#ffb3c6", "#ff76a6") + rose(-8, 26, 10, "#f2789a", "#d6457a") +
      blatt(288, 198, 9, 150, "#5a9a4a") + blatt(302, 186, 9, 250, "#6fb35a") + blatt(274, 208, 8, 190, "#6fb35a") +
      rose(296, 198, 14, "#ff8fab", "#e85d7e") + rose(273, 207, 10.5, "#ffb3c6", "#ff76a6") + rose(308, 174, 10, "#f2789a", "#d6457a") },
    tanne: { name: "Tannenzweige", svg: () =>
      zweig(-8, -6, 64, 12, "#3f7f55") + zweig(-8, -6, 56, 62, "#4f8f63") + zweig(-6, -4, 40, 36, "#2f6b45") +
      zweig(308, -6, 64, 168, "#3f7f55") + zweig(308, -6, 56, 118, "#4f8f63") + zweig(306, -4, 40, 144, "#2f6b45") +
      zweig(-8, 206, 50, -20, "#3f7f55") + zweig(-6, 206, 42, -62, "#4f8f63") + zweig(308, 206, 50, 200, "#3f7f55") + zweig(306, 206, 42, 242, "#4f8f63") +
      beeren(8, 4) + beeren(284, 4) + beeren(10, 192) + beeren(282, 192) + zapfen(26, 16, -20) + zapfen(274, 16, 20) +
      '<path d="M-4 -4 q8 10 16 4 M304 -4 q-8 10 -16 4" stroke="#d6304f" stroke-width="2.2" fill="none" stroke-linecap="round"/>' },
    lichter: { name: "Lichterkette", svg: lichterRand },
    spitze: { name: "Spitzenborte", svg: spitzenRand },
    sterne: { name: "Goldsterne", svg: sternRand },
  };

  /* ---------- 2. Kommode (nur über CSS, siehe style.css) ---------- */
  const MOEBEL = {
    eiche: { name: "Rustikale Eiche" },
    landhaus: { name: "Landhaus Weiß" },
    rosa: { name: "Pastellrosa mit Gold" },
    nuss: { name: "Dunkle Nuss" },
    bauern: { name: "Bauernschrank" },
  };
  /* ---------- 3. Countdown (nur über CSS) ---------- */
  const COUNTDOWN = {
    holz: { name: "Holzklötzchen" },
    lebkuchen: { name: "Lebkuchen" },
    kugeln: { name: "Christbaumkugeln" },
    klapp: { name: "Klappzahlen" },
    frost: { name: "Eisblumen" },
  };
  /* ---------- 4. Fenster (Vorhänge an den Seiten oder Girlande oben) ---------- */
  const vorhang = (inhalt) => '<svg class="raum-vorhang links" viewBox="0 0 100 600" preserveAspectRatio="none" aria-hidden="true">' + inhalt + "</svg>" +
    '<svg class="raum-vorhang rechts" viewBox="0 0 100 600" preserveAspectRatio="none" aria-hidden="true">' + inhalt + "</svg>";
  const FENSTER = {
    gardinen: { name: "Zarte Gardinen", html: () => vorhang(
      '<path d="M0 0 H100 Q78 120 88 300 Q96 460 70 600 H0Z" fill="#fff" opacity=".72"/>' +
      '<path d="M20 0 Q30 300 18 600 M45 0 Q58 300 40 600 M70 0 Q76 250 66 600" stroke="#f3dfe6" stroke-width="5" fill="none" opacity=".9"/>' +
      '<path d="M0 0 H100 V26 Q50 44 0 26Z" fill="#fff" opacity=".9"/><path d="M0 26 Q50 44 100 26" stroke="#f6c3d0" stroke-width="2" fill="none"/>') },
    samt: { name: "Samtvorhänge", html: () => vorhang(
      '<path d="M0 0 H100 Q96 160 46 250 Q66 360 64 600 H0Z" fill="#8e1534"/>' +
      '<path d="M18 0 Q22 150 14 250 Q18 420 12 600 M40 0 Q46 140 30 252 Q42 420 36 600 M64 0 Q66 120 46 250" stroke="#6b0f27" stroke-width="7" fill="none" opacity=".6"/>' +
      '<path d="M10 0 Q14 150 6 250" stroke="#c23a5c" stroke-width="3" fill="none" opacity=".5"/>' +
      '<path d="M0 0 H100 V34 Q75 52 50 34 Q25 52 0 34Z" fill="#a51c40"/><path d="M0 34 Q25 52 50 34 Q75 52 100 34" stroke="#e0b04e" stroke-width="3" fill="none"/>' +
      '<ellipse cx="44" cy="252" rx="10" ry="7" fill="#e0b04e"/><path d="M40 258 L36 300 M44 259 L44 304 M48 258 L52 300" stroke="#e0b04e" stroke-width="3" stroke-linecap="round"/>') },
    lichtervorhang: { name: "Lichtervorhang", html: () => '<div class="raum-lichtvorhang links"><i></i><i></i><i></i></div><div class="raum-lichtvorhang rechts"><i></i><i></i><i></i></div>' },
    wimpel: { name: "Wimpelkette", html: () => '<div class="raum-oben raum-wimpel"></div>' },
    girlande: { name: "Tannengirlande", html: () => '<div class="raum-oben raum-girlande"></div>' },
  };
  /* ---------- 5. Fensterbank (statt des kleinen Bäumchens) ---------- */
  const BAEUMCHEN_ORIGINAL = null; // bleibt wie in wartezeit.js gezeichnet
  const DEKO = {
    weihnachtsstern: { name: "Weihnachtsstern", svg:
      '<path d="M11 46h18l-2 16H13z" fill="#e0b04e"/><rect x="9.5" y="44" width="21" height="4.5" rx="1.5" fill="#f3c84b"/><path d="M14 52h12" stroke="#fff3c4" stroke-width="1"/>' +
      [0, 72, 144, 216, 288].map((w) => blatt(20 + Math.cos(((w - 90) * Math.PI) / 180) * 9, 30 + Math.sin(((w - 90) * Math.PI) / 180) * 9, 10, w - 90, "#2f6b45")).join("") +
      [36, 108, 180, 252, 324].map((w) => blatt(20 + Math.cos(((w - 90) * Math.PI) / 180) * 8.5, 30 + Math.sin(((w - 90) * Math.PI) / 180) * 8.5, 9.5, w - 90, "#d6304f")).join("") +
      [0, 72, 144, 216, 288].map((w) => blatt(20 + Math.cos(((w - 90) * Math.PI) / 180) * 5, 30 + Math.sin(((w - 90) * Math.PI) / 180) * 5, 6, w - 90, "#e8455a")).join("") +
      '<circle cx="20" cy="30" r="2.6" fill="#f3c84b"/><circle cx="18.6" cy="29" r=".8" fill="#6fd17a"/><circle cx="21.4" cy="31" r=".8" fill="#6fd17a"/>' },
    lebkuchenhaus: { name: "Lebkuchenhaus", svg:
      '<path d="M5 34 L20 18 L35 34 V62 H5Z" fill="#b06a35"/><path d="M2 36 L20 16 L38 36" fill="none" stroke="#fff6ea" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<path d="M4 36 L20 18 L36 36" fill="none" stroke="#fff6ea" stroke-width="1.4" stroke-dasharray="1.6 2.4"/>' +
      '<rect x="15" y="46" width="10" height="16" rx="5" fill="#7a4a2a"/><rect x="15" y="46" width="10" height="16" rx="5" fill="none" stroke="#fff6ea" stroke-width="1"/>' +
      '<rect x="8" y="38" width="7" height="7" rx="1" fill="#ffd36b"/><rect x="25" y="38" width="7" height="7" rx="1" fill="#ffd36b"/><path d="M11.5 38v7M8 41.5h7M28.5 38v7M25 41.5h7" stroke="#b06a35" stroke-width=".9"/>' +
      '<circle cx="9" cy="54" r="1.6" fill="#ff4d7d"/><circle cx="31" cy="54" r="1.6" fill="#6fd17a"/><circle cx="20" cy="28" r="2.4" fill="#ff4d7d"/><path d="M5 62h30" stroke="#fff6ea" stroke-width="2" stroke-dasharray="2 2"/>' +
      '<rect x="27" y="20" width="5" height="9" fill="#9a5a2a"/><path d="M26 20h7" stroke="#fff6ea" stroke-width="2" stroke-linecap="round"/>' },
    schneemann: { name: "Schneemann", svg:
      '<ellipse cx="20" cy="62" rx="14" ry="2.4" fill="rgba(90,50,30,.15)"/><circle cx="20" cy="50" r="12" fill="#fff" stroke="#dfe8f2" stroke-width="1"/><circle cx="20" cy="30" r="9" fill="#fff" stroke="#dfe8f2" stroke-width="1"/>' +
      '<rect x="12" y="15" width="16" height="3" rx="1" fill="#2a2a38"/><rect x="14.5" y="4" width="11" height="12" rx="1" fill="#2a2a38"/><rect x="14.5" y="12" width="11" height="2.4" fill="#d6304f"/>' +
      '<circle cx="17" cy="28" r="1.1" fill="#2a2a38"/><circle cx="23" cy="28" r="1.1" fill="#2a2a38"/><path d="M20 31 L26 32.4 L20 33Z" fill="#ff8a3d"/>' +
      '<path d="M16.5 35 Q20 37.5 23.5 35" stroke="#2a2a38" stroke-width=".9" fill="none" stroke-linecap="round"/><path d="M11 38 Q20 43 29 38 L29 41.5 Q20 46 11 41.5Z" fill="#d6304f"/><rect x="24" y="40" width="4" height="9" rx="1" fill="#d6304f"/>' +
      '<circle cx="20" cy="47" r="1.3" fill="#2a2a38"/><circle cx="20" cy="53" r="1.3" fill="#2a2a38"/><path d="M8 44 L1 36 M32 44 L39 37" stroke="#7a4a2a" stroke-width="1.6" stroke-linecap="round"/>' },
    laterne: { name: "Laterne", svg:
      '<path d="M20 2 Q13 2 13 8" stroke="#2f3340" stroke-width="1.6" fill="none"/><path d="M8 18 H32 L28 11 H12Z" fill="#2f3340"/><rect x="10" y="18" width="20" height="34" rx="2" fill="#fff4c0" stroke="#2f3340" stroke-width="2"/>' +
      '<path d="M20 18v34M10 35h20" stroke="#2f3340" stroke-width="1.2"/><circle cx="20" cy="38" r="11" fill="#ffd36b" opacity=".25" class="raum-flackern"/><rect x="17.5" y="36" width="5" height="12" rx="1" fill="#fffaf0"/>' +
      '<path d="M20 31.5 Q22.6 34.5 20 36.6 Q17.4 34.5 20 31.5Z" fill="#ffb84d" class="raum-flackern"/><path d="M7 52 H33 L30 62 H10Z" fill="#2f3340"/><path d="M20 2 Q27 2 27 8" stroke="#2f3340" stroke-width="1.6" fill="none"/>' +
      '<path d="M5 60 q4-5 8 0 q4-5 8 0" fill="#3f7f55"/><circle cx="7" cy="58" r="1.4" fill="#d6304f"/>' },
    kaktus: { name: "Kaktus mit Mütze", svg:
      '<path d="M11 46h18l-2 16H13z" fill="#c9774f"/><rect x="9.5" y="44" width="21" height="4.5" rx="1.5" fill="#d98a62"/>' +
      '<rect x="14" y="20" width="12" height="25" rx="6" fill="#4f9a5a"/><path d="M14 32 H9 Q6 32 6 28 V22" stroke="#4f9a5a" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M26 36 H31 Q34 36 34 32 V27" stroke="#4f9a5a" stroke-width="6" fill="none" stroke-linecap="round"/>' +
      '<path d="M18 24v18M22 24v18" stroke="#3f7f4a" stroke-width=".8"/><path d="M16 27l-2-1M24 30l2-1M16 36l-2 1M24 40l2-1M8 25l-2-1M33 29l2-1" stroke="#fff" stroke-width=".7" stroke-linecap="round"/>' +
      '<path d="M13 21 Q15 6 26 9 L27 21Z" fill="#d6304f"/><rect x="12" y="19" width="16" height="4" rx="2" fill="#fff"/><circle cx="27" cy="9" r="2.6" fill="#fff"/><circle cx="20" cy="34" r="1.6" fill="#ff8fab"/>' },
  };

  const KATEGORIEN = [
    { id: "rand", name: "Briefrand", symbol: "💌", liste: RAND, oben: false },
    { id: "moebel", name: "Kommode", symbol: "🪵", liste: MOEBEL, oben: true },
    { id: "countdown", name: "Countdown", symbol: "⏳", liste: COUNTDOWN, oben: true },
    { id: "fenster", name: "Fenster", symbol: "🪟", liste: FENSTER, oben: false },
    { id: "deko", name: "Fensterbank", symbol: "🪴", liste: DEKO, oben: true },
  ];

  /* ---------- Speichern ---------- */
  const SCHLUESSEL = "toni-wz-raum";
  function lies() { try { const s = JSON.parse(localStorage.getItem(SCHLUESSEL) || "{}"); return s && typeof s === "object" ? s : {}; } catch (_) { return {}; } }
  function schreib(s) { try { localStorage.setItem(SCHLUESSEL, JSON.stringify(s)); } catch (_) { /* egal */ } }
  let stand = lies();
  const wahl = () => stand.wahl || {};

  /* ---------- Anwenden ---------- */
  let randEl = null, fensterEl = null;
  function wende(an) {
    const w = an || wahl();
    // nur auf der Seite mit dem Umschlag vor dem Geburtstag und am Geburtstag
    for (const k of KATEGORIEN) {
      if (w[k.id] && k.liste[w[k.id]]) intro.dataset["raum" + k.id[0].toUpperCase() + k.id.slice(1)] = w[k.id];
      else delete intro.dataset["raum" + k.id[0].toUpperCase() + k.id.slice(1)];
    }
    const u = document.getElementById("umschlag");
    if (u) {
      if (w.rand && RAND[w.rand]) {
        if (!randEl || !randEl.isConnected) { randEl = document.createElement("div"); randEl.className = "raum-rand"; randEl.setAttribute("aria-hidden", "true"); u.prepend(randEl); }
        if (randEl.dataset.art !== w.rand) { randEl.dataset.art = w.rand; randEl.innerHTML = '<svg viewBox="0 0 300 200" preserveAspectRatio="none">' + RAND[w.rand].svg() + "</svg>"; }
      } else if (randEl) { randEl.remove(); randEl = null; }
    }
    if (w.fenster && FENSTER[w.fenster]) {
      if (!fensterEl || !fensterEl.isConnected) { fensterEl = document.createElement("div"); fensterEl.className = "raum-fenster"; fensterEl.setAttribute("aria-hidden", "true"); intro.prepend(fensterEl); }
      if (fensterEl.dataset.art !== w.fenster) { fensterEl.dataset.art = w.fenster; fensterEl.innerHTML = FENSTER[w.fenster].html(); }
    } else if (fensterEl) { fensterEl.remove(); fensterEl = null; }
    const b = intro.querySelector(".wz-baeumchen");
    if (b) {
      if (!b.dataset.original) b.dataset.original = b.innerHTML;
      const soll = w.deko && DEKO[w.deko] ? '<svg viewBox="0 0 40 64" aria-hidden="true">' + DEKO[w.deko].svg + "</svg>" : b.dataset.original;
      if (b.dataset.art !== (w.deko || "")) { b.dataset.art = w.deko || ""; b.innerHTML = soll; }
    }
  }
  // wartezeit.js baut Kommode und Bäumchen erst nach dem Laden: regelmäßig nachziehen
  setInterval(() => { if (!dialog.open) wende(); }, 1000);

  /* ---------- Vorschaubilder für die Kacheln ---------- */
  function vorschau(kat, id) {
    const box = document.createElement("div");
    box.className = "raum-mini raum-mini-" + kat;
    if (id) box.dataset["raum" + kat[0].toUpperCase() + kat.slice(1)] = id;
    if (kat === "rand") {
      box.innerHTML = '<div class="raum-mini-umschlag"><i class="h"></i><i class="v"></i><i class="k"></i><i class="s"></i>' +
        (id ? '<div class="raum-rand"><svg viewBox="0 0 300 200" preserveAspectRatio="none">' + RAND[id].svg() + "</svg></div>" : "") + "</div>";
    } else if (kat === "moebel") {
      box.innerHTML = '<div class="raum-mini-skala"><div class="wz-bank"><span class="wz-bank-oben"></span><span class="wz-bank-vorne"></span></div><div class="wz-schrank">' +
        '<div class="wz-schublade"><span class="wz-lade-front"><span class="wz-griff"></span></span></div><div class="wz-schublade"><span class="wz-lade-front"><span class="wz-griff"></span></span></div></div></div>';
    } else if (kat === "countdown") {
      box.innerHTML = '<div class="raum-mini-skala countdown-ziffern"><span class="cd-feld"><b>08</b><small>Tage</small></span></div>';
    } else if (kat === "fenster") {
      box.innerHTML = '<div class="raum-mini-fenster">' + (id ? '<div class="raum-fenster">' + FENSTER[id].html() + "</div>" : "") + '<i class="u"></i></div>';
    } else if (kat === "deko") {
      const b = intro.querySelector(".wz-baeumchen");
      box.innerHTML = id ? '<svg viewBox="0 0 40 64" aria-hidden="true">' + DEKO[id].svg + "</svg>" : (b && b.dataset.original) || "";
    }
    return box;
  }

  /* ---------- Das Menü zum Einrichten (Blatt oben oder unten, der Raum bleibt sichtbar) ---------- */
  const dialog = document.createElement("dialog");
  dialog.className = "raum-menue";
  dialog.setAttribute("aria-label", "Raum einrichten");
  dialog.innerHTML =
    '<div class="raum-kopf"><h2>Neu einrichten 🛋️</h2><p>Tipp etwas an, es erscheint sofort im Raum.</p><button class="schliessen raum-zu" type="button" aria-label="Schließen">×</button></div>' +
    '<div class="raum-reiter" role="tablist"></div><div class="raum-kacheln" role="radiogroup"></div>' +
    '<div class="raum-fuss"><button type="button" class="raum-fertig">Fertig ✨</button></div>';
  document.body.appendChild(dialog);
  const reiter = dialog.querySelector(".raum-reiter"), kacheln = dialog.querySelector(".raum-kacheln");
  let entwurf = {}, aktiv = "rand";
  KATEGORIEN.forEach((k) => {
    const b = document.createElement("button");
    b.type = "button"; b.setAttribute("role", "tab"); b.dataset.kat = k.id;
    b.innerHTML = '<span aria-hidden="true">' + k.symbol + "</span> " + k.name;
    b.addEventListener("click", () => zeigeKategorie(k.id));
    reiter.appendChild(b);
  });
  function zeigeKategorie(id) {
    aktiv = id;
    const k = KATEGORIEN.find((x) => x.id === id);
    // das Blatt rückt dorthin, wo es das Geänderte nicht verdeckt
    dialog.classList.toggle("oben", k.oben);
    reiter.querySelectorAll("button").forEach((b) => { const an = b.dataset.kat === id; b.classList.toggle("aktiv", an); b.setAttribute("aria-selected", an ? "true" : "false"); });
    kacheln.innerHTML = "";
    const eintraege = [[null, "Wie bisher"], ...Object.entries(k.liste).map(([key, v]) => [key, v.name])];
    for (const [key, name] of eintraege) {
      const b = document.createElement("button");
      b.type = "button"; b.className = "raum-kachel"; b.setAttribute("role", "radio");
      const an = (entwurf[id] || null) === key;
      b.classList.toggle("an", an); b.setAttribute("aria-checked", an ? "true" : "false");
      b.appendChild(vorschau(id, key));
      b.insertAdjacentHTML("beforeend", '<span class="raum-titel">' + name + "</span>");
      b.addEventListener("click", () => {
        if (key) entwurf[id] = key; else delete entwurf[id];
        wende(entwurf);
        kacheln.querySelectorAll(".raum-kachel").forEach((x) => { x.classList.remove("an"); x.setAttribute("aria-checked", "false"); });
        b.classList.add("an"); b.setAttribute("aria-checked", "true");
        if (!ruhig) b.animate([{ transform: "scale(.92)" }, { transform: "scale(1.05)" }, { transform: "scale(1)" }], { duration: 260, easing: "ease-out" });
      });
      kacheln.appendChild(b);
    }
    kacheln.scrollLeft = 0;
  }
  function oeffnen() {
    stand = lies();
    entwurf = Object.assign({}, wahl());
    zeigeKategorie("rand");
    if (typeof dialog.showModal === "function") dialog.showModal(); else dialog.setAttribute("open", "");
    dialog.querySelector(".raum-kopf").focus?.();
  }
  function fertig() {
    if (!dialog.open) return;
    const erstesMal = !stand.fertig;
    stand.wahl = entwurf; stand.fertig = true;
    schreib(stand);
    dialog.close();
    wende();
    glitzern();
    if (ak.voegel && ak.voegel.raumFertig) ak.voegel.raumFertig(erstesMal);
  }
  dialog.querySelector(".raum-fertig").addEventListener("click", fertig);
  dialog.querySelector(".raum-zu").addEventListener("click", fertig);
  dialog.addEventListener("cancel", (e) => { e.preventDefault(); fertig(); });
  function glitzern() {
    if (ruhig) return;
    for (let k = 0; k < 26; k++) {
      const s = document.createElement("span");
      s.className = "raum-glitzer"; s.textContent = k % 3 ? "✨" : "⭐";
      s.style.left = Math.random() * 100 + "vw"; s.style.top = 10 + Math.random() * 70 + "vh";
      document.body.appendChild(s);
      s.animate([{ transform: "scale(0) rotate(0)", opacity: 0 }, { transform: "scale(1.2) rotate(40deg)", opacity: 1, offset: 0.4 }, { transform: "scale(.4) rotate(90deg)", opacity: 0 }],
        { duration: 1100 + Math.random() * 700, delay: Math.random() * 500, easing: "ease-out", fill: "both" }).onfinish = () => s.remove();
    }
  }

  /* ---------- Frage der Munkelvogeline (nur am 18.11.) ---------- */
  function frageAktiv() {
    if (stand.fertig || (ak.zeitreise && ak.zeitreise.aktiv())) return false;
    const d = ak.intro.datum();
    return d.jahr === KALENDER.jahr && d.monat === 11 && d.tag === 18 && ak.intro.phase() === "warten";
  }
  function merkeAngeboten() { stand = lies(); stand.angeboten = true; schreib(stand); }

  /* ---------- Tonis Ecke: ein Knopf für Spiel, Umstylen, Einrichten und Fashion Show ---------- */
  const ecke = document.createElement("dialog");
  ecke.className = "ecke-menue";
  ecke.setAttribute("aria-label", "Tonis Ecke");
  ecke.innerHTML = '<div class="ecke-kopf"><h2>Tonis Ecke 🎀</h2><button class="schliessen ecke-zu" type="button" aria-label="Schließen">×</button></div><div class="ecke-liste"></div>';
  document.body.appendChild(ecke);
  const eckeListe = ecke.querySelector(".ecke-liste");
  const EINTRAEGE = [
    { id: "spiel", symbol: "🎮", name: "Capy-Spiel", text: "Schneeflocken fangen", da: () => !!(ak.spiel && ak.spiel.oeffnen), los: () => ak.spiel.oeffnen() },
    { id: "styling", symbol: "👗", name: "Vögel umstylen", text: "Neue Outfits aussuchen", da: () => !!(ak.styling && ak.styling.offen && ak.styling.offen()), los: () => ak.styling.oeffnen() },
    { id: "raum", symbol: "🛋️", name: "Raum einrichten", text: "Brief, Kommode und mehr", da: () => ak.intro.phase() === "warten", los: oeffnen },
    { id: "show", symbol: "✨", name: "Fashion Show", text: "Haute Capyture ansehen", da: () => !!(ak.modenschau && ak.modenschau.verfuegbar && ak.modenschau.verfuegbar()), los: () => ak.modenschau.oeffnen() },
  ];
  function eckeOeffnen() {
    eckeListe.innerHTML = "";
    for (const e of EINTRAEGE) {
      if (!e.da()) continue;
      const b = document.createElement("button");
      b.type = "button"; b.className = "ecke-eintrag";
      b.innerHTML = '<span class="ecke-symbol" aria-hidden="true">' + e.symbol + '</span><span><b>' + e.name + "</b><small>" + e.text + "</small></span>";
      // erst das Menü schließen, dann öffnen: nie zwei Fenster auf einmal
      b.addEventListener("click", () => { ecke.close(); setTimeout(e.los, 80); });
      eckeListe.appendChild(b);
    }
    if (typeof ecke.showModal === "function") ecke.showModal(); else ecke.setAttribute("open", "");
  }
  ecke.querySelector(".ecke-zu").addEventListener("click", () => ecke.close());
  ecke.addEventListener("click", (e) => { if (e.target === ecke) ecke.close(); });

  const knopfHtml = '<span aria-hidden="true">🎀</span> Tonis Ecke';
  const introEcke = document.createElement("button");
  introEcke.type = "button"; introEcke.className = "special-knopf intro-ecke"; introEcke.hidden = true; introEcke.innerHTML = knopfHtml;
  introEcke.addEventListener("click", eckeOeffnen);
  const kalenderEcke = document.createElement("button");
  kalenderEcke.type = "button"; kalenderEcke.className = "sammlung-knopf kalender-ecke"; kalenderEcke.hidden = true; kalenderEcke.innerHTML = knopfHtml;
  kalenderEcke.addEventListener("click", eckeOeffnen);
  setInterval(() => {
    if (!ak.intro.bereit()) return;
    const reihe = intro.querySelector(".intro-knoepfe");
    if (reihe && introEcke.parentNode !== reihe) reihe.prepend(introEcke);
    const spiel = document.getElementById("spiel-knopf");
    if (spiel && !kalenderEcke.parentNode) spiel.before(kalenderEcke);
    // gebündelt, sobald die Munkelvogeline das Einrichten angeboten hat
    // (auch wenn Toni beim ersten Mal „Später“ gesagt hat, damit sie jederzeit einrichten kann)
    stand = lies();
    const gebuendelt = !!(stand.fertig || stand.angeboten);
    document.documentElement.classList.toggle("ecke-gebuendelt", gebuendelt);
    const phase = ak.intro.phase();
    introEcke.hidden = !(gebuendelt && !intro.hidden && (phase === "warten" || phase === "geburtstag")) || !!document.querySelector(".special-buehne");
    kalenderEcke.hidden = !(gebuendelt && phase === "offen");
  }, 500);

  window.adventkalender.raum = {
    oeffnen,
    frageAktiv,
    angeboten: merkeAngeboten,
    vorab: () => "Boah, Toni, ich finde es hier langsam ein bisschen trist 🙈",
    frage: () => "Findest du nicht, dass wir uns hier mal neu einrichten könnten? 🛋️",
    KATEGORIEN,
  };
})();
