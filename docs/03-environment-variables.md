# Переменные окружения

## 📋 Обзор

Проект использует два основных файла с переменными окружения:

- **`.env`** - для фронтенда (Next.js)
- **`@strapi/.env`** - для бэкенда (Strapi CMS)

Дополнительно используются переменные для Docker Compose (через системные переменные окружения).

## 🎯 Frontend переменные (`.env`)

Файл `.env` должен находиться в корне проекта.

### Обязательные переменные

#### API и Backend

```env
# URL Strapi CMS API
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337

# API токен для доступа к Strapi API
NEXT_PUBLIC_STRAPI_API_TOKEN=your_api_token_here

# Базовый URL для API запросов (по умолчанию: /api/)
NEXT_PUBLIC_BASE_API_URL=/api/

# URL сайта (для production)
NEXT_PUBLIC_SITE_URL=https://yourdomain.com

# Секретный ключ для Preview Mode (только для сервера)
PREVIEW_SECRET=your-preview-secret-key

# Окружение приложения
NEXT_PUBLIC_APP_ENV=development

# Google Analytics Tracking ID (опционально)
NEXT_PUBLIC_GA_TRACKING_ID=G-XXXXXXXXXX
```

### Описание переменных

| Переменная | Описание | Пример | Обязательная |
|-----------|----------|--------|--------------|
| `NEXT_PUBLIC_STRAPI_URL` | URL Strapi CMS сервера | `http://localhost:1337` | ✅ Да |
| `NEXT_PUBLIC_STRAPI_API_TOKEN` | API токен для аутентификации в Strapi | `your_token_here` | ✅ Да |
| `NEXT_PUBLIC_BASE_API_URL` | Базовый путь для API запросов | `/api/` | ❌ Нет (по умолчанию `/api/`) |
| `NEXT_PUBLIC_SITE_URL` | Полный URL сайта для production | `https://example.com` | ❌ Нет |
| `PREVIEW_SECRET` | Секретный ключ для Preview Mode (только сервер) | `your-secret-key` | ❌ Нет (требуется для Preview) |
| `NEXT_PUBLIC_APP_ENV` | Окружение приложения | `development`, `production` | ❌ Нет |
| `NEXT_PUBLIC_GA_TRACKING_ID` | Google Analytics Tracking ID | `G-XXXXXXXXXX` | ❌ Нет |

### Пример `.env` для разработки

```env
# Development
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
NEXT_PUBLIC_STRAPI_API_TOKEN=your_development_token
NEXT_PUBLIC_BASE_API_URL=/api/
NEXT_PUBLIC_APP_ENV=development
```

### Пример `.env` для production

```env
# Production
NEXT_PUBLIC_STRAPI_URL=https://api.yourdomain.com
NEXT_PUBLIC_STRAPI_API_TOKEN=your_production_token
NEXT_PUBLIC_BASE_API_URL=/api/
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_APP_ENV=production
NEXT_PUBLIC_GA_TRACKING_ID=G-XXXXXXXXXX
```

### Использование в коде

Переменные с префиксом `NEXT_PUBLIC_` доступны в браузере. Используйте их через `process.env`:

```typescript
// src/shared/config/index.ts
export const config = {
  api: {
    strapiUrl: process.env.NEXT_PUBLIC_STRAPI_URL || "",
    strapiApiToken: process.env.NEXT_PUBLIC_STRAPI_API_TOKEN || "",
    baseApiUrl: process.env.NEXT_PUBLIC_BASE_API_URL || "/api/",
  },
  global: {
    isDevelopment: process.env.NODE_ENV === "development",
  },
};
```

**Важно**: Только переменные с префиксом `NEXT_PUBLIC_` доступны в браузерном коде. Остальные переменные доступны только на сервере.

## 🗄️ Backend переменные (`@strapi/.env`)

Файл `@strapi/.env` должен находиться в директории `@strapi/`.

### Обязательные переменные

#### Безопасность и ключи

```env
# Ключи приложения (минимум 1, можно несколько через запятую)
APP_KEYS=your-app-key-1,your-app-key-2,your-app-key-3,your-app-key-4

# JWT секрет для администратора
ADMIN_JWT_SECRET=your-admin-jwt-secret

# Соль для API токенов
API_TOKEN_SALT=your-api-token-salt

# Соль для transfer токенов
TRANSFER_TOKEN_SALT=your-transfer-token-salt

# Ключ шифрования
ENCRYPTION_KEY=your-encryption-key
```

#### Preview Mode (Strapi)

```env
# URL фронтенд приложения для Preview
CLIENT_URL=http://localhost:3000

# Секретный ключ для Preview Mode (должен совпадать с PREVIEW_SECRET в Next.js)
PREVIEW_SECRET=your-preview-secret-key
```

