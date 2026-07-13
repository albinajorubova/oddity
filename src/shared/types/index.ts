import type { ComponentProps, ComponentType, JSX } from "react";

import type { BREAKPOINTS } from "@shared/config";

/**
 * Утилитарный тип для компонента или HTML тега
 */
export type ComponentOrTag<Props = any> =
  | keyof JSX.IntrinsicElements
  | ComponentType<Props>;

/**
 * Динамические пропсы для компонента с возможностью указать тег
 */
export type DynamicProps<Element extends ComponentOrTag> = {
  tag?: Element;
} & (Element extends ComponentType<infer Props>
  ? Props
  : Element extends keyof JSX.IntrinsicElements
    ? ComponentProps<Element>
    : never);

/**
 * Branded type утилита для создания типов с меткой
 * Используется для создания типов с дополнительной типобезопасностью
 */
export type Brand<K, T> = K & { __brand: T };

/**
 * Тип для идентификатора сущности (branded string)
 */
export type EntityId = Brand<string, "EntityId">;

/**
 * Обертка для списка элементов в API ответе
 */
export type ApiList<T> = {
  items: T[];
  total: number;
};

/**
 * Утилитарный тип для nullable значений
 */
export type Nullable<T> = T | null;

/**
 * Ключи breakpoints для viewport (медиа-запросы)
 * Используется для адаптивного дизайна на основе ширины экрана
 * @see src/shared/config/breakpoints.ts
 */
export type BreakpointKeys = keyof typeof BREAKPOINTS;

/**
 * Размеры для UI элементов (иконки, кнопки, инпуты, ссылки)
 * Использует короткие названия для удобства использования в компонентах
 */
export type ElementSize = "xs" | "s" | "m" | "l" | "xl";

/**
 * Тип медиа объекта с указанием типа медиа
 */
export type MediaType = "image" | "video" | "file";

/**
 * Базовый тип для перестроенного медиа объекта
 */
export type RebuiltMedia = {
  id?: string | number;
  documentId?: string | number;
  mediaType: MediaType;
  alt?: string | null;
  originalUrl: string;
  url: string;
  mime?: string;
  width?: number;
  height?: number;
};

/**
 * Элемент источника изображения с указанием размера
 * Используется для создания srcset с разными размерами изображений
 */
export type ImageProxySourceItem = {
  /**
   * URL оптимизированного изображения через imgproxy
   */
  url: string;
  /**
   * Ширина изображения в пикселях
   */
  size: number;
};

/**
 * Тип для перестроенного изображения
 */
export type RebuiltImage = RebuiltMedia & {
  mediaType: "image";
  /**
   * Массив источников изображения с разными размерами
   * Используется для создания responsive изображений через srcset
   */
  source?: ImageProxySourceItem[];
};

/**
 * Тип для структуры медиа с breakpoint ключами
 */
export type MediaBreakpointKeys = BreakpointKeys | "default";

/**
 * Тип для объекта медиа с breakpoint ключами
 */
export type MediaWithBreakpoints<T extends RebuiltMedia = RebuiltImage> =
  Partial<Record<MediaBreakpointKeys, T>>;
