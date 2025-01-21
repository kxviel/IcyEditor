import QuestionBuilder from "@/features/Builder/QuestionBuilder";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/builder")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="w-full">
      <QuestionBuilder />
    </div>
  );
}
