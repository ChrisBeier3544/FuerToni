/* =========================================================
   Zeitreise und Führung (ab dem 27.12. aus dem Entdeckerbuch)
   - Tagesreise: die Seite zeigt einen Tag zwischen 11. und 30.11.
   - Führung: springt zum passenden Tag und zeigt, wo und wie eine
     Entdeckung funktioniert, auf Wunsch spielt sie sie vor.
   ========================================================= */
(function () {
  "use strict";
  const ak = window.adventkalender;
  if (!ak || !ak.zeitreise) return;
  const zr = ak.zeitreise;

  /* ---------- Hilfen ---------- */
  const sichtbar = (e) => { if (!e) return false; const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(e).visibility !== "hidden"; };
  const finde = (sel) => {
    if (!sel) return null;
    if (typeof sel === "function") return sel();
    return [...document.querySelectorAll(sel)].find(sichtbar) || null;
  };
  // Ein echter Klick in der Mitte eines Elements (auch für SVG und Himmel)
  function klick(e) {
    if (!e) return;
    const r = e.getBoundingClientRect();
    const x = r.left + r.width / 2, y = r.top + r.height / 2;
    const ziel = document.elementFromPoint(x, y) || e;
    const opt = { bubbles: true, cancelable: true, clientX: x, clientY: y, view: window };
    ziel.dispatchEvent(new MouseEvent("click", opt));
  }
  const vorspiel = (id) => () => ak.wartezeit && ak.wartezeit.vorspielen(id);
  const klickSel = (sel) => () => klick(finde(sel));

  /* ---------- Wann und wo gibt es was? ---------- */
  // Dezember: am 23.12. ist alles da (mittags), Mond, Wunschstern und Fenster abends
  const DEZ = [12, 23, 13, 0], DEZ_ABEND = [12, 23, 20, 0];
  const FUEHRUNG = {
    herz: { wann: DEZ, wo: ".titel-herz", text: "Tipp auf das Herz im Titel.", spiel: klickSel(".titel-herz") },
    vogel: { wann: DEZ, wo: ".vogel:not(.gast):not(.weibchen)", text: "Tipp auf den Munkelvogel, sobald er gelandet ist.", spiel: klickSel(".vogel:not(.gast):not(.weibchen)") },
    capy: { wann: DEZ, wo: ".capy-laeufer", text: "Tipp auf das kleine Capy, das hier spazieren geht.", spiel: klickSel(".capy-laeufer") },
    haus: { wann: DEZ, wo: ".landschaft [data-haus]", text: "Tipp auf ein Haus unten im Dorf (nicht aufs Fenster).", spiel: klickSel(".landschaft [data-haus]") },
    baum: { wann: DEZ, wo: ".landschaft .baum", text: "Tipp auf einen Tannenbaum im Dorf.", spiel: klickSel(".landschaft .baum") },
    kerze: { wann: DEZ, wo: "#adventskranz .kerze", text: "Tipp auf eine brennende Kerze am Adventskranz.", spiel: klickSel("#adventskranz .kerze") },
    welle: { wann: DEZ, wo: "#lichterkette", text: "Tipp auf die Lichterkette.", spiel: klickSel("#lichterkette") },
    ziehen: { wann: DEZ, wo: "#lichterkette", text: "Fass ein Birnchen der Lichterkette an und zieh es nach unten." },
    polaroid: { wann: DEZ, wo: ".polaroid", text: "Halt ein Sofortbild ein bisschen gedrückt." },
    kugel: { wann: DEZ, wo: ".kopf .kugel", text: "Tipp auf eine Weihnachtskugel oben in der Ecke. Mit Ton klingt sie sogar.", spiel: klickSel(".kopf .kugel") },
    paar: { wann: DEZ, wo: ".capy-familie", text: "Tipp auf die zwei Capys ganz unten.", spiel: klickSel(".capy-familie") },
    mond: { wann: DEZ_ABEND, wo: ".himmel > .himmel2 .h2-mond", text: "Tipp auf den Mond.", spiel: () => ak.interaktiv && ak.interaktiv.sternschnuppenRegen() },
    sonne: { wann: DEZ, wo: ".himmel > .himmel2 .h2-sonne", text: "Tipp auf die Sonne.", spiel: klickSel(".himmel > .himmel2 .h2-sonne") },
    schneekugel: { wann: DEZ, wo: ".schneekugel", text: "Tipp auf die Schneekugel neben dem Adventskranz.", spiel: klickSel(".schneekugel") },
    brief: { wann: DEZ, wo: ".briefkasten", text: "Tipp auf den Briefkasten unten im Dorf.", spiel: klickSel(".briefkasten") },
    schneemann: { wann: DEZ, wo: ".schneemann", text: "Tipp so oft auf den Schneeball im Dorf, bis der Schneemann fertig ist.",
      spiel: () => { for (let k = 0; k < 8; k++) setTimeout(() => klick(finde(".schneemann")), k * 650); } },
    wunsch: { wann: DEZ_ABEND, wo: ".wunschstern", text: "Tipp auf den blinkenden Stern oben und wünsch dir etwas.", spiel: klickSel(".wunschstern") },
    fenster: { wann: DEZ_ABEND, wo: ".landschaft rect.fenster", text: "Tipp auf ein Fenster im Dorf und schau, was die Capys machen.", spiel: klickSel(".landschaft rect.fenster") },
    kamin: { wann: DEZ, wo: ".schornstein", text: "Tipp auf einen Schornstein im Dorf.", spiel: klickSel(".schornstein") },
    flocken: { wann: DEZ, text: "Gleich fallen goldene Schneeflocken. Fang 5 Stück!",
      spiel: () => { for (let k = 0; k < 5; k++) setTimeout(() => ak.entdecken && ak.entdecken.flocke(), k * 2600); } },
    plaetzchen: { wann: DEZ, wo: ".backstube", text: "Tipp auf den Plätzchenteig unter dem Kalender.", spiel: klickSel(".backstube") },
    mistel: { wann: DEZ, text: "Leg je einen Daumen an den linken und an den rechten Rand und halt kurz fest.", spiel: () => ak.entdecken && ak.entdecken.mistelzweig() },

    stempel: { wann: [11, 13, 17, 30], wo: ".siegel", text: "Halt das Siegel ganz lange gedrückt.", spiel: vorspiel("stempel") },
    kalender: { wann: [11, 13, 17, 30], wo: ".wz-kalender", text: "Reiß das Kalenderblatt ab: antippen oder nach unten ziehen.", spiel: klickSel(".wz-kalender") },
    kranich: { wann: [11, 13, 17, 30], wo: ".wz-kalender", text: "Reiß das Kalenderblatt ab und tipp danach doppelt auf den Capy Fakt." },
    spiegel: { wann: [11, 13, 17, 30], wo: ".wz-spiegel", text: "Tipp auf den kleinen Spiegel und frag ihn.", spiel: klickSel(".wz-spiegel") },
    ziffern: { wann: [11, 13, 17, 30], wo: ".cd-feld", text: "Tipp auf die Zahlen vom Countdown.", spiel: klickSel(".cd-feld") },
    schlafmuetzen: { wann: [11, 14, 23, 30], wo: ".cd-feld", text: "Nachts schlafen die Zahlen. Tipp sie an, um sie zu wecken.", spiel: klickSel(".cd-feld") },
    marke: { wann: [11, 13, 17, 30], wo: ".wz-marke", text: "Tipp auf die Briefmarke oben rechts auf dem Umschlag.", spiel: klickSel(".wz-marke") },
    knopf: { wann: [11, 14, 17, 30], wo: ".wz-knopf", text: "Drück auf den roten Knopf. Auch wenn man das eigentlich nicht soll.", spiel: klickSel(".wz-knopf") },
    schuetteln: { wann: [11, 15, 17, 30], wo: "#umschlag", text: "Wisch ganz schnell hin und her über den Umschlag.", spiel: vorspiel("schuetteln") },
    adresse: { wann: [11, 14, 17, 30], wo: ".umschlag-name", text: "Tipp auf deinen Namen auf dem Umschlag.", spiel: klickSel(".umschlag-name") },
    licht: { wann: [11, 25, 19, 0], wo: "#umschlag", text: "Halt den Umschlag mit zwei Fingern fest, oder lange mit einem Finger.", spiel: vorspiel("licht") },
    sternbild: { wann: [11, 16, 19, 0], wo: ".wz-sternbild", text: "Tipp die Sterne oben der Reihe nach an. Der hellste ist immer der nächste." },
    flieger: { wann: [11, 17, 15, 0], text: "Gleich fliegt ein Papierflieger vorbei. Fang ihn!", spiel: vorspiel("flieger") },
    tasse: { wann: [11, 16, 15, 0], wo: ".wz-tasse", text: "Tipp auf den Cappuccino, bis er leer ist.", spiel: klickSel(".wz-tasse") },
    scheibe: { wann: [11, 13, 19, 0], text: "Gleich beschlägt die Scheibe. Mal mit dem Finger etwas hinein.", spiel: vorspiel("scheibe") },
    kennzeichen: { wann: [11, 22, 15, 0], wo: "#countdown-ziffern", text: "Halt den Countdown lange gedrückt und gib die geheime Zahl ein.", spiel: vorspiel("kennzeichen") },
    vogeline: { wann: [11, 14, 17, 30], wo: ".vogel:not(.gast):not(.weibchen)", text: "Tipp zweimal auf den Munkelvogel und sag Ja.", spiel: () => ak.voegel && ak.voegel.frage() },
    freunde: { wann: [11, 13, 17, 30], wo: ".vogel:not(.gast):not(.weibchen)", text: "Tipp zweimal auf den Munkelvogel und sag Ja. Heute bringt die Munkelvogeline Freunde mit.", spiel: () => ak.voegel && ak.voegel.frage() },
  };

  // Tagesreise: 11. bis 30. November, jeweils zu einer passenden Uhrzeit
  const TAGE = [];
  for (let t = 11; t <= 30; t++) {
    const zeit = t <= 12 ? [15, 0] : t <= 25 ? [17, 30] : [12, 0];
    TAGE.push({ tag: t, zeit });
  }
  const WOCHENTAG = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
  const wochentag = (j, m, t) => WOCHENTAG[new Date(Date.UTC(j, m - 1, t)).getUTCDay()];

  function starte(id) {
    const f = FUEHRUNG[id];
    if (!f || !zr.erlaubt()) return false;
    const [m, t, h, mi] = f.wann;
    zr.starte(zr.zeitpunkt(KALENDER.jahr, m, t, h, mi), { id });
    return true;
  }
  function reiseTag(tag) {
    const e = TAGE.find((x) => x.tag === tag);
    if (!e || !zr.erlaubt()) return false;
    // bei einer Tagesreise begrüßt sie wieder der Umschlag
    try { sessionStorage.removeItem("toni-intro"); } catch (_) { /* egal */ }
    zr.starte(zr.zeitpunkt(KALENDER.jahr, 11, tag, e.zeit[0], e.zeit[1]), null);
    return true;
  }
  window.adventkalender.fuehrung = { starte, reiseTag, TAGE, kann: (id) => !!FUEHRUNG[id], wochentag };

  /* ---------- Banner während der Zeitreise ---------- */
  const warte = setInterval(() => {
    if (!ak.intro.bereit()) return;
    clearInterval(warte);
    if (!zr.aktiv()) return;
    const d = ak.intro.datum();
    const banner = document.createElement("div");
    banner.className = "zr-banner";
    banner.innerHTML = '<span class="zr-uhr" aria-hidden="true">🕰️</span><span class="zr-text">Zeitreise · ' + wochentag(d.jahr, d.monat, d.tag) + " " + d.tag + "." + d.monat + ". · " +
      String(d.stunde).padStart(2, "0") + ":" + String(d.minute).padStart(2, "0") + '</span><button type="button" class="zr-zurueck">Zurück ins Heute</button>';
    document.body.appendChild(banner);
    banner.querySelector(".zr-zurueck").addEventListener("click", () => zr.beende());
    const a = zr.aufgabe();
    if (a && a.id && FUEHRUNG[a.id]) fuehre(FUEHRUNG[a.id]);
  }, 200);

  /* ---------- Führung zu einer Entdeckung ---------- */
  const unruhig = () => !!document.querySelector(".special-buehne, .aufbau-buehne, dialog[open]");
  async function fuehre(f) {
    // Dezember: den Umschlag am Anfang direkt öffnen
    const intro = document.getElementById("intro");
    if (f.wann[0] === 12 && intro && !intro.hidden && ak.intro.phase() === "offen") {
      const u = document.getElementById("umschlag");
      if (u) setTimeout(() => u.click(), 600);
    }
    const start = performance.now();
    let ziel = null;
    await new Promise((fertig) => {
      const t = setInterval(() => {
        const zeit = performance.now() - start;
        const introZu = !intro || intro.hidden || intro.classList.contains("weg") || f.wann[0] === 11;
        if (zeit > 25000 || (introZu && zeit > 1500 && !unruhig() && (!f.wo || (ziel = finde(f.wo))))) { clearInterval(t); fertig(); }
      }, 250);
    });
    if (f.wo && !ziel) ziel = finde(f.wo);
    if (ziel && ziel.scrollIntoView && f.wann[0] === 12) {
      ziel.scrollIntoView({ block: "center", behavior: "smooth" });
      await new Promise((r) => setTimeout(r, 700));
    }
    const ring = ziel ? markiere(ziel) : null;
    zeigeKarte(f, ring, ziel);
  }
  function markiere(ziel) {
    const ring = document.createElement("div");
    ring.className = "zr-ring";
    document.body.appendChild(ring);
    let aus = false;
    const folge = () => {
      if (aus) return;
      const r = ziel.getBoundingClientRect();
      const p = 8;
      Object.assign(ring.style, { left: r.left - p + "px", top: r.top - p + "px", width: r.width + p * 2 + "px", height: r.height + p * 2 + "px" });
      requestAnimationFrame(folge);
    };
    folge();
    const weg = () => { if (aus) return; aus = true; ring.classList.add("weg"); setTimeout(() => ring.remove(), 500); };
    ziel.addEventListener("pointerdown", weg, { once: true });
    setTimeout(weg, 15000);
    return { weg };
  }
  function zeigeKarte(f, ring, ziel) {
    const karte = document.createElement("div");
    karte.className = "zr-karte";
    const unten = !ziel || ziel.getBoundingClientRect().top < window.innerHeight * 0.5;
    karte.classList.add(unten ? "unten" : "oben");
    karte.innerHTML = '<p class="zr-kopf">So geht\'s</p><p class="zr-anleitung"></p><div class="zr-knoepfe">' +
      (f.spiel ? '<button type="button" class="zr-vorspielen">▶ Vorspielen</button>' : "") +
      '<button type="button" class="zr-selbst">' + (f.spiel ? "Selbst probieren" : "Okay") + "</button></div>";
    karte.querySelector(".zr-anleitung").textContent = f.text;
    document.body.appendChild(karte);
    requestAnimationFrame(() => karte.classList.add("da"));
    const zu = () => { karte.classList.remove("da"); setTimeout(() => karte.remove(), 350); };
    const v = karte.querySelector(".zr-vorspielen");
    if (v) v.addEventListener("click", () => { zu(); if (ring) ring.weg(); setTimeout(() => { try { f.spiel(); } catch (_) { /* egal */ } }, 250); });
    karte.querySelector(".zr-selbst").addEventListener("click", zu);
  }
})();
