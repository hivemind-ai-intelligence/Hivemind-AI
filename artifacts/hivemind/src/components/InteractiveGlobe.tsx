/**
 * InteractiveGlobe — Pure Canvas 2D
 * Guaranteed visible: absolute positioning, no WebGL, no external dependencies.
 */
import { useRef, useEffect, memo } from "react";

interface GlobeCountry {
  id: string;
  name: string;
  flag?: string;
  active: boolean;
  projects?: number;
}
interface Props { countries: GlobeCountry[] }

// ── Country positions (lat, lng) ───────────────────────────────────────────
const COORDS: Record<string, [number, number]> = {
  India:        [ 22,   78],
  USA:          [ 38,  -97],
  UK:           [ 54,   -2],
  Canada:       [ 57, -106],
  Australia:    [-27,  134],
  Germany:      [ 51,   10],
  Singapore:    [  1,  104],
  UAE:          [ 24,   54],
  France:       [ 46,    2],
  Japan:        [ 36,  138],
  Brazil:       [-15,  -47],
  "South Africa":[-29,   25],
};

// ── Lat/lng to unit sphere ──────────────────────────────────────────────────
interface V3 { x: number; y: number; z: number }
function ll2v(lat: number, lng: number): V3 {
  const phi = (90 - lat) * Math.PI / 180;
  const th  = (lng + 180) * Math.PI / 180;
  return {
    x:  Math.sin(phi) * Math.cos(th),
    y:  Math.cos(phi),
    z:  Math.sin(phi) * Math.sin(th),
  };
}
function rotY(v: V3, a: number): V3 {
  const c = Math.cos(a), s = Math.sin(a);
  return { x: v.x*c + v.z*s, y: v.y, z: -v.x*s + v.z*c };
}
function rotX(v: V3, a: number): V3 {
  const c = Math.cos(a), s = Math.sin(a);
  return { x: v.x, y: v.y*c - v.z*s, z: v.y*s + v.z*c };
}
function rot(v: V3, rx: number, ry: number): V3 { return rotX(rotY(v, ry), rx); }
function proj(v: V3, R: number, cx: number, cy: number) {
  return { px: cx + v.x * R, py: cy - v.y * R };
}

// Great-circle arc points
function arc(a: V3, b: V3, n = 60): V3[] {
  const pts: V3[] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const x = a.x + (b.x - a.x) * t;
    const y = a.y + (b.y - a.y) * t;
    const z = a.z + (b.z - a.z) * t;
    const l = Math.sqrt(x*x + y*y + z*z) || 1;
    pts.push({ x: x/l, y: y/l, z: z/l });
  }
  return pts;
}

