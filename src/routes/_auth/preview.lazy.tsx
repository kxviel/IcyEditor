import PaperHeaderOne from "@/features/Builder/PaperHeaders/PaperHeaderOne";
import PaperHeaderTwo from "@/features/Builder/PaperHeaders/PaperHeaderTwo";
import PaperHeaderThree from "@/features/Builder/PaperHeaders/PaperHeaderThree";
import PaperHeaderFour from "@/features/Builder/PaperHeaders/PaperHeaderFour";
import {
  CategoryItem,
  useQuestionBuilderStore,
} from "@/store/useQuestionBuilderStore";
import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePageSettingsStore } from "@/store/usePageSettingsStore";
import { Button } from "@/components/ui/button";
import { WandSparkles } from "lucide-react";
import { toast } from "sonner";

const pageDimensions: Record<string, string> = {
  A3: "h-[420mm] w-[297mm]",
  A4: "h-[297mm] w-[210mm]",
  A5: "h-[210mm] w-[148mm]",
};

const layoutDict = (
  headerRef: React.RefObject<HTMLDivElement>,
  headerLayout: string,
) => {
  const dict: Record<string, React.ReactNode> = {
    "1": <PaperHeaderOne isPreview={true} headerRef={headerRef} />,
    "2": <PaperHeaderTwo isPreview={true} headerRef={headerRef} />,
    "3": <PaperHeaderThree isPreview={true} headerRef={headerRef} />,
    "4": <PaperHeaderFour isPreview={true} headerRef={headerRef} />,
  };

  return dict[headerLayout];
};

export const Route = createLazyFileRoute("/_auth/preview")({
  component: () => (
    <div className="h-[calc(100vh-72px)] w-full bg-[#F9F5FF]">
      <div className="mx-auto h-full max-w-screen-xl">
        <Preview />
      </div>
    </div>
  ),
});

type RenderedPageProps = {
  pageRef: React.RefObject<HTMLDivElement>;
  childRef: React.RefObject<HTMLDivElement>;
  headerRef: React.RefObject<HTMLDivElement>;
  pageIndex: number;
  pageSize: string;
  pageValue: CategoryItem[];
};

