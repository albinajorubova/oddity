# Oddity — Content Model → Detail Page

Источник правды для каждой карточки архива.  
UI не добавляет сущностей сверх этой модели.

---

## 1. Content Model (Draft)

### Core Information

| Field | Notes |
|-------|--------|
| Title | |
| Original title | |
| Type | Movie / Series / Anime / Music / Book / Game |
| Release year | |
| Country | |
| Runtime / Episodes / Duration | зависит от Type |
| Status | Released / Ongoing / Upcoming |
| Cover / Poster | |
| Hero image | |
| Short description | |
| Full description | |

### People

Универсальная сущность, роли по Type:

Director · Author · Mangaka · Creator · Studio · Composer · Cast · Voice actors · Performers · Producers · Writers

### Categories (независимые таксономии)

| Taxonomy | Meaning | Examples |
|----------|---------|----------|
| **Genres** | форма / жанр | Sci-Fi, Drama, Thriller, Comedy, Romance, Horror, Fantasy, Cyberpunk |
| **Themes** | о чём работа | Identity, Memory, Loneliness, Love, Death, Family, War, Growing Up, AI, Time, Religion, Society |
| **Atmosphere** | как ощущается мир | Cold, Warm, Dreamlike, Cozy, Neon, Industrial, Brutalist, Claustrophobic, Melancholic, Chaotic |
| **Mood** | как ощущает зритель | Hopeful, Disturbing, Relaxing, Uplifting, Sad, Nostalgic, Tense, Euphoric |
| **Tags** | свободные дескрипторы | Time Travel, Robots, Vampires, Slow Burn, Plot Twist, Coming of Age, Noir |

### Oddity Characteristics

Субъективные черты (не рейтинг):  
Artistic · Mainstream · Weird · Emotional · Violent · Philosophical · Dark · Funny · Romantic · Experimental · Chaotic · Pretentious · Accessible

### Meme Characteristics

Игривые дескрипторы:  
Trash · Camp · Cringe · Absurdity · Edge · Cult · Guilty Pleasure

### Visual Spectrum

Оси характера (не оценки), значение на каждой оси:

| Axis A | ↔ | Axis B |
|--------|---|--------|
| Art | ↔ | Mainstream |
| Slow | ↔ | Dynamic |
| Optimistic | ↔ | Depressing |
| Minimal | ↔ | Overloaded |
| Realistic | ↔ | Surreal |
| Accessible | ↔ | Difficult |

### Quality Metrics

Отдельно от «художественности»:

- Craftsmanship  
- Accessibility  
- Artistic Value  
- Entertainment  

### Visual DNA

Профиль опыта (бары), пример осей:

CRAZY · ART · FUN · DARK · SLOW · EMOTIONAL · TRASH · CULT

### Availability

Cinema · Netflix · Crunchyroll · Spotify · Apple Music · Blu-ray · Steam · …

### Media

Poster · Hero image · Screenshots · Gallery · Trailer · Opening · Ending · Soundtrack · Album · Concept art · Storyboards · Behind the scenes · Promotional materials

### Facts

Trivia · Production history · Inspirations · References · Quotes · Awards · Nominations · Budget · Box office · Fun facts

### Relationships

Связь = тип + целевая работа:

Inspired by · Inspired · References · Same director · Same author · Same composer · Same atmosphere · Same aesthetic · Same themes · Same emotional impact · Same ending feeling · Same visual language · Same soundtrack · If you liked… · Companion piece

### Collections

Работа может входить в несколько кураторских подборок  
(Neon Nights, Perfect Endings, Rainy Day Cinema, …)

### Editor's Note

Короткая кураторская ремарка (не рецензия).

### Timeline

Release chronology · Predecessors · Sequels · Influenced by · Inspired later works · Adaptations · Remakes

---

## 2. Detail Page — раскладка

### First screen — CORE

Только то, что нужно «узнать объект»:

- Core Information (кроме Full description)  
- Editor's Note  
- Availability  
- Media для hero: Cover / Poster / Hero image / Screenshots (multi-photo stack)

### Side indicators → sections

Индикатор есть **только если** у карточки есть данные.

| Indicator | Content Model |
|-----------|----------------|
| **DNA** | Visual DNA |
| **Characteristics** | Oddity Characteristics + Meme Characteristics |
| **Categories** | Genres · Themes · Atmosphere · Mood · Tags |
| **Quality** | Quality Metrics |
| **People** | People (роли по Type) |
| **Description** | Full description |
| **Facts** | Facts |
| **Media** | Media (полный vault) |
| **Relationships** | Relationships |
| **Collections** | Collections |
| **Timeline** | Timeline |
| **Spectrum →** | Visual Spectrum → **отдельная страница** (+ compare) |

### Spectrum page (отдельно)

- Visual Spectrum на координатной плоскости  
- Выбор пары осей из модели  
- Compare: добавить другие карточки из архива на ту же плоскость  

Не смешивать со scroll-секциями detail.

---

## 3. Правила UI

1. Не показывать блок без данных.  
2. Не изобретать поля вне этой модели.  
3. Type влияет на отображение People / Runtime fields / Media priority — не на состав модели.  
4. Relationships не заменять общим «Similar» — всегда виден тип связи.  
5. DNA и Spectrum — разные представления характера; оба из модели, разные экраны.
