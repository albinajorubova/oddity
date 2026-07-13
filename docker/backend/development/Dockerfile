FROM node:22-alpine AS base

# Install system dependencies for Strapi and Sharp
RUN apk update && apk add --no-cache \
    build-base \
    gcc \
    autoconf \
    automake \
    zlib-dev \
    libpng-dev \
    nasm \
    bash \
    vips-dev \
    git \
    libc6-compat \
    curl

# Enable pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN corepack prepare pnpm@11.0.8 --activate

# CI=true: pnpm не запрашивает подтверждение на очистку node_modules
# (иначе в контейнере без TTY падает ERR_PNPM_ABORTED_REMOVE_MODULES_DIR_NO_TTY)
ENV CI=true

ENV PORT=1337

# Set working directory
WORKDIR /opt/app

# Copy package files first for better layer caching
COPY package*.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY .env* ./

# Install dependencies with mount cache
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile

# Copy source code and set ownership
COPY . .

# Build Strapi
RUN ["pnpm", "build"]

VOLUME ["/opt/app/public/uploads"]

# Expose Strapi port
EXPOSE 1337

# Start Strapi in development mode
CMD ["pnpm", "develop"]