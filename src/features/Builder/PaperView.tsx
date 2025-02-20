import { Button } from "@/components/ui/button";
import PaperHeader from "./PaperHeader";
import { useQuestionBuilderStore } from "@/store/useQuestionBuilderStore";
import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

const PaperView = () => {
  const fields = useQuestionBuilderStore((state) => state.fields);
  const navigate = useNavigate();

  useEffect(() => {
    console.log(fields);
  }, [fields]);

  return (
    <div className="flex h-full w-1/2 flex-col items-center space-y-4 p-4">
      <div className="flex items-center gap-2">
        <Button>Font Size</Button>
        <Button>Page Size</Button>
        <Button onClick={() => navigate({ to: "/preview" })}>Preview</Button>
      </div>

      <div className="custom_scrollbar h-full w-full overflow-y-auto bg-white p-4">
        <PaperHeader />

        <div className="flex w-full flex-col gap-3">
          {Object.values(fields).map((field) => (
            <div className="w-full" key={field.categoryId}>
              <p className="font-semibold text-gray-800">
                {field.categoryName}
              </p>

              {field.questions.map((question) => (
                <p
                  className="text-sm text-gray-500"
                  key={question.questionId}
                  dangerouslySetInnerHTML={{ __html: question.questionText }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PaperView;
