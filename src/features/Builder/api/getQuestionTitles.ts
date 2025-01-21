import http from "@/config/https";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

export type QuestionTitle = {
  id: number;
  category_name: string;
};

type Props = {
  parentValue: string;
};

const getQuestionTitlesFn = ({
  parentValue,
}: Props): Promise<AxiosResponse<QuestionTitle[]>> => {
  const params = {
    parent_value: parentValue,
  };

  return http.get("/get_category", {
    params,
  });
};

export const useGetQuestionTitles = ({
  parentValue,
}: Props): { isPending: boolean; data: QuestionTitle[] } => {
  // return useQuery({
  //   queryKey: ["GetQuestionTitles", parentValue],
  //   queryFn: () => getQuestionTitlesFn({ parentValue }),
  //   select: ({ data }) => data,
  // });

  if (parentValue) {
    return {
      isPending: false,
      data: [
        {
          id: 17,
          category_name: "Match the following.",
        },
        {
          id: 10983,
          category_name: "Tick ✓ the correct answer. (MCQs)",
        },
        {
          id: 38,
          category_name: "Fill in the blanks using the suitable words.",
        },
        {
          id: 11112,
          category_name: "Answer the following questions in brief.",
        },
        {
          id: 27,
          category_name: "Answer the following questions in detail.",
        },
        {
          id: 11086,
          category_name: "Write 'T' for true and 'F' for false statements.",
        },
      ],
    };
  } else {
    return {
      isPending: false,
      data: [],
    };
  }
};
