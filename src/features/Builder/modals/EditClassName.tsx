import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useHeaderStore } from "@/store/useHeaderStore";
import { useModalStore } from "@/store/useModalStore";
import { useState } from "react";

type Props = {
  isOpen: boolean;
  currentClassName: string;
};

export function EditClassNameModal({ isOpen, currentClassName }: Props) {
  const hideModal = useModalStore((state) => state.hideModal);
  const setHeaderValue = useHeaderStore((state) => state.setHeaderValue);

  const [className, setClassName] = useState(currentClassName);

  const handeSaveChanges = () => {
    setHeaderValue("className", className);
    hideModal();
  };

  return (
    <Dialog open={isOpen} onOpenChange={hideModal}>
      <DialogContent className="max-w-[278px]">
        <DialogHeader>
          <DialogTitle>Edit Class Name</DialogTitle>
        </DialogHeader>
        <div>
          <Input
            value={className}
            onChange={(e) => setClassName(e.target.value)}
          />
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
