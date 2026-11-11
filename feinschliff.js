/*
 * ===========================================================
 *  FEINSCHLIFF
 *    Regalbretter, die sauber an den Päckchen enden
 *    eigener Player für die Sprachnachrichten
 *    saubere Zeilenumbrüche in „Dein Tag“
 *    weiche Ränder am Fotostreifen
 * ===========================================================
 */
(function () {
  "use strict";
  const HERZ = '<svg class="ui-icon ui-herz" aria-hidden="true"><use href="#i-herz"/></svg>';

  /* ---------- Regalbretter ----------
     Bretter liegen zwischen den Reihen. Wo ein hohes Päckchen über zwei
     Reihen steht, endet das Brett genau an seiner Kante, statt als kurzer
     Stummel in der Lücke zu stehen. */
  const kal = document.getElementById("kalender");
  if (kal) {
    const ebene = document.createElement("div");
    ebene.className = "bretter";
    ebene.setAttribute("aria-hidden", "true");
    kal.prepend(ebene);
    let geplant = false;
    const lege = () => {
      geplant = false;
      const tueren = [...kal.querySelectorAll(":scope > .tuer")];
      if (!tueren.length) return;
      const st = getComputedStyle(kal);
      const spalten = st.gridTemplateColumns.split(" ").filter(Boolean).length || 3;
      const lueckeX = parseFloat(st.columnGap) || 0, lueckeY = parseFloat(st.rowGap) || 0;
      const links = parseFloat(st.paddingLeft) || 0, oben = parseFloat(st.paddingTop) || 0;
      const innenBreite = kal.clientWidth - links - (parseFloat(st.paddingRight) || 0);
      const spaltenBreite = (innenBreite - (spalten - 1) * lueckeX) / spalten;
      const einzeln = tueren.find((t) => !t.classList.contains("gross") && !t.classList.contains("hoch")) || tueren[0];
      const zeile = einzeln.offsetHeight;
      const schrittX = spaltenBreite + lueckeX, schrittY = zeile + lueckeY;
      let reihen = 0;
      const belegt = [];
      for (const t of tueren) {
        const c0 = Math.round((t.offsetLeft - links) / schrittX);
        const r0 = Math.round((t.offsetTop - oben) / schrittY);
        const cs = Math.max(1, Math.round((t.offsetWidth + lueckeX) / schrittX));
        const rs = Math.max(1, Math.round((t.offsetHeight + lueckeY) / schrittY));
        belegt.push({ c0, r0, cs, rs });
        reihen = Math.max(reihen, r0 + rs);
      }
      const rand = 8; // innerer Holzrahmen
      const xLinks = (c) => links + c * schrittX;
      let html = "";
      for (let r = 0; r < reihen; r++) {
        // Spalten, in denen ein Päckchen über diese Brettkante hinausragt
        const gesperrt = new Array(spalten).fill(false);
        for (const b of belegt) {
          if (b.r0 <= r && b.r0 + b.rs - 1 > r) for (let c = b.c0; c < b.c0 + b.cs; c++) gesperrt[c] = true;
        }
        const y = oben + (r + 1) * schrittY - lueckeY;
        let c = 0;
        while (c < spalten) {
          if (gesperrt[c]) { c++; continue; }
          let e = c;
          while (e + 1 < spalten && !gesperrt[e + 1]) e++;
          const x0 = c === 0 ? rand : xLinks(c) - lueckeX;
          const x1 = e === spalten - 1 ? kal.clientWidth - rand : xLinks(e) + spaltenBreite + lueckeX;
          const klasse = "brett" + (c === 0 ? "" : " kante-links") + (e === spalten - 1 ? "" : " kante-rechts");
          html += '<span class="' + klasse + '" style="left:' + x0.toFixed(1) + "px;width:" + (x1 - x0).toFixed(1) + "px;top:" + y.toFixed(1) + "px;height:" + Math.max(8, lueckeY).toFixed(1) + 'px"></span>';
          c = e + 1;
        }
      }
      ebene.innerHTML = html;
      kal.classList.add("mit-brettern");
    };
    const plane = () => { if (!geplant) { geplant = true; requestAnimationFrame(lege); } };
    if (window.ResizeObserver) new ResizeObserver(plane).observe(kal);
    window.addEventListener("resize", plane);
    new MutationObserver(plane).observe(kal, { childList: true });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(plane);
    plane();
  }

  /* ---------- Player für die Sprachnachrichten ---------- */
  const audio = document.getElementById("dialog-audio-player");
  const player = document.querySelector(".sprachnachricht .player");
  if (audio && player) {
    const knopf = player.querySelector(".player-knopf");
    const leiste = player.querySelector(".player-leiste");
    const fortschritt = player.querySelector(".player-fortschritt");
    const punkt = player.querySelector(".player-punkt");
    const zeit = player.querySelector(".player-zeit");
    const mmss = (s) => { s = Math.max(0, Math.floor(s || 0)); return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0"); };
    const zeige = () => {
      const d = isFinite(audio.duration) ? audio.duration : 0;
      const anteil = d ? Math.min(1, audio.currentTime / d) : 0;
      fortschritt.style.width = (anteil * 100).toFixed(2) + "%";
      punkt.style.left = (anteil * 100).toFixed(2) + "%";
      leiste.setAttribute("aria-valuenow", String(Math.round(anteil * 100)));
      zeit.textContent = audio.currentTime > 0 && !audio.ended ? mmss(audio.currentTime) + " / " + mmss(d) : mmss(d);
    };
    const status = () => {
      player.classList.toggle("spielt", !audio.paused && !audio.ended);
      knopf.setAttribute("aria-label", audio.paused ? "Sprachnachricht abspielen" : "Sprachnachricht anhalten");
    };
    knopf.addEventListener("click", () => { if (audio.paused) audio.play().catch(() => {}); else audio.pause(); });
    ["play", "pause", "ended"].forEach((e) => audio.addEventListener(e, () => { status(); zeige(); }));
    ["timeupdate", "loadedmetadata", "durationchange", "emptied"].forEach((e) => audio.addEventListener(e, zeige));
    audio.addEventListener("ended", () => { audio.currentTime = 0; zeige(); });
    const springe = (x) => {
      const r = leiste.getBoundingClientRect();
      if (!isFinite(audio.duration) || !r.width) return;
      audio.currentTime = Math.max(0, Math.min(1, (x - r.left) / r.width)) * audio.duration;
      zeige();
    };
    let ziehen = false;
    leiste.addEventListener("pointerdown", (e) => { ziehen = true; leiste.setPointerCapture(e.pointerId); springe(e.clientX); });
    leiste.addEventListener("pointermove", (e) => { if (ziehen) springe(e.clientX); });
    leiste.addEventListener("pointerup", () => { ziehen = false; });
    leiste.addEventListener("pointercancel", () => { ziehen = false; });
    leiste.addEventListener("keydown", (e) => {
      if (!isFinite(audio.duration)) return;
      if (e.key === "ArrowRight") { audio.currentTime = Math.min(audio.duration, audio.currentTime + 5); e.preventDefault(); }
      if (e.key === "ArrowLeft") { audio.currentTime = Math.max(0, audio.currentTime - 5); e.preventDefault(); }
      if (e.key === " " || e.key === "Enter") { knopf.click(); e.preventDefault(); }
    });
    status(); zeige();
  }

  /* ---------- „Dein Tag“: jeder Satz in eine eigene Zeile ---------- */
  const statusEl = document.getElementById("status");
  if (statusEl) {
    let eigen = false;
    const ordne = () => {
      if (eigen) return;
      const text = statusEl.textContent;
      if (statusEl.dataset.text === text) return;
      // Satzende: . ! ? oder ein Emoji, danach ein neuer Satz mit Großbuchstaben
      const saetze = text.split(/(?<=[.!?]|\p{Extended_Pictographic}\uFE0F?)\s+(?=[A-Z\u00C4\u00D6\u00DC])/u);
      eigen = true;
      statusEl.textContent = "";
      for (const s of saetze) {
        const z = document.createElement("span");
        z.className = "status-zeile";
        z.textContent = s;
        statusEl.appendChild(z);
      }
      herzenTauschen(statusEl);
      statusEl.dataset.text = statusEl.textContent;
      eigen = false;
    };
    new MutationObserver(ordne).observe(statusEl, { childList: true, characterData: true, subtree: true });
    ordne();
  }

  /* ---------- Herz Emoji in Untertitel und „Dein Tag“ durch das eigene Herz ersetzen ---------- */
  function herzenTauschen(el) {
    const laufe = (knoten) => {
      for (const k of [...knoten.childNodes]) {
        if (k.nodeType === 3 && /\u2665\uFE0F|\u2764\uFE0F/.test(k.nodeValue)) {
          const teile = k.nodeValue.split(/\u2665\uFE0F|\u2764\uFE0F/);
          const frag = document.createDocumentFragment();
          teile.forEach((t, i) => {
            if (t) frag.appendChild(document.createTextNode(t));
            if (i < teile.length - 1) { const s = document.createElement("span"); s.className = "herz-zeichen"; s.innerHTML = HERZ; frag.appendChild(s); }
          });
          k.replaceWith(frag);
        } else if (k.nodeType === 1 && !k.classList.contains("herz-zeichen")) laufe(k);
      }
    };
    laufe(el);
  }
  for (const id of ["untertitel"]) {
    const el = document.getElementById(id);
    if (!el) continue;
    let dran = false;
    const los = () => { if (dran) return; dran = true; herzenTauschen(el); dran = false; };
    new MutationObserver(los).observe(el, { childList: true, characterData: true, subtree: true });
    los();
  }

  /* ---------- Fotostreifen: weiche Ränder, wo es weitergeht ---------- */
  const streifen = document.getElementById("fotostreifen");
  if (streifen) {
    const raender = () => {
      const mehr = streifen.scrollWidth > streifen.clientWidth + 4;
      streifen.classList.toggle("rand-links", mehr && streifen.scrollLeft > 4);
      streifen.classList.toggle("rand-rechts", mehr && streifen.scrollLeft < streifen.scrollWidth - streifen.clientWidth - 4);
    };
    streifen.addEventListener("scroll", raender, { passive: true });
    window.addEventListener("resize", raender);
    if (window.ResizeObserver) new ResizeObserver(raender).observe(streifen);
    raender();
  }
})();
