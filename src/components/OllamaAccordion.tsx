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
import TypewriterText from "@/components/TypewriterText";

export function OllamaAccordion() {
  const { isOllamaOnline, setIsOllamaOnline, ollamaUrl, setOllamaUrl } =
    useBookmarkContext();
  const [accordionValue, setAccordionValue] = useState<string[]>([]);
  const [ollamaVersion, setOllamaVersion] = useState<string | null>(null);
  const [isOllamaChecked, setIsOllamaChecked] = useState(false);
  const [inputUrl, setInputUrl] = useState(ollamaUrl);
  const [isValidUrl, setIsValidUrl] = useState(true);
  const [hasTypingFinished, setHasTypingFinished] = useState(false);

  const checkOllamaStatus = useCallback(() => {
    chrome.runtime.sendMessage(
      {
        action: "checkOllama",
        url: ollamaUrl,
      },
      (response) => {
        setIsOllamaChecked(true);
        setIsOllamaOnline(response.success);
        if (!response.success) {
          console.log("Ollama is offline:", response.error);
        } else {
          setOllamaVersion(response.version);
        }
      }
    );
  }, [setIsOllamaOnline, ollamaUrl]);

  useEffect(() => {
    checkOllamaStatus();
    const interval = setInterval(checkOllamaStatus, 5000);
    return () => clearInterval(interval);
  }, [checkOllamaStatus]);

  const validateUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setInputUrl(newUrl);
    setIsValidUrl(validateUrl(newUrl));
    if (validateUrl(newUrl)) {
      setOllamaUrl(newUrl);
    }
  };

  const handleTypingFinish = useCallback(() => {
    setHasTypingFinished(true);
  }, []);

  return (
    <Accordion
      type="multiple"
      value={!isOllamaOnline && isOllamaChecked ? ["step-1"] : accordionValue}
      onValueChange={(value) => {
        setAccordionValue(value);
      }}
    >
      <AccordionItem value="step-1">
        <AccordionTrigger>
          <div className="flex items-center gap-2">
            <SiOllama />
            <TypewriterText onTypingFinish={handleTypingFinish}>
              1. Checking ollama availability
            </TypewriterText>

            {hasTypingFinished &&
              isOllamaChecked &&
              (isOllamaOnline ? (
                <Check className="h-4 w-4 text-green-500 ml-2" />
              ) : (
                <X className="h-4 w-4 text-red-500 ml-2" />
              ))}
          </div>
        </AccordionTrigger>
        <AccordionContent className="mb-8 p-4 border rounded-lg bg-muted flex flex-col gap-4">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="ollama-url" className="text-sm font-medium">
                Ollama API URL
              </label>
              <input
                id="ollama-url"
                type="text"
                value={inputUrl}
                onChange={handleUrlChange}
                className={`flex h-9 w-full rounded-md border ${
                  isValidUrl ? "border-input" : "border-red-500"
                } bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50`}
                placeholder="http://localhost:11434"
              />
              {!isValidUrl && (
                <p className="text-sm text-red-500">Please enter a valid URL</p>
              )}
            </div>
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
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
