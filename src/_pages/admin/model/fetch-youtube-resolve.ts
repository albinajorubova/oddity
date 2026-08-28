import axios from "axios";

import { publicClient } from "@shared/api/client";

import {
  ResolveYoutubeErrorSchema,
  ResolveYoutubeSuccessSchema,
  type YoutubeResolvedData,
} from "./schemas";

export type FetchYoutubeResolveResult =
  | { ok: true; data: YoutubeResolvedData }
  | { ok: false; error: string };

export const fetchYoutubeResolve = async (
  url: string,
): Promise<FetchYoutubeResolveResult> => {
  try {
    const { data } = await publicClient.post<unknown>(
      "/api/resolve-youtube",
      { url },
      { timeout: 60_000 },
    );

    const successBody = ResolveYoutubeSuccessSchema.safeParse(data);
    if (!successBody.success) {
      return { ok: false, error: "Invalid response from resolve API" };
    }

    return { ok: true, data: successBody.data.data };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorBody = ResolveYoutubeErrorSchema.safeParse(
        error.response?.data,
      );

      if (errorBody.success) {
        return { ok: false, error: errorBody.data.error };
      }

      if (error.code === "ECONNABORTED") {
        return { ok: false, error: "Request timed out" };
      }

      return {
        ok: false,
        error: error.message || "Network error",
      };
    }

    return { ok: false, error: "Network error" };
  }
};
