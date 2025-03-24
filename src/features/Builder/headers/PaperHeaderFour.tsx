import EditableField from "../shared/EditableField";

const PaperHeaderFour = ({
  isPreview = false,
  headerRef,
}: {
  isPreview?: boolean;
  headerRef?: React.RefObject<HTMLDivElement>;
}) => {
  return (
    <div
      className="mb-1 flex w-full gap-2 border-b border-black"
      ref={headerRef}
    >
      <div className="flex h-full w-1/4 flex-col justify-evenly gap-1 p-4 leading-5">
        <p>Name:</p>
        <p>Grade:</p>
        <EditableField
          headerId="subjectName"
          fontSize={14}
          fontWeight={500}
          isPreview={isPreview}
        />
        <p>Roll No.:</p>
      </div>
      <div className="flex h-full w-3/4 flex-col gap-1 border-l border-black p-4 leading-4">
        <EditableField
          headerId="schoolName"
          fontSize={26}
          fontWeight={700}
          isPreview={isPreview}
        />
        <EditableField
          headerId="examName"
          fontSize={16}
          fontWeight={500}
          isPreview={isPreview}
        />
        <EditableField
          headerId="totalMarks"
          prefix="Marks: "
          fontSize={14}
          fontWeight={400}
          isPreview={isPreview}
        />
        <EditableField
          headerId="duration"
          prefix="Duration: "
          fontSize={14}
          fontWeight={400}
          isPreview={isPreview}
        />
      </div>
    </div>
  );
};

export default PaperHeaderFour;
