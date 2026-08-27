# ODDITY — Style DNA

Практический источник истины для новых страниц и компонентов.
Спека motion/экранов: [`docs/design/ODDITY-design-system.md`](docs/design/ODDITY-design-system.md).  
Контент-модель: [`docs/design/ODDITY-content-model.md`](docs/design/ODDITY-content-model.md).  
Admin / curator desk: [`docs/design/ODDITY-admin.md`](docs/design/ODDITY-admin.md).  
Live showcase: [`/lab/style-guide`](/lab/style-guide).

---

## 1. Визуальный принцип

**Белый холст + чёрная типографика + цветные оригиналы media.**

| Принцип | Правило |
|---------|---------|
| Canvas | Фон почти всегда `--c-white`. Белый = галерейная стена |
| Type | Чёрный текст поверх; серые — только meta / secondary |
| Media | Постеры/обложки в **оригинальном цвете** — без grayscale, без dark overlay, без цветных фильтров |
| Accent | Acid lime `#BFFF00` (и lime-family) — **только интерактив**, ≤ 5% площади экрана |
| Black bg | Исключение: fullscreen menu morph, preloader, video player |
| Cards | Не «карточки UI»: media + подпись. Без shadow, без border-radius на media по умолчанию, без glass |

Настроение: **архивный каталог / editorial gallery** — спокойный, точный, с токсичным акцентом на действиях.

---

## 2. Композиционные принципы

1. **Один акцент на viewport** — бренд, hero media или один CTA (круглый FAB), не несколько конкурирующих блоков.
2. **Media несёт цвет** — UI монохромный; кислотный акцент только на hover/CTA/marker.
3. **Ритм через whitespace** — крупные секции `64–96px`, meta плотная `4–12px`. Не уплотнять «ради заполнения».
4. **Типографика как структура** — display/h1 uppercase + tight tracking; caption/micro uppercase + wide tracking.
5. **Минимум chrome** — header fixed, `mix-blend-mode: difference`, почти невидимый; footer минимальный.
6. **Пространственная связь** — переходы gallery↔detail через FLIP, не через modal.
7. **Hover сдержанный** — media `scale(1.02)`, opacity ~0.92; blotch/marker — характерный «граффити» акцент на тексте.

---

## 3. Design Tokens

Источник в коде: `src/shared/styles/vars/` → подключается в `_root.scss`.

### 3.1 Цвета

| Token | Value | Роль |
|-------|-------|------|
| `--c-white` | `#FFFFFF` | Основной фон |
| `--c-black` | `#000000` | Тип, UI |
| `--c-graphite` | `#222222` | Hover type / dark UI |
| `--c-grey-100` | `#F5F5F5` | Media placeholder, subtle fill |
| `--c-grey` | `#E8E8E8` | Dividers |
| `--c-grey-400` | `#8A8A8A` | Meta, placeholder, kicker |
| `--c-grey-600` | `#454545` | Secondary text |
| `--c-accent` | `#BFFF00` | Primary interactive accent |
| `--c-accent-chartreuse` | `#D4FF00` | Hover blotch family |
| `--c-accent-yellow` | `#FFE600` | Hover blotch family |
| `--c-accent-orange` | `#FFB347` | Hover blotch family |

Семантические алиасы (`--text-primary-dark`, `--background-button-*` и т.д.) мапятся на эту палитру в `_colors.scss`.

**Не изобретать новые цвета** без обновления токенов.

### 3.2 Typography

Шрифт: `Helvetica Neue, Helvetica, Arial, system-ui, sans-serif`.

| Class / mixin | Desktop (~1440) | LH | Tracking | Использование |
|---------------|-----------------|-----|----------|---------------|
| `typo-display` | 120 | 0.85 | −0.04em | Hero / бренд |
| `typo-h1` | 56 | 0.92 | −0.03em | Заголовок страницы |
| `typo-h2` | 40 | 1 | −0.02em | Секция / menu items |
| `typo-h3` | 28 | 1.1 | −0.02em | Подзаголовок / card title |
| `typo-p1` | 18 | 1.4 | −0.01em | Лид |
| `typo-p2` | 16 | 1.5 | 0 | Body / card title |
| `typo-caption` | 12 | 1 | +0.08em + UPPER | Nav, buttons, CTA |
| `typo-micro` | 11 | 1.2 | +0.1em + UPPER | Artist, kicker, tags |

Weights: 400 / 500 / 600 / 700. Заголовки страниц обычно `700` + `uppercase`.

В JSX: класс `typo-*`. В CSS Modules: `@include h1` и т.д. из `mixins/_typography.scss`.

Компоненты: `Heading`, `Body` (`@shared/ui/typography`).

### 3.3 Spacing

База **4px**, шкала `--spacing-4` … `--spacing-140` (vw-scaled).

| Контекст | Типичные значения |
|----------|-------------------|
| Meta stack | 4 / 8 / 12 |
| Card gap | 12 |
| Section inner | 20 / 24 / 32 |
| Section padding | 64 / 80 / 96 |
| Page bottom | 96 |

