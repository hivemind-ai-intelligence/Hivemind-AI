import { lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { useAdminData } from "@/hooks/useAdminData";
import { Globe, Wifi, FolderOpen, Languages, Cpu } from "lucide-react";

const InteractiveGlobe = lazy(() => import("./InteractiveGlobe"));

export default function WorldMap() {
  const { data } = useAdminData();

  const stats = [
    { icon: Globe, label: "Active Regions", value: data.worldActiveRegions },
    { icon: FolderOpen, label: "Projects", value: `${data.worldProjects}+` },
    { icon: Languages, label: "Languages", value: `${data.worldLanguages}+` },
    { icon: Cpu, label: "AI Coverage", value: data.worldAICoverage },
  ];

  const activeCountries = data.worldCountries.filter(c => c.active);

  return (
    <section className="py-24 relative overflow-hidden" id="global">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-transparent dark:via-black/40" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-blue-900/5 blur-3xl pointer-events-none" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Global Network Active</span>
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

        {/* Globe Container */}
        <motion.div
          initial={{ opacity: 1, y: 0 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0 }}
          className="rounded-3xl overflow-hidden border border-white/8 shadow-2xl"
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(0,0,0,0.6) 100%)",
            backdropFilter: "blur(20px)",
            boxShadow: "0 0 80px rgba(30,60,120,0.15), inset 0 1px 0 rgba(255,255,255,0.06)",
          }}
        >
          {/* Globe Area */}
          <div className="relative" style={{ height: "520px" }}>
            {/* Dark radial background inside container */}
            <div
              className="absolute inset-0"
              style={{
                background: "radial-gradient(ellipse at center, #04080f 0%, #010306 100%)",
              }}
            />

            {/* Globe */}
            <Suspense
              fallback={
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 rounded-full border border-white/10 animate-pulse bg-white/5" />
                    <span className="text-xs text-white/30 tracking-widest uppercase">Initializing Globe</span>
                  </div>
                </div>
              }
            >
              <InteractiveGlobe countries={data.worldCountries} />
            </Suspense>

            {/* Overlay labels */}
            <div className="absolute top-4 left-4 z-10 pointer-events-none">
              <div className="flex items-center gap-2 text-xs text-white/40">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{activeCountries.length} regions active</span>
              </div>
            </div>

            <div className="absolute bottom-4 right-4 z-10 pointer-events-none">
              <div className="text-[10px] text-white/20 tracking-widest uppercase">Drag · Scroll to Zoom</div>
            </div>

            {/* Gradient fade at bottom */}
            <div
              className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none z-10"
              style={{ background: "linear-gradient(to top, rgba(2,4,8,0.9), transparent)" }}
            />
          </div>

          {/* Country badges */}
          <div className="px-6 pb-4 pt-4 border-t border-white/5">
            <div className="flex flex-wrap gap-2">
              {data.worldCountries.map((c) => (
                <div
                  key={c.id}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 ${
                    c.active
                      ? "border-emerald-500/20 bg-emerald-500/8 text-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.1)]"
                      : "border-white/5 bg-white/3 text-white/30"
                  }`}
                >
                  <span>{c.flag}</span>
                  <span>{c.name}</span>
                  {c.active && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_4px_rgba(52,211,153,0.8)]" />}
                </div>
              ))}
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 border-t border-white/5">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`flex flex-col items-center justify-center p-6 text-center ${
                    i < 3 ? "border-r border-white/5" : ""
                  }`}
                >
                  <Icon className="w-5 h-5 text-white/20 mb-2" />
                  <span className="text-2xl font-bold text-white/90">{stat.value}</span>
                  <span className="text-[10px] text-white/30 uppercase tracking-widest mt-1">{stat.label}</span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
