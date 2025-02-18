import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useNavigate } from "@tanstack/react-router";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useGetSubject } from "./api/getSubject";
import { useGetClass } from "./api/getClass";
import { useGetSeries } from "./api/getSeries";
import { useGetPublication } from "./api/getPublication";

const formSchema = z.object({
  publicationId: z.string(),
  seriesId: z.string(),
  classId: z.string(),
  subjectId: z.string(),
});

type FormTypes = z.infer<typeof formSchema>;

type Props = {
  isOpen: boolean;
  setSubjectId: React.Dispatch<React.SetStateAction<number>>;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const PaperPrerequisitesModal = ({
  isOpen,
  setIsOpen,
  setSubjectId,
}: Props) => {
  const navigate = useNavigate();
  const form = useForm<FormTypes>({
    resolver: zodResolver(formSchema),
  });

  // Publication
  const { data: publicationList, isPending: isPublicationPending } =
    useGetPublication();

  // Series
  const { data: seriesList, isPending: isSeriesPending } = useGetSeries(
    form.watch("publicationId"),
  );

  // Class
  const { data: classList, isPending: isClassPending } = useGetClass(
    form.watch("seriesId"),
  );

  // Subject
  const { data: subjectList, isPending: isSubjectPending } = useGetSubject(
    form.watch("classId"),
  );

  function onSubmit(data: FormTypes) {
    console.log(data);

    if (data.publicationId && data.seriesId && data.classId && data.subjectId) {
      setIsOpen(false);
      setSubjectId(Number(data.subjectId));
    }
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(value) => {
        setIsOpen(value);
      }}
    >
      <DialogContent
        className="md:w-[596px]"
        onEscapeKeyDown={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
        showClose={false}
      >
        <div className="flex flex-col space-y-4">
          <p className="text-xl font-semibold">Select Subject and Proceed</p>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid w-full grid-cols-2 gap-4"
            >
              <ControlledSelect
                form={form}
                label="publicationId"
                options={
                  publicationList
                    ? publicationList.map((option) => ({
                        value: option.id?.toString(),
                        label: option.NAME,
                      }))
                    : []
                }
                isDisabled={isPublicationPending}
              />
              <ControlledSelect
                form={form}
                label="seriesId"
                options={
                  seriesList
                    ? seriesList.map(({ id, NAME }) => ({
                        value: id.toString(),
                        label: NAME,
                      }))
                    : []
                }
                isDisabled={isSeriesPending || !form.watch("publicationId")}
              />
              <ControlledSelect
                form={form}
                label="classId"
                options={
                  classList
                    ? classList.map(({ id, NAME }) => ({
                        value: id.toString(),
                        label: NAME,
                      }))
                    : []
                }
                isDisabled={isClassPending || !form.watch("seriesId")}
              />
              <ControlledSelect
                form={form}
                label="subjectId"
                options={
                  subjectList
                    ? subjectList.map(({ id, NAME }) => ({
                        value: id.toString(),
                        label: NAME,
                      }))
                    : []
                }
                isDisabled={isSubjectPending || !form.watch("classId")}
              />

              <Button
                variant={"outline"}
                className="w-full"
                onClick={() => {
                  navigate({ to: "/exam-type" }).finally(() => {
                    setIsOpen(false);
                  });
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="w-full"
                disabled={!form.formState.isValid}
              >
                Submit
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaperPrerequisitesModal;

const labels = {
  publicationId: "Publication",
  seriesId: "Series",
  classId: "Class",
  subjectId: "Subject",
};

type ControlledSelectProps = {
  form: UseFormReturn<FormTypes, any, undefined>;
  label: "publicationId" | "seriesId" | "classId" | "subjectId";
  isDisabled: boolean;
  options: { value: string; label: string }[];
};

const ControlledSelect = ({
  form,
  label,
  options,
  isDisabled,
}: ControlledSelectProps) => {
  return (
    <FormField
      control={form.control}
      name={label}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{labels[label]}</FormLabel>
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
            disabled={isDisabled}
          >
            <FormControl>
              <SelectTrigger
                className={
                  form.formState.errors[field.name] ? "border-red-100" : ""
                }
              >
                <SelectValue placeholder={`Select ${labels[label]}`} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormItem>
      )}
    />
  );
};
