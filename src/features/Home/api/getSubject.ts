import http from "@/config/https";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

export type Subject = {
  id: number;
  STATUS: string;
  CODE: string;
  NAME: string;
  PUBLICATION_ID: number;
};

type Props = {
  parentValue: string;
};

const getSubjectFn = ({
  parentValue,
}: Props): Promise<AxiosResponse<[Subject]>> => {
  const params = {
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
    select: ({ data }) => data,
  });
};
