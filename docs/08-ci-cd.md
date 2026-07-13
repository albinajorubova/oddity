# CI/CD — сборка и деплой через GitLab

## 📋 Обзор

CI/CD вынесен в **переиспользуемый GitLab CI/CD Component** (`saltpepper/ci-components`), а проект подключает его тонким `include`. Вся логика (генерация env, сборка образов, деплой) живёт в компоненте и одинакова для всех проектов; в репозитории проекта остаются только:

- `.gitlab-ci.yml` — подключение компонента + параметры (`inputs`);
- `ci/env/*.env.tpl` — шаблоны переменных окружения проекта;
- `docker/**/Dockerfile` и `docker-compose.*.yml` — сборка и запуск.

```
┌──────────────────────────┐        include: component@x.y.z
│  .gitlab-ci.yml (проект)  │ ─────────────────────────────────┐
│  inputs: services, ...    │                                  │
└──────────────────────────┘                                  ▼
┌──────────────────────────┐        ┌─────────────────────────────────────┐
│  ci/env/*.env.tpl         │ ─────▶ │  saltpepper/ci-components/pipeline   │
│  (переменные проекта)     │        │  prepare → build → deploy           │
└──────────────────────────┘        └─────────────────────────────────────┘
```

## 🔌 Подключение

`.gitlab-ci.yml` в корне проекта:

```yaml
include:
  - component: git.snpdev.ru/saltpepper/ci-components/pipeline@1.0.9
    inputs:
      services: "backend frontend imgproxy postgres meilisearch"
      required_vars: "DATABASE_HOST DATABASE_PASSWORD DATABASE_NAME DATABASE_USERNAME NEXT_PUBLIC_SITE_URL"
      npm_registry: "https://npm-mirror.gitverse.ru"   # РФ-проект; по умолчанию npmjs
      domain_frontend: boilerplate.snpdev.ru
      domain_backend:  admin.boilerplate.snpdev.ru
      domain_imgproxy: imgproxy.boilerplate.snpdev.ru
      domain_meili:    search.boilerplate.snpdev.ru
```

### Параметры (`inputs`)

| Параметр | Назначение | По умолчанию |
|---|---|---|
| `services` | Какие сервисы обслуживать: для каждого генерируется `<svc>.env`, а `backend`/`frontend` ещё и собираются | `backend frontend imgproxy postgres meilisearch` |
| `required_vars` | CI-переменные, без которых `prepare_env` падает (fail fast) | `""` |
| `npm_registry` | npm-реестр для сборки (`--build-arg NPM_REGISTRY`). Для РФ-проектов — зеркало GitVerse | `https://registry.npmjs.org` |
| `domain_*` | Домены для `.env` docker-compose (reverse proxy). **Опциональны** — пустой домен → строка `VIRTUAL_HOST_*` не пишется | `""` |
| `frontend_context` / `backend_context` | Контексты сборки | `.` / `./@strapi` |
| `dockerfile_env` | Подкаталог Dockerfile (`docker/<svc>/<env>/`) | `production` |
| `deploy_path` | Базовый путь на проде | `/var/www` |

> Версию компонента (`@1.0.9`) **пиньте явно**. Обновление — осознанная смена тега, чтобы изменения не «прилетали» во все проекты сразу.

## ⚙️ Стадии пайплайна

```
prepare ──▶ build ──▶ deploy
```

### 1. `prepare_env`

Генерирует `*.env` из шаблонов `ci/env/<svc>.env.tpl` через `envsubst`, подставляя CI-переменные:

```bash
for svc in $SERVICES; do
  envsubst < ci/env/${svc}.env.tpl > ${svc}.env
done
```

- сначала проверяет `required_vars` (падает, если переменная пустая);
- объявляет окружение `environment: { action: prepare }`, чтобы подтянулись **environment-scoped** значения секретов (testing/staging/production);
- результат (`*.env`) передаётся дальше как артефакт.

### 2. `build_images`

Собирает и пушит образы `backend`/`frontend` (внешние образы — postgres/imgproxy/meili — пропускаются):

