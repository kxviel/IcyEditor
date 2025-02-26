import { create } from "zustand";

type Fieldtype = Record<string, CategoryItem>;

interface CategoryItem {
  categoryId: string;
  categoryName: string;
  questions: QuestionItem[];
}

interface QuestionItem {
  questionId: number;
  questionText: string;
}

interface HeaderStore {
  fields: Fieldtype;
  addQuestion: (
    categoryId: string,
    categoryName: string,
    question: QuestionItem,
  ) => void;
  setValue: (id: number, value: string) => void;
}

export const useQuestionBuilderStore = create<HeaderStore>()((set) => ({
  fields: {},
  addQuestion: (categoryId, categoryName, question) =>
    set((state) => {
      if (Object.keys(state.fields).includes(categoryId)) {
        // If category exists
        const existingQuestions = state.fields[categoryId].questions;

        // Check if question already exists in this category
        const questionExists = existingQuestions.some(
          (q) => q.questionId === question.questionId,
        );

        if (questionExists) {
          // If question exists, remove it
          const updatedQuestions = existingQuestions.filter(
            (q) => q.questionId !== question.questionId,
          );

          // If this would make the category empty, remove the entire category
          if (updatedQuestions.length === 0) {
            const newFields = { ...state.fields };
            delete newFields[categoryId];
            return {
              fields: newFields,
            };
          }

          // Otherwise just update the category with fewer questions
          return {
            fields: {
              ...state.fields,
              [categoryId]: {
                ...state.fields[categoryId],
                questions: updatedQuestions,
              },
            },
          };
        } else {
          // If question doesn't exist, add it
          return {
            fields: {
              ...state.fields,
              [categoryId]: {
                ...state.fields[categoryId],
                questions: [...existingQuestions, question],
              },
            },
          };
        }
      } else {
        // If category doesn't exist, create a new category with the question
        return {
          fields: {
            ...state.fields,
            [categoryId]: {
              categoryId,
              categoryName,
              questions: [question],
            },
          },
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
