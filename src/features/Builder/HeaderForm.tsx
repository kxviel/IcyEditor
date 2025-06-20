import { ControlledSelect } from "./shared/ControlledSelect";
import { useAuthStore } from "@/store/useAuthStore";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useQuestionBuilderStore } from "@/store/useQuestionBuilderStore";
import { Label } from "@/components/ui/label";
import { UseQueryResult } from "@tanstack/react-query";
import { Book } from "./api/getBook";
import { Chapter } from "./api/getChapter";
import { Class } from "./api/getClass";
import { Publication } from "./api/getPublication";
import { Series } from "./api/getSeries";
import { Subject } from "./api/getSubject";

type Props = {
  publication: UseQueryResult<Publication[], Error>;
  series: UseQueryResult<Series[], Error>;
  classes: UseQueryResult<Class[], Error>;
  subjects: UseQueryResult<Subject[], Error>;
  books: UseQueryResult<Book[], Error>;
  chapters: UseQueryResult<Chapter[], Error>;
  handleChapters: (chapterId: string, chapterName: string) => void;
  handleSelectAll: () => void;
};

const HeaderForm = ({
  publication,
  series,
  classes,
  subjects,
  books,
  chapters,
  handleChapters,
  handleSelectAll,
}: Props) => {
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
  } = useQuestionBuilderStore();

  return (
    <form className="justify-centr flex flex-col gap-6 bg-white px-8 py-6">
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
            (user && user.RESTRICTED_ACCESS > 0) || publication.isPending
          }
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
    </form>
  );
};

export default HeaderForm;
