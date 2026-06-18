import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface ServiceData {
  id: string;
  name: string;
  icon: string;
  description: string;
  features: string[];
  price: string;
}

export interface ProjectData {
  id: string;
  name: string;
  description: string;
  status: string;
  features: string[];
  progress: number;
  timeline: string;
  live: boolean;
}

export interface TestimonialData {
  id: string;
  quote: string;
  author: string;
  role: string;
  rating: number;
}

export interface PricingData {
  id: string;
  name: string;
  monthly: number | string;
  annual: number | string;
  features: string[];
  recommended: boolean;
}

export interface AdminData {
  // BRANDING
  brandName: string;
  tagline: string;
  logoDataUrl: string | null;
  faviconDataUrl: string | null;
  heroBannerDataUrl: string | null;

  // HERO
  heroHeadline: string;
  heroSubheadline: string;

  // FOUNDER
  founderName: string;
  founderTitle: string;
  founderTagline: string;
  founderBio: string;
  founderYears: string;
  founderProjects: string;
  founderClients: string;
  founderAvatarUrl: string | null;
  founderEmail: string;
  founderWhatsApp: string;
  founderDiscord: string;
  founderLinkedIn: string;

  // SERVICES
  services: ServiceData[];

  // PROJECTS
  projects: ProjectData[];

  // TESTIMONIALS
  testimonials: TestimonialData[];

  // PRICING
  pricing: PricingData[];

  // CONTACT
  contactEmail: string;
  contactWhatsApp: string;
  contactDiscord: string;
  contactLocation: string;

  // SEO
  seoTitle: string;
  seoDescription: string;
}

