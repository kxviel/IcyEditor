import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useModalStore } from "@/store/useModalStore";
import { useQuestionBuilderStore } from "@/store/useQuestionBuilderStore";
import { useState } from "react";

type Props = {
  isOpen: boolean;
  categoryId: string;
  currentMarks: string;
};

export function EditCategoryMarksModal({
  isOpen,
  categoryId,
  currentMarks,
}: Props) {
  const hideModal = useModalStore((state) => state.hideModal);
  const addCategoryMarks = useQuestionBuilderStore(
    (state) => state.addCategoryMarks,
  );

  const [marks, setMarks] = useState(currentMarks);

  const handeSaveChanges = () => {
    addCategoryMarks(categoryId, marks);
    hideModal();
  };

  return (
    <Dialog open={isOpen} onOpenChange={hideModal}>
      <DialogContent className="max-w-[278px]">
        <DialogHeader>
          <DialogTitle>Edit Marks Distribution</DialogTitle>
        </DialogHeader>
        <div className="">
          <Input value={marks} onChange={(e) => setMarks(e.target.value)} />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={hideModal}>
            Cancel
          </Button>
          <Button onClick={handeSaveChanges}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
