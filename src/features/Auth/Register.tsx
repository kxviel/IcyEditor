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
import { useGetPublication } from "@/features/Builder/api/getPublication";
import { useGetSeries } from "@/features/Builder/api/getSeries";
import { countryCodes } from "@/lib/utils";

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

const Register = () => {
  const registerFn = useRegisterFn();
  const form = useForm<RegisterSchemaTypes>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      countryCode: "+91",
    },
  });

  const { data: stateList } = useGetStates();
  const { data: cityList } = useGetCities(form.watch("state"));
  const publication = useGetPublication();
  const series = useGetSeries(form.watch("publicationId"));

  const watchedCity = form.watch("city");
  const watchedSchoolBoard = form.watch("school_board");

  const onSubmit = (data: RegisterSchemaTypes) => {
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

    registerFn.mutate({ ...modifiedData });
  };

  return (
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
                      disabled={registerFn.isPending}
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
                      disabled={registerFn.isPending}
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
                      disabled={registerFn.isPending}
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
                        disabled={registerFn.isPending}
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
                      disabled={registerFn.isPending}
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
                    disabled={registerFn.isPending}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a Board" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="CBSE">CBSE</SelectItem>
                      <SelectItem value="ICSE">ICSE</SelectItem>
                      <SelectItem value="State Board">State Board</SelectItem>
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
                        disabled={registerFn.isPending}
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
                        disabled={registerFn.isPending}
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
                    disabled={registerFn.isPending}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a State" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {stateList?.map((state) => (
                        <SelectItem key={state.id} value={state.id?.toString()}>
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
                    disabled={registerFn.isPending}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a City" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="other">Other</SelectItem>
                      {cityList?.map((city) => (
                        <SelectItem key={city.id} value={city.id?.toString()}>
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
              <div className="flex-1"></div>{" "}
              {/* Empty space to align with city column */}
              <FormField
                control={form.control}
                name="customCity"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Enter City Name</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        disabled={registerFn.isPending}
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
                      disabled={registerFn.isPending}
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
                      disabled={registerFn.isPending}
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
                    disabled={registerFn.isPending}
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
                      registerFn.isPending || !form.watch("publicationId")
                    }
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

          {/* Submit Button */}
          <div className="mt-4 flex justify-center">
            <Button
              className="w-96"
              type="submit"
              disabled={registerFn.isPending}
            >
              {registerFn.isPending ? "Registering..." : "Get Started"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Register;
