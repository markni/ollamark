import { useState, ReactNode } from "react";
import { BookmarkContext } from "./BookmarkContext";
import { DEFAULT_SUBFOLDERS } from "@/constants";

export function BookmarkProvider({ children }: { children: ReactNode }) {
  const [openFolders, setOpenFolders] = useState<string[]>([]);
  const [isOllamaOnline, setIsOllamaOnline] = useState(false);
  const [llmModel, setLlmModel] = useState("");
  const [subFolders, setSubFolders] = useState<string[]>(DEFAULT_SUBFOLDERS);
  const [rootFolderId, setRootFolderId] = useState("");
  const [rootFolderName, setRootFolderName] = useState("");
  const [ollamaUrl, setOllamaUrl] = useState("http://localhost:11434");
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
      }}
    >
      {children}
    </BookmarkContext.Provider>
  );
}
