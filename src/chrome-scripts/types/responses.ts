export interface OllamaResponse {
  success: boolean;
  version?: string;
  error?: string;
}

export interface BookmarkResponse {
  bookmarkTree: chrome.bookmarks.BookmarkTreeNode[];
}

export interface FolderResponse {
  success: boolean;
  folderId?: string;
  error?: string;
}

export interface LlmResponse {
  success: boolean;
  llmModels?: string[];
  error?: string;
}
