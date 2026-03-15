# ---------- BUILD STAGE ----------
FROM node:24-alpine AS builder

WORKDIR /app

# Copia package files
COPY package*.json ./

# install dependencies
RUN npm install

# Copia codice
COPY . .

# Genera prisma client
RUN npx prisma generate

# Build typescript
RUN npm run build


# ---------- PRODUCTION STAGE ----------
FROM node:24-alpine

WORKDIR /app

ENV NODE_ENV=production
COPY --from=builder /app .

RUN npm prune --omit=dev

RUN chmod +x /app/entrypoint.sh

# Porta express
EXPOSE 8000

# Avvio server
CMD ["/app/entrypoint.sh"]