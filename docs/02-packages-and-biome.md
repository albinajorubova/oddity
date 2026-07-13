# Пакеты проекта и Biome

## 📦 Обзор зависимостей

Проект использует современный стек технологий для разработки Next.js приложений. Основные зависимости можно разделить на несколько категорий:

### Основной стек

- **Next.js 15.5.7** - React фреймворк с SSR/SSG
- **React 19.2.1** - Библиотека для построения UI
- **TypeScript 5.9.2** - Статическая типизация
- **Sass 1.92.1** - CSS препроцессор

### State Management и валидация

- **Zustand 5.0.8** - Легковесное управление состоянием
- **Zod 4.1.8** - Схемы валидации и типизация

### UI и анимации

- **GSAP 3.13.0** - Профессиональные анимации
- **Lenis 1.3.11** - Плавный скролл
- **Swiper 12.0.2** - Слайдеры и карусели
- **react-hook-form 7.65.0** - Работа с формами

### API и контент

- **@strapi/client 1.5.0** - Клиент для Strapi CMS
- **ky 1.10.0** - HTTP клиент
- **html-react-parser 5.2.7** - Парсинг HTML

### Утилиты

- **clsx 2.1.1** - Условные CSS классы
- **typograf 7.6.0** - Типографика
- **ua-parser-js 2.0.6** - Парсинг User-Agent

## 🔧 Biome - Линтер и форматтер

### Что такое Biome?

**Biome** — это быстрый инструмент для линтинга и форматирования кода, который заменяет ESLint и Prettier одним инструментом. Он написан на Rust и работает значительно быстрее традиционных инструментов.

### Зачем использовать Biome?

1. **Скорость** - Работает в 10-100 раз быстрее ESLint + Prettier
2. **Простота** - Один инструмент вместо двух
3. **Меньше конфигурации** - Разумные настройки по умолчанию
4. **Встроенная поддержка** - React, Next.js, TypeScript из коробки
5. **Автоматическая организация импортов** - Встроенная функция

### Установка и версия

В проекте используется **@biomejs/biome 2.2.0**:

```json
{
  "devDependencies": {
    "@biomejs/biome": "2.2.0"
  }
}
```

### Скрипты в package.json

Проект содержит следующие скрипты для работы с Biome:

```json
{
  "scripts": {
    "lint": "biome check",
    "format": "biome format --write",
    "check": "biome check --write"
  }
}
```

**Описание команд**:

- `pnpm lint` - Проверка кода на ошибки и предупреждения (без исправлений)
- `pnpm format` - Форматирование кода (исправление форматирования)
- `pnpm check` - Проверка и автоматическое исправление всех проблем (lint + format)

### Конфигурация Biome

Конфигурация находится в файле `biome.json` в корне проекта.

#### Базовая конфигурация

```json
{
  "$schema": "https://biomejs.dev/schemas/2.2.0/schema.json",
  "vcs": {
    "enabled": true,
    "clientKind": "git",
    "useIgnoreFile": true
  },
  "files": {
    "ignoreUnknown": true,
    "includes": [
      "**",
      "!@strapi",
      "!.pnpm-store",
      "!node_modules",
      "!.next",
      "!dist",
      "!build"
    ]
  }
}
```

**Настройки**:
- `vcs.enabled: true` - Интеграция с Git
- `files.includes` - Файлы для обработки (исключены `@strapi`, `node_modules`, `.next`)

#### Форматтер

```json
{
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2
  }
}
```

**Настройки**:
- `indentStyle: "space"` - Использовать пробелы (не табы)
- `indentWidth: 2` - Размер отступа: 2 пробела

#### Линтер

```json
{
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "correctness": {
        "useExhaustiveDependencies": "off"
      },
      "a11y": {
        "noSvgWithoutTitle": "off",
        "noStaticElementInteractions": "off",
        "useKeyWithClickEvents": "off",
        "useMediaCaption": "off"
      },
      "security": {
        "noDangerouslySetInnerHtml": "warn"
      }
    },
    "domains": {
      "next": "recommended",
      "react": "recommended"
    }
  }
}
```

