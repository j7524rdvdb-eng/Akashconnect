/* Christchurch tramway ride — scroll = travel, stops = CV beats */
(function () {
  "use strict";

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* FormSubmit — destination not in markup */
  const form = document.getElementById("enquiryForm");
  if (form) {
    form.action = atob("aHR0cHM6Ly9mb3Jtc3VibWl0LmNvL2FrYXNodGhhdHRhbnBhcmFtYmlsQGdtYWlsLmNvbQ==");
  }

  const sent = document.getElementById("contactSent");
  if (sent && /sent=1/.test(location.search)) {
    sent.hidden = false;
  }

  /* Mobile drawer */
  const menuBtn = document.getElementById("menuBtn");
  const drawer = document.getElementById("drawer");
  if (menuBtn && drawer) {
    menuBtn.addEventListener("click", () => {
      const open = menuBtn.getAttribute("aria-expanded") === "true";
      menuBtn.setAttribute("aria-expanded", String(!open));
      drawer.hidden = open;
    });
    drawer.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        menuBtn.setAttribute("aria-expanded", "false");
        drawer.hidden = true;
      });
    });
  }

  /* Boarding world — hard cuts through landmarks while waiting to ride */
  const shots = Array.from(document.querySelectorAll(".world-shot"));
  const placeLabel = document.getElementById("placeLabel");
  let shotIdx = 0;
  let autoTimer = null;

  function showShot(i) {
    if (!shots.length) return;
    shotIdx = ((i % shots.length) + shots.length) % shots.length;
    shots.forEach((el, n) => el.classList.toggle("is-active", n === shotIdx));
    if (placeLabel) {
      placeLabel.textContent = shots[shotIdx].getAttribute("data-place") || "";
    }
  }

  function startAutoShots() {
    if (reduced || !shots.length || autoTimer) return;
    autoTimer = setInterval(() => showShot(shotIdx + 1), 3000);
  }

  function stopAutoShots() {
    if (autoTimer) {
      clearInterval(autoTimer);
      autoTimer = null;
    }
  }

  showShot(0);
  startAutoShots();

  /* Jump boarding world to a landmark when a stop requests it */
  function jumpToShot(index) {
    if (typeof index !== "number" || index < 0) return;
    stopAutoShots();
    showShot(index);
  }

  /* Gentle parallax on boarding world */
  const world = document.getElementById("cityWorld");
  if (world && !reduced && window.matchMedia("(pointer: fine)").matches) {
    world.addEventListener(
      "pointermove",
      (e) => {
        const r = world.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width - 0.5) * 12;
        const y = ((e.clientY - r.top) / r.height - 0.5) * 8;
        const poly = world.querySelector(".world-poly");
        if (poly) poly.style.translate = `${x * 0.4}px ${y * 0.4}px`;
      },
      { passive: true }
    );
  }

  /* Ride progress + active stop */
  const hud = document.getElementById("tramHud");
  const hudStop = document.getElementById("hudStop");
  const hudProgress = document.getElementById("hudProgress");
  const stops = Array.from(document.querySelectorAll(".stop[data-stop]"));

  function updateRide() {
    const doc = document.documentElement;
    const max = Math.max(1, doc.scrollHeight - window.innerHeight);
    const p = Math.min(1, Math.max(0, window.scrollY / max));
    if (hudProgress) hudProgress.style.width = `${(p * 100).toFixed(1)}%`;
    if (hud) hud.classList.toggle("is-on", window.scrollY > 40);

    let active = stops[0];
    const mid = window.innerHeight * 0.42;
    for (const s of stops) {
      const r = s.getBoundingClientRect();
      if (r.top <= mid && r.bottom > mid) active = s;
    }
    if (active && hudStop) {
      hudStop.textContent = active.getAttribute("data-stop") || "";
    }
    if (active && active.hasAttribute("data-shot")) {
      const idx = Number(active.getAttribute("data-shot"));
      if (!Number.isNaN(idx)) jumpToShot(idx);
    } else if (window.scrollY < window.innerHeight * 0.55) {
      startAutoShots();
    }

    document.querySelectorAll(".destination").forEach((el) => {
      const r = el.getBoundingClientRect();
      const inView = r.top < window.innerHeight * 0.75 && r.bottom > window.innerHeight * 0.2;
      el.classList.toggle("is-in-view", inView);
    });
  }

  let ticking = false;
  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        updateRide();
        ticking = false;
      });
    },
    { passive: true }
  );
  updateRide();

  /* Fast card reveals */
  const cards = document.querySelectorAll("[data-reveal]");
  if (cards.length) {
    if (reduced || !("IntersectionObserver" in window)) {
      cards.forEach((c) => c.classList.add("is-in"));
    } else {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-in");
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -5% 0px" }
      );
      cards.forEach((c) => io.observe(c));
    }
  }
})();
