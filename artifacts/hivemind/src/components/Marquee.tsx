import { motion } from "framer-motion";

const items = [
  "AI Systems",
  "Automation",
  "Discord Bots",
  "Web Development",
  "API Integrations",
  "AI Chatbots",
  "Cloud Infrastructure",
  "SaaS Solutions"
];

export default function Marquee() {
  return (
    <div className="w-full bg-background border-y border-border py-4 overflow-hidden flex whitespace-nowrap relative">
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent z-10"></div>
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent z-10"></div>
      
      <div className="flex animate-marquee shrink-0 items-center">
        {items.map((item, i) => (
          <div key={i} className="flex items-center">
            <span className="mx-8 text-xl font-bold metallic-text uppercase tracking-widest">{item}</span>
            <span className="w-2 h-2 rounded-full bg-foreground/30"></span>
          </div>
        ))}
      </div>
      <div className="flex animate-marquee shrink-0 items-center" aria-hidden="true">
        {items.map((item, i) => (
          <div key={i} className="flex items-center">
            <span className="mx-8 text-xl font-bold metallic-text uppercase tracking-widest">{item}</span>
            <span className="w-2 h-2 rounded-full bg-foreground/30"></span>
          </div>
        ))}
      </div>
    </div>
  );
}