import { Checkbox } from "@/components/ui/checkbox";
import { Chapter } from "./api/getChapter";

type Props = {
  chapters: Chapter[];
  selectedChapterIds: string[];
  handleChapters: (chapterId: string) => void;
};

const ChapterList = ({
  chapters,
  selectedChapterIds,
  handleChapters,
}: Props) => {
  return (
    <div className="custom_scrollbar flex flex-col gap-2 overflow-y-scroll">
      {chapters.map((chapter) => (
        <div
          key={chapter.id}
          className="flex items-center gap-4 border-b border-gray-100 bg-white p-4 hover:cursor-pointer hover:bg-white/50"
          onClick={() => handleChapters(chapter.id.toString())}
        >
          <Checkbox
            className="border-slate-400"
            checked={selectedChapterIds?.includes(chapter.id.toString())}
          />
          <p className="select-none text-sm">{chapter.NAME}</p>
        </div>
      ))}
    </div>
  );
};

export default ChapterList;
