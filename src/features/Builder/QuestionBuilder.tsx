import { useEffect, useState } from "react";
import PaperPrerequisitesModal from "./modals/PaperPrerequisitesModal";
import PaperView from "./PaperView";
import QuestionList from "./QuestionList";
import { useGetExamById } from "./api/getExamById";
import { parseExamDataResponse } from "@/lib/utils";
import { useQuestionBuilderStore } from "@/store/useQuestionBuilderStore";
import { useHeaderStore } from "@/store/useHeaderStore";
import QuestionSelect from "./QuestionSelect";
import ChapterList from "./ChapterList";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";
import { usePageSettingsStore } from "@/store/usePageSettingsStore";
import HeaderForm from "./HeaderForm";
import { useGetPublication } from "./api/getPublication";
import { useGetSeries } from "./api/getSeries";
import { useGetClass } from "./api/getClass";
import { useGetSubject } from "./api/getSubject";
import { useGetBook } from "./api/getBook";
import { useGetChapter } from "./api/getChapter";

export type SelectFormState = {
  publicationId: string;
  seriesId: string;
  classId: string;
  subjectId: string;
  bookId: string;
  chapterIds: string[];
};

export type SelectFormStateKeys = keyof SelectFormState;

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

  const resetHeader = useHeaderStore((state) => state.reset);
  const resetBuilder = useQuestionBuilderStore((state) => state.reset);
  const resetPageSettings = usePageSettingsStore((state) => state.reset);
  const invalidateRelatedQueries = useQuestionBuilderStore(
    (state) => state.invalidateRelatedQueries,
  );

  const { needPreselection } = useSearch({
    from: "/_auth/builder/$examId",
  }) as { needPreselection: boolean };

  const [isModalOpen, setIsModalOpen] = useState(needPreselection);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const { data: examData, isLoading: examDataLoading } = useGetExamById(examId);
  const publication = useGetPublication();
  const series = useGetSeries(publicationId);
  const classes = useGetClass(seriesId);
  const subjects = useGetSubject(classId);
  const books = useGetBook(subjectId);
  const chapters = useGetChapter(bookId);

  // Check if we should show loading state
  const shouldShowLoader =
    !["manual-selection", "auto-selection"].includes(examId) &&
    (examDataLoading || (!isDataLoaded && examData));

  useEffect(() => {
    const user = getUser();
    const isUserRestricted = user && user.RESTRICTED_ACCESS === 0;
    const valuesAlreadySet = publicationId && seriesId;

    // For restricted users, always set publication and series IDs
    if (isUserRestricted && !valuesAlreadySet) {
      setIds("publicationId", user.PUBLICATION_ID?.toString());
      setIds("seriesId", user.SERIES_ID?.toString());
    }
  }, [getUser, publicationId, seriesId, setIds]);

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
        setIds("seriesId", parsedObject.ids.seriesId);
        setIds("classId", parsedObject.ids.classId);
        setIds("subjectId", parsedObject.ids.subjectId);
        setIds("bookId", parsedObject.ids.bookId);
        setIds("chapterIds", parsedObject.ids.chapterIds);

        // Set chapter names
        const chapterNameArray: string[] = [];
        chapters.data?.forEach((chapter) => {
          if (parsedObject.ids.chapterIds.includes(chapter.id.toString())) {
            chapterNameArray.push(chapter.NAME);
          }
        });

        setChapterNames(chapterNameArray);
      }

      // Mark data as loaded after processing
      setIsDataLoaded(true);
    } else if (["manual-selection", "auto-selection"].includes(examId)) {
      // For manual/auto selection, mark as loaded immediately
      setIsDataLoaded(true);
    }
  }, [
    examId,
    examData,
    chapters.data,
    presetFields,
    presetHeaderData,
    setChapterNames,
    setIds,
  ]);

  const handleChapters = (chapterId: string, chapterName: string) => {
    const currentIds = [...(chapterIds || [])];
    const currentNames = [...(chapterNames || [])];

    if (currentIds.includes(chapterId)) {
      const updatedIds = currentIds.filter((id) => id !== chapterId);
      const updatedNames = currentNames.filter((name) => name !== chapterName);
      setChapterNames(updatedNames);
      setIds("chapterIds", updatedIds);
    } else {
      setChapterNames([...currentNames, chapterName]);
      setIds("chapterIds", [...currentIds, chapterId]);
    }
  };

  const handleSelectAll = () => {
    if (chapterIds.length === chapters.data?.length) {
      //deselect all
      setChapterNames([]);
      setIds("chapterIds", []);
    } else {
      const neededIds: string[] = [];
      const neededIdNames: string[] = [];

      chapters.data?.forEach((chapter) => {
        neededIds.push(chapter.id.toString());
        neededIdNames.push(chapter.NAME);
      });

      setChapterNames(neededIdNames);
      setIds("chapterIds", neededIds);
    }
  };

  const onPrequisitesSubmit = () => {
    setIsModalOpen(false);
  };

  const onPaperViewNext = () => {
    if (Array.from(fields.entries()).length === 0) {
      toast.error("Please add at least one question");
    } else {
      sanitizeFields();
      navigate({ to: "/preview" });
    }
  };

  const handleModalState = (open: boolean) => {
    setIsModalOpen(open);

    if (!open) {
      resetHeader();
      resetBuilder();
      resetPageSettings();
      invalidateRelatedQueries();
      localStorage.removeItem("optimized");
    }
  };

  // Show minimal loader
  if (shouldShowLoader) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
          <p className="text-sm text-gray-600">Loading exam data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      {!isModalOpen && (
        <div className="flex h-full items-center justify-center">
          <div className="flex h-full w-1/2 flex-col">
            {/* Header */}
            <HeaderForm
              publication={publication}
              series={series}
              classes={classes}
              subjects={subjects}
              books={books}
              chapters={chapters}
              handleChapters={handleChapters}
              handleSelectAll={handleSelectAll}
            />

            {examId === "auto-selection" ? (
              <ChapterList
                chapters={chapters.data || []}
                selectedChapterIds={chapterIds}
                handleChapters={handleChapters}
              />
            ) : (
              <QuestionList chapterIds={chapterIds} />
            )}
          </div>
          {examId === "auto-selection" ? (
            <QuestionSelect chapterIds={chapterIds} />
          ) : (
            <PaperView onPaperViewNext={onPaperViewNext} />
          )}
        </div>
      )}

      {isModalOpen && (
        <PaperPrerequisitesModal
          isModalOpen={isModalOpen}
          handleModalState={handleModalState}
          onPrequisitesSubmit={onPrequisitesSubmit}
          publication={publication}
          series={series}
          classes={classes}
          subjects={subjects}
          books={books}
          chapters={chapters}
          handleChapters={handleChapters}
          handleSelectAll={handleSelectAll}
        />
      )}
    </div>
  );
};

export default QuestionBuilder;
