import AutoGen from "@/features/Builder/AutoGen";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_auth/auto-builder")({
  component: () => (
    <div className="h-[calc(100vh-72px)] w-full">
      <div className="mx-auto h-full max-w-screen-xl">
        <AutoGen />
      </div>
    </div>
  ),
});
