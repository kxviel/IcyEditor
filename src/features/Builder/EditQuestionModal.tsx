import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModalStore } from "@/store/useModalStore";
import TextEditor from "@/components/TextEditor";
import { useSaveNewQuestion } from "./api/SaveNewQuestion";

type Props = {
  isOpen: boolean;
  content: string;
};

export function EditQuestionModal({ isOpen, content }: Props) {
  const hideModal = useModalStore((state) => state.hideModal);
  const saveNewQuestion = useSaveNewQuestion();
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
          <TextEditor content={content} />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" onClick={hideModal}>
              Cancel
            </Button>
            <Button
              type="submit"
              // onClick={() =>
              //   saveNewQuestion.mutate({
              //     body: {
              //       ANSWER_DATA: "The answer to the question",
              //       CATEGORY_ID: 1,
              //       CHAPTER_ID: 10,
              //       FILE_ID: 101,
              //       QUESTION_DATA: "What is the capital of France?",
              //       REASON: "Paris is the capital city of France",
              //       REMARKS: "No remarks",
              //       STAGE: "Stage 1",
              //       type: "MCQ",
              //     },
              //   })
              // }
            >
              Save changes
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
