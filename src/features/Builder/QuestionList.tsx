import { useQuestionBuilderStore } from "@/store/useQuestionBuilderStore";
import { useGetQuestions } from "./api/getQuestions";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
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

  const { data: questionList, isPending } = useGetQuestions(chapterIds);

  const handleQuestionToggle = (
    categoryId: string,
    categoryName: string,
    question: any,
  ) => {
    addQuestion(categoryId?.toString(), categoryName, {
      questionId: question.id,
      questionText: question.QUESTION_DATA,
      ANSWER_DATA: question.ANSWER_DATA,
      CATEGORY_ID: question.CATEGORY_ID?.toString(),
      CHAPTER_ID: question.CHAPTER_ID,
      FILE_ID: question.FILE_ID,
      REASON: question.REASON,
      REMARKS: question.REMARKS,
      STAGE: question.STAGE,
      type: question.type,
    });
  };

  // Loading state
  if (isPending) {
    return (
      <div className="custom_scrollbar mt-2 h-full overflow-y-auto">
        <div className="space-y-4 p-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <div className="ml-4 space-y-2">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Empty state
  if (!questionList?.categories || questionList.categories.length === 0) {
    return (
      <div className="custom_scrollbar mt-2 h-full overflow-y-auto">
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <p className="mb-2 text-gray-500">No questions found</p>
            <p className="text-sm text-gray-400">
              Try selecting different chapters or check back later
            </p>
          </div>
        </div>
      </div>
    );
  }

  console.log(fields);

  return (
    <div className="custom_scrollbar mt-2 h-full overflow-y-auto">
      <Accordion
        type="single"
        collapsible
        className="w-full"
        defaultValue="item-1"
      >
        {questionList.categories.map(
          ({ categoryId, categoryName, questions }, i) => (
            <AccordionItem value={`item-${i + 1}`} key={categoryId}>
              <AccordionTrigger className="flex w-full items-center gap-4 bg-slate-50 px-8 hover:bg-slate-100">
                <span className="font-medium">{categoryName}</span>
                <Badge
                  variant="outline"
                  className="ml-auto whitespace-nowrap border border-[#E9D7FE] bg-[#F9F5FF] text-[#6941C6]"
                >
                  {questions.length} Question{questions.length !== 1 ? "s" : ""}
                </Badge>
              </AccordionTrigger>
              <AccordionContent className="pb-0">
                {questions.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    No questions available in this category. Please try a
                    different combination.
                  </div>
                ) : (
                  questions.map((question) => {
                    const isChecked =
                      fields
                        .get(categoryId.toString())
                        ?.questions?.some(
                          (q) => q.questionId === question.id,
                        ) || false;
                    return (
                      <div
                        key={question.id}
                        className="flex cursor-pointer items-start gap-4 border-b border-gray-100 bg-white p-4 transition-colors hover:bg-gray-50"
                        onClick={() => {
                          handleQuestionToggle(
                            categoryId,
                            categoryName,
                            question,
                          );
                        }}
                      >
                        <Checkbox
                          className="mt-1 border-slate-400"
                          checked={isChecked}
                        />
                        <div className="min-w-0 flex-1">
                          <div
                            className="select-none text-sm leading-relaxed"
                            dangerouslySetInnerHTML={{
                              __html:
                                question.QUESTION_DATA ||
                                "Question text not available",
                            }}
                          />
                          {question.type && (
                            <Badge variant="secondary" className="mt-2 text-xs">
                              {question.type}
                            </Badge>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </AccordionContent>
            </AccordionItem>
          ),
        )}
      </Accordion>
    </div>
  );
};

export default QuestionList;
