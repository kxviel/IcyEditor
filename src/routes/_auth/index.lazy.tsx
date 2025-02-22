import { createLazyFileRoute } from "@tanstack/react-router";
import Home from "@/features/Home/Home";

export const Route = createLazyFileRoute("/_auth/")({
  component: () => (
    <div className="h-[calc(100vh-72px)] w-full">
      <div className="mx-auto h-full max-w-screen-xl">
        <Home />
      </div>
    </div>
  ),
});
