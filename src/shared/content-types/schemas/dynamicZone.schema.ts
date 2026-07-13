// TypeScript
import { z } from "zod";

/**
 * Динамическая зона Strapi: элементы содержат __component (uid) и произвольный payload.
 * На старте оставляем payload: unknown и валидируем/нормализуем в целевых адаптерах.
 * Позже можно сделать дискриминированный union по __component.
 */
export const DynamicZoneItemSchema = z
  .object({
    id: z.union([z.string(), z.number()]),
    __component: z.string().min(1),
  })
  .catchall(z.unknown());

export type DynamicZoneItem = z.infer<typeof DynamicZoneItemSchema>;

export const DynamicZoneSchema = z.array(DynamicZoneItemSchema);
export type DynamicZone = z.infer<typeof DynamicZoneSchema>;
