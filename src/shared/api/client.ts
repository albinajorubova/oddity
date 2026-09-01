import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";

import { parseApiError } from "@shared/lib/parse-api-error";

export type ClientOptions = {
  /**
   * Включать ли авторизацию (по умолчанию true)
   * Если false, заголовок Authorization не будет добавлен
   */
  includeAuth?: boolean;
  /**
   * Базовый URL для всех запросов
   * Если не указан, используется API_CONFIG.networkUrl или API_CONFIG.url
   */
  baseURL?: string;
  /**
   * Кастомный токен авторизации
   * Если не указан, используется токен из API_CONFIG
   */
  token?: string;
  /**
   * Timeout для запросов в миллисекундах (по умолчанию 30000)
   */
  timeout?: number;
  /**
   * Включать ли обработку ошибок через interceptors (по умолчанию true)
   */
  handleErrors?: boolean;
};

/**
 * Типизированный ответ API
 */
export type ApiResponse<T = unknown> = {
  data: T;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
};

/**
 * Обработчик ошибок API
 */
export type ErrorHandler = (error: AxiosError) => void;

/**
 * Создает экземпляр axios клиента с условной авторизацией и обработкой ошибок
 * @param config - Конфигурация axios
 * @param options - Опции для настройки клиента
 * @returns Настроенный экземпляр axios
 */
export const createClient = (
  config?: AxiosRequestConfig,
  options?: ClientOptions,
): AxiosInstance => {
  const {
    includeAuth = true,
    baseURL,
    token,
    timeout = 30000,
    handleErrors = true,
  } = options || {};

  // Определяем токен для авторизации
  const authToken = token;

  // Определяем базовый URL
  const resolvedBaseURL = baseURL || config?.baseURL;

  const axiosConfig: AxiosRequestConfig = {
    ...config,
    baseURL: resolvedBaseURL,
    timeout,
    headers: {
      "Content-Type": "application/json",
      ...config?.headers,
      // Добавляем авторизацию только если она включена и токен присутствует
      ...(includeAuth &&
        authToken && {
          Authorization: `Bearer ${authToken}`,
        }),
    },
  };

  const instance = axios.create(axiosConfig);

  // Request interceptor
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // Можно добавить логирование запросов в dev режиме
      if (process.env.NODE_ENV === "development") {
        console.log(
          `[API Request] ${config.method?.toUpperCase()} ${config.url}`,
        );
      }
      return config;
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    },
  );

  // Response interceptor с обработкой ошибок
  if (handleErrors) {
    instance.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error: AxiosError) => {
        // Обработка ошибок
        if (error.response) {
          // Сервер ответил с кодом ошибки
          const status = error.response.status;
          const message =
            (error.response.data as { error?: { message?: string } })?.error
              ?.message || error.message;

          console.error(
            `[API Error] ${status} ${error.config?.url}: ${message}`,
          );

          // Можно добавить специфичную обработку для разных статусов
          switch (status) {
            case 401:
              console.error("[API Error] Unauthorized - проверьте токен");
              break;
            case 403:
              console.error("[API Error] Forbidden - недостаточно прав");
              break;
            case 404:
              console.error("[API Error] Not Found - ресурс не найден");
              break;
            case 500:
              console.error("[API Error] Server Error - ошибка на сервере");
              break;
          }
        } else if (error.request) {
          // Запрос был отправлен, но ответа не получено
          console.error("[API Error] Network Error - нет ответа от сервера");
        } else {
          // Ошибка при настройке запроса
          console.error(`[API Error] ${error.message}`);
        }

        return Promise.reject(error);
      },
    );
  }

  return instance;
};

/**
 * Базовый клиент с условной авторизацией
 * Авторизация добавляется только если токен присутствует в конфигурации
 * Использует API_CONFIG.networkUrl или API_CONFIG.url как baseURL
 */
export const client = createClient();

/**
 * Клиент без авторизации для публичных запросов
 */
export const publicClient = createClient(undefined, {
  includeAuth: false,
});

/**
 * Создает клиент с кастомным токеном
 * @param token - Токен для авторизации
 * @param baseURL - Базовый URL (опционально)
 */
