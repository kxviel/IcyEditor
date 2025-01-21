import http from "@/config/https";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

export type Chapter = {
  id: number;
  STATUS: string | null;
  NAME: string;
  BOOK_ID: number;
};

type Props = {
  parentValue: string;
};

const getChapterFn = ({
  parentValue,
}: Props): Promise<AxiosResponse<Chapter[]>> => {
  const params = {
    parent_value: parentValue,
  };

  return http.get("/get_chapter", {
    params,
  });
};

export const useGetChapter = ({
  parentValue,
}: Props): { isPending: boolean; data: Chapter[] } => {
  // return useQuery({
  //   queryKey: ["GetChapter", parentValue],
  //   queryFn: () => getChapterFn({ parentValue }),
  //   select: ({ data }) => data,
  // });

  if (parentValue) {
    return {
      isPending: false,
      data: [
        {
          id: 13996,
          STATUS: null,
          BOOK_ID: 171,
          NAME: "Knowing Our Numbers",
        },
        {
          id: 13997,
          STATUS: null,
          BOOK_ID: 171,
          NAME: "Whole Numbers",
        },
        {
          id: 13998,
          STATUS: null,
          BOOK_ID: 171,
          NAME: "Playing With Numbers",
        },
        {
          id: 13999,
          STATUS: null,
          BOOK_ID: 171,
          NAME: "Basic Geometrical Ideas",
        },
        {
          id: 14000,
          STATUS: null,
          BOOK_ID: 171,
          NAME: "Understanding Elementary Shapes",
        },
        {
          id: 14001,
          STATUS: null,
          BOOK_ID: 171,
          NAME: "Integers",
        },
        {
          id: 14002,
          STATUS: null,
          BOOK_ID: 171,
          NAME: "Fractions",
        },
        {
          id: 14003,
          STATUS: null,
          BOOK_ID: 171,
          NAME: "Decimals",
        },
        {
          id: 14004,
          STATUS: null,
          BOOK_ID: 171,
          NAME: "Data Handling",
        },
        {
          id: 14005,
          STATUS: null,
          BOOK_ID: 171,
          NAME: "Mensuration",
        },
        {
          id: 14006,
          STATUS: null,
          BOOK_ID: 171,
          NAME: "Algebra",
        },
        {
          id: 14007,
          STATUS: null,
          BOOK_ID: 171,
          NAME: "Ratio and Proportion",
        },
        {
          id: 14008,
          STATUS: null,
          BOOK_ID: 171,
          NAME: "Symmetry",
        },
        {
          id: 14009,
          STATUS: null,
          BOOK_ID: 171,
          NAME: "Practical Geometry",
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
