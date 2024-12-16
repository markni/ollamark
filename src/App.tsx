import { useState, useEffect } from "react";
import { FileTree } from "@/components/tree";
import { RefreshCw, FolderPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import "./App.css";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

function App() {
  const [bookmarks, setBookmarks] = useState<
    chrome.bookmarks.BookmarkTreeNode[]
  >([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isCreatingFolders, setIsCreatingFolders] = useState(false);
  const [openFolders, setOpenFolders] = useState<string[]>([]);

  const refreshBookmarks = () => {
    setIsRefreshing(true);
    chrome.runtime.sendMessage({ action: "getBookmarks" }, (response) => {
      if (response && response.bookmarkTree) {
        setBookmarks(response.bookmarkTree);
        console.log("Received bookmarks:", response.bookmarkTree);
      }
      setTimeout(() => {
        setIsRefreshing(false); // Reset the loading state after 500ms
      }, 500);
    });
  };

  const createFolders = () => {
    setIsCreatingFolders(true);
    chrome.runtime.sendMessage({ action: "createFolders" }, (response) => {
      if (response.success) {
        console.log("Folders created successfully");
        chrome.bookmarks.search({ title: "test" }, (results) => {
          const testFolder = results.find(
            (bookmark) => bookmark.parentId === "1"
          );
          if (testFolder) {
            chrome.bookmarks.getChildren(testFolder.id, () => {
              setOpenFolders([testFolder.id]);
            });
          }
        });
        toast("Folders created successfully", {
          description: "Sunday, December 03, 2023 at 9:00 AM",
          action: {
            label: "OK",
            onClick: () => console.log("Undo"),
          },
        });
        refreshBookmarks();
      } else {
        console.error("Failed to create folders:", response.error);
      }
      setTimeout(() => {
        setIsCreatingFolders(false);
      }, 500);
    });
  };

  useEffect(() => {
    refreshBookmarks();
  }, []);

  return (
    <>
      <div className="container mx-auto p-4">
        <section>
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

          <FileTree
            data={bookmarks[0]?.children ?? []}
            openFolders={openFolders}
          />
        </section>
        <Separator className="my-4" />

        <section>
          <div className="mb-8 p-4 border rounded-lg bg-muted">
            <Button
              onClick={createFolders}
              disabled={isCreatingFolders}
              className="w-full sm:w-auto"
            >
              <FolderPlus
                className={`mr-2 h-4 w-4 ${
                  isCreatingFolders ? "animate-spin" : ""
                }`}
              />
              Create Category Folders
            </Button>
            <p className="text-sm text-muted-foreground mt-2">
              Coming soon: allow you to customize the folder structure.
            </p>
          </div>
        </section>
      </div>
      <Toaster />
    </>
  );
}

export default App;
