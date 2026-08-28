import type { NextApiRequest, NextApiResponse } from "next";
import { ZodError } from "zod";

import { resolveYoutubeUrl } from "@/_pages/admin/api";
import {
  ResolveYoutubeRequestSchema,
  type YoutubeResolvedData,
} from "@/_pages/admin/model/schemas";

type SuccessBody = { data: YoutubeResolvedData };
type ErrorBody = { error: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SuccessBody | ErrorBody>,
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { url } = ResolveYoutubeRequestSchema.parse(req.body);
    const result = await resolveYoutubeUrl(url);

    if (!result.ok) {
      return res.status(422).json({ error: result.error });
    }

    return res.status(200).json({ data: result.data });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        error: error.issues[0]?.message ?? "Invalid request",
      });
    }

    return res.status(500).json({ error: "Internal server error" });
  }
}
