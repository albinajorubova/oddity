/**
 * Публичный путь (same-origin), по которому браузер запрашивает изображения.
 * Next.js проксирует его на контейнер imgproxy (см. rewrites в next.config.ts),
 * по аналогии с /api.
 */
export const IMG_PROXY_PUBLIC_PATH = "/imgproxy";

/**
 * Внутренний адрес imgproxy для проксирования в docker-сети
 * (используется как destination в rewrites, аналогично baseUrl для /api).
 */
export const imgProxyBaseUrl = `http://${process.env.PROJECT_SLUG}_imgproxy:8080`;

/**
 * Дефолтные значения для генерации ссылок изображений через imgproxy.
 * Ссылки формируются на фронте во время верстки.
 */
export const IMG_PROXY_DEFAULTS = {
  format: "webp" as const,
  quality: 90,
  dpr: 1,
};

/**
 * Максимальное разрешение изображений — 2K / QHD (2560 × 1440).
 * Изображения не запрашиваются в бо́льшем размере.
 */
export const IMAGE_MAX_WIDTH = 2560;
export const IMAGE_MAX_HEIGHT = 1440;
