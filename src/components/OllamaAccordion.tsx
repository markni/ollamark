import { useEffect, useCallback, useState } from "react";
import { Check, X } from "lucide-react";
import { useBookmarkContext } from "@/contexts/bookmark";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Accordion,
} from "@/components/ui/accordion";
import { SiOllama } from "@icons-pack/react-simple-icons";

export function OllamaAccordion() {
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
            <SiOllama />
            1. Checking ollama availability
            {isOllamaOnline ? (
              <Check className="h-4 w-4 text-green-500 ml-2" />
            ) : (
              <X className="h-4 w-4 text-red-500 ml-2" />
            )}
          </div>
        </AccordionTrigger>
        <AccordionContent className="mb-8 p-4 border rounded-lg bg-muted flex flex-col gap-4">
          {isOllamaOnline ? (
            <div>
              Your Ollama v.{ollamaVersion} is running and ready to use!{" "}
            </div>
          ) : (
            <div>
              Ollama is not running. Please make sure:
              <ul className="list-disc pl-6 mt-2">
                <li>
                  <a
                    href="https://ollama.com/download"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    Ollama is installed
                  </a>{" "}
                  on your system
                </li>
                <li>The Ollama app / service is running</li>
              </ul>
            </div>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
