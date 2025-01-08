import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLoginFn } from "./api/login";
import { Button } from "@/components/ui/button";

const loginSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email")
    .trim()
    .min(1, { message: "Email is required" }),
  password: z.string().min(1, { message: "Password is required" }).trim(),
});

type LoginSchemaTypes = z.infer<typeof loginSchema>;

const Login = () => {
  const {
    handleSubmit,
    formState: { isValid },
  } = useForm<LoginSchemaTypes>({
    resolver: zodResolver(loginSchema),
  });

  const loginFn = useLoginFn();

  const onSubmit = (data: LoginSchemaTypes) => {
    console.log(data);
    loginFn.mutate({ body: data });
  };

  return (
    <div className="flex flex-col">
      <Input type="email" placeholder="Email" />
      <Input type="password" placeholder="Password" />

      <Button
        type="submit"
        disabled={!isValid}
        onClick={handleSubmit(onSubmit)}
      >
        Login
      </Button>
    </div>
  );
};

export default Login;
