import { useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAdminData } from "@/context/AdminDataContext";
import BlackHoleCanvas from "./BlackHoleCanvas";
import { useCountUp } from "@/hooks/useCountUp";
import { useMagneticEffect } from "@/hooks/useMagneticEffect";

export default function Hero() {
  const { data } = useAdminData();
  const countersRef = useRef<HTMLDivElement>(null);
  
  const projectsCount = useCountUp(250, 2000, countersRef);
  const systemsCount = useCountUp(80, 2000, countersRef);
  const clientsCount = useCountUp(120, 2000, countersRef);
  const uptimeCount = useCountUp(99, 2000, countersRef);

  const btn1Ref = useMagneticEffect(0.2);
  const btn2Ref = useMagneticEffect(0.2);

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden" id="home">
      <BlackHoleCanvas />
      
      <div className="container relative z-10 mx-auto px-4 flex flex-col items-center justify-center text-center">
        
        {/* Pulse Indicator */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel mb-8 border border-white/10"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]"></span>
          </span>
          <span className="text-xs font-medium tracking-wide uppercase text-neutral-300">Live AI Pulse</span>
        </motion.div>

        {/* Headlines */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight max-w-5xl leading-[1.1] mb-6"
        >
          {data.hero.headline.split(' ').map((word, i) => (
            <span key={i} className={word === "AI" || word === "Humans" ? "metallic-text" : "text-white"}>
              {word}{" "}
            </span>
          ))}
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-lg md:text-xl text-neutral-400 max-w-2xl mb-12 leading-relaxed"
        >
          {data.hero.subheadline}
        </motion.p>

        {/* CTAs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 mb-24"
        >
          <a href="#contact" ref={btn1Ref as any} className="block">
            <Button size="lg" className="rounded-full h-14 px-8 bg-white text-black hover:bg-neutral-200 text-base font-medium shadow-[0_0_30px_rgba(255,255,255,0.2)]">
              Start Project
            </Button>
          </a>
          <a href="#services" ref={btn2Ref as any} className="block">
            <Button size="lg" variant="outline" className="rounded-full h-14 px-8 glass-panel text-white border-white/20 hover:bg-white/10 text-base font-medium">
              Explore HiveMind
            </Button>
          </a>
        </motion.div>

        {/* Counters */}
        <motion.div 
          ref={countersRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 max-w-4xl mx-auto w-full border-t border-white/10 pt-12"
        >
          <div className="flex flex-col items-center">
            <span className="text-4xl md:text-5xl font-bold metallic-text mb-2">{projectsCount}+</span>
            <span className="text-sm text-neutral-500 uppercase tracking-wider">Projects</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-4xl md:text-5xl font-bold metallic-text mb-2">{systemsCount}+</span>
            <span className="text-sm text-neutral-500 uppercase tracking-wider">AI Systems</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-4xl md:text-5xl font-bold metallic-text mb-2">{clientsCount}+</span>
            <span className="text-sm text-neutral-500 uppercase tracking-wider">Clients</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-4xl md:text-5xl font-bold metallic-text mb-2">{uptimeCount}.9%</span>
            <span className="text-sm text-neutral-500 uppercase tracking-wider">Uptime</span>
          </div>
        </motion.div>
        
      </div>
      
      {/* Gradient overlay at bottom to blend with next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none"></div>
    </section>
  );
}
