import { createFileRoute, useNavigate } from "@tanstack/react-router";
import Logo from "@/assets/Logo.svg";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_auth/")({
  component: HomeComponent,
});

function HomeComponent() {
  const navigate = useNavigate();

  return (
    <div className="w-full">
      <div className="mx-auto flex h-[calc(100vh-72px)] max-w-7xl flex-col items-center justify-center space-y-4 px-8">
        <div>
          <img src={Logo} alt="logo" />
        </div>

        <p className="text-2xl font-semibold">How do you want to proceed</p>
        <p className="text-gray-500">
          lorem ipsum dolor sit amet lorem ipsum dolor sit amet
        </p>

        <div className="flex space-x-4">
          <Button onClick={() => navigate({ to: "/builder" })}>
            Manual Exam Paper
          </Button>
          <Button>Auto Generate </Button>
        </div>
      </div>
    </div>
  );
}
