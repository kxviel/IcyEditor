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
import { useEffect, useState } from "react";
import { toast } from "sonner";

type Props = {
  chapterIds: string[];
};

type FormInputs = Record<string, number>;
type FormErrors = Record<string, string>;

const QuestionSelect = ({ chapterIds }: Props) => {
  const navigate = useNavigate();
  const autoGenerate = useGenerateQuestions();
  const { data: questionList, isPending } = useGetQuestions(chapterIds);

  const [formData, setFormData] = useState<FormInputs>({});
  const [errors, setErrors] = useState<FormErrors>({});

  // Initialize category data when questionList is loaded
  useEffect(() => {
    if (questionList?.categories && questionList.categories.length > 0) {
      const initialData: FormInputs = {};
      questionList.categories.forEach((category) => {
        initialData[category.categoryId] = 0;
      });
      setFormData(initialData);
    }
  }, [questionList]);

  const handleBack = () => {
    navigate({ to: "/exam-type" });
  };

  const handleInputChange = (categoryId: string, value: string) => {
    // Allow empty string or valid numbers
    if (value === "" || /^\d+$/.test(value)) {
      const numValue = value === "" ? 0 : parseInt(value);
      setFormData((prev) => ({
        ...prev,
        [categoryId]: numValue,
      }));

      // Clear error when user starts typing
      if (errors[categoryId]) {
        setErrors((prev) => ({
          ...prev,
          [categoryId]: "",
        }));
      }
    }
  };

  const validateQuestionCount = (value: number, maxCount: number): string => {
    if (value < 0) return "Must be greater than or equal to 0";
    if (value > maxCount) return `Cannot exceed ${maxCount}`;
    return "";
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let hasErrors = false;

    if (questionList?.categories) {
      questionList.categories.forEach((category) => {
        const value = formData[category.categoryId] || 0;
        const error = validateQuestionCount(value, category.questionCount);
        if (error) {
          newErrors[category.categoryId] = error;
          hasErrors = true;
        }
      });
    }

    setErrors(newErrors);
    return !hasErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (Object.values(formData).every((value) => value === 0)) {
      toast.error("Please select at least one question from a category.");
      return;
    }

    const filteredData = { ...formData };
    Object.entries(formData).forEach(([key, value]) => {
      if (value === 0) delete filteredData[key];
    });

    autoGenerate.mutate({ categories: filteredData });
  };

  if (isPending) {
    return (
      <div className="relative flex h-full w-1/2 items-center justify-center">
        <span>Loading questions...</span>
      </div>
    );
  }

  return (
    <div className="relative h-full w-1/2">
      <form>
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
              {questionList?.categories.map((category) => (
                <TableRow key={category.categoryId}>
                  <TableCell className="font-medium">
                    {category.categoryName}
                  </TableCell>
                  <TableCell>{category.questionCount}</TableCell>
                  <TableCell>
                    <Input
                      type="text"
                      placeholder="0"
                      value={
                        formData[category.categoryId] === 0
                          ? ""
                          : formData[category.categoryId]?.toString() || ""
                      }
                      onChange={(e) =>
                        handleInputChange(category.categoryId, e.target.value)
                      }
                    />
                    {errors[category.categoryId] && (
                      <p className="text-sm text-red-500">
                        {errors[category.categoryId]}
                      </p>
                    )}
                  </TableCell>
                </TableRow>
              ))}
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

          <Button type="submit" className="w-full" onClick={handleSubmit}>
            {autoGenerate.isPending ? "Generating..." : "Generate Questions"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default QuestionSelect;
