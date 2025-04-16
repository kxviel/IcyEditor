import { useEffect, useState } from "react";
import { useGetBook } from "./api/getBook";
import PaperPrerequisitesModal from "./modals/PaperPrerequisitesModal";
import PaperView from "./PaperView";
import QuestionList from "./QuestionList";
import { useGetChapter } from "./api/getChapter";
import { useGetPublication } from "./api/getPublication";
import { useGetSeries } from "./api/getSeries";
import { useGetClass } from "./api/getClass";
import { useGetSubject } from "./api/getSubject";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useGetExamById } from "./api/getExamById";
import { parseExamDataResponse } from "@/lib/utils";
import { useQuestionBuilderStore } from "@/store/useQuestionBuilderStore";
import { useHeaderStore } from "@/store/useHeaderStore";
import { ControlledSelect } from "@/features/Builder/shared/ControlledSelect";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import QuestionSelect from "./QuestionSelect";
import ChapterList from "./ChapterList";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";

const prequisitesFormSchema = z.object({
  publicationId: z.string(),
  seriesId: z.string(),
  classId: z.string(),
  subjectId: z.string(),
  bookId: z.string(),
  chapterIds: z
    .array(z.string())
    .min(1, { message: "Select at least one chapter" }),
});

export type PrerequisitesForm = z.infer<typeof prequisitesFormSchema>;

type Props = {
  examId: "manual-selection" | "auto-selection" | string;
};

