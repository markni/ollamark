import { SortBookmarksResponse } from "../types/responses";
import loadAllBookmarks from "../lib/loadAllBookmarks";
import getCategoryFromPage from "../lib/getCategoryFromPage";

export const handleSortBookmarks = (
  message: { ollamaUrl?: string; subfolders?: string[]; llmModel: string },
  sendResponse: (response: SortBookmarksResponse) => void
): boolean => {
  // Wrap the async logic in an immediately-invoked async function
  (async () => {
    try {
      const bookmarks = await loadAllBookmarks();
      const firstBookmark = bookmarks[0];

      if (!firstBookmark?.url) {
        sendResponse({ success: false, error: "First bookmark has no URL" });
        return;
      }

      const category = await getCategoryFromPage({
        wpage: {
          title: firstBookmark.title,
          pageUrl: firstBookmark.url,
        },
        subfolders: message.subfolders,
        ollamaUrl: message.ollamaUrl,
        llmModel: message.llmModel,
      });

      if (!category) {
        throw new Error("Failed to get category from page");
      }

      console.log("First bookmark category:", category);
      sendResponse({ success: true });
    } catch (error) {
      console.error("Error processing bookmarks:", error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      sendResponse({ success: false, error: errorMessage });
    }
  })();

  // Return true to indicate we'll send response asynchronously
  return true;
};
