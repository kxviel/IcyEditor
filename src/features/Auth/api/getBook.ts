import http from "@/config/https";
import { useQuery } from "@tanstack/react-query";

type Props = {
  parentValue: string;
};

const getBookFn = ({ parentValue }: Props) => {
  let params: any = {
    type: "load_book",
    parent_value: parentValue,
  };

  return http.get("/get_data", {
    params,
  });
};

export const useGetBook = ({ parentValue }: Props) => {
  return useQuery({
    queryKey: ["GetBook", parentValue],
    queryFn: () => getBookFn({ parentValue }),
    select: ({ data }) => data.data,
  });
};
