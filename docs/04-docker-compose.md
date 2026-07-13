# Запуск проекта локально через Docker Compose

## 📋 Обзор

Проект использует Docker Compose для локальной разработки. Это позволяет запустить все необходимые сервисы (frontend, backend, база данных, imgproxy) одной командой.

## 🐳 Требования

Перед началом работы убедитесь, что у вас установлены:

- **Docker** версии 20.10 или выше
- **Docker Compose** версии 2.0 или выше

### Проверка установки

```bash
# Проверка Docker
docker --version

# Проверка Docker Compose
docker compose version
```

## 🏗️ Архитектура сервисов

Проект состоит из 4 основных сервисов:

```
┌─────────────┐
│  Frontend   │  Next.js приложение (порт 3000)
│  (Next.js)  │
└─────────────┘
       │
       ├─────────────────┐
       │                 │
┌──────▼──────┐   ┌──────▼──────┐
│   Backend   │   │   Imgproxy  │
│  (Strapi)   │   │  (порт 8080)│
│ (порт 1337) │   └─────────────┘
└──────┬──────┘
       │
┌──────▼──────┐
│  PostgreSQL │
│ (порт 5432) │
└─────────────┘
```

### Сервисы

1. **frontend** - Next.js приложение
2. **backend** - Strapi CMS
3. **postgres** - PostgreSQL база данных
4. **imgproxy** - Сервис обработки изображений

## ⚙️ Настройка переменных окружения

Перед запуском необходимо настроить переменные окружения.

### 1. Системные переменные

Установите следующие переменные через экспорт или создайте `.env` файл в корне проекта:

```bash
export PROJECT_SLUG=rebootme
export ENVIRONMENT=development
```

Или создайте `.env` файл:

```env
PROJECT_SLUG=rebootme
ENVIRONMENT=development
```

**Описание**:
- `PROJECT_SLUG` - Имя проекта, используется для имен контейнеров (например, `rebootme_backend`)
- `ENVIRONMENT` - Окружение: `development` или `production`

### 2. Frontend переменные

Создайте файл `.env` в корне проекта (см. [документацию по переменным окружения](./03-environment-variables.md)):

```env
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
NEXT_PUBLIC_STRAPI_API_TOKEN=your_token_here
NEXT_PUBLIC_BASE_API_URL=/api/
NEXT_PUBLIC_APP_ENV=development
```

### 3. Backend переменные

Создайте файл `@strapi/.env` (см. [документацию по переменным окружения](./03-environment-variables.md)):

```env
APP_KEYS=key1,key2,key3,key4
ADMIN_JWT_SECRET=your-secret
API_TOKEN_SALT=your-salt
TRANSFER_TOKEN_SALT=your-salt
ENCRYPTION_KEY=your-key

DATABASE_CLIENT=postgres
DATABASE_HOST=postgres
DATABASE_PORT=5432
DATABASE_NAME=strapi
DATABASE_USERNAME=strapi
DATABASE_PASSWORD=your_password
DATABASE_SSL=false

POSTGRES_USER=strapi
POSTGRES_PASSWORD=your_password
POSTGRES_DB=strapi

NODE_ENV=development
```

**Важно**: Для Docker `DATABASE_HOST` должен быть `postgres` (имя сервиса), а не `localhost`.

## 🚀 Запуск проекта

### Первый запуск

1. **Настройте переменные окружения** (см. выше)

2. **Запустите все сервисы**:
```bash
docker compose up -d
```

Флаг `-d` запускает контейнеры в фоновом режиме (detached mode).

3. **Проверьте статус контейнеров**:
```bash
docker compose ps
```

Вы должны увидеть 4 запущенных контейнера:
- `rebootme_frontend`
- `rebootme_backend`
- `rebootme_postgres`
- `rebootme_imgproxy`

### Последующие запуски

После первого запуска просто используйте:

```bash
docker compose up -d
```

Docker Compose автоматически переиспользует существующие контейнеры и volumes.

## 🔍 Проверка работы сервисов

### Проверка логов

```bash
# Все сервисы
docker compose logs -f

# Конкретный сервис
docker compose logs -f frontend
docker compose logs -f backend
docker compose logs -f postgres
docker compose logs -f imgproxy
```

### Проверка портов

После запуска сервисы доступны по следующим адресам:

| Сервис | URL | Описание |
|--------|-----|----------|
| Frontend | http://localhost:3000 | Next.js приложение |
| Backend (Strapi) | http://localhost:1337 | Strapi CMS API |
| Strapi Admin | http://localhost:1337/admin | Админ-панель Strapi |
| PostgreSQL | localhost:5432 | База данных |
| Imgproxy | http://localhost:8080 | Обработка изображений |

