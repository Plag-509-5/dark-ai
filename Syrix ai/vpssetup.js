const { NodeSSH } = require("node-ssh");

/** Prépare un VPS explicitement, jamais automatiquement au démarrage du serveur. */
async function setupVPS() {
  const required = ["VPS_HOST", "VPS_USER", "VPS_PASSWORD"];
  const missing = required.filter(key => !process.env[key]);
  if (missing.length) throw new Error(`Variables manquantes: ${missing.join(", ")}`);

  const ssh = new NodeSSH();
  await ssh.connect({
    host: process.env.VPS_HOST,
    username: process.env.VPS_USER,
    password: process.env.VPS_PASSWORD
  });
  await ssh.execCommand("apt-get update && apt-get install -y curl");
  await ssh.execCommand("curl -fsSL https://ollama.com/install.sh | sh");
  await ssh.execCommand(`ollama pull ${process.env.OLLAMA_MODEL || "deepseek-coder:33b-instruct"}`);
  ssh.dispose();
}

if (require.main === module) setupVPS().then(() => console.log("✅ VPS prêt.")).catch(error => { console.error(error.message); process.exitCode = 1; });
module.exports = { setupVPS };
