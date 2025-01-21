import { useState } from "react";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useBookmarkContext } from "@/contexts/bookmark";

export function SortBookmarksSection() {
  const [isSorting, setIsSorting] = useState(false);
  const { isOllamaOnline, llmModel, rootFolderId } = useBookmarkContext();

  const sortBookmarks = () => {
    setIsSorting(true);
    chrome.runtime.sendMessage(
      { action: "sortBookmarks", llmModel },
      (response) => {
        if (response.success) {
          toast("Bookmarks sorted successfully", {
            action: {
              label: "OK",
              onClick: () => console.log("Undo"),
            },
          });
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

  return (
    <div className="mb-8 p-4 border rounded-lg bg-muted flex flex-col gap-4 items-center">
      <div>
        <Button
          onClick={sortBookmarks}
          disabled={isSorting || !isOllamaOnline || !llmModel || !rootFolderId}
          className="w-full sm:w-auto"
        >
          <ArrowUpDown
            className={`mr-2 h-4 w-4 ${isSorting ? "animate-spin" : ""}`}
          />
          Sort Bookmarks
        </Button>
      </div>
    </div>
  );
}
