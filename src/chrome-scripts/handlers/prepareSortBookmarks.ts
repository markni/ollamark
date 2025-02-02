import { PrepareSortBookmarksResponse } from "../types/responses";
import loadAllBookmarks from "../lib/loadAllBookmarks";

export const handlePrepareSortBookmarks = (
  _message: unknown,
  sendResponse: (response: PrepareSortBookmarksResponse) => void
): boolean => {
  // Wrap the async logic in an immediately-invoked async function

  (async () => {
    try {
      const MAX_BOOKMARKS = 9999; // Debug limit
      const bookmarks = await loadAllBookmarks();
      // Pre-fill results with all bookmarks, initially with null categories
      const results: (chrome.bookmarks.BookmarkTreeNode & {
        category?: string;
      })[] = bookmarks.slice(0, MAX_BOOKMARKS);

      sendResponse({
        success: true,
        unsortedBookmarks: results,
      });
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