#### База данных (PostgreSQL)

```env
# Тип клиента базы данных
DATABASE_CLIENT=postgres

# Хост базы данных
# Для локальной разработки: localhost
# Для Docker: postgres (имя сервиса)
DATABASE_HOST=postgres

# Порт базы данных
DATABASE_PORT=5432

# Имя базы данных
DATABASE_NAME=strapi

# Пользователь базы данных
DATABASE_USERNAME=strapi

# Пароль базы данных
DATABASE_PASSWORD=your_secure_password

# Использование SSL (true/false)
DATABASE_SSL=false

# Схема базы данных (опционально)
DATABASE_SCHEMA=public

# Таймаут подключения (мс)
DATABASE_CONNECTION_TIMEOUT=60000

# Размер пула подключений
DATABASE_POOL_MIN=2
DATABASE_POOL_MAX=10
```

#### PostgreSQL переменные (для Docker)

Эти переменные используются Docker образом PostgreSQL:

```env
# Пользователь PostgreSQL
POSTGRES_USER=strapi

# Пароль PostgreSQL
POSTGRES_PASSWORD=your_secure_password

# Имя базы данных PostgreSQL
POSTGRES_DB=strapi
```

### Описание переменных

#### Безопасность

| Переменная | Описание | Пример | Обязательная |
|-----------|----------|--------|--------------|
| `APP_KEYS` | Ключи приложения (4 ключа через запятую) | `key1,key2,key3,key4` | ✅ Да |
| `ADMIN_JWT_SECRET` | Секрет для JWT администратора | `your-secret` | ✅ Да |
| `API_TOKEN_SALT` | Соль для генерации API токенов | `your-salt` | ✅ Да |
| `TRANSFER_TOKEN_SALT` | Соль для transfer токенов | `your-salt` | ✅ Да |
| `ENCRYPTION_KEY` | Ключ для шифрования данных | `your-key` | ✅ Да |

#### Preview Mode

| Переменная | Описание | Пример | Обязательная |
|-----------|----------|--------|--------------|
| `CLIENT_URL` | URL фронтенд приложения для Preview | `http://localhost:3000` | ❌ Нет (требуется для Preview) |
| `PREVIEW_SECRET` | Секретный ключ для Preview Mode | `your-secret-key` | ❌ Нет (требуется для Preview) |

#### База данных

| Переменная | Описание | Пример | Обязательная |
|-----------|----------|--------|--------------|
| `DATABASE_CLIENT` | Тип БД (`postgres`, `mysql`, `sqlite`) | `postgres` | ✅ Да |
| `DATABASE_HOST` | Хост БД | `localhost` или `postgres` | ✅ Да |
| `DATABASE_PORT` | Порт БД | `5432` | ✅ Да |
| `DATABASE_NAME` | Имя БД | `strapi` | ✅ Да |
| `DATABASE_USERNAME` | Пользователь БД | `strapi` | ✅ Да |
| `DATABASE_PASSWORD` | Пароль БД | `secure_password` | ✅ Да |
| `DATABASE_SSL` | Использование SSL | `true` или `false` | ❌ Нет |
| `DATABASE_SCHEMA` | Схема БД (PostgreSQL) | `public` | ❌ Нет |

### Пример `@strapi/.env` для разработки

```env
# Безопасность
APP_KEYS=dev-key-1,dev-key-2,dev-key-3,dev-key-4
ADMIN_JWT_SECRET=dev-admin-jwt-secret
API_TOKEN_SALT=dev-api-token-salt
TRANSFER_TOKEN_SALT=dev-transfer-token-salt
ENCRYPTION_KEY=dev-encryption-key

# База данных
DATABASE_CLIENT=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=strapi_dev
DATABASE_USERNAME=strapi
DATABASE_PASSWORD=dev_password
DATABASE_SSL=false
DATABASE_SCHEMA=public

# PostgreSQL для Docker
POSTGRES_USER=strapi
POSTGRES_PASSWORD=dev_password
POSTGRES_DB=strapi_dev

# Preview Mode
CLIENT_URL=http://localhost:3000
PREVIEW_SECRET=dev-preview-secret-key

# Окружение
NODE_ENV=development
```

### Пример `@strapi/.env` для production

