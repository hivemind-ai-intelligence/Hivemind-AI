import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Sparkles, MessageSquare, DollarSign, Target, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdminData } from "@/hooks/useAdminData";

const MODES = [
  { id: "general", label: "General", icon: MessageSquare, welcome: "Hello. I am the Hivemind AI Core. How can I help you build the future today?" },
  { id: "services", label: "Services", icon: Lightbulb, welcome: "I can recommend the perfect service package. Tell me what you're trying to build." },
  { id: "pricing", label: "Pricing", icon: DollarSign, welcome: "Let's find the right tier for your budget. What features are most important to you?" },
  { id: "lead", label: "Connect", icon: Target, welcome: "Ready to start? Please share your name and email, and I'll connect you with the team." },
];

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
}

export default function AIChat() {
  const { data } = useAdminData();
  const [activeMode, setActiveMode] = useState(MODES[0].id);
  const [messages, setMessages] = useState<Record<string, Message[]>>({
    [MODES[0].id]: [{ id: "1", role: "ai", content: MODES[0].welcome }],
    [MODES[1].id]: [{ id: "1", role: "ai", content: MODES[1].welcome }],
    [MODES[2].id]: [{ id: "1", role: "ai", content: MODES[2].welcome }],
    [MODES[3].id]: [{ id: "1", role: "ai", content: MODES[3].welcome }],
  });

  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentMessages = messages[activeMode] || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentMessages, isTyping]);

  const generateResponse = (input: string, mode: string): string => {
    const lower = input.toLowerCase();

    if (mode === "lead") {
      if (lower.includes("@") || lower.includes(".com")) {
        try {
          const existing = JSON.parse(localStorage.getItem("hivemind-leads") || "[]");
          localStorage.setItem("hivemind-leads", JSON.stringify([...existing, { contact: input, timestamp: new Date().toISOString() }]));
        } catch (_) {}
        return `Thank you! I've logged your contact info. The ${data.brandName} team will be in touch shortly.`;
      }
      return "Please provide your email address so we can reach out to you.";
    }

    if (mode === "pricing") {
      const numericTiers = data.pricing.filter(t => typeof t.monthly === "number") as Array<{ name: string; monthly: number; features: string[] }>;
      if (numericTiers.length > 0) {
        const cheapest = numericTiers.reduce((a, b) => a.monthly < b.monthly ? a : b);
        const popular = data.pricing.find(t => t.recommended) || numericTiers[Math.floor(numericTiers.length / 2)];
        if (lower.includes("cheap") || lower.includes("budget") || lower.includes("start") || lower.includes("small")) {
          return `Our ${cheapest.name} plan at $${cheapest.monthly}/mo is perfect for getting started. It includes: ${cheapest.features.slice(0, 3).join(", ")}.`;
        }
        if (lower.includes("enterprise") || lower.includes("large") || lower.includes("team")) {
          const enterprise = data.pricing.find(t => typeof t.monthly === "string") || data.pricing[data.pricing.length - 1];
          return `Our ${enterprise.name} plan offers custom pricing and includes: ${enterprise.features.slice(0, 3).join(", ")}. Contact us for a tailored quote.`;
        }
        const tierList = numericTiers.map(t => `${t.name} ($${t.monthly}/mo)`).join(", ");
        return `We offer: ${tierList}${data.pricing.find(t => typeof t.monthly === "string") ? `, plus Enterprise (Custom)` : ""}. Our most popular is ${typeof popular === "object" && "name" in popular ? popular.name : "Professional"}. Which sounds right for you?`;
      }
      return "Check our Pricing section below for full tier details and feature breakdowns.";
    }

    if (mode === "services") {
      const serviceNames = data.services.map(s => s.name);
      if (lower.includes("web") || lower.includes("site") || lower.includes("website")) {
        const webService = data.services.find(s => s.name.toLowerCase().includes("web"));
        return webService
          ? `We build high-performance websites starting at $${webService.price}. Key features: ${webService.features.join(", ")}. What type of site do you need?`
          : "We build custom websites. Tell me more about your project.";
      }
      if (lower.includes("bot") || lower.includes("discord")) {
        const botService = data.services.find(s => s.name.toLowerCase().includes("discord"));
        return botService
          ? `Our Discord bots start at $${botService.price}. Features include: ${botService.features.join(", ")}. Tell me about your server.`
          : "We build custom Discord bots. What functionality do you need?";
      }
      if (lower.includes("ai") || lower.includes("intelligent") || lower.includes("machine")) {
        const aiService = data.services.find(s => s.name.toLowerCase().includes("ai system"));
        return aiService
          ? `Our AI Systems start at $${aiService.price}. We handle: ${aiService.features.join(", ")}. What problem are you solving?`
          : "We build custom AI systems. Tell me about your use case.";
      }
      const sample = serviceNames.slice(0, 5).join(", ");
      return `We offer ${data.services.length} services including: ${sample}, and more. Which area interests you most?`;
    }

    // General mode
    if (lower.includes("service") || lower.includes("offer") || lower.includes("build")) {
      return `${data.brandName} offers ${data.services.length} services — from websites and AI systems to automation and Discord bots. Try the 'Services' tab for recommendations!`;
    }
    if (lower.includes("price") || lower.includes("cost") || lower.includes("how much")) {
      return "Switch to the 'Pricing' tab for detailed tier guidance, or scroll to the Pricing section on this page.";
    }
    if (lower.includes("contact") || lower.includes("hire") || lower.includes("start")) {
      return `Ready to work with ${data.brandName}? Switch to the 'Connect' tab to leave your details, or use the 'Start a Project' form below.`;
    }
    if (lower.includes("who") || lower.includes("about") || lower.includes("company")) {
      return `${data.brandName} is an elite AI agency that builds websites, AI systems, automations, and digital infrastructure. Founded by ${data.founderName}, we've completed ${data.founderProjects} projects for ${data.founderClients} clients.`;
    }

    return "Fascinating. Tell me more, or switch modes above for specific guidance on services, pricing, or getting started.";
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: inputValue.trim() };
    setMessages(prev => ({ ...prev, [activeMode]: [...(prev[activeMode] || []), userMsg] }));
    setInputValue("");
    setIsTyping(true);
    setTimeout(() => {
      const aiResponse = generateResponse(userMsg.content, activeMode);
      const aiMsg: Message = { id: (Date.now() + 1).toString(), role: "ai", content: aiResponse };
      setMessages(prev => ({ ...prev, [activeMode]: [...(prev[activeMode] || []), aiMsg] }));
      setIsTyping(false);
    }, 800);
  };

  const clearChat = () => {
    setMessages(prev => ({
      ...prev,
      [activeMode]: [{ id: Date.now().toString(), role: "ai", content: MODES.find(m => m.id === activeMode)?.welcome || "" }]
    }));
  };

  return (
    <section className="py-32 relative bg-card/30" id="ai-chat">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 metallic-text">AI Co-Founder</h2>
          <p className="text-muted-foreground text-lg">Select a mode and interact with our systems.</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto glass-panel rounded-3xl overflow-hidden border border-border shadow-xl flex flex-col min-h-[600px] bg-background"
        >
          {/* Header & Tabs */}
          <div className="p-4 border-b border-border bg-card">
            <div className="flex items-center gap-4 mb-4">
              <div className="relative">
                <div className="absolute inset-0 rounded-full animate-ping bg-primary/20"></div>
                <div className="w-10 h-10 rounded-full bg-foreground border border-background flex items-center justify-center relative z-10 text-background">
                  <span className="text-lg font-bold">⬢</span>
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{data.brandName} AI</h3>
                <p className="text-xs text-green-500 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Online
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={clearChat} className="ml-auto text-xs" data-testid="ai-chat-clear">
                Clear
              </Button>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
              {MODES.map(mode => {
                const Icon = mode.icon;
                const isActive = activeMode === mode.id;
                return (
                  <button
                    key={mode.id}
                    onClick={() => setActiveMode(mode.id)}
                    data-testid={`ai-mode-${mode.id}`}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                      isActive
                        ? "bg-foreground text-background"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    <Icon className="w-3 h-3" /> {mode.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
            <AnimatePresence initial={false}>
              {currentMessages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 max-w-[85%] ${msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"}`}
                >
                  <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center border ${
                    msg.role === "user"
                      ? "bg-foreground text-background border-foreground"
                      : "bg-card border-border text-foreground"
                  }`}>
                    {msg.role === "user" ? (
  <User className="w-4 h-4" />
) : (
  <div className="w-6 h-6 flex items-center justify-center rounded-md border border-slate-400 bg-black text-slate-300 shadow-[0_0_15px_rgba(192,192,192,0.4)]">
    AI
  </div>
)} 
                  </div>
                  <div className={`p-3 text-sm rounded-2xl ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-tr-sm"
                      : "bg-muted text-foreground rounded-tl-sm border border-border"
                  }`}>
                    {msg.content}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3 max-w-[85%] mr-auto"
              >
                <div className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-foreground" />
                </div>
                <div className="p-4 rounded-2xl bg-muted rounded-tl-sm flex items-center gap-1.5 border border-border">
                  <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.4 }} className="w-2 h-2 rounded-full bg-foreground/50" />
                  <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.4, delay: 0.2 }} className="w-2 h-2 rounded-full bg-foreground/50" />
                  <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.4, delay: 0.4 }} className="w-2 h-2 rounded-full bg-foreground/50" />
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-border bg-card mt-auto shrink-0">
            <div className="relative flex items-center">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder={`Chat in ${MODES.find(m => m.id === activeMode)?.label} mode...`}
                data-testid="ai-chat-input"
                className="w-full bg-background border border-border rounded-xl py-3 pl-4 pr-12 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground/30 transition-colors"
              />
              <Button
                size="icon"
                variant="ghost"
                onClick={handleSend}
                disabled={!inputValue.trim() || isTyping}
                data-testid="ai-chat-send"
                className="absolute right-1 text-foreground hover:bg-muted"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
