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
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";

const FormSchema = z.object({
  email: z
    .string({
      required_error: "Please select an email to display.",
    })
    .email(),
});
type Props = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const PaperPrerequisitesModal = ({ isOpen, setIsOpen }: Props) => {
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);

    navigate({ to: "/builder" });
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="md:w-[596px]">
        <div className="flex flex-col space-y-4">
          <p className="text-xl font-semibold">Select Subject and Proceed</p>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid w-full grid-cols-2 gap-4"
            >
              <ControlledSelect
                form={form}
                label="Subject"
                options={[
                  { value: "option1", label: "Option 1" },
                  { value: "option2", label: "Option 2" },
                  { value: "option3", label: "Option 3" },
                ]}
              />
              <ControlledSelect
                form={form}
                label="Subject"
                options={[
                  { value: "option1", label: "Option 1" },
                  { value: "option2", label: "Option 2" },
                  { value: "option3", label: "Option 3" },
                ]}
              />
              <ControlledSelect
                form={form}
                label="Subject"
                options={[
                  { value: "option1", label: "Option 1" },
                  { value: "option2", label: "Option 2" },
                  { value: "option3", label: "Option 3" },
                ]}
              />
              <ControlledSelect
                form={form}
                label="Subject"
                options={[
                  { value: "option1", label: "Option 1" },
                  { value: "option2", label: "Option 2" },
                  { value: "option3", label: "Option 3" },
                ]}
              />

              <Button variant={"outline"} className="w-full">
                Cancel
              </Button>
              <Button type="submit" className="w-full">
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

type ControlledSelectProps = {
  form: any;
  label: string;
  options: { value: string; label: string }[];
};

const ControlledSelect = ({ form, label, options }: ControlledSelectProps) => {
  return (
    <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select a verified email to display" />
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
