import { DEFAULT_SUBFOLDERS } from "@/constants";
import { FolderResponse } from "../types/responses";

export const handleCreateFolders = (
  message: {
    folderName?: string;
    subfolders?: string[];
  },
  sendResponse: (response: FolderResponse) => void
) => {
  const bookmarkBarId = "1";
  const folderName = message.folderName || "test";
  const subfolders = message.subfolders || DEFAULT_SUBFOLDERS;

  chrome.bookmarks.search({ title: folderName }, (results) => {
    const testFolder = results.find(
      (bookmark) => bookmark.parentId === bookmarkBarId
    );

    if (testFolder) {
      console.log(`${folderName} folder already exists`);
      chrome.bookmarks.move(testFolder.id, { index: 0 }, () => {
        if (chrome.runtime.lastError) {
          console.error(
            "Failed to move existing folder:",
            chrome.runtime.lastError
          );
        }
        sendResponse({ success: true, folderId: testFolder.id });
      });
      return;
    }

    chrome.bookmarks.create(
      { parentId: bookmarkBarId, title: folderName },
      (newFolder) => {
        if (chrome.runtime.lastError) {
          console.error(
            `Failed to create ${folderName} folder:`,
            chrome.runtime.lastError
          );
          sendResponse({
            success: false,
            error: `Failed to create ${folderName} folder`,
          });
          return;
        }

        chrome.bookmarks.move(newFolder.id, { index: 0 }, () => {
          if (chrome.runtime.lastError) {
            console.error("Failed to move folder:", chrome.runtime.lastError);
          }

          Promise.all(
            subfolders.map((title: string) =>
              chrome.bookmarks.create({
                parentId: newFolder.id,
                title: title,
              })
            )
          )
            .then(() => {
              console.log("All folders created successfully");
              sendResponse({ success: true, folderId: newFolder.id });
            })
            .catch((error) => {
              console.error("Failed to create subfolders:", error);
              sendResponse({
                success: false,
                error: "Failed to create subfolders",
              });
            });
        });
      }
    );
  });
  return true;
};
