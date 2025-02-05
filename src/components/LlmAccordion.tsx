import { useEffect, useCallback, useState } from "react";
import { Check, X, Bot, RefreshCw } from "lucide-react";
import { useBookmarkContext } from "@/contexts/bookmark";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from "@/components/ui/select";
import TypewriterText from "@/components/TypewriterText";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MESSAGE_ACTIONS } from "@/constants";

export function LlmAccordion() {
  const [isLlmChecked, setIsLlmChecked] = useState(false);
  const { llmModel, setLlmModel, isOllamaOnline } = useBookmarkContext();
  const [llmModels, setLlmModels] = useState<string[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [isTypingFinished, setIsTypingFinished] = useState(false);

  const checkLlm = useCallback(() => {
    setIsChecking(true);
    chrome.runtime.sendMessage(
      { action: MESSAGE_ACTIONS.CHECK_LLM },
      (response) => {
        setIsLlmChecked(true);
        setTimeout(() => {
          setIsChecking(false);
        }, 500);
        if (!response.success) {
          console.log("Ollama is offline:", response.error);
        } else {
          setLlmModels(response.llmModels);
        }
      }
    );
  }, []);

  useEffect(() => {
    checkLlm();
  }, [checkLlm]);

  if (!isLlmChecked || !isOllamaOnline) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="flex items-center gap-2 py-4">
            <Bot />
            <TypewriterText
              className="text-xl font-bold"
              onTypingFinish={() => setIsTypingFinished(true)}
            >
              Pick a LLM model
              {llmModel && <span className="text-muted-foreground"></span>}
            </TypewriterText>

            {isTypingFinished &&
              (llmModel ? (
                <Check className="h-4 w-4 text-green-500 ml-2" />
              ) : (
                <X className="h-4 w-4 text-red-500 ml-2" />
              ))}
          </div>
        </CardTitle>
        <CardDescription>
          {llmModel ? (
            <p>Change the model to sort your bookmarks.</p>
          ) : (
            <p>
              Pick a model you want to use to sort your bookmarks. If you don't
              see any listed, make sure you{" "}
              <a
                className="text-blue-500 hover:underline"
                href="https://ollama.com/search"
                target="_blank"
              >
                install a model first.
              </a>
            </p>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-8 p-4 border rounded-lg flex flex-col gap-4">
          <label htmlFor="llm-model-select" className="text-sm font-medium">
            LLM models installed on your system
          </label>
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
              <SelectTrigger
                id="llm-model-select"
                className="focus:ring-0 focus:ring-offset-0"
              >
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
        </div>
      </CardContent>
    </Card>
  );
}
