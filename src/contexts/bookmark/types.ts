export type BookmarkContextType = {
  openFolders: string[];
  setOpenFolders: (folders: string[]) => void;
  isOllamaOnline: boolean;
  setIsOllamaOnline: (online: boolean) => void;
  llmModel: string;
  setLlmModel: (model: string) => void;
  subFolders: string[];
  setSubFolders: (folders: string[]) => void;
  rootFolder: string;
  setRootFolder: (folder: string) => void;
};
