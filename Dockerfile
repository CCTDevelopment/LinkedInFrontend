# ---- Development: Next.js ----
FROM node:20 AS dev   

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]

# ---- Production: Next.js ----
FROM node:20 AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

RUN NEXT_IGNORE_ESLINT=true NEXTJS_IGNORE_TYPE_ERRORS=true npm run build

FROM node:20 AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.ts ./next.config.ts
COPY --from=builder /app/tailwind.config.js ./tailwind.config.js
COPY --from=builder /app/postcss.config.js ./postcss.config.js

EXPOSE 3000

CMD ["npm", "start"]
