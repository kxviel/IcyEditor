import { useEffect, useState } from "react";
import { useGetBook } from "./api/getBook";
import PaperPrerequisitesModal from "./PaperPrerequisitesModal";
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
import { ControlledSelect } from "@/components/ControlledSelect";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import QuestionSelect from "./QuestionSelect";
import ChapterList from "./ChapterList";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { toast } from "sonner";

const prequisitesFormSchema = z.object({
  publicationId: z.string(),
  seriesId: z.string(),
  classId: z.string(),
  subjectId: z.string(),
  bookId: z.string(),
  chapterIds: z
    .array(z.string())
    .min(1, { message: "Select at least one chapter" })
    .max(10, { message: "You can select a maximum of 10 chapters" }),
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

  const { data: examData } = useGetExamById(examId);

  useEffect(() => {
    if (!["manual-selection", "auto-selection"].includes(examId) && examData) {
      const parsedObject = parseExamDataResponse(examData);

      if (parsedObject.fields) {
        presetFields(parsedObject.fields);
      }
      if (parsedObject.headerData) {
        presetHeaderData(parsedObject.headerData);
      }
      if (parsedObject.ids) {
        console.log(parsedObject.ids);

        setIds("publicationId", parsedObject.ids.publicationId);
        form.setValue("publicationId", parsedObject.ids.publicationId);

        setIds("seriesId", parsedObject.ids.seriesId);
        form.setValue("seriesId", parsedObject.ids.seriesId);

        setIds("classId", parsedObject.ids.classId);
        form.setValue("classId", parsedObject.ids.classId);

        setIds("subjectId", parsedObject.ids.subjectId);
        form.setValue("subjectId", parsedObject.ids.subjectId);

        setIds("bookId", parsedObject.ids.bookId);
        form.setValue("bookId", parsedObject.ids.bookId);

        setIds("chapterIds", parsedObject.ids.chapterIds);
        form.setValue("chapterIds", parsedObject.ids.chapterIds);

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
    form,
    presetFields,
    presetHeaderData,
    setChapterNames,
    setIds,
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
                    isDisabled={
                      series.isPending || !form.watch("publicationId")
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
      />
    </div>
  );
};

export default QuestionBuilder;
