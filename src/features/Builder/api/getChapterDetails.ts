import http from "@/config/https";
import { useQueries, useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { chapterDetailsData } from "../data";

export type ChapterDetails = {
  id: number;
  STATUS: null;
  ANSWER_DATA: string;
  CATEGORY_ID: number;
  CHAPTER_ID: number;
  FILE_ID: number;
  QUESTION_DATA: string;
  REASON: null;
  REMARKS: null;
  STAGE: null;
  type: null;
  category_name: string;
};

type FnProps = {
  parentValue: string;
  titleId: number;
};

const getChapterDetailsFn = ({
  parentValue,
  titleId,
}: FnProps): Promise<AxiosResponse<ChapterDetails[]>> => {
  const params = {
    parent_value: parentValue,
    catid: titleId,
  };

  return http.get("/get_chapter", {
    params,
  });
};

type Props = {
  parentValue: string;
  titleIds: number[];
};

export const useGetChapterDetails = ({
  parentValue,
  titleIds,
}: Props): { isPending: boolean; data: ChapterDetails[] } => {
  // return useQueries({
  //   queries: titleIds.map((id) => {
  //     return {
  //       queryKey: ["titleId", parentValue, id],
  //       queryFn: () => getChapterDetailsFn(parentValue, id),
  //       select: ({ data }) => data,
  //     };
  //   }),
  // });

  return {
    isPending: false,
    data: chapterDetailsData,
  };
};