```env
# Безопасность (используйте сильные случайные значения!)
APP_KEYS=prod-key-1,prod-key-2,prod-key-3,prod-key-4
ADMIN_JWT_SECRET=prod-admin-jwt-secret-change-me
API_TOKEN_SALT=prod-api-token-salt-change-me
TRANSFER_TOKEN_SALT=prod-transfer-token-salt-change-me
ENCRYPTION_KEY=prod-encryption-key-change-me

# База данных
DATABASE_CLIENT=postgres
DATABASE_HOST=postgres
DATABASE_PORT=5432
DATABASE_NAME=strapi_prod
DATABASE_USERNAME=strapi
DATABASE_PASSWORD=strong_production_password
DATABASE_SSL=true
DATABASE_SCHEMA=public

# PostgreSQL для Docker
POSTGRES_USER=strapi
POSTGRES_PASSWORD=strong_production_password
POSTGRES_DB=strapi_prod

# Preview Mode
CLIENT_URL=https://yourdomain.com
PREVIEW_SECRET=strong-production-preview-secret

# Окружение
NODE_ENV=production
```

## 🐳 Docker переменные

Для работы с Docker Compose используются дополнительные переменные, которые задаются через системные переменные окружения или файл `.env` в корне проекта.

### Docker Compose переменные

```env
# Имя проекта (используется для имен контейнеров)
PROJECT_SLUG=rebootme

# Окружение (development или production)
ENVIRONMENT=development

# Imgproxy переменные
# Подпись URL отключена: IMGPROXY_KEY / IMGPROXY_SALT не используются
IMGPROXY_ALLOWED_SOURCES=s3://,local://
IMGPROXY_MAX_SRC_RESOLUTION=268402689
IMGPROXY_MAX_SRC_FILE_SIZE=268435456
```

### Описание Docker переменных

| Переменная | Описание | Пример | Обязательная |
|-----------|----------|--------|--------------|
| `PROJECT_SLUG` | Имя проекта для контейнеров | `rebootme` | ✅ Да |
| `ENVIRONMENT` | Окружение (`development`/`production`) | `development` | ✅ Да |
| `IMGPROXY_ALLOWED_SOURCES` | Разрешенные источники | `s3://,local://` | ❌ Нет |

> Подпись URL отключена, поэтому `IMGPROXY_KEY`/`IMGPROXY_SALT` больше не нужны. Фронт обращается к imgproxy через same-origin путь `/imgproxy` (rewrite в `next.config.ts` → контейнер `${PROJECT_SLUG}_imgproxy`), поэтому отдельная переменная `IMGPROXY_URL` не требуется.

### Использование в docker-compose.yml

Переменные используются в `docker-compose.yml`:

```yaml
services:
  backend:
    container_name: ${PROJECT_SLUG}_backend
    # ...
    environment:
      DATABASE_HOST: postgres
      NODE_ENV: ${ENVIRONMENT}

  imgproxy:
    environment:
      IMGPROXY_LOCAL_FILESYSTEM_ROOT: /opt/app/public
      IMGPROXY_ALLOWED_SOURCES: "${IMGPROXY_ALLOWED_SOURCES:-local}"
```

## 🔐 Генерация ключей для безопасности

Для генерации безопасных ключей используйте:

```bash
# Генерация случайных ключей (hex)
openssl rand -hex 32

# Генерация для APP_KEYS (4 ключа)
openssl rand -hex 32
openssl rand -hex 32
openssl rand -hex 32
openssl rand -hex 32

# Генерация для JWT секретов
openssl rand -base64 32
```

**Пример генерации полного набора ключей**:

```bash
# APP_KEYS (4 ключа через запятую)
echo "$(openssl rand -hex 32),$(openssl rand -hex 32),$(openssl rand -hex 32),$(openssl rand -hex 32)"

# ADMIN_JWT_SECRET
openssl rand -base64 32

# API_TOKEN_SALT
openssl rand -hex 32

# TRANSFER_TOKEN_SALT
openssl rand -hex 32

# ENCRYPTION_KEY
openssl rand -hex 32
```

## 🔧 Настройка для разных окружений

### Локальная разработка

1. **Создайте `.env` в корне проекта**:
```bash
cp .env.example .env  # если есть пример
# или создайте вручную
```

2. **Создайте `@strapi/.env`**:
```bash
cd @strapi
cp .env.example .env  # если есть пример
# или создайте вручную
```

3. **Заполните необходимые переменные** (см. примеры выше)

4. **Установите Docker переменные**:
```bash
export PROJECT_SLUG=rebootme
export ENVIRONMENT=development
```

5. **Запустите через Docker Compose**:
```bash
docker-compose up -d
```

Или локально (без Docker):
```bash
# Backend
cd @strapi
pnpm install
pnpm develop

# Frontend (в другом терминале)
pnpm install
pnpm dev
```

### Production окружение

1. **Установите все переменные в CI/CD системе** (GitLab CI)

