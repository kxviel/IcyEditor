import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuestionBuilderStore } from "@/store/useQuestionBuilderStore";
import { createLazyFileRoute } from "@tanstack/react-router";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
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
import { Button } from "@/components/ui/button";

const pageDimensions: Record<string, string> = {
// A1: "h-[841mm] w-[594mm]",
// A2: "h-[594mm] w-[420mm]",
A3: "h-[420mm] w-[297mm]",
A4: "h-[297mm] w-[210mm]",
A5: "h-[210mm] w-[148mm]",
// A6: "h-[148mm] w-[105mm]",
};

const pageHeaders: Record<string, React.ReactNode> = {
"1": <PaperHeaderOne isPreview={true} />,
"2": <PaperHeaderTwo isPreview={true} />,
"3": <PaperHeaderThree isPreview={true} />,
};

export const Route = createLazyFileRoute("/\_auth/preview")({
component: () => (
<div className="h-[calc(100vh-72px)] w-full bg-[#F9F5FF]">
<div className="mx-auto h-full max-w-screen-xl">
<Preview />
</div>
</div>
),
});

function Preview() {
const [scale, setScale] = useState(1);
const [position, setPosition] = useState({ x: 0, y: 0 });
const minScale = 0.2;
const maxScale = 3;
const scaleStep = 0.1;
const scrollStep = 20;
const parentRef = useRef<HTMLDivElement>(null);
const pageRef = useRef<HTMLDivElement>(null);
const lastElementRef = useRef<HTMLDivElement>(null);

const currentFontSize = useFontSizeStore((state) => state.currentFontSize);
const setFontSize = useFontSizeStore((state) => state.setFontSize);
const [pageSize, setPageSize] = useState("A4");
const [duplicateCapacity, setDuplicateCapacity] = useState(0);
const [activeTab, setActiveTab] = useState("1");

const handleWheel = useCallback(
(event: WheelEvent) => {
if (event.ctrlKey) {
event.preventDefault();

        if (event.deltaY < 0) {
          setScale((prevScale) => Math.min(prevScale + scaleStep, maxScale));
        } else {
          setScale((prevScale) => Math.max(prevScale - scaleStep, minScale));
        }
      } else if (event.shiftKey) {
        event.preventDefault();
        const newX = position.x + (event.deltaY > 0 ? -scrollStep : scrollStep);
        setPosition((prev) => ({ ...prev, x: newX }));
      }
    },
    [position],

);

useEffect(() => {
if (parentRef.current) {
const element = parentRef.current;
if (element) {
parentRef.current.addEventListener(
"wheel",
handleWheel as EventListener,
{ passive: false },
);
}

      return () => {
        element.removeEventListener("wheel", handleWheel as EventListener);
      };
    }

}, [handleWheel, position]);

const calcFontSize = (value: string) => {
setFontSize(value);
};

const calcFn = () => {
if (pageRef.current && lastElementRef.current) {
// Page = EmptySpace + Content
// therefore if: EmptySpace > Page - Content then: Duplicate Content else: move on
// man im a genius hehe

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

        <Button onClick={calcFn} disabled>
          Duplicate (Under Construction)
        </Button>
      </div>

      <div
        className="relative h-full w-full overflow-auto bg-black/70 p-2"
        ref={parentRef}
      >
        <RenderedPage
          pageSize={pageSize}
          pageRef={pageRef}
          lastElementRef={lastElementRef}
          duplicateCapacity={duplicateCapacity}
          scale={scale}
          position={position}
          activeTab={activeTab}
        />
        {/* <A4Page pageSize={pageSize as PageProps["size"]} /> */}
      </div>
    </div>

);
}

type RenderedPageProps = {
pageSize: string;
pageRef: React.RefObject<HTMLDivElement>;
lastElementRef: React.RefObject<HTMLDivElement>;
duplicateCapacity: number;
scale: number;
activeTab: string;
position: {
x: number;
y: number;
};
};

const RenderedPage = ({
pageSize,
pageRef,
lastElementRef,
duplicateCapacity,
scale,
position,
activeTab,
}: RenderedPageProps) => {
const fields = useQuestionBuilderStore((state) => state.fields);
const currentFontSize = useFontSizeStore((state) => state.currentFontSize);

return (
<div
ref={pageRef}
className={`${pageDimensions[pageSize]} mx-auto border border-gray-300 bg-white p-6 shadow-md transition-transform duration-100 ease-in-out`}
style={{
        transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
      }} >
{Array(duplicateCapacity === 0 ? 1 : duplicateCapacity)
.fill(0)
.map((\_, i) => (
<Fragment key={i}>
{pageHeaders[activeTab]}

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
          </Fragment>
        ))}
    </div>

);
};

// const sx = StyleSheet.create({
// page: {
// width: "100%",
// flexDirection: "column",
// backgroundColor: "#fff",
// },
// section: {
// margin: 10,
// padding: 10,
// flexGrow: 1,
// fontSize: 12,
// },
// root: {
// marginBottom: "3",
// display: "flex",
// width: "full",
// flexDirection: "column",
// alignItems: "center",
// gap: "4",
// },
// schoolName: {
// fontSize: 30,
// fontWeight: 700,
// },
// });

// const styles = StyleSheet.create({
// page: {
// padding: 30,
// fontFamily: "Helvetica",
// },
// container: {
// display: "flex",
// flexDirection: "column",
// width: "100%",
// gap: 12,
// },
// categoryContainer: {
// width: "100%",
// marginBottom: 10,
// padding: 12,
// },
// categoryHeader: {
// display: "flex",
// flexDirection: "row",
// marginVertical: 8,
// },
// categoryNumberText: {
// fontWeight: "bold",
// color: "#333333",
// fontSize: 12,
// marginRight: 6,
// },
// categoryNameText: {
// fontWeight: "bold",
// color: "#333333",
// fontSize: 12,
// },
// pointsText: {
// fontSize: 10,
// marginLeft: "auto",
// },
// questionContainer: {
// display: "flex",
// flexDirection: "row",
// marginVertical: 8,
// paddingVertical: 4,
// paddingHorizontal: 2,
// },
// questionNumberText: {
// fontSize: 10,
// fontWeight: "bold",
// color: "#333333",
// marginRight: 6,
// },
// questionContentText: {
// fontSize: 10,
// color: "#4B5563",
// flex: 1,
// },
// });

// const A4Page = ({ pageSize }: { pageSize: PageProps["size"] }) => {
// const item = useHeaderStore((state) => state.headerData);
// const fields = useQuestionBuilderStore((state) => state.fields);
// const currentFontSize = useFontSizeStore((state) => state.currentFontSize);

// return (
// <PDFViewer width="100%" height="100%">
// <Document pageMode="fullScreen" pageLayout="singlePage">
// <Page size={pageSize} style={sx.page}>
// <PaperHeaderEinz item={item} currentFontSize={currentFontSize} />
// {Object.values(fields).map((field, fieldIndex) => (
// <View style={styles.categoryContainer} key={field.categoryId}>
// <View style={styles.categoryHeader}>
// <Text style={styles.categoryNumberText}>
// Q{fieldIndex + 1}.
// </Text>
// <Text style={styles.categoryNameText}>
// {field.categoryName}
// </Text>
// <Text style={styles.pointsText}>
// (1 x {field.questions.length}) = 5
// </Text>
// </View>

// {field.questions.map((question, index) => {
// const parsedHtml = htmlParser(question.questionText);
// return (
// <View
// key={question.questionId}
// style={styles.questionContainer}
// wrap={true}
// >
// <Text style={styles.questionNumberText}>{index + 1}.</Text>
// {/_ For basic text content without HTML _/}
// {/_ <Text style={styles.questionContentText}>
// {question.questionText.replace(/<[^>]_>?/gm, "")}
// </Text> _/}
// {/_ {parsedHtml} _/}
// <Html stylesheet={boo}>{question.questionText}</Html>
// {/_ If you need HTML support, you would use: _/}
// {/_ <Html style={styles.questionContentText}>
// {question.questionText}
// </Html> \*/}
// </View>
// );
// })}
// </View>
// ))}
// </Page>
// </Document>
// </PDFViewer>
// );
// };
