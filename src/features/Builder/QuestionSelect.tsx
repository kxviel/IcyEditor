import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetQuestions } from "./api/getQuestions";
import { Input } from "@/components/ui/input";
import { useGenerateQuestions } from "./api/generateQuestions";

type Props = {
  chapterIds: string[];
};

const QuestionSelect = ({ chapterIds }: Props) => {
  const navigate = useNavigate();
  const autoGenerate = useGenerateQuestions();

  const { data: questionList } = useGetQuestions(chapterIds);

  const handleBack = () => {
    navigate({ to: "/exam-type" });
  };

  const handleNext = () => {
    autoGenerate.mutate({
      chapterIds: chapterIds.map((id) => Number(id)),
      questionCount: 15,
    });
  };

  return (
    <div className="relative h-full w-1/2">
      <div className="custom_scrollbar h-full w-full overflow-y-auto bg-white p-3 shadow-md">
        <Table>
          <TableCaption>A list of your recent invoices.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Section Name</TableHead>
              <TableHead>Question Count</TableHead>
              <TableHead>Required Questions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {questionList?.categories.map((category) => (
              <TableRow key={category.categoryId}>
                <TableCell className="font-medium">
                  {category.categoryName}
                </TableCell>
                <TableCell>{category.questionCount}</TableCell>
                <TableCell>
                  <Input />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Total Selcted Questions</TableCell>
              <TableCell className="text-right">230</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>

      <div className="absolute bottom-0 flex h-14 w-full items-center gap-4 bg-white px-4">
        <Button variant="outline" className="w-full" onClick={handleBack}>
          Back
        </Button>

        <Button className="w-full" onClick={handleNext}>
          Next
        </Button>
      </div>
    </div>
  );
};

export default QuestionSelect;
