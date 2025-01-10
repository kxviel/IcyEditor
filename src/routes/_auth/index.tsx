import { createFileRoute } from "@tanstack/react-router";
import Home from "@/features/Home/Home";

export const Route = createFileRoute("/_auth/")({
  component: HomeComponent,
});

function HomeComponent() {
  return (
    <div className="w-full">
      <div className="mx-auto flex h-[calc(100vh-72px)] max-w-7xl flex-col gap-6">
        <Home />
      </div>
    </div>
  );
}
