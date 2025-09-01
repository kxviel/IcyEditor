import { Button } from "@/components/ui/button";
import { Printer, Save } from "lucide-react";
import { useSaveExamPaper } from "./api/saveExamPaper";
import { useQuestionBuilderStore } from "@/store/useQuestionBuilderStore";
import { useHeaderStore } from "@/store/useHeaderStore";
import { usePageSettingsStore } from "@/store/usePageSettingsStore";
import { IPatch, patchDocument, PatchType } from "docx";
import { generateDocFromFields } from "@/lib/docxParser";
import { saveAs } from "file-saver";
import { format } from "date-fns";
import {
  docxHeaderFour,
  docxHeaderOne,
  docxHeaderTwo,
} from "@/lib/docxHeaders";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";

const SavePaper = () => {
  const navigate = useNavigate();
  const getUser = useAuthStore((state) => state.getUser);
  const saveManualPaper = useSaveExamPaper();

  const {
    fields,
    publicationId,
    seriesId,
    classId,
    subjectId,
    bookId,
    chapterIds,
    invalidateRelatedQueries,
  } = useQuestionBuilderStore();
  const headerLayout = usePageSettingsStore((state) => state.headerLayout);
  const fontSize = usePageSettingsStore((state) => state.currentFontSize);
  const headerData = useHeaderStore((state) => state.headerData);

  const resetHeader = useHeaderStore((state) => state.reset);
  const resetBuilder = useQuestionBuilderStore((state) => state.reset);
  const resetPageSettings = usePageSettingsStore((state) => state.reset);

  const handleSaveManualPaper = () => {
    const user = getUser();

    if (user) {
      saveManualPaper.mutateAsync({
        body: {
          PUBLICATIONS: publicationId,
          SERIES: seriesId,
          examClassId: classId,
          subjectId: subjectId,
          BOOK: bookId,
          CHAPTER_IDS: chapterIds,
          SCHOOL_NAME: headerData.schoolName.value,
          CLASS_NAME: headerData.className.value,
          DURATION_MINS: headerData.duration.value,
          EXAM_NAME: headerData.examName.value,
          SUBJECT_NAME: headerData.subjectName.value,
          MARKS: headerData.totalMarks.value,
          USER_ID: user.id,
          LAYOUT: headerLayout,
          FONT: (16 + Number(fontSize)).toString(),
          DATA_STRING: {
            questionIds: Array.from(fields.values()).flatMap((value) =>
              value.questions.map((q) => q.questionId),
            ),
          },
        },
      });
    }
  };

  const s3Path = "https://guiderimages.s3.ap-south-1.amazonaws.com/docs";
  const layoutDict: Record<
    string,
    { path: string; patchContent: Record<string, IPatch> }
  > = {
    "1": {
      path: `${s3Path}/layout_one.docx`,
      patchContent: docxHeaderOne(headerData, fontSize),
    },
    "2": {
      path: `${s3Path}/layout_two.docx`,
      patchContent: docxHeaderTwo(headerData, fontSize),
    },
    "3": {
      path: `${s3Path}/layout_three.docx`,
      patchContent: docxHeaderTwo(headerData, fontSize),
    },
    "4": {
      path: `${s3Path}/layout_four.docx`,
      patchContent: docxHeaderFour(headerData, fontSize),
    },
  };

  const handleDownloadDOCX = async () => {
    if (!layoutDict[headerLayout]) {
      console.error("Invalid header layout selected.");
      toast.error("Invalid header layout selected.");
      return;
    }

    if (!fields || fields.size === 0) {
      console.error("No fields available to generate the document.");
      toast.error("No fields available to generate the document.");
      return;
    }

    const headerObject = layoutDict[headerLayout];

    const response = await fetch(headerObject.path).catch((error) => {
      console.error("Error fetching the header template:", error);
      toast.error("Error fetching the header template.");
      throw error;
    });

    const responseBlob = await response.blob();

    const docxBlob = await generateDocFromFields(fields, Number(fontSize));
    const headerPatch = headerObject.patchContent;

    const allPatches = {
      ...headerPatch,
      content: {
        type: PatchType.DOCUMENT,
        children: docxBlob,
      },
    };

    if (docxBlob && responseBlob) {
      patchDocument({
        keepOriginalStyles: true,
        outputType: "blob",
        data: responseBlob,
        patches: allPatches,
      })
        .then((formattedDoc) => {
          saveAs(
            formattedDoc,
            `${headerData.examName.value} - ${format(new Date(), "dd-MM-yyyy HH:mm")}.docx`,
          );
        })
        .then(() => {
          handleSaveManualPaper();
        })
        .then(() => {
          resetHeader();
          resetBuilder();
          resetPageSettings();
          invalidateRelatedQueries();
          localStorage.removeItem("optimized");
          navigate({ to: "/", search: { page: 1 } });
        });
    }
  };

  const handleDownloadPDF = async () => {
    handleSaveManualPaper();
    window.open(
      `/print?layout=${headerLayout}&font=${fontSize}`,
      "_blank",
      "height=1122.85,width=794.44",
    );
  };

  return (
    <div className="flex items-center space-x-4">
      <Button variant="outline" onClick={handleSaveManualPaper}>
        <Save /> Save Paper
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>
            Download <Printer />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={handleDownloadPDF}>
            Download as PDF
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDownloadDOCX}>
            Download as Word
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default SavePaper;
