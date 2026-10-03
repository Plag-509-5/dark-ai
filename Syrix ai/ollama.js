const { spawn } = require("node:child_process");

const MODEL = process.env.OLLAMA_MODEL || "deepseek-coder:33b-instruct";
const TIMEOUT_MS = Number(process.env.OLLAMA_TIMEOUT_MS || 120_000);

function runOllama(prompt) {
  return new Promise((resolve, reject) => {
    const ollama = spawn(process.env.OLLAMA_BIN || "ollama", ["run", MODEL], {
      stdio: ["pipe", "pipe", "pipe"]
    });
    let output = "";
    let error = "";
    const timer = setTimeout(() => {
      ollama.kill("SIGTERM");
      reject(new Error("Le modèle a mis trop de temps à répondre."));
    }, TIMEOUT_MS);

    ollama.stdout.on("data", data => { output += data.toString(); });
    ollama.stderr.on("data", data => { error += data.toString(); });
    ollama.on("error", err => { clearTimeout(timer); reject(err); });
    ollama.on("close", code => {
      clearTimeout(timer);
      if (code !== 0) {
        reject(new Error(error.trim() || `Ollama s'est arrêté avec le code ${code}.`));
      } else {
        resolve(output.trim());
      }
    });

    const systemPrompt = "Tu es Syrix AI, un assistant utile, précis et respectueux. Réponds en français sauf demande contraire.";
    ollama.stdin.end(`${systemPrompt}\n\n${prompt}\n`);
  });
}

module.exports = { runOllama };
