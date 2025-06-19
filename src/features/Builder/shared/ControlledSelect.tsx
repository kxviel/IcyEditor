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
import { useRef, useState } from "react";
import { useHeaderStore } from "@/store/useHeaderStore";
import { usePageSettingsStore } from "@/store/usePageSettingsStore";

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
  form: UseFormReturn<PrerequisitesForm, any>;
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
  const setHeaderValue = useHeaderStore((state) => state.setHeaderValue);
  const resetBuilder = useQuestionBuilderStore((state) => state.reset);
  const resetPageSettings = usePageSettingsStore((state) => state.reset);
  const setChapterNames = useQuestionBuilderStore(
    (state) => state.setChapterNames,
  );

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingValue, setPendingValue] = useState<string | null>(null);

  // Track if this is the initial render/population
  const hasUserInteracted = useRef(false);
  const currentValue = form.watch(label);

  const handleValueChange = (value: string) => {
    // Mark that user has interacted with the component
    hasUserInteracted.current = true;

    if (label === "classId") {
      const curr = options.filter((option) => option.value === value);
      setHeaderValue("className", curr?.[0]?.label || "");
    }

    if (label === "subjectId") {
      const curr = options.filter((option) => option.value === value);
      setHeaderValue("subjectName", curr?.[0]?.label || "");
    }

    // Check if we need confirmation:
    // - Skip confirmation if it's a modal
    // - Skip confirmation if no fields exist yet
    // - Skip confirmation if this is the first user interaction and field was empty
    const shouldConfirm =
      !isModal &&
      fields.size > 0 &&
      hasUserInteracted.current &&
      currentValue &&
      currentValue !== value;

    if (shouldConfirm) {
      setPendingValue(value);
      setIsConfirmOpen(true);
    } else {
      // No confirmation needed, so apply with reset
      applyValueChange(value, true);
    }
  };

  const applyValueChange = (value: string, shouldReset: boolean = true) => {
    // Set selected value
    setIds(label, value);
    form.setValue(label, value);

    // Reset dependent fields
    FIELD_DEPENDENCIES[label].forEach(({ idKey, resetValue }) => {
      form.resetField(idKey);
      setIds(idKey, resetValue);

      if (idKey === "chapterIds") {
        setChapterNames([]);
      }
    });

    // Only reset builder state, page settings, and form when confirmed or no confirmation needed
    if (shouldReset) {
      resetBuilder();
      resetPageSettings();

      // Clear any cached/optimized data
      localStorage.removeItem("optimized");
    }
  };

  const handleConfirm = () => {
    if (pendingValue !== null) {
      // User confirmed, apply with reset
      applyValueChange(pendingValue, true);
      setPendingValue(null);
    }
    setIsConfirmOpen(false);
  };

  const handleCancel = () => {
    // User cancelled, don't change anything
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
              value={field.value}
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
      {!isModal && isConfirmOpen && (
        <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Change</AlertDialogTitle>
              <AlertDialogDescription>
                Changing this {labels[label]} will reset all dependent fields
                and clear selected questions. Are you sure you want to continue?
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
