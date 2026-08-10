import { IMAGE_MAX_WIDTH, IMG_PROXY_DEFAULTS } from "@shared/config";
import type {
  BreakpointKeys,
  ImageProxySourceItem,
  MediaBreakpointKeys,
  RebuiltImage,
} from "@shared/types";
import { imageproxyUrl } from "@shared/utils/imgproxy";
import { shouldProcessWithImgProxy } from "@shared/utils/normalize-image-source-url";
import { BREAKPOINTS, IMAGE_BREAKPOINTS } from "@/shared/config/breakpoints";

type SourceKeys = MediaBreakpointKeys;

type SourceObject = {
  srcSet: string;
  src: string;
  media: string;
  type: string;
  breakpointSize: number;
  sizes: string;
  altText: string | null;
};

const { format, dpr, quality } = IMG_PROXY_DEFAULTS;

/**
 * Генерирует ссылку на изображение через imgproxy с дефолтными настройками
 * (format, dpr, quality) и заданной шириной.
 * Файлы из /public (например /images/...) отдаются как есть — без imgproxy.
 */
const buildImageUrl = (url: string, width?: number): string => {
  if (!shouldProcessWithImgProxy(url)) {
    return url;
  }

  return imageproxyUrl(
    url,
    format,
    dpr,
    quality,
    width !== undefined ? { width } : undefined,
  );
};

/**
 * Создает строку srcSet, формируя imgproxy-ссылки для каждого размера
 */
const createSrcSet = (url: string, sizes: number[]): string => {
  if (!shouldProcessWithImgProxy(url)) {
    return url;
  }

  return sizes.map((size) => `${buildImageUrl(url, size)} ${size}w`).join(", ");
};

const createSrcSetFromArray = (urls: ImageProxySourceItem[]) => {
  return urls.map((item) => `${item.url} ${item.size}w`).join(", ");
};

/**
 * Получает все доступные размеры изображений из конфигурации
 * (с учетом максимального разрешения 2K / QHD)
 */
export const getImageSizes = (): number[] => {
  const sizes: number[] = [];
  for (const size of Object.values(IMAGE_BREAKPOINTS)) {
    if (size !== null && size <= IMAGE_MAX_WIDTH) {
      sizes.push(size);
    }
  }
  return sizes;
};

/**
 * Формирует список ширин для srcSet: не превышает натуральную ширину
 * изображения и ограничен максимальным разрешением (2560px).
 */
const getSrcSetSizes = (imageWidth?: number): number[] => {
  const maxWidth = Math.min(imageWidth || IMAGE_MAX_WIDTH, IMAGE_MAX_WIDTH);
  const sizes = getImageSizes().filter((size) => size < maxWidth);
  sizes.push(maxWidth);
  return sizes;
};

/**
 * Ключи, которые считаются базовым (default) источником.
 * Strapi отдает базовое изображение под ключом `media`.
 */
const DEFAULT_KEYS = new Set(["default", "media"]);

const isDefaultKey = (key: string): boolean => DEFAULT_KEYS.has(key);

/**
 * Получает размер breakpoint для ключа
 */
const getBreakpointSize = (key: SourceKeys): number | undefined => {
  return isDefaultKey(key) ? undefined : BREAKPOINTS[key as BreakpointKeys];
};

/**
 * Создает media query для breakpoint.
 * Базовый ключ и неизвестные ключи трактуются как default.
 */
const createMediaQuery = (key: SourceKeys, breakpointSize?: number): string => {
  if (isDefaultKey(key) || breakpointSize === undefined) {
    return "(min-width: 0px)";
  }
  return `(max-width: ${breakpointSize}px)`;
};

/**
 * Создает srcSet строку из источника изображения.
 * Использует готовый массив source (устаревший формат), иначе формирует
 * imgproxy-ссылки на фронте из URL и размеров.
 */
const createSrcSetFromImage = (image: RebuiltImage): string => {
  if (image.source && image.source.length > 0) {
    return createSrcSetFromArray(image.source);
  }

  return createSrcSet(image.url, getSrcSetSizes(image.width));
};

/**
 * Достает alt из перестроенного или сырого (Strapi) объекта изображения
 */
const getImageAlt = (image: RebuiltImage): string | null => {
  return (
    image.alt ??
    (image as { alternativeText?: string | null }).alternativeText ??
    null
  );
};

/**
 * Создает объект source для picture элемента
 */
const createSourceObject = (
  key: SourceKeys,
  image: RebuiltImage,
  sizes: string,
): SourceObject => {
  const breakpointSize = getBreakpointSize(key);
  const useProxy = shouldProcessWithImgProxy(image.url);

  const srcSet = createSrcSetFromImage(image);
  const defaultSrc = useProxy
    ? buildImageUrl(image.url, IMAGE_BREAKPOINTS.xs)
    : image.url;

  const mimeFromPath = image.url.match(/\.(\w+)(?:\?|$)/)?.[1];
  const type = useProxy
    ? `image/${format}`
    : `image/${mimeFromPath === "jpg" ? "jpeg" : mimeFromPath || format}`;

  return {
    srcSet,
    src: defaultSrc,
    media: createMediaQuery(key, breakpointSize),
    type,
    breakpointSize: isDefaultKey(key) ? 0 : breakpointSize || 0,
    sizes,
    altText: getImageAlt(image),
  };
};

/**
 * Фильтрует валидные записи источника (исключает id и null значения)
 */
const isValidSourceEntry = (
  entry: [string, RebuiltImage | undefined],
): entry is [string, RebuiltImage] => {
  const [key, value] = entry;
  return key !== "id" && value !== undefined && value !== null;
};

/**
 * Преобразует объект с breakpoint ключами в массив source объектов для picture элемента
 */
export const getSources = (
  source: Partial<Record<SourceKeys, RebuiltImage>>,
  sizes: string,
): SourceObject[] => {
  const sourcesObjects = Object.entries(source)
    .filter(isValidSourceEntry)
    .map(([key, value]) => createSourceObject(key as SourceKeys, value, sizes))
    .sort((a, b) => a.breakpointSize - b.breakpointSize);

  // Перемещаем default в конец (он должен быть последним в picture)
  const defaultIndex = sourcesObjects.findIndex((s) => s.breakpointSize === 0);
  if (defaultIndex === -1) {
    return sourcesObjects;
  }

  const [defaultSource] = sourcesObjects.splice(defaultIndex, 1);
  return [...sourcesObjects, defaultSource];
};
