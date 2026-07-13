# AnimatePresence

Компонент для анимации появления и исчезновения элементов при изменении дерева React. Аналог `AnimatePresence` из framer-motion.

## Особенности

- **Два режима анимации**: CSS-переходы (`PresenceChildCSS`) или JS/GSAP (`PresenceChildJS`)
- **Режимы работы**: `sync` (выход + вход одновременно) или `wait` (сначала выход, потом вход)
- **Хук `usePresence`** для кастомной логики анимации

## API

### AnimatePresence

Корневой компонент. Оборачивает детей и управляет их жизненным циклом при unmount.

```tsx
<AnimatePresence mode="wait" onExitComplete={() => console.log("done")}>
  <PresenceChildJS key={tab}>{content}</PresenceChildJS>
</AnimatePresence>
```

| Prop | Тип | По умолчанию | Описание |
|------|-----|--------------|----------|
| `mode` | `"sync" \| "wait"` | `"sync"` | `sync` — показывать выходящие и входящие вместе; `wait` — только выходящие, пока анимация не завершится |
| `onExitComplete` | `() => void` | — | Вызывается, когда все exit-анимации завершены |
| `initial` | `boolean` | — | Пропустить начальную enter-анимацию |

**Важно:** у каждого прямого ребёнка должен быть уникальный `key`.

---

### PresenceChildJS

Для анимаций через **Animate** (GSAP). Пробрасывает `isVisible` и `onComplete` в дочерний `Animate`.

```tsx
<AnimatePresence mode="wait">
  <PresenceChildJS key={tab}>
    <Animate data="fade" duration={1.8}>
      <div>Контент</div>
    </Animate>
  </PresenceChildJS>
</AnimatePresence>
```

| Prop | Тип | Описание |
|------|-----|----------|
| `children` | `React.ReactElement` | Один ребёнок — компонент `Animate` |

---

### PresenceChildCSS

Для анимаций через **CSS transitions**. Добавляет классы `{classNames}-enter`, `{classNames}-enter-active`, `{classNames}-exit`, `{classNames}-exit-active`.

```tsx
<AnimatePresence mode="wait">
  <PresenceChildCSS key={tab} classNames="fade" timeout={300}>
    <div>Контент</div>
  </PresenceChildCSS>
</AnimatePresence>
```

| Prop | Тип | По умолчанию | Описание |
|------|-----|--------------|----------|
| `children` | `React.ReactElement` | — | Один ребёнок |
| `classNames` | `string` | `"fade"` | Префикс для классов: `{classNames}-enter`, `{classNames}-exit` и т.д. |
| `timeout` | `number \| { enter?: number; exit?: number }` | `300` | Таймаут fallback для `transitionend` (мс) |

**Пример CSS:**

```css
.fade-enter {
  opacity: 0;
}
.fade-enter-active {
  opacity: 1;
  transition: opacity 300ms;
}
.fade-exit {
  opacity: 1;
}
.fade-exit-active {
  opacity: 0;
  transition: opacity 300ms;
}
```

---

### SwitchElement

Удобная обёртка для переключения контента с JS-анимацией. Комбинирует `AnimatePresence` + `PresenceChildJS` + `useCountValueUpdate`.

```tsx
<SwitchElement transitionKey={activeTab} mode="wait">
  <Animate data="fade" duration={1.8}>
    <div>{content}</div>
  </Animate>
</SwitchElement>
```

| Prop | Тип | По умолчанию | Описание |
|------|-----|--------------|----------|
| `transitionKey` | `string \| number` | — | Ключ переключения (при смене — новая анимация) |
| `children` | `React.ReactElement` | — | Один ребёнок |
| `mode` | `AnimatePresenceMode` | `"wait"` | Режим AnimatePresence |

---

### SwitchCss

Аналог `SwitchElement` для CSS-переходов. Использует `PresenceChildCSS` с `classNames="fade"` и `timeout={300}` по умолчанию.

```tsx
<SwitchCss transitionKey={activeTab}>
  <div>Контент</div>
</SwitchCss>
```

| Prop | Тип | По умолчанию | Описание |
|------|-----|--------------|----------|
| `transitionKey` | `string \| number` | — | Ключ переключения |
| `children` | `React.ReactElement` | — | Один ребёнок |
| `mode` | `AnimatePresenceMode` | `"wait"` | Режим AnimatePresence |

---

### usePresence

Хук для дочерних компонентов внутри `AnimatePresence`. Возвращает `isPresent` и `safeToRemove`.

```tsx
function CustomChild() {
  const { isPresent, safeToRemove } = usePresence();

  useEffect(() => {
    if (!isPresent) {
      // Запуск exit-анимации
      animateOut().then(safeToRemove);
    }
  }, [isPresent, safeToRemove]);

  return <div>...</div>;
}
```

| Возврат | Тип | Описание |
|---------|-----|----------|
| `isPresent` | `boolean` | Элемент ещё в дереве (`true`) или уже удалён (`false`) |
| `safeToRemove` | `() => void` | Вызвать, когда exit-анимация завершена — элемент можно удалить из DOM |

---

## Структура модуля

```
animate-presence/
├── components
|   ├── animate-presence.tsx   # Корневой компонент
|   ├── presence-child-js.tsx   # Обёртка для Animate (GSAP)
|   ├── presence-child-css.tsx # Обёртка для CSS transitions
|   ├── switch-element.tsx    # SwitchElement
|   └── switch-css.tsx       # SwitchCss
├── hooks
|   └── use-presence.ts      # Хук usePresence
├── utils
|   ├── utils.ts             # getChildKey, onlyElements
|   └── utils-reflow.ts      # forceReflow
├── context.tsx          # PresenceContext
├── types.ts             # AnimatePresenceProps, AnimatePresenceMode
├── types-presence-child.ts

```
