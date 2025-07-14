import ExamType from "@/features/Builder/ExamType";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_auth/exam-type")({
  component: () => (
    <div className="h-[calc(100vh-72px)] w-full">
      <div className="mx-auto h-full max-w-screen-xl">
        <ExamType />
      </div>
    </div>
  ),
});
