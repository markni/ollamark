import { useState, ReactNode } from "react";
import { BookmarkContext } from "./BookmarkContext";

export function BookmarkProvider({ children }: { children: ReactNode }) {
  const [openFolders, setOpenFolders] = useState<string[]>([]);
  const [isOllamaOnline, setIsOllamaOnline] = useState(false);

  return (
    <BookmarkContext.Provider
      value={{
        openFolders,
        setOpenFolders,
        isOllamaOnline,
        setIsOllamaOnline,
      }}
    >
      {children}
    </BookmarkContext.Provider>
  );
}
