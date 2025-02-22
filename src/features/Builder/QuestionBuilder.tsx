import { useState } from "react";
import { useGetBook } from "./api/getBook";
import PaperPrerequisitesModal from "./PaperPrerequisitesModal";
import PaperView from "./PaperView";
import QuestionList from "./QuestionList";

const QuestionBuilder = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [subjectId, setSubjectId] = useState(0);

  // Book
  const { data: bookList } = useGetBook(subjectId ? subjectId.toString() : "");

  return (
    <div className="h-full w-full">
      {!isOpen && (
        <div className="flex h-full items-center justify-center">
          <QuestionList bookList={bookList} />
          <PaperView />
        </div>
      )}

      {/* Modal */}
      <PaperPrerequisitesModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        setSubjectId={setSubjectId}
      />
    </div>
  );
};

export default QuestionBuilder;
