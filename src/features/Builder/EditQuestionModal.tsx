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

type Props = {
  isOpen: boolean;
  content: string;
};

export function EditQuestionModal({ isOpen, content }: Props) {
  const hideModal = useModalStore((state) => state.hideModal);
  return (
    <Dialog open={isOpen} onOpenChange={hideModal}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Edit Question</DialogTitle>
          <DialogDescription>
            Make changes to your question here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="">
          <TextEditor content={content} />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="submit">Save changes</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
