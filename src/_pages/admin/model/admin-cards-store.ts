import { create } from "zustand";

import { cardLog } from "@entities/card/lib/logger";

import { api } from "@shared/api/client";

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

      const result = await api.public.post<{ data: AdminCard; created: boolean }>(
        "/api/admin/cards",
        { url: trimmed },
        { timeout: 60_000, fallback: "Failed to create card" },
      );

      if (!result.ok) {
        cardLog("adminCardsStore:addFromUrl:failed", result.error);
        set({ isLoading: false, error: result.error });
        return false;
      }

      const { data: card, created } = result.data;

      cardLog("adminCardsStore:addFromUrl:success", {
        slug: card.slug,
        created,
      });

      set((state) => ({
        isLoading: false,
        error: null,
        cards: upsertCard(state.cards, card),
      }));

      return true;
    },
  },
}));

export const useAdminCardsActions = (): AdminCardsActions =>
  useAdminCardsStore((state) => state.actions);
