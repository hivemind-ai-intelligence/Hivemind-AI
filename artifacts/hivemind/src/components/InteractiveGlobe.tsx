/**
 * InteractiveGlobe — Three.js 3D globe with Canvas 2D fallback.
 * Three.js (WebGL) is used when available — real browsers, deployed apps.
 * Canvas 2D fallback is used in sandboxed environments without WebGL.
 */
import { useRef, useEffect, memo } from "react";
import * as THREE from "three";

interface GlobeCountry {
  id: string; name: string; flag?: string;
  active: boolean; projects?: number;
  lat?: number; lng?: number;
}
interface Props { countries: GlobeCountry[] }

// ── Hardcoded lat/lng for known countries ──────────────────────────────────
const COUNTRY_COORDS: Record<string, [number, number]> = {
  India: [22, 78], USA: [38, -97], UK: [54, -2], Canada: [57, -106],
  Australia: [-27, 134], Germany: [51, 10], Singapore: [1.3, 103.8],
  UAE: [24, 54], France: [46, 2], Japan: [36, 138], Brazil: [-15, -47],
  "South Africa": [-29, 25], Russia: [60, 100], China: [35, 105],
};

// ── WebGL detection ────────────────────────────────────────────────────────
function hasWebGL(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(window.WebGLRenderingContext && (c.getContext("webgl") || c.getContext("experimental-webgl")));
  } catch { return false; }
}

// ── Three.js helpers ───────────────────────────────────────────────────────
function ll3(lat: number, lng: number, r = 1): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = lng * (Math.PI / 180);
  return new THREE.Vector3(
    r * Math.sin(phi) * Math.sin(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.cos(theta)
  );
}

function arcPts(a: THREE.Vector3, b: THREE.Vector3, n = 80, h = 0.28): THREE.Vector3[] {
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    pts.push(new THREE.Vector3().lerpVectors(a, b, t).normalize().multiplyScalar(1 + h * Math.sin(Math.PI * t)));
  }
  return pts;
}

