import EditableField from "./EditableField";

const PaperHeaderOne = ({
  isPreview = false,
  headerRef,
}: {
  isPreview?: boolean;
  headerRef: React.RefObject<HTMLDivElement>;
}) => {
  return (
    <div
      className="mb-2 flex w-full flex-col items-center gap-3"
      ref={headerRef}
    >
      <EditableField
        headerId="schoolName"
        fontSize={30}
        fontWeight={700}
        isPreview={isPreview}
      />
      <EditableField
        headerId="examName"
        fontSize={16}
        fontWeight={500}
        isPreview={isPreview}
      />

      <div className="relative flex w-full items-center justify-between">
        <EditableField
          headerId="duration"
          prefix="Duration: "
          fontSize={14}
          fontWeight={400}
          isPreview={isPreview}
        />
        <EditableField
          headerId="subjectName"
          fontSize={16}
          fontWeight={500}
          inputClassName="w-fit absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          textClassName="w-fit absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          isPreview={isPreview}
        />
        <EditableField
          headerId="totalMarks"
          prefix="Marks: "
          fontSize={14}
          fontWeight={400}
          isPreview={isPreview}
        />
      </div>

      <div className="flex w-full items-center justify-between bg-slate-200 px-2 py-3">
        <p>Name: ____________________</p>
        <p>Class: ____________________</p>
        <p>Roll No.: ____________________</p>
      </div>
    </div>
  );
};

export default PaperHeaderOne;
