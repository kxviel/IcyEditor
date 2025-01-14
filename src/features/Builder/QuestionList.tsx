import { useQuestionBuilderStore } from "@/store/useQuestionBuilderStore";
import { chapters } from "./data";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const QuestionList = () => {
  const fields = useQuestionBuilderStore((state) => state.fields);
  const addQuestion = useQuestionBuilderStore((state) => state.addQuestion);
  console.log(fields);

  return (
    <div className="flex h-full w-1/2 flex-col px-6">
      <div className="flex items-center justify-center gap-6 bg-white px-4 py-6">
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Theme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
            <SelectItem value="system">System</SelectItem>
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Theme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
            <SelectItem value="system">System</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {chapters.map((chapter) => (
        <div
          key={chapter.id}
          className="flex items-center gap-2 border-b border-gray-100 bg-white p-4 hover:cursor-pointer hover:bg-white/50"
          style={
            fields.some((f) => f.id === chapter.id) ? { background: "red" } : {}
          }
          onClick={() => addQuestion({ id: chapter.id, value: chapter.NAME })}
        >
          <p className="text-2xl font-semibold">{chapter.NAME}</p>
          <p className="text-gray-500">{chapter.STATUS}</p>
        </div>
      ))}
    </div>
  );
};

export default QuestionList;
