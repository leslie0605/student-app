import React from "react";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  currentStep?: number;
  totalSteps?: number;
  progress?: number;
  showText?: boolean;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  currentStep,
  totalSteps,
  progress,
  showText = true,
  className,
}) => {
  // Calculate progress percentage either from direct value or from steps
  const progressPercentage =
    progress !== undefined
      ? progress
      : currentStep !== undefined && totalSteps !== undefined
      ? (currentStep / totalSteps) * 100
      : 0;

  return (
    <div className={cn("w-full", className)}>
      {showText && currentStep !== undefined && totalSteps !== undefined && (
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span>
            {currentStep} of {totalSteps}
          </span>
          <span>{Math.round(progressPercentage)}% complete</span>
        </div>
      )}
      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-magic-blue to-magic-purple transition-all duration-500 ease-out"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
