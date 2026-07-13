# Структура проекта и FSD архитектура

## 📐 Обзор архитектуры

Проект использует **Feature-Sliced Design (FSD)** — методологию организации кода, которая помогает создавать масштабируемые и поддерживаемые приложения.

FSD разделяет код на **слои** (layers) и **слайсы** (slices), где каждый слой имеет свою ответственность и правила взаимодействия.

## 🏗️ Слои архитектуры

Проект организован в следующие слои (от низкого к высокому уровню):

```
src/
├── app/          # Инициализация приложения, глобальные настройки
├── processes/    # Сложные бизнес-процессы
├── pages/        # Страницы Next.js (Pages Router)
├── widgets/      # Составные виджеты
├── features/     # Функциональные возможности
├── entities/     # Бизнес-сущности
└── shared/       # Переиспользуемые компоненты и утилиты
```

### 1. `app/` - Инициализация приложения

**Назначение**: Глобальная инициализация приложения, настройка провайдеров, глобальные сторы.

**Что содержит**:
- `model/data-store/` - Централизованное хранилище данных (Zustand)
- `model/ui-store/` - Глобальное состояние UI
- `model/viewport-store/` - Состояние viewport и размеров окна

**Пример структуры**:
```
app/
└── model/
    ├── data-store/
    │   ├── context.ts
    │   ├── hooks/
    │   └── provider/
    ├── ui-store/
    └── viewport-store/
```

**Правила**:
- Импортирует только из `shared/`
- Не импортируется другими слоями напрямую
- Используется для глобальной инициализации в `_app.tsx`

### 2. `processes/` - Бизнес-процессы

**Назначение**: Сложные бизнес-процессы, которые объединяют несколько features и entities.

**Что содержит**:
- Сложные сценарии использования
- Оркестрация нескольких features
- Кросс-модульные процессы

**Примеры**: Авторизация, оформление заказа, многошаговые формы.

**Правила**:
- Импортирует из `features/`, `entities/`, `shared/`
- Может импортировать из `widgets/` и `pages/`

### 3. `pages/` - Страницы Next.js

**Назначение**: Страницы Next.js (Pages Router), роутинг, API routes.

**Что содержит**:
- `_app.tsx` - Главный компонент приложения
- `_document.tsx` - Кастомный HTML документ
- `index.tsx` - Главная страница
- `api/` - API routes для серверных эндпоинтов

**Пример структуры**:
```
pages/
├── _app.tsx
├── _document.tsx
├── index.tsx
└── api/
    └── img.ts
```

**Правила**:
- Может импортировать из всех слоев
- Используется для роутинга Next.js
- API routes находятся здесь

### 4. `widgets/` - Составные виджеты

**Назначение**: Крупные составные компоненты, объединяющие несколько features и entities.

**Что содержит**:
- `header/` - Шапка сайта
- `footer/` - Подвал сайта
- `preloader/` - Прелоадер приложения
- `scroll/` - Компоненты скролла
- `seo-layout/` - SEO обертка
- `transition-layout/` - Компоненты переходов
- `cursor/` - Кастомный курсор
- И другие виджеты

**Пример структуры**:
```
widgets/
└── header/
    ├── header.tsx
    ├── header.module.scss
    └── index.ts
```

**Правила**:
- Импортирует из `features/`, `entities/`, `shared/`
- Может импортировать из `widgets/` (другие виджеты)
- Используется в `pages/` и `_pages/`

### 5. `features/` - Функциональные возможности

**Назначение**: Конкретные пользовательские сценарии и функции.

**Что содержит**:
- Отдельные фичи приложения
- Интерактивные компоненты
- Бизнес-логика для конкретных функций

**Примеры**: Кнопка "Добавить в корзину", форма обратной связи, фильтр товаров.

**Правила**:
- Импортирует из `entities/` и `shared/`
- Может импортировать из других `features/`
- Используется в `widgets/` и `pages/`

### 6. `entities/` - Бизнес-сущности

**Назначение**: Бизнес-сущности приложения с их данными и логикой.

**Что содержит**:
- `article/` - Сущность статьи
- Другие бизнес-сущности

