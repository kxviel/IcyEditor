import { useState } from "react";
import { useGetBook } from "./api/getBook";
import PaperPrerequisitesModal from "./PaperPrerequisitesModal";
import PaperView from "./PaperView";
import QuestionList from "./QuestionList";

const QuestionBuilder = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [subjectId, setSubjectId] = useState(0);

  // Book
  const { data: bookList } = useGetBook(subjectId.toString());

  return (
    <div className="w-full bg-[#F9F5FF]">
      {!isOpen && (
        <div className="mx-auto flex h-[calc(100vh-72px)] max-w-7xl items-center justify-center">
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
