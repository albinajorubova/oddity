import rebuild from "./rebuild";

type RequestFunction = (options?: { status?: "draft" | "published" }) => Promise<unknown>;

export const getServerSidePropsData = async <
  T extends Record<string, RequestFunction>,
>(
  additionalRequests?: T,
  options?: { isDraftMode?: boolean },
) => {
  try {
    // Получаем общие данные
    // const commonData = await getCommonData();
    // const projectsCount = await getProjectsCount();
    // const servicesList = await getHomeServices();

    // Определяем status для запросов к Strapi
    const status = options?.isDraftMode ? ("draft" as const) : ("published" as const);

    // Получаем дополнительные данные, если они переданы
    const additionalData: Record<string, unknown> = {};

    if (additionalRequests) {
      const requests = Object.entries(additionalRequests).map(
        async ([key, requestFn]) => {
          // Передаем опции в функцию запроса
          const data = await requestFn({ status });
          return [key, data] as const;
        },
      );

      const results = await Promise.all(requests);

      results.forEach(([key, data]) => {
        additionalData[key] = data;
      });
    }

    return rebuild({
      commonData: {
        // ...commonData,
        // projectsCount,
        // servicesList,
      },
      ...additionalData,
    });
  } catch (error) {
    console.error("Error fetching server-side props data:", error);
    return {
      commonData: null,
      ...(additionalRequests &&
        Object.keys(additionalRequests).reduce(
          (acc, key) => {
            acc[key] = null;
            return acc;
          },
          {} as Record<string, unknown>,
        )),
    };
  }
};
