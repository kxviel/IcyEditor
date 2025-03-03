import { ExamData } from "@/features/Builder/api/getExamById";
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
};
export function parseExamDataResponse(response: ExamData): ReturnProps {
  const fields: Fieldtype = {};

  response.categories.forEach((category) => {
    fields[category.categoryId] = {
      categoryId: category.categoryId,
      categoryName: category.categoryName,
      questions: category.questions.map((question) => ({
        questionId: question.id,
        questionText: question.QUESTION_DATA,
      })),
    };
  });
  return { fields };
}

export const tempFields = {
  "50": {
    categoryId: "50",
    categoryName: "Tick (✔) the correct option.",
    questions: [
      {
        questionId: 2798,
        questionText:
          "Mrs Jasleen started to walk quickly in the _______________.</p>a.&nbsp;corridor&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;b.&nbsp;classroom",
      },
      {
        questionId: 2796,
        questionText:
          "Mrs Jasleen was looking into her _________________.</p>a.&nbsp;folder&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;b.&nbsp;schedule",
      },
      {
        questionId: 2797,
        questionText:
          "Mrs Jasleen picked up her ____________________ quickly.</p>a.&nbsp;spectacles&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;b.&nbsp;folder",
      },
      {
        questionId: 2799,
        questionText:
          "_____________ was coming from the other side.</p>a.&nbsp;Ruhi&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;b.&nbsp;Ruhan",
      },
      {
        questionId: 2800,
        questionText:
          "Mrs Jasleen was correcting her_______________.</p>a.&nbsp;folder&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;b.&nbsp;spectacles",
      },
      {
        questionId: 2801,
        questionText:
          "Students who were making noise sealed their __________________</p>a.&nbsp;lips&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;b.&nbsp;bags",
      },
      {
        questionId: 2665,
        questionText:
          "Ruhan's _____________________ were growing taller than he did.</p>a.&nbsp;cousins&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;b.&nbsp;relatives",
      },
      {
        questionId: 2666,
        questionText:
          "Ruhan's_______________________ noticed that he was sitting with a dull face.</p>a.&nbsp;mother&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;b.&nbsp;grandmother",
      },
      {
        questionId: 2667,
        questionText:
          "_________________ grandmother went into deep thinking for a few minutes.</p>a.&nbsp;Ruhan's&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;b.&nbsp;Ruhi's",
      },
      {
        questionId: 2668,
        questionText:
          "Mrs Shuchitra could give a concrete solution to Ruhan's _________________.</p>a.&nbsp;problem&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;b.&nbsp;question",
      },
      {
        questionId: 2669,
        questionText:
          "There are some scientific____________________ behind a human body's growth.</p>a.&nbsp;problems&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;b.&nbsp;reasons",
      },
      {
        questionId: 2670,
        questionText:
          "Mrs Shuchitra listened to every detail that _________________ gave her.</p>a.&nbsp;Ruhi&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;b.&nbsp;Ruhan",
      },
    ],
  },
  "621": {
    categoryId: "621",
    categoryName: "Help Ruhi in writing down the  names of private body parts.",
    questions: [
      {
        questionId: 4914,
        questionText:
          "1.&nbsp;m___ut____</p>2.&nbsp;____ut____ck____</p>3.&nbsp;____he____t</p>4.&nbsp;t____ig____",
      },
    ],
  },
  "622": {
    categoryId: "622",
    categoryName:
      'Is it your private body part? Look at the pictures and write " YES " or " NO" for these.',
    questions: [
      {
        questionId: 4915,
        questionText:
          '<p><img alt="" height="200" src="../data/Keylinks/826.png" width="250" /></p><p><img alt="" height="200" src="../data/Keylinks/827.png" width="250" /></p><p><img alt="" height="200" src="../data/Keylinks/828.png" width="250" /></p><p><img alt="" height="200" src="../data/Keylinks/829.png" width="250" /></p><p><img alt="" height="200" src="../data/Keylinks/830.png" width="250" /></p>',
      },
    ],
  },
  "839": {
    categoryId: "839",
    categoryName: "Answer the Following Questions :",
    questions: [
      {
        questionId: 2790,
        questionText:
          "Describe the situation of Mrs Jasleen on Monday morning.",
      },
      {
        questionId: 2792,
        questionText:
          "Describe the conversation that took between Mrs Jasleen and Ruhi in the recess.",
      },
      {
        questionId: 2793,
        questionText:
          "Describe the conversation that look place between Ruhi and Ruhan regarding Mrs Jasleen.",
      },
      {
        questionId: 2791,
        questionText:
          "What happened when Ruhi tried to interact with Mrs Jasleen on Monday morning?",
      },
      {
        questionId: 2794,
        questionText: "How did Jasleen clear Ruhi's doubts?",
      },
      {
        questionId: 2795,
        questionText: "What do you mean by intersex,gender and transgender?",
      },
      {
        questionId: 2672,
        questionText:
          "What Ruhi and Ruhan thought about growing up when they were kids?",
      },
    ],
  },
};
