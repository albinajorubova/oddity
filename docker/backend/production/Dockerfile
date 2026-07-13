# syntax=docker/dockerfile:1.6
# Базовый образ с включенным corepack/pnpm
FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
# Реестр npm — единый параметр сборки. Дефолт: npmjs.
# Включить РФ-зеркало: --build-arg NPM_REGISTRY=https://npm-mirror.gitverse.ru
# (в CI прокидывается из input npm_registry компонента).
#   NPM_CONFIG_REGISTRY нужен для `npm install -g pnpm` (до появления .npmrc).
#   .npmrc ниже задаёт реестр для `pnpm install` (из того же ARG).
ARG NPM_REGISTRY=https://registry.npmjs.org
ENV NPM_CONFIG_REGISTRY=${NPM_REGISTRY}
RUN npm install -g pnpm@11.0.8
WORKDIR /opt/app
RUN echo "registry=${NPM_REGISTRY}" > .npmrc

# Стадия сборки: ставим build-зависимости и собираем Strapi
FROM base AS builder
# Пакеты, нужные только на сборке (sharp, node-gyp, admin build)
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    pkgconfig \
    vips-dev \
    libc6-compat \
    git

# Копируем манифесты первыми для кеширования слоев
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
# Кешируем стор pnpm
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
    CI=true pnpm install --frozen-lockfile

# Копируем исходники
COPY . .

# Сборка Strapi (админка и т.д.)
# Предполагается, что в package.json прописан script "build": "strapi build"
ENV NODE_ENV=production
## Читаем runtime env (для сборки админки Strapi могут потребоваться некоторые переменные)
RUN --mount=type=secret,id=backend_env \
    export $(grep -v '^[#[:space:]]' /run/secrets/backend_env | xargs) && \
    pnpm build

# Обрезаем devDependencies, чтобы в рантайм ушли только prod deps,
# и вычищаем build-кеши/скретч, которые иначе уехали бы в рантайм-образ
# (.cache и .tmp пересоздаются на старте; node_modules/.cache не нужен).
FROM builder AS pruner
RUN pnpm prune --prod \
  && rm -rf .cache .tmp node_modules/.cache

# Легкий рантайм-образ
FROM node:22-alpine AS runner
# Нужные в рантайме библиотеки (vips для sharp), tini как init-процесс
RUN apk add --no-cache vips tini libc6-compat

# Strapi стартуем напрямую через node — pnpm/corepack в рантайме не нужны.
# NODE_ENV=production обязателен: иначе Strapi стартует в development-режиме,
# хотя админка была собрана для production.
ENV NODE_ENV=production
ENV CI=true
ENV PORT=1337

WORKDIR /opt/app

# Копируем собранное приложение и production-зависимости (уже с владельцем node)
COPY --chown=node:node --from=pruner /opt/app ./

# Каталоги, в которые Strapi пишет в рантайме. chown только на них —
# содержимое /opt/app уже принадлежит node после COPY --chown, а `chown -R`
# по всему каталогу продублировал бы node_modules в новый слой.
# Persistence (public/uploads, database) монтируется как volume в compose.
RUN mkdir -p database database/migrations public/uploads .tmp .cache \
  && chown node:node database database/migrations public/uploads .tmp .cache

EXPOSE 1337

USER node
# Запуск через tini для корректного управления сигналами.
# Strapi CLI вызываем напрямую через node (минуя pnpm): tini -> node, без процесса-посредника.
# ВАЖНО: указываем реальный .js-энтрипоинт, а НЕ node_modules/.bin/strapi —
# последний это sh-обёртка (cmd-shim), и `node` падает на ней с SyntaxError.
CMD ["tini", "--", "node", "node_modules/@strapi/strapi/bin/strapi.js", "start"]
