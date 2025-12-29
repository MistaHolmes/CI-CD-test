FROM oven/bun:1-alpine

WORKDIR /app

COPY package.json ./
RUN bun install

COPY prisma ./prisma
COPY prisma.config.ts ./

RUN bunx prisma generate

COPY . .

EXPOSE 3002

CMD ["bun", "run", "dev"]
