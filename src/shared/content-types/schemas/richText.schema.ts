// TypeScript
import { z } from "zod";

/**
 * Упростим rich-text до HTML-строки (или JSON AST — если используете editor-формат).
 * При необходимости замените на дискриминированный союз форматов.
 */
export const RichTextSchema = z.object({
  kind: z.literal("html"),
  html: z.string().default(""),
});

export type RichText = z.infer<typeof RichTextSchema>;
