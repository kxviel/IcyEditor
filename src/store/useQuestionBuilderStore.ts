import { create } from "zustand";

interface QuestionItem {
  id: number;
  value: string;
}

interface HeaderStore {
  fields: QuestionItem[];
  addQuestion: (question: QuestionItem) => void;
  setValue: (id: number, value: string) => void;
}

export const useQuestionBuilderStore = create<HeaderStore>()((set) => ({
  // Initial state for all editable fields
  fields: [],
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
