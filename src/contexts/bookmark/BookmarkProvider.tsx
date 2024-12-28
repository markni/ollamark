import { useState, ReactNode } from "react";
import { BookmarkContext } from "./BookmarkContext";

export function BookmarkProvider({ children }: { children: ReactNode }) {
  const [openFolders, setOpenFolders] = useState<string[]>([]);
  const [isOllamaOnline, setIsOllamaOnline] = useState(false);
  const [llmModel, setLlmModel] = useState("");
  return (
    <BookmarkContext.Provider
      value={{
        openFolders,
        setOpenFolders,
        isOllamaOnline,
        setIsOllamaOnline,
        llmModel,
        setLlmModel,
      }}
    >
      {children}
    </BookmarkContext.Provider>
  );
}
