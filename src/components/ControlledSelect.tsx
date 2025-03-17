import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PrerequisitesForm } from "@/features/Builder/QuestionBuilder";
import {
  IdKey,
  useQuestionBuilderStore,
} from "@/store/useQuestionBuilderStore";
import { UseFormReturn } from "react-hook-form";
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
import { useEffect, useState } from "react";
import { useHeaderStore } from "@/store/useHeaderStore";
import { usePageSettingsStore } from "@/store/usePageSettingsStore";
import { queryClient } from "@/main";

const FIELD_DEPENDENCIES: Record<
  string,
  { idKey: IdKey; resetValue: string | string[] }[]
> = {
  publicationId: [
    { idKey: "seriesId", resetValue: "" },
    { idKey: "classId", resetValue: "" },
    { idKey: "subjectId", resetValue: "" },
    { idKey: "bookId", resetValue: "" },
    { idKey: "chapterIds", resetValue: [] },
  ],
  seriesId: [
    { idKey: "classId", resetValue: "" },
    { idKey: "subjectId", resetValue: "" },
    { idKey: "bookId", resetValue: "" },
    { idKey: "chapterIds", resetValue: [] },
  ],
  classId: [
    { idKey: "subjectId", resetValue: "" },
    { idKey: "bookId", resetValue: "" },
    { idKey: "chapterIds", resetValue: [] },
  ],
  subjectId: [
    { idKey: "bookId", resetValue: "" },
    { idKey: "chapterIds", resetValue: [] },
  ],
  bookId: [{ idKey: "chapterIds", resetValue: [] }],
};

const labels = {
  publicationId: "Publication",
  seriesId: "Series",
  classId: "Class",
  subjectId: "Subject",
  bookId: "Book",
};

type Props = {
  form: UseFormReturn<PrerequisitesForm, any, undefined>;
  label: "publicationId" | "seriesId" | "classId" | "subjectId" | "bookId";
  options: { value: string; label: string }[];
  isDisabled: boolean;
  isModal?: boolean;
};

export const ControlledSelect = ({
  form,
  label,
  options,
  isDisabled,
  isModal = false,
}: Props) => {
  const fields = useQuestionBuilderStore((state) => state.fields);
  const setIds = useQuestionBuilderStore((state) => state.setIds);
  const resetHeader = useHeaderStore((state) => state.reset);
  const resetBuilder = useQuestionBuilderStore((state) => state.reset);
  const resetPageSettings = usePageSettingsStore((state) => state.reset);
  const setChapterNames = useQuestionBuilderStore(
    (state) => state.setChapterNames,
  );

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingValue, setPendingValue] = useState<string | null>(null);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // Check if there are unsaved changes
      if (pendingValue !== null) {
        // Standard way to show a confirmation dialog before leaving
        e.preventDefault();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    // Clean up the event listener
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [pendingValue]);

  const handleValueChange = (value: string) => {
    if (isModal || fields.size === 0) {
      applyValueChange(value);
    } else {
      setPendingValue(value);
      setIsConfirmOpen(true);
    }
  };

  const invalidateQueries = () => {
    queryClient.invalidateQueries({ queryKey: ["GetPublication"] });
    queryClient.invalidateQueries({ queryKey: ["GetSeries"] });
    queryClient.invalidateQueries({ queryKey: ["GetClass"] });
    queryClient.invalidateQueries({ queryKey: ["GetSubject"] });
    queryClient.invalidateQueries({ queryKey: ["GetBook"] });
    queryClient.invalidateQueries({ queryKey: ["GetChapter"] });
  };

  const applyValueChange = (value: string) => {
    FIELD_DEPENDENCIES[label].forEach(({ idKey, resetValue }) => {
      form.resetField(idKey);
      setIds(idKey, resetValue);

      resetHeader();
      resetBuilder();
      resetPageSettings();
      invalidateQueries();

      if (idKey === "chapterIds") {
        setChapterNames([]);
      }
    });

    form.setValue(label, value);
  };

  const handleConfirm = () => {
    if (pendingValue !== null) {
      applyValueChange(pendingValue);
      setPendingValue(null);
    }
    setIsConfirmOpen(false);
  };

  const handleCancel = () => {
    setPendingValue(null);
    setIsConfirmOpen(false);
  };

  return (
    <>
      <FormField
        control={form.control}
        name={label}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{labels[label]}</FormLabel>
            <Select
              onValueChange={handleValueChange}
              defaultValue={field.value}
              disabled={isDisabled}
            >
              <FormControl>
                <SelectTrigger
                  className={
                    form.formState.errors[field.name] ? "border-red-100" : ""
                  }
                >
                  <SelectValue placeholder={`Select ${labels[label]}`} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />
      {!isModal && (
        <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Change</AlertDialogTitle>
              <AlertDialogDescription>
                Changing this {labels[label]} will reset all dependent fields.
                Are you sure you want to continue?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={handleCancel}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirm}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
};
