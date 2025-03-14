import RefreshBlockerModal from "@/features/Builder/RefreshBlockerModal";
import { useBlocker, useLocation, useNavigate } from "@tanstack/react-router";
import { Check } from "lucide-react";

const stepperDict: Record<string, number> = {
  "/exam-type": 0,
  "/builder/manual-selection": 1,
  "/builder/auto-selection": 1,
  "/preview": 2,
};

const STEPS = 3;

const Stepper = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const { proceed, reset, status } = useBlocker({
    shouldBlockFn: ({ next, current }) => {
      // Extract the current path and next path
      const currentPath = current.pathname;
      const nextPath = next.pathname;

      // Navigation rules
      if (currentPath.includes("/builder/") || currentPath === "/preview") {
        // Block navigation to exam-type from both builder and preview
        return nextPath === "/exam-type";
      }

      // Allow all other navigation
      return false;
    },
    withResolver: true,
  });

  const handleClick = (clickedIndex: number) => {
    if (clickedIndex === 0) {
      navigate({ to: "/exam-type" });
    } else if (clickedIndex === 1) {
      navigate({
        to: "/builder/$examId",
        params: { examId: "manual-selection" },
        search: { needPreselection: false },
      });
    } else {
      navigate({
        to: "/preview",
      });
    }
  };

  return (
    <>
      <div className="flex items-center">
        {Array.from({ length: STEPS }).map((_, index) => (
          <div key={index} className="flex items-center">
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
            {index < STEPS - 1 && <div className="h-1 w-20 bg-gray-200" />}
          </div>
        ))}
      </div>

      {status === "blocked" && (
        <RefreshBlockerModal
          isBlockerOpen={status === "blocked"}
          reset={reset}
          proceed={proceed}
        />
      )}
    </>
  );
};

export default Stepper;
