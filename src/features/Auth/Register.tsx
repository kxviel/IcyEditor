import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useRegisterFn } from "./api/register";

const registerSchema = z.object({
  username: z.string().trim().min(1, { message: "Username is required" }),
  email: z
    .string()
    .email("Please enter a valid email")
    .trim()
    .min(1, { message: "Email is required" }),
  phone: z
    .string()
    .trim()
    .min(1, { message: "Phone is required" })
    .regex(/^\d{10}$/, { message: "Phone must be a valid 10-digit number" }),
  password: z.string().trim().min(1, { message: "Password is required" }),
  city: z.string().trim().min(1, { message: "City is required" }),
  state: z.string().trim().min(1, { message: "State is required" }),
  school: z.string().trim().min(1, { message: "School is required" }),
});

type RegisterSchemaTypes = z.infer<typeof registerSchema>;

const Register = () => {
  const {
    handleSubmit,
    formState: { isValid },
  } = useForm<RegisterSchemaTypes>({
    resolver: zodResolver(registerSchema),
  });

  const registerFn = useRegisterFn();

  const onSubmit = (data: RegisterSchemaTypes) => {
    console.log(data);
    registerFn.mutate({ body: data });
  };

  return (
    <div className="grid grid-cols-4 gap-4">
      <Input type="email" placeholder="Email" />
      <Input type="password" placeholder="Password" />
      <Input type="email" placeholder="Email" />
      <Input type="password" placeholder="Password" />
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

export default Register;
