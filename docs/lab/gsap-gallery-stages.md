# GSAP Gallery — этапы (Oddity lab)

Sandbox: **`/lab/gallery`**  
Этапы 1–3 — lab. Этап 4 — реальные home → `/archive/[slug]`.

Логика как в WebGPU-туториале (keep / remove / add), техника — **GSAP Flip** (lab) / **fixed overlay + gsap** (cross-route).

| Туториал | GSAP |
|----------|------|
| keep + tweenBounds | `Flip.getState` → layout → `Flip.from` (lab) / fixed overlay tween (route) |
| remove | `gsap.to(others, { opacity })` / hide target via store |
| add | fade / stagger текста и блоков |

Тайминги: `docs/design/ODDITY-design-system.md` §2.3.

Код lab: `src/_pages/lab-gallery/ui/use-lab-flip.ts`  
Код route: `src/widgets/archive-flip/`

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

## Этап 4 — Next: home → `/archive/[slug]` (done)

Cross-route нельзя держать на одном Flip-state: DOM страницы уходит.
Решение — **persistent fixed overlay** вне Lenis Scroll.

1. Клик по карточке → `fromRect` + `startFlight({ direction: 'to-detail' })` → `router.push`  
2. Overlay летит `fromRect` → `[data-flip-role=hero]`  
3. Пока летит — `hideTarget` прячет реальный hero (и card-источник)  
4. Back «← Archive» → `to-home`: from hero → card в сетке  

Файлы:
- `src/widgets/archive-flip/` — store + overlay  
- home `GallerySection` — startFlight + mediaHidden  
- `HeroCover` — `data-flip-role="hero"` + hide  
- `_app` — `<ArchiveFlipOverlay />` вне `<Scroll>`

---

## Этап 5 — полировка

Тайминги design system, reduced motion, cursor, lock mid-transition, remove/add siblings на home.
