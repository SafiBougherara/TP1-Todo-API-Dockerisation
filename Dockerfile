# ── Image de base légère Node.js 18 ──────────────────────────────────────────
FROM node:18-alpine

# Répertoire de travail dans le conteneur
WORKDIR /app

# Copie des manifests en premier (meilleur cache des layers)
COPY package*.json ./

# Installation des dépendances de production uniquement
RUN npm ci --only=production

# Copie du reste du code source
COPY . .

# Port exposé par l'application
EXPOSE 3000

# Démarrage de l'application
CMD ["node", "server.js"]