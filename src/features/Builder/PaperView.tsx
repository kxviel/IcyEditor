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
    <div className="relative h-full w-1/2">
      <div className="custom_scrollbar flex h-full flex-col items-center overflow-y-auto px-6">
        <p className="py-6 text-sm font-semibold">
          <span className="text-red-500">Note</span>: You can change the format,
          font size, etc., on the next page.
        </p>

        <div className="custom_scrollbar h-full w-full overflow-y-auto bg-white p-4 shadow-md">
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

      <div className="absolute bottom-0 flex h-24 w-full items-center gap-4 bg-white px-4">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => navigate({ to: "/exam-type" })}
        >
          Back
        </Button>

        <Button className="w-full" onClick={() => navigate({ to: "/preview" })}>
          Next
        </Button>
      </div>
    </div>
  );
};

export default PaperView;
