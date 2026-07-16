import express from "express";
import cors from "cors";
import aiRouter from "../artifacts/api-server/src/routes/ai";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/api/healthz", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Debug endpoint — check if env vars are set on Vercel
app.get("/api/debug", (_req, res) => {
  const orKey = process.env["OPENROUTER_API_KEY"];
  const gqKey = process.env["GROQ_API_KEY"];
  res.json({
    hasOpenRouter: !!orKey,
    hasGroq: !!gqKey,
    openRouterPreview: orKey ? orKey.substring(0, 14) + "..." : null,
    groqPreview: gqKey ? gqKey.substring(0, 8) + "..." : null,
    envKeys: Object.keys(process.env).filter(k => k.includes("KEY") || k.includes("API") || k.includes("ROUTER") || k.includes("GROQ")),
  });
});

// AI chat routes (includes /api/ai/chat)
app.use("/api", aiRouter);

// Catch-all 404 for API routes
app.use("/api/*", (_req, res) => {
  res.status(404).json({ error: "API route not found" });
});

export default app;
