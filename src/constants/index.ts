export const DEFAULT_SUBFOLDERS = [
  "AI",
  "Technology",
  "Code",
  "Tutorial",
  "Finance",
  "Entertainment",
  "Gaming",
  // "Videos",
  "Food",
  "Sports",
  // "Media",
  "Documents",
  "Shopping",
  "Other",
].sort();

export const DEFAULT_OLLAMA_URL = "http://localhost:11434";

export const DEFAULT_ROOT_FOLDER_NAME = "Sorted Bookmarks";

export const MESSAGE_ACTIONS = {
  CHECK_OLLAMA: "checkOllama",
  CHECK_LLM: "checkLlm",
  GET_BOOKMARKS: "getBookmarks",
  CREATE_FOLDERS: "createFolders",
  SORT_BOOKMARKS: "sortBookmarks",
  PREPARE_SORT_BOOKMARKS: "prepareSortBookmarks",
  CONFIRM_SORT_BOOKMARKS: "confirmSortBookmarks",
} as const;