// ── Continent land-dot seed coordinates (manually verified lat/lng) ─────────
// Each entry: [lat, lng] sampled inside a major land mass
const LAND_SEEDS: [number,number][] = [
  // North America
  [60,-120],[55,-100],[48,-90],[45,-75],[40,-80],[35,-80],[30,-90],[25,-100],
  [20,-100],[50,-110],[45,-95],[55,-120],[35,-90],[30,-95],[40,-75],[48,-70],
  [60,-110],[65,-140],[70,-150],[55,-130],[25,-105],[20,-95],[15,-90],[60,-95],
  // South America
  [5,-75],[0,-60],[-5,-55],[-10,-50],[-15,-47],[-20,-45],[-25,-50],[-30,-55],
  [-35,-60],[-40,-65],[-45,-68],[-50,-70],[-20,-65],[-15,-60],[-10,-65],[0,-70],
  [5,-60],[10,-65],[-5,-72],[-12,-75],[-25,-60],[-30,-50],[-35,-58],[5,-80],
  // Europe
  [50,10],[55,10],[60,10],[65,15],[50,20],[45,15],[40,15],[45,10],
  [55,25],[60,25],[65,25],[50,30],[55,20],[45,20],[40,20],[48,15],
  [52,5],[53,5],[48,5],[55,5],[60,5],[65,15],[70,20],[68,18],
  [48,2],[46,2],[44,2],[42,2],[40,15],[38,15],[36,14],[35,25],
  // Africa
  [30,30],[20,30],[10,30],[0,25],[-10,20],[-20,25],[-30,25],[-25,30],
  [15,20],[5,20],[0,10],[10,10],[20,10],[30,10],[35,10],[0,30],
  [10,35],[15,35],[20,35],[25,35],[30,25],[20,20],[10,25],[5,10],
  [-5,20],[-10,25],[-15,30],[-20,35],[-10,35],[-5,38],[0,38],
  // Asia (West)
  [40,50],[35,50],[30,50],[25,50],[35,45],[40,45],[30,60],[25,60],
  [30,70],[25,70],[20,70],[35,60],[40,60],[25,55],[30,55],[35,55],
  // Asia (Central)
  [45,70],[50,70],[55,70],[45,80],[50,80],[55,80],[40,75],[40,80],
  [45,90],[50,90],[55,90],[40,100],[45,100],[50,100],[40,85],[35,75],
  // Asia (South/East)
  [22,78],[18,78],[14,78],[10,78],[26,90],[22,90],[18,90],[30,78],
  [35,105],[30,115],[25,115],[20,110],[36,120],[40,120],[45,125],[50,125],
  [55,130],[60,130],[65,140],[60,140],[55,140],[50,135],[45,135],[40,130],
  [36,140],[34,136],[32,132],[36,128],[38,128],[34,127],[36,130],
  // Southeast Asia
  [15,100],[10,100],[5,100],[0,105],[5,105],[10,105],[15,105],
  [20,100],[5,115],[0,110],[5,120],[10,120],[15,120],
  // Australia & Oceania
  [-25,130],[-25,135],[-25,140],[-25,145],[-20,130],[-20,140],[-30,120],
  [-30,125],[-30,130],[-30,135],[-30,140],[-35,135],[-35,140],[-35,145],
  [-40,145],[-40,140],[-20,145],[-15,130],[-15,135],[-20,120],[-22,114],
  // Russia / Siberia
  [55,50],[55,60],[55,70],[55,80],[55,90],[55,100],[55,110],[55,120],
  [60,50],[60,60],[60,70],[60,80],[60,90],[60,100],[60,110],[60,120],[60,130],
  [65,50],[65,60],[65,70],[65,80],[65,90],[65,100],[65,110],[65,120],[65,130],
  [70,50],[70,60],[70,70],[70,80],[70,90],[70,100],[70,110],[70,120],[70,130],
  // Scandinavia / N. Europe
  [60,15],[62,15],[64,20],[66,25],[68,20],[68,25],[70,25],[60,20],[62,20],
  // Greenland
  [70,-45],[72,-45],[74,-42],[72,-50],[70,-55],[68,-52],[66,-50],[64,-50],
  [72,-35],[70,-35],[68,-35],[66,-44],[64,-44],[72,-25],[70,-25],[68,-25],
  // Japan detail
  [34,133],[35,136],[36,138],[37,140],[38,141],[40,141],[42,141],[43,142],[44,143],
];

// Pre-computed land vectors
const LAND_VECS: V3[] = LAND_SEEDS.map(([la, lo]) => ll2v(la, lo));

// ── Ocean dot grid (sparse) ─────────────────────────────────────────────────
const OCEAN_VECS: V3[] = [];
for (let lat = -80; lat <= 80; lat += 12) {
  for (let lng = -180; lng < 180; lng += 12) {
    OCEAN_VECS.push(ll2v(lat, lng));
  }
}

