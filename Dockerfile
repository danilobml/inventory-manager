# Build:
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

RUN mkdir -p /app/db && touch /app/db/dev.db

RUN npx prisma generate

RUN npm run build

# Run:
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/db ./db
COPY --from=builder /app/package.json ./

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "dist/main.js"]
