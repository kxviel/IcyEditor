import { useQuestionBuilderStore } from "@/store/useQuestionBuilderStore";
import { useGetQuestions } from "./api/getQuestions";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type Props = {
  chapterIds: string[];
};

const QuestionList = ({ chapterIds }: Props) => {
  const fields = useQuestionBuilderStore((state) => state.fields);
  const addQuestion = useQuestionBuilderStore((state) => state.addQuestion);

  // const { questionList, setQuestionList } = useQuestionListStore(
  //   (state) => state,
  // );

  // const { data: questionResponse } = useGetQuestions(chapterIds);

  // useEffect(() => {
  //   if (questionResponse) {
  //     setQuestionList(questionResponse);
  //   }
  // }, [questionResponse, setQuestionList]);

  const { data: questionList } = useGetQuestions(chapterIds);

  return (
    <div className="custom_scrollbar mt-2 h-full overflow-y-auto">
      <Accordion
        type="single"
        collapsible
        className="w-full"
        defaultValue="item-1"
      >
        {questionList?.categories?.map(
          ({ categoryId, categoryName, questions }, i) => (
            <AccordionItem value={`item-${i + 1}`} key={categoryId}>
              <AccordionTrigger className="flex w-full items-center gap-4 bg-slate-50 px-8">
                {categoryName}
                <Badge
                  variant="outline"
                  className="ml-auto whitespace-nowrap border border-[#E9D7FE] text-[#6941C6]"
                >
                  {questions.length} Questions
                </Badge>
              </AccordionTrigger>

              <AccordionContent>
                {questions.map((question) => (
                  <div
                    key={question.id}
                    className="flex items-center gap-4 border-b border-gray-100 bg-white p-4 hover:cursor-pointer hover:bg-white/50"
                    onClick={() =>
                      addQuestion(categoryId, categoryName, {
                        questionId: question.id,
                        questionText: question.QUESTION_DATA,
                        ANSWER_DATA: question.ANSWER_DATA,
                        CATEGORY_ID: question.CATEGORY_ID,
                        CHAPTER_ID: question.CHAPTER_ID,
                        FILE_ID: question.FILE_ID,
                        REASON: question.REASON,
                        REMARKS: question.REMARKS,
                        STAGE: question.STAGE,
                        type: question.type,
                      })
                    }
                  >
                    <Checkbox
                      className="border-slate-400"
                      checked={
                        fields
                          .get(categoryId)
                          ?.questions?.some(
                            (q) => q.questionId === question.id,
                          ) || false
                      }
                    />
                    <p
                      className="select-none text-sm"
                      dangerouslySetInnerHTML={{
                        __html: question.QUESTION_DATA,
                      }}
                    />
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
          ),
        )}
      </Accordion>
    </div>
  );
};

export default QuestionList;
