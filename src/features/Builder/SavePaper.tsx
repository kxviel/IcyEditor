import { Button } from "@/components/ui/button";
import { Printer, Save } from "lucide-react";
import { useSaveExamPaper } from "./api/saveExamPaper";
import { useQuestionBuilderStore } from "@/store/useQuestionBuilderStore";
import { useHeaderStore } from "@/store/useHeaderStore";

const SavePaper = () => {
  const fields = useQuestionBuilderStore((state) => state.fields);
  const headerData = useHeaderStore((state) => state.headerData);

  const saveManualPaper = useSaveExamPaper();

  const handleSaveManualPaper = () => {
    console.log(fields);
    const body = {
      SCHOOL_NAME: headerData.schoolName.value,
      CLASS_NAME: headerData.className.value,
      DURATION_MINS: headerData.duration.value,
      EXAM_NAME: headerData.examName.value,
      SUBJECT_NAME: headerData.subjectName.value,
      MARKS: headerData.totalMarks.value,
      USER_ID: 0,
      LAYOUT: "1",
      DATA_STRING: {
        questionIds: Object.values(fields).flatMap((value) =>
          value.questions.map((q) => q.questionId),
        ),
      },
    };
    console.log(body);
    saveManualPaper.mutate({ body });
  };

  return (
    <div className="flex items-center space-x-4">
      <Button variant="outline" onClick={handleSaveManualPaper}>
        <Save /> Save Paper
      </Button>
      <Button>
        Print & Save <Printer />
      </Button>
    </div>
  );
};

export default SavePaper;
