/**
 * Christchurch Tramway — Three.js city world
 * Procedural dusk city + tram rails + landmark billboards + scroll camera
 */
import * as THREE from "three";

const CORAL = 0xe07a5f;
const CORAL_HOT = 0xff8f6b;
const SKY_TOP = 0xf4a07a;
const SKY_MID = 0xc96b5a;
const SKY_LOW = 0x3a1c1a;
const GROUND = 0x2a1614;

export const STOPS = [
  {
    id: "board",
    t: 0.02,
    level: "00",
    place: "Port Hills",
    short: "BOARDING",
    title: "Board the tramway",
    type: "MISSION · BOARD",
    meta: "Spectator mode · Christchurch hub",
    body: "You are playing as the rider with Akash Thattanparambil Raju. Scroll to travel. Click glowing tokens along the line — and hunt the gold Government Commendation for a hidden fun fact. Each stop still unlocks a real chapter.",
    loot: ["Player mode", "Collect tokens", "Find the gold Commendation"],
    xp: 25,
    image: "assets/places/port-hills.jpg",
    objective: "Board at Port Hills",
  },
  {
    id: "ara",
    t: 0.12,
    level: "01",
    place: "Cathedral Square",
    short: "STUDY · ARA",
    title: "I came here to study",
    type: "MISSION · STUDY",
    meta: "Ara Institute of Canterbury · logistics",
    body: "I came to New Zealand to study logistics at Ara Institute of Canterbury. Christchurch became the city where my working life took shape — the hub this tramway keeps returning to.",
    loot: ["Graduate Diploma · Supply Chain & Logistics L7", "City centre footing", "Canterbury base unlocked"],
    xp: 120,
    image: "assets/places/cathedral-square.jpg",
    objective: "Clear Ara study mission",
  },
  {
    id: "distinction",
    t: 0.22,
    level: "02",
    place: "Riverside Market",
    short: "HOSPITALITY",
    title: "Distinction Hotel Christchurch",
    type: "MISSION · HOSPITALITY",
    meta: "Kitchen Hand → Front Office · part-time",
    body: "While building footing in the city, I worked at Distinction Hotel Christchurch — first as a kitchen hand, then in front office. Part-time work that taught pace, reliability, and staying calm when the desk is busy.",
    loot: ["Kitchen operations", "Front desk · payments & records", "Pace under pressure"],
    xp: 140,
    image: "assets/places/riverside-market.jpg",
    objective: "Clear Distinction hospitality XP",
  },
  {
    id: "nelson",
    t: 0.34,
    level: "03",
    place: "Nelson",
    short: "CAREGIVER · NELSON",
    title: "Caregiver · Nelson",
    type: "MISSION · CARE",
    meta: "Flew to Nelson · then returned",
    body: "I flew to Nelson for caregiver work — a real move off the Christchurch line, then came back again. Dignity and steady support, away from the hub and back.",
    loot: ["Caregiver XP", "Flight transfer", "Return to Christchurch"],
    xp: 130,
    image: "assets/places/nelson-city.jpg",
    objective: "Clear Nelson caregiver stop",
  },
  {
    id: "chch-care",
    t: 0.42,
    level: "04",
    place: "Hagley Park",
    short: "CAREGIVER · CHCH",
    title: "Caregiver · Christchurch",
    type: "MISSION · CARE",
    meta: "Return to the city",
    body: "I came back to Christchurch and worked as a caregiver again — dignity and steady support in the city I call home.",
    loot: ["Direct care", "Dignity-first", "City hub restored"],
    xp: 110,
    image: "assets/places/hagley-park.jpg",
    objective: "Clear Christchurch caregiver stop",
  },
  {
    id: "idea",
    t: 0.5,
    level: "05",
    place: "Botanic Gardens",
    short: "IDEA SERVICES",
    title: "Support Worker · IDEA Services",
    type: "MISSION · SUPPORT",
    meta: "Person-centred support",
    body: "Person-centred support plans, referrals, and steady relationships with clients, families, clinical teams, and providers. Accurate confidential records under organisational policy.",
    loot: ["Support plans", "Referrals & networks", "Privacy & records"],
    xp: 150,
    image: "assets/places/botanic-gardens.jpg",
    objective: "Clear IDEA Services mission",
  },
  {
    id: "twn",
    t: 0.58,
    level: "06",
    place: "Bridge of Remembrance",
    short: "TE WHARE NGAKAU",
    title: "Support Worker · Te Whare Ngakau Trust",
    type: "MISSION · SUPPORT",
    meta: "Higher-complexity support needs",
    body: "I held a higher-complexity caseload with intensive client support needs. Assessed needs, developed person-centred plans, built trusted relationships, kept confidential records, and coached toward independence.",
    loot: ["Complex caseload", "Trusted relationships", "Independence coaching"],
    xp: 160,
    image: "assets/places/bridge-remembrance.jpg",
    objective: "Clear Te Whare Ngakau Trust stop",
  },
  {
    id: "kaikoura",
    t: 0.68,
    level: "07",
    place: "Kaikōura",
    short: "NOW · KAIKŌURA",
    title: "I am in Kaikōura",
    type: "MISSION · CURRENT STOP",
    meta: "Active location on the line",
    body: "After support work in Christchurch, I moved to Kaikōura. I am here now. This is a real stop on my journey — not a detour I skip past. From here I turn back toward Christchurch.",
    loot: ["Kaikōura now", "Christchurch next", "Line still active"],
    xp: 180,
    image: "assets/places/kaikoura-coast.jpg",
    objective: "Reach Kaikōura (current stop)",
  },
  {
    id: "winz",
    t: 0.78,
    level: "08",
    place: "Returning · Christchurch",
    short: "NEXT · WINZ",
    title: "Case Manager · Work and Income",
    type: "MISSION · NEXT LEVEL",
    meta: "Christchurch · moving back soon",
    body: "I am moving back to Christchurch soon as a Case Manager at Work and Income. How I work: listen, understand the person’s situation and barriers, weigh options against policy, decide, and set a clear next step.",
    loot: ["Person → barriers → options", "Policy-aware decisions", "Clear next step"],
    xp: 200,
    image: "assets/places/bridge-remembrance.jpg",
    objective: "Queue Work and Income case manager",
  },
  {
    id: "skills",
    t: 0.86,
    level: "09",
    place: "Skills loadout",
    short: "LOADOUT",
    title: "Skills unlocked",
    type: "MISSION · LOADOUT",
    meta: "Toolkit across hospitality, care and support",
    body: "Person-centred planning. Case navigation. Calm under pressure. Records & privacy. Logistics mindset from Ara. Languages: Malayalam, Hindi, Tamil, English.",
    loot: ["Planning", "Case navigation", "4 languages", "Logistics mindset"],
    xp: 100,
    image: "assets/places/te-pae.jpg",
    objective: "Collect skills loadout",
  },
  {
    id: "quals",
    t: 0.92,
    level: "10",
    place: "Cardboard Cathedral",
    short: "QUALIFICATIONS",
    title: "Study beside the work",
    type: "MISSION · LEARN",
    meta: "Qualifications & recognition",
    body: "Graduate Diploma in Supply Chain & Logistics (L7) — Ara, 2020. Certificate in Health and Wellbeing (L4) — NZTC, 2024. BCom Computer Science & Co-operation — MGU India, 2016. Full New Zealand Driver’s Licence.",
    loot: ["Grad Dip L7", "Health & Wellbeing L4", "BCom", "Full NZ licence"],
    xp: 120,
    image: "assets/places/cardboard-cathedral.jpg",
    objective: "Unlock qualifications",
  },
  {
    id: "ahead",
    t: 0.97,
    level: "11",
    place: "New Brighton Pier",
    short: "AHEAD",
    title: "Employment focus · leadership",
    type: "MISSION · AHEAD",
    meta: "Ambition — not a current title",
    body: "After case management on this path, my ambition is to work as an Employment Case Manager. I am open to employment-focused roles, and I want to move into leadership as well. No closed doors.",
    loot: ["Employment pathways", "ECM ambition", "Leadership", "Open to the right role"],
    xp: 150,
    image: "assets/places/new-brighton-pier.jpg",
    objective: "Reveal future branch",
  },
];

