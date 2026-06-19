/**
 * InteractiveGlobe — Pure Canvas 2D implementation.
 * No WebGL required. Works in all sandboxed environments.
 *
 * Features:
 *  - Dotted land/ocean map projected onto sphere
 *  - Atmosphere glow
 *  - Animated glowing country markers
 *  - Animated great-circle connection arcs
 *  - Auto-rotation + mouse/touch drag
 *  - Scroll zoom
 */

import { useRef, useEffect, memo } from "react";

interface GlobeCountry {
  id: string;
  name: string;
  flag?: string;
  active: boolean;
  projects?: number;
}

interface InteractiveGlobeProps {
  countries: GlobeCountry[];
}

// ── Country lat/lng lookup ───────────────────────────────────────────────────
const COUNTRY_COORDS: Record<string, [number, number]> = {
  India:        [20.6,  78.9],
  USA:          [37.1, -95.7],
  UK:           [55.4,  -3.4],
  Canada:       [56.1,-106.3],
  Australia:    [-25.3, 133.8],
  Germany:      [51.2,  10.5],
  Singapore:    [ 1.4, 103.8],
  UAE:          [23.4,  53.8],
  France:       [46.2,   2.2],
  Japan:        [36.2, 138.3],
  Brazil:       [-14.2, -51.9],
  "South Africa": [-30.6, 22.9],
};

// ── Simplified world SVG paths (1000×500 equirectangular space) ─────────────
const WORLD_SVG_PATHS = [
  "M 105,85 L 130,62 L 165,55 L 205,62 L 235,85 L 255,108 L 265,138 L 248,168 L 225,200 L 198,228 L 175,255 L 152,248 L 135,228 L 115,200 L 98,168 L 88,138 L 95,108 Z",
  "M 220,42 L 248,35 L 268,38 L 272,52 L 258,62 L 235,62 L 220,55 Z",
  "M 215,260 L 248,252 L 272,260 L 292,292 L 300,330 L 292,370 L 272,402 L 242,420 L 212,410 L 192,378 L 185,340 L 192,300 Z",
  "M 465,82 L 492,65 L 530,62 L 565,70 L 585,92 L 578,118 L 555,132 L 518,140 L 490,135 L 465,118 Z",
  "M 508,105 L 515,95 L 530,92 L 545,98 L 548,110 L 535,118 L 518,115 Z",
  "M 462,132 L 510,122 L 560,132 L 598,158 L 618,195 L 612,245 L 590,290 L 558,325 L 518,342 L 485,335 L 452,305 L 438,262 L 435,218 L 442,175 Z",
  "M 575,68 L 640,55 L 720,50 L 805,58 L 872,80 L 902,110 L 895,155 L 868,188 L 828,212 L 775,228 L 718,232 L 662,222 L 618,202 L 590,175 L 575,145 L 568,112 Z",
  "M 658,188 L 675,210 L 685,242 L 678,262 L 658,268 L 642,252 L 635,222 L 642,198 Z",
  "M 760,218 L 788,208 L 812,218 L 820,238 L 808,258 L 782,265 L 760,252 L 750,235 Z",
  "M 762,292 L 825,282 L 878,298 L 912,325 L 915,358 L 895,388 L 850,402 L 798,402 L 758,382 L 738,352 L 742,318 Z",
  "M 945,340 L 958,328 L 968,335 L 965,352 L 952,360 L 942,352 Z",
];

// ── Build land mask (512×256) ────────────────────────────────────────────────
function buildLandMask(): Uint8Array {
  const W = 512, H = 256;
  const c = document.createElement("canvas");
  c.width = W; c.height = H;
  const ctx = c.getContext("2d")!;
  const sx = W / 1000, sy = H / 500;
  ctx.fillStyle = "#fff";
  WORLD_SVG_PATHS.forEach(p => {
    ctx.fill(new Path2D(
      p.replace(/([-]?\d+\.?\d*),([-]?\d+\.?\d*)/g,
        (_,x,y) => `${(+x*sx).toFixed(1)},${(+y*sy).toFixed(1)}`)
    ));
  });
  const rgba = ctx.getImageData(0, 0, W, H).data;
  const mask = new Uint8Array(W * H);
  for (let i = 0; i < W * H; i++) mask[i] = rgba[i * 4] > 128 ? 1 : 0;
  return mask;
}

// Returns 1 if lat/lng is land, else 0
function isLand(lat: number, lng: number, mask: Uint8Array): boolean {
  const W = 512, H = 256;
  const x = Math.round((lng + 180) / 360 * (W - 1));
  const y = Math.round((90 - lat) / 180 * (H - 1));
  const xi = Math.max(0, Math.min(W - 1, x));
  const yi = Math.max(0, Math.min(H - 1, y));
  return mask[yi * W + xi] === 1;
}

