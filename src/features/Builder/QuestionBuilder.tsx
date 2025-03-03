import { useEffect, useState } from "react";
import { useGetBook } from "./api/getBook";
import PaperPrerequisitesModal from "./PaperPrerequisitesModal";
import PaperView from "./PaperView";
import QuestionList from "./QuestionList";
import { useGetChapter } from "./api/getChapter";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetPublication } from "./api/getPublication";
import { useGetSeries } from "./api/getSeries";
import { useGetClass } from "./api/getClass";
import { useGetSubject } from "./api/getSubject";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { toast } from "sonner";
import { useGetExamById } from "./api/getExamById";
import { parseExamDataResponse } from "@/lib/utils";
import { useQuestionBuilderStore } from "@/store/useQuestionBuilderStore";

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
  const [modalView] = useState<"prereq" | "autogen">("prereq");
  const [isModalOpen, setIsModalOpen] = useState(
    ["manual", "auto"].includes(examId),
  );

  const [fieldNames, setFieldNames] = useState({
    publicationName: "",
    seriesName: "",
    className: "",
    subjectName: "",
  });

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
    }
  }, [examData, presetFields]);

  const onPrequisitesSubmit = (data: PrerequisitesForm) => {
    const allListsExist =
      publication.data &&
      series.data &&
      classes.data &&
      subjects.data &&
      books.data &&
      chapters.data;

    if (allListsExist) {
      const fieldNames = {
        publicationName: "",
        seriesName: "",
        className: "",
        subjectName: "",
      };

      try {
        publication.data.forEach((item) => {
          if (item.id === Number(data.publicationId)) {
            fieldNames.publicationName = item.NAME;
          }
        });
        series.data.forEach((item) => {
          if (item.id === Number(data.seriesId)) {
            fieldNames.seriesName = item.NAME;
          }
        });
        classes.data.forEach((item) => {
          if (item.id === Number(data.classId)) {
            fieldNames.className = item.NAME;
          }
        });
        subjects.data.forEach((item) => {
          if (item.id === Number(data.subjectId)) {
            fieldNames.subjectName = item.NAME;
          }
        });
      } catch (error) {
        console.log(error);
        toast.error("Something went wrong");
      } finally {
        setFieldNames(fieldNames);
        setIsModalOpen(false);
      }
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
                  <div>
                    <Label>Publication</Label>
                    <p>{fieldNames.publicationName || "-"}</p>
                  </div>
                  <div>
                    <Label>Series</Label>
                    <p>{fieldNames.seriesName || "-"}</p>
                  </div>
                  <div>
                    <Label>Class</Label>
                    <p>{fieldNames.className || "-"}</p>
                  </div>
                  <div>
                    <Label>Subject</Label>
                    <p>{fieldNames.subjectName || "-"}</p>
                  </div>
                  <div>
                    <FormField
                      control={form.control}
                      name={"bookId"}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Book</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger
                                className={
                                  form.formState.errors[field.name]
                                    ? "border-red-100"
                                    : ""
                                }
                              >
                                <SelectValue placeholder={"Select Chapter"} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {books?.data
                                ? books.data.map((book) => (
                                    <SelectItem
                                      key={book.id}
                                      value={book.id.toString()}
                                    >
                                      {book.NAME}
                                    </SelectItem>
                                  ))
                                : null}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div>
                    <FormField
                      control={form.control}
                      name={"chapterId"}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Chapter</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger
                                className={
                                  form.formState.errors[field.name]
                                    ? "border-red-100"
                                    : ""
                                }
                              >
                                <SelectValue placeholder={"Select Chapter"} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {chapters?.data
                                ? chapters.data.map((chapter) => (
                                    <SelectItem
                                      key={chapter.id}
                                      value={chapter.id.toString()}
                                    >
                                      {chapter.NAME}
                                    </SelectItem>
                                  ))
                                : null}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  </div>
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