**Настройки правил**:

1. **recommended: true** - Включены все рекомендуемые правила

2. **correctness** - Правила корректности:
   - `useExhaustiveDependencies: "off"` - Отключена проверка зависимостей в useEffect (часто конфликтует с React)

3. **a11y** - Правила доступности (отключены для гибкости):
   - `noSvgWithoutTitle: "off"` - SVG без title разрешены
   - `noStaticElementInteractions: "off"` - Статические элементы с обработчиками разрешены
   - `useKeyWithClickEvents: "off"` - Клавиатурные события не обязательны
   - `useMediaCaption: "off"` - Подписи к медиа не обязательны

4. **security** - Правила безопасности:
   - `noDangerouslySetInnerHtml: "warn"` - Предупреждение при использовании dangerouslySetInnerHTML

5. **domains** - Доменные правила:
   - `next: "recommended"` - Рекомендуемые правила для Next.js
   - `react: "recommended"` - Рекомендуемые правила для React

#### Организация импортов

Одна из самых полезных функций Biome — автоматическая организация импортов:

```json
{
  "assist": {
    "actions": {
      "source": {
        "organizeImports": {
          "level": "on",
          "options": {
            "groups": [
              ["react", "react-dom"],
              [":PACKAGE:", "!@shared/**", "!public/**", "!@entities/**"],
              ":BLANK_LINE:",
              ["@entities/**"],
              ":BLANK_LINE:",
              ["@/**", "@shared/**"],
              ":BLANK_LINE:",
              [
                "../**",
                "./model/**",
                "./api/**",
                "./ui/**",
                "./**",
                "!./*.module.scss"
              ],
              ":BLANK_LINE:",
              ["public/**"],
              ":BLANK_LINE:",
              ["./*.module.scss", "*.scss", "*.css"]
            ]
          }
        }
      }
    }
  }
}
```

**Порядок импортов**:

1. React и React DOM
2. Внешние пакеты (npm пакеты, кроме @shared, public, @entities)
3. Пустая строка
4. `@entities/**` - Импорты из entities
5. Пустая строка
6. `@/**`, `@shared/**` - Импорты из shared и других алиасов
7. Пустая строка
8. Относительные импорты (../**, ./model, ./api, ./ui, ./, но не .module.scss)
9. Пустая строка
10. `public/**` - Импорты из public
11. Пустая строка
12. Стили (.module.scss, .scss, .css)

**Пример до и после**:

```typescript
// ❌ До организации
import { useState } from 'react';
import { Button } from '@shared/ui/button';
import { getArticleList } from '@entities/article/api';
import axios from 'axios';
import styles from './component.module.scss';

// ✅ После организации (автоматически)
import { useState } from 'react';
import axios from 'axios';

import { getArticleList } from '@entities/article/api';

import { Button } from '@shared/ui/button';

import styles from './component.module.scss';
```

### Использование Biome

#### Проверка кода

```bash
# Проверка без исправлений
pnpm lint

# Проверка конкретного файла
pnpm biome check src/components/Button.tsx

# Проверка директории
pnpm biome check src/
```

#### Форматирование

```bash
# Форматирование всех файлов
pnpm format

# Форматирование конкретного файла
pnpm biome format --write src/components/Button.tsx
```

#### Автоматическое исправление

```bash
# Проверка и автоматическое исправление всех проблем
pnpm check

# Исправление конкретного файла
pnpm biome check --write src/components/Button.tsx
```

#### Интеграция с IDE

Biome автоматически работает в большинстве IDE через расширения:

- **VS Code**: Установите расширение "Biome"
- **WebStorm/IntelliJ**: Встроенная поддержка через плагины
- **Cursor**: Работает через расширения VS Code

После установки расширения Biome будет автоматически:
- Подсвечивать ошибки
- Предлагать исправления
- Форматировать при сохранении (если настроено)

### Настройка правил

#### Добавление нового правила

Откройте `biome.json` и добавьте правило в соответствующий раздел:

```json
{
  "linter": {
    "rules": {
      "recommended": true,
      "style": {
        "useConst": "error"  // Требовать const вместо let
      }
    }
  }
}
```

#### Отключение правила

```json
{
  "linter": {
    "rules": {
      "recommended": true,
      "style": {
        "useConst": "off"  // Отключить правило
      }
    }
  }
}
```

#### Изменение уровня правила

Уровни правил:
- `"error"` - Ошибка (красный)
- `"warn"` - Предупреждение (желтый)
- `"off"` - Отключено

```json
{
  "linter": {
    "rules": {
      "security": {
        "noDangerouslySetInnerHtml": "warn"  // Предупреждение вместо ошибки
      }
    }
  }
}
```

### Игнорирование файлов

#### Через конфигурацию

```json
{
  "files": {
    "ignore": [
      "**/*.test.ts",
      "**/*.spec.ts",
      "dist/**",
      "build/**"
    ]
  }
}
```

#### Через комментарии в коде

```typescript
// biome-ignore lint/correctness/noUnusedVariables: используется в тестах
const unusedVariable = 123;

