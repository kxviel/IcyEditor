import QuestionBuilder from "@/features/Builder/QuestionBuilder";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_auth/builder")({
  component: () => (
    <div className="h-[calc(100vh-72px)] w-full bg-[#F9F5FF]">
      {/* <div className="mx-auto h-full max-w-screen-xl"> */}
      <QuestionBuilder />
      {/* </div> */}
    </div>
  ),
});
