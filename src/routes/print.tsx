import { CategoryWrapper } from "@/components/DisplayComp";
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
  const currentFontSize = usePageSettingsStore(
    (state) => state.currentFontSize,
  );

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
          {[1, 2].map((sigh) => (
            <div key={sigh} className="w-full">
              {layoutDict[headerLayout]}

              {Array.from(fields.values()).map((field) => (
                <div className="w-full" key={field.categoryId}>
                  <CategoryWrapper
                    categoryIndex={field.categoryIndex!}
                    categoryName={field.categoryName}
                    questionLength={field.questions.length}
                    categoryMarks={field.categoryMarks}
                  />

                  {field.questions.map((question) => (
                    <div key={question.questionId} className="my-2 flex gap-2">
                      <p
                        className="font-semibold text-gray-800"
                        style={{ fontSize: 14 + Number(currentFontSize) }}
                      >
                        {question.questionIndex! + 1}.
                      </p>
                      <p
                        className="whitespace-pre text-gray-700"
                        style={{ fontSize: 14 + Number(currentFontSize) }}
                        dangerouslySetInnerHTML={{
                          __html: question.questionText,
                        }}
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div id="section-to-print" className={`w-full`}>
          {layoutDict[headerLayout]}

          <div className="flex w-full flex-col gap-3">
            {Array.from(fields.values()).map((field) => (
              <div className="w-full" key={field.categoryId}>
                <CategoryWrapper
                  categoryIndex={field.categoryIndex!}
                  categoryName={field.categoryName}
                  questionLength={field.questions.length}
                  categoryMarks={field.categoryMarks}
                />

                {field.questions.map((question) => (
                  <div key={question.questionId} className="my-3 flex gap-2">
                    <p
                      className="font-semibold text-gray-800"
                      style={{ fontSize: 14 + Number(currentFontSize) }}
                    >
                      {question.questionIndex! + 1}.
                    </p>
                    <p
                      className="whitespace-pre text-gray-700"
                      style={{ fontSize: 14 + Number(currentFontSize) }}
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
      )}
    </>
  );
};
