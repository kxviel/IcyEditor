import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLoginFn } from "./api/login";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { IconInput } from "@/components/ui/IconInput";

const loginSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email")
    .trim()
    .min(1, { message: "Email is required" }),
  password: z.string().min(8, { message: "Password is required" }).trim(),
});

type LoginSchemaTypes = z.infer<typeof loginSchema>;

const Login = () => {
  const loginFn = useLoginFn();
  const form = useForm<LoginSchemaTypes>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginSchemaTypes) => {
    loginFn.mutate({
      body: {
        phoneOrEmail: data.email,
        password: data.password,
      },
    });
  };

  return (
    <div className="w-96 py-3">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                  <IconInput
                    type="password"
                    placeholder="Enter your password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="rememberMe"
                checked={rememberMe}
                onCheckedChange={setRememberMe}
              />
              <Label
                htmlFor="rememberMe"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Remember me
              </Label>
            </div>

            <Link
              to="/forgot-password"
              className="text-sm font-semibold text-primary"
            >
              Forgot Password
            </Link>
          </div> */}

          <Button className="w-96" type="submit">
            Login
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default Login;
