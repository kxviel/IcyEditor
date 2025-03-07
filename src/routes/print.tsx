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

const RenderedPage = () => {
  const navigate = useNavigate();
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

    window.addEventListener("afterprint", handleAfterPrint);

    return () => {
      window.removeEventListener("afterprint", () => {});
    };
  }, [navigate]);

  return (
    <div id="section-to-print" className={`w-full`}>
      {headerLayout === "1" ? (
        <PaperHeaderOne isPreview={true} />
      ) : headerLayout === "2" ? (
        <PaperHeaderTwo isPreview={true} />
      ) : (
        <PaperHeaderThree isPreview={true} />
      )}

      <div className="flex w-full flex-col gap-3">
        {Array.from(fields.values()).map((field) => (
          <div className="w-full" key={field.categoryId}>
            <div className="my-3 flex gap-2">
              <p
                className="whitespace-nowrap font-semibold leading-6 text-gray-800"
                style={{ fontSize: 16 + Number(currentFontSize) }}
              >
                Q{field.categoryIndex! + 1}.
              </p>
              <p
                className="font-semibold text-gray-800"
                style={{ fontSize: 16 + Number(currentFontSize) }}
              >
                {field.categoryName}
              </p>

              <p
                className="ml-auto whitespace-nowrap text-sm leading-6"
                style={{ fontSize: 14 + Number(currentFontSize) }}
              >
                (1 x {field.questions.length}) = 5
              </p>
            </div>

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
  );
};
