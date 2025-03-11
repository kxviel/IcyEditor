import { addIndexesToFields, tempFields } from "@/lib/utils";
import { create } from "zustand";

export type Fieldtype = Map<string, CategoryItem>;

export interface CategoryItem {
  categoryId: string;
  categoryName: string;
  questions: QuestionItem[];
  categoryIndex?: number;
}

export interface QuestionItem {
  questionId: number;
  questionText: string;
  questionIndex?: number;
}

interface HeaderStore {
  fields: Fieldtype;
  presetFields: (fields: Fieldtype) => void;
  addQuestion: (
    categoryId: string,
    categoryName: string,
    addedQuestion: {
      questionId: number;
      questionText: string;
    },
  ) => void;
  sanitizeFields: () => void;
}

export const useQuestionBuilderStore = create<HeaderStore>()((set) => ({
  fields: tempFields,
  // fields: new Map(),
  presetFields: (fields) => set(() => ({ fields })),
  addQuestion: (categoryId, categoryName, addedQuestion) =>
    set((state) => {
      const newFields = new Map(state.fields);

      if (newFields.has(categoryId)) {
        const currentCategory = newFields.get(categoryId)!;
        const currentQuestions = currentCategory.questions;

        // Check if question already exists in this category
        const questionExists = currentQuestions.some(
          (currentQuestion) =>
            currentQuestion.questionId === addedQuestion.questionId,
        );

        if (questionExists) {
          // Remove Existing Question
          const updatedQuestions = currentQuestions.filter(
            (currentQuestion) =>
              currentQuestion.questionId !== addedQuestion.questionId,
          );

          // Delete Category if Question Array is Empty
          if (updatedQuestions.length === 0) {
            newFields.delete(categoryId);
          } else {
            // Update Category with Updated Question Array
            newFields.set(categoryId, {
              ...currentCategory,
              questions: updatedQuestions,
            });
          }
        } else {
          // Add Question to Existing Category
          newFields.set(categoryId, {
            ...currentCategory,
            questions: [...currentQuestions, addedQuestion],
          });
        }
      } else {
        // Add Category along with Added Question
        newFields.set(categoryId, {
          categoryId,
          categoryName,
          questions: [addedQuestion],
        });
      }

      return { fields: newFields };
    }),
  sanitizeFields: () =>
    set((state) => ({ fields: addIndexesToFields(state.fields) })),
}));
