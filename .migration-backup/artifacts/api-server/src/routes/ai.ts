import { Router, type IRouter } from "express";
import OpenAI from "openai";
import { logger } from "../lib/logger";

const router: IRouter = Router();

// AI provider: OpenRouter (OpenAI-compatible API), configured via OPENROUTER_API_KEY.
// Uses free-tier models so the assistant works without requiring paid credits.
// Multiple models are tried in order since individual free models can be
// transiently rate-limited upstream by their hosting provider.
const AI_MODELS = [
  "meta-llama/llama-3.3-70b-instruct:free",
  "openai/gpt-oss-20b:free",
  "qwen/qwen3-next-80b-a3b-instruct:free",
];

const openai = process.env["OPENROUTER_API_KEY"]
  ? new OpenAI({
      apiKey: process.env["OPENROUTER_API_KEY"],
      baseURL: "https://openrouter.ai/api/v1",
      defaultHeaders: {
        "HTTP-Referer": "https://hivemind.ai",
        "X-Title": "Hivemind AI",
      },
    })
  : null;

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

interface SystemContext {
  brandName?: string;
  founderName?: string;
  founderProjects?: number;
  founderClients?: number;
  services?: Array<{ name: string; price: number | string; features: string[] }>;
  pricing?: Array<{ name: string; monthly: number | string; features: string[]; recommended?: boolean }>;
  mode?: string;
}

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

    if (!openai) {
      const reply = advancedFallback(recentMessages, systemContext);
      res.json({ content: reply, mode: "fallback" });
      return;
    }

    const systemPrompt = buildSystemPrompt(systemContext);
    const chatMessages = [
      { role: "system" as const, content: systemPrompt },
      ...recentMessages.map(m => ({ role: m.role as "user" | "assistant", content: m.content })),
    ];

    let lastErr: any;
    for (const model of AI_MODELS) {
      try {
        const completion = await openai.chat.completions.create({
          model,
          messages: chatMessages,
          max_tokens: 400,
          temperature: 0.72,
        });

        const content = completion.choices[0]?.message?.content || "Processing anomaly detected. Please try again.";
        res.json({ content, model });
        return;
      } catch (err: any) {
        lastErr = err;
        const msg = err?.message || "";
        const isRateLimited = msg.includes("429") || msg.includes("rate");
        logger.error({ err, model }, "AI chat completion failed for model, trying next");
        if (!isRateLimited) break; // non-rate-limit errors (auth, etc.) won't be fixed by switching models
      }
    }

    // All models failed — fall back to the built-in rule-based responder.
    const msg = lastErr?.message || "";
    const isQuota = msg.includes("quota") || msg.includes("billing") || msg.includes("429") || msg.includes("insufficient") || msg.includes("rate");
    const isKey   = msg.includes("401") || msg.includes("Unauthorized") || msg.includes("auth");

    if (isQuota || isKey) {
      const { messages: msgs, systemContext: ctx } = req.body;
      const reply = advancedFallback(msgs || [], ctx || {});
      res.json({ content: reply, mode: "fallback", notice: "Running on built-in intelligence" });
    } else {
      res.status(500).json({ error: "Intelligence core error", details: msg });
    }
  } catch (err: any) {
    logger.error({ err }, "AI chat route error");
    res.status(500).json({ error: "Intelligence core error", details: err?.message || "" });
  }
});

// ── Advanced Fallback Intelligence ─────────────────────────────────────────
// Context-aware, Jarvis-personality, multi-language, conversation-aware

