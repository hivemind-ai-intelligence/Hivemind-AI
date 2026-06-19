import { useRef, useEffect, useCallback } from "react";
import * as THREE from "three";

interface GlobeCountry {
  id: string;
  name: string;
  flag: string;
  active: boolean;
  projects: number;
}

interface InteractiveGlobeProps {
  countries: GlobeCountry[];
}

const COUNTRY_COORDS: Record<string, { lat: number; lng: number }> = {
  India: { lat: 20.6, lng: 78.9 },
  USA: { lat: 37.1, lng: -95.7 },
  UK: { lat: 55.4, lng: -3.4 },
  Canada: { lat: 56.1, lng: -106.3 },
  Australia: { lat: -25.3, lng: 133.8 },
  Germany: { lat: 51.2, lng: 10.5 },
  Singapore: { lat: 1.4, lng: 103.8 },
  UAE: { lat: 23.4, lng: 53.8 },
  France: { lat: 46.2, lng: 2.2 },
  Japan: { lat: 36.2, lng: 138.3 },
  Brazil: { lat: -14.2, lng: -51.9 },
  "South Africa": { lat: -30.6, lng: 22.9 },
};

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

function latLngToVec3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

function createEarthTexture(): THREE.CanvasTexture {
  const W = 2048;
  const H = 1024;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  // Deep ocean background
  const oceanGrad = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, W / 2);
  oceanGrad.addColorStop(0, "#060d1a");
  oceanGrad.addColorStop(1, "#02060f");
  ctx.fillStyle = oceanGrad;
  ctx.fillRect(0, 0, W, H);

  // Scale factor from SVG 1000x500 → 2048x1024
  const sx = W / 1000;
  const sy = H / 500;

  // Land — subtle silver/slate gradient
  const landGrad = ctx.createLinearGradient(0, 0, W, H);
  landGrad.addColorStop(0, "#3a4556");
  landGrad.addColorStop(0.5, "#5a6880");
  landGrad.addColorStop(1, "#2e3a4a");

  ctx.fillStyle = landGrad;
  WORLD_SVG_PATHS.forEach((pathStr) => {
    const scaled = pathStr.replace(/(-?\d+\.?\d*),(-?\d+\.?\d*)/g, (_, x, y) =>
      `${(parseFloat(x) * sx).toFixed(2)},${(parseFloat(y) * sy).toFixed(2)}`
    );
    ctx.fill(new Path2D(scaled));
  });

  // Land highlight
  ctx.fillStyle = "rgba(160,180,210,0.12)";
  WORLD_SVG_PATHS.forEach((pathStr) => {
    const scaled = pathStr.replace(/(-?\d+\.?\d*),(-?\d+\.?\d*)/g, (_, x, y) =>
      `${(parseFloat(x) * sx).toFixed(2)},${(parseFloat(y) * sy).toFixed(2)}`
    );
    ctx.fill(new Path2D(scaled));
  });

  // Subtle grid lines (latitude/longitude)
  ctx.strokeStyle = "rgba(100,130,180,0.04)";
  ctx.lineWidth = 0.5;
  for (let i = 0; i <= 12; i++) {
    ctx.beginPath();
    ctx.moveTo((i * W) / 12, 0);
    ctx.lineTo((i * W) / 12, H);
    ctx.stroke();
  }
  for (let i = 0; i <= 6; i++) {
    ctx.beginPath();
    ctx.moveTo(0, (i * H) / 6);
    ctx.lineTo(W, (i * H) / 6);
    ctx.stroke();
  }

  return new THREE.CanvasTexture(canvas);
}

function createArcGeometry(
  from: THREE.Vector3,
  to: THREE.Vector3,
  segments = 64,
  arcHeight = 1.6
): THREE.BufferGeometry {
  const points: THREE.Vector3[] = [];
  const mid = from.clone().add(to).multiplyScalar(0.5).normalize().multiplyScalar(arcHeight);
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const p = new THREE.Vector3()
      .addScaledVector(from, (1 - t) * (1 - t))
      .addScaledVector(mid, 2 * t * (1 - t))
      .addScaledVector(to, t * t);
    points.push(p);
  }
  return new THREE.BufferGeometry().setFromPoints(points);
}

