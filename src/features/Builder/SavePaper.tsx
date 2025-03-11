import { Button } from "@/components/ui/button";
import { Printer, Save } from "lucide-react";
import { useSaveExamPaper } from "./api/saveExamPaper";
import { useQuestionBuilderStore } from "@/store/useQuestionBuilderStore";
import { useHeaderStore } from "@/store/useHeaderStore";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "@tanstack/react-router";
import { usePageSettingsStore } from "@/store/usePageSettingsStore";
import { useState } from "react";
import { IPatch, patchDocument, PatchType } from "docx";
import { generateDocFromFields } from "@/lib/docxParser";
import { saveAs } from "file-saver";
import { format } from "date-fns";
import { docxHeaderOne } from "@/lib/docxHeaders";
import { toast } from "sonner";

const SavePaper = () => {
  const { getUser } = useAuth();
  const navigate = useNavigate();
  const saveManualPaper = useSaveExamPaper();

  const [downloading, setDownloading] = useState(false);

  const headerLayout = usePageSettingsStore((state) => state.headerLayout);
  const fontSize = usePageSettingsStore((state) => state.currentFontSize);
  const fields = useQuestionBuilderStore((state) => state.fields);
  const headerData = useHeaderStore((state) => state.headerData);

  const handleSaveManualPaper = () => {
    const userId = getUser()?.id;

    if (userId) {
      saveManualPaper.mutate({
        body: {
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
    setDownloading(true);
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
      })
        .then((formattedDoc) => {
          saveAs(
            formattedDoc,
            `${headerData.examName.value} - ${format(new Date(), "dd-MM-yyyy HH:mm")}.docx`,
          );
        })
        .finally(() => {
          toast.success("Word File Downloaded");
          setDownloading(false);
        });
    }
  };

  return (
    <div className="flex items-center space-x-4">
      <Button variant="outline" onClick={handleSaveManualPaper}>
        <Save /> Save Paper
      </Button>

      <Button onClick={() => navigate({ to: "/print" })} disabled={downloading}>
        {downloading ? "Downloading..." : "Download PDF "}
        <Printer />
      </Button>
      <Button onClick={handleDownloadDOCX} disabled={downloading}>
        {downloading ? "Downloading..." : "Download DOCX "}
        <Printer />
      </Button>
    </div>
  );
};

export default SavePaper;
