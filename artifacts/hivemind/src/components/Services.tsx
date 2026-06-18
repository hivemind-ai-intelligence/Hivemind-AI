import React, { useRef, useState, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import { 
  Globe, Bot, Cpu, Zap, PenTool, Image as ImageIcon, Webhook, 
  Puzzle, LayoutDashboard, Layout, Briefcase, Rocket, MessageSquare, 
  Wrench, Users, ArrowRight, Smartphone, Cloud, Brain, Mic, Server
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdminData } from "@/hooks/useAdminData";

const iconMap: Record<string, React.ElementType> = {
  Globe, Bot, Cpu, Zap, PenTool, ImageIcon, Webhook,
  Puzzle, LayoutDashboard, Layout, Briefcase, Rocket, MessageSquare,
  Wrench, Users, Smartphone, Cloud, Brain, Mic, Server
};

const ServiceCard = React.memo(({ service, index }: { service: any, index: number }) => {
  const Icon = iconMap[service.icon] || Globe;
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (window.innerWidth < 768) return;
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;
    
    setRotate({ x: rotateX, y: rotateY });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setRotate({ x: 0, y: 0 });
  }, []);

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
      }}
      className="perspective-1000"
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        animate={{
          rotateX: rotate.x,
          rotateY: rotate.y,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="group relative glass-panel rounded-2xl p-6 border border-border hover:border-foreground/20 transition-all duration-500 flex flex-col h-full overflow-hidden transform-gpu"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-foreground/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        
        <div className="w-12 h-12 rounded-xl bg-card border border-border flex items-center justify-center mb-6 text-foreground group-hover:scale-110 transition-transform duration-500 shadow-sm" style={{ transform: "translateZ(30px)" }}>
          <Icon className="w-6 h-6" />
        </div>
        
        <h3 className="text-xl font-bold text-foreground mb-2" style={{ transform: "translateZ(20px)" }}>{service.name}</h3>
        <p className="text-sm text-muted-foreground mb-6 flex-grow" style={{ transform: "translateZ(10px)" }}>{service.description}</p>
        
        <ul className="space-y-2 mb-8" style={{ transform: "translateZ(15px)" }}>
          {service.features.map((feature: string) => (
            <li key={feature} className="text-xs text-foreground/80 flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-foreground/50" />
              {feature}
            </li>
          ))}
        </ul>
        
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-border" style={{ transform: "translateZ(20px)" }}>
          <div className="text-sm">
            <span className="text-muted-foreground">From </span>
            <span className="font-bold text-foreground">${service.price}</span>
          </div>
          <a href="#contact" className="opacity-0 translate-x-[-10px] group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
            <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full hover:bg-foreground/10 text-foreground">
              <ArrowRight className="w-4 h-4" />
            </Button>
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
});

export default function Services() {
  const { data } = useAdminData();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-32 relative" id="services" ref={ref}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: "100%" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 metallic-text">
              What We Build
            </h2>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, width: 0 }}
            animate={isInView ? { opacity: 1, width: "100px" } : { opacity: 0, width: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="h-px bg-gradient-to-r from-transparent via-foreground/50 to-transparent mx-auto mt-6"
          />
        </div>

        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
        >
          {data.services.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}