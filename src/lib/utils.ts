import { AutoGenData } from "@/features/Builder/api/generateQuestions";
import { ExamData } from "@/features/Builder/api/getExamById";
import { HeaderData } from "@/store/useHeaderStore";
import { Fieldtype } from "@/store/useQuestionBuilderStore";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type ReturnProps = {
  fields: Fieldtype;
  headerData: HeaderData;
  ids: {
    publicationId: string;
    seriesId: string;
    classId: string;
    subjectId: string;
    bookId: string;
    chapterIds: string[];
  };
};
export function parseExamDataResponse(response: ExamData): ReturnProps {
  const fields: Fieldtype = new Map();
  const headerData: HeaderData = {
    schoolName: {
      placeholder: "SCHOOL NAME",
      value: response.SCHOOL_NAME,
      isEditing: false,
    },
    className: {
      placeholder: "CLASS NAME",
      value: response.CLASS_NAME,
      isEditing: false,
    },
    examName: {
      placeholder: "EXAMINATION TYPE",
      value: response.EXAM_NAME,
      isEditing: false,
    },
    subjectName: {
      placeholder: "SUBJECT NAME",
      value: response.SUBJECT_NAME,
      isEditing: false,
    },
    duration: {
      placeholder: "Duration",
      value: response.DURATION_MINS.toString(),
      isEditing: false,
    },
    totalMarks: {
      placeholder: "Marks",
      value: response.MARKS.toString(),
      isEditing: false,
    },
  };

  const ids = {
    publicationId: response.PUBLICATIONS.toString(),
    seriesId: response.SERIES.toString(),
    classId: response.examClassId.toString(),
    subjectId: response.subjectId.toString(),
    bookId: response.BOOK.toString(),
    chapterIds: response.CHAPTER_IDS,
  };

  response.categories.forEach((category, categoryIndex) => {
    fields.set(category.categoryId?.toString(), {
      categoryId: category.categoryId?.toString(),
      categoryName: category.categoryName,
      categoryMarks: "1",
      categoryIndex,
      questions: category.questions.map((question, questionIndex) => ({
        ...question,
        questionId: question.id,
        questionIndex,
        questionText: question.QUESTION_DATA,
      })),
    });
  });

  return { fields, headerData, ids };
}

export function parseAutoGenResponse(response: AutoGenData): {
  fields: Fieldtype;
} {
  const fields: Fieldtype = new Map();

  response.categories.forEach((category, categoryIndex) => {
    fields.set(category.categoryId?.toString(), {
      categoryId: category.categoryId?.toString(),
      categoryName: category.categoryName,
      categoryMarks: "1",
      categoryIndex,
      questions: category.questions.map((question, questionIndex) => ({
        ...question,
        questionId: question.id,
        questionIndex,
        questionText: question.QUESTION_DATA,
      })),
    });
  });

  return { fields };
}

export function addIndexesToFields(fields: Fieldtype): Fieldtype {
  const localFields = new Map<string, any>(); // Replace 'any' with your actual field type

  let categoryIndex = 0;
  for (const [key, value] of fields) {
    localFields.set(key, {
      ...value,
      categoryIndex,
      questions: value.questions.map((question, questionIndex) => ({
        ...question,
        questionIndex,
      })),
    });
    categoryIndex++;
  }
  console.log("Fields with indexes added:", localFields);

  return localFields;
}
