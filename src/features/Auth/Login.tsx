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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { CheckedState } from "@radix-ui/react-checkbox";
import { Link } from "@tanstack/react-router";

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
  const form = useForm<LoginSchemaTypes>({
    resolver: zodResolver(loginSchema),
  });

  const loginFn = useLoginFn();

  const [rememberMe, setRememberMe] = useState<CheckedState>(false);

  const onSubmit = (data: LoginSchemaTypes) => {
    console.log(data);
    console.log(rememberMe);
    loginFn.mutate({ body: data });
  };

  return (
    <div className="flex flex-col gap-4 py-3">
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
                    placeholder="Enter your password"
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

          <div className="flex items-center justify-between">
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
          </div>

          <Button
            className="w-full"
            type="submit"
            disabled={!form.formState.isValid}
          >
            Login
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default Login;