### 3.4 Layout / Grid

| Token | Desktop | LG | MD |
|-------|---------|----|----|
| `--padding-horizontal-base` | 32 | 24 | 16 |
| `--max-content-width` | 1440 | — | — |
| `--header-height` | 72 | 64 | 56 |

`Container` — horizontal padding + max-width (`size`: `lg` | `md`).

Masonry / gallery: колонки сжимаются 3→2→1 на lg/md.

### 3.5 Radii

| Token | Value | Где |
|-------|-------|-----|
| `--radius-none` | 0 | Media / editorial (default) |
| `--radius-sm` | 4 | Small chips / join button |
| `--radius-base-sm` | 8 | Inputs, soft UI |
| `--radius-md` | 12 | Orbit / soft media |
| `--radius-full` | 50% | FAB CTA, dots, icon-round |

**Правило:** editorial media — без скругления. Скругление — у интерактивных контролов и FAB.

### 3.6 Shadows

**Нет.** Карточки и секции без box-shadow. Глубина — через scale/opacity/FLIP, не через тень.

### 3.7 Motion

| Token | Value |
|-------|-------|
| `--duration-micro` | 200ms |
| `--duration-fast` | 300ms |
| `--duration-standard` | 400ms |
| `--duration-page` | 700ms |
| `--ease-out-expo` | `cubic-bezier(0.19, 1, 0.22, 1)` |

Интенсивность **6/10**: FLIP, stagger type, subtle parallax ≤20%, hover scale ≤1.02.  
Не делать: bounce layout, 3D cards, particles, autoplay gallery video.

Характерные паттерны:
- **Blotch hover** (`@include blotch-hover`) — graffiti smear acid lime под текстом
- **RollingText** — вертикальный ролл лейбла
- **Marker** — ink stroke highlight
- **BgMorph** — clip-path меню
- **FLIP** — card ↔ hero

---

## 4. UI-паттерны

### Header
- Fixed, full-width, `mix-blend-mode: difference`, `color: white`
- Grid: logo | SEARCH (dot + RollingText) | burger
- Logo скрыт на home (бренд в hero)
- Menu: fullscreen black panel + BgMorph

### CTA FAB
- Круг `--c-accent`, текст чёрный `typo-caption` bold
- Fixed bottom-right, размер ~88 → 64 на md

### Collection card
```
[media original colors, aspect from content]
artist  typo-micro bold
title   typo-p2
year    typo-p2 grey-400
```
Hover: image `scale(1.02)` + slight opacity drop. Без рамки/тени/radius.

### Detail meta
- Kicker `typo-micro` grey-400
- Title `typo-h1`/`h2` uppercase bold
- Facts grid: hairline borders `--c-grey`
- Editor note: italic + accent lime
- Availability links: underline, hover → grey-600

### Links
- `underline` variant: scaleX underline 0→1
- Text links: color → graphite on hover
- Accent underline для LISTEN/RELATED (по спеке)

### Inputs
- Uppercase caption, weight 600
- Radius 8, height 56
- Focus: 2px black border ring

### Buttons (StyledButton)
Наследники более «продуктового» UI — использовать осторожно.  
Для archive surface предпочитать text/caption + blotch/RollingText/FAB, а не тяжёлые filled buttons.

---

## 5. Как собирать новую страницу

1. Белый фон, `Container`, `padding-top: var(--header-height)` если не full-bleed hero.
2. Один hero-сигнал (бренд / media / title), затем одна секция = одна задача.
3. Типографика только через `typo-*` / Heading / Body.
4. Цвета только из `--c-*` (или семантических алиасов).
5. Media без фильтров; placeholder `--c-grey-100`.
6. Accent только на интерактиве (CTA, blotch, marker, active filter).
7. Отступы из `--spacing-*`; крупные секции ≥ 64.
8. Hover через существующие миксины (`hover`, `blotch-hover`, `transition`).
9. Сверься со showcase `/lab/style-guide` и соседними `_pages/*`.

### Анти-паттерны
- Фиолетовые/cream AI-дефолты, glow, multi-shadow, rounded pills clusters
- Карточки с border + shadow + radius на gallery
- Accent как заливочный фон секций
- Inter/Roboto вместо Helvetica Neue stack
- Skeleton loaders (только fade)

---

## 6. Файловая карта

| Что | Где |
|-----|-----|
| Colors / semantic | `src/shared/styles/vars/_colors.scss` |
| Spacing | `src/shared/styles/vars/_spacing.scss` |
| Radius | `src/shared/styles/vars/_radius.scss` |
| Motion | `src/shared/styles/vars/_motion.scss` |
| Typography mixins | `src/shared/styles/mixins/_typography.scss` |
| Global typo classes | `src/shared/styles/_typo.scss` |
| Blotch hover | `src/shared/styles/mixins/_blotch-hover.scss` |
| Accents JS | `src/shared/config/accents.ts` |
| Container | `src/shared/ui/container` |
| Collection card | `src/entities/collection-card` |
| Header / cursor | `src/widgets/header`, `src/widgets/сursor` |
