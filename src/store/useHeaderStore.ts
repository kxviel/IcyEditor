import { create } from "zustand";

const initialHeaderValues = {
  institutionName: "Click to Edit Institution Name",
  examName: "Click for Edit Exam/Session Name",
  courseName: "Click for Course Name",
  subjectName: "Click for Subject Name",
  duration: "1hr 30min",
  date: "10-05-2024",
  totalMarks: "100",
  instructions:
    "1. Mobile Phones are not Allowed\n2. Read all the Instructions carefully before attempting Questions.\n3. CO: Course Outcome ; BT: Bloom's Taxonomy ; PM: Partial Marks ; NM : Negative Marks",
};

const initialFieldState = {
  institutionName: {
    value: initialHeaderValues.institutionName,
    isEditing: false,
  },
  examName: {
    value: initialHeaderValues.examName,
    isEditing: false,
  },
  courseName: {
    value: initialHeaderValues.courseName,
    isEditing: false,
  },
  subjectName: {
    value: initialHeaderValues.subjectName,
    isEditing: false,
  },
  duration: {
    value: initialHeaderValues.duration,
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
  totalMarks: {
    value: initialHeaderValues.totalMarks,
    isEditing: false,
  },
};

interface HeaderItem {
  value: string;
  isEditing: boolean;
}

interface HeaderStore {
  fields: Record<string, HeaderItem>;
  setValue: (fieldId: string, value: string) => void;
  setIsEditing: (fieldId: string, isEditing: boolean) => void;
}

export const useHeaderStore = create<HeaderStore>()((set) => ({
  // Initial state for all editable fields
  fields: initialFieldState,

  // Set value for any field
  setValue: (fieldId, value) =>
    set((state) => ({
      fields: {
        ...state.fields,
        [fieldId]: {
          ...state.fields[fieldId],
          value,
        },
      },
    })),

  // Set editing state for a field while ensuring all other fields are not editing
  setIsEditing: (fieldId, isEditing) =>
    set((state) => ({
      fields: Object.keys(state.fields).reduce(
        (acc, key) => ({
          ...acc,
          [key]: {
            ...state.fields[key],
            isEditing: key === fieldId ? isEditing : false,
          },
        }),
        {},
      ),
    })),
  reset: () => {
    set({
      fields: initialFieldState,
    });
  },
}));
