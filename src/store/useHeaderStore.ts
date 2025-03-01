import { create } from "zustand";

const initialHeaderValues = {
  institutionName: "School Name",
  examName: "Exam Name",
  subjectName: "Subject Name",
  duration: "1hr 30min",
  totalMarks: "100",

  date: "10-05-2024",
  instructions:
    "1. Mobile Phones are not Allowed\n2. Read all the Instructions carefully before attempting Questions.\n3. CO: Course Outcome ; BT: Bloom's Taxonomy ; PM: Partial Marks ; NM : Negative Marks",
};

const initialFieldState = {
  institutionName: {
    placeholder: "SCHOOL NAME",
    value: "SCHOOL NAME",
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
  instructions: {
    value: initialHeaderValues.instructions,
    isEditing: false,
  },
  date: {
    value: initialHeaderValues.date,
    isEditing: false,
  },
};

export interface HeaderItem {
  value: string;
  isEditing: boolean;
  placeholder?: string;
}

interface HeaderStore {
  headerData: Record<string, HeaderItem>;
  setValue: (headerId: string, value: string) => void;
  setIsEditing: (headerId: string, isEditing: boolean) => void;
}

export const useHeaderStore = create<HeaderStore>()((set) => ({
  // Initial state for all editable fields
  headerData: initialFieldState,

  // Set value for any field
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

  // Set editing state for a field while ensuring all other fields are not editing
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
