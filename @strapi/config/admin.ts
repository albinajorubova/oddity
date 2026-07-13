/**
 * Функция для генерации preview pathname на основе content type и документа
 */
const getPreviewPathname = (uid: string, { locale, document }: { locale?: string; document: any }): string | null => {
  // Обработка home-page
  if (uid === "api::home-page.home-page") {
    return "/";
  }

  // Для других content types возвращаем null (preview не поддерживается)
  return null;
};

export default ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET'),
  },
  apiToken: {
    salt: env('API_TOKEN_SALT'),
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT'),
    },
  },
  secrets: {
    encryptionKey: env('ENCRYPTION_KEY'),
  },
  flags: {
    nps: env.bool('FLAG_NPS', true),
    promoteEE: env.bool('FLAG_PROMOTE_EE', true),
  },
  preview: {
    enabled: true,
    config: {
      allowedOrigins: env('CLIENT_URL'),
      async handler(uid: string, { documentId, locale, status }: { documentId: string | number; locale?: string; status?: string }) {
        // Получаем полный документ из Strapi
        const documentIdStr = String(documentId);
        const document = await strapi.documents(uid as any).findOne({ documentId: documentIdStr });
        
        // Генерируем preview pathname на основе content type и документа
        const pathname = getPreviewPathname(uid, { locale, document });

        // Если pathname не найден, отключаем preview
        if (!pathname) {
          return null;
        }

        // Используем Next.js draft mode, передавая secret key и status контента
        const clientUrl = env('CLIENT_URL');
        const previewSecret = env('PREVIEW_SECRET');
        
        const urlSearchParams = new URLSearchParams({
          url: pathname,
          secret: previewSecret,
          status: status || 'draft',
        });
        
        return `${clientUrl}/api/preview?${urlSearchParams}`;
      },
    },
  },
});
