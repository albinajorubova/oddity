declare global {
  interface Window {
    ym?: (counterId: number, method: string, ...args: unknown[]) => void;
  }
}

export type YandexMetrikaProps = {
  options?: {
    webvisor?: boolean;
    clickmap?: boolean;
    accurateTrackBounce?: boolean;
    trackLinks?: boolean;
  };
};
