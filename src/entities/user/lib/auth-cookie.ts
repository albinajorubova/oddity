import { stringifySetCookie } from "cookie";

import { isProd } from "@shared/config";

import {
  AUTH_COOKIE_MAX_AGE,
  AUTH_COOKIE_NAME,
} from "../model/constants";

export const serializeAuthCookie = (jwt: string): string =>
  stringifySetCookie({
    name: AUTH_COOKIE_NAME,
    value: jwt,
    httpOnly: true,
    secure: isProd,
    maxAge: AUTH_COOKIE_MAX_AGE,
    path: "/",
    sameSite: "lax",
  });

export const clearAuthCookie = (): string =>
  stringifySetCookie({
    name: AUTH_COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: isProd,
    expires: new Date(0),
    path: "/",
    sameSite: "lax",
  });
