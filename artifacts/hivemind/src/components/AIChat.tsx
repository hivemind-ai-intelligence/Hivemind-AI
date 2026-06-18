import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const SUGGESTED_PROMPTS = [
  "What services do you offer?",
  "Tell me about HiveMind",
  "Website pricing",
  "AI systems"
];

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
}

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "ai",
      content: "Hello. I am the HiveMind AI, your digital co-founder available 24/7. How can I help you build the future today?"
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const generateResponse = (input: string) => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes("service") || lowerInput.includes("offer") || lowerInput.includes("build")) {
      return "HiveMind builds websites, AI systems, automation tools, Discord bots, and complete digital infrastructure. We specialize in creating ultra-premium experiences for the next generation of creators and businesses. Would you like to hear more about a specific service?";
    }
    
    if (lowerInput.includes("price") || lowerInput.includes("cost") || lowerInput.includes("pricing")) {
      return "Our pricing is transparent and scales with your needs. We offer subscriptions starting at $49/mo for basic websites, $149/mo for professional setups, and custom enterprise packages. Individual services like standard websites start from $299. Shall I direct you to our full pricing section?";
    }
    
    if (lowerInput.includes("about") || lowerInput.includes("hivemind") || lowerInput.includes("who")) {
      return "HiveMind is a premium AI agency. Our philosophy is 'Humans. AI. One Mind.' We believe in bridging the gap between human creativity and artificial intelligence to build systems that feel alive. We are based worldwide, serving forward-thinking companies.";
    }

    if (lowerInput.includes("ai") || lowerInput.includes("system") || lowerInput.includes("automation")) {
      return "We build bespoke AI systems, custom chatbots, and automation workflows. Whether you need a 24/7 customer support bot, a Discord community manager, or complex API integrations, we engineer solutions that save you time and money.";
    }

    return "Fascinating. While I am a simulated intelligence for this demonstration, the real HiveMind team can build complex AI systems that understand context perfectly. Contact us to build your own custom AI solution.";
  };

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    // Simulate network delay
    setTimeout(() => {
      const aiResponse = generateResponse(text);
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: aiResponse
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <section className="py-32 relative" id="ai-chat">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-4 metallic-text"
          >
            Meet The HiveMind AI
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-neutral-400 text-lg"
          >
            Your digital co-founder, available 24/7
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto glass-panel rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
        >
          {/* Header */}
          <div className="p-4 border-b border-white/10 flex items-center gap-4 bg-white/5">
            <div className="relative">
              <div className="absolute inset-0 rounded-full animate-ping bg-green-500/20"></div>
              <div className="w-10 h-10 rounded-full bg-neutral-900 border border-white/20 flex items-center justify-center relative z-10">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-black"></div>
            </div>
            <div>
              <h3 className="font-semibold text-white">HiveMind Core</h3>
              <p className="text-xs text-green-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Online and ready
              </p>
            </div>
          </div>

          {/* Chat Area */}
          <div className="h-[400px] overflow-y-auto p-6 flex flex-col gap-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            <AnimatePresence>
              {messages.map((msg) => (
                <motion.div 
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-4 max-w-[85%] ${msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"}`}
                >
                  <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center border ${
                    msg.role === "user" 
                      ? "bg-white text-black border-white" 
                      : "bg-neutral-900 border-white/20 text-white"
                  }`}>
                    {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  <div className={`p-4 rounded-2xl ${
                    msg.role === "user"
                      ? "bg-white text-black rounded-tr-sm"
                      : "glass-panel text-neutral-200 rounded-tl-sm"
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
                className="flex gap-4 max-w-[85%] mr-auto"
              >
                <div className="w-8 h-8 rounded-full bg-neutral-900 border border-white/20 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="p-4 rounded-2xl glass-panel rounded-tl-sm flex items-center gap-1.5">
                  <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.4 }} className="w-2 h-2 rounded-full bg-white/50" />
                  <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.4, delay: 0.2 }} className="w-2 h-2 rounded-full bg-white/50" />
                  <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.4, delay: 0.4 }} className="w-2 h-2 rounded-full bg-white/50" />
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-white/10 bg-black/50">
            <div className="flex flex-wrap gap-2 mb-4">
              {SUGGESTED_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleSend(prompt)}
                  className="text-xs px-3 py-1.5 rounded-full border border-white/10 text-neutral-400 hover:text-white hover:border-white/30 transition-colors bg-white/5"
                >
                  {prompt}
                </button>
              ))}
            </div>
            <div className="relative flex items-center">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend(inputValue)}
                placeholder="Ask me anything..."
                className="w-full bg-neutral-900/50 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-white placeholder:text-neutral-500 focus:outline-none focus:border-white/30 transition-colors"
              />
              <Button 
                size="icon"
                variant="ghost"
                onClick={() => handleSend(inputValue)}
                disabled={!inputValue.trim() || isTyping}
                className="absolute right-1 hover:bg-white/10 text-white"
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