function advancedFallback(messages: ChatMessage[], ctx: SystemContext): string {
  const brand   = ctx.brandName   || "HiveMind";
  const founder = ctx.founderName || "our founder";
  const mode    = ctx.mode        || "general";

  // Get the last user message
  const lastUser = [...messages].reverse().find(m => m.role === "user");
  const input    = lastUser?.content || "";

  // Get conversation history for context
  const history  = messages.filter(m => m.role === "user").map(m => m.content.toLowerCase());
  const turnCount = history.length;
  const lower    = input.toLowerCase();

  // ── Language detection ────────────────────────────────────
  const lang = detectLanguage(input);

  // ── Context signals from conversation history ─────────────
  const mentionedBudget   = history.some(h => /budget|afford|cheap|expensive|price|cost|₹|\$|rs\.|rupee/i.test(h));
  const mentionedProject  = history.some(h => /website|app|bot|discord|ai|automation|brand/i.test(h));
  const mentionedContact  = history.some(h => /email|contact|reach|hire|start|call|meeting/i.test(h));
  const isReturningUser   = turnCount > 2;

  // ── Greeting responses ────────────────────────────────────
  if (/^(hi|hey|hello|hola|bonjour|hallo|ciao|oi|salut|привет|مرحبا|नमस्ते|नमस्कार|हेलो|हाय|こんにちは|你好|안녕|สวัสดี)\b/i.test(input.trim())) {
    return greetings(brand, founder, ctx, lang, mode, isReturningUser);
  }

  // ── Gratitude ─────────────────────────────────────────────
  if (/\b(thanks|thank you|thx|ty|gracias|merci|danke|dhanyavaad|shukriya|धन्यवाद|شكرا|ありがとう|감사합니다|谢谢)\b/i.test(lower)) {
    return thankYou(brand, lang);
  }

  // ── What is this / about ──────────────────────────────────
  if (/\b(what is|what are|who are|who is|about|tell me about|explain|introduce)\b/i.test(lower) ||
      /\b(kya hai|kaun hai|batao|bataiye)\b/i.test(lower)) {
    return aboutUs(brand, founder, ctx, lang);
  }

  // ── Services ──────────────────────────────────────────────
  if (/\b(service|offer|build|create|make|develop|website|web|app|bot|discord|ai|automat|brand|logo|design)\b/i.test(lower) ||
      /\b(karo|banao|chahiye|banana|website|app)\b/i.test(lower)) {
    return servicesResponse(brand, ctx, lang, mode, mentionedProject);
  }

  // ── Pricing ───────────────────────────────────────────────
  if (/\b(price|cost|how much|pricing|budget|plan|tier|package|afford|₹|\$|rupee|rs\.)\b/i.test(lower) ||
      /\b(kitna|daam|mehnga|sasta|paisa|budget)\b/i.test(lower)) {
    return pricingResponse(brand, ctx, lang, mentionedBudget);
  }

  // ── Contact / start project ───────────────────────────────
  if (/\b(contact|hire|start|project|connect|reach|email|call|meeting|book|schedule|work together)\b/i.test(lower) ||
      /\b(sampark|contact karo|hire karo|kaam)\b/i.test(lower)) {
    return contactResponse(brand, lang, mode);
  }

  // ── Tech stack / how do you work ─────────────────────────
  if (/\b(tech|stack|technology|how do you|process|work|framework|build with|use)\b/i.test(lower)) {
    return techResponse(brand, lang);
  }

  // ── Timeline / deadline ───────────────────────────────────
  if (/\b(timeline|deadline|how long|when|deliver|eta|time|days|weeks|month)\b/i.test(lower) ||
      /\b(kitne din|kitna time|kab)\b/i.test(lower)) {
    return timelineResponse(brand, lang);
  }

  // ── Portfolio / examples ──────────────────────────────────
  if (/\b(portfolio|example|past work|previous|case study|sample|show me)\b/i.test(lower)) {
    return portfolioResponse(brand, founder, ctx, lang);
  }

  // ── AI capabilities ───────────────────────────────────────
  if (/\b(can you|are you able|do you|capable|feature|gpt|chatgpt|openai|artificial intelligence)\b/i.test(lower)) {
    return capabilitiesResponse(brand, lang);
  }

  // ── Mode-specific smart defaults ─────────────────────────
  if (mode === "pricing")  return pricingResponse(brand, ctx, lang, false);
  if (mode === "connect")  return contactResponse(brand, lang, mode);
  if (mode === "services") return servicesResponse(brand, ctx, lang, mode, false);

  // ── Generic intelligent response ─────────────────────────
  return genericResponse(brand, lang, turnCount);
}

// ── Response generators ────────────────────────────────────────────────────

