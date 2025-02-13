import { useQuestionBuilderStore } from "@/store/useQuestionBuilderStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Book } from "./api/getBook";
import { useGetChapter } from "./api/getChapter";
import { useEffect, useState } from "react";
import { useGetQuestionTitles } from "./api/getQuestionTitles";
import { useGetChapterDetails } from "./api/getChapterDetails";

type Props = {
  bookList: Book[] | undefined;
};

const QuestionList = ({ bookList }: Props) => {
  const [bookId, setBookId] = useState("");
  const fields = useQuestionBuilderStore((state) => state.fields);
  const chapterId = useQuestionBuilderStore((state) => state.chapterId);
  const addQuestion = useQuestionBuilderStore((state) => state.addQuestion);
  const setChapterId = useQuestionBuilderStore((state) => state.setChapterId);

  useEffect(() => {
    if (bookList && bookList.length > 0) setBookId(bookList[0].id.toString());
  }, [bookList]);

  // Book
  const { data: chapterList, isPending: isChapterPending } =
    useGetChapter(bookId);

  //Question Titles
  const { data: questionTitleList } = useGetQuestionTitles(
    chapterId ? chapterId.toString() : "",
  );

  //Questions
  const { data: questionList } = useGetChapterDetails({
    parentValue: chapterId ? chapterId.toString() : "",
    titleIds: questionTitleList?.map((t) => t.id),
  });

  return (
    <div className="flex h-full w-1/2 flex-col px-6">
      {/* List Header */}
      <div className="flex items-center justify-center gap-6 bg-white px-4 py-6">
        <Select onValueChange={setBookId} defaultValue={""} value={bookId}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Books" />
          </SelectTrigger>
          <SelectContent>
            {bookList
              ? bookList.map((book) => (
                  <SelectItem value={book.id.toString()}>
                    {book.NAME}
                  </SelectItem>
                ))
              : null}
          </SelectContent>
        </Select>

        <Select
          onValueChange={(v) => setChapterId(Number(v))}
          defaultValue={""}
          value={chapterId ? chapterId.toString() : ""}
          disabled={isChapterPending}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Chapters" />
          </SelectTrigger>
          <SelectContent>
            {chapterList
              ? chapterList.map((chapter) => (
                  <SelectItem value={chapter.id.toString()}>
                    {chapter.NAME}
                  </SelectItem>
                ))
              : null}
          </SelectContent>
        </Select>
      </div>

      {/* List */}
      <div className="custom_scrollbar flex flex-col gap-2 overflow-y-scroll">
        {questionTitleList?.map((chapter) => (
          <div key={chapter.id} className="">
            <p className="font-semibold">{chapter.category_name}</p>

            {questionList
              .filter((q) => q.CATEGORY_ID === chapter.id)
              .map((question) => (
                <div
                  key={question.id}
                  className="flex items-center gap-2 border-b border-gray-100 bg-white p-4 hover:cursor-pointer hover:bg-white/50"
                  style={
                    fields.some((f) => f.id === question.id)
                      ? { background: "red" }
                      : {}
                  }
                  onClick={() =>
                    addQuestion({
                      id: question.id,
                      value: question.QUESTION_DATA,
                    })
                  }
                >
                  <p
                    className="text-sm text-gray-500"
                    dangerouslySetInnerHTML={{ __html: question.QUESTION_DATA }}
                  />
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionList;
