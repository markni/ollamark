import { createContext } from "react";
import { BookmarkContextType } from "./types";

export const BookmarkContext = createContext<BookmarkContextType>({
  openFolders: [],
  setOpenFolders: () => {}, // Empty function placeholder
  isOllamaOnline: false,
  setIsOllamaOnline: () => {},
  llmModel: '',
  setLlmModel: () => {},
  subFolders: [], // Or DEFAULT_SUBFOLDERS if you want
  setSubFolders: () => {},
  rootFolder: '',
  setRootFolder: () => {},
});
