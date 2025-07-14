import { Button } from "@/components/ui/button";
import { usePageSettingsStore } from "@/store/usePageSettingsStore";
import { Edit, Trash2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const CategoryWrapper = ({
  categoryIndex,
  categoryName,
  questionLength,
  categoryMarks,
  editCategoryMarks = undefined,
}: {
  categoryIndex: number;
  categoryName: string;
  questionLength: number;
  categoryMarks: string;
  editCategoryMarks?: () => void;
}) => {
  const currentFontSize = usePageSettingsStore(
    (state) => state.currentFontSize,
  );
  console.log(currentFontSize);

  return (
    <div className="my-1 flex gap-2">
      <p
        className="whitespace-nowrap font-semibold leading-6 text-gray-800"
        style={{ fontSize: 16 + Number(currentFontSize) }}
      >
        Q{categoryIndex + 1}.
      </p>
      <p
        className="font-semibold text-gray-800"
        style={{ fontSize: 16 + Number(currentFontSize) }}
      >
        {categoryName}
      </p>

      <p
        className="ml-auto whitespace-nowrap text-sm leading-6"
        style={{ fontSize: 14 + Number(currentFontSize) }}
        onClick={editCategoryMarks}
      >
        ({questionLength} x {categoryMarks}) ={" "}
        {questionLength * Number(categoryMarks) || 1}
      </p>
    </div>
  );
};

export const QuestionWrapper = ({
  questionIndex,
  questionContent,
  isEditable = true,
  editQuestionContent = undefined,
  removeQuestion = undefined,
}: {
  questionIndex: number;
  questionContent: string;
  isEditable?: boolean;
  editQuestionContent?: () => void;
  removeQuestion?: () => void;
}) => {
  const currentFontSize = usePageSettingsStore(
    (state) => state.currentFontSize,
  );

  return (
    <div className="flex w-full min-w-0 items-start gap-2 py-1">
      <p
        className="flex-shrink-0 font-semibold text-gray-800"
        style={{ fontSize: 14 + Number(currentFontSize) }}
      >
        {questionIndex + 1}.
      </p>
      <div
        className="min-w-0 flex-1 overflow-hidden whitespace-pre-wrap break-words text-gray-700"
        style={{ fontSize: 14 + Number(currentFontSize) }}
        dangerouslySetInnerHTML={{
          __html: questionContent,
        }}
      />
      {isEditable && (editQuestionContent || removeQuestion) && (
        <TooltipProvider>
          <div className="flex flex-shrink-0 items-center gap-1">
            {editQuestionContent && (
              <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-blue-500 hover:bg-blue-50 hover:text-blue-700"
                    onClick={editQuestionContent}
                  >
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit question</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Edit question</p>
                </TooltipContent>
              </Tooltip>
            )}
            {removeQuestion && (
              <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-700"
                    onClick={removeQuestion}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Remove question</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Remove question</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </TooltipProvider>
      )}
    </div>
  );
};
