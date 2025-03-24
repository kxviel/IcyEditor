import { usePageSettingsStore } from "@/store/usePageSettingsStore";

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
  editQuestionContent = undefined,
}: {
  questionIndex: number;
  questionContent: string;
  editQuestionContent?: () => void;
}) => {
  const currentFontSize = usePageSettingsStore(
    (state) => state.currentFontSize,
  );

  return (
    <div className="my-1 flex gap-2" onClick={editQuestionContent}>
      <p
        className="font-semibold text-gray-800"
        style={{ fontSize: 14 + Number(currentFontSize) }}
      >
        {questionIndex + 1}.
      </p>
      <p
        className="whitespace-pre text-gray-700"
        style={{ fontSize: 14 + Number(currentFontSize) }}
        dangerouslySetInnerHTML={{
          __html: questionContent,
        }}
      />
    </div>
  );
};
