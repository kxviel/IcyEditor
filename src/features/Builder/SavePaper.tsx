import { Button } from "@/components/ui/button";
import { Printer, Save } from "lucide-react";
import { useSaveExamPaper } from "./api/saveExamPaper";
import { useQuestionBuilderStore } from "@/store/useQuestionBuilderStore";
import { useHeaderStore } from "@/store/useHeaderStore";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "@tanstack/react-router";
import { usePageSettingsStore } from "@/store/usePageSettingsStore";
import { IPatch, patchDocument, PatchType } from "docx";
import { generateDocFromFields } from "@/lib/docxParser";
import { saveAs } from "file-saver";
import { format } from "date-fns";
import { docxHeaderOne } from "@/lib/docxHeaders";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const SavePaper = () => {
  const { getUser } = useAuth();
  const navigate = useNavigate();
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
          CLASS: classId,
          SUBJECT: subjectId,
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

  const handleDownloadDOCX = async () => {
    const response = await fetch("./src/assets/headers/layout_one.docx");
    const responseBlob = await response.blob();

    const docxBlob = generateDocFromFields(fields, Number(fontSize));
    const layoutDict: Record<string, Record<string, IPatch>> = {
      "1": docxHeaderOne(headerData, fontSize),
      "2": docxHeaderOne(headerData, fontSize),
      "3": docxHeaderOne(headerData, fontSize),
    };

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
          ...layoutDict[headerLayout],
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
    navigate({ to: "/print" });
  };

  return (
    <div className="flex items-center space-x-4">
      <Button variant="outline" onClick={handleSaveManualPaper}>
        <Save /> Save Paper
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger>
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
