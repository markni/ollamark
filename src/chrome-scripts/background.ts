/// <reference types="chrome"/>

chrome.action.onClicked.addListener(() => {
  console.log("Extension icon clicked");

  chrome.tabs.create({ url: "options.html" });
});

// Listen for when the extension is first installed or updated
chrome.runtime.onInstalled.addListener((details) => {
  console.log("Extension installed:", details.reason);
});

// Listen for messages from other parts of the extension
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  console.log("Received message:", message);

  if (message.action === "getBookmarks") {
    chrome.bookmarks.getTree((bookmarkTreeNodes) => {
      sendResponse({ bookmarkTree: bookmarkTreeNodes });
    });
    return true; // Indicates that the response is sent asynchronously
  }

  if (message.action === "createFolders") {
    // Use the known ID for bookmark bar: "1"
    const bookmarkBarId = "1";

    // Check if "test" folder exists
    chrome.bookmarks.search({ title: "test" }, (results) => {
      const testFolder = results.find(
        (bookmark) => bookmark.parentId === bookmarkBarId
      );

      if (testFolder) {
        console.log("Test folder already exists");
        // Move existing folder to the front
        chrome.bookmarks.move(testFolder.id, { index: 0 }, () => {
          if (chrome.runtime.lastError) {
            console.error(
              "Failed to move existing folder:",
              chrome.runtime.lastError
            );
          }
          sendResponse({ success: true });
        });
        return;
      }

      // Create "test" folder
      chrome.bookmarks.create(
        { parentId: bookmarkBarId, title: "test" },
        (newFolder) => {
          if (chrome.runtime.lastError) {
            console.error(
              "Failed to create test folder:",
              chrome.runtime.lastError
            );
            sendResponse({
              success: false,
              error: "Failed to create test folder",
            });
            return;
          }

          // Move the folder to the front
          chrome.bookmarks.move(newFolder.id, { index: 0 }, () => {
            if (chrome.runtime.lastError) {
              console.error("Failed to move folder:", chrome.runtime.lastError);
              // Continue anyway since the folder was created
            }

            // Create subfolders with the new categories
            const subfolders = [
              "Technology",
              "Code",
              "Tutorial",
              "Finance",
              "Entertainment",
              "Gaming",
              "Videos",
              "Food",
              "Media",
              "Documents",
              "Shopping",
            ];
            Promise.all(
              subfolders.map((title) =>
                chrome.bookmarks.create({
                  parentId: newFolder.id,
                  title: title,
                })
              )
            )
              .then(() => {
                console.log("All folders created successfully");
                sendResponse({ success: true });
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
    return true; // Indicates that the response is sent asynchronously
  }
});
