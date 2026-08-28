import type { NextApiRequest, NextApiResponse } from "next";

import {
  loginPayloadSchema,
  parseAuthApiError,
  serializeAuthCookie,
  userSignIn,
} from "@entities/user";

export default async function loginHandler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ message: "Method not allowed" });
  }

  const parsed = loginPayloadSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      message: parsed.error.issues[0]?.message ?? "Invalid login payload",
    });
  }

  try {
    const { jwt, user } = await userSignIn(parsed.data);

    res.setHeader("Set-Cookie", serializeAuthCookie(jwt));

    return res.status(200).json({
      data: { user },
    });
  } catch (error) {
    const { status, message } = parseAuthApiError(
      error,
      "Invalid email or password",
    );

    return res.status(status).json({ message });
  }
}
