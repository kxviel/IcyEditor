import { create } from "zustand";

interface PageSettingsStore {
  currentFontSize: string;
  headerLayout: string;
  setFontSize: (value: string) => void;
  setHeaderLayout: (value: string) => void;
}

export const usePageSettingsStore = create<PageSettingsStore>()((set) => ({
  currentFontSize: "0",
  headerLayout: "1",
  setFontSize: (currentFontSize) => set(() => ({ currentFontSize })),
  setHeaderLayout: (headerLayout) => set(() => ({ headerLayout })),
}));
