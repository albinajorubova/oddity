import axios from "axios";

import { cardError, cardLog } from "@entities/card/lib/logger";

import { publicClient } from "@shared/api/client";

import type { AdminCard } from "./types";

export type FetchCreateCardResult =
  | { ok: true; card: AdminCard; created: boolean }
  | { ok: false; error: string };

type CreateCardResponse = {
  data: AdminCard;
  created: boolean;
};

type ErrorResponse = {
  error?: string;
  message?: string;
};

export const fetchCreateCardFromUrl = async (
  url: string,
): Promise<FetchCreateCardResult> => {
  cardLog("fetchCreateCardFromUrl:start", { url });

  try {
    const { data } = await publicClient.post<CreateCardResponse>(
      "/api/admin/cards",
      { url },
      { timeout: 60_000 },
    );

    cardLog("fetchCreateCardFromUrl:success", {
      slug: data.data.slug,
      created: data.created,
    });

    return {
      ok: true,
      card: data.data,
      created: data.created,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorBody = error.response?.data as ErrorResponse | undefined;

      cardError("fetchCreateCardFromUrl:failed", {
        status: error.response?.status,
        body: errorBody,
        message: error.message,
      });

      if (errorBody?.error || errorBody?.message) {
        return {
          ok: false,
          error: errorBody.error ?? errorBody.message ?? "Request failed",
        };
      }

      if (error.code === "ECONNABORTED") {
        return { ok: false, error: "Request timed out" };
      }

      if (error.response?.status === 401) {
        return { ok: false, error: "Unauthorized" };
      }

      return {
        ok: false,
        error: error.message || "Network error",
      };
    }

    cardError("fetchCreateCardFromUrl:unknown-error", error);
    return { ok: false, error: "Network error" };
  }
};
