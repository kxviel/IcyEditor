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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useQuestionBuilderStore } from "@/store/useQuestionBuilderStore";
import { useState } from "react";

const STEPS = 3;
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
      <TooltipProvider delayDuration={300}>
        <div className="flex items-center">
          {Array.from({ length: STEPS }).map((_, index) => (
            <div key={index} className="flex items-center">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className={`${index <= stepperDict[pathname] ? "bg-violet-500" : "bg-gray-200"} flex h-6 w-6 items-center justify-center rounded-full hover:cursor-pointer hover:shadow-md`}
                    onClick={() => handleClick(index)}
                  >
                    {index < stepperDict[pathname] ? (
                      <Check className="h-4 w-4 text-white" />
                    ) : (
                      <div className="h-2 w-2 rounded-full bg-white" />
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent className="border border-violet-200 bg-white/80 text-black">
                  <p>
                    {index === 0
                      ? "Exam Type"
                      : index === 1
                        ? "Builder"
                        : "Preview"}
                  </p>
                </TooltipContent>
              </Tooltip>

              {index < STEPS - 1 && <div className="h-1 w-20 bg-gray-200" />}
            </div>
          ))}
        </div>
      </TooltipProvider>

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
