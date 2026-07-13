import { STRAPI_CONFIG } from "@shared/config";

/**
 * Конфигурация путей из public директории, которые не нужно обрабатывать через imgproxy
 */
const PUBLIC_FILE_PATTERNS = [
  "/images/",
  "/icons/",
  "/ui-elements/",
  "/sounds/",
  "/next.svg",
  "/vercel.svg",
  "/window.svg",
  "/file.svg",
  "/globe.svg",
  "/404.webp",
] as const;

/**
 * Опции для нормализации URL изображений
 */
export type NormalizeImageUrlOptions = {
  /**
   * Дополнительные паттерны путей из public директории
   */
  additionalPublicPatterns?: readonly string[];
  /**
   * Разрешить обработку localhost URL через imgproxy
   * @default false
   */
  allowLocalhost?: boolean;
  /**
   * URL Strapi сервера (если не указан, берется из конфигурации)
   */
  strapiUrl?: string;
};

/**
 * Проверяет, является ли путь файлом из public директории
 * @param path - Путь к файлу
 * @param additionalPatterns - Дополнительные паттерны для проверки
 * @returns true, если файл из public
 */
export const isPublicFile = (
  path: string,
  additionalPatterns: readonly string[] = [],
): boolean => {
  const allPatterns = [...PUBLIC_FILE_PATTERNS, ...additionalPatterns];
  return allPatterns.some((pattern) => path.startsWith(pattern));
};

/**
 * Проверяет, является ли URL из того же домена, что и Strapi сервер
 * @param url - URL для проверки
 * @param strapiUrl - URL Strapi сервера
 * @returns true, если URL из того же домена
 */
const isSameDomain = (url: string, strapiUrl: string): boolean => {
  try {
    const imageUrl = new URL(url);
    const strapiUrlObj = new URL(strapiUrl);

    // Сравниваем домены (без учета поддоменов)
    const imageDomain = imageUrl.hostname.replace(/^www\./, "");
    const strapiDomain = strapiUrlObj.hostname.replace(/^www\./, "");

    // Проверяем точное совпадение или поддомены
    return (
      imageDomain === strapiDomain ||
      imageDomain.endsWith(`.${strapiDomain}`) ||
      strapiDomain.endsWith(`.${imageDomain}`)
    );
  } catch {
    return false;
  }
};

/**
 * Проверяет, нужно ли обрабатывать URL через imgproxy
 * @param url - URL изображения
 * @param options - Опции для проверки
 * @returns true, если нужно обрабатывать через imgproxy
 */
export const shouldProcessWithImgProxy = (
  url: string,
  options: NormalizeImageUrlOptions = {},
): boolean => {
  if (!url) {
    return false;
  }

  // Если это уже оптимизированный URL imgproxy, не обрабатываем
  if (url.includes("imgproxy")) {
    return false;
  }

  // Не обрабатываем файлы из public
  if (isPublicFile(url, options.additionalPublicPatterns)) {
    return false;
  }

  // Проверяем localhost
  if (url.includes("localhost") && !options.allowLocalhost) {
    return false;
  }

  // Обрабатываем только изображения из Strapi uploads или внешние HTTP URL
  return url.includes("/uploads/") || url.startsWith("http");
};

/**
 * Нормализует URL изображения для использования в imgproxy
 * Преобразует относительные пути в полные URL
 * @param imagePath - Путь к изображению (может быть относительным или полным URL)
 * @param options - Опции для нормализации
 * @returns Нормализованный URL для imgproxy или null, если не нужно обрабатывать
 */
export const normalizeImageSourceUrl = (
  imagePath: string,
  options: NormalizeImageUrlOptions = {},
): string | null => {
  if (!imagePath || typeof imagePath !== "string") {
    return null;
  }

  const strapiUrl = options.strapiUrl || STRAPI_CONFIG.strapiUrl;

  // Если это уже полный HTTP URL
  if (imagePath.startsWith("http")) {
    try {
      const url = new URL(imagePath);

      // Если URL из того же домена, что и Strapi, возвращаем как есть
      if (strapiUrl && isSameDomain(imagePath, strapiUrl)) {
        return imagePath;
      }

      // Для внешних доменов возвращаем как есть (imgproxy может обработать)
      return imagePath;
    } catch {
      // Если не удалось распарсить URL, возвращаем как есть
      return imagePath;
    }
  }

  // Если это относительный путь
  // Проверяем, не является ли это файлом из public
  if (isPublicFile(imagePath, options.additionalPublicPatterns)) {
    return null;
  }

  // Обрабатываем только изображения из Strapi (uploads)
  if (imagePath.includes("uploads/")) {
    if (!strapiUrl) {
      console.warn(
        "Strapi URL is not configured. Cannot normalize image path:",
        imagePath,
      );
      return null;
    }

    // Нормализуем путь (убираем/добавляем слэш)
    const normalizedPath = imagePath.startsWith("/")
      ? imagePath
      : `/${imagePath}`;

    return `${strapiUrl}${normalizedPath}`;
  }

  // Для других путей не обрабатываем
  return null;
};