### Проверка через браузер

1. Откройте http://localhost:3000 - должен открыться фронтенд
2. Откройте http://localhost:1337/admin - должна открыться админ-панель Strapi

## 🛠️ Полезные команды

### Управление контейнерами

```bash
# Запуск всех сервисов
docker compose up -d

# Остановка всех сервисов
docker compose stop

# Остановка и удаление контейнеров
docker compose down

# Перезапуск конкретного сервиса
docker compose restart frontend
docker compose restart backend

# Просмотр статуса
docker compose ps
```

### Работа с логами

```bash
# Просмотр логов всех сервисов
docker compose logs

# Просмотр логов с обновлением в реальном времени
docker compose logs -f

# Просмотр логов конкретного сервиса
docker compose logs frontend
docker compose logs backend

# Просмотр последних 100 строк
docker compose logs --tail=100 frontend
```

### Выполнение команд в контейнерах

```bash
# Выполнить команду в контейнере frontend
docker compose exec frontend pnpm install
docker compose exec frontend pnpm build

# Выполнить команду в контейнере backend
docker compose exec backend pnpm strapi console
docker compose exec backend pnpm strapi generate:key

# Открыть интерактивную оболочку
docker compose exec frontend sh
docker compose exec backend sh
docker compose exec postgres psql -U strapi -d strapi
```

### Пересборка образов

```bash
# Пересобрать все образы
docker compose build

# Пересобрать конкретный сервис
docker compose build frontend
docker compose build backend

# Пересобрать без кэша
docker compose build --no-cache frontend
```

### Очистка

```bash
# Остановить и удалить контейнеры
docker compose down

# Удалить контейнеры и volumes (⚠️ удалит данные БД!)
docker compose down -v

# Удалить контейнеры, volumes и образы
docker compose down -v --rmi all
```

## 📦 Volumes (тома данных)

Проект использует следующие volumes для хранения данных:

| Volume | Назначение | Расположение |
|--------|------------|--------------|
| `strapi-data` | Данные PostgreSQL | `/var/lib/postgresql/data/` |
| `strapi-uploads` | Загруженные файлы Strapi | `/opt/app/public/uploads` |
| `strapi-node-modules` | node_modules для backend | `/opt/app/node_modules` |

### Просмотр volumes

```bash
# Список всех volumes
docker volume ls

# Информация о конкретном volume
docker volume inspect rebootme_strapi-data
```

### Резервное копирование данных

```bash
# Бэкап базы данных
docker compose exec postgres pg_dump -U strapi strapi > backup.sql

# Восстановление базы данных
docker compose exec -T postgres psql -U strapi strapi < backup.sql
```

## 🔧 Конфигурация сервисов

### Frontend сервис

```yaml
frontend:
  container_name: ${PROJECT_SLUG}_frontend
  build:
    context: .
    dockerfile: ./docker/frontend/${ENVIRONMENT}/Dockerfile
  ports:
    - "3000:3000"
  volumes:
    - ./:/app              # Монтирование кода для hot-reload
    - /app/node_modules    # Изолированные node_modules
    - /app/.next           # Изолированный .next
  env_file: ./.env
```

**Особенности**:
- Hot-reload работает благодаря монтированию `./:/app`
- `node_modules` и `.next` изолированы для производительности
- Использует Dockerfile из `docker/frontend/${ENVIRONMENT}/`

### Backend сервис

```yaml
backend:
  container_name: ${PROJECT_SLUG}_backend
  build:
    context: ./@strapi
    dockerfile: ../docker/backend/${ENVIRONMENT}/Dockerfile
  ports:
    - "1337:1337"
  volumes:
    - strapi-uploads:/opt/app/public/uploads
    - strapi-node-modules:/opt/app/node_modules
    - ./@strapi:/opt/app
  env_file: ./@strapi/.env
  environment:
    DATABASE_HOST: postgres  # Имя сервиса для Docker сети
  depends_on:
    - postgres
```

**Особенности**:
- Зависит от `postgres` сервиса
- `DATABASE_HOST=postgres` для работы в Docker сети
- Загруженные файлы хранятся в volume

### PostgreSQL сервис

```yaml
postgres:
  container_name: ${PROJECT_SLUG}_postgres
  image: postgres:16.0-alpine
  platform: linux/amd64  # Для Apple M1/M2
  ports:
    - "5432:5432"
  volumes:
    - strapi-data:/var/lib/postgresql/data/
  env_file: ./@strapi/.env
```

**Особенности**:
- Использует `postgres:16.0-alpine` образ
- `platform: linux/amd64` для совместимости с Apple Silicon
- Данные сохраняются в volume `strapi-data`

