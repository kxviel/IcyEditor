import { QuestionData } from "@/features/Builder/api/getQuestions";
import { create } from "zustand";

interface QuestionListStore {
  questionList: QuestionData | undefined;
  setQuestionList: (questionList: QuestionData) => void;
  reset: () => void;
}

export const useQuestionListStore = create<QuestionListStore>()((set) => ({
  questionList: undefined,
  setQuestionList: (questionList) => set(() => ({ questionList })),

  reset: () => {
    set({
      questionList: undefined,
    });
  },
}));
