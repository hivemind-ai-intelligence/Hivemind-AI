import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send, Sparkles, MessageSquare, DollarSign, Target,
  Lightbulb, RotateCcw, Hexagon, Wifi, WifiOff, Code, Copy, Check,
} from "lucide-react";
import { useAdminData } from "@/hooks/useAdminData";

// ── Types ─────────────────────────────────────────────────────────────────────
type Lang = "en" | "hi" | "hinglish" | "bn" | "ur" | "ar" | "fr" | "de" |
  "es" | "pt" | "it" | "ru" | "ja" | "ko" | "zh" | "tr" | "nl" | "pl" |
  "id" | "th" | "vi" | "pa" | "ta" | "te" | "mr" | "gu";

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  isStreaming?: boolean;
  error?: boolean;
}

// ── Language detection (24+ languages) ───────────────────────────────────────
const LANG_PATTERNS: [Lang, RegExp][] = [
  ["ar",       /[\u0600-\u06FF]/],
  ["hi",       /[\u0900-\u097F]/],
  ["bn",       /[\u0980-\u09FF]/],
  ["pa",       /[\u0A00-\u0A7F]/],
  ["gu",       /[\u0A80-\u0AFF]/],
  ["ta",       /[\u0B80-\u0BFF]/],
  ["te",       /[\u0C00-\u0C7F]/],
  ["mr",       /[\u0900-\u097F].*(?:आह|आहे|आहेत|मला|तुम्ही)/],
  ["ur",       /[\u0600-\u06FF].*(?:ہے|ہیں|کیا|نہیں)/],
  ["ja",       /[\u3040-\u30FF\u4E00-\u9FFF]/],
  ["zh",       /[\u4E00-\u9FFF\u3400-\u4DBF]/],
  ["ko",       /[\uAC00-\uD7AF\u1100-\u11FF]/],
  ["th",       /[\u0E00-\u0E7F]/],
  ["vi",       /\b(?:tôi|bạn|có|không|được|này)\b/i],
  ["ru",       /[\u0400-\u04FF]/],
  ["es",       /\b(?:hola|gracias|cómo|qué|necesito|español|buenos|por favor)\b/i],
  ["fr",       /\b(?:bonjour|merci|comment|française|salut|je veux|s'il vous)\b/i],
  ["de",       /\b(?:hallo|danke|wie|brauche|möchte|guten|bitte|deutsch)\b/i],
  ["pt",       /\b(?:olá|obrigado|como|quero|preciso|português|bom dia)\b/i],
  ["it",       /\b(?:ciao|grazie|come|voglio|italiano|buongiorno|prego)\b/i],
  ["tr",       /\b(?:merhaba|teşekkür|nasıl|istiyorum|türkçe|lütfen)\b/i],
  ["nl",       /\b(?:hallo|dank|hoe|wil|dutch|alsjeblieft|goedemorgen)\b/i],
  ["pl",       /\b(?:cześć|dziękuję|jak|chcę|polski|proszę)\b/i],
  ["id",       /\b(?:halo|terima kasih|bagaimana|saya|indonesia|tolong)\b/i],
  ["hinglish", /\b(?:kya|hai|hain|nahi|main|tum|aur|bhi|yaar|bhai|boss|karo|kaise)\b/i],
];

function detectLang(text: string): Lang {
  for (const [lang, pattern] of LANG_PATTERNS) {
    if (pattern.test(text)) return lang;
  }
  return "en";
}

// ── Mode config ───────────────────────────────────────────────────────────────
const MODES = [
  {
    id: "general",
    label: "General",
    icon: MessageSquare,
    welcome: "Hello! I'm the **Hivemind AI** — your digital co-founder. Ask me anything about our services, technology, or how we can transform your business.",
    color: "rgba(99,102,241,0.3)",
  },
  {
    id: "services",
    label: "Services",
    icon: Lightbulb,
    welcome: "I can recommend the **perfect service** for your needs. Tell me what you're trying to build — website, AI system, automation, or something else entirely.",
    color: "rgba(168,85,247,0.3)",
  },
  {
    id: "pricing",
    label: "Pricing",
    icon: DollarSign,
    welcome: "Let's find the **ideal pricing tier** for your budget and goals. What's your approximate budget and what features matter most to you?",
    color: "rgba(16,185,129,0.3)",
  },
  {
    id: "connect",
    label: "Connect",
    icon: Target,
    welcome: "Ready to **start your project**? Share your name and email — I'll make sure our team reaches out within 24 hours.",
    color: "rgba(245,158,11,0.3)",
  },
] as const;
type ModeId = typeof MODES[number]["id"];

// ── Markdown renderer (lightweight) ──────────────────────────────────────────
function renderMarkdown(text: string) {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let codeBlock = false;
  let codeLines: string[] = [];
  let codeKey = 0;

  const renderInline = (line: string, key: number) => {
    const parts: React.ReactNode[] = [];
    let remaining = line;
    let partKey = 0;

    // Bold
    remaining = remaining.replace(/\*\*([^*]+)\*\*/g, (_, content) => `〈b〉${content}〈/b〉`);
    // Italic
    remaining = remaining.replace(/\*([^*]+)\*/g, (_, content) => `〈i〉${content}〈/i〉`);
    // Code
    remaining = remaining.replace(/`([^`]+)`/g, (_, content) => `〈c〉${content}〈/c〉`);

    const segments = remaining.split(/(〈b〉.*?〈\/b〉|〈i〉.*?〈\/i〉|〈c〉.*?〈\/c〉)/g);
    segments.forEach(seg => {
      if (seg.startsWith("〈b〉")) parts.push(<strong key={partKey++} className="text-white font-semibold">{seg.slice(3, -4)}</strong>);
      else if (seg.startsWith("〈i〉")) parts.push(<em key={partKey++} className="text-white/80 italic">{seg.slice(3, -4)}</em>);
      else if (seg.startsWith("〈c〉")) parts.push(<code key={partKey++} className="bg-white/10 text-emerald-300 px-1.5 py-0.5 rounded text-xs font-mono">{seg.slice(3, -4)}</code>);
      else if (seg) parts.push(<span key={partKey++}>{seg}</span>);
    });

    return <span key={key}>{parts}</span>;
  };

  lines.forEach((line, idx) => {
    if (line.startsWith("```")) {
      if (codeBlock) {
        elements.push(<CodeBlock key={`code-${codeKey++}`} code={codeLines.join("\n")} />);
        codeLines = [];
        codeBlock = false;
      } else {
        codeBlock = true;
      }
      return;
    }
    if (codeBlock) { codeLines.push(line); return; }

    if (line.startsWith("### ")) {
      elements.push(<p key={idx} className="font-semibold text-white/90 mt-2 mb-0.5">{line.slice(4)}</p>);
    } else if (line.startsWith("## ")) {
      elements.push(<p key={idx} className="font-bold text-white mt-2 mb-1">{line.slice(3)}</p>);
    } else if (line.match(/^[-*] /)) {
      elements.push(
        <div key={idx} className="flex gap-2 items-start my-0.5">
          <span className="text-indigo-400 mt-1 flex-shrink-0">•</span>
          <span>{renderInline(line.slice(2), idx)}</span>
        </div>
      );
    } else if (line.trim() === "") {
      elements.push(<div key={idx} className="h-2" />);
    } else {
      elements.push(<p key={idx}>{renderInline(line, idx)}</p>);
    }
  });

  return elements;
}

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <div className="relative rounded-xl overflow-hidden my-2 border border-white/8">
      <div className="flex items-center justify-between px-3 py-1.5 bg-white/5">
        <div className="flex items-center gap-1.5">
          <Code className="w-3 h-3 text-white/30" />
          <span className="text-[10px] text-white/30 font-mono">code</span>
        </div>
        <button onClick={copy} className="text-white/30 hover:text-white/60 transition-colors">
          {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
        </button>
      </div>
      <pre className="p-3 text-xs text-emerald-300 font-mono overflow-x-auto bg-black/40">{code}</pre>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function AIChat() {
  const { data } = useAdminData();
  const [activeMode, setActiveMode] = useState<ModeId>("general");
  const [conversations, setConversations] = useState<Record<ModeId, Message[]>>({
    general: [{ id: "0", role: "ai", content: MODES[0].welcome }],
    services: [{ id: "0", role: "ai", content: MODES[1].welcome }],
    pricing: [{ id: "0", role: "ai", content: MODES[2].welcome }],
    connect: [{ id: "0", role: "ai", content: MODES[3].welcome }],
  });
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [aiStatus, setAiStatus] = useState<"online" | "fallback" | "error">("online");
  const [charCount, setCharCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentMessages = conversations[activeMode] || [];
  const activeModeMeta = MODES.find(m => m.id === activeMode)!;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentMessages, isTyping]);

  // Build system context from admin data
  const buildContext = useCallback(() => ({
    brandName: data.brandName,
    founderName: data.founderName,
    founderProjects: data.founderProjects,
    founderClients: data.founderClients,
    services: data.services?.slice(0, 10).map(s => ({
      name: s.name,
      price: s.price,
      features: s.features?.slice(0, 4) || [],
    })),
    pricing: data.pricing?.slice(0, 6).map(p => ({
      name: p.name,
      monthly: p.monthly,
      features: p.features?.slice(0, 4) || [],
      recommended: p.recommended,
    })),
    mode: activeMode,
  }), [data, activeMode]);

  // Call AI backend
  const callAI = useCallback(async (history: Message[]): Promise<{ content: string; mode?: string }> => {
    const apiMessages = history
      .filter(m => !m.error)
      .map(m => ({ role: m.role === "ai" ? "assistant" : "user" as const, content: m.content }));

    const res = await fetch("/api/ai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: apiMessages,
        systemContext: buildContext(),
      }),
      signal: AbortSignal.timeout(18000),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  }, [buildContext]);

  const handleSend = useCallback(async () => {
    const text = inputValue.trim();
    if (!text || isTyping) return;

    const lang = detectLang(text);
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: text };

    const updatedHistory = [...currentMessages, userMsg];
    setConversations(prev => ({ ...prev, [activeMode]: updatedHistory }));
    setInputValue("");
    setCharCount(0);
    setIsTyping(true);

    // Save leads from connect mode
    if (activeMode === "connect" && (text.includes("@") || text.includes(".com"))) {
      try {
        const existing = JSON.parse(localStorage.getItem("hivemind-leads") || "[]");
        localStorage.setItem("hivemind-leads", JSON.stringify([
          ...existing,
          { contact: text, timestamp: new Date().toISOString(), lang },
        ]));
      } catch (_) { /* ignore */ }
    }

    try {
      const result = await callAI(updatedHistory);
      setAiStatus(result.mode === "fallback" ? "fallback" : "online");

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: result.content,
      };
      setConversations(prev => ({
        ...prev,
        [activeMode]: [...updatedHistory, aiMsg],
      }));
    } catch (err) {
      setAiStatus("error");
      // Local fallback response
      const fallback = localFallback(text, data.brandName);
      setConversations(prev => ({
        ...prev,
        [activeMode]: [
          ...updatedHistory,
          { id: (Date.now() + 1).toString(), role: "ai", content: fallback },
        ],
      }));
    } finally {
      setIsTyping(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [inputValue, isTyping, currentMessages, activeMode, callAI, data.brandName]);

  const clearChat = useCallback(() => {
    const mode = MODES.find(m => m.id === activeMode)!;
    setConversations(prev => ({
      ...prev,
      [activeMode]: [{ id: Date.now().toString(), role: "ai", content: mode.welcome }],
    }));
  }, [activeMode]);

  const statusColor = {
    online: "bg-emerald-400",
    fallback: "bg-amber-400",
    error: "bg-red-400",
  }[aiStatus];

  const statusLabel = {
    online: "Online · AI",
    fallback: "Smart Fallback",
    error: "Offline Mode",
  }[aiStatus];

  return (
    <section className="py-32 relative" id="ai-chat">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full bg-indigo-900/8 blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-purple-900/6 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section header */}
        <div className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/4 backdrop-blur-sm mb-6"
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
            className="text-white/40 max-w-lg mx-auto leading-relaxed"
          >
            Real AI-powered conversation. Converses naturally in 24+ languages. Remembers your session context.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="max-w-2xl mx-auto rounded-3xl overflow-hidden flex flex-col"
          style={{
            background: "rgba(6,8,18,0.88)",
            backdropFilter: "blur(32px) saturate(180%)",
            WebkitBackdropFilter: "blur(32px) saturate(180%)",
            border: "1px solid rgba(255,255,255,0.07)",
            boxShadow: "0 50px 100px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04) inset",
            minHeight: 580,
            maxHeight: 740,
          }}
        >
          {/* ── Header ── */}
          <div
            className="p-4 border-b flex-shrink-0"
            style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.015)" }}
          >
            {/* Identity */}
            <div className="flex items-center gap-3 mb-4">
              <div className="relative flex-shrink-0">
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg, #1a1f35 0%, #0d1025 100%)",
                    border: "1px solid rgba(99,102,241,0.25)",
                    boxShadow: "0 0 20px rgba(99,102,241,0.2)",
                  }}
                >
                  <Hexagon className="w-5 h-5 text-indigo-400" fill="rgba(99,102,241,0.15)" />
                </div>
                <span
                  className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-black ${statusColor}`}
                  style={{ boxShadow: `0 0 6px currentColor` }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white/90">{data.brandName} AI</p>
                <div className="flex items-center gap-1.5">
                  {aiStatus === "online" ? <Wifi className="w-3 h-3 text-emerald-400" /> : <WifiOff className="w-3 h-3 text-amber-400" />}
                  <span className={`text-xs ${aiStatus === "online" ? "text-emerald-400" : "text-amber-400"}`}>
                    {statusLabel}
                  </span>
                </div>
              </div>
              <button
                onClick={clearChat}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs text-white/25 hover:text-white/60 hover:bg-white/5 transition-all duration-200 border border-transparent hover:border-white/8"
              >
                <RotateCcw className="w-3 h-3" />
                Clear
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
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-200 flex-shrink-0 ${
                      isActive ? "text-white" : "text-white/30 hover:text-white/60"
                    }`}
                    style={isActive ? {
                      background: mode.color,
                      border: `1px solid ${mode.color.replace("0.3", "0.5")}`,
                    } : { border: "1px solid transparent" }}
                  >
                    <Icon className="w-3 h-3" />
                    {mode.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Messages ── */}
          <div
            className="flex-1 overflow-y-auto p-5 flex flex-col gap-3"
            style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.06) transparent" }}
          >
            <AnimatePresence initial={false}>
              {currentMessages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 14, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse ml-10" : "mr-10"}`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-7 h-7 rounded-xl flex-shrink-0 flex items-center justify-center text-xs font-semibold self-end ${
                      msg.role === "user" ? "text-white/50" : "text-indigo-300"
                    }`}
                    style={msg.role === "ai" ? {
                      background: "linear-gradient(135deg, #1a1f35 0%, #0d1025 100%)",
                      border: "1px solid rgba(99,102,241,0.2)",
                    } : {
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    {msg.role === "user"
                      ? "U"
                      : <Hexagon className="w-3.5 h-3.5" fill="rgba(99,102,241,0.2)" />
                    }
                  </div>

                  {/* Bubble */}
                  <div
                    className={`px-4 py-3 rounded-2xl text-sm leading-relaxed max-w-full ${
                      msg.role === "user"
                        ? "rounded-tr-md text-white/80"
                        : "rounded-tl-md text-white/75"
                    } ${msg.error ? "border-red-500/20 bg-red-900/10" : ""}`}
                    style={msg.role === "user" ? {
                      background: "rgba(255,255,255,0.07)",
                      border: "1px solid rgba(255,255,255,0.09)",
                    } : {
                      background: "rgba(99,102,241,0.09)",
                      border: "1px solid rgba(99,102,241,0.15)",
                    }}
                  >
                    {msg.role === "ai"
                      ? <div className="space-y-0.5">{renderMarkdown(msg.content)}</div>
                      : msg.content
                    }
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
                  transition={{ duration: 0.2 }}
                  className="flex gap-3 mr-10"
                >
                  <div
                    className="w-7 h-7 rounded-xl flex-shrink-0 flex items-center justify-center text-indigo-300 self-end"
                    style={{
                      background: "linear-gradient(135deg, #1a1f35 0%, #0d1025 100%)",
                      border: "1px solid rgba(99,102,241,0.2)",
                    }}
                  >
                    <Hexagon className="w-3.5 h-3.5" fill="rgba(99,102,241,0.2)" />
                  </div>
                  <div
                    className="px-4 py-4 rounded-2xl rounded-tl-md flex items-center gap-1.5"
                    style={{ background: "rgba(99,102,241,0.09)", border: "1px solid rgba(99,102,241,0.15)" }}
                  >
                    {[0, 0.2, 0.4].map((delay, i) => (
                      <motion.span
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-indigo-400"
                        animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
                        transition={{ repeat: Infinity, duration: 1.2, delay, ease: "easeInOut" }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          {/* ── Input ── */}
          <div
            className="p-4 flex-shrink-0 border-t"
            style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.01)" }}
          >
            <div className="flex items-end gap-2">
              <div
                className="flex-1 rounded-2xl transition-all duration-200 focus-within:shadow-[0_0_0_1.5px_rgba(99,102,241,0.4)]"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.09)",
                }}
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={e => { setInputValue(e.target.value); setCharCount(e.target.value.length); }}
                  onKeyDown={e => e.key === "Enter" && !e.shiftKey && !isTyping && handleSend()}
                  placeholder="Message Hivemind AI… (any language)"
                  data-testid="ai-chat-input"
                  maxLength={600}
                  className="w-full bg-transparent px-4 py-3 text-sm text-white/80 placeholder:text-white/18 outline-none"
                />
              </div>
              <motion.button
                onClick={handleSend}
                disabled={!inputValue.trim() || isTyping}
                data-testid="ai-chat-send"
                whileTap={{ scale: 0.93 }}
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                style={{
                  background: inputValue.trim() && !isTyping
                    ? "linear-gradient(135deg, rgba(99,102,241,0.7) 0%, rgba(79,82,221,0.7) 100%)"
                    : "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(99,102,241,0.3)",
                }}
              >
                <Send className="w-4 h-4 text-white/80" />
              </motion.button>
            </div>

            {/* Language hint + char count */}
            <div className="flex items-center justify-between mt-2 px-1">
              <p className="text-[10px] text-white/15 tracking-wide">
                Supports EN · हिन्दी · বাংলা · 中文 · 日本語 · العربية · Español · Français · 한국어 · +16 more
              </p>
              {charCount > 400 && (
                <span className={`text-[10px] ${charCount > 550 ? "text-red-400" : "text-white/25"}`}>
                  {charCount}/600
                </span>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ── Local fallback (when API is unreachable) ──────────────────────────────────
function localFallback(input: string, brand: string): string {
  const lower = input.toLowerCase();
  if (/^(hi|hey|hello|hola|bonjour|hallo|namaste|नमस्ते|こんにちは|你好|안녕|مرحبا|ciao|привет)/i.test(input.trim()))
    return `Hello! I'm ${brand} AI. How can I help you today? Feel free to ask about our services, pricing, or starting a project.`;
  if (/thanks|thank you|gracias|merci|धन्यवाद|ありがとう|谢谢/i.test(lower))
    return "You're welcome! Is there anything else I can assist you with?";
  if (/service|build|create|develop|make/i.test(lower))
    return `${brand} offers premium services spanning websites, AI systems, Discord bots, and custom automation. What are you looking to build?`;
  if (/price|cost|how much|pricing|budget/i.test(lower))
    return "We have flexible pricing tiers starting at an accessible entry point through to fully custom enterprise solutions. Check the **Pricing** tab above or scroll to our pricing section for details.";
  if (/contact|hire|start|project|team/i.test(lower))
    return `Ready to collaborate? Switch to the **Connect** tab to share your details, and the ${brand} team will reach out within 24 hours.`;
  if (/who|about|company|founder/i.test(lower))
    return `${brand} is an elite AI agency delivering high-performance digital products — from complex AI systems to beautiful, fast websites. Trusted by clients worldwide.`;
  return `I'm here to help with anything about ${brand}. Try asking about our services, pricing, or how to get started with your project!`;
}
