import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useNavigate } from "@tanstack/react-router";
import {
  Form,
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
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Subject } from "./api/getSubject";
import { Class } from "./api/getClass";
import { Series } from "./api/getSeries";
import { Publication } from "./api/getPublication";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { UseQueryResult } from "@tanstack/react-query";
import { PrerequisitesForm } from "./QuestionBuilder";
import { Book } from "./api/getBook";
import { Chapter } from "./api/getChapter";

type Props = {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  publication: UseQueryResult<Publication[], Error>;
  series: UseQueryResult<Series[], Error>;
  classes: UseQueryResult<Class[], Error>;
  subjects: UseQueryResult<Subject[], Error>;
  books: UseQueryResult<Book[], Error>;
  chapters: UseQueryResult<Chapter[], Error>;
  form: UseFormReturn<PrerequisitesForm, any, undefined>;
  onPrequisitesSubmit: (data: PrerequisitesForm) => void;
  modalView: "prereq" | "autogen";
  isAuto: boolean;
};

const PaperPrerequisitesModal = ({
  isModalOpen,
  setIsModalOpen,
  publication,
  series,
  classes,
  subjects,
  books,
  chapters,
  form,
  onPrequisitesSubmit,
  modalView,
}: Props) => {
  const navigate = useNavigate();

  // const { data: questionList } = useGetQuestionList(
  //   form.getValues("chapterId"),
  // );

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent
        className="md:w-[596px]"
        onEscapeKeyDown={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
        showClose={false}
      >
        {publication.isPending ? (
          <div className="flex items-center justify-center">
            <VisuallyHidden>
              <DialogTitle>Select Subject and Proceed</DialogTitle>
            </VisuallyHidden>
            <p>Loading...</p>
          </div>
        ) : modalView === "prereq" ? (
          <div className="flex flex-col space-y-4">
            <DialogTitle>Select Subject and Proceed</DialogTitle>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onPrequisitesSubmit)}
                className="grid w-full grid-cols-2 gap-4"
              >
                <ControlledSelect
                  form={form}
                  label="publicationId"
                  options={
                    publication.data
                      ? publication.data.map((option) => ({
                          value: option.id?.toString(),
                          label: option.NAME,
                        }))
                      : []
                  }
                  isDisabled={publication.isPending}
                />
                <ControlledSelect
                  form={form}
                  label="seriesId"
                  options={
                    series.data
                      ? series.data.map(({ id, NAME }) => ({
                          value: id.toString(),
                          label: NAME,
                        }))
                      : []
                  }
                  isDisabled={series.isPending || !form.watch("publicationId")}
                />
                <ControlledSelect
                  form={form}
                  label="classId"
                  options={
                    classes.data
                      ? classes.data.map(({ id, NAME }) => ({
                          value: id.toString(),
                          label: NAME,
                        }))
                      : []
                  }
                  isDisabled={classes.isPending || !form.watch("seriesId")}
                />
                <ControlledSelect
                  form={form}
                  label="subjectId"
                  options={
                    subjects.data
                      ? subjects.data.map(({ id, NAME }) => ({
                          value: id.toString(),
                          label: NAME,
                        }))
                      : []
                  }
                  isDisabled={subjects.isPending || !form.watch("classId")}
                />
                <ControlledSelect
                  form={form}
                  label="bookId"
                  options={
                    books.data
                      ? books.data.map(({ id, NAME }) => ({
                          value: id.toString(),
                          label: NAME,
                        }))
                      : []
                  }
                  isDisabled={books.isPending || !form.watch("classId")}
                />
                <ControlledSelect
                  form={form}
                  label="chapterId"
                  options={
                    chapters.data
                      ? chapters.data.map(({ id, NAME }) => ({
                          value: id.toString(),
                          label: NAME,
                        }))
                      : []
                  }
                  isDisabled={chapters.isPending || !form.watch("classId")}
                />

                <Button
                  variant={"outline"}
                  className="w-full"
                  onClick={() => {
                    navigate({ to: "/exam-type" }).finally(() => {
                      setIsModalOpen(false);
                    });
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={!form.formState.isValid}
                >
                  Submit
                </Button>
              </form>
            </Form>
          </div>
        ) : (
          <div className="flex flex-col space-y-4">
            <DialogTitle>Select Subject and Proceed</DialogTitle>
            <div></div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PaperPrerequisitesModal;

const labels = {
  publicationId: "Publication",
  seriesId: "Series",
  classId: "Class",
  subjectId: "Subject",
  bookId: "Book",
  chapterId: "Chapter",
};

type ControlledSelectProps = {
  form: UseFormReturn<PrerequisitesForm, any, undefined>;
  label:
    | "publicationId"
    | "seriesId"
    | "classId"
    | "subjectId"
    | "bookId"
    | "chapterId";
  isDisabled: boolean;
  options: { value: string; label: string }[];
};

const ControlledSelect = ({
  form,
  label,
  options,
  isDisabled,
}: ControlledSelectProps) => {
  return (
    <FormField
      control={form.control}
      name={label}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{labels[label]}</FormLabel>
          <Select
            onValueChange={field.onChange}
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
