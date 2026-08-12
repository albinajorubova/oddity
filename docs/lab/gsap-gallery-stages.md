# GSAP Gallery — этапы (Oddity lab)

Sandbox: **`/lab/gallery`**  
Этапы 1–3 — lab. Этап 4 — реальные collections → `/collections/[slug]`.

Логика как в WebGPU-туториале (keep / remove / add), техника — **GSAP Flip** (lab) / **sync TransitionLayout** (cross-route).

| Туториал | GSAP |
|----------|------|
| keep + tweenBounds | `Flip.getState` → layout → `Flip.from` (lab) / morph в TransitionLayout (route) |
| remove | `gsap.to(others, { opacity })` / hide target |
| add | fade / stagger текста и блоков |

Тайминги: `docs/design/ODDITY-design-system.md` §2.3.

Код lab: `src/_pages/lab-gallery/ui/use-lab-flip.ts`  
Код route: `src/widgets/transition-layout/`

---

## Этап 1 — layout (done)

Сетка, `data-flip-id`, hero-слот.

---

## Этап 2 — open: keep / remove / add (done)

1. FIRST — `Flip.getState(card)`  
2. LAST — hero с тем же id, card `hidden`  
3. KEEP — `Flip.from` → hero  
4. REMOVE — другие cards → 0.25  
5. ADD — title fade in  

---

## Этап 3 — close: reverse (done)

1. ADD reverse — title fade out (пока hero ещё в DOM)  
2. FIRST — `Flip.getState(hero)`  
3. LAST — `activeSlug = null` (card снова visible, hero убран)  
4. KEEP reverse — `Flip.from` → card  
5. REMOVE reverse — все cards opacity → 1  

Триггеры: кнопка «Закрыть» или повторный клик по активной карточке.

---

## Этап 4 — Next: collections → `/collections/[slug]` (done)

Cross-route: **sync TransitionLayout** — обе страницы в DOM во время morph.

1. Клик по карточке → navigate на `/collections/[slug]`  
2. Morph card → hero (`collections-to-detail`)  
3. Back «← Collections» → `detail-to-collections`: hero → card  

Файлы:
- `src/widgets/transition-layout/` — sync SwitchElement + анимации  
- collections `GallerySection` — `CollectionCard` с `data-flip-*`  
- `HeroCover` — `data-flip-role="hero"`  

---

## Этап 5 — полировка

Тайминги design system, reduced motion, cursor, lock mid-transition, remove/add siblings.
