import { useBookmarkContext } from "@/contexts/bookmark";

interface StepBlueTabProps {
  className?: string;
}

export function StepBlueTab({ className = "" }: StepBlueTabProps) {
  const {
    currentStep,
    setCurrentStep,
    isOllamaOnline,
    llmModel,
    rootFolderId,
  } = useBookmarkContext();

  // Step availability conditions
  const canAccessStep2 = isOllamaOnline;
  const canAccessStep3 = isOllamaOnline && llmModel;

  // Common class names
  const baseClasses = "transition-all";
  const enabledClasses = "hover:font-bold cursor-pointer";
  const disabledClasses = "opacity-50 cursor-not-allowed";

  return (
    <div
      data-testid="step-blue-tab"
      className={`min-w-[250px] bg-blue-600 text-2xl p-4 rounded-l-xl animate-in slide-in-from-right-1/2 duration-500 relative shadow-[-20px_0px_20px_-15px_rgba(0,0,0,0.3)] ${className}`}
    >
      <ol className="list-decimal list-inside flex flex-col gap-6">
        <li
          className={`${baseClasses} ${
            currentStep === 1 ? "font-bold" : "font-normal text-xl"
          } ${enabledClasses} ${isOllamaOnline ? "line-through" : ""}`}
          onClick={() => setCurrentStep(1)}
        >
          Spin up Ollama
        </li>
        <li
          className={`${baseClasses} ${
            currentStep === 2 ? "font-bold" : "font-normal  text-xl"
          } ${canAccessStep2 ? enabledClasses : disabledClasses} ${
            llmModel ? "line-through" : ""
          }`}
          onClick={() => canAccessStep2 && setCurrentStep(2)}
        >
          Select a model
        </li>
        <li
          className={`${baseClasses} ${
            currentStep === 3 ? "font-bold" : "font-normal  text-xl"
          } ${canAccessStep3 ? enabledClasses : disabledClasses} ${
            rootFolderId ? "line-through" : ""
          }`}
          onClick={() => canAccessStep3 && setCurrentStep(3)}
        >
          Set categories
        </li>
      </ol>
    </div>
  );
}
