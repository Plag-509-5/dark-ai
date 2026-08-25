const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function setupVPS() {
  await ssh.connect({
    host: '85.215.243.129',
    username: 'root',
    password: 'adminplag'
  });

  console.log("🔧 Mise à jour du système...");
  await ssh.execCommand('apt update && apt upgrade -y');

  console.log("📦 Installation de curl et Ollama...");
  await ssh.execCommand('apt install -y curl');
  await ssh.execCommand('curl -fsSL https://ollama.com/install.sh | sh');

  console.log("🤖 Téléchargement du modèle DeepSeek-Coder 33B...");
  await ssh.execCommand('ollama pull deepseek-coder:33b-instruct');

  console.log("✅ VPS prêt avec Ollama et DeepSeek-Coder !");
}

module.exports = { setupVPS };