# Boilerplate Next.js + TypeScript + Strapi

Boilerplate для разработки современных веб-приложений на Next.js с использованием Feature-Sliced Design архитектуры.

## 📚 Документация

Подробная документация проекта находится в директории [`docs/`](./docs/):

- [Структура проекта и FSD архитектура](./docs/01-project-structure.md)
- [Пакеты проекта и Biome](./docs/02-packages-and-biome.md)
- [Переменные окружения](./docs/03-environment-variables.md)
- [Запуск через Docker Compose](./docs/04-docker-compose.md)

См. [README в docs/](./docs/README.md) для полного оглавления.

## 🚀 Быстрый старт

1. Настройте переменные окружения (см. [документацию](./docs/03-environment-variables.md))
2. Запустите проект:
   ```bash
   export PROJECT_SLUG=rebootme
   export ENVIRONMENT=development
   docker compose up -d
   ```
3. Откройте http://localhost:3000

## 🛠️ Технологии

- **Next.js 15.5.7** - React фреймворк
- **TypeScript 5.9.2** - Типизация
- **Strapi** - Headless CMS
- **Feature-Sliced Design** - Архитектура проекта
- **Biome** - Линтер и форматтер
- **Docker Compose** - Локальная разработка
