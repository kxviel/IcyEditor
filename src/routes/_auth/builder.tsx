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
    <div className="flex h-[calc(100vh-70px)] w-full bg-green-300">
      <QuestionList />
      <PaperView />
      {/* <div className="h-full w-1/2 bg-blue-300">
    <div></div>
  </div> */}
    </div>
  );
}
