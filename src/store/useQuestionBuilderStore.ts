import { addIndexesToFields } from "@/lib/utils";
import { create } from "zustand";

export type Fieldtype = Map<string, CategoryItem>;

export interface CategoryItem {
  categoryId: string;
  categoryName: string;
  questions: QuestionItem[];
  categoryMarks: string;
  categoryIndex?: number;
}

export interface QuestionItem {
  questionId: number;
  questionText: string;
  questionIndex?: number;
}

export type IdKey =
  | "publicationId"
  | "seriesId"
  | "classId"
  | "subjectId"
  | "bookId"
  | "chapterIds";

interface HeaderStore {
  fields: Fieldtype;
  publicationId: string;
  seriesId: string;
  classId: string;
  subjectId: string;
  bookId: string;
  chapterIds: string[];
  chapterNames: string[];
  setIds: (idKey: IdKey, value: string | string[]) => void;
  setChapterNames: (names: string[]) => void;
  presetFields: (fields: Fieldtype) => void;
  addCategoryMarks: (categoryId: string, categoryMarks: string) => void;
  addQuestion: (
    categoryId: string,
    categoryName: string,
    addedQuestion: {
      questionId: number;
      questionText: string;
    },
  ) => void;
  sanitizeFields: () => void;
  reset: () => void;
}

export const useQuestionBuilderStore = create<HeaderStore>()((set) => ({
  fields: new Map(),
  // fields: tempFields,
  publicationId: "",
  seriesId: "",
  classId: "",
  subjectId: "",
  bookId: "",
  chapterIds: [],
  chapterNames: [],
  setIds: (idKey, value) => set(() => ({ [idKey]: value })),
  setChapterNames: (names) => set(() => ({ chapterNames: names })),
  presetFields: (fields) => set(() => ({ fields })),
  addCategoryMarks: (categoryId, categoryMarks) =>
    set((state) => {
      const newFields = new Map(state.fields);

      if (newFields.has(categoryId)) {
        const currentCategory = newFields.get(categoryId)!;

        // Add Question to Existing Category
        newFields.set(categoryId, {
          ...currentCategory,
          categoryMarks,
        });
      }

      return { fields: newFields };
    }),
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
          categoryMarks: "1",
          questions: [addedQuestion],
        });
      }

      return { fields: newFields };
    }),
  sanitizeFields: () =>
    set((state) => ({ fields: addIndexesToFields(state.fields) })),
  reset: () => {
    set({
      fields: new Map(),
      publicationId: "",
      seriesId: "",
      classId: "",
      subjectId: "",
      bookId: "",
      chapterIds: [],
    });
  },
}));
