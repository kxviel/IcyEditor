import { chapters } from "./data";

const QuestionList = () => {
  return (
    <div className="flex h-full w-1/2 flex-col px-6">
      {chapters.map((chapter) => (
        <div
          key={chapter.id}
          className="flex items-center gap-2 border border-gray-200 py-2 hover:cursor-pointer hover:bg-gray-100"
        >
          <p className="text-2xl font-semibold">{chapter.NAME}</p>
          <p className="text-gray-500">{chapter.STATUS}</p>
        </div>
      ))}
    </div>
  );
};

export default QuestionList;
