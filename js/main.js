/**
 * Akash Connect — game controller
 * Boot → ride → mission unlocks → terminus
 */
import { TramWorld, STOPS, SECRET_AWARD } from "./world.js";

const $ = (sel) => document.querySelector(sel);

/* ---------- FormSubmit (email not in markup) ---------- */
const form = $("#enquiryForm");
if (form) {
  form.action = atob("aHR0cHM6Ly9mb3Jtc3VibWl0LmNvL2FrYXNodGhhdHRhbnBhcmFtYmlsQGdtYWlsLmNvbQ==");
}
if (/[?&]sent=1/.test(location.search)) {
  const sent = $("#contactSent");
  if (sent) sent.hidden = false;
}

/* ---------- Procedural audio (optional) ---------- */
class RideAudio {
  constructor() {
    this.enabled = false;
    this.ctx = null;
    this.nodes = null;
  }
  async ensure() {
    if (this.ctx) return;
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    this.ctx = new Ctx();
    const master = this.ctx.createGain();
    master.gain.value = 0;
    master.connect(this.ctx.destination);

    // soft tram hum
    const osc = this.ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = 78;
    const humGain = this.ctx.createGain();
    humGain.gain.value = 0.04;
    osc.connect(humGain);
    humGain.connect(master);
    osc.start();

    // air / wind noise
    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;
    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = "bandpass";
    noiseFilter.frequency.value = 420;
    noiseFilter.Q.value = 0.6;
    const noiseGain = this.ctx.createGain();
    noiseGain.gain.value = 0.018;
    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(master);
    noise.start();

    // coral tone lfo pad
    const pad = this.ctx.createOscillator();
    pad.type = "triangle";
    pad.frequency.value = 196;
    const padGain = this.ctx.createGain();
    padGain.gain.value = 0.012;
    pad.connect(padGain);
    padGain.connect(master);
    pad.start();

    this.nodes = { master, humGain, noiseGain, padGain, osc, pad };
  }
  async setEnabled(on) {
    await this.ensure();
    if (!this.ctx) return;
    if (this.ctx.state === "suspended") await this.ctx.resume();
    this.enabled = on;
    const g = this.nodes.master.gain;
    const now = this.ctx.currentTime;
    g.cancelScheduledValues(now);
    g.linearRampToValueAtTime(on ? 1 : 0, now + 0.35);
  }
  unlockChime() {
    if (!this.enabled || !this.ctx) return;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(523.25, this.ctx.currentTime);
    o.frequency.exponentialRampToValueAtTime(784, this.ctx.currentTime + 0.25);
    g.gain.setValueAtTime(0.0001, this.ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.08, this.ctx.currentTime + 0.03);
    g.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.6);
    o.connect(g);
    g.connect(this.nodes.master);
    o.start();
    o.stop(this.ctx.currentTime + 0.65);
  }
  setMotion(amount) {
    if (!this.nodes) return;
    const a = Math.max(0, Math.min(1, amount));
    this.nodes.humGain.gain.value = 0.03 + a * 0.05;
    this.nodes.noiseGain.gain.value = 0.01 + a * 0.03;
  }
}