2. **Для production используйте**:
   - Сильные случайные ключи
   - SSL для базы данных (`DATABASE_SSL=true`)
   - Безопасные пароли
   - Production URL для API

3. **Переменные автоматически создаются в CI/CD пайплайне**

## 🔒 Безопасность

### Важные правила

1. **Никогда не коммитьте `.env` файлы в Git**
   - Убедитесь, что `.env` и `@strapi/.env` в `.gitignore`

2. **Используйте разные ключи для разных окружений**
   - Development и Production должны иметь разные ключи

3. **Генерируйте сильные случайные ключи**
   - Используйте `openssl` или другие криптографически безопасные генераторы

4. **Храните секреты в безопасном месте**
   - Используйте CI/CD переменные для production
   - Используйте менеджеры секретов (HashiCorp Vault, AWS Secrets Manager и т.д.)

5. **Ограничьте доступ к `.env` файлам**
   - Установите правильные права доступа (chmod 600)

### Пример `.gitignore`

```gitignore
# Environment variables
.env
.env.local
.env.*.local
@strapi/.env
@strapi/.env.local
@strapi/.env.*.local
```

## 📝 CI/CD переменные

Проект использует GitLab CI/CD для автоматизации. В CI/CD настройте следующие переменные:

### Frontend переменные (CI/CD)

- `NEXT_PUBLIC_APP_ENV` - Окружение приложения
- `NEXT_PUBLIC_SITE_URL` - URL сайта
- `NEXT_PUBLIC_STRAPI_API_TOKEN` - API токен Strapi
- `NEXT_PUBLIC_STRAPI_URL` - URL Strapi API
- `NEXT_PUBLIC_BASE_API_URL` - Базовый URL API (опционально)
- `NEXT_PUBLIC_GA_TRACKING_ID` - Google Analytics ID (опционально)

### Backend переменные (CI/CD)

- `ADMIN_JWT_SECRET`
- `API_TOKEN_SALT`
- `APP_KEYS`
- `TRANSFER_TOKEN_SALT`
- `ENCRYPTION_KEY`
- `CLIENT_URL` (для Preview Mode)
- `PREVIEW_SECRET` (для Preview Mode)
- `DATABASE_CLIENT`
- `DATABASE_HOST`
- `DATABASE_PORT`
- `DATABASE_NAME`
- `DATABASE_USERNAME`
- `DATABASE_PASSWORD`
- `DATABASE_SSL`

### Docker переменные (CI/CD)

- `PROJECT_SLUG`
- `ENVIRONMENT`
- `IMGPROXY_ALLOWED_SOURCES`

### Frontend переменные для Preview (CI/CD)

- `PREVIEW_SECRET` - Секретный ключ для Preview Mode (только сервер)

## 🔍 Проверка переменных

### Проверка Frontend переменных

```typescript
// src/shared/config/index.ts
console.log('Strapi URL:', config.api.strapiUrl);
console.log('Is Development:', config.global.isDevelopment);
```

### Проверка Backend переменных

В Strapi консоли:
```bash
cd @strapi
pnpm console
```

Или через Docker:
```bash
docker exec -it ${PROJECT_SLUG}_backend strapi console
```

## 🐛 Решение проблем

### Проблема: Переменные не загружаются

**Решение**:
1. Проверьте, что файл `.env` находится в правильной директории
2. Перезапустите сервер разработки
3. Убедитесь, что переменные имеют префикс `NEXT_PUBLIC_` для клиентского кода
4. Проверьте, что нет синтаксических ошибок в `.env` файле

### Проблема: База данных не подключается

**Решение**:
1. Проверьте `DATABASE_HOST` - для Docker используйте имя сервиса (`postgres`)
2. Проверьте права доступа пользователя БД
3. Проверьте, что PostgreSQL контейнер запущен
4. Проверьте логи: `docker logs ${PROJECT_SLUG}_postgres`

### Проблема: API токен не работает

**Решение**:
1. Проверьте, что токен правильно скопирован
2. Убедитесь, что токен активен в Strapi админке
3. Проверьте формат токена (без пробелов, переносов строк)
4. Проверьте, что используется правильный токен для окружения

### Проблема: Docker переменные не применяются

**Решение**:
1. Убедитесь, что переменные экспортированы перед запуском:
   ```bash
   export PROJECT_SLUG=rebootme
   export ENVIRONMENT=development
   ```
2. Или создайте `.env` файл в корне проекта с этими переменными
3. Проверьте, что docker-compose читает переменные: `docker-compose config`

## 📚 Дополнительные ресурсы

- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Strapi Environment Variables](https://docs.strapi.io/dev-docs/configurations/environment)
- [Docker Compose Environment Variables](https://docs.docker.com/compose/environment-variables/)