const QuestionBuilder = ({ examId }: Props) => {
  const {
    fields,
    publicationId,
    seriesId,
    classId,
    subjectId,
    bookId,
    chapterIds,
    chapterNames,
    setIds,
    presetFields,
    sanitizeFields,
    setChapterNames,
  } = useQuestionBuilderStore();
  const getUser = useAuthStore((state) => state.getUser);
  const navigate = useNavigate();
  const presetHeaderData = useHeaderStore((state) => state.presetHeaderData);
  const { needPreselection } = useSearch({
    from: "/_auth/builder/$examId",
  }) as { needPreselection: boolean };

  const [isModalOpen, setIsModalOpen] = useState(needPreselection);

  const form = useForm<PrerequisitesForm>({
    resolver: zodResolver(prequisitesFormSchema),
    defaultValues: {
      publicationId,
      seriesId,
      classId,
      subjectId,
      bookId,
      chapterIds,
    },
  });

  const selectedChapterIds = form.watch("chapterIds") || [];
  const publication = useGetPublication();
  const series = useGetSeries(form.watch("publicationId"));
  const classes = useGetClass(form.watch("seriesId"));
  const subjects = useGetSubject(form.watch("classId"));
  const books = useGetBook(form.watch("subjectId"));
  const chapters = useGetChapter(form.watch("bookId"));

  const user = getUser();
  const { data: examData } = useGetExamById(examId);
  const { setValue, getValues } = form; // Just for the sake of the useEffect dependency

  useEffect(() => {
    const user = getUser();
    const isUserRestricted = user && user.RESTRICTED_ACCESS === 0;
    const valuesAlreadySet =
      getValues("publicationId") && getValues("seriesId");

    // For restricted users, always set publication and series IDs
    if (isUserRestricted && !valuesAlreadySet) {
      setIds("publicationId", user.PUBLICATION_ID?.toString());
      setValue("publicationId", user.PUBLICATION_ID?.toString());

      setIds("seriesId", user.SERIES_ID?.toString());
      setValue("seriesId", user.SERIES_ID?.toString());
    }
  }, [getUser, getValues, setIds, setValue]);

  useEffect(() => {
    // Process exam data for both restricted and non-restricted users
    if (!["manual-selection", "auto-selection"].includes(examId) && examData) {
      const parsedObject = parseExamDataResponse(examData);

      // Handle fields and header data
      if (parsedObject.fields) {
        presetFields(parsedObject.fields);
      }

      if (parsedObject.headerData) {
        presetHeaderData(parsedObject.headerData);
      }

      if (parsedObject.ids) {
        setIds("publicationId", parsedObject.ids.publicationId);
        setValue("publicationId", parsedObject.ids.publicationId);

        setIds("seriesId", parsedObject.ids.seriesId);
        setValue("seriesId", parsedObject.ids.seriesId);

        setIds("classId", parsedObject.ids.classId);
        setValue("classId", parsedObject.ids.classId);

        setIds("subjectId", parsedObject.ids.subjectId);
        setValue("subjectId", parsedObject.ids.subjectId);

        setIds("bookId", parsedObject.ids.bookId);
        setValue("bookId", parsedObject.ids.bookId);

        setIds("chapterIds", parsedObject.ids.chapterIds);
        setValue("chapterIds", parsedObject.ids.chapterIds);

        // Set chapter names
        const chapterNameArray: string[] = [];
        chapters.data?.forEach((chapter) => {
          if (parsedObject.ids.chapterIds.includes(chapter.id.toString())) {
            chapterNameArray.push(chapter.NAME);
          }
        });

        setChapterNames(chapterNameArray);
      }
    }
  }, [
    chapters.data,
    examData,
    examId,
    setValue,
    presetFields,
    presetHeaderData,
    setChapterNames,
    setIds,
    getUser,
  ]);

  const handleChapters = (chapterId: string, chapterName: string) => {
    const currentIds = [...(selectedChapterIds || [])];
    const currentNames = [...(chapterNames || [])];

    if (currentIds.includes(chapterId)) {
      const updatedIds = currentIds.filter((id) => id !== chapterId);
      const updatedNames = currentNames.filter((name) => name !== chapterName);
      setChapterNames(updatedNames);
      form.setValue("chapterIds", updatedIds, { shouldValidate: true });
    } else {
      setChapterNames([...currentNames, chapterName]);
      form.setValue("chapterIds", [...currentIds, chapterId], {
        shouldValidate: true,
      });
    }
  };

  const handleSelectAll = () => {
    if (selectedChapterIds.length === chapters.data?.length) {
      //deselect all
      setChapterNames([]);
      form.setValue("chapterIds", [], { shouldValidate: true });
    } else {
      const neededIds: string[] = [];
      const neededIdNames: string[] = [];

      chapters.data?.forEach((chapter) => {
        neededIds.push(chapter.id.toString());
        neededIdNames.push(chapter.NAME);
      });

      setChapterNames(neededIdNames);
      form.setValue("chapterIds", neededIds, { shouldValidate: true });
    }
  };

  const onPrequisitesSubmit: SubmitHandler<PrerequisitesForm> = (data) => {
    setIds("publicationId", data.publicationId);
    setIds("seriesId", data.seriesId);
    setIds("classId", data.classId);
    setIds("subjectId", data.subjectId);
    setIds("bookId", data.bookId);
    setIds("chapterIds", selectedChapterIds);

    setIsModalOpen(false);
  };

  const onPaperViewNext: SubmitHandler<PrerequisitesForm> = (data) => {
    setIds("publicationId", data.publicationId);
    setIds("seriesId", data.seriesId);
    setIds("classId", data.classId);
    setIds("subjectId", data.subjectId);
    setIds("bookId", data.bookId);
    setIds("chapterIds", selectedChapterIds);

    if (Array.from(fields.entries()).length === 0) {
      toast.error("Please add at least one question");
    } else {
      sanitizeFields();
      navigate({ to: "/preview" });
    }
  };

  return (
    <div className="h-full w-full">
      {!isModalOpen && (
        <div className="flex h-full items-center justify-center">
          <div className="flex h-full w-1/2 flex-col">
            {/* Header */}
            <Form {...form}>
              <form className="justify-centr flex flex-col gap-6 bg-white px-8 py-6">
                <div className="grid w-full grid-cols-2 gap-4">
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
                </div>
              </form>
            </Form>

            {examId === "auto-selection" ? (
              <ChapterList
                chapters={chapters.data || []}
                selectedChapterIds={selectedChapterIds}
                handleChapters={handleChapters}
              />
            ) : (
              <QuestionList chapterIds={selectedChapterIds} />
            )}
          </div>
          {examId === "auto-selection" ? (
            <QuestionSelect chapterIds={selectedChapterIds} />
          ) : (
            <PaperView form={form} onPaperViewNext={onPaperViewNext} />
          )}
        </div>
      )}

      {/* Prerequisites Modal */}
      {isModalOpen && (
        <PaperPrerequisitesModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          publication={publication}
          series={series}
          classes={classes}
          subjects={subjects}
          books={books}
          chapters={chapters}
          form={form}
          onPrequisitesSubmit={onPrequisitesSubmit}
          handleChapters={handleChapters}
          handleSelectAll={handleSelectAll}
        />
      )}
    </div>
  );
};

export default QuestionBuilder;
