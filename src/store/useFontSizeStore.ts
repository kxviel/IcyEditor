import { create } from "zustand";

interface FontSizeStore {
  currentFontSize: string;
  setFontSize: (value: string) => void;
}

export const useFontSizeStore = create<FontSizeStore>()((set) => ({
  currentFontSize: "0",
  setFontSize: (value) =>
    set(() => ({
      currentFontSize: value,
    })),
}));
