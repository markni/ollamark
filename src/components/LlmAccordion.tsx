import { useEffect, useCallback, useState } from "react";
import { Check, X, Bot } from "lucide-react";
import { useBookmarkContext } from "@/contexts/bookmark";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Accordion,
} from "@/components/ui/accordion";

export function LlmAccordion() {
  const { isOllamaOnline, setIsOllamaOnline } = useBookmarkContext();
  const [accordionValue, setAccordionValue] = useState<string[]>([]);
  const [ollamaVersion, setOllamaVersion] = useState<string | null>(null);
  const [isOllamaChecked, setIsOllamaChecked] = useState(false);

  const checkOllamaStatus = useCallback(() => {
    chrome.runtime.sendMessage({ action: "checkOllama" }, (response) => {
      setIsOllamaChecked(true);
      setIsOllamaOnline(response.success);
      if (!response.success) {
        console.log("Ollama is offline:", response.error);
      } else {
        setOllamaVersion(response.version);
      }
    });
  }, [setIsOllamaOnline]);

  useEffect(() => {
    checkOllamaStatus();
    const interval = setInterval(checkOllamaStatus, 1000);
    return () => clearInterval(interval);
  }, [checkOllamaStatus]);

  if (!isOllamaChecked) {
    return null;
  }

  return (
    <Accordion
      type="multiple"
      value={isOllamaOnline ? accordionValue : ["step-1"]}
      onValueChange={(value) => {
        if (isOllamaOnline) {
          setAccordionValue(value);
        }
      }}
    >
      <AccordionItem value="step-1">
        <AccordionTrigger>
          <div className="flex items-center gap-2">
            <Bot />
            2. Select a llm model
            {isOllamaOnline ? (
              <Check className="h-4 w-4 text-green-500 ml-2" />
            ) : (
              <X className="h-4 w-4 text-red-500 ml-2" />
            )}
          </div>
        </AccordionTrigger>
        <AccordionContent>
          {isOllamaOnline ? (
            <div className="flex items-center gap-2">
              Your Ollama v.{ollamaVersion} is running and ready to use!{" "}
            </div>
          ) : (
            <div>
              Ollama is not running. Please make sure:
              <ul className="list-disc pl-6 mt-2">
                <li>Ollama is installed on your system</li>
                <li>The Ollama service is running</li>
                <li>It's accessible at localhost:11434</li>
              </ul>
            </div>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
