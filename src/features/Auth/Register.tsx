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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetStates } from "./api/getStates";
import { useGetCities } from "./api/getCities";
import { useModalStore } from "@/store/useModalStore";

const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, { message: "Name is required" })
      .min(2, { message: "Name must be at least 2 characters" }),
    email: z
      .string()
      .min(1, { message: "Email is required" })
      .email("Invalid email format")
      .trim(),
    password: z
      .string()
      .trim()
      .min(1, { message: "Password is required" })
      .min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z
      .string()
      .trim()
      .min(1, { message: "Confirm password is required" })
      .min(8, { message: "Confirm password must be at least 8 characters" }),
    phone: z
      .string()
      .trim()
      .min(1, { message: "Phone is required" })
      .regex(/^\d{10}$/, { message: "Phone must be a valid 10-digit number" }),
    city: z.string().trim().min(1, { message: "City is required" }),
    state: z.string().trim().min(1, { message: "State is required" }),
    school: z.string().trim().min(1, { message: "School is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type RegisterSchemaTypes = z.infer<typeof registerSchema>;

const Register = () => {
  const registerFn = useRegisterFn();
  const setModal = useModalStore((state) => state.setModal);
  const form = useForm<RegisterSchemaTypes>({
    resolver: zodResolver(registerSchema),
  });

  const { data: stateList } = useGetStates();
  const { data: cityList } = useGetCities(form.watch("state"));

  const onSubmit = (data: RegisterSchemaTypes) => {
    console.log(data);
    registerFn.mutate({ body: data });
  };

  return (
    <div className="w-[642px] py-3">
      <Button
        onClick={() => {
          setModal("COMPLETE_PROFILE", { isOpen: true });
        }}
      >
        TEAST
      </Button>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col items-center gap-4"
        >
          <div className="flex w-full gap-4">
            <div className="w-96 space-y-4">
              <FormField
                control={form.control}
                name="name"
                defaultValue=""
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>FullName</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter your fullname"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                defaultValue=""
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone No.</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your phone number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="state"
                defaultValue=""
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a State" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {stateList?.map((state) => (
                          <SelectItem value={state.id?.toString()}>
                            {state.NAME}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                    <FormMessage />
                    <FormDescription>
                      Password must be at least 8 characters
                    </FormDescription>
                  </FormItem>
                )}
              />
            </div>
            <div className="w-96 space-y-4">
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
                name="school"
                defaultValue=""
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>School Name</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter school name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="city"
                defaultValue=""
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a City" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {cityList?.map((city) => (
                          <SelectItem value={city.id?.toString()}>
                            {city.NAME}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                defaultValue=""
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Confirm your password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Button className="w-96" type="submit">
            Get Started
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default Register;
