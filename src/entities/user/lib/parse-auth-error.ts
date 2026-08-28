import { parseApiError } from "@shared/lib/parse-api-error";

export const parseAuthError = (error: unknown, fallback: string): string =>
  parseApiError(error, fallback).message;

export const parseAuthApiError = (error: unknown, fallback: string) =>
  parseApiError(error, fallback);
