import { Button } from "@/components/ui/button";
import { Printer, Save } from "lucide-react";
import { useSaveManualPaper } from "./api/saveManualPaper";
import { useQuestionBuilderStore } from "@/store/useQuestionBuilderStore";

const SavePaper = () => {
  const chapterId = useQuestionBuilderStore((state) => state.chapterId);
  const fields = useQuestionBuilderStore((state) => state.fields);

  const saveManualPaper = useSaveManualPaper();

  const handleSaveManualPaper = () => {
    console.log(chapterId);
    console.log(fields);
    const body = {
      chapterId,
      questionIds: fields.map((f) => f.id),
    };

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
