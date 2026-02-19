FROM node:20.9.0

WORKDIR /app

# Copier les fichiers de configuration
COPY package*.json ./

# Installer les dépendances sans package-lock pour rester simple
RUN npm install --no-package-lock

# Copier le reste du code backend
COPY . .

# Variables par défaut (Railway écrasera PORT automatiquement)
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["node", "server.js"]



