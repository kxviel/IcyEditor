import { useQuestionBuilderStore } from "@/store/useQuestionBuilderStore";
import { chapters } from "./data";
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
  books: Book[];
};

const QuestionList = ({ books }: Props) => {
  const [bookId, setBookId] = useState("");
  const [chapterId, setChapterId] = useState("");
  const fields = useQuestionBuilderStore((state) => state.fields);
  const addQuestion = useQuestionBuilderStore((state) => state.addQuestion);

  useEffect(() => {
    if (books.length > 0) setBookId(books[0].id.toString());
  }, [books]);

  // Book
  const { data: chapterList, isPending: isChapterPending } = useGetChapter({
    parentValue: bookId,
  });

  //Question Titles
  const { data: questionTitleList, isPending: isQuestionTitlePending } =
    useGetQuestionTitles({
      parentValue: chapterId,
    });

  //Questions
  const { data: questionList, isPending: isQuestionPending } =
    useGetChapterDetails({
      parentValue: chapterId,
      titleIds: questionTitleList?.map((t) => t.id),
    });

  return (
    <div className="flex h-full w-1/2 flex-col px-6">
      <div className="flex items-center justify-center gap-6 bg-white px-4 py-6">
        <Select onValueChange={setBookId} defaultValue={""} value={bookId}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Books" />
          </SelectTrigger>
          <SelectContent>
            {books.map((book) => (
              <SelectItem value={book.id.toString()}>{book.NAME}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          onValueChange={setChapterId}
          defaultValue={""}
          value={chapterId}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Chapters" />
          </SelectTrigger>
          <SelectContent>
            {chapterList.map((chapter) => (
              <SelectItem value={chapter.id.toString()}>
                {chapter.NAME}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="custom_scrollbar flex flex-col gap-2 overflow-y-scroll">
        {questionTitleList.map((chapter) => (
          <div key={chapter.id} className="">
            <p className="font-semibold">{chapter.category_name}</p>

            {questionList
              .filter((q) => q.CATEGORY_ID === chapter.id)
              .map((question) => (
                <div
                  key={chapter.id}
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
