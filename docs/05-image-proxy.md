# Image Proxy - Оптимизация изображений

Документация описывает систему оптимизации изображений через imgproxy в проекте.

## 📋 Содержание

- [Обзор](#обзор)
- [Архитектура](#архитектура)
- [Флоу обработки изображений](#флоу-обработки-изображений)
- [Компоненты системы](#компоненты-системы)
- [Использование](#использование)
- [Конфигурация](#конфигурация)
- [Типы данных](#типы-данных)

## Обзор

Проект использует [imgproxy](https://imgproxy.net/) для оптимизации изображений на лету. Это позволяет:

- Автоматически оптимизировать изображения (формат, качество, размер)
- Генерировать responsive изображения для разных устройств
- Кэшировать оптимизированные версии
- Уменьшать размер файлов и улучшать производительность

> ℹ️ **Важно**: все ссылки на imgproxy формируются **на фронте во время верстки** (в компоненте `MediaImage` / утилите `imageproxyUrl`). Strapi отдает только сырые данные о медиа — отдельного middleware-ребилдера на стороне Strapi больше нет.
>
> Подпись URL **не используется**: `IMGPROXY_KEY` и `IMGPROXY_SALT` не задаются, imgproxy работает в незащищенном режиме и принимает `local://` ссылки без подписи.
>
> Запросы к imgproxy идут через **same-origin путь `/imgproxy`**, который Next.js проксирует на контейнер imgproxy (rewrites в `next.config.ts`) — по аналогии с `/api`. Браузер не обращается к imgproxy напрямую.

## Архитектура

```
┌─────────────┐
│   Strapi    │ ──► Сырые данные медиа (url /uploads/, width, height, mime)
└─────────────┘
      │
      ▼
┌─────────────────────────────────┐
│  getSources() (фронт)            │
│  - Разбирает MediaWithBreakpoints │
│  - Ограничивает размеры (≤ 2560) │
│  - Формирует srcSet через imgproxy│
└─────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────┐
│  imageproxyUrl() (фронт)         │
│  - Формирует local:// источник   │
│  - Экранирует символы            │
│  - Генерирует URL imgproxy        │
└─────────────────────────────────┘
      │
      ▼
┌─────────────┐
│  imgproxy   │ ──► Оптимизация изображений
│  (Docker)   │     (ресайз, формат, качество)
└─────────────┘
      │
      ▼
┌─────────────────────────────────┐
│  MediaImage Component            │
│  - Отображает responsive images  │
│  - Поддержка picture/source      │
└─────────────────────────────────┘
```

## Флоу обработки изображений

### 1. Получение данных из Strapi

Изображения приходят из Strapi API в сыром виде:

```json
{
  "id": 1,
  "url": "http://localhost:1337/uploads/image.jpg",
  "width": 1920,
  "height": 1080,
  "mime": "image/jpeg",
  "alternativeText": "Описание изображения"
}
```

Компонент медиа с брейкпоинтами сериализуется в объект вида:

```json
{
  "id": 1,
  "xs": { "...": "..." },
  "sm": { "...": "..." },
  "md": { "...": "..." },
  "lg": { "...": "..." },
  "default": { "...": "..." }
}
```

### 2. Формирование источников на фронте (`getSources`)

`getSources()` (`src/shared/ui/media-image/utils/get-sources.ts`):

- обходит ключи `xs/sm/md/lg/default` (ключ `media` также трактуется как `default`);
- для каждого источника формирует `srcSet`, ограничивая ширины натуральным размером изображения и максимальным разрешением **2K / QHD (2560px)**;
- строит imgproxy-ссылки через `imageproxyUrl` с дефолтными настройками (format/dpr/quality).

### 3. Генерация URL imgproxy (`imageproxyUrl`)

```typescript
// src/shared/utils/imgproxy.ts

imageproxyUrl(
  "http://localhost:1337/uploads/image.jpg",
  "webp",         // формат (по умолчанию webp)
  1,              // DPR (по умолчанию 1)
  90,             // качество (по умолчанию 90)
  { width: 1920 } // размер
)
```

**Процесс обработки URL:**

1. **local:// источник**: из URL берется только `pathname` (без хоста), результат — `local:///uploads/image.jpg`. Благодаря этому ссылка не зависит от того, с какого домена (Strapi/сайт) пришел url.
2. **Экранирование**: экранирует специальные символы (`%`, `?`, `@`).
3. **Генерация URL**: создает same-origin URL вида `/imgproxy/insecure/rs:fill:.../plain/local:///uploads/image.jpg` (без подписи). Next.js проксирует `/imgproxy/*` на контейнер imgproxy.

### 4. Обработка в imgproxy

imgproxy сервис:
- загружает изображение из локальной файловой системы (`local://`);
- применяет оптимизацию (ресайз, формат, качество);
- возвращает оптимизированное изображение и кэширует результат.

### 5. Отображение в компоненте

```tsx
<MediaImage
  source={{
    default: imageDefault,
    md: imageMd,
    lg: imageLg
  }}
  sizes="(max-width: 768px) 100vw, 50vw"
/>
```

## Компоненты системы

### 1. imageproxyUrl()

**Расположение**: `src/shared/utils/imgproxy.ts`

**Назначение**: генерирует URL для imgproxy (без подписи).

**Сигнатура**:
```typescript
imageproxyUrl(
  src: string | StaticImageData,
  format?: "webp" | "avif" | "jpeg" | "png", // По умолчанию: webp
  dpr?: number,                               // По умолчанию: 1
  quality?: number,                           // По умолчанию: 90
  size?: ImageProxySize                       // { width?, height? }
): string
```

Дефолтные значения `format`/`dpr`/`quality` вынесены в `IMG_PROXY_DEFAULTS` (`src/shared/config/img-proxy.ts`).

**Примеры**:
```typescript
// Базовое использование (webp, dpr 1, quality 90)
const url = imageproxyUrl(src);

// С размером
const url = imageproxyUrl(src, "webp", 1, 90, { width: 800 });

// С шириной и высотой
const url = imageproxyUrl(src, "webp", 1, 90, { width: 800, height: 600 });
```

### 2. getSources()

**Расположение**: `src/shared/ui/media-image/utils/get-sources.ts`

**Назначение**: превращает `MediaWithBreakpoints` в массив `<source>` объектов для `<picture>`, формируя imgproxy-ссылки для каждого размера с учетом максимального разрешения.

### 3. normalizeImageSourceUrl()

**Расположение**: `src/shared/utils/normalize-image-source-url.ts`

**Назначение**: нормализует URL изображения, исключает файлы из `public`, определяет, нужно ли обрабатывать через imgproxy.

### 4. MediaImage Component

**Расположение**: `src/shared/ui/media-image/media-image.tsx`

**Назначение**: компонент для отображения responsive изображений.

**Поддержка**:
- Responsive images через `<picture>` и `<source>`
- Разные изображения для разных breakpoints
- Lazy loading
- Placeholder при загрузке (`usePlaceholder`)
- CSS-переменные натуральных размеров (`--natural-width`, `--natural-height`, `--aspect-ratio`)

## Использование

### Базовое использование

```tsx
import { MediaImage } from "@shared/ui/media-image";

// Из RebuiltImage
<MediaImage image={image} altText="Описание" />

// Из MediaWithBreakpoints
<MediaImage
  source={{
    xs: imageXs,
    md: imageMd,
    default: imageDefault
  }}
/>
```

### Использование imageproxyUrl напрямую

```tsx
import { imageproxyUrl } from "@shared/utils/imgproxy";

const optimizedUrl = imageproxyUrl(
  "http://localhost:1337/uploads/image.jpg",
  "webp",
  1,
  90,
  { width: 1920 }
);

<img src={optimizedUrl} alt="Optimized image" />
```

## Конфигурация

### Проксирование через Next.js

Запросы к imgproxy идут через same-origin путь `/imgproxy`, который проксируется на контейнер imgproxy во внутренней docker-сети (по аналогии с `/api`):

```typescript
// next.config.ts
async rewrites() {
  return [
    { source: "/api/:path*", destination: `${baseUrl}/:path*` },
    {
      source: `${IMG_PROXY_PUBLIC_PATH}/:path*`, // /imgproxy/:path*
      destination: `${imgProxyBaseUrl}/:path*`,   // http://${PROJECT_SLUG}_imgproxy:8080/:path*
    },
  ];
},
```

### Переменные окружения

**Docker Compose** (`docker-compose.yml`):
```yaml
imgproxy:
  environment:
    IMGPROXY_LOCAL_FILESYSTEM_ROOT: /opt/app/public
    IMGPROXY_ALLOWED_SOURCES: "${IMGPROXY_ALLOWED_SOURCES:-local}"
```

> Подпись URL отключена, поэтому `IMGPROXY_KEY`/`IMGPROXY_SALT` **не используются**. Адрес imgproxy для проксирования собирается из `PROJECT_SLUG` (имя контейнера в docker-сети), поэтому отдельная переменная `IMGPROXY_URL` для фронта не требуется.

### Конфигурация в коде

**Расположение**: `src/shared/config/img-proxy.ts`

```typescript
// Публичный путь (same-origin), который Next.js проксирует на imgproxy
export const IMG_PROXY_PUBLIC_PATH = "/imgproxy";

// Внутренний адрес imgproxy в docker-сети (destination для rewrites)
export const imgProxyBaseUrl = `http://${process.env.PROJECT_SLUG}_imgproxy:8080`;

// Дефолтные значения для генерации ссылок
export const IMG_PROXY_DEFAULTS = {
  format: "webp" as const,
  quality: 90,
  dpr: 1,
};

// Максимальное разрешение (2K / QHD)
export const IMAGE_MAX_WIDTH = 2560;
export const IMAGE_MAX_HEIGHT = 1440;
```

## Типы данных

### RebuiltImage

```typescript
type RebuiltImage = {
  id?: string | number;
  documentId?: string | number;
  mediaType: "image";
  alt?: string | null;
  originalUrl: string;
  url: string;
  mime?: string;
  width?: number;
  height?: number;
  source?: ImageProxySourceItem[];
};
```

### MediaWithBreakpoints

```typescript
type MediaWithBreakpoints = {
  xs?: RebuiltImage | null;
  sm?: RebuiltImage | null;
  md?: RebuiltImage | null;
  lg?: RebuiltImage | null;
  default?: RebuiltImage | null;
};
```

### ImageProxySize

```typescript
type ImageProxySize = {
  width?: number;
  height?: number;
};
```

## Особенности

### 1. local:// источник

URL любого вида (`http://localhost:1337/uploads/image.jpg` или относительный `/uploads/image.jpg`) преобразуется в `local:///uploads/image.jpg` по `pathname` — независимо от хоста.

### 2. Максимальное разрешение

Ширины в `srcSet` ограничены значением `IMAGE_MAX_WIDTH` (2560px, 2K / QHD) и натуральной шириной изображения — апскейла не происходит.

### 3. Экранирование символов

Специальные символы в URL (`%`, `?`, `@`) автоматически экранируются.

### 4. Валидация параметров

Функция `imageproxyUrl` валидирует:
- `quality`: целое число от 0 до 100
- `dpr`: положительное число
- `width/height`: положительные целые числа

### 5. Responsive Images

Компонент `MediaImage` автоматически генерирует `<source>` элементы для разных breakpoints.

## Решение проблем

### Проблема: Изображения не загружаются

**Решение**:
1. Проверьте, что imgproxy контейнер запущен: `docker compose ps`
2. Убедитесь, что frontend и imgproxy в одной docker-сети и контейнер `${PROJECT_SLUG}_imgproxy` резолвится (rewrite `/imgproxy` → imgproxy)
3. Проверьте, что `IMGPROXY_ALLOWED_SOURCES` содержит `local://`
4. Проверьте, что `IMGPROXY_LOCAL_FILESYSTEM_ROOT` указывает на директорию с `uploads`

### Проблема: URL не преобразуется в local://

**Решение**: убедитесь, что используете `imageproxyUrl()` для генерации URL, а не передаете исходный URL напрямую.

### Проблема: Ошибка валидации параметров

**Решение**:
- `quality` должен быть целым числом от 0 до 100
- `dpr` должен быть положительным числом
- `width/height` должны быть положительными целыми числами

## Ссылки

- [imgproxy документация](https://imgproxy.net/)
- [@imgproxy/imgproxy-node](https://github.com/imgproxy/imgproxy-node)
- [Responsive Images Guide](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)
