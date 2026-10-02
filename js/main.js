/* Akash Raju — cinematic portfolio interactions */
(function () {
  "use strict";

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isCoarse = window.matchMedia("(pointer: coarse)").matches;
  const isMobile = () => window.matchMedia("(max-width: 900px)").matches;

  /* ---------- Custom cursor ---------- */
  const cursor = document.getElementById("cursor");
  const cursorLabel = cursor?.querySelector(".cursor__label");

  if (cursor && !isCoarse && window.innerWidth > 900) {
    document.body.classList.add("has-custom-cursor");
    let x = 0;
    let y = 0;
    let rx = 0;
    let ry = 0;

    window.addEventListener(
      "mousemove",
      (e) => {
        x = e.clientX;
        y = e.clientY;
      },
      { passive: true }
    );

    function tickCursor() {
      rx += (x - rx) * 0.22;
      ry += (y - ry) * 0.22;
      cursor.style.transform = `translate(${rx}px, ${ry}px)`;
      requestAnimationFrame(tickCursor);
    }
    tickCursor();

    document.querySelectorAll("[data-cursor]").forEach((el) => {
      el.addEventListener("mouseenter", () => {
        cursor.classList.add("is-hover");
        if (cursorLabel) cursorLabel.textContent = el.getAttribute("data-cursor") || "VIEW";
      });
      el.addEventListener("mouseleave", () => {
        cursor.classList.remove("is-hover");
        if (cursorLabel) cursorLabel.textContent = "";
      });
    });

    // Interactive defaults
    document.querySelectorAll("a, button, .panel, .editorial-card, .direction-card").forEach((el) => {
      if (el.hasAttribute("data-cursor")) return;
      el.addEventListener("mouseenter", () => {
        cursor.classList.add("is-hover");
        if (cursorLabel) cursorLabel.textContent = el.tagName === "A" || el.tagName === "BUTTON" ? "OPEN" : "VIEW";
      });
      el.addEventListener("mouseleave", () => {
        cursor.classList.remove("is-hover");
        if (cursorLabel) cursorLabel.textContent = "";
      });
    });
  }

  /* ---------- Nav scroll state ---------- */
  const nav = document.getElementById("nav");
  function updateNav() {
    if (!nav) return;
    nav.classList.toggle("is-scrolled", window.scrollY > 40);
  }
  window.addEventListener("scroll", updateNav, { passive: true });
  updateNav();

  /* ---------- Mobile nav ---------- */
  const burger = document.getElementById("navBurger");
  const navMobile = document.getElementById("navMobile");
  if (burger && navMobile) {
    burger.addEventListener("click", () => {
      const open = burger.getAttribute("aria-expanded") === "true";
      burger.setAttribute("aria-expanded", String(!open));
      navMobile.hidden = open;
      document.body.style.overflow = open ? "" : "hidden";
    });
    navMobile.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        burger.setAttribute("aria-expanded", "false");
        navMobile.hidden = true;
        document.body.style.overflow = "";
      });
    });
  }

  /* ---------- Ask Akash ---------- */
  const askTrigger = document.getElementById("askTrigger");
  const askPanel = document.getElementById("askPanel");
  const askClose = document.getElementById("askClose");

  function closeAsk() {
    if (!askPanel || !askTrigger) return;
    askPanel.hidden = true;
    askTrigger.setAttribute("aria-expanded", "false");
  }

  function openAsk() {
    if (!askPanel || !askTrigger) return;
    askPanel.hidden = false;
    askTrigger.setAttribute("aria-expanded", "true");
  }

  askTrigger?.addEventListener("click", () => {
    const open = askTrigger.getAttribute("aria-expanded") === "true";
    if (open) closeAsk();
    else openAsk();
  });
  askClose?.addEventListener("click", closeAsk);

  askPanel?.querySelectorAll("[data-target]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const sel = btn.getAttribute("data-target");
      const target = sel && document.querySelector(sel);
      closeAsk();
      if (target) {
        target.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
      }
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeAsk();
  });

  /* ---------- Private enquiry form ---------- */
  // Keep the destination out of the public markup while preserving the private enquiry flow.
  const enquiryForm = document.getElementById("enquiryForm");
  if (enquiryForm) {
    enquiryForm.action = atob("aHR0cHM6Ly9mb3Jtc3VibWl0LmNvL2FrYXNodGhhdHRhbnBhcmFtYmlsQGdtYWlsLmNvbQ==");
  }

  /* ---------- GSAP ---------- */
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    console.warn("GSAP not loaded — static layout only.");
    // Reveal hero without animation
    document.querySelectorAll(".hero__eyebrow, .hero__name, .hero__fullname, .hero__sub, .hero__scroll").forEach((el) => {
      el.style.opacity = "1";
      el.style.transform = "none";
    });
    document.querySelectorAll(".climax__word, .statement__line, .data-word, .transition-word").forEach((el) => {
      el.style.opacity = "1";
      el.style.transform = "none";
    });
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  if (reducedMotion) {
    gsap.set(
      [
        ".hero__eyebrow",
        ".hero__name",
        ".hero__fullname",
        ".hero__sub",
        ".hero__scroll",
        ".climax__word",
        ".statement__line",
        ".data-word",
        ".transition-word",
        ".flow__stage",
      ],
      { opacity: 1, y: 0, scale: 1, clearProps: "filter" }
    );
    gsap.set(".flow__connector", { className: "flow__connector is-lit" });
    return;
  }

  /* Hero intro */
  const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });
  heroTl
    .to(".hero__eyebrow", { opacity: 1, duration: 1.2, delay: 0.3 })
    .to(".hero__name", { opacity: 1, duration: 1.4 }, "-=0.6")
    .to(".hero__fullname", { opacity: 1, duration: 1.0 }, "-=0.9")
    .to(".hero__sub", { opacity: 1, duration: 1.1 }, "+=0.35")
    .to(".hero__scroll", { opacity: 1, duration: 0.9 }, "-=0.4");

  /* Subtle mouse parallax on hero atmosphere */
  if (!isCoarse) {
    const atm = document.querySelector(".hero__atmosphere");
    if (atm) {
      window.addEventListener(
        "mousemove",
        (e) => {
          if (window.scrollY > window.innerHeight) return;
          const px = (e.clientX / window.innerWidth - 0.5) * 20;
          const py = (e.clientY / window.innerHeight - 0.5) * 14;
          gsap.to(atm, { x: px, y: py, duration: 1.2, ease: "power2.out", overwrite: "auto" });
        },
        { passive: true }
      );
    }
  }

  /* Transition words — PEOPLE / POLICY / PROGRESS */
  if (!isMobile()) {
    const words = gsap.utils.toArray(".transition-word");
    words.forEach((word, i) => {
      const span = word.querySelector("span");
      gsap
        .timeline({
          scrollTrigger: {
            trigger: ".transition-words",
            start: () => `top+=${(i / words.length) * 100}% top`,
            end: () => `top+=${((i + 1) / words.length) * 100}% top`,
            scrub: 0.8,
          },
        })
        .fromTo(
          word,
          { opacity: 0 },
          { opacity: 1, duration: 0.25, ease: "none" },
          0
        )
        .fromTo(
          span,
          { scale: 0.72, y: 80, filter: "blur(12px)" },
          { scale: 1.08, y: -40, filter: "blur(0px)", ease: "none" },
          0
        )
        .to(word, { opacity: 0, duration: 0.2, ease: "none" }, 0.75);
    });
  }

  /* Chapter reveals */
  gsap.utils.toArray(".chapter__heading-line, .chapter__label, .chapter__meta, .chapter__statement").forEach((el) => {
    gsap.from(el, {
      scrollTrigger: {
        trigger: el,
        start: "top 88%",
        toggleActions: "play none none none",
      },
      opacity: 0,
      y: 36,
      duration: 1.1,
      ease: "power3.out",
    });
  });

  gsap.from(".split__media", {
    scrollTrigger: { trigger: ".split", start: "top 75%" },
    opacity: 0,
    x: -40,
    duration: 1.2,
    ease: "power3.out",
  });
  gsap.from(".split__copy p", {
    scrollTrigger: { trigger: ".split__copy", start: "top 75%" },
    opacity: 0,
    y: 24,
    duration: 0.9,
    stagger: 0.12,
    ease: "power3.out",
  });

  /* Data moment words */
  if (!isMobile()) {
    const dataWords = gsap.utils.toArray(".data-word");
    dataWords.forEach((word, i) => {
      gsap
        .timeline({
          scrollTrigger: {
            trigger: ".data-moment",
            start: () => `top+=${(i / dataWords.length) * 100}% top`,
            end: () => `top+=${((i + 1) / dataWords.length) * 100}% top`,
            scrub: 0.65,
          },
        })
        .fromTo(word, { opacity: 0, scale: 0.88 }, { opacity: 1, scale: 1, ease: "none" }, 0)
        .to(word, { opacity: 0, scale: 1.06, ease: "none" }, 0.7);
    });
  }

  /* Work flow stages */
  const stages = gsap.utils.toArray(".flow__stage");
  const connectors = gsap.utils.toArray(".flow__connector");
  stages.forEach((stage, i) => {
    ScrollTrigger.create({
      trigger: stage,
      start: "top 80%",
      onEnter: () => {
        stage.classList.add("is-active");
        if (i > 0 && connectors[i - 1]) connectors[i - 1].classList.add("is-lit");
      },
      onEnterBack: () => {
        stage.classList.add("is-active");
      },
    });
  });

  /* Direction climax */
  gsap
    .timeline({
      scrollTrigger: {
        trigger: "#directionClimax",
        start: "top 70%",
        toggleActions: "play none none none",
      },
    })
    .to(".climax__word", {
      opacity: 1,
      y: 0,
      duration: 1.15,
      stagger: 0.35,
      ease: "power3.out",
    });

  gsap.from(".direction-card", {
    scrollTrigger: { trigger: ".direction-grid", start: "top 80%" },
    opacity: 0,
    y: 30,
    duration: 0.9,
    stagger: 0.12,
    ease: "power3.out",
  });

  /* Horizontal trajectory (desktop) */
  const track = document.getElementById("trajectoryTrack");
  if (track && !isMobile()) {
    const getScroll = () => Math.max(0, track.scrollWidth - window.innerWidth + 120);
    gsap.to(track, {
      x: () => -getScroll(),
      ease: "none",
      scrollTrigger: {
        trigger: ".trajectory",
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        invalidateOnRefresh: true,
      },
    });
  }

  /* Editorial cards */
  gsap.utils.toArray(".editorial-card").forEach((card) => {
    gsap.from(card, {
      scrollTrigger: { trigger: card, start: "top 85%" },
      opacity: 0,
      y: 50,
      duration: 1.1,
      ease: "power3.out",
    });
  });

  /* Exact role cards */
  gsap.utils.toArray(".role-card").forEach((card) => {
    gsap.from(card, {
      scrollTrigger: { trigger: card, start: "top 88%" },
      opacity: 0,
      y: 36,
      duration: 0.95,
      ease: "power3.out",
    });
  });

  /* Case study panels */
  gsap.from(".panel", {
    scrollTrigger: { trigger: ".panels", start: "top 80%" },
    opacity: 0,
    y: 40,
    duration: 1,
    stagger: 0.15,
    ease: "power3.out",
  });

  /* Learning timeline */
  gsap.from(".learning__item", {
    scrollTrigger: { trigger: ".learning", start: "top 80%" },
    opacity: 0,
    x: -20,
    duration: 0.85,
    stagger: 0.1,
    ease: "power3.out",
  });

  /* Cinematic statement */
  const stmtTl = gsap.timeline({
    scrollTrigger: {
      trigger: ".statement",
      start: "top 55%",
      toggleActions: "play none none none",
    },
  });
  stmtTl
    .to('.statement__line[data-line="1"]', { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" })
    .to('.statement__line[data-line="2"]', { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" }, "+=0.7")
    .to('.statement__line[data-line="3"]', { opacity: 1, y: 0, duration: 1.3, ease: "power3.out" }, "+=0.85");

  /* Contact */
  gsap.from(".contact__actions .btn", {
    scrollTrigger: { trigger: ".contact", start: "top 70%" },
    opacity: 0,
    y: 20,
    duration: 0.8,
    stagger: 0.1,
    ease: "power3.out",
  });

  /* Refresh on resize */
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 250);
  });
})();