function greetings(brand: string, founder: string, ctx: SystemContext, lang: string, mode: string, returning: boolean): string {
  const variants: Record<string, string[]> = {
    en: [
      `Hello. I'm the ${brand} intelligence — built to give you answers, not runaround. ${founder} created this agency to deliver elite digital work. What are you building?`,
      `Hey. ${brand} AI online. I know everything about what we build and how we can help you. What's on your mind?`,
      `Good to have you here. ${brand} has delivered ${ctx.founderProjects || "50+"}+ projects across the globe. I'm here to match you with exactly what you need. Where do you want to start?`,
    ],
    hi: [
      `नमस्ते! मैं ${brand} का AI हूं। ${founder} ने यह एजेंसी बनाई है ताकि आपके डिजिटल सपने हकीकत बनें। आप क्या बनवाना चाहते हैं?`,
      `हेलो! ${brand} AI यहाँ है। बताइए — वेबसाइट, AI सिस्टम, या कुछ और?`,
    ],
    hinglish: [
      `Hey! ${brand} AI here — bhai seedha baat karte hain. ${founder} ne ${ctx.founderProjects || "50+"}+ projects deliver kiye hain. Aap kya banwana chahte ho?`,
      `Yo! ${brand} AI ready hai. Kya chahiye — website, Discord bot, AI system? Batao!`,
    ],
    ar: [
      `مرحباً! أنا الذكاء الاصطناعي لـ ${brand}. كيف يمكنني مساعدتك اليوم؟`,
    ],
    fr: [
      `Bonjour ! Je suis l'IA de ${brand}. Comment puis-je vous aider aujourd'hui ?`,
    ],
    de: [
      `Hallo! Ich bin die KI von ${brand}. Wie kann ich Ihnen helfen?`,
    ],
    es: [
      `¡Hola! Soy la IA de ${brand}. ¿En qué puedo ayudarte hoy?`,
    ],
    ja: [
      `こんにちは！${brand} AIです。何かお手伝いできることはありますか？`,
    ],
    zh: [
      `你好！我是 ${brand} 的AI助手。有什么可以帮助您的？`,
    ],
    ko: [
      `안녕하세요! ${brand} AI입니다. 어떻게 도와드릴까요?`,
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
    ar: `على الرحب والسعة! هل هناك أي شيء آخر يمكنني مساعدتك به؟`,
    fr: `De rien ! Y a-t-il autre chose que je puisse faire pour vous ?`,
    de: `Gerne! Kann ich Ihnen sonst noch helfen?`,
    es: `¡De nada! ¿Hay algo más en lo que pueda ayudarte?`,
    ja: `どういたしまして！他に何かお手伝いできることはありますか？`,
    zh: `不客气！还有什么可以帮助您的吗？`,
    ko: `천만에요! 다른 도움이 필요하신가요?`,
  };
  return map[lang] || map.en;
}

function aboutUs(brand: string, founder: string, ctx: SystemContext, lang: string): string {
  const map: Record<string, string> = {
    en: `**${brand}** is an elite digital agency founded by ${founder}. We don't just build things — we build things that scale.\n\n**What we've done:** ${ctx.founderProjects || "50+"}+ projects delivered. ${ctx.founderClients || "100+"}+ clients across continents.\n\n**What we build:** AI systems, high-performance websites, Discord bots, automation infrastructure, and full brand identities.\n\nEvery project gets the same obsessive attention to quality. What are you looking to build?`,
    hi: `**${brand}** एक premium digital agency है जिसे ${founder} ने बनाया है। हम ${ctx.founderProjects || "50+"}+ projects deliver कर चुके हैं और ${ctx.founderClients || "100+"}+ clients को serve किया है।\n\nहम बनाते हैं: AI systems, websites, Discord bots, automation, aur branding.\n\nआपका project क्या है?`,
    hinglish: `**${brand}** ek premium agency hai — ${founder} ne banai. ${ctx.founderProjects || "50+"}+ projects done, ${ctx.founderClients || "100+"}+ clients served worldwide.\n\nKya banate hain: AI systems, websites, Discord bots, automation, branding — sab kuch.\n\nAapka kya project hai?`,
    ar: `**${brand}** وكالة رقمية متميزة أسسها ${founder}. لقد أتممنا ${ctx.founderProjects || "50+"}+ مشروعاً وخدمنا ${ctx.founderClients || "100+"}+ عميلاً.\n\nنبني: أنظمة ذكاء اصطناعي، مواقع إلكترونية، بوتات ديسكورد، وأنظمة أتمتة.\n\nما هو مشروعك؟`,
    fr: `**${brand}** est une agence digitale de premier plan fondée par ${founder}. Nous avons livré ${ctx.founderProjects || "50+"}+ projets pour ${ctx.founderClients || "100+"}+ clients.\n\nNous construisons : systèmes IA, sites web, bots Discord, automatisation, branding.\n\nQuel est votre projet ?`,
    es: `**${brand}** es una agencia digital de élite fundada por ${founder}. Hemos completado ${ctx.founderProjects || "50+"}+ proyectos para ${ctx.founderClients || "100+"}+ clientes.\n\nConstruimos: sistemas de IA, sitios web, bots de Discord, automatización, branding.\n\n¿Cuál es tu proyecto?`,
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
    ar: `خدمات ${brand}:\n\n${ctx.services?.slice(0,5).map(s => `- **${s.name}**: ${s.features?.[0] || ""}`).join("\n") || serviceNames}\n\nماذا تريد أن تبني؟`,
    fr: `Services de ${brand}:\n\n${ctx.services?.slice(0,5).map(s => `- **${s.name}**: ${s.features?.[0] || ""}`).join("\n") || serviceNames}\n\nQue souhaitez-vous construire ?`,
    es: `Servicios de ${brand}:\n\n${ctx.services?.slice(0,5).map(s => `- **${s.name}**: ${s.features?.[0] || ""}`).join("\n") || serviceNames}\n\n¿Qué quieres construir?`,
  };
  return map[lang] || map.en;
}

function pricingResponse(brand: string, ctx: SystemContext, lang: string, alreadyAsked: boolean): string {
  const cheapest = ctx.pricing
    ?.filter(p => typeof p.monthly === "number" && (p.monthly as number) > 0)
    .sort((a,b) => (a.monthly as number) - (b.monthly as number))[0];
  const recommended = ctx.pricing?.find(p => p.recommended);
  const startPrice = cheapest ? `$${cheapest.monthly}` : "affordable";
  const recPlan = recommended ? `**${recommended.name}** ($${recommended.monthly}/mo)` : "our mid-tier plan";

  const map: Record<string, string> = {
    en: `${brand} pricing starts at **${startPrice}/mo** and scales to custom enterprise.\n\n${ctx.pricing?.slice(0,4).map(p => `- **${p.name}**: $${p.monthly}/mo${p.recommended ? " ★" : ""} — ${p.features?.[0] || ""}`).join("\n") || ""}\n\nMost clients find ${recPlan} hits the sweet spot. What's your budget range?`,
    hi: `${brand} की pricing **${startPrice}/month** से शुरू होती है।\n\n${ctx.pricing?.slice(0,4).map(p => `- **${p.name}**: $${p.monthly}/mo${p.recommended ? " ★" : ""}`).join("\n") || ""}\n\nआपका budget क्या है?`,
    hinglish: `${brand} ki pricing **${startPrice}/month** se start hoti hai.\n\n${ctx.pricing?.slice(0,4).map(p => `- **${p.name}**: $${p.monthly}/mo${p.recommended ? " ★" : ""}`).join("\n") || ""}\n\nAapka budget kya hai?`,
    ar: `تبدأ أسعار ${brand} من **${startPrice}/شهر**.\n\n${ctx.pricing?.slice(0,4).map(p => `- **${p.name}**: $${p.monthly}/شهر${p.recommended ? " ★" : ""}`).join("\n") || ""}\n\nما هي ميزانيتك؟`,
    fr: `Les tarifs de ${brand} commencent à **${startPrice}/mois**.\n\n${ctx.pricing?.slice(0,4).map(p => `- **${p.name}**: $${p.monthly}/mois${p.recommended ? " ★" : ""}`).join("\n") || ""}\n\nQuel est votre budget ?`,
    es: `Los precios de ${brand} comienzan en **${startPrice}/mes**.\n\n${ctx.pricing?.slice(0,4).map(p => `- **${p.name}**: $${p.monthly}/mes${p.recommended ? " ★" : ""}`).join("\n") || ""}\n\n¿Cuál es tu presupuesto?`,
  };
  return map[lang] || map.en;
}

function contactResponse(brand: string, lang: string, mode: string): string {
  const map: Record<string, string> = {
    en: mode === "connect"
      ? `Let's get the ball rolling. Share your **name**, **email**, and a quick description of your project — the ${brand} team will reach out within **24 hours**.\n\nAlternatively, scroll down to the contact form on this page.`
      : `The ${brand} team is ready. Head to the **Connect** tab above, or scroll to the contact section at the bottom of this page. Expect a response within **24 hours**.`,
    hi: `${brand} की टीम तैयार है। अपना **नाम**, **email**, और project की जानकारी दें — **24 घंटे** में जवाब मिलेगा।`,
    hinglish: `${brand} team ready hai! **Connect** tab mein jao ya page ke neeche contact form fill karo. **24 ghante** mein response milega.`,
    ar: `فريق ${brand} جاهز. أرسل **اسمك** و**بريدك الإلكتروني** ووصفاً لمشروعك — سيردون خلال **24 ساعة**.`,
    fr: `L'équipe ${brand} est prête. Partagez votre **nom**, **email** et une description de votre projet — réponse sous **24 heures**.`,
    es: `El equipo de ${brand} está listo. Comparte tu **nombre**, **email** y una descripción del proyecto — respuesta en **24 horas**.`,
  };
  return map[lang] || map.en;
}

function techResponse(brand: string, lang: string): string {
  const map: Record<string, string> = {
    en: `${brand} builds with the modern stack — **React**, **Next.js**, **TypeScript**, **Node.js**, **Python**, **PostgreSQL**, **Redis**, and cloud infrastructure on AWS/GCP/Vercel.\n\nFor AI systems: **LLM integrations**, custom fine-tuning, vector databases, and RAG pipelines.\n\nFor bots: **Discord.js**, Telegram API, WhatsApp Business API.\n\nWhat's your use case?`,
    hi: `${brand} इन technologies use करता है:\n- **React, Next.js, TypeScript** (frontend)\n- **Node.js, Python** (backend)\n- **AI/LLM integrations** (AI systems)\n- **Discord.js, Telegram** (bots)\n\nआपका project किस type का है?`,
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

// ── Language Detection ───────────────────────────────────────────────────────
function detectLanguage(text: string): string {
  if (/[\u0600-\u06FF]/.test(text)) return "ar";
  if (/[\u0900-\u097F]/.test(text)) {
    if (/\b(hai|hain|kya|nahi|main|tum|aur|bhi|yaar|bhai|boss|karo|kaise|matlab|samjha|thoda|zyada|bahut|bilkul|accha|theek|seedha|bolta|bolte|karein|karle)\b/i.test(text)) return "hinglish";
    return "hi";
  }
  if (/[\u0980-\u09FF]/.test(text)) return "bn";
  if (/[\u3040-\u30FF\u4E00-\u9FFF]/.test(text)) {
    if (/[\u3040-\u30FF]/.test(text)) return "ja";
    return "zh";
  }
  if (/[\uAC00-\uD7AF]/.test(text)) return "ko";
  if (/\b(hola|gracias|cómo|qué|necesito|buenos|por favor|español)\b/i.test(text)) return "es";
  if (/\b(bonjour|merci|comment|salut|je|nous|vous|français)\b/i.test(text)) return "fr";
  if (/\b(hallo|danke|wie|ich|wir|bitte|deutsch|guten)\b/i.test(text)) return "de";
  if (/\b(kya|hai|hain|nahi|main|tum|yaar|bhai|boss|karo|kaise)\b/i.test(text)) return "hinglish";
  return "en";
}

export default router;
