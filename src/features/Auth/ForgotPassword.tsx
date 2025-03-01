import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import Logo from "@/assets/Logo.svg";
import Grid_Bg from "@/assets/Grid_Bg.svg";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useSendOTPFn } from "./api/sendOTP";
import { useVerifyOTPFn } from "./api/verifyOTP";

const ForgotPassword = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [view, setView] = useState<"send" | "reset">("send");

  const sendOTP = useSendOTPFn();
  const verifyOTP = useVerifyOTPFn();

  const handleSendOTP = () => {
    sendOTP.mutateAsync({ body: { phoneOrEmail: email } }).then(() => {
      setView("reset");
    });
  };

  const handleResetPassword = () => {
    verifyOTP.mutate({
      body: { phoneOrEmail: email, otp, newPassword: password },
    });
  };

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="flex h-full w-[376px] flex-col items-center gap-6 px-2 pt-40">
        <div className="relative z-10">
          <img src={Logo} alt="logo" />
          <img
            src={Grid_Bg}
            alt="grid_bg"
            className="absolute bottom-[-60px] z-[-10]"
          />
        </div>

        <p className="text-2xl font-semibold">Forgot Password?</p>
        <p className="text-lg text-gray-500">
          No worries, we'll send you reset instructions.
        </p>

        {view === "send" && (
          <div className="w-full space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        )}
        {view === "reset" && (
          <div className="flex w-full flex-col items-center justify-center gap-2">
            <Label htmlFor="email">Enter OTP</Label>
            <InputOTP maxLength={6} value={otp} onChange={setOtp}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>

            <div className="w-full space-y-2">
              <Label htmlFor="email">New Password</Label>
              <Input
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
        )}

        {view === "send" && (
          <Button
            className="w-full"
            type="submit"
            disabled={!email}
            onClick={handleSendOTP}
          >
            Send OTP
          </Button>
        )}

        {view === "reset" && (
          <Button
            className="w-full"
            type="submit"
            disabled={!otp || otp.length < 6 || !password}
            onClick={handleResetPassword}
          >
            Reset Password
          </Button>
        )}

        <Link to="/login">
          <div className="flex items-center gap-2 text-sm">
            <ArrowLeft className="h-5 w-5" /> Back to Login
          </div>
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
