import { useState, useEffect } from "react";
import { ArrowUpDown, Sparkles, Save } from "lucide-react";
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
import { PrepareSortBookmarksResponse } from "@/chrome-scripts/types/responses";
import TypewriterText from "@/components/TypewriterText";
import { Progress } from "@/components/ui/progress";

export function SortBookmarksSection() {
  const [isSorting, setIsSorting] = useState(false);
  const [originalSortedBookmarks, setOriginalSortedBookmarks] = useState<
    BookmarkWithCategory[]
  >([]);
  const [sortedBookmarks, setSortedBookmarks] = useState<
    BookmarkWithCategory[]
  >([]);
  const [unsortedBookmarks, setUnsortedBookmarks] = useState<
    BookmarkWithCategory[]
  >([]);
  const { isOllamaOnline, llmModel, rootFolderId, rootFolderName } =
    useBookmarkContext();
  const [sortingProgress, setSortingProgress] = useState(0);

  useEffect(() => {
    chrome.runtime.sendMessage(
      { action: MESSAGE_ACTIONS.PREPARE_SORT_BOOKMARKS },
      (response: PrepareSortBookmarksResponse) => {
        if (response.success && response.unsortedBookmarks) {
          setUnsortedBookmarks(response.unsortedBookmarks || []);
        }
      }
    );
  }, []);

  useEffect(() => {
    const messageListener = (message: {
      type: string;
      bookmarksSortingInprogress?: BookmarkWithCategory[];
      progress?: number;
    }) => {
      if (
        message.type === "sortingInProgress" &&
        message.bookmarksSortingInprogress
      ) {
        console.log("Received sorting in progress message", message);
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
        if (message.progress) {
          setSortingProgress(message.progress);
        }
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
            "Bookmarks pre-sorted successfully, please review and save the results",
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

  const confirmSortBookmarks = () => {
    console.log("Confirming sort bookmarks", sortedBookmarks);
    chrome.runtime.sendMessage(
      {
        action: MESSAGE_ACTIONS.CONFIRM_SORT_BOOKMARKS,

        categorizedBookmarks: sortedBookmarks,
        rootFolderId,
      },
      (response) => {
        if (response.success) {
          toast.success("Bookmarks sorted successfully", {
            position: "bottom-left",
            action: {
              label: "OK",
              onClick: () => toast.dismiss(),
            },
          });
        }
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
    if (sortedBookmarks.length > 0 && originalSortedBookmarks.length > 0) {
      setSortedBookmarks(originalSortedBookmarks);
      toast.success("Categories reset to original suggestions");
    }
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
          <CardTitle className="text-xl">
            <div className="flex gap-2 items-center">
              <Sparkles />
              <TypewriterText className="text-xl font-bold">
                Sort Bookmarks
              </TypewriterText>
            </div>
          </CardTitle>
          <CardDescription>
            Currently set to use <span className="font-bold">Ollama</span> +{" "}
            <span className="font-bold">{llmModel}</span> sort your bookmarks
            into <span className="font-bold">{rootFolderName}</span> in your
            bookmark bar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center gap-4">
            <Button
              onClick={sortBookmarks}
              disabled={isButtonDisabled}
              title={disabledReason}
              size="xl"
              className="w-full sm:w-auto bg-blue-500 text-white  hover:bg-blue-600 hover:text-white min-w-[260px]"
            >
              <ArrowUpDown
                className={`mr-2 h-5 w-5 ${isSorting ? "animate-spin" : ""}`}
              />
              {sortedBookmarks.length > 0 ? "Resort" : "Start Sorting"}
            </Button>
            <Button
              onClick={confirmSortBookmarks}
              size="xl"
              className="w-full sm:w-auto min-w-[260px]"
              variant="destructive"
              disabled={isSorting || sortedBookmarks.length === 0}
              title={
                isSorting ? "Please wait while sorting is in progress" : ""
              }
            >
              <Save className="mr-2 h-5 w-5" />
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

      <Progress
        value={sortingProgress}
        className="w-full"
        indicatorClassName="bg-blue-500"
      />

      {/* Content area with muted background - only shown when there are bookmarks */}
      <div className="p-4 border rounded-lg bg-muted">
        <BookmarksList
          sortedBookmarks={
            sortedBookmarks.length > 0 ? sortedBookmarks : unsortedBookmarks
          }
          onCategoryChange={handleCategoryChange}
          onReset={handleReset}
        />
      </div>
    </div>
  );
}
