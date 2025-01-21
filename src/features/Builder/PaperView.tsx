import { Button } from "@/components/ui/button";
import PaperHeader from "./PaperHeader";
import { useQuestionBuilderStore } from "@/store/useQuestionBuilderStore";
import { useNavigate } from "@tanstack/react-router";

const PaperView = () => {
  const fields = useQuestionBuilderStore((state) => state.fields);
  const navigate = useNavigate();

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
          {fields.map((question) => (
            <div className="w-full bg-slate-200" key={question.id}>
              <p
                className="text-sm text-gray-500"
                dangerouslySetInnerHTML={{ __html: question.value }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PaperView;
