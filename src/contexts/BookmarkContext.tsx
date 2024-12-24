import { createContext, useContext, useState, ReactNode } from "react";

interface BookmarkContextType {
  openFolders: string[];
  setOpenFolders: (folders: string[]) => void;
}

const BookmarkContext = createContext<BookmarkContextType | undefined>(
  undefined
);

export function BookmarkProvider({ children }: { children: ReactNode }) {
  const [openFolders, setOpenFolders] = useState<string[]>([]);

  return (
    <BookmarkContext.Provider value={{ openFolders, setOpenFolders }}>
      {children}
    </BookmarkContext.Provider>
  );
}

export function useBookmarkContext() {
  const context = useContext(BookmarkContext);
  if (context === undefined) {
    throw new Error(
      "useBookmarkContext must be used within a BookmarkProvider"
    );
  }
  return context;
}