// ── THREE.JS GLOBE ─────────────────────────────────────────────────────────
function ThreeGlobe({ countries }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const W = container.clientWidth || 800;
    const H = container.clientHeight || 520;

    // Scene / Camera / Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 100);
    camera.position.z = 2.5;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Globe group — everything that rotates together
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // Globe sphere
    globeGroup.add(new THREE.Mesh(
      new THREE.SphereGeometry(1, 64, 64),
      new THREE.MeshPhongMaterial({ color: 0x030a18, emissive: 0x060f28, emissiveIntensity: 1, shininess: 25, specular: 0x1a3a6c })
    ));

    // Grid lines
    const gridMat = new THREE.LineBasicMaterial({ color: 0x1a3a5c, transparent: true, opacity: 0.32 });
    for (const lat of [-60, -30, 0, 30, 60]) {
      const pts: THREE.Vector3[] = [];
      for (let lng = 0; lng <= 360; lng += 3) pts.push(ll3(lat, lng, 1.002));
      globeGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), gridMat));
    }
    for (let lng = 0; lng < 360; lng += 30) {
      const pts: THREE.Vector3[] = [];
      for (let lat = -90; lat <= 90; lat += 3) pts.push(ll3(lat, lng, 1.002));
      globeGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), gridMat));
    }

    // Stars (world-space, static)
    const starPos: number[] = [];
    for (let i = 0; i < 2500; i++) {
      const r = 8 + Math.random() * 4;
      const phi = Math.random() * Math.PI, theta = Math.random() * Math.PI * 2;
      starPos.push(r * Math.sin(phi) * Math.sin(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.cos(theta));
    }
    const starGeom = new THREE.BufferGeometry();
    starGeom.setAttribute("position", new THREE.Float32BufferAttribute(starPos, 3));
    scene.add(new THREE.Points(starGeom, new THREE.PointsMaterial({ color: 0xffffff, size: 0.014, transparent: true, opacity: 0.60 })));

    // Atmosphere (world-space, doesn't rotate)
    scene.add(new THREE.Mesh(new THREE.SphereGeometry(1.09, 64, 64),
      new THREE.MeshBasicMaterial({ color: 0x0a1f4a, transparent: true, opacity: 0.18, side: THREE.BackSide })));
    scene.add(new THREE.Mesh(new THREE.SphereGeometry(1.17, 64, 64),
      new THREE.MeshBasicMaterial({ color: 0x060f28, transparent: true, opacity: 0.09, side: THREE.BackSide })));

    // Lighting
    scene.add(new THREE.AmbientLight(0x1a2a4a, 2));
    const dir = new THREE.DirectionalLight(0x5577cc, 1.8);
    dir.position.set(3, 1, 2);
    scene.add(dir);
    const dir2 = new THREE.DirectionalLight(0x223366, 0.4);
    dir2.position.set(-2, -1, -1);
    scene.add(dir2);

    // Country markers
    const pulseRings: { mesh: THREE.Mesh; phase: number }[] = [];
    const travelerData: { mesh: THREE.Mesh; points: THREE.Vector3[] }[] = [];
    const activeCountries = countries.filter(c => c.active);

    countries.forEach(country => {
      const coords = COUNTRY_COORDS[country.name];
      const lat = country.lat ?? coords?.[0] ?? 0;
      const lng = country.lng ?? coords?.[1] ?? 0;
      const pos = ll3(lat, lng, 1.013);

      const dot = new THREE.Mesh(
        new THREE.SphereGeometry(country.active ? 0.022 : 0.010, 8, 8),
        new THREE.MeshBasicMaterial({ color: country.active ? 0x60a5fa : 0x1e3a5f, transparent: true, opacity: country.active ? 1 : 0.35 })
      );
      dot.position.copy(pos);
      globeGroup.add(dot);

      if (country.active) {
        // Outer glow dot
        const glow = new THREE.Mesh(
          new THREE.SphereGeometry(0.034, 8, 8),
          new THREE.MeshBasicMaterial({ color: 0x93c5fd, transparent: true, opacity: 0.25 })
        );
        glow.position.copy(pos);
        globeGroup.add(glow);

        // Pulse ring
        const ringGeom = new THREE.RingGeometry(0.028, 0.046, 18);
        const ringMat = new THREE.MeshBasicMaterial({ color: 0x60a5fa, transparent: true, opacity: 0.50, side: THREE.DoubleSide });
        const ring = new THREE.Mesh(ringGeom, ringMat);
        ring.position.copy(pos);
        ring.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), pos.clone().normalize());
        globeGroup.add(ring);
        pulseRings.push({ mesh: ring, phase: Math.random() * Math.PI * 2 });
      }
    });

    // Connection arcs + travelers
    if (activeCountries.length >= 2) {
      for (let i = 0; i < activeCountries.length; i++) {
        const a = activeCountries[i];
        const b = activeCountries[(i + 1) % activeCountries.length];
        const aC = COUNTRY_COORDS[a.name], bC = COUNTRY_COORDS[b.name];
        const posA = ll3(a.lat ?? aC?.[0] ?? 0, a.lng ?? aC?.[1] ?? 0, 1.013);
        const posB = ll3(b.lat ?? bC?.[0] ?? 0, b.lng ?? bC?.[1] ?? 0, 1.013);
        const pts = arcPts(posA, posB);

        globeGroup.add(new THREE.Line(
          new THREE.BufferGeometry().setFromPoints(pts),
          new THREE.LineBasicMaterial({ color: 0x3b82f6, transparent: true, opacity: 0.28 })
        ));

        const trav = new THREE.Mesh(
          new THREE.SphereGeometry(0.014, 6, 6),
          new THREE.MeshBasicMaterial({ color: 0xbfdbfe, transparent: true, opacity: 0.92 })
        );
        globeGroup.add(trav);
        travelerData.push({ mesh: trav, points: pts });
      }
    }

    // ── Controls ────────────────────────────────────────────────────────────
    let rotX = 0.25, rotY = -0.5;
    let isDragging = false, lastPx = 0, lastPy = 0, lastInteraction = 0, targetZ = 2.5;

    const onPtrDown = (e: PointerEvent) => { isDragging = true; lastPx = e.clientX; lastPy = e.clientY; lastInteraction = Date.now(); (container as HTMLElement).style.cursor = "grabbing"; };
    const onPtrMove = (e: PointerEvent) => { if (!isDragging) return; rotY += (e.clientX - lastPx) * 0.005; rotX = Math.max(-1.2, Math.min(1.2, rotX + (e.clientY - lastPy) * 0.005)); lastPx = e.clientX; lastPy = e.clientY; lastInteraction = Date.now(); };
    const onPtrUp = () => { isDragging = false; (container as HTMLElement).style.cursor = "grab"; };
    const onWheel = (e: WheelEvent) => { e.preventDefault(); targetZ = Math.max(1.6, Math.min(4.0, targetZ + e.deltaY * 0.002)); lastInteraction = Date.now(); };

    let lastPinch = 0;
    const onTStart = (e: TouchEvent) => { if (e.touches.length === 2) { const dx = e.touches[0].clientX - e.touches[1].clientX, dy = e.touches[0].clientY - e.touches[1].clientY; lastPinch = Math.sqrt(dx * dx + dy * dy); } };
    const onTMove = (e: TouchEvent) => { if (e.touches.length === 2) { const dx = e.touches[0].clientX - e.touches[1].clientX, dy = e.touches[0].clientY - e.touches[1].clientY; const d = Math.sqrt(dx * dx + dy * dy); targetZ = Math.max(1.6, Math.min(4.0, targetZ + (lastPinch - d) * 0.01)); lastPinch = d; lastInteraction = Date.now(); } };

    container.addEventListener("pointerdown", onPtrDown);
    window.addEventListener("pointermove", onPtrMove);
    window.addEventListener("pointerup", onPtrUp);
    container.addEventListener("wheel", onWheel, { passive: false });
    container.addEventListener("touchstart", onTStart, { passive: true });
    container.addEventListener("touchmove", onTMove, { passive: true });

    const ro = new ResizeObserver(() => { if (!container) return; const w = container.clientWidth, h = container.clientHeight; camera.aspect = w / h; camera.updateProjectionMatrix(); renderer.setSize(w, h); });
    ro.observe(container);

    // ── Animate ─────────────────────────────────────────────────────────────
    let frameId: number;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const t = Date.now() * 0.001;
      if (!isDragging && Date.now() - lastInteraction > 2000) rotY += 0.003;
      globeGroup.rotation.x = rotX;
      globeGroup.rotation.y = rotY;
      camera.position.z += (targetZ - camera.position.z) * 0.08;
      pulseRings.forEach(({ mesh, phase }) => { const p = Math.sin(t * 2 + phase); mesh.scale.setScalar(1 + p * 0.45); (mesh.material as THREE.MeshBasicMaterial).opacity = 0.32 + p * 0.22; });
      travelerData.forEach(({ mesh, points }, i) => { const idx = Math.floor(((t * 0.35 + i * 0.37) % 1) * (points.length - 1)); if (points[idx]) mesh.position.copy(points[idx]); });
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      ro.disconnect();
      container.removeEventListener("pointerdown", onPtrDown);
      window.removeEventListener("pointermove", onPtrMove);
      window.removeEventListener("pointerup", onPtrUp);
      container.removeEventListener("wheel", onWheel);
      container.removeEventListener("touchstart", onTStart);
      container.removeEventListener("touchmove", onTMove);
      renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, [countries]);

  return <div ref={containerRef} style={{ position: "absolute", inset: 0, cursor: "grab" }} />;
}

