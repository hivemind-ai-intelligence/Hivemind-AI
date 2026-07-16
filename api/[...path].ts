import express from "express";
import cors from "cors";
import aiRouter from "../artifacts/api-server/src/routes/ai";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/healthz", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api", aiRouter);

app.use("/api/*", (_req, res) => {
  res.status(404).json({ error: "API route not found" });
});

export default app;
