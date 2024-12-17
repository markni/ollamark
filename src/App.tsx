import { useState, useEffect } from "react";
import { FileTree } from "@/components/tree";
import { RefreshCw, FolderPlus, ArrowUpDown, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import "./App.css";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { ComingSoonFolders } from "./components/ComingSoonFolders";

function App() {
  const [bookmarks, setBookmarks] = useState<
    chrome.bookmarks.BookmarkTreeNode[]
  >([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isCreatingFolders, setIsCreatingFolders] = useState(false);
  const [openFolders, setOpenFolders] = useState<string[]>([]);
  const [isSorting, setIsSorting] = useState(false);
  const [isOllamaOnline, setIsOllamaOnline] = useState(false);

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
        toast("All Folders created successfully", {
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

  const sortBookmarks = () => {
    setIsSorting(true);
    chrome.runtime.sendMessage({ action: "sortBookmarks" }, (response) => {
      if (response.success) {
        toast("Bookmarks sorted successfully", {
          action: {
            label: "OK",
            onClick: () => console.log("Undo"),
          },
        });
        refreshBookmarks();
      } else {
        console.error("Failed to sort bookmarks:", response.error);
        toast.error("Failed to sort bookmarks");
      }
      setTimeout(() => {
        setIsSorting(false);
      }, 500);
    });
  };

  const checkOllamaStatus = () => {
    chrome.runtime.sendMessage({ action: "checkOllama" }, (response) => {
      setIsOllamaOnline(response.success);
      if (!response.success) {
        console.log("Ollama is offline:", response.error);
      }
    });
  };

  useEffect(() => {
    refreshBookmarks();
    checkOllamaStatus();

    const interval = setInterval(checkOllamaStatus, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="container mx-auto p-4 flex flex-col gap-4">
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
          <div className="mb-8 p-4 border rounded-lg bg-muted flex flex-col gap-4 items-center">
            <div>
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
            </div>
            <ComingSoonFolders />
            <p className="text-sm text-muted-foreground mt-2">
              Coming soon: allow you to customize the categories.
            </p>
          </div>
        </section>

        <Separator className="my-4" />

        <section>
          <div className="mb-8 p-4 border rounded-lg bg-muted flex flex-col gap-4 items-center">
            <div>
              <Button
                onClick={sortBookmarks}
                disabled={isSorting || !isOllamaOnline}
                className="w-full sm:w-auto"
              >
                <ArrowUpDown
                  className={`mr-2 h-4 w-4 ${isSorting ? "animate-spin" : ""}`}
                />
                Sort Bookmarks
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <span>Ollama is {isOllamaOnline ? "online" : "offline"}</span>
              {isOllamaOnline ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <X className="h-4 w-4 text-red-500" />
              )}
            </div>

            <p className="text-sm text-muted-foreground mt-2">
              Sort your bookmarks into categories using llm.
            </p>
          </div>
        </section>
      </div>
      <Toaster />
    </>
  );
}

export default App;
