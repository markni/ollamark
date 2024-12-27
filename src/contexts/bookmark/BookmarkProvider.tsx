import { useState, ReactNode } from "react";
import { BookmarkContext } from "./BookmarkContext";

export function BookmarkProvider({ children }: { children: ReactNode }) {
  const [openFolders, setOpenFolders] = useState<string[]>([]);

  return (
    <BookmarkContext.Provider value={{ openFolders, setOpenFolders }}>
      {children}
    </BookmarkContext.Provider>
  );
}
