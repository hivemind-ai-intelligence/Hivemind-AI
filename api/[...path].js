const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Debug & health
app.get("/api/healthz", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.get("/api/debug", (_req, res) => {
  const orKey = process.env["OPENROUTER_API_KEY"];
  const gqKey = process.env["GROQ_API_KEY"];
  res.json({
    hasOpenRouter: !!orKey,
    hasGroq: !!gqKey,
    openRouterPreview: orKey ? orKey.substring(0, 14) + "..." : null,
    groqPreview: gqKey ? gqKey.substring(0, 8) + "..." : null,
    envKeys: Object.keys(process.env).filter(k => /KEY|API|ROUTER|GROQ/i.test(k)),
  });
});

// Config
const OPENROUTER_FREE_MODELS = [
  "google/gemini-2.5-flash-preview-09-2025:free",
  "google/gemini-2.5-flash-lite-preview-09-2025:free",
  "meta-llama/llama-4-maverick:free",
  "meta-llama/llama-3.3-70b-instruct:free",
  "deepseek/deepseek-r1:free",
  "deepseek/deepseek-chat-v3-0324:free",
  "mistralai/mistral-small-3.2-24b-instruct:free",
  "qwen/qwen3-next-80b-a3b-instruct:free",
  "qwen/qwen-2.5-72b-instruct:free",
  "nousresearch/hermes-3-llama-3.1-405b:free",
  "openai/gpt-oss-20b:free",
  "meta-llama/llama-3.1-8b-instruct:free",
  "google/gemma-3-27b-it:free",
  "microsoft/phi-3-mini-128k-instruct:free",
  "mistralai/mistral-7b-instruct:free",
];

const GROQ_FREE_MODELS = [
  "llama-3.3-70b-versatile",
  "llama-3.1-8b-instant",
  "gemma2-9b-it",
  "mixtral-8x7b-32768",
];

const modelBlacklist = new Map();
const BLACKLIST_MS = 5 * 60 * 1000;
function isBlacklisted(m) {
  const u = modelBlacklist.get(m);
  if (!u) return false;
  if (Date.now() > u) { modelBlacklist.delete(m); return false; }
  return true;
}
function blacklist(m) { modelBlacklist.set(m, Date.now() + BLACKLIST_MS); }

// Clients
function createOR() {
  const key = process.env["OPENROUTER_API_KEY"];
  if (!key) return null;
  return new OpenAI({ apiKey: key, baseURL: "https://openrouter.ai/api/v1", maxRetries: 0, timeout: 12000, defaultHeaders: { "HTTP-Referer": "https://hivemind.ai", "X-Title": "Hivemind AI" } });
}
function createGQ() {
  const key = process.env["GROQ_API_KEY"];
  if (!key) return null;
  return new OpenAI({ apiKey: key, baseURL: "https://api.groq.com/openai/v1", maxRetries: 0, timeout: 12000 });
}

// System Prompt
function buildPrompt(ctx) {
  const brand = ctx.brandName || "Hivemind AI";
  const founder = ctx.founderName || "the founder";
  const mode = ctx.mode || "general";
  const svc = (ctx.services || []).slice(0, 8).map(s => `- ${s.name}: $${s.price} — ${(s.features || []).slice(0, 3).join(", ")}`).join("\n") || "Custom digital services";
  const prc = (ctx.pricing || []).slice(0, 6).map(p => `- ${p.name}: $${p.monthly}/mo${p.recommended ? " ★ Recommended" : ""} — $/(p.features || []).slice(0, 3).join(", ")}`).join("\n") || "Flexible pricing tiers";
  const inst = {
    general: `You are J.A.R.V.I.S — the ${brand} AI intelligence. You are the digital embodiment of ${brand}: precise, futuristic, witty, knowledgeable. Founder: ${founder}, ${ctx.founderProjects || 50}+ projects, ${ctx.founderClients || 100}+ clients.`,
    services: `You are ${brand} services intelligence. Help clients find the right service. Ask one sharp clarifying question at a time.`,
    pricing: `You are ${brand} pricing intelligence. Match clients to their perfect tier. Ask budget, team size, must-have features. Make confident recommendations.`,
    connect: `You are ${brand} onboarding intelligence. Collect name, email, project scope. Be warm and efficient. Confirm email enthusiastically.`,
  };
  return `${inst[mode] || inst.general}\n\nCOMPANY: ${brand} | ${founder}\nTrack: ${ctx.founderProjects || "50+"}+ projects, ${ctx.founderClients || "100+"}+ clients\n\nSERVICES:\n${svc}\n\nPRICING:\n${prc}\n\nLANGUAGE: Detect user language and respond in SAME language. English, Hindi, Hinglish, Bengali, Arabic, French, German, Spanish, Portuguese, Italian, Russian, Japanese, Korean, Chinese, Turkish, Dutch, Polish — all supported.\n\nTONE: Jarvis-level — precise, warm, witty, never robotic. Max 160 words. Avoid filler phrases.`;
}

// AI Chat Endpoint
app.post("/api/ai/chat", async (req, res) => {
  try {
    const { messages, systemContext } = req.body || {};
    if (!Array.isArray(messages)) return res.status(400).json({ error: "messages array required" });

    const recent = messages.slice(-20);
    const or = createOR();
    const gq = createGQ();

    if (!or && !gq) {
      return res.json({ content: fallback(recent, systemContext), mode: "fallback", notice: "Add OPENROUTER_API_KEY for AI" });
    }

    const chat = [{ role: "system", content: buildPrompt(systemContext) }, ...recent.map(m => ({ role: m.role === "ai" ? "assistant" : "user", content: m.content }))];

    // OpenRouter
    if (or) {
      for (const m of OPENROUTER_FREE_MODELS.filter(x => !isBlacklisted(x))) {
        try {
          const c = await or.chat.completions.create({ model: m, messages: chat, max_tokens: 400, temperature: 0.72 }, { timeout: 8000 });
          const txt = c.choices[0]?.message?.content;
          if (txt) return res.json({ content: txt, model: m, provider: "openrouter" });
        } catch (e) {
          const s = e?.status || e?.response?.status;
          if (s === 429 || s === 402 || s === 403) blacklist(m);
        }
      }
    }
    // Groq
    if (gq) {
      for (const m of GROQ_FREE_MODELS.filter(x => !isBlacklisted("gq:" + x))) {
        try {
          const c = await gq.chat.completions.create({ model: m, messages: chat, max_tokens: 400, temperature: 0.72 }, { timeout: 8000 });
          const txt = c.choices[0]?.message?.content;
          if (txt) return res.json({ content: txt, model: m, provider: "groq" });
        } catch (e) {
          const s = e?.status || e?.response?.status;
          if (s === 429 || s === 402 || s === 403) blacklist("gq:" + m);
        }
      }
    }
    // Fallback
    return res.json({ content: fallback(recent, systemContext), mode: "fallback" });
  } catch (e) {
    try {
      const f = fallback((req.body?.messages || []).slice(-20), req.body?.systemContext || {});
      return res.json({ content: f, mode: "fallback" });
    } catch (_) {
      return res.json({ content: "I'm here — ask me about services, pricing, or starting a project!", mode: "fallback" });
    }
  }
});

// Advanced Fallback
function fallback(messages, ctx) {
  const brand = ctx.brandName || "Hivemind AI";
  const founder = ctx.founderName || "our founder";
  const mode = ctx.mode || "general";
  const last = [...messages].reverse().find(m => m.role === "user");
  const input = last?.content || "";
  const hist = messages.filter(m => m.role === "user").map(m => m.content.toLowerCase());
  const turns = hist.length;
  const lower = input.toLowerCase();
  const lang = detectLang(input);
  const hasBudget = hist.some(h => /budget|price|cost|₹|\$|rupee/i.test(h));
  const hasProject = hist.some(h => /website|app|bot|discord|ai|automation/i.test(h));

  if (/^(hi|hey|hello|hola|bonjour|hallo|ciao|oi|salut|привет|مرحبا|नमस्ते|नमस्कार|हेलो|हाय|こんにちは|你好|안녕|সালাম)\b/i.test(input.trim()))
    return greetings(brand, founder, ctx, lang, turns > 2);
  if (/\b(thanks|thank you|thx|ty|gracias|merci|danke|dhanyavaad|shukriya|धन्यवाद|شكرا|ありがとう|감사합니다|谢谢)\b/i.test(lower))
    return thankYou(brand, lang);
  if (/\b(what is|who are|who is|about|tell me|kya hai|kaun hai|batao)\b/i.test(lower))
    return aboutUs(brand, founder, ctx, lang);
  if (/\b(service|build|create|develop|make|website|app|bot|karo|banao|chahiye)\b/i.test(lower))
    return svcR(brand, ctx, lang, hasProject);
  if (/\b(price|cost|pricing|budget|how much|kitna|daam|mehnga)\b/i.test(lower))
    return priceR(brand, ctx, lang, hasBudget);
  if (/\b(contact|hire|start|project|connect|sampark|kaam)\b/i.test(lower))
    return contactR(brand, lang, mode);
  if (mode === "pricing") return priceR(brand, ctx, lang, false);
  if (mode === "connect") return contactR(brand, lang, mode);
  if (mode === "services") return svcR(brand, ctx, lang, false);
  return genericR(brand, lang, turns);
}

// Response generators
function greetings(brand, founder, ctx, lang, returning) {
  const v = {
    en: [`Hello. I'm the ${brand} intelligence. ${founder} created this agency to deliver elite digital work. What are you building?`, `Hey! ${brand} AI online. What's on your mind?`, `Welcome! ${brand} has delivered ${ctx.founderProjects || "50+"}+ projects globally. Where do you want to start?`],
    hi: [`नमस्ते! मैं ${brand} का AI हूं। ${founder} ने यह एजेंसी बनाउ हैॄ आप क्या बनवाना चाहते हैं?`, `Hey! ${brand} AI here — bhai seedha baat karte hain. ${founder} ne ${ctx.founderProjects || "50+"}+ projects deliver kiye hain. Aap kya banwana chahte ho?`],
  };
  const p = v[lang] || v.en;
  return p[Math.floor(Math.random() * p.length)];
}
function thankYou(brand, lang) {
  const m = { en: `Anytime. Anything else?`, hi: `आपका स्वागत है! कुछ और?`, hinglish: `Koi baat nahi bhai! Aur kuch?` };
  return m[lang] || m.en;
}
function aboutUs(brand, founder, ctx, lang) {
  const m = { en: `**${brand}** — elite agency by ${founder}. ${ctx.founderProjects || "50+"}+ projects, ${ctx.founderClients || "100+"}+ clients. AI systems, websites, bots, automation, branding. What are you building?`, hi: `**${brand}** प्रीमियम एजेंसी — ${founder} द्वारा राम. ${ctx.founderProjects || "50+"}+ प्रोजेक्ट्स। AI, websites, bots, automation. क्या चाहिए?`, hinglish: `**${brand}** premium agency — ${founder} ne banai. ${ctx.founderProjects || "50+"}+ projects done. Kya banana hai?` };
  return m[lang] || m.en;
}
function svcR(brand, ctx, lang, mentioned) {
  const list = (ctx.services || []).slice(0, 5).map(s => `- **${s.name}** — ${(s.features || [])[0] || ""}`).join("\n") || "websites, AI systems, Discord bots, automation, branding";
  const m = { en: `${brand} services:\n\n${list}\n\nWhat are you building?`, hi: `${brand} के services:\n\n${list}\n\nक्या बनवाना है?`, hinglish: `${brand} ke services:\n\n${list}\n\nKya banana hai?` };
  return m[lang] || m.en;
}
function priceR(brand, ctx, lang, asked) {
  const cheap = (ctx.pricing || []).filter(p => typeof p.monthly === "number" && p.monthly > 0).sort((a, b) => a.monthly - b.monthly)[0];
  const start = cheap ? `$${cheap.monthly}` : "affordable";
  const list = (ctx.pricing || []).slice(0, 4).map(p => `- **${p.name}**: $${p.monthly}/mo${p.recommended ? " ★" : ""}`).join("\n");
  const m = { en: `${brand} pricing from **${start}/mo**:\n\n${list}\n\nYour budget?`, hi: `${brand} pricing **${start}/month** से:\n\n${list}\n\nआपका budget?`, hinglish: `${brand} pricing **${start}/month** se:\n\n${list}\n\nAapka budget?` };
  return m[lang] || m.en;
}
function contactR(brand, lang, mode) {
  const m = { en: `${brand} team ready! **Connect** tab → share details → 24hr response.`, hi: `${brand} टीम तैयार! **Connect** tab में जाएं → 24 घंटे में जवाब।`, hinglish: `${brand} team ready! **Connect** tab mein jao → 24 ghante mein response.` };
  return m[lang] || m.en;
}
function genericR(brand, lang, turns) {
  const f = { en: ["Tell me more about what you're building!", `${brand} specializes in AI, websites, bots, automation — which fits?`, "Is your goal to build something new, automate, or establish a brand?"], hi: ["और बताइए — क्या बनवाना है?", `${brand} AI, websites, automation — क्या चाहिए?`], hinglish: ["Thoda aur batao — exactly kya banana hai?", `${brand} sab handle karta hai — kya chahiye?`] };
  const p = f[lang] || f.en;
  return p[Math.min(turns - 1, p.length - 1)] || p[p.length - 1];
}

// Language Detection
function detectLang(text) {
  if (/[\u0600-\u06FF]/.test(text)) return /\b(?:ہے|ہیں|کیا|نہیں)/i.test(text) ? "ur" : "ar";
  if (/[\u0900-\u097F]/.test(text)) return /\b(hai|hain|kya|nahi|main|tum|yaar|bhai|boss|karo|kaise|matlab|thoda)\b/i.test(text) ? "hinglish" : "hi";
  if (/[\u0980-\u09FF]/.test(text)) return "bn";
  if (/[\u3040-\u30FF]/.test(text)) return "ja";
  if (/[\u4E00-\u9FFF]/.test(text)) return "zh";
  if (/[\uAC00-\uD7AF]/.test(text)) return "ko";
  if (/\b(hola|gracias|cómo|qué|buenos|español)\b/i.test(text)) return "es";
  if (/\b(bonjour|merci|salut|je|nous|français)\b/i.test(text)) return "fr";
  if (/\b(hallo|danke|wie|ich|wir|bitte|deutsch)\b/i.test(text)) return "de";
  return "en";
}

// 404
app.use("/api/*", (_req, res) => res.status(404).json({ error: "API route not found" }));

module.exports = app;
