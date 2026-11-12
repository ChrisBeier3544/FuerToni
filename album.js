/*
 * ===========================================================
 *  ENTDECKT ALBUM: zählt, welche Überraschungen sie schon
 *  gefunden hat. Nicht gefundene bleiben als „???“ geheim.
 *  Außerdem: Ruhe im Hintergrund, solange ein Fenster offen ist.
 * ===========================================================
 */
(function () {
  "use strict";

  const ak = window.adventkalender;
  if (!ak || !ak.intro) return;
  const SCHLUESSEL = "toni-entdeckt-" + KALENDER.jahr;
  const html = document.documentElement;
  const LISTE = [
    ["herz", "♥️", "Herz voller Herzen"],
    ["vogel", "🐦", "Der Munkelvogel"],
    ["capy", "🐹", "Capy Spaziergang"],
    ["haus", "🏠", "Capys zu Hause"],
    ["baum", "🌲", "Schnee vom Baum"],
    ["kerze", "🕯️", "Kerze ausgepustet"],
    ["welle", "✨", "Lichtwelle"],
    ["ziehen", "💡", "Lichterkette gezogen"],
    ["polaroid", "📸", "Sofortbild"],
    ["kugel", "🔔", "Klingende Kugel"],
    ["paar", "😘", "Capy Bussi"],
    ["mond", "🌠", "Sternschnuppenregen"],
    ["sonne", "😎", "Coole Sonne"],
    ["schneekugel", "❄️", "Schneekugel"],
    ["brief", "💌", "Post für dich"],
    ["schneemann", "⛄", "Schneemann gebaut"],
    ["wunsch", "🌟", "Wunsch an die Sterne"],
    ["fenster", "🪟", "Blick ins Fenster"],
    ["kamin", "🏡", "Herzen aus dem Kamin"],
    ["flocken", "⭐", "5 goldene Flocken"],
    ["plaetzchen", "🍪", "Plätzchen gebacken"],
    ["mistel", "🌿", "Mistelzweig"],
    // Wartezeit bis zum Geburtstag
    ["stempel", "🔏", "Wachssiegel gestempelt"],
    ["kalender", "📅", "Capy Fakt des Tages"],
    ["kranich", "🦢", "Kranich gefaltet"],
    ["spiegel", "🪞", "Zauberspiegel"],
    ["ziffern", "🤭", "Kitzelige Ziffern"],
    ["schlafmuetzen", "😴", "Schlafende Zahlen"],
    ["marke", "🔍", "Briefmarke unter der Lupe"],
    ["knopf", "🔴", "Der verbotene Knopf"],
    ["schuetteln", "🫨", "Umschlag geschüttelt"],
    ["adresse", "✒️", "Liebe im Adressfeld"],
    ["licht", "🔦", "Gegen das Licht"],
    ["sternbild", "🌌", "Sternbild verbunden"],
    ["flieger", "✈️", "Papierflieger gefangen"],
    ["tasse", "☕", "Cappuccino"],
    ["scheibe", "🌫️", "Beschlagene Scheibe"],
    ["kennzeichen", "🚗", "Das Kennzeichen 3544"],
    ["vogeline", "💕", "Die Munkelvogeline"],
    ["freunde", "🎉", "Munkelvogels Freunde"],
  ];
  // Preis für eine verpasste Überraschung
  // Preise für verpasste Überraschungen: jeder Freikauf ist teurer als der davor.
  // Die allerletzte noch verpasste Überraschung kostet immer das Finale.
  const PREISE = [
    "10 × SMUATSH",
    "10 Sekunden Kuscheln",
    "20 × SMUATSH",
    "1 Minute Kuscheln am Stück",
    "5 Minuten Rücken kraulen",
    "30 × SMUATSH",
    "Einen Kuss auf Kommando, egal wo wir gerade sind",
    "Chris einen Kaffee ans Bett bringen",
    "15 Minuten große Massage",
    "50 × SMUATSH",
    "Chris darf den nächsten Film aussuchen, ohne Widerspruch",
    "100 × SMUATSH",
    "Chris sein Lieblingsessen kochen",
    "20 Minuten große Massage mit Öl",
    "Einen ganzen Tag lang jedes Gespräch mit einem Kompliment beginnen",
    "Frühstück ans Bett mit Kaffee und Croissant",
    "Einen Wellnessabend zu Hause mit Kerzen und Massage",
    "200 × SMUATSH",
    "Ein Spieleabend, Chris sucht die Spiele aus",
    "Einen ganzen Sonntag Kuscheltag im Bett",
    "500 × SMUATSH",
    "1000 × SMUATSH",
  ];
  const FINALE_PREIS = (smuatsh) => "Das große Finale: Eine Joghurt Früchte Bowl zum Frühstück vorbereiten, liebevoll angerichtet, dazu Kaffee ans Bett und " + smuatsh + " × SMUATSH ♥️";
  const FREI_SCHLUESSEL = "toni-freigekauft-" + KALENDER.jahr;
  const SCHULD_SCHLUESSEL = "toni-schuldscheine-" + KALENDER.jahr;
  const IDS = LISTE.map((e) => e[0]);
  const lies = () => { try { const v = JSON.parse(localStorage.getItem(SCHLUESSEL) || "[]"); return Array.isArray(v) ? v.filter((x) => IDS.includes(x)) : []; } catch (_) { return []; } };
  const schreib = (v) => { try { localStorage.setItem(SCHLUESSEL, JSON.stringify(v)); } catch (_) { /* egal */ } };
  let gefunden = new Set(lies());
  const liesListe = (k) => { try { const v = JSON.parse(localStorage.getItem(k) || "[]"); return Array.isArray(v) ? v : []; } catch (_) { return []; } };
  const schreibListe = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (_) { return false; } };
  const freigekauft = () => new Set(liesListe(FREI_SCHLUESSEL));
  const zr = () => ak.zeitreise;
  const wiederholen = () => !!(zr() && zr().erlaubt() && ak.fuehrung);

  /* ---------- Knopf in „Dein Tag“ ---------- */
  const knoepfe = document.querySelector(".kopf-knoepfe");
  const knopf = document.createElement("button");
  knopf.type = "button";
  knopf.id = "entdeckt-knopf";
  knopf.className = "sammlung-knopf";
  knopf.hidden = true;
  knopf.innerHTML = '<svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5l1.9 5.6 5.6 1.9-5.6 1.9L12 17.5l-1.9-5.6L4.5 10l5.6-1.9z" fill="#f3c84b" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><path d="M19 15l.8 2.2 2.2.8-2.2.8L19 21l-.8-2.2-2.2-.8 2.2-.8z" fill="currentColor"/></svg> <span class="entdeckt-zahl"></span>';
  if (knoepfe) knoepfe.prepend(knopf);

  const dlg = document.createElement("dialog");
  dlg.className = "dialog entdeckt-dialog";
  dlg.setAttribute("aria-labelledby", "entdeckt-titel");
  dlg.innerHTML =
    '<div class="dialog-inhalt"><button class="schliessen" type="button" aria-label="Schließen">×</button>' +
    '<p class="dialog-tag">Dein Entdeckerbuch</p><h2 id="entdeckt-titel">Deine Entdeckungen</h2>' +
    '<div class="entdeckt-balken" aria-hidden="true"><span></span></div><p class="entdeckt-stand"></p>' +
    '<div class="entdeckt-reise" hidden><p class="entdeckt-abschnitt">Zeitreise durch den November</p><p class="entdeckt-klein">Tipp auf einen Tag und erlebe ihn nochmal.</p><div class="entdeckt-tage"></div>' +
    '<p class="entdeckt-abschnitt">Nochmal erleben</p><p class="entdeckt-klein">Tipp bei einer Entdeckung auf Nochmal, dann zeigt dir das Handy, wie es geht.</p></div>' +
    '<ul class="entdeckt-liste"></ul>' +
    '<div class="entdeckt-schulden" hidden></div>' +
    '<div class="entdeckt-kauf" hidden></div>' +
    '<p class="entdeckt-tipp">Auf dieser Seite reagiert ganz viel, wenn du es antippst. Und pass gut auf, was der Munkelvogel zu sagen hat. Er weiß mehr, als er zugibt 🐦</p></div>';
  document.body.appendChild(dlg);
  dlg.querySelector(".schliessen").addEventListener("click", () => dlg.close());
  dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });

  function zeigeKnopf() {
    knopf.hidden = gefunden.size === 0;
    knopf.querySelector(".entdeckt-zahl").textContent = "Entdeckt " + gefunden.size + "/" + LISTE.length;
    knopf.setAttribute("aria-label", gefunden.size + " von " + LISTE.length + " Überraschungen entdeckt");
  }
  function oeffne() {
    const liste = dlg.querySelector(".entdeckt-liste");
    liste.textContent = "";
    // Gefundenes zuerst, in der Reihenfolge des Findens; der Rest bleibt verdeckt,
    // ohne dass die Position etwas verrät
    const reihenfolge = [...[...gefunden].map((id) => LISTE.find((e) => e[0] === id)), ...LISTE.filter((e) => !gefunden.has(e[0]))];
    const frei = freigekauft();
    const mitReise = wiederholen();
    for (const [id, zeichen, name] of reihenfolge) {
      const li = document.createElement("li");
      const da = gefunden.has(id) || frei.has(id);
      li.className = "entdeckt-eintrag" + (da ? " da" : "") + (frei.has(id) && !gefunden.has(id) ? " gekauft" : "");
      li.innerHTML = '<span class="entdeckt-zeichen" aria-hidden="true"></span><span class="entdeckt-name"></span>';
      li.firstChild.textContent = da ? zeichen : "?";
      li.children[1].textContent = da ? name : "???";
      if (mitReise && ak.fuehrung.kann(id)) {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "entdeckt-nochmal" + (da ? "" : " zu");
        b.textContent = da ? "▶ Nochmal" : "🔒 Freikaufen";
        b.addEventListener("click", () => (da ? ak.fuehrung.starte(id) : kaufe(id, name)));
        li.appendChild(b);
      }
      liste.appendChild(li);
    }
    dlg.querySelector(".entdeckt-kauf").hidden = true;
    liste.hidden = false;
    zeigeReise(mitReise);
    zeigeSchulden();
    const n = gefunden.size;
    const gekauft = [...frei].filter((x) => !gefunden.has(x)).length;
    dlg.querySelector(".entdeckt-balken span").style.width = (n / LISTE.length) * 100 + "%";
    dlg.querySelector(".entdeckt-stand").textContent = n === LISTE.length
      ? "Du hast alles entdeckt, Maus! 🎉 Du bist die beste Entdeckerin der Welt ♥️"
      : n + " von " + LISTE.length + " Überraschungen entdeckt" + (gekauft ? " · " + gekauft + " freigekauft" : "");
    if (dlg.open) return;
    if (typeof dlg.showModal === "function") dlg.showModal(); else dlg.setAttribute("open", "");
  }
  knopf.addEventListener("click", oeffne);

  /* ---------- Zeitreise durch den November (ab 27.12.) ---------- */
  function zeigeReise(an) {
    const box = dlg.querySelector(".entdeckt-reise");
    box.hidden = !an;
    if (!an) return;
    const tage = box.querySelector(".entdeckt-tage");
    tage.textContent = "";
    for (const e of ak.fuehrung.TAGE) {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "entdeckt-tag" + (e.tag === 26 ? " geburtstag" : "");
      b.innerHTML = "<small></small><b></b>";
      b.firstChild.textContent = ak.fuehrung.wochentag(KALENDER.jahr, 11, e.tag);
      b.lastChild.textContent = e.tag + ".11.";
      b.setAttribute("aria-label", "Zeitreise zum " + e.tag + ". November");
      b.addEventListener("click", () => ak.fuehrung.reiseTag(e.tag));
      tage.appendChild(b);
    }
  }

  /* ---------- Schuldscheine ---------- */
  function zeigeSchulden() {
    const box = dlg.querySelector(".entdeckt-schulden");
    const liste = liesListe(SCHULD_SCHLUESSEL);
    box.hidden = liste.length === 0;
    if (!liste.length) return;
    box.innerHTML = '<p class="entdeckt-abschnitt">Deine Schuldscheine</p><p class="entdeckt-klein"></p><div class="schuld-liste"></div>';
    box.querySelector(".entdeckt-klein").textContent = liste.length === 1 ? "Das schuldest du Chris noch 😘" : "Das alles schuldest du Chris 😘";
    const l = box.querySelector(".schuld-liste");
    for (const s of liste) {
      const k = document.createElement("div");
      k.className = "schuldschein";
      k.innerHTML = '<p class="schuld-text"></p><img alt="Unterschrift"><p class="schuld-datum"></p>';
      k.querySelector(".schuld-text").textContent = "Ich schulde Chris: " + (s.preis || "10 × SMUATSH") + " (für: " + s.name + ")";
      k.querySelector("img").src = s.bild;
      k.querySelector(".schuld-datum").textContent = s.datum;
      l.appendChild(k);
    }
  }

  /* ---------- Verpasste Überraschung freikaufen ---------- */
  // Der nächste Preis: je mehr schon freigekauft ist, desto höher
  function naechsterPreis() {
    const frei = freigekauft();
    const offen = LISTE.filter((e) => !gefunden.has(e[0]) && !frei.has(e[0])).length;
    const n = liesListe(SCHULD_SCHLUESSEL).length;
    // auch im Finale immer mehr SMUATSH als jemals davor
    if (offen <= 1) return FINALE_PREIS(n < PREISE.length ? 1000 : 1000 + (n - PREISE.length + 2) * 500);
    if (n < PREISE.length) return PREISE[n];
    // danach wird es immer mehr SMUATSH
    return (1000 + (n - PREISE.length + 1) * 500) + " × SMUATSH";
  }
  const sicher = (t) => String(t).replace(/[<>&"]/g, (z) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;" })[z]);
  function kaufe(id, name) {
    const PREIS = sicher(naechsterPreis());
    const liste = dlg.querySelector(".entdeckt-liste");
    const box = dlg.querySelector(".entdeckt-kauf");
    const reise = dlg.querySelector(".entdeckt-reise"), schulden = dlg.querySelector(".entdeckt-schulden");
    liste.hidden = true; reise.hidden = true; schulden.hidden = true;
    box.hidden = false;
    box.innerHTML =
      '<div class="kauf-schritt kauf-eins"><p class="kauf-gross">🔒</p><p class="kauf-titel">Diese Überraschung hast du verpasst</p>' +
      '<p class="kauf-preis">Preis: <b>' + PREIS + '</b></p><div class="kauf-knoepfe"><button type="button" class="kauf-zurueck">Abbrechen</button><button type="button" class="kauf-ok">Bestätigen</button></div></div>' +
      '<div class="kauf-schritt kauf-zwei" hidden><p class="kauf-titel">Schuldschein</p><p class="kauf-preis">Ich, Toni, schulde Chris:<br><b>' + PREIS + '</b></p>' +
      '<p class="entdeckt-klein">Bitte hier unterschreiben:</p><canvas class="kauf-feld" width="600" height="220" aria-label="Unterschriftsfeld"></canvas>' +
      '<div class="kauf-knoepfe"><button type="button" class="kauf-loeschen">Löschen</button><button type="button" class="kauf-ok2" disabled>Bestätigen</button></div></div>';
    dlg.querySelector(".dialog-inhalt").scrollTop = 0;
    const zurueck = () => oeffne();
    box.querySelector(".kauf-zurueck").addEventListener("click", zurueck);
    box.querySelector(".kauf-ok").addEventListener("click", () => {
      box.querySelector(".kauf-eins").hidden = true;
      box.querySelector(".kauf-zwei").hidden = false;
      unterschrift(box.querySelector(".kauf-feld"), box.querySelector(".kauf-ok2"), box.querySelector(".kauf-loeschen"), (bild) => {
        const d = (zr() && zr().echtDatum()) || ak.intro.datum();
        const s = liesListe(SCHULD_SCHLUESSEL);
        s.push({ id, name, bild, preis: naechsterPreis(), datum: d.tag + "." + d.monat + "." + d.jahr + ", " + String(d.stunde).padStart(2, "0") + ":" + String(d.minute).padStart(2, "0") + " Uhr" });
        schreibListe(SCHULD_SCHLUESSEL, s);
        const f = freigekauft(); f.add(id); schreibListe(FREI_SCHLUESSEL, [...f]);
        box.innerHTML = '<p class="kauf-gross">✨</p><p class="kauf-titel">Danke, Toni!</p><p class="entdeckt-klein">Gleich zeigt dir das Handy: ' + name.replace(/</g, "") + "</p>";
        setTimeout(() => ak.fuehrung.starte(id), 1600);
      });
    });
  }
  // Unterschriftsfeld: mit dem Finger malen, Bestätigen erst nach einer echten Unterschrift
  function unterschrift(c, ok, loeschen, fertig) {
    const g = c.getContext("2d");
    g.lineWidth = 5; g.lineCap = "round"; g.lineJoin = "round"; g.strokeStyle = "#6b1532";
    let malt = false, letzter = null, punkte = 0;
    const pos = (e) => { const r = c.getBoundingClientRect(); return [((e.clientX - r.left) / r.width) * c.width, ((e.clientY - r.top) / r.height) * c.height]; };
    c.addEventListener("pointerdown", (e) => { malt = true; letzter = pos(e); try { c.setPointerCapture(e.pointerId); } catch (_) { /* egal */ } e.preventDefault(); });
    c.addEventListener("pointermove", (e) => {
      if (!malt) return;
      const p = pos(e);
      g.beginPath(); g.moveTo(letzter[0], letzter[1]); g.lineTo(p[0], p[1]); g.stroke();
      letzter = p; punkte++;
      if (punkte > 25) ok.disabled = false;
    });
    ["pointerup", "pointercancel"].forEach((n) => c.addEventListener(n, () => { malt = false; }));
    loeschen.addEventListener("click", () => { g.clearRect(0, 0, c.width, c.height); punkte = 0; ok.disabled = true; });
    ok.addEventListener("click", () => {
      // klein speichern
      const k = document.createElement("canvas");
      k.width = 300; k.height = 110;
      k.getContext("2d").drawImage(c, 0, 0, k.width, k.height);
      fertig(k.toDataURL("image/png"));
    });
  }

  function hinweis(text) {
    let c = document.getElementById("entdecken-chip");
    if (!c) {
      c = document.createElement("div");
      c.id = "entdecken-chip";
      c.className = "entdecken-chip";
      c.setAttribute("role", "status");
      document.body.appendChild(c);
    }
    c.textContent = text;
    c.classList.add("sichtbar");
    clearTimeout(hinweis.timer);
    hinweis.timer = setTimeout(() => c.classList.remove("sichtbar"), 2800);
  }

  /* ---------- Melden ---------- */
  function entdeckt(id) {
    if (!IDS.includes(id) || !ak.intro.bereit() || gefunden.has(id)) return;
    gefunden.add(id);
    schreib([...gefunden]);
    zeigeKnopf();
    const eintrag = LISTE.find((e) => e[0] === id);
    setTimeout(() => hinweis("✨ Neu entdeckt: " + eintrag[2] + " · " + gefunden.size + " von " + LISTE.length), 900);
    if (!knopf.hidden) knopf.animate([{ transform: "scale(1)" }, { transform: "scale(1.12)" }, { transform: "scale(1)" }], { duration: 500, delay: 900 });
  }
  window.adventkalender.entdeckt = entdeckt;
  window.adventkalender.album = { oeffne, liste: () => [...gefunden], anzahl: LISTE.length };

  // Überraschungen aus app.js und vogel.js erkennen wir am Antippen
  document.addEventListener("click", (e) => {
    const t = e.target;
    if (!t.closest) return;
    if (t.closest(".vogel")) entdeckt("vogel");
    else if (t.closest(".capy-laeufer")) entdeckt("capy");
    else if (t.closest(".landschaft .baum")) entdeckt("baum");
    else if (t.closest(".landschaft [data-haus]") && !t.closest("rect.fenster, .fenster-capy")) entdeckt("haus");
  }, true);

  /* ---------- Ruhe im Hintergrund, solange ein Fenster offen ist ---------- */
  // Solange ein Fenster offen ist, lässt sich die Seite dahinter nicht scrollen.
  // Der Körper wird festgehalten und danach an dieselbe Stelle zurückgesetzt.
  let gemerkt = 0;
  function sperre(an) {
    const b = document.body;
    if (an) {
      gemerkt = window.scrollY;
      b.style.position = "fixed";
      b.style.top = -gemerkt + "px";
      b.style.left = "0";
      b.style.right = "0";
      b.style.width = "100%";
    } else {
      b.style.position = b.style.top = b.style.left = b.style.right = b.style.width = "";
      const vorher = html.style.scrollBehavior;
      html.style.scrollBehavior = "auto";
      window.scrollTo(0, gemerkt);
      html.style.scrollBehavior = vorher;
    }
  }
  function ruhe() {
    const an = !!document.querySelector("dialog[open]");
    if (an === html.classList.contains("ruhe")) return;
    html.classList.toggle("ruhe", an);
    sperre(an);
    document.querySelectorAll(".goldflocke").forEach((f) => f.getAnimations().forEach((a) => (an ? a.pause() : a.play())));
  }
  new MutationObserver(ruhe).observe(document.body, { subtree: true, attributes: true, attributeFilter: ["open"], childList: true });

  zeigeKnopf();
})();
