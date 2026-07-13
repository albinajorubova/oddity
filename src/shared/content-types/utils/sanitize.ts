// TypeScript

/**
 * Минимальный sanitize. Для продакшна используйте библиотеку (например, DOMPurify с isomorphic-обёрткой).
 */
export function sanitizeHtml(html: string): string {
  // Простейшее вырезание скриптов. Замените на нормальный sanitize.
  return html.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "");
}

/**
 * Санитайзер для строковых значений (например, из CMS в плоских полях).
 */
export function sanitizeText(s: string | null | undefined): string {
  return (s ?? "").toString().trim();
}
