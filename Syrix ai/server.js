const path = require("node:path");
const express = require("express");
const { runOllama } = require("./ollama");

const app = express();
const port = Number(process.env.PORT || 3000);
const publicDir = path.join(__dirname, "public");

app.disable("x-powered-by");
app.use(express.json({ limit: "16kb" }));
app.use(express.static(publicDir));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, model: process.env.OLLAMA_MODEL || "deepseek-coder:33b-instruct" });
});

app.post("/api/syrix", async (req, res) => {
  const prompt = typeof req.body?.prompt === "string" ? req.body.prompt.trim() : "";
  if (!prompt) return res.status(400).json({ error: "Le prompt ne peut pas être vide." });
  if (prompt.length > 8_000) return res.status(413).json({ error: "Le prompt est limité à 8 000 caractères." });

  try {
    res.json({ reply: await runOllama(prompt) });
  } catch (error) {
    console.error("Erreur Ollama:", error.message);
    res.status(503).json({ error: "Le service IA est momentanément indisponible." });
  }
});

app.listen(port, "0.0.0.0", () => console.log(`🚀 Syrix AI en ligne sur le port ${port}`));
