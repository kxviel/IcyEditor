import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetQuestions } from "./api/getQuestions";
import { Input } from "@/components/ui/input";
import { useGenerateQuestions } from "./api/generateQuestions";
import { useFieldArray, useForm } from "react-hook-form";
import { useEffect } from "react";
type Props = {
  chapterIds: string[];
};

const QuestionSelect = ({ chapterIds }: Props) => {
  const navigate = useNavigate();
  const autoGenerate = useGenerateQuestions();

  const { data: questionList } = useGetQuestions(chapterIds);

  const { control, register, watch, setValue } = useForm({
    defaultValues: {
      categories:
        questionList?.categories.map((category) => ({
          categoryId: category.categoryId,
          categoryName: category.categoryName,
          questionCount: "",
        })) || [],
    },
  });

  const { fields } = useFieldArray({
    control,
    name: "categories",
  });

  useEffect(() => {
    if (questionList) {
      setValue(
        "categories",
        questionList?.categories.map((category) => ({
          categoryId: category.categoryId,
          categoryName: category.categoryName,
          questionCount: "",
        })),
      );
    }
  }, [questionList, setValue]);

  const handleBack = () => {
    navigate({ to: "/exam-type" });
  };

  const handleNext = () => {
    const count = watch("categories")?.reduce((total, category) => {
      const count = Number(category.questionCount) || 0;
      return total + count;
    }, 0);

    autoGenerate.mutate({
      chapterIds: chapterIds.map((id) => Number(id)),
      questionCount: count,
    });
  };

  return (
    <div className="relative h-full w-1/2">
      <div className="custom_scrollbar h-[calc(100%-56px)] w-full overflow-y-auto bg-white p-3 shadow-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Section Name</TableHead>
              <TableHead>Question Count</TableHead>
              <TableHead>Required Questions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fields.map((field, index) => (
              <TableRow key={field.id}>
                <TableCell className="font-medium">
                  {questionList?.categories[index].categoryName}
                </TableCell>
                <TableCell>
                  {questionList?.categories[index].questionCount}
                </TableCell>
                <TableCell>
                  <Input {...register(`categories.${index}.questionCount`)} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
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
