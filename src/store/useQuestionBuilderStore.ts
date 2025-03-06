import { addIndexesToFields, tempFields } from "@/lib/utils";
import { create } from "zustand";

export type Fieldtype = Record<string, CategoryItem>;

export interface CategoryItem {
  categoryId: string;
  categoryName: string;
  categoryIndex?: number;
  questions: QuestionItem[];
}

export interface QuestionItem {
  questionId: number;
  questionIndex?: number;
  questionText: string;
}

interface HeaderStore {
  fields: Fieldtype;
  presetFields: (fields: Fieldtype) => void;
  addQuestion: (
    categoryId: string,
    categoryName: string,
    question: {
      questionId: number;
      questionText: string;
    },
  ) => void;
  setValue: (id: number, value: string) => void;
}

export const useQuestionBuilderStore = create<HeaderStore>()((set) => ({
  fields: tempFields,
  presetFields: (fields) => set(() => ({ fields })),
  addQuestion: (categoryId, categoryName, question) =>
    set((state) => {
      // If category exists
      if (Object.keys(state.fields).includes(categoryId)) {
        const currentQuestions = state.fields[categoryId].questions;

        // If question exists in this category
        const questionExists = currentQuestions.some(
          (q) => q.questionId === question.questionId,
        );

        if (questionExists) {
          // If question exists, remove it
          const updatedQuestions = currentQuestions.filter(
            (q) => q.questionId !== question.questionId,
          );

          // If this would make the category empty, remove the entire category
          if (updatedQuestions.length === 0) {
            const newFields = { ...state.fields };
            delete newFields[categoryId];
            return {
              fields: addIndexesToFields(newFields),
            };
          }

          // Otherwise just update the category with fewer questions
          return {
            fields: addIndexesToFields({
              ...state.fields,
              [categoryId]: {
                ...state.fields[categoryId],
                questions: updatedQuestions,
              },
            }),
          };
        } else {
          // If question doesn't exist, add it
          return {
            fields: addIndexesToFields({
              ...state.fields,
              [categoryId]: {
                ...state.fields[categoryId],
                questions: [...currentQuestions, question],
              },
            }),
          };
        }
      } else {
        // If category doesn't exist, create a new category with the question
        return {
          fields: addIndexesToFields({
            ...state.fields,
            [categoryId]: {
              categoryId,
              categoryName,
              questions: [question],
            },
          }),
        };
      }
    }),
  setValue: (fieldId, value) =>
    set((state) => {
      const updatedFields = { ...state.fields };

      Object.keys(updatedFields).forEach((categoryId) => {
        const category = updatedFields[categoryId];
        updatedFields[categoryId] = {
          ...category,
          questions: category.questions.map((q) =>
            q.questionId === fieldId ? { ...q, questionText: value } : q,
          ),
        };
      });

      return { fields: updatedFields };
    }),
}));
