import { DEFAULT_SUBFOLDERS, DEFAULT_ROOT_FOLDER_NAME } from "@/constants";
import { FolderResponse } from "../types/responses";

export const handleCreateFolders = (
  message: {
    folderName?: string;
    subfolders?: string[];
  },
  sendResponse: (response: FolderResponse) => void
) => {
  const bookmarkBarId = "1";
  const folderName = message.folderName || DEFAULT_ROOT_FOLDER_NAME;
  const subfolders = message.subfolders || DEFAULT_SUBFOLDERS;

  chrome.bookmarks.search({ title: folderName }, (results) => {
    const existingFolder = results.find(
      (bookmark) => bookmark.parentId === bookmarkBarId
    );

    if (existingFolder) {
      console.log(`${folderName} folder already exists`);
      chrome.bookmarks.move(existingFolder.id, { index: 0 }, () => {
        if (chrome.runtime.lastError) {
          console.error(
            "Failed to move existing folder:",
            chrome.runtime.lastError
          );
        }
        sendResponse({
          success: true,
          folderId: existingFolder.id,
          folderName: existingFolder.title,
        });
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
              sendResponse({
                success: true,
                folderId: newFolder.id,
                folderName: newFolder.title,
              });
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
