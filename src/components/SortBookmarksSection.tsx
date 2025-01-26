import { useState, useEffect } from "react";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useBookmarkContext } from "@/contexts/bookmark";
import { SortBookmarksResponse } from "@/chrome-scripts/types/responses";
import { BookmarksList } from "./BookmarksList";

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
  const { isOllamaOnline, llmModel, rootFolderId } = useBookmarkContext();

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
      { action: "sortBookmarks", llmModel },
      (response: SortBookmarksResponse) => {
        if (response.success && response.categorizedBookmarks) {
          setOriginalSortedBookmarks(response.categorizedBookmarks || []);
          // setSortedBookmarks((prev) =>
          //   (response.categorizedBookmarks || []).map((newBm, index) => {
          //     const existing = prev[index];
          //     return existing?.category === newBm.category
          //       ? newBm
          //       : existing || newBm;
          //   })
          // );
          toast(
            "Bookmarks pre-sorted successfully, please review the results",
            {
              action: {
                label: "Reset Categories",
                onClick: () => setSortedBookmarks(originalSortedBookmarks),
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
    <div className="mb-8 p-4 border rounded-lg bg-muted flex flex-col gap-4">
      {sortedBookmarks.length > 0 ? (
        <>
          <BookmarksList
            sortedBookmarks={sortedBookmarks}
            onCategoryChange={handleCategoryChange}
            onReset={handleReset}
          />

          <div className="flex justify-center gap-4">
            <Button
              onClick={sortBookmarks}
              disabled={isButtonDisabled}
              title={disabledReason}
              className="w-full sm:w-auto"
            >
              <ArrowUpDown
                className={`mr-2 h-4 w-4 ${isSorting ? "animate-spin" : ""}`}
              />
              Resort Bookmarks
            </Button>
            <Button
              className="w-full sm:w-auto"
              variant="destructive"
              disabled={isSorting}
              title={
                isSorting ? "Please wait while sorting is in progress" : ""
              }
            >
              Confirm Categories
            </Button>
          </div>
        </>
      ) : (
        <div className="flex flex-col justify-center items-center gap-4">
          <Button
            onClick={sortBookmarks}
            disabled={isButtonDisabled}
            title={disabledReason}
            className="w-full sm:w-auto"
          >
            <ArrowUpDown
              className={`mr-2 h-4 w-4 ${isSorting ? "animate-spin" : ""}`}
            />
            Sort Bookmarks
          </Button>
          {isButtonDisabled && !isSorting && (
            <p>You must complete the 3 steps setup before sorting bookmarks</p>
          )}
        </div>
      )}
    </div>
  );
}
