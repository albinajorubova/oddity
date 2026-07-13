import type { RichText } from "../schemas/richText.schema";

/**
 * Простейший рендерер. Поскольку контент уже прошёл sanitize в адаптере,
 * допускаем dangerouslySetInnerHTML. Можно дополнительно ограничить allowlist.
 */
export function RichTextRenderer({ value }: { value: RichText }) {
  return <div dangerouslySetInnerHTML={{ __html: value.html }} />;
}
