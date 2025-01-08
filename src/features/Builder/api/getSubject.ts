import http from "@/config/https";
import { useQuery } from "@tanstack/react-query";

type Props = {
  parentValue: string;
};

const getSubjectFn = ({ parentValue }: Props) => {
  let params: any = {
    type: "load_subject",
    parent_value: parentValue,
  };

  return http.get("/get_data", {
    params,
  });
};

export const useGetSubject = ({ parentValue }: Props) => {
  return useQuery({
    queryKey: ["GetSubject", parentValue],
    queryFn: () => getSubjectFn({ parentValue }),
    select: ({ data }) => data.data,
  });
};
