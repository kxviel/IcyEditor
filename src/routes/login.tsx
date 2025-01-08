import { createFileRoute } from "@tanstack/react-router";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Login from "@/features/Auth/Login";
import Register from "@/features/Auth/Register";
import { useState } from "react";
import Logo from "@/assets/Logo.svg";

export const Route = createFileRoute("/login")({
  component: RouteComponent,
});

function RouteComponent() {
  // const auth = useAuth();

  const [activeTab, setActiveTab] = useState("login");

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="flex h-full w-[376px] flex-col items-center gap-4 px-2 pt-40">
        <div>
          <img src={Logo} alt="logo" />
        </div>

        <p className="text-2xl font-semibold">
          {activeTab === "login"
            ? "Login to your account"
            : "Create an Account"}
        </p>
        <p className="text-lg text-gray-500">
          {activeTab === "login"
            ? "Welcome back! Enter your details."
            : "Start your 30-day free trial."}
        </p>

        <Tabs
          defaultValue="login"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="w-full">
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
        </Tabs>
      </div>
    </div>
  );
}
