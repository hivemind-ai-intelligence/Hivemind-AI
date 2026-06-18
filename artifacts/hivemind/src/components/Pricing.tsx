import { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdminData } from "@/hooks/useAdminData";
import { Switch } from "@/components/ui/switch";

export default function Pricing() {
  const { data } = useAdminData();
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <section className="py-32 relative bg-background" id="pricing">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-8 metallic-text"
          >
            Simple Pricing
          </motion.h2>
          
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-4"
          >
            <span className={`text-sm font-medium ${!isAnnual ? "text-foreground" : "text-muted-foreground"}`}>Monthly</span>
            <Switch 
              checked={isAnnual} 
              onCheckedChange={setIsAnnual}
            />
            <span className={`text-sm font-medium flex items-center gap-2 ${isAnnual ? "text-foreground" : "text-muted-foreground"}`}>
              Annual <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full border border-primary/20">Save 20%</span>
            </span>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {data.pricing.map((tier, i) => {
            const price = isAnnual
              ? (typeof tier.monthly === 'number' ? Math.round(tier.monthly * 0.8) : tier.monthly)
              : tier.monthly;
            
            return (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative rounded-3xl p-8 flex flex-col h-full min-w-0 overflow-hidden ${
                  tier.recommended 
                    ? "bg-card border-2 border-primary shadow-xl" 
                    : "glass-panel border-border"
                }`}
              >
                {tier.recommended && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase">
                    Recommended
                  </div>
                )}
                
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-foreground mb-2">{tier.name}</h3>
                </div>
                
                <div className="mb-8">
                  <div className="flex items-baseline gap-1">
                    {typeof price === 'number' && <span className="text-2xl text-muted-foreground font-bold">$</span>}
                    <span className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight">{typeof price === 'number' ? Math.round(price) : price}</span>
                    {typeof price === 'number' && <span className="text-muted-foreground ml-1">/mo</span>}
                  </div>
                </div>
                
                <div className="flex-grow space-y-4 mb-8">
                  {tier.features.map(feature => (
                    <div key={feature} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary shrink-0" />
                      <span className="text-sm text-foreground/80">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <Button
  variant={tier.recommended ? "default" : "outline"}
  className="w-full rounded-xl py-6 font-semibold transition-all duration-300 active:scale-95 active:opacity-80 hover:scale-105 hover:shadow-2xl"
  onClick={() => {
    const contactSection = document.getElementById("contact");
    contactSection?.scrollIntoView({
      behavior: "smooth"
    });
  }}
>
  {typeof price === "string" ? "Contact Us" : "Get Started"}
</Button>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  );
}