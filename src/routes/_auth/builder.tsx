import PaperView from "@/features/Builder/PaperView";
import QuestionList from "@/features/Builder/QuestionList";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/builder")({
  component: RouteComponent,
});

// A3: [841.89, 1190.55],
// A4: [595.28, 841.89],
// A5: [419.53, 595.28],
// A6: [297.64, 419.53],

function RouteComponent() {
  return (
    <div className="w-full">
      <div className="mx-auto flex h-[calc(100vh-72px)] max-w-7xl items-center justify-center">
        <QuestionList />
        <PaperView />
      </div>
    </div>
  );
}
