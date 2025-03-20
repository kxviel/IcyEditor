import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetStates } from "./api/getStates";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModalStore } from "@/store/useModalStore";
import { useGetCities } from "./api/getCities";
import { useGetPublication } from "../Builder/api/getPublication";
import { useGetSeries } from "../Builder/api/getSeries";
import { UpdateUserProps, useUpdateUser } from "./api/updateUser";
import { useAuth, User } from "@/hooks/useAuth";

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
    schoolName: z.string().trim().min(1, { message: "School is required" }),
    publicationId: z.string().min(1, { message: "Publication is required" }),
    seriesId: z.string().min(1, { message: "Series is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type RegisterSchemaTypes = z.infer<typeof registerSchema>;

type Props = {
  isOpen: boolean;
  data: User;
};

const CompleteProfileModal = ({ isOpen, data }: Props) => {
  const hideModal = useModalStore((state) => state.hideModal);
  const updateUser = useUpdateUser();
  const { getUser } = useAuth();
  const form = useForm<RegisterSchemaTypes>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: data.UNAME || "",
      email: data.EMAIL || "",
      password: data.PASSWORD || "",
      confirmPassword: data.PASSWORD || "",
      phone: data.MOBILE || "",
      city: data.city?.toString() || "",
      state: data.state?.toString() || "",
      schoolName: data.school || "",
      publicationId: data.PUBLICATION_ID?.toString() || "",
      seriesId: data.SERIES_ID?.toString() || "",
    },
  });

  const { data: stateList } = useGetStates();
  const { data: cityList } = useGetCities(form.watch("state"));
  const publication = useGetPublication();
  const series = useGetSeries(form.watch("publicationId"));

  const onSubmit = (data: RegisterSchemaTypes) => {
    const modifiedData: any = { ...data };
    delete modifiedData.confirmPassword;
    modifiedData.restrictedAccess = !!getUser()?.RESTRICTED_ACCESS;

    updateUser.mutate({
      userId: getUser()?.id,
      data: modifiedData as UpdateUserProps,
    });
  };

  console.log({
    name: data.UNAME || "",
    email: data.EMAIL || "",
    password: data.PASSWORD || "",
    confirmPassword: data.PASSWORD || "",
    phone: data.MOBILE || "",
    city: data.city || "",
    state: data.state || "",
    schoolName: data.school || "",
    publicationId: data.PUBLICATION_ID || "",
    seriesId: data.SERIES_ID || "",
  });

  return (
    <Dialog open={isOpen} onOpenChange={hideModal}>
      <DialogContent
        className="max-w-fit"
        onEscapeKeyDown={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
        showClose={false}
      >
        <DialogHeader>
          <DialogTitle>Complete your Profile</DialogTitle>
        </DialogHeader>

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
                  disabled={updateUser.isPending}
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
                  disabled={updateUser.isPending}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone No.</FormLabel>
                      <FormControl>
                        <Input
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
                  disabled={updateUser.isPending}
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
                            <SelectItem
                              key={state.id}
                              value={state.id?.toString()}
                            >
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
                  disabled={updateUser.isPending}
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
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="publicationId"
                  disabled={updateUser.isPending}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Publication</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a Publication" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {publication.data?.map((p) => (
                            <SelectItem key={p.id} value={p.id?.toString()}>
                              {p.NAME}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-96 space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  disabled={true}
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
                  name="schoolName"
                  disabled={updateUser.isPending}
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
                  disabled={updateUser.isPending}
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
                            <SelectItem
                              key={city.id}
                              value={city.id?.toString()}
                            >
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
                  disabled={updateUser.isPending}
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
                <FormField
                  control={form.control}
                  name="seriesId"
                  disabled={updateUser.isPending}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Series</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a Series" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {series.data?.map((s) => (
                            <SelectItem key={s.id} value={s.id?.toString()}>
                              {s.NAME}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex w-full items-center gap-4">
              <Button
                className="w-full"
                variant={"outline"}
                onClick={(e) => {
                  e.preventDefault();
                  hideModal();
                }}
              >
                Complete Later
              </Button>
              <Button
                className="w-full"
                type="submit"
                disabled={updateUser.isPending}
              >
                {updateUser.isPending ? "Saving..." : "Save Profile"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CompleteProfileModal;