export default function InteractiveGlobe({ countries }: InteractiveGlobeProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({
    isDragging: false,
    prevMouse: { x: 0, y: 0 },
    autoRotateSpeed: 0.0012,
    dragVelocity: { x: 0, y: 0 },
    globeGroup: null as THREE.Group | null,
  });

  const setupScene = useCallback(() => {
    const mount = mountRef.current;
    if (!mount) return () => {};

    const W = mount.clientWidth;
    const H = mount.clientHeight;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 100);
    camera.position.z = 2.8;

    // Stars
    const starGeo = new THREE.BufferGeometry();
    const starCount = 1500;
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i++) {
      starPos[i] = (Math.random() - 0.5) * 80;
    }
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({ color: 0xaabbcc, size: 0.08, transparent: true, opacity: 0.6 });
    scene.add(new THREE.Points(starGeo, starMat));

    // Globe group
    const globeGroup = new THREE.Group();
    stateRef.current.globeGroup = globeGroup;
    scene.add(globeGroup);

    // Earth sphere
    const earthGeo = new THREE.SphereGeometry(1, 64, 64);
    const earthTex = createEarthTexture();
    const earthMat = new THREE.MeshPhongMaterial({
      map: earthTex,
      shininess: 25,
      specular: new THREE.Color(0x334466),
    });
    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    globeGroup.add(earthMesh);

    // Atmosphere glow (outer sphere)
    const atmGeo = new THREE.SphereGeometry(1.035, 64, 64);
    const atmMat = new THREE.MeshPhongMaterial({
      color: 0x1a3a6a,
      transparent: true,
      opacity: 0.18,
      side: THREE.FrontSide,
      depthWrite: false,
    });
    globeGroup.add(new THREE.Mesh(atmGeo, atmMat));

    // Outer glow ring
    const glowGeo = new THREE.SphereGeometry(1.08, 64, 64);
    const glowMat = new THREE.MeshPhongMaterial({
      color: 0x2244aa,
      transparent: true,
      opacity: 0.06,
      side: THREE.BackSide,
      depthWrite: false,
    });
    globeGroup.add(new THREE.Mesh(glowGeo, glowMat));

    // Lighting
    const ambient = new THREE.AmbientLight(0x223355, 1.2);
    scene.add(ambient);
    const sun = new THREE.DirectionalLight(0xd0e0ff, 2.4);
    sun.position.set(5, 3, 5);
    scene.add(sun);
    const rim = new THREE.DirectionalLight(0x445577, 0.8);
    rim.position.set(-4, -2, -3);
    scene.add(rim);

    // Country markers
    const activeCountries = countries.filter(c => c.active);
    const markerMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const glowMarkerMat = new THREE.MeshBasicMaterial({
      color: 0xaaccff,
      transparent: true,
      opacity: 0.4,
    });

    activeCountries.forEach(country => {
      const coords = COUNTRY_COORDS[country.name];
      if (!coords) return;
      const pos = latLngToVec3(coords.lat, coords.lng, 1.005);

      // Core dot
      const dotGeo = new THREE.SphereGeometry(0.012, 8, 8);
      const dot = new THREE.Mesh(dotGeo, markerMat);
      dot.position.copy(pos);
      globeGroup.add(dot);

      // Glow halo
      const haloGeo = new THREE.SphereGeometry(0.025, 8, 8);
      const halo = new THREE.Mesh(haloGeo, glowMarkerMat.clone());
      halo.position.copy(pos);
      globeGroup.add(halo);
    });

    // Connection arcs between active countries
    const arcMat = new THREE.LineBasicMaterial({
      color: 0xc0d8ff,
      transparent: true,
      opacity: 0.35,
    });

    for (let i = 0; i < activeCountries.length; i++) {
      for (let j = i + 1; j < activeCountries.length; j++) {
        const a = COUNTRY_COORDS[activeCountries[i].name];
        const b = COUNTRY_COORDS[activeCountries[j].name];
        if (!a || !b) continue;
        const va = latLngToVec3(a.lat, a.lng, 1.005);
        const vb = latLngToVec3(b.lat, b.lng, 1.005);
        const arcGeo = createArcGeometry(va, vb);
        const mat = arcMat.clone();
        const line = new THREE.Line(arcGeo, mat);
        globeGroup.add(line);
      }
    }

    // Animated arc pulses
    const pulseMeshes: { line: THREE.Line; speed: number; offset: number; mat: THREE.LineBasicMaterial }[] = [];
    activeCountries.forEach((country, i) => {
      const next = activeCountries[(i + 1) % activeCountries.length];
      if (!next || country.name === next.name) return;
      const a = COUNTRY_COORDS[country.name];
      const b = COUNTRY_COORDS[next.name];
      if (!a || !b) return;
      const va = latLngToVec3(a.lat, a.lng, 1.01);
      const vb = latLngToVec3(b.lat, b.lng, 1.01);
      const arcGeo = createArcGeometry(va, vb, 32, 1.55);
      const pulseMat = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0,
      });
      const line = new THREE.Line(arcGeo, pulseMat);
      globeGroup.add(line);
      pulseMeshes.push({ line, speed: 0.6 + Math.random() * 0.4, offset: Math.random() * Math.PI * 2, mat: pulseMat });
    });

    // Mouse drag
    const onMouseDown = (e: MouseEvent) => {
      stateRef.current.isDragging = true;
      stateRef.current.prevMouse = { x: e.clientX, y: e.clientY };
      stateRef.current.dragVelocity = { x: 0, y: 0 };
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!stateRef.current.isDragging) return;
      const dx = e.clientX - stateRef.current.prevMouse.x;
      const dy = e.clientY - stateRef.current.prevMouse.y;
      stateRef.current.prevMouse = { x: e.clientX, y: e.clientY };
      stateRef.current.dragVelocity = { x: dx * 0.005, y: dy * 0.005 };
      globeGroup.rotation.y += dx * 0.005;
      globeGroup.rotation.x += dy * 0.005;
      globeGroup.rotation.x = Math.max(-Math.PI / 2.5, Math.min(Math.PI / 2.5, globeGroup.rotation.x));
    };
    const onMouseUp = () => { stateRef.current.isDragging = false; };

    // Touch support
    let lastTouch = { x: 0, y: 0 };
    const onTouchStart = (e: TouchEvent) => {
      stateRef.current.isDragging = true;
      lastTouch = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!stateRef.current.isDragging) return;
      const dx = e.touches[0].clientX - lastTouch.x;
      const dy = e.touches[0].clientY - lastTouch.y;
      lastTouch = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      globeGroup.rotation.y += dx * 0.005;
      globeGroup.rotation.x += dy * 0.005;
      globeGroup.rotation.x = Math.max(-Math.PI / 2.5, Math.min(Math.PI / 2.5, globeGroup.rotation.x));
    };
    const onTouchEnd = () => { stateRef.current.isDragging = false; };

    // Zoom via wheel
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      camera.position.z = Math.max(1.8, Math.min(5, camera.position.z + e.deltaY * 0.002));
    };

    mount.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    mount.addEventListener("touchstart", onTouchStart, { passive: true });
    mount.addEventListener("touchmove", onTouchMove, { passive: true });
    mount.addEventListener("touchend", onTouchEnd);
    mount.addEventListener("wheel", onWheel, { passive: false });

    // Animate
    let animId: number;
    let t = 0;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      t += 0.016;

      if (!stateRef.current.isDragging) {
        globeGroup.rotation.y += stateRef.current.autoRotateSpeed;
        // Momentum decay
        stateRef.current.dragVelocity.x *= 0.95;
        stateRef.current.dragVelocity.y *= 0.95;
      }

      // Animate pulse arcs
      pulseMeshes.forEach(({ mat, speed, offset }) => {
        const pulse = Math.sin(t * speed + offset);
        mat.opacity = Math.max(0, pulse * 0.7);
      });

      renderer.render(scene, camera);
    };
    animate();

    // Resize
    const handleResize = () => {
      if (!mount) return;
      const nW = mount.clientWidth;
      const nH = mount.clientHeight;
      camera.aspect = nW / nH;
      camera.updateProjectionMatrix();
      renderer.setSize(nW, nH);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      mount.removeEventListener("mousedown", onMouseDown);
      mount.removeEventListener("touchstart", onTouchStart);
      mount.removeEventListener("touchmove", onTouchMove);
      mount.removeEventListener("touchend", onTouchEnd);
      mount.removeEventListener("wheel", onWheel);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [countries]);

  useEffect(() => {
    const cleanup = setupScene();
    return cleanup;
  }, [setupScene]);

  return (
    <div
      ref={mountRef}
      className="w-full h-full cursor-grab active:cursor-grabbing"
      style={{ background: "transparent" }}
    />
  );
}
