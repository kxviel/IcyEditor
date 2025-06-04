import { create } from "zustand";

const initialFieldState = {
  schoolName: {
    placeholder: "SCHOOL NAME",
    value: "SCHOOL NAME",
    isEditing: false,
  },
  className: {
    placeholder: "CLASS NAME",
    value: "CLASS NAME",
    isEditing: false,
  },
  examName: {
    placeholder: "EXAMINATION TYPE",
    value: "EXAMINATION TYPE",
    isEditing: false,
  },
  subjectName: {
    placeholder: "SUBJECT NAME",
    value: "SUBJECT NAME",
    isEditing: false,
  },
  duration: {
    placeholder: "Duration",
    value: "1hr 30min",
    isEditing: false,
  },
  totalMarks: {
    placeholder: "Marks",
    value: "100",
    isEditing: false,
  },
};

export type HeaderData = typeof initialFieldState;

export interface HeaderItem {
  value: string;
  isEditing: boolean;
  placeholder?: string;
}

interface HeaderStore {
  headerData: Record<string, HeaderItem>;
  setValue: (headerId: string, value: string) => void;
  setIsEditing: (headerId: string, isEditing: boolean) => void;
  presetHeaderData: (headerData: HeaderData) => void;
  reset: () => void;
}

export const useHeaderStore = create<HeaderStore>()((set) => ({
  headerData: initialFieldState,
  presetHeaderData: (headerData) => set(() => ({ headerData })),
  setValue: (headerId, value) =>
    set((state) => ({
      headerData: {
        ...state.headerData,
        [headerId]: {
          ...state.headerData[headerId],
          value,
        },
      },
    })),

  setIsEditing: (headerId, value) =>
    set((state) => {
      const updatedHeaderData = { ...state.headerData };

      Object.keys(updatedHeaderData).forEach((key) => {
        updatedHeaderData[key].isEditing = key === headerId ? value : false;
      });

      return { headerData: updatedHeaderData };
    }),

  reset: () => {
    set({
      headerData: initialFieldState,
    });
  },
}));
