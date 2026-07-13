import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";

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

/**
 * Типизированные методы для работы с API
 */
export const api = {
  /**
   * GET запрос
   */
  get: <T = unknown>(url: string, config?: AxiosRequestConfig) =>
    client.get<ApiResponse<T>>(url, config).then((res) => res.data),

  /**
   * POST запрос
   */
  post: <T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ) => client.post<ApiResponse<T>>(url, data, config).then((res) => res.data),

  /**
   * PUT запрос
   */
  put: <T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ) => client.put<ApiResponse<T>>(url, data, config).then((res) => res.data),

  /**
   * PATCH запрос
   */
  patch: <T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ) => client.patch<ApiResponse<T>>(url, data, config).then((res) => res.data),

  /**
   * DELETE запрос
   */
  delete: <T = unknown>(url: string, config?: AxiosRequestConfig) =>
    client.delete<ApiResponse<T>>(url, config).then((res) => res.data),
};
