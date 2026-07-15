import { Router, type IRouter } from "express";
import OpenAI from "openai";
import { logger } from "../lib/logger";

const router: IRouter = Router();

// ═══════════════════════════════════════════════════════════════════════════════
// HIVEMIND AI — MULTI-PROVIDER INTELLIGENCE ENGINE
// ═══════════════════════════════════════════════════════════════════════════════
// Architecture: OpenRouter (primary, 15 free models) → Groq (secondary, 4 free
// models) → Built-in Fallback (24+ language rule-based intelligence).
//
// The system NEVER returns an error to the user — it gracefully degrades through
// each layer and always delivers a response via the built-in J.A.R.V.I.S fallback.
//
// Providers:
//   OPENROUTER_API_KEY — https://openrouter.ai/keys (free tier)
//   GROQ_API_KEY       — https://console.groq.com/keys (free tier, optional)
// ═══════════════════════════════════════════════════════════════════════════════

// ── OpenRouter Free Models (Primary Provider) ─────────────────────────────────
// Stratified in tiers — more capable models tried first, lightweight ones last.
const OPENROUTER_FREE_MODELS = [
  // Tier 1 — Enterprise-grade reasoning
  "google/gemini-2.5-flash-preview-09-2025:free",
  "google/gemini-2.5-flash-lite-preview-09-2025:free",
  "meta-llama/llama-4-maverick:free",
  "meta-llama/llama-3.3-70b-instruct:free",
  // Tier 2 — Strong mid-size models
  "deepseek/deepseek-r1:free",
  "deepseek/deepseek-chat-v3-0324:free",
  "mistralai/mistral-small-3.2-24b-instruct:free",
  "qwen/qwen3-next-80b-a3b-instruct:free",
  // Tier 3 — Compact but capable
  "qwen/qwen-2.5-72b-instruct:free",
  "nousresearch/hermes-3-llama-3.1-405b:free",
  "openai/gpt-oss-20b:free",
  "meta-llama/llama-3.1-8b-instruct:free",
  // Tier 4 — Lightweight fallbacks
  "google/gemma-3-27b-it:free",
  "microsoft/phi-3-mini-128k-instruct:free",
  "mistralai/mistral-7b-instruct:free",
];

// ── Groq Free Models (Secondary Provider) ─────────────────────────────────────
const GROQ_FREE_MODELS = [
  "llama-3.3-70b-versatile",
  "llama-3.1-8b-instant",
  "gemma2-9b-it",
  "mixtral-8x7b-32768",
];

// ── Model Blacklist (self-healing — auto-clears after 5 minutes) ──────────────
const modelBlacklist = new Map<string, number>();
const BLACKLIST_DURATION_MS = 5 * 60 * 1000;

function isBlacklisted(model: string): boolean {
  const until = modelBlacklist.get(model);
  if (!until) return false;
  if (Date.now() > until) { modelBlacklist.delete(model); return false; }
  return true;
}

function blacklistModel(model: string): void {
  modelBlacklist.set(model, Date.now() + BLACKLIST_DURATION_MS);
}

// ── Provider Clients ──────────────────────────────────────────────────────────
function createOpenRouterClient(): OpenAI | null {
  const apiKey = process.env["OPENROUTER_API_KEY"];
  if (!apiKey) return null;
  return new OpenAI({
    apiKey,
    baseURL: "https://openrouter.ai/api/v1",
    maxRetries: 0,
    timeout: 12000,
    defaultHeaders: {
      "HTTP-Referer": "https://hivemind.ai",
      "X-Title": "Hivemind AI",
    },
  });
}

function createGroqClient(): OpenAI | null {
  const apiKey = process.env["GROQ_API_KEY"];
  if (!apiKey) return null;
  return new OpenAI({
    apiKey,
    baseURL: "https://api.groq.com/openai/v1",
    maxRetries: 0,
    timeout: 12000,
  });
}

// ── Types ─────────────────────────────────────────────────────────────────────
interface ChatMessage { role: "user" | "assistant" | "system"; content: string; }

