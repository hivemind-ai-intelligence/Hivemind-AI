import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe, Bot, Cpu, Zap, PenTool, MessageSquare, Brain, Rocket,
  Sparkles, Code2, Target, BarChart3, ShieldCheck, Star, Clock,
  ChevronDown, ChevronUp, Activity, Users, Lightbulb, CheckCircle2,
  ArrowRight, ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdminData } from "@/hooks/useAdminData";
import BlackHoleCanvas from "@/components/BlackHoleCanvas";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "wouter";

const ICON_MAP: Record<string, React.ElementType> = {
  Globe, Bot, Cpu, Zap, PenTool, MessageSquare, Brain, Rocket,
  Sparkles, Code2, Target, BarChart3, ShieldCheck, Star, Activity,
  Users, Lightbulb, CheckCircle2
};

const LEVEL_COLORS: Record<string, string> = {
  Native: "text-green-400 bg-green-400/10 border-green-400/30",
  Fluent: "text-blue-400 bg-blue-400/10 border-blue-400/30",
  Advanced: "text-purple-400 bg-purple-400/10 border-purple-400/30",
  Intermediate: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30",
  Basic: "text-muted-foreground bg-muted border-border",
};

export default function HivemindAI() {
  const { data } = useAdminData();
  const [expandedStory, setExpandedStory] = useState<string | null>(null);

  const ai = {
    name: data.hivemindAIName,
    tagline: data.hivemindAITagline,
    description: data.hivemindAIDescription,
    status: data.hivemindAIStatus,
    role: data.hivemindAIRole,
    version: data.hivemindAIVersion,
    availability: data.hivemindAIAvailability,
    iconDataUrl: data.hivemindAIIconDataUrl,
    showVerifiedBadge: data.hivemindAIShowVerifiedBadge,
    showCoFounderBadge: data.hivemindAIShowCoFounderBadge,
    customBadge: data.hivemindAICustomBadge,
    primaryBtnText: data.hivemindAIPrimaryBtnText,
    primaryBtnLink: data.hivemindAIPrimaryBtnLink,
    secondaryBtnText: data.hivemindAISecondaryBtnText,
    secondaryBtnLink: data.hivemindAISecondaryBtnLink,
  };

  const storyItems = [
    { key: "origin", label: "Origin", icon: Sparkles, content: data.hivemindAIOrigin },
    { key: "mission", label: "Mission", icon: Target, content: data.hivemindAIMission },
    { key: "vision", label: "Vision", icon: Lightbulb, content: data.hivemindAIVision },
    { key: "growth", label: "Growth Story", icon: BarChart3, content: data.hivemindAIGrowthStory },
  ];

  const showcaseMetrics = [
    { label: "Active Conversations", value: "2,847", change: "+12%" },
    { label: "Language Detection", value: "98.4%", change: "accuracy" },
    { label: "Automation Queue", value: "143", change: "tasks pending" },
    { label: "Knowledge Core", value: "94TB", change: "indexed" },
    { label: "Analytics Processed", value: "1.2M", change: "events/day" },
    { label: "Task Completion", value: "99.1%", change: "success rate" },
  ];

  return (
    <div className="bg-background text-foreground min-h-screen font-sans">
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden" id="ai-hero">
        <BlackHoleCanvas />
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent via-background/20 to-background" />

        <div className="container relative z-10 mx-auto px-4 flex flex-col items-center text-center">
          {/* Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap items-center justify-center gap-2 mb-8"
          >
            {ai.showVerifiedBadge && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-panel border border-blue-400/30 text-xs font-medium text-blue-400">
                <ShieldCheck className="w-3 h-3" /> Verified AI
              </span>
            )}
            {ai.showCoFounderBadge && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-panel border border-amber-400/30 text-xs font-medium text-amber-400">
                <Star className="w-3 h-3" /> Digital Co-Founder
              </span>
            )}
            {ai.customBadge && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-panel border border-border text-xs font-medium text-foreground">
                {ai.customBadge}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-panel border border-green-400/30 text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-green-400">{ai.status}</span>
            </span>
          </motion.div>

          {/* AI Icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="w-24 h-24 rounded-3xl glass-panel border border-border flex items-center justify-center mb-8 shadow-xl"
          >
            {ai.iconDataUrl ? (
              <img src={ai.iconDataUrl} alt={ai.name} className="w-16 h-16 object-contain rounded-2xl" />
            ) : (
              <div className="w-16 h-16 flex items-center justify-center">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                  <path d="M24 4L4 16V32L24 44L44 32V16L24 4Z" stroke="url(#heroGrad)" strokeWidth="2" fill="none" />
                  <path d="M16 20V28M32 20V28M16 24H32" stroke="url(#heroGrad)" strokeWidth="2.5" strokeLinecap="round" />
                  <defs>
                    <linearGradient id="heroGrad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#a8b2c4" />
                      <stop offset="1" stopColor="#e0e8f0" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            )}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight max-w-4xl leading-[1.1] mb-6 metallic-text"
          >
            {ai.name}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-xl md:text-2xl text-muted-foreground font-light mb-4"
          >
            {ai.tagline}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-base text-muted-foreground max-w-2xl mb-12 leading-relaxed"
          >
            {ai.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <a href={ai.primaryBtnLink}>
              <Button size="lg" className="rounded-full h-14 px-8 bg-foreground text-background hover:bg-foreground/90 text-base font-medium">
                {ai.primaryBtnText} <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </a>
            <a href={ai.secondaryBtnLink}>
              <Button size="lg" variant="outline" className="rounded-full h-14 px-8 glass-panel text-foreground text-base font-medium">
                {ai.secondaryBtnText}
              </Button>
            </a>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />
      </section>

      {/* ── IDENTITY CARD ── */}
      <section className="py-20 relative" id="ai-identity">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold metallic-text mb-4">AI Identity</h2>
            <p className="text-muted-foreground">The core parameters that define {ai.name}.</p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto glass-panel rounded-3xl border border-border p-8 md:p-12"
          >
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {[
                { label: "Name", value: ai.name },
                { label: "Role", value: ai.role },
                { label: "Version", value: ai.version },
                { label: "Status", value: ai.status, highlight: true },
                { label: "Availability", value: ai.availability },
                { label: "Languages", value: `${data.hivemindAILanguages.length} Languages` },
              ].map((item) => (
                <div key={item.label} className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-widest">{item.label}</p>
                  <p className={`font-semibold text-lg ${item.highlight ? "text-green-400" : "text-foreground"}`}>
                    {item.value}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-8 border-t border-border flex flex-wrap gap-2">
              {data.hivemindAILanguages.slice(0, 6).map((lang) => (
                <span
                  key={lang.id}
                  className={`px-3 py-1 rounded-full text-xs font-medium border ${LEVEL_COLORS[lang.level] || LEVEL_COLORS.Basic}`}
                >
                  {lang.name} — {lang.level}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── PERSONALITY TRAITS ── */}
      <section className="py-20 bg-card/20 border-y border-border" id="ai-personality">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold metallic-text mb-4">AI Personality</h2>
            <p className="text-muted-foreground">Adaptive traits calibrated for optimal human-AI collaboration.</p>
          </div>

          <div className="max-w-2xl mx-auto space-y-5">
            {data.hivemindAITraits.map((trait, i) => (
              <motion.div
                key={trait.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center gap-4"
              >
                <span className="w-28 text-sm font-medium text-foreground shrink-0">{trait.name}</span>
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${trait.level}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: i * 0.08 + 0.2, ease: "easeOut" }}
                    className="h-full rounded-full bg-gradient-to-r from-foreground/60 to-foreground"
                  />
                </div>
                <span className="w-10 text-sm text-muted-foreground text-right">{trait.level}%</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI FEATURES ── */}
      <section className="py-24" id="ai-features">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold metallic-text mb-4">Core Capabilities</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Every feature engineered to transform how you build and operate.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
            {data.hivemindAIFeatures.map((feature, i) => {
              const Icon = ICON_MAP[feature.icon] || Sparkles;
              return (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="glass-panel rounded-2xl p-6 border border-border hover:border-foreground/20 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-xl bg-foreground/5 flex items-center justify-center mb-4 text-muted-foreground group-hover:text-foreground group-hover:bg-foreground/10 transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── AI STORY ── */}
      <section className="py-24 bg-card/20 border-y border-border" id="ai-story">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold metallic-text mb-4">The Story</h2>
            <p className="text-muted-foreground">The origin, mission, and vision behind {ai.name}.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto">
            {storyItems.map((item, i) => {
              const Icon = item.icon;
              const isExpanded = expandedStory === item.key;
              return (
                <motion.div
                  key={item.key}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-panel rounded-2xl border border-border overflow-hidden"
                >
                  <button
                    className="w-full p-6 text-left flex items-start justify-between gap-4 hover:bg-foreground/3 transition-colors"
                    onClick={() => setExpandedStory(isExpanded ? null : item.key)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-foreground/5 flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <span className="font-semibold text-foreground">{item.label}</span>
                    </div>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0 mt-1" /> : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0 mt-1" />}
                  </button>
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <p className="px-6 pb-6 text-sm text-muted-foreground leading-relaxed">{item.content}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── AI ROADMAP ── */}
      <section className="py-24" id="ai-roadmap">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold metallic-text mb-4">Evolution Roadmap</h2>
            <p className="text-muted-foreground">The journey from inception to global scale.</p>
          </div>

          <div className="max-w-3xl mx-auto relative">
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-border -translate-x-1/2" />

            {data.hivemindAITimeline.map((event, i) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className={`relative flex items-start gap-6 mb-10 ${i % 2 === 0 ? "md:flex-row-reverse" : "md:flex-row"} md:gap-0`}
              >
                {/* Dot */}
                <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-foreground border-2 border-background shadow-lg z-10 top-1" />

                {/* Content */}
                <div className={`pl-16 md:pl-0 ${i % 2 === 0 ? "md:pr-[calc(50%+2rem)] md:text-right" : "md:pl-[calc(50%+2rem)]"} flex-1`}>
                  <div className="glass-panel rounded-2xl p-5 border border-border">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{event.year}</span>
                    <h3 className="font-semibold text-foreground mt-1 mb-2">{event.title}</h3>
                    <p className="text-sm text-muted-foreground">{event.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI SHOWCASE (Neural Core) ── */}
      <section className="py-24 bg-card/20 border-y border-border" id="ai-showcase">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold metallic-text mb-4">Mission Control</h2>
            <p className="text-muted-foreground">Real-time intelligence metrics from the {ai.name} core.</p>
          </div>

          <div className="max-w-5xl mx-auto">
            {/* Neural Core Visual */}
            <div className="glass-panel rounded-3xl border border-border p-8 mb-6 relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
                <div className="w-96 h-96 rounded-full border border-foreground animate-spin-slow" />
                <div className="absolute w-72 h-72 rounded-full border border-foreground animate-[spin_8s_linear_infinite_reverse]" />
                <div className="absolute w-48 h-48 rounded-full border border-foreground animate-spin-slow" />
              </div>

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                  <h3 className="font-semibold text-foreground">Neural Core — Active</h3>
                  <span className="ml-auto text-xs text-muted-foreground font-mono">{ai.version}</span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {showcaseMetrics.map((metric, i) => (
                    <motion.div
                      key={metric.label}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08 }}
                      className="bg-background/50 rounded-2xl p-4 border border-border"
                    >
                      <p className="text-2xl font-bold text-foreground mb-1">{metric.value}</p>
                      <p className="text-xs text-muted-foreground">{metric.label}</p>
                      <p className="text-xs text-green-500 mt-1">{metric.change}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Activity Feed */}
            <div className="glass-panel rounded-3xl border border-border p-6">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-4 h-4 text-green-500" />
                <h3 className="font-semibold text-sm text-foreground">Live Activity Feed</h3>
                <div className="ml-auto flex items-center gap-1.5 text-xs text-green-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  Live
                </div>
              </div>
              <div className="space-y-3">
                {data.hivemindAIActivity.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06 }}
                    className="flex items-start gap-3 py-2 border-b border-border/50 last:border-0"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-foreground/40 mt-2 shrink-0" />
                    <p className="text-sm text-muted-foreground">{item.action}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── LANGUAGES ── */}
      <section className="py-24" id="ai-languages">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold metallic-text mb-4">Language Matrix</h2>
            <p className="text-muted-foreground">{ai.name} communicates natively across the globe.</p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
            {data.hivemindAILanguages.map((lang, i) => (
              <motion.div
                key={lang.id}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium ${LEVEL_COLORS[lang.level] || LEVEL_COLORS.Basic}`}
              >
                <span>{lang.name}</span>
                <span className="text-xs opacity-70">·</span>
                <span className="text-xs opacity-70">{lang.level}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI TEAM ── */}
      <section className="py-24 bg-card/20 border-y border-border" id="ai-team">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold metallic-text mb-4">The AI Team</h2>
            <p className="text-muted-foreground">Specialized intelligence modules that power {ai.name}.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {data.hivemindAITeam.map((member, i) => {
              const Icon = ICON_MAP[member.icon] || Cpu;
              return (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-panel rounded-2xl p-6 border border-border text-center hover:border-foreground/20 transition-colors"
                >
                  <div className="w-12 h-12 rounded-2xl bg-foreground/5 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold text-foreground text-sm mb-1">{member.name}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{member.role}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold metallic-text mb-6">
              Ready to work with {ai.name}?
            </h2>
            <p className="text-muted-foreground mb-8 text-lg">
              Experience the future of AI-powered digital growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/#contact">
                <Button size="lg" className="rounded-full h-14 px-8 bg-foreground text-background hover:bg-foreground/90 text-base font-medium">
                  Start a Project <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link href="/">
                <Button size="lg" variant="outline" className="rounded-full h-14 px-8 glass-panel text-foreground text-base font-medium">
                  <ExternalLink className="mr-2 w-4 h-4" /> View Main Site
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
