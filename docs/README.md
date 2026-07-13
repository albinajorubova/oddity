# Документация проекта

Добро пожаловать в документацию boilerplate проекта на Next.js с использованием Feature-Sliced Design архитектуры.

## 📚 Содержание

1. **[Структура проекта и FSD архитектура](./01-project-structure.md)**
   - Обзор архитектуры Feature-Sliced Design
   - Описание всех слоев (app, processes, pages, widgets, features, entities, shared, _pages)
   - Правила импорта между слоями
   - Алиасы путей
   - Структура слайсов (api/, model/, ui/)
   - Примеры использования

2. **[Пакеты проекта и Biome](./02-packages-and-biome.md)**
   - Обзор основных зависимостей
   - Детальная настройка Biome (линтер и форматтер)
   - Конфигурация правил линтера
   - Организация импортов
   - Примеры использования команд
   - Краткий обзор других ключевых пакетов

3. **[Переменные окружения](./03-environment-variables.md)**
   - Frontend переменные (.env)
   - Backend переменные (@strapi/.env)
   - Docker переменные
   - Примеры конфигурации для development и production
   - Генерация ключей для безопасности
   - Решение проблем

4. **[Запуск проекта через Docker Compose](./04-docker-compose.md)**
   - Требования и установка
   - Архитектура сервисов
   - Настройка переменных окружения
   - Пошаговая инструкция запуска
   - Полезные команды
   - Работа с volumes
   - Решение проблем

5. **[Image Proxy - Оптимизация изображений](./05-image-proxy.md)**
   - Обзор системы оптимизации изображений
   - Архитектура и флоу обработки
   - Компоненты системы
   - Использование и примеры
   - Конфигурация
   - Типы данных

6. **[Meilisearch - Полнотекстовый поиск](./06-meilisearch.md)**
   - Обзор и архитектура поиска
   - Конфигурация Docker, ENV, Strapi plugin
   - Настройка индексации (transformEntry, filterEntry, settings)
   - Использование в Next.js
   - Безопасность и API Keys

7**[Strapi Preview Mode](./07-strapi-preview.md)**
   - Обзор Preview Mode
   - Настройка и конфигурация
   - Использование для редакторов и разработчиков
   - Добавление поддержки новых content types
   - Решение проблем

8. **[CI/CD — сборка и деплой через GitLab](./08-ci-cd.md)**
   - Подключение переиспользуемого CI/CD-компонента и его параметры
   - Стадии prepare → build → deploy
   - Ветки → окружения → версии образов (testing/staging/release)
   - Реестр образов, версионирование тегов
   - Шаблоны env (`ci/env/*.env.tpl`), npm-реестр (npmjs / зеркало GitVerse)
   - Healthcheck и порядок запуска контейнеров
   - Отладка и частые ошибки

9. **[Скрипты — менеджер CI/CD-переменных GitLab](./09-gitlab-vars-script.md)**
   - `scripts/gitlab_copy_env.sh` — копирование и загрузка CI-переменных
   - Конфигурация `gitlab_vars.conf`
   - Режим 1: копирование между environment'ами
   - Режим 2: загрузка из `.env`-файлов
   - Логика создания/обновления переменных и откаты
   - Замечания по безопасности

10. **[Ansible — подготовка прод-сервера](./10-ansible-playbook.md)**
    - `ansible/playbooks/prod-routine.yml` — инициализация сервера
    - Установка Docker, nginx (reverse-proxy), certbot
    - Deploy-пользователь + SSH-ключ + `/var/www/<user>`
    - Переменные (`project_user`, `project_group`) и запуск
    - `templates/nginx.conf`, TLS через certbot
    - Связь с CI (`deploy_production`)

## 🚀 Быстрый старт

1. **Настройте переменные окружения** (см. [03-environment-variables.md](./03-environment-variables.md))
2. **Запустите проект через Docker Compose** (см. [04-docker-compose.md](./04-docker-compose.md))
3. **Изучите структуру проекта** (см. [01-project-structure.md](./01-project-structure.md))
4. **Настройте Biome** (см. [02-packages-and-biome.md](./02-packages-and-biome.md))

## 📖 Дополнительная информация

- Основной README проекта находится в корне: [../README.md](../README.md)
- Существующая документация компонентов: [../doc/components.md](../doc/components.md)
- Существующая документация библиотек: [../doc/libraries.md](../doc/libraries.md)

## 🔗 Полезные ссылки

- [Feature-Sliced Design](https://feature-sliced.design/)
- [Next.js документация](https://nextjs.org/docs)
- [Strapi документация](https://docs.strapi.io/)
- [Biome документация](https://biomejs.dev/)
- [Docker Compose документация](https://docs.docker.com/compose/)
