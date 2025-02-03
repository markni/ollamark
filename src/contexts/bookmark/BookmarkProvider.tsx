import { useState, ReactNode, useEffect, useRef } from "react";
import { BookmarkContext } from "./BookmarkContext";
import { DEFAULT_SUBFOLDERS, MESSAGE_ACTIONS } from "@/constants";

export function BookmarkProvider({ children }: { children: ReactNode }) {
  const [openFolders, setOpenFolders] = useState<string[]>([]);
  const [isOllamaOnline, setIsOllamaOnline] = useState(false);
  const [llmModel, setLlmModel] = useState("");
  const [subFolders, setSubFolders] = useState<string[]>(DEFAULT_SUBFOLDERS);
  const [rootFolderId, setRootFolderId] = useState("");
  const [rootFolderName, setRootFolderName] = useState("");
  const [ollamaUrl, setOllamaUrl] = useState("http://localhost:11434");
  const [currentStep, setCurrentStep] = useState(1);
  const prevOllamaOnlineRef = useRef(false);
  const prevLlmModelRef = useRef("");
  const prevRootFolderIdRef = useRef("");

  useEffect(() => {
    const checkOllamaStatus = () => {
      chrome.runtime.sendMessage(
        {
          action: MESSAGE_ACTIONS.CHECK_OLLAMA,
          url: ollamaUrl,
        },
        (response) => {
          setIsOllamaOnline(response.success);
          if (!response.success) {
            console.log("Ollama is offline:", response.error);
          }
        }
      );
    };

    checkOllamaStatus();
    const interval = setInterval(checkOllamaStatus, 5000);

    return () => clearInterval(interval);
  }, [ollamaUrl]);

  useEffect(() => {
    if (currentStep === 1 && isOllamaOnline && !prevOllamaOnlineRef.current) {
      setCurrentStep(2);
    } else if (!isOllamaOnline && prevOllamaOnlineRef.current) {
      setCurrentStep(1);
    }
    prevOllamaOnlineRef.current = isOllamaOnline;
  }, [currentStep, isOllamaOnline]);

  useEffect(() => {
    if (currentStep === 2 && llmModel && prevLlmModelRef.current === "") {
      setCurrentStep(3);
    }
    prevLlmModelRef.current = llmModel;
  }, [currentStep, llmModel]);

  useEffect(() => {
    if (
      currentStep === 3 &&
      rootFolderId &&
      prevRootFolderIdRef.current !== rootFolderId
    ) {
      setCurrentStep(4);
    }
    prevRootFolderIdRef.current = rootFolderId;
  }, [currentStep, rootFolderId]);

  return (
    <BookmarkContext.Provider
      value={{
        openFolders,
        setOpenFolders,
        isOllamaOnline,
        setIsOllamaOnline,
        llmModel,
        setLlmModel,
        subFolders,
        setSubFolders,
        rootFolderId,
        setRootFolderId,
        ollamaUrl,
        setOllamaUrl,
        rootFolderName,
        setRootFolderName,
        currentStep,
        setCurrentStep,
      }}
    >
      {children}
    </BookmarkContext.Provider>
  );
}
