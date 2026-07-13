import { useAdminData } from "@/hooks/useAdminData";

export default function Marquee() {
  const { data } = useAdminData();
  const items = data.services.length > 0
    ? data.services.map(s => s.name)
    : ["AI Systems", "Automation", "Discord Bots", "Web Development", "API Integrations", "AI Chatbots"];

  return (
    <div className="w-full bg-background border-y border-border py-4 overflow-hidden flex whitespace-nowrap relative">
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none"></div>
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none"></div>

      <div className="flex animate-marquee shrink-0 items-center">
        {items.map((item, i) => (
          <div key={`a-${i}`} className="flex items-center">
            <span className="mx-8 text-sm md:text-base font-bold metallic-text uppercase tracking-widest">{item}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-foreground/30 shrink-0"></span>
          </div>
        ))}
      </div>
      <div className="flex animate-marquee shrink-0 items-center" aria-hidden="true">
        {items.map((item, i) => (
          <div key={`b-${i}`} className="flex items-center">
            <span className="mx-8 text-sm md:text-base font-bold metallic-text uppercase tracking-widest">{item}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-foreground/30 shrink-0"></span>
          </div>
        ))}
      </div>
    </div>
  );
}
