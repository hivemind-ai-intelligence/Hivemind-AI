import { motion } from "framer-motion";
import { CheckCircle2, Clock, Code2, Database, LayoutTemplate, Workflow } from "lucide-react";

const liveProjects = [
  {
    name: "NovaBot",
    icon: BotIcon,
    desc: "Advanced AI Discord Assistant for community moderation and engagement.",
    features: ["Natural Language Processing", "Automated Moderation", "Analytics Dashboard"],
    timeline: "Completed 2024",
    progress: 100
  },
  {
    name: "OrionPanel",
    icon: LayoutTemplate,
    desc: "Comprehensive server management dashboard with real-time metrics.",
    features: ["Real-time Sockets", "Docker Integration", "Role-based Access"],
    timeline: "Completed 2024",
    progress: 100
  },
  {
    name: "AtlasFlow",
    icon: Workflow,
    desc: "No-code automation platform connecting various SaaS APIs.",
    features: ["Visual Builder", "Webhook Triggers", "Custom Connectors"],
    timeline: "Completed 2023",
    progress: 100
  },
  {
    name: "EchoAI",
    icon: Database,
    desc: "AI-powered community knowledge base and search system.",
    features: ["Vector Search", "Auto-indexing", "Slack/Discord Sync"],
    timeline: "Completed 2023",
    progress: 100
  },
  {
    name: "PulseWeb",
    icon: Code2,
    desc: "High-performance business website platform template.",
    features: ["Next.js App Router", "CMS Integration", "Global Edge Network"],
    timeline: "Completed 2024",
    progress: 100
  }
];

const futureProjects = [
  {
    name: "HiveMind OS",
    icon: Code2,
    desc: "A unified operating system for artificial intelligence agents.",
    features: ["Agent Orchestration", "Memory Management", "Plugin Ecosystem"],
    timeline: "Q3 2024",
    progress: 35
  },
  {
    name: "Neural Nexus",
    icon: Workflow,
    desc: "Decentralized network for human-AI collaboration.",
    features: ["Task Bounties", "Reputation System", "Smart Contracts"],
    timeline: "Q4 2024",
    progress: 20
  },
  {
    name: "HiveMind City",
    icon: LayoutTemplate,
    desc: "Immersive 3D digital ecosystem and platform hub.",
    features: ["WebGL Interface", "Virtual Offices", "Real-time Collaboration"],
    timeline: "2025",
    progress: 10
  }
];

function BotIcon(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinelinejoin="round" {...props}><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
}

export default function Projects() {
  return (
    <section className="py-32 relative" id="projects">
      <div className="container mx-auto px-4">
        <div className="text-center mb-24">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-4 metallic-text"
          >
            Our Work
          </motion.h2>
        </div>

        {/* Live Projects */}
        <div className="mb-24">
          <div className="flex items-center gap-4 mb-10 border-b border-white/10 pb-4">
            <h3 className="text-2xl font-bold text-white">Live Projects</h3>
            <span className="px-3 py-1 text-xs font-medium bg-white/10 text-white rounded-full border border-white/20">
              Deployed
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {liveProjects.map((project, i) => (
              <ProjectCard key={project.name} project={project} delay={i * 0.1} />
            ))}
          </div>
        </div>

        {/* In Development */}
        <div>
          <div className="flex items-center gap-4 mb-10 border-b border-white/10 pb-4">
            <h3 className="text-2xl font-bold text-white">In Development</h3>
            <span className="px-3 py-1 text-xs font-medium bg-green-500/10 text-green-400 rounded-full border border-green-500/20 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Building
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {futureProjects.map((project, i) => (
              <ProjectCard key={project.name} project={project} delay={i * 0.1} />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

function ProjectCard({ project, delay }: { project: any, delay: number }) {
  const Icon = project.icon;
  const isLive = project.progress === 100;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className="glass-panel rounded-2xl p-6 border border-white/5 hover:border-white/20 transition-colors flex flex-col h-full"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-white/10 flex items-center justify-center text-white">
          <Icon className="w-5 h-5" />
        </div>
        {isLive ? (
          <CheckCircle2 className="w-5 h-5 text-neutral-400" />
        ) : (
          <Clock className="w-5 h-5 text-neutral-500" />
        )}
      </div>
      
      <h4 className="text-xl font-bold text-white mb-2">{project.name}</h4>
      <p className="text-sm text-neutral-400 mb-6 flex-grow">{project.desc}</p>
      
      <div className="space-y-2 mb-6">
        {project.features.map((feature: string) => (
          <div key={feature} className="text-xs text-neutral-300 flex items-center gap-2">
            <div className="w-1 h-1 bg-white/30 rounded-full" />
            {feature}
          </div>
        ))}
      </div>

      <div className="mt-auto">
        <div className="flex justify-between text-xs mb-2">
          <span className="text-neutral-500">{project.timeline}</span>
          <span className="text-white font-medium">{project.progress}%</span>
        </div>
        <div className="h-1.5 w-full bg-neutral-900 rounded-full overflow-hidden border border-white/5">
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: `${project.progress}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: "easeOut", delay: delay + 0.2 }}
            className={`h-full rounded-full ${isLive ? 'bg-white' : 'bg-gradient-to-r from-neutral-600 to-white'}`}
          />
        </div>
      </div>
    </motion.div>
  );
}
