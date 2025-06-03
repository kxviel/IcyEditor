import { addIndexesToFields } from "@/lib/utils";
import { queryClient } from "@/main";
import { create } from "zustand";
import { persist } from "zustand/middleware";

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
  ANSWER_DATA: string;
  CATEGORY_ID: string;
  CHAPTER_ID: number;

  FILE_ID: string;
  REASON: string | null;
  REMARKS: string | null;
  STAGE: string | null;
  type: string | null;
}

export type IdKey =
  | "publicationId"
  | "seriesId"
  | "classId"
  | "subjectId"
  | "bookId"
  | "chapterIds";

// 👇 Utility: Map serializer for localStorage
const mapStorage = {
  getItem: async (name: string) => {
    const str = localStorage.getItem(name);
    if (!str) return null;
    const data = JSON.parse(str);
    return {
      ...data,
      state: {
        ...data.state,
        fields: new Map(data.state.fields),
      },
    };
  },
  setItem: async (name: string, value: any) => {
    const newValue = {
      ...value,
      state: {
        ...value.state,
        fields: Array.from(value.state.fields.entries()),
      },
    };
    localStorage.setItem(name, JSON.stringify(newValue));
  },
  removeItem: async (name: string) => {
    localStorage.removeItem(name);
  },
};

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
      ANSWER_DATA: string;
      CATEGORY_ID: string;
      CHAPTER_ID: number;

      FILE_ID: string;
      REASON: string | null;
      REMARKS: string | null;
      STAGE: string | null;
      type: string | null;
    },
  ) => void;
  editQuestion: (
    categoryId: string,
    oldQuestionId: number,
    newQuestionId: number,
    newQuestionText: string,
  ) => void;
  sanitizeFields: () => void;
  invalidateRelatedQueries: () => void;
  reset: () => void;
}

export const useQuestionBuilderStore = create<HeaderStore>()(
  persist(
    (set) => ({
      fields: new Map(),
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
          const currentCategory = newFields.get(categoryId);

          if (currentCategory) {
            const currentQuestions = currentCategory.questions;
            const questionExists = currentQuestions.some(
              (q) => q.questionId === addedQuestion.questionId,
            );

            if (questionExists) {
              const updatedQuestions = currentQuestions.filter(
                (q) => q.questionId !== addedQuestion.questionId,
              );

              if (updatedQuestions.length === 0) {
                newFields.delete(categoryId);
              } else {
                newFields.set(categoryId, {
                  ...currentCategory,
                  questions: updatedQuestions,
                });
              }
            } else {
              newFields.set(categoryId, {
                ...currentCategory,
                questions: [...currentQuestions, addedQuestion],
              });
            }
          } else {
            newFields.set(categoryId, {
              categoryId,
              categoryName,
              categoryMarks: "1",
              questions: [addedQuestion],
            });
          }

          return { fields: newFields };
        }),
      editQuestion: (
        categoryId: string,
        oldQuestionId: number,
        newQuestionId: number,
        newQuestionText: string,
      ) =>
        set((state) => {
          const newFields = new Map(state.fields);

          if (newFields.has(categoryId)) {
            const currentCategory = newFields.get(categoryId)!;
            const currentQuestions = currentCategory.questions;

            // Find the question to edit
            const questionIndex = currentQuestions.findIndex(
              (question) => question.questionId === oldQuestionId,
            );

            if (questionIndex !== -1) {
              // Create a new array with the updated question
              const updatedQuestions = [...currentQuestions];
              updatedQuestions[questionIndex] = {
                ...updatedQuestions[questionIndex],
                questionId: newQuestionId,
                questionText: newQuestionText,
              };

              // Update the category with the modified questions array
              newFields.set(categoryId, {
                ...currentCategory,
                questions: updatedQuestions,
              });
            }
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
        useQuestionBuilderStore.persist.clearStorage();
      },
      invalidateRelatedQueries: () => {
        queryClient.invalidateQueries({ queryKey: ["GetPublication"] });
        queryClient.invalidateQueries({ queryKey: ["GetSeries"] });
        queryClient.invalidateQueries({ queryKey: ["GetClass"] });
        queryClient.invalidateQueries({ queryKey: ["GetSubject"] });
        queryClient.invalidateQueries({ queryKey: ["GetBook"] });
        queryClient.invalidateQueries({ queryKey: ["GetChapter"] });
      },
    }),
    {
      name: "question-builder-store",
      storage: mapStorage,
    },
  ),
);