// ── 3D Sphere math ───────────────────────────────────────────────────────────
interface Vec3 { x: number; y: number; z: number }

function latLngTo3D(lat: number, lng: number): Vec3 {
  const phi = (90 - lat) * Math.PI / 180;
  const theta = (lng + 180) * Math.PI / 180;
  return {
    x: Math.sin(phi) * Math.cos(theta),
    y: Math.cos(phi),
    z: Math.sin(phi) * Math.sin(theta),
  };
}

function rotateY(v: Vec3, a: number): Vec3 {
  const c = Math.cos(a), s = Math.sin(a);
  return { x: v.x * c + v.z * s, y: v.y, z: -v.x * s + v.z * c };
}
function rotateX(v: Vec3, a: number): Vec3 {
  const c = Math.cos(a), s = Math.sin(a);
  return { x: v.x, y: v.y * c - v.z * s, z: v.y * s + v.z * c };
}
function rotate3D(v: Vec3, rx: number, ry: number): Vec3 {
  return rotateX(rotateY(v, ry), rx);
}

// Project rotated 3D point to 2D canvas
function project2D(v: Vec3, R: number, cx: number, cy: number) {
  return { px: cx + v.x * R, py: cy - v.y * R, visible: v.z > 0 };
}

// Great-circle interpolation for arcs
function greatCirclePoints(a: Vec3, b: Vec3, steps = 60): Vec3[] {
  const pts: Vec3[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const ax = a.x + (b.x - a.x) * t;
    const ay = a.y + (b.y - a.y) * t;
    const az = a.z + (b.z - a.z) * t;
    const len = Math.sqrt(ax*ax + ay*ay + az*az) || 1;
    pts.push({ x: ax/len, y: ay/len, z: az/len });
  }
  return pts;
}

// Pre-compute dot positions (lat/lng grid, sampled once)
interface DotPoint { v: Vec3; land: boolean }
function buildDotGrid(mask: Uint8Array): DotPoint[] {
  const pts: DotPoint[] = [];
  const step = 3; // degrees
  for (let lat = -87; lat <= 87; lat += step) {
    for (let lng = -180; lng < 180; lng += step) {
      const v = latLngTo3D(lat, lng);
      const land = isLand(lat, lng, mask);
      pts.push({ v, land });
    }
  }
  return pts;
}

