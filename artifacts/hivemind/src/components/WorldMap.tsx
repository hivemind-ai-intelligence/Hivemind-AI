import { useRef, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAdminData } from "@/hooks/useAdminData";
import { Globe, Wifi, FolderOpen, Languages, Cpu } from "lucide-react";

// Approximate Mercator projection: lat/lng → %x/%y on our map canvas
// viewBox: 0 0 1000 500 — we use % so it's responsive
const latLngToPercent = (lat: number, lng: number) => {
  const x = ((lng + 180) / 360) * 100;
  const latRad = (lat * Math.PI) / 180;
  const mercN = Math.log(Math.tan(Math.PI / 4 + latRad / 2));
  const y = ((Math.PI - mercN) / (2 * Math.PI)) * 100;
  return { x, y };
};

// Country lat/lng lookup
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

// Simplified world silhouette as SVG path (Mercator projected, 1000x500 viewBox)
const WORLD_SVG_PATHS = [
  // North America
  "M 105,85 L 130,62 L 165,55 L 205,62 L 235,85 L 255,108 L 265,138 L 248,168 L 225,200 L 198,228 L 175,255 L 152,248 L 135,228 L 115,200 L 98,168 L 88,138 L 95,108 Z",
  // Greenland
  "M 220,42 L 248,35 L 268,38 L 272,52 L 258,62 L 235,62 L 220,55 Z",
  // South America
  "M 215,260 L 248,252 L 272,260 L 292,292 L 300,330 L 292,370 L 272,402 L 242,420 L 212,410 L 192,378 L 185,340 L 192,300 Z",
  // Europe
  "M 465,82 L 492,65 L 530,62 L 565,70 L 585,92 L 578,118 L 555,132 L 518,140 L 490,135 L 465,118 Z",
  "M 508,105 L 515,95 L 530,92 L 545,98 L 548,110 L 535,118 L 518,115 Z",
  // Africa
  "M 462,132 L 510,122 L 560,132 L 598,158 L 618,195 L 612,245 L 590,290 L 558,325 L 518,342 L 485,335 L 452,305 L 438,262 L 435,218 L 442,175 Z",
  // Asia (main)
  "M 575,68 L 640,55 L 720,50 L 805,58 L 872,80 L 902,110 L 895,155 L 868,188 L 828,212 L 775,228 L 718,232 L 662,222 L 618,202 L 590,175 L 575,145 L 568,112 Z",
  // Indian Subcontinent extension
  "M 658,188 L 675,210 L 685,242 L 678,262 L 658,268 L 642,252 L 635,222 L 642,198 Z",
  // Southeast Asia
  "M 760,218 L 788,208 L 812,218 L 820,238 L 808,258 L 782,265 L 760,252 L 750,235 Z",
  // Australia
  "M 762,292 L 825,282 L 878,298 L 912,325 L 915,358 L 895,388 L 850,402 L 798,402 L 758,382 L 738,352 L 742,318 Z",
  // New Zealand
  "M 945,340 L 958,328 L 968,335 L 965,352 L 952,360 L 942,352 Z",
];

function WorldCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    canvas.width = w;
    canvas.height = h;

    // Create dotted world map from SVG paths by rasterizing
    const dotSpacing = 8;
    const dotRadius = 1.2;

    // We'll use an offscreen canvas to rasterize the paths
    const offscreen = document.createElement("canvas");
    offscreen.width = w;
    offscreen.height = h;
    const octx = offscreen.getContext("2d");
    if (!octx) return;

    // Scale factor: our SVG paths are in 1000x500 space
    const scaleX = w / 1000;
    const scaleY = h / 500;

    octx.fillStyle = "#ffffff";
    WORLD_SVG_PATHS.forEach((pathStr) => {
      const path = new Path2D(
        pathStr.replace(/(\d+\.?\d*),(\d+\.?\d*)/g, (_, x, y) =>
          `${(parseFloat(x) * scaleX).toFixed(2)},${(parseFloat(y) * scaleY).toFixed(2)}`
        )
      );
      octx.fill(path);
    });

    const imageData = octx.getImageData(0, 0, w, h);

    // Draw dots where land exists
    ctx.clearRect(0, 0, w, h);
    for (let x = 0; x < w; x += dotSpacing) {
      for (let y = 0; y < h; y += dotSpacing) {
        const idx = (y * w + x) * 4;
        const r = imageData.data[idx];
        if (r > 128) {
          ctx.beginPath();
          ctx.arc(x, y, dotRadius, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(168, 178, 196, 0.25)";
          ctx.fill();
        }
      }
    }

    const handleResize = () => {
      const nw = canvas.offsetWidth;
      const nh = canvas.offsetHeight;
      canvas.width = nw;
      canvas.height = nh;
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}

export default function WorldMap() {
  const { data } = useAdminData();
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

  const getMapPos = useCallback((country: typeof data.worldCountries[0]) => {
    const coords = COUNTRY_COORDS[country.name];
    if (coords) {
      const pos = latLngToPercent(coords.lat, coords.lng);
      return pos;
    }
    return { x: country.x, y: country.y };
  }, []);

  const stats = [
    { icon: Globe, label: "Active Regions", value: data.worldActiveRegions },
    { icon: FolderOpen, label: "Projects", value: `${data.worldProjects}+` },
    { icon: Languages, label: "Languages", value: `${data.worldLanguages}+` },
    { icon: Cpu, label: "AI Coverage", value: data.worldAICoverage },
  ];

  const activeCountries = data.worldCountries.filter(c => c.active);

  return (
    <section className="py-24 relative overflow-hidden bg-card/20 border-t border-border" id="global">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-card/10 to-transparent" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel border border-border mb-6"
          >
            <Wifi className="w-3 h-3 text-green-500" />
            <span className="text-xs font-medium uppercase tracking-wide">Global Network Active</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold mb-4 metallic-text"
          >
            Global Presence
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground max-w-xl mx-auto"
          >
            From one vision to a worldwide network of digital excellence.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="glass-panel rounded-3xl border border-border overflow-hidden"
        >
          {/* Map Area */}
          <div className="relative" style={{ height: "380px" }}>
            <WorldCanvas />

            {/* Country Markers */}
            {data.worldCountries.map((country) => {
              const pos = getMapPos(country);
              return (
                <div
                  key={country.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer"
                  style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                  onMouseEnter={() => setHoveredCountry(country.id)}
                  onMouseLeave={() => setHoveredCountry(null)}
                >
                  {/* Pulse ring for active */}
                  {country.active && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="animate-ping absolute inline-flex h-4 w-4 rounded-full bg-green-400 opacity-40" />
                    </span>
                  )}

                  {/* Marker dot */}
                  <div className={`relative w-3 h-3 rounded-full border-2 border-background shadow-lg flex items-center justify-center transition-transform duration-200 ${
                    hoveredCountry === country.id ? "scale-125" : ""
                  } ${country.active ? "bg-green-500" : "bg-foreground/40"}`} />

                  {/* Tooltip */}
                  <AnimatePresence>
                    {hoveredCountry === country.id && (
                      <motion.div
                        initial={{ opacity: 0, y: -4, scale: 0.9 }}
                        animate={{ opacity: 1, y: -8, scale: 1 }}
                        exit={{ opacity: 0, y: -4, scale: 0.9 }}
                        transition={{ duration: 0.15 }}
                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-20 pointer-events-none"
                      >
                        <div className="bg-card border border-border rounded-xl px-3 py-2 whitespace-nowrap shadow-xl text-xs">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-base">{country.flag}</span>
                            <span className="font-semibold text-foreground">{country.name}</span>
                            {country.active && (
                              <span className="text-[10px] bg-green-500/20 text-green-500 px-1.5 py-0.5 rounded-full">Active</span>
                            )}
                          </div>
                          <p className="text-muted-foreground">{country.projects} projects</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}

            {/* Connection lines between active countries (SVG overlay) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" style={{ mixBlendMode: "screen" }}>
              <defs>
                <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgba(34,197,94,0)" />
                  <stop offset="50%" stopColor="rgba(34,197,94,0.3)" />
                  <stop offset="100%" stopColor="rgba(34,197,94,0)" />
                </linearGradient>
              </defs>
              {activeCountries.map((country, i) => {
                const posA = getMapPos(country);
                return activeCountries.slice(i + 1).map((other) => {
                  const posB = getMapPos(other);
                  return (
                    <motion.line
                      key={`${country.id}-${other.id}`}
                      x1={`${posA.x}%`} y1={`${posA.y}%`}
                      x2={`${posB.x}%`} y2={`${posB.y}%`}
                      stroke="url(#lineGrad)"
                      strokeWidth="0.8"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 2, delay: i * 0.2, ease: "easeInOut" }}
                    />
                  );
                });
              })}
            </svg>

            {/* Corner label */}
            <div className="absolute top-4 left-4 z-10">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span>{activeCountries.length} regions active</span>
              </div>
            </div>
          </div>

          {/* Country Badges */}
          <div className="px-6 pb-4 pt-2 border-t border-border/50">
            <div className="flex flex-wrap gap-2">
              {data.worldCountries.map((c) => (
                <div
                  key={c.id}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                    c.active
                      ? "border-green-500/30 bg-green-500/10 text-green-400"
                      : "border-border bg-card/50 text-muted-foreground"
                  }`}
                >
                  <span>{c.flag}</span>
                  <span>{c.name}</span>
                  {c.active && <span className="w-1 h-1 rounded-full bg-green-400" />}
                </div>
              ))}
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 border-t border-border">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`flex flex-col items-center justify-center p-6 text-center ${i < 3 ? "border-r border-border" : ""}`}
                >
                  <Icon className="w-5 h-5 text-muted-foreground mb-2" />
                  <span className="text-2xl font-bold text-foreground">{stat.value}</span>
                  <span className="text-xs text-muted-foreground uppercase tracking-wider mt-1">{stat.label}</span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
