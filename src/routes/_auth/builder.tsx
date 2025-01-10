import PaperView from "@/features/Builder/PaperView";
import QuestionList from "@/features/Builder/QuestionList";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/builder")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="w-full bg-[#F9F5FF]">
      <div className="mx-auto flex h-[calc(100vh-72px)] max-w-7xl items-center justify-center">
        <QuestionList />
        <PaperView />
      </div>
    </div>
  );
}
