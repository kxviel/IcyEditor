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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQuestionBuilderStore } from "@/store/useQuestionBuilderStore";
import { useAuthStore } from "@/store/useAuthStore";

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
  handleChapters: (chapterId: string, chapterName: string) => void;
  handleSelectAll: () => void;
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
  handleChapters,
  handleSelectAll,
}: Props) => {
  const navigate = useNavigate();
  const getUser = useAuthStore((state) => state.getUser);
  const chapterNames = useQuestionBuilderStore((state) => state.chapterNames);

  const user = getUser();
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
        ) : (
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
                  isDisabled={
                    (user && user.RESTRICTED_ACCESS > 0) ||
                    publication.isPending
                  }
                  isModal={true}
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
                  isDisabled={
                    (user && user.RESTRICTED_ACCESS > 0) ||
                    series.isPending ||
                    !form.watch("publicationId")
                  }
                  isModal={true}
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
                  isModal={true}
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
                  isModal={true}
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
                  isModal={true}
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
                            className="flex w-full items-center justify-start hover:bg-slate-50"
                          >
                            {chapterNames.length > 0 ? (
                              <p className="truncate font-normal text-black">
                                {chapterNames.map((name) => `'${name},'`)}
                              </p>
                            ) : (
                              <p className="truncate font-light text-slate-600">
                                Select Chapter
                              </p>
                            )}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="custom_scrollbar max-h-56 w-56">
                          <DropdownMenuCheckboxItem
                            checked={
                              selectedChapterIds.length ===
                              chapters.data?.length
                            }
                            onSelect={(e) => {
                              e.preventDefault();
                              handleSelectAll();
                            }}
                          >
                            {selectedChapterIds.length === chapters.data?.length
                              ? "Deselect All"
                              : "Select All"}
                          </DropdownMenuCheckboxItem>
                          <DropdownMenuSeparator />
                          {chapters.data &&
                            chapters.data.map(({ id, NAME }) => (
                              <DropdownMenuCheckboxItem
                                key={id}
                                checked={selectedChapterIds?.includes(
                                  id.toString(),
                                )}
                                onSelect={(e) => {
                                  e.preventDefault();
                                  handleChapters(id.toString(), NAME);
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
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PaperPrerequisitesModal;
