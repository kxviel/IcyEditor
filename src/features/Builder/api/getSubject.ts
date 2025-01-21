import http from "@/config/https";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

export type Subject = {
  id: number;
  STATUS: string | null;
  NAME: string;
  CLASS_ID: number;
};

type Props = {
  parentValue: string;
};

const getSubjectFn = ({
  parentValue,
}: Props): Promise<AxiosResponse<Subject[]>> => {
  const params = {
    type: "load_subject",
    parent_value: parentValue,
  };

  return http.get("/get_data", {
    params,
  });
};

export const useGetSubject = ({
  parentValue,
}: Props): { isPending: boolean; data: Subject[] } => {
  // return useQuery({
  //   queryKey: ["GetSubject", parentValue],
  //   queryFn: () => getSubjectFn({ parentValue }),
  //   select: ({ data }) => data,
  // });

  if (parentValue) {
    return {
      isPending: false,
      data: [
        {
          id: 76,
          STATUS: null,
          CLASS_ID: 14,
          NAME: "Grammar",
        },
        {
          id: 101,
          STATUS: null,
          CLASS_ID: 14,
          NAME: "हिंदी ",
        },
        {
          id: 117,
          STATUS: null,
          CLASS_ID: 14,
          NAME: "हिंदी व्याकरण",
        },
        {
          id: 125,
          STATUS: null,
          CLASS_ID: 14,
          NAME: "Computer",
        },
        {
          id: 142,
          STATUS: null,
          CLASS_ID: 14,
          NAME: "General Knowledge",
        },
        {
          id: 156,
          STATUS: null,
          CLASS_ID: 14,
          NAME: "English",
        },
        {
          id: 172,
          STATUS: null,
          CLASS_ID: 14,
          NAME: "Math",
        },
        {
          id: 185,
          STATUS: null,
          CLASS_ID: 14,
          NAME: "Moral Value",
        },
        {
          id: 193,
          STATUS: null,
          CLASS_ID: 14,
          NAME: "Reasoning",
        },
        {
          id: 209,
          STATUS: null,
          CLASS_ID: 14,
          NAME: "Science",
        },
        {
          id: 217,
          STATUS: null,
          CLASS_ID: 14,
          NAME: "Social Science",
        },
        {
          id: 257,
          STATUS: null,
          CLASS_ID: 14,
          NAME: "Sanskrit",
        },
        {
          id: 261,
          STATUS: null,
          CLASS_ID: 14,
          NAME: "Sanskrit Vyakaran",
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
