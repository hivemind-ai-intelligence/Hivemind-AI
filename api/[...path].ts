import express from "express";
import cors from "cors";
import aiRouter from "../artifacts/api-server/src/routes/ai";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/healthz", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api", aiRouter);

export default app;
