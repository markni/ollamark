import { useEffect, useCallback, useState } from "react";
import { Check, X, Bot, RefreshCw } from "lucide-react";
import { useBookmarkContext } from "@/contexts/bookmark";
import { Button } from "@/components/ui/button";

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
import Typewriter from "@/components/TypewriterText";

export function LlmAccordion() {
  const [accordionValue, setAccordionValue] = useState<string[]>([]);
  const [isLlmChecked, setIsLlmChecked] = useState(false);
  const { llmModel, setLlmModel, isOllamaOnline } = useBookmarkContext();
  const [llmModels, setLlmModels] = useState<string[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [isTypingFinished, setIsTypingFinished] = useState(false);

  const checkLlm = useCallback(() => {
    setIsChecking(true);
    chrome.runtime.sendMessage({ action: "checkLlm" }, (response) => {
      setIsLlmChecked(true);
      setTimeout(() => {
        setIsChecking(false);
      }, 500);
      if (!response.success) {
        console.log("Ollama is offline:", response.error);
      } else {
        setLlmModels(response.llmModels);
      }
    });
  }, []);

  useEffect(() => {
    checkLlm();
  }, [checkLlm]);

  if (!isLlmChecked || !isOllamaOnline) {
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
            <Typewriter onTypingFinish={() => setIsTypingFinished(true)}>
              2. Select a llm model
              {llmModel && (
                <span className="text-muted-foreground">
                  ({llmModel} selected)
                </span>
              )}
            </Typewriter>

            {isTypingFinished &&
              (llmModel ? (
                <Check className="h-4 w-4 text-green-500 ml-2" />
              ) : (
                <X className="h-4 w-4 text-red-500 ml-2" />
              ))}
          </div>
        </AccordionTrigger>
        <AccordionContent className="mb-8 p-4 border rounded-lg bg-muted flex flex-col gap-4">
          {llmModel ? (
            <Typewriter>
              You have selected {llmModel} as your llm model.
            </Typewriter>
          ) : (
            <Typewriter>
              Pick a model you want to use to sort your bookmarks. If you don't
              see any listed, make sure you{" "}
              <a
                className="text-blue-500 hover:underline"
                href="https://ollama.com/search"
                target="_blank"
              >
                install a model first.
              </a>
            </Typewriter>
          )}

          <div className="mt-4 flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={checkLlm}
              title="Refresh LLM models"
              disabled={isChecking}
            >
              <RefreshCw
                className={`h-5 w-5 ${isChecking ? "animate-spin" : ""}`}
              />
            </Button>
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
