import type { NextApiRequest, NextApiResponse } from "next";

import { clearAuthCookie } from "@entities/user";

export default function logoutHandler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ message: "Method not allowed" });
  }

  res.setHeader("Set-Cookie", clearAuthCookie());
  return res.status(200).json({ message: "Logged out" });
}
