import { Button } from "@/components/ui/button";

// A3: [841.89, 1190.55],
// A4: [595.28, 841.89],
// A5: [419.53, 595.28],
// A6: [297.64, 419.53],

const PaperView = () => {
  return (
    <div className="flex h-full w-1/2 flex-col items-center space-y-4 p-4">
      <div className="flex items-center gap-2">
        <Button>Font Size</Button>
        <Button>Page Size</Button>
      </div>

      <div className="h-full w-full space-y-4 overflow-y-scroll">
        <div className="flex h-full w-full flex-col items-center space-y-4 bg-white p-4">
          <p className="text-2xl">Click for School Name</p>
          <p className="text-xl">Click for Exam/Session Name</p>
          <p>Click for Class Name</p>
          <p>Click for Subject Name</p>

          <div className="self-end">
            <p>Duration: 1hr 30min</p>
          </div>

          <div className="h-[1px] w-full bg-black" />
          <div className="flex w-full items-center gap-3">
            <p>Name: __________________</p>
            <p>Roll No.: __________________</p>
          </div>
          <div className="h-[1px] w-full bg-black" />
        </div>
      </div>
    </div>
  );
};

export default PaperView;
