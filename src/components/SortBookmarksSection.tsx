import { useState, useEffect } from "react";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useBookmarkContext } from "@/contexts/bookmark";
import { SortBookmarksResponse } from "@/chrome-scripts/types/responses";
import { BookmarksList } from "./BookmarksList";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MESSAGE_ACTIONS } from "@/constants";
type BookmarkWithCategory = chrome.bookmarks.BookmarkTreeNode & {
  category?: string;
};

export function SortBookmarksSection() {
  const [isSorting, setIsSorting] = useState(false);
  const [originalSortedBookmarks, setOriginalSortedBookmarks] = useState<
    BookmarkWithCategory[]
  >([]);
  const [sortedBookmarks, setSortedBookmarks] = useState<
    BookmarkWithCategory[]
  >([]);
  const { isOllamaOnline, llmModel, rootFolderId, rootFolderName } =
    useBookmarkContext();

  useEffect(() => {
    const messageListener = (message: {
      type: string;
      bookmarksSortingInprogress?: BookmarkWithCategory[];
    }) => {
      if (
        message.type === "sortingInProgress" &&
        message.bookmarksSortingInprogress
      ) {
        setSortedBookmarks((prevBookmarks) =>
          message.bookmarksSortingInprogress!.map((newBookmark, index) => {
            const existingBookmark = prevBookmarks[index];
            // If user has already set a category (via dropdown), keep it
            // Otherwise use the new category from the sorting process
            return {
              ...newBookmark,
              category: existingBookmark?.category || newBookmark.category,
            };
          })
        );
      }
    };

    chrome.runtime.onMessage.addListener(messageListener);

    return () => {
      chrome.runtime.onMessage.removeListener(messageListener);
    };
  }, []);

  const sortBookmarks = () => {
    setIsSorting(true);
    setSortedBookmarks([]);
    setOriginalSortedBookmarks([]);
    chrome.runtime.sendMessage(
      { action: MESSAGE_ACTIONS.SORT_BOOKMARKS, llmModel },
      (response: SortBookmarksResponse) => {
        if (response.success && response.categorizedBookmarks) {
          setOriginalSortedBookmarks(response.categorizedBookmarks || []);

          toast.success(
            "Bookmarks pre-sorted successfully, please review the results",
            {
              position: "bottom-left",
              action: {
                label: "OK",
                onClick: () => toast.dismiss(),
              },
            }
          );
        } else {
          console.error("Failed to sort bookmarks:", response.error);
          toast.error("Failed to sort bookmarks");
        }
        setTimeout(() => {
          setIsSorting(false);
        }, 500);
      }
    );
  };

  const handleCategoryChange = (bookmarkId: string, newCategory: string) => {
    setSortedBookmarks((bookmarks) =>
      bookmarks.map((bookmark) =>
        bookmark.id === bookmarkId
          ? { ...bookmark, category: newCategory }
          : bookmark
      )
    );
  };

  const handleReset = () => {
    setSortedBookmarks(originalSortedBookmarks);
    toast.success("Categories reset to original suggestions");
  };

  const getDisabledReason = () => {
    if (isSorting) return "Currently sorting bookmarks...";
    if (!isOllamaOnline) return "Ollama is not running";
    if (!llmModel) return "No LLM model selected";
    if (!rootFolderId) return "No root folder selected";
    return "";
  };

  const isButtonDisabled =
    isSorting || !isOllamaOnline || !llmModel || !rootFolderId;
  const disabledReason = getDisabledReason();

  return (
    <div className="mb-8 flex flex-col gap-4 ">
      {/* Primary action buttons */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Sort bookmarks</CardTitle>
          <CardDescription>
            Using {llmModel} sort your bookmarks into {rootFolderName}...{" "}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center gap-4">
            <Button
              onClick={sortBookmarks}
              disabled={isButtonDisabled}
              title={disabledReason}
              size="xl"
              className="w-full sm:w-auto bg-blue-500 text-white  hover:bg-blue-600 hover:text-white"
            >
              <ArrowUpDown
                className={`mr-2 h-4 w-4 ${isSorting ? "animate-spin" : ""}`}
              />
              {sortedBookmarks.length > 0
                ? "Resort Bookmarks"
                : "Sort Bookmarks"}
            </Button>
            <Button
              size="xl"
              className="w-full sm:w-auto"
              variant="destructive"
              disabled={isSorting || sortedBookmarks.length === 0}
              title={
                isSorting ? "Please wait while sorting is in progress" : ""
              }
            >
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Setup message - outside of muted box */}
      {isButtonDisabled && !isSorting && (
        <p className="text-center">
          You must complete the 3 steps setup before sorting bookmarks
        </p>
      )}

      {/* Content area with muted background - only shown when there are bookmarks */}
      {sortedBookmarks.length > 0 && (
        <div className="p-4 border rounded-lg bg-muted">
          <BookmarksList
            sortedBookmarks={sortedBookmarks}
            onCategoryChange={handleCategoryChange}
            onReset={handleReset}
          />
        </div>
      )}
    </div>
  );
}
