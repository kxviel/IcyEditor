import { Button } from "@/components/ui/button";
import { Printer, Save } from "lucide-react";
import { useSaveExamPaper } from "./api/saveExamPaper";
import { useQuestionBuilderStore } from "@/store/useQuestionBuilderStore";
import { useHeaderStore } from "@/store/useHeaderStore";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "@tanstack/react-router";
import { saveAs } from "file-saver";
import { Packer } from "docx";
import { generateDocFromFields } from "@/lib/docxParser";
import { usePageSettingsStore } from "@/store/usePageSettingsStore";
import { useState } from "react";

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

  const handleDownloadDOCX = () => {
    const docxBlob = generateDocFromFields(
      fields,
      Number(fontSize),
      headerData,
    );

    if (docxBlob) {
      setDownloading(true);
      Packer.toBlob(docxBlob)
        .then((blob) => {
          saveAs(
            blob,
            `${headerData.examName.value}-${new Date().toISOString()}.docx`,
          );
        })
        .finally(() => setDownloading(false));
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
      <Button
        // onClick={() => {
        //   if (docxBlob) {
        //     setDownloading(true);
        //     Packer.toBlob(docxBlob)
        //       .then((blob) => {
        //         saveAs(
        //           blob,
        //           `${headerData.examName.value}-${new Date().toISOString()}.docx`,
        //         );
        //       })
        //       .finally(() => setDownloading(false));
        //   }
        // }}
        onClick={handleDownloadDOCX}
        disabled={downloading}
      >
        {downloading ? "Downloading..." : "Download DOCX "}
        <Printer />
      </Button>
    </div>
  );
};

export default SavePaper;
