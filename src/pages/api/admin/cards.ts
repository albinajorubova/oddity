import { cardError, cardLog } from "@entities/card/lib/logger";
import type { User } from "@entities/user/model/types";

import { createApiHandler, rejectUnlessOk } from "@shared/api/next";
import { createCardFromUrl } from "@/_pages/admin/api/create-card-from-url";
import { getAdminCards } from "@/_pages/admin/api/get-admin-cards";
import { getAdminFromRequest } from "@/_pages/admin/api/require-admin";
import { updateCardPublishStatus } from "@/_pages/admin/api/update-card-publish-status";
import {
  CreateCardRequestSchema,
  UpdatePublishStatusSchema,
} from "@/_pages/admin/model/schemas";

export default createApiHandler({
  onRequest: (req) => {
    cardLog("api/admin/cards", { method: req.method });
  },
  auth: getAdminFromRequest,
  onAuthorized: (admin) => {
    const user = admin as User;
    cardLog("api/admin/cards:admin", {
      userId: user.id,
      email: user.email,
    });
  },
  onError: (error, req) => {
    cardError(`api/admin/cards:${req.method?.toLowerCase()}:failed`, error);
  },
  handlers: {
    GET: async (_req, res) => {
      const cards = await getAdminCards();
      cardLog("api/admin/cards:get:success", { count: cards.length });
      res.status(200).json({ data: cards });
    },

    POST: async (req, res) => {
      const { url } = CreateCardRequestSchema.parse(req.body);
      cardLog("api/admin/cards:post:start", { url });

      const result = await createCardFromUrl(url);
      if (!rejectUnlessOk(res, result)) return;

      cardLog("api/admin/cards:post:success", {
        slug: result.card.slug,
        created: result.created,
      });

      res.status(result.created ? 201 : 200).json({
        data: result.card,
        created: result.created,
      });
    },

    PATCH: async (req, res) => {
      const { id, publishStatus } = UpdatePublishStatusSchema.parse(req.body);
      cardLog("api/admin/cards:patch:start", { id, publishStatus });

      const result = await updateCardPublishStatus(id, publishStatus);
      if (!rejectUnlessOk(res, result)) return;

      cardLog("api/admin/cards:patch:success", {
        id,
        publishStatus: result.card.publishStatus,
      });

      res.status(200).json({ data: result.card });
    },
  },
});
