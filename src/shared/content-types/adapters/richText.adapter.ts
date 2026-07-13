import { type RichText, RichTextSchema } from "../schemas/richText.schema";
import { sanitizeHtml } from "../utils/sanitize";

/**
 * Принимает unknown (сырой payload от CMS), валидирует через zod и возвращает безопасный RichText.
 */
export function normalizeRichText(input: unknown): RichText {
  const parsed = RichTextSchema.safeParse(input);
  if (!parsed.success) {
    // Фоллбек: пустой текст — можно логировать ошибку выше
    return { kind: "html", html: "" };
  }
  const safeHtml = sanitizeHtml(parsed.data.html);
  return { kind: "html", html: safeHtml };
}
