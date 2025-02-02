/// <reference types="chrome"/>

import { handleCheckOllama } from "./handlers/checkOllama";
import { handleGetBookmarks } from "./handlers/getBookmarks";
import { handleCreateFolders } from "./handlers/createFolders";
import { handleCheckLlm } from "./handlers/checkLlm";
import {
  handleSortBookmarks,
  abortCurrentSorting,
} from "./handlers/sortBookmarks";
import { handlePrepareSortBookmarks } from "./handlers/prepareSortBookmarks";
import { setupHeaderRules } from "./lib/setupHeaderRules";
import { MESSAGE_ACTIONS } from "../constants";

// Run when extension starts up
setupHeaderRules("localhost").catch((error) => {
  console.error("Failed to setup header rules:", error);
});

chrome.action.onClicked.addListener(async () => {
  console.log("Extension icon clicked");

  // Find any existing options.html tabs
  const existingTabs = await chrome.tabs.query({
    url: chrome.runtime.getURL("options.html"),
  });

  if (existingTabs.length > 0) {
    // If options tab exists, focus on it
    await chrome.tabs.update(existingTabs[0].id!, { active: true });
    // If the window isn't focused, focus it too
    if (existingTabs[0].windowId) {
      await chrome.windows.update(existingTabs[0].windowId, { focused: true });
    }
  } else {
    // If no options tab exists, create a new one
    await chrome.tabs.create({ url: "options.html" });
  }
});

// Listen for when the extension is first installed or updated
chrome.runtime.onInstalled.addListener(async (details) => {
  console.log("Extension installed:", details.reason);
  await setupHeaderRules("localhost");
});

// Listen for messages from other parts of the extension
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  console.log("Received message:", message);

  switch (message.action) {
    case MESSAGE_ACTIONS.CHECK_OLLAMA:
      return handleCheckOllama(message, sendResponse);
    case MESSAGE_ACTIONS.CHECK_LLM:
      return handleCheckLlm(message, sendResponse);
    case MESSAGE_ACTIONS.GET_BOOKMARKS:
      return handleGetBookmarks(message, sendResponse);
    case MESSAGE_ACTIONS.CREATE_FOLDERS:
      return handleCreateFolders(message, sendResponse);
    case MESSAGE_ACTIONS.SORT_BOOKMARKS:
      return handleSortBookmarks(message, sendResponse);
    case MESSAGE_ACTIONS.PREPARE_SORT_BOOKMARKS:
      return handlePrepareSortBookmarks(message, sendResponse);
    default:
      console.warn("Unknown message action:", message.action);
      return false;
  }
});

// Listen for port connections and disconnections
chrome.runtime.onConnect.addListener((port) => {
  console.log("Port connected:", port.name);

  port.onDisconnect.addListener(() => {
    console.log("Port disconnected:", port.name);
    abortCurrentSorting(); // Abort any ongoing sorting when port disconnects
  });
});
