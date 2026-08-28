import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { fetchYoutubeResolve } from "./fetch-youtube-resolve";
import { type ArchiveLinkEntry, ArchiveLinkEntrySchema } from "./schemas";

const STORAGE_KEY = "oddity:admin:archive-links";

type ArchiveLinksActions = {
  addFromUrl: (url: string) => Promise<boolean>;
  removeByUrl: (url: string) => void;
  clearError: () => void;
};

type ArchiveLinksState = {
  entries: ArchiveLinkEntry[];
  isLoading: boolean;
  error: string | null;
  actions: ArchiveLinksActions;
};

type PersistedSlice = Pick<ArchiveLinksState, "entries">;

const parsePersistedEntries = (value: unknown): ArchiveLinkEntry[] => {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    const parsed = ArchiveLinkEntrySchema.safeParse(item);
    return parsed.success ? [parsed.data] : [];
  });
};

const storage = createJSONStorage<PersistedSlice>(() => {
  if (typeof window === "undefined") {
    return {
      getItem: () => null,
      setItem: () => undefined,
      removeItem: () => undefined,
    };
  }

  return {
    getItem: (name) => {
      const raw = window.localStorage.getItem(name);
      if (!raw) return null;

      try {
        const parsed: unknown = JSON.parse(raw);

        // Legacy format: bare ArchiveLinkEntry[]
        if (Array.isArray(parsed)) {
          return JSON.stringify({
            state: { entries: parsePersistedEntries(parsed) },
            version: 0,
          });
        }

        return raw;
      } catch {
        return null;
      }
    },
    setItem: (name, value) => {
      window.localStorage.setItem(name, value);
    },
    removeItem: (name) => {
      window.localStorage.removeItem(name);
    },
  };
});

export const useArchiveLinksStore = create<ArchiveLinksState>()(
  persist(
    (set, get) => ({
      entries: [],
      isLoading: false,
      error: null,
      actions: {
        clearError: () => set({ error: null }),

        removeByUrl: (url) =>
          set((state) => ({
            entries: state.entries.filter((entry) => entry.url !== url),
          })),

        addFromUrl: async (url) => {
          const trimmed = url.trim();
          if (!trimmed || get().isLoading) return false;

          set({ isLoading: true, error: null });

          const result = await fetchYoutubeResolve(trimmed);

          if (!result.ok) {
            set({ isLoading: false, error: result.error });
            return false;
          }

          const entryResult = ArchiveLinkEntrySchema.safeParse({
            url: trimmed,
            savedAt: new Date().toISOString(),
            data: result.data,
          });

          if (!entryResult.success) {
            set({
              isLoading: false,
              error: "Invalid archive entry shape",
            });
            return false;
          }

          set((state) => ({
            isLoading: false,
            error: null,
            entries: [
              entryResult.data,
              ...state.entries.filter(
                (item) => item.url !== entryResult.data.url,
              ),
            ],
          }));

          return true;
        },
      },
    }),
    {
      name: STORAGE_KEY,
      storage,
      partialize: (state): PersistedSlice => ({ entries: state.entries }),
      merge: (persisted, current) => {
        const persistedState =
          persisted && typeof persisted === "object"
            ? (persisted as { entries?: unknown })
            : null;

        return {
          ...current,
          entries: parsePersistedEntries(persistedState?.entries),
        };
      },
    },
  ),
);

export const useArchiveLinksActions = (): ArchiveLinksActions =>
  useArchiveLinksStore((state) => state.actions);
