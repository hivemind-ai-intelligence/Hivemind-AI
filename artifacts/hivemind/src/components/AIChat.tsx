import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Sparkles, MessageSquare, DollarSign, Target, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";

const MODES = [
  { id: "general", label: "General", icon: MessageSquare, welcome: "Hello. I am the AI Core. How can I help you build the future today?" },
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

  const generateResponse = (input: string, mode: string) => {
    const lower = input.toLowerCase();
    
    if (mode === "lead") {
      if (lower.includes("@") || lower.includes(".com")) {
        localStorage.setItem("hivemind-leads", JSON.stringify([...JSON.parse(localStorage.getItem("hivemind-leads") || "[]"), input]));
        return "Thank you! I've logged your contact info. The team will be in touch shortly.";
      }
      return "Please provide your email address so we can reach out.";
    }

    if (mode === "pricing") {
      if (lower.includes("cheap") || lower.includes("budget") || lower.includes("low")) {
        return "Our Starter tier at $49/mo is perfect for tight budgets. It includes a basic website and standard analytics.";
      }
      return "We have Starter ($49/mo), Pro ($149/mo), and Business ($349/mo) tiers. Pro is our most popular. Which sounds right for you?";
    }

    if (mode === "services") {
      if (lower.includes("web") || lower.includes("site")) {
        return "We build high-performance Next.js and React websites. They start at $299. Would you like a portfolio, business site, or web app?";
      }
      if (lower.includes("bot") || lower.includes("discord")) {
        return "Our custom Discord bots handle moderation, leveling, and utilities. They start at $99. Tell me about your server.";
      }
      return "We offer Web Development, AI Systems, Automation, and Discord Bots. What's your biggest pain point right now?";
    }

    // General
    if (lower.includes("service") || lower.includes("offer")) return "We build websites, AI systems, and automations. Try the 'Services' tab!";
    if (lower.includes("price") || lower.includes("cost")) return "Try the 'Pricing' tab for detailed guidance, or check the Pricing section below.";
    
    return "Fascinating. Tell me more, or switch modes above for specific guidance.";
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: inputValue.trim() };
    
    setMessages(prev => ({
      ...prev,
      [activeMode]: [...(prev[activeMode] || []), userMsg]
    }));
    
    setInputValue("");
    setIsTyping(true);

    setTimeout(() => {
      const aiResponse = generateResponse(userMsg.content, activeMode);
      const aiMsg: Message = { id: (Date.now() + 1).toString(), role: "ai", content: aiResponse };
      
      setMessages(prev => ({
        ...prev,
        [activeMode]: [...(prev[activeMode] || []), aiMsg]
      }));
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
                  <Bot className="w-5 h-5" />
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">AI Core</h3>
                <p className="text-xs text-green-500 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Online
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={clearChat} className="ml-auto text-xs">Clear</Button>
            </div>
            
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
              {MODES.map(mode => {
                const Icon = mode.icon;
                const isActive = activeMode === mode.id;
                return (
                  <button
                    key={mode.id}
                    onClick={() => setActiveMode(mode.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                      isActive 
                        ? "bg-foreground text-background" 
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    <Icon className="w-3 h-3" /> {mode.label}
                  </button>
                )
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
                    {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
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
                placeholder={`Chat in ${MODES.find(m=>m.id===activeMode)?.label} mode...`}
                className="w-full bg-background border border-border rounded-xl py-3 pl-4 pr-12 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground/30 transition-colors"
              />
              <Button 
                size="icon"
                variant="ghost"
                onClick={handleSend}
                disabled={!inputValue.trim() || isTyping}
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