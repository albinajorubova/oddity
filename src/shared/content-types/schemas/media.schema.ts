import { z } from "zod";

export const StrapiMediaSchema = z
  .object({
    data: z
      .object({
        id: z.union([z.string(), z.number()]).optional(),
        attributes: z
          .object({
            url: z.string().min(1),
            alternativeText: z.string().nullable().optional(),
            caption: z.string().nullable().optional(),
            // добавляйте нужные поля (width, height, formats и т.д.)
          })
          .partial(),
      })
      .partial(),
  })
  .partial()
  .nullable();

export type StrapiMedia = z.infer<typeof StrapiMediaSchema>;

export const getMediaUrl = (m: StrapiMedia | null | undefined): string | null =>
  m?.data?.attributes?.url ?? null;