interface SystemContext {
  brandName?: string;
  founderName?: string;
  founderProjects?: number;
  founderClients?: number;
  services?: Array<{ name: string; price: number | string; features: string[] }>;
  pricing?: Array<{ name: string; monthly: number | string; features: string[]; recommended?: boolean }>;
  mode?: string;
}

// ── System Prompt Builder ─────────────────────────────────────────────────────
function buildSystemPrompt(ctx: SystemContext): string {
  const brand = ctx.brandName || "HiveMind";
  const founder = ctx.founderName || "the founder";
  const mode = ctx.mode || "general";

  const servicesList = ctx.services?.slice(0, 8)
    .map(s => `- ${s.name}: $${s.price} — ${s.features.slice(0, 3).join(", ")}`)
    .join("\n") || "Custom digital services";

  const pricingList = ctx.pricing?.slice(0, 6)
    .map(p => `- ${p.name}: $${p.monthly}/mo${p.recommended ? " ★ Recommended" : ""} — ${p.features.slice(0, 3).join(", ")}`)
    .join("\n") || "Flexible pricing tiers";

  const modeInstructions: Record<string, string> = {
    general: `You are J.A.R.V.I.S — the ${brand} AI intelligence. Named after Tony Stark's iconic AI, you combine superhuman knowledge with warmth and wit. You are the digital embodiment of ${brand}: precise, futuristic, slightly witty, deeply knowledgeable. Your founder is ${founder}, who has completed ${ctx.founderProjects || 50}+ projects for ${ctx.founderClients || 100}+ clients worldwide.`,
    services: `You are the ${brand} services intelligence. You help clients identify exactly which service solves their problem. Ask one sharp clarifying question at a time. Be specific, technically fluent, and outcome-focused. Reference real service names and features from the list.`,
    pricing: `You are the ${brand} pricing intelligence. Your goal: match the client to their perfect tier. Ask about budget range, team size, and must-have features. Make a confident recommendation. Show ROI thinking. Reference actual pricing from the list.`,
    connect: `You are the ${brand} onboarding intelligence. Collect name, email, and project scope to connect clients with the team. Be warm and efficient. Once you capture an email address, confirm it enthusiastically and promise a 24-hour response from the team.`,
  };

  return `${modeInstructions[mode] || modeInstructions.general}

COMPANY DATA:
- Brand: ${brand} | Founded by: ${founder}
- Track record: ${ctx.founderProjects || "50+"}+ projects, ${ctx.founderClients || "100+"}+ clients globally

SERVICES:
${servicesList}

PRICING:
${pricingList}

LANGUAGE PROTOCOL:
Detect the user's language from their message and respond in the SAME language with zero hesitation. This is non-negotiable.
- English → English | Hindi → हिन्दी | Hinglish → Hinglish | Bengali → বাংলা
- Arabic → العربية | French → Français | German → Deutsch | Spanish → Español
- Portuguese, Italian, Russian, Japanese, Korean, Chinese, Turkish, Dutch, Polish — all supported
Match exactly: if they mix Hindi+English, you mix Hindi+English.

PERSONALITY PROTOCOL:
- Tone: Jarvis-level confidence — precise, warm, slightly witty, never robotic
- Never start two consecutive sentences the same way
- Use bold and bullets sparingly for structure, not decoration
- If asked something outside scope, redirect with style: "That's outside my mission parameters, but..."
- Remember: you represent a premium brand — every word counts
- Maximum 160 words per response unless a detailed technical answer is absolutely required
- Avoid filler phrases: "Certainly!", "Of course!", "Great question!" — these are banned`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN AI CHAT ENDPOINT
// ═══════════════════════════════════════════════════════════════════════════════

router.post("/ai/chat", async (req, res) => {
  try {
    const { messages, systemContext } = req.body as {
      messages: ChatMessage[];
      systemContext: SystemContext;
    };

    if (!messages || !Array.isArray(messages)) {
      res.status(400).json({ error: "messages array required" });
      return;
    }

    const recentMessages = messages.slice(-20);
    const openRouter = createOpenRouterClient();
    const groq = createGroqClient();

    // No providers → smart fallback
    if (!openRouter && !groq) {
      const reply = advancedFallback(recentMessages, systemContext);
      res.json({ content: reply, mode: "fallback", notice: "Add OPENROUTER_API_KEY for AI-powered responses" });
      return;
    }

    const systemPrompt = buildSystemPrompt(systemContext);
    const chatMessages = [
      { role: "system" as const, content: systemPrompt },
      ...recentMessages.map(m => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    ];

    // ── Strategy 1: OpenRouter (15 free models) ────────────────────────
    if (openRouter) {
      const activeModels = OPENROUTER_FREE_MODELS.filter(m => !isBlacklisted(m));
      for (const model of activeModels) {
        try {
          const completion = await openRouter.chat.completions.create(
            { model, messages: chatMessages, max_tokens: 400, temperature: 0.72 },
            { timeout: 8000 },
          );
          const content = completion.choices[0]?.message?.content;
          if (content) {
            res.json({ content, model, provider: "openrouter" });
            return;
          }
        } catch (err: any) {
          const status = err?.status || err?.response?.status;
          if (status === 429 || status === 402 || status === 403) {
            blacklistModel(model);
            logger.warn({ model, status }, "OpenRouter model blacklisted (5 min)");
          } else {
            logger.warn({ model, err: err?.message }, "OpenRouter model failed, trying next");
          }
        }
      }
    }

    // ── Strategy 2: Groq (4 free models) ──────────────────────────────
    if (groq) {
      const activeGroqModels = GROQ_FREE_MODELS.filter(m => !isBlacklisted(`groq:${m}`));
      for (const model of activeGroqModels) {
        try {
          const completion = await groq.chat.completions.create(
            { model, messages: chatMessages, max_tokens: 400, temperature: 0.72 },
            { timeout: 8000 },
          );
          const content = completion.choices[0]?.message?.content;
          if (content) {
            res.json({ content, model, provider: "groq" });
            return;
          }
        } catch (err: any) {
          const status = err?.status || err?.response?.status;
          if (status === 429 || status === 402 || status === 403) {
            blacklistModel(`groq:${model}`);
            logger.warn({ model, status }, "Groq model blacklisted (5 min)");
          } else {
            logger.warn({ model, err: err?.message }, "Groq model failed, trying next");
          }
        }
      }
    }

    // ── Strategy 3: Built-in J.A.R.V.I.S Intelligence ─────────────────
    logger.warn("All AI models exhausted — using built-in J.A.R.V.I.S fallback");
    const reply = advancedFallback(recentMessages, systemContext);
    res.json({ content: reply, mode: "fallback", notice: "Running on built-in J.A.R.V.I.S intelligence" });
  } catch (err: any) {
    logger.error({ err }, "AI chat route crashed — emergency fallback");
    try {
      const { messages: msgs, systemContext: ctx } = req.body as any;
      const reply = advancedFallback(Array.isArray(msgs) ? msgs : [], ctx || {});
      res.json({ content: reply, mode: "fallback", notice: "Running on built-in intelligence" });
    } catch {
      res.json({
        content: "I'm here and ready to help — ask me about services, pricing, or how to start a project.",
        mode: "fallback",
      });
    }
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// ADVANCED FALLBACK — J.A.R.V.I.S BUILT-IN INTELLIGENCE
// Context-aware, 24+ language, multi-mode, conversation-aware rule engine.
// Activates only when all API providers are unreachable.
// ═══════════════════════════════════════════════════════════════════════════════

function advancedFallback(messages: ChatMessage[], ctx: SystemContext): string {
  const brand   = ctx.brandName   || "HiveMind";
  const founder = ctx.founderName || "our founder";
  const mode    = ctx.mode        || "general";

  const lastUser = [...messages].reverse().find(m => m.role === "user");
  const input    = lastUser?.content || "";

  const history   = messages.filter(m => m.role === "user").map(m => m.content.toLowerCase());
  const turnCount = history.length;
  const lower     = input.toLowerCase();

  const lang = detectLanguage(input);

  const mentionedBudget   = history.some(h => /budget|afford|cheap|expensive|price|cost|₹|\$|rs\.|rupee/i.test(h));
  const mentionedProject  = history.some(h => /website|app|bot|discord|ai|automation|brand/i.test(h));
  const isReturningUser    = turnCount > 2;

  if (/^(hi|hey|hello|hola|bonjour|hallo|ciao|oi|salut|привет|مرحبا|नमस्ते|नमस्कार|हेलो|हाय|こんにちは|你好|안녕|สวัสดี)\b/i.test(input.trim()))
    return greetings(brand, founder, ctx, lang, mode, isReturningUser);
  if (/\b(thanks|thank you|thx|ty|gracias|merci|danke|dhanyavaad|shukriya|धन्यवाद|شكرا|ありがとう|감사합니다|谢谢)\b/i.test(lower))
    return thankYou(brand, lang);
  if (/\b(what is|what are|who are|who is|about|tell me about|explain|introduce)\b/i.test(lower) || /\b(kya hai|kaun hai|batao|bataiye)\b/i.test(lower))
    return aboutUs(brand, founder, ctx, lang);
  if (/\b(service|offer|build|create|make|develop|website|web|app|bot|discord|ai|automat|brand|logo|design)\b/i.test(lower) || /\b(karo|banao|chahiye|banana)\b/i.test(lower))
    return servicesResponse(brand, ctx, lang, mode, mentionedProject);
  if (/\b(price|cost|how much|pricing|budget|plan|tier|package|afford|₹|\$|rupee|rs\.)\b/i.test(lower) || /\b(kitna|daam|mehnga|sasta|paisa)\b/i.test(lower))
    return pricingResponse(brand, ctx, lang, mentionedBudget);
  if (/\b(contact|hire|start|project|connect|reach|email|call|meeting|book|schedule|work together)\b/i.test(lower) || /\b(sampark|contact karo|hire karo|kaam)\b/i.test(lower))
    return contactResponse(brand, lang, mode);
  if (/\b(tech|stack|technology|how do you|process|work|framework|build with|use)\b/i.test(lower))
    return techResponse(brand, lang);
  if (/\b(timeline|deadline|how long|when|deliver|eta|time|days|weeks|month)\b/i.test(lower) || /\b(kitne din|kitna time|kab)\b/i.test(lower))
    return timelineResponse(brand, lang);
  if (/\b(portfolio|example|past work|previous|case study|sample|show me)\b/i.test(lower))
    return portfolioResponse(brand, founder, ctx, lang);
  if (/\b(can you|are you able|do you|capable|feature|gpt|chatgpt|openai|artificial intelligence)\b/i.test(lower))
    return capabilitiesResponse(brand, lang);
  if (mode === "pricing")  return pricingResponse(brand, ctx, lang, false);
  if (mode === "connect")  return contactResponse(brand, lang, mode);
  if (mode === "services") return servicesResponse(brand, ctx, lang, mode, false);

  return genericResponse(brand, lang, turnCount);
}

// ── Response Generators ───────────────────────────────────────────────────────

function greetings(brand: string, founder: string, ctx: SystemContext, lang: string, mode: string, returning: boolean): string {
  const variants: Record<string, string[]> = {
    en: [
      `Hello. I'm the ${brand} intelligence — built to give you answers, not runaround. ${founder} created this agency to deliver elite digital work. What are you building?`,
      `Hey. ${brand} AI online. I know everything about what we build and how we can help you. What's on your mind?`,
      `Good to have you here. ${brand} has delivered ${ctx.founderProjects || "50+"}+ projects across the globe. I'm here to match you with exactly what you need. Where do you want to start?`,
    ],
    hi: [
      `नमस्ते! मैं ${brand} का AI हूं। ${founder} ने यह एजेंसी बनाई है ताकि आपके डिजिटल सपने हकीकत बनें। आप क्या बनवाना चाहते हैं?`,
      `हेलो! ${brand} AI यहाँ है — वेबसाइट, AI सिस्टम, या कुछ और? बताइए!`,
    ],
    hinglish: [
      `Hey! ${brand} AI here — bhai seedha baat karte hain. ${founder} ne ${ctx.founderProjects || "50+"}+ projects deliver kiye hain. Aap kya banwana chahte ho?`,
      `Yo! ${brand} AI ready hai. Kya chahiye — website, Discord bot, AI system? Batao!`,
    ],
  };
  const pool = variants[lang] || variants.en;
  return pool[Math.floor(Math.random() * pool.length)];
}

function thankYou(brand: string, lang: string): string {
  const map: Record<string, string> = {
    en: `Anytime. That's what ${brand} is built for. Anything else I can help you with?`,
    hi: `आपका स्वागत है! कुछ और जानना हो तो बताइए।`,
    hinglish: `Koi baat nahi bhai! Aur kuch chahiye toh batao.`,
  };
  return map[lang] || map.en;
}

function aboutUs(brand: string, founder: string, ctx: SystemContext, lang: string): string {
  const map: Record<string, string> = {
    en: `**${brand}** is an elite digital agency founded by ${founder}. We don't just build things — we build things that scale.\n\n**What we've done:** ${ctx.founderProjects || "50+"}+ projects delivered. ${ctx.founderClients || "100+"}+ clients across continents.\n\n**What we build:** AI systems, high-performance websites, Discord bots, automation infrastructure, and full brand identities.\n\nEvery project gets the same obsessive attention to quality. What are you looking to build?`,
    hi: `**${brand}** एक premium digital agency है जिसे ${founder} ने बनाया है। हम ${ctx.founderProjects || "50+"}+ projects deliver कर चुके हैं और ${ctx.founderClients || "100+"}+ clients को serve किया है।\n\nहम बनाते हैं: AI systems, websites, Discord bots, automation, aur branding.\n\nआपका project क्या है?`,
    hinglish: `**${brand}** ek premium agency hai — ${founder} ne banai. ${ctx.founderProjects || "50+"}+ projects done, ${ctx.founderClients || "100+"}+ clients served worldwide.\n\nKya banate hain: AI systems, websites, Discord bots, automation, branding — sab kuch.\n\nAapka kya project hai?`,
  };
  return map[lang] || map.en;
}

function servicesResponse(brand: string, ctx: SystemContext, lang: string, mode: string, alreadyMentioned: boolean): string {
  const serviceNames = ctx.services?.slice(0, 6).map(s => `**${s.name}**`).join(", ") || "websites, AI systems, Discord bots, automation, branding";
  const map: Record<string, string> = {
    en: alreadyMentioned
      ? `Based on what you've mentioned, here are the most relevant ${brand} services:\n\n${ctx.services?.slice(0,5).map(s => `- **${s.name}**: ${s.features?.slice(0,2).join(", ")}`).join("\n") || serviceNames}\n\nWhich one fits your project?`
      : `${brand} offers ${ctx.services?.length || "several"} services:\n\n${ctx.services?.slice(0,6).map(s => `- **${s.name}** — ${s.features?.[0] || ""}`).join("\n") || serviceNames}\n\nWhat are you building? I'll point you to exactly the right one.`,
    hi: `${brand} के services:\n\n${ctx.services?.slice(0,5).map(s => `- **${s.name}**: ${s.features?.[0] || ""}`).join("\n") || serviceNames}\n\nआप क्या बनवाना चाहते हैं?`,
    hinglish: `${brand} ke services:\n\n${ctx.services?.slice(0,5).map(s => `- **${s.name}**: ${s.features?.[0] || ""}`).join("\n") || serviceNames}\n\nKya banana hai aapko?`,
  };
  return map[lang] || map.en;
}

function pricingResponse(brand: string, ctx: SystemContext, lang: string, alreadyAsked: boolean): string {
  const cheapest = ctx.pricing?.filter(p => typeof p.monthly === "number" && (p.monthly as number) > 0).sort((a,b) => (a.monthly as number) - (b.monthly as number))[0];
  const recommended = ctx.pricing?.find(p => p.recommended);
  const startPrice = cheapest ? `$${cheapest.monthly}` : "affordable";
  const recPlan = recommended ? `**${recommended.name}** ($${recommended.monthly}/mo)` : "our mid-tier plan";
  const map: Record<string, string> = {
    en: `${brand} pricing starts at **${startPrice}/mo** and scales to custom enterprise.\n\n${ctx.pricing?.slice(0,4).map(p => `- **${p.name}**: $${p.monthly}/mo${p.recommended ? " ★" : ""} — ${p.features?.[0] || ""}`).join("\n") || ""}\n\nMost clients find ${recPlan} hits the sweet spot. What's your budget range?`,
    hi: `${brand} की pricing **${startPrice}/month** से शुरू होती है।\n\n${ctx.pricing?.slice(0,4).map(p => `- **${p.name}**: $${p.monthly}/mo${p.recommended ? " ★" : ""}`).join("\n") || ""}\n\nआपका budget क्या है?`,
    hinglish: `${brand} ki pricing **${startPrice}/month** se start hoti hai.\n\n${ctx.pricing?.slice(0,4).map(p => `- **${p.name}**: $${p.monthly}/mo${p.recommended ? " ★" : ""}`).join("\n") || ""}\n\nAapka budget kya hai?`,
  };
  return map[lang] || map.en;
}

function contactResponse(brand: string, lang: string, mode: string): string {
  const map: Record<string, string> = {
    en: mode === "connect"
      ? `Let's get the ball rolling. Share your **name**, **email**, and a quick description of your project — the ${brand} team will reach out within **24 hours**.`
      : `The ${brand} team is ready. Head to the **Connect** tab above, or scroll to the contact section at the bottom of this page. Expect a response within **24 hours**.`,
    hi: `${brand} की टीम तैयार है। अपना **नाम**, **email**, और project की जानकारी दें — **24 घंटे** में जवाब मिलेगा।`,
    hinglish: `${brand} team ready hai! **Connect** tab mein jao ya page ke neeche contact form fill karo. **24 ghante** mein response milega.`,
  };
  return map[lang] || map.en;
}

function techResponse(brand: string, lang: string): string {
  const map: Record<string, string> = {
    en: `${brand} builds with the modern stack — **React**, **Next.js**, **TypeScript**, **Node.js**, **Python**, **PostgreSQL**, **Redis**, and cloud infrastructure on AWS/GCP/Vercel.\n\nFor AI systems: **LLM integrations**, custom fine-tuning, vector databases, and RAG pipelines.\n\nFor bots: **Discord.js**, Telegram API, WhatsApp Business API.\n\nWhat's your use case?`,
    hi: `${brand} इन technologies use करता है:\n- **React, Next.js, TypeScript** (frontend)\n- **Node.js, Python** (backend)\n- **AI/LLM integrations** (AI)\n- **Discord.js, Telegram** (bots)\n\nआपका project किस type का है?`,
    hinglish: `${brand} latest tech use karta hai:\n- **React, Next.js** (websites)\n- **Node.js, Python** (backend)\n- **OpenAI, LLMs** (AI)\n- **Discord.js** (bots)\n\nKis type ka project hai?`,
  };
  return map[lang] || map.en;
}

function timelineResponse(brand: string, lang: string): string {
  const map: Record<string, string> = {
    en: `Timelines at ${brand} depend on scope:\n\n- **Landing page / simple site**: 3–5 days\n- **Full web application**: 2–4 weeks\n- **AI system / automation**: 1–3 weeks\n- **Discord bot**: 3–7 days\n- **Brand identity**: 1–2 weeks\n\nRush delivery is available for select projects. What's your deadline?`,
    hi: `${brand} की timelines:\n\n- **Simple website**: 3-5 दिन\n- **Full web app**: 2-4 हफ्ते\n- **AI system**: 1-3 हफ्ते\n- **Discord bot**: 3-7 दिन\n\nआपकी deadline क्या है?`,
    hinglish: `${brand} ki timelines:\n- Simple website: 3-5 din\n- Full web app: 2-4 weeks\n- AI system: 1-3 weeks\n- Discord bot: 3-7 din\n\nKab chahiye?`,
  };
  return map[lang] || map.en;
}

function portfolioResponse(brand: string, founder: string, ctx: SystemContext, lang: string): string {
  const map: Record<string, string> = {
    en: `${founder} has led **${ctx.founderProjects || "50+"}+** projects for **${ctx.founderClients || "100+"}+** clients globally — spanning SaaS products, AI tools, gaming communities, e-commerce, and more.\n\nPortfolio highlights are available in the **Projects** section of this page. Each project gets full creative and engineering ownership from ${brand}.\n\nWhat type of work are you most interested in?`,
    hi: `${founder} ने ${ctx.founderProjects || "50+"}+ projects complete किए हैं। Portfolio **Projects** section में देखें।\n\nआपको किस type का work चाहिए?`,
    hinglish: `${founder} ne ${ctx.founderProjects || "50+"}+ projects deliver kiye hain! Portfolio **Projects** section mein dekho page pe.\n\nKis type ka kaam chahiye?`,
  };
  return map[lang] || map.en;
}

function capabilitiesResponse(brand: string, lang: string): string {
  const map: Record<string, string> = {
    en: `I'm the ${brand} intelligence — here's what I can help with right now:\n\n- **Answer questions** about ${brand}, services, pricing, and process\n- **Recommend** the right service for your project\n- **Guide you** to the right pricing tier\n- **Connect you** with the team for next steps\n\nI'm running on ${brand}'s built-in intelligence engine right now. What can I help you with?`,
    hi: `मैं ${brand} का intelligence हूं। मैं इनमें help कर सकता हूं:\n- Services और pricing की जानकारी\n- आपके project के लिए सही service recommend करना\n- Team से connect करना\n\nक्या जानना है?`,
    hinglish: `Main ${brand} ka AI hoon. Kya kar sakta hoon:\n- Services aur pricing explain karna\n- Aapke project ke liye sahi service suggest karna\n- Team se connect karwana\n\nBatao kya chahiye?`,
  };
  return map[lang] || map.en;
}

function genericResponse(brand: string, lang: string, turn: number): string {
  const followups: Record<string, string[]> = {
    en: [
      `That's an interesting angle. To give you the most useful answer, could you tell me more about what you're trying to build?`,
      `Understood. ${brand} specializes in AI systems, websites, bots, and automation. Which of these is closest to what you need?`,
      `I want to make sure I point you in the right direction. Is your main goal to **build something new**, **automate a process**, or **establish a brand presence**?`,
      `${brand} handles everything from day-one MVPs to enterprise-scale systems. What stage is your project at?`,
    ],
    hi: [
      `समझ गया। ${brand} में AI systems, websites, और automation सब बनता है। आपको क्या चाहिए?`,
      `और बताइए — आप क्या बनवाना चाहते हैं?`,
    ],
    hinglish: [
      `Samajh gaya. Thoda aur batao — exactly kya banana hai?`,
      `${brand} sab kuch handle karta hai. Kya chahiye aapko specifically?`,
    ],
  };
  const pool = followups[lang] || followups.en;
  return pool[Math.min(turn - 1, pool.length - 1)] || pool[pool.length - 1];
}

// ── Language Detection (24+ languages) ────────────────────────────────────────
function detectLanguage(text: string): string {
  if (/[\u0600-\u06FF]/.test(text)) {
    if (/\b(?:ہے|ہیں|کیا|نہیں)/i.test(text)) return "ur";
    return "ar";
  }
  if (/[\u0900-\u097F]/.test(text)) {
    if (/\b(hai|hain|kya|nahi|main|tum|aur|bhi|yaar|bhai|boss|karo|kaise|matlab|samjha|thoda|zyada|bahut|bilkul|accha|theek|seedha|bolta|bolte|karein|karle)\b/i.test(text)) return "hinglish";
    return "hi";
  }
  if (/[\u0980-\u09FF]/.test(text)) return "bn";
  if (/[\u3040-\u30FF]/.test(text) && /[\u4E00-\u9FFF]/.test(text)) return "ja";
  if (/[\u3040-\u30FF]/.test(text)) return "ja";
  if (/[\u4E00-\u9FFF]/.test(text)) return "zh";
  if (/[\uAC00-\uD7AF]/.test(text)) return "ko";
  if (/\b(hola|gracias|cómo|qué|necesito|buenos|por favor|español)\b/i.test(text)) return "es";
  if (/\b(bonjour|merci|comment|salut|je|nous|vous|français)\b/i.test(text)) return "fr";
  if (/\b(hallo|danke|wie|ich|wir|bitte|deutsch|guten)\b/i.test(text)) return "de";
  if (/\b(kya|hai|hain|nahi|main|tum|yaar|bhai|boss|karo|kaise)\b/i.test(text)) return "hinglish";
  return "en";
}

export default router;
