import EditableField from "./EditableField";

const PaperHeaderThree = ({ isPreview = false }: { isPreview?: boolean }) => {
  return (
    <div className="mb-3 flex w-full flex-col items-center gap-4">
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

      <div className="flex w-full items-center justify-between border-y-[2px] border-black px-2 py-4">
        <p>Name: ____________________</p>
        <p>Class: __________________</p>
        <p>Roll No.: _______________</p>
      </div>
    </div>
  );
};

export default PaperHeaderThree;
