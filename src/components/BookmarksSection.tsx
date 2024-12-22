import { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FileTree } from "@/components/tree";

export function BookmarksSection() {
  const [bookmarks, setBookmarks] = useState<
    chrome.bookmarks.BookmarkTreeNode[]
  >([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [openFolders, setOpenFolders] = useState<string[]>([]);

  const refreshBookmarks = () => {
    setIsRefreshing(true);
    chrome.runtime.sendMessage({ action: "getBookmarks" }, (response) => {
      if (response && response.bookmarkTree) {
        setBookmarks(response.bookmarkTree);
        console.log("Received bookmarks:", response.bookmarkTree);
      }
      setTimeout(() => {
        setIsRefreshing(false);
      }, 500);
    });
  };

  useEffect(() => {
    refreshBookmarks();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Bookmarks</h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={refreshBookmarks}
          title="Refresh bookmarks"
          disabled={isRefreshing}
        >
          <RefreshCw
            className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
          />
        </Button>
      </div>

      <FileTree data={bookmarks[0]?.children ?? []} openFolders={openFolders} />
    </div>
  );
}
