export type BookmarkContextType = {
  openFolders: string[];
  setOpenFolders: (folders: string[]) => void;
  isOllamaOnline: boolean;
  setIsOllamaOnline: (online: boolean) => void;
};
