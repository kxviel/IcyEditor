import { CategoryWrapper, QuestionWrapper } from "@/components/DisplayComp";
import PaperHeaderFour from "@/features/Builder/PaperHeaders/PaperHeaderFour";
import PaperHeaderOne from "@/features/Builder/PaperHeaders/PaperHeaderOne";
import PaperHeaderThree from "@/features/Builder/PaperHeaders/PaperHeaderThree";
import PaperHeaderTwo from "@/features/Builder/PaperHeaders/PaperHeaderTwo";
import { usePageSettingsStore } from "@/store/usePageSettingsStore";
import { useQuestionBuilderStore } from "@/store/useQuestionBuilderStore";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/print")({
  component: () => <RenderedPage />,
});

const layoutDict: Record<string, React.ReactNode> = {
  "1": <PaperHeaderOne isPreview={true} />,
  "2": <PaperHeaderTwo isPreview={true} />,
  "3": <PaperHeaderThree isPreview={true} />,
  "4": <PaperHeaderFour isPreview={true} />,
};

const RenderedPage = () => {
  const navigate = useNavigate();
  const optimized = localStorage.getItem("optimized") === "true";

  const fields = useQuestionBuilderStore((state) => state.fields);
  const headerLayout = usePageSettingsStore((state) => state.headerLayout);

  useEffect(() => {
    window.print();

    const handleAfterPrint = () => {
      navigate({ to: "/preview" });
    };

    window.addEventListener("beforeprint", handleAfterPrint);
    window.addEventListener("afterprint", handleAfterPrint);

    return () => {
      window.addEventListener("beforeprint", handleAfterPrint);
      window.addEventListener("afterprint", handleAfterPrint);
    };
  }, [navigate]);

  return (
    <>
      {optimized ? (
        <div id="section-to-print" className={`w-full`}>
          {[1, 2].map((isThisAButterfly) => (
            <div key={isThisAButterfly} className="w-full">
              {layoutDict[headerLayout]}

              <div className="flex w-full flex-col gap-3 px-6 py-2">
                {Array.from(fields.values()).map((field) => (
                  <div className="w-full" key={field.categoryId}>
                    <CategoryWrapper
                      categoryIndex={field.categoryIndex!}
                      categoryName={field.categoryName}
                      questionLength={field.questions.length}
                      categoryMarks={field.categoryMarks}
                    />

                    {field.questions.map((question) => (
                      <QuestionWrapper
                        key={question.questionId}
                        questionIndex={question.questionIndex!}
                        questionContent={question.questionText}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div id="section-to-print" className={`w-full`}>
          {layoutDict[headerLayout]}

          <div className="flex w-full flex-col gap-3 px-6 py-2">
            {Array.from(fields.values()).map((field) => (
              <div className="w-full" key={field.categoryId}>
                <CategoryWrapper
                  categoryIndex={field.categoryIndex!}
                  categoryName={field.categoryName}
                  questionLength={field.questions.length}
                  categoryMarks={field.categoryMarks}
                />

                {field.questions.map((question) => (
                  <QuestionWrapper
                    key={question.questionId}
                    questionIndex={question.questionIndex!}
                    questionContent={question.questionText}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};
