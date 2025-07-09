import {
  CategoryWrapper,
  QuestionWrapper,
} from "@/features/Builder/shared/DisplayComp";
import PaperHeaderFour from "@/features/Builder/headers/PaperHeaderFour";
import PaperHeaderOne from "@/features/Builder/headers/PaperHeaderOne";
import PaperHeaderThree from "@/features/Builder/headers/PaperHeaderThree";
import PaperHeaderTwo from "@/features/Builder/headers/PaperHeaderTwo";
import { usePageSettingsStore } from "@/store/usePageSettingsStore";
import { useQuestionBuilderStore } from "@/store/useQuestionBuilderStore";
import {
  createFileRoute,
  useLocation,
  useNavigate,
} from "@tanstack/react-router";
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

type URL_Params = {
  layout: number;
  font: number;
};

const RenderedPage = () => {
  const navigate = useNavigate();
  const urlParams = useLocation().search as URL_Params;

  const optimized = localStorage.getItem("optimized") === "true";

  const headerLayout = usePageSettingsStore((state) => state.headerLayout);
  const setFontSize = usePageSettingsStore((state) => state.setFontSize);
  const fields = useQuestionBuilderStore((state) => state.fields);
  const setHeaderLayout = usePageSettingsStore(
    (state) => state.setHeaderLayout,
  );

  const handleAfterPrint = () => {
    navigate({ to: "/preview" });
  };

  useEffect(() => {
    if (urlParams) {
      setFontSize(urlParams.font.toString());
      setHeaderLayout(urlParams.layout.toString());
    }
  }, [urlParams, setFontSize, setHeaderLayout]);

  useEffect(() => {
    window.print();

    window.addEventListener("afterprint", handleAfterPrint);

    return () => {
      window.removeEventListener("afterprint", handleAfterPrint);
    };
  }, []);

  return (
    <div className="h-full w-full">
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
                        isEditable={false}
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
    </div>
  );
};
