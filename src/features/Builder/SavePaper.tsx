import { Button } from "@/components/ui/button";
import { Printer, Save } from "lucide-react";
import { useSaveExamPaper } from "./api/saveExamPaper";
import { useQuestionBuilderStore } from "@/store/useQuestionBuilderStore";
import { useHeaderStore } from "@/store/useHeaderStore";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "@tanstack/react-router";
import { saveAs } from "file-saver";
import { Packer } from "docx";
import { docxBlob } from "@/lib/docxParser";

const SavePaper = () => {
  const fields = useQuestionBuilderStore((state) => state.fields);
  const headerData = useHeaderStore((state) => state.headerData);
  const { getUser } = useAuth();
  const navigate = useNavigate();
  const saveManualPaper = useSaveExamPaper();

  const handleSaveManualPaper = () => {
    const userId = getUser()?.id;
    const body = {
      SCHOOL_NAME: headerData.schoolName.value,
      CLASS_NAME: headerData.className.value,
      DURATION_MINS: headerData.duration.value,
      EXAM_NAME: headerData.examName.value,
      SUBJECT_NAME: headerData.subjectName.value,
      MARKS: headerData.totalMarks.value,
      USER_ID: userId,
      LAYOUT: "1",
      DATA_STRING: {
        questionIds: Object.values(fields).flatMap((value) =>
          value.questions.map((q) => q.questionId),
        ),
      },
    };

    saveManualPaper.mutate({ body });
  };

  return (
    <div className="flex items-center space-x-4">
      <Button variant="outline" onClick={handleSaveManualPaper}>
        <Save /> Save Paper
      </Button>

      <Button onClick={() => navigate({ to: "/print" })}>
        Download PDF <Printer />
      </Button>
      <Button
        onClick={() => {
          if (docxBlob) {
            Packer.toBlob(docxBlob).then((blob) => {
              console.log(blob);
              saveAs(blob, "DaddyChill.docx");
            });
          }
        }}
      >
        Download DOCX <Printer />
      </Button>
    </div>
  );
};

export default SavePaper;