**Пример структуры**:
```
entities/
└── article/
    ├── api/
    │   ├── getArticleList.ts
    │   └── index.ts
    ├── model/
    │   ├── types.ts
    │   ├── schemas.ts
    │   ├── mappers.ts
    │   └── index.ts
    └── ui/ (опционально)
```

**Правила**:
- Импортирует только из `shared/`
- Содержит API методы, типы, схемы валидации (Zod)
- Используется в `features/`, `widgets/`, `pages/`

### 7. `shared/` - Переиспользуемые компоненты

**Назначение**: Переиспользуемые компоненты, утилиты, конфигурация, стили.

**Что содержит**:
- `ui/` - Базовые UI компоненты (Button, Input, Icon, etc.)
- `api/` - API клиенты (Strapi client, HTTP client)
- `hooks/` - Переиспользуемые хуки
- `utils/` - Утилиты и хелперы
- `styles/` - Глобальные стили, переменные, миксины
- `config/` - Конфигурация приложения
- `types/` - Общие типы
- `content-types/` - Типы контента из CMS

**Пример структуры**:
```
shared/
├── ui/
│   ├── button/
│   ├── input/
│   ├── icon/
│   └── ...
├── api/
│   ├── strapi/
│   └── client.ts
├── hooks/
├── utils/
├── styles/
└── config/
```

**Правила**:
- Не импортирует из других слоев (кроме других `shared/` модулей)
- Используется всеми слоями
- Должен быть максимально переиспользуемым

### 8. `_pages/` - Страницы с бизнес-логикой

**Назначение**: Страницы с полной бизнес-логикой (альтернатива Pages Router).

**Что содержит**:
- `home/` - Страница главной
- Другие страницы

**Пример структуры**:
```
_pages/
└── home/
    ├── api/
    │   └── getHomePage.ts
    ├── model/
    │   ├── types.ts
    │   └── schemas.ts
    └── ui/
        └── home-page.tsx
```

**Правила**:
- Может импортировать из всех слоев
- Содержит полную логику страницы (API, модель, UI)

## 📦 Структура слайсов

Каждый слайс (модуль) в слое может содержать следующие директории:

```
slice-name/
├── api/          # API методы для работы с данными
├── model/        # Бизнес-логика, типы, схемы, сторы
├── ui/           # UI компоненты
└── index.ts      # Public API слайса (barrel export)
```

### `api/` - API методы

Содержит методы для работы с API (запросы к Strapi, внешние API).

**Пример**:
```typescript
// entities/article/api/getArticleList.ts
import { strapiClient } from '@shared/api/strapi';

export async function getArticleList() {
  return strapiClient.get('/api/articles');
}
```

### `model/` - Бизнес-логика

Содержит:
- `types.ts` - TypeScript типы
- `schemas.ts` - Zod схемы для валидации
- `mappers.ts` - Преобразование данных
- Сторы (Zustand) если нужны

**Пример**:
```typescript
// entities/article/model/types.ts
export interface Article {
  id: string;
  title: string;
  content: string;
}

// entities/article/model/schemas.ts
import { z } from 'zod';

export const articleSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
});
```

### `ui/` - UI компоненты

Содержит React компоненты и их стили.

**Пример**:
```typescript
// entities/article/ui/article-card.tsx
import styles from './article-card.module.scss';

export function ArticleCard({ article }: { article: Article }) {
  return <div className={styles.card}>{article.title}</div>;
}
```

## 🔗 Алиасы путей

Проект использует алиасы путей для удобного импорта. Настроены в `tsconfig.json`:

| Алиас | Путь | Описание |
|-------|------|----------|
| `@/*` | `./src/*` | Корень src |
| `@app/*` | `./src/app/*` | Слой app |
| `@processes/*` | `./src/processes/*` | Слой processes |
| `@pages/*` | `./src/pages/*` | Страницы Next.js |
| `@widgets/*` | `./src/widgets/*` | Слой widgets |
| `@features/*` | `./src/features/*` | Слой features |
| `@entities/*` | `./src/entities/*` | Слой entities |
| `@shared/*` | `./src/shared/*` | Слой shared |
| `@shared/types` | `./src/shared/types/index.ts` | Общие типы |
| `@content/types` | `./src/shared/content-types` | Типы контента |

