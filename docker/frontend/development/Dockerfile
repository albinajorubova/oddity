FROM node:22-alpine AS base

# Install dependencies only when needed
RUN apk add --no-cache libc6-compat

# Enable pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN corepack prepare pnpm@11.0.8 --activate

# CI=true: pnpm не запрашивает подтверждение на очистку node_modules
# (иначе в контейнере без TTY падает ERR_PNPM_ABORTED_REMOVE_MODULES_DIR_NO_TTY)
ENV CI=true

ENV PORT=3000

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY .env* ./

# Install dependencies with mount cache
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Expose port (Next.js default is 3000, but we use 3005 as per env)
EXPOSE 3000

# Start the application
CMD ["pnpm", "dev"]
