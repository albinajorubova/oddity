import type { NextApiRequest, NextApiResponse } from "next";

/**
 * API route для обработки preview запросов от Strapi
 * Включает/выключает Next.js Draft Mode и редиректит на указанную страницу
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Проверяем метод запроса
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // Получаем параметры из query string
  const { secret, url, status } = req.query;

  // Проверяем secret (должен совпадать с PREVIEW_SECRET)
  if (secret !== process.env.PREVIEW_SECRET) {
    return res.status(401).json({ message: "Invalid token" });
  }

  // Валидируем URL
  if (!url || typeof url !== "string") {
    return res.status(400).json({ message: "Invalid URL" });
  }

  // Предотвращаем open redirect - разрешаем только относительные пути
  if (!url.startsWith("/")) {
    return res.status(400).json({ message: "URL must be a relative path" });
  }

  // Включаем или выключаем Draft Mode в зависимости от status
  if (status === "published") {
    res.setDraftMode({ enable: false });
  } else {
    res.setDraftMode({ enable: true });
  }

  // Редиректим на указанный URL
  // Используем относительный путь для безопасности
  const redirectUrl = url.startsWith("/") ? url : `/${url}`;
  res.redirect(302, redirectUrl);
}
