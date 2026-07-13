import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  Cpu, Zap, MonitorSmartphone, Users, Globe2, Bot,
  Cloud, ShoppingCart, Network, Layers, ChevronDown,
} from "lucide-react";
import type { ElementType } from "react";

interface Milestone {
  year: string;
  title: string;
  tagline: string;
  icon: ElementType;
  color: string;
  items: string[];
  status: "live" | "building" | "planned";
}

const MILESTONES: Milestone[] = [
  { year: "2026", title: "HiveMind Assistant", tagline: "The intelligence layer begins.", icon: Cpu, color: "#818cf8", status: "live", items: ["AI Chat", "Knowledge Base", "Voice AI"] },
  { year: "2027", title: "Automation Platform", tagline: "Workflows that think for themselves.", icon: Zap, color: "#f59e0b", status: "building", items: ["Workflow Automation", "Business Systems", "Integrations"] },
  { year: "2028", title: "HiveMind OS Alpha", tagline: "The operating system for modern business.", icon: MonitorSmartphone, color: "#22d3ee", status: "planned", items: ["Business Operating System", "Smart Dashboard", "AI Intelligence Layer"] },
  { year: "2029", title: "AI Workforce System", tagline: "Your business, always on.", icon: Users, color: "#a78bfa", status: "planned", items: ["AI Receptionist", "AI Support", "AI Sales"] },
  { year: "2030", title: "Global AI Infrastructure", tagline: "Everywhere. Always.", icon: Globe2, color: "#34d399", status: "planned", items: ["Multi-region systems", "Business Intelligence Network"] },
  { year: "2031", title: "Autonomous Business Agents", tagline: "AI that works while you sleep.", icon: Bot, color: "#f472b6", status: "planned", items: ["Self-operating AI systems"] },
  { year: "2032", title: "HiveMind Cloud", tagline: "Unified intelligence in the cloud.", icon: Cloud, color: "#60a5fa", status: "planned", items: ["Unified AI ecosystem"] },
  { year: "2033", title: "AI Commerce Network", tagline: "Commerce that thinks ahead.", icon: ShoppingCart, color: "#fb923c", status: "planned", items: ["Intelligent commerce infrastructure"] },
  { year: "2034", title: "Global Intelligence Grid", tagline: "A connected world of intelligence.", icon: Network, color: "#4ade80", status: "planned", items: ["Worldwide AI collaboration"] },
  { year: "2035", title: "Human + AI Civilization Layer", tagline: "The complete HiveMind vision realized.", icon: Layers, color: "#e879f9", status: "planned", items: ["Complete HiveMind Vision"] },
];

const STATUS_LABELS: Record<string, string> = {
  live: "Live Now",
  building: "In Development",
  planned: "Planned",
};

interface NodeProps {
  milestone: Milestone;
  index: number;
  isActive: boolean;
  inView: boolean;
  onClick: () => void;
}

function MilestoneNode({ milestone, index, isActive, inView, onClick }: NodeProps) {
  const Icon = milestone.icon;
  const isLeft = index % 2 === 0;

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.1 + index * 0.06 }}
    >
      {/* ── Desktop: alternating layout ── */}
      <div className="hidden md:grid md:grid-cols-[1fr_56px_1fr] md:items-start md:gap-x-4">
        {/* Left slot */}
        <div className={`flex justify-end ${isLeft ? "pb-6" : ""}`}>
          {isLeft && (
            <NodeCard
              milestone={milestone}
              isActive={isActive}
              onClick={onClick}
              align="right"
            />
          )}
        </div>

        {/* Center: dot */}
        <div className="flex flex-col items-center pt-5">
          <button
            onClick={onClick}
            className="relative w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300 focus:outline-none z-10"
            style={{
              borderColor: milestone.color,
              backgroundColor: isActive ? milestone.color : "transparent",
              boxShadow: isActive ? `0 0 12px ${milestone.color}60` : "none",
            }}
            aria-label={`Toggle ${milestone.year}`}
          >
            {/* Pulse ring */}
            {isActive && (
              <span
                className="absolute inset-0 rounded-full animate-ping opacity-30"
                style={{ backgroundColor: milestone.color }}
              />
            )}
          </button>
        </div>

        {/* Right slot */}
        <div className={`${!isLeft ? "pb-6" : ""}`}>
          {!isLeft && (
            <NodeCard
              milestone={milestone}
              isActive={isActive}
              onClick={onClick}
              align="left"
            />
          )}
        </div>
      </div>

      {/* ── Mobile: single column layout ── */}
      <div className="grid grid-cols-[28px_1fr] gap-x-4 md:hidden mb-4">
        <div className="flex flex-col items-center pt-4">
          <button
            onClick={onClick}
            className="relative w-4 h-4 rounded-full border-2 flex-shrink-0 focus:outline-none z-10 transition-all duration-300"
            style={{
              borderColor: milestone.color,
              backgroundColor: isActive ? milestone.color : "transparent",
              boxShadow: isActive ? `0 0 8px ${milestone.color}50` : "none",
            }}
            aria-label={`Toggle ${milestone.year}`}
          >
            {isActive && (
              <span
                className="absolute inset-0 rounded-full animate-ping opacity-30"
                style={{ backgroundColor: milestone.color }}
              />
            )}
          </button>
        </div>
        <div>
          <NodeCard milestone={milestone} isActive={isActive} onClick={onClick} align="left" />
        </div>
      </div>
    </motion.div>
  );
}

