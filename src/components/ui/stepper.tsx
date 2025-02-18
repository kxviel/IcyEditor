import { Check } from "lucide-react";

interface StepperProps {
  currentStep: number;
  steps: number;
}

const Stepper = ({ currentStep, steps = 3 }: StepperProps) => {
  return (
    <div className="flex items-center">
      {Array.from({ length: steps }).map((_, index) => (
        <div key={index} className="flex items-center">
          <div
            className={`${index <= currentStep ? "bg-violet-500" : "bg-gray-200"} flex h-6 w-6 items-center justify-center rounded-full`}
          >
            {index < currentStep ? (
              <Check className="h-4 w-4 text-white" />
            ) : (
              <div className="h-2 w-2 rounded-full bg-white" />
            )}
          </div>
          {index < steps - 1 && <div className="h-1 w-20 bg-gray-200" />}
        </div>
      ))}
    </div>
  );
};

export default Stepper;
