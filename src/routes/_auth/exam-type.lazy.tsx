import { createLazyFileRoute, useLocation } from "@tanstack/react-router";

import { Contact } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useNavigate } from "@tanstack/react-router";
import Stepper from "@/components/ui/stepper";

export const Route = createLazyFileRoute("/_auth/exam-type")({
  component: () => (
    <div className="h-[calc(100vh-72px)] w-full">
      <div className="mx-auto h-full max-w-screen-xl">
        <ExamType />
      </div>
    </div>
  ),
});

const stepperDict: Record<string, number> = {
  "/exam-type": 0,
  "/builder": 1,
  "/preview": 2,
};

function ExamType() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <div className="flex h-full flex-col items-center justify-center gap-6">
      <Stepper currentStep={stepperDict[pathname]} steps={3} />

      <div className="flex flex-col items-center gap-4">
        <p className="text-2xl font-semibold">How do you want to proceed</p>
        <p className="text-gray-500">
          Select your role and proceed to onboarding or login.
        </p>
      </div>

      <div className="flex gap-8">
        <Card
          className="flex w-[343px] flex-col bg-[#6941C6] text-white hover:cursor-pointer hover:opacity-95"
          onClick={() => navigate({ to: "/builder" })}
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
          onClick={() => navigate({ to: "/builder" })}
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
}