function Preview() {
  const parentRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const childRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  const fields = useQuestionBuilderStore((state) => state.fields);
  const setFontSize = usePageSettingsStore((state) => state.setFontSize);

  const currentFontSize = usePageSettingsStore(
    (state) => state.currentFontSize,
  );

  const [pageSize, setPageSize] = useState("A4");
  const [showOptimizer, setShowOptimizer] = useState(false);

  const calcFontSize = (value: string) => {
    setFontSize(value);
  };

  const [pageArray, setPageArray] = useState<CategoryItem[][]>([[]]);

  useEffect(() => {
    window.addEventListener(
      "popstate",
      function (event) {
        event.preventDefault();
        navigate({
          to: "/builder/$examId",
          params: { examId: "manual-selection" },
          search: { needPreselection: false },
          replace: true,
        });
      },
      false,
    );

    return () => {
      window.removeEventListener("popstate", () => {});
    };
  }, [navigate]);

  useEffect(() => {
    let currentChildHeight: number = 0;
    let currentPageIndex: number = 0;

    const tempPageArray: CategoryItem[][] = [[]];
    const pagePadding = 24; //p-6
    const pageMargin = 12; //mb-3
    const headerPadding = 8; //p-2

    if (pageRef.current) {
      const parentTop = pageRef.current.getBoundingClientRect().top;
      let totalPageHeight =
        pageRef.current.getBoundingClientRect().height -
        pagePadding -
        pageMargin;

      if (currentPageIndex === 0 && headerRef.current) {
        totalPageHeight -=
          headerRef.current.getBoundingClientRect().height - headerPadding;
      }

      if (childRef.current) {
        // Show Optimizer
        const lastContent =
          childRef.current.lastElementChild?.getBoundingClientRect().bottom;
        const heightToLastContent = (lastContent || 0) - parentTop;
        setShowOptimizer(heightToLastContent < 0.5 * totalPageHeight);

        // Calculate Height of Each Field
        [...childRef.current.children].forEach((child, index) => {
          currentChildHeight += child.getBoundingClientRect().height;

          const currentField = Array.from(fields.values())[index];

          if (currentChildHeight < totalPageHeight) {
            if (tempPageArray[currentPageIndex]) {
              tempPageArray[currentPageIndex].push(currentField);
            } else {
              tempPageArray[currentPageIndex] = [currentField];
            }
          } else {
            currentPageIndex += 1;
            currentChildHeight = 0;

            tempPageArray[currentPageIndex] = [currentField];
          }
        });
      }
    }

    setPageArray(tempPageArray);
  }, [fields, currentFontSize, pageSize]);

  return (
    <div className="flex h-full flex-col items-center gap-6 pt-6">
      <div className="flex items-center justify-center gap-3">
        <Select value={pageSize} onValueChange={setPageSize}>
          <SelectTrigger className="w-[180px] bg-white">
            <SelectValue placeholder="Paper Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="A3">A3</SelectItem>
            <SelectItem value="A4">A4</SelectItem>
            <SelectItem value="A5">A5</SelectItem>
          </SelectContent>
        </Select>

        <Select value={currentFontSize} onValueChange={calcFontSize}>
          <SelectTrigger className="w-[180px] bg-white">
            <SelectValue placeholder="Font Size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="-2">12</SelectItem>
            <SelectItem value="-1">14</SelectItem>
            <SelectItem value="0">16</SelectItem>
            <SelectItem value="1">18</SelectItem>
            <SelectItem value="2">20</SelectItem>
            <SelectItem value="3">22</SelectItem>
            <SelectItem value="4">24</SelectItem>
            <SelectItem value="5">26</SelectItem>
            <SelectItem value="6">28</SelectItem>
          </SelectContent>
        </Select>

        {showOptimizer && (
          <Button
            onClick={() => {
              toast.info("Under Development");
            }}
          >
            Optimize <WandSparkles />
          </Button>
        )}
      </div>

      <div
        className="relative h-full w-full overflow-auto bg-black/70 p-2"
        ref={parentRef}
      >
        {pageArray.map((pageValue, pageIndex) => (
          <RenderedPage
            key={pageIndex}
            pageRef={pageRef}
            childRef={childRef}
            pageIndex={pageIndex}
            pageSize={pageSize}
            pageValue={pageValue}
            headerRef={headerRef}
          />
        ))}
      </div>
    </div>
  );
}

const RenderedPage = ({
  pageIndex,
  pageSize,
  pageRef,
  childRef,
  pageValue,
  headerRef,
}: RenderedPageProps) => {
  const fields = useQuestionBuilderStore((state) => state.fields);
  const headerLayout = usePageSettingsStore((state) => state.headerLayout);
  const currentFontSize = usePageSettingsStore(
    (state) => state.currentFontSize,
  );

  return (
    <div
      ref={pageRef}
      className={`${pageDimensions[pageSize]} mx-auto mb-3 border border-gray-300 bg-white box-decoration-clone p-6 shadow-md transition-transform duration-100 ease-in-out`}
    >
      {pageIndex === 0 && layoutDict(headerRef, headerLayout)}

      <div className="flex w-full flex-col gap-3">
        {pageValue.map((field) => {
          if (pageValue.find((item) => item.categoryId === field.categoryId))
            return (
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
                    ({field.questions.length} x {field.categoryMarks}) ={" "}
                    {field.questions.length * Number(field.categoryMarks) || 1}
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
            );
        })}
      </div>

      <div className="invisible flex w-full flex-col gap-3" ref={childRef}>
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
                ({field.questions.length} x {field.categoryMarks}) ={" "}
                {field.questions.length * Number(field.categoryMarks) || 1}
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
