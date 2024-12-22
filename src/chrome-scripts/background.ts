/// <reference types="chrome"/>

import { DEFAULT_SUBFOLDERS } from "@/constants";

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

  // Add new message handler for checking Ollama
  if (message.action === "checkOllama") {
    console.log("Checking Ollama status");
    fetch("http://localhost:11434/api/version")
      .then((response) => response.json())
      .then((data) => {
        console.log("Ollama is online:", data);
        sendResponse({ success: true, version: data.version });
      })
      .catch((error) => {
        console.log("Ollama is offline or unreachable:", error);
        sendResponse({ success: false, error: error.message });
      });
    return true; // Indicates that the response is sent asynchronously
  }

  if (message.action === "getBookmarks") {
    chrome.bookmarks.getTree((bookmarkTreeNodes) => {
      sendResponse({ bookmarkTree: bookmarkTreeNodes });
    });
    return true; // Indicates that the response is sent asynchronously
  }

  if (message.action === "createFolders") {
    const bookmarkBarId = "1";

    chrome.bookmarks.search({ title: "test" }, (results) => {
      const testFolder = results.find(
        (bookmark) => bookmark.parentId === bookmarkBarId
      );

      if (testFolder) {
        console.log("Test folder already exists");
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

          chrome.bookmarks.move(newFolder.id, { index: 0 }, () => {
            if (chrome.runtime.lastError) {
              console.error("Failed to move folder:", chrome.runtime.lastError);
            }

            Promise.all(
              DEFAULT_SUBFOLDERS.map((title: string) =>
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
  }
});
