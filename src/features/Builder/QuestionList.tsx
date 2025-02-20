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
import { useGetQuestionList } from "./api/getQuestionTitles";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

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

  // Chapters
  const { data: chapterList, isPending: isChapterPending } =
    useGetChapter(bookId);

  useEffect(() => {
    if (chapterList && chapterList.length > 0) {
      setChapterId(chapterList[0].id);
    }
  }, [chapterList, setChapterId]);

  //Question Titles
  const { data: questionList } = useGetQuestionList(
    chapterId ? chapterId.toString() : "",
  );

  console.log(questionList);

  // //Questions
  // const { data: questionList } = useGetChapterDetails({
  //   parentValue: chapterId ? chapterId.toString() : "",
  //   titleIds: questionTitleList?.map((t) => t.id),
  // });

  return (
    <div className="flex h-full w-1/2 flex-col px-6">
      {/* List Header */}
      <div className="justify-centr flex flex-col gap-6 bg-white px-4 py-6">
        <div className="grid w-full grid-cols-2 gap-4">
          <div>
            <Label>Publication</Label>
            <p>asffsdgdfhgfs</p>
          </div>
          <div>
            <Label>Series</Label>
            <p>dfghfdghdfga</p>
          </div>
          <div>
            <Label>Class</Label>
            <p>asdfsdgsdfgsb</p>
          </div>
          <div>
            <Label>Subject</Label>
            <p>dfgdfgdga</p>
          </div>
          <div>
            <Select onValueChange={setBookId} defaultValue={""} value={bookId}>
              <SelectTrigger>
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
          </div>
          <div>
            <Select
              onValueChange={(v) => setChapterId(Number(v))}
              defaultValue={""}
              value={chapterId ? chapterId.toString() : ""}
              disabled={isChapterPending}
            >
              <SelectTrigger>
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
        </div>
      </div>

      {/* List */}
      <div className="custom_scrollbar flex flex-col gap-2 overflow-y-scroll">
        {questionList?.categories?.map((category) => (
          <div key={category.categoryId} className="">
            <p className="my-2 font-semibold">{category.categoryName}</p>

            {category.questions
              .filter((q) => q.CATEGORY_ID === category.categoryId)
              .map((question) => (
                <div
                  key={question.id}
                  className="flex items-center gap-2 border-b border-gray-100 bg-white p-4 hover:cursor-pointer hover:bg-white/50"
                  onClick={() =>
                    addQuestion({
                      id: question.id,
                      value: question.QUESTION_DATA,
                    })
                  }
                >
                  <Checkbox
                    className="border-slate-400"
                    checked={fields.some((f) => f.id === question.id)}
                  />
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
