import { motion } from "framer-motion";
import { 
  Globe, Bot, Cpu, Zap, PenTool, Image as ImageIcon, Webhook, 
  Puzzle, LayoutDashboard, Layout, Briefcase, Rocket, MessageSquare, 
  Wrench, Users, ArrowRight 
} from "lucide-react";
import { Button } from "@/components/ui/button";

const services = [
  { icon: Globe, name: "Website Development", desc: "Custom, high-performance web applications built with modern frameworks.", price: 299, features: ["React / Next.js", "Responsive Design", "SEO Optimized"] },
  { icon: Bot, name: "Discord Bots", desc: "Intelligent moderation, utility, and entertainment bots for your server.", price: 99, features: ["Custom Commands", "24/7 Hosting", "API Integrations"] },
  { icon: Cpu, name: "AI Systems", desc: "Bespoke artificial intelligence solutions to automate complex tasks.", price: 499, features: ["LLM Integration", "Custom Training", "Data Processing"] },
  { icon: Zap, name: "Automation", desc: "Streamline your workflows and connect your favorite tools.", price: 199, features: ["Zapier/Make setup", "Custom scripts", "Error handling"] },
  { icon: PenTool, name: "Branding", desc: "Complete visual identity packages for forward-thinking companies.", price: 149, features: ["Color Palette", "Typography", "Brand Guidelines"] },
  { icon: ImageIcon, name: "Logo Design", desc: "Memorable, scalable, and impactful logo marks.", price: 79, features: ["Vector Files", "Multiple Formats", "Revisions included"] },
  { icon: Webhook, name: "Webhooks", desc: "Custom endpoint connections for real-time data transfer.", price: 49, features: ["Secure endpoints", "Payload formatting", "Testing"] },
  { icon: Puzzle, name: "API Integrations", desc: "Connect third-party services seamlessly into your product.", price: 149, features: ["REST/GraphQL", "Auth handling", "Rate limiting"] },
  { icon: LayoutDashboard, name: "Dashboard Development", desc: "Internal tools and analytics panels for your data.", price: 349, features: ["Data Visualization", "User Management", "Export Tools"] },
  { icon: Layout, name: "Portfolio Websites", desc: "Showcase your work with stunning, interactive portfolios.", price: 199, features: ["CMS Integration", "Animations", "Fast Loading"] },
  { icon: Briefcase, name: "Business Websites", desc: "Professional corporate sites that drive conversions.", price: 249, features: ["Lead Generation", "Analytics", "Performance Tracking"] },
  { icon: Rocket, name: "Landing Pages", desc: "High-converting single pages for campaigns or products.", price: 149, features: ["A/B Testing Ready", "Copywriting assist", "Analytics"] },
  { icon: MessageSquare, name: "AI Chatbots", desc: "Intelligent conversational agents for customer support.", price: 299, features: ["Context Memory", "Widget Integration", "Analytics"] },
  { icon: Wrench, name: "Custom Tools", desc: "Bespoke internal software tailored to your specific needs.", price: 199, features: ["Requirements Analysis", "Full Stack", "Maintenance"] },
  { icon: Users, name: "Community Systems", desc: "Platforms for engaging and managing your user base.", price: 249, features: ["Forums", "Member Roles", "Moderation Tools"] }
];

export default function Services() {
  return (
    <section className="py-32 relative" id="services">
      <div className="container mx-auto px-4">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-4 metallic-text"
          >
            What We Build
          </motion.h2>
          <motion.div 
            initial={{ opacity: 0, width: 0 }}
            whileInView={{ opacity: 1, width: "100px" }}
            viewport={{ once: true }}
            className="h-px bg-gradient-to-r from-transparent via-white/50 to-transparent mx-auto mt-6"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="group relative glass-panel rounded-2xl p-6 border border-white/5 hover:border-white/20 transition-all duration-500 hover:-translate-y-2 flex flex-col h-full overflow-hidden"
              >
                {/* Hover Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                
                <div className="w-12 h-12 rounded-xl bg-neutral-900 border border-white/10 flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform duration-500">
                  <Icon className="w-6 h-6" />
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2">{service.name}</h3>
                <p className="text-sm text-neutral-400 mb-6 flex-grow">{service.desc}</p>
                
                <ul className="space-y-2 mb-8">
                  {service.features.map(feature => (
                    <li key={feature} className="text-xs text-neutral-300 flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-white/50" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/10">
                  <div className="text-sm">
                    <span className="text-neutral-500">From </span>
                    <span className="font-bold text-white">${service.price}</span>
                  </div>
                  <a href="#contact" className="opacity-0 translate-x-[-10px] group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                    <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full hover:bg-white/10 text-white">
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
