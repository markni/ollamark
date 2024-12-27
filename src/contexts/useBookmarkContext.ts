import { useContext, createContext } from "react";

interface BookmarkContextType {
  openFolders: string[];
  setOpenFolders: (folders: string[]) => void;
}


export const BookmarkContext = createContext<BookmarkContextType | undefined>(
  undefined
);

export function useBookmarkContext() {
  const context = useContext(BookmarkContext);
  if (context === undefined) {
    throw new Error(
      "useBookmarkContext must be used within a BookmarkProvider"
    );
  }
  return context;
}
