import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Subject } from "../api/getSubject";
import { Class } from "../api/getClass";
import { Series } from "../api/getSeries";
import { Publication } from "../api/getPublication";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Book } from "../api/getBook";
import { Chapter } from "../api/getChapter";
import { ControlledSelect } from "@/features/Builder/shared/ControlledSelect";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQuestionBuilderStore } from "@/store/useQuestionBuilderStore";
import { useAuthStore } from "@/store/useAuthStore";
import { Label } from "@/components/ui/label";
import { UseQueryResult } from "@tanstack/react-query";
import { useEffect } from "react";

type Props = {
  publication: UseQueryResult<Publication[], Error>;
  series: UseQueryResult<Series[], Error>;
  classes: UseQueryResult<Class[], Error>;
  subjects: UseQueryResult<Subject[], Error>;
  books: UseQueryResult<Book[], Error>;
  chapters: UseQueryResult<Chapter[], Error>;
  isModalOpen: boolean;
  handleModalState: (open: boolean) => void;
  onPrequisitesSubmit: () => void;
  handleChapters: (chapterId: string, chapterName: string) => void;
  handleSelectAll: () => void;
};

const PaperPrerequisitesModal = ({
  publication,
  series,
  classes,
  subjects,
  books,
  chapters,
  isModalOpen,
  handleModalState,
  handleSelectAll,
  handleChapters,
  onPrequisitesSubmit,
}: Props) => {
  const navigate = useNavigate();
  const getUser = useAuthStore((state) => state.getUser);
  const user = getUser();

  const {
    chapterNames,
    publicationId,
    seriesId,
    classId,
    subjectId,
    bookId,
    chapterIds,
    reset,
  } = useQuestionBuilderStore();

  useEffect(() => {
    reset();
  }, [reset]);

  // Check if form is valid (all required fields filled)
  const isFormValid =
    publicationId &&
    seriesId &&
    classId &&
    subjectId &&
    bookId &&
    chapterIds.length > 0;

  return (
    <Dialog open={isModalOpen} onOpenChange={handleModalState}>
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

            <form className="flex flex-col gap-6">
              <div className="grid w-full grid-cols-2 gap-4">
                <ControlledSelect
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
                    !publicationId
                  }
                  isModal={true}
                />

                <ControlledSelect
                  label="classId"
                  options={
                    classes.data
                      ? classes.data.map(({ id, NAME }) => ({
                          value: id.toString(),
                          label: NAME,
                        }))
                      : []
                  }
                  isDisabled={classes.isPending || !seriesId}
                  isModal={true}
                />

                <ControlledSelect
                  label="subjectId"
                  options={
                    subjects.data
                      ? subjects.data.map(({ id, NAME }) => ({
                          value: id.toString(),
                          label: NAME,
                        }))
                      : []
                  }
                  isDisabled={subjects.isPending || !classId}
                  isModal={true}
                />

                <ControlledSelect
                  label="bookId"
                  options={
                    books.data
                      ? books.data.map(({ id, NAME }) => ({
                          value: id.toString(),
                          label: NAME,
                        }))
                      : []
                  }
                  isDisabled={books.isPending || !subjectId}
                  isModal={true}
                />

                <div>
                  <Label>Select Chapter</Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        disabled={chapters.isPending || !bookId}
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
                        onSelect={(e) => {
                          e.preventDefault();
                          handleSelectAll();
                        }}
                      >
                        Select All
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuSeparator />
                      {chapters.data &&
                        chapters.data.map(({ id, NAME }) => (
                          <DropdownMenuCheckboxItem
                            key={id}
                            checked={chapterIds?.includes(id.toString())}
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
                </div>
              </div>

              <div className="grid w-full grid-cols-2 gap-4">
                <Button
                  type="button"
                  variant={"outline"}
                  className="w-full"
                  onClick={() => {
                    navigate({ to: "/exam-type" }).finally(() => {
                      handleModalState(false);
                    });
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={!isFormValid}
                  onClick={onPrequisitesSubmit}
                >
                  Submit
                </Button>
              </div>
            </form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PaperPrerequisitesModal;
