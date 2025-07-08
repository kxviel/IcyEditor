import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

const headerData = {
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
    value: "Enter Duration",
    isEditing: false,
  },
  totalMarks: {
    placeholder: "Marks",
    value: "100",
    isEditing: false,
  },
};

export type HeaderData = typeof headerData;
export type HeaderDataKeys = keyof HeaderData;

export interface HeaderItem {
  value: string;
  isEditing: boolean;
  placeholder?: string;
}

interface HeaderStore {
  headerData: Record<HeaderDataKeys, HeaderItem>;
  setHeaderValue: (headerId: HeaderDataKeys, value: string) => void;
  setIsEditing: (headerId: HeaderDataKeys, isEditing: boolean) => void;
  presetHeaderData: (headerData: HeaderData) => void;
  reset: () => void;
}

export const useHeaderStore = create<HeaderStore>()(
  immer((set) => ({
    headerData,

    presetHeaderData: (headerData) =>
      set((state) => {
        state.headerData = headerData;
      }),

    setHeaderValue: (headerId, value) =>
      set((state) => {
        state.headerData[headerId].value = value;
      }),

    setIsEditing: (headerId, isEditing) =>
      set((state) => {
        // Set all fields to not editing first
        Object.keys(state.headerData).forEach((key) => {
          state.headerData[key as HeaderDataKeys].isEditing = false;
        });
        // Then set the target field to the desired editing state
        state.headerData[headerId].isEditing = isEditing;
      }),

    reset: () =>
      set((state) => {
        state.headerData = headerData;
      }),
  })),
);
