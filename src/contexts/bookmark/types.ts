export type BookmarkContextType = {
  openFolders: string[];
  setOpenFolders: (folders: string[]) => void;
  isOllamaOnline: boolean;
  setIsOllamaOnline: (online: boolean) => void;
  llmModel: string;
  setLlmModel: (model: string) => void;
  subFolders: string[];
  setSubFolders: (folders: string[]) => void;
  rootFolderId: string;
  setRootFolderId: (folder: string) => void;
  ollamaUrl: string;
  setOllamaUrl: (url: string) => void;
  rootFolderName: string;
  setRootFolderName: (name: string) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
};
