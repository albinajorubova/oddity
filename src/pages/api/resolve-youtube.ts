import { createApiHandler, rejectUnlessOk } from "@shared/api/next";
import { resolveYoutubeUrl } from "@/_pages/admin/api";
import { ResolveYoutubeRequestSchema } from "@/_pages/admin/model/schemas";

export default createApiHandler({
  handlers: {
    POST: async (req, res) => {
      const { url } = ResolveYoutubeRequestSchema.parse(req.body);
      const result = await resolveYoutubeUrl(url);

      if (!rejectUnlessOk(res, result)) return;

      res.status(200).json({ data: result.data });
    },
  },
});
