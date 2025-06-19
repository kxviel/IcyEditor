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
    value: "1hr 30min",
    isEditing: false,
  },
  totalMarks: {
    placeholder: "Marks",
    value: "100",
    isEditing: false,
  },
};

export type HeaderData = typeof headerData;

export interface HeaderItem {
  value: string;
  isEditing: boolean;
  placeholder?: string;
}

interface HeaderStore {
  headerData: Record<string, HeaderItem>;
  classNumber: string;
  setClassNumber: (classNumber: string) => void;
  setHeaderValue: (headerId: keyof HeaderData, value: string) => void;
  setIsEditing: (headerId: string, isEditing: boolean) => void;
  presetHeaderData: (headerData: HeaderData) => void;
  reset: () => void;
}

export const useHeaderStore = create<HeaderStore>()(
  immer((set) => ({
    headerData,
    classNumber: "",

    setClassNumber: (classNumber) =>
      set((state) => {
        state.classNumber = classNumber;
      }),

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
          state.headerData[key].isEditing = false;
        });
        // Then set the target field to the desired editing state
        state.headerData[headerId].isEditing = isEditing;
      }),

    reset: () =>
      set((state) => {
        state.headerData = headerData;
        state.classNumber = "";
      }),
  })),
);