### Imgproxy сервис

```yaml
imgproxy:
  container_name: ${PROJECT_SLUG}_imgproxy
  image: darthsim/imgproxy:v3.8.0
  ports:
    - "8080:8080"
  volumes:
    - strapi-uploads:/opt/app/public/uploads:ro  # Только чтение
  environment:
    IMGPROXY_LOCAL_FILESYSTEM_ROOT: /opt/app/public
    IMGPROXY_ALLOWED_SOURCES: "${IMGPROXY_ALLOWED_SOURCES:-local}"
  depends_on:
    - backend
```

**Особенности**:
- Обрабатывает изображения из Strapi uploads
- Volume монтируется только для чтения (`:ro`)
- Подпись URL отключена (`IMGPROXY_KEY`/`IMGPROXY_SALT` не задаются) — принимает `local://` ссылки без подписи

## 🌐 Сеть (Network)

Все сервисы находятся в одной Docker сети `rebootme_internal`, что позволяет им общаться по именам сервисов:

```yaml
networks:
  internal:
    name: ${PROJECT_SLUG}_internal
    driver: bridge
```

**Пример использования**:
- Backend подключается к PostgreSQL по адресу `postgres:5432` (не `localhost:5432`)
- Frontend может обращаться к backend по `backend:1337` внутри сети

## 🐛 Решение проблем

### Проблема: Контейнеры не запускаются

**Решение**:
1. Проверьте, что переменные `PROJECT_SLUG` и `ENVIRONMENT` установлены
2. Проверьте логи: `docker compose logs`
3. Убедитесь, что порты не заняты другими приложениями
4. Проверьте, что Docker запущен: `docker ps`

### Проблема: База данных не подключается

**Решение**:
1. Проверьте, что `DATABASE_HOST=postgres` в `@strapi/.env` (не `localhost`)
2. Убедитесь, что PostgreSQL контейнер запущен: `docker compose ps postgres`
3. Проверьте логи PostgreSQL: `docker compose logs postgres`
4. Проверьте переменные БД в `@strapi/.env`

### Проблема: Frontend не видит изменения

**Решение**:
1. Убедитесь, что volume `./:/app` правильно смонтирован
2. Проверьте, что файлы изменяются в правильной директории
3. Перезапустите контейнер: `docker compose restart frontend`
4. Проверьте логи: `docker compose logs frontend`

### Проблема: Порты заняты

**Решение**:
1. Найдите процесс, использующий порт:
   ```bash
   # macOS/Linux
   lsof -i :3000
   lsof -i :1337
   
   # Windows
   netstat -ano | findstr :3000
   ```

2. Остановите процесс или измените порты в `docker-compose.yml`

### Проблема: Ошибка платформы на Apple M1/M2

**Решение**:
PostgreSQL уже настроен с `platform: linux/amd64`. Если проблемы с другими сервисами:

```bash
# Пересобрать для нужной платформы
docker compose build --platform linux/amd64 frontend
```

### Проблема: Недостаточно места на диске

**Решение**:
1. Очистите неиспользуемые образы и контейнеры:
   ```bash
   docker system prune -a
   ```

2. Удалите неиспользуемые volumes:
   ```bash
   docker volume prune
   ```

### Проблема: Strapi не запускается

**Решение**:
1. Проверьте все обязательные переменные в `@strapi/.env`
2. Проверьте логи: `docker compose logs backend`
3. Убедитесь, что база данных доступна
4. Попробуйте пересобрать образ: `docker compose build --no-cache backend`

## 📝 Разработка без Docker

Если вы предпочитаете работать без Docker:

### Backend (Strapi)

```bash
cd @strapi
pnpm install
pnpm develop
```

**Важно**: В `@strapi/.env` установите `DATABASE_HOST=localhost` (не `postgres`).

### Frontend (Next.js)

```bash
pnpm install
pnpm dev
```

### PostgreSQL

Запустите PostgreSQL локально или используйте Docker только для БД:

```bash
docker compose up -d postgres
```

## 🔄 Переключение между окружениями

Для переключения между `development` и `production`:

```bash
# Development
export ENVIRONMENT=development
docker compose down
docker compose up -d

# Production
export ENVIRONMENT=production
docker compose down
docker compose up -d
```

**Важно**: При смене окружения пересоберите образы:

```bash
docker compose build
docker compose up -d
```

## 📚 Дополнительные ресурсы

- [Docker Compose документация](https://docs.docker.com/compose/)
- [Docker документация](https://docs.docker.com/)
- [Strapi Docker документация](https://docs.strapi.io/dev-docs/installation/docker)
- [Next.js Docker документация](https://nextjs.org/docs/deployment#docker-image)
