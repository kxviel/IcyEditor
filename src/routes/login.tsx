import { createFileRoute, redirect } from "@tanstack/react-router";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLoginWithGoogle } from "@/features/Auth/api/loginWithGoogle";
import Login from "@/features/Auth/Login";
import Register from "@/features/Auth/Register";
import { useState } from "react";
import Logo from "@/assets/Logo.svg";
import Grid_Bg from "@/assets/Grid_Bg.svg";
import { Button } from "@/components/ui/button";
import GoogleIcon from "@/assets/Icons/GoogleIcon";
import { env } from "@/config/env";

export const Route = createFileRoute("/login")({
  component: RouteComponent,
  beforeLoad: () => {
    const isLogged =
      localStorage.getItem(env.AUTH_STATUS_IDENTIFIER) === "true";

    if (isLogged) {
      throw redirect({
        to: "/",
        search: { page: 1 },
      });
    }
  },
});

function RouteComponent() {
  const [activeTab, setActiveTab] = useState("login");

  const { loginWithGoogle, isPending } = useLoginWithGoogle();

  return (
    <div className="mx-auto h-screen w-full">
      <div className="flex h-full flex-col items-center justify-center gap-3">
        <div className="relative z-10">
          <img src={Logo} alt="logo" />
          <img
            src={Grid_Bg}
            alt="grid_bg"
            className="absolute bottom-[-60px] z-[-10]"
          />
        </div>

        <p className="text-2xl font-semibold">
          {activeTab === "login"
            ? "Log in to your account"
            : "Create an Account"}
        </p>

        <Tabs
          defaultValue="login"
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex flex-col items-center justify-center"
        >
          <TabsList className="w-96">
            <TabsTrigger value="register" className="w-full">
              Sign Up
            </TabsTrigger>

            <TabsTrigger value="login" className="w-full">
              Login
            </TabsTrigger>
          </TabsList>

          <TabsContent value="register">
            <Register />
          </TabsContent>
          <TabsContent value="login">
            <Login />
          </TabsContent>

          {/* Sign in with Google */}
          <Button
            variant={"outline"}
            onClick={() => loginWithGoogle()}
            className="w-96"
          >
            <GoogleIcon />{" "}
            {isPending ? "Logging in..." : "Continue with Google"}
          </Button>
        </Tabs>
      </div>
    </div>
  );
}
