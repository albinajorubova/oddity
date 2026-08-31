# Oddity — Music Library Data Model (minimal)

Личная музыкальная база. Сейчас — **YouTube → Music Item**, люди через **Person**.

Реализация: Strapi 5 + `@strapi/src/components/cards/person-ref`.

---

## Strapi sidebar

| Collection | Назначение |
|------------|------------|
| **Music Item** | hub — admin flow (YouTube import) |
| **Music Item Type** | album, track, playlist, … |
| **Person** | люди (shared) |
| **Card** | архив для фильмов и прочего (не музыка из YouTube) |

---

## Admin flow

```
/admin → ADD → POST /api/admin/cards
  → resolveYoutubeUrl
  → buildMusicItemInputFromYoutube
  → createMusicItem → Strapi `music-items` (draft)
```

YouTube kind → item type:

| YouTube | Music Item Type |
|---------|-----------------|
| song | track |
| album | album |
| playlist | playlist |

---

## TypeScript entities

| Path | Содержимое |
|------|------------|
| `@entities/person` | Person, PersonRef |
| `@entities/music-library` | MusicItem API, mappers, types |
| `@entities/card` | legacy / non-music archive (пока не используется в admin) |
