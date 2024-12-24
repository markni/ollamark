import { BookmarkResponse } from "../types/responses";

export const handleGetBookmarks = (
  _message: unknown,
  sendResponse: (response: BookmarkResponse) => void
) => {
  chrome.bookmarks.getTree((bookmarkTreeNodes) => {
    sendResponse({ bookmarkTree: bookmarkTreeNodes });
  });
  return true;
};
