import type { NextApiRequest, NextApiResponse } from "next";

import {
  parseAuthApiError,
  registerPayloadSchema,
  userRegister,
} from "@entities/user";

export default async function registerHandler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ message: "Method not allowed" });
  }

  const parsed = registerPayloadSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      message: parsed.error.issues[0]?.message ?? "Invalid registration payload",
    });
  }

  try {
    const user = await userRegister(parsed.data);

    return res.status(200).json({ data: { user } });
  } catch (error) {
    const { status, message } = parseAuthApiError(error, "Registration failed");

    return res.status(status).json({ message });
  }
}
