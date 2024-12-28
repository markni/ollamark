import { useEffect, useCallback } from "react";
import { Check, X } from "lucide-react";
import { useBookmarkContext } from "@/contexts/bookmark";

export function OllamaStepTrigger() {
  const { isOllamaOnline, setIsOllamaOnline } = useBookmarkContext();

  const checkOllamaStatus = useCallback(() => {
    chrome.runtime.sendMessage({ action: "checkOllama" }, (response) => {
      setIsOllamaOnline(response.success);
      if (!response.success) {
        console.log("Ollama is offline:", response.error);
      }
    });
  }, [setIsOllamaOnline]);

  useEffect(() => {
    checkOllamaStatus();
    const interval = setInterval(checkOllamaStatus, 60000);
    return () => clearInterval(interval);
  }, [checkOllamaStatus]);

  return (
    <div className="flex items-center">
      1. Checking ollama availability
      {isOllamaOnline ? (
        <Check className="h-4 w-4 text-green-500 ml-2" />
      ) : (
        <X className="h-4 w-4 text-red-500 ml-2" />
      )}
    </div>
  );
}
