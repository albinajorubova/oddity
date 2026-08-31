import type { NextApiRequest, NextApiResponse } from "next";

import { resolveSessionFromRequest, type Session } from "@entities/user";

export default async function meHandler(
  req: NextApiRequest,
  res: NextApiResponse<Session>,
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({
      user: null,
      userIsAuthenticated: false,
    });
  }

  const session = await resolveSessionFromRequest(req);

  return res.status(200).json(session);
}
