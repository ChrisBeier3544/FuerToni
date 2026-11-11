/*
 * ===========================================================
 *  ANLEITUNG ALS BRIEF
 *  Ab dem Geburtstag um 0:30 Uhr (deutsche Zeit) faltet sich nach
 *  dem Geburtstagsbrief ein zweiter Brief auf, Seite für Seite wie
 *  eine kleine Einführung. Danach jederzeit über „Dein Tag“.
 *  Der Inhalt steht verschlüsselt in inhalte.js (anleitung).
 * ===========================================================
 */
(function () {
  "use strict";

  const ak = window.adventkalender;
  if (!ak || !ak.intro || !KALENDER.anleitung) return;
  const SCHLUESSEL = "toni-anleitung-" + KALENDER.jahr;
  const ruhig = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const ab = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(KALENDER.briefAb || "");

  // Ist es (deutsche Zeit) schon 26.11., 0:30 Uhr oder später?
  function freigegeben() {
    if (!ak.intro.bereit() || !ab) return false;
    const d = ak.intro.datum();
    const jetzt = [d.jahr, d.monat, d.tag, d.stunde, d.minute];
    const grenze = ab.slice(1).map(Number);
    for (let i = 0; i < 5; i++) if (jetzt[i] !== grenze[i]) return jetzt[i] > grenze[i];
    return true;
  }
  let inhalt = null;
  function seiten() {
    if (inhalt) return inhalt;
    const a = KALENDER.anleitung;
    if (a.seiten) inhalt = a.seiten;
    else if (a.geheim && ak.entschluessle && freigegeben()) inhalt = (ak.entschluessle(a.geheim, "anleitung") || {}).seiten || null;
    return inhalt;
  }
  const gesehen = () => { try { return localStorage.getItem(SCHLUESSEL) === "1"; } catch (_) { return false; } };
  const merke = () => { try { localStorage.setItem(SCHLUESSEL, "1"); } catch (_) { /* egal */ } };

  /* ---------- Fenster ---------- */
  const dlg = document.createElement("dialog");
  dlg.className = "dialog anleitung-dialog";
  dlg.setAttribute("aria-labelledby", "anleitung-titel");
  dlg.innerHTML =
    '<div class="anleitung-papier">' +
    '<button class="schliessen" type="button" aria-label="Schließen">×</button>' +
    '<p class="anleitung-kopf">Kleine Anleitung für dich</p>' +
    '<div class="anleitung-seite" aria-live="polite"><h2 id="anleitung-titel"></h2><div class="anleitung-text"></div></div>' +
    '<div class="anleitung-fuss">' +
    '<button type="button" class="anleitung-zurueck">Zurück</button>' +
    '<p class="anleitung-punkte" aria-hidden="true"></p>' +
    '<button type="button" class="anleitung-weiter">Weiter</button></div></div>';
  document.body.appendChild(dlg);
  const titel = dlg.querySelector("h2"), text = dlg.querySelector(".anleitung-text"), seiteEl = dlg.querySelector(".anleitung-seite");
  const zurueck = dlg.querySelector(".anleitung-zurueck"), weiter = dlg.querySelector(".anleitung-weiter"), punkte = dlg.querySelector(".anleitung-punkte");
  let nr = 0;

  function zeige(n, richtung) {
    const s = seiten();
    if (!s) return;
    nr = Math.max(0, Math.min(s.length - 1, n));
    const p = s[nr];
    titel.textContent = p.titel || "";
    text.textContent = "";
    (p.text || []).forEach((t, i) => { const e = document.createElement("p"); e.textContent = t; if (i === 0 && /,$/.test(t)) e.className = "anleitung-anrede"; text.appendChild(e); });
    if (p.punkte) {
      const ul = document.createElement("ul");
      ul.className = "anleitung-liste";
      p.punkte.forEach((q) => {
        const li = document.createElement("li");
        const z = document.createElement("span"); z.className = "anleitung-zeichen"; z.setAttribute("aria-hidden", "true"); z.textContent = q.zeichen || "";
        const b = document.createElement("span");
        const f = document.createElement("strong"); f.textContent = q.fett || "";
        b.append(f, " " + (q.text || ""));
        li.append(z, b);
        ul.appendChild(li);
      });
      text.appendChild(ul);
    }
    if (p.gruss) { const g = document.createElement("p"); g.className = "anleitung-gruss"; g.textContent = p.gruss; text.appendChild(g); }
    zurueck.disabled = nr === 0;
    weiter.textContent = nr === s.length - 1 ? "Los geht's ♥️" : "Weiter";
    punkte.textContent = "";
    s.forEach((_, i) => { const d = document.createElement("span"); if (i === nr) d.className = "an"; punkte.appendChild(d); });
    dlg.querySelector(".anleitung-papier").scrollTop = 0;
    if (!ruhig && richtung) seiteEl.animate([{ opacity: 0, transform: "translateX(" + richtung * 26 + "px)" }, { opacity: 1, transform: "none" }], { duration: 320, easing: "ease-out" });
  }
  function oeffne(start) {
    if (!seiten() || dlg.open) return;
    zeige(start || 0, 0);
    if (typeof dlg.showModal === "function") dlg.showModal(); else dlg.setAttribute("open", "");
    if (!ruhig) dlg.querySelector(".anleitung-papier").animate([
      { transform: "perspective(900px) rotateX(-70deg) scaleY(.4)", opacity: 0 },
      { transform: "perspective(900px) rotateX(8deg) scaleY(1.02)", opacity: 1, offset: 0.7 },
      { transform: "none", opacity: 1 },
    ], { duration: 750, easing: "cubic-bezier(.3,1.1,.5,1)" });
    merke();
    weiter.focus();
  }
  zurueck.addEventListener("click", () => zeige(nr - 1, -1));
  weiter.addEventListener("click", () => { const s = seiten(); if (s && nr < s.length - 1) zeige(nr + 1, 1); else dlg.close(); });
  dlg.querySelector(".schliessen").addEventListener("click", () => dlg.close());
  dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") { e.preventDefault(); weiter.click(); }
    if (e.key === "ArrowLeft" && nr > 0) { e.preventDefault(); zeige(nr - 1, -1); }
  });
  // Wischen zum Blättern
  let wx = null;
  dlg.addEventListener("pointerdown", (e) => { wx = e.clientX; });
  dlg.addEventListener("pointerup", (e) => {
    if (wx === null) return;
    const dx = e.clientX - wx; wx = null;
    if (Math.abs(dx) < 60) return;
    if (dx < 0 && nr < seiten().length - 1) zeige(nr + 1, 1);
    if (dx > 0 && nr > 0) zeige(nr - 1, -1);
  });

  /* ---------- Knopf in „Dein Tag“ ---------- */
  const knoepfe = document.querySelector(".kopf-knoepfe");
  const knopf = document.createElement("button");
  knopf.type = "button";
  knopf.id = "anleitung-knopf";
  knopf.className = "sammlung-knopf";
  knopf.hidden = true;
  knopf.innerHTML = '<svg class="ui-icon" aria-hidden="true"><use href="#i-brief"/></svg> Anleitung';
  knopf.addEventListener("click", () => oeffne(0));
  if (knoepfe) knoepfe.appendChild(knopf);

  /* ---------- Wann sie von selbst erscheint ---------- */
  const intro = document.getElementById("intro");
  let warten = false;
  function pruefe() {
    if (!freigegeben()) { knopf.hidden = true; return; }
    knopf.hidden = !seiten();
    if (gesehen() || warten || dlg.open) return;
    // direkt nach dem Geburtstagsbrief bzw. sobald die Seite offen ist
    if (intro && !intro.hidden) return;
    if (document.querySelector("dialog[open], .aufbau-buehne, .special-buehne")) return;
    warten = true;
    setTimeout(() => { warten = false; if (!gesehen() && !document.querySelector("dialog[open]")) oeffne(0); }, ruhig ? 50 : 500);
  }
  setInterval(pruefe, 300);

  window.adventkalender.anleitung = { oeffne };
})();
