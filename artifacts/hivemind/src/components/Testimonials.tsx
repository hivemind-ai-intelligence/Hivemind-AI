import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const testimonials = [
  {
    text: "HiveMind completely transformed our digital presence. The website they built for us feels decades ahead of our competitors. It's not just a site; it's an experience.",
    author: "Sarah Jenkins",
    role: "CMO, Nexus Tech",
    rating: 5
  },
  {
    text: "The custom Discord bot they engineered for our community of 50,000 members handles moderation and ticketing flawlessly. Outstanding technical capability.",
    author: "Marcus Chen",
    role: "Founder, CryptoVerse",
    rating: 5
  },
  {
    text: "We needed a bespoke AI customer service system that understood our very specific technical products. HiveMind delivered a solution that reduced support tickets by 40%.",
    author: "Elena Rodriguez",
    role: "Director of Ops, CloudScale",
    rating: 5
  },
  {
    text: "Their automation workflows saved us literally hundreds of hours a month. Data now flows seamlessly between our CRM, billing, and fulfillment systems.",
    author: "David Kim",
    role: "CEO, Elevate E-commerce",
    rating: 5
  },
  {
    text: "The brand identity and landing page they designed helped us secure our Series A funding. Investors specifically mentioned the premium feel of our product.",
    author: "Michael Thompson",
    role: "Founder, FinTech Startup",
    rating: 5
  },
  {
    text: "Working with HiveMind feels like having an elite Silicon Valley engineering team on speed dial. Uncompromising quality and incredible speed of execution.",
    author: "Jessica Walsh",
    role: "VP Product, GlobalTrade",
    rating: 5
  }
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const next = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  }, []);

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setIsAutoPlaying(false);
  };

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(next, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, next]);

  return (
    <section className="py-32 relative overflow-hidden bg-black/50">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-4 metallic-text"
          >
            Client Intelligence
          </motion.h2>
        </div>

        <div className="max-w-4xl mx-auto relative">
          
          <div className="relative h-[300px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="absolute w-full px-12"
              >
                <div className="glass-panel rounded-3xl p-8 md:p-12 border border-white/10 shadow-2xl relative">
                  <Quote className="absolute top-8 left-8 w-12 h-12 text-white/5" />
                  
                  <div className="flex gap-1 mb-6 relative z-10">
                    {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-white text-white" />
                    ))}
                  </div>
                  
                  <p className="text-xl md:text-2xl text-neutral-200 leading-relaxed mb-8 relative z-10 italic">
                    "{testimonials[currentIndex].text}"
                  </p>
                  
                  <div className="flex items-center justify-between relative z-10">
                    <div>
                      <h4 className="font-bold text-white text-lg">{testimonials[currentIndex].author}</h4>
                      <p className="text-sm text-neutral-400">{testimonials[currentIndex].role}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-6 mt-12">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={prev}
              className="rounded-full border-white/20 text-white hover:bg-white/10 hover:text-white glass-panel"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setCurrentIndex(i);
                    setIsAutoPlaying(false);
                  }}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === currentIndex ? "w-8 bg-white" : "w-2 bg-white/20 hover:bg-white/50"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>

            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => {
                next();
                setIsAutoPlaying(false);
              }}
              className="rounded-full border-white/20 text-white hover:bg-white/10 hover:text-white glass-panel"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>

        </div>
      </div>
    </section>
  );
}
