import { useLocation } from "@tanstack/react-router";
import { Check } from "lucide-react";

const stepperDict: Record<string, number> = {
  "/exam-type": 0,
  "/builder": 1,
  "/preview": 2,
};

const STEPS = 3;

const Stepper = () => {
  const { pathname } = useLocation();

  return (
    <div className="flex items-center">
      {Array.from({ length: STEPS }).map((_, index) => (
        <div key={index} className="flex items-center">
          <div
            className={`${index <= stepperDict[pathname] ? "bg-violet-500" : "bg-gray-200"} flex h-6 w-6 items-center justify-center rounded-full`}
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
  );
};

export default Stepper;
