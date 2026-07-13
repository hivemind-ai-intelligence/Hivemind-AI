import { useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, MessageSquare, Twitter, Linkedin, Briefcase, Award, Users, ChevronDown, ChevronUp } from "lucide-react";
import { useAdminData } from "@/hooks/useAdminData";
import { useMagneticEffect } from "@/hooks/useMagneticEffect";

export default function Owner() {
  const { data } = useAdminData();
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [expanded, setExpanded] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;
    setRotate({ x: rotateX, y: rotateY });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setRotate({ x: 0, y: 0 });
  }, []);

  return (
    <section className="py-32 relative overflow-hidden" id="about">
      {/* Background Particles via pseudo-elements */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0.2, y: Math.random() * 100 }}
            animate={{ opacity: [0.2, 0.5, 0.2], y: [0, -100, 0] }}
            transition={{ duration: 5 + Math.random() * 5, repeat: Infinity, ease: "linear" }}
            className="absolute rounded-full bg-foreground/20"
            style={{
              width: Math.random() * 4 + 1 + "px",
              height: Math.random() * 4 + 1 + "px",
              left: Math.random() * 100 + "%",
              top: Math.random() * 100 + "%"
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 flex justify-center z-10 relative">
        <motion.div 
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          animate={{ rotateX: rotate.x, rotateY: rotate.y }}

whileHover={{
  scale: 1.02,
  y: -8,
}}
          whileTap={{ scale: 0.98 }}
          
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-5xl w-full perspective-1000"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Layered Glass Panels */}
          <div className="relative w-full rounded-3xl overflow-hidden glass-panel border border-border p-8 md:p-12 shadow-[0_25px_80px_rgba(0,0,0,0.45)] bg-card/80 backdrop-blur-xl group">
            
            {/* Animated Border */}
            <div className="absolute inset-0 rounded-3xl pointer-events-none p-[3px] bg-gradient-to-r from-foreground/10 via-foreground/30 to-foreground/10 animate-[bg-spin_8s_linear_infinite] [mask-image:linear-gradient(black,black)] [mask-composite:exclude]" />

            <div className="grid md:grid-cols-[1fr_2fr] gap-12 items-start relative z-10" style={{ transform: "translateZ(20px)" }}>
              
              {/* LEFT SIDE: Avatar */}
              <div className="flex flex-col items-center">
                <div className="relative mb-6">
                  {/* Orbiting particles */}
                  <div className="absolute inset-[-20px] rounded-full animate-orbit pointer-events-none">
                    <div className="w-2 h-2 bg-foreground rounded-full shadow-[0_0_10px_currentColor]"></div>
                  </div>
                  
                  {/* Metallic Gradient Ring */}
                  <div className="absolute inset-[-4px] rounded-full bg-gradient-to-br from-foreground via-background to-muted-foreground p-[2px] animate-spin-slow">
                    <div className="w-full h-full rounded-full bg-card"></div>
                  </div>

                  {data.founderAvatarUrl ? (
                    <img 
                      src={data.founderAvatarUrl} 
                      alt={data.founderName} 
                      className="w-40 h-40 md:w-48 md:h-48 rounded-full object-cover relative z-10 border-4 border-background shadow-xl"
                    />
                  ) : (
                    <div className="w-40 h-40 md:w-48 md:h-48 rounded-full bg-foreground flex items-center justify-center relative z-10 border-4 border-background shadow-xl">
                      <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M32 2L6 17V47L32 62L58 47V17L32 2Z" stroke="currentColor" strokeWidth="2" fill="none" className="text-background" />
                        <path d="M22 26V38M42 26V38M22 32H42" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-background" />
                      </svg>
                    </div>
                  )}
                </div>

<div className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs mb-3">
  ● Founder Verified
</div>

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs mb-3">
  ✓ Hivemind AI
</div>
                
                <h3 className="text-3xl font-bold text-foreground text-center">{data.founderName}</h3>
                <p className="text-sm text-muted-foreground font-medium text-center mt-1">
  {data.founderTitle}
</p>
              </div>
              
              {/* RIGHT SIDE: Content */}
              <div className="flex flex-col h-full">
                <h2 className="text-lg md:text-xl font-serif italic text-foreground/90 mb-4 leading-relaxed">
                  "{data.founderTagline}"
                </h2>
                
                <div className="text-base text-muted-foreground leading-relaxed mb-8">
                  <p>{data.founderBio}</p>
                  
                  <AnimatePresence>
                    {expanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <p className="mt-4 pt-4 border-t border-border">
                          Passionate about the intersection of human creativity and machine intelligence, I founded {data.brandName} to give every creator and business access to world-class AI infrastructure. Every system we build is crafted with the precision of an engineer and the vision of a strategist.
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  <button 
                    onClick={() => setExpanded(!expanded)}
                    className="flex items-center gap-1 text-sm font-medium text-foreground mt-4 hover:underline"
                    data-testid="founder-story-toggle"
                  >
                    {expanded ? "Read less" : "Founder Story"}
                    {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
                
                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-4 py-6 border-y border-border mb-8">
                  <div className="flex flex-col items-center text-center">
                    <span className="text-2xl font-bold text-foreground">{data.founderYears}</span>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">Years</span>
                  </div>
                  <div className="flex flex-col items-center text-center border-x border-border">
                    <span className="text-2xl font-bold text-foreground">{data.founderProjects}</span>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">Projects</span>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <span className="text-2xl font-bold text-foreground">{data.founderClients}</span>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">Clients</span>
                  </div>
                </div>
                
                {/* Social Row */}
                <div className="flex gap-4 justify-start mt-auto">
                  {data.founderEmail && <SocialBtn icon={Mail} href={`mailto:${data.founderEmail}`} />}
                  {data.founderWhatsApp && <SocialBtn icon={MessageSquare} href={`https://wa.me/${data.founderWhatsApp.replace(/\D/g,'')}`} />}
                  {data.founderDiscord && <SocialBtn icon={Users} href={`https://discord.com/users/${data.founderDiscord}`} />}
                  {data.founderLinkedIn && <SocialBtn icon={Linkedin} href={data.founderLinkedIn} />}
                </div>
              </div>
              
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function SocialBtn({ icon: Icon, href }: { icon: any, href: string }) {
  const ref = useMagneticEffect(0.3);
  
  return (
    <a 
      href={href}
      ref={ref as any}
      target="_blank"
      rel="noopener noreferrer"
      className="w-12 h-12 rounded-full bg-card border border-border shadow-sm flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-all duration-300 hover:-translate-y-1"
    >
      <Icon className="w-5 h-5" />
    </a>
  );
}