import {
  generateImageUrl,
  type IGenerateImageUrl,
} from "@imgproxy/imgproxy-node";
import type { StaticImageData } from "next/image";

import {
  IMG_PROXY_DEFAULTS,
  IMG_PROXY_PUBLIC_PATH,
  siteOrigin,
} from "@shared/config";

type Options = NonNullable<IGenerateImageUrl["options"]>;
type Format = Options["format"];
type ResizeOptions = NonNullable<Options["resize"]>;

export type ImageProxySize = {
  width?: ResizeOptions["width"];
  height?: ResizeOptions["height"];
};

// Словарь экранирования символов
const escapeReplacements: Record<string, string> = {
  "%": "%25",
  "?": "%3F",
  "@": "%40",
};

/**
 * Преобразует URL источника в local:// путь для imgproxy.
 * Берется только pathname (без хоста), поэтому ссылка не зависит от того,
 * с какого домена (Strapi / сайт) пришел url.
 */
const toLocalSource = (src: string): string => {
  try {
    const { pathname, search } = new URL(src, siteOrigin);
    return `local://${pathname}${search}`;
  } catch {
    return src;
  }
};

/**
 * Применяет замены по словарю к строке
 * Заменяет все вхождения каждого ключа на соответствующее значение
 */
const applyReplacements = (
  str: string,
  replacements: Record<string, string>,
): string => {
  let result = str;
  for (const [search, replace] of Object.entries(replacements)) {
    // Используем replaceAll для замены всех вхождений
    // Если replaceAll недоступен, используем глобальный regex
    result = result.replaceAll
      ? result.replaceAll(search, replace)
      : result.replace(
          new RegExp(search.replace(/[.*+?^${}()|[]\\]/g, "\\$&"), "g"),
          replace,
        );
  }
  return result;
};

export const imageproxyUrl = (
  src: string | StaticImageData,
  format: Format = IMG_PROXY_DEFAULTS.format,
  dpr: number = IMG_PROXY_DEFAULTS.dpr,
  quality: number = IMG_PROXY_DEFAULTS.quality,
  size?: ImageProxySize,
) => {
  // Валидация quality
  if (quality < 0 || quality > 100 || !Number.isInteger(quality)) {
    throw new Error("Quality must be an integer between 0 and 100");
  }

  // Валидация dpr
  if (dpr <= 0 || !Number.isFinite(dpr)) {
    throw new Error("DPR must be a positive finite number");
  }

  // Валидация size
  if (size) {
    if (
      size.width !== undefined &&
      (size.width <= 0 || !Number.isInteger(size.width))
    ) {
      throw new Error("Width must be a positive integer");
    }
  }

  const resolvedSrc = typeof src === "string" ? src : src.src;

  // Формируем local:// источник из pathname
  const localSrc = toLocalSource(resolvedSrc);

  // Применяем экранирование символов
  const escapedSrc = applyReplacements(localSrc, escapeReplacements);

  // Формируем объект options
  const options: IGenerateImageUrl["options"] = {
    format,
    dpr,
    quality,
  };

  // Добавляем resize только если указан size с width или height
  if (size && (size.width !== undefined || size.height !== undefined)) {
    options.resize = {
      resizing_type: "fill",
    };

    if (size.width !== undefined) {
      options.resize.width = size.width;
    }

    if (size.height !== undefined) {
      options.resize.height = size.height;
    }
  }

  return generateImageUrl({
    endpoint: IMG_PROXY_PUBLIC_PATH,
    url: {
      value: escapedSrc,
      displayAs: "plain",
    },
    options,
  });
};
