import { ExamData } from "@/features/Builder/api/getExamById";
import { HeaderData } from "@/store/useHeaderStore";
import { Fieldtype } from "@/store/useQuestionBuilderStore";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isObjectEmpty(obj: any) {
  for (const prop in obj) {
    if (Object.hasOwn(obj, prop)) {
      return false;
    }
  }

  return true;
}

type ReturnProps = {
  fields: Fieldtype;
  headerData: HeaderData;
};
export function parseExamDataResponse(response: ExamData): ReturnProps {
  const fields: Fieldtype = {};
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

  response.categories.forEach((category, categoryIndex) => {
    fields[category.categoryId] = {
      categoryId: category.categoryId,
      categoryName: category.categoryName,
      categoryIndex,
      questions: category.questions.map((question, questionIndex) => ({
        questionId: question.id,
        questionIndex,
        questionText: question.QUESTION_DATA,
      })),
    };
  });

  return { fields, headerData };
}

export function addIndexesToFields(fields: Fieldtype): Fieldtype {
  const localFields = { ...fields };

  Object.values(fields).forEach((field, fieldIndex) => {
    localFields[field.categoryId] = {
      ...field,
      categoryIndex: fieldIndex,
      questions: field.questions.map((question, questionIndex) => ({
        ...question,
        questionIndex,
      })),
    };
  });

  return localFields;
}

export const tempFields = {
  "50": {
    categoryId: "50",
    categoryName: "Tick (✔) the correct option.",
    questions: [
      {
        questionId: 2665,
        questionText:
          "Ruhan's _____________________ were growing taller than he did.</p>a.&nbsp;cousins&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;b.&nbsp;relatives",
        questionIndex: 0,
      },
      {
        questionId: 2666,
        questionText:
          "Ruhan's_______________________ noticed that he was sitting with a dull face.</p>a.&nbsp;mother&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;b.&nbsp;grandmother",
        questionIndex: 1,
      },
      {
        questionId: 2667,
        questionText:
          "_________________ grandmother went into deep thinking for a few minutes.</p>a.&nbsp;Ruhan's&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;b.&nbsp;Ruhi's",
        questionIndex: 2,
      },
      {
        questionId: 2668,
        questionText:
          "Mrs Shuchitra could give a concrete solution to Ruhan's _________________.</p>a.&nbsp;problem&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;b.&nbsp;question",
        questionIndex: 3,
      },
      {
        questionId: 2670,
        questionText:
          "Mrs Shuchitra listened to every detail that _________________ gave her.</p>a.&nbsp;Ruhi&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;b.&nbsp;Ruhan",
        questionIndex: 4,
      },
      {
        questionId: 2669,
        questionText:
          "There are some scientific____________________ behind a human body's growth.</p>a.&nbsp;problems&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;b.&nbsp;reasons",
        questionIndex: 5,
      },
    ],
    categoryIndex: 0,
  },
  "472": {
    categoryId: "472",
    categoryName: "Write `T` for true and `F` for false statements.",
    questions: [
      {
        questionId: 2676,
        questionText: "Ruhan's black cloud of diubts started to split.",
        questionIndex: 0,
      },
      {
        questionId: 2677,
        questionText: "Ruhan was confused regarding other physical changes.",
        questionIndex: 1,
      },
      {
        questionId: 2678,
        questionText: "Ruhan sometimes notices the pimples on his face.",
        questionIndex: 2,
      },
      {
        questionId: 2679,
        questionText: "Ruhan feels that his voice has become heavy.",
        questionIndex: 3,
      },
      {
        questionId: 2680,
        questionText: "Every individual's body grows at same pace.",
        questionIndex: 4,
      },
    ],
    categoryIndex: 1,
  },
  "473": {
    categoryId: "473",
    categoryName:
      "Correct and rewrite the wrong statements in your notebook. In case of no change, mark the statement with(Х)",
    questions: [
      {
        questionId: 2681,
        questionText: "Ruhi said,''As we grow up, our eting habit changes''.",
        questionIndex: 0,
      },
      {
        questionId: 2682,
        questionText:
          "Ruhan said,''As we grow up, the colour of our hair changes\".",
        questionIndex: 1,
      },
      {
        questionId: 2683,
        questionText:
          'Sky said,"As we grow up, we started to leave our childhood friends".',
        questionIndex: 2,
      },
      {
        questionId: 2684,
        questionText:
          'Ruhi said,"As we grow up,physical changes take place in our body".',
        questionIndex: 3,
      },
      {
        questionId: 2685,
        questionText: 'Sky said,"As we grow up,we avoid social gatherings".',
        questionIndex: 4,
      },
    ],
    categoryIndex: 2,
  },
  "839": {
    categoryId: "839",
    categoryName: "Answer the Following Questions :",
    questions: [
      {
        questionId: 2671,
        questionText: "Why was Ruhan worried?",
        questionIndex: 0,
      },
      {
        questionId: 2673,
        questionText: "What difference came in Ruhi and Ruhan in the teenage?",
        questionIndex: 1,
      },
      {
        questionId: 2672,
        questionText:
          "What Ruhi and Ruhan thought about growing up when they were kids?",
        questionIndex: 2,
      },
      {
        questionId: 2674,
        questionText: "What did Mrs Shuchitra tell about human body's growth?",
        questionIndex: 3,
      },
      {
        questionId: 2675,
        questionText: "What were the changes that Ruhan noticed in his body?",
        questionIndex: 4,
      },
    ],
    categoryIndex: 3,
  },
};