// ── Main Component ───────────────────────────────────────────────────────────
const InteractiveGlobe = memo(function InteractiveGlobe({ countries }: InteractiveGlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    rotX: 0.25,
    rotY: 0,
    zoom: 1,
    dragging: false,
    lastMx: 0,
    lastMy: 0,
    velX: 0,
    velY: 0,
    t: 0,
    dots: null as DotPoint[] | null,
    mask: null as Uint8Array | null,
    frame: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const s = stateRef.current;

    // Build mask + dot grid once
    if (!s.mask) s.mask = buildLandMask();
    if (!s.dots) s.dots = buildDotGrid(s.mask);

    // Active country coordinates
    const activeCoords = countries
      .filter(c => c.active && COUNTRY_COORDS[c.name])
      .map(c => ({ ...c, v: latLngTo3D(COUNTRY_COORDS[c.name][0], COUNTRY_COORDS[c.name][1]) }));

    // Connection pairs
    const pairs: [typeof activeCoords[0], typeof activeCoords[0]][] = [];
    for (let i = 0; i < activeCoords.length; i++) {
      for (let j = i + 1; j < activeCoords.length; j++) {
        pairs.push([activeCoords[i], activeCoords[j]]);
      }
    }

    let animId: number;

    const draw = () => {
      s.frame++;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx || !s.dots) return;

      const W = canvas.width;
      const H = canvas.height;
      const cx = W / 2;
      const cy = H / 2;
      const R = Math.min(W, H) * 0.38 * s.zoom;

      // Auto-rotate
      if (!s.dragging) {
        s.rotY += 0.004;
        s.velX *= 0.9;
        s.velY *= 0.9;
        s.rotX += s.velX;
        s.rotY += s.velY;
        s.rotX = Math.max(-0.6, Math.min(0.6, s.rotX));
      }
      s.t += 0.016;

      ctx.clearRect(0, 0, W, H);

      // ── Stars ──────────────────────────────────────────
      ctx.save();
      // Only draw stars occasionally for performance
      if (s.frame === 1) {
        (canvas as any)._stars = Array.from({ length: 180 }, () => ({
          x: Math.random() * W,
          y: Math.random() * H,
          r: Math.random() * 1.2 + 0.2,
          a: Math.random() * 0.5 + 0.1,
        }));
      }
      const stars: {x:number,y:number,r:number,a:number}[] = (canvas as any)._stars || [];
      stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180,200,255,${star.a})`;
        ctx.fill();
      });
      ctx.restore();

      // ── Outer atmosphere ring ──────────────────────────
      const atmGrad = ctx.createRadialGradient(cx, cy, R * 0.88, cx, cy, R * 1.22);
      atmGrad.addColorStop(0, "rgba(40, 80, 180, 0.18)");
      atmGrad.addColorStop(0.5, "rgba(20, 50, 140, 0.08)");
      atmGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.22, 0, Math.PI * 2);
      ctx.fillStyle = atmGrad;
      ctx.fill();

      // ── Ocean sphere ───────────────────────────────────
      const oceanGrad = ctx.createRadialGradient(
        cx - R * 0.3, cy - R * 0.3, R * 0.1,
        cx, cy, R
      );
      oceanGrad.addColorStop(0,   "rgba(14, 26, 55, 1)");
      oceanGrad.addColorStop(0.5, "rgba(6, 12, 30, 1)");
      oceanGrad.addColorStop(1,   "rgba(2, 5, 15, 1)");
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fillStyle = oceanGrad;
      ctx.fill();

      // ── Clip to sphere ─────────────────────────────────
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.clip();

      // ── Land dots ──────────────────────────────────────
      const landColor = "rgba(140, 165, 200, 0.75)";
      const oceanDotColor = "rgba(30, 50, 100, 0.25)";

      s.dots.forEach(({ v, land }) => {
        const rv = rotate3D(v, s.rotX, s.rotY);
        if (rv.z < 0) return; // back side

        const { px, py } = project2D(rv, R, cx, cy);

        // Edge dimming: darker near limb
        const edge = Math.max(0, rv.z);
        const dotR = land ? 1.5 : 1.0;

        if (land) {
          const alpha = 0.3 + edge * 0.65;
          ctx.beginPath();
          ctx.arc(px, py, dotR, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(140, 165, 200, ${alpha.toFixed(2)})`;
          ctx.fill();
        } else if (edge > 0.05) {
          ctx.beginPath();
          ctx.arc(px, py, 0.8, 0, Math.PI * 2);
          ctx.fillStyle = oceanDotColor;
          ctx.fill();
        }
      });

      // ── Connection arcs ────────────────────────────────
      pairs.forEach(([a, b], idx) => {
        const gcPts = greatCirclePoints(a.v, b.v, 50);
        const offset = (s.t * 0.4 + idx * 0.7) % 1;
        const pulseWidth = 0.25;

        ctx.beginPath();
        let first = true;
        gcPts.forEach(pt => {
          const rv = rotate3D(pt, s.rotX, s.rotY);
          if (rv.z < -0.1) { first = true; return; }
          const { px, py } = project2D(rv, R, cx, cy);
          if (first) { ctx.moveTo(px, py); first = false; }
          else ctx.lineTo(px, py);
        });
        ctx.strokeStyle = "rgba(120, 150, 220, 0.18)";
        ctx.lineWidth = 0.8;
        ctx.stroke();

        // Animated pulse along arc
        const start = Math.floor(offset * 50);
        const end = Math.min(50, start + Math.floor(pulseWidth * 50));
        ctx.beginPath();
        let pFirst = true;
        for (let i = start; i <= end; i++) {
          const pt = gcPts[i % 50];
          if (!pt) continue;
          const rv = rotate3D(pt, s.rotX, s.rotY);
          if (rv.z < 0) { pFirst = true; continue; }
          const { px, py } = project2D(rv, R, cx, cy);
          if (pFirst) { ctx.moveTo(px, py); pFirst = false; }
          else ctx.lineTo(px, py);
        }
        // Bright pulse stroke
        ctx.strokeStyle = "rgba(200, 220, 255, 0.75)";
        ctx.lineWidth = 1.8;
        ctx.stroke();
      });

      ctx.restore(); // end sphere clip

      // ── Sphere edge highlight / atmosphere inner ───────
      const edgeGrad = ctx.createRadialGradient(cx, cy, R * 0.7, cx, cy, R);
      edgeGrad.addColorStop(0, "rgba(0,0,0,0)");
      edgeGrad.addColorStop(0.75, "rgba(0,0,0,0)");
      edgeGrad.addColorStop(1, "rgba(30, 60, 160, 0.35)");
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fillStyle = edgeGrad;
      ctx.fill();

      // Light specular highlight
      const specGrad = ctx.createRadialGradient(
        cx - R * 0.35, cy - R * 0.35, 0,
        cx - R * 0.35, cy - R * 0.35, R * 0.55
      );
      specGrad.addColorStop(0, "rgba(200, 220, 255, 0.07)");
      specGrad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fillStyle = specGrad;
      ctx.fill();

      // ── Country markers (outside clip) ────────────────
      activeCoords.forEach((c, idx) => {
        const rv = rotate3D(c.v, s.rotX, s.rotY);
        if (rv.z < 0.08) return; // not visible
        const { px, py } = project2D(rv, R, cx, cy);

        // Pulse ring
        const pulsePhase = (s.t * 1.5 + idx * 1.1) % (Math.PI * 2);
        const pulseScale = 1 + Math.sin(pulsePhase) * 0.6;
        const pulseAlpha = Math.max(0, Math.sin(pulsePhase + 0.3)) * 0.45;

        ctx.beginPath();
        ctx.arc(px, py, 8 * pulseScale, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(100, 200, 255, ${pulseAlpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Core glow
        const coreGrad = ctx.createRadialGradient(px, py, 0, px, py, 6);
        coreGrad.addColorStop(0, "rgba(200, 230, 255, 1)");
        coreGrad.addColorStop(0.4, "rgba(120, 180, 255, 0.8)");
        coreGrad.addColorStop(1, "rgba(60, 120, 220, 0)");
        ctx.beginPath();
        ctx.arc(px, py, 6, 0, Math.PI * 2);
        ctx.fillStyle = coreGrad;
        ctx.fill();

        // White dot
        ctx.beginPath();
        ctx.arc(px, py, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.fill();
      });

      animId = requestAnimationFrame(draw);
    };

    // ── Resize handler ─────────────────────────────────
    const onResize = () => {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    onResize();
    const ro = new ResizeObserver(onResize);
    ro.observe(canvas);

    // ── Mouse events ───────────────────────────────────
    const onDown = (e: MouseEvent) => {
      s.dragging = true;
      s.lastMx = e.clientX;
      s.lastMy = e.clientY;
      s.velX = 0; s.velY = 0;
      canvas.style.cursor = "grabbing";
    };
    const onMove = (e: MouseEvent) => {
      if (!s.dragging) return;
      const dx = e.clientX - s.lastMx;
      const dy = e.clientY - s.lastMy;
      s.lastMx = e.clientX; s.lastMy = e.clientY;
      s.velX = dy * 0.004;
      s.velY = dx * 0.006;
      s.rotX = Math.max(-0.6, Math.min(0.6, s.rotX + dy * 0.004));
      s.rotY += dx * 0.006;
    };
    const onUp = () => { s.dragging = false; canvas.style.cursor = "grab"; };

    // Touch events
    let lastTx = 0, lastTy = 0;
    const onTouchStart = (e: TouchEvent) => {
      s.dragging = true;
      lastTx = e.touches[0].clientX;
      lastTy = e.touches[0].clientY;
      s.velX = 0; s.velY = 0;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!s.dragging) return;
      const dx = e.touches[0].clientX - lastTx;
      const dy = e.touches[0].clientY - lastTy;
      lastTx = e.touches[0].clientX;
      lastTy = e.touches[0].clientY;
      s.rotX = Math.max(-0.6, Math.min(0.6, s.rotX + dy * 0.005));
      s.rotY += dx * 0.006;
    };
    const onTouchEnd = () => { s.dragging = false; };

    // Zoom
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      s.zoom = Math.max(0.6, Math.min(2.5, s.zoom - e.deltaY * 0.001));
    };

    canvas.addEventListener("mousedown", onDown);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    canvas.addEventListener("touchstart", onTouchStart, { passive: true });
    canvas.addEventListener("touchmove", onTouchMove, { passive: true });
    canvas.addEventListener("touchend", onTouchEnd);
    canvas.addEventListener("wheel", onWheel, { passive: false });

    draw();

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      canvas.removeEventListener("mousedown", onDown);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      canvas.removeEventListener("touchstart", onTouchStart);
      canvas.removeEventListener("touchmove", onTouchMove);
      canvas.removeEventListener("touchend", onTouchEnd);
      canvas.removeEventListener("wheel", onWheel);
    };
  }, [countries]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ cursor: "grab", display: "block" }}
    />
  );
});

export default InteractiveGlobe;
