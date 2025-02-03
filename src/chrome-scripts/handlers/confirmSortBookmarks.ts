import { ConfirmSortBookmarksResponse } from "../types/responses";

export const handleConfirmSortBookmarks = (
  message: {
    categorizedBookmarks: Array<
      chrome.bookmarks.BookmarkTreeNode & { category?: string }
    >;
    rootFolderId: string;
  },
  sendResponse: (response: ConfirmSortBookmarksResponse) => void
) => {
  // Return true to indicate we'll send a response asynchronously
  (async () => {
    try {
      // Get all subfolders in the root folder
      const subfolders = await chrome.bookmarks.getChildren(
        message.rootFolderId
      );
      const moves: { id: string; newParentId: string; index?: number }[] = [];

      // Process each categorized bookmark
      for (const bookmark of message.categorizedBookmarks) {
        if (!bookmark.category || !bookmark.id) continue;

        // Find matching subfolder
        const targetFolder = subfolders.find(
          (folder) =>
            folder.title.toLowerCase() ===
            (bookmark.category as string).toLowerCase()
        );

        if (!targetFolder) {
          console.warn(
            `No matching folder found for category: ${bookmark.category}`
          );
          continue;
        }

        // Add move operation
        moves.push({
          id: bookmark.id,
          newParentId: targetFolder.id,
        });
      }

      // Execute all bookmark moves
      for (const move of moves) {
        await chrome.bookmarks.move(move.id, {
          parentId: move.newParentId,
          index: move.index,
        });
      }

      sendResponse({
        success: true,
      });
    } catch (error) {
      console.error("Error confirming bookmark sort:", error);
      sendResponse({
        success: false,
        error: "Failed to sort bookmarks: " + (error as Error).message,
      });
    }
  })();

  return true;
};
