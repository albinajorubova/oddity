import type { NextApiRequest, NextApiResponse } from "next";
import { ZodError } from "zod";

export const HTTP_METHODS = [
  "GET",
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
] as const;

export type HttpMethod = (typeof HTTP_METHODS)[number];

export type ApiErrorBody = {
  error: string;
};

export type ApiRouteHandler = (
  req: NextApiRequest,
  res: NextApiResponse,
) => Promise<void> | void;

type ServiceErrorResult = {
  ok: false;
  error: string;
};

type OkResult = {
  ok: true;
};

type CreateApiHandlerOptions = {
  handlers: Partial<Record<HttpMethod, ApiRouteHandler>>;
  auth?: (req: NextApiRequest) => Promise<unknown | null>;
  onAuthorized?: (auth: unknown, req: NextApiRequest) => void;
  onRequest?: (req: NextApiRequest) => void;
  onError?: (error: unknown, req: NextApiRequest) => void;
  unauthorizedBody?: ApiErrorBody;
  notAllowedBody?: ApiErrorBody;
};

export const rejectUnlessOk = <
  TResult extends OkResult | ServiceErrorResult,
>(
  res: NextApiResponse,
  result: TResult,
  rejectStatus = 422,
): result is Extract<TResult, OkResult> => {
  if (!result.ok) {
    res.status(rejectStatus).json({ error: result.error });
    return false;
  }

  return true;
};

export const createApiHandler = (options: CreateApiHandlerOptions) => {
  const allowedMethods = Object.keys(options.handlers) as HttpMethod[];

  return async (req: NextApiRequest, res: NextApiResponse) => {
    options.onRequest?.(req);

    if (options.auth) {
      const auth = await options.auth(req);

      if (!auth) {
        return res
          .status(401)
          .json(options.unauthorizedBody ?? { error: "Unauthorized" });
      }

      options.onAuthorized?.(auth, req);
    }

    const method = req.method as HttpMethod;
    const routeHandler = options.handlers[method];

    if (!routeHandler) {
      res.setHeader("Allow", allowedMethods.join(", "));
      return res
        .status(405)
        .json(options.notAllowedBody ?? { error: "Method not allowed" });
    }

    try {
      await routeHandler(req, res);
    } catch (error) {
      options.onError?.(error, req);

      if (error instanceof ZodError) {
        return res.status(400).json({
          error: error.issues[0]?.message ?? "Invalid request",
        });
      }

      const message =
        error instanceof Error ? error.message : "Internal server error";

      return res.status(500).json({ error: message });
    }
  };
};
