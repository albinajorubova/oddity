import type { NextApiRequest, NextApiResponse } from "next";
import { ZodError } from "zod";

import { cardError, cardLog } from "@entities/card/lib/logger";

import { createCardFromUrl } from "@/_pages/admin/api/create-card-from-url";
import { getAdminCards } from "@/_pages/admin/api/get-admin-cards";
import { getAdminFromRequest } from "@/_pages/admin/api/require-admin";
import { CreateCardRequestSchema } from "@/_pages/admin/model/schemas";
import type { AdminCard } from "@/_pages/admin/model/types";

type GetSuccessBody = { data: AdminCard[] };
type PostSuccessBody = { data: AdminCard; created: boolean };
type ErrorBody = { error: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GetSuccessBody | PostSuccessBody | ErrorBody>,
) {
  cardLog("api/admin/cards", { method: req.method });

  const admin = await getAdminFromRequest(req);
  if (!admin) {
    cardLog("api/admin/cards:unauthorized");
    return res.status(401).json({ error: "Unauthorized" });
  }

  cardLog("api/admin/cards:admin", { userId: admin.id, email: admin.email });

  if (req.method === "GET") {
    try {
      const cards = await getAdminCards();
      cardLog("api/admin/cards:get:success", { count: cards.length });
      return res.status(200).json({ data: cards });
    } catch (error) {
      cardError("api/admin/cards:get:failed", error);
      const message =
        error instanceof Error ? error.message : "Failed to load cards";
      return res.status(500).json({ error: message });
    }
  }

  if (req.method === "POST") {
    try {
      const { url } = CreateCardRequestSchema.parse(req.body);
      cardLog("api/admin/cards:post:start", { url });

      const result = await createCardFromUrl(url);

      if (!result.ok) {
        cardLog("api/admin/cards:post:rejected", result.error);
        return res.status(422).json({ error: result.error });
      }

      cardLog("api/admin/cards:post:success", {
        slug: result.card.slug,
        created: result.created,
      });

      return res.status(result.created ? 201 : 200).json({
        data: result.card,
        created: result.created,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        cardLog("api/admin/cards:post:validation", error.issues);
        return res.status(400).json({
          error: error.issues[0]?.message ?? "Invalid request",
        });
      }

      cardError("api/admin/cards:post:failed", error);
      const message =
        error instanceof Error ? error.message : "Failed to create card";
      return res.status(500).json({ error: message });
    }
  }

  res.setHeader("Allow", "GET, POST");
  return res.status(405).json({ error: "Method not allowed" });
}