/** Hidden playable unlock — only via collecting the Government Commendation in-world */
export const SECRET_AWARD = {
  id: "covid-award",
  level: "★",
  place: "Hidden Commendation",
  short: "SECRET · CLEARED",
  title: "COVID-19 Response Recognition Award",
  type: "SECRET QUEST · FUN FACT",
  meta: "New Zealand Government · earned by playing",
  body: "Fun fact you unlocked by playing: Akash holds a COVID-19 Response Recognition Award from the New Zealand Government — recognition for service during the pandemic response. Not listed on the open track; you had to find it.",
  loot: ["Government recognition", "Pandemic response service", "Secret quest cleared"],
  xp: 250,
  image: "assets/places/te-pae.jpg",
  objective: "Find the hidden Government Commendation",
};

function seeded(n) {
  const x = Math.sin(n * 127.1) * 43758.5453;
  return x - Math.floor(x);
}

export class TramWorld {
  constructor(canvas, onProgressLoad) {
    this.canvas = canvas;
    this.onProgressLoad = onProgressLoad || (() => {});
    this.progress = 0;
    this.targetProgress = 0;
    this.reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    this.clock = new THREE.Clock();
    this._ready = false;
    this.landmarkMeshes = [];
    this.stopMarkers = [];
    this.collectibles = [];
    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();
    this.nearCollectible = null;
  }

