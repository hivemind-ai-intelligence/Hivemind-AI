import { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdminData } from "@/context/AdminDataContext";
import { Switch } from "@/components/ui/switch";

export default function Pricing() {
  const { data } = useAdminData();
  const [isAnnual, setIsAnnual] = useState(false);

  const tiers = [
    {
      name: "Starter",
      desc: "Perfect for individuals and small setups.",
      price: isAnnual ? Math.floor(data.pricing.starter * 0.8) : data.pricing.starter,
      features: [
        "1 Website Project",
        "Up to 5 Pages",
        "Basic Support",
        "Email Support",
        "Standard Analytics"
      ],
      recommended: false
    },
    {
      name: "Professional",
      desc: "For growing businesses needing automation.",
      price: isAnnual ? Math.floor(data.pricing.professional * 0.8) : data.pricing.professional,
      features: [
        "3 Concurrent Projects",
        "Priority Support",
        "1 AI Chatbot included",
        "1 Discord Bot included",
        "Advanced Analytics",
        "Custom Domain Setup"
      ],
      recommended: true
    },
    {
      name: "Business",
      desc: "Complete digital infrastructure.",
      price: isAnnual ? Math.floor(data.pricing.business * 0.8) : data.pricing.business,
      features: [
        "Unlimited Projects",
        "24/7 Dedicated Support",
        "Custom AI System",
        "Full Automation Workflows",
        "Brand Identity Package",
        "API Access"
      ],
      recommended: false
    },
    {
      name: "Enterprise",
      desc: "White-glove service for large organizations.",
      price: "Custom",
      features: [
        "White-label Solutions",
        "Dedicated Engineering Team",
        "99.99% Uptime SLA",
        "On-premise Deployment options",
        "Custom Infrastructure",
        "Strategic Consulting"
      ],
      recommended: false
    }
  ];

  return (
    <section className="py-32 relative" id="pricing">
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
            <span className={`text-sm font-medium ${!isAnnual ? "text-white" : "text-neutral-500"}`}>Monthly</span>
            <Switch 
              checked={isAnnual} 
              onCheckedChange={setIsAnnual}
              className="data-[state=checked]:bg-white data-[state=unchecked]:bg-neutral-800"
            />
            <span className={`text-sm font-medium flex items-center gap-2 ${isAnnual ? "text-white" : "text-neutral-500"}`}>
              Annual <span className="text-xs bg-white/10 text-white px-2 py-0.5 rounded-full border border-white/20">Save 20%</span>
            </span>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative rounded-3xl p-8 flex flex-col h-full ${
                tier.recommended 
                  ? "bg-gradient-to-b from-neutral-900 to-black border border-white/30 shadow-[0_0_40px_rgba(255,255,255,0.1)]" 
                  : "glass-panel border-white/10"
              }`}
            >
              {tier.recommended && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white text-black px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase">
                  Recommended
                </div>
              )}
              
              <div className="mb-8">
                <h3 className="text-xl font-bold text-white mb-2">{tier.name}</h3>
                <p className="text-sm text-neutral-400 h-10">{tier.desc}</p>
              </div>
              
              <div className="mb-8">
                <div className="flex items-baseline gap-1">
                  {typeof tier.price === 'number' && <span className="text-2xl text-neutral-400 font-bold">$</span>}
                  <span className="text-5xl font-bold text-white tracking-tight">{tier.price}</span>
                  {typeof tier.price === 'number' && <span className="text-neutral-500 ml-1">/mo</span>}
                </div>
              </div>
              
              <div className="flex-grow space-y-4 mb-8">
                {tier.features.map(feature => (
                  <div key={feature} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-white shrink-0" />
                    <span className="text-sm text-neutral-300">{feature}</span>
                  </div>
                ))}
              </div>
              
              <Button 
                className={`w-full rounded-xl py-6 font-semibold ${
                  tier.recommended 
                    ? "bg-white text-black hover:bg-neutral-200" 
                    : "bg-white/5 text-white hover:bg-white/10 border border-white/10"
                }`}
              >
                {tier.name === "Enterprise" ? "Contact Us" : "Get Started"}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
