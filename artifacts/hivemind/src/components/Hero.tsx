import { useRef, useEffect, useState } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAdminData } from "@/hooks/useAdminData";
import BlackHoleCanvas from "./BlackHoleCanvas";
import { useCountUp } from "@/hooks/useCountUp";
import { useMagneticEffect } from "@/hooks/useMagneticEffect";

export default function Hero() {
  const { data } = useAdminData();
  const countersRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  const projectsCount = useCountUp(parseInt(data.founderProjects) || 200, 2000, countersRef);
  const systemsCount = useCountUp(80, 2000, countersRef);
  const clientsCount = useCountUp(parseInt(data.founderClients) || 50, 2000, countersRef);
  const uptimeCount = useCountUp(99, 2000, countersRef);

  const btn1Ref = useMagneticEffect(0.2);
  const btn2Ref = useMagneticEffect(0.2);

  useEffect(() => {
    if ('ontouchstart' in window) return;
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section ref={heroRef} className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden bg-background" id="home">
      <div 
        className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(168,178,196,0.08), transparent 70%)`,
        }}
      />
      <BlackHoleCanvas />
      
      <div className="container relative z-10 mx-auto px-4 flex flex-col items-center justify-center text-center">
        
        {/* Pulse Indicator */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]"></span>
          </span>
          <span className="text-xs font-medium tracking-wide uppercase text-foreground">Live AI Pulse</span>
        </motion.div>

        {/* Headlines */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight max-w-5xl leading-[1.1] mb-6"
        >
          {data.heroHeadline.split(' ').map((word, i) => (
            <span key={i} className={word.includes("AI") || word.includes("Humans") ? "metallic-text" : "text-foreground"}>
              {word}{" "}
            </span>
          ))}
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-12 leading-relaxed"
        >
          {data.heroSubheadline}
        </motion.p>

        {/* CTAs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 mb-24"
        >
          <a href="#contact" ref={btn1Ref as any} className="block">
            <Button size="lg" className="rounded-full h-14 px-8 bg-foreground text-background hover:bg-foreground/90 text-base font-medium shadow-[0_0_30px_rgba(0,0,0,0.1)] dark:shadow-[0_0_30px_rgba(255,255,255,0.2)]">
              Start Project
            </Button>
          </a>
          <a href="#services" ref={btn2Ref as any} className="block">
            <Button size="lg" variant="outline" className="rounded-full h-14 px-8 glass-panel text-foreground hover:bg-foreground/5 text-base font-medium">
              Explore {data.brandName || "Hivemind AI"}
            </Button>
          </a>
        </motion.div>

        {/* Counters */}
        <motion.div 
          ref={countersRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 max-w-4xl mx-auto w-full border-t border-border pt-12"
        >
          <div className="flex flex-col items-center">
            <span className="text-4xl md:text-5xl font-bold metallic-text mb-2">{projectsCount}+</span>
            <span className="text-sm text-muted-foreground uppercase tracking-wider">Projects</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-4xl md:text-5xl font-bold metallic-text mb-2">{systemsCount}+</span>
            <span className="text-sm text-muted-foreground uppercase tracking-wider">AI Systems</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-4xl md:text-5xl font-bold metallic-text mb-2">{clientsCount}+</span>
            <span className="text-sm text-muted-foreground uppercase tracking-wider">Clients</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-4xl md:text-5xl font-bold metallic-text mb-2">{uptimeCount}.9%</span>
            <span className="text-sm text-muted-foreground uppercase tracking-wider">Uptime</span>
          </div>
        </motion.div>
        
      </div>
      
      {/* Gradient overlay at bottom to blend with next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none"></div>
    </section>
  );
}