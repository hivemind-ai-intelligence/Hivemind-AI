import { motion } from "framer-motion";
import { Mail, MessageSquare, Twitter, Linkedin, Briefcase, Award, Users } from "lucide-react";
import { useAdminData } from "@/context/AdminDataContext";
import { useMagneticEffect } from "@/hooks/useMagneticEffect";

export default function Owner() {
  const { data } = useAdminData();
  
  return (
    <section className="py-32 relative" id="about">
      <div className="container mx-auto px-4 flex justify-center">
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl w-full glass-panel rounded-3xl p-8 md:p-12 border border-white/10 relative overflow-hidden"
        >
          {/* Background Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
          
          <div className="grid md:grid-cols-[1fr_2fr] gap-12 items-center relative z-10">
            
            {/* Avatar Side */}
            <div className="flex flex-col items-center">
              <div className="relative mb-6 group">
                <div className="absolute inset-[-4px] rounded-full bg-gradient-to-b from-white/40 via-white/10 to-transparent p-[1px] -rotate-45 group-hover:rotate-0 transition-transform duration-1000">
                  <div className="w-full h-full rounded-full bg-black"></div>
                </div>
                <img 
                  src="/avatar.png" 
                  alt={data.owner.name} 
                  className="w-48 h-48 md:w-56 md:h-56 rounded-full object-cover relative z-10 border-4 border-black"
                />
              </div>
              
              <div className="flex gap-4">
                <SocialBtn icon={Mail} href={`mailto:${data.contact.email}`} />
                <SocialBtn icon={MessageSquare} href={`https://discord.com/users/${data.contact.discord}`} />
                <SocialBtn icon={Twitter} href="#" />
                <SocialBtn icon={Linkedin} href="#" />
              </div>
            </div>
            
            {/* Content Side */}
            <div>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-2">{data.owner.name}</h2>
              <p className="text-neutral-400 font-medium tracking-wide mb-6 uppercase text-sm">{data.owner.title}</p>
              
              <p className="text-lg text-neutral-300 leading-relaxed mb-8">
                {data.owner.bio}
              </p>
              
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-white/10">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 text-white mb-1">
                    <Briefcase className="w-4 h-4 text-neutral-400" />
                    <span className="font-bold text-xl">5+</span>
                  </div>
                  <span className="text-xs text-neutral-500 uppercase">Years Exp</span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 text-white mb-1">
                    <Award className="w-4 h-4 text-neutral-400" />
                    <span className="font-bold text-xl">200+</span>
                  </div>
                  <span className="text-xs text-neutral-500 uppercase">Projects</span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 text-white mb-1">
                    <Users className="w-4 h-4 text-neutral-400" />
                    <span className="font-bold text-xl">50+</span>
                  </div>
                  <span className="text-xs text-neutral-500 uppercase">Clients</span>
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
      className="w-10 h-10 rounded-full glass-panel border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
    >
      <Icon className="w-4 h-4" />
    </a>
  );
}
