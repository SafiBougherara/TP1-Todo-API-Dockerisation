# ── STAGE 1 : Builder / Dépendances de développement ─────────────────────────
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci

# ── STAGE 2 : Runner / Image de production ultra-légère ───────────────────────
FROM node:18-alpine AS runner
WORKDIR /app

# Définir l'environnement
ENV NODE_ENV=production

# Copier uniquement les manifests pour installer les dépendances de prod
COPY package*.json ./
RUN npm ci --only=production

# Copier le reste du code source
COPY . .

# Optimisation de la sécurité : utiliser l'utilisateur non-root 'node' fourni par l'image
USER node

# Port exposé
EXPOSE 3000

# Healthcheck natif sans outils additionnels (exploite le fetch global de Node 18)
HEALTHCHECK --interval=15s --timeout=5s --start-period=5s --retries=3 \
  CMD node -e "fetch('http://localhost:' + (process.env.PORT || 3000) + '/health').then(r => r.ok ? process.exit(0) : process.exit(1)).catch(() => process.exit(1))"

CMD ["node", "server.js"]