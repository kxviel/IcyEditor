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
import { useQuestionBuilderStore } from "@/store/useQuestionBuilderStore";
import { UseFormReturn } from "react-hook-form";

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
  isDisabled: boolean;
  options: { value: string; label: string }[];
};

export const ControlledSelect = ({
  form,
  label,
  options,
  isDisabled,
}: Props) => {
  const setIds = useQuestionBuilderStore((state) => state.setIds);
  const setChapterNames = useQuestionBuilderStore(
    (state) => state.setChapterNames,
  );

  return (
    <FormField
      control={form.control}
      name={label}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{labels[label]}</FormLabel>
          <Select
            onValueChange={(value) => {
              if (label === "publicationId") {
                form.resetField("seriesId");
                setIds("seriesId", "");

                form.resetField("classId");
                setIds("classId", "");

                form.resetField("subjectId");
                setIds("subjectId", "");

                form.resetField("bookId");
                setIds("bookId", "");

                form.resetField("chapterIds");
                setIds("chapterIds", []);
                setChapterNames([]);
              } else if (label === "seriesId") {
                form.resetField("classId");
                setIds("classId", "");

                form.resetField("subjectId");
                setIds("subjectId", "");

                form.resetField("bookId");
                setIds("bookId", "");

                form.resetField("chapterIds");
                setIds("chapterIds", []);
                setChapterNames([]);
              } else if (label === "classId") {
                form.resetField("subjectId");
                setIds("subjectId", "");

                form.resetField("bookId");
                setIds("bookId", "");

                form.resetField("chapterIds");
                setIds("chapterIds", []);
                setChapterNames([]);
              } else if (label === "subjectId") {
                form.resetField("bookId");
                setIds("bookId", "");

                form.resetField("chapterIds");
                setIds("chapterIds", []);
                setChapterNames([]);
              } else if (label === "bookId") {
                form.resetField("chapterIds");
                setIds("chapterIds", []);
                setChapterNames([]);
              }
              field.onChange(value);
            }}
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
  );
};
