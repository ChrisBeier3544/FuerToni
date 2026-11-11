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
  ];
  const IDS = LISTE.map((e) => e[0]);
  const lies = () => { try { const v = JSON.parse(localStorage.getItem(SCHLUESSEL) || "[]"); return Array.isArray(v) ? v.filter((x) => IDS.includes(x)) : []; } catch (_) { return []; } };
  const schreib = (v) => { try { localStorage.setItem(SCHLUESSEL, JSON.stringify(v)); } catch (_) { /* egal */ } };
  let gefunden = new Set(lies());

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
    '<ul class="entdeckt-liste"></ul>' +
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
    for (const [id, zeichen, name] of reihenfolge) {
      const li = document.createElement("li");
      const da = gefunden.has(id);
      li.className = "entdeckt-eintrag" + (da ? " da" : "");
      li.innerHTML = '<span class="entdeckt-zeichen" aria-hidden="true"></span><span class="entdeckt-name"></span>';
      li.firstChild.textContent = da ? zeichen : "?";
      li.lastChild.textContent = da ? name : "???";
      liste.appendChild(li);
    }
    const n = gefunden.size;
    dlg.querySelector(".entdeckt-balken span").style.width = (n / LISTE.length) * 100 + "%";
    dlg.querySelector(".entdeckt-stand").textContent = n === LISTE.length
      ? "Du hast alles entdeckt, Maus! 🎉 Du bist die beste Entdeckerin der Welt ♥️"
      : n + " von " + LISTE.length + " Überraschungen entdeckt";
    if (typeof dlg.showModal === "function") dlg.showModal(); else dlg.setAttribute("open", "");
  }
  knopf.addEventListener("click", oeffne);

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