```bash
docker buildx build \
  --build-arg NPM_REGISTRY="<npm_registry>" \
  --secret id=${svc}_env,src=${svc}.env \
  -t "$CI_REGISTRY_IMAGE/${svc}:$IMAGE_TAG" \
  -t "$CI_REGISTRY_IMAGE/${svc}:$VERSION_TAG" \
  -t "$CI_REGISTRY_IMAGE/${svc}:latest" \
  -f docker/${svc}/${ENVIRONMENT}/Dockerfile <context>
```

### 3. Деплой

| Джоб | Когда | Что делает |
|---|---|---|
| `deploy_local` | ветка `testing` | На хосте раннера: `docker compose pull && up -d` (testing-compose) |
| `deploy_production` | `staging` / `release/*`, **вручную** | По SSH на сервер: копирует compose + `.env`, `docker compose pull && up -d` |

## 🌿 Ветки → окружения → версии образов

| Ветка | `ENV_NAME` | `VERSION_TAG` | Где деплоится |
|---|---|---|---|
| `testing` | `testing` | `testing` | `deploy_local` (авто) |
| `staging` | `staging` | `staging` | `deploy_production` (вручную) |
| `release/*` | `production` | `release-x-y-z` (slug ветки) | `deploy_production` (вручную) |

Теги образа:
- **`IMAGE_TAG`** = `<ref-slug>-<short-sha>` — неизменяемый тег конкретной сборки (для rollback);
- **`VERSION_TAG`** = подвижный тег ветки (`testing` / `staging` / `release-x-y-z`);
- **`latest`** — для обратной совместимости.

## 📦 Реестр образов

Путь образа выводится из `$CI_REGISTRY` и пути проекта:

```yaml
CI_REGISTRY: registry.git.snpdev.ru
CI_PROJECT_PATH: saltpepper/$CI_PROJECT_NAME
CI_REGISTRY_IMAGE: $CI_REGISTRY/$CI_PROJECT_PATH
```

Логин идёт в тот же `$CI_REGISTRY`, поэтому хосты `login` / `push` / `pull` совпадают.

В docker-compose образ берётся из `${CI_REGISTRY_IMAGE}`:
```yaml
image: ${CI_REGISTRY_IMAGE}/backend:${VERSION_TAG}
```
(`CI_REGISTRY_IMAGE`, `IMAGE_TAG`, `VERSION_TAG` пишутся деплой-джобом в `.env`.)

## 🔑 Переменные окружения проекта (`ci/env/*.env.tpl`)

Каждый сервис — свой шаблон с плейсхолдерами `${VAR}`:

```
ci/env/backend.env.tpl
ci/env/frontend.env.tpl
ci/env/imgproxy.env.tpl
ci/env/postgres.env.tpl
ci/env/meilisearch.env.tpl
```

Правила:
- **Секреты** (`JWT_SECRET`, `DATABASE_PASSWORD`, `APP_KEYS` …) — через `${VAR}`, значения берутся из CI/CD-переменных (желательно environment-scoped).
- **Инфраструктурные константы** — хардкодом, т.к. они свойства compose-сетапа, а не секреты:
  ```bash
  DATABASE_CLIENT=postgres
  DATABASE_HOST=postgres      # имя сервиса во внутренней сети
  DATABASE_PORT=5432
  DATABASE_SSL=false
  ```

См. также [03-environment-variables.md](./03-environment-variables.md).

## 🇷🇺 npm-реестр (зеркало GitVerse)

Реестр — **единый параметр `NPM_REGISTRY`**, дефолт — **npmjs**; зеркало включается явно (для РФ-проектов, у которых раннер не ходит в npmjs).

**Уровни переключения:**

| Уровень | Как включить зеркало |
|---|---|
| CI / проект | `npm_registry: "https://npm-mirror.gitverse.ru"` в `include` |
| Ручная сборка | `docker build --build-arg NPM_REGISTRY=https://npm-mirror.gitverse.ru ...` |
| Локальная разработка | committed `.npmrc` (корень + `@strapi/`) **или** глобально `npm config set registry <зеркало>` |

**В Dockerfile** реестр применяется в двух местах:

```dockerfile
ARG NPM_REGISTRY=https://registry.npmjs.org
ENV NPM_CONFIG_REGISTRY=${NPM_REGISTRY}     # backend: для `npm install -g pnpm`
ENV COREPACK_NPM_REGISTRY=${NPM_REGISTRY}   # frontend: для corepack (скачивание pnpm)
RUN echo "registry=${NPM_REGISTRY}" > .npmrc  # для `pnpm install` зависимостей
```

> `.npmrc` **генерируется из `ARG`** (а не копируется), поэтому `--build-arg`/`npm_registry` реально переключает реестр. Отдельная `ENV` нужна потому, что сам pnpm скачивается **до** появления `.npmrc` (corepack/npm читают только env, не файл).

> Committed `.npmrc` в репозитории — **только для локальной разработки** (сборка его не использует). В не-РФ проектах его можно убрать.

## 🩺 Healthcheck и порядок запуска

Зависимые сервисы стартуют **только после готовности** Strapi, а не просто после старта контейнера:

```
postgres (healthy) ─▶ backend (healthy) ─▶ frontend
                                        └▶ imgproxy (после старта backend)
```

В docker-compose:
```yaml
backend:
  healthcheck:
    test: ["CMD", "wget", "-qO-", "http://127.0.0.1:1337/_health"]
    start_period: 90s        # запас на миграции/прогрев
  depends_on:
    postgres: { condition: service_healthy }

frontend:
  depends_on:
    backend: { condition: service_healthy }
```

Подробнее про compose — [04-docker-compose.md](./04-docker-compose.md).

## 🚀 Запуск пайплайна

1. Закоммитьте в `testing` → автоматически: `prepare → build → deploy_local`.
2. Для прода — ветка `release/*` (или `staging`), деплой запускается **вручную** в UI GitLab.
3. Перед тегированием новой версии компонента прогоняйте `glab ci lint`.

## 🛠️ Отладка и частые ошибки

| Симптом | Причина | Решение |
|---|---|---|
| `denied: access forbidden` при push/pull | Нет прав на запись в реестр: подменён read-only токен (`REGISTRY_USER` ≠ `gitlab-ci-token`) или роль < Developer | Дать токену `write_registry` / убрать override; проверить роль |
| `ERR_PNPM_IGNORED_BUILDS` | Build-скрипт зависимости (напр. `core-js`) не одобрен | Добавить пакет в `allowBuilds` в `pnpm-workspace.yaml` |
| `pnpm install` уходит в `registry.npmjs.org` (ETIMEDOUT из РФ) | Зеркало не включено | Указать `npm_registry: "https://npm-mirror.gitverse.ru"` в `include` |
| `script config should be a string…` | Строка `script` с `: ` без кавычек → YAML mapping | Обернуть в одинарные кавычки: `'echo "...: ..."'` |
| `SyntaxError` на старте Strapi | `node node_modules/.bin/strapi` (это sh-обёртка) | Вызывать реальный JS: `node node_modules/@strapi/strapi/bin/strapi.js start` |
| `Unknown dialect` | Пустой `DATABASE_CLIENT` | Захардкодить `DATABASE_CLIENT=postgres` в `ci/env/backend.env.tpl` |
| `container backend is unhealthy` | Strapi не стартовал/не успел | `docker logs ..._backend`; проверить env/БД; при долгом старте поднять `start_period` |

### Как дебажить внутри CI

- Контейнеры остаются на хосте раннера (`up -d`) — зайти по SSH и `docker logs ..._backend`.
- Временный джоб в `.post` с `when: always` и `DOCKER_HOST` сокетом — вытащит логи в вывод CI.
- `CI_DEBUG_TRACE: "true"` — трассировка команд и переменных (⚠️ снять после отладки).

## 🔗 Связанные документы

- [Переменные окружения](./03-environment-variables.md)
- [Docker Compose](./04-docker-compose.md)
- [Image Proxy](./05-image-proxy.md)
- [Meilisearch](./06-meilisearch.md)
- [Скрипты — менеджер CI-переменных GitLab](./09-gitlab-vars-script.md)
