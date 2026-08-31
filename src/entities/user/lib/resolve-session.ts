import type { IncomingMessage } from "node:http";

import { getUser } from "../api";
import { AUTH_COOKIE_NAME } from "../model/constants";
import type { User } from "../model/types";

export type Session = {
  user: User | null;
  userIsAuthenticated: boolean;
};

type RequestWithCookies = {
  cookies?: Partial<Record<string, string>>;
};

const readAuthToken = (
  req?: RequestWithCookies | IncomingMessage | null,
): string | undefined => {
  if (!req || !("cookies" in req)) return undefined;
  return req.cookies?.[AUTH_COOKIE_NAME];
};

export const resolveSessionFromRequest = async (
  req?: RequestWithCookies | IncomingMessage | null,
): Promise<Session> => {
  const token = readAuthToken(req);

  if (!token) {
    return { user: null, userIsAuthenticated: false };
  }

  try {
    const user = await getUser(token);
    return { user, userIsAuthenticated: true };
  } catch {
    return { user: null, userIsAuthenticated: false };
  }
};
