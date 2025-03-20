import { Button } from "@/components/ui/button";
import { Printer, Save } from "lucide-react";
import { useSaveExamPaper } from "./api/saveExamPaper";
import { useQuestionBuilderStore } from "@/store/useQuestionBuilderStore";
import { useHeaderStore } from "@/store/useHeaderStore";
import { useAuth } from "@/hooks/useAuth";
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

const SavePaper = () => {
  const { getUser } = useAuth();
  const saveManualPaper = useSaveExamPaper();

  const {
    fields,
    publicationId,
    seriesId,
    classId,
    subjectId,
    bookId,
    chapterIds,
  } = useQuestionBuilderStore();
  const headerLayout = usePageSettingsStore((state) => state.headerLayout);
  const fontSize = usePageSettingsStore((state) => state.currentFontSize);
  const headerData = useHeaderStore((state) => state.headerData);

  const handleSaveManualPaper = () => {
    const userId = getUser()?.id;

    if (userId) {
      saveManualPaper.mutate({
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
          USER_ID: userId,
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

  const layoutDict: Record<
    string,
    { path: string; patchContent: Record<string, IPatch> }
  > = {
    "1": {
      path: "./src/assets/headers/layout_one.docx",
      patchContent: docxHeaderOne(headerData, fontSize),
    },
    "2": {
      path: "./src/assets/headers/layout_two.docx",
      patchContent: docxHeaderTwo(headerData, fontSize),
    },
    "3": {
      path: "./src/assets/headers/layout_three.docx",
      patchContent: docxHeaderTwo(headerData, fontSize),
    },
    "4": {
      path: "./src/assets/headers/layout_four.docx",
      patchContent: docxHeaderFour(headerData, fontSize),
    },
  };

  const handleDownloadDOCX = async () => {
    const response = await fetch(layoutDict[headerLayout].path);
    const responseBlob = await response.blob();

    const docxBlob = generateDocFromFields(fields, Number(fontSize));

    if (docxBlob && responseBlob) {
      patchDocument({
        keepOriginalStyles: true,
        outputType: "blob",
        data: responseBlob,
        patches: {
          content: {
            type: PatchType.DOCUMENT,
            children: docxBlob,
          },
          ...layoutDict[headerLayout].patchContent,
        },
      }).then((formattedDoc) => {
        saveAs(
          formattedDoc,
          `${headerData.examName.value} - ${format(new Date(), "dd-MM-yyyy HH:mm")}.docx`,
        );
      });
    }
  };

  const handleDownloadPDF = async () => {
    window.open(
      "/print",
      "Print",
      "height=1122.85,width=794.44,noopener,noreferrer",
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
