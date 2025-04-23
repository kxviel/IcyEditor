import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModalStore } from "@/store/useModalStore";
import TextEditor from "@/components/TextEditor";
import { useSaveNewQuestion } from "../api/saveNewQuestion";
import {
  QuestionItem,
  useQuestionBuilderStore,
} from "@/store/useQuestionBuilderStore";
import { useState } from "react";

type Props = {
  isOpen: boolean;
  currentQuestion: QuestionItem;
};

export function EditQuestionModal({ isOpen, currentQuestion }: Props) {
  const { publicationId, seriesId, classId, bookId } =
    useQuestionBuilderStore();

  const hideModal = useModalStore((state) => state.hideModal);
  const saveNewQuestion = useSaveNewQuestion();

  const [newContent, setNewContent] = useState("");

  const handleHTMLContent = (html: string) => {
    setNewContent(html);
  };

  const handleSubmit = () => {
    saveNewQuestion.mutate({
      questionId: currentQuestion.questionId,
      QUESTION_DATA: newContent,
      ANSWER_DATA: currentQuestion.ANSWER_DATA,
      CATEGORY_ID: Number(currentQuestion.CATEGORY_ID),
      CHAPTER_ID: currentQuestion.CHAPTER_ID,
      FILE_ID: Number(currentQuestion.FILE_ID),
      REASON: currentQuestion.REASON,
      REMARKS: currentQuestion.REMARKS,
      STAGE: currentQuestion.STAGE,
      type: currentQuestion.type,
      BOOK: Number(bookId),
      CLASS_NAME: classId,
      // MARKS_DISTRIBUTION: "MCQ: 1, FIB: 1, SA: 1, GAP: 1, DRAG: 1",
      PUBLICATIONS: publicationId,
      SERIES: seriesId,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={hideModal}>
      <DialogContent className="max-w-[678px]">
        <DialogHeader>
          <DialogTitle>Modify Question</DialogTitle>
          <DialogDescription>
            Note: Changes will be saved as a new Question.
          </DialogDescription>
        </DialogHeader>
        <div className="">
          <TextEditor
            content={currentQuestion.questionText}
            getContent={handleHTMLContent}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={hideModal}>
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={
              newContent === "" || newContent === currentQuestion.questionText
            }
          >
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
