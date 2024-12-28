import { useEffect, useCallback, useState } from "react";
import { Check, X, Bot } from "lucide-react";
import { useBookmarkContext } from "@/contexts/bookmark";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Accordion,
} from "@/components/ui/accordion";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from "@/components/ui/select";

export function LlmAccordion() {
  const [accordionValue, setAccordionValue] = useState<string[]>([]);
  const [isLlChecked, setIsOllamaChecked] = useState(false);
  const { llmModel, setLlmModel } = useBookmarkContext();
  const [llmModels, setLlmModels] = useState<string[]>([]);

  const checkLlm = useCallback(() => {
    chrome.runtime.sendMessage({ action: "checkLlm" }, (response) => {
      setIsOllamaChecked(true);
      if (!response.success) {
        console.log("Ollama is offline:", response.error);
      } else {
        setLlmModels(response.llmModels);
      }
    });
  }, []);

  useEffect(() => {
    checkLlm();
    const interval = setInterval(checkLlm, 1000);
    return () => clearInterval(interval);
  }, [checkLlm]);

  if (!isLlChecked) {
    return null;
  }

  return (
    <Accordion
      type="multiple"
      value={llmModel ? accordionValue : ["step-1"]}
      onValueChange={(value) => {
        if (llmModel) {
          setAccordionValue(value);
        }
      }}
    >
      <AccordionItem value="step-1">
        <AccordionTrigger>
          <div className="flex items-center gap-2">
            <Bot />
            2. Select a llm model
            {llmModel ? (
              <Check className="h-4 w-4 text-green-500 ml-2" />
            ) : (
              <X className="h-4 w-4 text-red-500 ml-2" />
            )}
          </div>
        </AccordionTrigger>
        <AccordionContent className="mb-8 p-4 border rounded-lg bg-muted flex flex-col gap-4">
          {llmModel ? (
            <div className="flex items-center gap-4 mb-8 p-4 border rounded-lg bg-muted flex-col">
              You have selected {llmModel} as your llm model.
            </div>
          ) : (
            <div>
              Pick a model you want to use to sort your bookmarks. If you don't
              see any listed, make sure you{" "}
              <a
                className="text-blue-500 hover:underline"
                href="https://ollama.com/search"
                target="_blank"
              >
                install a model first.
              </a>
            </div>
          )}

          <div className="mt-4">
            <Select
              value={llmModel || undefined}
              onValueChange={(value) => setLlmModel(value)}
            >
              <SelectTrigger className="focus:ring-0 focus:ring-offset-0">
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent>
                {llmModels.map((model) => (
                  <SelectItem key={model} value={model}>
                    {model}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