**Примеры использования**:

```typescript
// ✅ Правильно - использование алиасов
import { Button } from '@shared/ui/button';
import { getArticleList } from '@entities/article/api';
import { Header } from '@widgets/header';

// ❌ Неправильно - относительные пути
import { Button } from '../../../shared/ui/button';
```

## 📋 Правила импорта (FSD принципы)

### Правило 1: Импорт только из нижележащих слоев

Слои могут импортировать только из слоев, которые находятся **ниже** в иерархии:

```
app/          → shared/
processes/    → features/, entities/, shared/
pages/        → widgets/, features/, entities/, shared/
widgets/      → features/, entities/, shared/
features/     → entities/, shared/
entities/     → shared/
shared/       → (только другие shared модули)
```

### Правило 2: Запрет на импорт из вышележащих слоев

```typescript
// ❌ Неправильно - entities не может импортировать из features
// entities/article/model/index.ts
import { someFeature } from '@features/some-feature'; // ОШИБКА!

// ✅ Правильно - entities импортирует только из shared
import { apiClient } from '@shared/api/client';
```

### Правило 3: Импорт из того же слоя

Компоненты одного слоя могут импортировать друг друга:

```typescript
// ✅ Правильно - widget импортирует другой widget
// widgets/header/index.ts
import { Footer } from '@widgets/footer';
```

### Правило 4: Public API через index.ts

Каждый слайс должен экспортировать свой Public API через `index.ts`:

```typescript
// entities/article/index.ts
export * from './api';
export * from './model';
export * from './ui';
```

## 💡 Примеры использования

### Пример 1: Создание новой entity

```typescript
// 1. Создаем структуру
entities/
└── product/
    ├── api/
    │   ├── getProductList.ts
    │   └── index.ts
    ├── model/
    │   ├── types.ts
    │   ├── schemas.ts
    │   └── index.ts
    └── index.ts

// 2. Определяем типы
// entities/product/model/types.ts
export interface Product {
  id: string;
  name: string;
  price: number;
}

// 3. Создаем схемы валидации
// entities/product/model/schemas.ts
import { z } from 'zod';

export const productSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
});

// 4. Создаем API методы
// entities/product/api/getProductList.ts
import { strapiClient } from '@shared/api/strapi';

export async function getProductList() {
  const response = await strapiClient.get('/api/products');
  return response.data;
}

// 5. Экспортируем Public API
// entities/product/index.ts
export * from './api';
export * from './model';
```

### Пример 2: Использование entity в feature

```typescript
// features/add-to-cart/ui/add-to-cart-button.tsx
import { Product } from '@entities/product/model';
import { Button } from '@shared/ui/button';

export function AddToCartButton({ product }: { product: Product }) {
  const handleClick = () => {
    // Логика добавления в корзину
  };

  return <Button onClick={handleClick}>Добавить в корзину</Button>;
}
```

### Пример 3: Использование в widget

```typescript
// widgets/product-list/ui/product-list.tsx
import { getProductList } from '@entities/product/api';
import { AddToCartButton } from '@features/add-to-cart/ui';
import { Container } from '@shared/ui/container';

export function ProductList() {
  const products = getProductList();

  return (
    <Container>
      {products.map((product) => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <AddToCartButton product={product} />
        </div>
      ))}
    </Container>
  );
}
```

## 🎯 Best Practices

1. **Всегда используйте алиасы** вместо относительных путей
2. **Следуйте структуре слайсов** (api/, model/, ui/)
3. **Экспортируйте через index.ts** для создания Public API
4. **Не нарушайте правила импорта** между слоями
5. **Разделяйте ответственность**: бизнес-логика в model/, UI в ui/, API в api/
6. **Используйте TypeScript типы** везде
7. **Валидируйте данные** через Zod схемы
8. **Держите shared максимально переиспользуемым**

## 📚 Дополнительные ресурсы

- [Feature-Sliced Design документация](https://feature-sliced.design/)
- [FSD методология на русском](https://feature-sliced.design/ru/)
