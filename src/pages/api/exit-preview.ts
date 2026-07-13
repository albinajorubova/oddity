import type { NextApiRequest, NextApiResponse } from "next";

/**
 * API route для выхода из Preview Mode
 * Отключает Next.js Draft Mode и редиректит на указанную страницу или на главную
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Проверяем метод запроса
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // Получаем URL для редиректа из query string (опционально)
  const { redirect } = req.query;

  // Отключаем Draft Mode
  res.setDraftMode({ enable: false });

  // Редиректим на указанный URL или на главную страницу
  const redirectUrl =
    redirect && typeof redirect === "string" && redirect.startsWith("/")
      ? redirect
      : "/";

  res.redirect(302, redirectUrl);
}
