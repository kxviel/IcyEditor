import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PaperHeader from "@/features/Builder/PaperHeader";
import { useQuestionBuilderStore } from "@/store/useQuestionBuilderStore";
import { createLazyFileRoute } from "@tanstack/react-router";
import { Fragment, useRef, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFontSizeStore } from "@/store/useFontSizeStore";

export const Route = createLazyFileRoute("/_auth/preview")({
  component: () => (
    <div className="h-[calc(100vh-72px)] w-full bg-[#F9F5FF]">
      <div className="mx-auto h-full max-w-screen-xl">
        <Preview />
      </div>
    </div>
  ),
});

function Preview() {
  const pageRef = useRef<HTMLDivElement>(null);
  const lastElementRef = useRef<HTMLDivElement>(null);

  const currentFontSize = useFontSizeStore((state) => state.currentFontSize);
  const setFontSize = useFontSizeStore((state) => state.setFontSize);

  const [duplicateCapacity, setDuplicateCapacity] = useState(0);
  const [activeTab, setActiveTab] = useState("1");

  const calcFn = () => {
    if (pageRef.current && lastElementRef.current) {
      // Page = EmptySpace + Content
      // therefore if: EmptySpace > Page - Content then: Duplicate Content else: move on

      const totalPageHeight = pageRef.current.getBoundingClientRect().height;
      const parentTop = pageRef.current.getBoundingClientRect().top;
      const lastContent = lastElementRef.current.getBoundingClientRect().bottom;
      const heightToLastContent = lastContent - parentTop;

      console.log(
        totalPageHeight,
        heightToLastContent,
        "duplicate capacity: ",
        Math.round(totalPageHeight / heightToLastContent),
      );

      setDuplicateCapacity(Math.round(totalPageHeight / heightToLastContent));
    }
  };

  const calcFontSize = (value: string) => {
    setFontSize(value);
  };

  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 py-6">
      <Tabs
        defaultValue="login"
        value={activeTab}
        onValueChange={(value) => {
          setActiveTab(value);
          calcFn();
        }}
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
        <Select>
          <SelectTrigger className="w-[180px] bg-white">
            <SelectValue placeholder="Paper Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">A4</SelectItem>
            <SelectItem value="2">A3</SelectItem>
            <SelectItem value="3">A2</SelectItem>
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

      <div className="custom_scrollbar w-fit overflow-y-auto">
        <A4Page
          pageRef={pageRef}
          lastElementRef={lastElementRef}
          duplicateCapacity={duplicateCapacity}
        />
      </div>
    </div>
  );
}

const A4Page = ({
  pageRef,
  lastElementRef,
  duplicateCapacity,
}: {
  pageRef: React.RefObject<HTMLDivElement>;
  lastElementRef: React.RefObject<HTMLDivElement>;
  duplicateCapacity: number;
}) => {
  const fields = useQuestionBuilderStore((state) => state.fields);
  const currentFontSize = useFontSizeStore((state) => state.currentFontSize);

  return (
    <div
      className="mx-auto h-[297mm] w-[210mm] border border-gray-300 bg-white p-6 shadow-md"
      ref={pageRef}
    >
      {Array(duplicateCapacity === 0 ? 1 : duplicateCapacity)
        .fill(0)
        .map((_, i) => (
          <Fragment key={i}>
            <PaperHeader />

            <div className="flex w-full flex-col gap-3">
              {Object.values(fields).map((field, fieldIndex) => (
                <div
                  className="w-full"
                  key={field.categoryId}
                  ref={
                    i === Object.values(fields).length - 1
                      ? lastElementRef
                      : null
                  }
                >
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
              ))}
            </div>

            {/* <div className="flex w-full flex-col gap-3">
              {fields.map((question, i) => (
                <div
                  className="h-10 w-full bg-slate-200"
                  key={question.id}
                 
                >
                  <p style={{ fontSize: 16 + Number(currentFontSize) }}>
                    {question.value}
                  </p>
                </div>
              ))}
            </div> */}
          </Fragment>
        ))}
    </div>
  );
};
// const A4Page = () => {
//   return (
//     <div className="mx-auto h-[297mm] w-[210mm] border border-gray-300 bg-white p-6 shadow-md">
//       Ass
//     </div>
//   );
// };
