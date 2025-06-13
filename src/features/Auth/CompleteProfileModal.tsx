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
import { useAuthStore, User } from "@/store/useAuthStore";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

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
  const updateUser = useUpdateUser();
  const getUser = useAuthStore((state) => state.getUser);
  const hideModal = useModalStore((state) => state.hideModal);

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

  const watchedState = form.watch("state");
  const watchedPublicationId = form.watch("publicationId");

  const { data: stateList, isPending: isStatePending } = useGetStates();
  const { data: cityList, isPending: isCityPending } =
    useGetCities(watchedState);
  const { data: publication, isPending: isPublicationPending } =
    useGetPublication();
  const { data: series, isPending: isSeriesPending } =
    useGetSeries(watchedPublicationId);

  // Reset city when state changes
  useEffect(() => {
    if (watchedState && form.getValues("city")) {
      form.setValue("city", "");
    }
  }, [watchedState, form]);

  // Reset series when publication changes
  useEffect(() => {
    if (watchedPublicationId && form.getValues("seriesId")) {
      form.setValue("seriesId", "");
    }
  }, [watchedPublicationId, form]);

  const onSubmit = (data: RegisterSchemaTypes) => {
    const user = getUser();
    const modifiedData: Omit<RegisterSchemaTypes, "confirmPassword"> = {
      ...data,
    };
    delete (modifiedData as any).confirmPassword;

    if (user) {
      updateUser.mutate({
        userId: user.id,
        data: modifiedData as UpdateUserProps,
      });
    }
  };

  const isLoading = isStatePending || isPublicationPending;
  const isFormDisabled = updateUser.isPending || isLoading;

  return (
    <Dialog open={isOpen} onOpenChange={hideModal}>
      <DialogContent
        className="max-h-[90vh] max-w-fit overflow-y-auto"
        onEscapeKeyDown={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
        showClose={false}
      >
        <DialogHeader>
          <DialogTitle>Complete your Profile</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading form data...</span>
          </div>
        ) : (
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
                    disabled={isFormDisabled}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Enter your full name"
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
                    disabled={isFormDisabled}
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
                    disabled={isFormDisabled}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={isFormDisabled}
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
                    disabled={isFormDisabled}
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
                    disabled={isFormDisabled}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Publication</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={isFormDisabled}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a Publication" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {publication?.map((p) => (
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
                    disabled={isFormDisabled}
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
                    disabled={isFormDisabled || isCityPending}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={
                            isFormDisabled || isCityPending || !watchedState
                          }
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue
                                placeholder={
                                  !watchedState
                                    ? "Select a state first"
                                    : isCityPending
                                      ? "Loading cities..."
                                      : "Select a City"
                                }
                              />
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
                    disabled={isFormDisabled}
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
                    disabled={isFormDisabled || isSeriesPending}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Series</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={
                            isFormDisabled ||
                            isSeriesPending ||
                            !watchedPublicationId
                          }
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue
                                placeholder={
                                  !watchedPublicationId
                                    ? "Select a publication first"
                                    : isSeriesPending
                                      ? "Loading series..."
                                      : "Select a Series"
                                }
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {series?.map((s) => (
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
                  type="button"
                  disabled={isFormDisabled}
                  onClick={() => hideModal()}
                >
                  Complete Later
                </Button>
                <Button
                  className="w-full"
                  type="submit"
                  disabled={isFormDisabled}
                >
                  {updateUser.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Profile"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CompleteProfileModal;
