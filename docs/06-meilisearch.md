# Meilisearch — Полнотекстовый поиск

## Обзор

Meilisearch — это быстрый поисковый движок с открытым кодом. В проекте используется для полнотекстового поиска по контенту Strapi.

**Ключевые особенности:**
- ⚡ Мгновенный поиск
- ✍️ Толерантность к опечаткам
- 🔍 Поиск по нескольким полям
- 🎯 Фильтрация и сортировка
- 🌍 Поддержка множества языков

## Архитектура

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Strapi    │────▶│ Meilisearch │◀────│   Frontend  │
│   (CMS)     │     │   (Search)  │     │  (Next.js)  │
└─────────────┘     └─────────────┘     └─────────────┘
      │                   │
      ▼                   ▼
  PostgreSQL          Индексы
```

- **Strapi** → автоматически синхронизирует контент с Meilisearch через плагин
- **Frontend** → делает поисковые запросы напрямую к Meilisearch

## Конфигурация

### Docker Compose

Сервис определён в `docker-compose.yml`:

```yaml
meilisearch:
  container_name: ${PROJECT_SLUG}_meilisearch
  image: getmeili/meilisearch:v1.11
  restart: unless-stopped
  environment:
    MEILI_MASTER_KEY: "${MEILI_MASTER_KEY:-masterKey123}"
    MEILI_ENV: "${MEILI_ENV:-development}"
    MEILI_NO_ANALYTICS: "true"
  volumes:
    - meilisearch-data:/meili_data
  ports:
    - "7700:7700"
  networks:
    - internal
```

### Переменные окружения

**`.env`** (корень проекта):
```env
MEILI_MASTER_KEY=masterKey123456
MEILI_ENV=development
```

**`@strapi/.env`**:
```env
MEILI_HOST=http://meilisearch:7700
MEILI_MASTER_KEY=masterKey123456
```

### Strapi Plugin

Настройки в `@strapi/config/plugins.ts`:

```typescript
meilisearch: {
  config: {
    host: process.env.MEILI_HOST || 'http://meilisearch:7700',
    apiKey: process.env.MEILI_MASTER_KEY || 'masterKey123456',
    
    // Настройки для коллекции product
    product: {
      // Какие поля отправлять в индекс
      transformEntry({ entry }) {
        return {
          id: entry.id, // обязательно!
          title: entry.title,
          description: entry.description,
        };
      },
      // Настройки индекса
      settings: {
        searchableAttributes: ['title', 'description'],
      },
    },
  },
},
```

## Использование

### Запуск

```bash
# Запустить все сервисы
docker compose up -d

# Или только Meilisearch
docker compose up -d meilisearch
```

### Admin UI

Открой http://localhost:7700 и введи Master Key для доступа к дашборду.

### Настройка индексации в Strapi

1. Открой Strapi Admin: http://localhost:1337/admin
2. Перейди в **Meilisearch**
3. Включи нужные Collection Types (чекбоксы слева)
4. Нажми **Update** для реиндексации

### Поиск через API

**Базовый поиск:**
```bash
curl -X POST 'http://localhost:7700/indexes/product/search' \
  -H 'Authorization: Bearer masterKey123456' \
  -H 'Content-Type: application/json' \
  --data '{ "q": "cheese" }'
```

**С фильтрацией:**
```bash
curl -X POST 'http://localhost:7700/indexes/product/search' \
  -H 'Authorization: Bearer masterKey123456' \
  -H 'Content-Type: application/json' \
  --data '{
    "q": "pizza",
    "filter": "price > 100"
  }'
```

### Использование в Next.js

**Установка клиента:**
```bash
pnpm add meilisearch
```

**Пример хука (src/shared/hooks/use-search.ts):**
```typescript
import { Meilisearch } from 'meilisearch';

// Создаём клиент (host должен быть доступен из браузера!)
const client = new Meilisearch({
  host: process.env.NEXT_PUBLIC_MEILISEARCH_URL || 'http://localhost:7700',
  apiKey: process.env.NEXT_PUBLIC_MEILISEARCH_SEARCH_KEY, // Search Key, НЕ Master!
});

interface SearchResult {
  id: number;
  title: string;
  description: string;
}

export async function searchProducts(query: string): Promise<SearchResult[]> {
  const index = client.index('product');
  const results = await index.search<SearchResult>(query);
  return results.hits;
}
```

## Настройка полей для индексации

### transformEntry

Определяет какие поля попадут в индекс:

```typescript
product: {
  transformEntry({ entry }) {
    return {
      id: entry.id,           // обязательно
      title: entry.title,
      description: entry.description,
      price: entry.price,
      // Вложенные объекты
      category: entry.category?.name,
    };
  },
}
```

### filterEntry

Исключает записи из индекса:

```typescript
product: {
  filterEntry({ entry }) {
    // Не индексировать товары без цены
    return entry.price !== null;
  },
}
```

### settings

Настройки индекса Meilisearch:

```typescript
product: {
  settings: {
    // Поля для полнотекстового поиска (приоритет сверху вниз)
    searchableAttributes: ['title', 'description', 'category'],
    
    // Поля для фильтрации (WHERE условия)
    filterableAttributes: ['price', 'category', 'inStock'],
    
    // Поля для сортировки
    sortableAttributes: ['price', 'createdAt'],
    
    // Синонимы
    synonyms: {
      phone: ['smartphone', 'mobile'],
      laptop: ['notebook', 'computer'],
    },
  },
}
```

## Безопасность

### API Keys

Meilisearch поддерживает три типа ключей:

| Ключ | Использование | Доступ |
|------|---------------|--------|
| Master Key | Только сервер/Strapi | Полный доступ |
| Admin Key | Админ-панели | Управление индексами |
| Search Key | Frontend | Только поиск |

**Получение Search Key:**
```bash
curl -X GET 'http://localhost:7700/keys' \
  -H 'Authorization: Bearer masterKey123456'
```

### Production

В production:
1. Используй сложный `MEILI_MASTER_KEY`
2. Закрой порт 7700 для внешнего доступа
3. На frontend используй только Search Key
4. Настрой `MEILI_ENV=production`

## Полезные ссылки

- [Meilisearch Docs](https://www.meilisearch.com/docs)
- [Strapi Plugin GitHub](https://github.com/meilisearch/strapi-plugin-meilisearch)
- [Meilisearch JS SDK](https://github.com/meilisearch/meilisearch-js)
- [Instant Meilisearch (UI)](https://github.com/meilisearch/meilisearch-js-plugins/tree/main/packages/instant-meilisearch)
