import PaperView from "@/features/Builder/PaperView";
import QuestionList from "@/features/Builder/QuestionList";
import PaperPrerequisitesModal from "@/features/Home/PaperPrerequisitesModal";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/_auth/builder")({
  component: RouteComponent,
});

function RouteComponent() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="w-full bg-[#F9F5FF]">
      {!isOpen && (
        <div className="mx-auto flex h-[calc(100vh-72px)] max-w-7xl items-center justify-center">
          <QuestionList />
          <PaperView />
        </div>
      )}

      {/* Modal */}
      <PaperPrerequisitesModal isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
}