interface CardProps {
  milestone: Milestone;
  isActive: boolean;
  onClick: () => void;
  align: "left" | "right";
}

function NodeCard({ milestone, isActive, onClick, align }: CardProps) {
  const Icon = milestone.icon;
  return (
    <motion.button
      onClick={onClick}
      className={`w-full max-w-sm text-${align} group relative rounded-2xl border transition-all duration-300 p-5 cursor-pointer focus:outline-none
        ${isActive
          ? "border-white/15 bg-white/5"
          : "border-white/6 bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.03]"
        }`}
      style={isActive ? { boxShadow: `0 0 30px ${milestone.color}15` } : {}}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      {/* Colored accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-[1px] rounded-t-2xl transition-opacity duration-300"
        style={{
          background: `linear-gradient(90deg, transparent, ${milestone.color}60, transparent)`,
          opacity: isActive ? 1 : 0,
        }}
      />

      {/* Header row */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
            style={{ backgroundColor: `${milestone.color}15`, border: `1px solid ${milestone.color}25` }}
          >
            <Icon className="w-4 h-4" style={{ color: milestone.color }} />
          </div>
          <div className={`text-${align}`}>
            <span
              className="text-[10px] font-bold tracking-widest uppercase"
              style={{ color: milestone.color }}
            >
              {milestone.year}
            </span>
            <h3 className="text-white text-sm font-semibold leading-tight">{milestone.title}</h3>
          </div>
        </div>
        <ChevronDown
          className="w-4 h-4 text-white/30 flex-shrink-0 mt-0.5 transition-transform duration-300"
          style={{ transform: isActive ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </div>

      <p className="text-white/35 text-xs leading-relaxed mb-3">{milestone.tagline}</p>

      {/* Status badge */}
      <span
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium tracking-wide"
        style={{
          backgroundColor: `${milestone.color}10`,
          color: milestone.color,
          border: `1px solid ${milestone.color}20`,
        }}
      >
        <span
          className="w-1 h-1 rounded-full"
          style={{
            backgroundColor: milestone.color,
            ...(milestone.status === "live" ? { animation: "pulse 2s infinite" } : {}),
          }}
        />
        {STATUS_LABELS[milestone.status]}
      </span>

      {/* Expandable items */}
      <AnimatePresence initial={false}>
        {isActive && (
          <motion.div
            key="items"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-4 pt-4 border-t border-white/6 space-y-2">
              {milestone.items.map((item) => (
                <div key={item} className="flex items-center gap-2 text-left">
                  <div
                    className="w-1 h-1 rounded-full flex-shrink-0"
                    style={{ backgroundColor: milestone.color }}
                  />
                  <span className="text-white/55 text-xs">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

export default function Roadmap() {
  const [activeYear, setActiveYear] = useState<string | null>("2026");
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-5%" });

  function toggle(year: string) {
    setActiveYear((prev) => (prev === year ? null : year));
  }

  return (
    <section ref={ref} id="roadmap" className="relative py-32 overflow-hidden bg-black">
      {/* Star field */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 80 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() > 0.85 ? 2 : 1,
              height: Math.random() > 0.85 ? 2 : 1,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.4 + 0.05,
            }}
          />
        ))}
        {/* Nebula glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-900/8 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[300px] bg-purple-900/8 rounded-full blur-[80px]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10 max-w-5xl">
        {/* Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/8 bg-white/3 text-[11px] text-white/40 tracking-[0.18em] uppercase font-medium mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            The Road Ahead
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-[58px] font-bold tracking-tight text-white leading-[1.07] mb-5">
            A decade-long vision.<br />
            <span className="bg-gradient-to-r from-white/85 via-indigo-200/60 to-white/20 bg-clip-text text-transparent">
              Built milestone by milestone.
            </span>
          </h2>
          <p className="text-white/35 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            From the first intelligence layer to a complete human–AI civilization infrastructure.
            Click any milestone to explore what's inside.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Central vertical line (desktop) */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 pointer-events-none">
            <div className="h-full bg-gradient-to-b from-transparent via-white/10 to-transparent" />
          </div>

          {/* Left vertical line (mobile) */}
          <div className="md:hidden absolute left-3.5 top-0 bottom-0 w-px pointer-events-none">
            <div className="h-full bg-gradient-to-b from-transparent via-white/10 to-transparent" />
          </div>

          <div className="space-y-2 md:space-y-1">
            {MILESTONES.map((m, i) => (
              <MilestoneNode
                key={m.year}
                milestone={m}
                index={i}
                isActive={activeYear === m.year}
                inView={inView}
                onClick={() => toggle(m.year)}
              />
            ))}
          </div>
        </div>

        {/* Footer note */}
        <motion.p
          className="text-center text-white/18 text-xs mt-16 tracking-wider uppercase"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          Roadmap is subject to change · HiveMind AI™ · 2026–2035
        </motion.p>
      </div>
    </section>
  );
}
