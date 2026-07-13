import { create } from "zustand";

import { isDev } from "@shared/config";
import { round } from "@shared/utils";

type PreloaderState = {
  isStart: boolean;
  isPreloaded: boolean;
  isFinishSequenceAnimation: boolean;
  isFinishEndAnimation: boolean;
  percents: number;
  formattedPercents: string;
  isStartEndAnimation: boolean;
  additionalData: string[];
  actions: {
    setAdditionalData: (value: string[]) => void;
    setStart: () => void;
    setPercents: (value: number) => void;
    setFinishEndAnimation: (value: boolean) => void;
    setFinishSequenceAnimation: (value: boolean) => void;
    setStartEndAnimation: () => void;
  };
};

export const usePreloaderStore = create<PreloaderState>((set) => ({
  isStart: false,
  isPreloaded: false,
  isStartEndAnimation: false,
  isFinishSequenceAnimation: false,
  isFinishEndAnimation: isDev,
  percents: 0,
  formattedPercents: `0%`,
  additionalData: [],
  actions: {
    setAdditionalData: (value) =>
      set((state) => ({ additionalData: [...value, ...state.additionalData] })),
    setStart: () => set({ isStart: true }),
    setFinishSequenceAnimation: (value) => {
      set({ isFinishSequenceAnimation: value });
    },
    setFinishEndAnimation: (value) => {
      set({ isFinishEndAnimation: value });
    },
    setStartEndAnimation: () => {
      set({ isStartEndAnimation: true });
    },
    setPercents: (value) => {
      set({ percents: value });
      set({ formattedPercents: `${round(value * 100, 0)}%` });

      if (value === 1) {
        set({ isPreloaded: true });
      }
    },
  },
}));

export const usePreloaderActions = (): PreloaderState["actions"] =>
  usePreloaderStore((state) => state.actions);