/* ---------- Minimap ---------- */
function drawMinimap(canvas, progress, stops) {
  const ctx = canvas.getContext("2d");
  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "rgba(0,0,0,0.35)";
  ctx.fillRect(0, 0, w, h);

  // stylised route path
  ctx.beginPath();
  ctx.strokeStyle = "rgba(224,122,95,0.35)";
  ctx.lineWidth = 3;
  for (let i = 0; i <= 40; i++) {
    const t = i / 40;
    const x = 24 + t * (w - 48) + Math.sin(t * Math.PI * 2.2) * 10;
    const y = h * 0.55 + Math.cos(t * Math.PI * 1.5) * 22;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();

  // travelled
  ctx.beginPath();
  ctx.strokeStyle = "#ff8f6b";
  ctx.lineWidth = 3;
  ctx.shadowColor = "rgba(255,143,107,0.6)";
  ctx.shadowBlur = 8;
  const steps = Math.max(1, Math.floor(progress * 40));
  for (let i = 0; i <= steps; i++) {
    const t = i / 40;
    const x = 24 + t * (w - 48) + Math.sin(t * Math.PI * 2.2) * 10;
    const y = h * 0.55 + Math.cos(t * Math.PI * 1.5) * 22;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.shadowBlur = 0;

  // stops
  stops.forEach((s) => {
    const t = s.t;
    const x = 24 + t * (w - 48) + Math.sin(t * Math.PI * 2.2) * 10;
    const y = h * 0.55 + Math.cos(t * Math.PI * 1.5) * 22;
    const reached = progress >= s.t - 0.01;
    ctx.beginPath();
    ctx.fillStyle = reached ? "#6ecf8e" : "rgba(246,239,232,0.35)";
    ctx.arc(x, y, reached ? 4 : 3, 0, Math.PI * 2);
    ctx.fill();
  });

  // secret commendation blip (always faintly marked — hunt it)
  {
    const st = 0.71;
    const sx = 24 + st * (w - 48) + Math.sin(st * Math.PI * 2.2) * 10;
    const sy = h * 0.55 + Math.cos(st * Math.PI * 1.5) * 22 - 10;
    ctx.beginPath();
    ctx.fillStyle = "#ffd27a";
    ctx.shadowColor = "#ffd27a";
    ctx.shadowBlur = 10;
    ctx.moveTo(sx, sy - 5);
    ctx.lineTo(sx + 4, sy);
    ctx.lineTo(sx, sy + 5);
    ctx.lineTo(sx - 4, sy);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  // player
  const pt = progress;
  const px = 24 + pt * (w - 48) + Math.sin(pt * Math.PI * 2.2) * 10;
  const py = h * 0.55 + Math.cos(pt * Math.PI * 1.5) * 22;
  ctx.beginPath();
  ctx.fillStyle = "#ff8f6b";
  ctx.shadowColor = "#ff8f6b";
  ctx.shadowBlur = 12;
  ctx.arc(px, py, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;
}

/* ---------- Game state ---------- */
const state = {
  playing: false,
  pausedForMission: false,
  xp: 0,
  level: 0,
  unlocked: new Set(),
  lastMotion: 0,
  tokens: 0,
  secretFound: false,
};

const XP_PER_LEVEL = 100;
const audio = new RideAudio();

function xpToLevel(xp) {
  return Math.min(99, Math.floor(xp / XP_PER_LEVEL));
}

function updateHud(progress, stop) {
  const lvl = String(stop?.level ?? "00").padStart(2, "0");
  $("#hudLevel").textContent = lvl;
  $("#hudStop").textContent = stop?.short || "BOARDING";
  $("#hudPlaceName").textContent = stop?.place || "Christchurch";
  $("#hudPct").textContent = `${Math.round(progress * 100)}%`;
  $("#hudProgress").style.width = `${progress * 100}%`;

  const into = state.xp % XP_PER_LEVEL;
  $("#hudXpLabel").textContent = `XP ${state.xp}`;
  $("#hudXpNext").textContent = `/ ${(xpToLevel(state.xp) + 1) * XP_PER_LEVEL}`;
  $("#hudXpFill").style.width = `${(into / XP_PER_LEVEL) * 100}%`;

  drawMinimap($("#minimap"), progress, STOPS);
  const yaw = world?.getCameraYaw?.() || 0;
  $("#compassRing").style.transform = `rotate(${(-yaw * 180) / Math.PI}deg)`;

  // objectives
  const list = $("#objList");
  if (list && !list.dataset.built) {
    list.innerHTML =
      STOPS.map((s) => `<li data-id="${s.id}">${s.objective}</li>`).join("") +
      `<li data-id="${SECRET_AWARD.id}">${SECRET_AWARD.objective}</li>`;
    list.dataset.built = "1";
  }
  if (list) {
    list.querySelectorAll("li").forEach((li) => {
      const id = li.getAttribute("data-id");
      li.classList.toggle("is-done", state.unlocked.has(id));
      li.classList.toggle("is-active", stop?.id === id && !state.unlocked.has(id));
    });
  }

  const loot = $("#hudLoot");
  if (loot && world) {
    const stats = world.getCollectibleStats();
    loot.textContent = `◆ ${stats.taken}/${stats.total}`;
    loot.classList.toggle("is-complete", stats.secretTaken);
  }
  const quest = $("#hudQuest");
  if (quest) {
    quest.classList.toggle("is-done", state.secretFound);
    if (state.secretFound) {
      quest.querySelector("strong").textContent = "Commendation found · fun fact unlocked";
      quest.querySelector("p").textContent = "COVID-19 Response Recognition Award — New Zealand Government.";
    }
  }

  // proximity collect prompt
  const prompt = $("#hudPrompt");
  if (prompt && world && state.playing) {
    const near = world.nearCollectible;
    // Always offer secret claim; tokens only when not in a story card
    if (near && !near.userData.taken && (near.userData.kind === "secret" || !state.pausedForMission)) {
      prompt.hidden = false;
      const secret = near.userData.kind === "secret";
      prompt.classList.toggle("is-secret", secret);
      $("#hudPromptText").innerHTML = secret
        ? 'PRESS <kbd>E</kbd> OR CLICK · CLAIM COMMENDATION'
        : 'PRESS <kbd>E</kbd> OR CLICK · COLLECT TOKEN';
    } else {
      prompt.hidden = true;
    }
  }
}

function showToast(text) {
  const el = $("#toast");
  el.textContent = text;
  el.hidden = false;
  el.classList.add("is-show");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => {
    el.classList.remove("is-show");
  }, 1600);
}

function openMission(stop) {
  if (state.unlocked.has(stop.id)) return;
  state.pausedForMission = true;
  state.unlocked.add(stop.id);
  state.xp += stop.xp;
  state.level = xpToLevel(state.xp);

  const panel = $("#missionPanel");
  panel.classList.toggle("mission--secret", stop.id === SECRET_AWARD.id);
  $("#missionBadge").textContent = stop.id === SECRET_AWARD.id
    ? `SECRET UNLOCKED · +${stop.xp} XP`
    : `MISSION UNLOCKED · +${stop.xp} XP`;
  $("#missionType").textContent = stop.type;
  $("#missionTitle").textContent = stop.title;
  $("#missionMeta").textContent = stop.meta;
  $("#missionBody").textContent = stop.body;
  $("#missionXp").textContent = `+${stop.xp} XP`;
  const loot = $("#missionLoot");
  loot.innerHTML = stop.loot.map((x) => `<li>${x}</li>`).join("");
  const img = $("#missionImg");
  img.src = stop.image;
  img.alt = stop.place;

  panel.hidden = false;
  requestAnimationFrame(() => panel.classList.add("is-open"));
  audio.unlockChime();
  showToast(`LEVEL ${stop.level} · CLEARED`);
  updateHud(world.getProgress(), stop);

  if (stop.id === "ahead") {
    // almost terminus
  }
}

function closeMission() {
  const panel = $("#missionPanel");
  panel.classList.remove("is-open");
  setTimeout(() => {
    panel.hidden = true;
    state.pausedForMission = false;
    // catch up camera to current scroll (progress freezes while a mission is open)
    syncFromScroll();
    // if near end, open terminus
    if (world.getProgress() > 0.985 && state.unlocked.has("ahead")) {
      openTerminus();
    }
  }, 350);
}

function openTerminus() {
  $("#terminus").hidden = false;
  document.body.classList.remove("can-scroll");
}

function closeTerminus() {
  $("#terminus").hidden = true;
  document.body.classList.add("can-scroll");
  window.scrollTo({ top: document.body.scrollHeight * 0.92, behavior: "smooth" });
}


/* ---------- Playable collectibles ---------- */
function onCollect(info) {
  if (!info) return;
  if (info.kind === "secret") {
    if (state.secretFound) return;
    state.secretFound = true;
    state.xp += 40; // small pickup bonus before mission XP
    showToast("COMMENDATION FOUND");
    audio.unlockChime();
    updateHud(world.getProgress(), STOPS.find((s) => world.getProgress() >= s.t - 0.01) || STOPS[0]);
    setTimeout(() => openMission(SECRET_AWARD), 350);
    return;
  }
  state.tokens += 1;
  state.xp += 35;
  state.level = xpToLevel(state.xp);
  showToast(`TOKEN +1 · ${state.tokens} COLLECTED`);
  audio.unlockChime();
  updateHud(world.getProgress(), STOPS.find((s) => world.getProgress() >= s.t - 0.01) || STOPS[0]);
}

function attemptCollectFromClick(ev) {
  if (!state.playing) return;
  if (!$("#terminus").hidden) return;
  // ignore UI clicks
  if (ev.target.closest && ev.target.closest(".hud button, .mission, .terminus, .boot")) return;
  const info = world.tryPick(ev.clientX, ev.clientY);
  if (info) {
    ev.preventDefault();
    onCollect(info);
  }
}

function attemptCollectNear() {
  if (!state.playing) return;
  const info = world.tryCollectNear();
  if (info) onCollect(info);
}

/* ---------- Boot + world ---------- */
const boot = $("#boot");
const bootFill = $("#bootFill");
const bootPct = $("#bootPct");
const btnStart = $("#btnStart");
btnStart.disabled = true;

const canvas = $("#world");
const world = new TramWorld(canvas, (p) => {
  const pct = Math.round(p * 100);
  bootFill.style.width = `${pct}%`;
  bootPct.textContent = pct < 100 ? `Loading city… ${pct}%` : "City ready";
  if (p >= 1) btnStart.disabled = false;
});

world.init().catch((err) => {
  console.error(err);
  bootPct.textContent = "Loaded with fallback";
  btnStart.disabled = false;
});

btnStart.addEventListener("click", async () => {
  boot.classList.add("is-done");
  $("#hud").hidden = false;
  document.body.classList.add("is-playing", "can-scroll");
  state.playing = true;
  // size scroll track
  $("#track").style.height = `${Math.max(900, STOPS.length * 110)}vh`;
  updateHud(0, STOPS[0]);
  showToast("RIDE STARTED · COLLECT TOKENS");
  const mode = $("#hudMode");
  if (mode) mode.textContent = "PLAYER";
  // auto-unlock boarding briefly as intro card
  setTimeout(() => openMission(STOPS[0]), 600);
});

$("#btnContinue").addEventListener("click", closeMission);
$("#btnBackRide").addEventListener("click", closeTerminus);

$("#btnMute").addEventListener("click", async () => {
  const btn = $("#btnMute");
  const next = btn.getAttribute("aria-pressed") !== "true";
  await audio.setEnabled(next);
  btn.setAttribute("aria-pressed", String(next));
  btn.textContent = next ? "🔊 AUDIO" : "🔇 MUTED";
});

$("#btnObjectives").addEventListener("click", () => {
  const panel = $("#objectives");
  const open = panel.hidden;
  panel.hidden = !open;
  $("#btnObjectives").setAttribute("aria-expanded", String(open));
});

window.addEventListener("keydown", (e) => {
  if (e.key === "m" || e.key === "M") $("#btnMute").click();
  if (e.key === "Escape" && !$("#missionPanel").hidden) closeMission();
  if (e.key === "Escape" && !$("#terminus").hidden) closeTerminus();
  if ((e.key === "e" || e.key === "E" || e.key === " ") && state.playing) {
    e.preventDefault();
    attemptCollectNear();
  }
});

window.addEventListener("pointerdown", attemptCollectFromClick);



/* ---------- Scroll → progress ---------- */
let lastScrollY = 0;
let lastScrollT = performance.now();

function syncFromScroll() {
  if (!state.playing) return;
  if (!$("#terminus").hidden) return;

  const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  const t = Math.min(1, Math.max(0, window.scrollY / max));
  world.setTargetProgress(t);
  if (state.pausedForMission) return;

  const now = performance.now();
  const dy = Math.abs(window.scrollY - lastScrollY);
  const dt = Math.max(16, now - lastScrollT);
  const speed = Math.min(1, dy / dt / 2);
  state.lastMotion = speed;
  audio.setMotion(speed);
  lastScrollY = window.scrollY;
  lastScrollT = now;

  // current stop (nearest behind or at)
  let current = STOPS[0];
  for (const s of STOPS) {
    if (t >= s.t - 0.01) current = s;
  }
  updateHud(t, current);

  // unlock when approaching
  for (const s of STOPS) {
    if (!state.unlocked.has(s.id) && t >= s.t) {
      openMission(s);
      break;
    }
  }

  if (t > 0.995 && state.unlocked.has("ahead") && !state.pausedForMission) {
    openTerminus();
  }

  // hide scroll hint after movement
  if (t > 0.03) {
    const hint = $("#scrollHint");
    if (hint) hint.style.opacity = "0";
  }
}

window.addEventListener("scroll", () => {
  syncFromScroll();
}, { passive: true });

// also allow wheel on mission-closed to feel responsive even if track small on some browsers
window.addEventListener(
  "wheel",
  (e) => {
    if (!state.playing || state.pausedForMission) return;
    if (!$("#terminus").hidden) return;
    // if body isn't scrolling yet (track not laid), nudge progress directly
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (max < 100) {
      e.preventDefault();
      const next = world.getProgress() + (e.deltaY > 0 ? 0.008 : -0.008);
      world.setTargetProgress(next);
      // fake scroll position for consistency
      const fake = next * Math.max(max, 1);
      // update unlocks manually
      let current = STOPS[0];
      for (const s of STOPS) {
        if (next >= s.t - 0.01) current = s;
      }
      updateHud(next, current);
      for (const s of STOPS) {
        if (!state.unlocked.has(s.id) && next >= s.t) {
          openMission(s);
          break;
        }
      }
    }
  },
  { passive: false }
);

// touch drag fallback for mobile when needed
let touchY = null;
window.addEventListener(
  "touchstart",
  (e) => {
    touchY = e.touches[0].clientY;
  },
  { passive: true }
);
window.addEventListener(
  "touchmove",
  (e) => {
    if (!state.playing || state.pausedForMission || touchY == null) return;
    if (!$("#terminus").hidden) return;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (max >= 100) return;
    const dy = touchY - e.touches[0].clientY;
    touchY = e.touches[0].clientY;
    const next = world.getProgress() + dy * 0.0015;
    world.setTargetProgress(next);
    let current = STOPS[0];
    for (const s of STOPS) {
      if (next >= s.t - 0.01) current = s;
    }
    updateHud(next, current);
    for (const s of STOPS) {
      if (!state.unlocked.has(s.id) && next >= s.t) {
        openMission(s);
        break;
      }
    }
  },
  { passive: true }
);

// HUD raf refresh for smooth minimap while lerping
function hudLoop() {
  if (state.playing && !state.pausedForMission) {
    const t = world.getProgress();
    let current = STOPS[0];
    for (const s of STOPS) {
      if (t >= s.t - 0.01) current = s;
    }
    drawMinimap($("#minimap"), t, STOPS);
    const yaw = world.getCameraYaw();
    $("#compassRing").style.transform = `rotate(${(-yaw * 180) / Math.PI}deg)`;
    $("#hudPct").textContent = `${Math.round(t * 100)}%`;
    $("#hudProgress").style.width = `${t * 100}%`;
  }
  requestAnimationFrame(hudLoop);
}
hudLoop();

// lightweight debug handle (no private email)
window.__akashGame = {
  progress: () => world.getProgress(),
  collectNear: () => attemptCollectNear(),
  stats: () => world.getCollectibleStats(),
};

