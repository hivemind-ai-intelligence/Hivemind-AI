import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdminData } from "@/hooks/useAdminData";

export default function Testimonials() {
  const { data } = useAdminData();
  const testimonials = data.testimonials;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const next = useCallback(() => {
    if (testimonials.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  }, [testimonials.length]);

  const prev = () => {
    if (testimonials.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setIsAutoPlaying(false);
  };

  useEffect(() => {
    if (!isAutoPlaying || testimonials.length <= 1) return;
    const interval = setInterval(next, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, next, testimonials.length]);

  if (testimonials.length === 0) return null;

  return (
    <section className="py-32 relative overflow-hidden bg-card/50">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      
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
                className="absolute w-full px-4 md:px-12"
              >
                <div className="glass-panel rounded-3xl p-8 md:p-12 border border-border shadow-2xl relative bg-background/80 text-center md:text-left">
                  <Quote className="absolute top-8 left-8 w-12 h-12 text-foreground/5 hidden md:block" />
                  
                  <div className="flex gap-1 mb-6 relative z-10 justify-center md:justify-start">
                    {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                    ))}
                  </div>
                  
                  <p className="text-xl md:text-2xl text-foreground leading-relaxed mb-8 relative z-10 italic">
                    "{testimonials[currentIndex].quote}"
                  </p>
                  
                  <div className="relative z-10">
                    <h4 className="font-bold text-foreground text-lg">{testimonials[currentIndex].author}</h4>
                    <p className="text-sm text-muted-foreground">{testimonials[currentIndex].role}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          {testimonials.length > 1 && (
            <div className="flex items-center justify-center gap-6 mt-12">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={prev}
                className="rounded-full border-border text-foreground hover:bg-muted glass-panel"
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
                      i === currentIndex ? "w-8 bg-foreground" : "w-2 bg-foreground/20 hover:bg-foreground/50"
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
                className="rounded-full border-border text-foreground hover:bg-muted glass-panel"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}