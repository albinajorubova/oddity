declare global {
  interface Window {
    gtag?: (
      command: "config" | "event" | "js",
      targetId: string | Date,
      config?: {
        page_path?: string;
        event_category?: string;
        event_label?: string;
        value?: number;
      },
    ) => void;
    dataLayer?: unknown[];
  }
}

export interface GAEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
}