// ══════════════════════════════════════════════════════════════════════════════
// CANVAS 2D FALLBACK (used when WebGL is unavailable)
// ══════════════════════════════════════════════════════════════════════════════
interface V3 { x: number; y: number; z: number }
const COORDS: Record<string, [number, number]> = {
  India: [22, 78], USA: [38, -97], UK: [54, -2], Canada: [57, -106],
  Australia: [-27, 134], Germany: [51, 10], Singapore: [1.3, 103.8],
  UAE: [24, 54], France: [46, 2], Japan: [36, 138], Brazil: [-15, -47],
  "South Africa": [-29, 25],
};
function ll2v(lat: number, lng: number): V3 {
  const phi = (90 - lat) * Math.PI / 180, th = (lng + 180) * Math.PI / 180;
  return { x: Math.sin(phi) * Math.cos(th), y: Math.cos(phi), z: Math.sin(phi) * Math.sin(th) };
}
function rotY2(v: V3, a: number): V3 { const c = Math.cos(a), s = Math.sin(a); return { x: v.x * c + v.z * s, y: v.y, z: -v.x * s + v.z * c }; }
function rotX2(v: V3, a: number): V3 { const c = Math.cos(a), s = Math.sin(a); return { x: v.x, y: v.y * c - v.z * s, z: v.y * s + v.z * c }; }
function rot(v: V3, rx: number, ry: number): V3 { return rotX2(rotY2(v, ry), rx); }
function proj(v: V3, R: number, cx: number, cy: number) { return { px: cx + v.x * R, py: cy - v.y * R }; }
function arcC(a: V3, b: V3, n = 60): V3[] {
  const pts: V3[] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n, x = a.x + (b.x - a.x) * t, y = a.y + (b.y - a.y) * t, z = a.z + (b.z - a.z) * t, l = Math.sqrt(x * x + y * y + z * z) || 1;
    pts.push({ x: x / l, y: y / l, z: z / l });
  }
  return pts;
}
const LAND_SEEDS: [number, number][] = [
  [60,-120],[55,-100],[48,-90],[45,-75],[40,-80],[35,-80],[30,-90],[25,-100],[20,-100],[50,-110],[45,-95],[55,-120],[35,-90],[30,-95],[40,-75],[48,-70],[60,-110],[65,-140],[70,-150],[55,-130],[25,-105],[20,-95],[15,-90],[60,-95],
  [5,-75],[0,-60],[-5,-55],[-10,-50],[-15,-47],[-20,-45],[-25,-50],[-30,-55],[-35,-60],[-40,-65],[-45,-68],[-50,-70],[-20,-65],[-15,-60],[-10,-65],[0,-70],[5,-60],[10,-65],[-5,-72],[-12,-75],[-25,-60],[-30,-50],[-35,-58],[5,-80],
  [50,10],[55,10],[60,10],[65,15],[50,20],[45,15],[40,15],[45,10],[55,25],[60,25],[65,25],[50,30],[55,20],[45,20],[40,20],[48,15],[52,5],[53,5],[48,5],[55,5],[60,5],[65,15],[70,20],[68,18],[48,2],[46,2],[44,2],[42,2],[40,15],[38,15],[36,14],[35,25],
  [30,30],[20,30],[10,30],[0,25],[-10,20],[-20,25],[-30,25],[-25,30],[15,20],[5,20],[0,10],[10,10],[20,10],[30,10],[35,10],[0,30],[10,35],[15,35],[20,35],[25,35],[30,25],[20,20],[10,25],[5,10],[-5,20],[-10,25],[-15,30],[-20,35],[-10,35],[-5,38],[0,38],
  [40,50],[35,50],[30,50],[25,50],[35,45],[40,45],[30,60],[25,60],[30,70],[25,70],[20,70],[35,60],[40,60],[25,55],[30,55],[35,55],
  [45,70],[50,70],[55,70],[45,80],[50,80],[55,80],[40,75],[40,80],[45,90],[50,90],[55,90],[40,100],[45,100],[50,100],[40,85],[35,75],
  [22,78],[18,78],[14,78],[10,78],[26,90],[22,90],[18,90],[30,78],[35,105],[30,115],[25,115],[20,110],[36,120],[40,120],[45,125],[50,125],[55,130],[60,130],[65,140],[60,140],[55,140],[50,135],[45,135],[40,130],[36,140],[34,136],[32,132],[36,128],[38,128],[34,127],[36,130],
  [15,100],[10,100],[5,100],[0,105],[5,105],[10,105],[15,105],[20,100],[5,115],[0,110],[5,120],[10,120],[15,120],
  [-25,130],[-25,135],[-25,140],[-25,145],[-20,130],[-20,140],[-30,120],[-30,125],[-30,130],[-30,135],[-30,140],[-35,135],[-35,140],[-35,145],[-40,145],[-40,140],[-20,145],[-15,130],[-15,135],[-20,120],[-22,114],
  [55,50],[55,60],[55,70],[55,80],[55,90],[55,100],[55,110],[55,120],[60,50],[60,60],[60,70],[60,80],[60,90],[60,100],[60,110],[60,120],[60,130],[65,50],[65,60],[65,70],[65,80],[65,90],[65,100],[65,110],[65,120],[65,130],[70,50],[70,60],[70,70],[70,80],[70,90],[70,100],[70,110],[70,120],[70,130],
  [60,15],[62,15],[64,20],[66,25],[68,20],[68,25],[70,25],[60,20],[62,20],
  [70,-45],[72,-45],[74,-42],[72,-50],[70,-55],[68,-52],[66,-50],[64,-50],[72,-35],[70,-35],[68,-35],[66,-44],[64,-44],[72,-25],[70,-25],[68,-25],
  [34,133],[35,136],[36,138],[37,140],[38,141],[40,141],[42,141],[43,142],[44,143],
];
const LAND_VECS: V3[] = LAND_SEEDS.map(([la, lo]) => ll2v(la, lo));
const OCEAN_VECS: V3[] = [];
for (let lat = -80; lat <= 80; lat += 12) for (let lng = -180; lng < 180; lng += 12) OCEAN_VECS.push(ll2v(lat, lng));

