import { create } from "zustand";

import { cardLog } from "@entities/card/lib/logger";

import { fetchCreateCardFromUrl } from "./fetch-create-card";
import type { AdminCard } from "./types";

type AdminCardsActions = {
  hydrate: (cards: AdminCard[]) => void;
  addFromUrl: (url: string) => Promise<boolean>;
  clearError: () => void;
};

type AdminCardsState = {
  cards: AdminCard[];
  isLoading: boolean;
  error: string | null;
  actions: AdminCardsActions;
};

const upsertCard = (cards: AdminCard[], card: AdminCard): AdminCard[] => [
  card,
  ...cards.filter((item) => item.id !== card.id && item.slug !== card.slug),
];

export const useAdminCardsStore = create<AdminCardsState>((set, get) => ({
  cards: [],
  isLoading: false,
  error: null,
  actions: {
    clearError: () => set({ error: null }),

    hydrate: (cards) => {
      cardLog("adminCardsStore:hydrate", { count: cards.length });
      set({ cards });
    },

    addFromUrl: async (url) => {
      const trimmed = url.trim();
      if (!trimmed || get().isLoading) return false;

      cardLog("adminCardsStore:addFromUrl:start", { url: trimmed });
      set({ isLoading: true, error: null });

      const result = await fetchCreateCardFromUrl(trimmed);

      if (!result.ok) {
        cardLog("adminCardsStore:addFromUrl:failed", result.error);
        set({ isLoading: false, error: result.error });
        return false;
      }

      cardLog("adminCardsStore:addFromUrl:success", {
        slug: result.card.slug,
        created: result.created,
      });

      set((state) => ({
        isLoading: false,
        error: null,
        cards: upsertCard(state.cards, result.card),
      }));

      return true;
    },
  },
}));

export const useAdminCardsActions = (): AdminCardsActions =>
  useAdminCardsStore((state) => state.actions);
