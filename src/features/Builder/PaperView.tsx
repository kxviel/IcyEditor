import { Button } from "@/components/ui/button";
import { useQuestionBuilderStore } from "@/store/useQuestionBuilderStore";
import { useBlocker, useNavigate } from "@tanstack/react-router";
import { useModalStore } from "@/store/useModalStore";
import { toast } from "sonner";
import PaperHeaderOne from "./PaperHeaders/PaperHeaderOne";
import RefreshBlockerModal from "./RefreshBlockerModal";

const PaperView = () => {
  const fields = useQuestionBuilderStore((state) => state.fields);
  const sanitizeFields = useQuestionBuilderStore(
    (state) => state.sanitizeFields,
  );
  const navigate = useNavigate();
  const setModal = useModalStore((state) => state.setModal);

  const { proceed, reset, status } = useBlocker({
    shouldBlockFn: ({ next }) => (next.fullPath === "/preview" ? false : true),
    withResolver: true,
  });

  const handleBack = () => {
    navigate({ to: "/exam-type" });
  };

  const handleNext = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    if (Array.from(fields.entries()).length > 0) {
      sanitizeFields();
      navigate({ to: "/preview" });
    } else {
      toast.warning("Please add at least one question");
    }
  };

  return (
    <div className="relative h-full w-1/2">
      <div className="custom_scrollbar flex h-full flex-col items-center overflow-y-auto px-6">
        <p className="py-6 text-sm font-semibold">
          <span className="text-red-500">Note</span>: You can change the format,
          font size, etc., on the next page.
        </p>

        <div className="custom_scrollbar h-full w-full overflow-y-auto bg-white p-3 shadow-md">
          <PaperHeaderOne isPreview={false} />

          <div className="flex w-full flex-col gap-3">
            {Array.from(fields.values()).map((field, fieldIndex) => (
              <div className="w-full" key={field.categoryId}>
                <div className="my-3 flex gap-2">
                  <p className="whitespace-nowrap font-semibold leading-6 text-gray-800">
                    Q{fieldIndex + 1}.
                  </p>
                  <p className="font-semibold text-gray-800">
                    {field.categoryName}
                  </p>

                  <p className="ml-auto whitespace-nowrap text-sm leading-6">
                    (1 x {field.questions.length}) = 5
                  </p>
                </div>

                {field.questions.map((question, index) => (
                  <div
                    key={question.questionId}
                    className="my-3 flex gap-2 whitespace-pre py-1 hover:cursor-pointer hover:bg-gray-50"
                    onClick={() => {
                      setModal("EDIT_QUESTION", {
                        isOpen: true,
                        content: question.questionText,
                      });
                    }}
                  >
                    <p className="text-sm font-semibold text-gray-800">
                      {index + 1}.
                    </p>
                    <p
                      className="text-sm text-gray-700"
                      dangerouslySetInnerHTML={{
                        __html: question.questionText,
                      }}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 flex h-14 w-full items-center gap-4 bg-white px-4">
        <Button variant="outline" className="w-full" onClick={handleBack}>
          Back
        </Button>

        <Button className="w-full" onClick={handleNext}>
          Next
        </Button>
      </div>

      {status === "blocked" && (
        <RefreshBlockerModal
          isBlockerOpen={status === "blocked"}
          reset={reset}
          proceed={proceed}
        />
      )}
    </div>
  );
};

export default PaperView;
