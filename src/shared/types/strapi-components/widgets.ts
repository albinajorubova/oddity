import type { Image } from "./shared";

export type Seo = {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: Image;
  theme?: string;
  structuredData?: string;
};
