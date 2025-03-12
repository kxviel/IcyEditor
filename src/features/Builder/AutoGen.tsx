import { useState } from "react";
import { useGetBook } from "./api/getBook";
import PaperPrerequisitesModal from "./PaperPrerequisitesModal";
import { useGetChapter } from "./api/getChapter";
import { useGetPublication } from "./api/getPublication";
import { useGetSeries } from "./api/getSeries";
import { useGetClass } from "./api/getClass";
import { useGetSubject } from "./api/getSubject";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { ControlledSelect } from "@/components/ControlledSelect";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import ChapterList from "./ChapterList";
import QuestionSelect from "./QuestionSelect";
import { useQuestionBuilderStore } from "@/store/useQuestionBuilderStore";

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

const AutoGen = () => {
  const setIds = useQuestionBuilderStore((state) => state.setIds);

  const [isModalOpen, setIsModalOpen] = useState(true);

  const form = useForm<PrerequisitesForm>({
    resolver: zodResolver(prequisitesFormSchema),
  });

  const selectedChapterIds = form.watch("chapterIds") || [];
  const publication = useGetPublication();
  const series = useGetSeries(form.watch("publicationId"));
  const classes = useGetClass(form.watch("seriesId"));
  const subjects = useGetSubject(form.watch("classId"));
  const books = useGetBook(form.watch("subjectId"));
  const chapters = useGetChapter(form.watch("bookId"));

  const handleChapters = (chapterId: string) => {
    const currentIds = [...(selectedChapterIds || [])];

    if (currentIds.includes(chapterId)) {
      const updatedIds = currentIds.filter((id) => id !== chapterId);
      form.setValue("chapterIds", updatedIds, { shouldValidate: true });
    } else {
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
                </div>
              </form>
            </Form>

            <ChapterList
              chapters={chapters.data || []}
              selectedChapterIds={selectedChapterIds}
              handleChapters={handleChapters}
            />
          </div>
          <QuestionSelect chapterIds={selectedChapterIds} />
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

export default AutoGen;
