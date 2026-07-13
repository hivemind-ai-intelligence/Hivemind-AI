import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { CheckCircle2, Clock, Code2, Database, LayoutTemplate, Workflow, Bot, Brain, Layout, Server, Monitor } from "lucide-react";
import { useAdminData } from "@/hooks/useAdminData";

const iconMap: Record<string, React.ElementType> = {
  Bot, LayoutTemplate, Workflow, Database, Code2, Brain, Layout, Server, Monitor
};

const ProjectCard = React.memo(({ project }: { project: any }) => {
  const Icon = iconMap[project.icon] || Code2;
  const isLive = project.progress === 100 || project.status.toLowerCase() === "live" || project.live;
  
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
      }}
      className="glass-panel rounded-2xl p-6 border border-border hover:border-foreground/20 transition-colors flex flex-col h-full"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center text-foreground shadow-sm">
          <Icon className="w-5 h-5" />
        </div>
        {isLive ? (
          <CheckCircle2 className="w-5 h-5 text-foreground/60" />
        ) : (
          <Clock className="w-5 h-5 text-muted-foreground" />
        )}
      </div>
      
      <h4 className="text-xl font-bold text-foreground mb-2">{project.name}</h4>
      <p className="text-sm text-muted-foreground mb-6 flex-grow">{project.description}</p>
      
      <div className="space-y-2 mb-6">
        {project.features.map((feature: string) => (
          <div key={feature} className="text-xs text-foreground/80 flex items-center gap-2">
            <div className="w-1 h-1 bg-foreground/30 rounded-full" />
            {feature}
          </div>
        ))}
      </div>

      <div className="mt-auto">
        <div className="flex justify-between text-xs mb-2">
          <span className="text-muted-foreground">{project.timeline}</span>
          <span className="text-foreground font-medium">{project.progress}%</span>
        </div>
        <div className="h-1.5 w-full bg-card rounded-full overflow-hidden border border-border">
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: `${project.progress}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
            className={`h-full rounded-full ${isLive ? 'bg-foreground' : 'bg-gradient-to-r from-foreground/50 to-foreground'}`}
          />
        </div>
      </div>
    </motion.div>
  );
});

export default function Projects() {
  const { data } = useAdminData();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const liveProjects = data.projects.filter(p => p.progress === 100 || p.status.toLowerCase() === 'live' || p.live);
  const futureProjects = data.projects.filter(p => p.progress < 100 && p.status.toLowerCase() !== 'live' && !p.live);

  return (
    <section className="py-32 relative" id="projects" ref={ref}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-24 overflow-hidden">
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: "100%" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 metallic-text">
              Our Work
            </h2>
          </motion.div>
        </div>

        {/* Live Projects */}
        {liveProjects.length > 0 && (
          <div className="mb-24">
            <div className="flex items-center gap-4 mb-10 border-b border-border pb-4">
              <h3 className="text-2xl font-bold text-foreground">Live Projects</h3>
              <span className="px-3 py-1 text-xs font-medium bg-foreground/10 text-foreground rounded-full border border-foreground/20">
                Deployed
              </span>
            </div>

            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.1 } }
              }}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-50px" }}
            >
              {liveProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </motion.div>
          </div>
        )}

        {/* In Development */}
        {futureProjects.length > 0 && (
          <div>
            <div className="flex items-center gap-4 mb-10 border-b border-border pb-4">
              <h3 className="text-2xl font-bold text-foreground">In Development</h3>
              <span className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full border border-primary/20 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Building
              </span>
            </div>

            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.1 } }
              }}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-50px" }}
            >
              {futureProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </motion.div>
          </div>
        )}

      </div>
    </section>
  );
}