import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRegisterFn } from "./api/register";

const registerSchema = z.object({
  name: z.string().trim().min(1, { message: "Name is required" }),
  email: z
    .string()
    .email("Please enter a valid email")
    .trim()
    .min(1, { message: "Email is required" }),
  password: z.string().trim().min(8, { message: "Password is required" }),
  // phone: z
  //   .string()
  //   .trim()
  //   .min(1, { message: "Phone is required" })
  //   .regex(/^\d{10}$/, { message: "Phone must be a valid 10-digit number" }),
  // city: z.string().trim().min(1, { message: "City is required" }),
  // state: z.string().trim().min(1, { message: "State is required" }),
  // school: z.string().trim().min(1, { message: "School is required" }),
});

type RegisterSchemaTypes = z.infer<typeof registerSchema>;

const Register = () => {
  const form = useForm<RegisterSchemaTypes>({
    resolver: zodResolver(registerSchema),
  });

  const registerFn = useRegisterFn();

  const onSubmit = (data: RegisterSchemaTypes) => {
    console.log(data);
    registerFn.mutate({ body: data });
  };

  return (
    <div className="flex flex-col gap-4 py-3">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            defaultValue=""
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Enter your name" {...field} />
                </FormControl>
                {/* <FormDescription>
                This is your public display name.
              </FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            defaultValue=""
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    {...field}
                  />
                </FormControl>
                {/* <FormDescription>
                This is your public display name.
              </FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            defaultValue=""
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Create your password"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Must be at least 8 characters</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            className="w-full"
            type="submit"
            disabled={!form.formState.isValid}
          >
            Get Started
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default Register;
