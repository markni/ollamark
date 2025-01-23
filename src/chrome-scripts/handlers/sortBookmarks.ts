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
      const results = [];

      console.log(
        `Processing ${Math.min(bookmarks.length, MAX_BOOKMARKS)} bookmarks...`
      );

      for (let i = 0; i < Math.min(bookmarks.length, MAX_BOOKMARKS); i++) {
        const bookmark = bookmarks[i];
        if (!bookmark?.url) {
          console.log(`Skipping bookmark ${i + 1}: No URL`);
          continue;
        }

        console.log(
          `Processing bookmark ${i + 1}/${Math.min(
            bookmarks.length,
            MAX_BOOKMARKS
          )}: ${bookmark.title}`
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

        results.push({
          ...bookmark,
          category: category,
        });

        console.log(`Categorized ${bookmark.title} as: ${category}`);
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
