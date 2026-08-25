const express = require("express");
const bodyParser = require("body-parser");
const { setupVPS } = require("./vpsSetup");
const { runOllama } = require("./ollama");

const app = express();
app.use(bodyParser.json());
app.use(express.static("public"));

// API Syrix
app.post("/api/syrix", (req, res) => {
  const { prompt } = req.body;
  runOllama(prompt, result => {
    res.json({ reply: result });
  });
});

// Setup VPS au démarrage
setupVPS().catch(err => console.error("Erreur VPS:", err));

app.listen(3000, () => console.log("🚀 Syrix AI en ligne sur http://localhost:3000"));