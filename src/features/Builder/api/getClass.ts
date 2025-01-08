import http from "@/config/https";
import { useQuery } from "@tanstack/react-query";

type Props = {
  parentValue: string;
};

const getClassFn = ({ parentValue }: Props) => {
  let params: any = {
    type: "load_class",
    parent_value: parentValue,
  };

  return http.get("/get_data", {
    params,
  });
};

export const useGetClass = ({ parentValue }: Props) => {
  return useQuery({
    queryKey: ["GetClass", parentValue],
    queryFn: () => getClassFn({ parentValue }),
    select: ({ data }) => data.data,
  });
};
