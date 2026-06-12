# Contexto de build = raiz do repositório (precisa de mcp-server/ + conhecimento/)
FROM node:24-alpine AS build
WORKDIR /app
COPY mcp-server/package.json mcp-server/package-lock.json ./
RUN npm ci
COPY mcp-server/tsconfig.json ./
COPY mcp-server/src ./src
RUN npm run build && npm prune --omit=dev

FROM node:24-alpine
WORKDIR /app
ENV NODE_ENV=production \
    PORT=3333 \
    CONHECIMENTO_DIR=/app/conhecimento
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY conhecimento/comprehensive-rules.txt conhecimento/commander-brackets.md ./conhecimento/
EXPOSE 3333
USER node
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s \
  CMD nc -z 127.0.0.1 3333 || exit 1
CMD ["node", "dist/main.js"]
