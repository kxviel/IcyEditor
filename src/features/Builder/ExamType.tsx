import { Contact } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useNavigate } from "@tanstack/react-router";
import Stepper from "@/components/stepper";
import { useHeaderStore } from "@/store/useHeaderStore";
import { useQuestionBuilderStore } from "@/store/useQuestionBuilderStore";
import { usePageSettingsStore } from "@/store/usePageSettingsStore";
import { useEffect } from "react";

const ExamType = () => {
  const navigate = useNavigate();
  const resetHeader = useHeaderStore((state) => state.reset);
  const resetBuilder = useQuestionBuilderStore((state) => state.reset);
  const resetPageSettings = usePageSettingsStore((state) => state.reset);
  const invalidateRelatedQueries = useQuestionBuilderStore(
    (state) => state.invalidateRelatedQueries,
  );

  useEffect(() => {
    resetHeader();
    resetBuilder();
    resetPageSettings();
    invalidateRelatedQueries();
    localStorage.removeItem("optimized");
  }, [invalidateRelatedQueries, resetBuilder, resetHeader, resetPageSettings]);

  return (
    <div className="flex h-full flex-col items-center justify-center gap-6">
      <Stepper />

      <div className="flex flex-col items-center gap-4">
        <p className="text-2xl font-semibold">How do you want to proceed</p>
        <p className="text-gray-500">
          Select your role and proceed to onboarding or login.
        </p>
      </div>

      <div className="flex gap-8">
        <Card
          className="flex w-[343px] flex-col bg-[#6941C6] text-white hover:cursor-pointer hover:opacity-95"
          onClick={() =>
            navigate({
              to: "/builder/$examId",
              params: { examId: "manual-selection" },
              search: { needPreselection: true },
            })
          }
        >
          <div className="flex h-[274px] flex-col gap-6 px-4 py-5">
            <div className="flex gap-4">
              <div className="flex h-12 w-12 flex-col items-center justify-center rounded-full bg-[#7854cc]">
                <Contact />
              </div>

              <div>
                <p className="font-semibold">Manual Exam Paper</p>
                <p className="text-sm">Provides more flexibilty to the user</p>
              </div>
            </div>

            <p className="text-sm opacity-60">
              Take full control of your exam paper creation!
            </p>
            <ul className="list-disc space-y-2 pl-4 text-sm opacity-60">
              <li>Select questions manually from multiple or a single book.</li>
              <li>Customize the exam structure as per your preference.</li>
              <li>Ideal for teachers who want more flexibility.</li>
            </ul>
          </div>

          <p className="flex h-[75px] w-full flex-1 items-center justify-end border-t border-white p-3 text-sm font-semibold">
            Generate Now
          </p>
        </Card>

        <Card
          className="relative flex h-[319px] w-[343px] flex-col bg-[#6941C6] text-white hover:cursor-pointer hover:opacity-95"
          onClick={() =>
            navigate({
              to: "/builder/$examId",
              params: { examId: "auto-selection" },
              search: { needPreselection: true },
            })
          }
        >
          <div className="flex h-[274px] flex-col gap-6 px-4 py-5">
            <div className="flex gap-4">
              <div className="flex h-12 w-12 flex-col items-center justify-center rounded-full bg-[#7854cc]">
                <Contact />
              </div>

              <div>
                <p className="font-semibold">Auto Exam Paper</p>
                <p className="text-sm">A quick and easy method for creating</p>
              </div>
            </div>

            <p className="text-sm opacity-60">
              Save time with AI-powered question selection!
            </p>
            <ul className="list-disc space-y-2 pl-4 text-sm opacity-60">
              <li>Perfect for quick test creation.</li>
              <li>
                Generate an exam paper in seconds by selecting question types.
              </li>
              <li>
                No need to pick individual questions—let the system do the work.
              </li>
            </ul>
          </div>

          <p className="flex h-[75px] w-full flex-1 items-center justify-end border-t border-white p-3 text-sm font-semibold">
            Generate Now
          </p>

          <div className="absolute right-0 top-[-10px] rounded-full border border-yellow-300 bg-yellow-50 px-2 text-sm text-yellow-600">
            Fully Automatic
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ExamType;
