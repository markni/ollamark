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
      const MAX_BOOKMARKS = 9999; // Debug limit
      const bookmarks = await loadAllBookmarks();
      // Pre-fill results with all bookmarks, initially with null categories
      const results: (chrome.bookmarks.BookmarkTreeNode & {
        category?: string;
      })[] = bookmarks.slice(0, MAX_BOOKMARKS);

      console.log(`Processing ${results.length} bookmarks...`);

      chrome.runtime.sendMessage({
        type: "sortingInProgress",
        bookmarksSortingInprogress: results,
      });

      for (let i = 0; i < results.length; i++) {
        const bookmark = results[i];
        if (!bookmark?.url) {
          console.log(`Skipping bookmark ${i + 1}: No URL`);
          continue;
        }

        console.log(
          `Processing bookmark ${i + 1}/${results.length}: ${bookmark.title}`
        );

        const category = await getCategoryFromPage({
          wpage: {
            title: bookmark.title,
            pageUrl: bookmark.url,
          },
          subfolders: message.subfolders,
          ollamaUrl: message.ollamaUrl,
          llmModel: message.llmModel,
        });

        if (!category) {
          console.log(`Warning: No category found for bookmark ${i + 1}`);
          continue;
        }

        // Update the category in the existing results array
        results[i].category = category;

        console.log(`Categorized ${bookmark.title} as: ${category}`);

        // Send progress update
        chrome.runtime.sendMessage({
          type: "sortingInProgress",
          bookmarksSortingInprogress: results,
        });
      }

      console.log("Final categorized bookmarks:", results);
      sendResponse({
        success: true,
        categorizedBookmarks: results,
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
