# Syrix AI

Interface web légère pour interroger un modèle Ollama local. Le projet évite désormais toute connexion VPS automatique au démarrage et ne stocke aucun secret dans le code.

## Démarrage

```bash
cd "Syrix ai"
npm install
ollama pull deepseek-coder:33b-instruct
npm start
```

Puis ouvrir <http://localhost:3000>. Le modèle peut être remplacé avec `OLLAMA_MODEL`, et le port avec `PORT`.

```bash
OLLAMA_MODEL=llama3.2 PORT=8080 npm start
```

## Préparer un VPS (optionnel)

Configurer les variables d’environnement avant de lancer le script :

```bash
VPS_HOST=example.com VPS_USER=ubuntu VPS_PASSWORD='...' npm run setup
```

> En production, préférez une clé SSH à un mot de passe et un gestionnaire de secrets. Ne commitez jamais ces variables.

## API

- `GET /api/health` — état du serveur et modèle configuré
- `POST /api/syrix` avec `{ "prompt": "..." }` — réponse du modèle

Les prompts sont limités à 8 000 caractères et les erreurs Ollama sont renvoyées avec un statut HTTP explicite.
