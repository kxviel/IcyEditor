import http from "@/config/https";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

export type Book = {
  id: number;
  STATUS: string | null;
  NAME: string;
  SUBJECT_ID: number;
};

type Props = {
  parentValue: string;
};
const getBookFn = ({ parentValue }: Props): Promise<AxiosResponse<Book[]>> => {
  const params = {
    type: "load_book",
    parent_value: parentValue,
  };

  return http.get("/get_data", {
    params,
  });
};

export const useGetBook = ({
  parentValue,
}: Props): { isPending: boolean; data: Book[] } => {
  // return useQuery({
  //   queryKey: ["GetBook", parentValue],
  //   queryFn: () => getBookFn({ parentValue }),
  //   select: ({ data }) => data,
  // });

  if (parentValue) {
    return {
      isPending: false,
      data: [
        { id: 171, STATUS: null, NAME: "I Can Do Math-6", SUBJECT_ID: 172 },
        { id: 172, STATUS: null, NAME: "I Cannot Do Math-6", SUBJECT_ID: 173 },
      ],
    };
  } else {
    return {
      isPending: false,
      data: [],
    };
  }
};