export const createAuthenticatedClient = (
  token: string,
  baseURL?: string,
): AxiosInstance => {
  return createClient(undefined, { token, baseURL });
};

export type SafeApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

export type ApiRequestConfig = AxiosRequestConfig & {
  fallback?: string;
};

type ApiMethod = "get" | "post" | "put" | "patch" | "delete";

type ThrowingApiMethods = {
  get: <T>(url: string, config?: ApiRequestConfig) => Promise<T>;
  post: <T>(
    url: string,
    body?: unknown,
    config?: ApiRequestConfig,
  ) => Promise<T>;
  put: <T>(
    url: string,
    body?: unknown,
    config?: ApiRequestConfig,
  ) => Promise<T>;
  patch: <T>(
    url: string,
    body?: unknown,
    config?: ApiRequestConfig,
  ) => Promise<T>;
  delete: <T>(url: string, config?: ApiRequestConfig) => Promise<T>;
};

type SafeApiMethods = {
  get: <T>(url: string, config?: ApiRequestConfig) => Promise<SafeApiResult<T>>;
  post: <T>(
    url: string,
    body?: unknown,
    config?: ApiRequestConfig,
  ) => Promise<SafeApiResult<T>>;
  put: <T>(
    url: string,
    body?: unknown,
    config?: ApiRequestConfig,
  ) => Promise<SafeApiResult<T>>;
  patch: <T>(
    url: string,
    body?: unknown,
    config?: ApiRequestConfig,
  ) => Promise<SafeApiResult<T>>;
  delete: <T>(
    url: string,
    config?: ApiRequestConfig,
  ) => Promise<SafeApiResult<T>>;
};

const resolveRequestConfig = (
  config?: ApiRequestConfig,
): { axiosConfig: AxiosRequestConfig; fallback: string } => {
  const { fallback = "Request failed", ...axiosConfig } = config ?? {};
  return { axiosConfig, fallback };
};

const dispatchRequest = <T>(
  instance: AxiosInstance,
  method: ApiMethod,
  url: string,
  body: unknown | undefined,
  axiosConfig: AxiosRequestConfig,
): Promise<AxiosResponse<T>> =>
  instance.request<T>({
    ...axiosConfig,
    method,
    url,
    ...(body !== undefined ? { data: body } : {}),
  });

const API_METHODS = ["get", "post", "put", "patch", "delete"] as const satisfies readonly ApiMethod[];

const createApiMethods = <TSafe extends boolean>(
  instance: AxiosInstance,
  safe: TSafe,
): TSafe extends true ? SafeApiMethods : ThrowingApiMethods => {
  const run = async <T>(
    request: Promise<AxiosResponse<T>>,
    fallback: string,
  ) => {
    try {
      const { data } = await request;
      return safe
        ? ({ ok: true, data } satisfies SafeApiResult<T>)
        : data;
    } catch (error) {
      if (!safe) throw error;
      return {
        ok: false,
        error: parseApiError(error, fallback).message,
      } satisfies SafeApiResult<T>;
    }
  };

  const createMethod =
    (method: ApiMethod) =>
    <T>(
      url: string,
      bodyOrConfig?: unknown | ApiRequestConfig,
      maybeConfig?: ApiRequestConfig,
    ) => {
      const hasBody = method !== "get" && method !== "delete";
      const body = hasBody ? bodyOrConfig : undefined;
      const config = hasBody
        ? maybeConfig
        : (bodyOrConfig as ApiRequestConfig | undefined);
      const { axiosConfig, fallback } = resolveRequestConfig(config);

      return run<T>(
        dispatchRequest<T>(instance, method, url, body, axiosConfig),
        fallback,
      );
    };

  return Object.fromEntries(
    API_METHODS.map((method) => [method, createMethod(method)]),
  ) as TSafe extends true ? SafeApiMethods : ThrowingApiMethods;
};

const throwingApi = createApiMethods(client, false);
const safePublicApi = createApiMethods(publicClient, true);

export const api = {
  ...throwingApi,
  public: safePublicApi,
};
