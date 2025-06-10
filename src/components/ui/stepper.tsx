import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { useQuestionBuilderStore } from "@/store/useQuestionBuilderStore";
import { useState } from "react";

const STEPS = ["Exam Type", "Builder", "Preview"];
const builderPaths = ["/builder/manual-selection", "/builder/auto-selection"];
const stepperDict: Record<string, number> = {
  "/exam-type": 0,
  "/builder/manual-selection": 1,
  "/builder/auto-selection": 1,
  "/preview": 2,
};
const routeDict: Record<number, Record<string, any>> = {
  0: { to: "/exam-type" },
  1: {
    to: "/builder/$examId",
    params: { examId: "manual-selection" },
    search: { needPreselection: false },
  },
  2: { to: "/preview" },
};

const Stepper = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const fields = useQuestionBuilderStore((state) => state.fields);

  const [isBlockerOpen, setIsBlockerOpen] = useState(false);
  const [pendingValue, setPendingValue] = useState<Record<string, any> | null>(
    null,
  );

  const handleClick = (clickedIndex: number) => {
    if (clickedIndex === 0) {
      if (pathname === "/exam-type") {
        return;
      } else if (builderPaths.includes(pathname)) {
        setPendingValue(routeDict[clickedIndex]);
        setIsBlockerOpen(true);
      } else if (pathname === "/preview") {
        setPendingValue(routeDict[clickedIndex]);
        setIsBlockerOpen(true);
      }
    } else if (clickedIndex === 1) {
      if (pathname === "/exam-type") {
        setPendingValue(routeDict[clickedIndex]);
        setIsBlockerOpen(true);
      } else if (builderPaths.includes(pathname)) {
        return;
      } else if (pathname === "/preview") {
        navigate(routeDict[clickedIndex]);
      }
    } else if (clickedIndex === 2) {
      if (pathname === "/exam-type") {
        setPendingValue(routeDict[clickedIndex]);
        setIsBlockerOpen(true);
      } else if (builderPaths.includes(pathname) && fields.size > 0) {
        navigate(routeDict[clickedIndex]);
      } else if (builderPaths.includes(pathname) && fields.size === 0) {
        return;
      } else if (pathname === "/preview") {
        return;
      }
    }
  };

  const handleConfirm = () => {
    if (pendingValue !== null) {
      navigate(pendingValue);
      setPendingValue(null);
    }
    setIsBlockerOpen(false);
  };

  const handleCancel = () => {
    setPendingValue(null);
    setIsBlockerOpen(false);
  };

  return (
    <>
      <div className="flex items-center justify-between">
        {STEPS.map((step, index) => (
          <div className="gap flex items-start" key={step}>
            {/* Circle w Label */}
            <div className="flex flex-col items-center">
              <div
                className={`${
                  index <= stepperDict[pathname]
                    ? "bg-violet-500 text-white"
                    : "bg-gray-200 text-gray-400"
                } mb-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full transition-all duration-200 hover:shadow-md`}
                onClick={() => handleClick(index)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleClick(index);
                  }
                }}
              >
                {index < stepperDict[pathname] ? (
                  <Check className="h-4 w-4 text-white" />
                ) : (
                  <div className="h-2 w-2 rounded-full bg-white" />
                )}
              </div>
              <span className="text-center text-sm font-medium text-gray-700">
                {step}
              </span>
            </div>

            {/* Line */}
            {index < STEPS.length - 1 && (
              <div
                className={`mt-3 h-1 w-20 ${
                  index < stepperDict[pathname]
                    ? "bg-violet-500"
                    : "bg-gray-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {isBlockerOpen && (
        <AlertDialog open={isBlockerOpen} onOpenChange={setIsBlockerOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Leave Page?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to continue? All progress will be lost.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={handleCancel}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirm}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
};

export default Stepper;
