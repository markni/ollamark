import { useState, ReactNode } from "react";
import { BookmarkContext } from "./BookmarkContext";

export function BookmarkProvider({ children }: { children: ReactNode }) {
  const [openFolders, setOpenFolders] = useState<string[]>([]);
  const [isOllamaOnline, setIsOllamaOnline] = useState(false);
  const [llmModel, setLlmModel] = useState("");
  const [subFolders, setSubFolders] = useState<string[]>([]);
  const [rootFolder, setRootFolder] = useState("");
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
        rootFolder,
        setRootFolder,
      }}
    >
      {children}
    </BookmarkContext.Provider>
  );
}
