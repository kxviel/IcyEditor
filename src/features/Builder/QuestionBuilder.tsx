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
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { useGetExamById } from "./api/getExamById";
import { parseExamDataResponse } from "@/lib/utils";
import { useQuestionBuilderStore } from "@/store/useQuestionBuilderStore";
import { useHeaderStore } from "@/store/useHeaderStore";
import { ControlledSelect } from "@/components/ControlledSelect";

const prequisitesFormSchema = z.object({
  publicationId: z.string(),
  seriesId: z.string(),
  classId: z.string(),
  subjectId: z.string(),
  bookId: z.string(),
  chapterId: z.string(),
});

export type PrerequisitesForm = z.infer<typeof prequisitesFormSchema>;

type Props = {
  examId: "manual" | "auto" | string;
};

const QuestionBuilder = ({ examId }: Props) => {
  const presetFields = useQuestionBuilderStore((state) => state.presetFields);
  const presetHeaderData = useHeaderStore((state) => state.presetHeaderData);
  const [modalView] = useState<"prereq" | "autogen">("prereq");
  const [isModalOpen, setIsModalOpen] = useState(
    ["manual", "auto"].includes(examId),
  );

  const form = useForm<PrerequisitesForm>({
    resolver: zodResolver(prequisitesFormSchema),
  });

  const publication = useGetPublication();
  const series = useGetSeries(form.watch("publicationId"));
  const classes = useGetClass(form.watch("seriesId"));
  const subjects = useGetSubject(form.watch("classId"));
  const books = useGetBook(form.watch("subjectId"));
  const chapters = useGetChapter(form.watch("bookId"));

  const { data: examData } = useGetExamById(examId);

  useEffect(() => {
    if (examData && examData.examId) {
      const parsedObject = parseExamDataResponse(examData);

      if (parsedObject.fields) {
        presetFields(parsedObject.fields);
      }
      if (parsedObject.headerData) {
        presetHeaderData(parsedObject.headerData);
      }
    }
  }, [examData, presetFields, presetHeaderData]);

  const onPrequisitesSubmit = () => {
    const allListsExist =
      publication.data &&
      series.data &&
      classes.data &&
      subjects.data &&
      books.data &&
      chapters.data;

    if (allListsExist) {
      setIsModalOpen(false);
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
                </div>
              </form>
            </Form>

            <QuestionList chapterId={form.watch("chapterId")} />
          </div>
          <PaperView />
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
        modalView={modalView}
        isAuto={examId === "auto"}
      />
    </div>
  );
};

export default QuestionBuilder;