// biome-ignore lint/style/useConst: нужно переприсваивание
let mutable = 1;
```

### Миграция с ESLint/Prettier

Если вы переходите с ESLint/Prettier:

1. **Удалите старые зависимости**:
```bash
pnpm remove eslint prettier eslint-config-next
```

2. **Установите Biome**:
```bash
pnpm add -D @biomejs/biome
```

3. **Удалите старые конфиги**:
- `.eslintrc.json`
- `.prettierrc`
- `.prettierignore`

4. **Создайте `biome.json`** (можно использовать текущую конфигурацию как основу)

5. **Обновите скрипты** в `package.json`

## 📚 Другие ключевые пакеты

### Next.js 15.5.7

**Назначение**: React фреймворк для продакшн-приложений

**Особенности в проекте**:
- App Router и Pages Router
- SSR/SSG для оптимизации
- API Routes
- Встроенная оптимизация изображений

**Конфигурация**: `next.config.ts`

### React 19.2.1

**Назначение**: Библиотека для построения UI

**Особенности**:
- Server Components
- React Hooks
- Concurrent Features

### TypeScript 5.9.2

**Назначение**: Статическая типизация

**Конфигурация**: `tsconfig.json`
- Строгий режим включен
- Алиасы путей настроены
- Поддержка Next.js

### Zustand 5.0.8

**Назначение**: Управление состоянием

**Использование**:
- Глобальные сторы в `app/model/`
- Минимальный boilerplate
- TypeScript из коробки

**Пример**:
```typescript
import { create } from 'zustand';

interface Store {
  count: number;
  increment: () => void;
}

export const useStore = create<Store>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}));
```

### Zod 4.1.8

**Назначение**: Валидация и типизация

**Использование**:
- Валидация данных из Strapi
- Схемы для content types
- Runtime валидация

**Пример**:
```typescript
import { z } from 'zod';

const articleSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  content: z.string(),
});

type Article = z.infer<typeof articleSchema>;
```

### GSAP 3.13.0

**Назначение**: Профессиональные анимации

**Использование**:
- Анимации переходов
- Split text анимации
- Preloader анимации
- Компоненты в `@shared/ui/animate/`

### Sass 1.92.1

**Назначение**: CSS препроцессор

**Особенности**:
- SCSS модули
- Автоматический импорт helpers
- Переменные и миксины
- Глобальные стили в `src/shared/styles/`

## 🔄 Обновление зависимостей

### Проверка устаревших пакетов

```bash
pnpm outdated
```

### Обновление всех зависимостей

```bash
pnpm update
```

### Обновление конкретного пакета

```bash
pnpm add package-name@latest
```

### Обновление Biome

```bash
pnpm add -D @biomejs/biome@latest
```

**Важно**: Перед обновлением основных зависимостей (Next.js, React) проверяйте breaking changes в changelog.

## 📖 Дополнительные ресурсы

- [Biome документация](https://biomejs.dev/)
- [Biome правила](https://biomejs.dev/linter/rules/)
- [Next.js документация](https://nextjs.org/docs)
- [React документация](https://react.dev/)