const defaultData: AdminData = {
  brandName: "HIVEMIND",
  tagline: "Humans. AI. One Mind.",
  logoDataUrl: null,
  faviconDataUrl: null,
  heroBannerDataUrl: null,

  heroHeadline: "Building The Future Between Humans And AI",
  heroSubheadline: "HiveMind creates websites, AI systems, automation tools and digital infrastructure for the next generation of creators and businesses.",

  founderName: "Alex Carter",
  founderTitle: "Founder and CEO, HiveMind",
  founderTagline: "Bridging the gap between human creativity and artificial intelligence.",
  founderBio: "Building the bridge between humans and artificial intelligence. 5+ years crafting digital experiences for the next generation of creators and businesses.",
  founderYears: "5+",
  founderProjects: "200+",
  founderClients: "50+",
  founderAvatarUrl: null,
  founderEmail: "hello@hivemind.ai",
  founderWhatsApp: "+1-555-HIVEMIND",
  founderDiscord: "HiveMind#0001",
  founderLinkedIn: "https://linkedin.com",

  services: [
    { id: "1", icon: "Globe", name: "Website Development", description: "Custom, high-performance web applications built with modern frameworks.", price: "299", features: ["React / Next.js", "Responsive Design", "SEO Optimized"] },
    { id: "2", icon: "Bot", name: "Discord Bots", description: "Intelligent moderation, utility, and entertainment bots for your server.", price: "99", features: ["Custom Commands", "24/7 Hosting", "API Integrations"] },
    { id: "3", icon: "Cpu", name: "AI Systems", description: "Bespoke artificial intelligence solutions to automate complex tasks.", price: "499", features: ["LLM Integration", "Custom Training", "Data Processing"] },
    { id: "4", icon: "Zap", name: "Automation", description: "Streamline your workflows and connect your favorite tools.", price: "199", features: ["Zapier/Make setup", "Custom scripts", "Error handling"] },
    { id: "5", icon: "PenTool", name: "Branding", description: "Complete visual identity packages for forward-thinking companies.", price: "149", features: ["Color Palette", "Typography", "Brand Guidelines"] },
    { id: "6", icon: "ImageIcon", name: "Logo Design", description: "Memorable, scalable, and impactful logo marks.", price: "79", features: ["Vector Files", "Multiple Formats", "Revisions included"] },
    { id: "7", icon: "Webhook", name: "Webhooks", description: "Custom endpoint connections for real-time data transfer.", price: "49", features: ["Secure endpoints", "Payload formatting", "Testing"] },
    { id: "8", icon: "Puzzle", name: "API Integrations", description: "Connect third-party services seamlessly into your product.", price: "149", features: ["REST/GraphQL", "Auth handling", "Rate limiting"] },
    { id: "9", icon: "LayoutDashboard", name: "Dashboard Development", description: "Internal tools and analytics panels for your data.", price: "349", features: ["Data Visualization", "User Management", "Export Tools"] },
    { id: "10", icon: "Layout", name: "Portfolio Websites", description: "Showcase your work with stunning, interactive portfolios.", price: "199", features: ["CMS Integration", "Animations", "Fast Loading"] },
    { id: "11", icon: "Briefcase", name: "Business Websites", description: "Professional corporate sites that drive conversions.", price: "249", features: ["Lead Generation", "Analytics", "Performance Tracking"] },
    { id: "12", icon: "Rocket", name: "Landing Pages", description: "High-converting single pages for campaigns or products.", price: "149", features: ["A/B Testing Ready", "Copywriting assist", "Analytics"] },
    { id: "13", icon: "MessageSquare", name: "AI Chatbots", description: "Intelligent conversational agents for customer support.", price: "299", features: ["Context Memory", "Widget Integration", "Analytics"] },
    { id: "14", icon: "Wrench", name: "Custom Tools", description: "Bespoke internal software tailored to your specific needs.", price: "199", features: ["Requirements Analysis", "Full Stack", "Maintenance"] },
    { id: "15", icon: "Users", name: "Community Systems", description: "Platforms for engaging and managing your user base.", price: "249", features: ["Forums", "Member Roles", "Moderation Tools"] },
    { id: "16", icon: "Smartphone", name: "Mobile App Development", description: "Native and cross-platform mobile experiences.", price: "599", features: ["iOS/Android", "App Store Publishing", "Push Notifications"] },
    { id: "17", icon: "Cloud", name: "SaaS Development", description: "Scalable software-as-a-service platforms.", price: "999", features: ["Multi-tenant Architecture", "Subscription Billing", "Admin Dashboards"] },
    { id: "18", icon: "Brain", name: "AI Agents", description: "Autonomous AI agents to execute multi-step processes.", price: "399", features: ["Task Planning", "Tool Use", "Memory"] },
    { id: "19", icon: "Mic", name: "AI Voice Assistants", description: "Voice-first interfaces and conversational AI.", price: "449", features: ["Speech-to-Text", "Voice Cloning", "Telephony Integration"] },
    { id: "20", icon: "Server", name: "Cloud Infrastructure", description: "Robust and secure cloud deployments.", price: "299", features: ["AWS/GCP/Azure", "Docker/Kubernetes", "CI/CD Pipelines"] }
  ],

  projects: [
    { id: "1", name: "Nexus AI Platform", description: "A comprehensive generative AI platform for enterprise content creation.", status: "Live", features: ["Multi-model AI", "Enterprise SSO", "Custom Workflows"], progress: 100, timeline: "Jan 2023", live: true },
    { id: "2", name: "Chronos Dashboard", description: "Real-time analytics dashboard processing millions of events per second.", status: "Live", features: ["WebSockets", "Data Visualization", "Export"], progress: 100, timeline: "Mar 2023", live: true },
    { id: "3", name: "Atlas Community", description: "Next-generation community platform with integrated tokenomics.", status: "Live", features: ["Web3 Auth", "Role Management", "Governance"], progress: 100, timeline: "Jun 2023", live: true },
    { id: "4", name: "Nova E-Commerce", description: "Headless e-commerce solution with AI-driven product recommendations.", status: "Live", features: ["Shopify Plus", "Next.js", "AI Suggestions"], progress: 100, timeline: "Sep 2023", live: true },
    { id: "5", name: "Echo Chatbot System", description: "Customer service AI that resolved 85% of queries without human intervention.", status: "Live", features: ["Custom LLM", "Zendesk Integration", "Analytics"], progress: 100, timeline: "Dec 2023", live: true },
    { id: "6", name: "Project Horizon", description: "Revolutionary spatial computing interface for web browsers.", status: "Coming Soon", features: ["WebXR", "Three.js", "Gestural Controls"], progress: 75, timeline: "Q2 2024", live: false },
    { id: "7", name: "Omni Automation", description: "Visual workflow builder for complex cross-platform automations.", status: "Coming Soon", features: ["Drag & Drop", "200+ Integrations", "Logic Nodes"], progress: 60, timeline: "Q3 2024", live: false },
    { id: "8", name: "Aegis Security", description: "AI-powered threat detection and automated response system.", status: "Coming Soon", features: ["Anomaly Detection", "Auto-mitigation", "Compliance"], progress: 40, timeline: "Q4 2024", live: false },
  ],

  testimonials: [
    { id: "1", quote: "HiveMind transformed our entire digital presence. The AI systems they built saved us hundreds of hours.", author: "Sarah Jenkins", role: "CEO, TechFlow", rating: 5 },
    { id: "2", quote: "Absolutely incredible work. The attention to detail and performance of our new dashboard is unmatched.", author: "David Chen", role: "Founder, DataSync", rating: 5 },
    { id: "3", quote: "They don't just build websites; they build complete digital ecosystems. Highly recommended.", author: "Emily Rodriguez", role: "CMO, Elevate Brand", rating: 5 },
    { id: "4", quote: "The AI customer support bot they implemented handles 80% of our queries automatically. A game changer.", author: "Michael Chang", role: "Head of Support, RetailCo", rating: 5 },
  ],

  pricing: [
    { id: "1", name: "Starter", monthly: 49, annual: 490, features: ["Basic Website", "Shared Hosting", "Email Support", "Standard Analytics"], recommended: false },
    { id: "2", name: "Professional", monthly: 149, annual: 1490, features: ["Custom Web App", "Dedicated Hosting", "Priority Support", "Advanced Analytics", "Basic AI Integrations"], recommended: true },
    { id: "3", name: "Business", monthly: 349, annual: 3490, features: ["Enterprise Systems", "Scalable Infrastructure", "24/7 Dedicated Support", "Custom AI Solutions", "SLA Guarantee"], recommended: false },
    { id: "4", name: "Enterprise", monthly: "Custom", annual: "Custom", features: ["Full Digital Transformation", "On-premise Options", "Dedicated Team", "Proprietary AI Models", "Strategic Consulting"], recommended: false }
  ],

  contactEmail: "hello@hivemind.ai",
  contactWhatsApp: "15550000000",
  contactDiscord: "HiveMind#0001",
  contactLocation: "San Francisco, CA",

  seoTitle: "HiveMind | Premium AI Agency & Development",
  seoDescription: "HiveMind creates websites, AI systems, automation tools and digital infrastructure for the next generation of creators and businesses."
};

interface AdminContextType {
  data: AdminData;
  updateData: (newData: Partial<AdminData>) => void;
}

export const AdminDataContext = createContext<AdminContextType | undefined>(undefined);

export function AdminDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AdminData>(() => {
    const saved = localStorage.getItem("hivemind-admin-data");
    if (saved) {
      try {
        return { ...defaultData, ...JSON.parse(saved) };
      } catch (e) {
        console.error("Error parsing admin data", e);
      }
    }
    return defaultData;
  });

  useEffect(() => {
    localStorage.setItem("hivemind-admin-data", JSON.stringify(data));
  }, [data]);

  const updateData = (newData: Partial<AdminData>) => {
    setData((prev) => ({ ...prev, ...newData }));
  };

  return (
    <AdminDataContext.Provider value={{ data, updateData }}>
      {children}
    </AdminDataContext.Provider>
  );
}
