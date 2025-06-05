import { Button } from "@/components/ui/button";
import { usePageSettingsStore } from "@/store/usePageSettingsStore";
import { Edit, Trash2 } from "lucide-react";

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
    <div className="flex items-start gap-2 py-1">
      <p
        className="font-semibold text-gray-800"
        style={{ fontSize: 14 + Number(currentFontSize) }}
      >
        {questionIndex + 1}.
      </p>
      <p
        className="flex-1 whitespace-pre text-gray-700"
        style={{ fontSize: 14 + Number(currentFontSize) }}
        dangerouslySetInnerHTML={{
          __html: questionContent,
        }}
      />
      {isEditable && (editQuestionContent || removeQuestion) && (
        <div className="flex items-center gap-1">
          {editQuestionContent && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-blue-500 hover:bg-blue-50 hover:text-blue-700"
              onClick={editQuestionContent}
            >
              <Edit className="h-4 w-4" />
              <span className="sr-only">Edit question</span>
            </Button>
          )}
          {removeQuestion && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-700"
              onClick={removeQuestion}
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete question</span>
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