  async init() {
    const w = window.innerWidth;
    const h = window.innerHeight;

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      powerPreference: "high-performance",
      alpha: false,
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.setSize(w, h, false);
    this.renderer.setClearColor(0x12080a, 1);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x1a0c0c, 0.018);

    this.camera = new THREE.PerspectiveCamera(55, w / h, 0.1, 400);
    this.camera.position.set(0, 4, 12);

    this._buildSky();
    this._buildLights();
    this._buildRoute();
    this._buildCity();
    this._buildTracks();
    this._buildTram();
    this._buildAtmosphere();
    await this._buildLandmarks();
    this._buildCollectibles();

    this._ready = true;
    this.onProgressLoad(1);
    window.addEventListener("resize", () => this._onResize());
    this._onResize();
    requestAnimationFrame(() => this._onResize());
    this._tick();
  }

  _buildSky() {
    const skyGeo = new THREE.SphereGeometry(180, 32, 16);
    const uniforms = {
      top: { value: new THREE.Color(SKY_TOP) },
      mid: { value: new THREE.Color(SKY_MID) },
      low: { value: new THREE.Color(SKY_LOW) },
    };
    const skyMat = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: `
        varying vec3 vPos;
        void main() {
          vPos = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 top; uniform vec3 mid; uniform vec3 low;
        varying vec3 vPos;
        void main() {
          float h = normalize(vPos).y;
          vec3 col = mix(low, mid, smoothstep(-0.2, 0.25, h));
          col = mix(col, top, smoothstep(0.25, 0.85, h));
          gl_FragColor = vec4(col, 1.0);
        }
      `,
      side: THREE.BackSide,
      depthWrite: false,
    });
    this.scene.add(new THREE.Mesh(skyGeo, skyMat));

    // sun disc
    const sun = new THREE.Mesh(
      new THREE.CircleGeometry(8, 32),
      new THREE.MeshBasicMaterial({ color: CORAL_HOT, transparent: true, opacity: 0.85 })
    );
    sun.position.set(-40, 18, -90);
    sun.lookAt(0, 0, 0);
    this.scene.add(sun);

    const sunGlow = new THREE.Mesh(
      new THREE.CircleGeometry(18, 32),
      new THREE.MeshBasicMaterial({ color: CORAL, transparent: true, opacity: 0.22 })
    );
    sunGlow.position.copy(sun.position);
    sunGlow.lookAt(0, 0, 0);
    this.scene.add(sunGlow);
  }

  _buildLights() {
    this.scene.add(new THREE.AmbientLight(0xffc4b0, 0.55));
    const sun = new THREE.DirectionalLight(0xffb08a, 1.35);
    sun.position.set(-30, 40, 10);
    this.scene.add(sun);
    const fill = new THREE.DirectionalLight(0x6b7a9a, 0.35);
    fill.position.set(20, 10, 30);
    this.scene.add(fill);
    const rim = new THREE.PointLight(CORAL_HOT, 40, 80, 2);
    rim.position.set(0, 6, 0);
    this.rimLight = rim;
    this.scene.add(rim);
  }

  _buildRoute() {
    // Tram route through the city — CatmullRom path
    const pts = [];
    for (let i = 0; i <= 40; i++) {
      const t = i / 40;
      const x = Math.sin(t * Math.PI * 2.2) * 18 + Math.sin(t * 7) * 3;
      const z = -t * 140 + 10;
      const y = 0.15 + Math.sin(t * Math.PI * 3) * 0.4;
      pts.push(new THREE.Vector3(x, y, z));
    }
    this.curve = new THREE.CatmullRomCurve3(pts);
    this.curve.curveType = "catmullrom";
    this.curve.tension = 0.35;
  }

  _buildTracks() {
    const frames = this.curve.computeFrenetFrames(200, false);
    const left = [];
    const right = [];
    for (let i = 0; i <= 200; i++) {
      const t = i / 200;
      const p = this.curve.getPointAt(t);
      const n = frames.normals[i];
      left.push(p.clone().addScaledVector(n, 0.55));
      right.push(p.clone().addScaledVector(n, -0.55));
    }
    const railMat = new THREE.MeshStandardMaterial({
      color: 0x3a2a28,
      metalness: 0.7,
      roughness: 0.35,
      emissive: CORAL,
      emissiveIntensity: 0.08,
    });
    const mkRail = (arr) => {
      const c = new THREE.CatmullRomCurve3(arr);
      const g = new THREE.TubeGeometry(c, 200, 0.06, 6, false);
      return new THREE.Mesh(g, railMat);
    };
    this.scene.add(mkRail(left), mkRail(right));

    // glowing center dashed line (points)
    const dashGeo = new THREE.BufferGeometry();
    const dashPos = [];
    for (let i = 0; i < 120; i++) {
      const p = this.curve.getPointAt(i / 119);
      dashPos.push(p.x, p.y + 0.05, p.z);
    }
    dashGeo.setAttribute("position", new THREE.Float32BufferAttribute(dashPos, 3));
    const dashes = new THREE.Points(
      dashGeo,
      new THREE.PointsMaterial({ color: CORAL_HOT, size: 0.18, transparent: true, opacity: 0.65 })
    );
    this.scene.add(dashes);
  }

  _buildCity() {
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(400, 400),
      new THREE.MeshStandardMaterial({ color: GROUND, roughness: 0.95, metalness: 0.05 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.02;
    this.scene.add(ground);

    // road strip under rails (approx)
    const road = new THREE.Mesh(
      new THREE.PlaneGeometry(4.2, 160),
      new THREE.MeshStandardMaterial({ color: 0x1a1010, roughness: 0.9, metalness: 0.1 })
    );
    road.rotation.x = -Math.PI / 2;
    road.position.set(0, 0.01, -60);
    this.scene.add(road);

    const buildingMat = new THREE.MeshStandardMaterial({
      color: 0x4a2a28,
      roughness: 0.85,
      metalness: 0.15,
      emissive: 0x2a1210,
      emissiveIntensity: 0.25,
    });
    const accentMat = new THREE.MeshStandardMaterial({
      color: 0x3a201e,
      roughness: 0.7,
      metalness: 0.2,
      emissive: CORAL,
      emissiveIntensity: 0.12,
    });
    const windowMat = new THREE.MeshStandardMaterial({
      color: 0xffc9a8,
      emissive: CORAL_HOT,
      emissiveIntensity: 0.55,
      roughness: 0.4,
      metalness: 0.1,
    });

    const city = new THREE.Group();
    for (let i = 0; i < 90; i++) {
      const side = i % 2 === 0 ? 1 : -1;
      const along = (i / 90) * 140 - 5;
      const lateral = side * (5 + seeded(i * 3.1) * 14 + (i % 5) * 0.4);
      const bw = 1.2 + seeded(i * 7.7) * 2.8;
      const bd = 1.2 + seeded(i * 5.3) * 2.4;
      const bh = 2 + seeded(i * 9.1) * 14;
      const box = new THREE.Mesh(
        new THREE.BoxGeometry(bw, bh, bd),
        seeded(i) > 0.7 ? accentMat : buildingMat
      );
      box.position.set(lateral + Math.sin(along * 0.05) * 2, bh / 2, -along);
      box.rotation.y = seeded(i * 2.2) * 0.2;
      city.add(box);

      // window strips
      if (bh > 5) {
        const floors = Math.floor(bh / 1.4);
        for (let f = 1; f < floors; f++) {
          if (seeded(i * 10 + f) < 0.35) continue;
          const win = new THREE.Mesh(new THREE.BoxGeometry(bw * 0.7, 0.15, bd * 0.02), windowMat);
          win.position.set(box.position.x, f * 1.4, box.position.z + (side > 0 ? -bd / 2 - 0.02 : bd / 2 + 0.02));
          city.add(win);
        }
      }
    }

    // distant hills
    for (let i = 0; i < 8; i++) {
      const hill = new THREE.Mesh(
        new THREE.ConeGeometry(18 + seeded(i) * 20, 8 + seeded(i * 2) * 10, 5),
        new THREE.MeshStandardMaterial({ color: 0x5e322e, roughness: 1, metalness: 0 })
      );
      hill.position.set(-40 + i * 14, 2, -150 - seeded(i) * 20);
      hill.rotation.y = seeded(i) * Math.PI;
      city.add(hill);
    }

    // Port Hills-ish ridge near start
    const ridge = new THREE.Mesh(
      new THREE.CylinderGeometry(40, 50, 12, 6, 1, true),
      new THREE.MeshStandardMaterial({ color: 0x6b3a3a, flatShading: true, side: THREE.DoubleSide })
    );
    ridge.position.set(25, -2, 15);
    ridge.rotation.z = 0.2;
    city.add(ridge);

    this.scene.add(city);
    this.city = city;
  }

  _buildTram() {
    const tram = new THREE.Group();
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(1.4, 1.1, 3.2),
      new THREE.MeshStandardMaterial({
        color: 0x1a1010,
        metalness: 0.4,
        roughness: 0.4,
        emissive: CORAL,
        emissiveIntensity: 0.15,
      })
    );
    body.position.y = 0.85;
    tram.add(body);
    const roof = new THREE.Mesh(
      new THREE.BoxGeometry(1.35, 0.15, 3.1),
      new THREE.MeshStandardMaterial({ color: CORAL_HOT, emissive: CORAL_HOT, emissiveIntensity: 0.3 })
    );
    roof.position.y = 1.45;
    tram.add(roof);
    const cabin = new THREE.Mesh(
      new THREE.BoxGeometry(1.2, 0.55, 1.0),
      new THREE.MeshStandardMaterial({
        color: 0xffd2bc,
        emissive: CORAL_HOT,
        emissiveIntensity: 0.45,
        transparent: true,
        opacity: 0.85,
      })
    );
    cabin.position.set(0, 1.05, -1.0);
    tram.add(cabin);
    // wheels
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.6, roughness: 0.4 });
    [[-0.55, -1.0], [0.55, -1.0], [-0.55, 1.0], [0.55, 1.0]].forEach(([x, z]) => {
      const w = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.12, 12), wheelMat);
      w.rotation.z = Math.PI / 2;
      w.position.set(x, 0.22, z);
      tram.add(w);
    });
    this.tram = tram;
    this.scene.add(tram);
  }

  _buildAtmosphere() {
    const count = 400;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (seeded(i) - 0.5) * 80;
      pos[i * 3 + 1] = 1 + seeded(i * 2) * 25;
      pos[i * 3 + 2] = -seeded(i * 3) * 150 + 10;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    this.embers = new THREE.Points(
      geo,
      new THREE.PointsMaterial({
        color: CORAL_HOT,
        size: 0.12,
        transparent: true,
        opacity: 0.55,
        depthWrite: false,
      })
    );
    this.scene.add(this.embers);
  }

  async _buildLandmarks() {
    const loader = new THREE.TextureLoader();
    const loadTex = (url) =>
      new Promise((resolve) => {
        loader.load(
          url,
          (tex) => {
            tex.colorSpace = THREE.SRGBColorSpace;
            resolve(tex);
          },
          undefined,
          () => resolve(null)
        );
      });

    const total = STOPS.length;
    for (let i = 0; i < STOPS.length; i++) {
      const stop = STOPS[i];
      const t = THREE.MathUtils.clamp(stop.t, 0.001, 0.999);
      const p = this.curve.getPointAt(t);
      const tangent = this.curve.getTangentAt(t).normalize();
      const side = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();

      // glowing stop marker on track
      const marker = new THREE.Mesh(
        new THREE.CylinderGeometry(0.35, 0.35, 0.08, 16),
        new THREE.MeshStandardMaterial({
          color: CORAL_HOT,
          emissive: CORAL_HOT,
          emissiveIntensity: 0.8,
          transparent: true,
          opacity: 0.9,
        })
      );
      marker.position.copy(p);
      marker.position.y = 0.08;
      this.scene.add(marker);
      this.stopMarkers.push(marker);

      // billboard with landmark photo
      const tex = await loadTex(stop.image);
      this.onProgressLoad((i + 1) / (total + 1));
      if (!tex) continue;
      const panel = new THREE.Mesh(
        new THREE.PlaneGeometry(4.5, 3),
        new THREE.MeshStandardMaterial({
          map: tex,
          emissiveMap: tex,
          emissive: 0xffffff,
          emissiveIntensity: 0.25,
          roughness: 0.7,
          metalness: 0.05,
        })
      );
      const outward = side.clone().multiplyScalar(i % 2 === 0 ? 6.5 : -6.5);
      panel.position.copy(p).add(outward);
      panel.position.y = 2.2;
      panel.lookAt(p.clone().add(new THREE.Vector3(0, 2.2, 0)));
      this.scene.add(panel);
      this.landmarkMeshes.push({ mesh: panel, t: stop.t });

      // frame
      const frame = new THREE.Mesh(
        new THREE.PlaneGeometry(4.7, 3.2),
        new THREE.MeshBasicMaterial({ color: 0x0a0606 })
      );
      frame.position.copy(panel.position);
      frame.position.addScaledVector(panel.getWorldDirection(new THREE.Vector3()), -0.02);
      frame.quaternion.copy(panel.quaternion);
      this.scene.add(frame);
    }
  }


  _buildCollectibles() {
    const specs = [
      { t: 0.08, side: 1, kind: "token", id: "token-1" },
      { t: 0.18, side: -1, kind: "token", id: "token-2" },
      { t: 0.28, side: 1, kind: "token", id: "token-3" },
      { t: 0.45, side: -1, kind: "token", id: "token-4" },
      { t: 0.62, side: 1, kind: "token", id: "token-5" },
      { t: 0.71, side: -1, kind: "secret", id: "covid-award", lateral: 7.2, y: 3.4 },
    ];

    const tokenMat = new THREE.MeshStandardMaterial({
      color: CORAL_HOT,
      emissive: CORAL_HOT,
      emissiveIntensity: 0.95,
      metalness: 0.4,
      roughness: 0.25,
      transparent: true,
      opacity: 0.95,
    });
    const secretMat = new THREE.MeshStandardMaterial({
      color: 0xffd27a,
      emissive: 0xffc857,
      emissiveIntensity: 1.2,
      metalness: 0.7,
      roughness: 0.2,
      transparent: true,
      opacity: 1,
    });

    for (const spec of specs) {
      const t = THREE.MathUtils.clamp(spec.t, 0.001, 0.999);
      const p = this.curve.getPointAt(t);
      const tang = this.curve.getTangentAt(t).normalize();
      const sideV = new THREE.Vector3(-tang.z, 0, tang.x).normalize();
      const lateral = spec.lateral != null ? spec.lateral : 3.8;
      const group = new THREE.Group();
      const isSecret = spec.kind === "secret";
      const core = new THREE.Mesh(
        isSecret ? new THREE.OctahedronGeometry(0.55, 0) : new THREE.IcosahedronGeometry(0.38, 0),
        isSecret ? secretMat.clone() : tokenMat.clone()
      );
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(isSecret ? 0.85 : 0.55, 0.04, 8, 24),
        new THREE.MeshBasicMaterial({
          color: isSecret ? 0xffd27a : CORAL_HOT,
          transparent: true,
          opacity: 0.55,
        })
      );
      ring.rotation.x = Math.PI / 2;
      group.add(core, ring);
      group.position.copy(p).addScaledVector(sideV, spec.side * lateral);
      group.position.y = spec.y != null ? spec.y : 2.1;
      group.userData = {
        collectible: true,
        id: spec.id,
        kind: spec.kind,
        taken: false,
        baseY: group.position.y,
        t: spec.t,
      };
      this.scene.add(group);
      this.collectibles.push(group);
      if (isSecret) {
        const light = new THREE.PointLight(0xffd27a, 8, 14, 2);
        group.add(light);
      }
    }
  }

  getCollectibleStats() {
    const total = this.collectibles.length;
    const taken = this.collectibles.filter((c) => c.userData.taken).length;
    const secretTaken = this.collectibles.some((c) => c.userData.kind === "secret" && c.userData.taken);
    const n = this.nearCollectible;
    return {
      total,
      taken,
      secretTaken,
      near: n && !n.userData.taken ? { id: n.userData.id, kind: n.userData.kind, t: n.userData.t } : null,
    };
  }

  tryPick(clientX, clientY) {
    if (!this._ready) return null;
    const rect = this.canvas.getBoundingClientRect();
    this.pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const meshes = [];
    for (const g of this.collectibles) {
      if (g.userData.taken) continue;
      g.traverse((o) => { if (o.isMesh) meshes.push(o); });
    }
    const hits = this.raycaster.intersectObjects(meshes, false);
    if (!hits.length) return null;
    let obj = hits[0].object;
    while (obj && !obj.userData?.collectible) obj = obj.parent;
    if (!obj || obj.userData.taken) return null;
    return this._takeCollectible(obj);
  }

  tryCollectNear() {
    // Secret quest: claim when the ride is in its zone (gold orb pulses)
    for (const g of this.collectibles) {
      if (g.userData.taken) continue;
      if (g.userData.kind === "secret" && Math.abs(this.progress - g.userData.t) < 0.05) {
        return this._takeCollectible(g);
      }
    }
    if (this.nearCollectible && !this.nearCollectible.userData.taken) {
      return this._takeCollectible(this.nearCollectible);
    }
    if (!this.tram) return null;
    let best = null;
    let bestD = 12;
    for (const g of this.collectibles) {
      if (g.userData.taken) continue;
      const d = g.position.distanceTo(this.tram.position);
      const limit = g.userData.kind === "secret" ? 14 : 10;
      if (d < Math.min(bestD, limit)) {
        bestD = d;
        best = g;
      }
    }
    if (!best) return null;
    return this._takeCollectible(best);
  }

  _takeCollectible(group) {
    if (!group || group.userData.taken) return null;
    group.userData.taken = true;
    group.visible = false;
    const info = { id: group.userData.id, kind: group.userData.kind, t: group.userData.t };
    this.nearCollectible = null;
    return info;
  }

  setTargetProgress(t) {
    this.targetProgress = THREE.MathUtils.clamp(t, 0, 1);
  }

  getProgress() {
    return this.progress;
  }

  getCameraYaw() {
    if (!this.curve) return 0;
    const t = THREE.MathUtils.clamp(this.progress, 0.001, 0.999);
    const tang = this.curve.getTangentAt(t);
    return Math.atan2(tang.x, tang.z);
  }

  _updateCamera(dt) {
    if (!this.curve) return;
    const lerp = this.reduced ? 1 : 1 - Math.pow(0.001, dt);
    this.progress += (this.targetProgress - this.progress) * Math.min(1, lerp * 1.8);

    const t = THREE.MathUtils.clamp(this.progress, 0.001, 0.999);
    const pos = this.curve.getPointAt(t);
    const lookT = THREE.MathUtils.clamp(t + 0.02, 0.001, 0.999);
    const look = this.curve.getPointAt(lookT);
    const tang = this.curve.getTangentAt(t).normalize();

    // tram on rails
    if (this.tram) {
      this.tram.position.copy(pos);
      this.tram.position.y += 0.05;
      const ahead = pos.clone().add(tang);
      this.tram.lookAt(ahead.x, this.tram.position.y, ahead.z);
    }

    // chase camera — slightly elevated behind tram
    const back = tang.clone().multiplyScalar(-7.5);
    const camTarget = pos.clone().add(back);
    camTarget.y += 3.2;
    // slight side sway for cinematic feel
    const side = new THREE.Vector3(-tang.z, 0, tang.x).multiplyScalar(Math.sin(t * Math.PI * 4) * 0.6);
    camTarget.add(side);

    this.camera.position.lerp(camTarget, this.reduced ? 1 : 1 - Math.pow(0.0008, dt));
    const lookAt = look.clone();
    lookAt.y += 1.4;
    this._look = this._look || lookAt.clone();
    this._look.lerp(lookAt, this.reduced ? 1 : 1 - Math.pow(0.001, dt));
    this.camera.lookAt(this._look);

    if (this.rimLight) {
      this.rimLight.position.copy(pos);
      this.rimLight.position.y += 3;
    }

    // landmark focus — scale up near stop
    for (const lm of this.landmarkMeshes) {
      const d = Math.abs(this.progress - lm.t);
      const s = THREE.MathUtils.smoothstep(0.08 - d, 0, 0.08);
      const scale = 1 + s * 0.18;
      lm.mesh.scale.setScalar(scale);
      if (lm.mesh.material && lm.mesh.material.emissiveIntensity !== undefined) {
        lm.mesh.material.emissiveIntensity = 0.2 + s * 0.55;
      }
    }
    for (let i = 0; i < this.stopMarkers.length; i++) {
      const m = this.stopMarkers[i];
      const d = Math.abs(this.progress - STOPS[i].t);
      const pulse = 0.85 + Math.sin(this.clock.elapsedTime * 4 + i) * 0.15;
      m.scale.setScalar((d < 0.04 ? 1.4 : 1) * pulse);
    }

    // collectibles: bob, spin, proximity prompt
    this.nearCollectible = null;
    let bestDist = 9.5;
    const tramPos = this.tram ? this.tram.position : pos;
    for (const g of this.collectibles) {
      if (g.userData.taken) continue;
      g.rotation.y += dt * (g.userData.kind === "secret" ? 1.6 : 1.1);
      g.position.y = g.userData.baseY + Math.sin(this.clock.elapsedTime * 2.5 + g.userData.t * 20) * 0.25;
      const d = g.position.distanceTo(tramPos);
      const inSecretZone = g.userData.kind === "secret" && Math.abs(this.progress - g.userData.t) < 0.05;
      if (d < bestDist || inSecretZone) {
        bestDist = inSecretZone ? Math.min(d, bestDist) : d;
        this.nearCollectible = g;
      }
      const core = g.children[0];
      if (core && core.material && core.material.emissiveIntensity != null) {
        const close = THREE.MathUtils.clamp(1 - d / 8, 0, 1);
        const zone = inSecretZone ? 0.55 : 0;
        core.material.emissiveIntensity = (g.userData.kind === "secret" ? 1.0 : 0.7) + close * 0.8 + zone;
        g.scale.setScalar(inSecretZone ? 1.3 + Math.sin(this.clock.elapsedTime * 5) * 0.12 : 1);
      }
    }
  }

  _tick() {
    const dt = Math.min(0.05, this.clock.getDelta());
    if (this._ready) {
      this._updateCamera(dt);
      if (this.embers) {
        this.embers.rotation.y += dt * 0.02;
        const positions = this.embers.geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
          positions[i + 1] += dt * (0.15 + (i % 7) * 0.01);
          if (positions[i + 1] > 28) positions[i + 1] = 1;
        }
        this.embers.geometry.attributes.position.needsUpdate = true;
      }
    }
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(() => this._tick());
  }

  _onResize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.setSize(w, h, false);
  }
}
