import { useEffect, useCallback, useState } from "react";
import { Check, X } from "lucide-react";
import { useBookmarkContext } from "@/contexts/bookmark";
import { SiOllama } from "@icons-pack/react-simple-icons";
import TypewriterText from "@/components/TypewriterText";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { MESSAGE_ACTIONS } from "@/constants";

export function OllamaAccordion() {
  const { isOllamaOnline, setIsOllamaOnline, ollamaUrl, setOllamaUrl } =
    useBookmarkContext();

  const [ollamaVersion, setOllamaVersion] = useState<string | null>(null);
  const [isOllamaChecked, setIsOllamaChecked] = useState(false);
  const [inputUrl, setInputUrl] = useState(ollamaUrl);
  const [isValidPort, setIsValidPort] = useState(true);
  const [hasTypingFinished, setHasTypingFinished] = useState(false);

  const checkOllamaStatus = useCallback(() => {
    chrome.runtime.sendMessage(
      {
        action: MESSAGE_ACTIONS.CHECK_OLLAMA,
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

  const validatePort = (port: string) => {
    const portNumber = parseInt(port, 10);
    return !isNaN(portNumber) && portNumber >= 1 && portNumber <= 65535;
  };

  const handlePortChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const port = e.target.value;
    const newUrl = `http://localhost:${port}`;
    setInputUrl(newUrl);
    setIsValidPort(validatePort(port));
    if (validatePort(port)) {
      setOllamaUrl(newUrl);
    }
  };

  const handleTypingFinish = useCallback(() => {
    setHasTypingFinished(true);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="flex items-center gap-2 py-4">
            <SiOllama />
            <TypewriterText
              className="text-xl font-bold"
              onTypingFinish={handleTypingFinish}
            >
              Checking ollama availability
            </TypewriterText>

            {hasTypingFinished &&
              isOllamaChecked &&
              (isOllamaOnline ? (
                <Check className="h-4 w-4 text-green-500 ml-2" />
              ) : (
                <X className="h-4 w-4 text-red-500 ml-2" />
              ))}
          </div>
        </CardTitle>
        <CardDescription>
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
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-8 p-4 border rounded-lg flex flex-col gap-4">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="ollama-port" className="text-sm font-medium">
                Ollama URL
              </label>
              <div className="flex items-center">
                <span className="text-sm text-muted-foreground mr-1">
                  http://localhost:
                </span>
                <input
                  id="ollama-port"
                  type="text"
                  value={inputUrl.split(":")[2]}
                  onChange={handlePortChange}
                  className={`flex h-9 w-32 rounded-md border ${
                    isValidPort ? "border-input" : "border-red-500"
                  } bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50`}
                  placeholder="11434"
                />
              </div>
              {!isValidPort && (
                <p className="text-sm text-red-500">
                  Please enter a valid port number (1-65535)
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
