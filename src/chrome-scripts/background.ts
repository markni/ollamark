/// <reference types="chrome"/>

import { handleCheckOllama } from "./handlers/checkOllama";
import { handleGetBookmarks } from "./handlers/getBookmarks";
import { handleCreateFolders } from "./handlers/createFolders";

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

  switch (message.action) {
    case "checkOllama":
      return handleCheckOllama(message, sendResponse);
    case "getBookmarks":
      return handleGetBookmarks(message, sendResponse);
    case "createFolders":
      return handleCreateFolders(message, sendResponse);
    default:
      console.warn("Unknown message action:", message.action);
      return false;
  }
});
