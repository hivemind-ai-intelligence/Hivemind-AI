import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, MessageSquare, DollarSign, Target, Lightbulb, RotateCcw, Hexagon } from "lucide-react";
import { useAdminData } from "@/hooks/useAdminData";

// ── Language detection ────────────────────────────────────────────────────────
type Lang = "en" | "es" | "fr" | "de" | "pt" | "ar" | "hi" | "ja" | "zh" | "ko";

const LANG_PATTERNS: { lang: Lang; pattern: RegExp }[] = [
  { lang: "es", pattern: /\b(hola|gracias|ayuda|quiero|necesito|cómo|qué|buenas|buenos|por favor|español)\b/i },
  { lang: "fr", pattern: /\b(bonjour|merci|aide|comment|veux|besoin|française|salut|s'il vous plaît|bonsoir)\b/i },
  { lang: "de", pattern: /\b(hallo|danke|hilfe|wie|brauche|möchte|guten|bitte|deutsch|wiedersehen)\b/i },
  { lang: "pt", pattern: /\b(olá|obrigado|ajuda|como|quero|preciso|bom dia|boa tarde|português|por favor)\b/i },
  { lang: "ar", pattern: /[\u0600-\u06FF]/ },
  { lang: "hi", pattern: /[\u0900-\u097F]/ },
  { lang: "ja", pattern: /[\u3040-\u30FF\u4E00-\u9FFF]/ },
  { lang: "zh", pattern: /[\u4E00-\u9FFF\u3400-\u4DBF]/ },
  { lang: "ko", pattern: /[\uAC00-\uD7AF\u1100-\u11FF]/ },
];

function detectLang(text: string, navLang: string): Lang {
  for (const { lang, pattern } of LANG_PATTERNS) {
    if (pattern.test(text)) return lang;
  }
  const nav = navLang.split("-")[0].toLowerCase();
  const supported: Lang[] = ["en", "es", "fr", "de", "pt", "ar", "hi", "ja", "zh", "ko"];
  return supported.includes(nav as Lang) ? (nav as Lang) : "en";
}

// ── Localised strings ─────────────────────────────────────────────────────────
const T: Record<Lang, {
  greeting: string[];
  howAreYou: string;
  thanks: string;
  fallback: string;
  online: string;
  placeholder: string;
  clear: string;
  typeHint: string;
}> = {
  en: {
    greeting: ["Hey! How can I help you today?", "Hello! I'm the Hivemind AI. What can I do for you?", "Hi there! Ready to build something great?"],
    howAreYou: "I'm operating at full capacity — all systems green. How can I assist you?",
    thanks: "You're welcome! Is there anything else I can help with?",
    fallback: "Interesting. Tell me more, or switch a mode above for specific guidance.",
    online: "Online",
    placeholder: "Message Hivemind AI...",
    clear: "Clear",
    typeHint: "Drag · Scroll to Zoom",
  },
  es: {
    greeting: ["¡Hola! ¿Cómo puedo ayudarte hoy?", "¡Buenos días! Soy Hivemind AI. ¿En qué puedo servirte?"],
    howAreYou: "Operando a plena capacidad. ¿En qué puedo ayudarte?",
    thanks: "¡De nada! ¿Hay algo más en lo que pueda ayudarte?",
    fallback: "Interesante. Cuéntame más.",
    online: "En línea",
    placeholder: "Escribe un mensaje...",
    clear: "Limpiar",
    typeHint: "",
  },
  fr: {
    greeting: ["Bonjour ! Comment puis-je vous aider ?", "Salut ! Je suis Hivemind AI. Que puis-je faire pour vous ?"],
    howAreYou: "Je fonctionne à pleine capacité. Comment puis-je vous aider ?",
    thanks: "De rien ! Y a-t-il autre chose que je puisse faire ?",
    fallback: "Intéressant. Dites-m'en plus.",
    online: "En ligne",
    placeholder: "Écrivez un message...",
    clear: "Effacer",
    typeHint: "",
  },
  de: {
    greeting: ["Hallo! Wie kann ich Ihnen helfen?", "Guten Tag! Ich bin Hivemind AI. Was kann ich für Sie tun?"],
    howAreYou: "Ich laufe auf Hochtouren. Wie kann ich helfen?",
    thanks: "Gern geschehen! Kann ich noch etwas für Sie tun?",
    fallback: "Interessant. Erzählen Sie mir mehr.",
    online: "Online",
    placeholder: "Nachricht eingeben...",
    clear: "Löschen",
    typeHint: "",
  },
  pt: {
    greeting: ["Olá! Como posso ajudá-lo hoje?", "Oi! Sou o Hivemind AI. O que posso fazer por você?"],
    howAreYou: "Operando em plena capacidade. Como posso ajudar?",
    thanks: "De nada! Há mais alguma coisa em que eu possa ajudar?",
    fallback: "Interessante. Conte-me mais.",
    online: "Online",
    placeholder: "Digite uma mensagem...",
    clear: "Limpar",
    typeHint: "",
  },
  ar: {
    greeting: ["مرحباً! كيف يمكنني مساعدتك اليوم؟", "أهلاً! أنا Hivemind AI. ماذا يمكنني أن أفعل لك؟"],
    howAreYou: "أعمل بكامل طاقتي. كيف يمكنني مساعدتك؟",
    thanks: "على الرحب والسعة! هل هناك شيء آخر يمكنني مساعدتك به؟",
    fallback: "مثير للاهتمام. أخبرني أكثر.",
    online: "متصل",
    placeholder: "اكتب رسالة...",
    clear: "مسح",
    typeHint: "",
  },
  hi: {
    greeting: ["नमस्ते! मैं आज आपकी कैसे मदद कर सकता हूँ?", "हैलो! मैं Hivemind AI हूँ। मैं आपके लिए क्या कर सकता हूँ?"],
    howAreYou: "मैं पूरी क्षमता पर काम कर रहा हूँ। आपकी कैसे मदद करूँ?",
    thanks: "आपका स्वागत है! क्या और कुछ चाहिए?",
    fallback: "दिलचस्प! मुझे और बताएं।",
    online: "ऑनलाइन",
    placeholder: "संदेश लिखें...",
    clear: "साफ़ करें",
    typeHint: "",
  },
  ja: {
    greeting: ["こんにちは！今日はどのようにお手伝いできますか？", "はじめまして！Hivemind AIです。何でもお聞きください。"],
    howAreYou: "フル稼働中です。どのようにお手伝いできますか？",
    thanks: "どういたしまして！他に何かございますか？",
    fallback: "興味深いですね。もう少し教えていただけますか？",
    online: "オンライン",
    placeholder: "メッセージを入力...",
    clear: "クリア",
    typeHint: "",
  },
  zh: {
    greeting: ["你好！今天我能为您做什么？", "您好！我是Hivemind AI，请问有什么可以帮到您？"],
    howAreYou: "我正在满负荷运行。您需要什么帮助？",
    thanks: "不客气！还有什么我能帮您的吗？",
    fallback: "很有趣。请告诉我更多。",
    online: "在线",
    placeholder: "输入消息...",
    clear: "清除",
    typeHint: "",
  },
  ko: {
    greeting: ["안녕하세요! 오늘 어떻게 도와드릴까요?", "반갑습니다! Hivemind AI입니다. 무엇을 도와드릴까요?"],
    howAreYou: "최대 성능으로 작동 중입니다. 어떻게 도와드릴까요?",
    thanks: "천만에요! 다른 도움이 필요하신가요?",
    fallback: "흥미롭네요. 더 말씀해 주세요.",
    online: "온라인",
    placeholder: "메시지를 입력하세요...",
    clear: "지우기",
    typeHint: "",
  },
};

// ── Modes ─────────────────────────────────────────────────────────────────────
const MODES = [
  { id: "general", label: "General", icon: MessageSquare, welcome: "Hello. I'm the Hivemind AI Core — your digital co-founder. How can I help you build the future today?" },
  { id: "services", label: "Services", icon: Lightbulb, welcome: "I can recommend the perfect service package. Tell me what you're trying to build." },
  { id: "pricing", label: "Pricing", icon: DollarSign, welcome: "Let's find the right tier for your budget and goals. What features matter most to you?" },
  { id: "connect", label: "Connect", icon: Target, welcome: "Ready to start? Share your name and email — I'll connect you with the team directly." },
] as const;
type ModeId = typeof MODES[number]["id"];

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  lang?: Lang;
}

// ── Conversational memory ─────────────────────────────────────────────────────
interface Memory {
  name?: string;
  budget?: string;
  interest?: string;
  lang: Lang;
}

export default function AIChat() {
  const { data } = useAdminData();
  const navLang = navigator.language || "en";

  const [activeMode, setActiveMode] = useState<ModeId>("general");
  const [messages, setMessages] = useState<Record<ModeId, Message[]>>({
    general: [{ id: "0", role: "ai", content: MODES[0].welcome }],
    services: [{ id: "0", role: "ai", content: MODES[1].welcome }],
    pricing: [{ id: "0", role: "ai", content: MODES[2].welcome }],
    connect: [{ id: "0", role: "ai", content: MODES[3].welcome }],
  });
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [memory, setMemory] = useState<Record<ModeId, Memory>>({
    general: { lang: "en" },
    services: { lang: "en" },
    pricing: { lang: "en" },
    connect: { lang: "en" },
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentMessages = messages[activeMode] || [];
  const currentMemory = memory[activeMode];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentMessages, isTyping]);

  const updateMemory = useCallback((mode: ModeId, updates: Partial<Memory>) => {
    setMemory(prev => ({ ...prev, [mode]: { ...prev[mode], ...updates } }));
  }, []);

  const generateResponse = useCallback((input: string, mode: ModeId, mem: Memory): string => {
    const lower = input.toLowerCase();
    const lang = detectLang(input, navLang);
    const t = T[lang];

    // Update language memory
    updateMemory(mode, { lang });

    // ── Universal conversational patterns ──
    const isGreeting = /^(hi|hey|hello|hola|bonjour|hallo|olá|ciao|salut|namaste|こんにちは|你好|안녕|مرحبا|नमस्ते)\b/i.test(input.trim());
    if (isGreeting) return t.greeting[Math.floor(Math.random() * t.greeting.length)];

    const isThanks = /\b(thank|thanks|gracias|merci|danke|obrigado|ありがとう|谢谢|감사|شكراً|धन्यवाद)\b/i.test(lower);
    if (isThanks) return t.thanks;

    const isHowAreYou = /how are you|como estás|comment vas|wie geht|como vai|お元気|你好吗|잘 지내|كيف حالك|कैसे हो/i.test(lower);
    if (isHowAreYou) return t.howAreYou;

    // ── Connect mode ──
    if (mode === "connect") {
      const emailMatch = input.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
      if (emailMatch) {
        try {
          const existing = JSON.parse(localStorage.getItem("hivemind-leads") || "[]");
          localStorage.setItem("hivemind-leads", JSON.stringify([
            ...existing,
            { contact: input, name: mem.name, timestamp: new Date().toISOString(), lang }
          ]));
        } catch (_) {}
        const name = mem.name ? `, ${mem.name}` : "";
        return lang === "en"
          ? `Perfect${name}! I've logged your details. The ${data.brandName} team will reach out within 24 hours. Is there anything else you'd like to share?`
          : `${T[lang].thanks} ${data.brandName}`;
      }

      // Extract name
      const nameMatch = input.match(/(?:i'm|i am|my name is|me llamo|je m'appelle|ich heiße|me chamo)\s+([A-Z][a-z]+)/i);
      if (nameMatch) {
        updateMemory(mode, { name: nameMatch[1] });
        return lang === "en"
          ? `Nice to meet you, ${nameMatch[1]}! Please share your email address so our team can reach out.`
          : `${T[lang].greeting[0]} ${nameMatch[1]}!`;
      }

      return lang === "en"
        ? "Please share your name and email address, and I'll make sure the team connects with you personally."
        : T[lang].fallback;
    }

    // ── Pricing mode ──
    if (mode === "pricing") {
      const numericTiers = data.pricing.filter(t => typeof t.monthly === "number") as Array<{ name: string; monthly: number; features: string[]; recommended?: boolean }>;
      if (numericTiers.length > 0) {
        const cheapest = numericTiers.reduce((a, b) => a.monthly < b.monthly ? a : b);
        const popular = data.pricing.find(t => t.recommended) || numericTiers[Math.floor(numericTiers.length / 2)];

        // Budget detection
        const budgetMatch = input.match(/\$?(\d+)\s*(?:k|per month|\/mo|dollars?)?/i);
        if (budgetMatch) {
          const budget = parseInt(budgetMatch[1]);
          updateMemory(mode, { budget: `$${budget}` });
          const matching = numericTiers.filter(t => t.monthly <= budget * 1.2);
          if (matching.length > 0) {
            const best = matching[matching.length - 1];
            return `With a budget around $${budget}, our **${best.name}** plan at $${best.monthly}/mo is ideal. It includes: ${best.features.slice(0, 3).join(", ")}.`;
          }
        }

        if (/cheap|budget|start|small|afford/i.test(lower)) {
          return `Our **${cheapest.name}** plan at $${cheapest.monthly}/mo is a great starting point. Key features: ${cheapest.features.slice(0, 3).join(", ")}.`;
        }
        if (/enterprise|large|team|scale|company/i.test(lower)) {
          const ent = data.pricing.find(t => typeof t.monthly === "string") || data.pricing[data.pricing.length - 1];
          return `Our **${ent.name}** plan is built for scale. Includes: ${ent.features.slice(0, 3).join(", ")}. Let's discuss a custom quote.`;
        }

        const tierList = numericTiers.map(t => `**${t.name}** ($${t.monthly}/mo)`).join(", ");
        const popName = typeof popular === "object" && "name" in popular ? popular.name : "Professional";
        return `We offer ${tierList}${data.pricing.find(t => typeof t.monthly === "string") ? `, plus **Enterprise** (custom pricing)` : ""}.\n\nOur most popular is **${popName}**. What's your expected budget or team size?`;
      }
      return "Check the Pricing section on this page for full tier details and features.";
    }

    // ── Services mode ──
    if (mode === "services") {
      if (/web|site|website|landing|page/i.test(lower)) {
        const s = data.services.find(s => s.name.toLowerCase().includes("web"));
        updateMemory(mode, { interest: "web" });
        return s
          ? `We craft high-performance websites starting at $${s.price}. Features: ${s.features.join(", ")}.\n\nWhat type of site are you envisioning?`
          : "We build stunning custom websites. What type of site do you have in mind?";
      }
      if (/bot|discord|automation|automate/i.test(lower)) {
        const s = data.services.find(s => s.name.toLowerCase().includes("discord") || s.name.toLowerCase().includes("bot"));
        updateMemory(mode, { interest: "bot" });
        return s
          ? `Our Discord & automation bots start at $${s.price}. Features: ${s.features.join(", ")}.\n\nTell me about your server or workflow.`
          : "We build powerful custom bots. Describe what you need.";
      }
      if (/ai|intelligent|machine|ml|gpt|llm/i.test(lower)) {
        const s = data.services.find(s => s.name.toLowerCase().includes("ai"));
        updateMemory(mode, { interest: "ai" });
        return s
          ? `Our AI Systems start at $${s.price}. We handle: ${s.features.join(", ")}.\n\nWhat problem are you solving with AI?`
          : "We build custom AI systems and integrations. What's your use case?";
      }
      const sample = data.services.slice(0, 5).map(s => s.name).join(", ");
      return `We offer ${data.services.length} specialized services including: ${sample}, and more.\n\nWhich area interests you most?`;
    }

    // ── General mode ──
    if (/service|offer|build|make|create/i.test(lower)) {
      return `${data.brandName} offers ${data.services.length} premium services — from websites and AI systems to automation and Discord bots. Try the **Services** tab for tailored recommendations!`;
    }
    if (/price|cost|how much|pricing|budget/i.test(lower)) {
      return `Switch to the **Pricing** tab for detailed tier guidance, or scroll to the Pricing section. Packages start at an accessible entry point and scale to enterprise.`;
    }
    if (/contact|hire|start|work together|project/i.test(lower)) {
      return `Ready to collaborate? Switch to the **Connect** tab to leave your details, or use the contact form below. We typically respond within 24 hours.`;
    }
    if (/who|about|company|hivemind|founder/i.test(lower)) {
      return `${data.brandName} is an elite AI agency specializing in websites, AI systems, automations, and digital infrastructure.\n\nFounded by ${data.founderName} — ${data.founderProjects} projects delivered across ${data.founderClients} clients worldwide.`;
    }
    if (/what can you do|help me|capabilities/i.test(lower)) {
      return `I can help you explore our services, find the right pricing tier, or connect you with our team. I also understand multiple languages — feel free to write in yours!`;
    }

    return t.fallback;
  }, [data, navLang, updateMemory]);

  const handleSend = useCallback(() => {
    const text = inputValue.trim();
    if (!text || isTyping) return;

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: text };
    setMessages(prev => ({ ...prev, [activeMode]: [...(prev[activeMode] || []), userMsg] }));
    setInputValue("");
    setIsTyping(true);

    const delay = 600 + Math.random() * 600;
    setTimeout(() => {
      const response = generateResponse(text, activeMode, memory[activeMode]);
      const aiMsg: Message = { id: (Date.now() + 1).toString(), role: "ai", content: response };
      setMessages(prev => ({ ...prev, [activeMode]: [...(prev[activeMode] || []), aiMsg] }));
      setIsTyping(false);
      inputRef.current?.focus();
    }, delay);
  }, [inputValue, isTyping, activeMode, generateResponse, memory]);

  const clearChat = useCallback(() => {
    const mode = MODES.find(m => m.id === activeMode);
    setMessages(prev => ({
      ...prev,
      [activeMode]: [{ id: Date.now().toString(), role: "ai", content: mode?.welcome || "" }],
    }));
    setMemory(prev => ({ ...prev, [activeMode]: { lang: "en" } }));
  }, [activeMode]);

  const t = T[currentMemory.lang] || T.en;

  return (
    <section className="py-32 relative" id="ai-chat">
      {/* BG */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/40 to-transparent dark:via-black/30" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-indigo-900/5 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-6"
          >
            <Sparkles className="w-3 h-3 text-indigo-400" />
            <span className="text-xs font-medium uppercase tracking-widest text-white/40">AI Co-Founder</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold mb-4 metallic-text"
          >
            Hivemind Intelligence
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-white/40 max-w-md mx-auto"
          >
            Converse naturally in any language. I adapt to you.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="max-w-2xl mx-auto rounded-3xl overflow-hidden flex flex-col"
          style={{
            background: "rgba(8,10,16,0.8)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid rgba(255,255,255,0.07)",
            boxShadow: "0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04) inset",
            minHeight: 600,
          }}
        >
          {/* Chat Header */}
          <div
            className="p-4 border-b flex-shrink-0"
            style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}
          >
            {/* Identity row */}
            <div className="flex items-center gap-3 mb-4">
              <div className="relative flex-shrink-0">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-white/80 shadow-[0_0_20px_rgba(100,130,255,0.3)]"
                  style={{ background: "linear-gradient(135deg, #1a1f30 0%, #0d1120 100%)", border: "1px solid rgba(100,130,255,0.2)" }}>
                  <Hexagon className="w-5 h-5 text-indigo-400" fill="rgba(99,102,241,0.15)" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-black shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white/90">{data.brandName} AI</p>
                <p className="text-xs text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
                  {t.online}
                </p>
              </div>
              <button
                onClick={clearChat}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs text-white/30 hover:text-white/60 hover:bg-white/5 transition-all duration-200 border border-transparent hover:border-white/8"
              >
                <RotateCcw className="w-3 h-3" />
                {t.clear}
              </button>
            </div>

            {/* Mode tabs */}
            <div className="flex gap-1.5 overflow-x-auto scrollbar-none">
              {MODES.map(mode => {
                const Icon = mode.icon;
                const isActive = activeMode === mode.id;
                return (
                  <button
                    key={mode.id}
                    onClick={() => setActiveMode(mode.id)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                      isActive
                        ? "text-white shadow-[0_0_20px_rgba(99,102,241,0.2)]"
                        : "text-white/30 hover:text-white/60 hover:bg-white/4"
                    }`}
                    style={isActive ? {
                      background: "linear-gradient(135deg, rgba(99,102,241,0.2) 0%, rgba(99,102,241,0.1) 100%)",
                      border: "1px solid rgba(99,102,241,0.3)",
                    } : { border: "1px solid transparent" }}
                  >
                    <Icon className="w-3 h-3" />
                    {mode.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4 min-h-0" style={{ maxHeight: 400 }}>
            <AnimatePresence initial={false}>
              {currentMessages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 12, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse ml-8" : "mr-8"}`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-7 h-7 rounded-xl flex-shrink-0 flex items-center justify-center text-xs font-bold ${
                      msg.role === "user" ? "bg-white/10 text-white/60" : "text-indigo-300"
                    }`}
                    style={msg.role === "ai" ? {
                      background: "linear-gradient(135deg, #1a1f30 0%, #0d1120 100%)",
                      border: "1px solid rgba(99,102,241,0.2)",
                    } : {}}
                  >
                    {msg.role === "user" ? "U" : <Hexagon className="w-4 h-4" fill="rgba(99,102,241,0.2)" />}
                  </div>

                  {/* Bubble */}
                  <div
                    className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "rounded-tr-md text-white/80"
                        : "rounded-tl-md text-white/80"
                    }`}
                    style={msg.role === "user" ? {
                      background: "rgba(255,255,255,0.07)",
                      border: "1px solid rgba(255,255,255,0.08)",
                    } : {
                      background: "rgba(99,102,241,0.08)",
                      border: "1px solid rgba(99,102,241,0.15)",
                    }}
                  >
                    {msg.content.split("\n").map((line, i) => (
                      <span key={i}>
                        {line.split(/(\*\*[^*]+\*\*)/).map((seg, j) =>
                          seg.startsWith("**") && seg.endsWith("**")
                            ? <strong key={j} className="text-white font-semibold">{seg.slice(2, -2)}</strong>
                            : seg
                        )}
                        {i < msg.content.split("\n").length - 1 && <br />}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing indicator */}
            <AnimatePresence>
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="flex gap-3 mr-8"
                >
                  <div
                    className="w-7 h-7 rounded-xl flex-shrink-0 flex items-center justify-center text-indigo-300"
                    style={{
                      background: "linear-gradient(135deg, #1a1f30 0%, #0d1120 100%)",
                      border: "1px solid rgba(99,102,241,0.2)",
                    }}
                  >
                    <Hexagon className="w-4 h-4" fill="rgba(99,102,241,0.2)" />
                  </div>
                  <div
                    className="px-4 py-3.5 rounded-2xl rounded-tl-md flex items-center gap-1.5"
                    style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.15)" }}
                  >
                    {[0, 0.18, 0.36].map((delay, i) => (
                      <motion.span
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-indigo-400"
                        animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
                        transition={{ repeat: Infinity, duration: 1.2, delay, ease: "easeInOut" }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div
            className="p-4 flex-shrink-0 border-t"
            style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.01)" }}
          >
            <div className="flex items-center gap-2">
              <div
                className="flex-1 flex items-center rounded-2xl overflow-hidden transition-all duration-200 focus-within:shadow-[0_0_0_1px_rgba(99,102,241,0.4)]"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleSend()}
                  placeholder={t.placeholder}
                  data-testid="ai-chat-input"
                  className="flex-1 bg-transparent px-4 py-3 text-sm text-white/80 placeholder:text-white/20 outline-none"
                />
              </div>
              <button
                onClick={handleSend}
                disabled={!inputValue.trim() || isTyping}
                data-testid="ai-chat-send"
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                style={{
                  background: inputValue.trim() && !isTyping
                    ? "linear-gradient(135deg, rgba(99,102,241,0.6) 0%, rgba(79,82,221,0.6) 100%)"
                    : "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(99,102,241,0.3)",
                }}
              >
                <Send className="w-4 h-4 text-white/80" />
              </button>
            </div>
            <p className="text-center text-[10px] text-white/15 mt-2.5 tracking-wide">
              Supports English · Español · Français · Deutsch · 中文 · 日本語 · and more
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
