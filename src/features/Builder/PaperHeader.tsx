import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useFontSizeStore } from "@/store/useFontSizeStore";
import { useHeaderStore } from "@/store/useHeaderStore";

const PaperHeader = ({ isPreview }: { isPreview?: boolean }) => {
  const fields = useHeaderStore((state) => state.headerData);
  const currentFontSize = useFontSizeStore((state) => state.currentFontSize);
  const setValue = useHeaderStore((state) => state.setValue);
  const setIsEditing = useHeaderStore((state) => state.setIsEditing);

  return (
    <div className="flex w-full flex-col items-center">
      {!fields.schoolName.isEditing ? (
        <p
          className="font-semibold"
          // className="text-xl font-semibold"
          style={{ fontSize: 20 + Number(currentFontSize) }}
          onClick={() => setIsEditing("schoolName", true)}
        >
          {fields.schoolName.value}
        </p>
      ) : (
        <Input
          className="w-full text-xl font-semibold"
          placeholder="Enter Institution Name"
          value={fields.schoolName.value}
          onBlur={() => setIsEditing("schoolName", false)}
          onChange={(e) => setValue("schoolName", e.target.value)}
        />
      )}

      {!fields.examName.isEditing ? (
        <p
          className="mt-1 font-medium"
          style={{ fontSize: 16 + Number(currentFontSize) }}
          onClick={() => setIsEditing("examName", true)}
        >
          {fields.examName.value}
        </p>
      ) : (
        <Input
          className="mt-1 w-full font-medium"
          placeholder="Enter Exam/Session Name"
          value={fields.examName.value}
          onBlur={() => setIsEditing("examName", false)}
          onChange={(e) => setValue("examName", e.target.value)}
        />
      )}

      <div className="mt-3 flex w-full items-center justify-between">
        {!fields.subjectName.isEditing ? (
          <p
            // className="text-[13px]"
            style={{ fontSize: 13 + Number(currentFontSize) }}
            onClick={() => setIsEditing("subjectName", true)}
          >
            Course Name: {fields.subjectName.value}
          </p>
        ) : (
          <Input
            className="w-[200px] text-[13px]"
            placeholder="Enter Class Name"
            value={fields.subjectName.value}
            onBlur={() => setIsEditing("subjectName", false)}
            onChange={(e) => setValue("subjectName", e.target.value)}
          />
        )}

        {!fields.duration.isEditing ? (
          <p
            // className="text-[13px]"
            style={{ fontSize: 13 + Number(currentFontSize) }}
            onClick={() => setIsEditing("duration", true)}
          >
            Duration: {fields.duration.value}
          </p>
        ) : (
          <Input
            className="w-[200px] text-[13px]"
            placeholder="Enter Duration"
            value={fields.duration.value}
            onBlur={() => setIsEditing("duration", false)}
            onChange={(e) => setValue("duration", e.target.value)}
          />
        )}
      </div>

      <div className="mt-1 flex w-full items-center justify-between">
        {!fields.date.isEditing ? (
          <p
            // className="text-[13px]"
            style={{ fontSize: 13 + Number(currentFontSize) }}
            onClick={() => setIsEditing("date", true)}
          >
            Duration: {fields.date.value}
          </p>
        ) : (
          <Input
            className="w-[200px] text-[13px]"
            placeholder="Enter Date"
            value={fields.duration.value}
            onBlur={() => setIsEditing("date", false)}
            onChange={(e) => setValue("date", e.target.value)}
          />
        )}
        {!fields.totalMarks.isEditing ? (
          <p
            // className="text-[13px]"
            style={{ fontSize: 13 + Number(currentFontSize) }}
            onClick={() => setIsEditing("totalMarks", true)}
          >
            Duration: {fields.totalMarks.value}
          </p>
        ) : (
          <Input
            className="w-[200px] text-[13px]"
            placeholder="Enter Total Marks"
            value={fields.duration.value}
            onBlur={() => setIsEditing("totalMarks", false)}
            onChange={(e) => setValue("totalMarks", e.target.value)}
          />
        )}
      </div>

      <div className="w-full">
        <p
          className="mt-4 font-semibold"
          style={{ fontSize: 16 + Number(currentFontSize) }}
        >
          Instructions:{" "}
        </p>
        {!fields.instructions.isEditing ? (
          <div
            className="whitespace-pre-wrap"
            // className="whitespace-pre-wrap text-xs"
            style={{ fontSize: 12 + Number(currentFontSize) }}
            onClick={() => setIsEditing("instructions", true)}
          >
            {fields.instructions.value}
          </div>
        ) : (
          <Textarea
            className="w-full rounded border bg-white p-2 text-xs text-black"
            placeholder="Enter Instructions"
            value={fields.instructions.value}
            onBlur={() => setIsEditing("instructions", false)}
            onChange={(e) => setValue("instructions", e.target.value)}
            rows={4}
          />
        )}
      </div>

      <div className="mb-3 mt-6 h-[1px] w-full bg-black" />
    </div>
  );
};

export default PaperHeader;
