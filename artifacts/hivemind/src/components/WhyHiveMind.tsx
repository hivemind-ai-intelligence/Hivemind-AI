import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Brain, Zap, Globe2, Rocket, ChevronRight } from "lucide-react";

const CARDS = [
  {
    icon: Brain,
    title: "AI Intelligence",
    description:
      "Enterprise-grade AI systems that learn, adapt, and continuously optimize — trained on your business context to deliver decisions that compound over time.",
    gradient: "from-violet-500/12 via-violet-500/5 to-transparent",
    borderHover: "group-hover:border-violet-500/30",
    iconColor: "text-violet-400",
    iconBg: "bg-violet-500/8 border-violet-500/15",
    dot: "bg-violet-400",
  },
  {
    icon: Zap,
    title: "Business Automation",
    description:
      "End-to-end workflow automation that eliminates manual operations, accelerates delivery, and lets your team focus entirely on growth-driving work.",
    gradient: "from-amber-500/12 via-amber-500/5 to-transparent",
    borderHover: "group-hover:border-amber-500/30",
    iconColor: "text-amber-400",
    iconBg: "bg-amber-500/8 border-amber-500/15",
    dot: "bg-amber-400",
  },
  {
    icon: Globe2,
    title: "Global Infrastructure",
    description:
      "A distributed, multi-region network built for 24/7 uptime — delivering sub-second response times and enterprise-level reliability wherever your business operates.",
    gradient: "from-cyan-500/12 via-cyan-500/5 to-transparent",
    borderHover: "group-hover:border-cyan-500/30",
    iconColor: "text-cyan-400",
    iconBg: "bg-cyan-500/8 border-cyan-500/15",
    dot: "bg-cyan-400",
  },
  {
    icon: Rocket,
    title: "Future Ready Systems",
    description:
      "Modular AI architecture designed to scale infinitely — built with tomorrow's capabilities in mind so your business leads the curve rather than chasing it.",
    gradient: "from-emerald-500/12 via-emerald-500/5 to-transparent",
    borderHover: "group-hover:border-emerald-500/30",
    iconColor: "text-emerald-400",
    iconBg: "bg-emerald-500/8 border-emerald-500/15",
    dot: "bg-emerald-400",
  },
];

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function WhyHiveMind() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8%" });

  return (
    <section ref={ref} id="why-hivemind" className="relative py-32 overflow-hidden bg-background">
      {/* Ambient background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-violet-600/4 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-cyan-600/4 rounded-full blur-[140px]" />
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10 max-w-6xl">
        {/* Label */}
        <motion.div
          className="flex justify-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/8 bg-white/3 text-[11px] text-white/40 tracking-[0.18em] uppercase font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            Why HiveMind
          </span>
        </motion.div>

        {/* Headline */}
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <h2 className="text-4xl sm:text-5xl md:text-[62px] lg:text-[72px] font-bold tracking-tight leading-[1.06] text-white">
            Most companies build websites.
            <br />
            <span className="bg-gradient-to-r from-white/90 via-white/55 to-white/20 bg-clip-text text-transparent">
              HiveMind builds intelligent businesses.
            </span>
          </h2>
        </motion.div>

        {/* Subheadline */}
        <motion.p
          className="text-center text-white/35 text-base sm:text-lg max-w-2xl mx-auto mb-20 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          HiveMind AI combines intelligent systems, automation, digital infrastructure and
          artificial intelligence to help businesses operate smarter and grow faster.
        </motion.p>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-16">
          {CARDS.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                className={`group relative rounded-2xl border border-white/6 ${card.borderHover} bg-white/[0.02] hover:bg-white/[0.04] p-8 overflow-hidden transition-all duration-500 cursor-default`}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 + i * 0.08 }}
                whileHover={{ y: -6, transition: { type: "spring", stiffness: 350, damping: 22 } }}
              >
                {/* Hover gradient fill */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
                />
                {/* Inner top highlight */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)" }}
                />

                <div className="relative z-10">
                  <div
                    className={`inline-flex items-center justify-center w-11 h-11 rounded-xl border ${card.iconBg} mb-6 transition-transform duration-300 group-hover:scale-110`}
                  >
                    <Icon className={`w-5 h-5 ${card.iconColor}`} />
                  </div>
                  <h3 className="text-white text-[18px] font-semibold tracking-tight mb-3">
                    {card.title}
                  </h3>
                  <p className="text-white/38 text-sm leading-[1.75]">{card.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-wrap justify-center gap-3"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.65 }}
        >
          <button
            onClick={() => scrollToSection("services")}
            className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black text-sm font-semibold hover:bg-white/90 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            Explore AI Systems
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
          </button>
          <button
            onClick={() => scrollToSection("roadmap")}
            className="group inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/15 bg-white/5 text-white text-sm font-semibold hover:bg-white/8 hover:border-white/25 transition-all duration-200 active:scale-[0.98]"
          >
            View Roadmap
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
          </button>
          <button
            onClick={() => scrollToSection("ai-chat")}
            className="group inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/8 text-white/45 text-sm font-medium hover:text-white hover:border-white/20 transition-all duration-200 active:scale-[0.98]"
          >
            Launch HiveMind AI
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
