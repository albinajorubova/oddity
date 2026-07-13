export default () => ({
  "auto-save": {
    enabled: true,
    resolve: "./src/plugins/auto-save",
  },
  upload: {
    config: {
      breakpoints: {},
    },
  },
  meilisearch: {
    config: {
      host: process.env.MEILI_HOST || "http://meilisearch:7700",
      apiKey: process.env.MEILI_MASTER_KEY || "masterKey123456",
      // Настройки для каждой коллекции
      // product: {
      // Трансформация данных ПЕРЕД отправкой в Meilisearch
      // Только эти поля попадут в индекс
      // transformEntry({ entry }) {
      //   return {
      //     id: entry.id, // id обязателен для Meilisearch!
      //     title: entry.title,
      //     description: entry.description,
      //   };
      // },
      // Meilisearch settings
      // settings: {
      //   // Какие поля искать
      //   searchableAttributes: ['title', 'description'],
      // },
      // },
    },
  },
});
