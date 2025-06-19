import { addIndexesToFields } from "@/lib/utils";
import { queryClient } from "@/main";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { enableMapSet } from "immer";
import { useHeaderStore } from "./useHeaderStore";

// Enable Map and Set support in Immer
enableMapSet();

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

// Helper function to calculate total marks
const calculateTotalMarks = (fields: Fieldtype): number => {
  let totalMarks = 0;
  fields.forEach((category) => {
    const categoryMarks = parseInt(category.categoryMarks) || 0;
    const questionCount = category.questions.length;
    totalMarks += categoryMarks * questionCount;
  });
  return totalMarks;
};

export const useQuestionBuilderStore = create<HeaderStore>()(
  persist(
    immer((set) => ({
      fields: new Map(),
      publicationId: "",
      seriesId: "",
      classId: "",
      subjectId: "",
      bookId: "",
      chapterIds: [],
      chapterNames: [],

      setIds: (idKey, value) =>
        set((state) => {
          state[idKey] = value as any; // Type assertion needed for union type
        }),

      setChapterNames: (names) =>
        set((state) => {
          state.chapterNames = names;
        }),

      presetFields: (fields) =>
        set((state) => {
          state.fields = fields;
        }),

      addCategoryMarks: (categoryId, categoryMarks) =>
        set((state) => {
          const category = state.fields.get(categoryId);
          if (category) {
            category.categoryMarks = categoryMarks;

            // Calculate and update total marks
            const totalMarks = calculateTotalMarks(state.fields);
            useHeaderStore
              .getState()
              .setHeaderValue("totalMarks", `${totalMarks}`);
          }
        }),

      addQuestion: (categoryId, categoryName, addedQuestion) =>
        set((state) => {
          const currentCategory = state.fields.get(categoryId);

          if (currentCategory) {
            const questionExists = currentCategory.questions.some(
              (q) => q.questionId === addedQuestion.questionId,
            );

            if (questionExists) {
              // Remove existing question
              const questionIndex = currentCategory.questions.findIndex(
                (q) => q.questionId === addedQuestion.questionId,
              );
              currentCategory.questions.splice(questionIndex, 1);

              // If no questions left, remove the category
              if (currentCategory.questions.length === 0) {
                state.fields.delete(categoryId);
              }
            } else {
              // Add new question
              currentCategory.questions.push(addedQuestion);
            }
          } else {
            // Create new category with the question
            state.fields.set(categoryId, {
              categoryId,
              categoryName,
              categoryMarks: "1",
              questions: [addedQuestion],
            });
          }

          // Calculate and update total marks
          const totalMarks = calculateTotalMarks(state.fields);
          useHeaderStore
            .getState()
            .setHeaderValue("totalMarks", `${totalMarks}`);
        }),

      editQuestion: (
        categoryId,
        oldQuestionId,
        newQuestionId,
        newQuestionText,
      ) =>
        set((state) => {
          const category = state.fields.get(categoryId);
          if (category) {
            const questionIndex = category.questions.findIndex(
              (question) => question.questionId === oldQuestionId,
            );

            if (questionIndex !== -1) {
              const question = category.questions[questionIndex];
              question.questionId = newQuestionId;
              question.questionText = newQuestionText;
            }
          }
        }),

      sanitizeFields: () =>
        set((state) => {
          state.fields = addIndexesToFields(state.fields);
        }),

      reset: () => {
        set((state) => {
          state.fields = new Map();
          state.publicationId = "";
          state.seriesId = "";
          state.classId = "";
          state.subjectId = "";
          state.bookId = "";
          state.chapterIds = [];
          state.chapterNames = [];
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
    })),
    {
      name: "question-builder-store",
      storage: mapStorage,
    },
  ),
);
