/*
 * ===========================================================
 *  VOGEL: Ein kleines Rotkehlchen sitzt oben auf der Karte
 *  „Dein Tag“ (bzw. auf dem Countdown) und sagt den Tagesgruß.
 *  Am Tag vor dem ersten Easter Egg gibt es einen Hinweis.
 * ===========================================================
 */
(function () {
  "use strict";

  const ak = window.adventkalender;
  const intro = document.getElementById("intro");
  const karte = document.querySelector(".heute-karte");
  const countdown = document.getElementById("intro-countdown");
  const grussQuelle = document.getElementById("gruss");
  if (!ak || !ak.intro || !karte || !grussQuelle) return;

  const VOGEL =
    '<svg viewBox="0 0 60 60" aria-hidden="true">' +
    '<path d="M24 50l-3 6M30 50l3 6M21 56h-4M21 56l-2 3M33 56h4M33 56l2 3" stroke="#e39a3b" stroke-width="2.2" stroke-linecap="round"/>' +
    '<g class="vogel-koerper">' +
    '<path d="M8 34q-8 2-6 9q6-1 10-6z" fill="#7a4e33"/>' +
    '<ellipse cx="28" cy="32" rx="21" ry="19" fill="#8a5a3a"/>' +
    '<ellipse cx="30" cy="38" rx="15" ry="13" fill="#f26b5b"/>' +
    '<ellipse cx="31" cy="42" rx="10" ry="8" fill="#fff2e4"/>' +
    '<path d="M14 30q-4 10 6 14q-4-8-6-14z" fill="#6b4632"/>' +
    '<path d="M26 13q2-6 6-5q-3 1-3 5z" fill="#8a5a3a"/>' +
    '<circle cx="22" cy="28" r="5" fill="#fff"/><circle cx="36" cy="28" r="5" fill="#fff"/>' +
    '<circle cx="23" cy="29" r="3.2" fill="#2a1a12"/><circle cx="37" cy="29" r="3.2" fill="#2a1a12"/>' +
    '<circle cx="24.2" cy="27.6" r="1.2" fill="#fff"/><circle cx="38.2" cy="27.6" r="1.2" fill="#fff"/>' +
    '<rect class="augenlid" x="16.5" y="23" width="11" height="11" rx="5.5" fill="#8a5a3a"/><rect class="augenlid" x="30.5" y="23" width="11" height="11" rx="5.5" fill="#8a5a3a"/>' +
    '<path d="M27 33l2.5 4 2.5-4z" fill="#f3b23c"/>' +
    '<circle cx="17" cy="35" r="3" fill="#ff9fb4" opacity=".7"/><circle cx="41" cy="35" r="3" fill="#ff9fb4" opacity=".7"/>' +
    "</g></svg>";

  function baueVogel(ziel) {
    const v = document.createElement("button");
    v.type = "button";
    v.className = "vogel";
    v.setAttribute("aria-label", "Vogel antippen");
    v.innerHTML = '<span class="vogel-blase" hidden></span>' + VOGEL;
    ziel.appendChild(v);
    v.addEventListener("click", () => { v.classList.remove("hopst"); void v.offsetWidth; v.classList.add("hopst"); sprich(v); });
    return v;
  }
  const vogelKarte = baueVogel(karte);
  const vogelIntro = countdown ? baueVogel(countdown) : null;

  // Am Tag vor dem ersten Easter Egg gibt es einen Hinweis
  const erstesEi = Math.min(...(KALENDER.eastereggs || []).map((e) => e.ab || 99));
  const HINWEIS = "Psst … auf dieser Seite sind Geheimnisse versteckt 🤫 Wenn ein Emoji mal an einer komischen Stelle ist, lohnt sich ein Klick darauf!";
  function saetze() {
    const liste = [grussQuelle.textContent || ""];
    const d = ak.kalenderDatum ? ak.kalenderDatum() : ak.intro.datum();
    if (d.jahr === KALENDER.jahr && d.monat === 12 && d.tag === erstesEi - 1) liste.push(HINWEIS);
    return liste.filter(Boolean);
  }

  const timer = new Map();
  function sprich(v) {
    const blase = v.querySelector(".vogel-blase");
    (timer.get(v) || []).forEach(clearTimeout);
    const liste = saetze();
    if (!liste.length) return;
    const t = [];
    liste.forEach((satz, i) => t.push(setTimeout(() => zeige(v, blase, satz), i * 5600)));
    t.push(setTimeout(() => { blase.hidden = true; v.classList.remove("redet"); }, liste.length * 5600 - 600));
    timer.set(v, t);
  }
  function zeige(v, blase, satz) {
    blase.textContent = satz;
    blase.style.right = "10px";
    blase.hidden = false;
    v.classList.add("redet");
    // Sprechblase im Bild halten
    const r = blase.getBoundingClientRect();
    if (r.left < 12) blase.style.right = 10 - (12 - r.left) + "px";
  }

  // 2 Sekunden nach dem Öffnen des Umschlags (oder nach dem Laden) einmal sprechen
  let introGesprochen = false, karteGesprochen = false;
  setInterval(() => {
    if (!ak.intro.bereit() || !grussQuelle.textContent) return;
    const phase = ak.intro.phase();
    const countdownSichtbar = !intro.hidden && countdown && !countdown.hidden && (phase === "warten" || phase === "geburtstag");
    if (countdownSichtbar && !introGesprochen && vogelIntro) { introGesprochen = true; setTimeout(() => sprich(vogelIntro), 2000); }
    if (intro.hidden && !karteGesprochen) { karteGesprochen = true; setTimeout(() => sprich(vogelKarte), 2000); }
    if (vogelIntro) vogelIntro.hidden = !countdownSichtbar;
  }, 250);
})();
