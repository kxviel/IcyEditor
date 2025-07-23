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
import { countryCodes, separatePhoneNumber } from "@/lib/utils";

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
    countryCode: z.string().min(1, { message: "Country code is required" }),
    phone: z
      .string()
      .trim()
      .min(1, { message: "Phone is required" })
      .regex(/^[6789]\d{9}$/, {
        message: "Please enter a valid phone number",
      }),
    city: z.string().trim().min(1, { message: "City is required" }),
    customCity: z.string().trim().optional(),
    state: z.string().trim().min(1, { message: "State is required" }),
    schoolName: z.string().trim().min(1, { message: "School is required" }),
    school_board: z.string().trim().min(1, { message: "Board is required" }),
    customSchoolBoard: z.string().trim().optional(),
    distributor_name: z
      .string()
      .trim()
      .min(1, { message: "Distributor name is required" }),
    publicationId: z.string().min(1, { message: "Publication is required" }),
    seriesId: z.string().min(1, { message: "Series is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })
  .refine(
    (data) => {
      if (data.city === "other") {
        return data.customCity && data.customCity.trim().length > 0;
      }
      return true;
    },
    {
      message: "Please enter city name",
      path: ["customCity"],
    },
  )
  .refine(
    (data) => {
      if (data.school_board === "other") {
        return (
          data.customSchoolBoard && data.customSchoolBoard.trim().length > 0
        );
      }
      return true;
    },
    {
      message: "Please enter school board",
      path: ["customSchoolBoard"],
    },
  );

type RegisterSchemaTypes = z.infer<typeof registerSchema>;

type Props = {
  isOpen: boolean;
  data: User;
};

const CompleteProfileModal = ({ isOpen, data }: Props) => {
  const updateUser = useUpdateUser();
  const getUser = useAuthStore((state) => state.getUser);
  const hideModal = useModalStore((state) => state.hideModal);

  const { countryCode, phone } = separatePhoneNumber(data.MOBILE || "");

  const form = useForm<RegisterSchemaTypes>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: data.UNAME || "",
      email: data.EMAIL || "",
      password: data.PASSWORD || "",
      confirmPassword: data.PASSWORD || "",
      countryCode: countryCode,
      phone: phone,
      city: data.city?.toString() || "",
      state: data.state?.toString() || "",
      schoolName: data.school || "",
      school_board: "",
      distributor_name: "",
      publicationId: data.PUBLICATION_ID?.toString() || "",
      seriesId: data.SERIES_ID?.toString() || "",
    },
  });

  const { data: stateList, isPending: isStatePending } = useGetStates();
  const { data: cityList, isPending: isCityPending } = useGetCities(
    form.watch("state"),
  );
  const { data: publication, isPending: isPublicationPending } =
    useGetPublication();
  const { data: series, isPending: isSeriesPending } = useGetSeries(
    form.watch("publicationId"),
  );

  const watchedCity = form.watch("city");
  const watchedSchoolBoard = form.watch("school_board");

  const onSubmit = (data: RegisterSchemaTypes) => {
    const user = getUser();
    const modifiedData: any = { ...data };

    delete modifiedData.confirmPassword;

    // Handle custom city
    if (data.city === "other" && data.customCity) {
      modifiedData.city = data.customCity;
    }
    delete modifiedData.customCity;

    // Handle custom school name
    if (data.school_board === "other" && data.customSchoolBoard) {
      modifiedData.school_board = data.customSchoolBoard;
    }
    delete modifiedData.customSchoolBoard;

    // Combine country code with phone number
    modifiedData.phone = `${data.countryCode}${data.phone}`;

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
          <div className="w-[642px] overflow-y-auto py-3">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-4 px-1"
              >
                {/* Row 1: Full Name, Email */}
                <div className="flex gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            disabled={isFormDisabled}
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
                    name="email"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            disabled={true}
                            placeholder="Enter your email"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Row 2: Country Code + Phone, School Name */}
                <div className="flex gap-4">
                  <div className="flex flex-1 gap-2">
                    <FormField
                      control={form.control}
                      name="countryCode"
                      render={({ field }) => (
                        <FormItem className="w-24">
                          <FormLabel>Code</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            disabled={isFormDisabled}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Code" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {countryCodes.map((item) => (
                                <SelectItem key={item.code} value={item.code}>
                                  {item.code}
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
                      name="phone"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Phone No.</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              disabled={isFormDisabled}
                              placeholder="Enter your phone number"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="schoolName"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>School Name</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            disabled={isFormDisabled}
                            placeholder="Enter your School Name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Row 3: School Board, Custom School Board (if other) OR Distributor Name */}
                <div className="flex gap-4">
                  <FormField
                    control={form.control}
                    name="school_board"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>School Board</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={isFormDisabled}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a Board" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="CBSE">CBSE</SelectItem>
                            <SelectItem value="ICSE">ICSE</SelectItem>
                            <SelectItem value="State Board">
                              State Board
                            </SelectItem>
                            <SelectItem value="International Baccalaureate">
                              International Baccalaureate
                            </SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {watchedSchoolBoard === "other" ? (
                    <FormField
                      control={form.control}
                      name="customSchoolBoard"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Enter School Board</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              disabled={isFormDisabled}
                              placeholder="Enter school board name"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ) : (
                    <FormField
                      control={form.control}
                      name="distributor_name"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Distributor Name</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              disabled={isFormDisabled}
                              placeholder="Enter distributor name"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>

                {watchedSchoolBoard === "other" && (
                  <div className="flex items-center justify-center gap-4">
                    <FormField
                      control={form.control}
                      name="distributor_name"
                      render={({ field }) => (
                        <FormItem className="w-60">
                          <FormLabel>Distributor Name</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              disabled={isFormDisabled}
                              placeholder="Enter distributor name"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* Row 4: State, City with Custom City handling */}
                <div className="flex gap-4">
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem className="flex-1">
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
                    name="city"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>City</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={isFormDisabled || isCityPending}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a City" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="other">Other</SelectItem>
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
                </div>

                {/* Custom City Input (appears below city row when "other" is selected) */}
                {watchedCity === "other" && (
                  <div className="flex gap-4">
                    <div className="flex-1"></div>
                    <FormField
                      control={form.control}
                      name="customCity"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Enter City Name</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              disabled={isFormDisabled}
                              placeholder="Enter city name"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* Row 5: Password, Confirm Password */}
                <div className="flex gap-4">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            disabled={isFormDisabled}
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
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            disabled={isFormDisabled}
                            placeholder="Confirm your password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Row 6: Publication, Series */}
                <div className="flex gap-4">
                  <FormField
                    control={form.control}
                    name="publicationId"
                    render={({ field }) => (
                      <FormItem className="flex-1">
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

                  <FormField
                    control={form.control}
                    name="seriesId"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Series</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={
                            isFormDisabled ||
                            !form.watch("publicationId") ||
                            isSeriesPending
                          }
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a Series" />
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

                {/* Submit Buttons */}
                <div className="mt-4 flex gap-4">
                  <Button
                    className="flex-1"
                    variant="outline"
                    type="button"
                    disabled={isFormDisabled}
                    onClick={() => hideModal()}
                  >
                    Complete Later
                  </Button>
                  <Button
                    className="flex-1"
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
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CompleteProfileModal;
