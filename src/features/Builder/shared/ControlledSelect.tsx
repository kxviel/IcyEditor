import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  IdKey,
  useQuestionBuilderStore,
} from "@/store/useQuestionBuilderStore";
import { useHeaderStore } from "@/store/useHeaderStore";
import { usePageSettingsStore } from "@/store/usePageSettingsStore";
import { Label } from "@/components/ui/label";
import { SelectFormState } from "../QuestionBuilder";

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

type SelectFormStateWithoutChapters = Omit<SelectFormState, "chapterIds">;
type SelectFormStateKeysWithoutChapters = keyof SelectFormStateWithoutChapters;

const labels: Record<SelectFormStateKeysWithoutChapters, string> = {
  publicationId: "Publication",
  seriesId: "Series",
  classId: "Class",
  subjectId: "Subject",
  bookId: "Book",
};

type Props = {
  label: SelectFormStateKeysWithoutChapters;
  options: { value: string; label: string }[];
  isDisabled: boolean;
  isModal?: boolean;
};

export const ControlledSelect = ({ label, options, isDisabled }: Props) => {
  const setHeaderValue = useHeaderStore((state) => state.setHeaderValue);
  const {
    setChapterNames,
    publicationId,
    seriesId,
    classId,
    subjectId,
    bookId,
    setIds,
    resetFields,
  } = useQuestionBuilderStore();
  const resetPageSettings = usePageSettingsStore((state) => state.reset);

  // Get current value from store based on label
  const getCurrentValue = () => {
    switch (label) {
      case "publicationId":
        return publicationId;
      case "seriesId":
        return seriesId;
      case "classId":
        return classId;
      case "subjectId":
        return subjectId;
      case "bookId":
        return bookId;
      default:
        return "";
    }
  };

  const currentValue = getCurrentValue();

  const handleValueChange = (value: string) => {
    // Check if the value is actually different from current value
    const isValueDifferent = currentValue !== value;

    if (!isValueDifferent) {
      return; // No change needed
    }

    // Set the current field value first
    setIds(label as IdKey, value);

    // Update header values for specific fields
    if (label === "classId") {
      const selectedOption = options.find((option) => option.value === value);
      setHeaderValue("className", selectedOption?.label || "");
    }
    if (label === "subjectId") {
      const selectedOption = options.find((option) => option.value === value);
      setHeaderValue("subjectName", selectedOption?.label || "");
    }

    // Reset dependent fields only if they have values
    const dependentFields = FIELD_DEPENDENCIES[label];
    if (dependentFields) {
      let shouldResetPageSettings = false;

      dependentFields.forEach(({ idKey, resetValue }) => {
        // Get current value of the dependent field to check if it has a value
        const currentDependentValue = getCurrentDependentValue(idKey);

        // Only reset if the dependent field currently has a value
        if (hasValue(currentDependentValue)) {
          setIds(idKey, resetValue);
          shouldResetPageSettings = true;
        }
      });

      // Reset chapter names if chapterIds is being reset
      if (dependentFields.some((field) => field.idKey === "chapterIds")) {
        setChapterNames([]);
      }

      // Reset fields and page settings if we actually reset some dependent fields
      if (shouldResetPageSettings) {
        resetFields();
        resetPageSettings();
      }
    }
  };

  // Helper function to get current value of dependent fields
  const getCurrentDependentValue = (idKey: IdKey) => {
    const state = useQuestionBuilderStore.getState();
    switch (idKey) {
      case "publicationId":
        return state.publicationId;
      case "seriesId":
        return state.seriesId;
      case "classId":
        return state.classId;
      case "subjectId":
        return state.subjectId;
      case "bookId":
        return state.bookId;
      case "chapterIds":
        return state.chapterIds;
      default:
        return "";
    }
  };

  // Helper function to check if a value is not empty
  const hasValue = (value: string | string[]) => {
    if (Array.isArray(value)) {
      return value.length > 0;
    }
    return value !== "";
  };

  return (
    <div>
      <Label>{labels[label]}</Label>
      <Select
        onValueChange={handleValueChange}
        value={currentValue}
        disabled={isDisabled}
      >
        <SelectTrigger>
          <SelectValue placeholder={`Select ${labels[label]}`} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
