# syntax=docker.io/docker/dockerfile:1

FROM node:22-alpine

WORKDIR /app

# Install dependencies based on the preferred package manager
ADD package.json package-lock.json* pnpm-lock.yaml* .npmrc* ./
RUN \
  if [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i; \
  # Allow install without lockfile, so example works even without Node.js installed locally
  else echo "Warning: Lockfile not found. It is recommended to commit lockfiles to version control." && yarn install; \
  fi

ADD src ./src
ADD public ./public
ADD tsconfig.json .
ADD postcss.config.mjs .
ADD .env .

EXPOSE 5000

CMD \
  if [ -f package-lock.json ]; then npm run dev; \
  elif [ -f pnpm-lock.yaml ]; then pnpm dev; \
  else npm run dev; \
  fi