import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useNavigate } from "@tanstack/react-router";
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
import { ControlledSelect } from "@/components/ControlledSelect";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  handleChapters: (chapterId: string) => void;
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
  handleChapters,
}: Props) => {
  const navigate = useNavigate();
  const selectedChapterIds = form.watch("chapterIds");

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

                <FormField
                  control={form.control}
                  name={"chapterIds"}
                  render={() => (
                    <FormItem>
                      <FormLabel>Select Chapter</FormLabel>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            className="flex w-full items-center justify-start font-light text-slate-600 hover:bg-slate-50"
                          >
                            Select Chapter
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="custom_scrollbar max-h-56 w-56">
                          {chapters.data &&
                            chapters.data.map(({ id, NAME }) => (
                              <DropdownMenuCheckboxItem
                                key={id}
                                checked={selectedChapterIds?.includes(
                                  id.toString(),
                                )}
                                onSelect={(e) => {
                                  e.preventDefault();
                                  handleChapters(id.toString());
                                }}
                              >
                                {NAME}
                              </DropdownMenuCheckboxItem>
                            ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </FormItem>
                  )}
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
