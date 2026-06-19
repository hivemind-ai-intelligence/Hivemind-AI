import { Router, type IRouter } from "express";
import OpenAI from "openai";

const router: IRouter = Router();

const openai = process.env["OPENAI_API_KEY"]
  ? new OpenAI({ apiKey: process.env["OPENAI_API_KEY"] })
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
    .map(p => `- ${p.name}: $${p.monthly}/mo — ${p.features.slice(0, 3).join(", ")}`)
    .join("\n") || "Flexible pricing tiers";

  const modeInstructions: Record<string, string> = {
    general: `You are the AI assistant for ${brand}. Answer questions about the company, its founder ${founder} (${ctx.founderProjects || 50}+ projects, ${ctx.founderClients || 100}+ clients), services, and capabilities. Be professional yet warm and conversational.`,
    services: `You are a ${brand} services consultant. Help users understand which service best fits their needs. Ask clarifying questions to understand their project requirements. Be specific and helpful.`,
    pricing: `You are a ${brand} pricing advisor. Help users find the best pricing tier for their budget and needs. Ask about their budget, team size, and required features to make targeted recommendations.`,
    connect: `You are a ${brand} onboarding assistant. Collect the user's name, email, and project description to connect them with the team. Be warm and professional. Once you have an email address, confirm you've logged it.`,
  };

  return `${modeInstructions[mode] || modeInstructions.general}

COMPANY INFORMATION:
- Brand: ${brand}
- Founded by: ${founder}
- Projects completed: ${ctx.founderProjects || "50+"}
- Clients served: ${ctx.founderClients || "100+"}

SERVICES OFFERED:
${servicesList}

PRICING TIERS:
${pricingList}

LANGUAGE RULE:
Detect the language the user is writing in and always respond in that SAME language. If they write in Hindi, respond in Hindi. If Hinglish (mix of Hindi and English), use Hinglish. If Spanish, respond in Spanish. Match the user's language precisely. Support: English, Hindi, Hinglish, Bengali, Urdu, Arabic, French, German, Spanish, Portuguese, Italian, Russian, Japanese, Korean, Chinese (Simplified/Traditional), Turkish, Dutch, Polish, Indonesian, Thai, Vietnamese, Punjabi, Tamil, Telugu, Marathi, Gujarati, and any other language.

BEHAVIOR:
- Be concise, intelligent, and premium-sounding
- Use markdown for structure when helpful (bold, bullets)
- Never fabricate specific project details or client names
- If asked about something outside your scope, redirect helpfully
- Greet warmly, remember context from the conversation
- For the Connect mode: if user provides an email, confirm receipt and say the team will be in touch within 24 hours
- Maximum response length: 180 words unless a detailed technical answer is truly needed`;
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

    // Cap conversation history to last 20 messages for performance
    const recentMessages = messages.slice(-20);

    if (!openai) {
      // No API key: intelligent rule-based fallback
      const lastUser = recentMessages.filter(m => m.role === "user").pop();
      const fallback = generateFallback(lastUser?.content || "", systemContext);
      res.json({ content: fallback, mode: "fallback" });
      return;
    }

    const systemPrompt = buildSystemPrompt(systemContext);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        ...recentMessages.map(m => ({ role: m.role as "user" | "assistant", content: m.content })),
      ],
      max_tokens: 400,
      temperature: 0.7,
      stream: false,
    });

    const content = completion.choices[0]?.message?.content || "I encountered an issue. Please try again.";
    res.json({ content, model: "gpt-4o-mini" });

  } catch (err: any) {
    const message = err?.message || "Unknown error";
    const isQuota = message.includes("quota") || message.includes("billing") || message.includes("429");
    const isKey = message.includes("401") || message.includes("key") || message.includes("auth");

    if (isQuota || isKey) {
      const { messages, systemContext } = req.body;
      const lastUser = messages?.filter((m: ChatMessage) => m.role === "user").pop();
      const fallback = generateFallback(lastUser?.content || "", systemContext || {});
      res.json({ content: fallback, mode: "fallback", notice: "AI quota reached — using built-in responses" });
    } else {
      res.status(500).json({ error: "AI service error", details: message });
    }
  }
});

function generateFallback(input: string, ctx: SystemContext): string {
  const brand = ctx.brandName || "HiveMind";
  const lower = input.toLowerCase();

  if (/^(hi|hey|hello|hola|bonjour|hallo|namaste|नमस्ते|こんにちは|你好|안녕|مرحبا|привет)/i.test(input.trim())) {
    return `Hello! I'm the ${brand} AI assistant. How can I help you today? I can assist with services, pricing, or connecting you with our team.`;
  }
  if (/thanks|thank you|gracias|merci|धन्यवाद|ありがとう|谢谢|감사/i.test(lower)) {
    return "You're welcome! Is there anything else I can help you with?";
  }
  if (/service|offer|build|create|make|develop/i.test(lower)) {
    const serviceNames = ctx.services?.slice(0, 5).map(s => s.name).join(", ") || "websites, AI systems, automations";
    return `${brand} offers ${ctx.services?.length || "several"} premium services including ${serviceNames}. Which area are you most interested in?`;
  }
  if (/price|cost|how much|pricing|budget|plan/i.test(lower)) {
    const cheapest = ctx.pricing?.filter(p => typeof p.monthly === "number").sort((a,b) => (a.monthly as number) - (b.monthly as number))[0];
    return `Our pricing starts at $${cheapest?.monthly || "affordable"}/mo. We have flexible tiers to fit every budget — from startups to enterprise. Switch to the **Pricing** tab for details, or scroll to the pricing section.`;
  }
  if (/contact|hire|start|project|connect|reach/i.test(lower)) {
    return `Ready to work together? Switch to the **Connect** tab to leave your details, or fill the contact form below. The ${brand} team typically responds within 24 hours.`;
  }
  if (/who|about|company|team|founder/i.test(lower)) {
    return `${brand} is an elite digital agency founded by ${ctx.founderName || "our team"}. We've delivered ${ctx.founderProjects || "50+"}+ projects for ${ctx.founderClients || "100+"}+ clients worldwide — specializing in AI systems, web development, and digital transformation.`;
  }
  return `I'm here to help you with anything about ${brand}. Ask me about our services, pricing, or how to get started with your project!`;
}

export default router;