function CanvasGlobe({ countries }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({ rx: 0.25, ry: 0, zoom: 1.0, drag: false, lx: 0, ly: 0, vx: 0, vy: 0, t: 0, frame: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const s = stateRef.current;
    const activeCntrs = countries.filter(c => c.active && COORDS[c.name]).map(c => ({ ...c, v: ll2v(...COORDS[c.name]) }));
    const pairs: [typeof activeCntrs[0], typeof activeCntrs[0]][] = [];
    for (let i = 0; i < activeCntrs.length; i++) for (let j = i + 1; j < activeCntrs.length; j++) pairs.push([activeCntrs[i], activeCntrs[j]]);

    const setSize = () => { const w = canvas.offsetWidth || canvas.parentElement?.offsetWidth || 800, h = canvas.offsetHeight || canvas.parentElement?.offsetHeight || 520; if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; s.frame = 0; } };
    setSize();
    const ro = new ResizeObserver(setSize);
    ro.observe(canvas);
    if (canvas.parentElement) ro.observe(canvas.parentElement);

    let rafId: number;
    const draw = () => {
      rafId = requestAnimationFrame(draw);
      s.frame++;
      const W = canvas.width, H = canvas.height;
      if (W < 10 || H < 10) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const cx = W / 2, cy = H / 2, R = Math.min(W, H) * 0.40 * s.zoom;
      if (!s.drag) { s.ry += 0.003; s.rx += s.vx; s.ry += s.vy; s.vx *= 0.92; s.vy *= 0.92; s.rx = Math.max(-0.55, Math.min(0.55, s.rx)); }
      s.t += 0.016;
      ctx.clearRect(0, 0, W, H);
      if (s.frame === 1) { (canvas as any).__stars = Array.from({ length: 160 }, () => ({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.1 + 0.2, a: Math.random() * 0.5 + 0.1 })); }
      ((canvas as any).__stars || []).forEach((st: any) => { ctx.beginPath(); ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2); ctx.fillStyle = `rgba(180,200,255,${st.a})`; ctx.fill(); });
      const atm = ctx.createRadialGradient(cx, cy, R * 0.85, cx, cy, R * 1.30);
      atm.addColorStop(0, "rgba(60,120,255,0.16)"); atm.addColorStop(0.5, "rgba(40,80,200,0.08)"); atm.addColorStop(1, "rgba(0,0,0,0)");
      ctx.beginPath(); ctx.arc(cx, cy, R * 1.30, 0, Math.PI * 2); ctx.fillStyle = atm; ctx.fill();
      const ocean = ctx.createRadialGradient(cx - R * 0.28, cy - R * 0.28, R * 0.05, cx, cy, R);
      ocean.addColorStop(0, "rgba(12,28,72,1)"); ocean.addColorStop(0.5, "rgba(6,14,44,1)"); ocean.addColorStop(1, "rgba(2,6,20,1)");
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fillStyle = ocean; ctx.fill();
      ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R - 0.5, 0, Math.PI * 2); ctx.clip();
      ctx.strokeStyle = "rgba(80,120,200,0.12)"; ctx.lineWidth = 0.6;
      for (const lat of [-60, -30, 0, 30, 60]) { const pts: V3[] = []; for (let lo = -180; lo <= 180; lo += 4) pts.push(ll2v(lat, lo)); ctx.beginPath(); let first = true; pts.forEach(p => { const rv = rot(p, s.rx, s.ry); if (rv.z < 0) { first = true; return; } const { px, py } = proj(rv, R, cx, cy); first ? ctx.moveTo(px, py) : ctx.lineTo(px, py); first = false; }); ctx.stroke(); }
      for (let lo = 0; lo < 180; lo += 30) { const pts: V3[] = []; for (let la = -80; la <= 80; la += 4) { pts.push(ll2v(la, lo)); pts.push(ll2v(la, lo + 180)); } ctx.beginPath(); let f2 = true; pts.forEach(p => { const rv = rot(p, s.rx, s.ry); if (rv.z < 0) { f2 = true; return; } const { px, py } = proj(rv, R, cx, cy); f2 ? ctx.moveTo(px, py) : ctx.lineTo(px, py); f2 = false; }); ctx.stroke(); }
      OCEAN_VECS.forEach(v => { const rv = rot(v, s.rx, s.ry); if (rv.z < 0.05) return; const { px, py } = proj(rv, R, cx, cy); ctx.beginPath(); ctx.arc(px, py, 0.9, 0, Math.PI * 2); ctx.fillStyle = `rgba(80,120,200,${(rv.z * 0.15).toFixed(3)})`; ctx.fill(); });
      LAND_VECS.forEach(v => { const rv = rot(v, s.rx, s.ry); if (rv.z < 0) return; const { px, py } = proj(rv, R, cx, cy); const alpha = 0.35 + Math.max(0, rv.z) * 0.55; ctx.beginPath(); ctx.arc(px, py, 1.8, 0, Math.PI * 2); ctx.fillStyle = `rgba(160,190,230,${alpha.toFixed(3)})`; ctx.fill(); });
      pairs.forEach(([a, b], idx) => {
        const gcPts = arcC(a.v, b.v, 60), offset = (s.t * 0.35 + idx * 0.61) % 1, pw = 0.22;
        ctx.beginPath(); let first = true;
        gcPts.forEach(p => { const rv = rot(p, s.rx, s.ry); if (rv.z < -0.05) { first = true; return; } const { px, py } = proj(rv, R, cx, cy); first ? ctx.moveTo(px, py) : ctx.lineTo(px, py); first = false; });
        ctx.strokeStyle = "rgba(100,150,255,0.15)"; ctx.lineWidth = 0.9; ctx.stroke();
        const N = gcPts.length, st = Math.floor(offset * N), en = Math.min(N - 1, st + Math.floor(pw * N));
        ctx.beginPath(); let pF = true;
        for (let i = st; i <= en; i++) { const rv = rot(gcPts[i % N], s.rx, s.ry); if (rv.z < 0) { pF = true; continue; } const { px, py } = proj(rv, R, cx, cy); pF ? ctx.moveTo(px, py) : ctx.lineTo(px, py); pF = false; }
        ctx.strokeStyle = "rgba(180,220,255,0.90)"; ctx.lineWidth = 2.0; ctx.stroke();
      });
      ctx.restore();
      const edge = ctx.createRadialGradient(cx, cy, R * 0.68, cx, cy, R); edge.addColorStop(0, "rgba(0,0,0,0)"); edge.addColorStop(0.78, "rgba(0,0,0,0)"); edge.addColorStop(1, "rgba(30,60,180,0.40)"); ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fillStyle = edge; ctx.fill();
      const spec = ctx.createRadialGradient(cx - R * 0.32, cy - R * 0.32, 0, cx - R * 0.32, cy - R * 0.32, R * 0.52); spec.addColorStop(0, "rgba(220,235,255,0.09)"); spec.addColorStop(1, "rgba(0,0,0,0)"); ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fillStyle = spec; ctx.fill();
      activeCntrs.forEach((c, idx) => {
        const rv = rot(c.v, s.rx, s.ry); if (rv.z < 0.06) return;
        const { px, py } = proj(rv, R, cx, cy);
        const phase = (s.t * 1.4 + idx * 1.05) % (Math.PI * 2), scale = 1 + Math.sin(phase) * 0.55, palpha = Math.max(0, Math.sin(phase + 0.4)) * 0.50;
        ctx.beginPath(); ctx.arc(px, py, 9 * scale, 0, Math.PI * 2); ctx.strokeStyle = `rgba(80,200,255,${palpha.toFixed(3)})`; ctx.lineWidth = 1.2; ctx.stroke();
        const cg = ctx.createRadialGradient(px, py, 0, px, py, 7); cg.addColorStop(0, "rgba(210,240,255,1.0)"); cg.addColorStop(0.45, "rgba(100,185,255,0.8)"); cg.addColorStop(1, "rgba(50,130,230,0)"); ctx.beginPath(); ctx.arc(px, py, 7, 0, Math.PI * 2); ctx.fillStyle = cg; ctx.fill();
        ctx.beginPath(); ctx.arc(px, py, 2.8, 0, Math.PI * 2); ctx.fillStyle = "#ffffff"; ctx.fill();
      });
    };
    draw();

    const onDown = (e: MouseEvent) => { s.drag = true; s.lx = e.clientX; s.ly = e.clientY; s.vx = 0; s.vy = 0; canvas.style.cursor = "grabbing"; };
    const onMove = (e: MouseEvent) => { if (!s.drag) return; const dx = e.clientX - s.lx, dy = e.clientY - s.ly; s.lx = e.clientX; s.ly = e.clientY; s.vx = dy * 0.004; s.vy = dx * 0.006; s.rx = Math.max(-0.55, Math.min(0.55, s.rx + dy * 0.004)); s.ry += dx * 0.006; };
    const onUp = () => { s.drag = false; canvas.style.cursor = "grab"; };
    let ltx = 0, lty = 0;
    const onTStart = (e: TouchEvent) => { s.drag = true; ltx = e.touches[0].clientX; lty = e.touches[0].clientY; s.vx = 0; s.vy = 0; };
    const onTMove = (e: TouchEvent) => { if (!s.drag) return; const dx = e.touches[0].clientX - ltx, dy = e.touches[0].clientY - lty; ltx = e.touches[0].clientX; lty = e.touches[0].clientY; s.rx = Math.max(-0.55, Math.min(0.55, s.rx + dy * 0.005)); s.ry += dx * 0.006; };
    const onTEnd = () => { s.drag = false; };
    const onWheel = (e: WheelEvent) => { e.preventDefault(); s.zoom = Math.max(0.6, Math.min(2.2, s.zoom - e.deltaY * 0.001)); };
    canvas.addEventListener("mousedown", onDown); window.addEventListener("mousemove", onMove); window.addEventListener("mouseup", onUp);
    canvas.addEventListener("touchstart", onTStart, { passive: true }); canvas.addEventListener("touchmove", onTMove, { passive: true }); canvas.addEventListener("touchend", onTEnd);
    canvas.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      cancelAnimationFrame(rafId); ro.disconnect();
      canvas.removeEventListener("mousedown", onDown); window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp);
      canvas.removeEventListener("touchstart", onTStart); canvas.removeEventListener("touchmove", onTMove); canvas.removeEventListener("touchend", onTEnd);
      canvas.removeEventListener("wheel", onWheel);
    };
  }, [countries]);

  return <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", cursor: "grab", display: "block" }} />;
}

// ── Default export: picks Three.js or Canvas 2D based on WebGL availability ─
const InteractiveGlobe = memo(function InteractiveGlobe(props: Props) {
  return hasWebGL() ? <ThreeGlobe {...props} /> : <CanvasGlobe {...props} />;
});

export default InteractiveGlobe;
