import axios, { type AxiosError } from "axios";

import { isDev } from "@shared/config";

export type ParsedApiError = {
  status: number;
  message: string;
};

const getResponseMessage = (data: unknown): string | undefined => {
  if (typeof data !== "object" || data === null) {
    return undefined;
  }

  if ("message" in data && typeof data.message === "string") {
    return data.message;
  }

  if (
    "error" in data &&
    typeof data.error === "object" &&
    data.error !== null &&
    "message" in data.error &&
    typeof data.error.message === "string"
  ) {
    return data.error.message;
  }

  return undefined;
};

const getNetworkDebugMessage = (error: AxiosError): string | undefined => {
  if (!error.response && error.code) {
    return `${error.code}: ${error.message}`;
  }

  return error.message;
};

export const parseApiError = (
  error: unknown,
  fallback: string,
): ParsedApiError => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status ?? 500;
    const responseMessage = getResponseMessage(error.response?.data);
    const networkMessage = isDev ? getNetworkDebugMessage(error) : undefined;

    return {
      status,
      message: responseMessage ?? networkMessage ?? fallback,
    };
  }

  if (error instanceof Error && isDev) {
    return {
      status: 500,
      message: error.message,
    };
  }

  return {
    status: 500,
    message: fallback,
  };
};
