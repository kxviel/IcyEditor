import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type Props = {
  isBlockerOpen: boolean;
  reset: any;
  proceed: any;
};

const RefreshBlockerModal = ({ isBlockerOpen, reset, proceed }: Props) => {
  return (
    <AlertDialog open={isBlockerOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Reload Page?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to continue? All progress will be lost.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={reset}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={proceed}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default RefreshBlockerModal;
