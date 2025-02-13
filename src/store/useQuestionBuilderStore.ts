import { create } from "zustand";

interface QuestionItem {
  id: number;
  value: string;
}

interface HeaderStore {
  fields: QuestionItem[];
  chapterId: number;
  setChapterId: (chapterId: number) => void;
  addQuestion: (question: QuestionItem) => void;
  setValue: (id: number, value: string) => void;
}

export const useQuestionBuilderStore = create<HeaderStore>()((set) => ({
  // Initial state for all editable fields
  fields: [],
  chapterId: 0,
  setChapterId: (chapterId: number) => set({ chapterId }),
  addQuestion: (question) =>
    set((state) => {
      if (state.fields.some((item) => item.id === question.id)) {
        return {
          fields: state.fields.filter((item) => item.id !== question.id),
        };
      }

      return { fields: [...state.fields, question] };
    }),

  // Set value for any field
  setValue: (fieldId, value) =>
    set((state) => {
      const newFields = state.fields.map((field) => {
        if (field.id === fieldId) {
          return { ...field, value };
        }
        return field;
      });
      return {
        fields: newFields,
      };
    }),
}));
