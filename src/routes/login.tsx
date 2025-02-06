import { createFileRoute } from "@tanstack/react-router";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Login from "@/features/Auth/Login";
import Register from "@/features/Auth/Register";
import { useState } from "react";
import Logo from "@/assets/Logo.svg";
import Grid_Bg from "@/assets/Grid_Bg.svg";
import { useGoogleLogin, useGoogleOneTapLogin } from "@react-oauth/google";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/login")({
  component: RouteComponent,
});

function RouteComponent() {
  // const auth = useAuth();

  const [activeTab, setActiveTab] = useState("login");

  useGoogleOneTapLogin({
    onSuccess: (credentialResponse) => {
      console.log(credentialResponse);
    },
    onError: () => {
      console.log("Login Failed");
    },
  });

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => console.log(codeResponse),
    onError: (error) => console.log("Login Failed:", error),
  });

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
        <p className="text-gray-500">
          {activeTab === "login"
            ? "Welcome back! Enter your details."
            : "Start your 30-day free trial."}
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
          <Button variant={"outline"} onClick={() => login()} className="w-96">
            Sign in with Google 🚀
          </Button>
        </Tabs>
      </div>
    </div>
  );
}
