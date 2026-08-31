import type { NextApiRequest } from "next";

import { getUser, isAdmin } from "@entities/user";
import { AUTH_COOKIE_NAME } from "@entities/user/model/constants";
import type { User } from "@entities/user/model/types";

export const getAdminFromRequest = async (
  req: NextApiRequest,
): Promise<User | null> => {
  const token = req.cookies[AUTH_COOKIE_NAME];
  if (!token) return null;

  try {
    const user = await getUser(token);
    return isAdmin(user) ? user : null;
  } catch {
    return null;
  }
};