// ── Component ──────────────────────────────────────────────────────────────
const InteractiveGlobe = memo(function InteractiveGlobe({ countries }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const stateRef = useRef({
    rx: 0.25, ry: 0,
    zoom: 1.0,
    drag: false,
    lx: 0, ly: 0,
    vx: 0, vy: 0,
    t: 0,
    frame: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const s = stateRef.current;

    // Active country data
    const activeCntrs = countries
      .filter(c => c.active && COORDS[c.name])
      .map(c => ({ ...c, v: ll2v(...COORDS[c.name]) }));

    // Connection pairs
    const pairs: [typeof activeCntrs[0], typeof activeCntrs[0]][] = [];
    for (let i = 0; i < activeCntrs.length; i++)
      for (let j = i + 1; j < activeCntrs.length; j++)
        pairs.push([activeCntrs[i], activeCntrs[j]]);

    // ── Resize → sets canvas pixel buffer ──────────────────────────────────
    const setSize = () => {
      const w = canvas.offsetWidth  || canvas.parentElement?.offsetWidth  || 800;
      const h = canvas.offsetHeight || canvas.parentElement?.offsetHeight || 520;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width  = w;
        canvas.height = h;
        s.frame = 0; // re-seed stars
      }
    };
    setSize();

    // Observe parent for size changes
    const ro = new ResizeObserver(setSize);
    ro.observe(canvas);
    const parent = canvas.parentElement;
    if (parent) ro.observe(parent);

    // ── Draw loop ──────────────────────────────────────────────────────────
    let rafId: number;

    const draw = () => {
      rafId = requestAnimationFrame(draw);
      s.frame++;

      const W = canvas.width;
      const H = canvas.height;
      if (W < 10 || H < 10) return; // skip if not laid out

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const cx = W / 2;
      const cy = H / 2;
      const R  = Math.min(W, H) * 0.40 * s.zoom;

      // Auto-rotate
      if (!s.drag) {
        s.ry += 0.003;
        s.rx += s.vx; s.ry += s.vy;
        s.vx *= 0.92; s.vy *= 0.92;
        s.rx = Math.max(-0.55, Math.min(0.55, s.rx));
      }
      s.t += 0.016;

      ctx.clearRect(0, 0, W, H);

      // ── Stars (seeded once per resize) ───────────────────────
      if (s.frame === 1) {
        (canvas as any).__stars = Array.from({ length: 160 }, () => ({
          x: Math.random() * W,
          y: Math.random() * H,
          r: Math.random() * 1.1 + 0.2,
          a: Math.random() * 0.5 + 0.1,
        }));
      }
      const stars: { x:number;y:number;r:number;a:number }[] = (canvas as any).__stars || [];
      stars.forEach(st => {
        ctx.beginPath();
        ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180,200,255,${st.a})`;
        ctx.fill();
      });

      // ── Atmosphere glow ───────────────────────────────────────
      const atm = ctx.createRadialGradient(cx, cy, R * 0.85, cx, cy, R * 1.30);
      atm.addColorStop(0,   "rgba(60,120,255,0.16)");
      atm.addColorStop(0.5, "rgba(40, 80,200,0.08)");
      atm.addColorStop(1,   "rgba(0,  0,  0, 0)");
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.30, 0, Math.PI * 2);
      ctx.fillStyle = atm;
      ctx.fill();

      // ── Ocean sphere ──────────────────────────────────────────
      const ocean = ctx.createRadialGradient(
        cx - R * 0.28, cy - R * 0.28, R * 0.05,
        cx, cy, R
      );
      ocean.addColorStop(0,   "rgba(12, 28, 72, 1)");
      ocean.addColorStop(0.5, "rgba( 6, 14, 44, 1)");
      ocean.addColorStop(1,   "rgba( 2,  6, 20, 1)");
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fillStyle = ocean;
      ctx.fill();

      // ── Clip to sphere ────────────────────────────────────────
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, R - 0.5, 0, Math.PI * 2);
      ctx.clip();

      // ── Lat/lng grid lines ────────────────────────────────────
      ctx.strokeStyle = "rgba(80,120,200,0.12)";
      ctx.lineWidth = 0.6;
      // Latitude lines every 30°
      for (const lat of [-60,-30,0,30,60]) {
        const pts: V3[] = [];
        for (let lo = -180; lo <= 180; lo += 4) pts.push(ll2v(lat, lo));
        ctx.beginPath();
        let first = true;
        pts.forEach(p => {
          const rv = rot(p, s.rx, s.ry);
          if (rv.z < 0) { first = true; return; }
          const { px, py } = proj(rv, R, cx, cy);
          first ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
          first = false;
        });
        ctx.stroke();
      }
      // Longitude lines every 30°
      for (let lo = 0; lo < 180; lo += 30) {
        const pts: V3[] = [];
        for (let la = -80; la <= 80; la += 4) pts.push(ll2v(la, lo));
        for (let la = -80; la <= 80; la += 4) pts.push(ll2v(la, lo + 180));
        ctx.beginPath();
        let first2 = true;
        pts.forEach(p => {
          const rv = rot(p, s.rx, s.ry);
          if (rv.z < 0) { first2 = true; return; }
          const { px, py } = proj(rv, R, cx, cy);
          first2 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
          first2 = false;
        });
        ctx.stroke();
      }

      // ── Ocean dots (very sparse) ──────────────────────────────
      OCEAN_VECS.forEach(v => {
        const rv = rot(v, s.rx, s.ry);
        if (rv.z < 0.05) return;
        const { px, py } = proj(rv, R, cx, cy);
        const alpha = rv.z * 0.15;
        ctx.beginPath();
        ctx.arc(px, py, 0.9, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(80,120,200,${alpha.toFixed(3)})`;
        ctx.fill();
      });

      // ── Land dots (densely seeded, clearly visible) ───────────
      LAND_VECS.forEach(v => {
        const rv = rot(v, s.rx, s.ry);
        if (rv.z < 0) return;
        const { px, py } = proj(rv, R, cx, cy);
        const edge = Math.max(0, rv.z);
        const alpha = 0.35 + edge * 0.55;
        ctx.beginPath();
        ctx.arc(px, py, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(160,190,230,${alpha.toFixed(3)})`;
        ctx.fill();
      });

      // ── Connection arcs ───────────────────────────────────────
      pairs.forEach(([a, b], idx) => {
        const gcPts = arc(a.v, b.v, 60);
        const offset = (s.t * 0.35 + idx * 0.61) % 1;
        const pw = 0.22; // pulse width fraction

        // Faint full arc
        ctx.beginPath();
        let first = true;
        gcPts.forEach(p => {
          const rv = rot(p, s.rx, s.ry);
          if (rv.z < -0.05) { first = true; return; }
          const { px, py } = proj(rv, R, cx, cy);
          first ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
          first = false;
        });
        ctx.strokeStyle = "rgba(100,150,255,0.15)";
        ctx.lineWidth = 0.9;
        ctx.stroke();

        // Bright travelling pulse
        const N = gcPts.length;
        const st = Math.floor(offset * N);
        const en = Math.min(N - 1, st + Math.floor(pw * N));
        ctx.beginPath();
        let pFirst = true;
        for (let i = st; i <= en; i++) {
          const rv = rot(gcPts[i % N], s.rx, s.ry);
          if (rv.z < 0) { pFirst = true; continue; }
          const { px, py } = proj(rv, R, cx, cy);
          pFirst ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
          pFirst = false;
        }
        ctx.strokeStyle = "rgba(180,220,255,0.90)";
        ctx.lineWidth = 2.0;
        ctx.stroke();
      });

      ctx.restore(); // end clip

      // ── Edge atmosphere overlay ───────────────────────────────
      const edge = ctx.createRadialGradient(cx, cy, R * 0.68, cx, cy, R);
      edge.addColorStop(0,    "rgba(0,0,0,0)");
      edge.addColorStop(0.78, "rgba(0,0,0,0)");
      edge.addColorStop(1,    "rgba(30,60,180,0.40)");
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fillStyle = edge;
      ctx.fill();

      // Specular highlight (top-left)
      const spec = ctx.createRadialGradient(
        cx - R * 0.32, cy - R * 0.32, 0,
        cx - R * 0.32, cy - R * 0.32, R * 0.52
      );
      spec.addColorStop(0, "rgba(220,235,255,0.09)");
      spec.addColorStop(1, "rgba(0,0,0,0)");
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fillStyle = spec;
      ctx.fill();

      // ── Country markers (rendered above sphere) ────────────────
      activeCntrs.forEach((c, idx) => {
        const rv = rot(c.v, s.rx, s.ry);
        if (rv.z < 0.06) return;
        const { px, py } = proj(rv, R, cx, cy);

        // Pulse ring
        const phase = (s.t * 1.4 + idx * 1.05) % (Math.PI * 2);
        const scale = 1 + Math.sin(phase) * 0.55;
        const palpha = Math.max(0, Math.sin(phase + 0.4)) * 0.50;
        ctx.beginPath();
        ctx.arc(px, py, 9 * scale, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(80,200,255,${palpha.toFixed(3)})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Core glow
        const cg = ctx.createRadialGradient(px, py, 0, px, py, 7);
        cg.addColorStop(0,   "rgba(210,240,255,1.0)");
        cg.addColorStop(0.45,"rgba(100,185,255,0.8)");
        cg.addColorStop(1,   "rgba(50,130,230,0)");
        ctx.beginPath();
        ctx.arc(px, py, 7, 0, Math.PI * 2);
        ctx.fillStyle = cg;
        ctx.fill();

        // White dot centre
        ctx.beginPath();
        ctx.arc(px, py, 2.8, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.fill();
      });
    };

    draw();

    // ── Mouse drag ─────────────────────────────────────────────
    const onDown = (e: MouseEvent) => {
      s.drag = true; s.lx = e.clientX; s.ly = e.clientY;
      s.vx = 0; s.vy = 0;
      canvas.style.cursor = "grabbing";
    };
    const onMove = (e: MouseEvent) => {
      if (!s.drag) return;
      const dx = e.clientX - s.lx;
      const dy = e.clientY - s.ly;
      s.lx = e.clientX; s.ly = e.clientY;
      s.vx = dy * 0.004; s.vy = dx * 0.006;
      s.rx = Math.max(-0.55, Math.min(0.55, s.rx + dy * 0.004));
      s.ry += dx * 0.006;
    };
    const onUp = () => { s.drag = false; canvas.style.cursor = "grab"; };

    // Touch
    let ltx = 0, lty = 0;
    const onTStart = (e: TouchEvent) => {
      s.drag = true; ltx = e.touches[0].clientX; lty = e.touches[0].clientY;
      s.vx = 0; s.vy = 0;
    };
    const onTMove = (e: TouchEvent) => {
      if (!s.drag) return;
      const dx = e.touches[0].clientX - ltx;
      const dy = e.touches[0].clientY - lty;
      ltx = e.touches[0].clientX; lty = e.touches[0].clientY;
      s.rx = Math.max(-0.55, Math.min(0.55, s.rx + dy * 0.005));
      s.ry += dx * 0.006;
    };
    const onTEnd = () => { s.drag = false; };

    // Scroll zoom
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      s.zoom = Math.max(0.6, Math.min(2.2, s.zoom - e.deltaY * 0.001));
    };

    canvas.addEventListener("mousedown", onDown);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    canvas.addEventListener("touchstart", onTStart, { passive: true });
    canvas.addEventListener("touchmove",  onTMove,  { passive: true });
    canvas.addEventListener("touchend",   onTEnd);
    canvas.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      canvas.removeEventListener("mousedown", onDown);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      canvas.removeEventListener("touchstart", onTStart);
      canvas.removeEventListener("touchmove",  onTMove);
      canvas.removeEventListener("touchend",   onTEnd);
      canvas.removeEventListener("wheel", onWheel);
    };
  }, [countries]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        cursor: "grab",
        display: "block",
      }}
    />
  );
});

export default InteractiveGlobe;
