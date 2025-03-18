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
import { SubmitHandler, useForm } from "react-hook-form";
import { useEffect } from "react";
import { toast } from "sonner";

type Props = {
  chapterIds: string[];
};

type FormInputs = Record<string, number>;

const QuestionSelect = ({ chapterIds }: Props) => {
  const navigate = useNavigate();
  const autoGenerate = useGenerateQuestions();
  const { data: questionList, isPending } = useGetQuestions(chapterIds);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormInputs>({
    defaultValues: {},
  });

  // Initialize category data when questionList is loaded
  useEffect(() => {
    if (questionList?.categories && questionList.categories.length > 0) {
      questionList.categories.forEach((category) => {
        setValue(category.categoryId, 0);
      });
    }
  }, [questionList, setValue]);

  const handleBack = () => {
    navigate({ to: "/exam-type" });
  };

  const onSubmit: SubmitHandler<FormInputs> = (data) => {
    if (Object.values(data).every((value) => value === 0)) {
      toast.error("Please select at least one question from a category.");
      return;
    } else {
      const filteredData = { ...data };
      Object.entries(data).forEach(([key, value]) => {
        if (value === 0) delete filteredData[key];
      });

      autoGenerate.mutate({ categories: filteredData });
    }
  };

  const validateQuestionCount = (value: number, maxCount: number) => {
    if (!value) return true; // Allow empty fields
    const numValue = Number(value);
    if (isNaN(numValue)) return "Must be a number";
    if (numValue <= 0) return "Must be greater than 0";
    if (numValue > maxCount) return `Cannot exceed ${maxCount}`;
    return true;
  };

  return (
    <div className="relative h-full w-1/2">
      <form onSubmit={handleSubmit(onSubmit)}>
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
              {questionList?.categories.map((category) => {
                const fieldName = category.categoryId;
                if (isPending) return <span>Loading...</span>;
                return (
                  <TableRow key={category.categoryId}>
                    <TableCell className="font-medium">
                      {category.categoryName}
                    </TableCell>
                    <TableCell>{category.questionCount}</TableCell>
                    <TableCell>
                      <Input
                        {...register(fieldName, {
                          validate: (v) =>
                            validateQuestionCount(v, category.questionCount),
                        })}
                        type="number"
                        min="0"
                        max={category.questionCount}
                      />
                      {errors[fieldName] && (
                        <p className="text-sm text-red-500">
                          {errors[fieldName]?.message as string}
                        </p>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        <div className="absolute bottom-0 flex h-14 w-full items-center gap-4 bg-white px-4">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleBack}
          >
            Back
          </Button>

          <Button type="submit" className="w-full">
            Next
          </Button>
        </div>
      </form>
    </div>
  );
};

export default QuestionSelect;
