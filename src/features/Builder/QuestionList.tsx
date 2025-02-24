import { useQuestionBuilderStore } from "@/store/useQuestionBuilderStore";
import { useGetQuestionList } from "./api/getQuestionTitles";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

const QuestionList = () => {
  const fields = useQuestionBuilderStore((state) => state.fields);
  const chapterId = useQuestionBuilderStore((state) => state.chapterId);
  const addQuestion = useQuestionBuilderStore((state) => state.addQuestion);

  //Questions
  const { data: questionList } = useGetQuestionList(
    chapterId ? chapterId.toString() : "",
  );

  return (
    <div className="custom_scrollbar flex flex-col gap-2 overflow-y-scroll">
      {questionList?.categories?.map(
        ({ categoryId, categoryName, questions }) => (
          <div key={categoryId} className="">
            <div className="my-3 flex items-center gap-4 px-8">
              <p className="font-semibold">{categoryName}</p>
              <Badge
                variant="outline"
                className="whitespace-nowrap border border-[#E9D7FE] text-[#6941C6]"
              >
                {questions.length} Questions
              </Badge>
            </div>

            {questions.map((question) => (
              <div
                key={question.id}
                className="flex items-center gap-4 border-b border-gray-100 bg-white p-4 hover:cursor-pointer hover:bg-white/50"
                onClick={() =>
                  addQuestion(categoryId, categoryName, {
                    questionId: question.id,
                    questionText: question.QUESTION_DATA,
                  })
                }
              >
                <Checkbox
                  className="border-slate-400"
                  checked={
                    fields[categoryId]?.questions?.some(
                      (q) => q.questionId === question.id,
                    ) || false
                  }
                />
                <p
                  className="text-sm"
                  dangerouslySetInnerHTML={{
                    __html: question.QUESTION_DATA,
                  }}
                />
              </div>
            ))}
          </div>
        ),
      )}
    </div>
  );
};

export default QuestionList;
