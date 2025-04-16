import PaperHeaderOne from "./headers/PaperHeaderOne";
import PaperHeaderTwo from "./headers/PaperHeaderTwo";
import PaperHeaderThree from "./headers/PaperHeaderThree";
import PaperHeaderFour from "./headers/PaperHeaderFour";
import { Button } from "@/components/ui/button";
import { useQuestionBuilderStore } from "@/store/useQuestionBuilderStore";
import { useNavigate } from "@tanstack/react-router";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePageSettingsStore } from "@/store/usePageSettingsStore";
import { useModalStore } from "@/store/useModalStore";
import {
  CategoryWrapper,
  QuestionWrapper,
} from "@/features/Builder/shared/DisplayComp";
import { PrerequisitesForm } from "./QuestionBuilder";
import { UseFormReturn } from "react-hook-form";

const layoutDict: Record<string, React.ReactNode> = {
  "1": <PaperHeaderOne isPreview={false} />,
  "2": <PaperHeaderTwo isPreview={false} />,
  "3": <PaperHeaderThree isPreview={false} />,
  "4": <PaperHeaderFour isPreview={false} />,
};

type Props = {
  form: UseFormReturn<PrerequisitesForm, any>;
  onPaperViewNext: (data: PrerequisitesForm) => void;
};

const PaperView = ({ form, onPaperViewNext }: Props) => {
  const navigate = useNavigate();
  const addQuestion = useQuestionBuilderStore((state) => state.addQuestion);
  const headerLayout = usePageSettingsStore((state) => state.headerLayout);
  const setModal = useModalStore((state) => state.setModal);
  const setHeaderLayout = usePageSettingsStore(
    (state) => state.setHeaderLayout,
  );

  const { fields } = useQuestionBuilderStore();

  const handleBack = () => {
    navigate({ to: "/exam-type" });
  };

  return (
    <div className="relative h-full w-1/2">
      <div className="custom_scrollbar flex h-[calc(100%-56px)] flex-col items-center gap-3 overflow-y-auto p-6 pb-0">
        <p className="text-sm font-semibold">
          <span className="text-red-500">Note</span>: You can change the format,
          font size, etc., on the next page.
        </p>

        <Tabs
          value={headerLayout}
          onValueChange={setHeaderLayout}
          className="flex flex-col items-center justify-center"
        >
          <TabsList className="w-full">
            <TabsTrigger value="1" className="w-full">
              Layout 1
            </TabsTrigger>
            <TabsTrigger value="2" className="w-full">
              Layout 2
            </TabsTrigger>
            <TabsTrigger value="3" className="w-full">
              Layout 3
            </TabsTrigger>
            <TabsTrigger value="4" className="w-full">
              Layout 4
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="custom_scrollbar h-full w-full overflow-y-auto border border-gray-200 bg-white shadow-md">
          {/* Header */}
          {layoutDict[headerLayout]}

          <div className="flex w-full flex-col gap-3 px-6 py-2">
            {Array.from(fields.values()).map((field, fieldIndex) => (
              <div className="w-full" key={field.categoryId}>
                <CategoryWrapper
                  categoryIndex={fieldIndex}
                  categoryName={field.categoryName}
                  questionLength={field.questions.length}
                  categoryMarks={field.categoryMarks}
                  editCategoryMarks={() => {
                    setModal("EDIT_CATEGORY_MARKS", {
                      isOpen: true,
                      categoryId: field.categoryId,
                      currentMarks: field.categoryMarks,
                    });
                  }}
                />

                {field.questions.map((question, questionIndex) => (
                  <QuestionWrapper
                    key={question.questionId}
                    questionIndex={questionIndex}
                    questionContent={question.questionText}
                    editQuestionContent={() => {
                      setModal("EDIT_QUESTION", {
                        isOpen: true,
                        content: question.questionText,
                      });
                    }}
                    removeQuestion={() => {
                      addQuestion(field.categoryId, field.categoryName, {
                        questionId: question.questionId,
                        questionText: question.questionText,
                      });
                    }}
                  />
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

        <Button className="w-full" onClick={form.handleSubmit(onPaperViewNext)}>
          Next
        </Button>
      </div>
    </div>
  );
};

export default PaperView;
