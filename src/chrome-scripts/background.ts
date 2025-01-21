/// <reference types="chrome"/>

import { handleCheckOllama } from "./handlers/checkOllama";
import { handleGetBookmarks } from "./handlers/getBookmarks";
import { handleCreateFolders } from "./handlers/createFolders";
import { handleCheckLlm } from "./handlers/checkLlm";
import { handleSortBookmarks } from "./handlers/sortBookmarks";
import { setupHeaderRules } from "./lib/setupHeaderRules";

// Run when extension starts up
setupHeaderRules("localhost").catch((error) => {
  console.error("Failed to setup header rules:", error);
});

chrome.action.onClicked.addListener(() => {
  console.log("Extension icon clicked");
  chrome.tabs.create({ url: "options.html" });
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
    case "checkOllama":
      return handleCheckOllama(message, sendResponse);
    case "checkLlm":
      return handleCheckLlm(message, sendResponse);
    case "getBookmarks":
      return handleGetBookmarks(message, sendResponse);
    case "createFolders":
      return handleCreateFolders(message, sendResponse);
    case "sortBookmarks":
      return handleSortBookmarks(message, sendResponse);
    default:
      console.warn("Unknown message action:", message.action);
      return false;
  }
});
