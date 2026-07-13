# Ansible — подготовка прод-сервера

## 📋 Обзор

Плейбук `ansible/playbooks/prod-routine.yml` — **однократная инициализация production-сервера** (свежая Ubuntu 22.04 «jammy») под деплой проекта. Он ставит и настраивает всё, чего ожидает CI-джоб `deploy_production`:

- **Docker** + `docker-compose` — для запуска контейнеров проекта;
- **системный nginx** как reverse-proxy к контейнерам (порты `3000/1337/8080/7700` на `localhost`) с кешированием;
- **certbot** (+ плагин nginx) — для TLS-сертификатов Let's Encrypt;
- **deploy-пользователя** (`project_user`) в группе `docker`, с SSH-ключом и каталогом `/var/www/<project_user>`.

После прогона сервер готов принимать деплой: CI по SSH заходит как `project_user` в `/var/www/<project_user>` и выполняет `docker compose -f docker-compose.production.yml up -d` (см. [08-ci-cd.md](./08-ci-cd.md)).

> ⚠️ Прод использует **системный nginx**, а не `nginx-proxy` из testing-compose. На проде `docker-compose.production.yml` пробрасывает порты на `localhost`, а маршрутизацию/TLS делает nginx, поднятый этим плейбуком.

## 📁 Структура

```
ansible/
├── inventory.ini                 # хосты (production)
├── playbooks/
│   └── prod-routine.yml          # основной плейбук
├── templates/
│   └── nginx.conf                # конфиг reverse-proxy (upstreams + кеш)
└── keys/
    ├── <project_user>.pub        # SSH public key деплой-пользователя
    └── ...
```

## ✅ Требования (control-машина)

- **Ansible** (локально, откуда запускаете);
- коллекция **`ansible.posix`** (используется `authorized_key`):
  ```bash
  ansible-galaxy collection install ansible.posix
  ```
- SSH-доступ к серверу под пользователем из инвентаря (`ubuntu`) с sudo;
- локально должны существовать:
  - `ansible/keys/<project_user>.pub` — публичный ключ деплой-пользователя;
  - `ansible/templates/nginx.conf` — конфиг под ваши домены (см. ниже).

Плейбук в `pre_tasks` проверяет наличие и формат этих файлов и падает с понятным сообщением, если чего-то нет.

## 🗂️ Инвентарь (`inventory.ini`)

```ini
[production]
prod-1 ansible_host=81.26.187.234 ansible_user=ubuntu
```

Меняйте `ansible_host` под свой сервер. Группа `production` — на неё нацелен плейбук (`hosts: production`).

## ⚙️ Переменные

| Переменная | Обязательна | Назначение |
|---|---|---|
| `project_user` | ✅ (через `-e`) | Deploy-пользователь = `SSH_USER` из CI; его дом `/var/www/<project_user>` |
| `project_group` | ✅ (через `-e`) | Группа-владелец каталогов проекта |
| `project_dir` | нет | `/var/www/{{ project_user }}` (дефолт) |
| `docker_ubuntu_codename` | нет | `jammy` (кодовое имя Ubuntu для docker apt-репо) |
| `nginx_site_name` | нет | `{{ project_user }}` — имя сайта в `sites-available` |

`project_user`/`project_group` **не имеют дефолтов** — плейбук `assert`-ит их в начале.

## ▶️ Запуск

```bash
cd ansible
ansible-playbook -i inventory.ini playbooks/prod-routine.yml \
  -e "project_user=familydom project_group=familydom"
```

При необходимости — `--ask-become-pass` (если sudo с паролем) и `-l prod-1` (ограничить хостом).

## 🔧 Что делает плейбук (по шагам)

1. **Проверки** (`pre_tasks`): заданы `project_user`/`project_group`; локально есть `nginx.conf` и `keys/<user>.pub`; ключ валидного формата (`ssh-rsa` / `ssh-ed25519` / `ecdsa`).
2. **Базовые пакеты**: `curl`, `ca-certificates`, `gnupg`, `lsb-release`, `wget` и т.д.
3. **nginx**: установка + `enable`/`start` службы.
4. **certbot**: `certbot` + `python3-certbot-nginx`.
5. **Docker**: GPG-ключ + apt-репозиторий Docker → `docker-ce` + `docker-compose`; группа `docker`.
6. **Deploy-пользователь**: создаётся `project_user` (shell `/bin/bash`, дом, группа `docker`).
7. **nginx reverse-proxy**: создаёт кеш-каталоги (`/var/cache/nginx/{api,frontend}`), копирует `templates/nginx.conf` в `sites-available/<user>`, включает сайт, отключает `default`, `nginx -t`, рестарт.
8. **Каталог проекта**: `/var/www/<project_user>` во владении `project_user:project_group`.
9. **SSH-доступ**: `~/.ssh` пользователя, установка `authorized_keys` из `keys/<user>.pub`, права `0600`.

## 🌐 `templates/nginx.conf` — reverse-proxy

Проксирует внешние домены на локальные контейнеры и кеширует ответы:

| Upstream | Порт | Назначение |
|---|---|---|
| `frontend` | 3000 | Next.js |
| `backend` | 1337 | Strapi (в т.ч. `/admin`, `/_health`) |
| `imgproxy` | 8080 | обработка изображений (`/health`) |
| `search` | 7700 | Meilisearch (`/health`) |

Особенности: зоны кеша `frontend_cache` / `api_cache`, заголовок `X-Cache-Status`, обход кеша для `POST/PUT/DELETE/PATCH`, редирект `www → non-www`.

> ⚠️ В шаблоне зашиты примерные домены (`*.familydom-production.snpdev.ru`) — **замените `server_name` под свой проект** перед прогоном. TLS-строки (`listen 443 ssl`, `ssl_certificate`) закомментированы — сертификаты выпускаются certbot (см. ниже).

## 🔒 TLS (certbot)

Плейбук ставит certbot, но **сертификаты не выпускает** (нужен уже указывающий на сервер DNS). После прогона и настройки DNS — вручную:

```bash
ssh ubuntu@<server>
sudo certbot --nginx -d familydom-production.snpdev.ru -d admin.familydom-production.snpdev.ru \
  -d search.familydom-production.snpdev.ru -d imgproxy.familydom-production.snpdev.ru
```
certbot сам пропишет `listen 443 ssl` и пути к сертификатам в конфиг nginx и настроит автопродление.

## 🔗 Связь с CI/CD

| Что создаёт плейбук | Как использует CI (`deploy_production`) |
|---|---|
| `project_user` + SSH-ключ | заходит по SSH как `SSH_USER` (= `project_user`) |
| `/var/www/<project_user>` | `REMOTE_DIR`, куда `scp` compose + `.env` и запускается `docker compose up` |
| Docker + группа `docker` | `docker compose pull/up` без sudo |
| системный nginx | проксирует контейнеры (порты из `docker-compose.production.yml`) наружу |

Соответствие: значение `SSH_USER` в CI-переменных = `project_user` из плейбука.

## ♻️ Идемпотентность

Плейбук можно **прогонять повторно** — задачи идемпотентны (apt-состояния, `creates:` для docker-ключа, `state: present/link`). Повторный запуск безопасно доводит сервер до нужного состояния (например, после обновления `nginx.conf`).

## 🔗 Связанные документы

- [CI/CD — сборка и деплой](./08-ci-cd.md)
- [Docker Compose](./04-docker-compose.md)
- [Переменные окружения](./03-environment-variables.md)
