import { useEffect, useState } from "react";
import { useGetBook } from "./api/getBook";
import PaperPrerequisitesModal from "./PaperPrerequisitesModal";
import PaperView from "./PaperView";
import QuestionList from "./QuestionList";
import { useGetChapter } from "./api/getChapter";
import { useQuestionBuilderStore } from "@/store/useQuestionBuilderStore";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBlocker } from "@tanstack/react-router";
import RefreshBlockerModal from "./RefreshBlockerModal";

const QuestionBuilder = () => {
  const [bookId, setBookId] = useState("");
  const [isOpen, setIsOpen] = useState(true);
  const [subjectId, setSubjectId] = useState(0);
  const [fieldNames, setFieldNames] = useState({
    publicationName: "",
    seriesName: "",
    className: "",
    subjectName: "",
  });

  const { proceed, reset, status } = useBlocker({
    shouldBlockFn: () => true,
    withResolver: true,
  });

  const setChapterId = useQuestionBuilderStore((state) => state.setChapterId);
  const chapterId = useQuestionBuilderStore((state) => state.chapterId);

  // Book
  const { data: bookList } = useGetBook(subjectId ? subjectId.toString() : "");
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

  return (
    <div className="h-full w-full">
      {!isOpen && (
        <div className="flex h-full items-center justify-center">
          <div className="flex h-full w-1/2 flex-col">
            {/* Header */}
            <div className="justify-centr flex flex-col gap-6 bg-white px-8 py-6">
              <div className="grid w-full grid-cols-2 gap-4">
                <div>
                  <Label>Publication</Label>
                  <p>{fieldNames.publicationName || "-"}</p>
                </div>
                <div>
                  <Label>Series</Label>
                  <p>{fieldNames.seriesName || "-"}</p>
                </div>
                <div>
                  <Label>Class</Label>
                  <p>{fieldNames.className || "-"}</p>
                </div>
                <div>
                  <Label>Subject</Label>
                  <p>{fieldNames.subjectName || "-"}</p>
                </div>
                <div>
                  <Select
                    onValueChange={setBookId}
                    defaultValue={""}
                    value={bookId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Books" />
                    </SelectTrigger>
                    <SelectContent>
                      {bookList
                        ? bookList.map((book) => (
                            <SelectItem
                              key={book.id}
                              value={book.id.toString()}
                            >
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
                            <SelectItem
                              key={chapter.id}
                              value={chapter.id.toString()}
                            >
                              {chapter.NAME}
                            </SelectItem>
                          ))
                        : null}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <QuestionList />
          </div>
          <PaperView />
        </div>
      )}

      {/* Modal */}
      <PaperPrerequisitesModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        setSubjectId={setSubjectId}
        setFieldNames={setFieldNames}
      />

      {status === "blocked" && (
        <RefreshBlockerModal
          isBlockerOpen={status === "blocked"}
          reset={reset}
          proceed={proceed}
        />
      )}
    </div>
  );
};

export default QuestionBuilder;
