import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CategoryItem,
  useQuestionBuilderStore,
} from "@/store/useQuestionBuilderStore";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFontSizeStore } from "@/store/useFontSizeStore";
import PaperHeaderOne from "@/features/Builder/PaperHeaders/PaperHeaderOne";
import PaperHeaderTwo from "@/features/Builder/PaperHeaders/PaperHeaderTwo";
import PaperHeaderThree from "@/features/Builder/PaperHeaders/PaperHeaderThree";
import { useZoomPan } from "@/hooks/useZoomPan";

const pageDimensions: Record<string, string> = {
  // A1: "h-[841mm] w-[594mm]",
  // A2: "h-[594mm] w-[420mm]",
  A3: "h-[420mm] w-[297mm]",
  A4: "h-[297mm] w-[210mm]",
  A5: "h-[210mm] w-[148mm]",
  // A6: "h-[148mm] w-[105mm]",
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
  scale: number;
  activeTab: string;
  position: {
    x: number;
    y: number;
  };
  pageValue: CategoryItem[];
  dontShow: boolean;
};

function Preview() {
  const { scale, position, parentRef } = useZoomPan();
  const pageRef = useRef<HTMLDivElement>(null);
  const childRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  const fields = useQuestionBuilderStore((state) => state.fields);
  const currentFontSize = useFontSizeStore((state) => state.currentFontSize);
  const setFontSize = useFontSizeStore((state) => state.setFontSize);

  const [pageSize, setPageSize] = useState("A4");
  const [activeTab, setActiveTab] = useState("1");
  const [dontShow, setDontShow] = useState(false);

  const calcFontSize = (value: string) => {
    setFontSize(value);
  };

  const [pageArray, setPageArray] = useState<CategoryItem[][]>([[]]);

  useEffect(() => {
    let totalPageHeight: number = 0;
    let currentChildHeight: number = 0;
    let currentPageIndex: number = 0;

    if (pageRef.current) {
      totalPageHeight =
        pageRef.current.getBoundingClientRect().height - 12 - 24;
      if (currentPageIndex === 0 && headerRef.current) {
        totalPageHeight -= headerRef.current.getBoundingClientRect().height - 8;
      }
      console.log("totalPageHeight: ", totalPageHeight);
      console.log("currentFontSize: ", currentFontSize);

      if (childRef.current) {
        [...childRef.current.children].forEach((child, index) => {
          currentChildHeight += child.getBoundingClientRect().height;
          console.log("currentChildHeight: ", currentChildHeight);

          const currentField = fields[Object.keys(fields)[index]];

          if (currentChildHeight < totalPageHeight) {
            setPageArray((page) => {
              if (page[currentPageIndex]) {
                page[currentPageIndex].push(currentField);
              } else {
                page[currentPageIndex] = [currentField];
              }
              return page;
            });
          } else {
            currentPageIndex += 1;
            currentChildHeight = 0;

            setPageArray((page) => [...page, [currentField]]);
          }
        });
      }
    }
  }, [fields, currentFontSize]);

  return (
    <div className="flex h-full flex-col items-center gap-6 py-6">
      <Tabs
        defaultValue="login"
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex flex-col items-center justify-center"
      >
        <TabsList className="w-[632px]">
          <TabsTrigger value="1" className="w-full">
            Layout 1
          </TabsTrigger>
          <TabsTrigger value="2" className="w-full">
            Layout 2
          </TabsTrigger>
          <TabsTrigger value="3" className="w-full">
            Layout 3
          </TabsTrigger>
        </TabsList>
      </Tabs>

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
            scale={scale}
            position={position}
            activeTab={activeTab}
            pageValue={pageValue}
            dontShow={dontShow}
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
  // scale,
  // position,
  activeTab,
  pageRef,
  childRef,
  pageValue,
  dontShow,
  headerRef,
}: RenderedPageProps) => {
  const fields = useQuestionBuilderStore((state) => state.fields);
  const currentFontSize = useFontSizeStore((state) => state.currentFontSize);

  return (
    <div
      ref={pageRef}
      className={`${pageDimensions[pageSize]} mx-auto mb-3 border border-gray-300 bg-white box-decoration-clone p-6 shadow-md transition-transform duration-100 ease-in-out`}
      // style={{
      //   transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
      // }}
    >
      {pageIndex === 0 &&
        (activeTab === "1" ? (
          <PaperHeaderOne isPreview={true} headerRef={headerRef} />
        ) : activeTab === "2" ? (
          <PaperHeaderTwo isPreview={true} headerRef={headerRef} />
        ) : (
          <PaperHeaderThree isPreview={true} headerRef={headerRef} />
        ))}

      <div className="flex w-full flex-col gap-3">
        {pageValue.map((field, fieldIndex) => {
          if (pageValue.find((item) => item.categoryId === field.categoryId))
            return (
              <div className="w-full" key={field.categoryId}>
                <div className="my-3 flex gap-2">
                  <p
                    className="font-semibold text-gray-800"
                    style={{ fontSize: 16 + Number(currentFontSize) }}
                  >
                    Q{fieldIndex + 1}.
                  </p>
                  <p
                    className="font-semibold text-gray-800"
                    style={{ fontSize: 16 + Number(currentFontSize) }}
                  >
                    {field.categoryName}
                  </p>

                  <p
                    className="ml-auto"
                    style={{ fontSize: 14 + Number(currentFontSize) }}
                  >
                    (1 x {field.questions.length}) = 5
                  </p>
                </div>

                {field.questions.map((question, index) => (
                  <div key={question.questionId} className="my-3 flex gap-2">
                    <p
                      className="font-semibold text-gray-800"
                      style={{ fontSize: 14 + Number(currentFontSize) }}
                    >
                      {index + 1}.
                    </p>
                    <p
                      className="text-gray-700"
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

      {!dontShow && (
        <div className="invisible flex w-full flex-col gap-3" ref={childRef}>
          {Object.values(fields).map((field, fieldIndex) => {
            return (
              <div className="w-full" key={field.categoryId}>
                <div className="my-3 flex gap-2">
                  <p
                    className="font-semibold text-gray-800"
                    style={{ fontSize: 16 + Number(currentFontSize) }}
                  >
                    Q{fieldIndex + 1}.
                  </p>
                  <p
                    className="font-semibold text-gray-800"
                    style={{ fontSize: 16 + Number(currentFontSize) }}
                  >
                    {field.categoryName}
                  </p>

                  <p
                    className="ml-auto"
                    style={{ fontSize: 14 + Number(currentFontSize) }}
                  >
                    (1 x {field.questions.length}) = 5
                  </p>
                </div>

                {field.questions.map((question, index) => (
                  <div key={question.questionId} className="my-3 flex gap-2">
                    <p
                      className="font-semibold text-gray-800"
                      style={{ fontSize: 14 + Number(currentFontSize) }}
                    >
                      {index + 1}.
                    </p>
                    <p
                      className="text-gray-700"
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
      )}
    </div>
  );
};
